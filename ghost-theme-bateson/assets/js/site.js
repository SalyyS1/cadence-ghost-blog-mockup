(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('[data-slide]')];
    const previous = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    const dotsContainer = carousel.querySelector('[data-dots]');
    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    let timer;

    if (slides.length <= 1) {
      carousel.setAttribute('data-single-slide', '');
      return;
    }

    const dots = slides.map((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `hero-carousel__dot${index === activeIndex ? ' is-active' : ''}`;
      dot.setAttribute('aria-label', `Show featured story ${index + 1}`);
      dot.addEventListener('click', () => show(index, true));
      dotsContainer?.append(dot);
      return dot;
    });

    const stop = () => window.clearInterval(timer);
    const start = () => {
      stop();
      if (!reducedMotion) timer = window.setInterval(() => show(activeIndex + 1), 7000);
    };

    function show(index, restart = false) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === activeIndex));
      if (restart) start();
    }

    previous?.addEventListener('click', () => show(activeIndex - 1, true));
    next?.addEventListener('click', () => show(activeIndex + 1, true));
    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') show(activeIndex - 1, true);
      if (event.key === 'ArrowRight') show(activeIndex + 1, true);
    });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    start();
  });
})();
