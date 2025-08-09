# Servers, Streams, and Sockets

Much of the Node core API has to do with creating services that listen to specific types of communications. In the examples in Chapter 1, we used the HTTP module to create an HTTP web server. Other methods can create a TCP server, a TLS (Transport Layer Security) server, and a UDP (User Datagram Protocol)/datagram socket. I’ll cover TLS in Chapter 15, but in this section I want to introduce the TCP and UDP Node core functionality. First, though, I’ll offer a brief introduction to the terms used in this section.

A *socket* is an endpoint in a communication, and a *network socket* is an endpoint in a communication between applications running on two different computers on the network. The data flows between the sockets in what’s known as a *stream*. The data in the stream can be transmitted as binary data in a buffer, or in Unicode as a string. Both types of data are transmitted as *packets*: parts of the data split off into specifically sized pieces. There is a special kind of packet, a finish packet (FIN), that is sent by a socket to signal that the transmission is done. How the communication is managed, and how reliable the stream is, depends on the type of socket created.

## TCP Sockets and Servers

We can create a basic TCP server and client with the Node Net module. TCP forms the basis for most Internet applications, such as web service and email. It provides a way of reliably transmitting data between client and server sockets.

Creating the TCP server is a little different than creating the HTTP server in Example 1-1 in Chapter 1. We create the server, passing in a callback function. The TCP server differs from the HTTP server in that, rather than passing a requestListener, the TCP callback function’s sole argument is an instance of a socket listening for incoming connections.

Example 3-2 contains the code to create a TCP server. Once the server socket is created, it listens for two events: when data is received, and when the client closes the connection.

Example 3-2. A simple TCP server, with a socket listening for client communication on port 8124

```jsx
var net = require('net');

var server = net.createServer(function (conn) {
    console.log('connected');
    conn.on('data', function (data) {
        console.log(data + ' from ' + conn.remoteAddress + ' ' +
            conn.remotePort);
        conn.write('Repeating: ' + data);
    });
    conn.on('close', function () {
        console.log('client closed connection');
    });

}).listen(8124);

console.log('listening on port 8124');
```

There is an optional parameter for createServer: allowHalfOpen. Setting this parameter to true instructs the socket not to send a FIN when it receives a FIN packet from the client. Doing this keeps the socket open for writing (not reading). To close the socket, you’d then need to explicitly use the end method. By default, allowHalfOpen is false.

Notice how a callback function is attached to the two events via the on method. Many objects in Node that emit events provide a way to attach a function as an event listener by using the on method. This method takes the name of the event as first parameter, and the function listener as the second.

> Note
Node objects that inherit from a special object, the EventEmitter, expose the on method event handling, as discussed later in this chapter.
> 

The TCP client is just as simple to create as the server, as shown in Example 3-3. The call to the setEncoding method on the client changes the encoding for the received data. As discussed earlier in the section Buffer, data is transmitted as a buffer, but we can use setEncoding to read it as a `utf8` string. The socket’s write method is used to transmit the data. It also attaches listener functions to two events: data, for received data, and close, in case the server closes the connection.

Example 3-3. The client socket sending data to the TCP server

```jsx
var net = require('net');

var client = new net.Socket();

client.setEncoding('utf8');

// connect to server
client.connect('8124', 'localhost', function () {
    console.log('connected to server');
    client.write('Who needs a browser to communicate?');
});

// prepare for input from terminal
process.stdin.resume();

// when receive data, send to server
process.stdin.on('data', function (data) {
    client.write(data);
});

// when receive data back, print to console
client.on('data', function (data) {
    console.log(data);
});

// when server closed
client.on('close', function () {
    console.log('connection is closed');
});
```

The data being transmitted between the two sockets is typed in at the terminal, and transmitted when you press Enter. The client application first sends the string you just typed, which the TCP server writes out to the console. The server repeats the message back to the client, which in turn writes the message out to the console. The server also prints out the IP address and port for the client using the socket’s remoteAddress and remotePort properties. Following is the console output for the server after several strings were sent from the client (with the IP address edited out for security):

```
Hey, hey, hey, hey-now.

from #ipaddress 57251

Don't be mean, we don't have to be mean.

from #ipaddress 57251

Cuz remember, no matter where you go,

from #ipaddress 57251

there you are.

from #ipaddress 57251
```

The connection between the client and server is maintained until you kill one or the other using Ctrl-C. Whichever socket is still open receives a close event that’s printed out to the console. The server can also serve more than one connection from more than one client, since all the relevant functions are asynchronous.

As I mentioned earlier, TCP is the underlying transport mechanism for much of the functionality we use on the Internet today, including HTTP, which we’ll cover next.

## HTTP

You had a chance to work with the HTTP module in Chapter 1. We created servers using the createServer method, passing in the function that will act as the requestListener. Requests are processed as they come, asynchronously.

In a network, TCP is the transportation layer and HTTP is the application layer. If you scratch around in the modules included with Node, you’ll see that when you create an HTTP server, you’re inheriting functionality from the TCP-based net.Server.

For the HTTP server, the `requestListener` is a socket, while the `http.ServerRequest` object is a readable stream and the `http.ServerResponse` is a writable stream. HTTP adds another level of complexity because of the *chunked transfer encoding* it supports. The chunked transfer encoding allows transfer of data when the exact size of the response isn’t known until it’s fully processed. Instead, a zero-sized chunk is sent to indicate the end of a query. This type of encoding is useful when you’re processing a request such as a large database query output to an HTML table: writing the data can begin before the rest of the query data has been received.

> Note
More on streams in the upcoming section titled, appropriately enough, Streams, Pipes, and Readline.
> 

The TCP examples earlier in this chapter, and the HTTP examples in Chapter 1, were both coded to work with network sockets. However, all of the server/socket modules can also connect to a Unix socket, rather than a specific network port. Unlike a network socket, a Unix or IPC (interprocess communication) socket enables communication between processes within the same system.

To demonstrate Unix socket communication, I duplicated Example 1-3’s code, but instead of binding to a port, the new server binds to a Unix socket, as shown in Example 3-4. The application also makes use of readFileSync, the synchronous version of the function to open a file and read its contents.

Example 3-4. HTTP server bound to a Unix socket

```jsx
// create server
// and callback function

var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    var query = require('url').parse(req.url).query;
    console.log(query);
    file = require('querystring').parse(query).file;
    // content header
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    // increment global, write to client
    for (var i = 0; i < 100; i++) {
        res.write(i + '\n');
    }
    // open and read in file contents
    var data = fs.readFileSync(file, 'utf8');
    res.write(data);
    res.end();
}).listen('/tmp/node-server-sock');
```

The client is based on a code sample provided in the Node core documentation for the http.request object at the Node.js site. The http.request object, by default, makes use of http.globalAgent, which supports pooled sockets. The size of this pool is five sockets by default, but you can adjust it by changing the agent.maxSockets value.

The client accepts the chunked data returned from the server, printing out to the console. It also triggers a response on the server with a couple of minor writes, as shown in Example 3-5.

Example 3-5. Connecting to the Unix socket and printing out received data

```jsx
var http = require('http');

var options = {
    method: 'GET',
    socketPath: '/tmp/node-server-sock',
    path: "/?file=main.txt"
};

var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('chunk o\' data: ' + chunk);
    });
});

req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();
```

I didn’t use the asynchronous file read function with the http.request object because the connection is already closed when the asynchronous function is called and no file contents are returned.

Before leaving this section on the HTTP module, be aware that much of the behavior you’ve come to expect with Apache or other web servers isn’t built into a Node HTTP server. For instance, if you password-protect your website, Apache will pop up a window asking for your username and password; a Node HTTP server will not. If you want this functionality, you’re going to have to code for it.

> Note
Chapter 15 covers the SSL version of HTTP, *HTTPS*, along with Crypto and TLS/SSL.
> 

## UDP/Datagram Socket

TCP requires a dedicated connection between the two endpoints of the communication. UDP is a connectionless protocol, which means there’s no guarantee of a connection between the two endpoints. For this reason, UDP is less reliable and robust than TCP. On the other hand, UDP is generally faster than TCP, which makes it more popular for real-time uses, as well as technologies such as VoIP (Voice over Internet Protocol), where the TCP connection requirements could adversely impact the quality of the signal.

Node core supports both types of sockets. In the last couple of sections, I demonstrated the TCP functionality. Now, it’s UDP’s turn.

The UDP module identifier is dgram:

```jsx
require ('dgram');
```

To create a UDP socket, use the createSocket method, passing in the type of socket—either `udp4` or `udp6`. You can also pass in a callback function to listen for events. Unlike messages sent with TCP, messages sent using UDP must be sent as buffers, not strings.

Example 3-6 contains the code for a demonstration UDP client. In it, data is accessed via process.stdin, and then sent, as is, via the UDP socket. Note that we don’t have to set the encoding for the string, since the UDP socket accepts only a buffer, and the process.stdin data *is* a buffer. We do, however, have to convert the buffer to a string, using the buffer’s toString method, in order to get a meaningful string for the console.log method call that echoes the input.

Example 3-6. A datagram client that sends messages typed into the terminal

```jsx
var dgram = require('dgram');
var client = dgram.createSocket("udp4");

// prepare for input from terminal
process.stdin.resume();
process.stdin.on('data', function (data) {
    console.log(data.toString('utf8'));
    client.send(data, 0, data.length, 8124, "examples.burningbird.net",
        function (err, bytes) {
            if (err)
                console.log('error: ' + err);
            else
                console.log('successful');
        });
});
```

The UDP server, shown in Example 3-7, is even simpler than the client. All the server application does is create the socket, bind it to a specific port (8124), and listen for the message event. When a message arrives, the application prints it out using console.log, along with the IP address and port of the sender. Note especially that no encoding is necessary to print out the message—it’s automatically converted from a buffer to a string.

We didn’t have to bind the socket to a port. However, without the binding, the socket would attempt to listen in on every port.

Example 3-7. A UDP socket server, bound to port 8124, listening for messages

```jsx
var dgram = require('dgram');
var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
    console.log("Message: " + msg + " from " + rinfo.address + ":"
        + rinfo.port);
});

server.bind(8124);
```

I didn’t call the close method on either the client or the server after sending/receiving the message. However, no connection is being maintained between the client and server—just the sockets capable of sending a message and receiving communication.

## Streams, Pipes, and Readline

The communication stream between the sockets discussed in the previous sections is an implementation of the underlying abstract stream interface. Streams can be readable, writable, or both, and all streams are instances of EventEmitter, discussed in the upcoming section [Events and EventEmitter](events-and-eventemitter.md).

It’s important to take away from this section that all of these communication streams, including process.stdin and process.stdout, are implementations of the abstract stream interface. Because of this underlying interface, there is basic functionality available in all streams in Node:

- You can change the encoding for the stream data with setEncoding.
- You can check whether the stream is readable, writable, or both.
- You can capture stream events, such as data received or connection closed, and attach callback functions for each.
- You can pause and resume the stream.
- You can pipe data from a readable stream to a writable stream.

The last capability is one we haven’t covered yet. A simple way to demonstrate a *pipe* is to open a REPL session and type in the following:

```bash
> process.stdin.resume();

> process.stdin.pipe(process.stdout);
```

...and then enjoy the fact that everything you type from that point on is echoed back to you.

If you want to keep the output stream open for continued data, pass an option, { end: false }, to the output stream:

```jsx
process.stdin.pipe(process.stdout, { end : false });
```

There is one additional object that provides a specific functionality to readable streams: readline. You include the Readline module with code like the following:

```jsx
var readline = require('readline');
```

The Readline module allows line-by-line reading of a stream. Be aware, though, that once you include this module, the Node program doesn’t terminate until you close the interface and the stdin stream. The Node site documentation contains an example of how to begin and terminate a Readline interface, which I adapted in Example 3-8. The application asks a question as soon as you run it, and then outputs the answer. It also listens for any “command,” which is really any line that terminates with \n. If the command is .leave, it leaves the application; otherwise, it just repeats the command and prompts the user for more. A Ctrl-C or Ctrl-D key combination also causes the application to terminate.

Example 3-8. Using Readline to create a simple, command-driven user interface

```jsx
var readline = require('readline');

// create a new interface
var interface = readline.createInterface(process.stdin, process.stdout, null);
// ask question
interface.question(">>What is the meaning of life? ", function (answer) {
    console.log("About the meaning of life, you said " + answer);
    interface.setPrompt(">>");
    interface.prompt();
});

// function to close interface
function closeInterface() {
    console.log('Leaving interface...');
    process.exit();
}

// listen for .leave
interface.on('line', function (cmd) {
    if (cmd.trim() == '.leave') {
        closeInterface();
        return;
    } else {
        console.log("repeating command: " + cmd);
    }
    interface.setPrompt(">>");
    interface.prompt();
});

interface.on('close', function () {
    closeInterface();
});
```

Here’s an example session:

```bash
>>What is the meaning of life? ===

About the meaning of life, you said ===

>>This could be a command

repeating command: This could be a command

>>We could add eval in here and actually run this thing

repeating command: We could add eval in here and actually run this thing

>>And now you know where REPL comes from

repeating command: And now you know where REPL comes from

>>And that using rlwrap replaces this Readline functionality

repeating command: And that using rlwrap replaces this Readline functionality

>>Time to go

repeating command: Time to go

>>.leave

Leaving interface...
```

This should look familiar. Remember from Chapter 2 that we can use rlwrap to override the command-line functionality for REPL. We use the following to trigger its use:

```bash
env NODE_NO_READLINE=1 rlwrap node
```

And now we know what the flag is triggering—it’s instructing REPL not to use Node’s Readline module for command-line processing, but to use rlwrap instead.

This is a quick introduction to the Node stream modules. Now it’s time to change course, and check out Node’s child processes.

# Child Processes

Operating systems provide access to a great deal of functionality, but much of it is only accessible via the command line. It would be nice to be able to access this functionality from a Node application. That’s where *child processes* come in.

Node enables us to run a system command within a new child process, and listen in on its input/output. This includes being able to pass arguments to the command, and even pipe the results of one command to another. The next several sections explore this functionality in more detail.

> Warning
All but the last example demonstrated in this section use Unix commands. They work on a Linux system, and should work in a Mac. They won’t, however, work in a Windows Command window.
> 

## child_process.spawn

There are four different techniques you can use to create a child process. The most common one is using the spawn method. This launches a command in a new process, passing in any arguments. In the following, we create a child process to call the Unix pwd command to print the current directory. The command takes no arguments:

```jsx
var spawn = require('child_process').spawn,
    pwd = spawn('pwd');
pwd.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});

pwd.stderr.on('data', function (data) {
    console.log('stderr: ' + data);

});

pwd.on('exit', function (code) {
    console.log('child process exited with code ' + code);
});
```

Notice the events that are captured on the child process’s stdout and stderr. If no error occurs, any output from the command is transmitted to the child process’s stdout, triggering a data event on the process. If an error occurs, such as in the following where we’re passing an invalid option to the command:

```jsx
var spawn = require('child_process').spawn,

pwd = spawn('pwd', ['-g']);
```

Then the error gets sent to stderr, which prints out the error to the console:

```bash
stderr: pwd: invalid option -- 'g'

Try `pwd --help' for more information.

child process exited with code 1
```

The process exited with a code of 1, which signifies that an error occurred. The exit code varies depending on the operating system and error. When no error occurs, the child process exits with a code of 0.

The earlier code demonstrated sending output to the child process’s stdout and stderr, but what about stdin? The Node documentation for child processes includes an example of directing data to stdin. It’s used to emulate a Unix pipe (|) whereby the result of one command is immediately directed as input to another command. I adapted the example in order to demonstrate one of my favorite uses of the Unix pipe—being able to look through all subdirectories, starting in the local directory, for a file with a specific word (in this case, *test*) in its name:

```bash
find . -ls | grep test
```

Example 3-9 implements this functionality as child processes. Note that the first command, which performs the find, takes two arguments, while the second one takes just one: a term passed in via user input from stdin. Also note that, unlike the example in the Node documentation, the grep child process’s stdout encoding is changed via setEncoding. Otherwise, when the data is printed out, it would be printed out as a buffer.

Example 3-9. Using child processes to find files in subdirectories with a given search term, “test”

```jsx
var spawn = require('child_process').spawn,
    find = spawn('find', ['.', '-ls']),
    grep = spawn('grep', ['test']);
grep.stdout.setEncoding('utf8');
// direct results of find to grep
find.stdout.on('data', function (data) {
    grep.stdin.write(data);
});

// now run grep and output results

grep.stdout.on('data', function (data) {
    console.log(data);
});

// error handling for both
find.stderr.on('data', function (data) {
    console.log('grep stderr: ' + data);
});

grep.stderr.on('data', function (data) {

    console.log('grep stderr: ' + data);

});

// and exit handling for both

find.on('exit', function (code) {
    if (code !== 0) {
        console.log('find process exited with code ' + code);
    }
    // go ahead and end grep process
    grep.stdin.end();
});

grep.on('exit', function (code) {
    if (code !== 0) {
        console.log('grep process exited with code ' + code);
    }
});
```

When you run the application, you’ll get a listing of all files in the current directory and any subdirectories that contain *test* in their filename.

All of the example applications up to this point work the same in Node 0.8 as in Node 0.6. Example 3-9 is an exception because of a change in the underlying API.

In Node 0.6, the exit event would not be emitted until the child process exits and all STDIO pipes are closed. In Node 0.8, the event is emitted as soon as the child process finishes. This causes the application to crash, because the grep child process’s STDIO pipe is closed when it tries to process its data. For the application to work in Node 0.8, the application needs to listen for the close event on the find child process, rather than the exit event:

```jsx
// and exit handling for both

find.on('close', function (code) {
    if (code !== 0) {
        console.log('find process exited with code ' + code);
    }
    // go ahead and end grep process
    grep.stdin.end();
});
```

In Node 0.8, the close event is emitted when the child process exits and all STDIO pipes are closed.

## `child_process.exec` and `child_process.execFile`

In addition to spawning a child process, you can also use `child_process.exec` and `child_process.execFile` to run a command in a shell and buffer the results. The only difference between `child_process.exec` and `child_process.execFile` is that execFile runs an application in a file, rather than running a command.

The first parameter in the two methods is either the command or the file and its location; the second parameter is options for the command; and the third is a callback function. The callback function takes three arguments: error, stdout, and stderr. The data is buffered to stdout if no error occurs.

If the executable file contains:

```jsx
#!/usr/local/bin/node

console.log(global);
```

the following application prints out the buffered results:

```jsx
var execfile = require('child_process').execFile,
    child;
    
child = execfile('./app.js', function (error, stdout, stderr) {
    if (error == null) {
        console.log('stdout: ' + stdout);
    }
});
```

## `child_process.fork`

The last child process method is `child_process.fork`. This variation of spawn is for spawning Node processes.

What sets the `child_process.fork` process apart from the others is that there’s an actual communication channel established to the child process. Note, though, that each process requires a whole new instance of V8, which takes both time and memory.

> Note
The Node documentation for fork provides several good examples of its use.
> 

## Running a Child Process Application in Windows

Earlier I warned you that child processes that invoke Unix system commands won’t work with Windows, and vice versa. I know this sounds obvious, but not everyone knows that, unlike with JavaScript in browsers, Node applications can behave differently in different environments.

It wasn’t until recently that the Windows binary installation of Node even provided access to child processes. You also need to invoke whatever command you want to run via the Windows command interpreter, cmd.exe.

Example 3-10 demonstrates running a Windows command. In the application, Windows cmd.exe is used to create a directory listing, which is then printed out to the console via the data event handler.

Example 3-10. Running a child process application in Windows

```jsx
var cmd = require('child_process').spawn('cmd', ['/c', 'dir\n']);

cmd.stdout.on('data', function (data) {

    console.log('stdout: ' + data);

});

cmd.stderr.on('data', function (data) {

    console.log('stderr: ' + data);

});

cmd.on('exit', function (code) {

    console.log('child process exited with code ' + code);

});
```

The /c flag passed as the first argument to cmd.exe instructs it to carry out the command and then terminate. The application doesn’t work without this flag. You especially don’t want to pass in the /K flag, which tells cmd.exe to execute the application and then remain because your application won’t terminate.

> Note
> 
> 
> I provide more demonstrations of child processes in Chapter 9 and Chapter 12.
>