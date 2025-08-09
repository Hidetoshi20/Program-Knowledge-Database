# Chapter 3. The Node Core

Chapter 1 provided a first look at a Node application with the traditional (and always entertaining) Hello, World application. The examples in the chapter made use of a couple of modules from what is known as the *Node core*: the API providing much of the functionality necessary for building Node applications.

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

[Globals: global, process, and Buffer](chapter-3-the-node-core/globals-global-process-and-buffer.md)

[The Timers: setTimeout, clearTimeout, setInterval, and clearInterval](chapter-3-the-node-core/the-timers-settimeout-cleartimeout-setinterval.md)

[Servers, Streams, and Sockets](chapter-3-the-node-core/servers-streams-and-sockets.md)

[Domain Resolution and URL Processing](chapter-3-the-node-core/domain-resolution-and-url-processing.md)

[The Utilities Module and Object Inheritance](chapter-3-the-node-core/the-utilities-module-and-object-inheritance.md)

[Events and EventEmitter](chapter-3-the-node-core/events-and-eventemitter.md)