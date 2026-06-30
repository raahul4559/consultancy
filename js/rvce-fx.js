/* ========== EDITORIAL FX — section-image letter-split titles ========== */
/* Splits each .section-image__title h2[data-letters] into per-letter spans and
   reveals them when the banner scrolls into view (editorial reference design). */
(function () {
  const titles = document.querySelectorAll('.section-image__title h2[data-letters]');

  titles.forEach((h2) => {
    if (h2.dataset.lettersBuilt) return;
    let i = 0;
    const wrap = (text) => {
      let html = '';
      for (const ch of text) {
        if (/\s/.test(ch)) { html += ' '; }
        else { html += `<span class="letter" style="--i:${i}">${ch}</span>`; i++; }
      }
      return html;
    };
    const out = [];
    Array.from(h2.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) out.push(wrap(node.textContent));
      else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'span')
        out.push(`<span class="title-accent">${wrap(node.textContent)}</span>`);
      else out.push(node.outerHTML || '');
    });
    h2.innerHTML = out.join('');
    h2.dataset.lettersBuilt = '1';
  });

  const banners = document.querySelectorAll('.section-image');
  if (!banners.length) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    banners.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-visible', e.isIntersecting));
  }, { threshold: [0, 0.2, 0.5], rootMargin: '0px 0px -5% 0px' });

  banners.forEach((el) => io.observe(el));
})();
