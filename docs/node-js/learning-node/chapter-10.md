# Chapter 10

Chapter 10. Node and MongoDB: Document-Centric Data

Chapter 9 covered one popular NoSQL database structure (key/value pairs via Redis), and this chapter covers another: document-centric data stores via MongoDB.

Where MongoDB differs from relational database systems, such as MySQL, is in its support for storing structured data as documents, rather than implementing the more traditional tables. These documents are encoded as BSON, a binary form of JSON, which probably explains its popularity among JavaScript developers. Instead of a table row, you have a BSON document; instead of a table, you have a collection.

MongoDB isn’t the only document-centric database. Other popular versions of this type of data store are CouchDB by Apache, SimpleDB by Amazon, RavenDB, and even the venerable Lotus Notes. There is some Node support of varying degrees for most modern document data stores, but MongoDB and CouchDB have the most. I decided to cover MongoDB rather CouchDB for the same reasons I picked Express over other frameworks: I feel it’s easier for a person with no exposure to the secondary technology (in this case, the data store) to be able to grasp the Node examples without having to focus overmuch on the non-Node technology. With MongoDB, we can query the data directly, whereas with CouchDB, we work with the concept of views. This higher level of abstraction does require more up-front time. In my opinion, you can hit the ground running faster with MongoDB than CouchDB.

There are several modules that work with MongoDB, but I’m going to focus on two: the MongoDB Native Node.js Driver (a driver written in JavaScript), and Mongoose, an object modeling tool providing ORM (object-relational mapping) support.

### Note

Though I won’t get into too many details in this chapter about how MongoDB works, you should be able to follow the examples even if you have not worked with the database system previously. There’s more on MongoDB, including installation help, at http://www.mongodb.org/.

# The MongoDB Native Node.js Driver

The MongoDB Native Node.js Driver module is a native MongoDB driver for Node. Using it to issue MongoDB instructions is little different from issuing these same instructions into the MongoDB client interface.

### Note

The node-mongodb-native GitHub page is at https://github.com/mongodb/node-mongodb-native, and documentation is at http://mongodb.github.com/node-mongodb-native/.

After you have installed MongoDB (following the instructions outlined at the MongoDB website) and started a database, install the MongoDB Native Node.js Driver with npm:

npm install mongodb

Before trying out any of the examples in the next several sections, make sure MongoDB is installed locally, and is running.

Warning

If you’re already using MongoDB, make sure to back up your data before trying out the examples in this chapter.

## Getting Started with MongoDB

To use the MongoDB driver, you first have to require the module:

var mongodb = require('mongodb');

To establish a connection to MongoDB, use the mongodb.Server object constructor:

var server = new mongodb.Server('localhost',:27017, {auto_reconnect: true});

All communication with the MongoDB occurs over TCP. The server constructor accepts the host and port as the first two parameters—in this case, the default localhost and port 27017. The third parameter is a set of options. In the code, the auto_reconnect option is set to true, which means the driver attempts to reestablish a connection if it’s lost. Another option is poolSize, which determines how many TCP connections are maintained in parallel.

### Note

MongoDB uses one thread per connection, which is why the database creators recommend that developers use connection pooling.

Once you have a connection to MongoDB, you can create a database or connect to an existing one. To create a database, use the mongodb.Db object constructor:

var db = new mongdb.Db('mydb', server);

The first parameter is the database name, and the second is the MongoDB server connection. A third parameter is an object with a set of options. The default option values are sufficient for the work we’re doing in this chapter, and the MongoDB driver documentation covers the different values, so I’ll skip repeating them in this chapter.

If you’ve not worked with MongoDB in the past, you may notice that the code doesn’t have to provide username and password authentication. By default, MongoDB runs without authentication. When authentication isn’t enabled, the database has to run in a trusted environment. This means that MongoDB allows connections only from trusted hosts, typically only the localhost address.

## Defining, Creating, and Dropping a MongoDB Collection

MongoDB collections are fundamentally equivalent to relational database tables, but without anything that even closely resembles a relational database table.

When you define a MongoDB collection, you can specify if you want a collection object to actually be created at that time, or only after the first row is added. Using the MongoDB driver, the following code demonstrates the difference between the two; the first statement doesn’t create the actual collection, and the second does:

db.collection('mycollection', function(err, collection{});

db.createCollection('mycollection', function(err, collection{});

You can pass an optional second parameter to both methods, {safe : true}, which instructs the driver to issue an error if the collection does not exist when used with db.collection, and an error if the collection already exists if used with db.createCollection:

db.collection('mycollection', {safe : true}, function (err, collection{});

db.createCollection('mycollection', {safe : true}, function(err, collection{});

If you use db.createCollection on an existing collection, you’ll just get access to the collection—the driver won’t overwrite it. Both methods return a collection object in the callback function, which you can then use to add, modify, or retrieve document data.

If you want to completely drop the collection, use db.dropCollection:

db.dropCollection('mycollection', function(err, result){});

Note that all of these methods are asynchronous, and are dependent on nested callbacks if you want to process the commands sequentially. This is demonstrated more fully in the next section, where we’ll add data to a collection.

## Adding Data to a Collection

Before getting into the mechanics of adding data to a collection, and looking at fully operational examples, I want to take a moment to discuss data types. More specifically, I want to repeat what the MongoDB driver mentions about data types, because the use of JavaScript has led to some interesting negotiations between the driver and the MongoDB.

Table 10-1 shows the conversions between the data types supported by MongoDB and their JavaScript equivalents. Note that most conversions occur cleanly—no potentially unexpected effects. Some, though, do require some behind-the-scenes finagling that you should be aware of. Additionally, some data types are provided by the MongoDB Native Node.js Driver, but don’t have an equivalent value in MongoDB. The driver converts the data we provide into data the MongoDB can accept.

Table 10-1. Node.js MongoDB driver to MongoDB data type mapping

| MongoDB type | JavaScript type | Notes/examples |
| --- | --- | --- |
| JSON array | Array [1,2,3] | [1,2,3]. |
| string | String | utf8 encoded. |
| boolean | Boolean | true or false. |
| integer | Number | MongoDB supports 32- and 64-bit numbers; JavaScript numbers are 64-bit floats. The MongoDB driver attempts to fit the value into 32 bits; if it fails, it promotes to 64 bits; if this fails, it promotes to the Long class. |
| integer | Long class | The Long class provides full 64-bit integer support. |
| float | Number |  |
| float | Double class | Special class representing a float value. |
| Date | Date |  |
| Regular expression | RegExp |  |
| null | null |  |
| Object | Object |  |
| Object id | ObjectID class | Special class that holds a MongoDB document identifier. |
| Binary data | Binary class | Class to store binary data. |
|  | Code class | Class to store the JavaScript function and score for the method to run in. |
|  | DbRef class | Class to store reference to another document. |
|  | Symbol class | Specify a symbol (not specific to JavaScript, for languages that use symbols). |

Once you have a reference to a collection, you can add documents to it. The data is structured as JSON, so you can create a JSON object and then insert it directly into the collection.

To demonstrate all of the code to this point, in addition to adding data to a collection, Example 10-1 creates a first collection (named Widgets) in MongoDB and then adds two documents. Since you might want to run the example a couple of times, it first removes the collection documents using the remove method. The remove method takes three optional parameters:

- Selector for the document(s); if none is provided, all documents are removed
- An optional safe mode indicator, safe {true | {w:n, wtimeout:n} | {fsync:true}, default:false}
- A callback function (required if safe mode indicator is set to true)

In the example, the application is using a safe remove, passing in null for the first parameter (as a parameter placeholder, ensuring that all documents are removed) and providing a callback function. Once the documents are removed, the application inserts two new documents, with the second insert using safe mode. The application prints to the console the result of the second insert.

The insert method also takes three parameters: the document or documents being inserted, an options parameter, and the callback function. You can insert multiple documents by enclosing them in an array. The options for insert are:

Safe mode

safe {true | {w:n, wtimeout:n} | {fsync:true}, default:false}

keepGoing

Set to true to have application continue if one of the documents generates an error

serializeFunctions

Serialize functions on the document

The method calls are asynchronous, which means there’s no guarantee that the first document is inserted before the second. However, it shouldn’t be a problem with the widget application—at least not in this example. Later in the chapter, we’ll look more closely at some of the challenges of working asynchronously with database applications.

Example 10-1. Creating/opening a database, removing all documents, and adding two new documents

var mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});

var db = new mongodb.Db('exampleDb', server);

// open database connection

db.open(function(err, db) {

if(!err) {

// access or create widgets collection

db.collection('widgets', function(err, collection) {

// remove all widgets documents

collection.remove(null,{safe : true}, function(err, result) {

if (!err) {

console.log('result of remove ' + result);

// create two records

var widget1 = {title : 'First Great widget',

desc : 'greatest widget of all',

price : 14.99};

var widget2 = {title : 'Second Great widget',

desc : 'second greatest widget of all',

price : 29.99};

collection.insert(widget1);

collection.insert(widget2, {safe : true}, function(err, result) {

if(err) {

console.log(err);

} else {

console.log(result);

//close database

db.close();

}

});

}

});

});

}

});

The output to the console after the second insert is a variation on:

[ { title: 'Second Great widget',

desc: 'second greatest widget of all',

price: 29.99,

_id: 4fc108e2f6b7a3e252000002 } ]

The MongoDB generates a unique system identifier for each document. You can access documents with this identifier at a future time, but you’re better off adding a more meaningful identifier—one that can be determined easily by context of use—for each document.

As mentioned earlier, we can insert multiple documents at the same time by providing an array of documents rather than a single document. The following code demonstrates how both widget records can be inserted in the same command. The code also incorporates an application identifier with the id field:

// create two records

var widget1 = {id: 1, title : 'First Great widget',

desc : 'greatest widget of all',

price : 14.99};

var widget2 = {id: 2, title : 'Second Great widget',

desc : 'second greatest widget of all',

price : 29.99};

collection.insert([widget1,widget2], {safe : true},

function(err, result) {

if(err) {

console.log(err);

} else {

console.log(result);

// close database

db.close();

}

});

If you do batch your document inserts, you’ll need to set the keepGoing option to true to be able to keep inserting documents even if one of the insertions fails. By default, the application stops if an insert fails.

## Querying the Data

There are four methods of finding data in the MongoDB Native Node.js Driver:

find

Returns a cursor with all the documents returned by the query

findOne

Returns a cursor with the first document found that matches the query

findAndRemove

Finds a document and then removes it

findAndModify

Finds a document and then performs an action (such as remove or upsert)

In this section, I’ll demonstrate collection.find and collection.findOne, and reserve the other two methods for the next section, Using Updates, Upserts, and Find and Remove.

Both collection.find and collection.findOne support three arguments: the query, options, and a callback. The options object and the callback are optional, and the list of possible options to use with both methods is quite extensive. Table 10-2 shows all the options, their default setting, and a description of each.

Table 10-2. Find options

| Option | Default value | Description |
| --- | --- | --- |
| limit | Number, default of 0 | Limits the number of documents returned (0 is no limit). |
| sort | Array of indexes | Set to sort the documents returning from query. |
| fields | Object | Fields to return in the query. Use the property name and a value of 1 to include, or 0 to exclude; that is, {'prop' : 1} or {'prop' : 0}, but not both. |
| skip | Number, default of 0 | Skip *n* documents (useful for pagination). |
| hint | Object | Tell the database to use specific indexes, {'_id' : 1}. |
| explain | Boolean, default is false | Explain the query instead of returning data. |
| snapshot | Boolean, default is false | Snapshot query (MongoDB *journaling* must be enabled). |
| timeout | Boolean, default is false | Cursor can time out. |
| tailable | Boolean, default is false | Cursor is *tailable* (only on capped collections, allowing resumption of retrieval, similar to Unix tail command). |
| batchSize | Number, default is 0 | batchSize for the getMoreCommand when iterating over results. |
| returnKey | Boolean, default is false | Only return the index key. |
| maxScan | Number | Limit the number of items that can be scanned. |
| min | Number | Set index bounds. |
| max | Number | Set index bounds. |
| showDiskLoc | Boolean, default is false | Show the disk location of results. |
| comment | String | Add a comment to the query for profiler logs. |
| raw | Boolean, default is false | Return BSON results as raw buffer documents. |
| read | Boolean, default is false | Direct the query to a secondary server. |

The options allow for a great deal of flexibility with queries, though most queries will most likely need only a few of them. I’ll cover some of the options in the examples, but I recommend you try the others with your example MongoDB installation.

The simplest query for all documents in the collection is to use the find method without any parameters. You immediately convert the results to an array using toArray, passing in a callback function that takes an error and an array of documents. Example 10-2 shows the application that performs this functionality.

Example 10-2. Inserting four documents and then retrieving them with the find method

var mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});

var db = new mongodb.Db('exampleDb', server);

// open database connection

db.open(function(err, db) {

if(!err) {

// access or create widgets collection

db.collection('widgets', function(err, collection) {

// remove all widgets documents

collection.remove(null,{safe : true}, function(err, result) {

if (!err) {

// create four records

var widget1 = {id: 1, title : 'First Great widget',

desc : 'greatest widget of all',

price : 14.99, type: 'A'};

var widget2 = {id: 2, title : 'Second Great widget',

desc : 'second greatest widget of all',

price : 29.99, type: 'A'};

var widget3 = {id: 3, title: 'third widget', desc: 'third widget',

price : 45.00, type: 'B'};

var widget4 = {id: 4, title: 'fourth widget', desc: 'fourth widget',

price: 60.00, type: 'B'};

collection.insert([widget1,widget2,widget3,widget4], {safe : true},

function(err, result) {

if(err) {

console.log(err);

} else {

// return all documents

collection.find().toArray(function(err, docs) {

console.log(docs);

//close database

db.close();

});

}

});

}

});

});

}

});

The result printed out to the console shows all four newly added documents, with their system-generated identifiers:

[ { id: 1,

title: 'First Great widget',

desc: 'greatest widget of all',

price: 14.99,

type: 'A',

_id: 4fc109ab0481b9f652000001 },

{ id: 2,

title: 'Second Great widget',

desc: 'second greatest widget of all',

price: 29.99,

type: 'A',

_id: 4fc109ab0481b9f652000002 },

{ id: 3,

title: 'third widget',

desc: 'third widget',

price: 45,

type: 'B',

_id: 4fc109ab0481b9f652000003 },

{ id: 4,

title: 'fourth widget',

desc: 'fourth widget',

price: 60,

type: 'B',

_id: 4fc109ab0481b9f652000004 } ]

Rather than return all of the documents, we can provide a selector. In the following code, we’re querying all documents that have a type of A, and returning all the fields but the type field:

// return all documents

collection.find({type:'A'},{fields:{type:0}}).toArray(function(err, docs) {

if(err) {

console.log(err);

} else {

console.log(docs);

//close database

db.close();

}

});

The result of this query is:

[ { id: 1,

title: 'First Great widget',

desc: 'greatest widget of all',

price: 14.99,

_id: 4f7ba035c4d2204c49000001 },

{ id: 2,

title: 'Second Great widget',

desc: 'second greatest widget of all',

price: 29.99,

_id: 4f7ba035c4d2204c49000002 } ]

We can also access only one document using findOne. The result of this query does not have to be converted to an array, and can be accessed directly. In the following, the document with an ID of 1 is queried, and only the title is returned:

// return one document

collection.findOne({id:1},{fields:{title:1}}, function(err, doc) {

if (err) {

console.log(err);

} else {

console.log(doc);

//close database

db.close();

}

});

The result from this query is:

{ title: 'First Great widget', _id: 4f7ba0fcbfede06649000001 }

The system-generated identifier is always returned with the query results.

Even if I modified the query to return all documents with a type of A (there are two), only one is returned with the collection.findOne method. Changing the limit in the options object won’t make a difference: the method always returns one document if the query is successful.

## Using Updates, Upserts, and Find and Remove

The MongoDB Native Node.js Driver supports several different methods that either modify or remove an existing document—or both, in the case of one method:

update

Either updates or *upserts* (adds if doesn’t exist) a document

remove

Removes a document

findAndModify

Finds and modifies or removes a document (returning the modified or removed document)

findAndRemove

Finds and removes a document (returning the removed document)

The basic difference between update/remove and findAndModify/findAndRemove is that the latter set of methods returns the affected document.

The functionality to use these methods is not very different from what we saw with the inserts. You’ll have to open a database connection, get a reference to the collection you’re interested in, and then perform the operations.

If the MongoDB currently contains the following document:

{ id : 4,

title: 'fourth widget',

desc: 'fourth widget'.

price: 60.00,

type: 'B'}

and you want to modify the title, you can use the update method to do so, as shown in Example 10-3. You can supply all of the fields, and MongoDB does a replacement of the document, but you’re better off using one of the MongoDB modifiers, such as $set. The $set modifier instructs the database to just modify whatever fields are passed as properties to the modifier.

Example 10-3. Updating a MongoDB document

var mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});

var db = new mongodb.Db('exampleDb', server);

// open database connection

db.open(function(err, db) {

if(!err) {

// access or create widgets collection

db.collection('widgets',function(err, collection) {

//update

**collection.update({id:4},{$set : {title: 'Super Bad Widget'}},{safe: true}, function(err, result) {**
if (err) {
console.log(err);
} else {
console.log(result);
// query for updated record
collection.findOne({id:4}, function(err, doc) {
if(!err) {
console.log(doc);
//close database
db.close();
}
});
}
});
});
}
});

The resulting document now displays the modified fields.

### Note

You can use $set with multiple fields.

There are additional modifiers that provide other atomic data updates of interest:

$inc

Increments a field’s value by a specified amount

$set

Sets a field, as demonstrated

$unset

Deletes a field

$push

Appends a value to the array if the field is an array (converts it to an array if it wasn’t)

$pushAll

Appends several values to an array

$addToSet

Adds to an array only if the field is an array

$pull

Removes a value from an array

$pullAll

Removes several values from an array

$rename

Renames a field

$bit

Performs a bitwise operation

So why don’t we just remove the document and insert a new one, rather than use a modifier? Because although we had to provide all of the user-defined fields, we don’t have to provide the system-generated identifier. This value remains constant with the update. If the system-generated identifier is stored as a field in another document, say a parent document, removing the document will leave the reference to the original document orphaned in the parent.

### Note

Though I don’t cover the concept of trees (complex parent/child data structures) in this chapter, the MongoDB website has documentation on them.

More importantly, the use of modifiers ensures that the action is performed *in place*, providing some assurance that one person’s update won’t overwrite another’s.

Though we used none in the example, the update method takes four options:

- safe for a safe update
- upsert, a Boolean set to true if an insert should be made if the document doesn’t exist (default is false)
- multi, a Boolean set to true if all documents that match the selection criteria should be updated
- serializeFunction to serialize functions on the document

If you’re unsure whether a document already exists in the database, set the upsert option to true.

Example 10-3 did a find on the modified record to ensure that the changes took effect. A better approach would be to use findAndModify. The parameters are close to what’s used with the update, with the addition of a sort array as the second parameter. If multiple documents are returned, updates are performed in sort order:

//update

collection.findAndModify({id:4}, [[ti]],

{$set : {title: 'Super Widget', desc: 'A really great widget'}},

{new: true}, function(err, doc) {

if (err) {

console.log(err);

} else {

console.log(doc);DB

}

db.close();

});

You can use the findAndModify method to remove a document if you use the remove option. If you do, no document is returned in the callback function. You can also use the remove and the findAndRemove methods to remove the document. Earlier examples have used remove, without a selector, to remove all the documents before doing an insert. To remove an individual document, provide a selector:

collection.remove({id:4},

{safe: true}, function(err, result) {

if (err) {

console.log(err);

} else {

console.log(result);

}

The result is the number of documents removed (in this case, 1). To see the document being removed, use findAndRemove:

collection.findAndRemove({id:3}, [['id',1]],

function(err, doc) {

if (err) {

console.log(err);

} else {

console.log(doc);

}

I’ve covered the basic CRUD (create, read, update, delete) operations you can perform from a Node application with the Native driver, but there are considerably more capabilities, including working with capped collections, indexes, and the other MongoDB modifiers; sharding (partitioning data across machines); and more. The Native driver documentation covers all of these and provides good examples.

The examples demonstrate some of the challenges associated with handling data access in an asynchronous environment, discussed more fully in the sidebar Challenges of Asynchronous Data Access.

### Challenges of Asynchronous Data Access

One of the challenges with asynchronous development and data access is the level of nesting necessary to ensure that one operation is finished before another is started. In the last several sections, you had a chance to see how quickly the callback functions nest, just by performing a few simple operations—access the MongoDB, get a reference to a collection, perform an operation, and verify that it took place.

The MongoDB Native Node.js Driver documentation contains instances where the example developers used a timer to make sure a previous function was finished before performing the next. You’re not going to want to use this approach. To avoid the problems with heavily nested callback functions, you can use either named functions, or one of the asynchronous modules, such as Step and Async.

The best approach of all is to ensure that you’re doing the minimum functionality necessary in each method that’s updating the MongoDB database. If you’re having a hard time preventing nested callbacks and the application is difficult to convert using a module like Async, chances are, you are doing too much. In that case, you need to look for opportunities to break down a complex multiple database operation function into manageable units.

Asynchronous programming rewards simplicity.

# Implementing a Widget Model with Mongoose

The MongoDB Native Node.js Driver provides a binding to the MongoDB, but doesn’t provide a higher-level abstraction. For this, you’ll need to use an ODM (object-document mapping) like Mongoose.

### Note

The Mongoose website is at http://mongoosejs.com/.

To use Mongoose, install it with npm:

npm install mongoose

Instead of issuing commands directly against a MongoDB database, you define objects using the Mongoose Schema object, and then sync it with the database using the Mongoose model object:

var Widget = new Schema({

sn : {type: String, require: true, trim: true, unique: true},

name : {type: String, required: true, trim: true},

desc : String,

price : Number

});

var widget = mongoose.model('Widget', Widget);

When we define the object, we provide information that controls what happens to that document field at a later time. In the code just provided, we define a Widget object with four explicit fields: three of type String, and one of type Number. The sn and name fields are both required and trimmed, and the sn field must be unique in the document database.

The collection isn’t made at this point, and won’t be until at least one document is created. When we do create it, though, it’s named widgets—the widget object name is lowercased and pluralized.

Anytime you need to access the collection, you make the same call to the mongoose.model.

This code is the first step in adding the final component to the Model-View-Controller (MVC) widget implementation started in earlier chapters. In the next couple of sections, we’ll finish the conversion from an in-memory data store to MongoDB. First, though, we need to do a little refactoring on the widget application.

## Refactoring the Widget Factory

*Refactoring* is the process of restructuring existing code in such a way as to clean up the cruft behind the scenes with minimal or no impact on the user interface. Since we’re converting the widget application over to a MongoDB database, now is a good time to see what other changes we want to make.

Currently, the filesystem structure for the widget application is:

/application directory

/routes - home directory controller

/controllers - object controllers

/public - static files

/widgets

/views - template files

/widgets

The *routes* subdirectory provides top-level (non-business-object) functionality. The name isn’t very meaningful, so I renamed it to *main*. This necessitated some minor modifications to the primary *app.js* file as follows:

// top level

app.get('/', main.index);

app.get('/stats', main.stats);

Next, I added a new subdirectory named *models*. The MongoDB model definitions are stored in this subdirectory, as the controller code is in the *controllers* subdirectory. The directory structure now looks like the following:

/application directory

/main - home directory controller

/controllers - object controllers

/public - static files

/widgets

/views - template files

/widgets

The next change to the application is related to the structure of the data. Currently, the application’s primary key is an ID field, system-generated but accessible by the user via the routing system. To show a widget, you’d use a URL like the following:

http://localhost:3000/widgets/1

---

This isn’t an uncommon approach. Drupal, a popular content management system (CMS), uses this approach for accessing Drupal nodes (stories) and users, unless a person uses a URL redirection module:

http://burningbird.net/node/78

---

The problem is that MongoDB generates an identifier for each object, and uses a format that makes it unattractive for routing. There is a workaround—which requires creating a third collection that contains an identifier, and then using it to take the place of the identifier—but the approach is ugly, counter to MongoDB’s underlying structure, and not especially doable with Mongoose.

The widget title field is unique, but has spaces and characters that make it unattractive as a routing URL. Instead, we define a new field, sn, which is the new serial number for the product. When a new widget object is created, the user assigns whatever serial number she wants for the product, and the serial number is used when we access the widget at a later time. If the widget serial number is 1A1A, for example, it’s accessed with:

http://localhost:3000/widgets/1A1A

---

The new data structure, from an application point of view, is:

sn: string

title: string

desc: string

price: number

This modification necessitates some changes to the user interface, but they’re worthwhile. The Jade templates also need to be changed, but the change is minor: basically replacing references to id with references to sn, and adding a field for serial number to any form.

### Note

Rather than duplicate all the code again to show minor changes, I’ve made the examples available at O’Reilly’s catalog page for this book (http://oreilly.com/catalog/9781449323073); you’ll find all of the new widget application files in the *chap12* subdirectory.

The more significant change is to the controller code in the *widget.js* file. The changes to this file, and others related to adding a MongoDB backend, are covered in the next section.

## Adding the MongoDB Backend

The first necessary change is to add a connection to the MongoDB database. It’s added to the primary *app.js* file, so the connection persists for the life of the application.

First, Mongoose is included into the file:

var mongoose = require('mongoose');

Then the database connection is made:

// MongoDB

mongoose.connect('mongodb://127.0.0.1/WidgetDB');

mongoose.connection.on('open', function() {

console.log('Connected to Mongoose');

});

Notice the URI for the MongoDB. The specific database is passed as the last part of the URI.

This change and the aforementioned change converting *routes* to *main* are all the changes necessary for *app.js*.

The next change is to *maproutecontroller.js.* The routes that reference id must be changed to now reference sn. The modified routes are shown in the following code block:

// show

app.get(prefix + '/:sn', prefixObj.show);

// edit

app.get(prefix + '/:sn/edit', prefixObj.edit);

// update

app.put(prefix + '/:sn', prefixObj.update);

// destroy

app.del(prefix + '/:sn', prefixObj.destroy);

If we don’t make this change, the controller code expects sn as a parameter but gets id instead.

The next code is an addition, not a modification. In the *models* subdirectory, a new file is created, named *widgets.js*. This is where the widget model is defined. To make the model accessible outside the file, it’s exported, as shown in Example 10-4.

Example 10-4. The new widget model definition

var mongoose = require('mongoose');

var Schema = mongoose.Schema

,ObjectId = Schema.ObjectId;

// create Widget model

var Widget = new Schema({

sn : {type: String, require: true, trim: true, unique: true},

name : {type: String, required: true, trim: true},

desc : String,

price : Number

});

module.exports = mongoose.model('Widget', Widget);

The last change is to the widget controller code. We’re swapping out the in-memory data store for MongoDB, using a Mongoose model. Though the change is significant from a processing perspective, the code modification isn’t very extensive—just a few tweaks, having as much to do with changing id to sn as anything else. Example 10-5 contains the complete code for the widget controller code.

Example 10-5. The newly modified widget controller code

var Widget = require('../models/widget.js');

// index listing of widgets at /widgets/

exports.index = function(req, res) {

Widget.find({}, function(err, docs) {

console.log(docs);

res.render('widgets/index', {title : 'Widgets', widgets : docs});

});

};

// display new widget form

exports.new = function(req, res) {

console.log(req.url);

var filePath = require('path').normalize(__dirname +

"/../public/widgets/new.html");

res.sendfile(filePath);

};

// add a widget

exports.create = function(req, res) {

var widget = {

sn : req.body.widgetsn,

name : req.body.widgetname,

price : parseFloat(req.body.widgetprice),

desc: req.body.widgetdesc};

var widgetObj = new Widget(widget);

widgetObj.save(function(err, data) {

if (err) {

res.send(err);

} else {

console.log(data);

res.render('widgets/added', {title: 'Widget Added', widget: widget});

}

});

};

// show a widget

exports.show = function(req, res) {

var sn = req.params.sn;

Widget.findOne({sn : sn}, function(err, doc) {

if (err)

res.send('There is no widget with sn of ' + sn);

else

res.render('widgets/show', {title : 'Show Widget', widget : doc});

});

};

// delete a widget

exports.destroy = function(req, res) {

var sn = req.params.sn;

Widget.remove({sn : sn}, function(err) {

if (err) {

res.send('There is no widget with sn of ' + sn);

} else {

console.log('deleted ' + sn);

res.send('deleted ' + sn);

}

});

};

// display edit form

exports.edit = function(req, res) {

var sn = req.params.sn;

Widget.findOne({sn : sn}, function(err, doc) {

console.log(doc);

if(err)

res.send('There is no widget with sn of ' + sn);

else

res.render('widgets/edit', {title : 'Edit Widget', widget : doc});

});

};

// update a widget

exports.update = function(req, res) {

var sn = req.params.sn;

var widget = {

sn : req.body.widgetsn,

name : req.body.widgetname,

price : parseFloat(req.body.widgetprice),

desc : req.body.widgetdesc};

Widget.update({sn : sn}, widget, function(err) {

if (err)

res.send('Problem occured with update' + err)

else

res.render('widgets/added', {title: 'Widget Edited', widget : widget})

});

};

Now the widget application’s data is persisted to a database, rather than disappearing every time the application is shut down. And the entire application is set up in such a way that we can add support for new data entities with minimal impact on the stable components of the application.

### Note

The widget application in the examples for this chapter builds on previous chapter work. This means you’ll need to start a Redis server, in addition to MongoDB, for the application to work correctly.