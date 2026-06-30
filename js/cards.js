/* ========== 3D CARD TILT + GLOW TRACKING ========== */

(function() {
  // Only apply on hover-capable devices
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;

  const maxTilt = 5; // degrees

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = ((x - centerX) / centerX) * maxTilt;
      const tiltY = ((y - centerY) / centerY) * -maxTilt;

      card.style.transform = `perspective(800px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) translateY(-4px)`;

      // Update glow position
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease';
      card.style.transform = '';
    });
  });
})();
