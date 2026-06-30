/* ========== TESTIMONIALS CAROUSEL ========== */

(function() {
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!track || cards.length === 0) return;

  let current = 0;
  let autoplayTimer;
  let touchStartX = 0;
  let touchEndX = 0;

  function goTo(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;

    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;

    cards.forEach((card, i) => {
      card.classList.toggle('active', i === current);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAutoplay();
    });
  });

  // Touch support
  const wrapper = document.querySelector('.testimonials-wrapper');
  if (wrapper) {
    wrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }

      startAutoplay();
    }, { passive: true });
  }

  // Initialize
  goTo(0);
  startAutoplay();

  // Pause on hover
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
  }
})();
