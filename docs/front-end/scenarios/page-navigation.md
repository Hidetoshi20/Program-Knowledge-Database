# 页面跳转的方式

## 常见方式
- `<a href>`：标准跳转，整页刷新，保留默认语义与可访问性。
- `location.href/assign/replace`：脚本式跳转；`replace` 不保留历史记录。
- `window.open(url, target)`：新窗口/标签页打开。
- Hash 路由：`location.hash = '#/path'`，无网络请求但会触发 hashchange。
- History 路由：`history.pushState/replaceState` + `popstate` 监听，配合服务端回退到同一路由入口。
- SPA 路由库：React Router、Vue Router（支持导航守卫、懒加载、参数生存期）。

## 导航守卫（以 Vue Router 为例）
```js
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthed()) return next('/login');
  next();
});
```

## 参数与状态
- 参数编码：`URLSearchParams` 与 `encodeURIComponent`。
- 浏览器返回行为：对表单/滚动位置用 `history.scrollRestoration` 与 `saveScrollPosition`（框架能力）。
- SEO：SSR/SSG 场景优先使用真实路径而非 hash。

## 延伸阅读
- [前端网络](../foundations/network.md)
- [React 路由与生态](../frameworks/react/README.md)
- [Vue Router](../frameworks/vue/router.md)
