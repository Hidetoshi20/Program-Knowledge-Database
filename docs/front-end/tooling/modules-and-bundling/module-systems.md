# 模块规范与模块系统

本页汇总 CommonJS、ES Modules 的核心差异、循环引用与动态导入等主题。

## CommonJS 规范

CommonJS 规范加载模块是同步的，只有加载完成，才能执行后面的操作。

CommonJS 规范中的 module、exports 和 require：

- 每个文件就是一个模块，有自己的作用域。每个模块内部，`module` 变量代表当前模块，是一个对象，它的 `exports` 属性（即 `module.exports`）是对外的接口。
- `module.exports` 属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取 `module.exports` 变量。
- 为了方便，Node 为每个模块提供一个 `exports` 变量，指向 `module.exports`。

```js
let exports = module.exports;
```

- `require` 命令用于加载模块文件。

使用示例：

```js
// name.js
exports.name = function () {
  return '李婷婷';
};

// getName.js
let getName = require('name');
```

注意：不能直接将 `exports` 变量指向一个值，否则会切断与 `module.exports` 的联系：

```js
exports = function (x) {
  console.log(x);
};
```

如果一个模块的对外接口是单一值，只能使用 `module.exports` 输出。

## ES6 Module 与 CommonJS 的区别

- CommonJS 的 `require` 是同步的，ESM 在浏览器与服务端均可用（Node 需遵循特定规则）。
- CommonJS 输出的是值的拷贝，ESM 输出的是值的引用。
- CommonJS 是运行时加载，ESM 是编译时输出接口，可做静态分析。
- 循环加载时，CommonJS 只输出已执行部分；ESM 取值是动态引用，最终取值时可获得最新值。
- 顶层 `this`：CommonJS 指向当前模块；ESM 为 `undefined`。
- 互相引用：ESM 可加载 CommonJS；CommonJS 在 Node 中不能直接 `require` ESM（两套系统分开处理）。

## 循环引用（CommonJS vs ESM）

循环加载：a 依赖 b，b 依赖 a。

1) CommonJS：加载即执行。循环时只输出已执行部分，未执行的不输出；后续对已输出值的变化不会影响取值方。

示例（来自 Node 官方文档）：

```js
// a.js
exports.done = false;
var b = require('./b.js');
console.log('在 a.js 中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕！');

// b.js
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕！');

// main.js
var a = require('./a.js');
var b = require('./b.js');
console.log('在 main.js 中，a.done = %j, b.done = %j', a.done, b.done);
```

2) ES Modules：导出是动态引用，`import` 只建立引用关系，真正取值时获取当前值。

```js
// even.js
import { odd } from './odd.js';
let counter = 0;
export function even(n) {
  counter++;
  console.log(counter);
  return n == 0 || odd(n - 1);
}

// odd.js
import { even } from './even.js';
export function odd(n) {
  return n != 0 && even(n - 1);
}

// index.js
import * as m from './even.js';
console.log(m.even(5));
console.log(m.even(4));
```

将上述改为 CommonJS 会报错，因为 `even.js` 在 `odd.js` `require` 时尚未导出完整函数。

## 动态 import

- 语法与用法参考：
  - [webpack | 动态导入语法 import](https://juejin.cn/post/6899640414446780430?from=search-suggest)
  - [webpack 动态 import 以及模块联邦](https://juejin.cn/post/7285184691418349587?from=search-suggest)

## 幽灵依赖（Phantom Dependencies）

- 参考：<https://juejin.cn/post/7226610046833442872>

## 相关与延伸

- Babel：<https://juejin.cn/post/6844904065223098381>
- CSS Modules：<https://rynxiao.com/%E6%8A%80%E6%9C%AF/2018/08/26/css-modules-tutorial.html>

