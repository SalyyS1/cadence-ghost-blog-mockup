(() => {
  const forms = document.querySelectorAll('[data-newsletter-form]');
  if (!forms.length) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  forms.forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector('[data-form-message]');
    if (!input || !button || !message) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = input.value.trim();
      message.className = 'form-message';

      if (!emailPattern.test(email)) {
        message.textContent = 'Enter a valid email address to subscribe.';
        message.classList.add('is-error');
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }

      input.removeAttribute('aria-invalid');
      button.disabled = true;
      button.textContent = 'Adding...';

      window.setTimeout(() => {
        button.disabled = false;
        button.textContent = 'Subscribed';
        input.value = '';
        message.textContent = 'You are on the list. Watch your inbox for the next issue.';
        message.classList.add('is-success');
      }, 450);
    });
  });
})();
