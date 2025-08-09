# Vue in Practice

## Vuex页面刷新数据丢失

https://juejin.cn/post/7049368117159395336

https://www.cnblogs.com/baoxinyu/p/16925890.html

### Vuex是什么，每个属性是干嘛的，如何使用

Vuex是什么？

Vuex是专门为Vuejs应用程序设计的**状态管理工具**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化

具体工作：vuex是一种状态管理机制，将全局组件的共享状态抽取出来为一个store，以一个单例模式存在，应用任何一个组件中都可以使用，vuex更改state的唯一途径是通过mutation，mutation需要commit触发, action实际触发是mutation，其中mutation处理同步任务，action处理异步任务。

Vuex每个属性是干嘛的？

![](https://www.notion.sovue.assets/EB5115B586566907B3B642BA58A4482A.png)

Vuex的属性包含以下6个：

1. state
    - state是存储的单一状态，是存储的基本数据。
2. Getters
    - getters是store的计算属性，对state的加工，是派生出来的数据。就像computed计算属性一样，getter返回的值会根据它的依赖被缓存起来，且只有当它的依赖值发生改变才会被重新计算。
3. Mutations
    - mutations提交更改数据，使用store.commit方法更改state存储的状态。（mutations同步函数）
4. Actions
    - actions像一个装饰器，提交mutation，而不是直接变更状态。（actions可以包含任何异步操作）
5. Module
    - Module是store分割的模块，每个模块拥有自己的state、getters、mutations、actions。
6. 辅助函数

Vuex提供了mapState、MapGetters、MapActions、mapMutations等辅助函数给开发在vm中处理store。

### Vuex实现原理

通过以下三个方面来阐述vuex的实现原理：

- store是怎么注册的?
- mutation，commit 是怎么实现的?
- 辅助函数是怎么实现的?
1. store是怎么注册的?
    
    我们看到Vuex在vue 的生命周期中的初始化钩子前插入一段 Vuex 初始化代码。给 Vue 的实例注入一个
    
    $store的属性，这也就是为什么我们在 Vue 的组件中可以通过this.$store.xxx, 访问到 Vuex 的各种数据和状态
    
    ```jsx
    export default function (Vue) {  // 获取当前 Vue 的版本  const version = Number(Vue.version.split('.')[0])  if (version >= 2) {    // 2.x 通过 hook 的方式注入    Vue.mixin({ beforeCreate: vuexInit })  } else {    // 兼容 1.x    // 使用自定义的 _init 方法并替换 Vue 对象原型的_init方法，实现注入    const _init = Vue.prototype._init    Vue.prototype._init = function (options = {}) {      options.init = options.init        ? [vuexInit].concat(options.init)        : vuexInit      _init.call(this, options)    }  }  /**   * Vuex init hook, injected into each instances init hooks list.   */  function vuexInit () {    const options = this.$options    // store 注入    if (options.store) {      this.$store = typeof options.store === 'function'        ? options.store()        : options.store    } else if (options.parent && options.parent.$store) {      // 子组件从其父组件引用 $store 属性      this.$store = options.parent.$store    }  }}
    ```
    
2. mutations，commit 是怎么实现的
    
    ```jsx
    function registerMutation (store, type, handler, local) {  // 获取 type(module.mutations 的 key) 对应的 mutations, 没有就创建一个空数组  const entry = store._mutations[type] || (store._mutations[type] = [])  // push 处理过的 mutation handler  entry.push(function wrappedMutationHandler (payload) {    // 调用用户定义的 hanler, 并传入 state 和 payload 参数    handler.call(store, local.state, payload)  })}
    ```
    
    registerMutation 是对 store 的 mutation 的初始化，它接受 4 个参数，store为当前 Store 实例，type为 mutation 的 key，handler 为 mutation 执行的回调函数，path 为当前模块的路径。
    
    mutation 的作用就是同步修改当前模块的 state ，函数首先通过 type 拿到对应的 mutation 对象数组， 然后把一个 mutation 的包装函数 push 到这个数组中，这个函数接收一个参数 payload，这个就是我们在定义 mutation 的时候接收的额外参数。这个函数执行的时候会调用 mutation 的回调函数，并通过 getNestedState(store.state, path) 方法得到当前模块的 state，和 playload 一起作为回调函数的参数。
    
    我们知道mutation是通过commit来触发的，这里我们也来看一下commit的定义
    
    ```jsx
    commit (_type, _payload, _options) {    // 解析参数    const {      type,      payload,      options    } = unifyObjectStyle(_type, _payload, _options)    // 根据 type 获取所有对应的处理过的 mutation 函数集合    const mutation = { type, payload }    const entry = this._mutations[type]    if (!entry) {      if (process.env.NODE_ENV !== 'production') {        console.error(`[vuex] unknown mutation type: ${type}`)      }      return    }    // 执行 mutation 函数    this._withCommit(() => {      entry.forEach(function commitIterator (handler) {        handler(payload)      })    })    // 执行所有的订阅者函数    this._subscribers.forEach(sub => sub(mutation, this.state))    if (      process.env.NODE_ENV !== 'production' &&      options && options.silent    ) {      console.warn(    `[vuex] mutation type: ${type}. Silent option has been removed. ` +        'Use the filter functionality in the vue-devtools'  )    }}
    ```
    
    commit 支持 3 个参数，type 表示 mutation 的类型，payload 表示额外的参数,根据 type 去查找对应的 mutation，如果找不到，则输出一条错误信息，否则遍历这个 type 对应的 mutation 对象数组，执行 handler(payload) 方法，这个方法就是之前定义的 wrappedMutationHandler(handler)，执行它就相当于执行了 registerMutation 注册的回调函数。
    
3. 辅助函数
    
    辅助函数的实现都差不太多，在这里了解一下mapState
    
    ```jsx
    export const mapGetters = normalizeNamespace((namespace, getters) => {  // 返回结果  const res = {}  // 遍历规范化参数后的对象  // getters 就是传递给 mapGetters 的 map 对象或者数组  normalizeMap(getters).forEach(({ key, val }) => {    val = namespace + val    res[key] = function mappedGetter () {      // 一般不会传入 namespace 参数      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {        return      }      // 如果 getter 不存在则报错      if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {        console.error(`[vuex] unknown getter: ${val}`)        return      }      // 返回 getter 值, store.getters 可见上文 resetStoreVM 的分析      return this.$store.getters[val]    }    // mark vuex getter for devtools    res[key].vuex = true  })  return res})
    ```
    
    mapState在调用了 normalizeMap 函数后，把传入的 states 转换成由 {key, val} 对象构成的数组，接着调用 forEach 方法遍历这个数组，构造一个新的对象，这个新对象每个元素都返回一个新的函数 mappedState，函数对 val 的类型判断，如果 val 是一个函数，则直接调用这个 val 函数，把当前 store 上的 state 和 getters 作为参数，返回值作为 mappedState 的返回值；否则直接把 this.$store.state[val]作为 mappedState 的返回值。为了更直观的理解，我们看下最终mapState的效果
    
    ```jsx
    computed: mapState({    name: state => state.name,})// 等同于computed: {    name: this.$store.state.name}
    ```
    

### mutation和action有什么区别？

**mutation**：更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于件： 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进 行状态更改的地方，并且它会接受 state 作为第一个参数

```jsx
const store = new Vuex.Store({    state: {        count: 1    },    mutations: {        increment(state) {            // 变更状态            state.count++        }    }})
```

不能直接调用一个 mutation handler。这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”要唤醒一个 mutation handler，你需要以相应的 type 调用 store.commit 方法：

```jsx
store.commit('increment')
```

**Action:** Action 类似于 mutation，不同在于：

1. Action 提交的是 mutation，而不是直接变更状态。
2. Action 可以包含任意异步操作。
    
    让我们来注册一个简单的 action：
    

```jsx
const store = new Vuex.Store({    state: {        count: 0    },    mutations: {        increment(state) {            state.count++        }    },    actions: {        increment(context) {            context.commit('increment')        }    }})
```

**扩展：**事实上在 vuex 里面 actions 只是一个架构性的概念，并不是必须的，说到底只是一个函数，你在里面想干嘛都可以，只要最后触发 mutation 就行。异步竞态怎么处理那是用户自己的事情。

vuex 真正限制你的只有 mutation 必须是同步的这一点（在 redux 里面就好像 reducer 必须同步返回下一个状态一样）。同步的意义在于这样每一个 mutation 执行完成后都可以对应到一个新的状态（和 reducer 一样），这样 devtools 就可以打个 snapshot 存下来，然后就可以随便 time-travel 了。如果你开着 devtool 调用一个异步的 action，你可以清楚地看到它所调用的 mutation 是何时被记录下来的，并且可以立刻查看它们对应的状态。

## vue生命周期中异步加载在mounted还是create里实现

最常用的是在 created 钩子函数中调用异步请求

一般来说，可以在，created，mounted中都可以发送数据请求，但是，大部分时候，会在created发送请求。 Created的使用场景：如果页面首次渲染的就来自后端数据。因为，此时data已经挂载到vue实例了。 在 created（如果希望首次选的数据来自于后端，就在此处发请求）（只发了异步请求，渲染是在后端响应之后才进行的）、beforeMount、mounted（在mounted中发请求会进行二次渲染） 这三个钩子函数中进行调用。 因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。但是**最常用的是在 created 钩子函数中调用异步请求** ，因为在 created 钩子函数中调用异步请求有两个优点： 第一点：能更快获取到服务端数据，减少页面 loading 时间； 第二点：放在 created 中有助于一致性，因为ssr 不支持 beforeMount 、mounted 钩子函数。

## vue首屏白屏如何解决？

1. 路由懒加载
2. vue-cli开启打包压缩和后台配合 gzip访问
3. 进行cdn加速
4. 开启vue服务渲染模式
5. 用webpack的externals属性把不需要打包的库文件分离出去，减少打包后文件的大小
6. 在生产环境中删除掉不必要的console.log

```jsx
plugins: [
    new webpack.optimize.UglifyJsPlugin({ //添加-删除console.log
        compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
        },
        sourceMap: true
    }),
]
```

7. 开启nginx的gzip ,在nginx.conf配置文件中配置

```jsx
http{
  //在 http中配置如下代码，
    gzip    on;
    gzip_disable    "msie6";
    gzip_vary    on;
    gzip_proxied    any;
    gzip_comp_level    8;
    #压缩级别
    gzip_buffers    16    8    k;
    #gzip_http_version    1.1;
    gzip_min_length    100;
    #不压缩临界值
    gzip_types    text / plain    application / javascript    application / x - javascript    text / css    application / xml    text / javascript    application / x - httpd - php    image / jpeg    image / gif    image / png;
}
```

8. 添加loading效果，给用户一种进度感受

## scss是什么？在vue.cli中的安装使用步骤是？有哪几大特性？

css的预编译。

使用步骤：

1. 先装css-loader、node-loader、sass-loader等加载器模块
2. 在build目录找到webpack.base.config.js，在那个extends属性中加一个拓展.scss
3. 在同一个文件，配置一个module属性
4. 然后在组件的style标签加上lang属性 ，例如：lang=”scss”

特性:

可以用变量，例如（$变量名称=值）； 可以用混合器，例如（） 可以嵌套

## delete与vue.delete区别?

delete会删除数组的值，但是它依然会在内存中占位置 而vue.delete会删除数组在内存中的占位

```jsx
let arr1 = [1, 2, 3]
let arr2 = [1, 2, 3]
delete arr1[1]
this.$delete(arr2, 2)
console.log(arr1)    //【1, empty, 3】
console.log(arr2)    //【1,2】
```

## ElementUI

### 修改ElementUI 样式的几种方式?

修改ElementUI 样式的方式有四种：

1. 新建全局样式表
    
    新建 global.css 文件，并在 main.js 中引入。 global.css 文件一般都放在 src->assets 静态资源文件夹下的 style 文件夹下，在 main.js 的引用写法如下：
    
    ```jsx
    import "./assets/style/global.css"
    ```
    
    在 global.css 文件中写的样式，无论在哪一个 vue 单页面都会覆盖 ElementUI 默认的样式。
    
2. 在当前-vue-单页面中添加一个新的style标签
    
    在当前的vue单页面的style标签后，添加一对新的style标签，新的style标签中不要添加scoped属性。在有写scoped的style标签中书写的样式不会覆盖 ElementUI 默认的样式。
    
3. 使用/deep/深度修改标签样式
    
    找到需要修改的 ElementUI 标签的类名，然后在类名前加上/deep/，可以强制修改默认样式。这种方式可以直接用到有scoped属性的 style 标签中。
    
    ```css
    // 修改级联选择框的默认宽度
    /deep/ .el-cascader {
      width: 100%;
    }
    ```
    
4. 通过内联样式 或者 绑定类样式覆盖默认样式
    
    通过内联样式 style ，绑定类样式的方式，可以在**某些标签**中可以直接覆盖默认样式，不是很通用。具体实例如下：
    

```html
<el-button :style="selfstyle">默认按钮</el-button>
<script>
    export default {
        data() {
            return {
                selfstyle: {
                    color: "white",
                    marginTop: "10px",
                    width: "100px",
                    backgroundColor: "cadetblue"
                }
            };
        }
    }
</script>
```

通过绑定修改样式方式修改：

```html
<el-button :class="[selfbutton]">默认按钮</el-button>
<script>
    export default {
        data() {
            return {
                selfbutton: "self-button"
            };
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .self-button {
        color: white;
        margin-top: 10px;
        width: 100px;
        background-Color: cadetblue;
    }
</style>
```

**扩展：**

第一种全局引入css文件的方式，适合于对elementUI整体的修改，比如整体配色的修改； 第二种添加一个style标签的形式，也能够实现修改默认样式的效果，但实际上因为是修改了全局的样式，因此 在不同的vue组件中修改同一个样式有可能会有冲突。 第三种方式通过 /deep/ 的方式可以很方便的在vue组件中修改默认样式，也不会于其他页面有冲突。 第四种方式局限性比较大，可以使用，但不推荐使用。

### element ui 有什么用?

**Element-UI**：是一套采用 Vue 2.0 作为基础框架实现的组件库，一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的组件库，提供了配套设计资源，帮助网站快速成型

**扩展：**

Element-UI特点：

一致性 Consistency

- 与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
- 在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。

反馈 Feedback

- 控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
- 页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。

效率 Efficiency

- 简化流程：设计简洁直观的操作流程；
- 清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
- 帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。

可控 Controllability

- 用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
- 结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
