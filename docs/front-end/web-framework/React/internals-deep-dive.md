# React Internals: Deep Dive (深入 React 内核)

This document explores the advanced concepts at the core of React, providing a deeper understanding of how React works under the hood.
(本文档旨在深入探讨 React 的核心概念，帮助你理解其内部工作原理。)

---

## 1. Fiber Architecture (Fiber 架构)

The **Fiber Architecture** is the foundation of React's modern reconciliation algorithm. It was introduced in React 16 to enable features like **Concurrent Mode** and better performance.
(Fiber 架构是 React 现代协调算法的基础。它在 React 16 中被引入，用以支持并发模式等新特性。)

### What is a Fiber? (什么是 Fiber？)

A **Fiber** is a JavaScript object that represents a unit of work. It corresponds to a component instance, a DOM node, or any other element in the React tree. Each component instance has one or more Fiber nodes.
(一个 Fiber 是一个代表“工作单元”的 JavaScript 对象。它对应一个组件实例、一个 DOM 节点或 React 树中的任何其他元素。每个组件实例都会有一个或多个 Fiber 节点。)

A Fiber node contains information about a component, its input (props), and its output (children). Crucially, it also maintains pointers to other Fiber nodes in the tree, forming a linked list structure.
(一个 Fiber 节点包含了关于一个组件、其输入 (props) 和其输出 (children) 的信息。关键的是，它还维护着指向树中其他 Fiber 节点的指针，形成一个链表结构。)

-   `return`: Points to the parent Fiber node. (指向父节点)
-   `child`: Points to the first child Fiber node. (指向第一个子节点)
-   `sibling`: Points to the next sibling Fiber node. (指向下一个兄弟节点)

This linked list structure allows React to pause, resume, and prioritize work, making the rendering process non-blocking.
(这种链表结构使得 React 可以暂停、恢复和优先处理工作，从而使渲染过程变为非阻塞的。)

### Why was Fiber introduced? (为什么引入 Fiber？)

Before Fiber, React used a synchronous reconciliation algorithm (known as the Stack Reconciler). This process could not be interrupted. If a large component tree was being rendered, it could block the main thread, leading to a poor user experience (e.g., frozen UI, dropped frames).
(在 Fiber 之前，React 使用的是一个同步的协调算法（称为栈协调器）。这个过程无法被中断。如果一个庞大的组件树正在渲染，它会阻塞主线程，导致糟糕的用户体验，例如界面卡顿、掉帧等。)

Fiber was designed to solve this by breaking rendering work into smaller chunks. The renderer can do a bit of work and then yield back to the main thread, allowing other high-priority tasks (like user input) to be processed.
(Fiber 的设计目标就是通过将渲染工作分解成小块来解决这个问题。渲染器可以执行一小部分工作，然后将控制权交还给主线程，从而允许其他高优先级的任务（如用户输入）被处理。)

---

## 2. React's Rendering Mechanism (渲染机制)

React's rendering process can be split into two main phases, enabled by the Fiber architecture.
(得益于 Fiber 架构，React 的渲染过程可以被分为两个主要阶段。)

### Phase 1: Render Phase (渲染阶段)

This phase is **asynchronous and interruptible**. React walks the Fiber tree and determines what changes need to be made to the DOM.
(这个阶段是**异步且可中断的**。React 遍历 Fiber 树，并确定需要对 DOM 进行哪些更改。)

The work done in this phase includes:
(此阶段的工作包括：)

1.  Calling `render()` methods on class components. (调用类组件的 `render()` 方法。)
2.  Executing the body of function components. (执行函数组件。)
3.  Calculating the differences (diffing) between the new and old trees. (计算新旧树之间的差异，即 "diffing"。)
4.  Building a "work-in-progress" tree with all the updates. (构建一个包含所有更新的“工作中的”树。)

Because this phase can be paused and resumed, React does **not** perform any side effects (like DOM mutations) here. It is considered "pure".
(因为这个阶段可以被暂停和恢复，React 在此**不会**执行任何副作用（例如 DOM 修改）。这个阶段被认为是“纯粹的”。)

### Phase 2: Commit Phase (提交阶段)

This phase is **synchronous and cannot be interrupted**. Once the Render Phase is complete, React has a complete list of all the DOM changes.
(这个阶段是**同步且不可中断的**。一旦渲染阶段完成，React 就拥有了一个包含所有 DOM 变更的完整列表。)

In this phase, React:
(在此阶段，React 会：)

1.  Applies all the calculated changes to the actual DOM (adding, updating, and removing nodes). (将所有计算出的变更应用到真实的 DOM 上（增、删、改节点）。)
2.  Calls the `componentDidMount` and `componentDidUpdate` lifecycle methods. (调用 `componentDidMount` 和 `componentDidUpdate` 生命周期方法。)
3.  Calls `useEffect` hooks. (调用 `useEffect` hooks。)

This phase must be synchronous to ensure a consistent UI.
(这个阶段必须是同步的，以确保 UI 的一致性。)

---

## 3. The Diff Algorithm (Diff 算法)

React's "diffing" algorithm is what makes it efficient. Instead of re-rendering the entire application on every change, React compares the new tree with the old one and makes the minimum number of changes to the real DOM.
(React 的 "diffing" 算法是其高效的关键。React 不会在每次变更时都重新渲染整个应用，而是会对比新旧虚拟 DOM 树，并以最小的代价更新真实 DOM。)

The algorithm relies on two main assumptions:
(该算法依赖于两个主要假设：)

1.  Two elements of different types will produce different trees. (两个不同类型的元素将会产生不同的树。)
2.  The developer can hint at which child elements may be stable across different renders with a `key` prop. (开发者可以通过 `key` 属性来暗示哪些子元素在不同的渲染中是保持稳定的。)

Based on this, the diffing strategy is:
(基于此，Diff 策略如下：)

-   **Tree Diff (树比较):** React compares the trees level by level. If it finds a node has been moved to a different level, it will destroy the old node and create a new one. (React 会逐层比较。如果一个节点被跨层级移动，React 会销毁旧节点并创建新节点。)
-   **Component Diff (组件比较):** If two components are of the same type, React will keep the underlying component instance and only update its props. If they are of different types, the old component will be unmounted and a new one will be mounted. (如果两个组件类型相同，React 会保留组件实例，仅更新其 props。如果类型不同，旧组件会被卸载，然后挂载一个新组件。)
-   **Element Diff (元素比较):** When comparing a list of children, React uses the `key` prop to match children in the original tree with children in the subsequent tree. This allows for efficient reordering, insertion, and deletion of elements without unnecessarily re-creating them. (在比较一个子元素列表时，React 使用 `key` 属性来匹配新旧树中的子元素。这使得高效地重排、插入和删除元素成为可能，而无需不必要地重新创建它们。)

---

## 4. Concurrent Mode (并发模式)

**Concurrent Mode** is a set of new features that help React apps stay responsive and gracefully adjust to the user's device capabilities and network speed. It is not a single feature but a new mechanism enabled by the Fiber architecture.
(并发模式是一系列新特性的集合，它能帮助 React 应用保持响应性，并根据用户的设备性能和网络速度进行优雅地调整。它不是一个单一的功能，而是由 Fiber 架构启用的一套新机制。)

### Key Features (核心特性)

-   **Interruptible Rendering (可中断渲染):** React can pause a long-running render to handle a high-priority event (like a user typing in an input) and then resume the render later. (React 可以暂停一个耗时较长的渲染，去处理一个高优先级的事件（例如用户输入），然后再恢复之前的渲染。)
-   **Prioritization (优先级调度):** React can assign different priority levels to different updates. For example, user input is high priority, while fetching data for a new view might be lower priority. (React 可以为不同的更新分配不同的优先级。例如，用户输入是高优先级的，而为一个新视图获取数据则可能是低优先级的。)

### How to use it? (如何使用？)

Concurrent Mode is enabled through APIs like `startTransition` and `useDeferredValue`.

-   `startTransition`: Allows you to mark a state update as a "transition," which tells React it's a non-urgent update that can be interrupted. (允许你将一个状态更新标记为“过渡”，这会告诉 React 这是一个非紧急的更新，可以被中断。)
    ```javascript
    import { startTransition } from 'react';

    // Mark a state update as a non-urgent transition
    startTransition(() => {
      setSearchQuery(input);
    });
    ```
-   `useDeferredValue`: Allows you to defer re-rendering a non-urgent part of the UI. It's similar to debouncing but integrates more deeply with React. (允许你推迟渲染 UI 的非紧急部分。它类似于防抖，但与 React 的集成更深入。)

---

## 5. Hooks and Closures (Hooks 与闭包陷阱)

A common challenge when working with Hooks is understanding their relationship with JavaScript closures.
(使用 Hooks 时的一个常见挑战是理解它们与 JavaScript 闭包的关系。)

### The "Stale Closure" Problem (“陈旧的闭包”问题)

When a function component renders, it creates a "snapshot" of its state and props for that specific render. If you have an asynchronous operation (like `setTimeout` or a data fetch) inside an effect, the callback for that operation will "close over" the state and props from the render in which it was created.
(当一个函数组件渲染时，它会为那次特定的渲染创建一个关于其 state 和 props 的“快照”。如果你在 effect 中有一个异步操作（如 `setTimeout` 或数据请求），该操作的回调函数将会“闭包”它被创建时的那次渲染的 state 和 props。)

If the state changes later, the asynchronous callback will still see the old, "stale" value.
(如果 state 稍后发生了变化，这个异步回调函数看到的仍然是旧的、“陈旧的”值。)

**Example (示例):**

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  function logCount() {
    setTimeout(() => {
      // This `count` is from the render where logCount was defined.
      // 这里的 `count` 来自于 logCount 函数被定义的那次渲染。
      alert(`Count is: ${count}`);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={logCount}>Log Count</button>
    </div>
  );
}
```
In this example, if you click "Click me" several times and then click "Log Count", the alert will show the `count` value from when you clicked "Log Count", not the current value.
(在这个例子中，如果你点击几次 "Click me"，然后点击 "Log Count"，弹窗将会显示你点击 "Log Count" 时的 `count` 值，而不是当前最新的值。)

### Solutions (解决方案)

1.  **Dependency Array (依赖数组):** If you are using `useEffect`, make sure to include all variables from the component scope that you use inside the effect in the dependency array. This ensures the effect is re-created when those variables change.
    (如果你在使用 `useEffect`，请确保将 effect 内部用到的、所有来自组件作用域的变量都包含在依赖数组中。这能保证当这些变量变化时，effect 会被重新创建。)

2.  **Functional Updates (函数式更新):** When setting state based on the previous state, use the functional update form. This gives you access to the latest state value directly.
    (当基于前一个 state 来设置新 state 时，请使用函数式更新的形式。这能让你直接访问到最新的 state 值。)
    ```javascript
    // Instead of setCount(count + 1)
    setCount(currentCount => currentCount + 1);
    ```

3.  **useRef:** If you need to access the latest value of some state or prop from a callback without re-triggering an effect, you can store it in a ref.
    (如果你需要在一个回调函数中访问某个 state 或 prop 的最新值，而又不想重新触发 effect，你可以将其存储在一个 ref 中。)
    ```javascript
    const latestCount = useRef(count);
    latestCount.current = count; // Update on every render

    useEffect(() => {
      // Now you can use latestCount.current in a callback
    }, []);
    ```
