(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
    const previous = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");

    if (slides.length < 2) return;

    let current = 0;
    let timer;

    const show = (index) => {
      current = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === current;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });

      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === current;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", String(active));
      });
    };

    const stop = () => {
      window.clearInterval(timer);
      timer = undefined;
    };

    const start = () => {
      if (reduceMotion || timer) return;
      timer = window.setInterval(() => show(current + 1), 5500);
    };

    previous?.addEventListener("click", () => {
      show(current - 1);
      stop();
      start();
    });

    next?.addEventListener("click", () => {
      show(current + 1);
      stop();
      start();
    });

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        show(Number(dot.dataset.carouselDot));
        stop();
        start();
      });
    });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    show(0);
    start();
  });
})();
