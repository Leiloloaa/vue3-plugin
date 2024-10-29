# plugin-lazy

A tool for lazy loading images 、background images and components in Vue 3.

## Usage

### Normal Usage

```js
// 使用方法
import pluginLazy from 'plugin-lazy'

createApp(App).use(pluginLazy).mount('#app')
```

### Directive Usage

针对特定图片(需特定条件挂载)，可以使用指令`v-webp`的方式进行转换。

```html
1. <img v-lazy="src" />
2. <div v-lazy.bg="src"></div>
3. <Lazy><Component></Component></Lazy>

also support transforming images to webp format.

1. <img v-lazy.webp="src" />
2. <div v-lazy.bg.webp="src"></div>
```

### Error Handling

标签 img 动图转换失败，就会自动回退到原图。

## 更新日志

### 1.0.0

- 发布第一个版本，支持`img`懒加载、背景图懒加载和组件懒加载

### 1.1.0

- 修改 readme