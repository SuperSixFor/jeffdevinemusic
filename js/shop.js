/* ================================================================
   DEVINE MUSIC — shop.js
   Renders catalog cards from js/catalog.js and handles filter bar.
   To add/edit pieces: edit js/catalog.js
   ================================================================ */

let activeFilter = 'all';
let activeQuery  = '';

// Persists filter + search across navigation (browser back, and our own
// "← Back to Catalog" link on piece pages) so returning to the catalog
// doesn't dump the visitor back to an unfiltered grid. sessionStorage
// (not localStorage) on purpose -- scoped to this browsing session/tab,
// not a permanent preference that outlives the visit.
const FILTER_STATE_KEY = 'shopFilterState';

function restoreFilterState() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(FILTER_STATE_KEY));
    if (saved) {
      activeFilter = saved.filter || 'all';
      activeQuery  = saved.query  || '';
    }
  } catch {
    // malformed/unavailable storage -- fall back to defaults
  }
}

function saveFilterState() {
  try {
    sessionStorage.setItem(FILTER_STATE_KEY, JSON.stringify({ filter: activeFilter, query: activeQuery }));
  } catch {
    // storage unavailable (private browsing, quota, etc.) -- filtering
    // still works for this page load, it just won't persist
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof CATALOG === 'undefined') return;
  restoreFilterState();
  renderCatalog();
  if (typeof initReveal === 'function') initReveal();
  initFilters();
  initSearch();
  applyFilters();
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
      : `<div class="catalog-card__cta"><a href="index.html#contact" class="btn btn--primary btn--sm">Inquire</a></div>`;

    // Searched against title/voicing/category/season together so a query
    // like "guitar" or "advent" matches even when it's not in the title.
    const searchText = [piece.title, piece.voicing, piece.categoryLabel, piece.season]
      .filter(Boolean).join(' ').toLowerCase().replace(/"/g, '&quot;');

    return `<div class="catalog-card reveal${delay}" data-category="${dataCats}" data-search="${searchText}">
  <div class="catalog-card__meta">
    <span class="label">${label}</span>
    <span class="catalog-card__season">${cap(piece.season)}</span>
  </div>
  <div class="catalog-card__title">${titleHtml(piece.title)}</div>
  ${detail}
  ${price}
  ${cta}
</div>`;
  }).join('\n');
}

function initFilters() {
  // [data-filter] excludes the search toggle -- it's a .filter-btn too
  // (same look), but it isn't a category and has no filter value.
  const btns = document.querySelectorAll('.filter-btn[data-filter]');
  if (!btns.length) return;

  // main.js's populateShop() regenerates these buttons from config.js and
  // hardcodes the first one ("All") as active -- clear that unconditionally
  // before applying the restored filter, or a restored non-"all" filter
  // ends up with two buttons marked active at once.
  btns.forEach(btn => btn.classList.remove('active'));

  btns.forEach(btn => {
    if (btn.dataset.filter === activeFilter) btn.classList.add('active');
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
}

function initSearch() {
  const toggle = document.getElementById('shop-search-toggle');
  const row    = document.getElementById('shop-search-row');
  const input  = document.getElementById('shop-search');
  if (!toggle || !row || !input) return;

  const closeSearch = () => {
    row.classList.remove('shop-search--open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    if (activeQuery) {
      input.value = '';
      activeQuery = '';
      applyFilters();
    }
  };

  const openSearch = (focus = true) => {
    row.classList.add('shop-search--open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    if (focus) input.focus();
  };

  toggle.addEventListener('click', () => {
    if (row.classList.contains('shop-search--open')) closeSearch();
    else openSearch();
  });

  input.addEventListener('input', () => {
    activeQuery = input.value.trim().toLowerCase();
    applyFilters();
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
  });

  // Reflect a restored query (from a previous visit to the grid this
  // session) in the UI -- expand the row and fill the field, don't just
  // filter silently with no visible explanation.
  if (activeQuery) {
    input.value = activeQuery;
    openSearch(false);
  }
}

// Category filter and search query narrow the grid together (AND, not
// either/or) -- so "Guitar Originals" + "advent" is a valid combination.
function applyFilters() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  let visibleCount = 0;
  grid.querySelectorAll('.catalog-card').forEach(card => {
    const cats = (card.dataset.category || '').split(' ');
    const matchesFilter = activeFilter === 'all' || cats.includes(activeFilter);
    const matchesQuery  = !activeQuery || (card.dataset.search || '').includes(activeQuery);
    const show = matchesFilter && matchesQuery;
    card.style.display = show ? '' : 'none';
    if (show) {
      visibleCount++;
      setTimeout(() => card.classList.add('visible'), 10);
    }
  });

  const empty = document.getElementById('catalog-empty');
  if (empty) empty.style.display = visibleCount === 0 ? '' : 'none';

  saveFilterState();
}

function cap(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Tune names conventionally render in italics in print. Only used where
// a title is inserted as visible HTML (catalog cards) -- never in
// data-title/alt/etc. attributes, where a literal <em> tag would show
// up as text instead of rendering. Keep in sync with sync_catalog.py's
// ITALIC_TUNE_NAMES / title_html().
const ITALIC_TUNE_NAMES = ['Sursum Corda'];

function titleHtml(title) {
  return ITALIC_TUNE_NAMES.reduce((t, name) => t.split(name).join(`<em>${name}</em>`), title);
}
