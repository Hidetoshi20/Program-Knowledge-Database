# ES6

### es6中箭头函数 ! TODO

1. 基本语法
    
    ES6中允许使用箭头=>来定义箭头函数，具体语法，我们来看一个简单的例子：
    
    ```jsx
    // 箭头函数let fun = (name) => {    // 函数体    return `Hello ${name} !`;};// 等同于let fun = function (name) {    // 函数体    return `Hello ${name} !`;};
    ```
    
    可以看出，定义箭头函在数语法上要比普通函数简洁得多。箭头函数省去了function关键字，采用箭头=>来定义函数。函数的参数放在=> 前面的括号中，函数体跟在=>后的花括号中。
    
    关于箭头函数的参数：
    
    1. 如果箭头函数没有参数，直接写一个空括号即可。
    2. 如果箭头函数的参数只有一个，也可以省去包裹参数的括号。
    3. 如果箭头函数有多个参数，将参数依次用逗号(,)分隔，包裹在括号中即可。
    
    ```jsx
    // 没有参数let fun1 = () => {    console.log(111);};// 只有一个参数，可以省去参数括号let fun2 = name => {    console.log(`Hello ${name} !`)};// 有多个参数let fun3 = (val1, val2, val3) => {    return [val1, val2, val3];};
    ```
    
    关于箭头函数的函数体：
    
    **①** 如果箭头函数的函数体只有一句代码，就是简单返回某个变量或者返回一个简单的JS表达式，可以省去函数体的大括号{ }。
    
    ```jsx
    let f = val => val;// 等同于let f = function (val) { return val };let sum = (num1, num2) => num1 + num2;// 等同于let sum = function(num1, num2) {  return num1 + num2;};
    ```
    
    **②** 如果箭头函数的函数体只有一句代码，就是返回一个对象，可以像下面这样写：
    
    ```jsx
    // 用小括号包裹要返回的对象，不报错let getTempItem = id => ({ id: id, name: "Temp" });// 但绝不能这样写，会报错。// 因为对象的大括号会被解释为函数体的大括号let getTempItem = id => { id: id, name: "Temp" };
    ```
    
    **③** 如果箭头函数的函数体只有一条语句并且不需要返回值（最常见是调用一个函数），可以给这条语句前面加一个void关键字
    
    ```jsx
    let fn = () => void doesNotReturn();
    ```
    
    箭头函数最常见的用处就是简化回调函数。
    
    ```jsx
    // 例子一// 正常函数写法[1,2,3].map(function (x) {  return x * x;});// 箭头函数写法[1,2,3].map(x => x * x);// 例子二// 正常函数写法var result = [2, 5, 1, 4, 3].sort(function (a, b) {  return a - b;});// 箭头函数写法var result = [2, 5, 1, 4, 3].sort((a, b) => a - b);
    ```
    
2. 箭头函数与普通函数的区别
    1. 语法更加简洁、清晰 从上面的基本语法示例中可以看出，箭头函数的定义要比普通函数定义简洁、清晰得多，很快捷。
    2. 箭头函数不会创建自己的this 箭头函数没有自己的this，它会捕获自己在**定义时**（注意，是定义时，不是调用时）所处的**外层执行环境的this**，并继承这个this值。所以，箭头函数中this的指向在它被定义的时候就已经确定了，之后永远不会改变。
    
    ```jsx
    var id = 'Global';function fun1() {    // setTimeout中使用普通函数    setTimeout(function(){        console.log(this.id);    }, 2000);}function fun2() {    // setTimeout中使用箭头函数    setTimeout(() => {        console.log(this.id);    }, 2000)}fun1.call({id: 'Obj'});     // 'Global'fun2.call({id: 'Obj'});     // 'Obj'
    ```
    
    上面这个例子，函数fun1中的setTimeout中使用普通函数，2秒后函数执行时，这时函数其实是在全局作用域执行的，所以this指向Window对象，this.id就指向全局变量id，所以输出’Global’。 但是函数fun2中的setTimeout中使用的是箭头函数，这个箭头函数的this在定义时就确定了，它继承了它外层fun2的执行环境中的this，而fun2调用时this被call方法改变到了对象{id: ‘Obj’}中，所以输出’Obj’
    
    ```jsx
    var id = 'GLOBAL';var obj = {  id: 'OBJ',  a: function(){    console.log(this.id);  },  b: () => {    console.log(this.id);  }};obj.a();    // 'OBJ'obj.b();    // 'GLOBAL'
    ```
    
    上面这个例子，对象obj的方法a使用普通函数定义的，**普通函数作为对象的方法调用时，this指向它所属的对象**。所以，this.id就是obj.id，所以输出’OBJ’。 但是方法b是使用箭头函数定义的，箭头函数中的this实际是继承的它定义时所处的全局执行环境中的this，所以指向Window对象，所以输出’GLOBAL’。（**这里要注意，定义对象的大括号{}是无法形成一个单独的执行环境的，它依旧是处于全局执行环境中！！**）
    
3. 箭头函数继承而来的this指向永远不变（重要！！深入理解！！）
    
    上面的例子，就完全可以说明箭头函数继承而来的this指向永远不变。对象obj的方法b是使用箭头函数定义的，这个函数中的this就**永远指向**它定义时所处的全局执行环境中的this，即便这个函数是作为对象obj的方法调用，this依旧指向Window对象。
    
4. .call()/.apply()/.bind()无法改变箭头函数中this的指向
    
    .call()/.apply()/.bind()方法可以用来动态修改函数执行时this的指向，但由于箭头函数的this定义时就已经确定且永远不会改变。所以使用这些方法永远也改变不了箭头函数this的指向，虽然这么做代码不会报错。
    
    ```jsx
    var id = 'Global';// 箭头函数定义在全局作用域let fun1 = () => {    console.log(this.id)};fun1();     // 'Global'// this的指向不会改变，永远指向Window对象fun1.call({id: 'Obj'});     // 'Global'fun1.apply({id: 'Obj'});    // 'Global'fun1.bind({id: 'Obj'})();   // 'Global'
    ```
    
5. 箭头函数不能作为构造函数使用
    
    我们先了解一下构造函数的new都做了些什么？简单来说，分为四步：
    
    1. JS内部首先会先生成一个对象；
    2. 再把函数中的this指向该对象；
    3. 然后执行构造函数中的语句；
    4. 最终返回该对象实例。
    
    但是因为箭头函数没有自己的this，它的this其实是继承了外层执行环境中的this，且this指向永远不会随在哪里调用、被谁调用而改变，所以箭头函数不能作为构造函数使用，或者说构造函数不能定义成箭头函数，否则用new调用时会报错
    
    ```jsx
    let Fun = (name, age) => {    this.name = name;    this.age = age;};// 报错let p = new Fun('cao', 24);
    ```
    
6. 箭头函数没有自己的arguments
    
    箭头函数没有自己的arguments对象。在箭头函数中访问arguments实际上获得的是外层局部（函数）执行环境中的值。
    
    ```jsx
    // 例子一let fun = (val) => {  console.log(val);   // 111  // 下面一行会报错  // Uncaught ReferenceError: arguments is not defined  // 因为外层全局环境没有arguments对象  console.log(arguments);};fun(111);// 例子二function outer(val1, val2) {  let argOut = arguments;  console.log(argOut);    // ①  let fun = () => {    let argIn = arguments;    console.log(argIn);     // ②    console.log(argOut === argIn);  // ③  };  fun();}outer(111, 222);
    ```
    
    上面例子二，①②③处的输出结果如下：
    
    [](https://www.notion.soJS.assets/E7FCE80FDDB9FFE3A2590AE7A84AC3E1)
    
    img
    
    很明显，普通函数outer内部的箭头函数fun中的arguments对象，其实是沿作用域链向上访问的外层outer函数的arguments对象。
    
    **可以在箭头函数中使用rest参数代替arguments对象，来访问箭头函数的参数列表！！**
    
7. 箭头函数没有原型prototype
    
    ```jsx
    let sayHi = () => {    console.log('Hello World !')};console.log(sayHi.prototype); // undefined
    ```
    
8. 箭头函数不能用作Generator函数，不能使用yeild关键字

### ES6新特性

### 变量和作用域

[彻底解决 JS 变量提升的questions d'entretien | 一题一图，超详细包教包会😉](https://segmentfault.com/a/1190000039288278)

1. let 、const、 块级作用域和变量声明 let声明的变量**只在所在块中生效**； 
    1. let声明的变量可以解决var与for循环结合使用产生的无法取得最新变量值的问题（以往都需要通过闭包来解决这个问题）；
    2. let声明的变量**不存在变量提升**（从undefined->ReferenceError，其实也是一种暂时性死区）、会造成**变量暂时性死区**(在声明let变量之前都不能用它)、也不允许重复声明；
    3. const声明的变量行为与let类似，只是多了**两点更强的约束：**
        1. 声明时必须赋值**；**
        2. **声明的变量内存地址不可变**
        3. **需要注意的是**：对于用const声明基本类型，值就保存在内存地址之中，意味着变量不可重新赋值；对于用const声明的对象，对象内容还是可以更改的，只是不能改变其指向。（冻结对象应该用Object.freeze()）
2. 变量提升 JavaScript是单线程语言，所以执行肯定是按顺序执行。但是并不是逐行的分析和执行，而是一段一段地分析执行，会先进行编译阶段然后才是执行阶段。在编译阶段，代码真正执行前的几毫秒，会检测到所有的变量和函数声明，所有这些函数和变量声明都被添加到名为Lexical Environment的JavaScript数据结构内的内存中。所以这些变量和函数能在它们真正被声明之前使用。
3. 作用域 ES6 之前 JavaScript 没有块级作用域,只有全局作用域和函数作用域。ES6 的到来，为我们提供了‘块级作用域’,可通过新增命令 let 和 const 来体现。
4. 解构赋值（按照一定的结构解析出来进行赋值） 解构赋值的使用场景：变量快捷赋值、提取数据、函数参数定义和默认值、遍历某结构

### 原生对象的方法扩展

1. String 加强了对unicode的支持、支持字符串遍历（后面有讲到实际上是部署了iterator接口）、repeat()等方法的支持、**模板字符串**
2. RegExp 构造函数第一个参数是正则表达式，指定第二个参数不再报错、u修饰符、y修饰符、s修饰符
3. Number 二进制和八进制新写法、新方法parseInt()、Number.EPSILON极小常量、安全整数、Math新方法
4. Function **函数参数默认值**、rest参数、**函数内部严格模式**、函数的name属性、**箭头函数**
5. Array **扩展运算符…**

### Object 和 Symbol

1. Object对象 支持**简写**：同名属性K-V可以省略一个、函数声明可以省略function；支持**属性名表达式**、函数名表达式。（注意：以上2个——表达式和简写不能同时使用）。 对象的方法的name属性返回方法名，但有几个例外情况要小心。
    1. 新增了Object方法 Object.is()——用于解决==和===的部分兼容问题
    2. Object.assign()——将src的所有可枚举对象属性复制到dest对象上（浅复制）
    3. Object.setPrototypeOf()、Object.getPrototypeOf() (Object.__proto属性) 
    4. Object.entries()、Object.keys()、Object.values() ES6中5种遍历对象属性的方法 **for-in——自身和继承的可枚举属性（除Symbol）** **Object.keys()——自身非继承的可枚举属性（除Symbol）** **Object.getOwnPropertyNames()——自身所有属性键名（包括不可枚举、除Symbol）** **Object.getOwnPropertySymbols()——自身的所有 Symbol 属性的键名** **Reflect.ownKeys()——自身的所有键名**
2. Symbol类型 ES5以前，对象属性都只能是字符串，容易造成重命名导致的冲突。Symbol提供了一种机制，可以保存 属性名是独一无二的。Symbol类型的使用注意：
    1. 创建是调用函数，而不是new关键字
    2. Symbol类 型的属性不会被for-*、Object.keys()、Object.getPropertyNames()返回，可以用后面两种方法遍历。

### 数据结构Set和Map

Set是一种类似数组的数据结构，区别在于其存储的成员都是不重复的，由此带来了它的一个应用就是：**去重**。Set通过new关键字实例化，入参可以是数组or类数组的对象。

值得注意的是：在Set中，只能存储一个NaN，**这说明在Set数据结构中，NaN等于NaN**。

Set实例的方法：操作方法add()、delete()、has()和clear()；遍历方法：keys()、values()、entries()和forEach(); 扩展运算符…、数组方法map()、filter()方法也可以用于Set结构。由此它可以很方便的实现数组的交、并、差集。

WeakSet类似于Set，**主要区别在于1.成员只能是对象类型；2.对象都是弱引用**（如果其他对象都不再引用该对象，垃圾回收机制会自动回收该对象所占的内存，不可预测何时会发生，故WeakSet不可被遍历）

JavaScript对象Object都是键值K-V对的集合，但K取值只能是字符串和Symbol，Map也是K-V的集合，然而其K可以取任意类型。如果需要键值对的集合，Map比Object更适合。Map通过new关键字实例化。

Map实例的方法：set()、get()、has()、delete()和clear();遍历方法同Set。

Map与其它数据结构的互相转换：Map <—> 数组| Map <—> 对象| Map <—> JSON。

WeakMap类似于Map，主要区别在于：**1.只接受对象作为键名；2.键名所指向的对象不计入垃圾回收机制**。

### 元编程相关Proxy和Reflect

1. Proxy 对目标对象加一层“拦截”（“代理”），外界对对象的访问、修改都必须先通过这层拦截层。因而它提供了 一个机制可以对外界的访问进行过滤和改写。 用法：var proxy = new Proxy(p1,p2); p1是要被代理的目标对象，p2是配置对象。 值得注意的是：**Proxy不是对目标对象透明的代理**——即使不做任何拦截的情况下无法保证代理对象与目标对象行为的完全一致。（主要原因在于代理时，目标对象内部的this会指向代理对象）
2. Reflect 与Proxy一样是ES6为**语言层面的用于操作对象提供的新API**，目前它所拥有的对象方法与Proxy对象一一对 应，**引入目的**：
    1. 将Object对象上一些属于语言内部的方法放在Reflect上（目前都可以放）
    2. 修改Object对象上某些方法的返回值，使得更加合理化（健壮）
    3. 让Object对象的操作从命令式完全转化为函数式

### 异步编程Promise、Generator和Async

在JavaScript的世界里，对于**异步编程存在如下几种方案：1.回调函数；2.事件触发监听；3.发布订阅者模式；4.Promise**。首先介绍Promise，然后介绍ES6提供的生成器函数，async函数。

Promise来源于社区，代表一个对象，它代表异步操作未来的一个结果（承诺）。它总共有**三个状态**，pending。另外，它的状态**翻转路径只有两个**：pending->fulfilled or pending->rejected，一旦状态翻转，就不可变了。它支持链式调用，支持错误传递，支持以同步代码的方式写异步操作。

Promise是一个对象，创建此对象实例的方法如下（可以理解resolve和reject是已返回的承诺对象未来回调函数的占位）

Generator函数是ES6提供的异步编程解决方案。对于Generator函数，可以将它**理解为一个状态机，封装了多个内部状态；此外它还是一个遍历器生成函数**，这个函数可以遍历出状态机的所有状态。

函数特征：关键字function与函数名之间有*，函数体内部yeild关键字。

**生成器函数与普通函数的区别**：函数调用后不执行，而是返回一个指针对象（遍历器对象）。调用对象的next()方法，执行一段yield逻辑。故函数的分段执行的，**yield是暂停执行的标志，next()可以恢复执行**。

**yield与return的区别**：yield有记忆功能，return没有；一个函数可以多次执行yeild，但只会return一次

**async函数**是Generator函数的语法糖，它进行了**改进：1.自带执行器；2.返回值是Promise;**

三家对比：**使用Promise的异步代码存在大量自有API的调用，操作本身的语义夹杂其中，不是很清晰；Generator函数实现的异步代码语义比Promise清晰，但需要一个执行器；async函数的写法最简洁、符合语义，不需要执行器**。

### Class

从 ES6 开始，JavaScript 提供了 class 关键字来定义类，尽管，这样的方案仍然是基于原型运行时系统的模拟，大部分功能ES5可以实现。

构造函数的prototype属性在 ES6 的“类”上面继续存在。事实上，类中所有方法都定义在类的prototype属性上面（因而也是不可枚举的）。

constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。（默认构造函数）；constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。

注意区别：**类必须使用**new**调用，否则会报错**。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层。

私有属性和方法如何实现？

1. 命名上加以区别
2. 将私有方法移出模块，利用公有方法调用；
3. Symbol属性上（都不完美）

### module

在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。ES6 模块的设计思想是尽量的静态化，使得**编译时就能确定**模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在 **运行时确定。**

**编译时加载VS运行时加载——对象VS代码**

模块命令：export和import；一个文件即为一个模块，除非导入否则外部无法读取模块属性；

export支持：变量、函数和类

export命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，下一节的import命令也是如此。

输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。

使用import命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。但是，用户肯定希望快速上手，未必愿意阅读文档，去了解模块有哪些属性和方法。为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到export default命令，为模块指定默认输出。

模块之间也可以继承。

### JS中对象分类、及其它原生对象

![](https://www.notion.soJS.assets/A46B3D20C6101D8CE2B4D3DFBEA53F6F.png)

### Iterator

ES6之前在JS中只有Array和对象可以表示“集合”这种数据结构，ES6中增加了：Set和Map。由此，四种之间互相组合又可以定义新的数据结构。这些**新定义的数据结构如何访问呢？遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制**。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作。遍历器对象本质上是一个指针对象。

只要为某个数据结构部署 了Iterator接口，则可以称此数据结构是可遍历的。iterator属性部署在Symbol上。如下对象默认部署了Iterator结口：Array Set Map String等。部署iterator结构的**要点：1）在Symbol.iterator上部署；2）必须包含next()函数**。默认调用iterator接口的场景：解构赋值、…扩展运算符、yeild* 。for-of循环内部调用的即是调用数据机构内部的Symbol.iterator方法。

**for-in和for-of循环**

for-in用于遍历对象属性，对象自身和继承的可枚举属性（不可遍历Symbol属性）

for-of循环是一种遍历所有数据机构的统一方法。实现原理是数据结构上部署的Symbol.iterator属性。

### ES6 与 ES5 继承的区别

ES6 中有类 class 的概念，类 class 的继承是通过 extends 来实现的，ES5 中是通过设置构造函数的 prototype 属性，来实现继承的。

ES6 与 ES5 中的继承有 2 个区别，第一个是，ES6 中子类会继承父类的属性，第二个区别是，super() 与 A.call(this) 是不同的，在继承原生构造函数的情况下，体现得很明显，ES6 中的子类实例可以继承原生构造函数实例的内部属性，而在 ES5 中做不到。

**解析：**

下面通过 3 个 demo，来分析它们之间的区别。

1. ES5 继承

直接上代码：

```jsx
function A() {    this.a = 'hello';}function B() {    A.call(this);    this.b = 'world';}B.prototype = Object.create(A.prototype, {    constructor: {value: B, writable: true, configurable: true}});let b = new B();
```

代码中，构造函数 B 继承构造函数 A，首先让构造函数 B 的 prototype 对象中的 **proto** 属性指向构造函数 A 的 prototype 对象，并且将构造函数 B 的 prototype 对象的 constructor 属性赋值为构造函数 B，让构造函数 B 的实例继承构造函数 A 的原型对象上的属性，然后在构造函数 B 内部的首行写上 A.call(this)，让构造函数 B 的实例继承构造函数 A 的实例属性。在 ES5 中实现两个构造函数之间的继承，只需要做这两步即可。下面六幅图分别是，实例 b 的原型链及验证图，构造函数 B 的原型链及验证图，构造函数 A 的原型链及验证图。

实例 b 的原型链如下图：

![](https://www.notion.soJS.assets/5EFC2E2CCA7CF0C0ED3AF97C57C347E8.png)

实例 b 的原型链验证图：

[](https://www.notion.soJS.assets/6C8BA735DC6D2FB3DA6EF1492C8C8AC9)

构造函数 B 的原型链图下图：

![](https://www.notion.soJS.assets/C639481859D093429EF31DB41F59479D.png)

构造函数 B 的原型链验证图图：

![](https://www.notion.soJS.assets/E8833975C1CE1CF00A9497C875FC5D1C.png)

构造函数 A 的原型链图下图：

![](https://www.notion.soJS.assets/8F1CBB5E756E67FF00FA75B75E1198FD.png)

构造函数 B 的原型链验证图图：

[](https://www.notion.soJS.assets/AC9C448D0E52381CD7FF458F89369FC3)

从上面 6 幅图可知，构造函数 B 的实例 b 继承了构造函数 A 的实例属性，继承了构造函数 A 的原型对象上的属性，继承了构造函数 Object 的原型对象上的属性。构造函数 B 是构造函数 Function 的实例，继承了构造函数 Function 的原型对象上的属性，继承了构造函数 Object 的原型对象上的属性。 构造函数 A 是构造函数 Function 的实例，继承了构造函数 Function 的原型对象上的属性，继承了构造函数 Object 的原型对象上的属性。可看出，构造函数 A 与 构造函数 B 并没有继承关系，即构造函数 B 没有继承构造函数 A 上面的属性，在 ES6 中，用 extends 实现两个类的继承，两个类之间是有继承关系的，即子类继承了父类的方法，这是 ES6 与 ES5 继承的第一点区别，下面通过 ES6 的继承来说明这一点。

1. ES6 继承

直接上代码：

```jsx
class A {    constructor() {        this.a = 'hello';    }}class B extends A {    constructor() {        super();        this.b = 'world';    }}let b = new B();
```

代码中，类 B 通过 extends 关键字继承类 A 的属性及其原型对象上的属性，通过在类 B 的 constructor 函数中执行 super() 函数，让类 B 的实例继承类 A 的实例属性，super() 的作用类似构造函数 B 中的 A.call(this)，但它们是有区别的，这是 ES6 与 ES5 继承的第二点区别，这个区别会在文章的最后说明。在 ES6 中，两个类之间的继承就是通过 extends 和 super 两个关键字实现的。下面四幅图分别是，实例 b 的原型链及验证图，类 B 的原型链及验证图。

实例 b 的原型链如下图：

![](https://www.notion.soJS.assets/9D874024A07AB6BF3720EBE76D8B1B5F.png)

实例 b 的原型链验证图：

[](https://www.notion.soJS.assets/B0B23709AD1D39BCF215957AC3BE3D76)

类 B 的原型链图下图：

![](https://www.notion.soJS.assets/A439A948D436C4F8564F01CFC41DA1F6.png)

类 B 的原型链验证图图：

[](https://www.notion.soJS.assets/0ABB20677FEF4799600D633AA631D9E1)

通过上面 4 幅图可知，在 ES6 与 ES5 中，类 B 的实例 b 的原型链与构造函数 B 的实例 b 的原型链是相同的，但是在 ES6 中类 B 继承了类 A 的属性，在 ES5 中，构造函数 B 没有继承构造函数 A 的属性，这是 ES6 与 ES5 继承的第一个区别。

1. super() 与 A.call(this) 的区别

在 ES5 中，构造函数 B 的实例继承构造函数 A 的实例属性是通过 A.call(this) 来实现的，在 ES6 中，类 B 的实例继承类 A 的实例属性，是通过 super() 实现的。在不是继承原生构造函数的情况下，A.call(this) 与 super() 在功能上是没有区别的，用 [babel 在线转换](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015,react,stage-2&targets=&browsers=&builtIns=false&debug=false&code=)将类的继承转换成 ES5 语法，babel 也是通过 A.call(this) 来模拟实现 super() 的。但是在继承原生构造函数的情况下，A.call(this) 与 super() 在功能上是有区别的，ES5 中 A.call(this) 中的 this 是构造函数 B 的实例，也就是在实现实例属性继承上，ES5 是先创造构造函数 B 的实例，然后在让这个实例通过 A.call(this) 实现实例属性继承，在 ES6 中，是先新建父类的实例对象this，然后再用子类的构造函数修饰 this，使得父类的所有行为都可以继承。下面通过 2 段代码说明这个问题。

代码 1：

```jsx
function ArrFun() {    Array.call(this);}ArrFun.prototype = Object.create(Array.prototype, {    constructor: {        value: ArrFun,        writable: true,        configurable: true    }});var colors = new ArrFun();colors[0] = "blue";colors.length;
```

这段代码的思路就是，让构造函数 MyArray 继承原生构造函数 Array，然后验证 MyArray 的实例是否具有 Array 实例的特性。

代码 1 执行结果如下图：

![](https://www.notion.soJS.assets/E7ADAE3D4C812A6291404B1DD673DFB2.png)

从结果可以看出，MyArray 的实例并不具有 Array 实例的特性，之所以会发生这种情况，是因为 MyArray 的实例无法获得原生构造函数 Array 实例的内部属性，通过 Array.call(this) 也不行。

代码 2：

```jsx
class ArrFun extends Array {    constructor() {        super();    }}var arr = new ArrFun();arr[0] = 12;arr.length;
```

代码 2 执行结果如下图：

![](https://www.notion.soJS.assets/063DA15897F5D57767350A0B04B81839.png)

从结果可以看出，通过 super()，MyArray 的实例具有 Array 实例的特性。

### 哪些类型能被扩展操作符…扩展

**适用类型**：数组、对象、字符串。

复杂数据类型都可以，当要转化为可迭代数据结构时可设置对象的迭代器对扩展运算符扩展出来的值进行操作。

基础数据只有string可以使用扩展运算符，number,boolean,null,undefined无效

### 事件扩展符用过吗(…)，什么场景下

**扩展运算符的应用场景**

```jsx
// 1、函数调用function add(x, y) {    return x + y;}add(...[4, 38]);function f(v, w, x, y, z) {}f(-1, ...[0, 1], 2, ...[3]);// 123456789//2.往数组里push多个元素var arr1 = [0, 1, 2];var arr2 = [3, 4, 5];arr1.push(...arr2);console.log(arr1); //[0,1,2,3,4,5]//123456//3.替代函数的apply方法function f(x, y, z) {}var args = [0, 1, 2];f.apply(null, args); //ES5 的写法f(...args); //ES6的写法// 123456//4.求一个数组的最大数简化Math.max.apply(null, [14, 3, 77])  //ES5 的写法Math.max(...[14, 3, 77])  //ES6 的写法，等同于Math.max(14, 3, 77)//1234//5.扩展运算符后面可以放表达式const arr = [...(5 > 0 ? ['a'] : []), 'b'];console.log(arr);  //['a','b']//1234//6.与解构赋值结合，用于生成数组const a1 = [1, 2];const a2 = [...a1];  //写法1const [...a2] = a1;  //写法2const [first, ...rest] = [1, 2, 3, 4, 5];first  //1rest  //[2, 3, 4, 5]const [first, ...rest] = [];first  //undefinedrest  //[]const [first, ...rest] = ["foo"];first  //"foo"rest   //[]//1234567891011121314151617//7.合并数组    [...arr1,...arr2,...arr3]  //[ 'a', 'b', 'c', 'd', 'e' ]123//8.数组的克隆——————————————————————特别注意var arr1 = [0, 1, 2];var arr2 = [...arr1];arr1[0] = 100;console.log(arr2); //[0, 1, 2]/* 乍一看，arr2与arr1不共用引用地址，arr2不随着arr1变化，接着往下看 */var arr1 = [0, [1, 11, 111], 2];var arr2 = [...arr1];arr1[1][0] = 100;console.log(arr2); //[0, [100,11,111], 2]
```

### 让不同的浏览器兼容ES6的方法

针对 ES6 的兼容性问题，很多团队为此开发出了多种语法解析转换工具，把我们写的 ES6 语法转换成 ES5，相当于在 ES6 和浏览器之间做了一个翻译官。比较通用的工具方案有 babel，jsx，traceur，es6-shim 等。