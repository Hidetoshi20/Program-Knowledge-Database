# React

[Contact](React%20519ec452907447a6a0276c1745a029c9/Contact%2093e808a4ee7a47edaece6f8f1dbdc793.md)

[Virtual Dom](React%20519ec452907447a6a0276c1745a029c9/Virtual%20Dom%207ba17342ab8e44cfa9090316613b0c8f.md)

[Router](React%20519ec452907447a6a0276c1745a029c9/Router%2067da49f8b68341cab5f64d4ceb37fff2.md)

[component](React%20519ec452907447a6a0276c1745a029c9/component%20a12592c2808b48feb8e19b72c42e952f.md)

[performence](React%20519ec452907447a6a0276c1745a029c9/performence%203502622b16ec451b97a1e6ced50f15d3.md)

[Life circle](React%20519ec452907447a6a0276c1745a029c9/Life%20circle%20d863163697ba4bff9a0b9c5c5f5615fc.md)

[hooks](React%20519ec452907447a6a0276c1745a029c9/hooks%20ab50e9da7e594080accae65a762a6813.md)

# vue vs react

[为什么我们放弃了Vue？Vue和React深度比较-阿里云开发者社区](https://developer.aliyun.com/article/1207640)

[React和Vue全方位对比 - 掘金](https://juejin.cn/post/7250834664260829243)

# 双向绑定

# 在React项目如何捕获错误？

### 一、是什么

错误在我们日常编写代码是非常常见的

举个例子，在`react`项目中去编写组件内`JavaScript`代码错误会导致 `React` 的内部状态被破坏，导致整个应用崩溃，这是不应该出现的现象

作为一个框架，`react`也有自身对于错误的处理的解决方案

### 二、如何做

为了解决出现的错误导致整个应用崩溃的问题，`react16`引用了**错误边界**新的概念

错误边界是一种 `React` 组件，这种组件可以捕获发生在其子组件树任何位置的 `JavaScript` 错误，并打印这些错误，同时展示降级 `UI`，而并不会渲染那些发生崩溃的子组件树

错误边界在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误

形成错误边界组件的两个条件：

- 使用了 static getDerivedStateFromError()
- 使用了 componentDidCatch()

抛出错误后，请使用 `static getDerivedStateFromError()` 渲染备用 UI ，使用 `componentDidCatch()` 打印错误信息，如下：

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

然后就可以把自身组件的作为错误边界的子组件，如下：

```jsx
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

下面这些情况无法捕获到异常：

- 事件处理
- 异步代码
- 服务端渲染
- 自身抛出来的错误

在`react 16`版本之后，会把渲染期间发生的所有错误打印到控制台

除了错误信息和 JavaScript 栈外，React 16 还提供了组件栈追踪。现在你可以准确地查看发生在组件树内的错误信息：

![](https://static.vue-js.com/7b2b51d0-f289-11eb-ab90-d9ae814b240d.png)

可以看到在错误信息下方文字中存在一个组件栈，便于我们追踪错误

对于错误边界无法捕获的异常，如事件处理过程中发生问题并不会捕获到，是因为其不会在渲染期间触发，并不会导致渲染时候问题

这种情况可以使用`js`的`try...catch...`语法，如下：

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // 执行操作，如有错误则会抛出
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <button onClick={this.handleClick}>Click Me</button>
  }
}
```

除此之外还可以通过监听`onerror`事件

```jsx
window.addEventListener('error', function(event) { ... })
```

### 参考文献

[错误边界 – React](https://zh-hans.reactjs.org/docs/error-boundaries.html)

# 在react中组件间过渡动画如何实现？

在日常开发中，页面切换时的转场动画是比较基础的一个场景

当一个组件在显示与消失过程中存在过渡动画，可以很好的增加用户的体验

在`react`中实现过渡动画效果会有很多种选择，如`react-transition-group`，`react-motion`，`Animated`，以及原生的`CSS`都能完成切换动画

### 二、如何实现

在`react`中，`react-transition-group`是一种很好的解决方案，其为元素添加`enter`，`enter-active`，`exit`，`exit-active`这一系列勾子

可以帮助我们方便的实现组件的入场和离场动画

其主要提供了三个主要的组件：

- CSSTransition：在前端开发中，结合 CSS 来完成过渡动画效果
- SwitchTransition：两个组件显示和隐藏切换时，使用该组件
- TransitionGroup：将多个动画组件包裹在其中，一般用于列表中元素的动画

### CSSTransition

其实现动画的原理在于，当`CSSTransition`的`in`属性置为`true`时，`CSSTransition`首先会给其子组件加上`xxx-enter`、`xxx-enter-active`的`class`执行动画

当动画执行结束后，会移除两个`class`，并且添加`-enter-done`的`class`

所以可以利用这一点，通过`css`的`transition`属性，让元素在两个状态之间平滑过渡，从而得到相应的动画效果

当`in`属性置为`false`时，`CSSTransition`会给子组件加上`xxx-exit`和`xxx-exit-active`的`class`，然后开始执行动画，当动画结束后，移除两个`class`，然后添加`-enter-done`的`class`

如下例子：

```jsx
export default class App2 extends React.PureComponent {

  state = {show: true};

  onToggle = () => this.setState({show: !this.state.show});

  render() {
    const {show} = this.state;
    return (
      <div className={'container'}>
        <div className={'square-wrapper'}>
          <CSSTransition
            in={show}
            timeout={500}
            classNames={'fade'}
            unmountOnExit={true}
          >
            <div className={'square'} />
          </CSSTransition>
        </div>
        <Button onClick={this.onToggle}>toggle</Button>
      </div>
    );
  }
}
```

对应`css`样式如下：

```css
.fade-enter {  opacity: 0;  transform: translateX(100%);}.fade-enter-active {  opacity: 1;  transform: translateX(0);  transition: all 500ms;}.fade-exit {  opacity: 1;  transform: translateX(0);}.fade-exit-active {  opacity: 0;  transform: translateX(-100%);  transition: all 500ms;}
```

### SwitchTransition

`SwitchTransition`可以完成两个组件之间切换的炫酷动画

比如有一个按钮需要在`on`和`off`之间切换，我们希望看到`on`先从左侧退出，`off`再从右侧进入

`SwitchTransition`中主要有一个属性`mode`，对应两个值：

- in-out：表示新组件先进入，旧组件再移除；
- out-in：表示就组件先移除，新组建再进入

`SwitchTransition`组件里面要有`CSSTransition`，不能直接包裹你想要切换的组件

里面的`CSSTransition`组件不再像以前那样接受`in`属性来判断元素是何种状态，取而代之的是`key`属性

下面给出一个按钮入场和出场的示例，如下：

```jsx
import { SwitchTransition, CSSTransition } from "react-transition-group";

export default class SwitchAnimation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOn: true
    }
  }

  render() {
    const {isOn} = this.state;

    return (
      <SwitchTransition mode="out-in">
        <CSSTransition classNames="btn"
                       timeout={500}
                       key={isOn ? "on" : "off"}>
          {
          <button onClick={this.btnClick.bind(this)}>
            {isOn ? "on": "off"}
          </button>
        }
        </CSSTransition>
      </SwitchTransition>
    )
  }

  btnClick() {
    this.setState({isOn: !this.state.isOn})
  }
}
```

`css`文件对应如下：

```css
.btn-enter {  transform: translate(100%, 0);  opacity: 0;}.btn-enter-active {  transform: translate(0, 0);  opacity: 1;  transition: all 500ms;}.btn-exit {  transform: translate(0, 0);  opacity: 1;}.btn-exit-active {  transform: translate(-100%, 0);  opacity: 0;  transition: all 500ms;}
```

### TransitionGroup

当有一组动画的时候，就可将这些`CSSTransition`放入到一个`TransitionGroup`中来完成动画

同样`CSSTransition`里面没有`in`属性，用到了`key`属性

`TransitionGroup`在感知`children`发生变化的时候，先保存移除的节点，当动画结束后才真正移除

其处理方式如下：

- 插入的节点，先渲染dom，然后再做动画
- 删除的节点，先做动画，然后再删除dom

如下：

```jsx
import React, { PureComponent } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export default class GroupAnimation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      friends: []
    }
  }

  render() {
    return (
      <div>
        <TransitionGroup>
          {
            this.state.friends.map((item, index) => {
              return (
                <CSSTransition classNames="friend" timeout={300} key={index}>
                  <div>{item}</div>
                </CSSTransition>
              )
            })
          }
        </TransitionGroup>
        <button onClick={e => this.addFriend()}>+friend</button>
      </div>
    )
  }

  addFriend() {
    this.setState({
      friends: [...this.state.friends, "coderwhy"]
    })
  }
}
```

对应`css`如下：

```css
.friend-enter {    transform: translate(100%, 0);    opacity: 0;}.friend-enter-active {    transform: translate(0, 0);    opacity: 1;    transition: all 500ms;}.friend-exit {    transform: translate(0, 0);    opacity: 1;}.friend-exit-active {    transform: translate(-100%, 0);    opacity: 0;    transition: all 500ms;}
```

### 参考文献

- https://segmentfault.com/a/1190000018861018
- https://mp.weixin.qq.com/s/14HneI7SpfrRHKtqgosIiA

### 三、原理

整体`react`服务端渲染原理并不复杂，具体如下：

`node server` 接收客户端请求，得到当前的请求`url` 路径，然后在已有的路由表内查找到对应的组件，拿到需要请求的数据，将数据作为 `props`、`context`或者`store` 形式传入组件

然后基于 `react` 内置的服务端渲染方法 `renderToString()`把组件渲染为 `html`字符串在把最终的 `html`进行输出前需要将数据注入到浏览器端

浏览器开始进行渲染和节点对比，然后执行完成组件内事件绑定和一些交互，浏览器重用了服务端输出的 `html` 节点，整个流程结束

### 参考文献

- https://zhuanlan.zhihu.com/p/52693113
- https://segmentfault.com/a/1190000020417285
- https://juejin.cn/post/6844904000387563533#heading-14

# react 有什么特性

主要的特性分为：

- JSX语法
- 单向数据绑定
- 虚拟DOM
- 声明式编程
- Component

借助这些特性，`react`整体使用起来更加简单高效，组件式开发提高了代码的复用率

# React 事件机制

`React`基于浏览器的事件机制自身实现了一套事件机制，包括事件注册、事件的合成、事件冒泡、事件派发等

组件注册的事件最终会绑定在`document`这个 `DOM`上，而不是 `React`组件对应的 `DOM`，从而节省内存开销

自身实现了一套事件冒泡机制，阻止不同时间段的冒泡行为，需要对应使用不同的方法

# 事件绑定

`react`常见的绑定方式有如下：

- render方法中使用bind
- render方法中使用箭头函数
- constructor中bind
- 定义阶段使用箭头函数绑定

前两种方式在每次组件`render`的时候都会生成新的方法实例，性能问题欠缺

## 一、是什么

在`react`应用中，事件名都是用小驼峰格式进行书写，例如`onclick`要改写成`onClick`

最简单的事件绑定如下：

```jsx
class ShowAlert extends React.Component {
  showAlert() {
    console.log("Hi");
  }

  render() {
    return <button onClick={this.showAlert}>show</button>;
  }
}
```

从上面可以看到，事件绑定的方法需要使用`{}`包住

上述的代码看似没有问题，但是当将处理函数输出代码换成`console.log(this)`的时候，点击按钮，则会发现控制台输出`undefined`

## 二、如何绑定

为了解决上面正确输出`this`的问题，常见的绑定方式有如下：

- render方法中使用bind
- render方法中使用箭头函数
- constructor中bind
- 定义阶段使用箭头函数绑定

### render方法中使用bind

如果使用一个类组件，在其中给某个组件/元素一个`onClick`属性，它现在并会自定绑定其`this`到当前组件，解决这个问题的方法是在事件函数后使用`.bind(this)`将`this`绑定到当前组件中

```jsx
class App extends React.Component {
  handleClick() {
    console.log('this > ', this);
  }
  render() {
    return (
      <div onClick={this.handleClick.bind(this)}>test</div>
    )
  }
}
```

这种方式在组件每次`render`渲染的时候，都会重新进行`bind`的操作，影响性能

### render方法中使用箭头函数

通过`ES6`的上下文来将`this`的指向绑定给当前组件，同样再每一次`render`的时候都会生成新的方法，影响性能

```jsx
class App extends React.Component {
  handleClick() {
    console.log('this > ', this);
  }
  render() {
    return (
      <div onClick={e => this.handleClick(e)}>test</div>
    )
  }
}
```

### constructor中bind

在`constructor`中预先`bind`当前组件，可以避免在`render`操作中重复绑定

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('this > ', this);
  }
  render() {
    return (
      <div onClick={this.handleClick}>test</div>
    )
  }
}
```

### 定义阶段使用箭头函数绑定

跟上述方式三一样，能够避免在`render`操作中重复绑定，实现也非常的简单，如下：

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick = () => {
    console.log('this > ', this);
  }
  render() {
    return (
      <div onClick={this.handleClick}>test</div>
    )
  }
}
```

## 三、区别

上述四种方法的方式，区别主要如下：

- 编写方面：方式一、方式二写法简单，方式三的编写过于冗杂
- 性能方面：方式一和方式二在每次组件render的时候都会生成新的方法实例，性能问题欠缺。若该函数作为属性值传给子组件的时候，都会导致额外的渲染。而方式三、方式四只会生成一个方法实例

综合上述，方式四是最优的事件绑定方式

[React事件绑定的几种方式对比](https://segmentfault.com/a/1190000011317515)

[web前端面试 - 面试官系列](https://vue3js.cn/interview/)

[Immutable 详解及 React 中实践](https://zhuanlan.zhihu.com/p/20295971?spm=a2c4e.11153940.blogcont69516.18.4f275a00EzBHjr&columnSlug=purerender)

[Immutable.js 基础操作](https://www.jianshu.com/p/7bf04638e82a)

# 事件机制

### 一、是什么

`React`基于浏览器的事件机制自身实现了一套事件机制，包括事件注册、事件的合成、事件冒泡、事件派发等

在`React`中这套事件机制被称之为合成事件

### 合成事件（SyntheticEvent）

合成事件是 `React`模拟原生 `DOM`事件所有能力的一个事件对象，即浏览器原生事件的跨浏览器包装器

根据 `W3C`规范来定义合成事件，兼容所有浏览器，拥有与浏览器原生事件相同的接口，例如：

```jsx
const button = <button onClick={handleClick}>按钮</button>
```

如果想要获得原生`DOM`事件，可以通过`e.nativeEvent`属性获取

```jsx
const handleClick = (e) => console.log(e.nativeEvent);;const button = <button onClick={handleClick}>按钮</button>
```

从上面可以看到`React`事件和原生事件也非常的相似，但也有一定的区别：

- 事件名称命名方式不同

```jsx
// 原生事件绑定方式
<button onclick="handleClick()">按钮命名</button>

// React 合成事件绑定方式
const button = <button onClick={handleClick}>按钮命名</button>
```

- 事件处理函数书写不同

```jsx
// 原生事件 事件处理函数写法
<button onclick="handleClick()">按钮命名</button>

// React 合成事件 事件处理函数写法
const button = <button onClick={handleClick}>按钮命名</button>
```

虽然`onclick`看似绑定到`DOM`元素上，但实际并不会把事件代理函数直接绑定到真实的节点上，而是把所有的事件绑定到结构的最外层，使用一个统一的事件去监听

这个事件监听器上维持了一个映射来保存所有组件内部的事件监听和处理函数。当组件挂载或卸载时，只是在这个统一的事件监听器上插入或删除一些对象

当事件发生时，首先被这个统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用。这样做简化了事件处理和回收机制，效率也有很大提升

### 二、执行顺序

关于`React`合成事件与原生事件执行顺序，可以看看下面一个例子：

```jsx
import  React  from 'react';
class App extends React.Component{

  constructor(props) {
    super(props);
    this.parentRef = React.createRef();
    this.childRef = React.createRef();
  }
  componentDidMount() {
    console.log("React componentDidMount！");
    this.parentRef.current?.addEventListener("click", () => {
      console.log("原生事件：父元素 DOM 事件监听！");
    });
    this.childRef.current?.addEventListener("click", () => {
      console.log("原生事件：子元素 DOM 事件监听！");
    });
    document.addEventListener("click", (e) => {
      console.log("原生事件：document DOM 事件监听！");
    });
  }
  parentClickFun = () => {
    console.log("React 事件：父元素事件监听！");
  };
  childClickFun = () => {
    console.log("React 事件：子元素事件监听！");
  };
  render() {
    return (
      <div ref={this.parentRef} onClick={this.parentClickFun}>
        <div ref={this.childRef} onClick={this.childClickFun}>
          分析事件执行顺序
        </div>
      </div>
    );
  }
}
export default App;
```

输出顺序为：

```latex
原生事件：子元素 DOM 事件监听！原生事件：父元素 DOM 事件监听！React 事件：子元素事件监听！React 事件：父元素事件监听！原生事件：document DOM 事件监听！
```

可以得出以下结论：

- React 所有事件都挂载在 document 对象上
- 当真实 DOM 元素触发事件，会冒泡到 document 对象后，再处理 React 事件
- 所以会先执行原生事件，然后处理 React 事件
- 最后真正执行 document 上挂载的事件

对应过程如图所示：

![](https://static.vue-js.com/08e22ff0-d870-11eb-ab90-d9ae814b240d.png)

所以想要阻止不同时间段的冒泡行为，对应使用不同的方法，对应如下：

- 阻止合成事件间的冒泡，用e.stopPropagation()
- 阻止合成事件与最外层 document 上的事件间的冒泡，用e.nativeEvent.stopImmediatePropagation()
- 阻止合成事件与除最外层document上的原生事件上的冒泡，通过判断e.target来避免

```jsx
document.body.addEventListener('click', e => {  if (e.target && e.target.matches('div.code')) {    return;  }  this.setState({ active: false });})
```

### 三、总结

`React`事件机制总结如下：

- React 上注册的事件最终会绑定在document这个 DOM 上，而不是 React 组件对应的 DOM(减少内存开销就是因为所有的事件都绑定在 document 上，其他节点没有绑定事件)
- React 自身实现了一套事件冒泡机制，所以这也就是为什么我们 event.stopPropagation()无效的原因。
- React 通过队列的形式，从触发的组件向父组件回溯，然后调用他们 JSX 中定义的 callback
- React 有一套自己的合成事件 SyntheticEvent

[合成事件 – React](https://zh-hans.reactjs.org/docs/events.html)

[React讲解 - 事件系统](https://segmentfault.com/a/1190000015725214?utm_source=sf-similar-article)

[探索 React 合成事件](https://segmentfault.com/a/1190000038251163)

# 说说React Jsx转换成真实DOM过程？

### 一、是什么

`react`通过将组件编写的`JSX`映射到屏幕，以及组件中的状态发生了变化之后 `React`会将这些「变化」更新到屏幕上

在前面文章了解中，`JSX`通过`babel`最终转化成`React.createElement`这种形式，例如：

```jsx
<div>
  < img src="avatar.png" className="profile" />
  <Hello />
</div>
```

会被`bebel`转化成如下：

```jsx
React.createElement(
  "div",
  null,
  React.createElement("img", {
    src: "avatar.png",
    className: "profile"
  }),
  React.createElement(Hello, null)
);
```

在转化过程中，`babel`在编译时会判断 JSX 中组件的首字母：

- 当首字母为小写时，其被认定为原生 `DOM` 标签，`createElement` 的第一个变量被编译为字符串
- 当首字母为大写时，其被认定为自定义组件，createElement 的第一个变量被编译为对象

最终都会通过`RenderDOM.render(...)`方法进行挂载，如下：

```jsx
ReactDOM.render(<App />,  document.getElementById("root"));
```

### 二、过程

在`react`中，节点大致可以分成四个类别：

- 原生标签节点
- 文本节点
- 函数组件
- 类组件

如下所示：

```jsx
class ClassComponent extends Component {
  static defaultProps = {
    color: "pink"
  };
  render() {
    return (
      <div className="border">
        <h3>ClassComponent</h3>
        <p className={this.props.color}>{this.props.name}</p >
      </div>
    );
  }
}

function FunctionComponent(props) {
  return (
    <div className="border">
      FunctionComponent
      <p>{props.name}</p >
    </div>
  );
}

const jsx = (
  <div className="border">
    <p>xx</p >
    < a href=" ">xxx</ a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" color="red" />
  </div>
);
```

这些类别最终都会被转化成`React.createElement`这种形式

`React.createElement`其被调用时会传⼊标签类型`type`，标签属性`props`及若干子元素`children`，作用是生成一个虚拟`Dom`对象，如下所示：

```jsx
function createElement(type, config, ...children) {    if (config) {        delete config.__self;        delete config.__source;    }    // ! 源码中做了详细处理，⽐如过滤掉key、ref等    const props = {        ...config,        children: children.map(child =>   typeof child === "object" ? child : createTextNode(child)  )    };    return {        type,        props    };}function createTextNode(text) {    return {        type: TEXT,        props: {            children: [],            nodeValue: text        }    };}export default {    createElement};
```

`createElement`会根据传入的节点信息进行一个判断：

- 如果是原生标签节点， type 是字符串，如div、span
- 如果是文本节点， type就没有，这里是 TEXT
- 如果是函数组件，type 是函数名
- 如果是类组件，type 是类名

虚拟`DOM`会通过`ReactDOM.render`进行渲染成真实`DOM`，使用方法如下：

```jsx
ReactDOM.render(element, container[ callback])
```

当首次调用时，容器节点里的所有 `DOM` 元素都会被替换，后续的调用则会使用 `React` 的 `diff`算法进行高效的更新

如果提供了可选的回调函数`callback`，该回调将在组件被渲染或更新之后被执行

`render`大致实现方法如下：

```jsx
function render(vnode, container) {    console.log("vnode", vnode); // 虚拟DOM对象    // vnode _> node    const node = createNode(vnode, container);    container.appendChild(node);}// 创建真实DOM节点function createNode(vnode, parentNode) {    let node = null;    const {type, props} = vnode;    if (type === TEXT) {        node = document.createTextNode("");    } else if (typeof type === "string") {        node = document.createElement(type);    } else if (typeof type === "function") {        node = type.isReactComponent            ? updateClassComponent(vnode, parentNode)        : updateFunctionComponent(vnode, parentNode);    } else {        node = document.createDocumentFragment();    }    reconcileChildren(props.children, node);    updateNode(node, props);    return node;}// 遍历下子vnode，然后把子vnode->真实DOM节点，再插入父node中function reconcileChildren(children, node) {    for (let i = 0; i < children.length; i++) {        let child = children[i];        if (Array.isArray(child)) {            for (let j = 0; j < child.length; j++) {                render(child[j], node);            }        } else {            render(child, node);        }    }}function updateNode(node, nextVal) {    Object.keys(nextVal)        .filter(k => k !== "children")        .forEach(k => {        if (k.slice(0, 2) === "on") {            let eventName = k.slice(2).toLocaleLowerCase();            node.addEventListener(eventName, nextVal[k]);        } else {            node[k] = nextVal[k];        }    });}// 返回真实dom节点// 执行函数function updateFunctionComponent(vnode, parentNode) {    const {type, props} = vnode;    let vvnode = type(props);    const node = createNode(vvnode, parentNode);    return node;}// 返回真实dom节点// 先实例化，再执行render函数function updateClassComponent(vnode, parentNode) {    const {type, props} = vnode;    let cmp = new type(props);    const vvnode = cmp.render();    const node = createNode(vvnode, parentNode);    return node;}export default {    render};
```

### 三、总结

在`react`源码中，虚拟`Dom`转化成真实`Dom`整体流程如下图所示：

![](https://static.vue-js.com/28824fa0-f00a-11eb-ab90-d9ae814b240d.png)

其渲染流程如下所示：

- 使用React.createElement或JSX编写React组件，实际上所有的 JSX 代码最后都会转换成React.createElement(…) ，Babel帮助我们完成了这个转换的过程。
- createElement函数对key和ref等特殊的props进行处理，并获取defaultProps对默认props进行赋值，并且对传入的孩子节点进行处理，最终构造成一个虚拟DOM对象
- ReactDOM.render将生成好的虚拟DOM渲染到指定容器上，其中采用了批处理、事务等机制并且对特定浏览器进行了性能优化，最终转换为真实DOM

### 参考文献

- https://bbs.huaweicloud.com/blogs/265503)
- https://huang-qing.github.io/react/2019/05/29/React-VirDom/
- https://segmentfault.com/a/1190000018891454

# React中的key有什么作用？

### 一、是什么

首先，先给出`react`组件中进行列表渲染的一个示例：

```jsx
const data = [
  { id: 0, name: 'abc' },
  { id: 1, name: 'def' },
  { id: 2, name: 'ghi' },
  { id: 3, name: 'jkl' }
];

const ListItem = (props) => {
  return <li>{props.name}</li>;
};

const List = () => {
  return (
    <ul>
      {data.map((item) => (
        <ListItem name={item.name}></ListItem>
      ))}
    </ul>
  );
};
```

然后在输出就可以看到`react`所提示的警告信息：

```latex
Each child in a list should have a unique "key" prop.
```

根据意思就可以得到渲染列表的每一个子元素都应该需要一个唯一的`key`值

在这里可以使用列表的`id`属性作为`key`值以解决上面这个警告

```jsx
const List = () => {
  return (
    <ul>
      {data.map((item) => (
        <ListItem name={item.name} key={item.id}></ListItem>
      ))}
    </ul>
  );
};
```

### 二、作用

跟`Vue`一样，`React` 也存在 `Diff`算法，而元素`key`属性的作用是用于判断元素是新创建的还是被移动的元素，从而减少不必要的元素渲染

因此`key`的值需要为每一个元素赋予一个确定的标识

如果列表数据渲染中，在数据后面插入一条数据，`key`作用并不大，如下：

```jsx
this.state = {
  numbers: [111, 222, 333]
};

function insertMovie() {
  const newMovies = [...this.state.numbers, 444];
  this.setState({
    movies: newMovies
  });
}

<ul>
  {this.state.movies.map((item, index) => {
    return <li>{item}</li>;
  })}
</ul>;

```

前面的元素在`diff`算法中，前面的元素由于是完全相同的，并不会产生删除创建操作，在最后一个比较的时候，则需要插入到新的`DOM`树中

因此，在这种情况下，元素有无`key`属性意义并不大

下面再来看看在前面插入数据时，使用`key`与不使用`key`的区别：

```jsx
function insertMovie() {
    const newMovies = [000, ...this.state.numbers];
    this.setState({movies: newMovies})
}
```

当拥有`key`的时候，`react`根据`key`属性匹配原有树上的子元素以及最新树上的子元素，像上述情况只需要将000元素插入到最前面位置

当没有`key`的时候，所有的`li`标签都需要进行修改

同样，并不是拥有`key`值代表性能越高，如果说只是文本内容改变了，不写`key`反而性能和效率更高

主要是因为不写`key`是将所有的文本内容替换一下，节点不会发生变化

而写`key`则涉及到了节点的增和删，发现旧`key`不存在了，则将其删除，新`key`在之前没有，则插入，这就增加性能的开销

### 三、总结

良好使用`key`属性是性能优化的非常关键的一步，注意事项为：

- key 应该是唯一的
- key不要使用随机值（随机数在下一次 render 时，会重新生成一个数字）
- 使用 index 作为 key值，对性能没有优化

`react`判断`key`的流程具体如下图：

![](https://static.vue-js.com/3b9afe10-dd69-11eb-ab90-d9ae814b240d.png)

### 参考文献

[列表 & Key – React](https://zh-hans.reactjs.org/docs/lists-and-keys.html#gatsby-focus-wrapper)

[react中key的作用](https://segmentfault.com/a/1190000017511836)

[resource](React%20519ec452907447a6a0276c1745a029c9/resource%20b0d65721b8934ca4b49a55eccc9c72e4.md)