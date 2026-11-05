/* ================================================================
   DEVINE MUSIC — catalog-page.js
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
const FILTER_STATE_KEY = 'catalogFilterState';

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

  // For sale first (ours or another publisher's), then alphabetical within each group.
  const isForSale = p => p.payhipKey || p.buyUrl ? 1 : 0;
  const sorted = [...CATALOG].sort((a, b) => {
    const forSale = isForSale(b) - isForSale(a);
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
    // One line each: key(s), then the minimum order. "Keys" when several
    // are offered (e.g. "F, G" or "E♭-A♭").
    const specsHtml = [
      piece.keys   && `${/[,-]/.test(piece.keys) ? 'Keys' : 'Key'}: ${piece.keys}`,
      piece.minQty && `Min. ${piece.minQty} copies`,
    ].filter(Boolean).map(s => `<div class="catalog-card__specs">${s}</div>`).join('\n  ');
    const price = piece.price != null
      ? `<div class="catalog-card__price">${money(piece.price)}${piece.perCopy ? ' <span class="catalog-card__unit">per copy</span>' : ''}</div>`
      : '';
    // Pieces sold by another publisher (buyUrl) link straight to their
    // product page in the same button slot -- no cart, no price.
    // Pieces sold in several keys need the key picker on their own page
    // before they can go in the cart.
    const cta = piece.buyUrl
      ? `<div class="catalog-card__actions">
    <a href="${piece.pageUrl}" class="btn btn--ghost btn--sm">View</a>
    <a href="${piece.buyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm">${piece.buyLabel || 'Buy'}</a>
  </div>`
      : piece.variants
      ? `<div class="catalog-card__actions">
    <a href="${piece.pageUrl}" class="btn btn--primary btn--sm">Choose Key</a>
  </div>`
      : piece.payhipKey
      ? `<div class="catalog-card__actions">
    <a href="${piece.pageUrl}" class="btn btn--ghost btn--sm">View</a>
    <button type="button" class="btn btn--primary btn--sm" data-cart-add data-key="${piece.payhipKey}" data-title="${piece.title.replace(/"/g, '&quot;')}" data-price="${piece.price}"${piece.perCopy ? ` data-per-copy data-min-qty="${piece.minQty}"` : ''}>Add to Cart</button>
  </div>`
      : piece.shopifyEmbed
      ? `<div class="catalog-card__cta">${piece.shopifyEmbed}</div>`
      : `<div class="catalog-card__cta"><a href="index.html#contact" class="btn btn--primary btn--sm">Inquire</a></div>`;

    // Same small toggle + progress bar as the piece pages (js/audio-preview.js).
    const audio = piece.audio
      ? `<div class="audio-preview">
    <button type="button" class="audio-toggle" data-audio="${piece.audio}" aria-label="Play preview" aria-pressed="false" title="Listen"><svg class="audio-toggle__play" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg><svg class="audio-toggle__pause" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1h3v10H2zM7 1h3v10H7z"/></svg></button>
    <div class="audio-preview__bar" role="progressbar" aria-label="Preview progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span class="audio-preview__fill"></span></div>
  </div>`
      : '';

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
  ${specsHtml}
  ${audio}
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

  // main.js's populateCatalog() regenerates these buttons from config.js and
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
      // Picking a new filter resets which cards show -- if the visitor was
      // scrolled down into the old results, jump back up so the new set
      // is visible instead of leaving them stranded past the fold.
      document.querySelector('.catalog-filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initSearch() {
  const toggle = document.getElementById('catalog-search-toggle');
  const row    = document.getElementById('catalog-search-row');
  const input  = document.getElementById('catalog-search');
  const clearBtn = document.getElementById('catalog-search-clear');
  if (!toggle || !row || !input) return;

  const updateClearBtn = () => {
    if (clearBtn) clearBtn.hidden = !input.value;
  };

  const closeSearch = () => {
    row.classList.remove('catalog-search--open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    if (activeQuery) {
      input.value = '';
      activeQuery = '';
      applyFilters();
    }
    updateClearBtn();
  };

  const openSearch = (focus = true) => {
    row.classList.add('catalog-search--open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    if (focus) input.focus();
  };

  toggle.addEventListener('click', () => {
    if (row.classList.contains('catalog-search--open')) closeSearch();
    else openSearch();
  });

  input.addEventListener('input', () => {
    activeQuery = input.value.trim().toLowerCase();
    applyFilters();
    updateClearBtn();
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
  });

  // Clears the text but keeps the search row open -- closeSearch() is for
  // dismissing the whole search UI, this is just "start the query over."
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      activeQuery = '';
      applyFilters();
      updateClearBtn();
      input.focus();
    });
  }

  // Reflect a restored query (from a previous visit to the grid this
  // session) in the UI -- expand the row and fill the field, don't just
  // filter silently with no visible explanation.
  if (activeQuery) {
    input.value = activeQuery;
    openSearch(false);
  }
  updateClearBtn();
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

// Whole dollars stay "$5"; per-copy prices show cents ("$2.50").
function money(n) {
  return `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
}

function cap(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// titleHtml() / ITALIC_TUNE_NAMES live in main.js (loaded before this
// file on catalog.html) so the homepage's featured tiles and this
// page's cards share one definition -- keep that copy in sync with
// sync_catalog.py's ITALIC_TUNE_NAMES / title_html().
