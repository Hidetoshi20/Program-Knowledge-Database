# Vue 组件通信

## 1. `props` / `$emit`

这是最常用的父子组件通信方式。

-   **父 -> 子**: 父组件通过 `props` 向子组件传递数据。
-   **子 -> 父**: 子组件通过 `$emit` 触发事件，并携带数据，父组件监听该事件。

```vue
<!-- Parent.vue -->
<template>
  <Child :message="parentMessage" @child-event="handleChildEvent" />
</template>
<script>
export default {
  data() {
    return { parentMessage: 'Hello from parent' };
  },
  methods: {
    handleChildEvent(payload) {
      console.log('Message from child:', payload);
    }
  }
}
</script>

<!-- Child.vue -->
<template>
  <div>
    <p>{{ message }}</p>
    <button @click="$emit('child-event', 'Hello from child')">Send to parent</button>
  </div>
</template>
<script>
export default {
  props: ['message']
}
</script>
```

## 2. `$attrs` / `$listeners`

用于多层嵌套组件的通信，可以实现 "隔代传参"。

-   `$attrs`: 包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定，并且可以通过 `v-bind="$attrs"` 传入内部组件。
-   `$listeners`: 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 `v-on="$listeners"` 传入内部组件。

**场景**: A -> B -> C，A 想直接传数据给 C。

```vue
<!-- A.vue -->
<template>
  <B :messageA="messageA" :messageC="messageC" @event-c="handleEventC" />
</template>

<!-- B.vue -->
<template>
  <div>
    <p>From A: {{ messageA }}</p>
    <!-- 将 A 传给 C 的 props 和事件继续向下传递 -->
    <C v-bind="$attrs" v-on="$listeners" />
  </div>
</template>
<script>
export default {
  props: ['messageA'] // B 只接收 messageA
}
</script>

<!-- C.vue -->
<template>
  <div>
    <p>From A (via B): {{ messageC }}</p>
    <button @click="$emit('event-c', 'Data from C')">Trigger event in A</button>
  </div>
</template>
<script>
export default {
  props: ['messageC'] // C 接收 messageC
}
</script>
```

## 3. `v-model`

`v-model` 是 `props` 和 `$emit` 的语法糖，用于实现父子组件之间的双向数据绑定。

```vue
<!-- Parent.vue -->
<CustomInput v-model="searchText" />

<!-- 等价于 -->
<CustomInput :value="searchText" @input="searchText = $event" />

<!-- CustomInput.vue -->
<template>
  <input :value="value" @input="$emit('input', $event.target.value)">
</template>
<script>
export default {
  props: ['value']
}
</script>
```

## 4. `provide` / `inject`

用于祖先组件向其所有后代组件注入一个依赖，不论组件层次有多深。

```vue
// Ancestor.vue
export default {
  provide: {
    foo: 'bar'
  }
}

// Descendant.vue
export default {
  inject: ['foo'],
  mounted() {
    console.log(this.foo) // 'bar'
  }
}
```

## 5. 中央事件总线 (Event Bus)

用于任意两个组件之间的通信，特别是兄弟组件。

1.  创建一个新的 Vue 实例作为事件总线。
2.  在发送方组件中，使用 `bus.$emit('event-name', data)` 触发事件。
3.  在接收方组件中，使用 `bus.$on('event-name', callback)` 监听事件。

```javascript
// bus.js
import Vue from 'vue';
export const bus = new Vue();

// ComponentA.vue
import { bus } from './bus.js';
bus.$emit('custom-event', 'some data');

// ComponentB.vue
import { bus } from './bus.js';
export default {
  created() {
    bus.$on('custom-event', (data) => {
      console.log(data);
    });
  },
  beforeDestroy() {
    // 记得在组件销毁前移除监听器
    bus.$off('custom-event');
  }
}
```

## 6. `$parent` / `$children` / `ref`

-   `$parent`: 访问父组件实例。
-   `$children`: 访问当前实例的直接子组件。
-   `ref`: 给子组件或 DOM 元素注册引用信息，通过 `this.$refs.refName` 访问。

**注意**: 这些方式会造成组件之间的强耦合，应谨慎使用，通常只在封装组件库时考虑。

## 7. Vuex

当应用变得复杂，多个组件共享状态时，以上方法可能会导致状态管理混乱。Vuex 是官方的状态管理模式，将所有组件的共享状态抽取出来，以一个全局单例模式管理。

-   **State**: 驱动应用的数据源。
-   **View**: 以声明方式将 state 映射到视图。
-   **Actions**: 响应在 view 上的用户输入导致的状态变化。

这是最强大和可维护的跨组件通信方案，适用于中大型应用。
