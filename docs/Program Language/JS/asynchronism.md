# asynchronism

[【建议星星】要就来45道Promise questions d'entretien一次爽到底(1.1w字用心整理) - 掘金](https://juejin.cn/post/6844904077537574919)

### JS 异步执行顺序

[JS异步的执行顺序分析_javascript技巧_脚本之家](https://www.jb51.net/article/252410.htm)

微任务包括 `process.nextTick` ，`promise` ，`MutationObserver`。

宏任务包括 `script` ， `setTimeout` ，`setInterval` ，`setImmediate` ，`I/O` ，`UI rendering`

### promise和 async await 区别 TODO !!

- 概念 Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大，简单地说，Promise好比容器，里面存放着一些未来才会执行完毕（异步）的事件的结果，而这些结果一旦生成是无法改变的 async await也是异步编程的一种解决方案，他遵循的是Generator函数的语法糖，他拥有内置执行器，不需要额外的调用直接会自动执行并输出结果，它返回的是一个Promise对象。
- 两者的区别 Promise的出现解决了传统callback函数导致的“地狱回调”问题，但它的语法导致了它向纵向发展行成了一个回调链，遇到复杂的业务场景，这样的语法显然也是不美观的。而async await代码看起来会简洁些，使得异步代码看起来像同步代码，await的本质是可以提供等同于”同步效果“的等待异步返回能力的语法糖，只有这一句代码执行完，才会执行下一句。
    1. async await与Promise一样，是非阻塞的。
    2. async await是基于Promise实现的，可以说是改良版的Promise，它不能用于普通的回调函数。

### 同步和异步

同步

- 指在 主线程上排队执行的任务，只有前一个任务执行完毕，才能继续执行下一个任务。
- 也就是调用一旦开始，必须这个调用 返回结果(划重点——）才能继续往后执行。程序的执行顺序和任务排列顺序是一致的。

异步

- 异步任务是指不进入主线程，而进入任务队列的任务，只有任务队列通知主线程，某个异步任务可以执行了，该任务才会进入主线程。
- 每一个任务有一个或多个 回调函数。前一个任务结束后，不是执行后一个任务,而是执行回调函数，后一个任务则是不等前一个任务结束就执行。
- 程序的执行顺序和任务的排列顺序是不一致的，异步的。
- 我们常用的setTimeout和setInterval函数，Ajax都是异步操作。

### 实现异步的方法 TODO

参考答案：

回调函数（Callback）、事件监听、发布订阅、Promise/A+、生成器Generators/ yield、async/await

1. JS 异步编程进化史：callback -> promise -> generator -> async + await
2. async/await 函数的实现，就是将 Generator 函数和自动执行器，包装在一个函数里。
3. async/await可以说是异步终极解决方案了。
    1. async/await函数相对于Promise，优势体现在：
        - 处理 then 的调用链，能够更清晰准确的写出代码
        - 并且也能优雅地解决回调地狱问题。
        - 当然async/await函数也存在一些缺点，因为 await 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 await 会导致性能上的降低，代码没有依赖性的话，完全可以使用 Promise.all 的方式。
    2. async/await函数对 Generator 函数的改进，体现在以下三点：
        - 内置执行器。 Generator 函数的执行必须靠执行器，所以才有了 co 函数库，而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一模一样，只要一行。
        - 更广的适用性。 co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。
        - 更好的语义。 async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。

### promise TODO

得分点 pending、rejected、resolved、微任务、then、catch、Promise.resolve()、Promise.reject()、Promise.all() Promise.any() 、Promise.race()

标准回答

- Promise的作用：Promise是异步微任务，解决了异步多层嵌套回调的问题，让代码的可读性更高，更容易维护 Promise使用：Promise是ES6提供的一个构造函数，可以使用Promise构造函数new一个实例，Promise构造函数接收一个函数作为参数，这个函数有两个参数，分别是两个函数 `resolve` 和`reject`，
    - `resolve`将Promise的状态由等待变为成功，将异步操作的结果作为参数传递过去；
    - `reject`则将状态由等待转变为失败，在异步操作失败时调用，将异步操作报出的错误作为参数传递过去。
- 实例创建完成后，可以使用`then`方法分别指定成功或失败的回调函数，也可以使用catch捕获失败，then和catch最终返回的也是一个Promise，所以可以链式调用。
- Promise的特点：
    - 对象的状态不受外界影响（Promise对象代表一个异步操作，有三种状态）。 - pending（执行中） - Resolved（成功，又称Fulfilled） - rejected（拒绝） 其中pending为初始状态，fulfilled和rejected为结束状态（结束状态表示promise的生命周期已结束）。
    - 一旦状态改变，就不会再变，任何时候都可以得到这个结果。 Promise对象的状态改变，只有两种可能（状态凝固了，就不会再变了，会一直保持这个结果）： - 从Pending变为Resolved - 从Pending变为Rejected
    - resolve 方法的参数是then中回调函数的参数，reject 方法中的参数是catch中的参数
    - then 方法和 catch方法 只要不报错，返回的都是一个fulfilled状态的promise

Promise的其他方法：

- Promise.resolve() :返回的Promise对象状态为fulfilled，并且将该value传递给对应的then方法。
- Promise.reject()：返回一个状态为失败的Promise对象，并将给定的失败信息传递给对应的处理方法。
- Promise.all()：返回一个新的promise对象，该promise对象在参数对象里所有的promise对象都成功的时候才会触发成功，一旦有任何一个iterable里面的promise对象失败则立即触发该promise对象的失败。
- Promise.any()：接收一个Promise对象的集合，当其中的一个 promise 成功，就返回那个成功的promise的值。
- Promise.race()：当参数里的任意一个子promise被成功或失败后，父promise马上也会用子promise的成功返回值或失败详情作为参数调用父promise绑定的相应句柄，并返回该promise对象。

### generator TODO