/* ================================================================
   DEVINE MUSIC — audio-preview.js
   Small play/pause toggle + thin progress bar for a piece's 30-second
   audio clip. Used under Add to Cart on piece pages and on catalog
   cards (which are rendered after load, so events are delegated).
   Markup:
     <div class="audio-preview">
       <button class="audio-toggle" data-audio="…/assets/audio/<slug>.m4a">…</button>
       <div class="audio-preview__bar"><span class="audio-preview__fill"></span></div>
     </div>
   Nothing is downloaded until play is pressed, and starting another clip
   unloads the previous one, so at most one clip is ever loaded.
   Clicking the bar seeks.
   ================================================================ */

(function () {
  const players = new WeakMap(); // .audio-preview element -> player
  let current = null;            // player currently playing

  function playerFor(wrap) {
    let pl = players.get(wrap);
    if (pl) return pl;

    const btn  = wrap.querySelector('.audio-toggle[data-audio]');
    const bar  = wrap.querySelector('.audio-preview__bar');
    const fill = wrap.querySelector('.audio-preview__fill');
    const audio = new Audio(btn.dataset.audio);
    audio.preload = 'auto';
    let raf = 0;

    const setState = playing => {
      btn.classList.toggle('audio-toggle--playing', playing);
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', playing ? 'Pause preview' : 'Play 30-second preview');
    };
    const draw = () => {
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      if (fill) fill.style.width = pct + '%';
      if (bar) bar.setAttribute('aria-valuenow', String(Math.round(pct)));
    };
    const tick = () => { draw(); raf = requestAnimationFrame(tick); };

    audio.addEventListener('play',  () => { setState(true); cancelAnimationFrame(raf); tick(); });
    audio.addEventListener('pause', () => { setState(false); cancelAnimationFrame(raf); draw(); });
    audio.addEventListener('ended', () => { audio.currentTime = 0; draw(); });
    audio.addEventListener('timeupdate', draw); // fallback when rAF is throttled (background tab)

    pl = {
      audio, draw, bar,
      unload() {
        cancelAnimationFrame(raf);
        audio.pause();
        audio.removeAttribute('src');
        audio.load();          // load() drops the queued 'pause' event, so reset the UI here
        setState(false);
        if (fill) fill.style.width = '0%';
        players.delete(wrap);
      },
      play() {
        if (current && current !== pl) current.unload();
        current = pl;
        audio.play().catch(() => setState(false));
      },
    };
    players.set(wrap, pl);
    return pl;
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.audio-toggle[data-audio]');
    const bar = e.target.closest('.audio-preview__bar');
    const wrap = (btn || bar) && (btn || bar).closest('.audio-preview');
    if (!wrap) return;
    e.preventDefault();
    const pl = playerFor(wrap);

    if (btn) {
      pl.audio.paused ? pl.play() : pl.audio.pause();
      return;
    }
    const seek = () => {
      const r = pl.bar.getBoundingClientRect();
      pl.audio.currentTime = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * pl.audio.duration;
      pl.draw();
      if (pl.audio.paused) pl.play();
    };
    pl.audio.readyState >= 1 ? seek() : pl.audio.addEventListener('loadedmetadata', seek, { once: true });
  });
})();
