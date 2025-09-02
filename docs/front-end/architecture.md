# 前端知识体系与文档架构总览

> 目的：给 docs/front-end 下现有内容一个统一的“地图”，明确分层、建立导航与交叉引用，并提出结构优化建议，便于查找与持续扩展。

## 分层模型（What & Where）

```mermaid
graph TD
  P[Browser/Runtime<br/>浏览器与运行时] --> UI[UI/View<br/>框架与组件]
  UI --> STATE[State Mgmt<br/>状态管理]
  UI --> ROUTE[Routing<br/>路由]
  UI --> DATA[Data Access<br/>Fetch/Axios/WebSocket]
  DATA <--> NET[Network<br/>HTTP/CORS/WebSocket]
  P -.-> PERF[Performance]
  UI -.-> PERF
  DATA -.-> PERF
  UI -.-> TEST[Testing]
  DATA -.-> TEST
  UI -.-> SEC[Security]
  DATA -.-> SEC
  TOOL[Tooling/Build<br/>工程与构建] -.-> UI
  TOOL -.-> DATA
  VIZ[Visualization
  (ECharts/Canvas/SVG)] -.-> UI
  SCN[Scenarios/Best Practices] -.-> UI
```

## 文档映射（现有内容一览）

- 浏览器基础与渲染：`docs/front-end/browser.md`
- 前端网络与跨域：`docs/front-end/foundations/network.md`
  - 相关网络分层：`docs/network/network-carrier/application-layer.md`
- Web 安全：`docs/front-end/web-security/README.md`
- Web 性能：`docs/front-end/performance/README.md`
- 工程与构建（模块化/打包）：`docs/front-end/tooling/modules-and-bundling/README.md`
- 框架与生态：
  - React：`docs/front-end/frameworks/react/README.md`
  - Vue：`docs/front-end/frameworks/vue/README.md`
- 可视化：`docs/front-end/visualization/README.md`
- 场景与实践：`docs/front-end/scenarios/auth-and-loading.md`
- 测试与工具：`docs/front-end/tooling/testing/README.md`
- 资源与链接集合：`docs/front-end/resources/README.md`

## 推荐学习路径（从基础到实践）

1) 浏览器与网络基础 → 2) 安全与性能 → 3) 框架与状态/路由 → 4) 工程化与测试 → 5) 可视化与业务场景

```mermaid
graph LR
  A[Browser & Render<br/>浏览器与渲染] --> B[Network/CORS<br/>网络与跨域]
  B --> C[Security & Perf<br/>安全与性能]
  C --> D[React/Vue + State/Router]
  D --> E[Tooling/Build + Testing]
  E --> F[Visualization + Scenarios]
```

对应文档：

- A：`browser.md`
- B：`foundations/network.md`（可对齐 `../network/network-carrier/application-layer.md`）
- C：`web-security/README.md`，`performance/README.md`
- D：`frameworks/react/*`，`frameworks/vue/*`
- E：`tooling/modules-and-bundling/README.md`，`tooling/testing/README.md`
- F：`visualization/README.md`，`scenarios/auth-and-loading.md`

## 结构优化建议（可逐步落地）

1) 建立入口与导航
- 在 `docs/front-end` 增设 `README.md` 作为索引页，收录本文件与各主题入口，统一风格与目录。

2) 目录分组与命名规范（kebab-case，目录内用 README.md）

建议结构：

```
docs/front-end/
  README.md                 # 入口索引（概览、导航、贡献约定）
  artecture.md             # 本文（可后续更名为 architecture.md）
  foundations/
    browser.md
    network.md             # 由 front-end-network.md 重命名或合并到 docs/network
    security/README.md     # 由 web-security/ 迁移或保留原路径
  frameworks/
    react/...
    vue/...
    comparisons.md
  performance/README.md
  tooling/
    bundlers-and-modules.md  # 由 web-module/README.md 拆分/重命名
    testing/README.md        # 由 web-test.md 迁移
  visualization/README.md    # 由 visualization.md 迁移
  scenarios/
    auth-and-loading.md      # 由 web-scenario.md 按主题拆分（登录/加载 等）
  resources/README.md        # 由 web-resource/ 迁移；图片放 /assets
  assets/                    # 图片统一收纳
```

3) 文档去重与交叉引用
- `front-end-network.md` 与 `../network/*` 存在知识重叠：
  - 前端侧保留“同源/CORS、浏览器并发限制、前端跨域方案汇总与代码片段”。
  - 深度协议/分层放到 `docs/network`，在前端文档中做“进一步阅读”链接。

4) 命名与风格统一
- 文件：统一使用英文 kebab-case（示例：`front-end-network.md` → `network.md`）。
- 目录：每个目录使用 `README.md` 作为默认入口。
- 模块化：章节末尾统一加“See also / 延伸阅读”交叉链接（相对路径）。

5) 内容拆分与定位
- `web-scenario.md` 建议拆分为多个“场景卡”（如：认证与登录、页面加载与缓存、国际化、图片与资源优化等），统一落位在 `scenarios/`。
- `web-module/README.md` 建议按“模块规范/打包器/性能策略/插件实践”拆为 2–3 篇，放入 `tooling/`。

6) 资产与链接
- 将散落在 `web-module/`、`web-resource/` 的图片统一迁移到 `assets/`，避免跨目录相对路径易断裂。
- 外链集中在 `resources/README.md`，正文以“延伸阅读”短清单引用。

7) 最小代价实施顺序（安全可回滚）
- 第一步：新增 `README.md` 入口与本文件的导航；在现有文档页底部添加互链（非移动）。
- 第二步：新增 `scenarios/` 目录并复制（非移动）首个登录/加载场景，验证链接无死链后再切换入口。
- 第三步：完成 `tooling/testing` 目录复制与链接替换；最后执行批量重命名与图片迁移。

## 快速导航（Cross-links）

- 浏览器与存储/渲染/事件循环：`./foundations/browser.md`
- 网络与跨域：`./foundations/network.md`
- Web 安全：`./foundations/security/README.md`
- Web 性能：`./performance/README.md`
- React 全家桶：`./frameworks/react/README.md`
- Vue 学习笔记：`./frameworks/vue/README.md`
- 模块与打包：`./tooling/modules-and-bundling/README.md`
- 测试工具：`./tooling/testing/README.md`
- 可视化：`./visualization/README.md`
- 业务场景：`./scenarios/auth-and-loading.md`，`./scenarios/page-navigation.md`，`./scenarios/input-change-listening.md`，`./scenarios/pull-to-refresh-and-infinite-scroll.md`，`./scenarios/qr-code-login.md`，`./scenarios/resource-preloading.md`，`./scenarios/internationalization-language-switching.md`，`./scenarios/data-display-optimization.md`
- 资源清单：`./resources/README.md`

---

说明：本文件已采用标准拼写 `architecture.md` 并与目录重构同步更新导航。
