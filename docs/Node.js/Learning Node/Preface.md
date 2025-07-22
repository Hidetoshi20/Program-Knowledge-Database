# Preface

Preface

# Not Your Ordinary JavaScript

You picked the perfect time to learn Node.

The technology evolving around Node is still young and vibrant, with interesting new variations and twists popping up on a regular basis. At the same time, the technology has reached a level of maturity that assures you your time learning Node will be well spent: installation has never been easier, even on Windows; the “best of breed” modules are beginning to surface from the seeming hundreds available for use; the infrastructure is becoming robust enough for production use.

There are two important things to keep in mind when you work with Node. The first is that it is based in JavaScript, more or less the same JavaScript you’re used to working with in client-side development. True, you can use another language variation, such as CoffeeScript, but JavaScript is the *lingua franca* of the technology.

The second important thing to remember is that Node isn’t your ordinary JavaScript. This is server-side technology, which means some of the functionality—and safeguards—you’ve come to expect in your browser environment just won’t be there, and all sorts of new and potentially very unfamiliar capabilities will.

Of course, if Node were like JavaScript in the browser, what fun would that be?

# Why Node?

If you explore the source code for Node, you’ll find the source code for Google’s V8, the JavaScript (technically, ECMAScript) engine that’s also at the core of Google’s Chrome browser. One advantage to Node.js, then, is that you can develop Node applications for just one implementation of JavaScript—not half a dozen different browsers and browser versions.

Node is designed to be used for applications that are heavy on input/output (I/O), but light on computation. More importantly, it provides this functionality directly out of the box. You don’t have to worry about the application blocking any further processing while waiting for a file to finish loading or a database to finish updating, because most of the functionality is *asynchronous I/O* by default. And you don’t have to worry about working with threads, because Node is implemented on a single thread.

### Note

Asynchronous I/O means that applications don’t wait for an input/output process to finish before going on to the next step in the application code. Chapter 1 goes into more detail on the asynchronous nature of Node.

Most importantly, Node is written in a language that many traditional web developers are familiar with: JavaScript. You may be learning how to use new technologies, such as working with WebSockets or developing to a framework like Express, but at least you won’t have to learn a new language along with the concepts. This language familiarity makes it a lot easier to just focus on the new material.

# This Book’s Intended Audience

One of the challenges associated with working with Node is that there is an assumption that most people coming into Node development have come from a Ruby or Python environment, or have worked with Rails. I don’t have this assumption, so I won’t explain a Node component by saying it’s “just like Sinatra.”

This book’s only assumption is that you, the reader, have worked with JavaScript and are comfortable with it. You don’t have to be an expert, but you should know what I’m talking about when I mention *closures*, and have worked with Ajax and are familiar with event handling in the client environment. In addition, you’ll get more from this book if you have done some traditional web development and are familiar with concepts such as HTTP methods (GET and POST), web sessions, cookies, and so on. You’ll also need to be familiar with working either with the Console in Windows, or the Unix command line in Mac OS X or Linux.

You’ll also enjoy the book more if you’re interested in some of the new technologies such as WebSockets, or working with frameworks to create applications. I cover these as a way of introducing you to how Node can be used in real-world applications.

Most importantly, as you progress through the book, keep an open mind. Be prepared to hit an occasional alpha/beta wall and run into the gotchas that plague a dynamic technology. Above all, meet the prospect of learning Node with anticipation, because it really can be a lot of fun.

### Note

If you’re not sure you’re familiar enough with JavaScript, you might want to check out my introductory text on JavaScript, *Learning JavaScript*, Second Edition (O’Reilly).

# How to Best Use This Book

You don’t have to read this book’s chapters in order, but there are paths through the book that are dependent on what you’re after and how much experience you have with Node.

If you’ve never worked with Node, then you’re going to want to start with Chapter 1 and read through at least Chapter 5. These chapters cover getting both Node and the package manager (npm) installed, how to use them, creating your first applications, and utilizing modules. Chapter 5 also covers some of the style issues associated with Node, including how to deal with Node’s unique approach to asynchronous development.

If you have had some exposure to Node, have worked with both the built-in Node modules and a few external ones, and have also used REPL (read-eval-print loop—the interactive console), you could comfortably skip Chapter 1–Chapter 4, but I still recommend starting no later than Chapter 5.

I incorporate the use of the Express framework, which also utilizes the Connect middleware, throughout the book. If you’ve not worked with Express, you’re going to want to go through Chapter 6–Chapter 8, which cover the concepts of routing, proxies, web servers, and middleware, and introduce Express. In particular, if you’re curious about using Express in a Model-View-Controller (MVC) framework, definitely read Chapter 7 and Chapter 8.

After these foundation chapters, you can skip around a bit. For instance, if you’re primarily working with key/value pairs, you’ll want to read the Redis discussion in Chapter 9; if you’re interested in document-centric data, check out Chapter 10, which introduces how to use MongoDB with Node. Of course, if you’re going to work only with a relational database, you can go directly to Chapter 11 and skip the Redis and MongoDB chapters, though do check them out sometime—they might provide a new viewpoint to working with data.

After those three data chapters, we get into specialized application use. Chapter 12 focuses purely on graphics and media access, including how to provide media for the new HTML5 video element, as well as working with PDF documents and Canvas. Chapter 13 covers the very popular Sockets.io module, especially for working with the new web socket functionality.

After the split into two different specialized uses of Node in Chapter 12 and Chapter 13, we come back together again at the end of the book. After you’ve had some time to work with the examples in the other chapters, you’re going to want to spend some in Chapter 14, learning in-depth practices for Node debugging and testing.

Chapter 15 is probably one of the tougher chapters, and also one of the more important. It covers issues of security and authority. I don’t recommend that it be one of the first chapters you read, but it is essential that you spend time in this chapter before you roll a Node application out for general use.

Chapter 16 is the final chapter, and you can safely leave it for last, regardless of your interest and experience. It focuses on how to prepare your application for production use, including how to deploy your Node application not only on your own system, but also in one of the cloud servers that are popping up to host Node applications. I’ll also cover how to deploy a Node application to your server, including how to ensure it plays well with another web server such as Apache, and how to ensure your application survives a crash and restarts when the system is rebooted.

Node is heavily connected with the Git source control technique, and most (if not all) Node modules are hosted on GitHub. The Appendix A provides a Git/GitHub survival guide for those who haven’t worked with either.

I mentioned earlier that you don’t *have to* follow the chapters in order, but I recommend that you do. Many of the chapters work off effort in previous chapters, and you may miss out on important points if you skip around. In addition, though there are numerous standalone examples all throughout the book, I do use one relatively simple Express application called Widget Factory that begins life in Chapter 7 and is touched on, here and there, in most of the rest of the chapters. I believe you’ll have a better time with the book if you start at the beginning and then lightly skim the sections that you know, rather than skip a chapter altogether.

As the king says in *Alice in Wonderland*, “Begin at the beginning and go on till you come to the end: then stop.”

# The Technology

The examples in this book were created in various releases of Node 0.6.x. Most were tested in a Linux environment, but should work, as is, in any Node environment.

Node 0.8.x released just as this book went to production. The examples in the chapters do work with Node 0.8.x for the most part; I have indicated the instances where you’ll need to make a code change to ensure that the application works with the newest Node release.

# The Examples

You can find the examples as a compressed file at the O’Reilly web page for this book (http://oreil.ly/Learning_node). Once you’ve downloaded and uncompressed it, and you have Node installed, you can install all the dependency libraries for the examples by changing to the *examples* directory and typing:

npm install -d

I’ll cover more on using the Node package manager (npm) in Chapter 4.

# Conventions Used in This Book

The following typographical conventions are used in this book:

Plain text

Indicates menu titles, menu options, menu buttons, and keyboard accelerators (such as Alt and Ctrl).

Italic

Indicates new terms, URLs, email addresses, filenames, file extensions, pathnames, directories, and Unix utilities.

Constant width

Indicates commands, options, switches, variables, attributes, keys, functions, types, classes, namespaces, methods, modules, properties, parameters, values, objects, events, event handlers, XML tags, HTML tags, macros, the contents of files, or the output from commands.

Constant width bold

Shows commands or other text that should be typed literally by the user.

Constant width italic

Shows text that should be replaced with user-supplied values.

### Note

This icon signifies a tip, suggestion, or general note.

Warning

This icon indicates a warning or caution.

# Using Code Examples

This book is here to help you get your job done. In general, you may use the code in this book in your programs and documentation. You do not need to contact us for permission unless you’re reproducing a significant portion of the code. For example, writing a program that uses several chunks of code from this book does not require permission. Selling or distributing a CD-ROM of examples from O’Reilly books does require permission. Answering a question by citing this book and quoting example code does not require permission. Incorporating a significant amount of example code from this book into your product’s documentation does require permission.

We appreciate, but do not require, attribution. An attribution usually includes the title, author, publisher, and ISBN. For example: “*Learning Node* by Shelley Powers (O’Reilly). Copyright 2012 Shelley Powers, 978-1-449-32307-3.”

If you feel your use of code examples falls outside fair use or the permission given above, feel free to contact us at permissions@oreilly.com.

# Safari® Books Online

### Note

Safari Books Online (www.safaribooksonline.com) is an on-demand digital library that delivers expert content in both book and video form from the world’s leading authors in technology and business.

Technology professionals, software developers, web designers, and business and creative professionals use Safari Books Online as their primary resource for research, problem solving, learning, and certification training.

Safari Books Online offers a range of product mixes and pricing programs for organizations, government agencies, and individuals. Subscribers have access to thousands of books, training videos, and prepublication manuscripts in one fully searchable database from publishers like O’Reilly Media, Prentice Hall Professional, Addison-Wesley Professional, Microsoft Press, Sams, Que, Peachpit Press, Focal Press, Cisco Press, John Wiley & Sons, Syngress, Morgan Kaufmann, IBM Redbooks, Packt, Adobe Press, FT Press, Apress, Manning, New Riders, McGraw-Hill, Jones & Bartlett, Course Technology, and dozens more. For more information about Safari Books Online, please visit us online.

# How to Contact Us

Please address comments and questions concerning this book to the publisher:

O’Reilly Media, Inc.

---

1005 Gravenstein Highway North

---

Sebastopol, CA 95472

---

800-998-9938 (in the United States or Canada)

---

707-829-0515 (international or local)

---

707-829-0104 (fax)

---

We have a web page for this book, where we list errata, examples, and any additional information. You can access this page at http://oreil.ly/Learning_node.

To comment or ask technical questions about this book, please send email to bookquestions@oreilly.com.

For more information about our books, courses, conferences, and news, see our website at http://www.oreilly.com.

Find us on Facebook: http://facebook.com/oreilly

Follow us on Twitter: http://twitter.com/oreillymedia

Watch us on YouTube: http://www.youtube.com/oreillymedia

# Acknowledgments

Thanks, as always, to friends and family who help keep me sane when I work on a book. Special thanks to my editor, Simon St. Laurent, who listened to me vent more than once.

My thanks also to the production crew who helped take this book from an idea to the work you’re now holding: Rachel Steely, Rachel Monaghan, Kiel Van Horn, Aaron Hazelton, and Rebecca Demarest.

When you work with Node, you’re the recipient of a great deal of generosity, starting with the creator of Node.js, Ryan Dahl, and including the creator of npm, Isaac Schlueter, who is also now the Node.js gatekeeper.

Others who provided extremely useful code and modules in this book are Bert Belder, TJ Holowaychuk, Jeremy Ashkenas, Mikeal Rogers, Guillermo Rauch, Jared Hanson, Felix Geisendörfer, Steve Sanderson, Matt Ranney, Caolan McMahon, Remy Sharp, Chris O’Hara, Mariano Iglesias, Marco Aurélio, Damián Suárez, Jeremy Ashkenas, Nathan Rajlich, Christian Amor Kvalheim, and Gianni Chiappetta. My apologies for any module developers I have inadvertently omitted.

And what would Node be without the good people who provide tutorials, how-tos, and helpful guides? Thanks to Tim Caswell, Felix Geisendörfer, Mikato Takada, Geo Paul, Manuel Kiessling, Scott Hanselman, Peter Krumins, Tom Hughes-Croucher, Ben Nadel, and the entire crew of Nodejitsu and Joyent.