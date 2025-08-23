# React Hooks (React 钩子)

## Understanding Hooks (Hooks 的理解)

`Hook` is a new feature introduced in React 16.8 (是 React 16.8 的新增特性). It allows you to use `state` and other React features without writing a `class` (它可以让你在不编写 `class` 的情况下使用 `state` 以及其他的 `React` 特性).

### Why Hooks Were Introduced (为什么引入 Hook)

The official motivation (官方给出的动机) is to solve common problems encountered during long-term React usage and maintenance (解决长时间使用和维护 React 过程中常遇到的问题), such as:

- **Difficult to reuse and share stateful logic (难以重用和共享组件中的与状态相关的逻辑)** between components
- **Complex components are hard to develop and maintain (逻辑复杂的组件难以开发与维护)**: When components need to handle multiple unrelated local states (当我们的组件需要处理多个互不相关的 local state 时), each lifecycle method may contain various unrelated logic (每个生命周期函数中可能会包含着各种互不相关的逻辑)
- **`this` in class components increases learning cost (类组件中的 this 增加学习成本)**, and class components have optimization issues with existing tools (类组件在基于现有工具的优化上存在些许问题)
- **Business changes force function components to be converted to class components (由于业务变动，函数组件不得不改为类组件)**, etc.

### Function Components Evolution (函数组件的演进)

Previously (在以前), function components were also called stateless components (函数组件也被称为无状态的组件), only responsible for rendering work (只负责渲染的一些工作).

Now (现在), function components can also be stateful components (函数组件也可以是有状态的组件), capable of maintaining their own state and handling logic (内部也可以维护自身的状态以及做一些逻辑方面的处理).

`Hooks` give our function components the characteristics of class components (让我们的函数组件拥有了类组件的特性), such as internal state and lifecycle (例如组件内的状态、生命周期).

### Most Common Hooks (最常见的 Hooks)

- `useState`
- `useEffect`  
- Others (其他)

## useState Hook

### setState Execution Mechanism (setState 执行机制)

In React class components (在 React 类组件中), state needs to be changed through `setState` (状态需要通过 `setState` 进行更改), with different execution orders in different scenarios (在不同场景下对应不同的执行顺序):

- **In component lifecycle or React synthetic events (在组件生命周期或 React 合成事件中)**: `setState` is asynchronous (setState 是异步的)
- **In setTimeout or native DOM events (在 setTimeout 或者原生 DOM 事件中)**: `setState` is synchronous (setState 是同步的)

When we batch update `state` values (当我们批量更改 `state` 的值的时候), React internally will override them (React 内部会将其进行覆盖), only taking the result of the last execution (只取最后一次的执行结果).

When the next `state` depends on the current `state` (当需要下一个 `state` 依赖当前 `state` 的时候), you can pass a callback function in `setState` for the next update (则可以在 `setState` 中传递一个回调函数进行下次更新).

### Update Types (更新类型)

When using `setState` to update data (在使用 `setState` 更新数据的时候), `setState` update types are divided into (setState 的更新类型分成):

- **Asynchronous Updates (异步更新)**
- **Synchronous Updates (同步更新)**

#### Asynchronous Updates (异步更新)

Here's an example (先举出一个例子):

```jsx
function changeText() {
  this.setState({
    message: "Hello React"
  })
  console.log(this.state.message); // Still shows old value
}
```

From the above, we can see (从上面可以看到) that the final printed result is the old value (最终打印结果为旧值), and we cannot immediately get the latest `state` result after executing `setState` (并不能在执行完 `setState` 之后立马拿到最新的 `state` 的结果).

If you want to immediately get the updated value (如果想要立刻获取更新后的值), use the callback in the second parameter (在第二个参数的回调中更新后会执行):

```jsx
function changeText() {
  this.setState({
    message: "Hello React"
  }, () => {
    console.log(this.state.message); // Shows updated value
  });
}
```

#### Synchronous Updates (同步更新)

Here's an example with `setTimeout` (同样先给出一个在 `setTimeout` 中更新的例子):

```jsx
function changeText() {
  setTimeout(() => {
    this.setState({
      message: "Hello React"
    });
    console.log(this.state.message); // Shows updated value immediately
  }, 0);
}
```

In the above example (上面的例子中), we can see the update is synchronous (可以看到更新是同步的).

Here's another example with native DOM events (再来举一个原生 DOM 事件的例子):

```jsx
function componentDidMount() {
  const btnEl = document.getElementById("btn");
  btnEl.addEventListener('click', () => {
    this.setState({
      message: "Hello from native event"
    });
    console.log(this.state.message); // Shows updated value immediately
  })
}
```

#### Summary (小结)

- **In component lifecycle or React synthetic events (在组件生命周期或 React 合成事件中)**: `setState` is asynchronous (setState 是异步的)
- **In setTimeout or native DOM events (在 setTimeout 或者原生 DOM 事件中)**: `setState` is synchronous (setState 是同步的)

### Batch Updates (批量更新)

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

## useEffect Hook

`useEffect` allows us to perform side effects (可以让我们进行一些带有副作用的操作) in function components (在函数组件中).

`useEffect` is equivalent to the combination (相当于组合) of `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` lifecycle methods (这三个生命周期函数的组合).

### Basic Usage (基本用法)

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    // Update document title
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### Cleanup Effects (清理副作用)

```jsx
useEffect(() => {
  // Setup subscription
  const subscription = subscribeToSomething();
  
  // Cleanup function (similar to componentWillUnmount)
  return () => {
    subscription.unsubscribe();
  };
}, []); // Empty dependency array means this effect runs once
```

## Other Hooks (其它 Hooks)

In component communication (在组件通信过程中), we can use `useContext` (可以使用 `useContext`). In refs learning (在 refs 学习中), we also used `useRef` to get DOM structure (我们也用到了 `useRef` 获取 DOM 结构)...

There are many additional hooks (还有很多额外的 hooks), such as:

- **`useReducer`**: For complex state logic (用于复杂状态逻辑)
- **`useCallback`**: Memoizes callback functions (缓存回调函数)
- **`useMemo`**: Memoizes expensive calculations (缓存昂贵的计算)
- **`useRef`**: Access DOM elements or store mutable values (访问 DOM 元素或存储可变值)

### `useLayoutEffect`

`useLayoutEffect` has the same signature as `useEffect` (与 `useEffect` 具有相同的签名), but it fires synchronously after all DOM mutations (但它在所有 DOM 变更之后同步触发). Use this to read layout from the DOM and synchronously re-render (用于从 DOM 读取布局并同步重新渲染).

**Key Difference (主要区别)**:
- `useEffect`: Runs after the render is committed to the screen (在渲染提交到屏幕后运行)
- `useLayoutEffect`: Runs synchronously after all DOM mutations but before the browser paints (在所有 DOM 变更后但在浏览器绘制前同步运行)

## Refs in React (React 中的 Refs)

### What are Refs? (什么是 Refs?)

`Refs` in React provide a way (提供了一种方式) to access DOM nodes or React elements created in the `render` method (允许我们访问 DOM 节点或在 render 方法中创建的 React 元素).

Essentially (本质为), they are component instances returned by `ReactDOM.render()` (ReactDOM.render() 返回的组件实例). If rendering a component, it returns the component instance (如果是渲染组件则返回的是组件实例); if rendering a DOM element, it returns the specific DOM node (如果渲染 DOM 则返回的是具体的 DOM 节点).

### How to Use Refs (如何使用 Refs)

There are four ways to create `ref` (创建 ref 的形式有四种):

1. **String Refs (字符串 Refs)** - ⚠️ Deprecated (已废弃): Access via `this.refs.stringName` (使用时通过 this.refs.传入的字符串的格式获取对应的元素)
2. **Object Refs (对象 Refs)**: Created via `React.createRef()` (对象是通过 React.createRef() 方式创建出来), access via `ref.current` (使用时获取到创建的对象中存在 current 属性就是对应的元素)
3. **Callback Refs (回调 Refs)**: Function called when DOM is mounted (该函数会在 DOM 被挂载时进行回调), receives element object as parameter (这个函数会传入一个元素对象，可以自己保存)
4. **Hook Refs (Hook Refs)**: Created via `useRef()` (hook 是通过 useRef() 方式创建), access via `hookRef.current` (使用时通过生成 hook 对象的 current 属性就是对应的元素)

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

## References (参考文献)

### Official Documentation (官方文档)
- [Using the State Hook – React (使用 State Hook)](https://zh-hans.reactjs.org/docs/hooks-state.html)
- [Using the Effect Hook – React (使用 Effect Hook)](https://zh-hans.reactjs.org/docs/hooks-effect.html)
- [Refs and the DOM – React (Refs 和 DOM)](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html)

### Additional Resources (其他资源)
- [Understanding React setState (揭密 React setState)](https://juejin.cn/post/6844903667426918408)
- [Do You Really Understand setState? (你真的理解 setState 吗？)](https://juejin.cn/post/6844903636749778958)
- [Deep Dive into React setState Mechanism (深入 React 的 setState 机制)](https://segmentfault.com/a/1190000039077904)
- [useLayoutEffect vs useEffect Differences (useLayoutEffect 和 useEffect 的区别)](https://zhuanlan.zhihu.com/p/348701319)
- [Everything You Want to Know About Refs (你想知道的关于 Refs 的知识都在这了)](https://segmentfault.com/a/1190000020842342)
- [10 Minutes to Understand React Hooks (10分钟了解 React 引入的 Hooks)](https://www.cnblogs.com/lalalagq/p/9898531.html)