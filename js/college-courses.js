/* ========== COLLEGE PAGES — Courses Offered accordion ==========
   Transforms the "Courses Offered" card grid (#courses .row) into a clean
   accordion: title-only by default, click to expand the description.
   One item open at a time, smooth height animation, rotating chevron. */
(function () {
  function init() {
    const grid = document.querySelector('#courses .row');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.srm-course-card'));
    if (!cards.length) return;

    const acc = document.createElement('div');
    acc.className = 'course-accordion';

    cards.forEach((card) => {
      const ic = card.querySelector('.ic');
      const title = card.querySelector('h5');
      const desc = card.querySelector('p');
      const badge = card.querySelector('.srm-apply-badge');

      const item = document.createElement('div');
      item.className = 'course-item';
      item.innerHTML =
        '<button type="button" class="course-q" aria-expanded="false">' +
          (ic ? '<span class="course-q-icon">' + ic.innerHTML + '</span>' : '') +
          '<span class="course-q-title">' + (title ? title.innerHTML : 'Course') + '</span>' +
          (badge ? '<span class="course-q-badge">' + badge.textContent.trim() + '</span>' : '') +
          '<span class="course-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '</button>' +
        '<div class="course-a"><div class="course-a-inner">' + (desc ? desc.innerHTML : '') + '</div></div>';
      acc.appendChild(item);
    });

    grid.replaceWith(acc);

    const items = Array.from(acc.querySelectorAll('.course-item'));
    items.forEach((item) => {
      const q = item.querySelector('.course-q');
      const panel = item.querySelector('.course-a');
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // collapse all (one open at a time)
        items.forEach((other) => {
          other.classList.remove('open');
          other.querySelector('.course-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.course-a').style.maxHeight = null;
        });
        // expand the clicked one if it was closed
        if (!isOpen) {
          item.classList.add('open');
          q.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });

    // Keep an open panel sized correctly on resize
    window.addEventListener('resize', () => {
      const open = acc.querySelector('.course-item.open .course-a');
      if (open) open.style.maxHeight = open.scrollHeight + 'px';
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
