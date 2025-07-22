# Chapter 5

Chapter 5. Control Flow, Asynchronous Patterns, and Exception Handling

Node might seem intimidating at times, with discussions about asynchronous events and callbacks and new objects such as EventEmitter—not to mention all that new server-side functionality we have to play with. If you’ve worked with any of the modern JavaScript libraries, though, you’ve experienced much of the functionality that goes into Node, at least when it comes to asynchronous development.

For instance, if you’ve used a timer in JavaScript, you’ve used an asynchronous function. If you’ve ever developed in Ajax, you’ve used an asynchronous function. Even the plain old onclick event handler is an asynchronous function, since we never know when the user is going to click that mouse or tap that keyboard.

Any method that doesn’t block the control thread while waiting for some event or result is an asynchronous function. When it comes to the onclick handling, the application doesn’t block all other application processing, waiting for that user’s mouse click—just as it doesn’t block all functionality while the timer is in effect, or while waiting for the server to return from an Ajax call.

In this chapter, we’re going to look more closely at exactly what we mean by the term *asynchronous control*. In particular, we’re going to look at some asynchronous design patterns, as well as explore some of the Node modules that provide finer control over program flow when we’re working in this new environment. And since asynchronous control can add some new and interesting twists when it comes to error handling, we’re also going to take a closer look at exception handling within an asynchronous Node environment.

# Promises, No Promises, Callback Instead

In the earlier days of Node, asynchronous functionality was facilitated through the use of *promises*, a concept that arose in the 1970s. A promise is an object that represents the result of an asynchronous action. It’s also known as a *future*, a *delay*, or simply *deferred*. The CommonJS design model embraced the concept of the promise.

In the earlier Node implementation, a promise was an object that emitted exactly two events: success and error. Its use was simple: if an asynchronous operation succeeded, the success event was emitted; otherwise, the error event was emitted. No other events were emitted, and the object would emit one or the other, but not both, and no more than once. [Example 5-1](\l) incorporates a previously implemented promise into a function that opens and reads in a file.

Example 5-1. Using a previously implemented Node promise

function test_and_load(filename) {

var promise = new process.Promise();

fs.stat(filename).addCallback(function (stat) {

// Filter out non-files

if (!stat.isFile()) { promise.emitSuccess(); return; }

// Otherwise read the file in

fs.readFile(filename).addCallback(function (data) {

promise.emitSuccess(data);

}).addErrback(function (error) {

promise.emitError(error);

});

}).addErrback(function (error) {

promise.emitError(error);

});

return promise;

}

Each object would return the promise object. The code to process a successful result would be passed as a function to the promise object’s addCallback method, which had one parameter, the data. The code to process the error would be passed as a function to the promise object’s addErrback method, which received the error as its one and only parameter:

var File = require('file');

var promise = File.read('mydata.txt');

promise.addCallback(function (data) {

// process data

});

promise.addErrback(function (err) {

// deal with error

})

The promise object ensured that the proper functionality was performed whenever the event finished—either the results could be manipulated, or the error processed.

### Note

The code for [Example 5-1](\l) is one of a number of examples of possible asynchronous function techniques documented at http://groups.google.com/group/nodejs/browse_thread/thread/8dab9f0a5ad753d5 as part of the discussions about how Node would handle this concept in the future.

The promise object was pulled from Node in version 0.1.30. As Ryan Dahl noted at the time, the reasoning was:

Because many people (myself included) only want a low-level interface to file system operations that does not necessitate creating an object, while many other people want something like promises but different in one way or another. So instead of promises we’ll use last argument callbacks and consign the task of building better abstraction layers to user libraries.

Rather than the promise object, Node incorporated the *last argument callbacks* we’ve used in previous chapters. All asynchronous methods feature a callback function as the last argument. The first argument in this callback function is always an error object.

To demonstrate the fundamental structure of the callback functionality, [Example 5-2](\l) is a complete Node application that creates an object with one method, someMethod. This method takes three arguments, the second of which must be a string, and the third being the callback. In the method, if the second argument is missing or is not a string, the object creates a new Error object, which is passed to the callback function. Otherwise, whatever the result of the method is gets passed to the callback function.

Example 5-2. The fundamental structure of the last callback functionality

var obj =function() { };

obj.prototype.doSomething = function(arg1, arg2_) {

var arg2 = typeof(arg2_) === 'string' ? arg2_ : null;

**var callback_ = arguments[arguments.length - 1];callback = (typeof(callback_) == 'function' ? callback_ : null);**
if (!arg2)**return callback(new Error('second argument missing or not a string'));callback(arg1);**
}
var test = new obj();
try {
test.doSomething('test', 3.55, function(err,value) {
if (err) throw err;
console.log(value);
});
} catch(err) {
console.error(err);
}

The key elements of the callback functionality are in boldface in the code.

The first key functionality is to ensure the last argument is a callback function. Well, we can’t determine the user’s intent, but we can make sure the last argument is a function, and that will have to do. The second key functionality is to create the new Node Error object if an error occurs, and return it as the result to the callback function. The last critical functionality is to invoke the callback function, passing in the method’s result if no error occurs. In short, everything else is changeable, as long as these three key functionalities are present:

- Ensure the last argument is a function.
- Create a Node Error and return it if an error occurs.
- If no error occurs, invoke the callback function, passing the method’s result.

With the existing code in [Example 5-1](\l), the application output is the following error message printed out to the console:

[Error: second argument missing or not a string]

Changing the method call in the code to the following:

test.doSomething('test','this',function(err,value) {

results in test being printed out to the console. Changing it then to the following:

test.doSomething('test',function(err,value) {

again results in an error, this time because the second argument is missing.

If you look through the code in the *lib* directory of the Node installation, you’ll see the last callback pattern repeated throughout. Though the functionality may change, this pattern remains the same.

This approach is quite simple and ensures consistent results from asynchronous methods. However, it also creates its own unique challenges, as we’ll cover in the next section.

# Sequential Functionality, Nested Callbacks, and Exception Handling

It’s not unusual to find the following in a client-side JavaScript application:

val1 = callFunctionA();

val2 = callFunctionB(val1);

val3 = callFunctionC(val2);

The functions are called, in turn, passing the results from the earlier function to each subsequent function. Since all the functions are synchronous, we don’t have to worry about the function calls getting out of sequence—no unexpected results.

[Example 5-3](\l) shows a relatively common case of this type of sequential programming. The application uses synchronous versions of Node’s File System methods to open a file and get its data, modify the data by replacing all references to “apple” with “orange,” and output the resulting string to a new file.

Example 5-3. A sequential synchronous application

var fs = require('fs');

try {

var data = fs.readFileSync('./apples.txt','utf8');

console.log(data);

var adjData = data.replace(/[A|a]pple/g,'orange');

fs.writeFileSync('./oranges.txt', adjData);

} catch(err) {

console.error(err);

}

Since problems can occur and we can’t be sure errors are handled internally in any module function, we wrap all of the function calls in a try block to allow for graceful—or at least, more informative—exception handling. The following is an example of what the error looks like when the application can’t find the file to read:

{ [Error: ENOENT, no such file or directory './apples.txt']

errno: 34,

code: 'ENOENT',

path: './apples.txt',

syscall: 'open' }

While perhaps not very user-friendly, at least it’s a lot better than the alternative:

node.js:201

throw e; // process.nextTick error, or 'error' event on first tick

^

Error: ENOENT, no such file or directory './apples.txt'

at Object.openSync (fs.js:230:18)

at Object.readFileSync (fs.js:120:15)

at Object.<anonymous> (/home/examples/public_html/node/read.js:3:18)

at Module._compile (module.js:441:26)

at Object..js (module.js:459:10)

at Module.load (module.js:348:31)

at Function._load (module.js:308:12)

at Array.0 (module.js:479:10)

at EventEmitter._tickCallback (node.js:192:40)

In the example, we’re going to have expected results because each function call is performed in sequence.

Converting this synchronous sequential application pattern to an asynchronous implementation requires a couple of modifications. First, we have to replace all functions with their asynchronous counterparts. However, we also have to account for the fact that each function doesn’t block when called, which means we can’t guarantee the proper sequence if the functions are called independently of each other. The only way to ensure that each function is called in its proper sequence is to use *nested callbacks*.

[Example 5-4](\l) is an asynchronous version of the application from [Example 5-3](\l). All of the File System function calls have been replaced by their asynchronous versions, and the functions are called in the proper sequence via a nested callback.

Example 5-4. Application from [Example 5-3](\l) converted into asynchronous nested callbacks

var fs = require('fs');

try {

fs.readFile('./apples2.txt','utf8', function(err,data) {

if (err) throw err;

var adjData = data.replace(/[A|a]pple/g,'orange');

fs.writeFile('./oranges.txt', adjData, function(err) {

if (err) throw err

});

});

} catch(err) {

console.error(err);

}

In [Example 5-4](\l), the input file is opened and read, and only when both actions are finished does the callback function passed as the last parameter get called. In this function, the error is checked to make sure it’s null. If not, the error is thrown for catching in the outer exception-handling block.

### Note

Some style guides frown on throwing an error, and more complex frameworks provide error-handling objects and functions to ensure that all errors are resolved. My primary concern is that errors are handled.

If no error occurs, the data is processed and the asynchronous writeFile method is called. Its callback function has only one parameter, the error object. If it’s not null, it’s thrown for handling in the outer exception block.

If an error occurred, it would look similar to the following:

/home/examples/public_html/node/read2.js:11

if (err) throw err;

^

Error: ENOENT, no such file or directory './boogabooga/oranges.txt'

If you want the stack trace of the error, you can print out the stack property of the Node error object:

catch(err) {

console.log(err.stack);

}

Including another sequential function call adds another level of callback nesting. In [Example 5-5](\l), we access a listing of files for a directory. In each of the files, we replace a generic domain name with a specific domain name using the string replace method, and the result is written *back* to the original file. A log is maintained of each changed file, using an open write stream.

Example 5-5. Retrieving directory listing for files to modify

var fs = require('fs');

var writeStream = fs.createWriteStream('./log.txt',

{'flags' : 'a',

'encoding' : 'utf8',

'mode' : 0666});

try {

// get list of files

fs.readdir('./data/', function(err, files) {

// for each file

files.forEach(function(name) {

// modify contents

fs.readFile('./data/' + name,'utf8', function(err,data) {

if (err) throw err;

var adjData = data.replace(/somecompany\.com/g,'burningbird.net');

// write to file

fs.writeFile('./data/' + name, adjData, function(err) {

if (err) throw err;

// log write

writeStream.write('changed ' + name + '\n', 'utf8', function(err) {

if(err) throw err;

});

});

});

});

});

} catch(err) {

console.error(util.inspect(err));

}

Though the application looks like it’s processing each file individually before moving on to the next, remember that each of the methods used in this application is asynchronous. If you run the application several times and check the *log.txt* file, you’ll see that the files are processed in a different, seemingly random order. In my *data* subdirectory I had five files. Running the application three times in a row resulted in the following output to *log.txt* (blank lines inserted for clarity):

changed data1.txt

changed data3.txt

changed data5.txt

changed data2.txt

changed data4.txt

changed data3.txt

changed data1.txt

changed data5.txt

changed data2.txt

changed data4.txt

changed data1.txt

changed data3.txt

changed data5.txt

changed data4.txt

changed data2.txt

Another issue arises if you want to check when all of the files have been modified in order to do something. The forEach method invokes the iterator callback functions asynchronously, so it doesn’t block. Adding a statement following the use of forEach, like the following:

console.log('all done');

doesn’t really mean the application is all finished, just that the forEach method didn’t block. If you add a console.log statement at the same time you log the changed file:

writeStream.write('changed ' + name + '\n', 'utf8', function(err) {

if(err) throw err;

console.log('finished ' + name);

});

and add the following after the forEach method call:

console.log('all finished');

you’ll actually get the following console output:

all done

finished data3.txt

finished data1.txt

finished data5.txt

finished data2.txt

finished data4.txt

To solve this challenge, add a counter that is incremented with each log message and then checked against the file array’s length to print out the “all done” message:

// before accessing directory

var counter = 0;

...

writeStream.write('changed ' + name + '\n', 'utf8', function(err) {

if(err) throw err;

console.log('finished ' + name);

counter++;

if (counter >= files.length)

console.log('all done');

});

You’d then get the expected result: an “all done” message displays after all the files have been updated.

The application works quite well—except if the directory we’re accessing has subdirectories as well as files. If the application encounters a subdirectory, it spits out the following error:

/home/examples/public_html/node/example5.js:20

if (err) throw err;

^

Error: EISDIR, illegal operation on a directory

[Example 5-6](\l) prevents this type of error by using the fs.stats method to return an object representing the data from a Unix stat command. This object contains information about the object, including whether it’s a file or not. The fs.stats method is, of course, another asynchronous method, requiring yet more callback nesting.

Example 5-6. Adding in a stats check of each directory object to make sure it’s a file

var fs = require('fs');

var writeStream = fs.createWriteStream('./log.txt',

{'flags' : 'a',

'encoding' : 'utf8',

'mode' : 0666});

try {

// get list of files

fs.readdir('./data/', function(err, files) {

// for each file

files.forEach(function(name) {

// check to see if object is file

fs.stat('./data/' + name, function(err, stats) {

if (err) throw err;

if (stats.isFile())

// modify contents

fs.readFile('./data/' + name,'utf8', function(err,data) {

if (err) throw err;

var adjData = data.replace(/somecompany\.com/g,'burningbird.net');

// write to file

fs.writeFile('./data/' + name, adjData, function(err) {

if (err) throw err;

// log write

writeStream.write('changed ' + name + '\n', 'utf8',

function(err) {

if(err) throw err;

});

});

});

});

});

});

} catch(err) {

console.error(err);

}

Again, the application performs its purpose, and performs it well—but how difficult it is to read and maintain! I’ve heard this type of nested callback called *callback spaghetti* and the even more colorful *pyramid of doom*, both of which are apt terms.

The nested callbacks continue to push against the right side of the document, making it more difficult to ensure we have the right code in the right callback. However, we can’t break the callback nesting apart because it’s essential that the methods be called in turn:

1. Start the directory lookup.
2. Filter out subdirectories.
3. Read each file’s contents.
4. Modify the contents.
5. Write back to the original file.

What we’d like to do is find a way of implementing this series of method calls but without having to depend on nested callbacks. For this, we need to look at third-party modules that provide asynchronous control flow.

### Note

Another approach is to provide a named function as a callback function for each method. This way, you can flatten the pyramid, and it can simplify debugging. However, this approach doesn’t solve some of the other problems, such as determining when all processes have finished. For this, you still need the third-party libraries.

# Asynchronous Patterns and Control Flow Modules

The application in [Example 5-6](\l) is an example of an asynchronous pattern, where each function is called in turn and passes its results to the next function, and the entire chain stops only if an error occurs. There are several such patterns, though some are variations of others, and not everyone uses the exact same terminology.

One Node module, Async, provides names and support for the most extensive list of asynchronous control flow patterns:

waterfall

Functions are called in turn, and results of all are passed as an array to the last callback (also called series and sequence by others).

series

Functions are called in turn and, optionally, results are passed as an array to the last callback.

parallel

Functions are run in parallel and when completed, results are passed to the last callback (though the result array isn’t part of the pattern in some interpretations of the parallel pattern).

whilst

Repeatedly calls one function, invoking the last callback only if a preliminary test returns false or an error occurs.

queue

Calls functions in parallel up to a given limit of concurrency, and new functions are queued until one of the functions finishes.

until

Repeatedly calls one function, invoking the last callback only if a post-process test returns false or an error occurs.

auto

Functions are called based on requirements, each function receiving the results of previous callbacks.

iterator

Each function calls the next, with the ability to individually access the next iterator.

apply

A continuation function with arguments already applied combined with other control flow functions.

nextTick

Calls the callback in the next loop of an event loop—based on process.nextTick in Node.

In the listing of modules provided at the Node.js website, there is a category titled “Control Flow/Async Goodies.” In this list is the Async module, which provides the asynchronous control patterns I just listed. Though not every control flow module provides the capability to handle all possible patterns, most provide functionality for the most common patterns: series (also called sequence and sometimes referred to as waterfall—as in the preceding list—though Async lists waterfall separately from series) and parallel. In addition, some of the modules also reinstate the concept of promises from earlier editions of Node, while others implement a concept called *fibers*, which emulate threads.

In the next couple of sections, I’ll demonstrate two of the more popular of the actively maintained control flow modules: Step and Async. Each offers its own unique perspective on asynchronous control flow management, though both provide a very useful—and likely essential—service.

## Step

Step is a focused utility module that enables simplified control flow for serial and parallel execution. It can be installed using npm as follows:

npm install step

The Step module exports exactly one object. To use the object for serial execution, wrap your asynchronous function calls within functions that are then passed as parameters to the object. For instance, in [Example 5-7](\l), Step is used to read the contents of a file, modify the contents, and write them back to the file.

Example 5-7. Using Step to perform serial asynchronous tasks

var fs = require('fs'),

Step = require('step');

try {

Step (

function readData() {

fs.readFile('./data/data1.txt', 'utf8', this);

},

function modify(err, text) {

if (err) throw err;

return text.replace(/somecompany\.com/g,'burningbird.net');

},

function writeData(err, text) {

if (err) throw err;

fs.writeFile('./data/data1.txt', text, this);

}

);

} catch(err) {

console.error(err);

}

The first function in the Step sequence, readData, reads a file’s contents into a string, which is then passed to a second function. The second function modifies the string using replacement, and the result is passed to a third function. In the third function, the modified string is written back to the original file.

### Note

For more information, see the Step GitHub site at https://github.com/creationix/step.

In more detail, the first function wraps the asynchronous fs.readFile. However, rather than pass a callback function as the last parameter, the code passes the this context. When the function is finished, its data and any possible error are sent to the next function, modify. The modify function isn’t an asynchronous function, as all it’s doing is replacing one substring for another in the string. It doesn’t require the this context, and just returns the result at the end of the function.

The last function gets the newly modified string and writes it back to the original file. Again, since it’s an asynchronous function, it gets this in place of the callback function. If we didn’t include this as the last parameter to the final function, any errors that occur wouldn’t be thrown and caught in the outer loop. If the *boogabooga* subdirectory didn’t exist with the following modified code:

function writeFile(err, text) {

if (err) throw err;

fs.writeFile('./boogabooga/data/data1.txt');

}

we’d never know that the write failed.

Even though the second function isn’t asynchronous, every function but the first in Step requires the error object as the first parameter for consistency. It’s just null by default in a synchronous function.

[Example 5-7](\l) performs part of the functionality of the application in [Example 5-6](\l). Could it do the rest of the functionality, especially handling modification to multiple files? The answer is yes, and no. Yes, it can do the work, but only if we throw in some kludgy code.

In [Example 5-8](\l), I added in the readir asynchronous function to get a list of files in a given subdirectory. The array of files is processed with a forEach command, like in [Example 5-6](\l), but the end of the call to readFile isn’t a callback function or this. In Step, the call to create the group object signals to reserve a parameter for a group result; the call to the group object in the readFile asynchronous function results in each of the callbacks being called in turn, and the results being grouped into an array for the next function.

Example 5-8. Using Step’s group() capability to handle grouped asynchronous processes

var fs = require('fs'),

Step = require('step'),

files,

_dir = './data/';

try {

Step (

function readDir() {

fs.readdir(_dir, this);

},

function readFile(err, results) {

if (err) throw err;

files = results;

var group = this.group();

results.forEach(function(name) {

fs.readFile(_dir + name, 'utf8', group());

});

},

function writeAll(err, data) {

if (err) throw err;

for (var i = 0; i < files.length; i++) {

var adjdata = data[i].replace(/somecompany\.com/g,'burningbird.net');

fs.writeFile(_dir + files[i], adjdata, 'utf8',this);

}

}

);

} catch(err) {

console.log(err);

}

To preserve the filenames, the readdir result is assigned to a global variable, files. In the last Step function, a regular for loop cycles through the data to modify it, and then cycles through the files variable to get the filename. Both the filename and modified data are used in the last asynchronous call to writeFile.

One other approach we could have used if we wanted to hardcode the change to each file is to use the Step parallel feature. [Example 5-9](\l) performs a readFile on a couple of different files, passing in this.parallel() as the last parameter. This results in a parameter being passed to the next function for each readFile in the first function. The parallel function call also has to be used in the writeFile function in the second function, to ensure that each callback is processed in turn.

Example 5-9. Reading and writing to a group of files using Step’s group functionality

var fs = require('fs'),

Step = require('step'),

files;

try {

Step (

function readFiles() {

fs.readFile('./data/data1.txt', 'utf8',this.parallel());

fs.readFile('./data/data2.txt', 'utf8',this.parallel());

fs.readFile('./data/data3.txt', 'utf8',this.parallel());

},

function writeFiles(err, data1, data2, data3) {

if (err) throw err;

data1 = data1.replace(/somecompany\.com/g,'burningbird.net');

data2 = data2.replace(/somecompany\.com/g,'burningbird.net');

data3 = data3.replace(/somecompany\.com/g,'burningbird.net');

fs.writeFile('./data/data1.txt', data1, 'utf8', this.parallel());

fs.writeFile('./data/data2.txt', data2, 'utf8', this.parallel());

fs.writeFile('./data/data3.txt', data3, 'utf8', this.parallel());

}

);

} catch(err) {

console.log(err);

}

It works, but it’s clumsy. It would be better to reserve the use of the parallel functionality for a sequence of different asynchronous functions that can be implemented in parallel, and the data processed post-callback.

As for our earlier application, rather than trying to force Step into contortions to fit our use case, we can use another library that provides the additional flexibility we need: Async.

## Async

The Async module provides functionality for managing collections, such as its own variation of forEach, map, and filter. It also provides some utility functions, including ones for *memoization*. However, what we’re interested in here are its facilities for handling control flow.

Warning

There is both an Async and an Async.js module, so be careful not to confuse the two. The one covered in this section is Async, by Caolan McMahon. Its GitHub site is https://github.com/caolan/async.

Install Async using npm like so:

npm install async

As mentioned earlier, Async provides control flow capability for a variety of asynchronous patterns, including serial, parallel, and waterfall. Like Step, it gives us a tool to tame the wild nested callback pyramid, but its approach is quite different. For one, we don’t insert ourselves between each function and its callback. Instead, we incorporate the callback as part of the process.

As an example, we’ve already identified that the pattern of the earlier application matches with Async’s waterfall, so we’ll be using the async.waterfall method. In [Example 5-10](\l), I used async.waterfall to open and read a data file using fs.readFile, perform the synchronous string substitution, and then write the string back to the file using fs.writeFile. Pay particular attention to the callback function used with each step in the application.

Example 5-10. Using async.waterfall to read, modify, and write a file’s contents asynchronously

var fs = require('fs'),

async = require('async');

try {

async.waterfall([

function readData(callback) {

fs.readFile('./data/data1.txt', 'utf8', function(err, data){

callback(err,data);

});

},

function modify(text, callback) {

var adjdata=text.replace(/somecompany\.com/g,'burningbird.net');

callback(null, adjdata);

},

function writeData(text, callback) {

fs.writeFile('./data/data1.txt', text, function(err) {

callback(err,text);

});

}

], function (err, result) {

if (err) throw err;

console.log(result);

});

} catch(err) {

console.log(err);

}

The async.waterfall method takes two parameters: an array of tasks and an optional final callback function. Each asynchronous task function is an element of the async.waterfall method array, and each function requires a callback as the last of its parameters. It is this callback function that allows us to chain the asynchronous callback results without having to physically nest the functions. However, as you can see in the code, each function’s callback is handled as we would normally handle it if we were using nested callbacks—other than the fact that we don’t have to test the errors in each function. The callbacks look for an error object as first parameter. If we pass an error object in the callback function, the process is ended at this point, and the final callback routine is called. The final callback is when we can test for an error, and throw the error to the outer exception handling block (or otherwise handle).

The readData function wraps our fs.readFile call, which checks for an error, first. If an error is found, it throws the error, ending the process. If not, it issues a call to the callback as its last operation. This is the trigger to tell Async to invoke the next function, passing any relevant data. The next function isn’t asynchronous, so it does its processing, passing null as the error object, and the modified data. The last function, writeData, calls the asynchronous writeFile, using the passed-in data from the previous callback and then testing for an error in its own callback routine.

### Note

[Example 5-10](\l) uses named functions, while the Async documentation shows anonymous functions. However, named functions can simplify debugging and error handling. Both work equally well.

The processing is very similar to what we had in [Example 5-4](\l), but without the nesting (and having to test for an error in each function). It may seem more complicated than what we had in [Example 5-4](\l), and I wouldn’t necessarily recommend its use for such simple nesting, but look what it can do with a more complex nested callback. [Example 5-11](\l) duplicates the exact functionality from [Example 5-6](\l), but without the callback nesting and excessive indenting.

Example 5-11. Get objects from directory, test to look for files, read file test, modify, and write back out log results

var fs = require('fs'),

async = require('async'),

_dir = './data/';

var writeStream = fs.createWriteStream('./log.txt',

{'flags' : 'a',

'encoding' : 'utf8',

'mode' : 0666});

try {

async.waterfall([

function readDir(callback) {

fs.readdir(_dir, function(err, files) {

callback(err,files);

});

},

function loopFiles(files, callback) {

files.forEach(function (name) {

callback (null, name);

});

},

function checkFile(file, callback) {

fs.stat(_dir + file, function(err, stats) {

callback(err, stats, file);

});

},

function readData(stats, file, callback) {

if (stats.isFile())

fs.readFile(_dir + file, 'utf8', function(err, data){

callback(err,file,data);

});

},

function modify(file, text, callback) {

var adjdata=text.replace(/somecompany\.com/g,'burningbird.net');

callback(null, file, adjdata);

},

function writeData(file, text, callback) {

fs.writeFile(_dir + file, text, function(err) {

callback(err,file);

});

},

function logChange(file, callback) {

writeStream.write('changed ' + file + '\n', 'utf8', function(err) {

callback(err, file);

});

}

], function (err, result) {

if (err) throw err;

console.log('modified ' + result);

});

} catch(err) {

console.log(err);

}

Every last bit of functionality is present from [Example 5-6](\l). The fs.readdir method is used to get an array of directory objects. The Node forEach method (not the Async forEach) is used to access each specific object. The fs.stats method is used to get the stats for each object. stats is used to check for files, and when a file is found, it’s opened and its data accessed. The data is then modified, and passed on to be written back to the file via fs.writeFile. The operation is logged in the logfile and also echoed to the console.

Note that there is more data passed in some of the callbacks. Most of the functions need the filename as well as the text, so this is passed in the last several methods. Any amount of data can be passed in the methods, as long as the first parameter is the error object (or null, if no error object) and the last parameter in each function is the callback function.

We don’t have to check for an error in each asynchronous task function either, because Async tests the error object in each callback, and stops processing and calls the final callback function if an error is found. And we don’t have to worry about using special processing when handling an array of items, as we did when we used Step earlier in the chapter.

The other Async control flow methods, such as async.parallel and async.serial, perform in a like manner, with an array of tasks as the first method parameter, and a final optional callback as the second. How they process the asynchronous tasks differs, though, as you would expect.

### Note

We use the async.serial method with a Redis application in [Chapter 9](\l), in the section [Building a Game Leaderboard](\l).

The async.parallel method calls all of the asynchronous functions at once, and when they are each finished, calls the optional final callback. [Example 5-12](\l) uses async.parallel to read in the contents of three files in parallel. However, rather than an array of functions, this example uses an alternative approach that Async supports: passing in an object with each asynchronous task listed as a property of the object. The results are then printed out to the console when all three tasks have finished.

Example 5-12. Opening three files in parallel and reading in their contents

var fs = require('fs'),

async = require('async');

try {

async.parallel({

data1 : function (callback) {

fs.readFile('./data/data1.txt', 'utf8', function(err, data){

callback(err,data);

});

},

data2 : function (callback) {

fs.readFile('./data/data2.txt', 'utf8', function(err, data){

callback(err,data);

});

},

data3 : function readData3(callback) {

fs.readFile('./data/data3.txt', 'utf8', function(err, data){

callback(err,data);

});

},

}, function (err, result) {

if (err) throw err;

console.log(result);

});

} catch(err) {

console.log(err);

}

The results are returned as an array of objects, with each result tied to each of the properties. If the three data files in the example had the following content:

- data1.txt: apples
- data2.txt: oranges
- data3.txt: peaches

the result of running [Example 5-12](\l) is:

{ data1: 'apples\n', data2: 'oranges\n', data3: 'peaches\n' }

I’ll leave the testing of the other Async control flow methods as a reader exercise. Just remember that when you’re working with the Async control flow methods, all you need is to pass a callback to each asynchronous task and to call this callback when you’re finished, passing in an error object (or null) and whatever data you need.

# Node Style

A couple of times in the chapter I mentioned people recommending certain restraints, such as using named rather than anonymous functions in Node applications. Collectively, these restraints are known as *preferred Node style*, though there is no one style guide or definitive set of shared preferences. In fact, there are several different recommendations for proper Node style.

### Note

One helpful Node.js style guide is Felix’s Node.js Style Guide, at http://nodeguide.com/style.html.

Here are some of the recommendations, and my own take on each:

Use asynchronous functions over synchronous.

Yes, this is essential for Node applications.

Use a two-space indentation.

My take: Sorry, I’m used to three spaces, and I’ll continue to use three spaces. I think it’s more important to be consistent and *not* to use tabs; I’m not going to split hairs on the number of spaces.

Use semicolons/don’t use semicolons.

Amazing how contentious this one is. I use semicolons, but follow your own instincts.

Use single quotes.

I’m rather used to double quotes, but have managed to kick the habit (more or less). Regardless, it’s better to use double quotes than to escape a single quote in a string.

When defining several variables, use one var keyword/don’t use one var keyword.

Some of the applications in this book use the var keyword for each variable; some don’t. Again, old habits are hard to break, but I don’t think this is as much an issue as some people make it.

Constants should be uppercase.

I agree with this one.

Variables should be camel case.

I more or less agree with this, but not religiously.

Use the strict equality operator (===).

Sound advice, but I repeat, old habits are hard to break. I mean to use strict equality, but frequently use just the regular equality (==). Don’t be bad like me.

Name your closures.

My bad, again. This really is sound advice, and I’m trying to improve, but most of my code still uses anonymous functions.

Line length should be fewer than 80 characters.

Again, sound advice.

Curly braces begin on the same line as what necessitates them.

I do follow this religiously.

The most important rule to remember out of all of these is to use asynchronous functions whenever and wherever possible. After all, asynchronous functionality is the heart of Node.