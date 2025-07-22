# Events and EventEmitter

Scratch underneath the surface of many of the Node core objects, and you’ll find EventEmitter. Anytime you see an object emit an event, and an event handled with on, you’re seeing EventEmitter in action. Understanding how EventEmitter works and how to use it are two of the more important components of Node development.

The EventEmitter object is what provides the asynchronous event handling to objects in Node. To demonstrate its core functionality, we’ll try a quick test application.

First, include the Events module:

var events = require('events');

Next, create an instance of EventEmitter:

var em = new events.EventEmitter();

Use the newly created EventEmitter instance to do two essential tasks: attach an event handler to an event, and emit the actual event. The on event handler is triggered when a specific event is emitted. The first parameter to the method is the name of the event, the second a function to process the event:

em.on('someevent', function(data) { ... });

The event is emitted on the object, based on some criteria, via the emit method:

if (somecriteria) {

en.emit('data');

}

In [Example 3-12](\l), we create an EventEmitter instance that emits an event, timed, every three seconds. In the event handler function for this event, a message with a counter is output to the console.

Example 3-12. Very basic test of the EventEmitter functionality

var eventEmitter = require('events').EventEmitter;

var counter = 0;

var em = new eventEmitter();

setInterval(function() { em.emit('timed', counter++); }, 3000);

em.on('timed', function(data) {

console.log('timed ' + data);

});

Running the application outputs timed event messages to the console until the application is terminated.

This is an interesting example, but not particularly helpful. What we need is the ability to add EventEmitter functionality to our existing objects—not use instances of EventEmitter throughout our applications.

To add this necessary EventEmitter functionality to an object, use the util.inherits method, described in the preceding section:

util.inherits(someobj, EventEmitter);

By using util.inherits with the object, you can call the emit method within the object’s methods, and code event handlers on the object instances:

someobj.prototype.somemethod = function() { this.emit('event'); };

...

someobjinstance.on('event', function() { });

Rather than attempt to decipher how EventEmitter works in the abstract sense, let’s move on to [Example 3-13](\l), which shows a working example of an object inheriting EventEmitter’s functionality. In the application, a new object, inputChecker, is created. The constructor takes two values, a person’s name and a filename. It assigns the person’s name to an object variable, and also creates a reference to a writable stream using the File System module’s createWriteStream method (for more on the File System module, see the sidebar [Readable and Writable Stream](\l)).

### Readable and Writable Stream

The Node File System module (fs) enables us to open a file for reading and writing, to watch specific files for new activity, and to manipulate directories. It also provides us with readable and writable stream capability.

You create a readable stream using fs.createReadStream, passing in the name and path for the file and other options. You create a writable stream with fs.createWriteStream, also passing in a filename and path.

You’d use a writable and readable stream over the more traditional read and write methods in situations when you’re reading and writing from a file based on events where the reads and writes can occur frequently. The streams are opened in the background, and reads (and writes) are queued.

The object also has a method, check, that checks incoming data for specific commands. One command (wr:) triggers a write event, another (en:) an end event. If no command is present, then an echo event is triggered. The object instance provides event handlers for all three events. It writes to the output file for the write event, it echoes the input for the commandless input, and it terminates the application with an end event, using the process.exit method.

All input comes from standard input (process.stdin).

Example 3-13. Creating an event-based object that inherits from EventEmitter

var util = require('util');

var eventEmitter = require('events').EventEmitter;

var fs = require('fs');

function inputChecker (name, file) {

this.name = name;

this.writeStream = fs.createWriteStream('./' + file + '.txt',

{'flags' : 'a',

'encoding' : 'utf8',

'mode' : 0666});

};

util.inherits(inputChecker,eventEmitter);

inputChecker.prototype.check = function check(input) {

var command = input.toString().trim().substr(0,3);

if (command == 'wr:') {

**this.emit('write',input.substr(3,input.length));**
} else if (command == 'en:') {**this.emit('end');**
} else {**this.emit('echo',input);**
}
};
// testing new object and event handling
var ic = new inputChecker('Shelley','output');**ic.on('write', function(data) {this.writeStream.write(data, 'utf8');});ic.on('echo', function( data) {console.log(this.name + ' wrote ' + data);});ic.on('end', function() {process.exit();});**
process.stdin.resume();
process.stdin.setEncoding('utf8');**process.stdin.on('data', function(input) {ic.check(input);});**

The EventEmitter functionality is bolded in the example. Note that the functionality also includes the process.stdin.on event handler method, since process.stdin is one of the many Node objects that inherit from EventEmitter.

We don’t have to chain the constructors from the new object to EventEmitter, as demonstrated in the earlier example covering util.inherits, because the functionality we need—on and emit—consists of prototype methods, not object instance properties.

The on method is really a shortcut for the EventEmitter.addListener method, which takes the same parameters. So this:

ic.addListener('echo', function( data) {

console.log(this.name + ' wrote ' + data);

});

is exactly equivalent to:

ic.on('echo', function( data) {

console.log(this.name + ' wrote ' + data);

});

You can listen only to the first event with:

ic.once(event, function);

When you exceed 10 listeners for an event, you’ll get a warning by default. Use setMaxListeners, passing in a number, to change the number of listeners. Use a value of zero (0) for an unlimited amount of listeners.

Many of the core Node objects, as well as third-party modules, make use of EventEmitter. In [Chapter 4](\l), I’ll demonstrate how to convert the code in [Example 3-13](\l) into a module.