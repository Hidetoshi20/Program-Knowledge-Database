# Vue 基础：核心概念、数据绑定、生命周期

本文聚合了核心概念、数据绑定与生命周期，便于成体系阅读与检索。

## 核心概念

### data 为什么是函数？

在组件化的开发中，我们期望每个组件实例都是独立的，拥有自己的作用域和私有状态。

JavaScript 中，对象的属性是引用类型的。如果 `data` 是一个对象，那么所有组件实例将共享同一个 `data` 对象。当一个组件修改了 `data`，其他所有组件的 `data` 也会被修改，这会造成数据污染。

当 `data` 是一个函数时，每个组件实例在创建时都会调用这个函数，返回一个新的对象。这样，每个实例都维护了一份独立的数据拷贝，互不影响。

```javascript
// 错误示范：data 是一个对象
export default {
  data: {
    count: 0 // 所有实例共享这个 count
  }
}

// 正确示范：data 是一个函数
export default {
  data() {
    return {
      count: 0 // 每个实例都有自己的 count
    }
  }
}
```
> 注意：在 `new Vue()` 根实例中，`data` 可以是一个对象，因为根实例是唯一的。

### v-if vs v-show

两者都是用来显示和隐藏元素的指令。

| 指令 | `v-if` | `v-show` |
| --- | --- | --- |
| 原理 | 真实地销毁和重建 DOM 元素。 | 通过 CSS 的 `display: none` 来控制元素的显示和隐藏。 |
| 编译 | 如果初始条件为假，则什么也不做，直到条件第一次变为真时，才会开始渲染。 | 无论初始条件是什么，元素总是会被渲染，只是简单地基于 CSS 进行切换。 |
| 性能开销 | 有更高的切换开销（DOM 的创建和销毁）。 | 有更高的初始渲染开销。 |
| 适用场景 | 如果运行时条件很少改变，使用 `v-if` 较好。 | 如果需要非常频繁地切换，使用 `v-show` 较好。 |

`v-if` 是“惰性的”，并且有 `v-else` 和 `v-else-if` 作为补充。

### v-for 中 key 的作用

`key` 的主要作用是为了高效地更新虚拟DOM。

当 Vue 正在更新使用 `v-for` 渲染的元素列表时，它默认使用“就地更新”的策略。为了给 Vue 一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，你需要为每项提供一个唯一的 `key`。

- 不使用 `key`: 在列表的开头或中间插入元素时，可能导致性能问题和状态混乱。
- 使用 `index` 作为 `key`: 列表顺序改变时会导致重渲染，不推荐。
- 使用唯一 ID 作为 `key`: 最佳实践。

### $nextTick

作用: 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

原理: Vue 在更新 DOM 时是异步执行的。`$nextTick` 主要基于微任务/宏任务机制，优先顺序大致为 `Promise`、`MutationObserver`、`setImmediate`、`setTimeout`。

### delete vs Vue.delete

- `delete`: JS 原生操作符，删除数组元素会变为 `empty`，长度不变，且非响应式。
- `Vue.delete`/`this.$delete`: 响应式删除对象属性或数组元素。

```javascript
let arr1 = [1, 2, 3]
let arr2 = [1, 2, 3]

delete arr1[1]
this.$delete(arr2, 1) // 注意，第二个参数是索引

console.log(arr1)    // [1, empty, 3]
console.log(arr2)    // [1, 3]
```

### refs / $parent / $children

- `$refs`: 通过 `ref` 获取子组件实例或 DOM。
- `$parent` / `$children`: 访问父/子组件实例。注意会造成强耦合，谨慎使用。

## 数据绑定

### v-model 作用

`v-model` 是在表单及元素上创建双向数据绑定的语法糖：

1. 根据控件类型自动选取更新方法。
2. 监听用户输入更新数据，并处理极端场景。
3. 忽略表单元素的初始值，以组件 `data` 为准。

内部实现对不同控件采用不同属性/事件：
- text/textarea: `value` + `input`
- checkbox/radio: `checked` + `change`
- select: `value` + `change`

### v-model 实现原理

本质是语法糖：

```html
<input v-model="sth"/>
<!-- 等同于 -->
<input :value="sth" @input="sth = $event.target.value"/>
```

### Vue 2.x 双向绑定的缺陷与修补

- 无法检测对象属性的新增/删除：使用 `Vue.set` 或整体替换对象。
- 不能直接监听数组部分操作：通过重写部分数组方法实现响应式；`Vue.set`/`splice` 可修补常见场景。

### Vue 3.x 双向绑定（Proxy）

使用 `Proxy` 劫持对象，支持更全面的拦截，天然支持数组变化，相比 `Object.defineProperty` 更灵活。

## 生命周期

Vue 实例从创建、初始化、编译、挂载、更新到销毁有一整套生命周期。

### 生命周期钩子函数与时序

```mermaid
graph TD
    A(new Vue()) --> B(Init Events & Lifecycle)
    B --> C(beforeCreate)
    C --> D(Init Injections & Reactivity)
    D --> E(created)
    E --> F{Has 'el' option?}
    F -- Yes --> G{Has 'template' option?}
    F -- No --> H(vm.$mount(el))
    G -- Yes --> I(Compile template into render function)
    G -- No --> J(Compile el's outerHTML as template)
    I --> K(beforeMount)
    J --> K
    H --> K
    K --> L(Create vm.$el and replace 'el' with it)
    L --> M(mounted)
    M --> N{When data changes}
    N --> O(beforeUpdate)
    O --> P(Virtual DOM re-render and patch)
    P --> Q(updated)
    M --> R(When vm.$destroy() is called)
    R --> S(beforeDestroy)
    S --> T(Teardown watchers, child components and event listeners)
    T --> U(destroyed)

    subgraph "Keep-alive"
        V(activated)
        W(deactivated)
    end

    M -.-> V
    S -.-> W
```

常见实践：
- 异步数据请求通常放在 `created`；如依赖 DOM 则放在 `mounted`。
- `<keep-alive>` 会缓存不活动组件，多出 `activated`/`deactivated` 钩子。

