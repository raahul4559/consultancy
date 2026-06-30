/* ========== LEAD CAPTURE POPUP ==========
 * Auto-shows after delays (10s / 30s / 2min) once per visitor.
 * Also exposes window.openLeadPopup({ college, source }) for on-demand opens
 * (e.g. user clicks a college link). Manual opens ignore the "already-filled"
 * gate so the form is always reachable from a CTA.
 */

(function() {
  const overlay = document.querySelector('.popup-overlay');
  const closeBtn = document.querySelector('.popup-close');
  const form = document.querySelector('.popup-form');
  const formContainer = document.querySelector('.popup-form-container');
  const successEl = document.querySelector('.popup-success');
  const headerTitle = document.querySelector('.popup-header h3');
  const headerDesc = document.querySelector('.popup-header p');
  if (!overlay) return;

  const DEFAULT_TITLE = headerTitle ? headerTitle.textContent : 'Get Free Guidance';
  const DEFAULT_DESC = headerDesc ? headerDesc.textContent : 'Share your details and our counselor will reach out to you shortly.';

  let dismissCount = 0;
  const delays = [10000, 30000, 120000];

  function showPopup(opts) {
    opts = opts || {};
    if (!opts.force && localStorage.getItem('cp_formFilled')) return;

    // Reset to form view (in case it was left in success state)
    if (formContainer) formContainer.classList.remove('hidden');
    if (successEl) successEl.classList.remove('show');

    // Optional college-specific framing
    if (opts.college) {
      if (headerTitle) headerTitle.textContent = `Guidance for ${opts.college}`;
      if (headerDesc) headerDesc.textContent = `Share your details — our counselor will reach out about admission to ${opts.college}.`;
      // Stash in a hidden field if one exists, else add one
      let hidden = form && form.querySelector('input[name="college"]');
      if (form && !hidden) {
        hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = 'college';
        form.appendChild(hidden);
      }
      if (hidden) hidden.value = opts.college;
    } else {
      if (headerTitle) headerTitle.textContent = DEFAULT_TITLE;
      if (headerDesc) headerDesc.textContent = DEFAULT_DESC;
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function hidePopup() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function scheduleNext() {
    if (dismissCount < delays.length) {
      setTimeout(() => showPopup(), delays[dismissCount]);
      dismissCount++;
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hidePopup();
      scheduleNext();
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      hidePopup();
      scheduleNext();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      hidePopup();
      scheduleNext();
    }
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value.trim();
      const phone = form.querySelector('[name="phone"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();
      const course = form.querySelector('[name="course"]')?.value;
      const college = form.querySelector('[name="college"]')?.value;

      if (!name || !phone) return;
      if (!/^\d{10}$/.test(phone)) {
        const phoneInput = form.querySelector('[name="phone"]');
        if (phoneInput) phoneInput.style.borderColor = 'var(--accent-rose, #e11d48)';
        return;
      }

      const data = { name, phone, email, course, college, source: 'popup' };

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
      if (formContainer) formContainer.classList.add('hidden');
      if (successEl) successEl.classList.add('show');

      setTimeout(hidePopup, 3000);
    });
  }

  // Auto-show timer (skipped if user already submitted)
  if (!localStorage.getItem('cp_formFilled')) scheduleNext();

  // Public API for on-demand opens (forces popup even if already filled)
  window.openLeadPopup = (opts) => showPopup({ force: true, ...(opts || {}) });
})();
