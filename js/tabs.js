// College page tabs + FAQ accordion
document.addEventListener('DOMContentLoaded', () => {
  // Tab switcher
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabLinks.forEach(t => {
    t.addEventListener('click', e => {
      e.preventDefault();
      const id = t.dataset.tab;
      tabLinks.forEach(x => x.classList.remove('active'));
      tabPanels.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const panel = document.getElementById('tab-' + id);
      if (panel) {
        panel.classList.add('active');
        const tabsWrap = document.querySelector('.tabs-wrap');
        const offset = (tabsWrap ? tabsWrap.getBoundingClientRect().bottom : 80) + 12;
        const top = panel.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    });
  });

  // FAQ accordion (one open at a time)
  document.querySelectorAll('.faq-item .faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
});
