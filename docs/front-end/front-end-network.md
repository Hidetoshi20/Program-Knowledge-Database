# 前端网络核心指南

本文档系统性地梳理了前端开发中必须掌握的网络知识，从基础的同源策略到复杂的跨域解决方案，再到现代的前后端通信技术，旨在为开发者提供一份清晰、实用的学习和面试指南。

---

## 一、浏览器网络安全基石

### 1.1 同源策略 (Same-Origin Policy)

同源策略是浏览器最核心、最基本的安全功能。它规定，一个源的文档或脚本如何能与另一个源的资源进行交互。如果缺少同源策略，浏览器将很容易受到 XSS、CSRF 等攻击。

-   **同源的定义**: **协议 (Protocol)**、**域名 (Domain)**、**端口 (Port)** 三者完全相同。
-   **限制范围**:
    -   无法读取非同源网页的 Cookie、LocalStorage 和 IndexedDB。
    -   无法获取非同源网页的 DOM。
    -   无法发送 AJAX 请求到非同源的服务器（请求可以发送，但响应会被浏览器拦截）。
-   **例外情况**: 有三个 HTML 标签允许跨域加载资源：
    -   `<img src="URL">`
    -   `<link href="URL">` (CSS)
    -   `<script src="URL">`

### 1.2 浏览器并发请求限制

浏览器对同一域名下的并发 TCP 连接数有限制（Chrome、Firefox 通常为 6个）。

-   **原因**:
    1.  **服务器负载**: 防止因瞬间大量请求而压垮服务器。
    2.  **客户端资源**: 避免浏览器自身消耗过多端口和线程资源。

---

## 二、跨域：突破同源限制

跨域的本质是浏览器基于同源策略的安全限制。请求本身已成功到达服务器并返回，但返回的结果被浏览器拦截。以下是常见的解决方案。

### 2.1 CORS (跨域资源共享)

CORS 是目前跨域请求的**根本解决方案**，支持所有类型的 HTTP 请求。其核心是服务器通过设置特定的 HTTP 响应头（如 `Access-Control-Allow-Origin`），授权浏览器允许指定的源访问其资源。

-   **实现**: `Access-Control-Allow-Origin: *` 或 `Access-Control-Allow-Origin: https://example.com`。

### 2.2 JSONP (JSON with Padding)

JSONP 是一种利用 `<script>` 标签没有跨域限制的“漏洞”实现的旧方案。

-   **原理**: 动态创建一个 `<script>` 标签，其 `src` 指向目标服务器地址，并通过 URL 参数传递一个回调函数名。服务器返回一段执行该回调函数的 JavaScript 代码，并将数据作为参数传入。
-   **优点**: 兼容性好，支持老式浏览器。
-   **缺点**:
    -   只支持 `GET` 请求。
    -   可能遭受 XSS 攻击，安全性较差。

#### 手写 JSONP (Promise封装)
```javascript
function jsonp(url, data = {}, callbackName = 'callback') {
    return new Promise((resolve, reject) => {
        // 1. 准备回调函数
        const callbackFunc = 'jsonp_callback_' + Date.now() + Math.random().toString().substr(2);
        window[callbackFunc] = (responseData) => {
            try {
                resolve(responseData);
            } catch (e) {
                reject(e);
            } finally {
                // 4. 清理工作
                delete window[callbackFunc];
                document.body.removeChild(script);
            }
        };

        // 2. 拼接 URL
        data[callbackName] = callbackFunc;
        const params = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
        
        // 3. 创建并发送请求
        const script = document.createElement('script');
        script.src = `${url}?${params}`;
        document.body.appendChild(script);
    });
}

// 使用
jsonp('http://photo.sina.cn/aj/index', { page: 1, cate: 'recommend' }, 'jsoncallback')
    .then(data => {
        console.log(data);
    });
```

### 2.3 代理 (Proxy)

利用服务器之间通信不受同源策略限制的原理，搭建一个代理服务器来转发请求。

-   **原理**: 客户端请求同源的代理服务器 -> 代理服务器请求目标服务器 -> 目标服务器返回数据给代理服务器 -> 代理服务器将数据返回给客户端。
-   **实现方式**:
    -   **Node.js 中间件**: 在 `webpack-dev-server` 或 `Express/Koa` 框架中配置代理。
    -   **Nginx 反向代理**: 修改 Nginx 配置，将特定路径的请求反向代理到目标服务器。这是生产环境中非常推荐的方案，简单高效。

### 2.4 WebSocket

WebSocket 协议本身支持跨域通信，不遵循同源策略。

### 2.5 postMessage

`postMessage` 是 HTML5 提供的 API，允许在不同源的窗口（如页面与 `iframe`、新打开的窗口）之间安全地进行异步消息传递。

### 2.6 其他 Iframe 方案 (历史方案)

-   **`document.domain`**: 仅适用于主域名相同、子域名不同的情况。通过将两个页面的 `document.domain` 设置为相同的基础主域来实现同域。
-   **`window.name`**: 利用 `window.name` 在页面加载后（即使是不同域名）依然存在的特性来传递数据。
-   **`location.hash`**: 利用 URL 的 hash 值（`#`后面的部分）变化不会刷新页面的特性，通过一个同源的中间 `iframe` 来传递信息。

---

## 三、核心通信技术

### 3.1 AJAX (Asynchronous JavaScript and XML)

AJAX 是一种在无需重新加载整个页面的情况下，能够更新部分网页的技术。

-   **价值**: 通过异步从服务器获取数据，极大地提升了用户体验，并减少了不必要的数据传输。
-   **核心**: `XMLHttpRequest` (XHR) 对象。
-   **实现过程**:
    1.  创建 `XMLHttpRequest` 对象。
    2.  调用 `open()` 方法设置请求（方法、URL、是否异步）。
    3.  监听 `onreadystatechange` 事件，判断 `readyState` 属性。
    4.  当 `readyState` 变为 `4` (完成) 且 `status` 为 `200` (成功) 时，处理响应数据。
    5.  调用 `send()` 方法发送请求。

#### XHR 的 readyState
-   `0`: (Uninitialized) 对象已创建，但未调用 `open()`。
-   `1`: (Loading) 已调用 `open()`，但未调用 `send()`。
-   `2`: (Loaded) 已调用 `send()`，但尚未收到响应。
-   `3`: (Interactive) 正在接收响应体。
-   `4`: (Complete) 响应接收完毕。

### 3.2 Fetch API

Fetch 是一个现代的、用于替代 XHR 的网络请求 API，它基于 Promise 设计，语法更简洁。

-   **优点**: 语法简洁、基于 Promise、可集成 Service Workers 等。
-   **基本用法**:
    ```javascript
    fetch('https://api.example.com/data')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // 或 response.text()
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    ```
-   **POST 请求**:
    ```javascript
    fetch('https://api.example.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'Gemini', skill: 'coding' })
    });
    ```

### 3.3 实时通信技术

| 技术 | 优点 | 缺点 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **WebSocket** | 全双工，低延迟，性能好 | 需额外处理兼容性和心跳保活 | 实时游戏、聊天室、协同编辑 |
| **Server-Sent Events (SSE)** | 轻量，简单易用，支持断线重连 | 单向（服务器->客户端），IE 不支持 | 新闻推送、股票行情、状态更新 |
| **AJAX 轮询** | 兼容性极好 | 延迟高，浪费资源 | 兼容性要求高的场景 |

### 3.4 Axios 拦截器

Axios 是一个流行的基于 Promise 的 HTTP 客户端。其拦截器功能非常实用。

-   **应用场景**:
    -   **请求拦截器**: 在请求发送前统一添加 `token`、`loading` 状态等。
    -   **响应拦截器**: 在收到响应后统一处理错误码、`token` 失效、关闭 `loading` 等。
-   **原理**: Axios 内部维护了一个拦截器链。当发起请求时，会先依次执行所有**请求拦截器**，然后发送真实请求，收到响应后，再依次执行所有**响应拦截器**。这个过程通过 Promise 链式调用 `then` 来实现。

---

## 四、HTTP 深度应用与排错

### 4.1 HTTP Keep-Alive

HTTP/1.1 默认开启 `Connection: Keep-Alive`，允许在一次 TCP 连接中处理多个 HTTP 请求，避免了频繁建立和断开连接的开销，提升了性能。这与 TCP 层面的 Keepalive（用于检测连接是否存活）是不同的概念。

### 4.2 SSL/TLS 连接恢复

为了加速 HTTPS 的重复连接，TLS 提供了会话恢复机制：

-   **Session ID**: 服务器保存每个会话的信息，并给客户端一个 Session ID。客户端下次连接时带上 ID，如果服务器有记录，则可以恢复会话，跳过完整的握手过程。
-   **Session Ticket**: 服务器将加密的会话信息（Ticket）发送给客户端保存。客户端下次连接时将 Ticket 发回，服务器解密后即可恢复会话。此方案更适合分布式服务器。

### 4.3 重定向：301 vs 302

-   **301 (Moved Permanently)**: **永久重定向**。资源已永久移动到新地址。搜索引擎会更新其索引到新地址。
-   **302 (Found)**: **临时重定向**。资源临时从旧地址访问。搜索引擎会继续抓取旧地址。
-   **应用场景**:
    -   `301`: 域名更换，HTTP 升级到 HTTPS。
    -   `302`: 未登录用户访问需授权页面时，跳转到登录页。

### 4.4 CDN 加速原理

CDN (Content Delivery Network, 内容分发网络) 将源站内容分发至全球各地的边缘节点，用户可以就近获取，从而实现加速。

-   **核心流程**:
    1.  用户请求域名，本地 DNS 将解析权交给 CDN 的智能 DNS。
    2.  智能 DNS 根据用户 IP、节点负载等情况，返回一个离用户最近的边缘节点 IP。
    3.  用户向该边缘节点发起请求。
    4.  如果节点有缓存，直接返回；如果没有，则向源站回源，拉取资源并缓存，再返回给用户。

### 4.5 常见问题排查：504 Gateway Timeout

504 错误表示作为网关或代理的服务器，未能及时从上游服务器（如应用服务器）获得响应。

-   **排查思路**:
    1.  **检查后端服务**: 查看应用服务器是否宕机、重启或负载过高。
    2.  **检查网络链路**: 确认代理服务器与后端服务器之间的网络是否通畅。
    3.  **检查超时设置**: 可能是代理服务器（如 Nginx）的超时时间设置得太短，而后端处理请求耗时过长。
    4.  **查看日志**: 分析代理服务器和应用服务器的错误日志，定位具体问题。

---

## 五、实用代码片段

### 5.1 获取 URL GET 参数

```javascript
// 方法一：URLSearchParams (推荐)
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 方法二：正则表达式
function getQueryString(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    const r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}
```
