# The Timers: setTimeout, clearTimeout, setInterval, and clearInterval

The timer functions in client-side JavaScript are part of the global windows object. They’re not part of JavaScript, but have become such a ubiquitous part of JavaScript development that the Node developers incorporated them into the Node core API.

The timer functions operate in Node just like they operate in the browser. In fact, they operate in Node exactly the same as they would in Chrome, since Node is based on Chrome’s V8 JavaScript engine.

The Node setTimeout function takes a callback function as first parameter, the delay time (in milliseconds) as second parameter, and an optional list of arguments:

```jsx
// timer to open file and read contents to HTTP response object

function on_OpenAndReadFile(filename, res) {
    console.log('opening ' + filename);
    // open and read in file contents
    fs.readFile(filename, 'utf8', function (err, data) {
        if (err)
            res.write('Could not find or open file for reading\n');
        else {
            res.write(data);
        }
        // reponse is done
        res.end();
    }
    
    setTimeout(openAndReadFile, 2000, filename, res);
}
```

In the code, the callback function on_OpenAndReadFile opens and reads a file to the HTTP response when the function is called after approximately 2,000 milliseconds have passed.

Warning

As the Node documentation carefully notes, there’s no guarantee that the callback function will be invoked in exactly *n* milliseconds (whatever *n* is). This is no different than the use of setTimeout in a browser—we don’t have absolute control over the environment, and factors could slightly delay the timer.

The function clearTimeout clears a preset setTimeout. If you need to have a repeating timer, you can use setInterval to call a function every *n* milliseconds—*n* being the second parameter passed to the function. Clear the interval with clearInterval.