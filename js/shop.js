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
  applyDefaultFilter('all');
});

// "Add to Cart" clicks are handled globally by cart.js's document-level
// delegation (any [data-cart-add] button works, on this page or any other).

function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  // For sale first, then alphabetical within each group.
  const sorted = [...CATALOG].sort((a, b) => {
    const forSale = (b.payhipKey ? 1 : 0) - (a.payhipKey ? 1 : 0);
    return forSale || a.title.localeCompare(b.title);
  });

  grid.innerHTML = sorted.map((piece, i) => {
    const dataCats = [piece.category, piece.group, piece.season].filter(Boolean).join(' ');
    const label    = piece.voicing
      ? `${piece.categoryLabel} · ${piece.voicing}`
      : piece.categoryLabel || '';
    const delay    = i % 3 === 1 ? ' reveal-delay-1' : i % 3 === 2 ? ' reveal-delay-2' : '';
    const detail   = piece.detail
      ? `<div class="catalog-card__detail">${piece.detail}</div>`
      : '';
    const license  = piece.group === 'vocal'
      ? `<div class="catalog-card__license">Purchase includes a performance license for one ensemble for one performance season.</div>`
      : '';
    const price = piece.price != null
      ? `<div class="catalog-card__price">$${piece.price}</div>`
      : '';
    const cta = piece.payhipKey
      ? `<div class="catalog-card__actions">
    <a href="${piece.pageUrl}" class="btn btn--ghost btn--sm">View</a>
    <button type="button" class="btn btn--primary btn--sm" data-cart-add data-key="${piece.payhipKey}" data-title="${piece.title.replace(/"/g, '&quot;')}" data-price="${piece.price}">Add to Cart</button>
  </div>`
      : piece.shopifyEmbed
      ? `<div class="catalog-card__cta">${piece.shopifyEmbed}</div>`
      : `<div class="catalog-card__cta"><a href="contact.html" class="btn btn--primary btn--sm">Inquire</a></div>`;

    return `<div class="catalog-card reveal${delay}" data-category="${dataCats}">
  <div class="catalog-card__meta">
    <span class="label">${label}</span>
    <span class="catalog-card__season">${cap(piece.season)}</span>
  </div>
  <div class="catalog-card__title">${piece.title}</div>
  ${detail}
  ${price}
  ${cta}
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

function applyDefaultFilter(value) {
  const btn = document.querySelector(`.filter-btn[data-filter="${value}"]`);
  if (btn) btn.click();
}

function cap(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
