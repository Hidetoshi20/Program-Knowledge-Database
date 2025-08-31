# 下拉刷新与上拉加载

## 下拉刷新（Pull-to-Refresh）
- 原生支持：iOS/Android WebView 或某些浏览器内置；
- H5 实现：监听 `touchstart/move/end`，计算位移阈值与回弹动画；
- 阻止穿透：`overscroll-behavior: contain;` 避免滚动链；
- 与地址栏/系统手势冲突：将交互限定在内容容器上。

## 上拉加载（Infinite Scroll）
优先使用 `IntersectionObserver`：
```js
const io = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) loadMore();
});
io.observe(document.querySelector('#sentinel'));
```

回退方案：监听 `scroll` 并基于容器高度与 `scrollTop + clientHeight >= scrollHeight - threshold` 判断。

## 体验与可访问性
- 提供“回到顶部/加载更多”按钮作为替代；
- 显示骨架屏与明确的 Loading/完成/无更多状态；
- 保留滚动位置与焦点管理。

## 性能建议
- 列表虚拟化（react-window、vue-virtual-scroller）；
- 请求合并与取消（AbortController）；
- 分页与去抖动触发。

## 延伸阅读
- [性能优化](../performance/README.md)
- [浏览器基础](../foundations/browser.md)
