# The Utilities Module and Object Inheritance

The Utilities module provides several useful functions. You include this module with:

```jsx
var util = require('util');
```

You can use Utilities to test if an object is an array (util.isArray) or regular expression (util.isRegExp), and to format a string (util.format). A new experimental addition to the module provides functionality to pump data from a readable stream to a writable stream (util.pump):

```jsx
util.pump(process.stdin, process.stdout);
```

However, I wouldn’t type this into `REPL`, as anything you type from that point on is echoed as soon as you type it—making the session a little awkward.

I make extensive use of `util.inspect` to get a string representation of an object. I find it’s a great way to discover more about an object. The first required argument is the object; the second optional argument is whether to display the nonenumerable properties; the third optional argument is the number of times the object is recursed (depth); and the fourth, also optional, is whether to style the output in `ANSI` colors. If you assign a value of null to the depth, it recurses indefinitely (the default is two times)—as much as necessary to exhaustively inspect the object. From experience, I’d caution you to be careful using null for the depth because you’re going to get a large output.

You can use `util.inspect` in `REPL`, but I recommend a simple application, such as the following:

```jsx
var util = require('util');

var jsdom = require('jsdom');

console.log(util.inspect(jsdom, true, null, true));
```

When you run it, pipe the result to a file:

```bash
node inspectjsdom.js > jsdom.txt
```

Now you can inspect and reinspect the object interface at your leisure. Again, if you use null for depth, expect a large output file.

## inherits

The Utilities module provides several other methods, but the one you’re most likely to use is `util.inherits`. The `util.inherits` function takes two parameters, constructor and superConstructor. The result is that the constructor will inherit the functionality from the super constructor.

[Example 3-11](\l) demonstrates all the nuances associated with using `util.inherits`. The explanation of the code follows.

> Note
[Example 3-11](\l) and its explanation cover some core JavaScript functionality you might already be familiar with. However, it’s important that all readers come away from this section with the same understanding of what’s happening.
> 

Example 3-11. Enabling object inheritance via the util.inherits method

```jsx
var util = require('util');

// define original object
function first() {
    var self = this;
    this.name = 'first';
    this.test = function () {
        console.log(self.name);
    };
}

first.prototype.output = function () {
    console.log(this.name);
}

// inherit from first
function second() {
    second.super_.call(this);
    this.name = 'second';
}

util.inherits(second, first);
var two = new second();
function third(func) {
    this.name = 'third';
    this.callMethod = func;
}

var three = new third(two.test);
// all three should output "second"
two.output();
two.test();
three.callMethod();
```

The application creates three objects named first, second, and third, respectively.

The first object has two methods: test and output. The test method is defined directly in the object, while the output method is added later via the prototype object. The reason I used both techniques for defining a method on the object is to demonstrate an important aspect of inheritance with util.inherits (well, of JavaScript, but enabled by util.inherits).

The second object contains the following line:

```jsx
second.super_.call(this);
```

If we eliminate this line from the second object constructor, any call to output on the second object would succeed, but a call to test would generate an error and force the Node application to terminate with a message about test being undefined.

The call method chains the constructors between the two objects, ensuring that the super constructor is invoked as well as the constructor. The super constructor is the constructor for the inherited object.

We need to invoke the super constructor since the test method doesn’t exist until first is created. However, we didn’t need the call method for the output method, because it’s defined directly on the first object’s prototype object. When the second object inherits properties from the first, it also inherits the newly added method.

If we look under the hood of util.inherits, we see where super_ is defined:

```jsx
exports.inherits = function (ctor, superCtor) {

    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
};
```

  
super_ is assigned as a property to the second object when util.inherits is called:

```jsx
util.inherits(second, first);
```

The third object in the application, third, also has a name property. It doesn’t inherit from either first or second, but does expect a function passed to it when it’s instantiated. This function is assigned to its own callMethod property. When the code creates an instance of this object, the two object instance’s test method is passed to the constructor:

```jsx
var three = new third(two.test);
```

When three.callMethod is called, “second” is output, not “third” as you might expect at first glance. And that’s where the self reference in the first object comes in.

In JavaScript, this is the object context, which can change as a method is passed around, or passed to an event handler. The only way you can preserve data for an object’s method is to assign this to an object variable—in this case, self—and then use the variable within any functions in the object.

Running this application results in the following output:

```bash
second

second

second
```

Much of this is most likely familiar to you from client-side JavaScript development, though it’s important to understand the Utilities part in the inheritance. The next section, which provides an overview of Node’s EventEmitter, features functionality that is heavily dependent on the inheritance behavior just described.