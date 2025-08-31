# 扫码登录的原理

```mermaid
sequenceDiagram
  participant U as 用户
  participant B as 浏览器(PC)
  participant S as 服务器
  participant M as 手机App

  B->>S: 请求登录页
  S-->>B: 返回二维码(qrKey) + 轮询token
  B->>B: 展示二维码并开始轮询 (poll /ws)
  U->>M: 打开App扫码
  M->>S: 提交 qrKey + 用户凭证(登录态/签名)
  S->>M: 返回待确认
  U->>M: 确认登录
  M->>S: 确认授权
  S->>B: 通过轮询/WS 通知授权成功，签发会话(token/cookie)
  B->>S: 携带 token 完成会话建立
```

## 安全要点
- 一次性 `qrKey`，短时效 + 状态机（未扫描/已扫描待确认/已确认/过期）；
- 绑定设备/用户签名，防止重放；
- HTTPS 全程、CSRF 防护、同源限制；
- 过期/撤销与多端互踢策略。

## 技术实现
- 通道：轮询、长轮询、WebSocket、SSE；
- 存储：`qrKey` 状态存储（Redis）与发布订阅；
- 体验：二维码过期倒计时与刷新；扫描后立即变更为“已扫描，等待确认”。

## 延伸阅读
- [Web 安全](../foundations/security/README.md)
- [前端网络](../foundations/network.md)
