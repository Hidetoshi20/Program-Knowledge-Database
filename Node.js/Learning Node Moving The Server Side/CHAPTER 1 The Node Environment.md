# CHAPTER 1: The Node Environment

Be aware, though, that this can cause issues, especially in a team environ-ment. If your team members are using the version of npm that’s installed with Node, and you’ve manually upgraded npm to the newer version, you all can have inconsistent build results that may not be easy to discover.

I’ll cover npm in more detail in Chapter 3, but for now, note that you can keep all Node modules up to date with the following command:

sudo npm update -g

## Node, V8, and ES6

Behind Node is a JavaScript engine. For most implementations, the engine is V8. Originally created by Google for Chrome, the V8 source code was open-sourced in 2008. The V8 JavaScript engine was created to improve the speed of JavaScript by incorporating a JIT (Just-In-Time) compiler that compiles Java-Script to machine code, rather than interpreting it, which had been the norm for JavaScript for years. The V8 engine is written in C++.

M I C R O S O F T ’ S N O D E . J S F O R K

Microsoft forked Node to create a version that uses its JavaScript engine, Chakra, specifically to power its vision for Internet-of-Things (IoT). I’ll cover this fork in more detail in Chapter 12.

When Node 4.0 released, it did so with support for V8 4.5, the same version of the engine being used by Chrome. The Node maintainers are also committed to supporting upcoming versions of V8, as they’re released. This means that Node now incorporates support for many of the new ECMA-262 (ECMAScript 2015 or ES6) features.

N O D E V 5 V 8 S U P P O R T

Node v5 supports V8 version 4.6, and new releases of Node will support newer versions of V8, accordingly.

In prior versions of Node, to access the new ES6 features, you would have to use the harmony flag (--harmony ) when running the application:

node --harmony app.js

Now, ES6 feature support is based on the following criteria (directly from the Node.js documentation):

## Advanced: Node C/C++ Add-ons

- All shipping features, which V8 considers stable, are turned on by default on Node.js and do NOT require any kind of runtime flag.
- **Staged features** , which are almost-completed features that are not con-sidered stable by the V8 team, require a runtime flag: --es_staging (or its synonym, --harmony ).
- **In progress features can be activated individually by their respective har-**mony flag (e.g. --harmony_destructuring ), although this is highly dis-couraged unless for testing purposes.

I’ll cover the ES6 support in Node, and how to efectively use the diferent features, in Chapter 9. For now, know that the following are *some* of the ES6 fea-tures supported in Node, straight out of the can:

- Classes
- Promises
- Symbols
- Arrow Functions
- Generators
- Collections
- let
- the spread operator

Advanced: Node C/C++ Add-ons

Now that Node is installed and you’ve had your chance to play around with it a bit, you might be wondering exactly what it is you just installed.

Though the language used to create Node applications is based in Java-Script, much of Node is actually written in C++. Normally this information is be-hind the scenes in most applications we use, but if you’re familiar with C or C++, you can choose to extend Node functionality using C/C++ to create an *add-on* .

Writing a Node add-on is not the same as writing a more traditional C/C++ application. For one, there are libraries, such as the V8 library, you’ll typically access. For another, the Node add-on is not compiled using the tools you would normally use.

The Node documentation for add-ons provides a Hello World example of an add-on. You can check out the code for the short example, which should be fa-miliar if you have programmed with C/C++. Once you’ve written the code, though, you’ll need to use a tool, node-gyp , to actually compile the add-on in-to a .node file.

First a configuration file named binding.gyp is created. It uses a JSON-like format to provide information about the add-on:

CHAPTER 1: The Node Environment

{

"targets": [

{

"target_name": "addon",

"sources": [ "hello.cc" ]

}

]

}

The Node add-on configuration step is performed using the following com-mand:

node-gyp configure

It creates the appropriate configuration file (a Makefile for Unix, a vcxproj file in Windows) and placed it in the build/ directory. To build the Node add-on, run the following command

node-gyp build

The compiled add-on is installed in the build/release directory, and is now ready to use. You can import it into your application like you would many of the others installed with Node (covered in **Chapter 3** ).

M A I N T A I N I N G N A T I V E M O D E M O D U L E S

Though outside the scope of this book, if you’re interested in creating native mode modules (the add-ons), you need to be aware of platform differences. For instance, Microsoft provides **special instructions for native modules in Azure** , and the maintainer for the popular **node-serialport native module detailed the challenges he’s faced maintain-ing the module** .

Of course, if you’re not familiar with C/C++, you’ll most likely want to create modules using JavaScript, and I’ll cover that in **Chapter 3** , also. But if you do know these languages, an add-on can be an efective extension, especially for system specific needs.

One thing to be aware of is the rather dramatic changes that have occurred within Node as it progressed from 0.8 through the new 4.x. To counter the prob-lems that can occur, you’ll need to install NAN, or **Native Abstractions for Node.js** . This header file helps to smooth out the diferences between the ver-sions of Node.js.

Node Building Blocks: the 2 Global Objects, Events, and

Node’s Asynchronous Nature Though both are built on JavaScript, the environment between browser-based applications and Node.js applications are very diferent. One fundamental dif-ference between its browser-based JavaScript cousin and Node is the *bufer for* binary data. True, Node does now have access to the ES6 ArrayBufer and *typed arrays* . However, most binary data functionality in Node is implemented with the Buffer class.

The buffer is one of Node’s global objects. Another global object is glob-al , itself, though the global object in Node is fundamentally diferent than the global object we’re used to in the browser. Node developers also have access to another global object, process , providing a bridge between the Node applica-tion and its environment.

Thankfully, one aspect of Node should be familiar to front-end developers and that’s its event-driven asynchronous nature. The diference in Node is that we’re waiting for files to open rather than for users to click a button.

Event-driven also means those old friends, the timer functions, are also available in Node.

M O D U L E S A N D C O N S O L E

I’ll cover several other global components— require , exports , module , and console — later in the book. I cover the require , exports , and module

globals in Chapter 3, and the console in Chapter 4.

The global and process objects

Two fundamental objects in Node are the global and process objects. The global object is somewhat similar to the global object in the browser, with

CHAPTER 2: Node Building Blocks: the Global Objects, Events, and Node’s Asynchronous Nature some very major diferences. The process object, however, is pure Node, all the way.

The global Object

In the browser, when you declare a variable at the top-level, it’s declared glob-ally. It doesn’t work that way in Node. When you declare a variable in a module or application in Node, the variable isn’t globally available; it’s restricted to just the module or application. So you can declare a “global” variable named str in a module, and also in the application that uses the module, and there won’t be any conflict.

To demonstrate, we’ll create a simple function that adds a number to a base and returns the result. We’ll create it as a JavaScript library to use in a web page, and as a module to use in a Node application.

The code for the JavaScript library, added to a file named add2.js , declares a base variable, sets it to the value of 2 and then adds it to whatever number is passed to it:

var base = 2;

function addtwo(input) {

return parseInt(input) + base;

}

Next, we’ll create a very simple module that does the same thing, except us-ing Node module syntax. I’ll cover the specifics of the module in Chapter 3, but for now, copy the following code into a file named addtwo.js :

var base = 2;

exports.addtwo = function(input) {

return parseInt(input) + base;

};

Now to demonstrate the diferences in global in both environments. The add2.js library is used in a web page, which also declares a base variable:

<!DOCTYPE html>

<html>

<head>

<script src="add2.js"></script>

<script>

var base = 10;

The global and process objects

console.log(addtwo(10));

</script>

</head>

<body>

</body>

</html>

Accessing the web page with a browser displays a value of 20, rather than the expected 12, in the browser console. The reason why is that all variables de-clared outside a function in JavaScript in the browser are all added to the same global object. When we declared a new variable named base in the web page, we overrode the value in the included script file.

Now, we’ll use the addtwo module in a Node application:

var addtwo = require('./addtwo').addtwo;

var base = 10;

console.log(addtwo(base));

The result of the Node application is 12. Declaring the new base variable in the Node application had no impact on the value of base in the module, be-cause they both exist in diferent global namespaces.

Eliminating a shared namespace is a distinct improvement, but it isn’t uni-versal. What global does share in all environments is access to all the globally available Node objects and functions, including the process object, covered next. You can check it out for yourself by adding the following to a file and run-ning the application. It prints out all the globally available objects and func-tions:

console.log(global);

The process Object

The process object is an essential component of the Node environment, as it provides information about the runtime environment. In addition, standard in-put/output (I/O) occurs through process, you can gracefully terminate a Node application, and you can even signal when the Node *event loop (covered later in* this chapter) has finished a cycle.

The process object is featured in many applications throughout the book, so check the index for all appearances. For now, we’ll take a closer look at the process object’s environmental reporting, as well as the all-important standard I/O.