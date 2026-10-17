// ==========================================================================
// SABRINA CARPENTER · VINYL PLAYER & APP LOGIC
// ==========================================================================

class SabrinaApp {
  constructor() {
    this.albums = window.SABRINA_ALBUMS || [];
    this.currentAlbum = this.albums[0] || null;
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.rpm = 33;
    this.isShuffle = false;
    this.isRepeat = false;
    this.volume = 0.85;

    this.audio = new Audio();
    this.audio.volume = this.volume;

    this.initDOM();
    this.initAudioEvents();
    this.initRoutes();
    this.initPWA();
    this.initKeyboard();

    // Default load first track (Taste)
    if (this.currentAlbum && this.currentAlbum.tracks.length > 0) {
      this.loadTrack(this.currentAlbum, 0, false);
    }
  }

  initDOM() {
    // Navigation links
    document.querySelectorAll('[data-route]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const route = el.getAttribute('data-route');
        this.navigate(route);
      });
    });

    // Turntable Controls
    this.playBtn = document.getElementById('btn-play-main');
    this.prevBtn = document.getElementById('btn-prev');
    this.nextBtn = document.getElementById('btn-next');
    this.shuffleBtn = document.getElementById('btn-shuffle');
    this.repeatBtn = document.getElementById('btn-repeat');
    this.rpmBtn = document.getElementById('rpm-toggle');
    this.rpmLabel = document.getElementById('rpm-label');

    this.vinylDisk = document.getElementById('vinyl-disk');
    this.vinylLabelImg = document.getElementById('vinyl-label-img');
    this.tonearmRod = document.getElementById('tonearm-rod');

    this.playerSongTitle = document.getElementById('player-song-title');
    this.playerAlbumName = document.getElementById('player-album-name');
    this.scrubberTrack = document.getElementById('scrubber-track');
    this.scrubberFill = document.getElementById('scrubber-fill');
    this.currentTimeEl = document.getElementById('time-current');
    this.totalTimeEl = document.getElementById('time-total');
    this.equalizerBars = document.querySelectorAll('.wave-bar');

    this.volumeSlider = document.getElementById('volume-slider');
    this.albumSelect = document.getElementById('player-album-select');

    // Mini floating bar
    this.floatingBar = document.getElementById('floating-mini-bar');
    this.floatingArt = document.getElementById('floating-mini-art');
    this.floatingArtImg = document.getElementById('floating-mini-img');
    this.floatingTitle = document.getElementById('floating-mini-title');
    this.floatingSub = document.getElementById('floating-mini-sub');
    this.floatingPlayBtn = document.getElementById('floating-play-btn');

    // Popout button
    const popoutBtn = document.getElementById('btn-popout-window');
    if (popoutBtn) {
      popoutBtn.addEventListener('click', () => this.openMiniWindow());
    }

    // Play / Pause Click
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }
    if (this.floatingPlayBtn) {
      this.floatingPlayBtn.addEventListener('click', () => this.togglePlay());
    }
    if (this.vinylDisk) {
      this.vinylDisk.addEventListener('click', () => this.togglePlay());
    }

    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevTrack());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextTrack());

    const floatingPrev = document.getElementById('floating-prev-btn');
    const floatingNext = document.getElementById('floating-next-btn');
    if (floatingPrev) floatingPrev.addEventListener('click', () => this.prevTrack());
    if (floatingNext) floatingNext.addEventListener('click', () => this.nextTrack());

    // 33 vs 45 RPM
    if (this.rpmBtn) {
      this.rpmBtn.addEventListener('click', () => {
        this.rpm = this.rpm === 33 ? 45 : 33;
        this.rpmLabel.textContent = `${this.rpm} RPM`;
        if (this.vinylDisk) {
          if (this.rpm === 45) {
            this.vinylDisk.classList.add('rpm-45');
          } else {
            this.vinylDisk.classList.remove('rpm-45');
          }
        }
        this.showToast(`Velocidad ajustada a ${this.rpm} RPM ⚡`);
      });
    }

    // Shuffle & Repeat
    if (this.shuffleBtn) {
      this.shuffleBtn.addEventListener('click', () => {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
        this.showToast(this.isShuffle ? 'Modo Aleatorio Activado 🔀' : 'Modo Secuencial 🔁');
      });
    }
    if (this.repeatBtn) {
      this.repeatBtn.addEventListener('click', () => {
        this.isRepeat = !this.isRepeat;
        this.repeatBtn.classList.toggle('active', this.isRepeat);
        this.showToast(this.isRepeat ? 'Repetir Canción Activado 🔂' : 'Repetición Desactivada');
      });
    }

    // Volume
    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume * 100;
      this.volumeSlider.addEventListener('input', (e) => {
        this.volume = e.target.value / 100;
        this.audio.volume = this.volume;
      });
    }

    // Album Picker Dropdown
    if (this.albumSelect) {
      this.albumSelect.innerHTML = '';
      this.albums.forEach(alb => {
        const opt = document.createElement('option');
        opt.value = alb.id;
        opt.textContent = `${alb.title} (${alb.year})`;
        this.albumSelect.appendChild(opt);
      });
      this.albumSelect.addEventListener('change', (e) => {
        const found = this.albums.find(a => a.id === e.target.value);
        if (found) {
          this.loadTrack(found, 0, true);
        }
      });
    }

    // Scrubber click
    if (this.scrubberTrack) {
      this.scrubberTrack.addEventListener('click', (e) => {
        if (!this.audio.duration) return;
        const rect = this.scrubberTrack.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = pos * this.audio.duration;
      });
    }

    // Floating bar click to navigate to player
    if (this.floatingArt) {
      this.floatingArt.addEventListener('click', () => this.navigate('player'));
    }
    if (this.floatingTitle) {
      this.floatingTitle.addEventListener('click', () => this.navigate('player'));
    }

    // Render Home album cards & YouTube Vault
    this.renderHomeAlbums();
    this.renderYouTubeVault();
  }

  initAudioEvents() {
    this.audio.addEventListener('timeupdate', () => {
      if (!this.audio.duration) return;
      const pct = (this.audio.currentTime / this.audio.duration) * 100;
      if (this.scrubberFill) this.scrubberFill.style.width = `${pct}%`;
      if (this.currentTimeEl) this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
      if (this.totalTimeEl) this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updatePlayerVisuals(true);
      this.updateMediaSession();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updatePlayerVisuals(false);
    });

    this.audio.addEventListener('ended', () => {
      if (this.isRepeat) {
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.nextTrack();
      }
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio local fallback triggered:', e);
      const track = this.getCurrentTrack();
      if (track) {
        this.showToast(`Pista instrumental: ${track.title} 🎵`);
      }
    });
  }

  loadTrack(album, index, autoPlay = true) {
    if (!album || !album.tracks || album.tracks.length === 0) return;
    this.currentAlbum = album;
    this.currentTrackIndex = Math.max(0, Math.min(index, album.tracks.length - 1));

    const track = album.tracks[this.currentTrackIndex];

    this.audio.src = track.file;
    this.audio.load();

    if (this.playerSongTitle) this.playerSongTitle.textContent = track.title;
    if (this.playerAlbumName) this.playerAlbumName.textContent = `${album.title} (${album.year})`;
    if (this.vinylLabelImg) this.vinylLabelImg.src = album.cover_image;
    if (this.albumSelect) this.albumSelect.value = album.id;

    if (this.floatingTitle) this.floatingTitle.textContent = track.title;
    if (this.floatingSub) this.floatingSub.textContent = `${album.title} · Instrumental`;
    if (this.floatingArtImg) this.floatingArtImg.src = album.cover_image;

    // Highlight row if on album view
    document.querySelectorAll('.track-row').forEach(row => {
      const rowId = row.getAttribute('data-track-id');
      row.classList.toggle('now-playing', rowId === track.id);
    });

    if (autoPlay) {
      this.audio.play().catch(err => {
        console.log('Autoplay policy caught, awaiting user gesture:', err);
      });
    }

    this.updateMediaSession();
  }

  togglePlay() {
    if (!this.audio.src) {
      if (this.currentAlbum) this.loadTrack(this.currentAlbum, 0, true);
      return;
    }

    if (this.audio.paused) {
      this.audio.play().then(() => {
        const track = this.getCurrentTrack();
        if (track) this.showToast(`💋 Tocando: ${track.title}`);
      }).catch(err => console.log('Playback error:', err));
    } else {
      this.audio.pause();
    }
  }

  prevTrack() {
    if (!this.currentAlbum) return;
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    const len = this.currentAlbum.tracks.length;
    let prevIdx = this.currentTrackIndex - 1;
    if (prevIdx < 0) prevIdx = len - 1;
    this.loadTrack(this.currentAlbum, prevIdx, true);
  }

  nextTrack() {
    if (!this.currentAlbum) return;
    const len = this.currentAlbum.tracks.length;
    let nextIdx;
    if (this.isShuffle) {
      nextIdx = Math.floor(Math.random() * len);
    } else {
      nextIdx = (this.currentTrackIndex + 1) % len;
    }
    this.loadTrack(this.currentAlbum, nextIdx, true);
  }

  getCurrentTrack() {
    if (!this.currentAlbum || !this.currentAlbum.tracks) return null;
    return this.currentAlbum.tracks[this.currentTrackIndex] || null;
  }

  updatePlayerVisuals(playing) {
    if (this.playBtn) this.playBtn.innerHTML = playing ? '❚❚' : '▶';
    if (this.floatingPlayBtn) this.floatingPlayBtn.innerHTML = playing ? '❚❚' : '▶';

    if (this.vinylDisk) {
      if (playing) {
        this.vinylDisk.classList.add('spinning');
      } else {
        this.vinylDisk.classList.remove('spinning');
      }
    }

    if (this.floatingArt) {
      if (playing) {
        this.floatingArt.classList.add('spin');
      } else {
        this.floatingArt.classList.remove('spin');
      }
    }

    if (this.tonearmRod) {
      if (playing) {
        this.tonearmRod.classList.add('on-record');
      } else {
        this.tonearmRod.classList.remove('on-record');
      }
    }

    if (this.equalizerBars) {
      this.equalizerBars.forEach((bar, idx) => {
        bar.classList.toggle('active', playing);
        if (playing) {
          bar.style.animationDelay = `${(idx * 0.08) % 0.6}s`;
        }
      });
    }
  }

  updateMediaSession() {
    if ('mediaSession' in navigator) {
      const track = this.getCurrentTrack();
      if (!track) return;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${track.title} (Instrumental)`,
        artist: 'Sabrina Carpenter',
        album: this.currentAlbum ? this.currentAlbum.title : 'Sabrina Carpenter Discography',
        artwork: [
          { src: this.currentAlbum ? this.currentAlbum.cover_image : 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => this.togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => this.togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.nextTrack());
    }
  }

  // Routing
  initRoutes() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();
  }

  handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home';
    if (hash.startsWith('album/')) {
      const albumId = hash.replace('album/', '');
      this.showAlbumView(albumId);
    } else {
      this.navigate(hash, false);
    }
  }

  navigate(route, updateHash = true) {
    if (updateHash) {
      window.location.hash = route;
    }

    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const target = document.getElementById(`view-${route}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-route') === route);
    });
  }

  renderHomeAlbums() {
    const grid = document.getElementById('home-albums-grid');
    if (!grid) return;
    grid.innerHTML = '';

    this.albums.forEach(alb => {
      const card = document.createElement('div');
      card.className = 'album-card';
      card.innerHTML = `
        <div class="album-art-wrap">
          <img src="${alb.cover_image}" alt="${alb.title}" loading="lazy">
          <span class="album-badge-era">${alb.year}</span>
        </div>
        <div class="album-info-title">${alb.title}</div>
        <div class="album-info-sub">${alb.era}</div>
        <p class="album-info-desc">${alb.desc}</p>
        <div class="album-card-footer">
          <span class="album-track-count">🎵 ${alb.tracks.length} instrumentales</span>
          <button class="btn-secondary" style="padding: 0.35rem 0.8rem; font-size: 0.78rem;">Ver Álbum →</button>
        </div>
      `;

      card.addEventListener('click', () => {
        window.location.hash = `album/${alb.id}`;
      });

      grid.appendChild(card);
    });
  }

  showAlbumView(albumId) {
    const alb = this.albums.find(a => a.id === albumId) || this.albums[0];
    if (!alb) return;

    this.navigate('album-detail', false);

    const detailView = document.getElementById('view-album-detail');
    if (!detailView) return;

    const currentTrack = this.getCurrentTrack();

    detailView.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <button class="btn-secondary" id="btn-back-albums" style="cursor: pointer;">
          ← Volver a todos los álbumes
        </button>
      </div>

      <div class="album-hero-wrap">
        <div class="album-hero-cover-wrap">
          <div class="album-hero-cover">
            <img src="${alb.cover_image}" alt="${alb.title}">
          </div>
        </div>
        <div class="album-hero-content">
          <div class="album-hero-era-badge">✦ ${alb.era} · ${alb.year}</div>
          <h1 class="album-hero-title">${alb.title}</h1>
          <div class="album-hero-quote">"${alb.quote}"</div>
          <p class="album-hero-desc">${alb.desc}</p>
          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <button class="btn-primary" id="btn-play-whole-album">
              ▶ Tocar Álbum en el Vinilo
            </button>
            <button class="btn-secondary" id="btn-yt-album-search">
              📺 Ver en YouTube
            </button>
          </div>
        </div>
      </div>

      <div class="tracklist-card">
        <div class="tracklist-header-row">
          <div>#</div>
          <div>Canción</div>
          <div>Versión</div>
          <div>Enlace Oficial</div>
        </div>
        <div id="album-track-list-rows"></div>
      </div>
    `;

    document.getElementById('btn-back-albums').addEventListener('click', () => {
      this.navigate('home');
    });

    document.getElementById('btn-play-whole-album').addEventListener('click', () => {
      this.loadTrack(alb, 0, true);
      this.navigate('player');
    });

    document.getElementById('btn-yt-album-search').addEventListener('click', () => {
      const q = encodeURIComponent(`Sabrina Carpenter ${alb.title} full album`);
      window.open(`https://www.youtube.com/results?search_query=${q}`, '_blank');
    });

    // Populate tracks
    const rowsContainer = document.getElementById('album-track-list-rows');
    alb.tracks.forEach((trk, idx) => {
      const row = document.createElement('div');
      row.className = 'track-row';
      row.setAttribute('data-track-id', trk.id);

      if (currentTrack && currentTrack.id === trk.id) {
        row.classList.add('now-playing');
      }

      row.innerHTML = `
        <div class="track-number">${trk.numberStr}</div>
        <div class="track-title-cell">
          <button class="track-play-inline-btn" title="Tocar instrumental">▶</button>
          <span class="track-name-text">${trk.title}</span>
        </div>
        <div>
          <span class="badge-instrumental">Solo Instrumental</span>
        </div>
        <div>
          <a class="track-yt-link" href="${trk.youtube}" target="_blank" rel="noopener noreferrer">
            ▶ YouTube
          </a>
        </div>
      `;

      row.querySelector('.track-play-inline-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.loadTrack(alb, idx, true);
      });

      row.addEventListener('click', () => {
        this.loadTrack(alb, idx, true);
      });

      rowsContainer.appendChild(row);
    });
  }

  renderYouTubeVault() {
    const container = document.getElementById('yt-vault-grid');
    const filterContainer = document.getElementById('yt-filter-bar');
    const searchInput = document.getElementById('yt-search-input');
    if (!container) return;

    let activeFilter = 'all';
    let searchQuery = '';

    // Render filter buttons
    if (filterContainer) {
      filterContainer.innerHTML = '';
      const allBtn = document.createElement('button');
      allBtn.className = 'yt-filter-btn active';
      allBtn.textContent = `Todos (${this.albums.reduce((acc, a) => acc + a.tracks.length, 0)})`;
      allBtn.addEventListener('click', () => {
        activeFilter = 'all';
        document.querySelectorAll('.yt-filter-btn').forEach(b => b.classList.remove('active'));
        allBtn.classList.add('active');
        applyFilters();
      });
      filterContainer.appendChild(allBtn);

      this.albums.forEach(alb => {
        const btn = document.createElement('button');
        btn.className = 'yt-filter-btn';
        btn.textContent = `${alb.title} (${alb.tracks.length})`;
        btn.addEventListener('click', () => {
          activeFilter = alb.id;
          document.querySelectorAll('.yt-filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          applyFilters();
        });
        filterContainer.appendChild(btn);
      });
    }

    const applyFilters = () => {
      container.innerHTML = '';
      let matchCount = 0;

      this.albums.forEach(alb => {
        if (activeFilter !== 'all' && alb.id !== activeFilter) return;

        alb.tracks.forEach((trk, idx) => {
          if (searchQuery && !trk.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return;
          }
          matchCount++;

          const card = document.createElement('div');
          card.className = 'yt-card';
          card.innerHTML = `
            <div class="yt-card-header">
              <span class="yt-icon-badge">▶</span>
              <span class="yt-card-album-tag">${alb.title}</span>
            </div>
            <div class="yt-card-title">${trk.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0.85rem;">
              Audio oficial & letra en YouTube
            </div>
            <div class="yt-card-actions">
              <a href="${trk.youtube}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 0.4rem 0.85rem; font-size: 0.78rem;">
                Ver en YouTube ↗
              </a>
              <button class="btn-secondary btn-play-inst" style="padding: 0.4rem 0.85rem; font-size: 0.78rem;">
                Tocar Instrumental 🎵
              </button>
            </div>
          `;

          card.querySelector('.btn-play-inst').addEventListener('click', () => {
            this.loadTrack(alb, idx, true);
            this.navigate('player');
          });

          container.appendChild(card);
        });
      });

      if (matchCount === 0) {
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-dim); padding: 3rem;">No se encontraron canciones con "${searchQuery}" 🔍</div>`;
      }
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        applyFilters();
      });
    }

    applyFilters();
  }

  openMiniWindow() {
    const width = 380;
    const height = 580;
    const left = window.screen.width - width - 40;
    const top = 60;
    window.open(
      'mini.html',
      'SabrinaMiniPlayer',
      `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no,status=no,toolbar=no`
    );
    this.showToast('¡Mini ventana de escritorio abierta! 🪟✨');
  }

  initPWA() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('SW registration note:', err);
      });
    }

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const installBtn = document.getElementById('btn-install-app');
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
        installBtn.addEventListener('click', () => {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              this.showToast('¡App instalada en tu escritorio con éxito! 💖');
            }
            deferredPrompt = null;
          });
        });
      }
    });
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.nextTrack();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.prevTrack();
      }
    });
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  showToast(message) {
    const existing = document.querySelector('.toast-notice');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notice';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-15px) scale(0.9)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new SabrinaApp();
});
