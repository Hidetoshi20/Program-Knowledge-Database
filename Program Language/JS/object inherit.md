# object inherit

[🔥【何不三连】比继承家业还要简单的JS继承题-封装篇(牛刀小试) - 掘金](https://juejin.cn/post/6844904094948130824)

[💦【何不三连】做完这48道题彻底弄懂JS继承(1.7w字含辛整理-返璞归真) - 掘金](https://juejin.cn/post/6844904098941108232)

[彻底深刻理解js原型链之prototype,proto以及constructor(一)-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/1704883)

[彻底深刻理解js原型链之prototype,proto以及constructor(二)_大前端_刘晓敏_InfoQ精选文章](https://www.infoq.cn/article/uexu6hi1rmwk4qt4em7v)

# 对象的创建 book

### 工厂模式

工厂模式是软件工程领域一种广为人知的设计模式，这种模式抽象了创建具体对象的过程(。考虑到在 ECMAScript 中无法创建类，开发人员 就发明了一种函数，用函数来封装以特定接口创建对象的细节，如下面的例子所示。

```jsx
function createPerson(name, age, job) {    var o = new Object();    o.name = name;    o.age = age;    o.job = job;    o.sayName = function () {        alert(this.name);    };    return o;}
```

### 构造函数模式

```jsx
function Person(name, age, job) {    this.name = name;    this.age = age;    this.job = job;    this.sayName = function () {        alert(this.name);    };}
```

相比工厂模式，可以将它的实例标记为一个类型

缺点：每个方法都是新创建的独立的，冗余，并且不能判断相等

```jsx
function Person(name, age, job) {    this.name = name;    this.age = age;    this.job = job;    this.sayName = sayName;}function sayName() {    alert(this.name);}
```

移到外部的话，解决了冗余的问题，但是污染了全局作用域，没有很好的封装

### 原型模式

```jsx
function Person() {}Person.prototype.name = "Nicholas";Person.prototype.age = 29;Person.prototype.job = "Software Engineer";Person.prototype.sayName = function () {    alert(this.name);};
```

不必在构造函数中定义对象实例的信息，而是 可以将这些信息直接添加到原型对象中

**更简单的原型语法**

```jsx
function Person() {}Person.prototype = {    name: "Nicholas",    age: 29,    job: "Software Engineer",    sayName: function () {        alert(this.name);    }};
```

这个时候原型对象不再指向构造函数

**原型的动态性**

在原型上的修改可以随后反应出来，但是重写整个原型对象会让已有的实例失去联系，构造函数指向新的原型，实例指向旧的原型

**原型对象的问题**

属性都是共享的

### 组合使用构造函数模式和原型模式

```jsx
function Person(name, age, job) {    this.name = name;    this.age = age;    this.job = job;    this.friends = ["Shelby", "Court"];}Person.prototype = {    constructor: Person,    sayName: function () {        alert(this.name);    }}
```

使用比较广泛，认可度较高

### 动态原型模式

```jsx
function Person(name, age, job) {    //属性    this.name = name;    this.age = age;    this.job = job;    //方法    if (typeof this.sayName != "function") {        Person.prototype.sayName = function () {            alert(this.name);        };    }}
```

封装较好

### 寄生构造函数模式

```jsx
function Person(name, age, job) {    var o = new Object();    o.name = name;    o.age = age;    o.job = job;    o.sayName = function () {        alert(this.name);    };    return o;}
```

### 稳妥构造函数模式

```jsx
function Person(name, age, job) {    //创建要返回的对象    var o = new Object();    //可以在这里定义私有变量和函数    //添加方法    o.sayName = function () {        alert(name);    };    //返回对象    return o;}
```

# 继承 book

由于函数没有签名，ECMAScript 只支持实现继承，不支持接口继承

### 原型链

让原型对象等于另一个类型的实例

```jsx
function SuperType() {
    this.property = true;
}

SuperType.prototype.getSuperValue = function () {
    return this.property;
};

function SubType() {
    this.subproperty = false;
}//继承了 SuperType
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function () {
    return this.subproperty;
};
var instance = new SubType();
alert(instance.getSuperValue()); //true
```

**原型链的问题** 在通过原型来实现继承时，原型实际上会变成另一个类型的实例。一些引用属性会被共享

### 借用构造函数

```jsx
function SuperType() {
    this.colors = ["red", "blue", "green"];
}

function SubType() {    //继承了 SuperType
    SuperType.call(this);
}
```

**问题** 无法函数复用，超类型的原型中定义的方法，对子类型而言是不可见的

### 组合继承

```jsx
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function () {
    alert(this.name);
};

function SubType(name, age) {    //继承属性
    SuperType.call(this, name);
    this.age = age;
}//继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
    alert(this.age);
};
```

没什么缺点，但是调用了两次超类的构造函数，第一次是在创建子类原型的时候，第二次是在子类构造函数内部

### 原型式继承

```jsx
function object(o) {
    function F() {
    }

    F.prototype = o;
    return new F();
}
```

ECMAScript 5 通过新增 Object.create()方法规范化了原型式继承。这个方法接收两个参数:一 个用作新对象原型的对象和(可选的) 一个为新对象定义额外属性的对象。在传入一个参数的情况下， Object.create()与 object()方法的行为相同。

Object.create()方法的第二个参数与 Object.defineProperties()方法的第二个参数格式相同: 每个属性都是通过自己的描述符定义的。以这种方式指定的任何属性都会覆盖原型对象上的同名属性。

```jsx
var person = {name: "Nicholas", friends: ["Shelby", "Court", "Van"]};
var anotherPerson = Object.create(person, {name: {value: "Greg"}});
alert(anotherPerson.name); //"Greg"
```

### 寄生式继承

```jsx
function createAnother(original) {
    var clone = object(original); //通过调用函数创建一个新对象   
    clone.sayHi = function () { //以某种方式来增强这个对象   
        alert("hi");
    };
    return clone; //返回这个对象
}
```

### 寄生组合式继承

```jsx
function inheritPrototype(subType, superType) {
    var prototype = object(superType.prototype); //创建对象 
    prototype.constructor = subType; //增强对象  
    subType.prototype = prototype; //指定对象
}
```

# js 对象小结

ECMAScript 支持面向对象(OO)编程，但不使用类或者接口。对象可以在代码执行过程中创建和增强，因此具有动态性而非严格定义的实体。在没有类的情况下，可以采用下列模式创建对象。

- 工厂模式，使用简单的函数创建对象，为对象添加属性和方法，然后返回对象。这个模式后来被构造函数模式所取代。
- 构造函数模式，可以创建自定义引用类型，可以像创建内置对象实例一样使用 new 操作符。不过，构造函数模式也有缺点，即它的每个成员都无法得到复用，包括函数。由于函数可以不局限于任何对象( 即与对象具有松散耦合的特点)，因此没有理由不在多个对象间共享函数。
- 原型模式，使用构造函数的prototype属性来指定那些应该共享的属性和方法。组合使用构造函数模式和原型模式时，使用构造函数定义实例属性，而使用原型定义共享的属性和方法。 JavaScript 主要通过原型链实现继承。原型链的构建是通过将一个类型的实例赋值给另一个构造函数的原型实现的。这样，子类型就能够访问超类型的所有属性和方法，这一点与基于类的继承很相似。原型链的问题是对象实例共享所有继承的属性和方法，因此不适宜单独使用。解决这个问题的技术是借用构造函数，即在子类型构造函数的内部调用超类型构造函数。这样就可以做到每个实例都具有自己的属性，同时还能保证只使用构造函数模式来定义类型。使用最多的继承模式是组合继承，这种模式使用原型链继承共享的属性和方法，而通过借用构造函数继承实例属性。

此外，还存在下列可供选择的继承模式。

- 原型式继承，可以在不必预先定义构造函数的情况下实现继承，其本质是执行对给定对象的浅复制。而复制得到的副本还可以得到进一步改造。
- 寄生式继承，与原型式继承非常相似，也是基于某个对象或某些信息创建一个对象，然后增强对象，最后返回对象。为了解决组合继承模式由于多次调用超类型构造函数而导致的低效率问题，可以将这个模式与组合继承一起使用。
- 寄生组合式继承，集寄生式继承和组合继承的优点与一身，是实现基于类型继承的最有效方式。

# 继承

封装继承多态

从 ES6 开始，JavaScript 提供了 class 关键字来定义类，尽管，这样的方案仍然是基于原型运行时系统的模拟，大部分功能ES5可以实现。

构造函数的prototype属性在 ES6 的“类”上面继续存在。事实上，类中所有方法都定义在类的prototype属性上面（因而也是不可枚举的）。

constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。（默认构造函数）；constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。

注意区别：**类必须使用**new**调用，否则会报错**。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层。

私有属性和方法如何实现？1.命名上加以区别 2.将私有方法移出模块，利用公有方法调用；3.Symbol属性上（都不完美）