/* ================================================================
   DEVINE MUSIC — shop.js
   Renders catalog cards from js/catalog.js and handles filter bar.
   To add/edit pieces: edit js/catalog.js
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof CATALOG === 'undefined') return;
  renderCatalog();
  if (typeof initReveal === 'function') initReveal();
  initFilters();
});

function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  grid.innerHTML = CATALOG.map((piece, i) => {
    const dataCats = [piece.category, piece.season].filter(Boolean).join(' ');
    const label    = piece.voicing
      ? `${cap(piece.category)} · ${piece.voicing}`
      : cap(piece.category);
    const delay    = i % 3 === 1 ? ' reveal-delay-1' : i % 3 === 2 ? ' reveal-delay-2' : '';
    const detail   = piece.detail
      ? `<div class="catalog-card__detail">${piece.detail}</div>`
      : '';
    const license  = piece.category === 'choral'
      ? `<div class="catalog-card__license">Purchase includes a performance license for one ensemble for one performance season.</div>`
      : '';
    const cta = piece.shopifyEmbed
      ? piece.shopifyEmbed
      : `<a href="contact.html" class="btn btn--primary btn--sm">Inquire</a>`;

    return `<div class="catalog-card reveal${delay}" data-category="${dataCats}">
  <div class="catalog-card__meta">
    <span class="label">${label}</span>
    <span class="catalog-card__season">${cap(piece.season)}</span>
  </div>
  <div class="catalog-card__title">${piece.title}</div>
  ${detail}
  <div class="catalog-card__price">$${piece.price}</div>
  <div class="catalog-card__cta">${cta}</div>
  ${license}
</div>`;
  }).join('\n');
}

function initFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('catalog-grid');
  if (!btns.length || !grid) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      grid.querySelectorAll('.catalog-card').forEach(card => {
        const cats = (card.dataset.category || '').split(' ');
        const show = filter === 'all' || cats.includes(filter);
        card.style.display = show ? '' : 'none';
        if (show) setTimeout(() => card.classList.add('visible'), 10);
      });
    });
  });
}

function cap(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
