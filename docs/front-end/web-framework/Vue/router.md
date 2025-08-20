# Router

### 导航守卫

导航守卫用于在路由跳转的不同阶段进行拦截与处理。

全局前置：

```jsx
const router = new VueRouter({ ... })
router.beforeEach((to, from, next) => {
  // ...
})
```

每个守卫参数：`to`、`from`、`next`。`next` 的不同调用方式会影响导航流转。

全局解析守卫、后置钩子、路由独享守卫与组件内守卫请参考下文示例。

```jsx
router.afterEach((to, from) => {
  // 无 next
})

const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})

const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) { /* ... */ },
  beforeRouteUpdate (to, from, next) { /* ... */ },
  beforeRouteLeave (to, from, next) { /* ... */ }
}
```

### 登录鉴权示例（全局前置）

```jsx
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)){
    const hasToken = !!(sessionStorage.getItem('token') || localStorage.getItem('token'))
    if (!hasToken) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})
```

### 路由懒加载

```jsx
const Foo = () => import('./Foo.vue')
const router = new VueRouter({ routes: [{ path: '/foo', component: Foo }] })
```

### Hash 与 History

- Hash: 依赖 `hashchange`，不触发服务端请求。
- History: 依赖 `pushState/replaceState` 与 `popstate`，需服务端兜底指向 `index.html`。


