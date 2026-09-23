/* ================================================================
   DEVINE MUSIC — audio-preview.js
   Minimal play/pause toggle for a piece's 30-second audio clip.
   Markup: <button class="audio-toggle" data-audio="../assets/audio/<slug>.m4a">
   The clip isn't downloaded until the first click; only one plays at a time.
   ================================================================ */

(function () {
  let current = null; // { btn, audio }

  function setState(btn, playing) {
    btn.classList.toggle('audio-toggle--playing', playing);
    btn.setAttribute('aria-pressed', String(playing));
    btn.setAttribute('aria-label', playing ? 'Pause preview' : 'Play 30-second preview');
  }

  function stop(entry) {
    entry.audio.pause();
    setState(entry.btn, false);
  }

  document.querySelectorAll('.audio-toggle[data-audio]').forEach(btn => {
    let audio = null;

    btn.addEventListener('click', () => {
      if (!audio) {
        audio = new Audio(btn.dataset.audio);
        audio.preload = 'auto';
        audio.addEventListener('ended', () => { audio.currentTime = 0; setState(btn, false); });
        audio.addEventListener('pause', () => setState(btn, false));
        audio.addEventListener('play', () => setState(btn, true));
      }
      if (audio.paused) {
        if (current && current.audio !== audio) stop(current);
        current = { btn, audio };
        audio.play().catch(() => setState(btn, false));
      } else {
        audio.pause();
      }
    });
  });
})();
