import { getCurrentInstance } from 'vue'

type configType = {
  quality?: number
  suffix?: string[]
  excludesName?: string[]
  useCDN?: boolean
}
const isSupportWebp = (() => {
  try {
    return document.createElement('canvas').toDataURL('image/webp', 0.5).startsWith('data:image/webp')
  } catch {
    return false
  }
})()
const compress = isSupportWebp ? `?x-oss-process=image/format,webp` : ''
function getImageExtension(src: string) {
  // 使用正则表达式匹配文件后缀
  const match = src.match(/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i);
  return match ? match[0] : '';
}
function isImageFormatValid(src: string, suffix: string[], useCDN: boolean,) {
  return src && isSupportWebp && (suffix.includes(getImageExtension(src)) || (useCDN && src?.includes('//cdn'))) && !src.includes('?x-oss-process=image') && !src?.includes('webp');
}
function getQualityValue(value?: number): number {
  return !value ? 0 : Math.min(Math.max(Number(value), 1), 100);
}
export default {
  install(app: any, config: configType = { quality: 0, suffix: [], excludesName: [], useCDN: true }) {
    const { quality: configQuality, suffix = [], excludesName = [], useCDN = true } = config;
    const suffixArray = ['.png', ...suffix]
    const qualityValue = getQualityValue(configQuality);
    // 添加 webp 支持判断，防止不支持机型添加质量参数 to: 解决 ios 14.5 以下版本不支持 webp 导致图片无法显示
    const quality = qualityValue && isSupportWebp ? `/quality,Q_${qualityValue}` : '';
    const isAdd = (url: string) => {
      return !excludesName.some(item => url?.includes(String(item)));
    };
    app.mixin({
      created() {
        const modifyBackgroundImages = () => {
          Array.from(document.styleSheets).forEach((styleSheet) => {
            // 确保样式表是同源的
            if (styleSheet.href && !styleSheet.href.startsWith(window.location.origin)) {
              return; // 跳过跨域样式表
            }
            // === 添加 try catch 防止样式表访问失败  to：解决 sentry 报错
            try {
              const rules = styleSheet.rules || styleSheet.cssRules;
              if (!rules) return;

              Array.from(rules).forEach((rule: any) => {
                const { style, selectorText } = rule;
                // 跳过包含 webp 和有 content 的规则
                if (!style || !style.backgroundImage || style.backgroundImage?.includes('webp') || style.content?.includes('nowebp')) return;
                const bgUrl = style.backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
                const imgFormat = isImageFormatValid(bgUrl ? bgUrl[1] : '', suffixArray, useCDN);
                if (selectorText && imgFormat) {
                  const urlMatch = style.backgroundImage.match(/url\("?(.+?)"?\)/);
                  if (urlMatch?.[1] && isAdd(urlMatch[1])) {
                    style.backgroundImage = `url(${urlMatch[1]}${compress}${quality})`;
                  }
                }
              });
            } catch (error) {
              console.info('无法访问样式表规则:', error);
            }
          });
        };

        modifyBackgroundImages();
      },
      mounted() {
        const modifyImgSrc = (vnode: any) => {
          if (!vnode) return
          // 处理 img 标签
          const imgSrc = vnode.el?.src
          if (vnode.type === 'img' && imgSrc) {
            // eslint-disable-next-line no-prototype-builtins
            const hasWebpProp = vnode.props?.hasOwnProperty('nowebp')
            const imgFormat = isImageFormatValid(imgSrc, suffixArray, useCDN) && isSupportWebp && !hasWebpProp && !imgSrc?.includes('webp');
            if (imgFormat && isAdd(imgSrc)) {
              const _compress = compress + quality
              vnode.el.src += _compress
              const handleError = () => {
                vnode.el.src = imgSrc.replace(_compress, '')
                vnode.el.removeEventListener('error', handleError)
              }
              vnode.el.addEventListener('error', handleError)
            }
          }

          const { subTree } = vnode.component || {}
          if (subTree) {
            // 使用栈或队列来避免递归深度过大
            const queue = Array.isArray(subTree.children) ? subTree.children : [subTree]

            queue.forEach((child: any) => {
              if (child.type === 'img' || (child.children && Array.isArray(child.children))) {
                modifyImgSrc(child)
              }
            })
          }

          if (vnode.children && Array.isArray(vnode.children)) {
            vnode.children.forEach((child: any) => {
              if (child.type === 'img' || (child.children && Array.isArray(child.children))) {
                modifyImgSrc(child)
              }
            })
          }
        }

        // 获取当前组件实例并修改 vnode
        const instance = getCurrentInstance()
        instance && modifyImgSrc(instance.vnode)
      }
    })
    app.directive('webp', {
      mounted(el: any) {
        const _compress = `${compress}${quality}`;
        const handleError = () => {
          // 移除查询参数，恢复原始 src
          el.src = el.src.split('?')[0];
          el.removeEventListener('error', handleError);
        };
        el.addEventListener('error', handleError);
        if (el.tagName === 'IMG' && !/webp$/.test(el.src)) {
          // 仅在 src 中没有特定参数时添加压缩参数
          if (!el.src.includes('?x-oss-process=image')) {
            el.src += _compress;
          }
        }
      }
    })
  }
}
