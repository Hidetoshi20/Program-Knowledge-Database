# Webpack 常见插件

下面列举常见插件的背景、作用与基础用法（按需取舍与组合）。

## 1. HTML 文件生成：html-webpack-plugin

- 背景：多入口场景下，产物文件名含 `[hash]`，手动维护 HTML 引用困难。
- 作用：自动生成/基于模板生成 `index.html`，注入产物脚本/样式。

安装：

```bash
npm install --save-dev html-webpack-plugin
```

配置：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hello Webpack',
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/favicon.ico',
      hash: true,
      inject: 'body',
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      cache: true,
      showErrors: true,
      chunks: ['index'],
    }),
  ],
};
```

## 2. 图片压缩：imagemin-webpack-plugin

- 背景：图片体积过大影响加载与存储。
- 作用：构建时批量压缩图片。

安装：

```bash
npm install --save-dev imagemin-webpack-plugin
```

配置：

```js
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
  plugins: [
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production',
      pngquant: { quality: '95-100' },
    }),
  ],
};
```

## 3. 清理产物目录：clean-webpack-plugin

- 背景：每次打包前需要清空输出目录。
- 作用：构建前清理 `output` 目录。

安装：

```bash
npm install --save-dev clean-webpack-plugin
```

配置：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [new CleanWebpackPlugin()],
};
```

## 4. 全局变量提供：webpack.ProvidePlugin（内置）

- 背景：在多个模块中重复 import 全局库麻烦。
- 作用：自动为模块注入变量，无需手动 import。

配置：

```js
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      React: 'react',
      ReactDOM: 'react-dom',
      Component: ['react', 'Component'],
    }),
  ],
};
```

## 5. 公共代码抽取：optimization.splitChunks（内置）

- 背景：第三方库与公共模块在多入口/多页面场景重复打包。
- 作用：将可复用代码提取为独立 chunk，减少重复与提升缓存命中。

配置：

```js
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 100,
        },
        common: {
          chunks: 'all',
          test: /[\\/]src[\\/]js[\\/]/,
          name: 'common',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1,
        },
      },
    },
    // 提取 runtime，提升长效缓存
    runtimeChunk: { name: 'manifest' },
  },
};
```

## 6. 提取 CSS：mini-css-extract-plugin（生产推荐）

- 背景：将 CSS 打包进 JS 不利于缓存与首屏。
- 作用：提取独立 CSS 文件。

安装：

```bash
npm install --save-dev mini-css-extract-plugin
```

简单配置：

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
```

注意：开发模式下不建议使用（不支持 HMR）。

## 7. CSS 摇树/去冗余：purifycss-webpack

- 背景：样式冗余。
- 作用：分析模板引用，去除未使用的 CSS。

安装：

```bash
npm install --save-dev purifycss-webpack glob
```

配置：

```js
const PurifyCSS = require('purifycss-webpack');
const glob = require('glob');
const path = require('path');

module.exports = {
  plugins: [
    new PurifyCSS({ paths: glob.sync(path.resolve('./src/*.html')) }),
  ],
};
```

提示：通常按顺序处理「HTML 生成 → CSS 提取 → CSS 摇树」。

## 8. 复制静态资源：copy-webpack-plugin

- 背景：将图片/字体等静态资源拷贝到产物目录。
- 作用：复制文件/目录到输出路径。

安装：

```bash
npm install --save-dev copy-webpack-plugin
```

配置：

```js
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: 'dist' },
        { from: 'other/xx.js', to: 'dist' },
      ],
    }),
  ],
};
```

