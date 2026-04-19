/* ============================================
   Timestamp Tool Script
   ============================================ */

class TimestampTool {
  constructor() {
    this.unit = 's';
    this.intervalId = null;
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.startAutoUpdate();
    this.updateCurrentTimestamp();
  }

  cacheElements() {
    this.currentTimestamp = document.getElementById('currentTimestamp');
    this.currentDate = document.getElementById('currentDate');
    this.tsInput = document.getElementById('tsInput');
    this.tsDateResult = document.getElementById('tsDateResult');
    this.dateInput = document.getElementById('dateInput');
    this.dateTsResult = document.getElementById('dateTsResult');
    this.copyTsDateBtn = document.getElementById('copyTsDateBtn');
    this.copyDateTsBtn = document.getElementById('copyDateTsBtn');
  }

  bindEvents() {
    document.querySelectorAll('.ts-unit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchUnit(e.target.dataset.unit));
    });

    document.getElementById('copyCurrentBtn').addEventListener('click', () => this.copyCurrent());
    document.getElementById('convertTsBtn').addEventListener('click', () => this.convertTimestampToDate());
    document.getElementById('convertDateBtn').addEventListener('click', () => this.convertDateToTimestamp());
    document.getElementById('copyTsDateBtn').addEventListener('click', () => this.copyResult(this.tsDateResult));
    document.getElementById('copyDateTsBtn').addEventListener('click', () => this.copyResult(this.dateTsResult));

    this.tsInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.convertTimestampToDate();
    });
  }

  switchUnit(unit) {
    this.unit = unit;
    document.querySelectorAll('.ts-unit-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.unit === unit);
    });
    this.updateCurrentTimestamp();
  }

  getTimestamp(date = new Date()) {
    return this.unit === 's' ? Math.floor(date.getTime() / 1000) : date.getTime();
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  updateCurrentTimestamp() {
    const now = new Date();
    this.currentTimestamp.textContent = this.getTimestamp(now);
    this.currentDate.textContent = this.formatDate(now);
  }

  startAutoUpdate() {
    this.intervalId = setInterval(() => this.updateCurrentTimestamp(), 100);
  }

  stopAutoUpdate() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  convertTimestampToDate() {
    const input = this.tsInput.value.trim();
    if (!input) {
      this.tsDateResult.textContent = '-';
      this.copyTsDateBtn.style.display = 'none';
      return;
    }

    let timestamp = parseInt(input, 10);
    if (isNaN(timestamp)) {
      this.tsDateResult.textContent = 'Invalid timestamp';
      this.copyTsDateBtn.style.display = 'none';
      return;
    }

    if (String(timestamp).length > 11) {
      timestamp = timestamp;
    } else {
      timestamp = timestamp * 1000;
    }

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      this.tsDateResult.textContent = 'Invalid date';
      this.copyTsDateBtn.style.display = 'none';
      return;
    }

    this.tsDateResult.textContent = this.formatDate(date);
    this.copyTsDateBtn.style.display = 'inline-flex';
  }

  convertDateToTimestamp() {
    const input = this.dateInput.value;
    if (!input) {
      this.dateTsResult.textContent = '-';
      this.copyDateTsBtn.style.display = 'none';
      return;
    }

    const date = new Date(input);
    if (isNaN(date.getTime())) {
      this.dateTsResult.textContent = 'Invalid date';
      this.copyDateTsBtn.style.display = 'none';
      return;
    }

    const timestamp = Math.floor(date.getTime() / 1000);
    this.dateTsResult.textContent = timestamp;
    this.copyDateTsBtn.style.display = 'inline-flex';
  }

  copyCurrent() {
    this.copyToClipboard(this.currentTimestamp.textContent);
  }

  copyResult(element) {
    if (element.textContent !== '-') {
      this.copyToClipboard(element.textContent);
    }
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showCopyFeedback();
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showCopyFeedback();
    });
  }

  showCopyFeedback() {
    const originalTexts = [];
    const buttons = [
      document.getElementById('copyCurrentBtn'),
      document.getElementById('copyTsDateBtn'),
      document.getElementById('copyDateTsBtn')
    ].filter(btn => btn && btn.offsetParent !== null);

    buttons.forEach(btn => {
      originalTexts.push(btn.textContent);
      btn.textContent = 'Copied!';
    });

    setTimeout(() => {
      buttons.forEach((btn, i) => {
        if (originalTexts[i]) {
          btn.textContent = originalTexts[i];
        }
      });
    }, 1500);
  }
}

function initTimestampTool() {
  new TimestampTool();
}

if (typeof module === 'undefined') {
  window.initTimestampTool = initTimestampTool;
}
