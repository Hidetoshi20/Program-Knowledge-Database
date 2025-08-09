# Chapter 7

Chapter 7. The Express Framework

Framework software provides infrastructure support that allows us to create websites and applications more quickly. It provides a skeleton on which to build, handling many of the mundane and ubiquitous aspects of development so we can focus on creating the functionality unique to our application or site. It also provides cohesiveness to our code, which can make the code easier to manage and maintain.

The terms *frameworks* and *libraries* have been used interchangeably, because both provide reusable functionality that can be utilized by developers in a variety of applications. They both offer discrete capabilities as well, but they differ in that frameworks usually also provide an infrastructure that can impact the overall design of your application.

There are some very sound frameworks in Node.js, including Connect (covered in Chapter 6), though I see Connect more as middleware than a framework. Two Node frameworks that stand out—because of support, capability, and popularity—are Express and Geddy. If you ask people about the differences between the two, they’ll say Express is more Sinatra-like, while Geddy is more like Rails. What this means in non-Ruby terms is that Geddy is MVC (Model-View-Controller)–based, while Express is, well, more RESTful (more on what that means later in the chapter).

There’s also a new kid in town, Flatiron, which previously existed as independent components but is now pulled together into a comprehensive product. Another framework popular at the node-toolbox website is Ember.js, formerly known as SproutCore 2.0. This in addition to CoreJS, which is also MVC-based.

I debated how much to cover of each in this chapter, and knew I’d have a hard time covering one framework in a single chapter, much less several, so I decided to focus on Express. Though the other frameworks are excellent, I like the openness and extensibility of Express, and it is, currently, the most popular of the frameworks.

### Note

The Geddy.js site is at http://geddyjs.org/. Flatiron can be found at http://flatironjs.org/, the Ember.js Github page is at https://github.com/emberjs/ember.js, and the primary CoreJS site is at http://echo.nextapp.com/site/corejs. The Express GitHub page is at https://github.com/visionmedia/express. You can find the Express documentation at http://expressjs.com/.

# Express: Up and Running

We can easily install Express with npm:

npm install express

To get a feel for Express, the best first step is to use the command-line version of the tool to generate an application. Since you’re never sure what an application will do, you’ll want to run this application in a clean directory—not a directory where you have all sorts of valuable stuff.

I named my new application site, which is simple enough:

express site

The application generates several directories:

create : site

create : site/package.json

create : site/app.js

create : site/public

create : site/public/javascripts

create : site/public/images

create : site/routes

create : site/routes/index.js

create : site/public/stylesheets

create : site/public/stylesheets/style.css

create : site/views

create : site/views/layout.jade

create : site/views/index.jade

It also provides a helpful message to change to the site directory and run npm install:

npm install -d

Once the new application is installed, run the generated *app.js* file with node:

node app.js

It starts a server at port 3000. Accessing the application shows a web page with the words:

Express

Welcome to Express

You’ve created your first Express application. Now let’s see what we need to do to make it do something more interesting.

# The app.js File in More Detail

Example 7-1 shows the source code for the *app.js* file we just ran.

Example 7-1. Source code for the app.js file

/*

* Module dependencies.

*/

var express = require('express')

, routes = require('./routes')

, http = require('http');

var app = express();

app.configure(function(){

app.set('views', __dirname + '/views');

app.set('view engine', 'jade');

app.use(express.favicon());

app.use(express.logger('dev'));

app.use(express.static(__dirname + '/public'));

app.use(express.bodyParser());

app.use(express.methodOverride());

app.use(app.router);

});

app.configure('development', function(){

app.use(express.errorHandler());

});

app.get('/', routes.index);

http.createServer(app).listen(3000);

console.log("Express server listening on port 3000");

From the top, the application includes three modules: Express, Node’s HTTP, and a module just generated, routes. In the *routes* subdirectory, an *index.js* file has the following code:

/*

* GET home page.

*/

exports.index = function(req, res){

res.render('index', { title: 'Express' });

};

A little digging in the code shows us that the Express response object’s render method renders a given view with a set of options—in this case, a title of “Express.” I’ll cover this more later in this chapter, in the section Routing.

Now let’s return to *app.js*. After we’ve included all the necessary modules, we create an Express object instance, and then configure it with a set of options via the configure method. (For more information on configure, see the upcoming sidebar Setting the Application Mode.) An optional first parameter to configure is a string identifying whether the application is of a specific environment (such as development or production). When an environment is not provided, the application is run in every environment. A second call to configure in *app.js* is specific only for the development environment. You can call configure for every possible environment, if you wish. The one that matches the environment is the one that will be processed.

### Setting the Application Mode

In Express applications, we can define which middleware, settings, and options to apply for any given mode using the configure method. In the following example, the method applies the enclosed settings and options to all modes:

app.config(function() { ... }

while the next configure call ensures that the settings apply only in a development environment:

app.config('development', function() { ... }

This mode can be any that you designate, and is controlled by an environmental variable, NODE_ENV:

$ export NODE_ENV=production

or:

$ export NODE_ENV=ourproduction

You can use any term you want. By default, the environment is development.

To ensure that your application always runs in a specific mode, add a NODE_ENV export to the user profile file.

The second function to configure is an anonymous function enclosing several middleware references. Some of this is familiar (for instance, the use method) from our work with the Connect middleware in Chapter 6; this is not unexpected, since the same person, TJ Holowaychuk, is the primary author of both applications. What isn’t familiar are the two app.set method calls.

The app.set method is used to define various settings, such as the location for application views:

app.set('views', __dirname + '/views');

and the view engine (in this case, Jade):

app.set('view engine', 'jade');

What follows in *app.js* is a call to the Express encapsulated favicon, logger, and static file server middleware, which should need no further explanation:

app.use(express.favicon());

app.use(express.logger('dev'));

app.use(express.static(__dirname + '/public'));

We can also call the middleware as methods when we create the server:

var app = express.createServer(

express.logger(),

express.bodyParts()

);

It doesn’t matter which approach you use.

The next three middleware/framework components included in the generated application are:

app.use(express.bodyParser());

app.use(express.methodOverride());

app.use(app.router);

The bodyParser middleware, like the other middleware, comes directly from Connect. All Express does is re-export it.

I covered logger, favicon, and static in the previous chapter, but not bodyParse. This middleware parses the incoming request body, converting it into request object properties. The methodOverride option also comes to Express via Connect, and allows Express applications to emulate full REST capability via a hidden form field named _method.

### Note

Full REST (Representational State Transfer) support means support for HTTP PUT and DELETE, as well as GET and POST. We’ll discuss this more in the upcoming section Routing and HTTP Verbs.

The last configuration item is app.router. This optional middleware contains all the defined routes and performs the lookup for any given route. If omitted, the first call to app.get—app.post, etc.—mounts the routes instead.

Just as with Connect, the order of middleware is important. The favicon middleware is called before logger, because we don’t want *favicon.ico* accesses cluttering the log. The static middleware is included before bodyParser and methodOverride, because neither of these is useful with the static pages—form processing occurs dynamically in the Express application, not via a static page.

### Note

There’s more on Express/Connect in the section A Closer Look at the Express/Connect Partnership, later in the chapter.

The second call to configure, specific to development mode, adds support for the Express errorHandler. I’ll cover it and other error handling techniques next.

# Error Handling

Express provides its own error handling, as well as access to the Connect errorHandler.

The Connect errorHandler provides a way of handling exceptions. It’s a development tool that gives us a better idea of what’s happening when an exception occurs. You can include it like you’d include other middleware:

app.use(express.errorHandler());

You can direct exceptions to stderr using the dumpExceptions flag:

app.use(express.errorHandler({dumpExceptions : true }));

You can also generate HTML for an exception using the showStack flag:

app.use(express.errorHandler({showStack : true; dumpExceptions : true}));

To reiterate: this type of error handling is for development only—we definitely don’t want our users to see exceptions. We do, however, want to provide more effective handling for when pages aren’t found, or when a user tries to access a restricted subdirectory.

One approach we can use is to add a custom anonymous function as the last middleware in the middleware list. If none of the other middleware can process the request, it should fall gracefully to this last function:

app.configure(function(){

app.use(express.favicon());

app.use(express.logger('dev'));

app.use(express.static(__dirname + '/public'));

app.use(express.bodyParser());

app.use(express.methodOverride());

app.use(app.router);

app.use(function(req, res, next){

res.send('Sorry ' + req.url + ' does not exist');

});

});

In the next chapter, we’ll fine-tune the response by using a template to generate a nice 404 page.

We can use another form of error handling to capture thrown errors and process them accordingly. In the Express documentation, this type of error handler is named app.error, but it didn’t seem to exist at the time this book was written. However, the function signature does work—a function with four parameters: error, request, response, and next.

I added a second error handler middleware function and adjusted the 404 middleware function to throw an error rather than process the error directly:

app.configure(function(){

app.use(express.favicon());

app.use(express.logger('dev'));

app.use(express.static(__dirname + '/public'));

app.use(express.bodyParser());

app.use(express.methodOverride());

app.use(app.router);

**app.use(function(req, res, next){throw new Error(req.url + ' not found');});app.use(function(err, req, res, next) {console.log(err);res.send(err.message);});**
});

Now I can process the 404 error, as well as other errors, within the same function. And again, I can use templates to generate a more attractive page.

# A Closer Look at the Express/Connect Partnership

Throughout this chapter so far, we’ve seen the Express/Connect partnership in action. It’s through Connect that Express gets much of its basic functionality.

For instance, you can use Connect’s session support middleware—cookieParser, cookieSession, and session—to provide session support. You just have to remember to use the Express version of the middleware:

app.use(express.cookieParser('mumble'))

app.use(express.cookieSession({key : 'tracking'}))

You can also enable static caching with the staticCache middleware:

app.use(express.favicon());

app.use(express.logger('dev'));

app.use(express.staticCache());

app.use(express.static(__dirname + '/public'));

By default, the cache maintains a maximum of 128 objects, with a maximum of 256 KB each, for a total of about 32 MB. You can adjust these with the options maxObjects and maxLength:

app.use(express.staticCache({maxObjects: 100, maxLength: 512}));

Prettify a directory listing with directory:

app.use(express.favicon());

app.use(express.logger('dev'));

app.use(express.staticCache({maxObjects: 100, maxLength: 512}));

**app.use(express.directory(__dirname + '/public'));**
app.use(express.static(__dirname + '/public'));

If you’re using express.directory with routing, though, make sure that the directory middleware follows the app.router middleware, or it could conflict with the routing. A good rule of thumb: place express.directory after the other middleware, but before any error handling.

The express.directory options include whether to display hidden files (false by default), whether to display icons (false by default), and a filter.

### Note

You can also use third-party Connect middleware with Express. Use caution, though, when combining it with routing.

Now it’s time to return to the key component of Express: routing.

# Routing

The core of all the Node frameworks—in fact, many modern frameworks—is the concept of routing. I covered a standalone routing module in Chapter 6, and demonstrated how you can use it to extract a service request from a URL.

Express routing is managed using the HTTP verbs GET, PUT, DELETE, and POST. The methods are named accordingly, such as app.get for GET and app.post for POST. In the generated application, shown in Example 7-1, app.get is used to access the application root ('/'), and is passed a request listener—in this instance, the routes index function—to process the data request.

The routes.index function is simple:

exports.index = function(req, res){

res.render('index', { title: 'Express' });

};

It makes a call to the render method on the resource object. The render method takes the name of file that provides the template. Since the application has already identified the view engine:

app.set('view engine', 'jade');

it’s not necessary to provide an extension for the file. However, you could also use:

res.render('index.jade', { title: 'Express' });

You can find the template file in another generated directory named *views*. It has two files: *index.jade* and *layout.jade*. *index.jade* is the file the template file referenced in the render method, and has the following contents:

extends layout

block content

h1= title

p Welcome to #{title}

The content of the document is an H1 element with the title, and a paragraph element with a greeting to the title value. The *layout.jade* template provides the overall layout for the document, including a title and link in the head element, and the body contents in the body element:

!!!

html

head

title= title

link(rel='stylesheet', href='/stylesheets/style.css')

body

block content

The *index.jade* file is what provides the content for the body defined in *layout.jade*.

### Note

I cover the use of Jade templates and CSS with Express applications in Chapter 8.

To recap what’s happening in this application:

1. The main Express application uses app.get to associate a request listener function (routes.index) with an HTTP GET request.
2. The routes.index function calls res.render to render the response to the GET request.
3. The res.render function invokes the application object’s render function.
4. The application render function renders the specified view, with whatever options—in this case, the title.
5. The rendered content is then written to the response object and back to the user’s browser.

The last step in the process is when the generated content is written back to the response to the browser. Snooping around the source code shows us that the render method takes a third argument, a callback function that’s called with any error and the generated text.

Wanting to take a closer look at the generated content, I modified the route.index file to add in the function and intercept the generated text. I output the text to the console. Since I’m overriding the default functionality, I also sent the generated text back to the browser using res.write—just like we have with other applications in previous chapters—and then called res.end to signal the finish:

exports.index = function(req, res){

res.render('index', { title: 'Express' }, function(err, stuff) {

if (!err) {

console.log(stuff);

res.write(stuff);

res.end();

}

});

};

Just as we hoped, the application now writes the content to the console as well as the browser. This just demonstrates that, though we’re using an unfamiliar framework, it’s all based on Node and functionality we’ve used previously. Of course, since this is a framework, we know there has to be a better method than using res.write and res.end. There is, and it’s discussed in the next section, which looks a little more closely at routing paths.

## Routing Path

The route, or route path, given in Example 7-1 is just a simple / (forward slash) signifying the root address. Express compiles all routes to a regular expression object internally, so you can use strings with special characters, or just use regular expressions directly in the path strings.

To demonstrate, I created a bare-bones routing path application in Example 7-2 that listens for three different routes. If a request is made to the server for one of these routes, the parameters from the request are returned to the sender using the Express response object’s send method.

Example 7-2. Simple application to test different routing path patterns

var express = require('express')

, http = require('http');

var app = express();

app.configure(function(){

});

app.get(/^\/node?(?:\/(\d+)(?:\.\.(\d+))?)?/, function(req, res){

console.log(req.params);

res.send(req.params);

});

app.get('/content/*',function(req,res) {

res.send(req.params);

});

app.get("/products/:id/:operation?", function(req,res) {

console.log(req);

res.send(req.params.operation + ' ' + req.params.id);

});

http.createServer(app).listen(3000);

console.log("Express server listening on port 3000");

We’re not doing any routing to views or handling any static content, so we didn’t need to provide middleware in the app.configure method. However, we do need to call the app.configure method if we want to gracefully handle requests that don’t match any of the routes. The application is also using the default environment (development).

The first of the app.get method calls is using a regular expression for the path. This regular expression is adapted from one provided in the Express Guide, and listens for any request for a node. If the request also provides a unique identifier or range of identifiers, this is captured in the request object’s params array, which is sent back as a response. The following requests:

node

nodes

/node/566

/node/1..10

/node/50..100/something

return the following params array values:

[null, null]

[null, null]

["566", null]

["1", "10"]

["50", "100"]

The regular expression is looking for a single identifier or a range of identifiers, given as two values with a range indicator (..) between them. Anything after the identifier or range is ignored. If no identifier or range is provided, the parameters are null.

The code to process the request doesn’t use the underlying HTTP response object’s write and end methods to send the parameters back to the requester; instead, it uses the Express send method. The send method determines the proper headers for the response (given the data type of what’s being sent) and then sends the content using the underlying HTTP end method.

The next app.get is using a string to define the routing path pattern. In this case, we’re looking for any content item. This pattern will match anything that begins with */content/*. The following requests:

/content/156

/content/this_is_a_story

/content/apples/oranges

result in the following params values:

["156"]

["this_is_a_story"]

["apples/oranges"]

The asterisk (*) is liberal in what it accepts, and everything after *content/* is returned.

The last app.get method is looking for a product request. If a product identifier is given, it can be accessed directly via params.id. If an operation is given, it can be accessed directly via params.operation. Any combination of the two values is allowed, *except* not providing at least one identifier or one operation.

The following URLs:

/products/laptopJK3444445/edit

/products/fordfocus/add

/products/add

/products/tablet89/delete

/products/

result in the following returned values:

edit laptopJK3444445

add fordfocus

undefined add

delete tablet89

Cannot GET /products/

The application outputs the request object to the console. When running the application, I directed the output to an *output.txt* file so I could examine the request object more closely:

node app.js > output.txt

The request object is a socket, of course, and we’ll recognize much of the object from our previous work exploring the Node HTTP request object. What we’re mainly interested in is the route object added via Express. Following is the output for the route object for one of the requests:

route:

{ path: '/products/:id/:operation?',

method: 'get',

callbacks: [ [Function] ],

keys: [ [Object], [Object] ],

regexp: /^\/products\/(?:([^\/]+?))(?:\/([^\/]+?))?\/?$/i,

params: [ id: 'laptopJK3444445', operation: 'edit' ] },

Note the generated regular expression object, which converts my use of the optional indicator (:) in the path string into something meaningful for the underlying JavaScript engine (thankfully, too, since I’m lousy at regular expressions).

Now that we have a better idea of how the routing paths work, let’s look more closely at the use of the HTTP verbs.

### Note

Any request that doesn’t match one of the three given path patterns just generates a generic 404 response: Cannot GET /*whatever*.

## Routing and HTTP Verbs

In the previous examples, we used app.get to process incoming requests. This method is based on the HTTP GET method and is useful if we’re looking for data, but not if we want to process new incoming data or edit or delete existing data. We need to make use of the other HTTP verbs to create an application that maintains as well as retrieves data. In other words, we need to make our application *RESTful*.

### Note

As noted earlier, REST means Representational State Transfer. *RESTful* is a term used to describe any web application that applies HTTP and REST principles: directory-structured URLs, statelessness, data transferred in an Internet media type (such as JSON), and the use of HTTP methods (GET, POST, DELETE, and PUT).

Let’s say our application is managing that most infamous of products, the widget. To create a new widget, we’ll need to create a web page providing a form that gets the information about the new widget. We can generate this form with the application, and I’ll demonstrate this approach in Chapter 8, but for now we’ll use a static web page, shown in Example 7-3.

Example 7-3. Sample HTML form to post widget data to the Express application

<!doctype html>

<html lang="en">

<head>

<meta charset="utf-8" />

<title>Widgets</title>

</head>

<body>

<form method="POST" action="/widgets/add"

enctype="application/x-www-form-urlencoded">

<p>Widget name: <input type="text" name="widgetname" id="widgetname"

size="25" required/></p>

<p>Widget Price: <input type="text"

pattern="^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$"

name="widgetprice" id="widgetprice" size="25" required/></p>

<p>Widget Description: <br /><textarea name="widgetdesc" id="widgetdesc"

cols="20" rows="5">No Description</textarea>

<p>

<input type="submit" name="submit" id="submit" value="Submit"/>

<input type="reset" name="reset" id="reset" value="Reset"/>

</p>

</form>

</body>

The page takes advantage of the new HTML5 attributes required and pattern to provide validation of data. Of course, this works only with browsers that support HTML5, but for now, I’ll assume you’re using a modern HTML5-capable browser.

The widget form requires a widget name, price (with an associated regular expression to validate the data structure in the pattern attribute), and description. Browser-based validation should ensure we get the three values, and that the price is properly formatted as US currency.

In the Express application, we’re just going to persist new widgets in memory, as we want to focus purely on the Express technology at this time. As each new widget is posted to the application, it’s added to an array of widgets via the app.post method. Each widget can be accessed by its application-generated identifier via the app.get method. Example 7-4 shows the entire application.

Example 7-4. Express application to add and display widgets

var express = require('express')

, http = require('http')

, app = express();

app.configure(function(){

app.use(express.favicon());

app.use(express.logger('dev'));

app.use(express.static(__dirname + '/public'));

app.use(express.bodyParser());

app.use(app.router);

});

app.configure('development', function(){

app.use(express.errorHandler());

});

// in memory data store

var widgets = [

{ id : 1,

name : 'My Special Widget',

price : 100.00,

descr : 'A widget beyond price'

}

]

// add widget

app.post('/widgets/add', function(req, res) {

var indx = widgets.length + 1;

widgets[widgets.length] =

{ id : indx,

name : req.body.widgetname,

price : parseFloat(req.body.widgetprice),

descr : req.body.widgetdesc };

console.log('added ' + widgets[indx-1]);

res.send('Widget ' + req.body.widgetname + ' added with id ' + indx);

});

// show widget

app.get('/widgets/:id', function(req, res) {

var indx = parseInt(req.params.id) - 1;

if (!widgets[indx])

res.send('There is no widget with id of ' + req.params.id);

else

res.send(widgets[indx]);

});

http.createServer(app).listen(3000);

console.log("Express server listening on port 3000");

The first widget is seeded into the widget array, so we have existing data if we want to immediately query for a widget without adding one first. Note the conditional test in app.get to respond to a request for a nonexistent or removed widget.

Running the application (*example4.js* in the examples), and accessing the application using */* or */index.html* (or */example3.html*, in the examples) serves up the static HTML page with the form. Submitting the form generates a page displaying a message about the widget being added, as well as its identifier. We can then use the identifier to display the widget—in effect, a dump of the widget object instance:

http://

*whateverdomain*.com:3000/widgets/2

It works...but there’s a problem with this simple application.

First, it’s easy to make a typo in the widget fields. You can’t put in data formatted as anything other than currency in the price field, but you can put in the wrong price. You can also easily type in the wrong name or description. What we need is a way to update a widget, as well as a way to remove a widget we no longer need.

The application needs to incorporate support for two other RESTful verbs: PUT and DELETE. PUT is used to update the widget, while DELETE is used to remove it.

To update the widget, we’ll need a form that comes prepopulated with the widget data in order to edit it. To delete the widget, we’ll need a form that confirms whether we truly want to delete the widget. In an application, these are generated dynamically using a template, but for now, since we’re focusing on the HTTP verbs, I created static web pages that edit and then delete the already created widget, widget 1.

The form for updating widget 1 is shown in the following code. Other than being populated with the information for widget 1, there is just one other difference between this form and the form to add a new widget: the addition of a hidden field named _method, shown in bold text:

<form method="POST" action="/widgets/1/update"

enctype="application/x-www-form-urlencoded">

<p>Widget name: <input type="text" name="widgetname"

id="widgetname" size="25" value="My Special Widget" required/></p>

<p>Widget Price: <input type="text"

pattern="^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$"

name="widgetprice" id="widgetprice" size="25" value="100.00" required/></p>

<p>Widget Description: <br />

<textarea name="widgetdesc" id="widgetdesc" cols="20"

rows="5">A widget beyond price</textarea>

<p>

**<input type="hidden" value="put" name="_method" />**
<input type="submit" name="submit" id="submit" value="Submit"/>
<input type="reset" name="reset" id="reset" value="Reset"/>
</p>
</form>

Since PUT and DELETE are not supported in the form method attribute, we have to add them using a hidden field with a specific name, _method, and give them a value of either put, for PUT, or delete for DELETE.

The form to delete the widget is simple: it contains the hidden _method field, and a button to confirm the deletion of widget 1:

<p>Are you sure you want to delete Widget 1?</p>

<form method="POST" action="/widgets/1/delete"

enctype="application/x-www-form-urlencoded">

<input type="hidden" value="delete" name="_method" />

<p>

<input type="submit" name="submit" id="submit" value="Delete Widget 1"/>

</p>

</form>

To ensure that the HTTP verbs are handled properly, we need to add another middleware, express.methodOverride, following express.bodyParser in the app.configure method call. The express.methodOverride middleware alters the HTTP method to whatever is given as value in this hidden field:

app.configure(function(){

app.use(express.favicon());

app.use(express.logger('dev'));

app.use(express.static(__dirname + '/public'));

app.use(express.bodyParser());

**app.use(express.methodOverride());**
app.use(app.router);
});

Next, we’ll need to add functionality to process these two new verbs. The update request replaces the widget object’s contents with the new contents, while the delete request deletes the widget array entry *in place*, deliberately leaving a null value since we do not want to reorder the array because of the widget removal.

To complete our widget application, we’ll also add in an index page for accessing widgets without any identifier or operation. All the index page does is list all the widgets currently in the memory store.

Example 7-5 shows the complete widget application with all the new functionality shown in bold text.

Example 7-5. Widget application, modified to include the ability to edit and delete a widget and list all widgets

var express = require('express')

, http = require('http')

, app = express();

app.configure(function(){

app.use(express.favicon());

app.use(express.logger('dev'));

app.use(express.static(__dirname + '/public'));

app.use(express.bodyParser());

**app.use(express.methodOverride());**
app.use(app.router);
});
app.configure('development', function(){
app.use(express.errorHandler());
});
// in memory data store
var widgets = [
{ id : 1,
name : 'My Special Widget',
price : 100.00,
descr : 'A widget beyond price'
}
]**// index for /widgets/app.get('/widgets', function(req, res) {res.send(widgets);});**
// show a specific widget
app.get('/widgets/:id', function(req, res) {
var indx = parseInt(req.params.id) - 1;
if (!widgets[indx])
res.send('There is no widget with id of ' + req.params.id);
else
res.send(widgets[indx]);
});
// add a widget
app.post('/widgets/add', function(req, res) {
var indx = widgets.length + 1;
widgets[widgets.length] =
{ id : indx,
name : req.body.widgetname,
price : parseFloat(req.body.widgetprice),
descr : req.body.widgetdesc };
console.log(widgets[indx-1]);
res.send('Widget ' + req.body.widgetname + ' added with id ' + indx);
});**// delete a widgetapp.del('/widgets/:id/delete', function(req,res) {var indx = req.params.id - 1;delete widgets[indx];console.log('deleted ' + req.params.id);res.send('deleted ' + req.params.id);});// update/edit a widgetapp.put('/widgets/:id/update', function(req,res) {var indx = parseInt(req.params.id) - 1;widgets[indx] ={ id : indx,name : req.body.widgetname,price : parseFloat(req.body.widgetprice),descr : req.body.widgetdesc };console.log(widgets[indx]);res.send ('Updated ' + req.params.id);});**
http.createServer(app).listen(3000);
console.log("Express server listening on port 3000");

After running the application, I add a new widget, list the widgets out, update widget 1’s price, delete the widget, and then list the widgets out again. The console.log messages for this activity are:

Express server listening on port 3000

{ id: 2,

name: 'This is my Baby',

price: 4.55,

descr: 'baby widget' }

POST /widgets/add 200 4ms

GET /widgets 200 2ms

GET /edit.html 304 2ms

{ id: 0,

name: 'My Special Widget',

price: 200,

descr: 'A widget beyond price' }

**PUT /widgets/1/update 200 2ms**
GET /del.html 304 2ms
deleted 1**DELETE /widgets/1/delete 200 3ms**
GET /widgets 200 2ms

Notice the HTTP PUT and DELETE verbs in bold text in the output. When I list the widgets out the second time, the values returned are:

[

null,

{

"id": 2,

"name": "This is my Baby",

"price": 4.55,

"descr": "baby widget"

}

]

We now have a RESTful Express application. But we also have another problem.

If our application managed only one object, it might be OK to cram all the functionality into one file. Most applications, however, manage more than one object, and the functionality for all of those applications isn’t as simple as our little example. What we need is to convert this RESTful Express application into a RESTful MVC Express application.

# Cue the MVC

Handling all the functionality your application needs in one file would work for a very tiny application, but most applications need better organization. MVC is a popular software architecture, and we want to be able to incorporate the advantages of this architecture and still be able to use Express. This effort isn’t as intimidating as it seems, because we have existing functionality we can emulate: Ruby on Rails.

Ruby on Rails has inspired much of the fundamental nature of Node, providing an underlying design we can use to incorporate support for MVC into our Express application. Express has already incorporated the use of routes (fundamental to Rails), so we’re halfway there. Now we need to provide the second component—the separation of model, view, and controller. For the controller component, we’re going to need a set of defined actions for each object we maintain.

Rails supports several different actions that map a route (verb and path) to a data action. The mapping is based on another concept, CRUD (create, read, update, and delete—the four fundamental persistent storage functions). The Rails website provides a guide that supplies an excellent table showing the mapping we need to create in our application. I extrapolated from the Rails table to create Table 7-1, which shows the mapping for maintaining widgets.

Table 7-1. REST/route/CRUD mapping for maintaining widgets

| HTTP verb | Path | Action | Used for |
| --- | --- | --- | --- |
| GET | /widgets | index | Displaying widgets |
| GET | /widgets/new | new | Returning the HTML form for creating a new widget |
| POST | /widgets | create | Creating a new widget |
| GET | /widgets/:id | show | Displaying a specific widget |
| GET | /widgets/:id/edit | edit | Returning the HTML for editing a specific widget |
| PUT | /widgets/:id | update | Updating a specific widget |
| DELETE | /widgets/:id | destroy | Deleting a specific widget |

We’re already there for most of the functionality—we just need to clean it up a bit.

Warning

Just a reminder: you also might have issues with existing middleware when implementing the MVC change. For instance, the use of the directory middleware, which provides a pretty directory printout, conflicts with the create action, since they work on the same route. Solution? Place the express.directory middleware after the app.router in the configure method call.

First, we’re going to create a *controllers* subdirectory and create a new file in it named *widgets.js*. Then we’re going to copy all of our apt.get and apt.put method calls into this new file.

Next, we need to convert the method calls into the appropriate MVC format. This means converting the routing method call into a function for each, which is then exported. For instance, the function to create a new widget:

// add a widget

app.post('/widgets/add', function(req, res) {

var indx = widgets.length + 1;

widgets[widgets.length] =

{ id : indx,

name : req.body.widgetname,

price : parseFloat(req.body.widgetprice)};

console.log(widgets[indx-1]);

res.send('Widget ' + req.body.widgetname + ' added with id ' + indx);

});

is converted into widgets.create:

// add a widget

exports.create = function(req, res) {

var indx = widgets.length + 1;

widgets[widgets.length] =

{ id : indx,

name : req.body.widgetname,

price : parseFloat(req.body.widgetprice)},

console.log(widgets[indx-1]);

res.send('Widget ' + req.body.widgetname + ' added with id ' + indx);

};

Each function still receives the request and resource object. The only difference is that there isn’t a direct route-to-function mapping.

Example 7-6 shows the new *widgets.js* file in the *controllers* subdirectory. Two of the methods, new and edit, are placeholders for now, to be addressed in Chapter 8. We’re still using an in-memory data store, and I simplified the widget object, removing the description field to make the application easier for testing.

Example 7-6. The widgets controller

var widgets = [

{ id : 1,

name : "The Great Widget",

price : 1000.00

}

]

// index listing of widgets at /widgets/

exports.index = function(req, res) {

res.send(widgets);

};

// display new widget form

exports.new = function(req, res) {

res.send('displaying new widget form');

};

// add a widget

exports.create = function(req, res) {

var indx = widgets.length + 1;

widgets[widgets.length] =

{ id : indx,

name : req.body.widgetname,

price : parseFloat(req.body.widgetprice) };

console.log(widgets[indx-1]);

res.send('Widget ' + req.body.widgetname + ' added with id ' + indx);

};

// show a widget

exports.show = function(req, res) {

var indx = parseInt(req.params.id) - 1;

if (!widgets[indx])

res.send('There is no widget with id of ' + req.params.id);

else

res.send(widgets[indx]);

};

// delete a widget

exports.destroy = function(req, res) {

var indx = req.params.id - 1;

delete widgets[indx];

console.log('deleted ' + req.params.id);

res.send('deleted ' + req.params.id);

};

// display edit form

exports.edit = function(req, res) {

res.send('displaying edit form');

};

// update a widget

exports.update = function(req, res) {

var indx = parseInt(req.params.id) - 1;

widgets[indx] =

{ id : indx,

name : req.body.widgetname,

price : parseFloat(req.body.widgetprice)}

console.log(widgets[indx]);

res.send ('Updated ' + req.params.id);

};

Notice that edit and new are both GET methods, as their only purpose is to serve a form. It’s the associated create and update methods that actually change the data: the former is served as POST, the latter as PUT.

To map the routes to the new functions, I created a second module, maproutecontroller, with one exported function, mapRoute. It has two parameters—the Express app object and a prefix representing the mapped controller object (in this case, widgets). It uses the prefix to access the widgets controller object, and then maps the methods it knows are in this object (because the object is a controller and has a fixed set of required methods) to the appropriate route. Example 7-7 has the code for this new module.

Example 7-7. Function to map routes to controller object methods

exports.mapRoute = function(app, prefix) {

prefix = '/' + prefix;

var prefixObj = require('./controllers/' + prefix);

// index

app.get(prefix, prefixObj.index);

// add

app.get(prefix + '/new', prefixObj.new);

// show

app.get(prefix + '/:id', prefixObj.show);

// create

app.post(prefix + '/create', prefixObj.create);

// edit

app.get(prefix + '/:id/edit', prefixObj.edit);

// update

app.put(prefix + '/:id', prefixObj.update);

// destroy

app.del(prefix + '/:id', prefixObj.destroy);

};

The mapRoute method is a very simple function, and should be recognizable when you compare the routes given to those in Table 7-1.

Last, we finish the main application that pulls all these pieces together. Thankfully, it’s a lot cleaner now that we don’t have all the routing method calls. To handle a possibly growing number of objects, I use an array to contain the prefix name for each. If we add a new object, we add a new prefix to the array.

### Note

Express comes with an MVC application in the *examples* subdirectory. It uses a routine that accesses the *controllers* directory and infers the prefix names from the filenames it finds. With this approach, we don’t have to change the application file to add a new object.

Example 7-8 shows the finished application. I added back in the original routes.index view, except I changed the title value in the *routes/index.js* file from “Express” to “Widget Factory.”

Example 7-8. Application that makes use of the new MVC infrastructure to maintain widgets

var express = require('express')

, routes = require('./routes')

, map = require('./maproutecontroller')

, http = require('http')

, app = express();

app.configure(function(){

app.use(express.favicon());

app.use(express.logger('dev'));

app.use(express.staticCache({maxObjects: 100, maxLength: 512}));

app.use(express.static(__dirname + '/public'));

app.use(express.bodyParser());

app.use(express.methodOverride());

app.use(app.router);

app.use(express.directory(__dirname + '/public'));

**app.use(function(req, res, next){throw new Error(req.url + ' not found');});app.use(function(err, req, res, next) {console.log(err);res.send(err.message);});**
});
app.configure('development', function(){
app.use(express.errorHandler());
});
app.get('/', routes.index);
var prefixes = ['widgets'];
// map route to controller
prefixes.forEach(function(prefix) {
map.mapRoute(app, prefix);
});
http.createServer(app).listen(3000);
console.log("Express server listening on port 3000");

Cleaner, simpler, extensible. We still don’t have the *view* part of the MVC, but I’ll cover that in the next chapter.

# Testing the Express Application with cURL

Instead of testing with a browser, we’ll test the application with cURL. This Unix utility is extremely helpful when it comes to testing a RESTful application without having to create all the forms.

To test the widgets index, use the following cURL command (based on running the application from my examples site, and on port 3000—adjust the command accordingly for your setup):

curl --request GET http://examples.burningbird.net:3000/widgets

Following the request option, specify the method (in this case, GET), and then the request URL. You should get back a dump of all widgets currently in the data store.

To test creating a new widget, first issue a request for the new object:

curl --request GET http://examples.burningbird.net:3000/widgets/new

A message is returned about retrieving the new widget form. Next, test adding a new widget, passing the data for the widget in the cURL request, and changing the method to POST:

curl --request POST http://examples.burningbird.net:3000/widgets/create

--data 'widgetname=Smallwidget&widgetprice=10.00'

Run the index test again to make sure the new widget is displayed:

curl --request GET http://examples.burningbird.net:3000/widgets

The result should be:

[

{

"id": 1,

"name": "The Great Widget",

"price": 1000

},

{

"id": 2,

"name": "Smallwidget",

"price": 10

}

Next, update the new widget, setting its price to 75.00. The method is now PUT:

curl --request PUT http://examples.burningbird.net:3000/widgets/2

--data 'widgetname=Smallwidget&widgetprice=75.00'

Once you’ve verified the data was changed, go ahead and delete the new record, changing the HTTP method to DELETE:

curl --request DELETE http://examples.burningbird.net:3000/widgets/2

Now that we have the controller component of the MVC, we need to add the view components, which I cover in Chapter 8. Before moving on, though, read the sidebar Beyond Basic Express for some final tips.

### Beyond Basic Express

Express is a framework, but it’s a very basic framework. If you want to do something like creating a content management system, you’ll have quite a bit of work to do.

There are third-party applications that are built on Express and that provide both types of functionality. One, Calipso, is a full content management system (CMS) built on Express and using MongoDB for persistent storage.

Express-Resource is a lower-level framework that provides simplified MVC functionality to Express so you don’t have to create your own.

Tower.js is another web framework that provides a higher level of abstraction and is modeled after Ruby on Rails, with full MVC support. RailwayJS is also a MVC framework, built on Express and modeled after Ruby on Rails.

Another higher-level framework is Strata, which takes a different tack from Tower.js and RailwayJS. Rather than a Rails model, it follows the module established by WSGI (Python) and Rack (Ruby). It’s a lower-level abstraction, which can be simpler to work with if you’ve not programmed in Ruby and Rails.