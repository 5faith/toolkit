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
