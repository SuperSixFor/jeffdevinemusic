/* ================================================================
   DEVINE MUSIC — gallery.js
   Thumbnail + prev/next-driven image gallery for piece pages (preview
   pages of a score). Delegated on document so it works regardless of
   how/when the gallery was rendered onto the page.
   ================================================================ */

function galleryShow(gallery, index) {
  const thumbs = Array.from(gallery.querySelectorAll('.gallery-thumb'));
  if (!thumbs.length) return;

  const wrapped = ((index % thumbs.length) + thumbs.length) % thumbs.length;
  const thumb = thumbs[wrapped];

  const mainImg = gallery.querySelector('.piece-preview-gallery__main img');
  if (mainImg) {
    mainImg.src = thumb.dataset.src;
    mainImg.alt = thumb.dataset.alt || mainImg.alt;
  }

  thumbs.forEach(t => t.classList.remove('gallery-thumb--active'));
  thumb.classList.add('gallery-thumb--active');

  const counter = gallery.querySelector('.gallery-counter__current');
  if (counter) counter.textContent = wrapped + 1;
}

function galleryActiveIndex(gallery) {
  const thumbs = Array.from(gallery.querySelectorAll('.gallery-thumb'));
  const i = thumbs.findIndex(t => t.classList.contains('gallery-thumb--active'));
  return i === -1 ? 0 : i;
}

document.addEventListener('click', e => {
  const thumb = e.target.closest('.gallery-thumb');
  if (thumb) {
    const gallery = thumb.closest('.piece-preview-gallery');
    if (!gallery) return;
    const thumbs = Array.from(gallery.querySelectorAll('.gallery-thumb'));
    galleryShow(gallery, thumbs.indexOf(thumb));
    return;
  }

  const navBtn = e.target.closest('.gallery-nav');
  if (navBtn) {
    const gallery = navBtn.closest('.piece-preview-gallery');
    if (!gallery) return;
    const delta = navBtn.classList.contains('gallery-nav--prev') ? -1 : 1;
    galleryShow(gallery, galleryActiveIndex(gallery) + delta);
  }
});
