/* ========== CAMPUSPATHWAY MAIN APP ========== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initAccordion();
  initBackToTop();
  initLeadForms();
  initCollegeTabs();
  initCollegeSearch();
});

/* ========== HERO COLLEGE SEARCH (autocomplete) ========== */
function initCollegeSearch() {
  const form = document.getElementById('college-search');
  const input = document.getElementById('college-search-input');
  const clearBtn = document.getElementById('college-search-clear');
  const list = document.getElementById('college-suggest');
  const grid = document.getElementById('colleges-grid');
  if (!form || !input || !list || !grid) return;

  // Reuse the existing featured-college data (name + page URL) — no duplicate list
  const COLLEGES = Array.from(grid.querySelectorAll('.college-card'))
    .map(card => {
      const nameEl = card.querySelector('h4');
      return { name: nameEl ? nameEl.textContent.trim() : '', url: card.getAttribute('href') || '' };
    })
    .filter(c => c.name && /colleges\//.test(c.url)); // engineering college pages only

  let results = [];
  let active = -1;

  const PIN = '<span class="sug-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4 8 4v14"/><path d="M9 9h.01M9 13h.01M15 9h.01M15 13h.01"/></svg></span>';
  const GO  = '<span class="sug-go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span>';

  const escapeHtml = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  function highlight(name, q) {
    const i = name.toLowerCase().indexOf(q);
    if (i < 0 || !q) return escapeHtml(name);
    return escapeHtml(name.slice(0, i)) + '<mark>' + escapeHtml(name.slice(i, i + q.length)) + '</mark>' + escapeHtml(name.slice(i + q.length));
  }

  const open = () => { list.classList.add('open'); input.setAttribute('aria-expanded', 'true'); };
  const close = () => { list.classList.remove('open'); input.setAttribute('aria-expanded', 'false'); active = -1; };
  const go = url => { if (url) window.location.href = url; };

  function render(q) {
    if (!q) { results = []; list.innerHTML = ''; close(); return; }
    results = COLLEGES.filter(c => c.name.toLowerCase().includes(q));
    active = -1;
    if (!results.length) {
      list.innerHTML = '<li class="sug-empty">No colleges found</li>';
    } else {
      list.innerHTML = results.map(c =>
        '<li role="option" data-url="' + c.url + '">' + PIN + '<span class="sug-name">' + highlight(c.name, q) + '</span>' + GO + '</li>'
      ).join('');
    }
    open();
  }

  function setActive(i) {
    const items = list.querySelectorAll('li[data-url]');
    if (!items.length) { active = -1; return; }
    active = (i + items.length) % items.length;
    items.forEach((el, idx) => el.classList.toggle('active', idx === active));
    items[active].scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('input', () => {
    clearBtn.hidden = input.value.length === 0;
    render(input.value.trim().toLowerCase());
  });

  input.addEventListener('focus', () => { if (input.value.trim()) render(input.value.trim().toLowerCase()); });

  input.addEventListener('keydown', (e) => {
    const items = list.querySelectorAll('li[data-url]');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!list.classList.contains('open')) render(input.value.trim().toLowerCase());
      setActive(active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); setActive(active - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && items[active]) { go(items[active].dataset.url); return; }
      const q = input.value.trim().toLowerCase();
      const exact = COLLEGES.find(c => c.name.toLowerCase() === q);
      if (exact) go(exact.url);
      else if (results.length) go(results[0].url);
    } else if (e.key === 'Escape') {
      close();
    }
  });

  // mousedown (not click) so input blur doesn't pre-empt the navigation
  list.addEventListener('mousedown', (e) => {
    const li = e.target.closest('li[data-url]');
    if (li) { e.preventDefault(); go(li.dataset.url); }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (results.length) go((active >= 0 ? results[active] : results[0]).url);
  });

  clearBtn.addEventListener('click', () => {
    input.value = ''; clearBtn.hidden = true; render(''); input.focus();
  });

  document.addEventListener('click', (e) => { if (!form.contains(e.target)) close(); });
}

/* ========== FEATURED COLLEGES TABS ========== */
function initCollegeTabs() {
  const tabs = document.querySelectorAll('.college-tab');
  const cards = document.querySelectorAll('#colleges-grid .college-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.cat;

      tabs.forEach(t => {
        const isActive = t === tab;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });
}

/* ========== PRELOADER ========== */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  // Animate letters with stagger
  const letters = preloader.querySelectorAll('.preloader-logo span');
  letters.forEach((letter, i) => {
    letter.style.animationDelay = `${i * 0.06}s`;
  });

  // Hide preloader after bar fills
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 1800);

  // Fallback
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  }, 3000);
}

/* ========== STICKY NAVBAR ========== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ========== MOBILE MENU ========== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-nav-overlay');
  if (!hamburger || !mobileNav) return;

  function toggleMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
  if (overlay) overlay.addEventListener('click', toggleMenu);

  // Mobile dropdown toggle
  const dropdownToggles = mobileNav.querySelectorAll('.mobile-dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const content = toggle.nextElementSibling;
      if (content) {
        content.classList.toggle('open');
        const chevron = toggle.querySelector('.chevron');
        if (chevron) {
          chevron.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : '';
        }
      }
    });
  });

  // Close on link click
  mobileNav.querySelectorAll('a:not(.mobile-dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) toggleMenu();
    });
  });

  // Close on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileNav.classList.contains('open')) {
      toggleMenu();
    }
  });
}

/* ========== SCROLL REVEAL ========== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-40px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ========== ACCORDION ========== */
function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');
    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      items.forEach(other => {
        other.classList.remove('active');
        const otherBody = other.querySelector('.accordion-body');
        if (otherBody) otherBody.style.maxHeight = null;
      });

      // Open clicked (if wasn't active)
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ========== LEAD FORMS (hero + on-page enquiry) ========== */
function initLeadForms() {
  const forms = document.querySelectorAll('.js-lead-form, #hero-lead-form');
  if (!forms.length) return;

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]')?.value.trim();
      const phone = form.querySelector('[name="phone"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();
      const course = form.querySelector('[name="course"]')?.value;

      if (!name || !phone) return;
      if (!/^\d{10}$/.test(phone)) {
        const phoneInput = form.querySelector('[name="phone"]');
        if (phoneInput) phoneInput.style.borderColor = 'var(--accent)';
        return;
      }

      const data = { name, phone, email, course, source: form.dataset.source || 'home-form' };
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (err) {
        const leads = JSON.parse(localStorage.getItem('cp_offline_leads') || '[]');
        leads.push({ ...data, timestamp: Date.now() });
        localStorage.setItem('cp_offline_leads', JSON.stringify(leads));
      }

      localStorage.setItem('cp_formFilled', 'true');
      form.innerHTML = '<div style="text-align:center;padding:24px 0"><svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" width="48" height="48"><polyline points="20 6 9 17 4 12"/></svg><h3 style="margin-top:16px;color:var(--text-dark)">Thank You!</h3><p style="font-size:14px;color:var(--text-dark-secondary);margin-top:8px">Our counsellor will contact you shortly.</p></div>';
    });
  });
}

/* ========== BACK TO TOP ========== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
