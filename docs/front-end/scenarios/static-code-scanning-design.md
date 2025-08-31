# 静态代码扫描方案设计

## 目标与范围
- 统一代码风格与最佳实践，提前发现缺陷与安全风险。
- PR 阶段自动化把关；本地提交前快速反馈；可持续度量与追踪。

## 工具矩阵（建议组合）
- 语法与风格：ESLint（含 TypeScript 插件）、Prettier、Stylelint。
- 类型与质量：TypeScript 严格模式、(可选) type-coverage。
- 提交规范：Commitlint（Conventional Commits）、lint-staged + Husky。
- 依赖与安全：npm/pnpm/yarn audit、(可选) Snyk/OWASP Dependency-Check、Gitleaks（密钥扫描）。
- 测试与覆盖率：Jest/Vitest + 门禁阈值（lines/branches/statements/functions）。
- 报告与平台：JUnit/LCOV、SARIF（GitHub Code Scanning）、(可选) SonarQube/CodeQL。

## 基础配置片段

package.json（脚本与 lint-staged）
```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "stylelint": "stylelint \"**/*.{css,scss}\"",
    "format": "prettier --check .",
    "format:fix": "prettier --write .",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run --coverage",
    "security:audit": "npm audit --audit-level=moderate || true"
  },
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": ["eslint --fix"],
    "**/*.{css,scss}": ["stylelint --fix"],
    "**/*.{md,json,yml,yaml}": ["prettier --write"]
  }
}
```

.eslintrc.cjs（TS）
```js
module.exports = {
  root: true,
  env: { es2022: true, browser: true, node: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ]
};
```

.stylelintrc.cjs
```js
module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order", "stylelint-config-prettier"]
};
```

commitlint.config.cjs
```js
module.exports = { extends: ["@commitlint/config-conventional"] };
```

Husky 钩子
```bash
# .husky/pre-commit
npx lint-staged

# .husky/commit-msg
npx --no-install commitlint --edit "$1"
```

tsconfig.json（关键严格项）
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## CI 门禁建议
- 触发：pull_request / merge_request。
- 步骤：install → typecheck → lint/stylelint/format → test --coverage → audit。
- 产物：覆盖率报告（LCOV）、测试结果（JUnit，可选）、静态扫描（SARIF，可选）。
- 门禁：Lint 零错误、覆盖率阈值、阻断高危安全告警。

## 渐进式落地
1) 本地先行（Husky + lint-staged），再接入 CI；
2) 设置遗留基线与例外（.eslintignore），模块化推进；
3) autofix/codemod 批量修复；
4) 逐步收紧规则与阈值，透明化指标。

## 延伸阅读
- ../tooling/testing/README.md
- ../frameworks/comparisons.md
- ../performance/README.md
