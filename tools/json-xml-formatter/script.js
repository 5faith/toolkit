/* ============================================
   JSON/XML Formatter Script
   ============================================ */

class Formatter {
  constructor() {
    this.mode = 'json';
    this.view = 'code';
    this.indent = 4;
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
  }

  cacheElements() {
    this.inputEditor = document.getElementById('inputEditor');
    this.outputEditor = document.getElementById('outputEditor');
    this.status = document.getElementById('status');
    this.errorMessage = document.getElementById('errorMessage');
    this.outputCode = document.getElementById('outputCode');
    this.outputTree = document.getElementById('outputTree');
    this.treeContainer = document.getElementById('treeContainer');
    this.indentSelect = document.getElementById('indentSelect');
  }

  bindEvents() {
    document.getElementById('formatBtn').addEventListener('click', () => this.format());
    document.getElementById('minifyBtn').addEventListener('click', () => this.minify());
    document.getElementById('copyBtn').addEventListener('click', () => this.copy());
    document.getElementById('clearBtn').addEventListener('click', () => this.clear());

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
    });

    this.indentSelect.addEventListener('change', (e) => this.updateIndent(e.target.value));
  }

  detectMode(input) {
    const trimmed = input.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return 'json';
    }
    if (trimmed.startsWith('<')) {
      return 'xml';
    }
    return this.mode;
  }

  switchMode(mode) {
    this.mode = mode;
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    if (this.inputEditor.value.trim()) {
      this.format();
    }
  }

  switchView(view) {
    this.view = view;
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    this.outputCode.classList.toggle('active', view === 'code');
    this.outputTree.classList.toggle('active', view === 'tree');
    if (view === 'tree' && this.outputEditor.textContent.trim()) {
      this.renderTree();
    }
  }

  updateIndent(value) {
    this.indent = value === 'tab' ? '\t' : parseInt(value, 10);
    if (this.inputEditor.value.trim()) {
      this.format();
    }
  }

  format() {
    const input = this.inputEditor.value;
    if (!input.trim()) {
      this.showStatus('');
      this.outputEditor.textContent = '';
      this.treeContainer.innerHTML = '';
      return;
    }

    try {
      let currentMode = this.mode;
      if (currentMode === 'auto') {
        currentMode = this.detectMode(input);
      }

      let output;
      if (currentMode === 'json') {
        output = this.formatJSON(input);
      } else {
        output = this.formatXML(input);
      }

      this.outputEditor.innerHTML = output;
      this.outputEditor.className = `editor output-editor hl-${currentMode}`;
      this.showStatus('Formatted', 'success');
      this.hideError();

      if (this.view === 'tree') {
        this.renderTree();
      }
    } catch (error) {
      this.showError(error.message);
      this.showStatus('Error', 'error');
    }
  }

  formatJSON(input) {
    const obj = JSON.parse(input);
    const formatted = JSON.stringify(obj, null, this.indent);
    return this.highlightJSON(formatted);
  }

  highlightJSON(json) {
    return json
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return `<span class="${cls}">${match}</span>`;
      });
  }

  formatXML(input) {
    let formatted = '';
    let indentLevel = 0;
    const indentStr = typeof this.indent === 'number' ? ' '.repeat(this.indent) : '\t';

    const tokens = input.split(/(>|<)/).filter(token => token.trim());
    let inText = false;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === '<') {
        const nextToken = tokens[i + 1] || '';
        if (nextToken.startsWith('/')) {
          indentLevel = Math.max(0, indentLevel - 1);
          formatted += indentStr.repeat(indentLevel);
        } else if (!nextToken.startsWith('?') && !nextToken.startsWith('!')) {
          if (!inText) {
            formatted += indentStr.repeat(indentLevel);
          }
          if (!nextToken.endsWith('/')) {
            indentLevel++;
          }
        } else {
          formatted += indentStr.repeat(indentLevel);
        }
        formatted += '<';
        inText = false;
      } else if (token === '>') {
        formatted += '>\n';
      } else {
        formatted += token;
        if (token.indexOf('</') === -1 && !token.endsWith('/')) {
          const nextToken = tokens[i + 2] || '';
          if (nextToken.indexOf('</') !== 0) {
            inText = true;
          }
        }
      }
    }

    return this.highlightXML(formatted.trim());
  }

  highlightXML(xml) {
    return xml
      .replace(/(<\/?)([\w-]+)/g, '$1<span class="tag">$2</span>')
      .replace(/\s([\w-]+)=/g, ' <span class="attr-name">$1</span>=')
      .replace(/="([^"]*)"/g, '="<span class="attr-value">$1</span>"')
      .replace(/(&lt;|<)!--([\s\S]*?)--(&gt;|>)/g, '<span class="comment">$&</span>');
  }

  minify() {
    const input = this.inputEditor.value;
    if (!input.trim()) return;

    try {
      let currentMode = this.mode;
      if (currentMode === 'auto') {
        currentMode = this.detectMode(input);
      }

      let output;
      if (currentMode === 'json') {
        const obj = JSON.parse(input);
        output = JSON.stringify(obj);
      } else {
        output = input.replace(/>\s+</g, '><').trim();
      }

      this.outputEditor.textContent = output;
      this.outputEditor.className = 'editor output-editor';
      this.showStatus('Minified', 'success');
      this.hideError();
    } catch (error) {
      this.showError(error.message);
      this.showStatus('Error', 'error');
    }
  }

  renderTree() {
    const input = this.inputEditor.value;
    if (!input.trim()) return;

    try {
      let currentMode = this.mode;
      if (currentMode === 'auto') {
        currentMode = this.detectMode(input);
      }

      this.treeContainer.innerHTML = '';
      if (currentMode === 'json') {
        const obj = JSON.parse(input);
        this.treeContainer.appendChild(this.buildJSONTree(obj, 'root'));
      } else {
        this.treeContainer.innerHTML = '<div style="color: rgba(38,37,30,0.55);">Tree view not available for XML</div>';
      }
    } catch (error) {
      this.treeContainer.innerHTML = '';
    }
  }

  buildJSONTree(obj, key) {
    const wrapper = document.createElement('div');
    wrapper.className = key === 'root' ? 'tree-node root' : 'tree-node';

    const type = this.getType(obj);
    const line = document.createElement('div');

    if (type === 'object' || type === 'array') {
      const toggle = document.createElement('button');
      toggle.className = 'tree-toggle expanded';
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('expanded');
        children.classList.toggle('expanded');
      });

      const keySpan = document.createElement('span');
      keySpan.className = 'tree-key';
      keySpan.textContent = key !== 'root' ? `${key}:` : (type === 'array' ? '[]' : '{}');

      line.appendChild(toggle);
      line.appendChild(keySpan);

      const children = document.createElement('div');
      children.className = 'tree-children expanded';

      if (type === 'object') {
        for (const [k, v] of Object.entries(obj)) {
          children.appendChild(this.buildJSONTree(v, k));
        }
      } else {
        obj.forEach((item, index) => {
          children.appendChild(this.buildJSONTree(item, `[${index}]`));
        });
      }

      wrapper.appendChild(line);
      wrapper.appendChild(children);
    } else {
      const keySpan = document.createElement('span');
      keySpan.className = 'tree-key';
      keySpan.textContent = key !== 'root' ? `${key}:` : '';

      const valueSpan = document.createElement('span');
      valueSpan.className = `tree-value ${type}`;
      valueSpan.textContent = this.formatValue(obj, type);

      line.appendChild(keySpan);
      line.appendChild(valueSpan);
      wrapper.appendChild(line);
    }

    return wrapper;
  }

  getType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  formatValue(value, type) {
    if (type === 'string') return `"${value}"`;
    if (type === 'null') return 'null';
    return String(value);
  }

  copy() {
    const content = this.outputEditor.textContent;
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
      this.showStatus('Copied!', 'success');
      setTimeout(() => {
        this.showStatus('Formatted', 'success');
      }, 2000);
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showStatus('Copied!', 'success');
      setTimeout(() => {
        this.showStatus('Formatted', 'success');
      }, 2000);
    });
  }

  clear() {
    this.inputEditor.value = '';
    this.outputEditor.textContent = '';
    this.treeContainer.innerHTML = '';
    this.showStatus('');
    this.hideError();
  }

  showStatus(message, type = '') {
    this.status.textContent = message;
    this.status.className = 'status';
    if (type) {
      this.status.classList.add(type);
    }
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.add('show');
  }

  hideError() {
    this.errorMessage.classList.remove('show');
  }
}

function initFormatter() {
  new Formatter();
}

if (typeof module === 'undefined') {
  window.initFormatter = initFormatter;
}
