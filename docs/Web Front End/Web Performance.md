# Web Performance

1. 性能优化怎么做的（结合资源和代码压缩优化、图片/路由/组件懒加载或者分包、CDN、SSR，HTTP2、浏览器加载和渲染、动画体验等）
2. CDN原理？CDN优化时如何判断该将哪些包分离
3. 前端性能衡量指标

# 前端性能优化手段

前端性能优化手段从以下几个方面入手：加载优化、执行优化、渲染优化、样式优化、脚本优化

- 加载优化：减少HTTP请求、缓存资源、压缩代码、无阻塞、首屏加载、按需加载、预加载、压缩图像、减少Cookie、避免重定向、异步加载第三方资源
- 执行优化：CSS写在头部，JS写在尾部并异步、避免img、iframe等的src为空、尽量避免重置图像大小、图像尽量避免使用DataURL
- 渲染优化：设置viewport、减少DOM节点、优化动画、优化高频事件、GPU加速
- 样式优化：避免在HTML中书写style、避免CSS表达式、移除CSS空规则、正确使用display：display、不滥用float等
- 脚本优化：减少重绘和回流、缓存DOM选择与计算、缓存.length的值、尽量使用事件代理、尽量使用id选择器、touch事件优化

### 加载优化

- 减少HTTP请求：尽量减少页面的请求数(首次加载同时请求数不能超过4个)，移动设备浏览器同时响应请求为4个请求( Android支持4个，iOS5+支持6个)
    - 合并CSS和JS
    - 使用CSS精灵图
- 缓存资源：使用缓存可减少向服务器的请求数，节省加载时间，所有静态资源都要在服务器端设置缓存，并且尽量使用长缓存( 使用时间戳更新缓存)
    - 缓存一切可缓存的资源
    - 使用长缓存
    - 使用外联的样式和脚本
- 压缩代码：减少资源大小可加快网页显示速度，对代码进行压缩，并在服务器端设置GZip
    - 压缩代码(多余的缩进、空格和换行符)
    - 启用Gzip
- 无阻塞：头部内联的样式和脚本会阻塞页面的渲染，样式放在头部并使用link方式引入，脚本放在尾部并使用异步方式加载
- 首屏加载：首屏快速显示可大大提升用户对页面速度的感知，应尽量针对首屏的快速显示做优化
- 按需加载：将不影响首屏的资源和当前屏幕不用的资源放到用户需要时才加载，可大大提升显示速度和降低总体流量( 按需加载会导致大量重绘，影响渲染性能)
    - 懒加载
    - 滚屏加载
    - Media Query加载
- 预加载：大型资源页面可使用Loading，资源加载完成后再显示页面，但加载时间过长，会造成用户流失
    - 可感知Loading：进入页面时Loading
    - 不可感知Loading：提前加载下一页
- 压缩图像：使用图像时选择最合适的格式和大小，然后使用工具压缩，同时在代码中用srcset来按需显示(过度压缩图像大小影响图像显示效果)
    - 使用[TinyJpg](https://tinyjpg.com/)和[TinyPng](https://tinypng.com/)压缩图像
    - 使用CSS3、SVG、IconFont代替图像
    - 使用img的srcset按需加载图像
    - 选择合适的图像：webp优于jpg，png8优于gif
    - 选择合适的大小：首次加载不大于1014kb、不宽于640px
    - PS切图时D端图像保存质量为80，M端图像保存质量为60
- 减少Cookie：Cookie会影响加载速度，静态资源域名不使用Cookie
- 避免重定向：重定向会影响加载速度，在服务器正确设置避免重定向
- 异步加载第三方资源：第三方资源不可控会影响页面的加载和显示，要异步加载第三方资源

### 执行优化

- CSS写在头部，JS写在尾部并异步
- 避免img、iframe等的src为空：空src会重新加载当前页面，影响速度和效率
- 尽量避免重置图像大小：多次重置图像大小会引发图像的多次重绘，影响性能
- 图像尽量避免使用DataURL：DataURL图像没有使用图像的压缩算法，文件会变大，并且要解码后再渲染，加载慢耗时长

### 渲染优化

- 设置viewport：HTML的viewport可加速页面的渲染
    
    ```
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1">
    ```
    
- 减少DOM节点：DOM节点太多影响页面的渲染，尽量减少DOM节点
- 优化动画
    - 尽量使用CSS3动画
    - 合理使用requestAnimationFrame动画代替setTimeout
    - 适当使用Canvas动画：5个元素以内使用CSS动画，5个元素以上使用Canvas动画，iOS8+可使用WebGL动画
- 优化高频事件：scroll、touchmove等事件可导致多次渲染
    - 函数节流
    - 函数防抖
    - 使用requestAnimationFrame监听帧变化：使得在正确的时间进行渲染
    - 增加响应变化的时间间隔：减少重绘次数
- GPU加速：使用某些HTML5标签和CSS3属性会触发GPU渲染，请合理使用(过渡使用会引发手机耗电量增加)
    - HTML标签：video、canvas、webgl
    - CSS属性：opacity、transform、transition

### 样式优化

- 避免在HTML中书写style
- 避免CSS表达式：CSS表达式的执行需跳出CSS树的渲染
- 移除CSS空规则：CSS空规则增加了css文件的大小，影响CSS树的执行
- 正确使用display：display会影响页面的渲染
    - display:inline后不应该再使用float、margin、padding、width和height
    - display:inline-block后不应该再使用float
    - display:block后不应该再使用vertical-align
    - display:table-后不应该再使用float和margin
- 不滥用float：float在渲染时计算量比较大，尽量减少使用
- 不滥用Web字体：Web字体需要下载、解析、重绘当前页面，尽量减少使用
- 不声明过多的font-size：过多的font-size影响CSS树的效率
- 值为0时不需要任何单位：为了浏览器的兼容性和性能，值为0时不要带单位
- 标准化各种浏览器前缀
    - 无前缀属性应放在最后
    - CSS动画属性只用-webkit-、无前缀两种
    - 其它前缀为-webkit-、-moz-、-ms-、无前缀四种：Opera改用blink内核，-o-已淘汰
- 避免让选择符看起来像正则表达式：高级选择符执行耗时长且不易读懂，避免使用

### 脚本优化

- 减少重绘和回流
    - 避免不必要的DOM操作
    - 避免使用document.write
    - 减少drawImage
    - 尽量改变class而不是style，使用classList代替className
- 缓存DOM选择与计算：每次DOM选择都要计算和缓存
- 缓存.length的值：每次.length计算用一个变量保存值
- 尽量使用事件代理：避免批量绑定事件
- 尽量使用id选择器：id选择器选择元素是最快的
- touch事件优化：使用tap(touchstart和touchend)代替click(注意touch响应过快，易引发误操作)

常用规则

> 雅虎军规
> 
- 内容
    - Make Fewer HTTP Requests：减少HTTP请求数
    - Reduce DNS Lookups：减少DNS查询
    - Avoid Redirects：避免重定向
    - Make Ajax Cacheable：缓存AJAX请求
    - Postload Components：延迟加载资源
    - Preload Components：预加载资源
    - Reduce The Number Of DOM Elements：减少DOM元素数量
    - Split Components Across Domains：跨域拆分资源
    - Minimize The Number Of Iframes：减少iframe数量
    - No 404s：消除404错误
- 样式
    - Put Stylesheets At The Top：置顶样式
    - Avoid CSS Expressions：避免CSS表达式
    - Choose Over @import：选择``代替@import
    - Avoid Filters：避免滤镜
- 脚本
    - Put Scripts At The Bottom：置底脚本
    - Make JavaScript And CSS External：使用外部JS和CSS
    - Minify JavaScript And CSS：压缩JS和CSS
    - Remove Duplicate Scripts：删除重复脚本
    - Minimize DOM Access：减少DOM操作
    - Develop Smart Event Handlers：开发高效的事件处理
- 图像
    - Optimize Images：优化图片
    - Optimize CSS Sprites：优化CSS精灵图
    - Don’t Scale Images In HTML：不在HTML中缩放图片
    - Make Favicon.ico Small And Cacheable：使用小体积可缓存的favicon
- 缓存
    - Reduce Cookie Size：减少Cookie大小
    - Use Cookie-Free Domains For Components：使用无Cookie域名的资源
- 移动端
    - Keep Components Under 25kb：保持资源小于25kb
    - Pack Components Into A Multipart Document：打包资源到多部分文档中
- 服务器
    - Use A Content Delivery Network：使用CDN
    - Add An Expires Or A Cache-Control Header：响应头添加Expires或Cache-Control
    - Gzip Components：Gzip资源
    - Configure ETags：配置ETags
    - Flush The Buffer Early：尽早输出缓冲
    - Use Get For AJAX Requests：AJAX请求时使用get
    - Avoid Empty Image Src：避免图片空链接

> 2-5-8原则
> 

在前端开发中，此规则作为一种开发指导思路，针对浏览器页面的性能优化。

- 用户在2秒内得到响应，会感觉页面的响应速度很快 Fast
- 用户在2~5秒间得到响应，会感觉页面的响应速度还行 Medium
- 用户在5~8秒间得到响应，会感觉页面的响应速度很慢，但还可以接受 Slow
- 用户在8秒后仍然无法得到响应，会感觉页面的响应速度垃圾死了

# 一个官网怎么优化，有哪些性能指标，如何量化

对首屏加载速度影响最大的还是资源大小，请求数量，请求速度等。代码方面，前端一般很难写出严重影响速度的代码。减小资源大小，可以用各种压缩，懒加载，预加载，异步加载等方法。减少请求数量可以使用雪碧图，搭建node中台将多个请求合并成一个等。对于官网这种项目，最好使用服务端渲染，首屏快之外，也有利于SEO。

检测方案：

使用lighthouse进行性能检测，并对lighthouse提出的建议进行优化

具体优化方案：

通过静态化、图片懒加载、图片压缩、异步加载（js和css）、优化代码等方式，以下是具体方法

### 静态化

服务端渲染，“直出”页面，具有较好的SEO和首屏加载速度。主要还有以下的优点：

- 使用jsp模板语法（百度后发现是用Velocity模板语法）渲染页面，减少了js文件体积
- 减少了请求数量
- 因为不用等待大量接口返回，加快了首屏时间

可以尝试Vue的服务端渲染。首页目前有部分是用接口读取数据，然后用jq进行渲染，性能上应该不如Virtual DOM，不过内容不多。

### 图片懒加载

这是一个很重要的优化项。因为官网上有很多图片，而且编辑们上传文章图片的时候一般没有压缩，但是很多图片的体积都很大。还有一个轮播图，20张图标，最小的几十K，最大的两百多K。对于图片来源不可控的页面，懒加载是个很实用的操作，直接将首屏加载的资源大小加少了十几M。

### 图片压缩

对于来源可控，小图标等图片可以用雪碧图，base64等方法进行优化。目前只是用工具压缩了图片大小，后续可以考虑在webpack打包的时候生成雪碧图。

### 异步加载js

通过标签引入的js文件，可以设置defer，async属性让其异步加载，而不会阻塞渲染。defer和async的区别在于async加载完就立即执行，没有考虑依赖，标签顺序等。而defer加载完后会等它前面引入的文件执行完再执行。一般defer用的比较多，async只能用在那些跟别的文件没有联系的孤儿脚本上。

### 异步加载css

没想到css也能异步加载，但这是lighthouse给出的建议。找了一下发现有以下两种方法： 一是通过js脚本在文档中插入标签 二是通过``的media属性 media属性是媒体查询用的，用于在不同情况下加载不同的css。这里是将其设置为一个不适配当前浏览器环境的值，甚至是不能识别的值，浏览器会认为这个样式文件优先级低，会在不阻塞的情况加载。加载完成后再将media` 设置为正常值，让浏览器解析css。

```xml
<link rel="stylesheet" href="//example.css" media="none" onload="this.media='all'">
```

这里用的是第二种方法。但是webpack注入到html中的外链css还没找到异步加载的方法。

preconnent

lighthouse建议对于接下来会访问的地址可以提前建立连接。一般有一下几种方式。

dns-prefetch 域名预解析

```xml
<link rel="dns-prefetch" href="//example.com">
```

preconnet 预连接

```xml
<link rel="preconnect" href="//example.com">    <link rel="preconnect" href="//cdn.example.com" crossorigin>
```

prefetch 预加载

```csharp
<link rel="prefetch" href="//example.com/next-page.html" as="html" crossorigin="use-credentials"><link rel="prefetch" href="library.js" as="script">
```

prerender 预渲染

```xml
<link rel="prerender" href="//example.com/next-page.html">
```

这四种层层递进，但是不要连接不需要的资源，反而损耗性能。我在页面上对某些资源用了preconnect，但并没有明显的效果。应该对于在线小说，在线漫画这种场景预加载会更适用。

代码优化

lighthouse上显示主线程耗时最多的是样式和布局，所以对这部分进行优化。主要有一下几点：

- 去掉页面上用于布局的table，table本身性能较低，且维护性差，是一种过时的布局方案。
- 在去掉table布局的同时减少一些无意义的DOM元素，减少DOM元素的数量和嵌套。
- 减少css选择器的嵌套。用sass，less这种css预处理器很容易造成多层嵌套。优化前代码里最多的有七八层嵌套，对性能有一定影响。重构后不超过三层。

通过上面的重构后，样式布局和渲染时间从lighthouse上看大概减少了300ms。但样式和布局的时间还是最长的，感觉还有优化空间。

接下来是js代码的优化和重构。因为移除Vue框架，以及用服务端端直出，现在js代码已经减少了大部分。主要有以下几部分：

- 拆分函数，将功能复杂的函数拆分成小函数，让每个函数只做一件事。
- 优化分支结构，用对象Object，代替if…else和switch…case

如下面这段代码，优化后变得更加简洁，也便于维护。

```jsx
// 优化前
var getState = function (state) {
    switch (state) {
        case 1:
            return 'up';
        case 0:
            return 'stay';
        case 2:
            return 'down';
    }
}

// 优化后
var getState = function (state) {
    var stateMap = {
        1: 'up', 0: 'stay', 2: 'down'
    }
    return stateMap[state]
}
```

- 优化DOM操作

DOM操作如改变样式，改变内容可能会引起页面的重绘重排，是比较消耗性能的。网上也有很多优化jq操作的方法。 如将查询到的DOM使用变量存起来，避免重复查询。以及将多次DOM操作变成一次等。这里重点讲一下第二种。 常见的需求是渲染一个列表，如果直接在for循环里面append到父元素中，性能是非常差的。幸好原来的操作是将所有DOM用字符串拼接起来，再用html() 方法一次性添加到页面中。 还有另一种方法是使用文档碎片(fragment)。通过document.createDocumentFragment() 可以新建一个fragment。向fragment中appendChild元素的时候是不会阻塞渲染进程的。最后将fragment替换掉页面上的元素。将fragment元素用appendChild的方法添加到页面上时，实际上添加上去的是它内部的元素，也就是它的子元素。

```jsx
var fragment = document.createDocumentFragment()
for (var i = 0; i < data.length; i++) {
    var str = '<div>' + i + '</div>'
    fragment.appendChild($(str)[0])
}
$('.container').append(fragment)
```

经过测试，在当前的场景下，使用fragment的速度和html()是差不多的，都是10ms左右。区别在于最后将fragment添加到页面上$(’ .container’).append(fragment)这行代码仅仅花费1ms。也就是说，将fragment插入页面时不会引起页面重绘重排，不会引起阻塞。

### 尾调用优化

尾调用是指某个函数的最后一步是调用另一个函数。

函数调用会在内存形成一个“调用记录”，又称“调用帧”，保存调用位置和内存变量等信息。如果在函数A的内部调用函数B，那么在A的调用帧上方，还会形成一个B的调用帧。等到B运行结束，将结果返回到A，B的调用帧才会消失。如果函数B内部还调用函数C，那就还有一个C的调用帧，依次类推。所有的调用帧，就形成一个“调用栈”。

尾调用由于是函数的最后一步操作，所有不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用帧，取代外层函数的调用帧就可以了。

如果所有函数都是尾调用，那么完全可以做到每次执行时，调用帧只有一项，这将大大节省内存。这就是“尾调用优化”。注意，只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行“尾调用优化”。

尾调用案例：

```jsx
function addOne(a) {    var one = 1;    function inner(b) {        return b + one;    }    return inner(a);}
```