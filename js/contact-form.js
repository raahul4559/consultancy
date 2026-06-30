/* ========== CONTACT FORM ==========
 * Submits the contact-page form to /api/leads, with localStorage fallback.
 * Toggles the success card on completion.
 */

(function() {
  const form = document.querySelector('#contactForm');
  const card = document.querySelector('#contactFormCard');
  const successEl = document.querySelector('#contactSuccess');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: (formData.get('name') || '').trim(),
      phone: (formData.get('phone') || '').trim(),
      email: (formData.get('email') || '').trim(),
      course: (formData.get('course') || '').trim(),
      city: (formData.get('city') || '').trim(),
      message: (formData.get('message') || '').trim(),
      source: 'contact-page'
    };

    if (!data.name || !data.phone) return;
    if (!/^\d{10}$/.test(data.phone)) {
      const phoneInput = form.querySelector('[name="phone"]');
      if (phoneInput) {
        phoneInput.style.borderColor = '#e11d48';
        phoneInput.focus();
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

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

    if (card) card.classList.add('submitted');
    if (successEl) successEl.classList.add('show');
  });
})();
