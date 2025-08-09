# 数据绑定

## v-model 作用

v-model本质上不过是语法糖，可以用 v-model 指令在**表单**及**元素**上创建双向数据绑定。

1.  它会根据控件类型自动选取正确的方法来更新元素。
2.  它负责监听用户的输入事件以更新数据，并对一些极端场景进行一些特殊处理。
3.  v-model会忽略所有表单元素的value、checked、selected特性的初始值,而总是将 Vue 实例的数据作为数据来源，因此我们应该通过 JavaScript 在组件的data选项中声明初始值。

**扩展：**

v-model在内部为不同的输入元素使用不同的属性并抛出不同的事件：

1.  text 和 textarea 元素使用`value`属性和`input`事件；
2.  checkbox 和 radio 使用`checked`属性和`change`事件；
3.  select 字段将`value`作为 prop 并将`change`作为事件。

## v-model 实现原理

v-model只不过是一个语法糖而已,真正的实现靠的还是:

1.  `v-bind:`绑定响应式数据
2.  触发`oninput` 事件并传递数据

```html
<input v-model="sth"/>
<!-- 等同于-->
<input :value="sth" @input="sth = $event.target.value"/>
```

-   自html5开始,input每次输入都会触发oninput事件，所以输入时input的内容会绑定到sth中，于是sth的值就被改变。
-   `$event` 指代当前触发的事件对象;
-   `$event.target` 指代当前触发的事件对象的dom;
-   `$event.target.value` 就是当前dom的value值;
-   在`@input`方法中，value => sth;
-   在`:value`中,sth => value;

## Vue2.0 双向绑定的缺陷？

Vue2.0的数据响应是采用数据劫持结合发布者-订阅者模式的方式，通过`Object.defineProperty()`来劫持各个属性的setter、getter，但是它并不算是实现数据的响应式的完美方案，某些情况下需要对其进行修补或者hack这也是它的缺陷，主要表现在两个方面：

1.  **无法检测到对象属性的新增或删除**：vue 实例创建后，无法检测到对象属性的新增或删除，只能追踪到数据是否被修改(Object.defineProperty只能劫持对象的属性)。
    -   **解决方案**：
        ```javascript
        // 使用 Vue.set
        Vue.set(obj, propertName/index, value)

        // 响应式对象的子对象新增属性，可以给子响应式对象重新赋值
        data.location = {
            x: 100,
            y: 100
        }
        data.location = {...data, z: 100}
        ```

2.  **不能监听数组的变化**：vue在实现数组的响应式时，它使用了一些hack，把无法监听数组的情况通过重写数组的部分方法来实现响应式，这也只限制在数组的`push/pop/shift/unshift/splice/sort/reverse`七个方法，其他数组方法及数组的使用则无法检测到，例如如下两种使用方式：
    ```javascript
    vm.items[index] = newValue;
    vm.items.length = newLength;
    ```
    -   **解决方案**：
        -   `Vue.set(vm.items, indexOfItem, newValue)`
        -   `vm.items.splice(indexOfItem, 1, newValue)`

## Vue3.0 实现数据双向绑定的方法

`vue3`采用的是`Proxy`实现数据劫持。

**Proxy**是 ES6 中新增的一个特性，翻译过来意思是“代理”，用在这里表示由它来“代理”某些操作。 Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

使用proxy实现双向数据绑定，相比2.0的`Object.defineProperty()`优势：

1.  可以劫持整个对象，并返回一个新对象。
2.  有13种劫持操作，可以更精细地控制。
3.  可以原生支持监听数组变化。
