# CHAPTER 5

CHAPTER 5: Node and the Web

console.log('server listening on 8214');

We can also listen for other events, such as when a connection is made ( connect ), or the client requests an upgrade ( upgrade ). The latter occurs when the client asks for an upgrade to the version of HTTP or to a diferent protocol.

H T T P I N N A R D S

For those who want to know a little more about the innards of HTTP, the HTTP.Server class is actually an implementation of the TCP-based

Net.Server , which is covered in Chapter 7. TCP provides the transporta-tion layer, while HTTP provides the application layer.

The callback function used when responding to a web request supports two parameters: request and response. The second parameter, the response , is an object of type http.ServerReponse . It’s a *writable stream with support for* several functions, including response.writeHead() to create the response header, response.write() to write the response data, and response.end() , to end the response.

R E A D A B L E A N D W R I T E A B L E S T R E A M S