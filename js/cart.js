/* ================================================================
   DEVINE MUSIC — cart.js
   A lightweight client-side cart backed by Payhip's combined
   checkout link (payhip.com/buy?cart_links[]=A&cart_links[]=B).
   Quantity and key travel as qty[A]=N and variant_combination[A]=ID --
   undocumented by Payhip but what its own checkout writes to the URL
   (tested 2026-11-05). They're keyed by product, so a cart can hold
   only one key of a given piece; adding another key replaces it.
   Persists in localStorage so it survives across pages/reloads.
   Injects a cart link into every page's nav automatically.
   ================================================================ */

const Cart = (() => {
  // v3: prices re-set from the canon sheet (2026-11-05) -- a fresh key so
  // carts saved under earlier prices don't linger.
  const STORAGE_KEY = 'devineMusicCart.v3';
  const MAX_QTY = 299; // Payhip checkout's own quantity limit

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

  // Every piece is priced per copy with a minimum order from the canon
  // sheet (5 choral/ensemble, 2 solo voice, 1 instrumental solo),
  // Hinshaw-style; above that, any number.
  const clampQty = (n, min = 1) => Math.min(Math.max(Math.round(Number(n)) || min, min), MAX_QTY);

  // Whole dollars stay "$10"; per-copy prices show cents ("$2.50").
  const money = n => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;

  function add(item) {
    const items = read();
    const existing = items.find(i => i.key === item.key);
    if (existing) {
      // Same key: top up the copies. Different key: swap it in (see header).
      existing.qty = clampQty(existing.variant === item.variant ? existing.qty + item.qty : item.qty, item.minQty);
      existing.minQty = item.minQty;
      existing.variant = item.variant;
      existing.variantLabel = item.variantLabel;
    } else {
      items.push(item);
    }
    write(items);
    openPanel();
  }

  function setQty(key, qty) {
    const items = read();
    const item = items.find(i => i.key === key);
    if (!item) return;
    item.qty = clampQty(qty, item.minQty);
    write(items);
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
    const enc = encodeURIComponent;
    const params = items.flatMap(i => [
      `cart_links[]=${enc(i.key)}`,
      `qty[${enc(i.key)}]=${clampQty(i.qty, i.minQty)}`,
      ...(i.variant ? [`variant_combination[${enc(i.key)}]=${enc(i.variant)}`] : []),
    ]).join('&');
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

    const count = items.reduce((sum, i) => sum + (i.qty || 1), 0);
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
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
        ? items.map(i => {
            const price = Number(i.price) || 0;
            const qty = i.qty || 1;
            const sub = [
              i.variantLabel,
              i.perCopy && `${money(price)} per copy`,
            ].filter(Boolean).join(' · ');
            // Copies stepper only for per-copy pieces; instrumental pieces
            // are a single purchase.
            const qtyCtl = i.perCopy
              ? `<input class="cart-item__qty" type="number" min="${i.minQty || 1}" max="${MAX_QTY}" step="1" inputmode="numeric" value="${qty}" data-qty-key="${i.key}" aria-label="Copies of ${i.title}">`
              : '';
            return `
          <li class="cart-item">
            <span class="cart-item__title">${i.title}${sub ? `<span class="cart-item__sub">${sub}</span>` : ''}</span>
            ${qtyCtl}
            <span class="cart-item__price">${money(price * qty)}</span>
            <button class="cart-item__remove" data-remove="${i.key}" aria-label="Remove">&times;</button>
          </li>`;
          }).join('')
        : `<li class="cart-item cart-item--empty">Your cart is empty.</li>`;
    }

    const totalEl = document.getElementById('cart-panel-total');
    if (totalEl) {
      const total = items.reduce((sum, i) => sum + (Number(i.price) || 0) * (i.qty || 1), 0);
      totalEl.textContent = money(Math.round(total * 100) / 100);
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
      // pages, anywhere. Needs data-key / data-title / data-price, plus
      // data-per-copy for per-copy pieces. On piece pages the buy box's
      // [data-qty] input and [data-variant] key picker ride along.
      const addBtn = e.target.closest('[data-cart-add]');
      if (addBtn) {
        const box = addBtn.closest('.buy-box');
        const qtyInput = box?.querySelector('[data-qty]');
        const variant = box?.querySelector('[data-variant]');
        const perCopy = 'perCopy' in addBtn.dataset;
        const minQty = Number(addBtn.dataset.minQty) || 1;
        add({
          key:   addBtn.dataset.key,
          title: addBtn.dataset.title,
          price: Number(addBtn.dataset.price),
          qty:   clampQty(qtyInput ? qtyInput.value : minQty, minQty),
          minQty,
          perCopy,
          variant:      variant ? variant.value : null,
          variantLabel: variant ? `${variant.closest('label')?.querySelector('span')?.textContent || 'Key'}: ${variant.selectedOptions[0].textContent}` : null,
        });
        const original = addBtn.textContent;
        addBtn.textContent = 'Added ✓';
        addBtn.disabled = true;
        setTimeout(() => { addBtn.textContent = original; addBtn.disabled = false; }, 1500);
      }
    });
  }

  // Copies fields: commit on change (not every keystroke, which would
  // re-render the list and drop focus mid-typing), clamped to 1..MAX_QTY.
  function bindQtyEvents() {
    document.addEventListener('change', e => {
      const cartQty = e.target.closest('[data-qty-key]');
      if (cartQty) { setQty(cartQty.dataset.qtyKey, cartQty.value); return; }
      const boxQty = e.target.closest('.buy-box [data-qty]');
      if (boxQty) boxQty.value = clampQty(boxQty.value, Number(boxQty.min) || 1);
    });
  }

  function init() {
    buildMarkup();
    bindEvents();
    bindQtyEvents();
    render();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { add, setQty, remove, clear, read };
})();
