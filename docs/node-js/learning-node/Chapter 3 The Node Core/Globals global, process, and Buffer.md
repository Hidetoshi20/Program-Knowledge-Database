# Globals: global, process, and Buffer

There are several objects available to all Node applications without the user having to incorporate any module. The Node.js website groups these items under the descriptive label of *globals*.

We’ve been using one global, require, to include modules into our applications. We’ve also made extensive use of another global, console, to log messages to the console. Other globals are essential to the underlying implementation of Node, but aren’t necessarily anything we’d access or need to know about directly. Some, though, are important enough for us to take a closer look at, because they help define key aspects of how Node works.

In particular, we’re going to explore:

- The global object—that is, the global namespace
- The process object, which provides essential functionality, such as wrappers for the three STDIO (Standard IO) streams, and functionality to transform a synchronous function into an asynchronous callback
- The Buffer class, a global object that provides raw data storage and manipulation
- Child processes
- Modules useful for domain resolution and URL processing

## global

global is the global *namespace* object. In some ways, it’s similar to windows in a browser environment, in that it provides access to global properties and methods and doesn’t have to be explicitly referenced by name.

From REPL, you can print out the global object to the console like so:

> console.log(global)

What prints out is the interface for all of the other global objects, as well as a good deal of information about the system in which you’re running.

I mentioned that global is like the windows object in a browser, but there are key differences—and not just the methods and properties available. The windows object in a browser is truly global in nature. If you define a global variable in client-side JavaScript, it’s accessible by the web page and by every single library. However, if you create a variable at the top-level scope in a Node module (a variable outside a function), it only becomes global to the module, not to all of the modules.

You can actually see what happens to the global object when you define a module/global variable in REPL. First, define the top-level variable:

> var test = "This really isn't global, as we know global";

Then print out global:

> console.log(global);

You should see your variable, as a new property of global, at the bottom. For another interesting perspective, assign global to a variable, but don’t use the var keyword:

gl = global;

The global object interface is printed out to the console, and at the bottom you’ll see the local variable assigned as a *circular reference*:

> gl = global;

...

gl: [Circular],

_: [Circular] }

Any other global object or method, including require, is part of the global object’s interface.

When Node developers discuss *context*, they’re really referring to the global object. In Example 2-1 in Chapter 2, the code accessed the context object when creating a custom REPL object. The context object is a global object. When an application creates a custom REPL, it exists within a new context, which in this case means it has its own global object. The way to override this and use the existing global object is to create a custom REPL and set the useGlobal flag to true, rather than the default of false.

Modules exist in their own global namespace, which means that if you define a top-level variable in one module, it is not available in other modules. More importantly, it means that only what is explicitly exported from the module becomes part of whatever application includes the module. In fact, you can’t access a top-level module variable in an application or other module, even if you deliberately try.

To demonstrate, the following code contains a very simple module that has a top-level variable named globalValue, and functions to set and return the value. In the function that returns the value, the global object is printed out using a console.log method call.

var globalValue;

exports.setGlobal = function(val) {

globalValue = val;

};

exports.returnGlobal = function() {

console.log(global);

return globalValue;

};

We might expect that in the printout of the global object we’ll see globalValue, as we do when we set a variable in our applications. This doesn’t happen, though.

Start a REPL session and issue a require call to include the new module:

> var mod1 = require('./mod1.js');

Set the value and then ask for the value back:

> mod1.setGlobal(34);

> var val = mod1.returnGlobal();

The console.log method prints out the global object before returning its globally defined value. We can see at the bottom the new variable holding a reference to the imported module, but val is undefined because the variable hasn’t yet been set. In addition, the output includes no reference to that module’s own top-level globalValue:

mod1: { setGlobal: [Function], returnGlobal: [Function] },

_: undefined,

val: undefined }

If we ran the command again, then the outer application variable would be set, but we still wouldn’t see globalValue:

mod1: { setGlobal: [Function], returnGlobal: [Function] },

_: undefined,

val: 34 }

The only access we have to the module data is by whatever means the module provides. For JavaScript developers, this means no more unexpected and harmful data collisions because of accidental or intentional global variables in libraries.

## process

Each Node application is an instance of a Node process object, and as such, comes with certain built-in functionality.

Many of the process object’s methods and properties provide identification or information about the application and its environment. The process.execPath method returns the execution path for the Node application; process.version provides the Node version; and process.platform identifies the server platform:

console.log(process.execPath);

console.log(process.version);

console.log(process.platform);

This code returns the following in my system (at the time of this writing):

/usr/local/bin/node

v0.6.9

linux

The process object also wraps the STDIO streams stdin, stdout, and stderr. Both stdin and stdout are asynchronous, and are readable and writable, respectively. stderr, however, is a synchronous, blocking stream.

To demonstrate how to read and write data from stdin and stdout, in Example 3-1 the Node application listens for data in stdin, and repeats the data to stdout. The stdin stream is paused by default, so we have to issue a resume call before sending data.

Example 3-1. Reading and writing data to stdin and stdout, respectively

process.stdin.resume();

process.stdin.on('data', function (chunk) {

process.stdout.write('data: ' + chunk);

});

Run the application using Node, and then start typing into the terminal. Every time you type something and press Enter, what you typed is reflected back to you.

Another useful process method is memoryUsage, which tells us how much memory the Node application is using. This could be helpful for performance tuning, or just to satisfy your general curiosity about the application. The response has the following structure:

{ rss: 7450624, heapTotal: 2783520, heapUsed: 1375720 }

The heapTotal and heapUsed properties refer to the V8 engine’s memory usage.

The last process method I’m going to cover is process.nextTick. This method attaches a callback function that’s fired during the next tick (loop) in the Node event loop.

You would use process.nextTick if you wanted to delay a function for some reason, but you wanted to delay it asynchronously. A good example would be if you’re creating a new function that has a callback function as a parameter and you want to ensure that the callback is truly asynchronous. The following code is a demonstration:

function asynchFunction = function (data, callback) {

process.nextTick(function() {

callback(val);

});

);

If we just called the callback function, then the action would be synchronous. Now, the callback function won’t be called until the next tick in the event loop, rather than right away.

You could use setTimeout with a zero (0) millisecond delay instead of process.nextTick:

setTimeout(function() {

callback(val);

}, 0);

However, setTimeout isn’t as efficient as process.nextTick. When they were tested against each other, process.nextTick was called far more quickly than setTimeout with a zero-millisecond delay. You might also use process.nextTick if you’re running an application that has a function performing some computationally complex, and time-consuming, operation. You could break the process into sections, each called via process.nextTick, to allow other requests to the Node application to be processed without waiting for the time-consuming process to finish.

Of course, the converse of this is that you don’t want to break up a process that you need to ensure executes sequentially, because you may end up with unexpected results.

## Buffer

The Buffer class, also a global object, is a way of handling binary data in Node. In the section Servers, Streams, and Sockets later in the chapter, I’ll cover the fact that streams are often binary data rather than strings. To convert the binary data to a string, the data encoding for the stream socket is changed using setEncoding.

As a demonstration, you can create a new buffer with the following:

var buf = new Buffer(string);

If the buffer holds a string, you can pass in an optional second parameter with the encoding. Possible encodings are:

ascii

Seven-bit ASCII

utf8

Multibyte encoded Unicode characters

usc2

Two bytes, little-endian-encoded Unicode characters

base64

Base64 encoding

hex

Encodes each byte as two hexadecimal characters

You can also write a string to an existing buffer, providing an optional offset, length, and encoding:

buf.write(string); // offset defaults to 0, length defaults to

buffer.length - offset, encoding is utf8

Data sent between sockets is transmitted as a buffer (in binary format) by default. To send a string instead, you either need to call setEncoding directly on the socket, or specify the encoding in the function that writes to the socket. By default, the TCP (Transmission Control Protocol) socket.write method sets the second parameter to utf8, but the socket returned in the connectionListener callback to the TCP createServer function sends the data as a buffer, not a string.