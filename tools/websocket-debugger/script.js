/* ============================================
   WebSocket Debugger Script
   ============================================ */

class WebSocketDebugger {
  constructor() {
    this.ws = null;
    this.messageCount = 0;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.isManualDisconnect = false;
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
  }

  cacheElements() {
    this.wsUrl = document.getElementById('wsUrl');
    this.connectBtn = document.getElementById('connectBtn');
    this.disconnectBtn = document.getElementById('disconnectBtn');
    this.statusDot = document.getElementById('statusDot');
    this.statusText = document.getElementById('statusText');
    this.autoReconnect = document.getElementById('autoReconnect');
    this.reconnectInterval = document.getElementById('reconnectInterval');
    this.enableHeartbeat = document.getElementById('enableHeartbeat');
    this.heartbeatInterval = document.getElementById('heartbeatInterval');
    this.messagesContainer = document.getElementById('messagesContainer');
    this.messageCount = document.getElementById('messageCount');
    this.clearMessagesBtn = document.getElementById('clearMessagesBtn');
    this.messageInput = document.getElementById('messageInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.clearInputBtn = document.getElementById('clearInputBtn');
  }

  bindEvents() {
    this.connectBtn.addEventListener('click', () => this.connect());
    this.disconnectBtn.addEventListener('click', () => this.disconnect());
    this.clearMessagesBtn.addEventListener('click', () => this.clearMessages());
    this.sendBtn.addEventListener('click', () => this.send());
    this.clearInputBtn.addEventListener('click', () => this.clearInput());
    this.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    });
  }

  connect() {
    const url = this.wsUrl.value.trim();
    if (!url) {
      this.addMessage('Please enter a WebSocket URL', 'error');
      return;
    }

    try {
      this.isManualDisconnect = false;
      this.updateStatus('connecting', 'Connecting...');
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.updateStatus('connected', 'Connected');
        this.connectBtn.disabled = true;
        this.disconnectBtn.disabled = false;
        this.sendBtn.disabled = false;
        this.addMessage(`Connected to ${url}`, 'sent');
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        this.addMessage(event.data, 'received');
      };

      this.ws.onerror = (error) => {
        this.updateStatus('error', 'Error');
        this.addMessage('WebSocket error occurred', 'error');
      };

      this.ws.onclose = (event) => {
        this.updateStatus('error', 'Disconnected');
        this.connectBtn.disabled = false;
        this.disconnectBtn.disabled = true;
        this.sendBtn.disabled = true;
        this.stopHeartbeat();
        
        if (!this.isManualDisconnect && this.autoReconnect.checked) {
          this.addMessage(`Disconnected. Reconnecting in ${this.reconnectInterval.value}s...`, 'error');
          this.scheduleReconnect();
        } else {
          this.addMessage(`Disconnected from ${url}`, 'received');
        }
      };
    } catch (error) {
      this.addMessage(`Connection error: ${error.message}`, 'error');
      this.updateStatus('error', 'Error');
    }
  }

  disconnect() {
    this.isManualDisconnect = true;
    this.stopReconnect();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  scheduleReconnect() {
    this.stopReconnect();
    this.reconnectTimer = setTimeout(() => {
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        this.connect();
      }
    }, parseInt(this.reconnectInterval.value, 10) * 1000);
  }

  stopReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  startHeartbeat() {
    this.stopHeartbeat();
    if (this.enableHeartbeat.checked) {
      this.heartbeatTimer = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send('ping');
          this.addMessage('ping', 'sent');
        }
      }, parseInt(this.heartbeatInterval.value, 10) * 1000);
    }
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  send() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.addMessage('Not connected', 'error');
      return;
    }

    const message = this.messageInput.value;
    if (!message.trim()) {
      return;
    }

    try {
      const data = this.tryParseJson(message) || message;
      this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
      this.addMessage(message, 'sent');
    } catch (error) {
      this.addMessage(`Error sending message: ${error.message}`, 'error');
    }
  }

  tryParseJson(str) {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  addMessage(content, type) {
    const emptyMessage = this.messagesContainer.querySelector('.ws-empty-message');
    if (emptyMessage) {
      emptyMessage.remove();
    }

    this.messageCount.textContent = parseInt(this.messageCount.textContent, 10) + 1;

    const messageEl = document.createElement('div');
    messageEl.className = `ws-message ${type}`;

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    let directionLabel = '';
    switch (type) {
      case 'sent': directionLabel = '→ Sent'; break;
      case 'received': directionLabel = '← Received'; break;
      case 'error': directionLabel = '✕ Error'; break;
    }

    const parsedContent = this.tryParseJson(content);
    const displayContent = parsedContent ? JSON.stringify(parsedContent, null, 2) : content;

    messageEl.innerHTML = `
      <div class="ws-message-header">
        <span class="ws-message-direction">${directionLabel}</span>
        <span class="ws-message-time">${time}</span>
      </div>
      <div class="ws-message-content">${this.escapeHtml(displayContent)}</div>
    `;

    this.messagesContainer.appendChild(messageEl);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  clearMessages() {
    this.messagesContainer.innerHTML = '<div class="ws-empty-message">No messages yet</div>';
    this.messageCount.textContent = '0';
  }

  clearInput() {
    this.messageInput.value = '';
  }

  updateStatus(status, text) {
    this.statusDot.className = 'ws-status-dot';
    if (status) {
      this.statusDot.classList.add(status);
    }
    this.statusText.textContent = text;
  }
}

function initWebSocketDebugger() {
  new WebSocketDebugger();
}

if (typeof module === 'undefined') {
  window.initWebSocketDebugger = initWebSocketDebugger;
}
