# Vue 生命周期

Vue 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模板、挂载Dom、渲染→更新→渲染、销毁等一系列过程。

## 生命周期钩子函数

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

1.  **`beforeCreate`**: 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。此时，`data` 和 `props` 都还不可用。
2.  **`created`**: 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，`$el` 属性目前不可见。**通常在此阶段进行异步数据请求**。
3.  **`beforeMount`**: 在挂载开始之前被调用：相关的 `render` 函数首次被调用。
4.  **`mounted`**: el 被新创建的 `vm.$el` 替换，并挂载到实例上去之后调用该钩子。**可以访问到 DOM 元素**。
5.  **`beforeUpdate`**: 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
6.  **`updated`**: 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
7.  **`beforeDestroy`**: 实例销毁之前调用。在这一步，实例仍然完全可用。
8.  **`destroyed`**: Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

### 异步请求在哪个生命周期？

最常用的是在 **`created`** 钩子函数中调用异步请求。

-   **优点**:
    1.  能更快获取到服务端数据，减少页面 loading 时间。
    2.  服务端渲染 (SSR) 不支持 `beforeMount` 和 `mounted` 钩子函数，放在 `created` 中有助于一致性。
-   **也可以在 `mounted` 中请求**:
    -   如果请求的数据需要依赖 DOM，则必须在 `mounted` 中。
    -   在 `mounted` 中发请求会多一次渲染过程。

## `keep-alive`

`<keep-alive>` 是 Vue 的内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染DOM。

包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。

**Props**:

-   `include`: 字符串或正则表达式。只有名称匹配的组件会被缓存。
-   `exclude`: 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
-   `max`: 数字。最多可以缓存多少组件实例。

**生命周期钩子**:

当组件在 `<keep-alive>` 内被切换，会多出两个生命周期钩子：

-   **`activated`**: `keep-alive` 组件激活时调用。
-   **`deactivated`**: `keep-alive` 组件停用时调用。

**原理**:

Vue 的缓存机制并不是直接存储 DOM 结构，而是将 DOM 节点抽象成 VNode 节点。`<keep-alive>` 的缓存也是基于 VNode 节点的。

-   `<keep-alive>` 组件在 `created` 钩子中定义了一个 `this.cache` 对象，用于存储需要缓存的组件 VNode。
-   当 `render` 时，如果 VNode 的 `name` 符合缓存条件，则会从 `this.cache` 中取出之前缓存的 VNode 实例进行渲染。
-   如果 `this.cache` 中没有，则创建一个新的组件实例，并将其缓存到 `this.cache` 中。
-   它还运用了 **LRU (Least Recently Used) 算法**，当缓存的组件数量超过 `max` 限制时，会移除最近最少使用的组件。

## `new Vue()` 之后发生了什么？

1.  **`new Vue()`** 调用 `_init` 方法进行初始化。
2.  **初始化生命周期和事件**: `initLifecycle`, `initEvents`。
3.  **`beforeCreate`** 钩子被调用。
4.  **初始化 `inject` 和 `state`**: `initInjections`, `initState` (包括 `props`, `methods`, `data`, `computed`, `watch`)。在这个阶段，Vue 会使用 `Object.defineProperty` (Vue 2) 或 `Proxy` (Vue 3) 对 `data` 进行响应式处理。
5.  **`created`** 钩子被调用。
6.  **挂载阶段**:
    -   检查是否有 `el` 选项。
    -   检查是否有 `template` 选项，如果有，将其编译成 `render` 函数。如果没有，将 `el` 的 `outerHTML` 作为模板进行编译。
    -   **`beforeMount`** 钩子被调用。
    -   执行 `render` 函数，生成 VNode (虚拟 DOM)。
    -   创建一个 `Watcher` 实例，用于观察数据变化并触发更新。
    -   将 VNode 渲染成真实 DOM，并替换 `el`。
7.  **`mounted`** 钩子被调用。Vue 实例已经挂载完成。
