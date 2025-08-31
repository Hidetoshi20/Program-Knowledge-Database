# 输入变更监听（oninput 等）

## 核心事件
- `input`：值变化即时触发（受 IME 合成影响）；
- `change`：失焦或提交时触发；
- `compositionstart/update/end`：输入法合成阶段（中文/日文等）。

```js
const el = document.querySelector('input');
el.addEventListener('compositionstart', () => composing = true);
el.addEventListener('compositionend', () => { composing = false; handle(el.value); });
el.addEventListener('input', () => { if (!composing) handle(el.value); });
```

## 高频优化
- 防抖/节流：`requestAnimationFrame` 或 `lodash.debounce`；
- 事件委托：大量输入元素时绑定到容器；
- contenteditable：使用 `input` 与 `MutationObserver` 结合处理富文本。

## 无障碍与移动端
- 输入类型合理化：`type=email|number`；
- 移动端键盘与自动大写设置；
- 考虑软键盘弹出对布局的影响（viewport/安全区域）。

## 延伸阅读
- [浏览器基础](../foundations/browser.md)
