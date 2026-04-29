# Text Diff Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增一个纯文本并排对比工具，使用 diff-match-patch 库计算字符级差异并高亮显示。

**Architecture:** 在 tools/ 下创建 text-diff 工具目录，包含 index.html、style.css、script.js 和 lib/diff-match-patch.js。页面包含两个文本输入区和一个并排对比结果面板，使用 diff-match-patch 库计算差异后按行对齐渲染。

**Tech Stack:** 纯 HTML/CSS/JS，diff-match-patch 库（本地引入）

---

### Task 1: 下载 diff-match-patch 库到本地

**Files:**
- Create: `tools/text-diff/lib/diff-match-patch.js`

- [ ] **Step 1: 创建目录并下载库**

```bash
mkdir -p "D:\workspace\github-my\toolkit\tools\text-diff\lib"
```

然后下载 diff-match-patch 库。该库的原始来源是 Google Code，现在常用的 npm 包是 `diff-match-patch`。由于无法使用 npm，我们需要手动创建或获取这个文件。

库的核心内容是一个自执行函数，导出 `diff_match_patch` 类。我们可以从以下 CDN 获取：

```bash
curl -L "https://cdn.jsdelivr.net/npm/diff-match-patch@1.0.5/index.js" -o "D:\workspace\github-my\toolkit\tools\text-diff\lib\diff-match-patch.js"
```

如果 curl 不可用，使用 PowerShell：

```powershell
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/diff-match-patch@1.0.5/index.js" -OutFile "D:\workspace\github-my\toolkit\tools\text-diff\lib\diff-match-patch.js"
```

- [ ] **Step 2: 验证文件下载成功**

```bash
ls "D:\workspace\github-my\toolkit\tools\text-diff\lib\diff-match-patch.js"
```

确认文件存在且大小 > 0。

- [ ] **Step 3: Commit**

```bash
git add tools/text-diff/lib/diff-match-patch.js
git commit -m "feat: add diff-match-patch library"
```

---

### Task 2: 创建 index.html

**Files:**
- Create: `tools/text-diff/index.html`

- [ ] **Step 1: 创建 index.html**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Text Diff - toolkit</title>
    <link rel="stylesheet" href="../../css/style.css" />
    <link rel="stylesheet" href="style.css" />
    <link rel="icon" href="../../favicon.ico" />
  </head>
  <body>
    <nav class="nav">
      <div class="container nav__inner">
        <a href="../../index.html" class="nav__brand">toolkit</a>
        <ul class="nav__links">
          <li><a href="../../index.html" class="nav__link">Tools</a></li>
        </ul>
      </div>
    </nav>

    <main class="container" style="padding-top: 32px; padding-bottom: 48px">
      <div class="page-header">
        <h2>Text Diff</h2>
        <p>对比两段文本的差异</p>
      </div>

      <div class="toolbar">
        <div class="toolbar-left">
          <button class="btn btn-small btn-primary" id="compareBtn">
            Compare
          </button>
          <button class="btn btn-small btn-secondary" id="clearBtn">Clear</button>
          <button class="btn btn-small btn-secondary" id="swapBtn">Swap</button>
        </div>
        <div class="toolbar-right">
          <span id="status" class="status"></span>
        </div>
      </div>

      <div class="input-container">
        <div class="input-panel">
          <div class="input-header">Original</div>
          <textarea
            id="originalInput"
            class="input-editor"
            placeholder="Paste original text here..."
          ></textarea>
        </div>
        <div class="input-panel">
          <div class="input-header">Modified</div>
          <textarea
            id="modifiedInput"
            class="input-editor"
            placeholder="Paste modified text here..."
          ></textarea>
        </div>
      </div>

      <div class="diff-container" id="diffContainer">
        <div class="diff-panel">
          <div class="diff-header">Original</div>
          <div class="diff-content" id="originalDiff"></div>
        </div>
        <div class="diff-panel">
          <div class="diff-header">Modified</div>
          <div class="diff-content" id="modifiedDiff"></div>
        </div>
      </div>
    </main>

    <script src="../../js/sidebar.js"></script>
    <script src="lib/diff-match-patch.js"></script>
    <script src="script.js"></script>
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        initSidebar('text-diff');
        if (window.initDiffTool) {
          window.initDiffTool();
        }
      });
    </script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add tools/text-diff/index.html
git commit -m "feat: add text-diff tool page structure"
```

---

### Task 3: 创建 style.css

**Files:**
- Create: `tools/text-diff/style.css`

- [ ] **Step 1: 创建 style.css**

```css
/* ============================================
   Text Diff Tool Styles
   ============================================ */

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 2.25rem;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.page-header p {
  font-family: var(--font-serif);
  font-size: 1.08rem;
  color: rgba(38, 37, 30, 0.55);
}

/* Toolbar */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: var(--color-surface-400);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status {
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(38, 37, 30, 0.55);
}

.status.success {
  color: var(--color-success);
}

.status.error {
  color: var(--color-error);
}

/* Input Container */
.input-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  min-height: 240px;
  margin-bottom: 24px;
}

.input-panel {
  display: flex;
  flex-direction: column;
  background: var(--color-cream);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.input-header {
  padding: 10px 16px;
  background: var(--color-surface-400);
  border-bottom: 1px solid var(--border-primary);
  font-size: 0.81rem;
  font-weight: 500;
  color: rgba(38, 37, 30, 0.7);
}

.input-editor {
  flex: 1;
  width: 100%;
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.67;
  color: var(--color-dark);
  background: var(--color-cream);
  border: none;
  outline: none;
  resize: vertical;
  min-height: 200px;
}

/* Diff Container */
.diff-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  min-height: 300px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.diff-panel {
  display: flex;
  flex-direction: column;
  background: var(--color-cream);
  border-right: 1px solid var(--border-primary);
}

.diff-panel:last-child {
  border-right: none;
}

.diff-header {
  padding: 10px 16px;
  background: var(--color-surface-400);
  border-bottom: 1px solid var(--border-primary);
  font-size: 0.81rem;
  font-weight: 500;
  color: rgba(38, 37, 30, 0.7);
}

.diff-content {
  flex: 1;
  overflow: auto;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.67;
}

/* Diff Lines */
.diff-line {
  display: flex;
  min-height: 1.67em;
  border-bottom: 1px solid var(--border-primary);
}

.diff-line:last-child {
  border-bottom: none;
}

.diff-line.deleted {
  background: rgba(207, 45, 86, 0.08);
}

.diff-line.added {
  background: rgba(31, 138, 101, 0.08);
}

.diff-line.empty {
  background: var(--color-surface-100);
  opacity: 0.5;
}

.line-number {
  display: inline-flex;
  align-items: flex-start;
  justify-content: flex-end;
  width: 48px;
  flex-shrink: 0;
  padding: 0 8px;
  background: var(--color-surface-300);
  color: rgba(38, 37, 30, 0.4);
  user-select: none;
  border-right: 1px solid var(--border-primary);
}

.line-content {
  flex: 1;
  padding: 0 12px;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Character-level highlights */
.diff-char-deleted {
  background: rgba(207, 45, 86, 0.2);
  border-radius: 2px;
}

.diff-char-added {
  background: rgba(31, 138, 101, 0.2);
  border-radius: 2px;
}

/* Responsive */
@media (max-width: 900px) {
  .input-container,
  .diff-container {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .input-editor {
    min-height: 150px;
  }

  .diff-panel {
    border-right: none;
    border-bottom: 1px solid var(--border-primary);
  }

  .diff-panel:last-child {
    border-bottom: none;
  }
}

@media (max-width: 600px) {
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar-right {
    width: 100%;
    justify-content: space-between;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add tools/text-diff/style.css
git commit -m "feat: add text-diff tool styles"
```

---

### Task 4: 创建 script.js - 核心逻辑

**Files:**
- Create: `tools/text-diff/script.js`

- [ ] **Step 1: 创建 script.js**

```javascript
/* ============================================
   Text Diff Tool Script
   ============================================ */

class TextDiffTool {
  constructor() {
    this.dmp = new diff_match_patch();
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
  }

  cacheElements() {
    this.originalInput = document.getElementById('originalInput');
    this.modifiedInput = document.getElementById('modifiedInput');
    this.originalDiff = document.getElementById('originalDiff');
    this.modifiedDiff = document.getElementById('modifiedDiff');
    this.diffContainer = document.getElementById('diffContainer');
    this.compareBtn = document.getElementById('compareBtn');
    this.clearBtn = document.getElementById('clearBtn');
    this.swapBtn = document.getElementById('swapBtn');
    this.status = document.getElementById('status');
  }

  bindEvents() {
    this.compareBtn.addEventListener('click', () => this.compare());
    this.clearBtn.addEventListener('click', () => this.clear());
    this.swapBtn.addEventListener('click', () => this.swap());
  }

  compare() {
    const oldText = this.originalInput.value;
    const newText = this.modifiedInput.value;

    if (!oldText && !newText) {
      this.setStatus('Please enter text to compare', 'error');
      return;
    }

    const diffs = this.dmp.diff_main(oldText, newText);
    this.dmp.diff_cleanupSemantic(diffs);

    const lines = this.alignLines(diffs);
    this.render(lines);
    this.setStatus(`Found ${diffs.length} diff segments`, 'success');
  }

  /**
   * Align diff results into line-by-line format
   * Returns array of { originalLine, modifiedLine, originalContent, modifiedContent, type }
   * type: 'same' | 'deleted' | 'added'
   */
  alignLines(diffs) {
    const lines = [];
    let originalLine = 0;
    let modifiedLine = 0;

    for (const [type, text] of diffs) {
      const textLines = text.split('\n');

      if (type === 0) {
        // Same content
        for (let i = 0; i < textLines.length; i++) {
          originalLine++;
          modifiedLine++;
          lines.push({
            originalLine,
            modifiedLine,
            originalContent: textLines[i],
            modifiedContent: textLines[i],
            type: 'same',
            diffs: [[0, textLines[i]]]
          });
        }
      } else if (type === -1) {
        // Deleted content
        for (let i = 0; i < textLines.length; i++) {
          originalLine++;
          lines.push({
            originalLine,
            modifiedLine: null,
            originalContent: textLines[i],
            modifiedContent: '',
            type: 'deleted',
            diffs: [[-1, textLines[i]]]
          });
        }
      } else if (type === 1) {
        // Added content
        for (let i = 0; i < textLines.length; i++) {
          modifiedLine++;
          lines.push({
            originalLine: null,
            modifiedLine,
            originalContent: '',
            modifiedContent: textLines[i],
            type: 'added',
            diffs: [[1, textLines[i]]]
          });
        }
      }
    }

    return this.mergeAdjacentLines(lines);
  }

  /**
   * Merge adjacent deleted/added lines that correspond to the same position
   * to enable character-level highlighting
   */
  mergeAdjacentLines(lines) {
    if (lines.length === 0) return lines;

    const merged = [];
    let i = 0;

    while (i < lines.length) {
      const current = lines[i];

      // Check if next line is the opposite type at same position
      if (current.type === 'deleted' && i + 1 < lines.length && lines[i + 1].type === 'added') {
        const next = lines[i + 1];
        // Merge into a single line with character-level diffs
        const charDiffs = this.dmp.diff_main(current.originalContent, next.modifiedContent);
        this.dmp.diff_cleanupSemantic(charDiffs);

        merged.push({
          originalLine: current.originalLine,
          modifiedLine: next.modifiedLine,
          originalContent: current.originalContent,
          modifiedContent: next.modifiedContent,
          type: 'modified',
          diffs: charDiffs
        });
        i += 2;
      } else if (current.type === 'added' && i + 1 < lines.length && lines[i + 1].type === 'deleted') {
        const next = lines[i + 1];
        const charDiffs = this.dmp.diff_main(next.originalContent, current.modifiedContent);
        this.dmp.diff_cleanupSemantic(charDiffs);

        merged.push({
          originalLine: next.originalLine,
          modifiedLine: current.modifiedLine,
          originalContent: next.originalContent,
          modifiedContent: current.modifiedContent,
          type: 'modified',
          diffs: charDiffs
        });
        i += 2;
      } else {
        merged.push(current);
        i++;
      }
    }

    return merged;
  }

  render(lines) {
    const originalHTML = [];
    const modifiedHTML = [];

    for (const line of lines) {
      if (line.type === 'same') {
        originalHTML.push(this.renderLine(line.originalLine, line.originalContent, ''));
        modifiedHTML.push(this.renderLine(line.modifiedLine, line.modifiedContent, ''));
      } else if (line.type === 'deleted') {
        originalHTML.push(this.renderLine(line.originalLine, line.originalContent, 'deleted'));
        modifiedHTML.push(this.renderLine('', '', 'empty'));
      } else if (line.type === 'added') {
        originalHTML.push(this.renderLine('', '', 'empty'));
        modifiedHTML.push(this.renderLine(line.modifiedLine, line.modifiedContent, 'added'));
      } else if (line.type === 'modified') {
        originalHTML.push(this.renderLineWithCharDiffs(line.originalLine, line.diffs, 'deleted'));
        modifiedHTML.push(this.renderLineWithCharDiffs(line.modifiedLine, line.diffs, 'added'));
      }
    }

    this.originalDiff.innerHTML = originalHTML.join('');
    this.modifiedDiff.innerHTML = modifiedHTML.join('');
  }

  renderLine(lineNumber, content, type) {
    const lineNum = lineNumber || '';
    return `<div class="diff-line ${type}">
      <span class="line-number">${lineNum}</span>
      <span class="line-content">${this.escapeHtml(content)}</span>
    </div>`;
  }

  renderLineWithCharDiffs(lineNumber, diffs, highlightType) {
    const lineNum = lineNumber || '';
    let contentHTML = '';

    for (const [type, text] of diffs) {
      const escaped = this.escapeHtml(text);
      if (type === 0) {
        contentHTML += escaped;
      } else if (type === -1 && highlightType === 'deleted') {
        contentHTML += `<span class="diff-char-deleted">${escaped}</span>`;
      } else if (type === 1 && highlightType === 'added') {
        contentHTML += `<span class="diff-char-added">${escaped}</span>`;
      }
    }

    return `<div class="diff-line ${highlightType === 'deleted' ? 'deleted' : 'added'}">
      <span class="line-number">${lineNum}</span>
      <span class="line-content">${contentHTML}</span>
    </div>`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  clear() {
    this.originalInput.value = '';
    this.modifiedInput.value = '';
    this.originalDiff.innerHTML = '';
    this.modifiedDiff.innerHTML = '';
    this.setStatus('', '');
  }

  swap() {
    const temp = this.originalInput.value;
    this.originalInput.value = this.modifiedInput.value;
    this.modifiedInput.value = temp;
  }

  setStatus(message, type) {
    this.status.textContent = message;
    this.status.className = `status ${type}`;
  }
}

function initDiffTool() {
  window.diffTool = new TextDiffTool();
}

// Export for global access
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TextDiffTool, initDiffTool };
}
```

- [ ] **Step 2: Commit**

```bash
git add tools/text-diff/script.js
git commit -m "feat: add text-diff tool logic"
```

---

### Task 5: 注册工具到侧边栏和首页

**Files:**
- Modify: `js/sidebar.js`
- Modify: `index.html`

- [ ] **Step 1: 在 sidebar.js 中注册工具**

在 `TOOLS` 数组末尾添加新工具：

```javascript
const TOOLS = [
  {
    id: 'json-xml-formatter',
    name: 'JSON / XML Formatter',
    path: 'json-xml-formatter/index.html'
  },
  {
    id: 'timestamp-tool',
    name: 'Timestamp Tool',
    path: 'timestamp-tool/index.html'
  },
  {
    id: 'websocket-debugger',
    name: 'WebSocket Debugger',
    path: 'websocket-debugger/index.html'
  },
  {
    id: 'flv-player',
    name: 'FLV Player',
    path: 'stream-player/index.html'
  },
  {
    id: 'text-diff',
    name: 'Text Diff',
    path: 'text-diff/index.html'
  }
];
```

- [ ] **Step 2: 在首页添加工具卡片**

在 `index.html` 的 `.tools-grid` 中添加新卡片：

```html
<a href="tools/text-diff/index.html" class="tool-card">
  <h3 class="tool-card__title">Text Diff</h3>
  <p class="tool-card__desc">
    对比两段文本的差异，支持字符级高亮
  </p>
</a>
```

- [ ] **Step 3: Commit**

```bash
git add js/sidebar.js index.html
git commit -m "feat: register text-diff tool in sidebar and homepage"
```

---

### Task 6: 更新 update.md 文档

**Files:**
- Modify: `doc/update.md`

- [ ] **Step 1: 在 update.md 顶部添加更新记录**

在文件开头添加：

```markdown
## 2026-04-29

- 新增 Text Diff 工具：纯文本并排对比，字符级差异高亮，使用 diff-match-patch 库
```

- [ ] **Step 2: Commit**

```bash
git add doc/update.md
git commit -m "docs: update changelog for text-diff tool"
```
