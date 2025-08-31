# Vue 组件通信

## 1. `props` / `$emit`

这是最常用的父子组件通信方式。

- 父 -> 子: 父组件通过 `props` 向子组件传递数据。
- 子 -> 父: 子组件通过 `$emit` 触发事件，并携带数据，父组件监听该事件。

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

- `$attrs`: 未作为 prop 被识别的 attribute 集合（class/style 除外）。
- `$listeners`: 父作用域中的事件监听器集合。

场景: A -> B -> C，A 想直接传数据给 C。

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

用于祖先组件向其所有后代组件注入依赖。

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
    bus.$off('custom-event');
  }
}
```

## 6. `$parent` / `$children` / `ref`

- `$parent`: 访问父组件实例。
- `$children`: 访问当前实例的直接子组件。
- `ref`: 通过 `this.$refs` 访问子组件或 DOM。谨慎使用，容易造成强耦合。

## 7. Vuex

当应用变得复杂、多个组件共享状态时，推荐采用集中式状态管理（见 `state-management.md`）。

