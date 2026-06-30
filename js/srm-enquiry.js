/* Wires every <form data-enquiry> on the srm-template college pages
 * to POST to /api/leads with a localStorage fallback. */

(function () {
  const forms = document.querySelectorAll('form[data-enquiry]');
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());

      const phone = (data.phone || '').trim();
      if (!/^\d{10}$/.test(phone)) {
        const phoneInput = form.querySelector('[name="phone"]');
        if (phoneInput) {
          phoneInput.style.borderColor = '#e11d48';
          phoneInput.focus();
        }
        return;
      }

      data.timestamp = Date.now();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';
      }

      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (err) {
        const leads = JSON.parse(localStorage.getItem('cp_offline_leads') || '[]');
        leads.push(data);
        localStorage.setItem('cp_offline_leads', JSON.stringify(leads));
      }

      localStorage.setItem('cp_formFilled', 'true');

      const success = form.parentElement && form.parentElement.querySelector('.srm-form-success');
      if (success) {
        form.style.display = 'none';
        success.classList.add('show');
      } else {
        form.reset();
        if (submitBtn) {
          submitBtn.innerHTML = 'Thank you — we will call you shortly';
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }, 4000);
        }
      }
    });
  });
})();
