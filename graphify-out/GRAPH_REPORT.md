
# Toolkit 项目知识图谱报告

## 概述
这是一个纯前端程序员工具箱项目，采用无框架架构设计，包含多个开发常用工具。

## God Nodes (核心节点)

### 1. Toolkit (核心根节点)
- 描述: 整个项目的中心入口点
- 文件: `index.html`
- 连接: 指向所有工具和系统

### 2. Sidebar System (通用侧边栏系统)
- 描述: 所有工具共享的侧边栏组件
- 文件: `js/sidebar.js`
- 关键概念: initSidebar(), TOOLS 数组, 动态路径计算

### 3. Global Styles (全局样式系统)
- 描述: Cursor 风格设计规范
- 文件: `css/style.css`, `DESIGN.md`
- 关键概念: 暖色极简, #f2f1ed, #26251e, 三字体系统

---

## Communities (社区结构)

### Community 0: Text Diff 工具
- 工具: `tools/text-diff/
- 技术: diff-match-patch, 字符级高亮, 并排对比
- 文件: index.html, style.css, script.js

### Community 1: Stream Player 工具
- 工具: `tools/stream-player/
- 技术: FLV.js, 视频流播放
- 文件: index.html, style.css, script.js, lib/flv.min.js

### Community 2: JSON/XML Formatter 工具
- 工具: `tools/json-xml-formatter/
- 技术: 语法高亮, 格式化, 压缩
- 文件: index.html, style.css, script.js

### Community 3: WebSocket Debugger 工具
- 工具: `tools/websocket-debugger/
- 技术: WebSocket 连接, 消息发送/接收
- 文件: index.html, style.css, script.js

### Community 4: Timestamp Tool 工具
- 工具: `tools/timestamp-tool/
- 技术: 时间戳/日期转换
- 文件: index.html, style.css, script.js

### Community 5: 设计规范与项目文档
- 文件: DESIGN.md, AGENTS.md, README.md, doc/*.md
- 关键概念: Cursor 风格, 无框架原则, 文档规范

---

## Surprising Connections (意外连接)

1. **工具共享结构一致性**
   - 所有工具严格遵循 `tools/<tool-id>/index.html` → `style.css` → `script.js` 模式
   - 每个工具都通过 `initSidebar()` 统一初始化侧边栏
   - 连接源: `AGENTS.md` → 所有工具结构

2. **设计规范统一执行**
   - `DESIGN.md` → `css/style.css` → 所有工具样式一致性
   - 暖色极简原则贯彻全局, 包括错误颜色 #cf2d56, 强调色 #f54e00

3. **项目历史演变**
   - 早期移除 WebRTC 功能 (因 CORS 信令问题)
   - 文档中有完整决策记录

4. **第三方库引入原则**
   - 仅在必要时引入最小专用库 (diff-match-patch, flv.js)
   - 坚决拒绝框架, 偏好原生实现

---

## Suggested Questions (建议问题)

1. 如何确保新增工具严格符合现有架构和设计规范？
2. 未来引入新工具时，如何平衡框架决策标准是什么？
3. 项目如何支持快速添加新工具？
4. 历史架构决策对当前工具开发的影响？
5. 如何保持所有工具的视觉/交互一致性？

---

## Raw Graph Structure (原始图谱结构)

Nodes (节点列表):

```
- Toolkit
- Sidebar System
- Global Styles
- Text Diff Tool
- Stream Player Tool
- JSON/XML Formatter Tool
- WebSocket Debugger Tool
- Timestamp Tool Tool
- Design Guidelines
- Project Documentation
- diff-match-patch
- flv.js
```

Edges (边关系):
```
Toolkit → uses → Sidebar System
Toolkit → uses → Global Styles
Toolkit → includes → Text Diff Tool
Toolkit → includes → Stream Player Tool
Toolkit → includes → JSON/XML Formatter Tool
Toolkit → includes → WebSocket Debugger Tool
Toolkit → includes → Timestamp Tool Tool
Sidebar System → documented in → Project Documentation
Global Styles → specified in → Design Guidelines
Text Diff Tool → uses → diff-match-patch
Stream Player Tool → uses → flv.js
All Tools → follow → Design Guidelines
```

---
