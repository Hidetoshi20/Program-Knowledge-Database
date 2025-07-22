# component

# 说说对受控组件和非受控组件的理解？应用场景？

### 一、受控组件

受控组件，简单来讲，就是受我们控制的组件，组件的状态全程响应外部数据

举个简单的例子：

```jsx
class TestComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = { username: 'lindaidai' };
  }
  render () {
    return <input name="username" value={this.state.username} />
  }
}
```

这时候当我们在输入框输入内容的时候，会发现输入的内容并无法显示出来，也就是`input`标签是一个可读的状态

这是因为`value`被`this.state.username`所控制住。当用户输入新的内容时，`this.state.username`并不会自动更新，这样的话`input`内的内容也就不会变了

如果想要解除被控制，可以为`input`标签设置`onChange`事件，输入的时候触发事件函数，在函数内部实现`state`的更新，从而导致`input`框的内容页发现改变

因此，受控组件我们一般需要初始状态和一个状态更新事件函数

### 二、非受控组件

非受控组件，简单来讲，就是不受我们控制的组件

一般情况是在初始化的时候接受外部数据，然后自己在内部存储其自身状态

当需要时，可以使用`ref` 查询 `DOM`并查找其当前值，如下：

```jsx
import React, { Component } from 'react';

export class UnControll extends Component {
  constructor (props) {
    super(props);
    this.inputRef = React.createRef();
  }
  handleSubmit = (e) => {
    console.log('我们可以获得input内的值为', this.inputRef.current.value);
    e.preventDefault();
  }
  render () {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <input defaultValue="lindaidai" ref={this.inputRef} />
        <input type="submit" value="提交" />
      </form>
    )
  }
}
```

关于`refs`的详情使用可以参考[之前文章](https://mp.weixin.qq.com/s/ZBKWcslVBi0IKQgz7lYzbA)

### 三、应用场景

大部分时候推荐使用受控组件来实现表单，因为在受控组件中，表单数据由`React`组件负责处理

如果选择非受控组件的话，控制能力较弱，表单数据就由`DOM`本身处理，但更加方便快捷，代码量少

针对两者的区别，其应用场景如下图所示：

![](https://static.vue-js.com/f28aed20-df2f-11eb-ab90-d9ae814b240d.png)

### 参考文献

- http://meloguo.com/2018/10/08/受控与非受控组件/
- https://zhuanlan.zhihu.com/p/37579677

# Component

在 `React` 中，一切皆为组件。通常将应用程序的整个逻辑分解为小的单个部分。 我们将每个单独的部分称为组件

组件可以是一个函数或者是一个类，接受数据输入，处理它并返回在 `UI` 中呈现的 `React` 元素

函数式组件如下：

```jsx
const Header = () => {
  return (
    <Jumbotron style={{ backgroundColor: "orange" }}>
      <h1>TODO App</h1>
    </Jumbotron>
  );
};
```

类组件（有状态组件）如下：

```jsx
class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div className="dashboard">
        <ToDoForm />
        <ToDolist />
      </div>
    );
  }
}
```

一个组件该有的特点如下：

- 可组合：每个组件易于和其它组件一起使用，或者嵌套在另一个组件内部
- 可重用：每个组件都是具有独立功能的，它可以被使用在多个 UI 场景
- 可维护：每个小的组件仅仅包含自身的逻辑，更容易被理解和维护

### 三、优势

通过上面的初步了解，可以感受到 `React` 存在的优势：

- 高效灵活
- 声明式的设计，简单使用
- 组件式开发，提高代码复用率
- 单向响应的数据流会比双向绑定的更安全，速度更快

[](https://segmentfault.com/a/1190000015924762)

[React 官方中文文档](https://react.docschina.org/)

## 类组件

类组件，顾名思义，也就是通过使用`ES6`类的编写形式去编写组件，该类必须继承`React.Component`

如果想要访问父组件传递过来的参数，可通过`this.props`的方式去访问

在组件中必须实现`render`方法，在`return`中返回`React`对象，如下：

```jsx
class Welcome extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

## 函数组件

函数组件，顾名思义，就是通过函数编写的形式去实现一个`React`组件，是`React`中定义组件最简单的方式

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

函数第一个参数为`props`用于接收父组件传递过来的参数

## 区别

针对两种`React`组件，其区别主要分成以下几大方向：

- 编写形式
- 状态管理
- 生命周期
- 调用方式
- 获取渲染的值

### 编写形式

两者最明显的区别在于编写形式的不同，同一种功能的实现可以分别对应类组件和函数组件的编写形式

函数组件：

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

类组件：

```jsx
class Welcome extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

### 状态管理

在`hooks`出来之前，函数组件就是无状态组件，不能保管组件的状态，不像类组件中调用`setState`

如果想要管理`state`状态，可以使用`useState`，如下：

```jsx
const FunctionalComponent = () => {
    const [count, setCount] = React.useState(0);

    return (
        <div>
            <p>count: {count}</p >
            <button onClick={() => setCount(count + 1)}>Click</button>
        </div>
    );
};

```

在使用`hooks`情况下，一般如果函数组件调用`state`，则需要创建一个类组件或者`state`提升到你的父组件中，然后通过`props`对象传递到子组件

### 生命周期

在函数组件中，并不存在生命周期，这是因为这些生命周期钩子都来自于继承的`React.Component`

所以，如果用到生命周期，就只能使用类组件

但是函数组件使用`useEffect`也能够完成替代生命周期的作用，这里给出一个简单的例子：

```jsx
const FunctionalComponent = () => {
    useEffect(() => {
        console.log("Hello");
    }, []);
    return <h1>Hello, World</h1>;
};
```

上述简单的例子对应类组件中的`componentDidMount`生命周期

如果在`useEffect`回调函数中`return`一个函数，则`return`函数会在组件卸载的时候执行，正如`componentWillUnmount`

```jsx
const FunctionalComponent = () => {
 React.useEffect(() => {
   return () => {
     console.log("Bye");
   };
 }, []);
 return <h1>Bye, World</h1>;
};

```

### 调用方式

如果是一个函数组件，调用则是执行函数即可：

```jsx
// 你的代码
function SayHi() {
    return <p>Hello, React</p >
}
// React内部
const result = SayHi(props) // » <p>Hello, React</p >
```

如果是一个类组件，则需要将组件进行实例化，然后调用实例对象的`render`方法：

```jsx
// 你的代码
class SayHi extends React.Component {
    render() {
        return <p>Hello, React</p >
    }
}
// React内部
const instance = new SayHi(props) // » SayHi {}
const result = instance.render() // » <p>Hello, React</p >
```

### 获取渲染的值

首先给出一个示例

函数组件对应如下：

```jsx
function ProfilePage(props) {
  const showMessage = () => {
    alert('Followed ' + props.user);
  }

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  }

  return (
    <button onClick={handleClick}>Follow</button>
  )
}
```

类组件对应如下：

```jsx
class ProfilePage extends React.Component {
  showMessage() {
    alert('Followed ' + this.props.user);
  }

  handleClick() {
    setTimeout(this.showMessage.bind(this), 3000);
  }

  render() {
    return <button onClick={this.handleClick.bind(this)}>Follow</button>
  }
}
```

两者看起来实现功能是一致的，但是在类组件中，输出`this.props.user`，`Props`在 `React`中是不可变的所以它永远不会改变，但是 `this` 总是可变的，以便您可以在 `render` 和生命周期函数中读取新版本

因此，如果我们的组件在请求运行时更新。`this.props` 将会改变。`showMessage`方法从“最新”的 `props` 中读取 `user`

而函数组件，本身就不存在`this`，`props`并不发生改变，因此同样是点击，`alert`的内容仍旧是之前的内容

### 小结

两种组件都有各自的优缺点

函数组件语法更短、更简单，这使得它更容易开发、理解和测试

而类组件也会因大量使用 `this`而让人感到困惑

[组件 & Props – React](https://zh-hans.reactjs.org/docs/components-and-props.html#function-and-class-components)

[【译】 React官方：函数组件与类组件的差异 ？ - 掘金](https://juejin.cn/post/6844903806140973069)

# React构建组件的方式有哪些？区别？

组件就是把图形、非图形的各种逻辑均抽象为一个统一的概念（组件）来实现开发的模式

在`React`中，一个类、一个函数都可以视为一个组件

在[之前文章](https://mp.weixin.qq.com/s/Wi0r38LBopsyQ9HesMID0g)中，我们了解到组件所存在的优势：

- 降低整个系统的耦合度，在保持接口不变的情况下，我们可以替换不同的组件快速完成需求，例如输入框，可以替换为日历、时间、范围等组件作具体的实现
- 调试方便，由于整个系统是通过组件组合起来的，在出现问题的时候，可以用排除法直接移除组件，或者根据报错的组件快速定位问题，之所以能够快速定位，是因为每个组件之间低耦合，职责单一，所以逻辑会比分析整个系统要简单
- 提高可维护性，由于每个组件的职责单一，并且组件在系统中是被复用的，所以对代码进行优化可获得系统的整体升级

### 二、如何构建

在`React`目前来讲，组件的创建主要分成了三种方式：

- 函数式创建
- 通过 React.createClass 方法创建
- 继承 React.Component 创建

### 函数式创建

在`React Hooks`出来之前，函数式组件可以视为无状态组件，只负责根据传入的`props`来展示视图，不涉及对`state`状态的操作

大多数组件可以写为无状态组件，通过简单组合构建其他组件

在`React`中，通过函数简单创建组件的示例如下：

```jsx
function HelloComponent(props, /* context */) {
  return <div>Hello {props.name}</div>
}
```

### 通过 React.createClass 方法创建

`React.createClass`是react刚开始推荐的创建组件的方式，目前这种创建方式已经不怎么用了

像上述通过函数式创建的组件的方式，最终会通过`babel`转化成`React.createClass`这种形式，转化成如下：

```jsx
function HelloComponent(props) /* context */{
  return React.createElement(
    "div",
    null,
    "Hello ",
    props.name
  );
}
```

由于上述的编写方式过于冗杂，目前基本上不使用上

### 继承 React.Component 创建

同样在`react hooks`出来之前，有状态的组件只能通过继承`React.Component`这种形式进行创建

有状态的组件也就是组件内部存在维护的数据，在类创建的方式中通过`this.state`进行访问

当调用`this.setState`修改组件的状态时，组价会再次会调用`render()`方法进行重新渲染

通过继承`React.Component`创建一个时钟示例如下：

```jsx
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  tick() {
    this.setState(state => ({
      seconds: state.seconds + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        Seconds: {this.state.seconds}
      </div>
    );
  }
}
```

### 三、区别

由于`React.createClass`创建的方式过于冗杂，并不建议使用

而像函数式创建和类组件创建的区别主要在于需要创建的组件是否需要为有状态组件：

- 对于一些无状态的组件创建，建议使用函数式创建的方式
- 由于`react hooks`的出现，函数式组件创建的组件通过使用`hooks`方法也能使之成为有状态组件，再加上目前推崇函数式编程，所以这里建议都使用函数式的方式来创建组件

在考虑组件的选择原则上，能用无状态组件则用无状态组件

### 参考文献

- https://react.docschina.org/

# 高阶组件

### 一、是什么

高阶函数（Higher-order function），至少满足下列一个条件的函数

- 接受一个或多个函数作为输入
- 输出一个函数

在`React`中，高阶组件即接受一个或多个组件作为参数并且返回一个组件，本质也就是一个函数，并不是一个组件

```jsx
const EnhancedComponent = highOrderComponent(WrappedComponent);
```

上述代码中，该函数接受一个组件`WrappedComponent`作为参数，返回加工过的新组件`EnhancedComponent`

高阶组件的这种实现方式，本质上是一个装饰者设计模式

### 二、如何编写

最基本的高阶组件的编写模板如下：

```jsx
import React, { Component } from 'react';

export default (WrappedComponent) => {
  return class EnhancedComponent extends Component {
    // do something
    render() {
      return <WrappedComponent />;
    }
  }
}
```

通过对传入的原始组件 `WrappedComponent` 做一些你想要的操作（比如操作 props，提取 state，给原始组件包裹其他元素等），从而加工出想要的组件 `EnhancedComponent`

把通用的逻辑放在高阶组件中，对组件实现一致的处理，从而实现代码的复用

所以，高阶组件的主要功能是封装并分离组件的通用逻辑，让通用逻辑在组件间更好地被复用

但在使用高阶组件的同时，一般遵循一些约定，如下：

- props 保持一致
- 你不能在函数式（无状态）组件上使用 ref 属性，因为它没有实例
- 不要以任何方式改变原始组件 WrappedComponent
- 透传不相关 props 属性给被包裹的组件 WrappedComponent
- 不要再 render() 方法中使用高阶组件
- 使用 compose 组合高阶组件
- 包装显示名字以便于调试

这里需要注意的是，高阶组件可以传递所有的`props`，但是不能传递`ref`

如果向一个高阶组件添加`refe`引用，那么`ref` 指向的是最外层容器组件实例的，而不是被包裹的组件，如果需要传递`refs`的话，则使用`React.forwardRef`，如下：

```jsx
function withLogging(WrappedComponent) {
    class Enhance extends WrappedComponent {
        componentWillReceiveProps() {
            console.log('Current props', this.props);
            console.log('Next props', nextProps);
        }
        render() {
            const {forwardedRef, ...rest} = this.props;
            // 把 forwardedRef 赋值给 ref
            return <WrappedComponent {...rest} ref={forwardedRef} />;
        }
    };

    // React.forwardRef 方法会传入 props 和 ref 两个参数给其回调函数
    // 所以这边的 ref 是由 React.forwardRef 提供的
    function forwardRef(props, ref) {
        return <Enhance {...props} forwardRef={ref} />
    }

    return React.forwardRef(forwardRef);
}
const EnhancedComponent = withLogging(SomeComponent);
```

### 三、应用场景

通过上面的了解，高阶组件能够提高代码的复用性和灵活性，在实际应用中，常常用于与核心业务无关但又在多个模块使用的功能，如权限控制、日志记录、数据校验、异常处理、统计上报等

举个例子，存在一个组件，需要从缓存中获取数据，然后渲染。一般情况，我们会如下编写：

```jsx
import React, { Component } from 'react'

class MyComponent extends Component {

  componentWillMount() {
      let data = localStorage.getItem('data');
      this.setState({data});
  }

  render() {
    return <div>{this.state.data}</div>
  }
}
```

上述代码当然可以实现该功能，但是如果还有其他组件也有类似功能的时候，每个组件都需要重复写`componentWillMount`中的代码，这明显是冗杂的

下面就可以通过高价组件来进行改写，如下：

```jsx
import React, { Component } from 'react'

function withPersistentData(WrappedComponent) {
  return class extends Component {
    componentWillMount() {
      let data = localStorage.getItem('data');
        this.setState({data});
    }

    render() {
      // 通过{...this.props} 把传递给当前组件的属性继续传递给被包装的组件WrappedComponent
      return <WrappedComponent data={this.state.data} {...this.props} />
    }
  }
}

class MyComponent2 extends Component {
  render() {
    return <div>{this.props.data}</div>
  }
}

const MyComponentWithPersistentData = withPersistentData(MyComponent2)
```

再比如组件渲染性能监控，如下：

```jsx
class Home extends React.Component {
    render() {
        return (<h1>Hello World.</h1>);
    }
}
function withTiming(WrappedComponent) {
    return class extends WrappedComponent {
        constructor(props) {
            super(props);
            this.start = 0;
            this.end = 0;
        }
        componentWillMount() {
            super.componentWillMount && super.componentWillMount();
            this.start = Date.now();
        }
        componentDidMount() {
            super.componentDidMount && super.componentDidMount();
            this.end = Date.now();
            console.log(`${WrappedComponent.name} 组件渲染时间为 ${this.end - this.start} ms`);
        }
        render() {
            return super.render();
        }
    };
}

export default withTiming(Home);
```

### 参考文献

- https://zh-hans.reactjs.org/docs/higher-order-components.html#gatsby-focus-wrapper
- https://zh.wikipedia.org/wiki/%E9%AB%98%E9%98%B6%E5%87%BD%E6%95%B0
- https://segmentfault.com/a/1190000010307650
- https://zhuanlan.zhihu.com/p/61711492

# super()和super(props)有什么区别？

在`React`中，类组件基于`ES6`，所以在`constructor`中必须使用`super`

在调用`super`过程，无论是否传入`props`，`React`内部都会将`porps`赋值给组件实例`porps`属性中

如果只调用了`super()`，那么`this.props`在`super()`和构造函数结束之间仍是`undefined`

### super() 和 super(props) 有什么区别？

### 一、ES6 类

在 `ES6` 中，通过 `extends` 关键字实现类的继承，方式如下：

```jsx
class sup {  constructor(name) {    this.name = name;  }  printName() {    console.log(this.name);  }}class sub extends sup {  constructor(name, age) {    super(name); // super代表的事父类的构造函数    this.age = age;  }  printAge() {    console.log(this.age);  }}let jack = new sub("jack", 20);jack.printName(); //输出 : jackjack.printAge(); //输出 : 20
```

在上面的例子中，可以看到通过 `super` 关键字实现调用父类，`super` 代替的是父类的构建函数，使用 `super(name)` 相当于调用 `sup.prototype.constructor.call(this,name)`

如果在子类中不使用 `super`，关键字，则会引发报错，如下：

![](https://static.vue-js.com/6ab40190-d71c-11eb-85f6-6fac77c0c9b3.png)

报错的原因是 子类是没有自己的 `this` 对象的，它只能继承父类的 `this` 对象，然后对其进行加工

而 `super()` 就是将父类中的 `this` 对象继承给子类的，没有 `super()` 子类就得不到 `this` 对象

如果先调用 `this`，再初始化 `super()`，同样是禁止的行为

```jsx
class sub extends sup {  constructor(name, age) {    this.age = age;    super(name); // super代表的事父类的构造函数  }}
```

所以在子类 `constructor` 中，必须先代用 `super` 才能引用 `this`

### 二、类组件

在 `React` 中，类组件是基于 `ES6` 的规范实现的，继承 `React.Component`，因此如果用到 `constructor` 就必须写 `super()` 才初始化 `this`

这时候，在调用 `super()` 的时候，我们一般都需要传入 `props` 作为参数，如果不传进去，`React` 内部也会将其定义在组件实例中

```jsx
// React 内部const instance = new YourComponent(props);instance.props = props;
```

所以无论有没有 `constructor`，在 `render` 中 `this.props` 都是可以使用的，这是 `React` 自动附带的，是可以不写的：

```jsx
class HelloMessage extends React.Component {
  render() {
    return <div>nice to meet you! {this.props.name}</div>;
  }
}
```

但是也不建议使用 `super()` 代替 `super(props)`

因为在 `React` 会在类组件构造函数生成实例后再给 `this.props` 赋值，所以在不传递 `props` 在 `super` 的情况下，调用 `this.props` 为 `undefined`，如下情况：

```jsx
class Button extends React.Component {
  constructor(props) {
    super(); // 没传入 props
    console.log(props);      //  {}
    console.log(this.props); //  undefined
    // ...
  }
}
```

而传入 `props` 的则都能正常访问，确保了 `this.props` 在构造函数执行完毕之前已被赋值，更符合逻辑，如下：

```jsx
class Button extends React.Component {
  constructor(props) {
    super(props); // 没传入 props
    console.log(props);      //  {}
    console.log(this.props); //  {}
    // ...
  }
}
```

### 三、总结

在 `React` 中，类组件基于 `ES6`，所以在 `constructor` 中必须使用 `super`

在调用 `super` 过程，无论是否传入 `props`，`React` 内部都会将 `porps` 赋值给组件实例 `porps` 属性中

如果只调用了 `super()`，那么 `this.props` 在 `super()` 和构造函数结束之间仍是 `undefined`

### 参考文献

- [https://overreacted.io/zh-hans/why-do-we-write-super-props/](https://overreacted.io/zh-hans/why-do-we-write-super-props/)
- [https://segmentfault.com/q/1010000008340434](https://segmentfault.com/q/1010000008340434)

# state 和 props有什么区别？

两者相同点：

- 两者都是 JavaScript 对象
- 两者都是用于保存信息
- props 和 state 都能触发渲染更新

区别：

- props 是外部传递给组件的，而 state 是在组件内被组件自己管理的，一般在 constructor 中初始化
- props 在组件内部是不可修改的，但 state 在组件内部可以进行修改
- state 是多变的、可以修改

### 一、state

一个组件的显示形态可以由数据状态和外部参数所决定，而数据状态就是 `state`，一般在 `constructor` 中初始化

当需要修改里面的值的状态需要通过调用 `setState` 来改变，从而达到更新组件内部数据的作用，并且重新调用组件 `render` 方法，如下面的例子：

```jsx
class Button extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0,
    };
  }

  updateCount() {
    this.setState((prevState, props) => {
      return { count: prevState.count + 1 };
    });
  }

  render() {
    return (
      <button onClick={() => this.updateCount()}>
        Clicked {this.state.count} times
      </button>
    );
  }
}
```

`setState` 还可以接受第二个参数，它是一个函数，会在 `setState` 调用完成并且组件开始重新渲染时被调用，可以用来监听渲染是否完成

```jsx
this.setState(  {    name: "JS每日一题",  },  () => console.log("setState finished"));
```

### 二、props

`React` 的核心思想就是组件化思想，页面会被切分成一些独立的、可复用的组件

组件从概念上看就是一个函数，可以接受一个参数作为输入值，这个参数就是 `props`，所以可以把 `props` 理解为从外部传入组件内部的数据

`react` 具有单向数据流的特性，所以他的主要作用是从父组件向子组件中传递数据

`props` 除了可以传字符串，数字，还可以传递对象，数组甚至是回调函数，如下：

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello {this.props.name}</h1>;
  }
}

const element = <Welcome name="Sara" onNameChanged={this.handleName} />;
```

上述 `name` 属性与 `onNameChanged` 方法都能在子组件的 `props` 变量中访问

在子组件中，`props` 在内部不可变的，如果想要改变它看，只能通过外部组件传入新的 `props` 来重新渲染子组件，否则子组件的 `props` 和展示形式不会改变

### 三、区别

相同点：

- 两者都是 JavaScript 对象
- 两者都是用于保存信息
- props 和 state 都能触发渲染更新

区别：

- props 是外部传递给组件的，而 state 是在组件内被组件自己管理的，一般在 constructor 中初始化
- props 在组件内部是不可修改的，但 state 在组件内部可以进行修改
- state 是多变的、可以修改

### 参考文献

- [https://lucybain.com/blog/2016/react-state-vs-pros/](https://lucybain.com/blog/2016/react-state-vs-pros/)
- [https://juejin.cn/post/6844904009203974158](https://juejin.cn/post/6844904009203974158)