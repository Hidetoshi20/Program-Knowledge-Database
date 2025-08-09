# Table of Contents

# Table of Contents

Learning Node

A Note Regarding Supplemental Files

preface

> Not Your Ordinary JavaScript
> 
> 
> Why Node?
> 
> This Book’s Intended Audience
> 
> How to Best Use This Book
> 
> The Technology
> 
> The Examples
> 
> Conventions Used in This Book
> 
> Using Code Examples
> 
> Safari® Books Online
> 
> How to Contact Us
> 
> Acknowledgments
> 

1. Node.js: Up and Running

> Setting Up a Node Development Environment
> 
> 
> Installing Node on Linux (Ubuntu)
> 
> Partnering Node with WebMatrix on Windows 7
> 
> Updating Node
> 
> Node: Jumping In
> 
> Hello, World in Node
> 
> Hello, World from the Top
> 
> Asynchronous Functions and the Node Event Loop
> 
> Reading a File Asynchronously
> 
> Taking a Closer Look at Asynchronous Program Flow
> 
> Benefits of Node
> 

2. Interactive Node with REPL

> REPL: First Looks and Undefined Expressions
> 
> 
> Benefits of REPL: Getting a Closer Understanding of JavaScript Under the Hood
> 
> Multiline and More Complex JavaScript
> 
> REPL Commands
> 
> REPL and rlwrap
> 
> Custom REPL
> 
> Stuff Happens—Save Often
> 

3. The Node Core

> Globals: global, process, and Buffer
> 
> 
> global
> 
> process
> 
> Buffer
> 
> The Timers: setTimeout, clearTimeout, setInterval, and clearInterval
> 
> Servers, Streams, and Sockets
> 
> TCP Sockets and Servers
> 
> HTTP
> 
> UDP/Datagram Socket
> 
> Streams, Pipes, and Readline
> 
> Child Processes
> 
> child_process.spawn
> 
> child_process.exec and child_process.execFile
> 
> child_process.fork
> 
> Running a Child Process Application in Windows
> 
> Domain Resolution and URL Processing
> 
> The Utilities Module and Object Inheritance
> 
> Events and EventEmitter
> 

4. The Node Module System

> Loading a Module with require and Default Paths
> 
> 
> External Modules and the Node Package Manager
> 
> Finding Modules
> 
> Colors: Simple Is Best
> 
> Optimist: Another Short and Simple Module
> 
> Underscore
> 
> Creating Your Own Custom Module
> 
> Packaging an Entire Directory
> 
> Preparing Your Module for Publication
> 
> Publishing the Module
> 

5. Control Flow, Asynchronous Patterns, and Exception Handling

> Promises, No Promises, Callback Instead
> 
> 
> Sequential Functionality, Nested Callbacks, and Exception Handling
> 
> Asynchronous Patterns and Control Flow Modules
> 
> Step
> 
> Async
> 
> Node Style
> 

6. Routing Traffic, Serving Files, and Middleware

> Building a Simple Static File Server from Scratch
> 
> 
> Middleware
> 
> Connect Basics
> 
> Connect Middleware
> 
> connect.static
> 
> connect.logger
> 
> connect.parseCookie and connect.cookieSession
> 
> Custom Connect Middleware
> 
> Routers
> 
> Proxies
> 

7. The Express Framework

> Express: Up and Running
> 
> 
> The app.js File in More Detail
> 
> Error Handling
> 
> A Closer Look at the Express/Connect Partnership
> 
> Routing
> 
> Routing Path
> 
> Routing and HTTP Verbs
> 
> Cue the MVC
> 
> Testing the Express Application with cURL
> 

8. Express, Template Systems, and CSS

> The Embedded JavaScript (EJS) Template System
> 
> 
> Learning the Basic Syntax
> 
> Using EJS with Node
> 
> Using the EJS for Node Filters
> 
> Using a Template System (EJS) with Express
> 
> Restructuring for a Multiple Object Environment
> 
> Routing to Static Files
> 
> Processing a New Object Post
> 
> Working with the Widgets Index and Generating a Picklist
> 
> Showing an Individual Object and Confirming an Object Deletion
> 
> Providing an Update Form and Processing a PUT Request
> 
> The Jade Template System
> 
> Taking the Nickel Tour of the Jade Syntax
> 
> Using block and extends to Modularize the View Templates
> 
> Converting the Widget Views into Jade Templates
> 
> Converting the main widgets display view
> 
> Converting the edit and deletion forms
> 
> Incorporating Stylus for Simplified CSS
> 

9. Structured Data with Node and Redis

> Getting Started with Node and Redis
> 
> 
> Building a Game Leaderboard
> 
> Creating a Message Queue
> 
> Adding a Stats Middleware to an Express Application
> 

10. Node and MongoDB: Document-Centric Data

> The MongoDB Native Node.js Driver
> 
> 
> Getting Started with MongoDB
> 
> Defining, Creating, and Dropping a MongoDB Collection
> 
> Adding Data to a Collection
> 
> Querying the Data
> 
> Using Updates, Upserts, and Find and Remove
> 
> Implementing a Widget Model with Mongoose
> 
> Refactoring the Widget Factory
> 
> Adding the MongoDB Backend
> 

11. The Node Relational Database Bindings

> Getting Started with db-mysql
> 
> 
> Using Query String or Chained Methods
> 
> Updating the Database with Direct Queries
> 
> Updating the Database with Chained Methods
> 
> Native JavaScript MySQL Access with node-mysql
> 
> Basic CRUD with node-mysql
> 
> MySQL Transactions with mysql-queues
> 
> ORM Support with Sequelize
> 
> Defining a Model
> 
> Using CRUD, ORM Style
> 
> Adding Several Objects Easily
> 
> Overcoming Issues Related to Going from Relational to ORM
> 

12. Graphics and HTML5 Video

> Creating and Working with PDFs
> 
> 
> Accessing PDF Tools with Child Processes
> 
> Taking page snapshots with wkhtmltopdf
> 
> Accessing data about a PDF file with PDF Toolkit
> 
> Creating a PDF uploader and dealing with graphics lag time
> 
> Creating PDFs with PDFKit
> 
> Accessing ImageMagick from a Child Process
> 
> Properly Serving HTML5 Video with HTTP
> 
> Creating and Streaming Canvas Content
> 

13. WebSockets and Socket.IO

> WebSockets
> 
> 
> An Introduction to Socket.IO
> 
> A Simple Communication Example
> 
> WebSockets in an Asynchronous World
> 
> About That Client Code
> 
> Configuring Socket.IO
> 
> Chat: The WebSockets “Hello, World”
> 
> Using Socket.IO with Express
> 

14. Testing and Debugging Node Applications

> Debugging
> 
> 
> The Node.js Debugger
> 
> Client-Side Debugging with Node Inspector
> 
> Unit Testing
> 
> Unit Testing with Assert
> 
> Unit Testing with Nodeunit
> 
> Other Testing Frameworks
> 
> Mocha
> 
> Jasmine
> 
> Vows
> 
> Acceptance Testing
> 
> Selenium Testing with Soda
> 
> Emulating a Browser with Tobi and Zombie
> 
> Performance Testing: Benchmarks and Load Tests
> 
> Benchmark Testing with ApacheBench
> 
> Load Testing with Nodeload
> 
> Refreshing Code with Nodemon
> 

15. Guards at the Gate

> Encrypting Data
> 
> 
> Setting Up TSL/SSL
> 
> Working with HTTPS
> 
> Safely Storing Passwords
> 
> Authentication/Authorization with Passport
> 
> Authorization/Authentication Strategies: OAuth, OpenID, Username/Password Verification
> 
> The Local Passport Strategy
> 
> The Twitter Passport Strategy (OAuth)
> 
> Protecting Applications and Preventing Attacks
> 
> Don’t Use eval
> 
> Do Use Checkboxes, Radio Buttons, and Drop-Down Selections
> 
> Scrub Your Data and Sanitize It with node-validator
> 
> Sandboxed Code
> 

16. Scaling and Deploying Node Applications

> Deploying Your Node Application to Your Server
> 
> 
> Writing That package.json File
> 
> Keeping Your Application Alive with Forever
> 
> Using Node and Apache Together
> 
> Improving Performance
> 
> Deployment to a Cloud Service
> 
> Deploying to Windows Azure via Cloud9 IDE
> 
> Joyent Development SmartMachines
> 
> Heroku
> 
> Amazon EC2
> 
> Nodejitsu
> 

A. Node, Git, and GitHub

Index

About the Author

Colophon

Copyright

Learning Node

Shelley Powers

Published by O’Reilly Media

![](table-of-contents/image1.jpeg)

Beijing ⋅ Cambridge ⋅ Farnham ⋅ Köln ⋅ Sebastopol ⋅ Tokyo

A Note Regarding Supplemental Files

Supplemental files and examples for this book can be found at http://examples.oreilly.com/0636920024606/. Please use a standard desktop web browser to access these files, as they may not be accessible from all ereader devices.

All code files or examples referenced in the book will be available online. For physical books that ship with an accompanying disc, whenever possible, we’ve posted all CD/DVD content. Note that while we provide as much of the media content as we are able via free download, we are sometimes limited by licensing restrictions. Please direct any questions or concerns to booktech@oreilly.com.