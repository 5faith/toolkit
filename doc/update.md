# 更新记录

## 2026-04-29

- 新增 Text Diff 工具：纯文本并排对比，字符级差异高亮，使用 diff-match-patch 库

## 2026-04-27

- `json-xml-formatter`: 添加粘贴自动格式化功能。在 Input 编辑器中粘贴内容后，自动触发 Format，无需手动点击按钮。
- `json-xml-formatter`: 添加 JSON 路径查询功能。支持点号路径语法（如 `users[0].name`），在 Output 面板顶部输入路径并点击 Get 或回车，查询结果单独显示在右侧 Result 面板（与 Input、Output 并列三列布局，带 Copy/Close 按钮），Output 区域始终保留完整格式化 JSON。XML 模式下自动禁用。
- `json-xml-formatter`: 优化三列布局宽度。container 最大宽度从 1200px 扩展至 1500px，Input/Output/Result 列比例调整为 `1.2fr : 1.2fr : 0.65fr`，增大间距和最小高度，缓解 JSON 内容折行问题。
- 全局：为所有页面添加 favicon 图标引用（`favicon.ico` 已存在于项目根目录）。
- 全局：将 `css/style.css` 中 `.container` 的 `max-width` 从 `1200px` 统一提升至 `1500px`，确保所有页面（首页及所有工具页）宽度一致，移除 `json-xml-formatter/style.css` 中的局部覆盖。
