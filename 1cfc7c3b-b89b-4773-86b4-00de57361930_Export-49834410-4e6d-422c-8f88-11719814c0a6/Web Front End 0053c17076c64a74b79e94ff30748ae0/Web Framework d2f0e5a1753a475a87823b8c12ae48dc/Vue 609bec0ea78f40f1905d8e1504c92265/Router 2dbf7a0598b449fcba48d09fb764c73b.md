# Router

### 导航守卫

**参考答案：**

导航守卫主要用来**通过跳转或取消的方式守卫导航**。

简单的说，导航守卫就是路由跳转过程中的一些钩子函数。路由跳转是一个大的过程，这个大的过程分为跳转前中后等等细小的过程，在每一个过程中都有一函数，这个函数能让你操作一些其他的事儿的时机，这就是导航守卫。

**解析：**

路由守卫的具体方法：

1. 全局前置守卫
    
    你可以使用 router.beforeEach 注册一个全局前置守卫：
    
    ```jsx
    const router = new VueRouter({ ... })router.beforeEach((to, from, next) => {  // ...})
    ```
    
    当一个导航开始时，全局前置守卫按照注册顺序调用。守卫是异步链式调用的，导航在最后的一层当中。
    
    ```jsx
    new Promise((resolve, reject) => {    resolve('第一个全局前置守卫')}.then(() => {    return '第二个全局前置守卫'}.then(() => {    ...}.then(() => {    console.log('导航终于开始了') // 导航在最后一层中})
    ```
    

每个守卫方法接收三个参数（往后的守卫都大同小异）：

1. to: Route: 即将要进入的目标 路由对象
2. from: Route: 当前导航正要离开的路由
3. next: Function: 一定要调用该方法将控制权交给下一个守卫，执行效果依赖 next 方法的参数。

next(): 进入下一个守卫。如果全部守卫执行完了。则导航的状态就是 confirmed (确认的)。

next(false): 中断当前的导航（把小明腿打断了）。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器 后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。

next(‘/’) 或者 next({ path: ‘/’ }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航（小 明被打断腿并且送回家了）。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: ‘home’ 之类的选项以及任何用在 router-link 的 to prop 或 router.push 中的选项。

next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递router.

onError() 注册过的回调。

注意：永远不要使用两次next，这会产生一些误会。

1. 全局解析守卫
    
    这和 router.beforeEach 类似，但他总是被放在最后一个执行。
    
2. 全局后置钩子
    
    导航已经确认了的，小明已经到了外婆家了，你打断他的腿他也是在外婆家了。
    
    ```jsx
    router.afterEach((to, from) => {    // 你并不能调用next  // ...})
    ```
    
3. 路由独享的守卫
    
    在路由内写的守卫
    
    ```jsx
    const router = new VueRouter({  routes: [    {      path: '/foo',      component: Foo,      beforeEnter: (to, from, next) => {        // ...      }    }  ]})
    ```
    
4. 组件内的守卫
    
    5.1 beforeRouteEnter
    
    5.2 beforeRouteUpdate (2.2 新增)
    
    5.3 beforeRouteLeave
    
    ```jsx
    const Foo = {  template: `...`,  beforeRouteEnter (to, from, next) {    // 路由被 confirm 前调用    // 组件还未渲染出来，不能获取组件实例 `this`  },  beforeRouteUpdate (to, from, next) {    // 在当前路由改变，但是该组件被复用时调用    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。    // 可以访问组件实例 `this`，一般用来数据获取。  },  beforeRouteLeave (to, from, next) {    // 导航离开该组件的对应路由时调用    // 可以访问组件实例 `this`  }}
    ```
    

**扩展：**

导航全过程

- 导航被触发。
- 在准备离开的组件里调用 beforeRouteLeave 守卫。
- 调用全局的 beforeEach 守卫。
- 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。（如果你的组件是重用的）
- 在路由配置里调用 beforeEnter。
- 解析即将抵达的组件。
- 在即将抵达的组件里调用 beforeRouteEnter。
- 调用全局的 beforeResolve 守卫 (2.5+)。
- 导航被确认。
- 调用全局的 afterEach 钩子。
- 触发 DOM 更新。
- 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

### 路由守卫进行判断登录

在vue项目中，切换路由时肯定会碰到需要登录的路由，其原理就是在切换路径之前进行判断，你不可能进入页面再去判断有无登录重新定向到login，那样的话会导致页面已经渲染以及它的各种请求已经发出。

1. 如需要登录的路由可在main.js中统一处理（全局前置守卫）
    
    我们可以在入口文件man.js里面进行配置，使用router.beforeEach方法，不懂得可以打印to，from的参数就ok，requireAuth可以随意换名的，只要man.js里面跟配置路由的routes里面的字段保持一致：
    
    ```jsx
    import router from './router'router.beforeEach((to, from, next) => {  if (to.matched.some(record => record.meta.requireAuth)){  // 判断该路由是否需要登录权限    if(!sessionStorage.getItem('token') && !localStorage.getItem('token')){      next({        path: '/login',        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由      })    }else{         next();    }  }else {    next();  }});new Vue({  el: '#app',  router,  render: h => h(App)})
    ```
    
    ```jsx
    export default new Router({    routes: [        {            path: '/',            name: 'home',            redirect: '/home'        },        {            path: '/home',            component: Home,            meta: {              title: '',              requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的           }        },        {            path:'/login',            name:'login',            component:Login        },        {            path:'/register',            name:'register',            component:Register        }    ]})
    ```
    
2. 全局后置守卫
    
    ```jsx
    router.afterEach((to, from) => {  // ...})
    ```
    
3. 单独路由独享守卫（与全局一致，可单独对某个路由进行配置）
    
    ```jsx
    const router = new VueRouter({  routes: [    {      path: '/foo',      component: Foo,      beforeEnter: (to, from, next) => {        // ...      }    }  ]})
    ```
    
4. 组件内部路由守卫（可写在与生命周期同级位置）
    
    ```jsx
    beforeRouteEnter (to, from, next) {    // 在渲染该组件的对应路由被 confirm 前调用    // 不！能！获取组件实例 `this`    // 因为当守卫执行前，组件实例还没被创建},beforeRouteUpdate (to, from, next) {    // 在当前路由改变，但是该组件被复用时调用    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。    // 可以访问组件实例 `this`},beforeRouteLeave (to, from, next) {    // 导航离开该组件的对应路由时调用    // 可以访问组件实例 `this`}
    ```
    

### vue-router 实现懒加载

**参考答案：**

懒加载：当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

实现：结合 Vue 的[异步组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html#%E5%BC%82%E6%AD%A5%E7%BB%84%E4%BB%B6)和 Webpack的[代码分割功能](https://doc.webpack-china.org/guides/code-splitting-async/#require-ensure-/)，可以实现路由组件的懒加载

1. 首先，可以将异步组件定义为返回一个 Promise 的工厂函数 (该函数返回的 Promise 应该 resolve 组件本身)：
    
    ```jsx
    const Foo = () => Promise.resolve({ /* 组件定义对象 */ })
    ```
    
2. 在 Webpack 2 中，我们可以使用[动态 import](https://github.com/tc39/proposal-dynamic-import)语法来定义代码分块点 (split point)：
    
    ```jsx
    import('./Foo.vue') // 返回 Promise
    ```
    
    结合这两者，这就是如何定义一个能够被 Webpack 自动代码分割的异步组件。
    
    ```jsx
    const Foo = () => import('./Foo.vue')
    ```
    
    在路由配置中什么都不需要改变，只需要像往常一样使用Foo：
    
    ```jsx
    const router = new VueRouter({  routes: [    { path: '/foo', component: Foo }  ]})
    ```
    

### js是如何监听HistoryRouter的变化的

通过浏览器的地址栏来改变切换页面，前端实现主要有两种方式：

1. 通过hash改变，利用window.onhashchange 监听。
2. **HistoryRouter：**通过history的改变，进行js操作加载页面，然而history并不像hash那样简单，因为history的改变，除了浏览器的几个前进后退（使用 history.back(), history.forward()和 history.go() 方法来完成在用户历史记录中向后和向前的跳转。）等操作会主动触发popstate 事件，pushState，replaceState 并不会触发popstate事件，要解决history监听的问题，方法是：
    
    首先完成一个订阅-发布模式，然后重写history.pushState, history.replaceState,并添加消息通知，这样一来只要history的无法实现监听函数就被我们加上了事件通知，只不过这里用的不是浏览器原生事件，而是通过我们创建的event-bus 来实现通知，然后触发事件订阅函数的执行。
    

具体操作如下：

1. 订阅-发布模式示例

```jsx
class Dep {                  // 订阅池    constructor(name) {        this.id = new Date() //这里简单的运用时间戳做订阅池的ID        this.subs = []       //该事件下被订阅对象的集合    }    defined() {              // 添加订阅者        Dep.watch.add(this);    }    notify() {              //通知订阅者有变化        this.subs.forEach((e, i) => {            if (typeof e.update === 'function') {                try {                    e.update.apply(e)  //触发订阅者更新函数                } catch (err) {                    console.warr(err)                }            }        })    }}Dep.watch = null;class Watch {    constructor(name, fn) {        this.name = name;       //订阅消息的名称        this.id = new Date();   //这里简单的运用时间戳做订阅者的ID        this.callBack = fn;     //订阅消息发送改变时->订阅者执行的回调函数    }    add(dep) {                  //将订阅者放入dep订阅池        dep.subs.push(this);    }    update() {                  //将订阅者更新方法        var cb = this.callBack; //赋值为了不改变函数内调用的this        cb(this.name);    }}
```

1. 重写history方法，并添加window.addHistoryListener事件机制。

```jsx
var addHistoryMethod = (function () {    var historyDep = new Dep();    return function (name) {        if (name === 'historychange') {            return function (name, fn) {                var event = new Watch(name, fn)                Dep.watch = event;                historyDep.defined();                Dep.watch = null;       //置空供下一个订阅者使用            }        } else if (name === 'pushState' || name === 'replaceState') {            var method = history[name];            return function () {                method.apply(history, arguments);                historyDep.notify();            }        }    }}())window.addHistoryListener = addHistoryMethod('historychange');history.pushState = addHistoryMethod('pushState');history.replaceState = addHistoryMethod('replaceState');
```

### HashRouter 和 HistoryRouter的区别和原理

**vue-router**是Vue官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。vue-router默认 hash 模式，还有一种是history模式。

原理：

1. hash路由：hash模式的工作原理是hashchange事件，可以在window监听hash的变化。我们在url后面随便添加一个#xx触发这个事件。vue-router默认的是hash模式—使用URL的hash来模拟一个完整的URL,于是当URL改变的时候,页面不会重新加载,也就是单页应用了,当#后面的hash发生变化,不会导致浏览器向服务器发出请求,浏览器不发出请求就不会刷新页面,并且会触发hasChange这个事件,通过监听hash值的变化来实现更新页面部分内容的操作

对于hash模式会创建hashHistory对象,在访问不同的路由的时候,会发生两件事: HashHistory.push()将新的路由添加到浏览器访问的历史的栈顶,和HasHistory.replace()替换到当前栈顶的路由

1. history路由：
    
    主要使用HTML5的pushState()和replaceState()这两个api结合window.popstate事件（监听浏览器前进后退）来实现的,pushState() 可以改变url地址且不会发送请求,replaceState()可以读取历史记录栈,还可以对浏览器记录进行修改
    

区别：

1. hash模式较丑，history模式较优雅
2. pushState设置的新URL可以是与当前URL同源的任意URL；而hash只可修改#后面的部分，故只可设置与当前同文档的URL
3. pushState设置的新URL可以与当前URL一模一样，这样也会把记录添加到栈中；而hash设置的新值必须与原来不一样才会触发记录添加到栈中
4. pushState通过stateObject可以添加任意类型的数据到记录中；而hash只可添加短字符串
5. pushState可额外设置title属性供后续使用
6. hash兼容IE8以上，history兼容IE10以上
7. history模式需要后端配合将所有访问都指向index.html，否则用户刷新页面，会导致404错误

使用方法:

```html
<script>    // hash路由原理***************************    // 监听hashchange方法    window.addEventListener('hashchange', () => {        div.innerHTML = location.hash.slice(1)    })    // history路由原理************************    // 利用html5的history的pushState方法结合window.popstate事件（监听浏览器前进后退）    function routerChange(pathname) {        history.pushState(null, null, pathname)        div.innerHTML = location.pathname    }    window.addEventListener('popstate', () => {        div.innerHTML = location.pathname    })</script>
```

### Vue router 原理, 哪个模式不会请求服务器

Vue router 的两种方法，hash模式不会请求服务器

**解析：**

1. url的hash，就是通常所说的锚点#，javascript通过hashChange事件来监听url的变化，IE7以下需要轮询。比如这个 URL：http://www.abc.com/#/hello，hash 的值为#/hello。它的特点在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全没有影响，因此**改变 hash 不会重新加载页面**。
    1. HTML5的History模式，它使url看起来像普通网站那样，以“/”分割，没有#，单页面并没有跳转。不过使用这种模式需要服务端支持，服务端在接收到所有请求后，都只想同一个html文件，不然会出现404。因此单页面应用只有一个html，整个网站的内容都在这一个html里，通过js来处理。

### 路由跳转和location.href的区别？

使用location.href=’/url’来跳转，简单方便，但是刷新了页面； 使用路由方式跳转，无刷新页面，静态跳转；