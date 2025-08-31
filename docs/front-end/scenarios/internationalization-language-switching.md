# 国际化与语言切换（i18n）

## 场景与目标
- 多语言 UI 与文案管理；按用户偏好/浏览器语言自动选择；可运行时切换，无需刷新。

## 方案对比
- 独立多份站点：按语言分目录构建与发布（优点：隔离彻底；缺点：重复代码与资源、维护成本高）。
- 前端 i18n 库：i18next、react-intl、vue-i18n（优点：运行时切换、按需加载；缺点：需要规范 key 与资源管理）。
- 服务端渲染/中间层：在边缘或网关做内容协商（Accept-Language）并注入语言包。

## 实施要点
- 资源组织：`/locales/{en,zh}/common.json`，分模块拆分，使用命名空间。
- 运行时切换：将 `locale` 存储在 `localStorage` 或 Cookie；首次从 URL、Cookie、浏览器首选项推断。
- 按需加载：`import(/* webpackChunkName: "i18n-[locale]" */ ../locales/${locale}/common.json)`。
- 格式化：使用 `Intl.*` 处理日期、数字、货币与复数（plural rules）。
- RTL 支持：通过 `dir=rtl` 与样式变量切换方向性。

## 代码片段（以 i18next 为例）
```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export async function setupI18n(locale: string) {
  const resources = await import(`../locales/${locale}/common.json`);
  await i18n.use(initReactI18next).init({
    lng: locale,
    fallbackLng: 'en',
    resources: { [locale]: { common: resources } },
    defaultNS: 'common'
  });
}
```

## 体验与 SEO
- URL 规范：`/en/...`、`/zh/...` 或 `?lang=en`；SSR 场景下采用路径更友好于 SEO。
- 元信息：`<html lang="en">` 与 hreflang 链接指示搜索引擎。

## 延伸阅读
- [浏览器基础](../foundations/browser.md)
- [性能优化](../performance/README.md)
