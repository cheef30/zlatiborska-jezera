/**
 * Karusel kartica smeštaja na telefonu: scroll-snap + tačkice.
 * Od 768px naviše isti elementi su obična mreža, pa se tačkice kriju (CSS).
 */
import { prefersReducedMotion } from './utils.js';

export function initCarousel(track, dots) {
  if (!track || !dots) return;
  const slides = [...track.querySelectorAll('[data-slide]')];
  if (slides.length < 2) return;

  const mq = window.matchMedia('(max-width: 47.99em)');

  dots.setAttribute('role', 'group');
  dots.setAttribute('aria-label', 'Izaberite smeštaj');
  dots.innerHTML = slides
    .map((slide, i) => {
      const title = slide.querySelector('h3')?.textContent ?? `Kartica ${i + 1}`;
      return `<button class="carousel-dots__btn" type="button" data-dot="${i}" aria-label="${i + 1} od ${slides.length}: ${title}"></button>`;
    })
    .join('');
  const buttons = [...dots.querySelectorAll('[data-dot]')];

  const setCurrent = (index) => {
    buttons.forEach((b, i) => b.setAttribute('aria-current', String(i === index)));
  };
  setCurrent(0);

  const goTo = (index) => {
    const slide = slides[index];
    const padding = parseFloat(getComputedStyle(track).scrollPaddingInlineStart) || 0;
    track.scrollTo({
      left: slide.offsetLeft - padding,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  dots.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-dot]');
    if (btn) goTo(Number(btn.dataset.dot));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setCurrent(slides.indexOf(entry.target));
      });
    },
    { root: track, threshold: 0.6 },
  );
  slides.forEach((s) => observer.observe(s));

  // Tastatura: strelice levo/desno kad je karusel u fokusu
  track.addEventListener('keydown', (e) => {
    if (!mq.matches || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    const current = buttons.findIndex((b) => b.getAttribute('aria-current') === 'true');
    const next = Math.max(0, Math.min(slides.length - 1, current + (e.key === 'ArrowRight' ? 1 : -1)));
    e.preventDefault();
    goTo(next);
  });

  const sync = () => {
    if (mq.matches) {
      track.setAttribute('tabindex', '0');
      track.setAttribute('aria-roledescription', 'karusel');
    } else {
      track.removeAttribute('tabindex');
      track.removeAttribute('aria-roledescription');
    }
  };
  sync();
  mq.addEventListener('change', sync);
}
