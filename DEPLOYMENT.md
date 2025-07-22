# 知识库 GitHub Pages 部署方案

本文档将指导您如何使用 **MkDocs** 和 **Material for MkDocs** 主题，将您的 Markdown 知识库部署为一个美观、功能丰富的静态网站，并托管在 GitHub Pages 上。

## 方案优势

- **自动化导航**：根据您的文件夹结构自动生成网站的顶部和侧边导航栏。
- **功能丰富**：开箱即用，支持全文搜索、代码高亮、明暗模式、标签页等。
- **部署简单**：仅需一条命令即可完成网站的构建和部署。
- **高度可定制**：主题提供了丰富的配置选项，可以轻松打造个性化外观。

---

## 部署步骤

### 第 1 步：准备本地环境

您需要在本地计算机上安装 Python 和 pip（Python 的包管理器）。macOS 通常已预装。

1.  **打开终端，检查环境**：
    ```bash
    python3 --version
    pip3 --version
    ```
    如果命令成功执行并返回版本号，则说明环境已就绪。

2.  **安装 MkDocs 和 Material 主题**：
    在终端中运行以下命令来安装所有必要的工具。
    ```bash
    pip3 install mkdocs mkdocs-material
    ```

### 第 2 步：配置 MkDocs

1.  **在项目根目录创建一个配置文件**：
    创建一个名为 `mkdocs.yml` 的文件，这是 MkDocs 的核心配置文件。

2.  **将以下内容复制到 `mkdocs.yml` 文件中**：
    这是根据您当前项目结构定制的基础配置。

    ```yaml
    # 站点信息
    site_name: 个人编程知识库
    site_url: https://hidetoshidekisugi.github.io/Hidetoshi-Program-Knowledge-Database/ # (请替换为您的 GitHub Pages 地址)
    site_author: Hidetoshi Dekisugi # (请替换为您的名字)
    site_description: "一个关于编程、网络、数据库等主题的个人知识库。"

    # 仓库信息
    repo_url: https://github.com/hidetoshidekisugi/Hidetoshi-Program-Knowledge-Database # (请替换为您的 GitHub 仓库地址)
    repo_name: Hidetoshi-Program-Knowledge-Database # (请替换为您的仓库名称)
    edit_uri: "" # 隐藏 "编辑此页" 的链接

    # 版权信息
    copyright: "Copyright &copy; 2024 Hidetoshi Dekisugi" # (可以自定义)

    # 主题配置
    theme:
      name: material
      language: zh # 设置语言为中文
      palette:
        # 支持日间/夜间模式切换
        - media: "(prefers-color-scheme: light)"
          scheme: default
          toggle:
            icon: material/brightness-7
            name: 切换到夜间模式
        - media: "(prefers-color-scheme: dark)"
          scheme: slate
          toggle:
            icon: material/brightness-4
            name: 切换到日间模式
      features:
        - navigation.tabs # 使用顶部标签页作为一级导航
        - navigation.sections # 在侧边栏中将内容分组
        - navigation.expand # 自动展开当前页面的导航
        - navigation.top # "返回顶部" 按钮
        - search.suggest # 搜索建议
        - search.highlight # 高亮搜索结果
        - content.code.annotate # 代码块注释功能
        - content.tabs.link # 可链接到具体标签页

    # Markdown 扩展
    markdown_extensions:
      - pymdownx.highlight:
          anchor_linenums: true
      - pymdownx.inlinehilite
      - pymdownx.snippets
      - pymdownx.superfences
      - admonition
      - toc:
          permalink: true

    # 导航菜单 (MkDocs 会根据此结构生成网站导航)
    # 注意：这里的路径是相对于项目根目录的
    nav:
      - '首页': 'README.md'
      - '编程语言':
        - '总览': 'Program Language/Program Language.md'
        - 'JavaScript': 'Program Language/JS/'
        - 'TypeScript': 'Program Language/TS/'
        - 'CSS': 'Program Language/CSS/'
        - 'HTML': 'Program Language/Html/'
      - '数据库系统':
        - '总览': 'Database Systems/Database.md'
        - '设计、实现与管理': 'Database Systems/Database Systems Design Implementation & Management/'
      - '网络':
        - '总览': 'network_md/network.md'
        - '计算机网络自顶向下': 'network_md/Computer Networking A Top-Down Approach/'
        - '运营商网络': 'network_md/network carrier/'
      - 'Node.js':
        - '总览': 'Node.js/Node.md'
        - 'Learning Node': 'Node.js/Learning Node/'
        - 'Learning Node (服务器端)': 'Node.js/Learning Node Moving The Server Side/'
      - 'Web 前端':
        - '总览': 'Web Front End_md/Web Front End.md'
        - '浏览器': 'Web Front End_md/Browser/'
        - 'Web 框架': 'Web Front End_md/Web Framework/'
        - 'Web 安全': 'Web Front End_md/Web Security/'
        - '其他':
          - '模块化': 'Web Front End_md/Web Module/'
          - '性能': 'Web Front End_md/Web Performance.md'
          - '场景': 'Web Front End_md/Web Scenario/'
          - '测试': 'Web Front End_md/Web Test.md'
      - '操作系统':
        - '总览': 'carrier OS_md/Os.md'
        - 'Carrier OS': 'carrier OS_md/OS/'
      - 'Web 3':
        - '待探索领域': 'Web 3_md/Areas to be explored.md'
        - '探索内容': 'Web 3_md/Areas to be explored/'

    # 由于您的 Markdown 文件在根目录，需要指定 docs_dir
    docs_dir: '.'
    ```

### 第 3 步：本地预览网站

在部署到线上之前，您可以在本地预览效果，并进行调整。

1.  **启动本地服务器**：
    在终端中运行以下命令。
    ```bash
    mkdocs serve
    ```

2.  **在浏览器中打开**：
    命令执行后，您会看到类似 `Serving on http://127.0.0.1:8000` 的输出。在浏览器中访问这个地址，即可看到您的知识库网站。当您修改并保存 Markdown 文件或 `mkdocs.yml` 配置后，网站会自动刷新。

### 第 4 步：构建并部署到 GitHub Pages

当您对本地预览的效果满意后，就可以一键部署了。

1.  **运行部署命令**：
    ```bash
    mkdocs gh-deploy --clean
    ```
    这个命令会自动完成以下工作：
    - 构建所有静态 HTML 文件。
    - 创建一个名为 `gh-pages` 的新分支（如果不存在）。
    - 将构建好的网站内容推送到 `gh-pages` 分支。

### 第 5 步：配置 GitHub 仓库

最后一步是告诉 GitHub 从 `gh-pages` 分支来展示您的网站。

1.  进入您在 GitHub 上的仓库页面。
2.  点击 **Settings** (设置)。
3.  在左侧菜单中选择 **Pages**。
4.  在 **Build and deployment** 部分，将 **Source** (源) 设置为 **Deploy from a branch**。
5.  在 **Branch** (分支) 部分，选择 `gh-pages` 分支和 `/(root)` 目录，然后点击 **Save**。

等待几分钟后，您的知识库网站就应该可以通过您在 `mkdocs.yml` 中配置的 `site_url` 地址公开访问了。

---

部署完成后，您未来的更新流程将非常简单：
1.  在本地修改您的 Markdown 笔记。
2.  运行 `mkdocs gh-deploy --clean` 命令。
3.  网站将自动更新。
