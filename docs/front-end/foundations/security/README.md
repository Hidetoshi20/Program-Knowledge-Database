# Web Security

### url的加密解密

JavaScript中有三个可以对字符串编码的函数，分别是： escape,encodeURI,encodeURIComponent，相应3个解码函数：unescape,decodeURI,decodeURIComponent 。

三种方式的特点：escape()除了 ASCII 字母、数字和特定的符号外，对传进来的字符串全部进行转义编码，因此如果想对URL编码，最好不要使用此方法。而encodeURI() 用于编码整个URI,因为URI中的合法字符都不会被编码转换。encodeURIComponent方法在编码单个URIComponent（指请求参数）应当是最常用的，它可以讲参数中的中文、特殊字符进行转义，而不会影响整个URL。

解析：

1.escape()函数

定义和用法 escape() 函数可对字符串进行编码，这样就可以在所有的计算机上读取该字符串。

语法 escape(string)

参数 描述 string 必需。要被转义或编码的字符串。

返回值 已编码的 string 的副本。其中某些字符被替换成了十六进制的转义序列。

说明 该方法不会对 ASCII 字母和数字进行编码，也不会对下面这些 ASCII 标点符号进行编码： - _ . ! ~ * ’ ( ) 。其他所有的字符都会被转义序列替换。

2.encodeURI()函数

定义和用法 encodeURI() 函数可把字符串作为 URI 进行编码。

语法 encodeURI(URIstring)

参数 描述 URIstring 必需。一个字符串，含有 URI 或其他要编码的文本。

返回值 URIstring 的副本，其中的某些字符将被十六进制的转义序列进行替换。

说明 该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - _ . ! ~ * ’ ( ) 。

该方法的目的是对 URI 进行完整的编码，因此对以下在 URI 中具有特殊含义的 ASCII 标点符号，encodeURI() 函数是不会进行转义的：;/?:@&=+$,#

3.encodeURIComponent() 函数

定义和用法 encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。

语法 encodeURIComponent(URIstring)

参数 描述 URIstring 必需。一个字符串，含有 URI 组件或其他要编码的文本。

返回值 URIstring 的副本，其中的某些字符将被十六进制的转义序列进行替换。

说明 该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - _ . ! ~ * ’ ( ) 。

其他字符（比如 ：;/?:@&=+$,# 这些用于分隔 URI 组件的标点符号），都是由一个或多个十六进制的转义序列替换的。

提示和注释 提示：请注意 encodeURIComponent() 函数 与 encodeURI() 函数的区别之处，前者假定它的参数是 URI 的一部分（比如协议、主机名、路径或查询字符串）。因此 encodeURIComponent() 函数将转义用于分隔 URI 各个部分的标点符号。

# XSS：跨站脚本攻击

[前端安全系列（一）：如何防止XSS攻击？](https://tech.meituan.com/2018/09/27/fe-security.html)

攻击者想尽一切办法将可以执行的代码注入到网页中。

| 类型 | 存储区 | 插入点 |
| --- | --- | --- |
| 存储型 XSS | 后端数据库 | HTML |
| 反射型 XSS | URL | HTML |
| DOM 型 XSS | 后端数据库/前端存储/URL | 前端 JavaScript |

### 存储型（server端）：

- 场景：见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信等。
- 攻击步骤：
    - 攻击者将恶意代码提交到目标网站的数据库中
    - 用户打开目标网站时，服务端将恶意代码从数据库中取出来，拼接在HTML中返回给浏览器
    - 用户浏览器在收到响应后解析执行，混在其中的恶意代码也同时被执行
    - 恶意代码窃取用户数据，并发送到指定攻击者的网站，或者冒充用户行为，调用目标网站的接口，执行恶意操作

### 反射型（Server端）

与存储型的区别在于，存储型的恶意代码存储在数据库中，反射型的恶意代码在URL上

- 场景：通过 URL 传递参数的功能，如网站搜索、跳转等。
- 攻击步骤：
    - 攻击者构造出特殊的 URL，其中包含恶意代码。
    - 用户打开带有恶意代码的 URL 时，网站服务端将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器。
    - 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
    - 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

### Dom 型(浏览器端）

DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种 XSS 都属于服务端的安全漏洞。

- 场景：通过 URL 传递参数的功能，如网站搜索、跳转等。
- 攻击步骤：
    - 攻击者构造出特殊的 URL，其中包含恶意代码。
    - 用户打开带有恶意代码的 URL。
    - 用户浏览器接收到响应后解析执行，前端 JavaScript 取出 URL 中的恶意代码并执行。
    - 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

## 预防方案

XSS 攻击有两大要素：

1. 攻击者提交恶意代码。
2. 浏览器执行恶意代码。

针对第一个要素：我们是否能够在用户输入的过程，过滤掉用户输入的恶意代码呢？

### **输入过滤**

输入侧过滤能够在某些情况下解决特定的 XSS 问题，但会引入很大的不确定性和乱码问题。在防范 XSS 攻击时应避免此类方法。

当然，对于明确的输入类型，例如数字、URL、电话号码、邮件地址等等内容，进行输入过滤还是必要的。

既然输入过滤并非完全可靠，我们就要通过“**防止浏览器执行恶意代码**”来防范 XSS。这部分分为两类：

- 防止 HTML 中出现注入。
- 防止 JavaScript 执行时，执行恶意代码。

### **预防存储型和反射型 XSS 攻击**

存储型和反射型 XSS 都是在服务端取出恶意代码后，插入到响应 HTML 里的，攻击者刻意编写的“数据”被内嵌到“代码”中，被浏览器所执行。

预防这两种漏洞，有两种常见做法：

- 改成纯前端渲染，把代码和数据分隔开。
- 对 HTML 做充分转义。

纯前端渲染

纯前端渲染的过程：

1. 浏览器先加载一个静态 HTML，此 HTML 中不包含任何跟业务相关的数据。
2. 然后浏览器执行 HTML 中的 JavaScript。
3. JavaScript 通过 Ajax 加载业务数据，调用 DOM API 更新到页面上。

在纯前端渲染中，我们会明确的告诉浏览器：下面要设置的内容是文本（`.innerText`），还是属性（`.setAttribute`），还是样式（`.style`）等等。浏览器不会被轻易的被欺骗，执行预期外的代码了。

但纯前端渲染还需注意避免 DOM 型 XSS 漏洞（例如 `onload` 事件和 `href` 中的 `javascript:xxx` 等，请参考下文”预防 DOM 型 XSS 攻击“部分）。

在很多内部、管理系统中，采用纯前端渲染是非常合适的。但对于性能要求高，或有 SEO 需求的页面，我们仍然要面对拼接 HTML 的问题。

**转义 HTML**

如果拼接 HTML 是必要的，就需要采用合适的转义库，对 HTML 模板各处插入点进行充分的转义。

常用的模板引擎，如 doT.js、ejs、FreeMarker 等，对于 HTML 转义通常只有一个规则，就是把 `& < > " ' /` 这几个字符转义掉，确实能起到一定的 XSS 防护作用，但并不完善：

|XSS 安全漏洞|简单转义是否有防护作用| |-|-| |HTML 标签文字内容|有| |HTML 属性值|有| |CSS 内联样式|无| |内联 JavaScript|无| |内联 JSON|无| |跳转链接|无|

所以要完善 XSS 防护措施，我们要使用更完善更细致的转义策略。

例如 Java 工程里，常用的转义库为 `org.owasp.encoder`。以下代码引用自 [org.owasp.encoder 的官方说明](https://www.owasp.org/index.php/OWASP_Java_Encoder_Project#tab=Use_the_Java_Encoder_Project)。

```html
<!-- HTML 标签内文字内容 --><div><%= Encode.forHtml(UNTRUSTED) %></div><!-- HTML 标签属性值 --><input value="<%= Encode.forHtml(UNTRUSTED) %>" /><!-- CSS 属性值 --><div style="width:<= Encode.forCssString(UNTRUSTED) %>"><!-- CSS URL --><div style="background:<= Encode.forCssUrl(UNTRUSTED) %>"><!-- JavaScript 内联代码块 --><script>
var msg = "<%= Encode.forJavaScript(UNTRUSTED) %>";
  alert(msg);
</script><!-- JavaScript 内联代码块内嵌 JSON --><script>
var __INITIAL_STATE__ = JSON.parse('<%= Encoder.forJavaScript(data.to_json) %>');
</script><!-- HTML 标签内联监听器 --><buttononclick="alert('<%= Encode.forJavaScript(UNTRUSTED) %>');">
  click me
</button><!-- URL 参数 --><a href="/search?value=<%= Encode.forUriComponent(UNTRUSTED) %>&order=1#top"><!-- URL 路径 --><a href="/page/<%= Encode.forUriComponent(UNTRUSTED) %>"><!--
  URL.
  注意：要根据项目情况进行过滤，禁止掉 "javascript:" 链接、非法 scheme 等
--><a href='<%=
  urlValidator.isValid(UNTRUSTED) ?
    Encode.forHtml(UNTRUSTED) :
    "/404"
%>'>
  link
</a>
```

可见，HTML 的编码是十分复杂的，在不同的上下文里要使用相应的转义规则。

### **预防 DOM 型 XSS 攻击**

DOM 型 XSS 攻击，实际上就是网站前端 JavaScript 代码本身不够严谨，把不可信的数据当作代码执行了。

在使用 `.innerHTML`、`.outerHTML`、`document.write()` 时要特别小心，不要把不可信的数据作为 HTML 插到页面上，而应尽量使用 `.textContent`、`.setAttribute()`等。

如果用 Vue/React 技术栈，并且不使用 `v-html`/`dangerouslySetInnerHTML` 功能，就在前端 render 阶段避免 `innerHTML`、`outerHTML` 的 XSS 隐患。

DOM 中的内联事件监听器，如 `location`、`onclick`、`onerror`、`onload`、`onmouseover` 等，`<a>` 标签的 `href` 属性，JavaScript 的 `eval()`、`setTimeout()`、`setInterval()` 等，都能把字符串作为代码运行。如果不可信的数据拼接到字符串中传递给这些 API，很容易产生安全隐患，请务必避免。

```html
<!-- 内联事件监听器中包含恶意代码 -->
![](https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018b/3e724ce0.data:image/png,)

<!-- 链接内包含恶意代码 --><a href="UNTRUSTED">1</a><script>
// setTimeout()/setInterval() 中调用恶意代码
setTimeout("UNTRUSTED")
setInterval("UNTRUSTED")

// location 调用恶意代码
location.href = 'UNTRUSTED'// eval() 中调用恶意代码eval("UNTRUSTED")
</script>
```

如果项目中有用到这些的话，一定要避免在字符串中拼接不可信数据。

## **其他 XSS 防范措施**

虽然在渲染页面和执行 JavaScript 时，通过谨慎的转义可以防止 XSS 的发生，但完全依靠开发的谨慎仍然是不够的。以下介绍一些通用的方案，可以降低 XSS 带来的风险和后果。

### **Content Security Policy**

严格的 CSP 在 XSS 的防范中可以起到以下的作用：

- 禁止加载外域代码，防止复杂的攻击逻辑。
- 禁止外域提交，网站被攻击后，用户的数据不会泄露到外域。
- 禁止内联脚本执行（规则较严格，目前发现 GitHub 使用）。
- 禁止未授权的脚本执行（新特性，Google Map 移动版在使用）。
- 合理使用上报可以及时发现 XSS，利于尽快修复问题。

关于 CSP 的详情，请关注前端安全系列后续的文章。

### **输入内容长度控制**

对于不受信任的输入，都应该限定一个合理的长度。虽然无法完全防止 XSS 发生，但可以增加 XSS 攻击的难度。

### **其他安全措施**

- HTTP-only Cookie: 禁止 JavaScript 读取某些敏感 Cookie，攻击者完成 XSS 注入后也无法窃取此 Cookie。
- 验证码：防止脚本冒充用户提交危险操作。

## **XSS 的检测**

上述经历让小明收获颇丰，他也学会了如何去预防和修复 XSS 漏洞，在日常开发中也具备了相关的安全意识。但对于已经上线的代码，如何去检测其中有没有 XSS 漏洞呢？

经过一番搜索，小明找到了两个方法：

1. 使用通用 XSS 攻击字符串手动检测 XSS 漏洞。
2. 使用扫描工具自动检测 XSS 漏洞。

在[Unleashing an Ultimate XSS Polyglot](https://github.com/0xsobky/HackVault/wiki/Unleashing-an-Ultimate-XSS-Polyglot)一文中，小明发现了这么一个字符串：

```jsx
jaVasCript:/*-/*`/*\`/*'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\x3csVg/<sVg/oNloAd=alert()//>\x3e
```

它能够检测到存在于 HTML 属性、HTML 文字内容、HTML 注释、跳转链接、内联 JavaScript 字符串、内联 CSS 样式表等多种上下文中的 XSS 漏洞，也能检测 `eval()`、`setTimeout()`、`setInterval()`、`Function()`、`innerHTML`、`document.write()` 等 DOM 型 XSS 漏洞，并且能绕过一些 XSS 过滤器。

小明只要在网站的各输入框中提交这个字符串，或者把它拼接到 URL 参数上，就可以进行检测了。

```
http://xxx/search?keyword=jaVasCript%3A%2F*-%2F*%60%2F*%60%2F*%27%2F*%22%2F**%2F(%2F*%20*%2FoNcliCk%3Dalert()%20)%2F%2F%250D%250A%250d%250a%2F%2F%3C%2FstYle%2F%3C%2FtitLe%2F%3C%2FteXtarEa%2F%3C%2FscRipt%2F--!%3E%3CsVg%2F%3CsVg%2FoNloAd%3Dalert()%2F%2F%3E%3E

```

除了手动检测之外，还可以使用自动扫描工具寻找 XSS 漏洞，例如 [Arachni](https://github.com/Arachni/arachni)、[Mozilla HTTP Observatory](https://github.com/mozilla/http-observatory/)、[w3af](https://github.com/andresriancho/w3af) 等。

## **XSS 攻击的总结**

我们回到最开始提出的问题，相信同学们已经有了答案：

1. XSS 防范是后端 RD 的责任，后端 RD 应该在所有用户提交数据的接口，对敏感字符进行转义，才能进行下一步操作。

> 不正确。因为： * 防范存储型和反射型 XSS 是后端 RD 的责任。而 DOM 型 XSS 攻击不发生在后端，是前端 RD 的责任。防范 XSS 是需要后端 RD 和前端 RD 共同参与的系统工程。 * 转义应该在输出 HTML 时进行，而不是在提交用户输入时。
> 
1. 所有要插入到页面上的数据，都要通过一个敏感字符过滤函数的转义，过滤掉通用的敏感字符后，就可以插入到页面中。

> 不正确。 不同的上下文，如 HTML 属性、HTML 文字内容、HTML 注释、跳转链接、内联 JavaScript 字符串、内联 CSS 样式表等，所需要的转义规则不一致。 业务 RD 需要选取合适的转义库，并针对不同的上下文调用不同的转义规则。
> 

整体的 XSS 防范是非常复杂和繁琐的，我们不仅需要在全部需要转义的位置，对数据进行对应的转义。而且要防止多余和错误的转义，避免正常的用户输入出现乱码。

虽然很难通过技术手段完全避免 XSS，但我们可以总结以下原则减少漏洞的产生：

- **利用模板引擎** 开启模板引擎自带的 HTML 转义功能。例如： 在 ejs 中，尽量使用 `<%= data %>` 而不是 `<%- data %>`； 在 doT.js 中，尽量使用 `{{! data }` 而不是 `{{= data }`； 在 FreeMarker 中，确保引擎版本高于 2.3.24，并且选择正确的 `freemarker.core.OutputFormat`。
- **避免内联事件** 尽量不要使用 `onLoad="onload('{{data}}')"`、`onClick="go('{{action}}')"` 这种拼接内联事件的写法。在 JavaScript 中通过 `.addEventlistener()` 事件绑定会更安全。
- **避免拼接 HTML** 前端采用拼接 HTML 的方法比较危险，如果框架允许，使用 `createElement`、`setAttribute` 之类的方法实现。或者采用比较成熟的渲染框架，如 Vue/React 等。
- **时刻保持警惕** 在插入位置为 DOM 属性、链接等位置时，要打起精神，严加防范。
- **增加攻击难度，降低攻击后果** 通过 CSP、输入长度配置、接口安全措施等方法，增加攻击的难度，降低攻击的后果。
- **主动检测和发现** 可使用 XSS 攻击字符串和自动扫描工具寻找潜在的 XSS 漏洞。

# CSRF：跨站请求伪造

[前端安全系列（二）：如何防止CSRF攻击？](https://tech.meituan.com/2018/10/11/fe-security-csrf.html)

攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

攻击流程举例

1. 受害者登录 a.com，并保留了登录凭证（Cookie）
2. 攻击者引诱受害者访问了b.com
3. b.com 向 a.com 发送了一个请求：a.com/act=xx浏览器会默认携带a.com的Cookie
4. a.com接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求
5. a.com以受害者的名义执行了act=xx
6. 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让a.com执行了自己定义的操作

攻击类型

- GET型：如在页面的某个 img 中发起一个 get 请求
- POST型：通过自动提交表单到恶意网站
- 链接型：需要诱导用户点击链接

预防方案：

CSRF通常从第三方网站发起，被攻击的网站无法防止攻击发生，只能通过增强自己网站针对CSRF的防护能力来提升安全性。）

- 同源检测：禁止外域的请求访问本网站，通过Header中的Origin Header 、Referer Header 确定，但不同浏览器可能会有不一样的实现，不能完全保证
- CSRF Token 校验：将CSRF Token输出到页面中（通常保存在Session中），页面提交的请求携带这个Token，服务器验证Token是否正确
- 双重cookie验证：
    - 流程：
        1. 在用户访问网站页面时，向请求域名注入一个Cookie，内容为随机字符串（例如csrfcookie=v8g9e4ksfhw）
        2. 在前端向后端发起请求时，取出Cookie，并添加到URL的参数中（接上例POST https://www.a.com/comment?csrfcookie=v8g9e4ksfhw）
        3. 后端接口验证Cookie中的字段与URL参数中的字段是否一致，不一致则拒绝。
    - 优点：
        - 无需使用Session，适用面更广，易于实施。
        - Token储存于客户端中，不会给服务器带来压力。
        - 相对于Token，实施成本更低，可以在前后端统一拦截校验，而不需要一个个接口和页面添加。
    - 缺点：
        - Cookie中增加了额外的字段。
        - 如果有其他漏洞（例如XSS），攻击者可以注入Cookie，那么该防御方式失效。
        - 难以做到子域名的隔离
        - 为了确保Cookie传输安全，采用这种防御方式的最好确保用整站HTTPS的方式，如果还没切HTTPS的使用这种方式也会有风险。
- Samesite Cookie属性：Google起草了一份草案来改进HTTP协议，那就是为Set-Cookie响应头新增Samesite属性，它用来标明这个 Cookie是个“同站 Cookie”，同站Cookie只能作为第一方Cookie，不能作为第三方Cookie，Samesite 有两个属性值，Strict 为任何情况下都不可以作为第三方 Cookie ，Lax 为可以作为第三方 Cookie , 但必须是Get请求

> 你可以这么理解 CSRF 攻击：攻击者盗用了你的身份，以你的名义进行恶意请求。它能做的事情有很多包括：以你的名义发送邮件、发信息、盗取账号、购买商品、虚拟货币转账等。总结起来就是：个人隐私暴露及财产安全问题。
> 

```jsx
/* * 阐述 CSRF 攻击思想：（核心2和3） * 1、浏览并登录信任网站（举例：淘宝） * 2、登录成功后在浏览器产生信息存储（举例：cookie） * 3、用户在没有登出淘宝的情况下，访问危险网站 * 4、危险网站中存在恶意代码，代码为发送一个恶意请求（举例：购买商品/余额转账） * 5、携带刚刚在浏览器产生的信息进行恶意请求 * 6、淘宝验证请求为合法请求（区分不出是否是该用户发送） * 7、达到了恶意目标 */
```

防御措施（推荐添加token / HTTP头自定义属性）

- 涉及到数据修改操作严格使用 post 请求而不是 get 请求
- HTTP 协议中使用 Referer 属性来确定请求来源进行过滤（禁止外域）
- 请求地址添加 token ，使黑客无法伪造用户请求
- HTTP 头自定义属性验证（类似上一条）
- 显示验证方式：添加验证码、密码等

# iframe 安全

说明：

- 嵌入第三方 iframe 会有很多不可控的问题，同时当第三方 iframe 出现问题或是被劫持之后，也会诱发安全性问题
- 点击劫持
    - 攻击者将目标网站通过 iframe 嵌套的方式嵌入自己的网页中，并将 iframe 设置为透明，诱导用户点击。
- 禁止自己的 iframe 中的链接外部网站的JS

预防方案：

- i）为 iframe 设置 sandbox 属性，通过它可以对iframe的行为进行各种限制，充分实现“最小权限“原则
- ii）服务端设置 X-Frame-Options Header头，拒绝页面被嵌套，X-Frame-Options 是HTTP 响应头中用来告诉浏览器一个页面是否可以嵌入

# 如何让自己的网站不被其他网站的 iframe 引用？

```jsx
// 检测当前网站是否被第三方iframe引用// 若相等证明没有被第三方引用，若不等证明被第三方引用。当发现被引用时强制跳转百度。if (top.location != self.location) {    top.location.href = 'http://www.baidu.com'}
```

# 如何禁用，被使用的 iframe 对当前网站某些操作？

> sandbox是html5的新属性，主要是提高iframe安全系数。iframe因安全问题而臭名昭著，这主要是因为iframe常被用于嵌入到第三方中，然后执行某些恶意操作。 现在有一场景：我的网站需要 iframe 引用某网站，但是不想被该网站操作DOM、不想加载某些js（广告、弹框等）、当前窗口被强行跳转链接等，我们可以设置 sandbox 属性。如使用多项用空格分隔。
> 
- allow-same-origin：允许被视为同源，即可操作父级DOM或cookie等
- allow-top-navigation：允许当前iframe的引用网页通过url跳转链接或加载
- allow-forms：允许表单提交
- allow-scripts：允许执行脚本文件
- allow-popups：允许浏览器打开新窗口进行跳转
- “”：设置为空时上面所有允许全部禁止 ### opener

> 如果在项目中需要 打开新标签 进行跳转一般会有两种方式
> 

```jsx
// 1) HTML -> <a target='_blank' href='http://www.baidu.com'>// 2)  JS  -> window.open('http://www.baidu.com')/* * 这两种方式看起来没有问题，但是存在漏洞。 * 通过这两种方式打开的页面可以使用 window.opener 来访问源页面的 window 对象。 * 场景：A 页面通过 <a> 或 window.open 方式，打开 B 页面。但是 B 页面存在恶意代码如下： * window.opener.location.replace('https://www.baidu.com') 【此代码仅针对打开新标签有效】 * 此时，用户正在浏览新标签页，但是原来网站的标签页已经被导航到了百度页面。 * 恶意网站可以伪造一个足以欺骗用户的页面，使得进行恶意破坏。 * 即使在跨域状态下 opener 仍可以调用 location.replace 方法。 */
```

1. 

```html
<a target="_blank" href="" rel="noopener noreferrer nofollow">a标签跳转url</a><!--  通过 rel 属性进行控制：  noopener：会将 window.opener 置空，从而源标签页不会进行跳转（存在浏览器兼容问题）  noreferrer：兼容老浏览器/火狐。禁用HTTP头部Referer属性（后端方式）。  nofollow：SEO权重优化，详情见 https://blog.csdn.net/qq_33981438/article/details/80909881 -->
```

b.window.open()

```jsx
<button onclick='openurl("http://www.baidu.com")'>click跳转</button>function openurl(url) {    var newTab = window.open();    newTab.opener = null;    newTab.location = url;}
```

# CDN劫持

出于性能考虑，前端应用通常会把一些静态资源存放到CDN（Content Delivery Networks）上面，例如 js 脚本和 style 文件。这么做可以显著提高前端应用的访问速度，但与此同时却也隐含了一个新的安全风险。如果攻击者劫持了CDN，或者对CDN中的资源进行了污染，攻击者可以肆意篡改我们的前端页面，对用户实施攻击。 现在的CDN以支持SRI为荣，script 和 link 标签有了新的属性 integrity，这个属性是为了防止校验资源完整性来判断是否被篡改。它通过 验证获取文件的哈希值是否和你提供的哈希值一样来判断资源是否被篡改。 使用 SRI 需要两个条件：一是要保证 资源同域 或开启跨域，二是在中 提供签名 以供校验。

integrity 属性分为两个部分，第一部分是指定哈希值的生成算法（例：sha384），第二部分是经过编码的实际哈希值，两者之前用一个短横(-)来分隔

# Click Jacking（点击劫持）

> ClickJacking 翻译过来被称为点击劫持。一般会利用透明 iframe 覆盖原网页诱导用户进行某些操作达成目的。
> 

防御措施

- 在HTTP投中加入 X-FRAME-OPTIONS 属性，此属性控制页面是否可被嵌入 iframe 中【DENY：不能被所有网站嵌套或加载；SAMEORIGIN：只能被同域网站嵌套或加载；ALLOW-FROM URL：可以被指定网站嵌套或加载。】
- 判断当前网页是否被 iframe 嵌套（详情在第一条 firame 中）

# HSTS（HTTP Strict Transport Security：HTTP严格传输安全）

网站接受从 HTTP 请求跳转到 HTTPS 请求的做法，例如我们输入“[http://www.baidu.com](https://link.zhihu.com/?target=http%3A/www.baidu.com)”或“[www.baidu.com”最终都会被302重定向到“[https://www.baidu.com](https://link.zhihu.com/?target=https%3A//www.baidu.com)”。这就存在安全风险，当我们第一次通过](http://www.baidu.xn--com302%5Bhttps-149fka9451pilkvxhbu0b6i9b4n8fwnxb2izb35d//www.baidu.com%5D(https://link.zhihu.com/?target=https%3A/www.baidu.com)”。这就存在安全风险，当我们第一次通过) HTTP 或域名进行访问时，302重定向有可能会被劫持，篡改成一个恶意或钓鱼网站。 HSTS：通知浏览器此网站禁止使用 HTTP 方式加载，浏览器应该自动把所有尝试使用 HTTP 的请求自动替换为 HTTPS 进行请求。用户首次访问时并不受 HSTS 保护，因为第一次还未形成链接。我们可以通过 浏览器预置HSTS域名列表 或 将HSTS信息加入到域名系统记录中，来解决第一次访问的问题。

[resource](resource.md)
