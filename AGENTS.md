# AGENTS.md

## 项目

- 名称: toolkit (tooljit)
- 描述: Programmer's Daily Toolkit
- 技术栈: 纯前端 (HTML/CSS/JS)，无框架，无构建工具
- 终端: Git Bash (Windows)

## 目录结构

```
toolkit/
├── index.html              # 首页 - 工具卡片导航
├── css/style.css           # 全局样式
├── js/sidebar.js           # 通用侧边栏组件
├── lib/                    # 共享第三方库
└── tools/
    └── <tool-id>/
        ├── index.html
        ├── style.css
        ├── script.js
        └── lib/            # 工具专用第三方库（如 flv.min.js）
```

## 开发命令

- 无构建/测试/lint 流程，直接通过浏览器打开 `index.html` 或启动本地静态服务器验证
- 无 CI/CD 配置

## 添加工具

1. 在 `tools/` 下创建文件夹 `tools/<tool-id>/`，包含 `index.html`、`style.css`、`script.js`
2. 在 `js/sidebar.js` 的 `TOOLS` 数组中注册新工具（`id`、`name`、`path`）
3. 工具页面 `<head>` 中引入：
   - `../../css/style.css`（全局样式）
   - `style.css`（工具样式）
4. 工具页面底部引入脚本：
   - `../../js/sidebar.js`
   - `script.js`
5. 在 `DOMContentLoaded` 中调用 `initSidebar('<tool-id>')`
6. 工具切换通过完整页面跳转（`<a href="tools/...">`），不在同一页面内切换

## 侧边栏路径机制

- `js/sidebar.js` 通过 URL 中 `tools` 出现次数动态计算 `../` 深度
- `TOOLS` 数组中的 `path` 是相对于 `tools/` 目录的路径（如 `stream-player/index.html`）
- 不要在 `path` 中加 `tools/` 前缀，sidebar 会自动拼接

## 设计规范

- 严格遵循 `DESIGN.md`（Cursor 风格暖色极简主义）
- 关键色：背景 `#f2f1ed`，文字 `#26251e`，强调 `#f54e00`，错误/悬停 `#cf2d56`
- 边框使用 `oklab()` 色空间或 `rgba(38, 37, 30, alpha)` 回退
- 三字体系统：CursorGothic（标题/UI）、jjannon（正文）、berkeleyMono（代码）

## 依赖原则

- 尽量少引入第三方包
- 仅当第三方包性能远高于原生 JS 实现时才允许引入
- 第三方 JS 库存放于 `lib/` 或工具目录下的 `lib/` 子目录

## 现有工具

- `json-xml-formatter`: JSON/XML 格式化、压缩、语法高亮、树形视图
- `timestamp-tool`: 当前时间戳、时间戳与日期互转
- `websocket-debugger`: WebSocket 连接调试、消息收发、自动重连、心跳
- `flv-player`: FLV 流播放（使用本地 flv.js），仅支持 FLV，不支持 WebRTC

## 注意事项

- WebRTC 曾因 CORS 信令问题被移除（jswebrtc 需要 HTTP POST 到 SRS 服务器，跨域时无法配置 CORS）
- 纯前端项目，无服务端，所有工具在浏览器端运行
- Python 格式化: black, 行长度 100（如有 Python 脚本）
