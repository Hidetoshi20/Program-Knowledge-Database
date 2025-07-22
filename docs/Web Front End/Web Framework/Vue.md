# Vue

## 数据绑定

### v-model 作用

**参考答案：**

v-model本质上不过是语法糖，可以用 v-model 指令在**表单**及**元素**上创建双向数据绑定。

1. 它会根据控件类型自动选取正确的方法来更新元素
2. 它负责监听用户的输入事件以更新数据，并对一些极端场景进行一些特殊处理
3. v-model会忽略所有表单元素的value、checked、selected特性的初始值,而总是将 Vue 实例的数据作为数据来源，因此我们应该通过 JavaScript 在组件的data选项中声明初始值

**扩展：**

v-model在内部为不同的输入元素使用不同的属性并抛出不同的事件：

1. text 和 textarea 元素使用value属性和input事件；
2. checkbox 和 radio 使用checked属性和change事件；
3. select 字段将value作为 prop 并将change作为事件。

### v-model 实现原理

**参考答案：**

v-model只不过是一个语法糖而已,真正的实现靠的还是

1. v-bind:绑定响应式数据
2. 触发oninput 事件并传递数据

```
<input v-model="sth"/>
<!-- 等同于-->
<input :value="sth" @input="sth = $event.target.value"/>
<!--自html5开始,input每次输入都会触发oninput事件，所以输入时input的内容会绑定到sth中，于是sth的值就被改变-->
<!--$event 指代当前触发的事件对象;-->
<!--$event.target 指代当前触发的事件对象的dom;-->
<!--$event.target.value 就是当前dom的value值;-->
<!--在@input方法中，value => sth;-->
<!--在:value中,sth => value;-->
```

### Vue2.0 双向绑定的缺陷？

**参考答案：**

Vue2.0的数据响应是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty () 来劫持各个属性的setter、getter，但是它并不算是实现数据的响应式的完美方案，某些情况下需要对其进行修补或者hack这也是它的缺陷，主要表现在两个方面：

1. vue 实例创建后，无法检测到对象属性的新增或删除，只能追踪到数据是否被修改
2. 不能监听数组的变化
3. vue 实例创建后，无法检测到对象属性的新增或删除，只能追踪到数据是否被修改(Object.defineProperty只能劫持对象的属性)。
    
    当创建一个Vue实例时，将遍历所有DOM对象，并为每个数据属性添加了get和set。get和set 允许Vue观察数据的更改并触发更新。但是，如果你在Vue实例化后添加（或删除）一个属性，这个属性不会被vue处理，改变get和set。
    
    解决方案：
    
    ```jsx
    Vue.set(obj, propertName/index, value)// 响应式对象的子对象新增属性，可以给子响应式对象重新赋值data.location = {    x: 100,    y: 100}data.location = {...data, z: 100}
    ```
    
4. 不能监听数组的变化
    
    vue在实现数组的响应式时，它使用了一些hack，把无法监听数组的情况通过重写数组的部分方法来实现响应式，这也只限制在数组的push/pop/shift/unshift/splice/sort/reverse七个方法，其他数组方法及数组的使用则无法检测到，例如如下两种使用方式
    
    ```jsx
    vm.items[index] = newValue;vm.items.length
    ```
    
    vue实现数组响应式的方法
    
    通过重写数组的Array.prototype对应的方法，具体来说就是重新指定要操作数组的prototype，并重新该prototype中对应上面的7个数组方法，通过下面代码简单了解下实现原理：
    
    ```jsx
    const methods = ['pop','shift','unshift','sort','reverse','splice', 'push'];// 复制Array.prototype，并将其prototype指向Array.prototypelet proto = Object.create(Array.prototype);methods.forEach(method => {    proto[method] = function () { // 重写proto中的数组方法        Array.prototype[method].call(this, ...arguments);        viewRender() // 视图更新        function observe(obj) {            if (Array.isArray(obj)) { // 数组实现响应式                obj.__proto__ = proto; // 改变传入数组的prototype                return;            }            if (typeof obj === 'object') {                ... // 对象的响应式实现            }        }    }})
    ```
    

### Vue3.0 实现数据双向绑定的方法

`vue` 采用的是数据劫持结合发布和观察者模式的方式，来劫持各个属性的setter、getter，（`vue2` 使用的是`Object.defineProperty()`，`vue3`使用的是`Proxy`实现）之后每次通过点语法获取属性都会执行这里的getter函数，在这个函数中我们会把调用此属性的依赖收集到一个集合中 ；而在修改属性时，会触发这里定义的setter函数，在次函数中会去通知集合中的依赖更新，做到数据变更驱动视图变更。

**Proxy**是 ES6 中新增的一个特性，翻译过来意思是“代理”，用在这里表示由它来“代理”某些操作。 Proxy 让我们能够以简洁易懂的方式控制外部对对象的访问。其功能非常类似于设计模式中的代理模式。

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

使用 Proxy 的核心优点是可以交由它来处理一些非核心逻辑（如：读取或设置对象的某些属性前记录日志；设置对象的某些属性值前，需要验证；某些属性的访问控制等）。 从而可以让对象只需关注于核心逻辑，达到关注点分离，降低对象复杂度等目的。

使用proxy实现，双向数据绑定，相比2.0的Object.defineProperty ()优势：

1. 可以劫持整个对象，并返回一个新对象
2. 有13种劫持操作

## Vuex

### vuex页面刷新数据丢失

https://juejin.cn/post/7049368117159395336

https://www.cnblogs.com/baoxinyu/p/16925890.html ### Vuex是什么，每个属性是干嘛的，如何使用

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

## 通信

### 组件通信的方式

**参考答案：**

组件通信的方式的方式有以下8种方法：

1. `props`和`$emit`
    
    这是最最常用的父子组件通信方式，父组件向子组件传递数据是通过prop传递的，子组件传递数据给父组件是通过$emit触发事件来做到的
    
2. `attrs` `listeners`
    
    第一种方式处理父子组件之间的数据传输有一个问题：如果多层嵌套，父组件A下面有子组件B，组件B下面有组件C,这时如果组件A想传递数据给组件C怎么办呢?
    
    如果采用第一种方法，我们必须让组件A通过prop传递消息给组件B，组件B在通过prop传递消息给组件C;要是组件A和组件C之间有更多的组件，那采用这种方式就很复杂了。从Vue 2.4开始，提供了`attrs` `listeners`来解决这个问题，能够让组件A之间传递消息给组件C。
    
3. v-model
    
    父组件通过v-model传递值给子组件时，会自动传递一个value的prop属性，在子组件中通过this.$emit(‘input’,val)自动修改v-model绑定的值
    
4. provide和inject
    
    父组件中通过provider来提供变量，然后在子组件中通过inject来注入变量。不论子组件有多深，只要调用了inject那么就可以注入provider中的数据。而不是局限于只能从当前父组件的prop属性来获取数据，只要在父组件的生命周期内，子组件都可以调用。
    
5. 中央事件总线
    
    上面方式都是处理的父子组件之间的数据传递，那如果两个组件不是父子关系呢?也就是兄弟组件如何通信?
    
    这种情况下可以使用中央事件总线的方式。新建一个Vue事件bus对象，然后通过bus.$emit触发事件 bus.$on监听触发的事件。
    
    ![](https://www.notion.sovue.assets/500809B9BD071EA8067678D9EC046261.png)
    
6. parent和children
7. boradcast和dispatch
    
    vue1.0中提供了这种方式，但vue2.0中没有，但很多开源软件都自己封装了这种方式，比如min ui、element ui和iview等。 比如如下代码，一般都作为一个mixins去使用, broadcast是向特定的父组件，触发事件，dispatch是向特定的子组件触发事件，本质上这种方式还是on和on和emit的封装，但在一些基础组件中却很实用
    
8. vuex处理组件之间的数据交互
    
    如果业务逻辑复杂，很多组件之间需要同时处理一些公共的数据，这个时候才有上面这一些方法可能不利于项目的维护，vuex的做法就是将这一些公共的数据抽离出来，然后其他组件就可以对这个公共数据进行读写操作，这样达到了解耦的目的
    

### vue组件间传值， attrs和listeners 了解过吗？

**参考答案：**

`attrs` `listeners`的作用：解决多层嵌套情况下，父组件A下面有子组件B，组件B下面有组件C，组件A传递数据给组件B的问题，这个方法是在Vue 2.4提出的。

`attrs` `listeners`解决问题的过程：

C组件

```jsx
Vue.component('C', {    template: `     <div>     <input type="text" v-model="$attrs.messageC" @input="passCData($attrs.messageC)">     </div>     `,    methods: {        passCData(val) {            //触发父组件A中的事件            this.$emit('getCData', val)        }    }})
```

B组件

```jsx
Vue.component('B', {    data() {        return {            myMessage: this.message        }    },    template: ` <div> <input type="text" v-model="myMessage" @input="passData(myMessage)"> <C v-bind="$attrs" v-on="$listeners"></C> </div> `,    //得到父组件传递过来的数据    props: ['message'],    methods: {        passData(val) {            //触发父组件中的事件            this.$emit('getChildData', val)        }    }})
```

A组件

```jsx
Vue.component('A', {    template: ` <div> <p>this is parent compoent!</p> <B :messageC="messageC" :message="message" v-on:getCData="getCData" v-on:getChildData="getChildData(message)"> </B> </div> `,    data() {        return {            message: 'Hello',            messageC: 'Hello c'        }    },    methods: {        getChildData(val) {            console.log('这是来自B组件的数据')        },        //执行C子组件触发的事件        getCData(val) {            console.log("这是来自C组件的数据：" + val)        }    }})var app = new Vue({    el: '#app',    template: ` <div> <A></A> </div> `})
```

**解析：**

- C组件中能直接触发getCData的原因在于 B组件调用C组件时 使用 v-on 绑定了$listeners 属性
- 通过v-bind 绑定$attrs属性，C组件可以直接获取到A组件中传递下来的props(除了B组件中props声明的)

![](https://www.notion.sovue.assets/F98E288D764804F2354ED35EC26D637C.jpeg)

img

### 组件传值，事件总线是怎么用的

**参考答案：**

**中央事件总线**主要用来解决兄弟组件通信的问题。

实现方式：新建一个Vue事件bus对象，然后通过bus.$emit触发事件 bus.$on监听触发的事件。

```html
Vue.component('brother1',{data(){return {myMessage:'Hello brother1'}},template:`<div>    <p>this is brother1 compoent!</p>    <input type="text" v-model="myMessage" @input="passData(myMessage)"></div>`,methods:{passData(val){//触发全局事件globalEventbus.$emit('globalEvent',val)}}})Vue.component('brother2',{template:`<div>    <p>this is brother2 compoent!</p>    <p>brother1传递过来的数据：{{brothermessage}}</p></div>`,data(){return {myMessage:'Hello brother2',brothermessage:''}},mounted(){//绑定全局事件globalEventbus.$on('globalEvent',(val)=>{this.brothermessage=val;})}})//中央事件总线var bus=new Vue();var app=new Vue({el:'#app',template:`<div>    <brother1></brother1>    <brother2></brother2></div>`})
```

![](https://www.notion.sovue.assets/B30491C32F761B02007519727B8B2DF9.png)

img

## 生命周期

### vue生命周期中异步加载在mounted还是create里实现

最常用的是在 created 钩子函数中调用异步请求

一般来说，可以在，created，mounted中都可以发送数据请求，但是，大部分时候，会在created发送请求。 Created的使用场景：如果页面首次渲染的就来自后端数据。因为，此时data已经挂载到vue实例了。 在 created（如果希望首次选的数据来自于后端，就在此处发请求）（只发了异步请求，渲染是在后端响应之后才进行的）、beforeMount、mounted（在mounted中发请求会进行二次渲染） 这三个钩子函数中进行调用。 因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。但是**最常用的是在 created 钩子函数中调用异步请求** ，因为在 created 钩子函数中调用异步请求有两个优点： 第一点：能更快获取到服务端数据，减少页面 loading 时间； 第二点：放在 created 中有助于一致性，因为ssr 不支持 beforeMount 、mounted 钩子函数。

### vue钩子函数(重点问了keep-alive) TODO

**参考答案：**

![](https://www.notion.sovue.assets/F5DFA24F5FDFC338D5D73739BF09C491.png)

Vue生命周期经历哪些阶段：

1. 总体来说：初始化、运行中、销毁
2. 详细来说：开始创建、初始化数据、编译模板、挂载Dom、渲染→更新→渲染、销毁等一系列过程

生命周期经历的阶段和钩子函数:

1. 实例化vue(组件)对象：new Vue()
2. 初始化事件和生命周期 init events 和 init cycle
3. beforeCreate函数：
    
    在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。 即此时vue（组件）对象被创建了，但是vue对象的属性还没有绑定，如data属性，computed属性还没有绑定，即没有值。 此时还没有数据和真实DOM。 即：属性还没有赋值，也没有动态创建template属性对应的HTML元素（二阶段的createUI函数还没有执行）
    
4. 挂载数据（属性赋值）
    
    包括 属性和computed的运算
    
5. Created函数：
    
    vue对象的属性有值了，但是DOM还没有生成，$el属性还不存在。
    
    此时有数据了，但是还没有真实的DOM
    
    即：data，computed都执行了。属性已经赋值，但没有动态创建template属性对应的HTML元素，所以，此时如果更改数据不会触发updated函数
    
    如果：数据的初始值就来自于后端，可以发送ajax，或者fetch请求获取数据，但是，此时不会触发updated函数
    
    1. 检查

6.1 检查是否有el属性 检查vue配置，即new Vue{}里面的el项是否存在，有就继续检查template项。没有则等到手动绑定调用 vm.

[](https://www.notion.sovue.assets/equation)

el的绑定。

6.2 检查是否有template属性

检查配置中的template项，如果没有template进行填充被绑定区域，则被绑定区域的el对outerHTML（即 整个#app DOM对象，包括

和

标签）都作为被填充对象替换掉填充区域。即： 如果vue对象中有 template属性，那么，template后面的HTML会替换$el对应的内容。如果有render属 性，那么render就会替换template。 即：优先关系时： render > template > el

1. beforeMount函数：
    
    模板编译(template)、数据挂载(把数据显示在模板里)之前执行的钩子函数
    
    此时 this.$el有值，但是数据还没有挂载到页面上。即此时页面中的{{}}里的变量还没有被数据替换
    
2. 模板编译：用vue对象的数据（属性）替换模板中的内容
3. Mounted函数：
    
    模板编译完成，数据挂载完毕
    
    即：此时已经把数据挂载到了页面上，所以，页面上能够看到正确的数据了。
    
    一般来说，我们在此处发送异步请求（ajax，fetch，axios等），获取服务器上的数据，显示在DOM里。
    
4. beforeUpdate函数：
    
    组件更新之前执行的函数，只有数据更新后，才能调用（触发）beforeUpdate，注意：此数据一定是在模板上出现的数据，否则，不会，也没有必要触发组件更新（因为数据不出现在模板里，就没有必要再次渲染）数据更新了，但是，vue（组件）对象对应的dom中的内部（innerHTML）没有变，所以叫作组件更新前
    
5. updated函数：
    
    组件更新之后执行的函数，vue（组件）对象对应的dom中的内部（innerHTML）改变了，所以，叫作组件更新之后
    
6. activated函数：keep-alive组件激活时调用
7. activated函数：keep-alive组件停用时调用
8. beforeDestroy：vue（组件）对象销毁之前
9. destroyed：vue组件销毁后

keep-alive

包裹动态组件时，会缓存不活动的组件实例,主要用于保留组件状态或避免重新渲染。

**解析：** 比如有一个列表和一个详情，那么用户就会经常执行打开详情=>返回列表=> 打开详情…这样的话列表和详情都是一个频率很高的页面，那么就可以对列表组件使用 进行缓存，这样用户每次返回列表的时候，都能从缓存中快速渲染，而不是重新渲染

## Other

### 虚拟DOM

### data 是函数

### vue keep-alive

[Vue源码解析，keep-alive是如何实现缓存的？ - 掘金](https://juejin.cn/post/6862206197877964807)

**keep-alive**：keep-alive可以实现组件缓存，是Vue.js的一个内置组件。

作用：

1. 它能够把不活动的组件实例保存在内存中，而不是直接将其销毁
2. 它是一个抽象组件，不会被渲染到真实DOM中，也不会出现在父组件链中

使用方式：

1. 常用的两个属性include/exclude，允许组件有条件的进行缓存。
2. 两个生命周期activated/deactivated，用来得知当前组件是否处于活跃状态。
3. keep-alive的中还运用了LRU(Least Recently Used)算法。

原理：Vue 的缓存机制并不是直接存储 DOM 结构，而是将 DOM 节点抽象成了一个个 VNode节点，所以，keep-alive的缓存也是基于VNode节点的而不是直接存储DOM结构。

其实就是将需要缓存的VNode节点保存在this.cache中／在render时,如果VNode的name符合在缓存条件（可以用include以及exclude控制），则会从this.cache中取出之前缓存的VNode实例进行渲染。

### 既然函数是引用类型，为什么 vue 的 data 还是可以用函数

JavaScript只有函数构成作用域(注意理解作用域，**只有函数{}构成作用域**,对象的{}以及if(){}都不构成作用域),data是一个函数时，每个组件实例都有自己的作用域，每个实例相互独立，不会相互影响。

### $nextTick

作用：是为了可以获取更新后的DOM 。

由于Vue DOM更新是异步执行的，即修改数据时，视图不会立即更新，而是会监听数据变化，并缓存在同一事件循环中，等同一数据循环中的所有数据变化完成之后，再统一进行视图更新。为了确保得到更新后的DOM，所以设置了Vue.nextTick()，就是在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM。

原理：

在下次 DOM 更新循环结束之后执行延迟回调。nextTick主要使用了宏任务和微任务。根据执行环境分别尝试采用

- Promise
- MutationObserver
- setImmediate
- 如果以上都不行则采用setTimeout

定义了一个异步方法，多次调用nextTick会将方法存入队列中，通过这个异步方法清空当前队列。

### vue的特性

- 表单操作
- 自定义指令
- 计算属性
- 过滤器
- 侦听器
- 生命周期

### v-if v-show区别

v-show和v-if都是用来显示隐藏元素，v-if还有一个v-else配合使用，两者达到的效果都一样，但是v-if更消耗性能的，因为v-if在显示隐藏过程中有DOM的添加和删除，v-show就简单多了，只是操作css。

v-show

v-show不管条件是真还是假，第一次渲染的时候都会编译出来，也就是标签都会添加到DOM中。之后切换的时候，通过display: none;样式来显示隐藏元素。可以说只是改变css的样式，几乎不会影响什么性能。

v-if

在首次渲染的时候，如果条件为假，什么也不操作，页面当作没有这些元素。当条件为真的时候，开始局部编译，动态的向DOM元素里面添加元素。当条件从真变为假的时候，开始局部编译，卸载这些元素，也就是删除。

### v-for 为什么加 key

vue中列表循环需加:key=“唯一标识” 唯一标识且最好是静态的，因为vue组件高度复用增加Key可以标识组件的唯一性，为了更好地区别各个组件 key的作用主要是为了高效的更新虚拟DOM

**解析：**

vue和react的虚拟DOM的Diff算法大致相同，其核心是基于两个简单的假设 首先讲一下diff算法的处理方法，对操作前后的dom树同一层的节点进行对比，一层一层对比，

![](https://www.notion.sovue.assets/448BD33DD57542E1E6A5B03957CC7034.png)

img

当某一层有很多相同的节点时，也就是列表节点时，Diff算法的更新过程默认情况下也是遵循以上原则。

比如一下这个情况：

![](https://www.notion.sovue.assets/EAA1B46F9F910D663C45A96D03B305C4.png)

img

可以在B和C之间加一个F，Diff算法默认执行起来是这样的：

![](https://www.notion.sovue.assets/CE0C377B5746FC3BE8D5C8466A40AA87.png)

img

即把C更新成F，D更新成C，E更新成D，最后再插入E，是不是很没有效率？

所以我们需要使用key来给每个节点做一个唯一标识，Diff算法就可以正确的识别此节点，找到正确的位置区插入新的节点。

![](https://www.notion.sovue.assets/536CB47A8208A5561AEC33A70324C88B.png)

img

### jquery 和 vue相比

**参考答案：**

1. jquery：轻量级的js库
2. vue：前端js库，是一个精简的MVVM，它专注于MVVM模型的viewModel层，通过双向数据绑定把view和model层连接起来，通过对数据的操作就可以完成对页面视图的渲染。

| **Vue** | **jQuery** |
| --- | --- |
| 数据驱动视图(MVVM思想:数据视图完全分离；数据驱动、双向绑定；) | 直接操作DOM(获取、修改、赋值、事件绑定) |
| 操作简单 | 操作麻烦 |
| 模块化 | x |
| 实现单页面 | x |
| 组件复用 | x |
| 性能高：使用的虚拟DOM，减少 dom的操作 | x |

**扩展：**

1. vue适用的场景：复杂数据操作的后台页面，表单填写页面
    1. jquery适用的场景：比如说一些html5的动画页面，一些需要js来操作页面样式的页面
    2. 二者也是可以结合起来一起使用的，vue侧重数据绑定，jquery侧重样式操作，动画效果等，则会更加高效率的完成业务需求

### 为什么选择用vue做页面展示

- MVVM 框架：
    
    Vue 正是使用了这种 MVVM 的框架形式，并且通过声明式渲染和响应式数据绑定的方式来帮助我们完全避免了对 DOM 的操作。
    
- 单页面应用程序
    
    Vue 配合生态圈中的 Vue-Router 就可以非常方便的开发复杂的单页应用
    
- 轻量化与易学习
    
    Vue 的生产版本只有 30.90KB 的大小，几乎不会对我们的网页加载速度产生影响。同时因为 Vue 只专注于视图层，单独的 Vue就像一个库一样，所以使我们的学习成本变得非常低
    
- 渐进式与兼容性
    
    Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。Vue 只做界面，而把其他的一切都交给了它的周边生态（axios（Vue官方推荐）、Loadsh.js、Velocity.js 等）来做处理，这就要求 Vue 必须要对其他的框架拥有最大程度的兼容性
    
- 视图组件化
    
    Vue 允许通过组件来去拼装一个页面，每个组件都是一个可复用的 Vue 实例，组件里面可以包含自己的数据，视图和代码逻辑。方便复用
    
- 虚拟 DOM（Virtual DOM）
    
    Vue 之所以可以完全避免对 DOM 的操作，就是因为 Vue 采用了虚拟 DOM 的方式，不但避免了我们对 DOM 的复杂操作，并且大大的加快了我们应用的运行速度。
    
- 社区支持
    
    得益于 Vue 的本土化身份（Vue 的作者为国人尤雨溪），再加上 Vue 本身的强大，所以涌现出了特别多的国内社区，这种情况在其他的框架身上是没有出现过的，这使得我们在学习或者使用Vue 的时候，可以获得更多的帮助
    
- 未来的 Vue 走向
    
    Vue 是由国人尤雨溪在 Google 工作的时候，为了方便自己的工作而开发出来的一个库，而在 Vue被使用的过程中，突然发现越来越多的人喜欢上了它。所以尤雨溪就进入了一个边工作、边维护的状态，在这种情况下 Vue 依然迅速的发展。
    

而现在尤雨溪已经正式辞去了 Google 的工作，开始专职维护 Vue，同时加入进来的还有几十位优秀的开发者，他们致力于把 Vue打造为最受欢迎的前端框架。事实证明 Vue 确实在往越来越好的方向发展了（从 Angular、React、Vue 的对比图中可以看出 Vue的势头）。所以我觉得完全不需要担心未来 Vue 的发展，至少在没有新的颠覆性创新出来之前，Vue 都会越做越好。

## vue/angular区别

**参考答案：**

1. 体积和性能
    
    相较于vue，angular显得比较臃肿，比如一个包含了 Vuex + Vue Router 的 Vue 项目 (gzip 之后 30kB) ，而 angular-cli 生成的默认项目尺寸 (~65KB) 还是要小得多。
    
    在性能上，AngularJS依赖对数据做脏检查，所以Watcher越多越慢。Vue.js使用基于依赖追踪的观察并且使用异步队列更新。所有的数据都是独立触发的。 对于庞大的应用来说，这个优化差异还是比较明显的
    
2. Virtual DOM vs Incremental DOM
    
    在底层渲染方面，vue 使用的虚拟dom，而angular 使用的是Incremental DOM，Incremental DOM的优势在于低内开销
    
3. Vue 相比于 Angular 更加灵活，可以按照不同的需要去组织项目的应用代码。比如，甚至可以直接像引用jquery那样在HTML中引用vue，然后仅仅当成一个前端的模板引擎来用。
4. es6支持
    
    es6是新一代的javascript标准，对JavaScript进行了大量的改进，使用es6开发已是基本需求。虽然有部分十分老旧的浏览器不支持es6，但是可以利用现代开发工具将es6编译成es5。在对es6的支持上两者都做得很好，（TS本身就是es6的超集）
    
5. 学习曲线
    
    针对前端而言，angular的学习曲线相对较大，vue学习起来更容易一些。不过对java和c的使用者而言，angular的静态检查、依赖注入的特性，以及面向对象的编程风格，使得angular都要更亲切一些。
    
6. 使用热度
    
    在使用热度上，vue具有更大优势，主要原因是更受数量庞大的中国开发者欢迎。较低的上手难度，易懂的开发文档，以及国人主导开发的光环，都使得vue更为流行
    

### 简单聊聊 new Vue 以后发生的事情

1. new Vue会调用 Vue 原型链上的_init方法对 Vue 实例进行初始化；
2. 首先是initLifecycle初始化生命周期，对 Vue 实例内部的一些属性（如 children、parent、isMounted）进行初始化；
3. initEvents，初始化当前实例上的一些自定义事件（Vue.$on）；
4. initRender，解析slots绑定在 Vue 实例上，绑定createElement方法在实例上；
5. 完成对生命周期、自定义事件等一系列属性的初始化后，触发生命周期钩子beforeCreate；
6. initInjections，在初始化data和props之前完成依赖注入（类似于 React.Context）；
7. initState，完成对data和props的初始化，同时对属性完成数据劫持内部，启用监听者对数据进行监听（更改）；
8. initProvide，对依赖注入进行解析；
9. 完成对数据（state 状态）的初始化后，触发生命周期钩子created；
10. 进入挂载阶段，将 vue 模板语法通过vue-loader解析成虚拟 DOM 树，虚拟 DOM 树与数据完成双向绑定，触发生命周期钩子beforeMount；
11. 将解析好的虚拟 DOM 树通过 vue 渲染成真实 DOM，触发生命周期钩子mounted；

## vue首屏白屏如何解决？

1. 路由懒加载
2. vue-cli开启打包压缩和后台配合 gzip访问
3. 进行cdn加速
4. 开启vue服务渲染模式
5. 用webpack的externals属性把不需要打包的库文件分离出去，减少打包后文件的大小
6. 在生产环境中删除掉不必要的console.log

```jsx
plugins: [    new webpack.optimize.UglifyJsPlugin({ //添加-删除console.log        compress: {            warnings: false,            drop_debugger: true,            drop_console: true        },        sourceMap: true    }),]
```

1. 开启nginx的gzip ,在nginx.conf配置文件中配置

```jsx
http{  //在 http中配置如下代码，    gzip    on;    gzip_disable    "msie6";    gzip_vary    on;    gzip_proxied    any;    gzip_comp_level    8;    #压缩级别    gzip_buffers    16    8    k;    #gzip_http_version    1.1;    gzip_min_length    100;    #不压缩临界值    gzip_types    text / plain    application / javascript    application / x - javascript    text / css    application / xml    text / javascript    application / x - httpd - php    image / jpeg    image / gif    image / png;}
```

1. 添加loading效果，给用户一种进度感受

### vue单页面和传统的多页面区别？

单页面应用（SPA）

通俗一点说就是指只有一个主页面的应用，浏览器一开始要加载所有必须的 html, js, css。所有的页面内容都包含在这个所谓的主页面中。但在写的时候，还是会分开写（页面片段），然后在交互的时候由路由程序动态载入，单页面的页面跳转，仅刷新局部资源。多应用于pc端。

多页面（MPA）

指一个应用中有多个页面，页面跳转时是整页刷新

**单页面的优点：**

用户体验好，快，内容的改变不需要重新加载整个页面，基于这一点spa对服务器压力较小；前后端分离；页面效果会比较炫酷（比如切换页面内容时的专场动画）。

**单页面缺点：**

不利于seo；导航不可用，如果一定要导航需要自行实现前进、后退。（由于是单页面不能用浏览器的前进后退功能，所以需要自己建立堆栈管理）；初次加载时耗时多；页面复杂度提高很多。

### refs、$parent的使用？

[](https://www.notion.sovue.assets/equation-20230324101322121-9624002.)

img

$root

可以用来获取vue的根实例，比如在简单的项目中将公共数据放再vue根实例上(可以理解为一个全局 store ),因此可以代替vuex实现状态管理；

$refs

在子组件上使用ref特性后，this.属性可以直接访问该子组件。可以代替事件emit 和

[](https://www.notion.sovue.assets/equation?tex=on%20%E7%9A%84%E4%BD%9C%E7%94%A8%E3%80%82%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F%E6%98%AF%E9%80%9A%E8%BF%87ref%E7%89%B9%E6%80%A7%E4%B8%BA%E8%BF%99%E4%B8%AA%E5%AD%90%E7%BB%84%E4%BB%B6%E8%B5%8B%E4%BA%88%E4%B8%80%E4%B8%AAID%E5%BC%95%E7%94%A8%EF%BC%8C%E5%86%8D%E9%80%9A%E8%BF%87this.&preview=true)

refs.testId获取指定元素。注意：

[](https://www.notion.sovue.assets/equation-20230324101322135)

refs。

$parent

$parent属性可以用来从一个子组件访问父组件的实例，可以替代将数据以 prop 的方式传入子组件的方式；当变更父级组件的数据的时候，容易造成调试和理解难度增加；

### scss是什么？在vue.cli中的安装使用步骤是？有哪几大特性？

css的预编译。

使用步骤：

1. 先装css-loader、node-loader、sass-loader等加载器模块
2. 在build目录找到webpack.base.config.js，在那个extends属性中加一个拓展.scss
3. 在同一个文件，配置一个module属性
4. 然后在组件的style标签加上lang属性 ，例如：lang=”scss”

特性:

可以用变量，例如（$变量名称=值）； 可以用混合器，例如（） 可以嵌套

### delete与vue.delete区别?

delete会删除数组的值，但是它依然会在内存中占位置 而vue.delete会删除数组在内存中的占位

```jsx
let arr1 = [1, 2, 3]let arr2 = [1, 2, 3]delete arr1[1]this.$delete(arr2, 2)console.log(arr1)    //【1, empty, 3】console.log(arr2)    //【1,2】
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
    // 修改级联选择框的默认宽度/deep/ .el-cascader {  width: 100%;}
    ```
    
4. 通过内联样式 或者 绑定类样式覆盖默认样式
    
    通过内联样式 style ，绑定类样式的方式，可以在**某些标签**中可以直接覆盖默认样式，不是很通用。具体实例如下：
    

```html
<el-button :style="selfstyle">默认按钮</el-button><script>    export default {        data() {            return {                selfstyle: {                    color: "white",                    marginTop: "10px",                    width: "100px",                    backgroundColor: "cadetblue"                }            };        }    }</script>
```

通过绑定修改样式方式修改：

```html
<el-button :class="[selfbutton]">默认按钮</el-button><script>    export default {        data() {            return {                selfbutton: "self-button"            };        }    }</script><style lang="stylus" rel="stylesheet/stylus" scoped>    .self-button {        color: white;        margin-top: 10px;        width: 100px;        background-Color: cadetblue;    }</style>
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

[Router](Vue/Router.md)

[resource](Vue/resource.md)

[Vitest](Vue/Vitest.md)