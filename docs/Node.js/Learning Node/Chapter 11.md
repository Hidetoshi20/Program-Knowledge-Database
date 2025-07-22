# Chapter 11

Chapter 11. The Node Relational Database Bindings

In traditional web development, relational databases are the most popular means of data storage. Node, perhaps because of the type of applications it attracts, or perhaps because it attracts uses that fit outside the traditional development box, doesn’t follow this pattern: there is a lot more support for data applications such as Redis and MongoDB than there is for relational databases.

There are some relational database modules you can use in your Node applications, but they may not be as complete as you’re used to with database bindings in languages such as PHP and Python. In my opinion, the Node modules for relational databases are not yet production ready.

On the positive side, though, the modules that do support relational databases are quite simple to use. In this chapter I’m going to demonstrate two different approaches to integrating a relational database, MySQL, into Node applications. One approach uses mysql (node-mysql), a popular JavaScript MySQL client. The other approach uses db-mysql, which is part of the new node-db initiative to create a common framework for database engines from Node applications. The db-mysql module is written in C++.

Neither of the modules mentioned currently supports transactions, but mysql-series has added this type of functionality to node-mysql. I’ll provide a quick demonstration on this, and also offer a brief introduction to Sequelize, an ORM (object-relational mapping) library that works with MySQL.

There are a variety of relational databases, including SQL Server, Oracle, and SQLite. I’m focusing on MySQL because there are installations available for Windows and Unix environments, it’s free for noncommercial use, and it’s the most commonly used database with applications most of us have used. It’s also the relational database with the most support in Node.

The test database used in the chapter is named nodetest2, and it contains one table with the following structure:

id - int(11), primary key, not null, autoincrement

title - varchar(255), unique key, not null

text - text, nulls allowed

created - datetime, nulls allowed

# Getting Started with db-mysql

The db-mysql Node module is a native module, and requires installation of the MySQL client libraries on your system. Check with http://nodejsdb.org/db-mysql/ for installation and setup instructions.

Once your environment is set up, you can install db-mysql with npm:

npm install db-mysql

The db-mysql module provides two classes to interact with the MySQL database. The first is the database class, which you use to connect and disconnect from the database and do a query. The query class is what’s returned from the database query method. You can use the query class to create a query either through chained methods representing each component of the query, or directly using a query string; db-mysql is very flexible.

Results, including any error, are passed in the last callback function for any method. You can use nested callbacks to chain actions together, or use the EventEmitter event handling in order to process both errors and database command results.

When creating the database connection to a MySQL database, you can pass several options that influence the created database. You’ll need to provide, at minimum, a hostname or a port or a socket, and a user, password, and database name:

var db = new mysql.Database({

hostname: 'localhost',

user: 'username',

password: 'userpass',

database: 'databasenm'

});

The options are detailed in the db-mysql documentation, as well as in the MySQL documentation.

## Using Query String or Chained Methods

To demonstrate db-mysql’s flexibility, the application in Example 11-1 connects to a database and runs the same query twice: the first using the query class chained methods, the second using a string query. The first query processes the result in a nested callback function, while the second listens for the success and error events and responds accordingly. In both cases, the result is returned in the rows object, which returns an array of objects representing each row of data.

Example 11-1. Demonstrating db-mysql’s flexibility by showing two different query styles

var mysql = require('db-mysql');

// define database connection

var db = new mysql.Database({

hostname: 'localhost',

user: 'username',

password: 'userpass',

database: 'databasenm'

});

// connect

db.connect();

db.on('error', function(error) {

console.log("CONNECTION ERROR: " + error);

});

// database connected

db.on('ready', function(server) {

// query using chained methods and nested callback

this.query()

.select('*')

.from('nodetest2')

.where('id = 1')

.execute(function(error, rows, columns) {

if (error) {

return console.log('ERROR: ' + error);

}

console.log(rows);

console.log(columns);

});

// query using direct query string and event

var qry = this.query();

qry.execute('select * from nodetest2 where id = 1');

qry.on('success', function(rows, columns) {

console.log(rows); // print out returned rows

console.log(columns); // print out returns columns

});

qry.on('error', function(error) {

console.log('Error: ' + error);

});

});

The database object emits a ready event once the database is connected, or error if there’s a problem with making the connection. The server object passed as a parameter for the callback function to the ready event contains the following properties:

hostname

The database hostname

user

The user used for the database connection

database

The database connected to

version

Server software version

The first query in the examples makes use of the query class chained methods that form each component of the query. The chained methods you can use for a SQL query are:

select

Contains the query’s selection criteria—such as a list of column names or asterisk (*) for all columns—or the select string

from

Contains an array of table names, or the string used in the from statement

join

A join clause consisting of an options object looking for a type of join, a table to join with, an alias for table (if any), joining conditions (if any), and whether to escape the table and alias names (defaults to true)

where

Conditional statement, which may contain placeholders and other chained methods representing the and and or conditions

order

Appends an ORDER BY clause

limit

Appends a LIMIT clause

add

Adds a generic clause, such as a UNION

The chained methods provide a more database-neutral approach to performing the same SQL statements. Right now, the Node.js database drivers support MySQL (db-mysql), and Drizzle (db-drizzle). The chained methods handle any variations between the two. The chained methods also automatically handle any escaping of the data in the SQL statement that’s necessary for safe usage. Otherwise, if using a straight query, you’ll have to use the query.escape method to properly escape the SQL.

The query object emits a success event if the query is successful, or an error. It also emits an each event for each row returned from the query. If the success event is for a query that returns rows, the callback function gets both a rows and a columns object. Each row is an array, with each array element containing an object made up of column name/value pairs. The columns object represents the columns that are part of the result, and each column object contains the column name and type. If the test table in the example has a table with columns of id, title, text, and created, the rows object would look like:

{ id: 1,

title: 'this is a nice title',

text: 'this is a nice text',

created: Mon, 16 Aug 2010 09:00:23 GMT }

The columns object would look like:

[ { name: 'id', type: 2 },

{ name: 'title', type: 0 },

{ name: 'text', type: 1 },

{ name: 'created', type: 6 } ]

If the success event is for a query that performs an update, delete, or insert, the success event callback function receives a result object as a parameter. I’ll cover this object in more detail in the next section.

Though the queries are each handled using different approaches, both have to be implemented within the database’s success event callback function. Since db-mysql is Node functionality, the methods are asynchronous. If you tried to do one of the queries outside of the database connect callback function, it wouldn’t succeed because the database connection won’t be established at that point.

## Updating the Database with Direct Queries

As noted, the db-mysql module provides two different ways to update the data in the relational database: a direct query, or using chained methods. We’ll first look at just using a direct query.

When using a direct query, you can use the same SQL you’d use in a MySQL client:

qry.execute('update nodetest2 set title = "This is a better title" where id = 1');

Or you can make use of placeholders:

qry.execute('update nodetest2 set title = ? where id = ?',

["This was a better title", 1]);

Placeholders can be used either with a direct query string or with the chained methods. Placeholders are a way of creating the query string ahead of time and then just passing in whatever values are needed. The placeholders are represented by question marks (?) in the string, and each value is given as an array element in the second parameter to the method.

The result of the operation being performed on the database is reflected in the parameter returned in the callback for the success event. In Example 11-2, a new row is inserted into the test database. Note that it makes use of the MySQL NOW function to set the created field with the current date and time. When using a MySQL function, you’ll need to place it directly into the query string—you can’t use a placeholder.

Example 11-2. Using placeholders in the query string

var mysql = require('db-mysql');

// define database connection

var db = new mysql.Database({

hostname: 'localhost',

user: 'username',

password: 'userpass',

database: 'databasenm'

});

// connect

db.connect();

db.on('error', function(error) {

console.log("CONNECTION ERROR: " + error);

});

// database connected

db.on('ready', function(server) {

// query using direct query string and event

var qry = this.query();

qry.execute('insert into nodetest2 (title, text, created) values(?,?,NOW())',

['Third Entry','Third entry in series']);

qry.on('success', function(result) {

console.log(result);

});

qry.on('error', function(error) {

console.log('Error: ' + error);

});

});

If the operation is successful, the following result is returned as a parameter in the callback function:

{ id: 3, affected: 1, warning: 0 }

The id is the generated identifier for the table row; the affected property shows the number of rows affected by the change (1), and the warning displays how many warnings the query generated for the rows (in this case, 0).

Database table row updates and deletions are handled in the same manner: either use the exact syntax you’d use in a MySQL client, or use placeholders. Example 11-3 adds a new record to the test database, updates the title, and then deletes the same record. You’ll notice I created a different query object for each query. Though you can run the same query multiple times, each query does have its own arguments—including the number of arguments it expects each time the query is run. I used four replacement values in the insert, but if I tried to use only two in the update, I’d get an error. The application also makes use of nested callbacks rather than event capturing.

Example 11-3. Inserting, updating, and deleting a record using nested callbacks

var mysql = require('db-mysql');

// define database connection

var db = new mysql.Database({

hostname: 'localhost',

user: 'username',

password: 'password',

database: 'databasenm'

});

// connect

db.connect();

db.on('error', function(error) {

console.log("CONNECTION ERROR: " + error);

});

// database connected

db.on('ready', function(server) {

// query using direct query string and nested callbacks

var qry = this.query();

qry.execute('insert into nodetest2 (title, text,created) values(?,?,NOW())',

['Fourth Entry','Fourth entry in series'], function(err,result) {

if (err) {

console.log(err);

} else {

console.log(result);

var qry2 = db.query();

qry2.execute('update nodetest2 set title = ? where id = ?',

['Better title',4], function(err,result) {

if(err) {

console.log(err);

} else {

console.log(result);

var qry3 = db.query();

qry3.execute('delete from nodetest2 where id = ?',[4],

function(err, result) {

if(err) {

console.log(err);

} else {

console.log(result);

}

});

}

});

}

});

});

One thing you might notice from the example is there’s no way to roll back previous SQL statements if an error occurs in any of them. At this time, there is no transaction management in db-mysql. If you need to ensure database consistency, you’ll have to provide it yourself in your application. You can do this by checking for an error after each SQL statement is executed, and then reversing previous successful operation(s) if a failure occurs. It’s not an ideal situation, and you’ll have to be careful about the use of any autoincrementing.

### Note

Transaction support of a kind is supported in another module, mysql-queues, which is covered a little later in the chapter.

## Updating the Database with Chained Methods

The db-mysql methods to insert, update, and delete a record are insert, update, and delete, respectively. Both the update and delete chained methods can also make use of the where method, which can in turn make use of the conditional chained methods of and and or. The update method can also use another chained method, set, to set values for the SQL statement.

Example 11-4 duplicates the functionality from Example 11-3, but uses chained methods for the insert and update methods. It does not use the chained method for the delete, because at the time this book was written, the delete method did not work correctly.

Example 11-4. Using chained methods to insert a new record and then update it

var mysql = require('db-mysql');

// define database connection

var db = new mysql.Database({

hostname: 'localhost',

user: 'username',

password: 'password',

database: 'databasenm'

});

// connect

db.connect();

db.on('error', function(error) {

console.log("CONNECTION ERROR: " + error);

});

// database connected

db.on('ready', function(server) {

// query using direct query string and nested callbacks

var qry = this.query();

qry.insert('nodetest2',['title','text','created'],

['Fourth Entry', 'Fourth entry in series', 'NOW()'])

.execute(function(err,result) {

if (err) {

console.log(err);

} else {

console.log(result);

var qry2 = db.query();

qry2.update('nodetest2')

.set({title: 'Better title'})

.where('id = ?',[4])

.execute(function(err, result) {

if(err) {

console.log(err);

} else {

console.log(result);

}

});

}

});

});

I’m not overfond of the chained methods, though I think they’re handy if you’re bringing in data from an application, or if your application may support multiple databases.

# Native JavaScript MySQL Access with node-mysql

Unlike with db-mysql, you don’t need to install specialized MySQL client software to work with node-mysql. You just need to install the module, and you’re good to go:

npm install mysql

The native driver is quite simple to use. You create a client connection to the MySQL database, select the database to use, and use this same client to do all database operations via the query method. A callback function can be passed as the last parameter in the query method, and provides information related to the last operation. If no callback function is used, you can listen for events to determine when processes are finished.

## Basic CRUD with node-mysql

As just stated, the node-mysql API is extremely simple: create the client, set the database, and send SQL statements as queries on the client. The callback functions are optional, and there is some minimal event support. When you’re using a callback, the parameters are typically an error and a result, though in the case of a SELECT query, the callback also has a fields parameter.

Example 11-5 demonstrates how to use node-mysql to connect to the widget database, create a new record, update it, and delete it. This example, as simple as it is, demonstrates all the functionality that node-mysql supports.

Example 11-5. Demonstration of CRUD with node-mysql

var mysql = require('mysql');

var client = mysql.createClient({

user: 'username',

password: 'password'

});

client.query('USE databasenm');

// create

client.query('INSERT INTO nodetest2 ' +

'SET title = ?, text = ?, created = NOW()',

['A seventh item', 'This is a seventh item'], function(err, result) {

if (err) {

console.log(err);

} else {

var id = result.insertId;

console.log(result.insertId);

// update

client.query('UPDATE nodetest2 SET ' +

'title = ? WHERE ID = ?', ['New title', id], function (err, result) {

if (err) {

console.log(err);

} else {

console.log(result.affectedRows);

// delete

client.query('DELETE FROM nodetest2 WHERE id = ?',

[id], function(err, result) {

if(err) {

console.log(err);

} else {

console.log(result.affectedRows);

// named function rather than nested callback

getData();

}

});

}

});

}

});

// retrieve data

function getData() {

client.query('SELECT * FROM nodetest2 ORDER BY id', function(err, result,fields) {

if(err) {

console.log(err);

} else {

console.log(result);

console.log(fields);

}

client.end();

});

}

The query results are what we’d expect: an array of objects, each representing one row from the table. The following is an example of the output, representing the first returned row:

[ { id: 1,

title: 'This was a better title',

text: 'this is a nice text',

created: Mon, 16 Aug 2010 15:00:23 GMT },

... ]

The fields parameter also matches our expectations, though the format can differ from other modules. Rather than an array of objects, what’s returned is an object where each table field is an object property, and its value is an object representing information about the field. I won’t duplicate the entire output, but the following is the information returned for the first field, id:

{ id:

{ length: 53,

received: 53,

number: 2,

type: 4,

catalog: 'def',

db: 'nodetest2',

table: 'nodetest2',

originalTable: 'nodetest2',

name: 'id',

originalName: 'id',

charsetNumber: 63,

fieldLength: 11,

fieldType: 3,

flags: 16899,

decimals: 0 }, ...

The module doesn’t support multiple SQL statements concatenated onto each other, and it doesn’t support transactions. The only way to get a close approximation to transaction support is with mysql-queues, discussed next.

## MySQL Transactions with mysql-queues

The mysql-queues module wraps the node-mysql module and provides support for multiple queries as well as database transaction support. Its use may be a little odd, especially since it provides asynchronous support without seeming to do so.

Typically, to ensure that asynchronous functions have finished, you’d use nested callbacks, named functions, or a module like Async. In Example 11-6, though, mysql-queues controls the flow of execution, ensuring that the SQL statements that are queued—via the use of the *queue*—are finished before the final SELECT is processed. The SQL statements are completed in order: insert, update, and then the final retrieve.

Example 11-6. Using a queue to control the flow of SQL statement execution

var mysql = require('mysql');

var queues = require('mysql-queues');

// connect to database

var client = mysql.createClient({

user: 'username',

password: 'password'

});

client.query('USE databasenm');

//associated queues with query

// using debug

queues(client, true);

// create queue

q = client.createQueue();

// do insert

q.query('INSERT INTO nodetest2 (title, text, created) ' +

'values(?,?,NOW())',

['Title for 8', 'Text for 8']);

// update

q.query('UPDATE nodetest2 SET title = ? WHERE title = ?',

['New Title for 8','Title for 8']);

q.execute();

// select won't work until previous queries finished

client.query('SELECT * FROM nodetest2 ORDER BY ID', function(err, result, fields) {

if (err) {

console.log(err);

} else {

// should show all records, including newest

console.log(result);

client.end();

}

});

If you want transactional support, you’ll need to start a transaction rather than a queue. And you’ll need to use a rollback when an error occurs, as well as a commit when you’re finished with the transaction. Again, once you call execute on the transaction, any queries following the method call are queued until the transaction is finished. Example 11-7 contains the same application as in Example 11-6, but this time using a transaction.

Example 11-7. Using a transaction to provide greater control over SQL updates

var mysql = require('mysql');

var queues = require('mysql-queues');

// connect to database

var client = mysql.createClient({

user: 'username',

password: 'password'

});

client.query('USE databasenm');

//associated queues with query

// using debug

queues(client, true);

// create transaction

var trans = client.startTransaction();

// do insert

trans.query('INSERT INTO nodetest2 (title, text, created) ' +

'values(?,?,NOW())',

['Title for 8', 'Text for 8'], function(err,info) {

if (err) {

trans.rollback();

} else {

console.log(info);

// update

trans.query('UPDATE nodetest2 SET title = ? WHERE title = ?',

['Better Title for 8','Title for 8'], function(err,info) {

if(err) {

trans.rollback();

} else {

console.log(info);

trans.commit();

}

});

}

});

trans.execute();

// select won't work until transaction finished

client.query('SELECT * FROM nodetest2 ORDER BY ID', function(err, result, fields) {

if (err) {

console.log(err);

} else {

// should show all records, including newest

console.log(result);

client.end();

}

});

The mysql-queues adds two important components to the node-mysql module:

- Support for multiple queries without having to use a nested callback
- Transaction support

If you’re going to use node-mysql, I strongly recommend you incorporate the use of mysql-queues.

# ORM Support with Sequelize

The modules in the previous sections provide a database binding for MySQL, but they don’t provide a higher level of abstraction. The Sequelize module does just that with an ORM, though it doesn’t currently support transactions.

## Defining a Model

To use Sequelize, you define the model, which is a mapping between the database table(s) and JavaScript objects. In our previous examples, we worked with a simple table, nodetest2, with the following structure:

id - int(11), primary key, not null

title - varchar(255), unique key, not null

text - text, nulls allowed,

created - datetime, nulls allowed

You create the model for this database table using the appropriate database and flags for each field:

// define model

var Nodetest2 = sequelize.define('nodetest2',

{id : {type: Sequelize.INTEGER, primaryKey: true},

title : {type: Sequelize.STRING, allowNull: false, unique: true},

text : Sequelize.TEXT,

created : Sequelize.DATE

});

The supported data types and their mappings are:

- Sequelize.STRING => VARCHAR(255)
- Sequelize.TEXT => TEXT
- Sequelize.INTEGER => INTEGER
- Sequelize.DATE => DATETIME
- Sequelize.FLOAT => FLOAT
- Sequelize.BOOLEAN => TINYINT(1)

The options you can use to further refine the fields are:

type

Data type of field

allowNull

false to allow nulls; true by default

unique

true to prevent duplicate values; false by default

primaryKey

true to set primary key

autoIncrement

true to automatically increment field

The likelihood is that your application and database are new, so once you define the model, you need to sync it with the database to create the database table:

// sync

Nodetest2.sync().error(function(err) {

console.log(err);

});

When you do so, and examine the table in the database, you’ll find that the table and the model are different because of changes Sequelize makes to the table. For one, it’s now called nodetest2s, and for another, there are two new table fields:

id - int(11), primary key, autoincrement

title - varchar(255), unique key, nulls not allowed

text - text, nulls allowed

created - datetime, nulls allowed

createdAt - datetime, nulls not allowed

updatedAt - datetime, nulls not allowed

These are changes that Sequelize makes, and there’s no way to prevent it from making them. You’ll want to adjust your expectations accordingly. For starters, you’ll want to drop the column created, since you no longer need it. You can do this using Sequelize by deleting the field from the class and then running the sync again:

// define model

var Nodetest2 = sequelize.define('nodetest2',

{id : {type: Sequelize.INTEGER, primaryKey: true},

title : {type: Sequelize.STRING, allowNull: false, unique: true},

text : Sequelize.TEXT,

});

// sync

Nodetest2.sync().error(function(err) {

console.log(err);

});

Now you have a JavaScript object representing the model that also maps to a relational database table. Next, you need to add some data to the table.

## Using CRUD, ORM Style

The differences between using a MySQL database binding and using an ORM continue. You don’t insert a database row when using an ORM; rather, you build a new object instance and save it. The same is true when you update: you don’t update via SQL; you either modify a property directly or you use updateAttributes, passing in an object with the changed properties. You also don’t delete a row from a database; you access an object instance and then destroy it.

To demonstrate how all these work together, Example 11-8 creates the model, syncs with the database (which creates the table if it doesn’t already exist), and then creates a new instance and saves it. After the new instance is created, it’s updated twice. All the objects are retrieved and the contents displayed before the recently added object instance is destroyed.

Example 11-8. CRUD using Sequelize

var Sequelize = require('sequelize');

var sequelize = new Sequelize('databasenm',

'username', 'password',

{ logging: false});

// define model

var Nodetest2 = sequelize.define('nodetest2',

{id : {type: Sequelize.INTEGER, primaryKey: true},

title : {type: Sequelize.STRING, allowNull: false, unique: true},

text : Sequelize.TEXT,

});

// sync

Nodetest2.sync().error(function(err) {

console.log(err);

});

var test = Nodetest2.build(

{ title: 'New object',

text: 'Newest object in the data store'});

// save record

test.save().success(function() {

// first update

Nodetest2.find({where : {title: 'New object'}}).success(function(test) {

test.title = 'New object title';

test.save().error(function(err) {

console.log(err);

});

test.save().success(function() {

// second update

Nodetest2.find(

{where : {title: 'New object title'}}).success(function(test) {

test.updateAttributes(

{title: 'An even better title'}).success(function() {});

test.save().success(function() {

// find all

Nodetest2.findAll().success(function(tests) {

console.log(tests);

// find new object and destroy

Nodetest2.find({ where: {title: 'An even better title'}}).

success(function(test) {

test.destroy().on('success', function(info) {

console.log(info);

});

});

});

});

})

});

});

});

When printing out the results of the findAll, you might be surprised at how much data you’re getting back. Yes, you can access the properties directly from the returned value, first by accessing the array entry, and then accessing the value:

tests[0].id; // returns identifier

But the other data associated with this new object completes the demonstrations showing that you’re not in the world of relational database bindings anymore. Here’s an example of one returned object:

[ { attributes: [ 'id', 'title', 'text', 'createdAt', 'updatedAt' ],

validators: {},

__factory:

{ options: [Object],

name: 'nodetest2',

tableName: 'nodetest2s',

rawAttributes: [Object],

daoFactoryManager: [Object],

associations: {},

validate: {},

autoIncrementField: 'id' },

__options:

{ underscored: false,

hasPrimaryKeys: false,

timestamps: true,

paranoid: false,

instanceMethods: {},

classMethods: {},

validate: {},

freezeTableName: false,

id: 'INTEGER NOT NULL auto_increment PRIMARY KEY',

title: 'VARCHAR(255) NOT NULL UNIQUE',

text: 'TEXT',

createdAt: 'DATETIME NOT NULL',

updatedAt: 'DATETIME NOT NULL' },

id: 14,

title: 'A second object',

text: 'second',

createdAt: Sun, 08 Apr 2012 20:58:54 GMT,

updatedAt: Sun, 08 Apr 2012 20:58:54 GMT,

isNewRecord: false },...

## Adding Several Objects Easily

Sequelize’s asynchronous nature is definitely obvious from Example 10-8. Normally, the issue of nested callbacks won’t be a problem because you won’t be performing so many operations in a row—except if you’re adding several new object instances. In that case, you can run into problems with the nested callbacks.

Luckily, Sequelize provides a simple way of chaining queries so that you can do something such as creating many new object instances and saving them all at once. The module provides a *chainer* helper where you can add EventEmitter tasks (such as a query), one after the other, and they won’t be executed until you call run. Then the results of all operations are returned, either as a success or an error.

Example 11-9 demonstrates the chainer helper by adding three new object instances and then running a findAll on the database when the instances have been successfully saved.

Example 11-9. Using a chainer to simplify adding multiple object instances

var Sequelize = require('sequelize');

var sequelize = new Sequelize('databasenm',

'username', 'password',

{ logging: false});

// define model

var Nodetest2 = sequelize.define('nodetest2',

{id : {type: Sequelize.INTEGER, primaryKey: true},

title : {type: Sequelize.STRING, allowNull: false, unique: true},

text : Sequelize.TEXT,

});

// sync

Nodetest2.sync().error(function(err) {

console.log(err);

});

var chainer = new Sequelize.Utils.QueryChainer;

chainer.add(Nodetest2.create({title: 'A second object',text: 'second'}))

.add(Nodetest2.create({title: 'A third object', text: 'third'}));

chainer.run()

.error(function(errors) {

console.log(errors);

})

.success(function() {

Nodetest2.findAll().success(function(tests) {

console.log(tests);

});

});

This is much simpler, and much easier to read, too. Plus the approach makes it simpler to work with a user interface or an MVC application.

There is much more about Sequelize at the module’s documentation website, including how to deal with associated objects (relations between tables).

## Overcoming Issues Related to Going from Relational to ORM

When working with an ORM, you’ll need to keep in mind that it makes certain assumptions about the data structure. One is that if the model object is named something like Widget, the database table is widgets. Another is an assumption that the table contains information about when a row is added or updated. However, many ORMs also know that both assumptions may not be met by an existing database system being converted from using a straight database binding to using an ORM.

One real issue with Sequelize is that it pluralizes the table names, no matter what you do. So if you define a model for the table, it wants to pluralize the model name for the table name. Even when you provide a table name, Sequelize wants to pluralize it. This isn’t an issue when you don’t have the database table, because a call to sync automatically creates the table. This *is* an issue if you’re using an existing relational database—enough of an issue that I strongly recommend against using the module with anything other than a brand-new application.