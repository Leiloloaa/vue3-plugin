# plugin-to-webp

A tool for toting image files to webp format.

1. img to webp
2. div\span\伪元素 background-image to webp

## Usage

### Normal Usage

```js
// 使用方法
import pluginToWebp from 'plugin-to-webp'

// createApp(App).use(pluginToWebp).mount('#app')

// 或者添加配置项
createApp(App).use(pluginToWebp, {
    quality: 60, // 压缩质量，默认不加压缩后缀
    suffix: [], // 需要转换的后缀名，默认 ['png']
    excludesName: ['pc-bg.png','mobile-bg.png'], // 不转换的图片名称
    // useCDN: false, // 是否处理 cdn 图，默认 true
}).mount('#app')
```

默认情况下，该插件会自动将所有 `<img>` 标签的 `src` 值转换为 webp 格式和 div\span\伪元素的 `background-image` 值转换为 webp 格式。

### Directive Usage

针对特定图片(需特定条件挂载)，可以使用指令`v-webp`的方式进行转换。

```html
<img :src="`xxx`" v-if="showImg" v-webp />
```

### Error Handling

标签 img 动图转换失败，就会自动回退到原图。如果是 div、span、伪元素的背景图转换失败，则需手动添加在 class 里面添加 content：'nowebp' 属性。

```html
<!-- 也可以指定不转换 -->
<img :src="`xxx`" nowebp />

<!-- 这个类下面的背景图片和伪元素都不会转换 -->
.xxx { content: 'nowebp'; background-image: url('xxx'); }
```

## 更新日志

### 1.0.0

- 发布第一个版本，转换 img 标签的 src 值和 div\span\伪元素的 background-image 值。

### 1.0.1

- 修复了一些 bug，解决不需要转换问题。

### 1.0.2

- 支持自定义配置参数，可指定压缩质量、不转换的图片名称、是否处理 cdn 图。
- 新增指令 v-webp，可针对特定图片进行转换。
- 优化了代码结构，提升性能。

...

### 3.0.1

- 解决默认值问题。

...

### 3.0.3

- 优化低版本机型 styleSheet sentry 报错，加上 try catch。

### 3.0.4

- 解决 ios 14 以下版本 webp 格式图片不显示的问题。

### 3.0.5

- 修改 readme