# this

[【建议👍】再来40道this questions d'entretien酸爽继续(1.2w字用手整理) - 掘金](https://juejin.cn/post/6844904083707396109)

### call appy bind的作用和区别 TODO

作用：

都可以改变函数内部的this指向。

区别点：

1. call 和 apply 会调用函数，并且改变函数内部this指向。
2. call 和 apply 传递的参数不一样，call 传递参数arg1,arg2…形式 apply 必须数组形式[arg]
3. bind 不会调用函数，可以改变函数内部this指向。

**解析：**

call方法

改变函数内部this指向

call()方法调用一个对象。简单理解为调用函数的方式，但是它可以改变函数的this指向。

写法：fun.call(thisArg, arg1, arg3, …) // thisArg为想要指向的对象，arg1,arg3为参数

call 的主要作用也可以实现继承

```jsx
function Person(uname, age) {    this.uname = uname;    this.age = age;}function Son(uname, age) {    Person.call(this, uname, age);}var son = new Son("zhang", 12);console.log(son);
```

apply方法

apply()方法调用一个函数。简单理解为调用函数的方式，但是它可以改变函数的this指向。

写法：fun.apply(thisArg, [argsArray])

- thisArg:在fun函数运行时指定的this值
- argsArray:传递的值，必须包含在数组里面
- 返回值就是函数的返回值，因为他就是调用函数

apply的主要应用，比如可以利用apply可以求得数组中最大值

```jsx
const arr = [1, 22, 3, 44, 5, 66, 7, 88, 9];const max = Math.max.apply(Math, arr);console.log(max);
```

bind方法

bind()方法不会调用函数，但是能改变函数内部this指向

写法：fun.bind(thisArg, arg1, arg2, …)

- thisArg:在fun函数运行时指定的this值
- arg1,arg2:传递的其他参数
- 返回由指定的this值和初始化参数改造的原函数拷贝

```jsx
var o = {    name: "lisa"};function fn() {    console.log(this);}var f = fn.bind(o);f();
```

bind应用

如果有的函数我们不需要立即调用，但是又需要改变这个函数的this指向，此时用bind再合适不过了

```jsx
const btns = document.querySelectorAll("button");for (let i = 0; i < btns.length; i++) {    btns[i].onclick = function () {        this.disabled = true;        setTimeout(            function () {                this.disabled = false;            }.bind(this),            2000        );    };}
```

**扩展:**

主要应用场景：

1. call 经常做继承。
2. apply 经常跟数组有关系，比如借助于数学对象实现数组最大值最小值。
3. bind 不调用函数，但是还想改变this指向，比如改变定时器内部的this指向。

### this指向（普通函数、箭头函数）

普通函数中的this

1. 谁调用了函数或者方法，那么这个函数或者对象中的this就指向谁

```jsx
let getThis = function () {  console.log(this);}let obj = {  name: "Jack",  getThis: function () {    console.log(this);  }}//getThis()方法是由window在全局作用域中调用的，所以this指向调用该方法的对象，即windowgetThis();//window//此处的getThis()方法是obj这个对象调用的，所以this指向objobj.getThis();//obj
```

1. 匿名函数中的this：匿名函数的执行具有全局性，则匿名函数中的this指向是window，而不是调用该匿名函数的对象；

```jsx
let obj = {  getThis: function () {    return function () {      console.log(this);    }  }}obj.getThis()(); //window
```

上面代码中，getThi()方法是由obj调用，但是obj.getThis()返回的是一个匿名函数，而匿名函数中的this指向window，所以打印出window。 如果想在上述代码中使this指向调用该方法的对象，可以提前把this传值给另外一个变量(_this或者that)：

```jsx
       let obj = {    getThis: function () {        //提前保存this指向        let _this = this        return function () {            console.log(_this);        }    }}obj.getThis()(); //obj
```

1. 箭头函数中的this
    1. 箭头函数中的this是在函数定义的时候就确定下来的，而不是在函数调用的时候确定的；
    2. 箭头函数中的this指向父级作用域的执行上下文；（技巧：**因为javascript中除了全局作用域，其他作用域都是由函数创建出来的，所以如果想确定this的指向，则找到离箭头函数最近的function，与该function平级的执行上下文中的this即是箭头函数中的this**）
    3. 箭头函数无法使用apply、call和bind方法改变this指向，因为其this值在函数定义的时候就被确定下来。

例1：首先，距离箭头函数最近的是getThis(){}，与该函数平级的执行上下文是obj中的执行上下文，箭头函数中的this就是下注释代码处的this，即obj。

```jsx
let obj = {  //此处的this即是箭头函数中的this  getThis: function () {    return () => {      console.log(this);    }  }}obj.getThis()(); //obj
```

例2：该段代码中存在两个箭头函数，this找不到对应的function(){}，所以一直往上找直到指向window。

```jsx
//代码中有两个箭头函数，由于找不到对应的function，所以this会指向window对象。let obj = {  getThis: () => {    return () => {      console.log(this);    }  }}obj.getThis()(); //window
```

### 手写bind

1. Function.prototype.bind,这样就可以让所有函数的隐式原型上都会有一个bind了。

```jsx
Function.prototype.bind = function () {    // TODO}
```

1. bind的第一个形参是要绑定给函数的上下文，所以再完善一下上面的代码

```jsx
Function.prototype.bind = function (context) {    var fn = this;    return function () {        return fn.apply(context);    }}
```

1. 真正的bind函数是可以传递多个参数的，第一个参数是要绑定给调用它的函数的上下文，其他的参数将会作为预设参数传递给这个函数，如下所示

```jsx
let foo = function () {    console.log(arguments);}foo.bind(null, "a", "b")("c", "d", "e"); // {"1":"a","2":"b","3":"c","4":"d","5":"e"}
```

1. 为了实现上面的效果，我们发现只要在返回的值上将函数合并上去就行了

```jsx
Function.prototype.bind = function (context, ...args) {    var fn = this;    return function (...rest) {        return fn.apply(context, [...args, ...rest]);    }}
```

1. 为了兼容性，替换成ES5的写法

```jsx
Function.prototype.bind = function () {    var args = Array.prototype.slice.call(arguments);    var context = args.splice(0, 1)[0];    var fn = this;    return function () {        let rest = Array.prototype.slice.call(arguments);        return fn.apply(context, args.concat(rest));    }}
```

1. 把函数的原型保留下来。

```jsx
Function.prototype.bind = function () {    var args = Array.prototype.slice.call(arguments);    var context = args.splice(0, 1)[0];    var fn = this;    var res = function () {        let rest = Array.prototype.slice.call(arguments);        return fn.apply(context, args.concat(rest));    }    if (this.prototype) {        res.prototype = this.prototype;    }    return res;}
```

1. 最后还需要再找到一种方法来判断是否对bind之后的结果使用了new操作符。

```jsx
Function.prototype.bind = function () {    var args = Array.prototype.slice.call(arguments);    var context = args.splice(0, 1)[0];    var fn = this;    var noop = function () {    }    var res = function () {        let rest = Array.prototype.slice.call(arguments);        // this只和运行的时候有关系，所以这里的this和上面的fn不是一码事，new res()和res()在调用的时            候，res中的this是不同的东西        return fn.apply(this instanceof noop ? this : context, args.concat(rest));    }    if (this.prototype) {        noop.prototype = this.prototype;    }    res.prototype = new noop();    return res;}
```

### 箭头函数能否当构造函数

**箭头函数表达式**的语法比函数表达式更简洁，并且没有自己的this，arguments，super或new.target。箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数。

### new会发生什么

1. 创建空对象； var obj = {};
2. 设置新对象的constructor属性为构造函数的名称，设置新对象的**proto**属性指向构造函数的prototype对象； obj.**proto** = ClassA.prototype; 扩展了新对象的原型链。
3. 使用新对象调用函数，函数中的this被指向新实例对象： ClassA.call(obj); //{}.构造函数();
4. 返回this指针。当存在显示的返回时，返回return后面的内容。新建的空对象作废。
    
    ```jsx
    function test() {     this.name = "test"; } test.prototype = { a:{}, b:{} }var  c = new test();
    ```