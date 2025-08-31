# 用户体验优化（UX Optimization）

## 目标与原则
- 快速可见：优先首屏关键内容与可感知速度（FCP/LCP）。
- 清晰反馈：操作有响应，过程可预期，结果可确认。
- 一致与可学习：交互与视觉一致，减少认知负担。
- 可达性（a11y）：人人可用，键盘可达，语义清晰。

## 可感知性能（Perceived Performance）
- 骨架屏/占位符：减少“空白等待”，让布局稳定（避免 CLS）。
- 渐进式加载：先文案与骨干，再图像/非关键脚本。
- 优先级管理：`<link rel="preload">` 关键资源，延后非关键任务。
- 图像策略：LQIP/BlurHash 占位，`loading="lazy"` 惰加载。

## 输入与反馈
- 输入即时校验：本地规则先行，错误信息就近且具体。
- 按钮状态：禁用/加载中/成功/失败四态明确，避免重复提交。
- 进度反馈：>500ms 操作显示 spinner；>2s 显示进度与预估。
- 可撤销与恢复：危险操作提供撤销，失败给出可行动指引。

## 动画与过渡
- 以“意义”为先：强调层级与动线（进入/退出/焦点）。
- 性能友好：使用 transform/opacity，避免触发布局回流。
- 速度曲线：采用 ease-in-out，200–300ms 区间更自然。
- 无障碍：尊重“减少动态效果（prefers-reduced-motion）”。

## 信息架构与可读性
- 文案：短句+动宾结构；按钮用动词；错误信息可执行。
- 层级：每屏 1 个主要行动；视觉层级与 DOM 层级一致。
- 语义：使用语义元素（nav/main/section/button），利于可达。

## 移动端专项
- 触控尺寸：可点击区域 ≥ 44×44px；留出安全区域。
- 键盘与视口：input 类型合理化，避免视口跳动与遮挡。
- 滚动体验：禁用滚动链 `overscroll-behavior`，回弹与吸附自然。

## 度量与监控
- 指标：FCP/LCP/CLS/INP/TTI；业务自定义 DAU、转化、流失。
- 采集：Performance API、RUM，上报与抽样，异常聚合（Sentry）。

## 示例：骨架屏与“加载中”
```html
<div class="card is-loading">
  <div class="avatar"></div>
  <div class="lines">
    <div class="line"></div>
    <div class="line short"></div>
  </div>
  </div>
```
```css
.card.is-loading .avatar, .card.is-loading .line{background:linear-gradient(90deg,#eee,#f5f5f5 50%,#eee) 0 0/200% 100%;animation:shimmer 1.2s infinite}
.card .avatar{width:40px;height:40px;border-radius:50%}
.card .line{height:12px;margin:6px 0}
.card .line.short{width:60%}
@keyframes shimmer{to{background-position:-200% 0}}
```

## 延伸阅读
- ../performance/README.md
- ../foundations/browser.md
- ../visualization/README.md
