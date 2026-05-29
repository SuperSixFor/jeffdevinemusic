/* ================================================================
   DEVINE MUSIC — main.js
   Reads config.js and populates all pages. Edit config.js only.
   ================================================================ */

// ── THEME LOADER (runs immediately, before DOMContentLoaded) ──
;(function() {
  if (typeof SITE === 'undefined' || !SITE.theme) return;
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = 'css/themes/' + SITE.theme;
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
  const handlers = {
    'index':   populateHome,
    '':        populateHome,
    'about':   populateAbout,
    'music':   populateMusic,
    'shop':    populateShop,
    'contact': populateContact,
  };
  (handlers[page] || (() => {}))();

  // ── SCROLL BEHAVIORS ─────────────────────────────────────────
  initNav();
  initReveal();

});

// ── NAV ─────────────────────────────────────────────────────────
function populateNav(currentPage) {
  // Logo
  document.querySelectorAll('.nav__logo').forEach(el => el.textContent = SITE.name);

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

// ── HOME ─────────────────────────────────────────────────────────
function populateHome() {
  const h = SITE.home;

  // Hero
  const heroName = document.querySelector('.hero__name');
  if (heroName) heroName.innerHTML = h.heroHeading.replace('Devine', '<em>Devine</em>');

  setText('.hero__sub', h.heroSub);

  const cta = document.querySelector('.hero__cta .btn');
  if (cta) { cta.textContent = h.heroCTA.label; cta.href = h.heroCTA.href; }

  // About strip
  setText('.about-strip .bio-excerpt', h.aboutExcerpt);
  setText('.about-strip .bio-excerpt-note', h.aboutExcerptNote);

  // Featured pieces
  const grid = document.querySelector('.featured__grid');
  if (grid && h.featuredPieces && h.featuredPieces.length) {
    grid.innerHTML = '';
    h.featuredPieces.forEach((piece, i) => {
      const a = document.createElement('a');
      a.href = piece.href || 'shop.html';
      a.className = `featured__card reveal reveal-delay-${i + 1}`;
      a.innerHTML = `
        <div class="label featured__card-label">${piece.season || ''}</div>
        <div class="featured__card-title">${piece.title}</div>
        <div class="featured__card-meta">${piece.voicing || ''}</div>
      `;
      grid.appendChild(a);
    });
  }

  // Streaming links (index)
  populateStreamingLinks('.streaming__links');

  // Publishers
  const publishersGrid = document.getElementById('publishers-grid');
  if (publishersGrid && h.publishers && h.publishers.length) {
    publishersGrid.innerHTML = h.publishers.map(pub =>
      `<a href="${pub.url}" class="publisher-card" target="_blank" rel="noopener noreferrer">
        <div class="publisher-card__label">${pub.name}</div>
        <div class="publisher-card__title">${pub.title}</div>
        ${pub.desc ? `<div class="publisher-card__desc">${pub.desc}</div>` : ''}
        ${pub.note ? `<div class="publisher-card__note">${pub.note}</div>` : ''}
      </a>`
    ).join('');
  }
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
      .map(p => {
        const titlePart = p.title
          ? (p.url
              ? ` — <a href="${p.url}" target="_blank" rel="noopener noreferrer"><em>${p.title}</em></a>`
              : ` — <em>${p.title}</em>`)
          : '';
        const notePart = p.note ? ` <span style="opacity:.6;">(${p.note})</span>` : '';
        return `<li>${p.publisher}${titlePart}${notePart}</li>`;
      })
      .join('');
  }
}

// ── MUSIC ────────────────────────────────────────────────────────
function populateMusic() {
  const m = SITE.music;
  setText('.music-guitar-heading', m.guitarHeading);
  setText('.music-guitar-subhead', m.guitarSubhead);
  setText('.music-guitar-body', m.guitarBody);
  setText('.music-choral-heading', m.choralHeading);
  setText('.music-choral-subhead', m.choralSubhead);
  setText('.music-choral-body', m.choralBody);
  populateStreamingLinks('.streaming__links');
}

// ── SHOP ─────────────────────────────────────────────────────────
function populateShop() {
  const s = SITE.shop;

  // Filter bar
  const filterBar = document.querySelector('.filter-bar');
  if (filterBar && s.filters) {
    filterBar.innerHTML = s.filters.map((f, i) =>
      `<button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${f.value}">${f.label}</button>`
    ).join('');
  }

  // Footer note
  const note = document.querySelector('.shop-note');
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
