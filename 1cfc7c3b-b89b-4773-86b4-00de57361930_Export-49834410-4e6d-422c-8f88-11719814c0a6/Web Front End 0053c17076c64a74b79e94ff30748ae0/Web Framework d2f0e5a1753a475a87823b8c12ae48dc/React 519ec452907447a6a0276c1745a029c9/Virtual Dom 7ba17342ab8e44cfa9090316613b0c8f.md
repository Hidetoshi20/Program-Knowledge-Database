# Virtual Dom

## diff

跟`Vue`一致，`React`通过引入`Virtual DOM`的概念，极大地避免无效的`Dom`操作，使我们的页面的构建效率提到了极大的提升

而`diff`算法就是更高效地通过对比新旧`Virtual DOM`来找出真正的`Dom`变化之处

传统diff算法通过循环递归对节点进行依次对比，效率低下，算法复杂度达到 O(n^3)，`react`将算法进行一个优化，复杂度将为`O(n)`，两者效率差距如下图：

![](https://static.vue-js.com/a43c9960-ec91-11eb-ab90-d9ae814b240d.png)

`react`中`diff`算法主要遵循三个层级的策略：

### tree层级

- `DOM`节点跨层级的操作不做优化，只会对相同层级的节点进行比较
    
    ![](https://static.vue-js.com/ae71d1c0-ec91-11eb-85f6-6fac77c0c9b3.png)
    
- 只有删除、创建操作，没有移动操作，如下图：
`react`发现新树中，R节点下没有了A，那么直接删除A，在D节点下创建A以及下属节点
上述操作中，只有删除和创建操作
    
    ![](https://static.vue-js.com/b85f2bb0-ec91-11eb-ab90-d9ae814b240d.png)
    

### conponent 层级

- 如果是同一个类的组件，则会继续往下`diff`运算，如果不是一个类的组件，那么直接删除这个组件下的所有子节点，创建新的
    
    ![](https://static.vue-js.com/c1fcdf00-ec91-11eb-ab90-d9ae814b240d.png)
    
- 当`component D`换成了`component G` 后，即使两者的结构非常类似，也会将`D`删除再重新创建`G`

### element 层级

对于比较同一层级的节点们，每个节点在对应的层级用唯一的`key`作为标识

提供了 3 种节点操作，分别为 `INSERT_MARKUP`(插入)、`MOVE_EXISTING` (移动)和 `REMOVE_NODE` (删除)

如下场景：

![](https://static.vue-js.com/cae1c9a0-ec91-11eb-ab90-d9ae814b240d.png)

通过`key`可以准确地发现新旧集合中的节点都是相同的节点，因此无需进行节点删除和创建，只需要将旧集合中节点的位置进行移动，更新为新集合中节点的位置

流程如下表：

![](https://static.vue-js.com/d34c5420-ec91-11eb-85f6-6fac77c0c9b3.png)

- index： 新集合的遍历下标。
- oldIndex：当前节点在老集合中的下标
- maxIndex：在新集合访问过的节点中，其在老集合的最大下标

如果当前节点在新集合中的位置比老集合中的位置靠前的话，是不会影响后续节点操作的，这里这时候被动字节不用动

操作过程中只比较oldIndex和maxIndex，规则如下：

- 当oldIndex>maxIndex时，将oldIndex的值赋值给maxIndex
- 当oldIndex=maxIndex时，不操作
- 当oldIndex<maxIndex时，将当前节点移动到index的位置

`diff`过程如下：

- 节点B：此时 maxIndex=0，oldIndex=1；满足 maxIndex< oldIndex，因此B节点不动，此时maxIndex= Math.max(oldIndex, maxIndex)，就是1
- 节点A：此时maxIndex=1，oldIndex=0；不满足maxIndex< oldIndex，因此A节点进行移动操作，此时maxIndex= Math.max(oldIndex, maxIndex)，还是1
- 节点D：此时maxIndex=1, oldIndex=3；满足maxIndex< oldIndex，因此D节点不动，此时maxIndex= Math.max(oldIndex, maxIndex)，就是3
- 节点C：此时maxIndex=3，oldIndex=2；不满足maxIndex< oldIndex，因此C节点进行移动操作，当前已经比较完了

当ABCD节点比较完成后，`diff`过程还没完，还会整体遍历老集合中节点，看有没有没用到的节点，有的话，就删除

### 三、注意事项

对于简单列表渲染而言，不使用`key`比使用`key`的性能，例如：

将一个[1,2,3,4,5]，渲染成如下的样子：

```html
<div>1</div>
<div>2</div>
<div>3</div>
<div>4</div>
<div>5</div>
```

后续更改成[1,3,2,5,4]，使用`key`与不使用`key`作用如下：

```html
1.加key<div key='1'>1</div>             <div key='1'>1</div><div key='2'>2</div>             <div key='3'>3</div><div key='3'>3</div>  ========>  <div key='2'>2</div><div key='4'>4</div>             <div key='5'>5</div><div key='5'>5</div>             <div key='4'>4</div>操作：节点2移动至下标为2的位置，节点4移动至下标为4的位置。2.不加key<div>1</div>             <div>1</div><div>2</div>             <div>3</div><div>3</div>  ========>  <div>2</div><div>4</div>             <div>5</div><div>5</div>             <div>4</div>操作：修改第1个到第5个节点的innerText
```

如果我们对这个集合进行增删的操作改成[1,3,2,5,6]

```html
1.加key
<div key='1'>1</div>             <div key='1'>1</div>     
<div key='2'>2</div>             <div key='3'>3</div>  
<div key='3'>3</div>  ========>  <div key='2'>2</div>  
<div key='4'>4</div>             <div key='5'>5</div>  
<div key='5'>5</div>             <div key='4'>4</div>  
操作：节点2移动至下标为2的位置，节点4移动至下标为4的位置。

2.不加key
<div>1</div>             <div>1</div>     
<div>2</div>             <div>3</div>  
<div>3</div>  ========>  <div>2</div>  
<div>4</div>             <div>5</div>  
<div>5</div>             <div>4</div>  
操作：修改第1个到第5个节点的innerText
```

由于`dom`节点的移动操作开销是比较昂贵的，没有`key`的情况下要比有`key`的性能更好

[手把手教你学会react-diff原理](https://zhuanlan.zhihu.com/p/140489744)

[React 源码剖析系列 － 不可思议的 react diff](https://zhuanlan.zhihu.com/p/20346379)

## Real DOM VS Virtual DO

### 一、是什么

Real DOM，真实 `DOM`，意思为文档对象模型，是一个结构化文本的抽象，在页面渲染出的每一个结点都是一个真实 `DOM` 结构，如下：

![](https://static.vue-js.com/fc7ba8d0-d302-11eb-85f6-6fac77c0c9b3.png)

`Virtual Dom`，本质上是以 `JavaScript` 对象形式存在的对 `DOM` 的描述

创建虚拟 `DOM` 目的就是为了更好将虚拟的节点渲染到页面视图中，虚拟 `DOM` 对象的节点与真实 `DOM` 的属性一一照应

在 `React` 中，`JSX` 是其一大特性，可以让你在 `JS` 中通过使用 `XML` 的方式去直接声明界面的 `DOM` 结构

```jsx
// 创建 h1 标签，右边千万不能加引号
const vDom = <h1>Hello World</h1>;
// 找到 <div id="root"></div> 节点
const root = document.getElementById("root");
// 把创建的 h1 标签渲染到 root 节点上
ReactDOM.render(vDom, root);
```

上述中，`ReactDOM.render()` 用于将你创建好的虚拟 `DOM` 节点插入到某个真实节点上，并渲染到页面上

`JSX` 实际是一种语法糖，在使用过程中会被 `babel` 进行编译转化成 `JS` 代码，上述 `VDOM` 转化为如下：

```jsx
const vDom = React.createElement(
  'h1'，
  { className: 'hClass', id: 'hId' },
  'hello world'
)
```

可以看到，`JSX` 就是为了简化直接调用 `React.createElement()` 方法：

- 第一个参数是标签名，例如 h1、span、table…
- 第二个参数是个对象，里面存着标签的一些属性，例如 id、class 等
- 第三个参数是节点中的文本

通过 `console.log(VDOM)`，则能够得到虚拟 `VDOM` 消息

![](https://static.vue-js.com/1716b9a0-d303-11eb-ab90-d9ae814b240d.png)

所以可以得到，`JSX` 通过 `babel` 的方式转化成 `React.createElement` 执行，返回值是一个对象，也就是虚拟 `DOM`

### 二、区别

两者的区别如下：

- 虚拟 DOM 不会进行排版与重绘操作，而真实 DOM 会频繁重排与重绘
- 虚拟 DOM 的总损耗是“虚拟 DOM 增删改+真实 DOM 差异增删改+排版与重绘”，真实 DOM 的总损耗是“真实 DOM 完全增删改+排版与重绘”

拿[以前文章](https://mp.weixin.qq.com/s?__biz=MzU1OTgxNDQ1Nw==&mid=2247484516&idx=1&sn=965a4ce32bf93adb9ed112922c5cb8f5&chksm=fc10c632cb674f2484fdf914d76fba55afcefca3b5adcbe6cf4b0c7fd36e29d0292e8cefceb5&scene=178&cur_album_id=1711105826272116736#rd)举过的例子：

传统的原生 `api` 或 `jQuery` 去操作 `DOM` 时，浏览器会从构建 `DOM` 树开始从头到尾执行一遍流程

当你在一次操作时，需要更新 10 个 `DOM` 节点，浏览器没这么智能，收到第一个更新 `DOM` 请求后，并不知道后续还有 9 次更新操作，因此会马上执行流程，最终执行 10 次流程

而通过 `VNode`，同样更新 10 个 `DOM` 节点，虚拟 `DOM` 不会立即操作 `DOM`，而是将这 10 次更新的 `diff` 内容保存到本地的一个 `js` 对象中，最终将这个 `js` 对象一次性 `attach` 到 `DOM` 树上，避免大量的无谓计算

### 三、优缺点

真实 `DOM` 的优势：

- 易用

缺点：

- 效率低，解析速度慢，内存占用量过高
- 性能差：频繁操作真实 DOM，易于导致重绘与回流

使用虚拟 `DOM` 的优势如下：

- 简单方便：如果使用手动操作真实 `DOM` 来完成页面，繁琐又容易出错，在大规模应用下维护起来也很困难
- 性能方面：使用 Virtual DOM，能够有效避免真实 DOM 数频繁更新，减少多次引起重绘与回流，提高性能
- 跨平台：React 借助虚拟 DOM，带来了跨平台的能力，一套代码多端运行

缺点：

- 在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化
- 首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算，速度比正常稍慢

[虚拟DOM和真实DOM的区别 - 掘金](https://juejin.cn/post/6844904052971536391)