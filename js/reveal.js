/**
 * Elementi sa [data-reveal] se lagano pojavljuju kad uđu u ekran.
 * Posle animacije atribut se skida, da hover efekti kartica imaju svoje tranzicije.
 */
import { prefersReducedMotion } from './utils.js';

export function initReveal(root = document) {
  const items = [...root.querySelectorAll('[data-reveal]')];
  if (!items.length) return;

  const finish = (el) => {
    el.removeAttribute('data-reveal');
    el.classList.remove('is-visible');
    el.style.removeProperty('--reveal-delay');
  };

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach(finish);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);
        el.classList.add('is-visible');
        const delay = parseFloat(getComputedStyle(el).getPropertyValue('--reveal-delay')) || 0;
        setTimeout(() => finish(el), delay + 1100);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  // Kartice u karuselu na telefonu su van ekrana po širini, pa se ne animiraju
  const inCarousel = window.matchMedia('(max-width: 47.99em)').matches;
  items.forEach((el) => {
    if (inCarousel && el.closest('[data-carousel-track]')) finish(el);
    else observer.observe(el);
  });
}
