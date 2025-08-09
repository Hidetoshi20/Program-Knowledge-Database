# JS

# 数据遍历

| 方法 | 自身 可枚举属性 | 自身 不可枚举属性 | 继承属性 | Symbol属性 | 描述 |
| --- | --- | --- | --- | --- | --- |
| for...in | yes | no | yes | no | 以任意顺序遍历对象所有的可枚举属性（包括继承的可枚举属性，不含Symbol属性）。 |
| Object.keys(obj) | yes | no | no | no | 返回指定对象自身的所有可枚举属性组成的数组（不包括继承属性和Symbol属性），数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致。 |
| Object.getOwnPropertyNames(obj) | yes | yes | no | no | 返回指定对象的所有可枚举和不可枚举的属性名组成的数组（不包括Symbol属性）。 |
| Object.getOwnPropertySymbols(obj) | no | yes | no | yes | 返回指定对象自身所有的Symbol属性的数组。 |
| Reflect.ownKeys(obj) | yes | yes | no | yes | 返回指定对象自身的所有属性（包含不可枚举属性和Symbol属性）组成的数组，它的返回值等同于 `Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))`。 |

# 判断变量类型

- typeof：常用于判断基本数据类型，对于引用数据类型除了function返回’function‘，其余全部返回’object’。
- instanceof：主要用于区分引用数据类型，检测方法是检测的类型在当前实例的原型链上，用其检测出来的结果都是true，不太适合用于简单数据类型的检测，检测过程繁琐且对于简单数据类型中的undefined,null, symbol检测不出来。
- constructor：用于检测引用数据类型，检测方法是获取实例的构造函数判断和某个类是否相同，如果相同就说明该数据是符合那个数据类型的，这种方法不会把原型链上的其他类也加入进来，避免了原型链的干扰。
- Object.prototype.toString.call()：适用于所有类型的判断检测，检测方法是Object.prototype.toString.call(数据) 返回的是该数据类型的字符串。
- 这四种判断数据类型的方法中，各种数据类型都能检测且检测精准的就是Object.prototype.toString.call()这种方法。

instanceof的实现原理：验证当前类的原型prototype是否会出现在实例的原型链__proto__上，只要在它的原型链上，则结果都为true。因此，`instanceof` 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 `prototype`，找到返回true，未找到返回false。

instanceOf 原理

```jsx
function new_instance_of(leftVaule, rightVaule) {    let rightProto = rightVaule.prototype; // 取右表达式的 prototype 值    leftVaule = leftVaule.__proto__; // 取左表达式的__proto__值    while (true) {        if (leftVaule === null) {            return false;        }        if (leftVaule === rightProto) {            return true;        }        leftVaule = leftVaule.__proto__    }}
```

其实 instanceof 主要的实现原理就是只要右边变量的 prototype 在左边变量的原型链上即可。因此，instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype，如果查找失败，则会返回 false，告诉我们左边变量并非是右边变量的实例。

同时还要了解js的原型继承原理

![](https://www.notion.socss.assets/2B869BED138922220E1DC0C5C1B898EE.png)

img

- Object.prototype.toString.call()原理：Object.prototype.toString 表示一个返回对象类型的字符串，call() 方法可以改变this的指向，那么把Object.prototype.toString()方法指向不同的数据类型上面，返回不同的结果

# 基本包装类型

Boolean String Number

在访问基本类型 string、number的方法时会临时创建一个包装类型，然后再销毁，基本包装类型是Object

# Object.assign的理解

作用：Object.assign可以实现对象的合并。

语法：Object.assign(target, …sources)

1. Object.assign会将source里面的可枚举属性复制到target，如果和target的已有属性重名，则会覆盖。
2. 后续的source会覆盖前面的source的同名属性。
3. 只复制自身的属性，不会原型链上的属性，也不会复制不可枚举的属性，也不会复制访问器属性。

# iframe有什么优点、缺点

优点：

1. iframe能够原封不动的把嵌入的网页展现出来。
2. 如果有多个网页引用iframe，那么你只需要修改iframe的内容，就可以实现调用的每一个页面内容的更改，方便快捷。
3. 网页如果为了统一风格，头部和版本都是一样的，就可以写成一个页面，用iframe来嵌套，可以增加代码的可重用。
4. 如果遇到加载缓慢的第三方内容如图标和广告，这些问题可以由iframe来解决。

缺点：

1. iframe会阻塞主页面的onload事件；
2. iframe和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。会产生很多页面，不容易管理。
3. iframe框架结构有时会让人感到迷惑，如果框架个数多的话，可能会出现上下、左右滚动条，会分散访问者的注意力，用户体验度差。
4. 代码复杂，无法被一些搜索引擎索引到，这一点很关键，现在的搜索引擎爬虫还不能很好的处理iframe中的内容，所以使用iframe会不利于搜索引擎优化（SEO）。
5. 很多的移动设备无法完全显示框架，设备兼容性差。
6. iframe框架页面会增加服务器的http请求，对于大型网站是不可取的。

# webComponents

Web Components 总的来说是提供一整套完善的封装机制来把 Web 组件化这个东西标准化，每个框架实现的组件都统一标准地进行输入输出，这样可以更好推动组件的复用

包含四个部分

1. Custom Elements
2. HTML Imports
3. HTML Templates
4. Shadow DOM

Custom Elements

提供一种方式让开发者可以自定义 HTML 元素，包括特定的组成，样式和行为。支持 Web Components 标准的浏览器会提供一系列 API 给开发者用于创建自定义的元素，或者扩展现有元素。

HTML Imports

一种在 HTMLs 中引用以及复用其他的 HTML 文档的方式。这个 Import 很漂亮，可以简单理解为我们常见 的模板中的include之类的作用

HTML Templates

模板

Shadow DOM

提供一种更好地组织页面元素的方式，来为日趋复杂的页面应用提供强大支持，避免代码间的相互影响

# Closure

[学习Javascript闭包（Closure）](https://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html) 一个函数和对其周围状态（**lexical environment，词法环境**）的引用捆绑在一起（或者说函数被引用包围）， 这样的组合就是**闭包**（**closure**）。也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。

闭包的特点：

让外部访问函数内部变量成为可能； 可以避免使用全局变量，防止全局变量污染； 可以让局部变量常驻在内存中； 会造成内存泄漏（有一块内存空间被长期占用，而不被释放）

### 应用场景

1. 埋点（是网站分析的一种常用的数据采集方法）计数器

```jsx
function count() {    var num = 0;    return function () {        return ++num    }}var getNum = count();var getNewNum = count();document.querySelectorAll('button')[0].onclick = function () {    console.log('点击加入购物车次数： ' + getNum());}document.querySelectorAll('button')[1].onclick = function () {    console.log('点击付款次数： ' + getNewNum());}
```

1. 事件+循环

按照以下方式添加事件，打印出来的i不是按照序号的

形成原因就是操作的是同一个词法环境,因为onclick后面的函数都是一个闭包，但是操作的是同一个词法环境

```jsx
   var lis = document.querySelectorAll('li');for (var i = 0; i < lis.length; i++) {    lis[i].onclick = function () {        alert(i)    }}
```

解决办法：

使用匿名函数之后，就形成一个闭包， 操作的就是不同的词法环境

```jsx
var lis = document.querySelectorAll('li');for (var i = 0; i < lis.length; i++) {    (function (j) {        lis[j].onclick = function () {            alert(j)        }    })(i)}
```

# HashMap 和 ArrayMap 区别

1. 查找效率 HashMap因为其根据hashcode的值直接算出index,所以其查找效率是随着数组长度增大而增加的。 ArrayMap使用的是二分法查找，所以当数组长度每增加一倍时，就需要多进行一次判断，效率下降
2. 扩容数量 HashMap初始值16个长度，每次扩容的时候，直接申请双倍的数组空间。 ArrayMap每次扩容的时候，如果size长度大于8时申请size*1.5个长度，大于4小于8时申请8个，小于4时申请4个。这样比较ArrayMap其实是申请了更少的内存空间，但是扩容的频率会更高。因此，如果数据量比较大的时候，还是使用HashMap更合适，因为其扩容的次数要比ArrayMap少很多。
3. 扩容效率 HashMap每次扩容的时候重新计算每个数组成员的位置，然后放到新的位置。 ArrayMap则是直接使用System.arraycopy，所以效率上肯定是ArrayMap更占优势。
4. 内存消耗 以ArrayMap采用了一种独特的方式，能够重复的利用因为数据扩容而遗留下来的数组空间，方便下一个ArrayMap的使用。而HashMap没有这种设计。 由于ArrayMap之缓存了长度是4和8的时候，所以如果频繁的使用到Map，而且数据量都比较小的时候，ArrayMap无疑是相当的是节省内存的。

总结 综上所述，数据量比较小，并且需要频繁的使用Map存储数据的时候，推荐使用ArrayMap。 而数据量比较大的 时候，则推荐使用HashMap。

### HashMap和Object

参考答案：

Objects和Maps类似的是，它们都允许你按键存取一个值、删除键、检测一个键是否绑定了值。因此（并且也没有其他内建的替代方式了）过去我们一直都把对象当成Maps使用。不过Maps和Objects有一些重要的区别，在下列情况里使用Map会是更好的选择：

|  | Map | Object |
| --- | --- | --- |
| 意外的键 | Map默认情况不包含任何键。只包含显式插入的键。 | 一个Object有一个原型, 原型链上的键名有可能和你自己在对象上的设置的键名产生冲突。注意: 虽然 ES5 开始可以用Object.create(null)来创建一个没有原型的对象，但是这种用法不太常见。 |
| 键的类型 | 一个Map的键可以是任意值，包括函数、对象或任意基本类型。 | 一个Object的键必须是一个 [String](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String) 或是[Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)。 |
| 键的顺序 | Map中的 key 是有序的。因此，当迭代的时候，一个Map对象以插入的顺序返回键值。 | 一个Object的键是无序的注意：自ECMAScript 2015规范以来，对象*确实*保留了字符串和Symbol键的创建顺序； 因此，在只有字符串键的对象上进行迭代将按插入顺序产生键。 |
| Size | Map的键值对个数可以轻易地通过[size](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/size) 属性获取 | Object的键值对个数只能手动计算 |
| 迭代 | Map是 [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/iterable) 的，所以可以直接被迭代。 | 迭代一个Object需要以某种方式获取它的键然后才能迭代。 |
| 性能 | 在频繁增删键值对的场景下表现更好。 | 在频繁添加和删除键值对的场景下未作出优化。 |

### javascript中arguments相关的问题

**arguments**

在js中，我们在调用有参数的函数时，当往这个调用的有参函数传参时，js会把所传的参数全部存到一个叫arguments的对象里面。它是一个类数组数据

**由来**

JavaScrip中每个函数都会有一个Arguments对象实例arguments，引用着函数的实参。它是寄生在js函数当中的，不能显式创建，arguments对象只有函数开始时才可用

**作用**

有了arguments这个对象之后，我们可以不用给函数预先设定形参了，可以动态地通过arguments为函数加入参数

### 事件委托

https://zhuanlan.zhihu.com/p/26536815

https://zh.javascript.info/event-delegation

### 内存泄露

1. 意外的全局变量；
2. 闭包；
3. 未被清空的定时器；
4. 未被销毁的事件监听；
5. DOM 引用；

### json和xml数据的区别

1. 数据体积方面：xml是重量级的，json是轻量级的，传递的速度更快些。
2. 数据传输方面：xml在传输过程中比较占带宽，json占带宽少，易于压缩。
3. 数据交互方面：json与javascript的交互更加方便，更容易解析处理，更好的进行数据交互
4. 数据描述方面：json对数据的描述性比xml较差
5. xml和json都用在项目交互下，xml多用于做配置文件，json用于数据交互。

### symbol

### 代码解析题 Object.create 和 delete

题目

```jsx
var company = {    address: 'beijing'}var yideng = Object.create(company);delete yideng.addressconsole.log(yideng.address);// 写出执行结果，并解释原因
```

答案 beijing

解析 这里的 yideng 通过 prototype 继承了 company的 address。yideng 自己并没有address属性。所以delete操作符的作用是无效的。

扩展

1. delete使用原则：delete 操作符用来删除一个对象的属性。
2. delete在删除一个不可配置的属性时在严格模式和非严格模式下的区别:
    1. 在严格模式中，如果属性是一个不可配置（non-configurable）属性，删除时会抛出异常;
    2. 非严格模式下返回 false。
3. delete能删除隐式声明的全局变量：这个全局变量其实是global对象(window)的属性
4. delete能删除的：
    1. 可配置对象的属性
    2. 隐式声明的全局变量
    3. 用户定义的属性
    4. 在ECMAScript 6中，通过 const 或 let 声明指定的 “temporal dead zone” (TDZ) 对 delete 操作符也会起作用
5. delete不能删除的：
    1. 显式声明的全局变量
    2. 内置对象的内置属性
    3. 一个对象从原型继承而来的属性
6. delete删除数组元素：
    1. 当你删除一个数组元素时，数组的 length 属性并不会变小，数组元素变成undefined
    2. 当用 delete 操作符删除一个数组元素时，被删除的元素已经完全不属于该数组。
    3. 如果你想让一个数组元素的值变为 undefined 而不是删除它，可以使用 undefined 给其赋值而不是使用 delete 操作符。此时数组元素是在数组中的
7. delete 操作符与直接释放内存（只能通过解除引用来间接释放）没有关系。

### 为什么js是单线程

这主要和js的用途有关，js是作为浏览器的脚本语言，主要是实现用户与浏览器的交互，以及操作dom；这决定了它只能是单线程，否则会带来很复杂的同步问题。 举个例子：如果js被设计了多线程，如果有一个线程要修改一个dom元素，另一个线程要删除这个dom元素，此时浏览器就会一脸茫然，不知所措。所以，为了避免复杂性，从一诞生，JavaScript就是单线程，这已经成了这门语言的核心特征，将来也不会改变

**扩展：**

什么是进程？

进程：是cpu分配资源的最小单位；（是能拥有资源和独立运行的最小单位）

什么是线程？

线程：是cpu调度的最小单位；（线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程）

浏览器是多进程的？

放在浏览器中，每打开一个tab页面，其实就是新开了一个进程，在这个进程中，还有ui渲染线程，js引擎线程，http请求线程等。 所以，浏览器是一个多进程的。

为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。

### 暂时性死区 TODO

暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

**扩展：**

let 、const与暂时性死区

let或const声明的变量拥有暂时性死区（TDZ）：当进入它的作用域，它不能被访问（获取或设置）直到执行到达声明。

首先看看不具有暂时性死区的var：

- 当进入var变量的作用域（包围它的函数），立即为它创建（绑定）存储空间。变量会立即被初始化并赋值为undefined。
- 当执行到变量声明的时候，如果变量定义了值则会被赋值。

通过let声明的变量拥有暂时性死区，生命周期如下：

- 当进入let变量的作用域（包围它的语法块），立即为它创建（绑定）存储空间。此时变量仍是未初始化的。
- 获取或设置未初始化的变量将抛出异常ReferenceError。
- 当执行到变量声明的时候，如果变量定义了值则会被赋值。如果没有定义值，则赋值为undefined。

const工作方式与let类似，但是定义的时候必须赋值并且不能改变。

在 TDZ 内部，如果获取或设置变量将抛出异常：

```jsx
if (true) { // enter new scope, TDZ starts    // Uninitialized binding for `tmp` is created    tmp = 'abc'; // ReferenceError    console.log(tmp); // ReferenceError    let tmp; // TDZ ends, `tmp` is initialized with `undefined`    console.log(tmp); // undefined    tmp = 123;    console.log(tmp); // 123}
```

下面的示例将演示死区（dead zone）是真正短暂的（基于时间）和不受空间条件限制（基于位置）

```jsx
if (true) { // enter new scope, TDZ starts    const func = function () {        console.log(myVar); // OK!    };    // Here we are within the TDZ and    // accessing `myVar` would cause a `ReferenceError`    let myVar = 3; // TDZ ends    func(); // called outside TDZ}
```

typeof与暂时性死区

变量在暂时性死区无法被访问，所以无法对它使用typeof：

```jsx
if (true) {    console.log(typeof tmp); // ReferenceError    let tmp;}
```