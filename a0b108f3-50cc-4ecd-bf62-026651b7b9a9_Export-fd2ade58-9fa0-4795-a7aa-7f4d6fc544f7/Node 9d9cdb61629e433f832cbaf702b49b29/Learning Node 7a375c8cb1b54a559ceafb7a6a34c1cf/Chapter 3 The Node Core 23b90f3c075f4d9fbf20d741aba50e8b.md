# Chapter 3. The Node Core

[Chapter 1](\l) provided a first look at a Node application with the traditional (and always entertaining) Hello, World application. The examples in the chapter made use of a couple of modules from what is known as the *Node core*: the API providing much of the functionality necessary for building Node applications.

In this chapter, I’m going to provide more detail on the Node core system. It’s not an exhaustive overview, since the API is quite large and dynamic in nature. Instead, we’ll focus on key elements of the API, and take a closer look at those that we’ll use in later chapters and/or are complex enough to need a more in-depth review.

Topics covered in this chapter include:

- Node global objects, such as global, process, and Buffer
- The timer methods, such as setTimeout
- A quick overview of socket and stream modules and functionality
- The Utilities object, especially the part it plays in Node inheritance
- The EventEmitter object and events

> Note
Node.js documentation for the current stable release is available at http://nodejs.org/api/.
> 

[Globals: global, process, and Buffer](Chapter%203%20The%20Node%20Core%2023b90f3c075f4d9fbf20d741aba50e8b/Globals%20global,%20process,%20and%20Buffer%207ebe1a50f9e04928aa997abba186c37b.md)

[The Timers: setTimeout, clearTimeout, setInterval, and clearInterval](Chapter%203%20The%20Node%20Core%2023b90f3c075f4d9fbf20d741aba50e8b/The%20Timers%20setTimeout,%20clearTimeout,%20setInterval,%20%209d4e168c4ba141dead72da32b7c1744b.md)

[Servers, Streams, and Sockets](Chapter%203%20The%20Node%20Core%2023b90f3c075f4d9fbf20d741aba50e8b/Servers,%20Streams,%20and%20Sockets%2035d5b25d6a994dfe8138729b10b8b283.md)

[Domain Resolution and URL Processing](Chapter%203%20The%20Node%20Core%2023b90f3c075f4d9fbf20d741aba50e8b/Domain%20Resolution%20and%20URL%20Processing%2096e542b54f6e411ea926b74f77dee659.md)

[The Utilities Module and Object Inheritance](Chapter%203%20The%20Node%20Core%2023b90f3c075f4d9fbf20d741aba50e8b/The%20Utilities%20Module%20and%20Object%20Inheritance%20d8773255c5d840dc9e0e82a706654f03.md)

[Events and EventEmitter](Chapter%203%20The%20Node%20Core%2023b90f3c075f4d9fbf20d741aba50e8b/Events%20and%20EventEmitter%201d0a2427ce0a4652bfb52850730669fd.md)