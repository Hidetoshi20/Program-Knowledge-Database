# Domain Resolution and URL Processing

The DNS module provides DNS resolution using *c-ares*, a C library that provides asynchronous DNS requests. It’s used by Node with some of its other modules, and can be useful for applications that need to discover domains or IP addresses.

To discover the IP address given a domain, use the dns.lookup method and print out the returned IP address:

```jsx
var dns = require('dns');
dns.lookup('burningbird.net', function (err, ip) {
    if (err) throw err;
    console.log(ip);
});
```

The `dns.reverse` method returns an array of domain names for a given IP address:

```jsx
dns.reverse('173.255.206.103', function (err, domains) {
    domains.forEach(function (domain) {
        console.log(domain);
    });
});
```

The dns.resolve method returns an array of record types by a given type, such as A, MX, NS, and so on. In the following code, I’m looking for the name server domains for my domain name, *burningbird.net*:

```jsx
var dns = require('dns');

dns.resolve('burningbird.net', 'NS', function (err, domains) {
    domains.forEach(function (domain) {
        console.log(domain);
    });
});
```

This returns:

```bash
ns1.linode.com

ns3.linode.com

ns5.linode.com

ns4.linode.com
```

We used the URL module in Example 1-3 in Chapter 1. This simple module provides a way of parsing a URL and returning an object with all of the URL components. Passing in the following URL:

```jsx
var url = require('url');

var urlObj = url.parse('http://examples.burningbird.net:8124/?file=main');
```

returns the following JavaScript object:

```jsx
{ protocol: 'http:',

slashes: true,

host: 'examples.burningbird.net:8124',

port: '8124',

hostname: 'examples.burningbird.net',

href: 'http://examples.burningbird.net:8124/?file=main',

search: '?file=main',

query: 'file=main',

pathname: '/',

path: '/?file=main' }
```

Each of the components can then be discretely accessed like so:

```jsx
var qs = urlObj.query; // get the query string
```

Calling the URL.format method performs the reverse operation:

```jsx
console.log(url.format(urlObj)); // returns original URL
```

The URL module is often used with the Query String module. The latter module is a simple utility module that provides functionality to parse a received query string, or prepare a string for use as a query string.

To chunk out the key/value pairs in the query string, use the querystring.parse method. The following:

```jsx
var vals = querystring.parse('file=main&file=secondary&type=html");
```

results in a JavaScript object that allows for easy access of the individual query string values:

```jsx
{ file: [ 'main', 'secondary' ], type: 'html' }
```

Since file is given twice in the query string, both values are grouped into an array, each of which can be accessed individually:

```java
console.log(vals.file[0]); // returns main
```

You can also convert an object into a query string, using `querystring.stringify`:

```java
var qryString = querystring.stringify(vals)
```