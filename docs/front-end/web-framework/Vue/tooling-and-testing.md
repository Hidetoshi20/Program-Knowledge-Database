# 工具与测试

## Vitest 概览

Vitest 是基于 Vite 的极速单元测试框架，适合 Vue 项目：
- 原生 ESM，启动快
- 与 Vite 配置共享，前端依赖零摩擦
- 良好 TypeScript 支持

最小可运行用例：

```javascript
// sum.test.js
import { describe, it, expect } from 'vitest'

describe('sum', () => {
  it('adds numbers', () => {
    const sum = (a, b) => a + b
    expect(sum(1, 2)).toBe(3)
  })
})
```

## 参考资料

- [部署 | Vue CLI](https://cli.vuejs.org/zh/guide/deployment.html#云开发-cloudbase)
- [juejin.cn 文章 1](https://juejin.cn/post/6844903837774397447)
- [juejin.cn 文章 2](https://juejin.cn/post/6862206197877964807)
- [juejin.cn 文章 3](https://juejin.cn/post/6844904032218120200)


