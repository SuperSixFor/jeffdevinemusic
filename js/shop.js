/* ================================================================
   DEVINE MUSIC — shop.js
   Catalog filter bar behavior
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.catalog-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide cards
      cards.forEach(card => {
        const categories = card.dataset.category || '';
        const show = filter === 'all' || categories.includes(filter);

        if (show) {
          card.style.display = '';
          // Re-trigger reveal if needed
          setTimeout(() => card.classList.add('visible'), 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

});
