/* ========== HERO CANVAS MESH + PARTICLES ========== */

(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationId;
  let mouse = { x: 0, y: 0 };
  const isMobile = window.innerWidth <= 768;

  // Orbs configuration
  const orbs = [
    { x: 0.2, y: 0.5, radius: 300, color: [59, 130, 246], vx: 0.3, vy: 0.2, opacity: 0.2 },
    { x: 0.8, y: 0.3, radius: 250, color: [139, 92, 246], vx: -0.2, vy: 0.3, opacity: 0.15 },
    { x: 0.5, y: 0.8, radius: 280, color: [16, 185, 129], vx: 0.25, vy: -0.15, opacity: 0.12 },
    { x: 0.6, y: 0.2, radius: 200, color: [59, 130, 246], vx: -0.15, vy: -0.25, opacity: 0.08 }
  ];

  // Particles
  const particleCount = isMobile ? 20 : 50;
  const particles = [];
  const connectionDistance = 120;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;

    // Initialize particles on resize
    if (particles.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.1
        });
      }
    }
  }

  function drawOrbs(time) {
    orbs.forEach(orb => {
      // Slow drift
      const px = orb.x * width + Math.sin(time * 0.001 * orb.vx) * 80;
      const py = orb.y * height + Math.cos(time * 0.001 * orb.vy) * 60;
      const r = orb.radius * (isMobile ? 0.6 : 1);

      const gradient = ctx.createRadialGradient(px, py, 0, px, py, r);
      gradient.addColorStop(0, `rgba(${orb.color.join(',')}, ${orb.opacity})`);
      gradient.addColorStop(1, `rgba(${orb.color.join(',')}, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(px - r, py - r, r * 2, r * 2);
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connections (skip on mobile for performance)
    if (!isMobile) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }
  }

  function animate(time) {
    ctx.clearRect(0, 0, width, height);
    drawOrbs(time);
    drawParticles();
    animationId = requestAnimationFrame(animate);
  }

  // Hero parallax on mouse move (floating cards)
  function initParallax() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual || isMobile) return;

    const cards = heroVisual.querySelectorAll('.hero-float-card');

    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      cards.forEach((card, i) => {
        const depth = (i + 1) * 8;
        card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
  }

  // Init
  resize();
  animate(0);
  initParallax();

  window.addEventListener('resize', resize);

  // Cleanup on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animationId = requestAnimationFrame(animate);
    }
  });
})();
