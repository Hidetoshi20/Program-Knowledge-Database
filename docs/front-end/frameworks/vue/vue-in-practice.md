# Vue in Practice

保留原有“实战与模式/反模式/性能优化”内容，聚合常见问答与片段。更多基础与生态请参阅 `basics.md`、`state-management.md`、`router.md`。

## Vuex页面刷新数据丢失

https://juejin.cn/post/7049368117159395336

https://www.cnblogs.com/baoxinyu/p/16925890.html

### Vuex是什么，每个属性是干嘛的，如何使用

Vuex是专门为Vuejs应用程序设计的**状态管理工具**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

具体工作：vuex是一种状态管理机制，将全局组件的共享状态抽取出来为一个store，以一个单例模式存在。vuex更改state的唯一途径是通过mutation，mutation需要commit触发；action 实际触发 mutation，其中 mutation 处理同步任务，action 处理异步任务。

Vuex每个属性：state / getters / mutations / actions / modules / 辅助函数。

### 实现原理要点

- 通过 mixin 在组件 `beforeCreate` 注入 `$store`
- `commit` 注册并触发 mutation 包装函数
- 辅助函数 `mapState/mapGetters/...` 简化访问

### mutation 和 action 区别

同步修改 vs. 提交 mutation（可异步）。详见 `state-management.md`。

## 生命周期中的异步请求选点

通常放在 `created`；如依赖 DOM 则放在 `mounted`。

## 首屏白屏优化清单（摘）

- 路由懒加载
- 压缩与 gzip/CDN
- externals 分离大包
- 移除生产环境 `console`
- Nginx gzip
- Loading 骨架

## ElementUI 常见样式覆盖方式（摘）

- 全局样式表
- 取消 scoped 的局部样式块
- /deep/ 深度选择器
- 内联/类样式（局限大）

