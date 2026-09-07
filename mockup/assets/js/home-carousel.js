(() => {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const dots = [...carousel.querySelectorAll('[data-dot]')];
  const previous = carousel.querySelector('[data-prev]');
  const next = carousel.querySelector('[data-next]');
  const status = carousel.querySelector('[data-status]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const autoplayDelay = 6500;
  let activeIndex = 0;
  let timer;
  let isPaused = false;

  if (slides.length < 2) return;

  const setSlideInteractivity = (slide, isActive) => {
    slide.setAttribute('aria-hidden', String(!isActive));
    slide.toggleAttribute('inert', !isActive);
    slide.querySelectorAll('[data-slide-link]').forEach((link) => {
      if (isActive) {
        link.removeAttribute('tabindex');
      } else {
        link.setAttribute('tabindex', '-1');
      }
    });
  };

  const showSlide = (index, announce = true) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle('is-active', isActive);
      setSlideInteractivity(slide, isActive);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });

    if (announce && status) {
      const title = slides[activeIndex].querySelector('.hero-slide__title')?.textContent.trim();
      status.textContent = `Showing story ${activeIndex + 1} of ${slides.length}: ${title || 'Featured story'}`;
    }
  };

  const stopAutoplay = () => {
    window.clearInterval(timer);
    timer = undefined;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (reduceMotion.matches || isPaused) return;
    timer = window.setInterval(() => showSlide(activeIndex + 1), autoplayDelay);
  };

  const pause = () => {
    isPaused = true;
    stopAutoplay();
  };

  const resume = () => {
    isPaused = false;
    startAutoplay();
  };

  const move = (offset) => {
    showSlide(activeIndex + offset);
    startAutoplay();
  };

  previous?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.dot));
      startAutoplay();
    });
  });

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  });

  carousel.addEventListener('mouseenter', pause);
  carousel.addEventListener('mouseleave', resume);
  carousel.addEventListener('focusin', pause);
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) resume();
  });

  reduceMotion.addEventListener?.('change', startAutoplay);
  showSlide(0, false);
  startAutoplay();
})();
