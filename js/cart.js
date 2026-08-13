/* ================================================================
   DEVINE MUSIC — cart.js
   A lightweight client-side cart backed by Payhip's combined
   checkout link (payhip.com/buy?cart_links[]=A&cart_links[]=B).
   Persists in localStorage so it survives across pages/reloads.
   Injects a cart link into every page's nav automatically.
   ================================================================ */

const Cart = (() => {
  const STORAGE_KEY = 'devineMusicCart';

  function read() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    render();
  }

  function add(item) {
    const items = read();
    if (items.some(i => i.key === item.key)) {
      openPanel(); // already in there — show them rather than doing nothing visible
      return;
    }
    items.push(item);
    write(items);
    openPanel();
  }

  function remove(key) {
    write(read().filter(i => i.key !== key));
  }

  function clear() {
    write([]);
  }

  function checkoutUrl() {
    const items = read();
    if (!items.length) return null;
    const params = items.map(i => `cart_links[]=${encodeURIComponent(i.key)}`).join('&');
    return `https://payhip.com/buy?${params}`;
  }

  // ── UI ────────────────────────────────────────────────────────

  function openPanel() {
    document.getElementById('cart-panel')?.classList.add('cart-panel--open');
    document.getElementById('cart-backdrop')?.classList.add('cart-backdrop--open');
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    document.getElementById('cart-panel')?.classList.remove('cart-panel--open');
    document.getElementById('cart-backdrop')?.classList.remove('cart-backdrop--open');
    document.body.style.overflow = '';
  }

  function togglePanel() {
    const panel = document.getElementById('cart-panel');
    if (panel?.classList.contains('cart-panel--open')) closePanel();
    else openPanel();
  }

  function render() {
    const items = read();

    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = items.length;
      badge.style.display = items.length ? 'inline-flex' : 'none';
    });

    // Cart link only earns its place in the nav once there's something
    // in it -- an empty "Cart" is just noise for a first-time visitor.
    document.querySelectorAll('#cart-toggle').forEach(link => {
      link.style.display = items.length ? '' : 'none';
    });

    const list = document.getElementById('cart-panel-items');
    if (list) {
      list.innerHTML = items.length
        ? items.map(i => `
          <li class="cart-item">
            <span class="cart-item__title">${i.title}</span>
            <span class="cart-item__price">$${i.price}</span>
            <button class="cart-item__remove" data-remove="${i.key}" aria-label="Remove">&times;</button>
          </li>`).join('')
        : `<li class="cart-item cart-item--empty">Your cart is empty.</li>`;
    }

    const totalEl = document.getElementById('cart-panel-total');
    if (totalEl) {
      const total = items.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
      totalEl.textContent = `$${total}`;
    }

    const checkoutBtn = document.getElementById('cart-panel-checkout');
    if (checkoutBtn) {
      checkoutBtn.disabled = items.length === 0;
    }
  }

  function buildMarkup() {
    if (document.getElementById('cart-panel')) return; // already injected on this page

    // Lives directly in .nav__right — a sibling of .nav__links, NOT nested
    // inside it. Nesting inside .nav__links would (a) sweep it into the
    // mobile hamburger dropdown's fixed-position/slide transform, and
    // (b) match main.js's `.nav__links a` selector, which auto-closes the
    // mobile menu on any link click — firing at the same time as our own
    // panel-toggle and producing exactly the overlapping-layout mess this
    // was rewritten to fix.
    const navRight = document.querySelector('.nav__right') || document.querySelector('.nav');
    if (navRight && !document.getElementById('cart-toggle')) {
      const link = document.createElement('a');
      link.href = '#';
      link.id = 'cart-toggle';
      link.className = 'nav__cart-link';
      link.innerHTML = `Cart <span id="cart-badge-inline" class="cart-badge"></span>`;
      navRight.appendChild(link);
    }

    const backdrop = document.createElement('div');
    backdrop.id = 'cart-backdrop';
    backdrop.className = 'cart-backdrop';
    document.body.appendChild(backdrop);

    const panel = document.createElement('div');
    panel.id = 'cart-panel';
    panel.className = 'cart-panel';
    panel.innerHTML = `
      <div class="cart-panel__header">
        <span>Your Cart</span>
        <button type="button" id="cart-panel-close" aria-label="Close cart">&times;</button>
      </div>
      <ul id="cart-panel-items" class="cart-panel__items"></ul>
      <div class="cart-panel__footer">
        <div class="cart-panel__total-row">
          <span>Total</span>
          <span id="cart-panel-total">$0</span>
        </div>
        <button type="button" id="cart-panel-checkout" class="btn btn--primary">Checkout</button>
      </div>
    `;
    document.body.appendChild(panel);
  }

  // Delegated listeners on document — robust regardless of when/how the
  // above elements were inserted, and survive any future re-renders.
  function bindEvents() {
    if (bindEvents._bound) return;
    bindEvents._bound = true;

    document.addEventListener('click', e => {
      if (e.target.closest('#cart-toggle')) {
        e.preventDefault();
        togglePanel();
        return;
      }
      if (e.target.closest('#cart-panel-close') || e.target.closest('#cart-backdrop')) {
        closePanel();
        return;
      }
      if (e.target.closest('#cart-panel-checkout')) {
        const url = checkoutUrl();
        if (url) window.open(url, '_blank');
        return;
      }
      const removeBtn = e.target.closest('[data-remove]');
      if (removeBtn) {
        remove(removeBtn.dataset.remove);
        return;
      }

      // Generic "Add to Cart" trigger — works on the catalog grid, piece
      // pages, anywhere. Needs data-key / data-title / data-price.
      const addBtn = e.target.closest('[data-cart-add]');
      if (addBtn) {
        add({
          key:   addBtn.dataset.key,
          title: addBtn.dataset.title,
          price: addBtn.dataset.price,
        });
        const original = addBtn.textContent;
        addBtn.textContent = 'Added ✓';
        addBtn.disabled = true;
        setTimeout(() => { addBtn.textContent = original; addBtn.disabled = false; }, 1500);
      }
    });
  }

  function init() {
    buildMarkup();
    bindEvents();
    render();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { add, remove, clear, read };
})();
