/* ================================================================
   DEVINE MUSIC — audio-preview.js
   Small play/pause toggle + thin progress bar for a piece's 30-second
   audio clip, shown under the Add to Cart button. Markup:
     <div class="audio-preview">
       <button class="audio-toggle" data-audio="../assets/audio/<slug>.m4a">…</button>
       <div class="audio-preview__bar"><span class="audio-preview__fill"></span></div>
     </div>
   The clip isn't downloaded until the first click; only one plays at a time.
   Clicking the bar seeks.
   ================================================================ */

(function () {
  let current = null; // the <audio> currently playing

  document.querySelectorAll('.audio-preview').forEach(wrap => {
    const btn  = wrap.querySelector('.audio-toggle[data-audio]');
    const bar  = wrap.querySelector('.audio-preview__bar');
    const fill = wrap.querySelector('.audio-preview__fill');
    if (!btn) return;
    let audio = null;
    let raf = 0;

    function setState(playing) {
      btn.classList.toggle('audio-toggle--playing', playing);
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', playing ? 'Pause preview' : 'Play 30-second preview');
    }

    function draw() {
      const pct = audio && audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      if (fill) fill.style.width = pct + '%';
      if (bar) bar.setAttribute('aria-valuenow', String(Math.round(pct)));
    }

    function tick() { draw(); raf = requestAnimationFrame(tick); }

    function ensureAudio() {
      if (audio) return audio;
      audio = new Audio(btn.dataset.audio);
      audio.preload = 'auto';
      audio.addEventListener('play',  () => { setState(true); cancelAnimationFrame(raf); tick(); });
      audio.addEventListener('pause', () => { setState(false); cancelAnimationFrame(raf); draw(); });
      audio.addEventListener('ended', () => { audio.currentTime = 0; draw(); });
      return audio;
    }

    function play() {
      if (current && current !== audio) current.pause();
      current = audio;
      audio.play().catch(() => setState(false));
    }

    btn.addEventListener('click', () => {
      ensureAudio();
      audio.paused ? play() : audio.pause();
    });

    if (bar) bar.addEventListener('click', e => {
      ensureAudio();
      const seek = () => {
        const r = bar.getBoundingClientRect();
        audio.currentTime = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * audio.duration;
        draw();
        if (audio.paused) play();
      };
      audio.readyState >= 1 ? seek() : audio.addEventListener('loadedmetadata', seek, { once: true });
    });
  });
})();
