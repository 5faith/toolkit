/* ============================================
   FLV Player Script
   ============================================ */

class FlvPlayer {
  constructor() {
    this.flvPlayer = null;
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
  }

  cacheElements() {
    this.streamUrl = document.getElementById('streamUrl');
    this.playBtn = document.getElementById('playBtn');
    this.stopBtn = document.getElementById('stopBtn');
    this.videoPlayer = document.getElementById('videoPlayer');
    this.playerPlaceholder = document.getElementById('playerPlaceholder');
    this.statusDot = document.getElementById('statusDot');
    this.statusText = document.getElementById('statusText');
  }

  bindEvents() {
    this.playBtn.addEventListener('click', () => this.play());
    this.stopBtn.addEventListener('click', () => this.stop());
  }

  play() {
    const url = this.streamUrl.value.trim();
    if (!url) {
      return;
    }

    this.updateStatus('connecting', 'Connecting...');
    this.playBtn.disabled = true;
    this.stopBtn.disabled = false;
    this.playFlv(url);
  }

  playFlv(url) {
    if (typeof flvjs === 'undefined') {
      this.updateStatus('error', 'flv.js not loaded');
      this.playBtn.disabled = false;
      this.stopBtn.disabled = true;
      return;
    }

    if (this.flvPlayer) {
      this.flvPlayer.destroy();
    }

    this.flvPlayer = flvjs.createPlayer({
      type: 'flv',
      url: url,
      isLive: true
    });

    this.flvPlayer.attachMediaElement(this.videoPlayer);
    this.flvPlayer.load();
    this.flvPlayer.play();

    this.flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail, errorInfo) => {
      console.error('FLV error:', errorType, errorDetail, errorInfo);
      this.updateStatus('error', 'Error: ' + errorDetail);
    });

    this.flvPlayer.on(flvjs.Events.LOADING_COMPLETE, () => {
      this.updateStatus('playing', 'Playing');
      this.showVideo();
    });

    this.videoPlayer.onplaying = () => {
      this.updateStatus('playing', 'Playing');
      this.showVideo();
    };
  }

  stop() {
    if (this.flvPlayer) {
      this.flvPlayer.destroy();
      this.flvPlayer = null;
    }

    this.videoPlayer.pause();
    this.videoPlayer.srcObject = null;
    this.videoPlayer.src = '';

    this.hideVideo();
    this.updateStatus('error', 'Stopped');
    this.playBtn.disabled = false;
    this.stopBtn.disabled = true;
  }

  showVideo() {
    this.videoPlayer.classList.add('playing');
    this.playerPlaceholder.classList.add('hidden');
  }

  hideVideo() {
    this.videoPlayer.classList.remove('playing');
    this.playerPlaceholder.classList.remove('hidden');
  }

  updateStatus(status, text) {
    this.statusDot.className = 'sp-status-dot';
    if (status) {
      this.statusDot.classList.add(status);
    }
    this.statusText.textContent = text;
  }
}

function initFlvPlayer() {
  new FlvPlayer();
}

if (typeof module === 'undefined') {
  window.initFlvPlayer = initFlvPlayer;
}
