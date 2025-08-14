# Router（React Router）

- 包划分：react-router / react-router-dom / react-router-native / 配置工具
- 常用组件：BrowserRouter/HashRouter、Route、Link/NavLink、Switch、Redirect
- 常用 hooks：useHistory（v5）、useParams、useLocation（v6 对应 useNavigate 等）

模式：
- hash 模式：监听 hashchange；不发请求
- history 模式：HTML5 History API；需服务端兜底到 index.html

参数传递：动态路由、search、对象形式 `to`

原理（简记）：监听 URL 变化 → 匹配 Route → 渲染目标组件
