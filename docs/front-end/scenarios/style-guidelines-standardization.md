# 样式规范统一化的实现

## 目标
- 跨项目/团队风格一致（命名/层级/变量/主题）。
- 可演进与可度量：Lint 可落地，设计 Token 可复用。
- 降低回归风险：主题切换/品牌换肤最小化修改面。

## CSS 架构与命名
- BEM：`block__element--modifier`，示例：`btn__icon--primary`。
- ITCSS 层次：Settings（tokens）→ Tools（mixins）→ Generic（reset）→ Elements → Objects（布局/模式）→ Components → Utilities（原子）。
- 防冲突：作用域（CSS Modules）或命名空间前缀（如 `c-` 组件、`u-` 工具）。

## 设计 Token 与主题
在 `:root` 定义平台 Token，通过主题作用域切换：
```css
:root{
  --color-text: #111;
  --color-bg: #fff;
  --radius-md: 8px;
  --space-2: .5rem;
}
html.dark{
  --color-text: #eee;
  --color-bg: #111;
}
.btn{color:var(--color-text);background:var(--color-bg);border-radius:var(--radius-md)}
```
建议配合 Style Dictionary/Token Studio 输出多平台变量（CSS/JS/Android/iOS）。

## 技术栈选择
- CSS Modules：局部样式 + 构建期隔离；
- CSS-in-JS（Emotion/Styled Components）：动态主题与变量注入；
- Utility-first（Tailwind）：原子类统一语义与密度；
- 选择一主一辅，避免混用失控；约定“边界”（如仅在组件下允许 CSS-in-JS）。

## Lint 与格式化
Stylelint + Prettier，结合 BEM/排序规则：
```js
// .stylelintrc.cjs
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-prettier'
  ],
  rules: {
    'selector-class-pattern': [
      '^[a-z]([a-z0-9]+)?(__[a-z0-9]+)?(--[a-z0-9]+)?$',
      { message: 'Expected BEM naming (block__element--modifier)' }
    ],
    'color-named': 'never',
    'scale-unlimited/declaration-strict-value': [
      ['/color/', 'z-index', 'font-size'],
      { disableFix: true }
    ]
  }
}
```
配合 Husky + lint-staged 在提交前执行：
```json
{
  "lint-staged": {
    "**/*.{css,scss}": "stylelint --fix",
    "**/*.{js,ts,tsx,vue}": "prettier --write"
  }
}
```

## 组件库与文档
- 使用 Storybook 构建组件文档与可视回归（Chromatic/Playwright）。
- 每个组件演示：默认/悬停/禁用/主题切换/国际化示例。
- 变更日志与版本：SemVer + Changesets/Release-please。

## 落地流程（建议）
1) 规范 v1：确定命名、层次、Token；产出示例与模板；
2) 工具链：Stylelint/Prettier/Husky 集成到模板仓库；
3) 组件库：抽取通用样式与主题变量；
4) CI 检查：样式 Lint、Bundle 体积、视觉回归；
5) 推广：PR 模板检查规范项，新增页面必附 Story 与截图；
6) 迭代：收集指标（Bug/回滚/PR 拒绝原因），季度回顾优化。

## 延伸阅读
- ../performance/README.md
- ../frameworks/comparisons.md
- ../foundations/browser.md
