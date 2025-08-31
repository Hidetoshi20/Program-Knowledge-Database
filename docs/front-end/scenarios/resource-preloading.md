# 页面资源预加载（Preload/Prefetch）

## 关键概念
- `preload`：声明“本页渲染关键”的资源，提升首屏；
- `prefetch`：声明“未来可能需要”的资源，空闲时下载；
- `preconnect`/`dns-prefetch`：提前建立网络上下文；
- `modulepreload`：为 ESM 依赖图预加载。

## 示例
```html
<!-- 网络预热 -->
<link rel="preconnect" href="https://cdn.example.com" crossorigin>
<link rel="dns-prefetch" href="//cdn.example.com">

<!-- 关键资源预加载 -->
<link rel="preload" href="/fonts/app.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/scripts/above-the-fold.js" as="script">

<!-- 未来路由的资源预取 -->
<link rel="prefetch" href="/chunk/settings.js" as="script">

<!-- ESM 依赖图 -->
<link rel="modulepreload" href="/main.js">
```

## 图片与数据
- 图片懒加载：`loading="lazy"`；提前小图占位（LQIP/BlurHash）；
- 数据预取：在路由切换前并行发起请求；在 SW 中缓存。

## 注意事项
- 滥用会挤占关键路径带宽；
- `prefetch` 受浏览器策略影响，非强制；
- 跨源需 `crossorigin` 与 CORS 正确配置。

## 延伸阅读
- [性能优化](../performance/README.md)
- [浏览器基础](../foundations/browser.md)
