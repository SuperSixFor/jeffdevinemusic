/* ================================================================
   DEVINE MUSIC — main.js
   Reads config.js and populates all pages. Edit config.js only.
   ================================================================ */

// ── THEME LOADER (runs immediately, before DOMContentLoaded) ──
;(function() {
  if (typeof SITE === 'undefined' || !SITE.theme) return;
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  // Root-relative — must resolve correctly from subdirectory pages
  // (catalog/*.html) too, not just top-level pages. A page-relative path
  // here 404s on any page not at the site root, silently leaving every
  // --color-* custom property undefined (transparent panels, invisible
  // badge colors, etc. — exactly the bugs this was tracked down from).
  link.href = '/css/themes/' + SITE.theme;
  document.head.appendChild(link);
})();

document.addEventListener('DOMContentLoaded', () => {

  if (typeof SITE === 'undefined') return;

  // Detect current page
  const page = location.pathname.split('/').pop().replace('.html','') || 'index';

  // ── ALWAYS: NAV + FOOTER ────────────────────────────────────
  populateNav(page);
  populateFooter();

  // ── PER-PAGE ─────────────────────────────────────────────────
  // index.html is the single-page site (hero/about/featured/recordings/contact,
  // all merged in one document) -- only catalog.html + catalog/*.html are
  // separate pages, so they're the only other entries here.
  const handlers = {
    'index':   populateIndex,
    '':        populateIndex,
    'catalog': populateCatalog,
  };
  (handlers[page] || (() => {}))();

  // ── SCROLL BEHAVIORS ─────────────────────────────────────────
  initNav();
  initMobileNav();
  initReveal();
  if (page === 'index' || page === '') initScrollSpy();

  // Re-jump to the URL hash (#about/#recordings/#contact) now that the
  // sections above have been populated -- the browser's own initial
  // anchor-scroll runs against the pre-population (mostly empty)
  // layout, so without this a direct link like index.html#contact
  // lands short of the actual section once content pushes it down.
  scrollToHash();
  // Fonts/images finishing after DOMContentLoaded can still reflow
  // section positions (e.g. the About headshot), leaving the jump
  // above short -- window.load fires once everything has settled,
  // so re-apply it there too.
  window.addEventListener('load', scrollToHash);

});

function scrollToHash() {
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  // Instant, not smooth: this is a corrective snap to where the section
  // ended up after content/images loaded, not a user-initiated scroll --
  // animating it would just be a second, jarring scroll on top of
  // whatever (if anything) the browser's own initial jump already did.
  if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
}

// ── NAV ─────────────────────────────────────────────────────────
function populateNav(currentPage) {
  // Logo
  document.querySelectorAll('.nav__logo').forEach(el => {
    const [first, ...rest] = SITE.name.split(' ');
    el.innerHTML = `<span class="logo-first">${first}</span> <span class="logo-last">${rest.join(' ')}</span>`;
  });

  // Active link highlight (already set in HTML via class, this is a safeguard)
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.includes(currentPage) && currentPage !== 'index' && currentPage !== '') {
      a.classList.add('nav__link--active');
    }
  });
}

function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Highlights the nav link for whichever section (#about/#recordings/#contact)
// is currently in view, since index.html is a single scrolling page.
function initScrollSpy() {
  const links = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  if (!links.length) return;
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach(a => a.classList.toggle('nav__link--active', a.getAttribute('href') === `#${id}`));
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => observer.observe(s));
}

function initMobileNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const btn = document.createElement('button');
  btn.className = 'nav__toggle';
  btn.setAttribute('aria-label', 'Toggle menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  // Lives in .nav__right (not directly in .nav) so .nav keeps exactly
  // 2 top-level children (logo, nav__right) for justify-content:space-between,
  // regardless of what else nav__right ends up holding (cart link, etc).
  (document.querySelector('.nav__right') || nav).appendChild(btn);

  const close = () => {
    nav.classList.remove('nav--open');
    document.body.style.overflow = '';
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('nav--open');
    document.body.style.overflow = open ? 'hidden' : '';
    btn.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', close));
}

// ── FOOTER ───────────────────────────────────────────────────────
function populateFooter() {
  document.querySelectorAll('.footer__logo').forEach(el => el.textContent = SITE.dba);
  const year = new Date().getFullYear();
  document.querySelectorAll('.footer__notes').forEach(el => {
    el.innerHTML = `
      &copy; ${year} ${SITE.dba}. All rights reserved.<br>
      ${SITE.footer.ascapNote}<br>
      ${SITE.footer.melBayNote}
    `;
  });
}

// ── REVEAL ───────────────────────────────────────────────────────
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}

// ── INDEX (single-page site: hero + about + featured + recordings + contact) ──
function populateIndex() {
  const h = SITE.home;

  // Hero
  const heroName = document.querySelector('.hero__name');
  if (heroName) heroName.innerHTML = h.heroHeading.replace('Devine', '<em>Devine</em>');

  setText('.hero__sub', h.heroSub);

  const cta = document.querySelector('.hero__cta .btn');
  if (cta) { cta.textContent = h.heroCTA.label; cta.href = h.heroCTA.href; }

  setText('.featured__intro', h.featuredIntro);

  initFeaturedRotation();

  populateMusic();
  populateAbout();
  populateContact();
}

// ── FEATURED WORKS ROTATION ─────────────────────────────────────
// Homepage "Selected Works" tiles: 3 real pieces, always from 3
// different catalog categories, swapped for a fresh set on an
// interval. Reads js/catalog.js's CATALOG global -- index.html must
// load that script before main.js.
const FEATURED_ROTATION_MS = 8000;
const FEATURED_FADE_MS = 500;

// Tune names conventionally render in italics in print. Keep in sync
// with catalog-page.js's / sync_catalog.py's ITALIC_TUNE_NAMES --
// index.html doesn't load catalog-page.js, so this copy is what
// covers the homepage's featured tiles.
const ITALIC_TUNE_NAMES = ['Sursum Corda', 'Lasst Uns Erfreuen', 'Kingsfold', 'Duke Street'];

function titleHtml(title) {
  return ITALIC_TUNE_NAMES.reduce((t, name) => t.split(name).join(`<em>${name}</em>`), title);
}

function initFeaturedRotation() {
  const grid = document.querySelector('.featured__grid');
  if (!grid || typeof CATALOG === 'undefined') return;

  const byCategory = {};
  CATALOG.forEach(piece => {
    if (!piece.payhipKey) return; // only real, purchasable pieces
    (byCategory[piece.category] ||= []).push(piece);
  });
  const categories = Object.keys(byCategory);
  if (categories.length < 1) return;

  let lastKeys = [];

  function pickSet() {
    const shuffled = [...categories].sort(() => Math.random() - 0.5);
    const chosenCats = shuffled.slice(0, Math.min(3, categories.length));
    let set = chosenCats.map(cat => {
      const options = byCategory[cat];
      return options[Math.floor(Math.random() * options.length)];
    });
    // Avoid re-showing the exact same 3 pieces back to back, when
    // there's enough variety in the catalog to avoid it.
    if (categories.length >= 3) {
      let attempts = 0;
      while (set.every(p => lastKeys.includes(p.payhipKey)) && attempts < 5) {
        set = chosenCats.map(cat => {
          const options = byCategory[cat];
          return options[Math.floor(Math.random() * options.length)];
        });
        attempts++;
      }
    }
    lastKeys = set.map(p => p.payhipKey);
    return set;
  }

  function renderSet(pieces) {
    grid.innerHTML = pieces.map((piece, i) => {
      const season = piece.season ? piece.season.charAt(0).toUpperCase() + piece.season.slice(1) : '';
      return `
      <a href="${piece.pageUrl}" class="featured__card reveal reveal-delay-${i + 1}">
        <div class="featured__card-top">
          <span class="label featured__card-label">${piece.categoryLabel || ''}</span>
          ${season ? `<span class="featured__card-season">${season}</span>` : ''}
        </div>
        <div class="featured__card-title">${titleHtml(piece.title)}</div>
        <div class="featured__card-meta">${piece.voicing || ''}</div>
        <div class="featured__card-link">View Piece &rarr;</div>
      </a>
    `;
    }).join('');
    grid.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  renderSet(pickSet());

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || categories.length < 2) return; // static set only

  setInterval(() => {
    if (document.hidden) return; // don't animate an unseen tab
    grid.classList.add('featured__grid--fading');
    setTimeout(() => {
      renderSet(pickSet());
      grid.classList.remove('featured__grid--fading');
    }, FEATURED_FADE_MS);
  }, FEATURED_ROTATION_MS);
}

// ── ABOUT ────────────────────────────────────────────────────────
function populateAbout() {
  const a = SITE.about;

  // Bio paragraphs
  const bioContainer = document.querySelector('.bio-paragraphs');
  if (bioContainer && a.bio) {
    bioContainer.innerHTML = a.bio
      .map(p => `<p>${p.trim()}</p>`)
      .join('');
  }

  // Credentials
  const credList = document.querySelector('.credentials__list');
  if (credList && a.credentials) {
    credList.innerHTML = a.credentials
      .map(c => `<li>${c}</li>`)
      .join('');
  }

  // Headshot
  const img = document.querySelector('.about-strip__image img, .bio-section__image img');
  if (img) {
    img.src = a.headshotSrc;
    img.alt = a.headshotAlt;
  }

  // Publications
  const pubList = document.querySelector('.publications__list');
  if (pubList && a.publications) {
    pubList.innerHTML = a.publications
      .filter(p => p.publisher)
      .map(renderPublication)
      .join('');
  }
}

// ── RECORDINGS (guitar recordings section) ────────────────────────
function populateMusic() {
  const m = SITE.music;
  setText('.music-guitar-heading', m.guitarHeading);
  setText('.music-guitar-subhead', m.guitarSubhead);
  setText('.music-guitar-body', m.guitarBody);
  populateStreamingLinks('.streaming__links');
}

// ── PUBLICATIONS RENDERING (shared — about) ───────────────────────
function renderPublication(p) {
  const songPart  = p.song  ? `"${p.song}" in ` : '';
  const innerText = p.song ? `${songPart}<em>${p.title}</em>` : `<em>${p.title}</em>`;
  const titlePart = p.title
    ? ` — ` + (p.url
        ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer">${innerText}</a>`
        : innerText)
    : '';
  const notePart  = p.note ? ` <span style="opacity:.6;">(${p.note})</span>` : '';
  return `<li>${p.publisher}${titlePart}${notePart}</li>`;
}

// ── CATALOG ──────────────────────────────────────────────────────
function populateCatalog() {
  const s = SITE.catalog;

  // Filter bar
  const filterBar = document.querySelector('.filter-bar');
  if (filterBar && s.filters) {
    filterBar.innerHTML = s.filters.map((f, i) =>
      `<button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${f.value}">${f.label}</button>`
    ).join('');
  }

  // Footer note
  const note = document.querySelector('.catalog-note');
  if (note) note.innerHTML = s.footerNote;
}

// ── CONTACT ──────────────────────────────────────────────────────
function populateContact() {
  const c = SITE.contact;

  setText('.contact-intro', c.intro);

  const form = document.querySelector('.contact-form form');
  if (form) form.action = c.formAction;

  const emailLink = document.querySelector('.contact-email');
  if (emailLink) {
    emailLink.href = `mailto:${SITE.email}`;
    emailLink.textContent = SITE.email;
  }

  // Subject options
  const select = document.querySelector('#subject');
  if (select && c.subjects) {
    const defaultOpt = select.querySelector('option[value=""]');
    select.innerHTML = '';
    if (defaultOpt) select.appendChild(defaultOpt);
    c.subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.toLowerCase().replace(/\s+/g, '-');
      opt.textContent = s;
      select.appendChild(opt);
    });
  }
}

// ── STREAMING LINKS ───────────────────────────────────────────────
function populateStreamingLinks(selector) {
  const container = document.querySelector(selector);
  if (!container) return;

  const defs = [
    { key: 'spotify',    label: 'Spotify' },
    { key: 'appleMusic', label: 'Apple Music' },
  ];

  // Clear placeholder links first
  container.querySelectorAll('a[data-streaming]').forEach(el => el.remove());

  defs.forEach(({ key, label }) => {
    const href = SITE.links[key];
    const existing = container.querySelector(`a[data-key="${key}"]`);
    if (existing) {
      if (href) { existing.href = href; existing.style.opacity = ''; existing.style.pointerEvents = ''; }
      return;
    }
    if (!href) return;
    const a = document.createElement('a');
    a.href = href;
    a.dataset.key = key;
    a.dataset.streaming = '1';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'btn btn--ghost';
    a.textContent = label;
    container.appendChild(a);
  });
}

// ── UTIL ─────────────────────────────────────────────────────────
function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el && value) el.textContent = value.trim();
}
