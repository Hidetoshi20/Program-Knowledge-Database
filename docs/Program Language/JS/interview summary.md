
# JavaScript Interview Summary

## ECMAScript

### 1. 8种数据类型

*   **基本数据类型**: `Number`, `String`, `Boolean`, `Null`, `Undefined`, `Symbol`, `BigInt`
*   **引用数据类型**: `Object`

### 2. var、let、const 区别

*   **`var`**: 函数作用域，可以重复声明，存在变量提升。
*   **`let`**: 块级作用域，不能重复声明，不存在变量提升。
*   **`const`**: 块级作用域，不能重复声明，不存在变量提升，声明时必须赋值，且赋值后不能修改（对于引用类型，不能修改其指向的地址，但可以修改其内部的属性）。

### 3. 布尔与falsy值

在JavaScript中，有以下几个值为 `falsy` 值：

*   `false`
*   `0`
*   `""` (空字符串)
*   `null`
*   `undefined`
*   `NaN`

### 4. 类型转换

*   **显式转换**: `Number()`, `String()`, `Boolean()`
*   **隐式转换**: `+`, `==`, `if()` 等

### 5. 基础类型和引用类型

*   **基础类型**: 值存储在栈内存中，赋值时是值的拷贝。
*   **引用类型**: 值存储在堆内存中，栈内存中存储的是指向堆内存的地址，赋值时是地址的拷贝。

### 6. 常见运算符（+、+=、==、===、&&、||）typeof 的值

*   `+`: 数字相加，字符串拼接
*   `+=`: 加法赋值
*   `==`: 相等，会进行类型转换
*   `===`: 严格相等，不会进行类型转换
*   `&&`: 逻辑与
*   `||`: 逻辑或
*   `typeof`: 返回一个表示未经计算的操作数的类型的字符串。可能的值有：`"undefined"`、`"boolean"`、`"string"`、`"number"`、`"bigint"`、`"symbol"`、`"function"`、`"object"`。

### 7. 运算符结合性和优先级

[MDN - 运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)

### 8. 流程控制语句

`if...else`, `switch`, `for`, `while`, `do...while`, `break`, `continue`

### 9. 字符串操作

`length`, `charAt()`, `concat()`, `indexOf()`, `slice()`, `split()`, `substr()`, `substring()`, `toLowerCase()`, `toUpperCase()`, `trim()`

### 10. 0.1 + 0.2 === 0.3与大数相加

*   `0.1 + 0.2 !== 0.3` 是因为浮点数精度问题。解决方法：` (0.1 * 10 + 0.2 * 10) / 10 === 0.3`
*   大数相加可以使用 `BigInt` 或者字符串模拟加法。

### 11. 数组操作API

`push()`, `pop()`, `shift()`, `unshift()`, `slice()`, `splice()`, `concat()`, `join()`, `reverse()`, `sort()`, `map()`, `filter()`, `reduce()`, `forEach()`

### 12. 对象操作

`Object.keys()`, `Object.values()`, `Object.entries()`, `Object.assign()`, `hasOwnProperty()`

### 13. Map、weakMap、Set、Symbol

*   **`Map`**: 键值对的集合，键可以是任意类型。
*   **`WeakMap`**: 键必须是对象，弱引用，不会阻止垃圾回收。
*   **`Set`**: 值的集合，值是唯一的。
*   **`Symbol`**: 创建唯一的、不可变的值。

### 14. Math、Date

*   **`Math`**: `abs()`, `ceil()`, `floor()`, `max()`, `min()`, `random()`, `round()`
*   **`Date`**: `now()`, `getFullYear()`, `getMonth()`, `getDate()`, `getHours()`, `getMinutes()`, `getSeconds()`

### 15. 函数、箭头函数、递归

*   **函数**: `function` 关键字声明，有自己的 `this`，`arguments`。
*   **箭头函数**: `=>` 语法，没有自己的 `this`，`arguments`，`super` 或 `new.target`。
*   **递归**: 函数调用自身。

### 16. 深拷贝

*   **JSON.parse(JSON.stringify(obj))**: 简单但有局限性（会忽略 `undefined`、`symbol` 和函数）。
*   **递归实现**: 遍历对象，递归拷贝。
*   **库**: `lodash.cloneDeep()`

### 17. 词法作用域、立即执行函数表达式

*   **词法作用域**: 函数的作用域在函数定义时就决定了。
*   **IIFE (Immediately Invoked Function Expression)**: `(function() { ... })()`，创建独立的作用域，避免污染全局变量。

### 18. 柯里化、回调函数

*   **柯里化**: 将一个多参数的函数转换成一系列使用一个参数的函数的技术。
*   **回调函数**: 作为参数传递给另一个函数的函数。

### 19. 正则表达式

[MDN - 正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)

### 20. ES6常用语法

`let`, `const`, 箭头函数, `class`, `extends`, `super`, `...` (rest/spread), 解构赋值, `Promise`, `async/await`, 模块化 (`import`/`export`)

## ECMAScript重难点

### 1. 构造函数、对象、原型，原型链

*   **构造函数**: 用于创建和初始化对象的特殊函数。
*   **对象**: 属性和方法的集合。
*   **原型**: 每个JavaScript对象都有一个原型对象，它包含可以被该对象实例共享的属性和方法。
*   **原型链**: 当访问一个对象的属性时，如果该对象本身没有这个属性，JavaScript会沿着原型链向上查找，直到找到该属性或到达原型链的末端（`null`）。

### 2. Class写法

ES6 引入了 `class` 关键字，作为创建对象的语法糖。

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }

    sayHello() {
        console.log(`Hello, my name is ${this.name}`);
    }
}
```

### 3. 继承的实现

*   **原型链继承**: `Child.prototype = new Parent()`
*   **构造函数继承**: `Parent.call(this, ...)`
*   **组合继承**: 原型链继承和构造函数继承的组合。
*   **ES6 `extends`**: `class Child extends Parent { ... }`

### 4. this、call、apply、bind

*   **`this`**: 指向函数执行时的上下文对象。
*   **`call()`**: 调用一个函数，其具有一个指定的 `this` 值和分别提供的参数。
*   **`apply()`**: 调用一个函数，其具有一个指定的 `this` 值，以及作为一个数组（或类似数组的对象）提供的参数。
*   **`bind()`**: 创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

### 5. 闭包

闭包是指有权访问另一个函数作用域中的变量的函数。创建闭包的常见方式，就是在一个函数内部创建另一个函数。

### 6. 回调函数，Promise封装、async、await的使用

*   **回调函数**: 作为参数传递给另一个函数的函数。
*   **`Promise`**: 用于表示一个异步操作的最终完成 (或失败)及其结果值。
*   **`async/await`**: `async` 函数返回一个 `Promise`，`await` 用于等待一个 `Promise` 解析并返回其结果。

### 7. 手写Promise.all、Promise.race、Promise.allSettled、Promise.any

[手写Promise](https://juejin.cn/post/6844904093276389383)

### 8. 手写Promise并发控制

[如何实现一个带并发限制的异步调度器](https://juejin.cn/post/6844904103598227463)

### 9. 任务队列宏任务与微任务，setTimeout、Promise、async、await相关代码输出

*   **宏任务**: `setTimeout`, `setInterval`, `I/O`, `UI rendering`
*   **微任务**: `Promise.then`, `MutationObserver`
*   执行顺序：执行一个宏任务，然后执行所有微任务，然后开始下一个宏任务。

### 10. v8垃圾回收

[深入理解V8的垃圾回收机制](https://juejin.cn/post/6844903492932337671)

## DOM

### 1. DOM的获取、创建、删除、修改内容

*   **获取**: `getElementById()`, `getElementsByTagName()`, `getElementsByClassName()`, `querySelector()`, `querySelectorAll()`
*   **创建**: `createElement()`
*   **删除**: `removeChild()`
*   **修改内容**: `innerHTML`, `textContent`

### 2. 属性的操作、JS修改样式、切换class控制样式

*   **属性操作**: `getAttribute()`, `setAttribute()`, `removeAttribute()`
*   **修改样式**: `element.style.property = value`
*   **切换class**: `element.classList.add()`, `element.classList.remove()`, `element.classList.toggle()`

### 3. onclick与addEventListener，事件模型、冒泡与捕获、事件代理、阻止默认

*   **`onclick` vs `addEventListener`**: `onclick` 只能绑定一个事件处理程序，`addEventListener` 可以绑定多个。
*   **事件模型**: 事件捕获 -> 目标阶段 -> 事件冒泡
*   **事件代理**: 利用事件冒泡，将事件监听器添加到父元素上，而不是每个子元素上。
*   **阻止默认行为**: `event.preventDefault()`

## BOM

### 1. localStorage、Cookie、Session、SessionStorage区别

*   **`Cookie`**: 数据大小限制为4KB，会随HTTP请求发送到服务器。
*   **`localStorage`**: 数据大小限制为5MB，数据永久存储，除非手动删除。
*   **`sessionStorage`**: 数据大小限制为5MB，数据在当前会话结束时删除。
*   **`Session`**: 数据存储在服务器端。

### 2. navigator判断设备

`navigator.userAgent`

### 3. history、pushState、replaceState，不改变url刷新页面

*   **`history`**: `back()`, `forward()`, `go()`
*   **`pushState()`**: 添加新的历史记录。
*   **`replaceState()`**: 修改当前历史记录。
*   不改变url刷新页面: `location.reload()`

## 前后端交互

### 1. 手写node server

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
```

### 2. Ajax 的使用与Promsie封装

[原生JS封装ajax和promise](https://juejin.cn/post/6844903442269241357)

### 3. Fetch API的使用

[Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)

### 4. Axios介绍

[Axios](https://axios-http.com/)

### 5. Mock.js和常见Mock平台

*   **`Mock.js`**: [http://mockjs.com/](http://mockjs.com/)
*   **常见Mock平台**: `Easy Mock`, `YApi`

### 6. WebSocket

[WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)

### 7. 同源策略、跨域方案、CORS、JSONP

*   **同源策略**: 协议、域名、端口号必须相同。
*   **跨域方案**: `JSONP`, `CORS`, `WebSocket`, `postMessage`
*   **CORS (Cross-Origin Resource Sharing)**: [https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
*   **JSONP**: 利用 `<script>` 标签的 `src` 属性不受同源策略限制的特点。
