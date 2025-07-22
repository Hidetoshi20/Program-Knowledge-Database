# performence

## React 渲染流程

[](https://segmentfault.com/a/1190000041112179)

# React render方法的原理？在什么时候会被触发？

## 一、原理

首先，`render`函数在`react`中有两种形式：

在类组件中，指的是`render`方法：

```jsx
class Foo extends React.Component {
    render() {
        return <h1> Foo </h1>;
    }
}
```

在函数组件中，指的是函数组件本身：

```jsx
function Foo() {    return <h1> Foo </h1>;}
```

在`render`中，我们会编写`jsx`，`jsx`通过`babel`编译后就会转化成我们熟悉的`js`格式，如下：

```jsx
return (
  <div className='cn'>
    <Header> hello </Header>
    <div> start </div>
    Right Reserve
  </div>
)
```

`babel`编译后：

```jsx
return (React.createElement('div', {className: 'cn'},
    React.createElement(Header, null, 'hello'),
    React.createElement('div', null, 'start'), 'Right Reserve'))
```

从名字上来看，`createElement`方法用来元素的

在`react`中，这个元素就是虚拟`DOM`树的节点，接收三个参数：

- type：标签
- attributes：标签属性，若无则为null
- children：标签的子节点

这些虚拟`DOM`树最终会渲染成真实`DOM`

在`render`过程中，`React` 将新调用的 `render`函数返回的树与旧版本的树进行比较，这一步是决定如何更新 `DOM` 的必要步骤，然后进行 `diff` 比较，更新 `DOM`树

## 二、触发时机

`render`的执行时机主要分成了两部分：

- 类组件调用 setState 修改状态

```jsx
class Foo extends React.Component {
  state = { count: 0 };

  increment = () => {
    const { count } = this.state;

    const newCount = count < 10 ? count + 1 : count;

    this.setState({ count: newCount });
  };

  render() {
    const { count } = this.state;
    console.log("Foo render");

    return (
      <div>
        <h1> {count} </h1>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

点击按钮，则调用`setState`方法，无论`count`发生变化，控制台都会输出`Foo render`，证明`render`执行了

- 函数组件通过`useState hook`修改状态

```jsx
function Foo() {
  const [count, setCount] = useState(0);

  function increment() {
    const newCount = count < 10 ? count + 1 : count;
    setCount(newCount);
  }

  console.log("Foo render");

  return (
    <div>
      <h1> {count} </h1>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

函数组件通过`useState`这种形式更新数据，当数组的值不发生改变了，就不会触发`render`

- 类组件重新渲染

```jsx
class App extends React.Component {
    state = {name: "App"};

    render() {
        return (<div className="App">
            <Foo/>
            <button onClick={() => this.setState({name: "App"})}> Change name</button>
        </div>);
    }
}

function Foo() {
    console.log("Foo render");
    return (<div><h1> Foo </h1></div>);
}
```

只要点击了 `App` 组件内的 `Change name` 按钮，不管 `Foo` 具体实现是什么，都会被重新`render`渲染

- 函数组件重新渲染

```jsx
function App(){
    const [name,setName] = useState('App')

    return (
        <div className="App">
            <Foo />
            <button onClick={() => setName("aaa")}>
                { name }
            </button>
      </div>
    )
}

function Foo() {
  console.log("Foo render");

  return (
    <div>
      <h1> Foo </h1>
    </div>
  );
}
```

可以发现，使用`useState`来更新状态的时候，只有首次会触发`Foo render`，后面并不会导致`Foo render`

## 三、总结

`render`函数里面可以编写`JSX`，转化成`createElement`这种形式，用于生成虚拟`DOM`，最终转化成真实`DOM`

在`React` 中，类组件只要执行了 `setState` 方法，就一定会触发 `render` 函数执行，函数组件使用`useState`更改状态不一定导致重新`render`

组件的`props` 改变了，不一定触发 `render` 函数的执行，但是如果 `props` 的值来自于父组件或者祖先组件的 `state`

在这种情况下，父组件或者祖先组件的 `state` 发生了改变，就会导致子组件的重新渲染

所以，一旦执行了`setState`就会执行`render`方法，`useState` 会判断当前值有无发生改变确定是否执行`render`方法，一旦父组件发生渲染，子组件也会渲染

![](https://static.vue-js.com/229784b0-ecf5-11eb-ab90-d9ae814b240d.png)

[React渲染原理](https://zhuanlan.zhihu.com/p/45091185)

[【React 原理（一）】实现 createElement 和 render 方法 - 掘金](https://juejin.cn/post/6844904181493415950)

# React 性能优化

`React`凭借`virtual DOM`和`diff`算法拥有高效的性能，但是某些情况下，性能明显可以进一步提高

- 避免不必要的`render`
    - `shouldComponentUpdate`
    - `PureComponent`
    - `React.memo`
- 使用 React Fragments 避免额外标记
- 使用 Immutable
- 懒加载组件
- 事件绑定方式
- 服务端渲染

## 避免不必要 render

类组件通过调用`setState`方法， 就会导致`render`，父组件一旦发生`render`渲染，子组件一定也会执行`render`渲染

当我们想要更新一个子组件的时候，如下图绿色部分：

![](https://static.vue-js.com/b41f6f30-f270-11eb-ab90-d9ae814b240d.png)

理想状态只调用该路径下的组件`render`：

![](https://static.vue-js.com/bc0f2460-f270-11eb-85f6-6fac77c0c9b3.png)

但是`react`的默认做法是调用所有组件的`render`，再对生成的虚拟`DOM`进行对比（黄色部分），如不变则不进行更新

![](https://static.vue-js.com/c2f0c4f0-f270-11eb-85f6-6fac77c0c9b3.png)

从上图可见，黄色部分`diff`算法对比是明显的性能浪费的情况

### 具体实现方式

- `shouldComponentUpdate`
- `PureComponent`
- `React.memo`

### `shouldComponentUpdate`

通过`shouldComponentUpdate`生命周期函数来比对 `state`和 `props`，确定是否要重新渲染

默认情况下返回`true`表示重新渲染，如果不希望组件重新渲染，返回 `false` 即可

### `PureComponent`

跟`shouldComponentUpdate`原理基本一致，通过对 `props` 和 `state`的浅比较结果来实现 `shouldComponentUpdate`，源码大致如下：

```jsx
if (this._compositeType === CompositeTypes.PureClass) {
    shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state, nextState);
}
```

`shallowEqual`对应方法大致如下：

```jsx
const hasOwnProperty = Object.prototype.hasOwnProperty;

/** * is 方法来判断两个值是否是相等的值，为何这么写可以移步 MDN 的文档 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is */
function is(x: mixed, y: mixed): boolean {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
}

function shallowEqual(objA: mixed, objB: mixed): boolean {  // 首先对基本类型进行比较 
    if (is(objA, objB)) {
        return true;
    }
    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);  // 长度不相等直接返回false 
    if (keysA.length !== keysB.length) {
        return false;
    }  // key相等的情况下，再去循环比较
    for (let i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}
```

当对象包含复杂的数据结构时，对象深层的数据已改变却没有触发 `render`

注意：在`react`中，是不建议使用深层次结构的数据

### `React.memo`

`React.memo`用来缓存组件的渲染，避免不必要的更新，其实也是一个高阶组件，与 `PureComponent` 十分类似。但不同的是， `React.memo` 只能用于函数组件

```jsx
import { memo } from 'react';

function Button(props) {
  // Component code
}

export default memo(Button);
```

如果需要深层次比较，这时候可以给`memo`第二个参数传递比较函数

```jsx
function arePropsEqual(prevProps, nextProps) {
  // your code
  return prevProps === nextProps;
}

export default memo(Button, arePropsEqual);
```

### 三、总结

除此之外，建议将页面进行更小的颗粒化，如果一个过大，当状态发生修改的时候，就会导致整个大组件的渲染，而对组件进行拆分后，粒度变小了，也能够减少子组件不必要的渲染

[从 React render 谈谈性能优化 - 掘金](https://juejin.cn/post/6844903781679759367#heading-12)

## 避免使用内联函数

如果我们使用内联函数，则每次调用`render`函数时都会创建一个新的函数实例，如下：

```jsx
import React from "react";

export default class InlineFunctionComponent extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome Guest</h1>
        <input type="button" onClick={(e) => { this.setState({inputValue: e.target.value}) }} value="Click For Inline Function" />
      </div>
    )
  }
}
```

我们应该在组件内部创建一个函数，并将事件绑定到该函数本身。这样每次调用 `render` 时就不会创建单独的函数实例，如下：

```jsx
import React from "react";

export default class InlineFunctionComponent extends React.Component {

  setNewStateData = (event) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  render() {
    return (
      <div>
        <h1>Welcome Guest</h1>
        <input type="button" onClick={this.setNewStateData} value="Click For Inline Function" />
      </div>
    )
  }
}
```

## 使用 React Fragments 避免额外标记

用户创建新组件时，每个组件应具有单个父标签。父级不能有两个标签，所以顶部要有一个公共标签，所以我们经常在组件顶部添加额外标签`div`

这个额外标签除了充当父标签之外，并没有其他作用，这时候则可以使用`fragement`

其不会向组件引入任何额外标记，但它可以作为父级标签的作用，如下所示：

```jsx
export default class NestedRoutingComponent extends React.Component {
    render() {
        return (
            <>
                <h1>This is the Header Component</h1>
                <h2>Welcome To Demo Page</h2>
            </>
        )
    }
}
```

## 事件绑定方式

在[事件绑定方式](https://mp.weixin.qq.com/s/VfQ34ZEPXUXsimzMaJ_41A)中，我们了解到四种事假绑定的方式

从性能方面考虑，在`render`方法中使用`bind`和`render`方法中使用箭头函数这两种形式在每次组件`render`的时候都会生成新的方法实例，性能欠缺

而`constructor`中`bind`事件与定义阶段使用箭头函数绑定这两种形式只会生成一个方法实例，性能方面会有所改善

## 使用 Immutable

在[理解Immutable中](https://mp.weixin.qq.com/s/laYJ_KNa8M5JNBnIolMDAA)，我们了解到使用 `Immutable`可以给 `React` 应用带来性能的优化，主要体现在减少渲染的次数

在做`react`性能优化的时候，为了避免重复渲染，我们会在`shouldComponentUpdate()`中做对比，当返回`true`执行`render`方法

`Immutable`通过`is`方法则可以完成对比，而无需像一样通过深度比较的方式比较

## 懒加载组件

从工程方面考虑，`webpack`存在代码拆分能力，可以为应用创建多个包，并在运行时动态加载，减少初始包的大小

而在`react`中使用到了`Suspense`和 `lazy`组件实现代码拆分功能，基本使用如下：

```jsx
const johanComponent = React.lazy(() => import(/* webpackChunkName: "johanComponent" */ './myAwesome.component'));

export const johanAsyncComponent = props => (
  <React.Suspense fallback={<Spinner />}>
    <johanComponent {...props} />
  </React.Suspense>
);
```

## 其他

除此之外，还存在的优化手段有组件拆分、合理使用`hooks`等性能优化手段…

## 总结

通过上面初步学习，我们了解到`react`常见的性能优化可以分成三个层面：

- 代码层面
- 工程层面
- 框架机制层面

通过这三个层面的优化结合，能够使基于`react`项目的性能更上一层楼

[react性能优化浅析](https://zhuanlan.zhihu.com/p/108666350)

[React性能优化总结](https://segmentfault.com/a/1190000007811296)

# 服务端渲染

在[SSR中](https://mp.weixin.qq.com/s/vvUtC_aAprUjoJRnfFjA1A)，我们了解到`Server-Side Rendering` ，简称`SSR`，意为服务端渲染

指由服务侧完成页面的 `HTML` 结构拼接的页面处理技术，发送到浏览器，然后为其绑定状态与事件，成为完全可交互页面的过程

![](https://static.vue-js.com/96dc3e20-f3f7-11eb-85f6-6fac77c0c9b3.png)

其解决的问题主要有两个：

- SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面
- 加速首屏加载，解决首屏白屏问题

## 实现方式

在`react`中，实现`SSR`主要有两种形式：

- 手动搭建一个 SSR 框架
- 使用成熟的SSR 框架，如 Next.JS

## 手动搭建

这里主要以手动搭建一个`SSR`框架进行实现

首先通过`express`启动一个`app.js`文件，用于监听3000端口的请求，当请求根目录时，返回`HTML`，如下：

```jsx
const express = require('express')const app = express()app.get('/', (req,res) => res.send(`<html>   <head>       <title>ssr demo</title>   </head>   <body>       Hello world   </body></html>`))app.listen(3000, () => console.log('Exampleapp listening on port 3000!'))
```

然后再服务器中编写`react`代码，在`app.js`中进行应引用

```jsx
import React from 'react'

const Home = () =>{

    return <div>home</div>

}

export default Home
```

为了让服务器能够识别`JSX`，这里需要使用`webpakc`对项目进行打包转换，创建一个配置文件`webpack.server.js`并进行相关配置，如下：

```jsx
const path = require('path')    //node的path模块const nodeExternals = require('webpack-node-externals')module.exports = {    target:'node',    mode:'development',           //开发模式    entry:'./app.js',             //入口    output: {                     //打包出口        filename:'bundle.js',     //打包后的文件名        path:path.resolve(__dirname,'build')    //存放到根目录的build文件夹    },    externals: [nodeExternals()],  //保持node中require的引用方式    module: {        rules: [{                  //打包规则           test:   /\.js?$/,       //对所有js文件进行打包           loader:'babel-loader',  //使用babel-loader进行打包           exclude: /node_modules/,//不打包node_modules中的js文件           options: {               presets: ['react','stage-0',['env', {                                  //loader时额外的打包规则,对react,JSX，ES6进行转换                    targets: {                        browsers: ['last 2versions']   //对主流浏览器最近两个版本进行兼容                    }               }]]           }       }]    }}
```

接着借助`react-dom`提供了服务端渲染的 `renderToString`方法，负责把`React`组件解析成`html`

```jsx
import express from 'express'import React from 'react'//引入React以支持JSX的语法import { renderToString } from 'react-dom/server'//引入renderToString方法import Home from'./src/containers/Home'const app= express()const content = renderToString(<Home/>)app.get('/',(req,res) => res.send(`<html>   <head>       <title>ssr demo</title>   </head>   <body>        ${content}   </body></html>`))app.listen(3001, () => console.log('Exampleapp listening on port 3001!'))
```

上面的过程中，已经能够成功将组件渲染到了页面上

但是像一些事件处理的方法，是无法在服务端完成，因此需要将组件代码在浏览器中再执行一遍，这种服务器端和客户端共用一套代码的方式就称之为**同构**

重构通俗讲就是一套React代码在服务器上运行一遍，到达浏览器又运行一遍：

- 服务端渲染完成页面结构
- 浏览器端渲染完成事件绑定

浏览器实现事件绑定的方式为让浏览器去拉取`JS`文件执行，让`JS`代码来控制，因此需要引入`script`标签

通过`script`标签为页面引入客户端执行的`react`代码，并通过`express`的`static`中间件为`js`文件配置路由，修改如下：

```jsx
import express from 'express'import React from 'react'//引入React以支持JSX的语法import { renderToString } from'react-dom/server'//引入renderToString方法import Home from './src/containers/Home'const app = express()app.use(express.static('public'));//使用express提供的static中间件,中间件会将所有静态文件的路由指向public文件夹 const content = renderToString(<Home/>)app.get('/',(req,res)=>res.send(`<html>   <head>       <title>ssr demo</title>   </head>   <body>        ${content}   <script src="/index.js"></script>   </body></html>`)) app.listen(3001, () =>console.log('Example app listening on port 3001!'))
```

然后再客户端执行以下`react`代码，新建`webpack.client.js`作为客户端React代码的`webpack`配置文件如下：

```jsx
const path = require('path')                    //node的path模块module.exports = {    mode:'development',                         //开发模式    entry:'./src/client/index.js',              //入口    output: {                                   //打包出口        filename:'index.js',                    //打包后的文件名        path:path.resolve(__dirname,'public')   //存放到根目录的build文件夹    },    module: {        rules: [{                               //打包规则           test:   /\.js?$/,                    //对所有js文件进行打包           loader:'babel-loader',               //使用babel-loader进行打包           exclude: /node_modules/,             //不打包node_modules中的js文件           options: {               presets: ['react','stage-0',['env', {                    //loader时额外的打包规则,这里对react,JSX进行转换                    targets: {                        browsers: ['last 2versions']   //对主流浏览器最近两个版本进行兼容                    }               }]]           }       }]    }}
```

这种方法就能够简单实现首页的`react`服务端渲染，过程对应如下图：

![](https://static.vue-js.com/a2894970-f3f7-11eb-85f6-6fac77c0c9b3.png)

在做完初始渲染的时候，一个应用会存在路由的情况，配置信息如下：

```jsx
import React from 'react'                   //引入React以支持JSXimport { Route } from 'react-router-dom'    //引入路由import Home from './containers/Home'        //引入Home组件export default (    <div>        <Route path="/" exact component={Home}></Route>    </div>)
```

然后可以通过`index.js`引用路由信息，如下：

```jsx
import React from 'react'import ReactDom from 'react-dom'import { BrowserRouter } from'react-router-dom'import Router from'../Routers'const App= () => {    return (        <BrowserRouter>           {Router}        </BrowserRouter>    )}ReactDom.hydrate(<App/>, document.getElementById('root'))
```

这时候控制台会存在报错信息，原因在于每个`Route`组件外面包裹着一层`div`，但服务端返回的代码中并没有这个`div`

解决方法只需要将路由信息在服务端执行一遍，使用使用`StaticRouter`来替代`BrowserRouter`，通过`context`进行参数传递

```jsx
import express from 'express'import React from 'react'//引入React以支持JSX的语法import { renderToString } from 'react-dom/server'//引入renderToString方法import { StaticRouter } from 'react-router-dom'import Router from '../Routers'const app = express()app.use(express.static('public'));//使用express提供的static中间件,中间件会将所有静态文件的路由指向public文件夹app.get('/',(req,res)=>{    const content  = renderToString((        //传入当前path        //context为必填参数,用于服务端渲染参数传递        <StaticRouter location={req.path} context={{}}>           {Router}        </StaticRouter>    ))    res.send(`   <html>       <head>           <title>ssr demo</title>       </head>       <body>       <div id="root">${content}</div>       <script src="/index.js"></script>       </body>   </html>    `)})app.listen(3001, () => console.log('Exampleapp listening on port 3001!'))
```

这样也就完成了路由的服务端渲染

`node server` 接收客户端请求，得到当前的请求`url` 路径，然后在已有的路由表内查找到对应的组件，拿到需要请求的数据，将数据作为 `props`、`context`或者`store` 形式传入组件

然后基于 `react` 内置的服务端渲染方法 `renderToString()`把组件渲染为 `html`字符串在把最终的 `html`进行输出前需要将数据注入到浏览器端

浏览器开始进行渲染和节点对比，然后执行完成组件内事件绑定和一些交互，浏览器重用了服务端输出的 `html` 节点，整个流程结束

![](https://static.vue-js.com/a2894970-f3f7-11eb-85f6-6fac77c0c9b3.png)

# Fiber架构的理解？解决了什么问题？

`JavaScript`引擎和页面渲染引擎两个线程是互斥的，当其中一个线程执行时，另一个线程只能挂起等待

如果 `JavaScript` 线程长时间地占用了主线程，那么渲染层面的更新就不得不长时间地等待，界面长时间不更新，会导致页面响应度变差，用户可能会感觉到卡顿

而这也正是 `React 15` 的 `Stack Reconciler`所面临的问题，当 `React`在渲染组件时，从开始到渲染完成整个过程是一气呵成的，无法中断

如果组件较大，那么`js`线程会一直执行，然后等到整棵`VDOM`树计算完成后，才会交给渲染的线程

这就会导致一些用户交互、动画等任务无法立即得到处理，导致卡顿的情况

![](https://static.vue-js.com/5eb3a850-ed24-11eb-ab90-d9ae814b240d.png)

### 二、是什么

React Fiber 是 Facebook 花费两年余时间对 React 做出的一个重大改变与优化，是对 React 核心算法的一次重新实现。从Facebook在 React Conf 2017 会议上确认，React Fiber 在React 16 版本发布

在`react`中，主要做了以下的操作：

- 为每个增加了优先级，优先级高的任务可以中断低优先级的任务。然后再重新，注意是重新执行优先级低的任务
- 增加了异步任务，调用requestIdleCallback api，浏览器空闲的时候执行
- dom diff树变成了链表，一个dom对应两个fiber（一个链表），对应两个队列，这都是为找到被中断的任务，重新执行

从架构角度来看，`Fiber` 是对 `React`核心算法（即调和过程）的重写

从编码角度来看，`Fiber`是 `React`内部所定义的一种数据结构，它是 `Fiber`树结构的节点单位，也就是 `React 16` 新架构下的虚拟`DOM`

一个 `fiber`就是一个 `JavaScript`对象，包含了元素的信息、该元素的更新操作队列、类型，其数据结构如下：

```jsx
type Fiber = {  // 用于标记fiber的WorkTag类型，主要表示当前fiber代表的组件类型如FunctionComponent、ClassComponent等  
    tag: WorkTag,  // ReactElement里面的key  
    key: null | string,  // ReactElement.type，调用`createElement`的第一个参数 
    elementType: any,  // The resolved function/class/ associated with this fiber.  // 表示当前代表的节点类型 
    type: any,  // 表示当前FiberNode对应的element组件实例 
    stateNode: any,  // 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回  
    return: Fiber | null,  // 指向自己的第一个子节点
    child: Fiber | null,  // 指向自己的兄弟结构，兄弟节点的return指向同一个父节点 
    sibling: Fiber | null, index: number, ref: null | (((handle: mixed) => void) & { _stringRef?: string }) | RefObject,  // 当前处理过程中的组件props对象  
    pendingProps: any,  // 上一次渲染完成之后的props  
    memoizedProps: any,  // 该Fiber对应的组件产生的Update会存放在这个队列里面  
    updateQueue: UpdateQueue<any> | null,  // 上一次渲染的时候的state
    memoizedState: any,  // 一个列表，存放这个Fiber依赖的context  
    firstContextDependency: ContextDependency<mixed> | null, mode: TypeOfMode,  // Effect  // 用来记录Side Effect  
    effectTag: SideEffectTag,  // 单链表用来快速查找下一个side effect 
    nextEffect: Fiber | null,  // 子树中第一个side effect  
    firstEffect: Fiber | null,  // 子树中最后一个side effect
    lastEffect: Fiber | null,  // 代表任务在未来的哪个时间点应该被完成，之后版本改名为 lanes  
    expirationTime: ExpirationTime,  // 快速确定子树中是否有不在等待的变化  
    childExpirationTime: ExpirationTime,  // fiber的版本池，即记录fiber更新过程，便于恢复
    alternate: Fiber | null,
}
```

### 三、如何解决

`Fiber`把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续下一个任务；如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续执行

即可以中断与恢复，恢复后也可以复用之前的中间状态，并给不同的任务赋予不同的优先级，其中每个任务更新单元为 `React Element` 对应的 `Fiber`节点

实现的上述方式的是`requestIdleCallback`方法

`window.requestIdleCallback()`方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应

首先 React 中任务切割为多个步骤，分批完成。在完成一部分任务之后，将控制权交回给浏览器，让浏览器有时间再进行页面的渲染。等浏览器忙完之后有剩余时间，再继续之前 React 未完成的任务，是一种合作式调度。

该实现过程是基于 `Fiber`节点实现，作为静态的数据结构来说，每个 `Fiber` 节点对应一个 `React element`，保存了该组件的类型（函数组件/类组件/原生组件等等）、对应的 DOM 节点等信息。

作为动态的工作单元来说，每个 `Fiber` 节点保存了本次更新中该组件改变的状态、要执行的工作。

每个 Fiber 节点有个对应的 `React element`，多个 `Fiber`节点根据如下三个属性构建一颗树：

```jsx
// 指向父级Fiber节点this.return = null// 指向子Fiber节点this.child = null// 指向右边第一个兄弟Fiber节点this.sibling = null
```

通过这些属性就能找到下一个执行目标

[浅谈对 React Fiber 的理解 - 掘金](https://juejin.cn/post/6926432527980691470)

[前端大佬谈 React Fiber 架构](https://zhuanlan.zhihu.com/p/137234573)

[web前端面试 - 面试官系列](https://vue3js.cn/interview)