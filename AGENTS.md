# AGENTS.md

## 项目概览

- 项目名: toolkit
- 描述: Programmer's Daily Toolkit
- 状态: 开发中

## 技术栈

- 纯前端项目，使用原生 HTML/CSS/JS，不依赖框架
- 构建工具待定

## 项目架构

```
toolkit/
├── index.html              # 首页 - 工具导航
├── css/style.css           # 全局样式（Cursor 风格）
├── js/sidebar.js           # 通用侧边栏组件
├── lib/                    # 第三方 JS 库
└── tools/                  # 工具目录
    ├── json-xml-formatter/ # JSON/XML 格式化工具
    ├── timestamp-tool/     # 时间戳工具
    ├── websocket-debugger/ # WebSocket 调试工具
    └── stream-player/      # FLV 播放器
        └── lib/            # 工具专用第三方库
            └── flv.min.js  # FLV 播放器库
```

## 开发配置

- 使用 Git Bash 作为默认终端 (Windows)
- Python 格式化: black, 行长度 100
- 编辑器标尺: 80, 120

## Git 忽略

- node_modules/, dist/, yarn.lock
- .env*, .vscode/, .claude/, .opencode/
- public/version-build/

## 开发规范

### 页面设计

- DESIGN.md是项目的设计准则
- 严格按照DESIGN.md要求设计页面

### 依赖引入原则

- 尽量少引入第三方包
- 仅当第三方包性能远高于原生 JS 实现时才允许引入

### 工具组织

- 每个工具对应一个独立文件夹：`tools/<tool-id>/`
- 工具页面使用侧边栏导航，通过 `js/sidebar.js` 统一管理
- 在 `js/sidebar.js` 的 `TOOLS` 数组中注册新工具
- 工具页面调用 `initSidebar('<tool-id>')` 显示侧边栏
- 所有工具通过页面跳转完成切换，不在同一页面内切换

### 现有工具

- `json-xml-formatter`: JSON/XML 格式化工具（支持格式化、压缩、语法高亮、树形视图）
- `timestamp-tool`: 时间戳工具（获取当前时间戳、时间戳与日期互相转换）
- `websocket-debugger`: WebSocket 调试工具（连接管理、消息收发、自动重连、心跳）
- `flv-player`: FLV 播放器（实时 FLV 流播放，使用本地 flv.js）

### 第三方库

- 所有第三方 JS 库存放于 `lib/` 目录或工具专用 `lib/` 子目录
- `flv.js`: Bilibili 开源 FLV 播放器（存放于 `tools/stream-player/lib/flv.min.js`）
