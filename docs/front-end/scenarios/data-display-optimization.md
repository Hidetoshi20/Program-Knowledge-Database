# 数据展示优化

## 网络与加载
- 减少 HTTP 请求、合并与压缩、使用 CDN/HTTP2；
- SSR/SSG 提升首屏与 SEO；
- 缓存：`Cache-Control`、ETag、Service Worker 缓存策略。

## 渲染与交互
- 列表虚拟化与分块渲染（windowing/chunking）；
- 骨架屏与占位符，感知性能提升；
- 减少重排与重绘，避免强制同步布局。

## 媒体与图像
- 响应式图片 `srcset/sizes`、webp/avif、质量与尺寸控制；
- 懒加载 `loading=lazy` 与可见性触发；
- 尽量用 CSS/矢量替代位图。

## 代码与数据
- 按需加载与代码拆分；
- 请求合并、错误重试、超时/取消；
- 预取下一屏数据，乐观更新与占位策略。

## 度量指标
- FCP/LCP/CLS/TTI/INP；
- 通过 Performance API 与 RUM 上报监控。

## 延伸阅读
- [性能优化](../performance/README.md)
- [浏览器基础](../foundations/browser.md)
