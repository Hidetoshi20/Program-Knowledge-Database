# hooks

# Hooks的理解

`Hook` 是 React 16.8 的新增特性。它可以让你在不编写 `class` 的情况下使用 `state` 以及其他的 `React` 特性

至于为什么引入`hook`，官方给出的动机是解决长时间使用和维护`react`过程中常遇到的问题，例如：

- 难以重用和共享组件中的与状态相关的逻辑
- 逻辑复杂的组件难以开发与维护，当我们的组件需要处理多个互不相关的 local state 时，每个生命周期函数中可能会包含着各种互不相关的逻辑在里面
- 类组件中的this增加学习成本，类组件在基于现有工具的优化上存在些许问题
- 由于业务变动，函数组件不得不改为类组件等等

在以前，函数组件也被称为无状态的组件，只负责渲染的一些工作

因此，现在的函数组件也可以是有状态的组件，内部也可以维护自身的状态以及做一些逻辑方面的处理

上面讲到，`Hooks`让我们的函数组件拥有了类组件的特性，例如组件内的状态、生命周期

最常见的`hooks`有如下：

- useState
- useEffect
- 其他

# useState

### setState执行机制

在`react`类组件的状态需要通过`setState`进行更改，在不同场景下对应不同的执行顺序：

- 在组件生命周期或React合成事件中，setState是异步
- 在setTimeout或者原生dom事件中，setState是同步

当我们批量更改`state`的值的时候，`react`内部会将其进行覆盖，只取最后一次的执行结果

当需要下一个`state`依赖当前`state`的时候，则可以在`setState`中传递一个回调函数进行下次更新

### 更新类型

在使用`setState`更新数据的时候，`setState`的更新类型分成：

- 异步更新
- 同步更新

### 异步更新

先举出一个例子：

```jsx
function changeText() {
  this.setState({
    message: "你好啊"
  })
  console.log(this.state.message); // Hello World
}
```

从上面可以看到，最终打印结果为`Hello world`，并不能在执行完`setState`之后立马拿到最新的`state`的结果

如果想要立刻获取更新后的值，在第二个参数的回调中更新后会执行

```jsx
function changeText() {
  this.setState({
    message: "你好啊"
  }, () => {
    console.log(this.state.message); // 你好啊
  });
}
```

### 同步更新

同样先给出一个在`setTimeout`中更新的例子：

```jsx
function changeText() {
  setTimeout(() => {
    this.setState({
      message: "你好啊"
    });
    console.log(this.state.message); // 你好啊
  }, 0);
}
```

上面的例子中，可以看到更新是同步

再来举一个原生`DOM`事件的例子：

```jsx
function componentDidMount() {
  const btnEl = document.getElementById("btn");
  btnEl.addEventListener('click', () => {
    this.setState({
      message: "你好啊,李银河"
    });
    console.log(this.state.message); // 你好啊,李银河
  })
}
```

### 小结

- 在组件生命周期或React合成事件中，setState是异步
- 在setTimeout或者原生dom事件中，setState是同步

### 三、批量更新

同样先给出一个例子：

```jsx
handleClick = () => {
    this.setState({
        count: this.state.count + 1,
    })
    console.log(this.state.count) // 1

    this.setState({
        count: this.state.count + 1,
    })
    console.log(this.state.count) // 1

    this.setState({
        count: this.state.count + 1,
    })
    console.log(this.state.count) // 1
}
```

点击按钮触发事件，打印的都是 1，页面显示 `count` 的值为 2

对同一个值进行多次 `setState`， `setState` 的批量更新策略会对其进行覆盖，取最后一次的执行结果

上述的例子，实际等价于如下：

```jsx
Object.assign(  previousState,  {index: state.count+ 1},  {index: state.count+ 1},)
```

由于后面的数据会覆盖前面的更改，所以最终只加了一次

如果是下一个`state`依赖前一个`state`的话，推荐给`setState`一个参数传入一个`function`，如下：

```jsx
onClick = () => {
    this.setState((prevState, props) => {
      return {count: prevState.count + 1};
    });
    this.setState((prevState, props) => {
      return {count: prevState.count + 1};
    });
}
```

而在`setTimeout`或者原生`dom`事件中，由于是同步的操作，所以并不会进行覆盖现象

### 参考文献

[揭密React setState - 掘金](https://juejin.cn/post/6844903667426918408)

[你真的理解setState吗？ - 掘金](https://juejin.cn/post/6844903636749778958)

[深入 React 的 setState 机制](https://segmentfault.com/a/1190000039077904)

# useEffect

`useEffect`可以让我们在函数组件中进行一些带有副作用的操作

`useEffect`相当于`componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个生命周期函数的组合

# 其它 hooks

在组件通信过程中可以使用`useContext`，`refs`学习中我们也用到了`useRef`获取`DOM`结构……

还有很多额外的`hooks`，如：

- `useReducer`
- `useCallback`
- `useMemo`
- `useRef`

## **`useLayoutEffect`**

[useLayoutEffect和useEffect的区别](https://zhuanlan.zhihu.com/p/348701319)

[使用 State Hook – React](https://zh-hans.reactjs.org/docs/hooks-state.html)

[使用 Effect Hook – React](https://zh-hans.reactjs.org/docs/hooks-effect.html)

[10分钟了解 react 引入的 Hooks - sfornt - 博客园](https://www.cnblogs.com/lalalagq/p/9898531.html)

# refs

### 一、是什么

`Refs` 在计算机中称为弹性文件系统（英语：Resilient File System，简称ReFS）

`React` 中的 `Refs`提供了一种方式，允许我们访问 `DOM`节点或在 `render`方法中创建的 `React`元素

本质为`ReactDOM.render()`返回的组件实例，如果是渲染组件则返回的是组件实例，如果渲染`dom`则返回的是具体的`dom`节点

### 二、如何使用

创建`ref`的形式有三种：

- 传入字符串，使用时通过 this.refs.传入的字符串的格式获取对应的元素
- 传入对象，对象是通过 React.createRef() 方式创建出来，使用时获取到创建的对象中存在 current 属性就是对应的元素
- 传入函数，该函数会在 DOM 被挂载时进行回调，这个函数会传入一个 元素对象，可以自己保存，使用时，直接拿到之前保存的元素对象即可
- 传入hook，hook是通过 useRef() 方式创建，使用时通过生成hook对象的 current 属性就是对应的元素

### 传入字符串

只需要在对应元素或组件中`ref`属性

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref="myref" />;
  }
}
```

访问当前节点的方式如下：

```jsx
this.refs.myref.innerHTML = "hello";
```

### 传入对象

`refs`通过`React.createRef()`创建，然后将`ref`属性添加到`React`元素中，如下：

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

当 `ref` 被传递给 `render` 中的元素时，对该节点的引用可以在 `ref` 的 `current` 属性中访问

```jsx
const node = this.myRef.current;
```

### 传入函数

当`ref`传入为一个函数的时候，在渲染过程中，回调函数参数会传入一个元素对象，然后通过实例将对象进行保存

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={element => this.myref = element} />;
  }
}
```

获取`ref`对象只需要通过先前存储的对象即可

```jsx
const node = this.myref
```

### 传入hook

通过`useRef`创建一个`ref`，整体使用方式与`React.createRef`一致

```jsx
function App(props) {
  const myref = useRef()
  return (
    <>
      <div ref={myref}></div>
    </>
  )
}
```

获取`ref`属性也是通过`hook`对象的`current`属性

```jsx
const node = myref.current;
```

上述三种情况都是`ref`属性用于原生`HTML`元素上，如果`ref`设置的组件为一个类组件的时候，`ref`对象接收到的是组件的挂载实例

注意的是，不能在函数组件上使用`ref`属性，因为他们并没有实例

### 三、应用场景

在某些情况下，我们会通过使用`refs`来更新组件，但这种方式并不推荐，更多情况我们是通过`props`与`state`的方式进行去重新渲染子元素

过多使用`refs`，会使组件的实例或者是`DOM`结构暴露，违反组件封装的原则

例如，避免在 `Dialog` 组件里暴露 `open()` 和 `close()` 方法，最好传递 `isOpen` 属性

但下面的场景使用`refs`非常有用：

- 对Dom元素的焦点控制、内容选择、控制
- 对Dom元素的内容设置及媒体播放
- 对Dom元素的操作和对组件实例的操作
- 集成第三方 DOM 库

### 参考文献

[Refs and the DOM – React](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html)

[你想知道的关于 Refs 的知识都在这了](https://segmentfault.com/a/1190000020842342)

[web前端面试 - 面试官系列](https://vue3js.cn/interview)