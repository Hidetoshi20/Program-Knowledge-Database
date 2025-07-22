# Web Net

### 同源策略

什么是同源策略及其限制内容？

同源策略是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSRF等攻击。所谓同源是指“协议+域名+端口”三者相同，即便两个不同的域名指向同一个ip地址，也非同源。

![](https://www.notion.sonetwork.assets/88627AFA1822F87A9F90B143461BEF84.png)

**同源策略限制内容有：**

- Cookie、LocalStorage、IndexedDB 等存储性内容
- DOM 节点
- AJAX 请求发送后，结果被浏览器拦截了

但是有三个标签是允许跨域加载资源：

```html
<img src='xxx'><link href='xxx'><script src='xxx'>
```

## 跨域

[跨域资源共享 CORS 详解 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2016/04/cors.html)

跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了。

跨域解决方案

- jsonp JSONP只支持GET请求，JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据。
- cors 支持所有类型的HTTP请求，是跨域HTTP请求的根本解决方案
- postMessage
- websocket
- Node中间件代理(两次跨域) 不管是Node中间件代理还是nginx反向代理，主要是通过同源策略对服务器不加限制
- nginx反向代理
- window.name + iframe
- location.hash + iframe
- document.domain + iframe
- 日常工作中，用得比较多的跨域方案是cors和nginx反向代理
1. jsonp
    1. JSONP原理
    利用<script>标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP请求一定需要对方的服务器做支持才可以。
    2. JSONP优缺点
    JSONP优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。
    缺点是仅支持get方法具有局限性, 不安全可能会遭受XSS攻击。
    3. JSONP的实现流程
    声明一个回调函数，其函数名(如show)当做参数值，要传递给跨域请求数据的服务器，函数形参为要获取目标数据(服务器返回的data)。
    创建一个``标签，把那个跨域的API数据接口地址，赋值给script的src,还要在这个地址中向服务器传递该函数名（可以通过问号传参: ?callback=show）。
    服务器接收到请求后，需要进行特殊的处理：把传递进来的函数名和它需要给你的数据拼接成一个字符串,例如：传递进去的函数名是show，它准备好的数据是show('我不爱你')。
    最后服务器把准备的数据通过HTTP协议返回给客户端，客户端再调用执行之前声明的回调函数（show），对返回的数据进行操作。
2. cors
CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。
浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。
服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。
3. postMessage
postMessage是HTML5 XMLHttpRequest Level 2中的API，且是为数不多可以跨域操作的window属性之一，它可用于解决以下方面的问题：
    - 页面和其打开的新窗口的数据传递
    - 多窗口之间消息传递
    - 页面与嵌套的iframe消息传递
    - 上面三个场景的跨域数据传递
    **postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递**
4. websocket
Websocket是HTML5的一个持久化的协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。WebSocket和HTTP都是应用层协议，都基于TCP 协议。但是 **WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据**。
同时，WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关了。
原生WebSocket API使用起来不太方便，我们使用Socket.io，它很好地封装了webSocket接口，提供了更简单、灵活的接口，也对不支持webSocket的浏览器提供了向下兼容
5. Node中间件代理(两次跨域)
实现原理：**同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。** 代理服务器，需要做以下几个步骤：
    - 接受客户端请求 。
    - 将请求转发给服务器。
    - 拿到服务器 响应 数据。
    - 将 响应 转发给客户端。
6. nginx反向代理
实现原理类似于Node中间件代理，需要你搭建一个中转nginx服务器，用于转发请求。
使用nginx反向代理实现跨域，是最简单的跨域方式。只需要修改nginx的配置即可解决跨域问题，支持所有浏览器，支持session，不需要修改任何代码，并且不会影响服务器性能。
实现思路：通过nginx配置一个代理服务器（域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，并且可以顺便修改cookie中domain信息，方便当前域cookie写入，实现跨域登录。
7. window.name + iframe
window.name属性的独特之处：name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。
总结：通过iframe的src属性由外域转向本地域，跨域数据即由iframe的window.name从外域传递到本地域。这个就巧妙地绕过了浏览器的跨域访问限制，但同时它又是安全操作。
8. location.hash + iframe
实现原理： a.html欲与c.html跨域相互通信，通过中间页b.html来实现。 三个页面，不同域之间利用iframe的location.hash传值，相同域之间直接js访问来通信。
具体实现步骤：一开始a.html给c.html传一个hash值，然后c.html收到hash值后，再把hash值传递给b.html，最后b.html将结果放到a.html的hash值中。
同样的，a.html和b.html是同域的，都是[http://localhost:3000](http://localhost:3000/);而c.html是[http://localhost:4000](http://localhost:4000/)
9. document.domain + iframe
**该方式只能用于二级域名相同的情况下，比如a.test.com和b.test.com适用于该方式**。
只需要给页面添加document.domain='test.com'表示二级域名都相同就可以实现跨域。
实现原理：两个页面都通过js强制设置document.domain为基础主域，就实现了同域。

### 有什么方法可以保持前后端实时通信

**参考答案**：

实现保持前后端实时通信的方式有以下几种

- WebSocket： IE10以上才支持，Chrome16, FireFox11,Safari7以及Opera12以上完全支持，移动端形势大
- event-source: IE完全不支持（注意是任何版本都不支持），Edge76，Chrome6,Firefox6,Safari5和Opera以上支持， 移动端形势大好
- AJAX轮询： 用于兼容低版本的浏览器
- 永久帧（ forever iframe）可用于兼容低版本的浏览器
- flash socket 可用于兼容低版本的浏览器

**这几种方式的优缺点**

**1.WebSocket**

- 优点：WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议，可从HTTP升级而来，浏览器和服务器只需要一次握手，就可以进行持续的，双向的数据传输，因此能显著节约资源和带宽
- 缺点：1. 兼容性问题:不支持较低版本的IE浏览器（IE9及以下）2.不支持断线重连，需要手写心跳连接的逻辑 3.通信机制相对复杂

**2. server-sent-event（event-source）**

- 优点：（1）只需一次请求，便可以stream的方式多次传送数据，节约资源和带宽 （2）相对WebSocket来说简单易用 （3）内置断线重连功能( retry)
- 缺点： （1）是单向的，只支持服务端->客户端的数据传送，客户端到服务端的通信仍然依靠AJAX，没有”一家人整整齐齐“的感觉（2）兼容性令人担忧，IE浏览器完全不支持

**3. AJAX轮询**

- 优点：兼容性良好，对标低版本IE
- 缺点：请求中有大半是无用的请求，浪费资源

**4.Flash Socket**

- 缺点：（1）浏览器开启时flash需要用户确认，（2）加载时间长，用户体验较差 （3）大多数移动端浏览器不支持flash，为重灾区
- 优点： 兼容低版本浏览器

**5. 永久帧（ forever iframe）**

- 缺点： iframe会产生进度条一直存在的问题，用户体验差
- 优点：兼容低版本IE浏览器

**综上，综合兼容性和用户体验的问题，我在项目中选用了WebSocket ->server-sent-event -> AJAX轮询这三种方式做从上到下的兼容**

### ajax原理，为什么要用ajax？

**参考答案**：

**为什么要用ajax：**

Ajax是一种异步请求数据的web开发技术，对于改善用户的体验和页面性能很有帮助。简单地说，在不需要重新刷新页面的情况下，Ajax 通过异步请求加载后台数据，并在网页上呈现出来。常见运用场景有表单验证是否登入成功、百度搜索下拉框提示和快递单号查询等等。 **Ajax的目的是提高用户体验，较少网络数据的传输量。**同时，由于AJAX请求获取的是数据而不是HTML文档，因此它也节省了网络带宽，让互联网用户的网络冲浪体验变得更加顺畅

**ajax原理：**

Ajax的工作原理相当于在用户和服务器之间加了—个中间层(AJAX引擎) ,使用户操作与服务器响应异步化。并不是所有的用户请求都提交给服务器,像—些数据验证和数据处理等都交给Ajax引擎自己来做, 只有确定需要从服务器读取新数据时再由Ajax引擎代为向服务器提交请求。Ajax其核心有JavaScript、XMLHTTPRequest、DOM对象组成，通过XmlHttpRequest对象来向服务器发异步请求，从服务器获得数据，然后用JavaScript来操作DOM而更新页面

### FTP DNS 基于什么协议

DNS (Domain Name Service 域名服务) 协议基于 UDP协议

FTP (File Transfer Protocol 文件传输协议) 基于 TCP协议

DNS和FTP都是应用层协议

### 代码题：url GET参数写代码获取

**参考答案**：

方法一：采用正则表达式获取地址栏参数 (代码简洁，重点正则）

```jsx
function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");// 正则语句
    let r = window.location.search.substr(1).match(reg);// 获取url的参数部分，用正则匹配
    if (r != null) {
        return decodeURIComponent(r[2]); // 解码得到的参数
    }
    ;
    return null;
}
```

方法二：split拆分法 (代码较复杂，较易理解)

```jsx
function GetRequest() {
    const url = location.search; //获取url中"?"符后的字串
    let theRequest = new Object();
    if (url.indexOf("?") != -1) { // 判断是否是正确的参数部分
        let str = url.substr(1); // 截取参数部分
        strs = str.split("&");  // 以‘&’为分割符获取参数数组
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
```

方法三：split拆分法(易于理解，代码中规)

```jsx
function getQueryVariable(variable) {
    let query = window.location.search.substring(1); // 获取url的参数部分
    let vars = query.split("&"); // 以‘&’为分割符获取参数数组
    for (let i = 0; i < vars.length; i++) { // 遍历数组获取参数
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}
```

### 301和302的含义

**参考答案**：

301和302都是重定向的状态码，重定向（Redirect）是指通过各种方法将客户端的网络请求重新定义或指定一个新方向转到其他位置（重定向包括网页重定向、域名重定向）。

301 redirect: 301 代表永久性转移(Permanently Moved)

302 redirect: 302 代表暂时性转移(Temporarily Moved )

**相同点：**都表示重定向，就是说浏览器在拿到服务器返回的这个状态码后会自动跳转到一个新的URL地址，这个地址可以从响应的Location首部中获取（用户看到的效果就是他输入的地址A瞬间变成了另一个地址B）

**不同点：**

1. 301表示旧地址A的资源已经被永久地移除了（这个资源不可访问了），搜索引擎在抓取新内容的同时也将旧的网址交换为重定向之后的网址；
    
    302表示旧地址A的资源还在（仍然可以访问），这个重定向只是临时地从旧地址A跳转到地址B，搜索引擎会抓取新的内容而保存旧的网址。
    
2. 302会出现“网址劫持”现象，从A网址302重定向到B网址，由于部分搜索引擎无法总是抓取到目标网址，或者B网址对用户展示不够友好，因此浏览器会仍旧显示A网址，但是所用的网页内容却是B网址上的内容。

**应用场景**

301：域名需要切换、协议从http变成https；

302：未登录时访问已登录页时跳转到登录页面、404后跳转首页

### 手写jsonp

**参考答案**：

实现步骤：

1. 创建script元素，设置src属性，并插入文档中，同时触发AJAX请求。
2. 返回Promise对象，then函数才行继续，回调函数中进行数据处理
3. script元素删除清理

```html
<!DOCTYPE html><html lang="en"><head>    <meta charset="UTF-8">    <meta name="viewport" content="width=device-width, initial-scale=1.0">    <meta http-equiv="X-UA-Compatible" content="ie=edge">    <title>Document</title></head><body><script>    /**     * 手写jsonp并返回Promise对象     * 参数url，data:json对象，callback函数     */    function jsonp(url, data = {}, callback = 'callback') {        // 处理json对象，拼接url        data.callback = callback        let params = []        for (let key in data) {            params.push(key + '=' + data[key])        }        console.log(params.join('&'))        // 创建script元素        let script = document.createElement('script')        script.src = url + '?' + params.join('&')        document.body.appendChild(script)        // 返回promise        return new Promise((resolve, reject) => {            window[callback] = (data) => {                try {                    resolve(data)                } catch (e) {                    reject(e)                } finally {                    // 移除script元素                    script.parentNode.removeChild(script)                    console.log(script)                }            }        })    }    jsonp('http://photo.sina.cn/aj/index', {        page: 1,        cate: 'recommend'    }, 'jsoncallback').then(data => {        console.log(data)    })</script></body></html>
```

### DNS是什么

**参考答案**：

DNS（Domain Name Server，域名服务器）是进行域名(domain name)和与之相对应的IP地址 (IP address) 转换的服务器。DNS中保存了一张域名(domain name)和与之相对应的IP地址 (IP address)的表，以解析消息的域名。 域名是Internet上某一台计算机或计算机组的名称，用于在数据传输时标识计算机的电子方位（有时也指地理位置）。域名是由一串用点分隔的名字组成的，通常包含组织名，而且始终包括两到三个字母的后缀，以指明组织的类型或该域所在的国家或地区。

### ajax的封装

**参考答案**：

```jsx
/* * ajax * type === GET: data格式 name=baukh&age=29 * type === POST: data格式 { name: 'baukh', age:29 } * 与 jquery 不同的是,[success, error, complete]返回的第二个参数, 并不是返回错误信息, 而是错误码 * */var extend = require('./extend');var utilities = require('./utilities');function ajax(options) {    var defaults = {        url: null,// 请求地址        type: 'GET',// 请求类型        data: null,// 传递数据        headers: {},// 请求头信息        async: true,// 是否异步执行        beforeSend: utilities.noop,// 请求发送前执行事件        complete: utilities.noop,// 请求发送后执行事件        success: utilities.noop,// 请求成功后执行事件        error: utilities.noop// 请求失败后执行事件    };    options = extend(defaults, options);    if (!options.url) {        utilities.error('jTool ajax: url不能为空');        return;    }    var xhr = new XMLHttpRequest();    var formData = '';    if (utilities.type(options.data) === 'object') {        utilities.each(options.data, function (key, value) {            if (formData !== '') {                formData += '&';            }            formData += key + '=' + value;        });    } else {        formData = options.data;    }    if (options.type === 'GET' && formData) {        options.url = options.url + (options.url.indexOf('?') === -1 ? '?' : '&') + formData;        formData = null;    }    xhr.open(options.type, options.url, options.async);    for (var key in options.headers) {        xhr.setRequestHeader(key, options.headers[key]);    }    // xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");    // 执行发送前事件    options.beforeSend(xhr);    // 监听onload并执行完成事件    xhr.onload = function () {        // jquery complete(XHR, TS)        options.complete(xhr, xhr.status);    };    // 监听onreadystatechange并执行成功失败事件    xhr.onreadystatechange = function () {        if (xhr.readyState !== 4) {            return;        }        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {            // jquery success(XHR, TS)            options.success(xhr.response, xhr.status);        } else {            // jquery error(XHR, TS, statusText)            options.error(xhr, xhr.status, xhr.statusText);        }    };    xhr.send(formData);}function post(url, data, callback) {    ajax({url: url, type: 'POST', data: data, success: callback});}function get(url, data, callback) {    ajax({url: url, type: 'GET', data: data, success: callback});}module.exports = {    ajax: ajax,    post: post,    get: get};
```

### keep-alive

**什么是KeepAlive**

- KeepAlive可以简单理解为一种状态保持或重用机制，比如当一条连接建立后，我们不想它立刻被关闭，如果实现了KeepAlive机制，就可以通过它来实现连接的保持
- HTTP的KeepAlive在HTTP 1.0版本默认是关闭的，但在HTTP1.1是默认开启的；操作系统里TCP的KeepAlive默认也是关闭，但一般应用都会修改设置来开启。因此网上TCP流量中基于KeepAlive的是主流
- HTTP的KeepAlive和TCP的KeepAlive有一定的依赖关系，名称又一样，因此经常被混淆，但其实是不同的东西，下面具体分析一下

**TCP为什么要做KeepAlive**

- 我们都知道TCP的三次握手和四次挥手。当两端通过三次握手建立TCP连接后，就可以传输数据了，数据传输完毕，连接并不会自动关闭，而是一直保持。只有两端分别通过发送各自的FIN报文时，才会关闭自己侧的连接。
- 

这个关闭机制看起来简单明了，但实际网络环境千变万化，衍生出了各种问题。假设因为实现缺陷、突然崩溃、恶意攻击或网络丢包等原因，一方一直没有发送FIN报文，则连接会一直保持并消耗着资源，为了防止这种情况，一般接收方都会主动中断一段时间没有数据传输的TCP连接，比如LVS会默认中断90秒内没有数据传输的TCP连接，F5会中断5分钟内没有数据传输的TCP连接

- 但有的时候我们的确不希望中断空闲的TCP连接，因为建立一次TCP连接需要经过一到两次的网络交互，且由于TCP的slow start机制，新的TCP连接开始数据传输速度是比较慢的，我们希望通过连接池模式，保持一部分空闲连接，当需要传输数据时，可以从连接池中直接拿一个空闲的TCP连接来全速使用，这样对性能有很大提升
    - 

为了支持这种情况，TCP实现了KeepAlive机制。KeepAlive机制并不是TCP规范的一部分，但无论Linux和Windows都实现实现了该机制。TCP实现里KeepAlive默认都是关闭的，且是每个连接单独设置的，而不是全局设置

- 另外有一个特殊情况就是，当某应用进程关闭后，如果还有该进程相关的TCP连接，一般来说操作系统会自动关闭这些连接

### 504 如何排查

排查步骤：

1. 检查500/502/504错误截图，判断是负载均衡问题，高防/安全网络配置问题，还是后端ECS配置问题。
2. 如果有高防/安全网络，请确认高防/安全网络的七层转发配置正确。
3. 请确认是所有客户端都有问题，还仅仅是部分客户端有问题。如果仅仅是部分客户端问题，排查该客户端是否被云盾阻挡，或者负载均衡域名或者IP是否被ISP运营商拦截。
4. 检查负载均衡状态，是否有后端ECS健康检查失败的情况，如果有健康检查失败，解决健康检查失败问题。
5. 在客户端用hosts文件将负载均衡的服务地址绑定到后端服务器的IP地址上，确认是否是后端问题。如果5XX错误间断发生，很可能是后端某一台ECS服务器的配置问题。
6. 尝试将七层负载均衡切换为四层负载均衡，查看问题是否会复现。
7. 检查后端ECS服务器是否存在CPU、内存、磁盘或网络等性能瓶颈。
8. 如果确认是后端服务器问题，请检查后端ECS Web服务器日志是否有相关错误，Web服务是否正常运行，确认Web访问逻辑是否有问题，卸载服务器上杀毒软件重启测试。
9. 检查后端ECS Linux操作系统的TCP内核参数是否配置正确。

### CDN

CDN的全称是Content Delivery Network，即内容分发网络。其目的是通过在现有的internet中增加一层新的网络架构，将网站的内容发布到最接近用户的网络边缘，使用户可以就近取得所需的内容，提高用户访问网站的响应速度。CDN有别于镜像，因为它比镜像更智能，或者可以做这样一个比喻：CDN=更智能的镜像+缓存+流量导流。因而，CDN可以明显提高Internet网络中信息流动的效率。从技术上全面解决由于网络带宽小、用户访问量大、网点分布不均等问题，提高用户访问网站的响应速度。

### xhr 的 readyState

readyState是XMLHttpRequest对象的一个属性，用来标识当前XMLHttpRequest对象处于什么状态。 readyState总共有5个状态值，分别为0~4，每个值代表了不同的含义

0：初始化，XMLHttpRequest对象还没有完成初始化

1：载入，XMLHttpRequest对象开始发送请求

2：载入完成，XMLHttpRequest对象的请求发送完成

3：解析，XMLHttpRequest对象开始读取服务器的响应

4：完成，XMLHttpRequest对象读取服务器响应结束

### axios的拦截器原理及应用

**应用场景** 请求拦截器用于在接口请求之前做的处理，比如为每个请求带上相应的参数（token，时间戳等）。 返回拦截器用于在接口返回之后做的处理，比如对返回的状态进行判断（token是否过期）。

**拦截器的使用**

1. 在src目录下建立api文件夹
2. 文件夹内建立axios.js文件，进行接口请求的初始化配置

```jsx
import axios from 'axios'let instance = axios.create({    baseURL: "http://localhost:3000/",    headers: {        'content-type': 'application/x-www-form-urlencoded'    }})//请求拦截器instance.interceptors.request.use(config => { //拦截请求，做统一处理    const token = "asdasdk"    //在每个http header都加上token    config.headers.authorization = token    return config}, err => {//失败    return Promise.reject(err)})//响应拦截器instance.interceptors.response.use(response => { //拦截响应，做统一处理    if (response.data.code) {        switch (response.data.code) {            case 200:                console.log("1111")        }    }    return response}, err => { //无响应时的处理    return Promise.reject(err.response.status)})export default instance
```

1. 在main.js中引入，并将其绑定到Vue原型上，设为全局，不用在每个页面重新引入

```jsx
import instance from './api/axios'Vue.prototype.$http = instance
```

1. 页面使用

```jsx
this.$http.get(url).then(r => console.log(r)).catch(err => console.log(err))this.$http.post(url, params).then(r => console.log(r)).catch(err => console.log(err))
```

1. 效果展示

![](https://www.notion.sonetwork.assets/CAD9EA967F38DB13BA9984F4AB361C7E.png)

img

![](https://www.notion.sonetwork.assets/63239D898A338729A31C955FE621CEEA.png)

img

**axios拦截器实现原理剖析**

axios接口请求内部流程

![](https://www.notion.sonetwork.assets/7C9547F4341B5DB91EA54F181ABDF082.png)

```jsx
function Axios() {    this.interceptors = {        //两个拦截器        request: new interceptorsManner(),        response: new interceptorsManner()    }}//真正的请求Axios.prototype.request = function () {    let chain = [dispatchRequest, undefined];//这儿的undefined是为了补位，因为拦截器的返回有两个    let promise = Promise.resolve();    //将两个拦截器中的回调加入到chain数组中    this.interceptors.request.handler.forEach((interceptor) => {        chain.unshift(interceptor.fulfilled, interceptor.rejected);    })    this.interceptors.response.handler.forEach((interceptor) => {        chain.push(interceptor.fulfilled, interceptor.rejected);    })    while (chain.length) {        //promise.then的链式调用，下一个then中的chain为上一个中的返回值，每次会减去两个        //这样就实现了在请求的时候，先去调用请求拦截器的内容，再去请求接口，返回之后再去执行响应拦截器的内容        promise = promise.then(chain.shift(), chain.shift());    }}function interceptorsManner() {    this.handler = [];}interceptorsManner.prototype.use = function (fulfilled, rejected) {    //将成功与失败的回调push到handler中    this.handler.push({        fulfilled: fulfilled,        rejected: rejected    })}//类似方法批量注册,实现多种请求util.forEach(["get", "post", "delete"], (methods) => {    Axios.prototype[methods] = function (url, config) {        return this.request(util.merge(config || {}, {//合并            method: methods,            url: url        }))    }})
```

### SSL 连接断开后如何恢复？

**Session ID**

每一次的会话都有一个编号，当对话中断后，下一次重新连接时，只要客户端给出这个编号，服务器如果有这个编号的记录，那么双方就可以继续使用以前的密钥，而不用重新生成一把。

**Session Ticket**

session ticket 是服务器在上一次对话中发送给客户的，这个 ticket 是加密的，只有服务器可能够解密，里面包含了本次会话的信息，比如对话密钥和加密方法等。这样不管我们的请求是否转移到其他的服务器上，当服务器将 ticket 解密以后，就能够获取上次对话的信息，就不用重新生成对话秘钥了。

### 同域请求的并发数限制的原因

浏览器的并发请求数目限制是针对同一域名的，同一时间针对同一域名下的请求有一定数量限制，超过限制数目的请求会被阻塞（chorme和firefox的限制请求数都是6个）。

限制其数量的原因是：基于浏览器端口的限制和线程切换开销的考虑，浏览器为了保护自己不可能无限量的并发请求，如果一次性将所有请求发送到服务器，也会造成服务器的负载上升。

### cdn加速原理

1. 当用户点击网站页面上的url时，经过本地dns系统解析，dns系统会将域名的解析权给交cname指向的cdn专用dns服务器。
2. cdn的dns服务器将cdn的全局负载均衡设备ip地址返回给用户。
3. 用户向cdn的全局负载均衡设备发起内容url访问请求。
4. cdn全局负载均衡设备根据用户ip，以及用户请求的内容url，选择一台用户所属区域的区域负载均衡设备
5. 

区域负载均衡设备会为用户选择一台合适的缓存服务器提供服务，选择的依据包括：根据用户IP地址，判断哪一台服务器距用户最近；根据用户所请求的URL中携带的内容名称，判断哪一台服务器上有用户所需内容；查询各个服务器当前的负载情况，判断哪一台服务器尚有服务能力。基于以上这些条件的综合分析之后，区域负载均衡设备会向全局负载均衡设备返回一台缓存服务器的IP地址全局负载均衡设备把服务器的IP地址返回给用户。

1. 用户向缓存服务器发起请求，缓存服务器响应用户请求，将用户所需内容传送到用户终端。如果这台缓存服务器上没有用户想要的内容，而区域均衡设备依然将它分配给了用户，那么这台服务器 就要向它的上一级缓存服务器发起请求内容，直至追溯到网站的源服务器将内容拉回给用户。

### 创建ajax过程

1. 创建XMLHttpRequest对象,也就是创建一个异步调用对象.
2. 创建一个新的HTTP请求,并指定该HTTP请求的方法、URL及验证信息.
3. 设置响应HTTP请求状态变化的函数.
4. 发送HTTP请求.
5. 获取异步调用返回的数据.
6. 使用JavaScript和DOM实现局部刷新.

### fetch 请求方式

**fetch**

Fetch API 是近年来被提及将要取代XHR的技术新标准，是一个 HTML5 的 API。 Fetch 并不是XHR的升级版本，而是从一个全新的角度来思考的一种设计。Fetch 是基于 Promise 语法结构，而且它的设计足够低阶，这表示它可以在实际需求中进行更多的弹性设计。对于**XHR**所提供的能力来说，Fetch 已经足够取代XHR，并且提供了更多拓展的可能性。

**基本用法**

```jsx
// 获取 some.json 资源fetch('some.json')    .then(function (response) {        return response.json();    })    .then(function (data) {        console.log('data', data);    })    .catch(function (error) {        console.log('Fetch Error: ', error);    });// 采用ES2016的 async/await 语法async function () {    try {        const response = await fetch('some.json');        const data = response.json();        console.log('data', data);    } catch (error) {        console.log('Fetch Error: ', error)    }}
```

**fetch.Post请求**

```jsx
fetch('https://www.api.com/api/xxx', {    method: 'POST',    headers: {        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'    },    body: 'a=1&b=2',}).then(resp => resp.json()).then(resp => {    console.log(resp)});
```

**fetch.Get请求**

```jsx
fetch('https://www.api.com/api/xxx?location=北京&key=bc08513d63c749aab3761f77d74fe820', {    method: 'GET'}) // 返回一个Promise对象    .then((res) => {        return res.json();    })    .then((res) => {        console.log(res) // res是最终的结果    })
```

**fetch请求网页**

```jsx
fetch('https://www.api.com/api/xxx')    .then(response => response.text())    .then(data => console.log(data));
```

**自定义header**

```jsx
var headers = new Headers({    "Content-Type": "text/plain",    "X-Custom-Header": "aaabbbccc",});var formData = new FormData();formData.append('name', 'lxa');formData.append('file', someFile);var config = {    credentials: 'include', // 支持cookie    headers: headers, // 自定义头部    method: 'POST', // post方式请求    body: formData // post请求携带的内容};fetch('https://www.api.com/api/xxx', config)    .then(response => response.json())    .then(data => console.log(data));// 或者这样添加头部var content = "Hello World";var myHeaders = new Headers();myHeaders.append("Content-Type", "text/plain");myHeaders.append("Content-Length", content.length.toString());myHeaders.append("X-Custom-Header", "ProcessThisImmediately");
```

**fetch其他参数**

- method: 请求的方法，例如：GET,POST。
- headers: 请求头部信息，可以是一个简单的对象，也可以是 Headers 类实例化的一个对象。
- body: 需要发送的信息内容，可以是Blob,BufferSource,FormData,URLSearchParams或者USVString。注意，GET,HEAD方法不能包含body。
- mode: 请求模式，分别有cors,no-cors,same-origin,navigate这几个可选值。
    - cors: 允许跨域，要求响应中Acess-Control-Allow-Origin这样的头部表示允许跨域。
    - no-cors: 只允许使用HEAD,GET,POST方法。
    - same-origin: 只允许同源请求，否则直接报错。
    - navigate: 支持页面导航。
- credentials: 表示是否发送cookie，有三个选项
    - omit: 不发送cookie。
    - same-origin: 仅在同源时发送cookie。
    - include: 发送cookie。
- cache: 表示处理缓存的策略。
- redirect: 表示发生重定向时，有三个选项
    - follow: 跟随。
    - error: 发生错误。
    - manual: 需要用户手动跟随。
- integrity: 包含一个用于验证资资源完整性的字符串
    
    ```jsx
    var URL = 'https://www.api.com/api/xxx';// 实例化 Headersvar headers = new Headers({    "Content-Type": "text/plain",    "Content-Length": content.length.toString(),    "X-Custom-Header": "ProcessThisImmediately",});var getReq = new Request(URL, {method: 'GET', headers: headers});fetch(getReq).then(function (response) {    return response.json();}).catch(function (error) {    console.log('Fetch Error: ', error);});
    ```