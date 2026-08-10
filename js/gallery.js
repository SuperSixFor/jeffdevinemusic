/* ================================================================
   DEVINE MUSIC — gallery.js
   Thumbnail-driven image gallery for piece pages (preview pages of
   a score). Click a thumbnail, main image swaps. Delegated on
   document so it works regardless of how/when the gallery was
   rendered onto the page.
   ================================================================ */

document.addEventListener('click', e => {
  const thumb = e.target.closest('.gallery-thumb');
  if (!thumb) return;

  const gallery = thumb.closest('.piece-preview-gallery');
  if (!gallery) return;

  const mainImg = gallery.querySelector('.piece-preview-gallery__main img');
  if (mainImg) {
    mainImg.src = thumb.dataset.src;
    mainImg.alt = thumb.dataset.alt || mainImg.alt;
  }

  gallery.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('gallery-thumb--active'));
  thumb.classList.add('gallery-thumb--active');
});
