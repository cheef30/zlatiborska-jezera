/** Blag paralaks na hero slici. Radi samo dok je hero na ekranu. */
import { prefersReducedMotion } from './utils.js';

export function initParallax() {
  const media = document.querySelector('[data-parallax]');
  if (!media || prefersReducedMotion()) return;

  const hero = media.closest('section');
  let visible = true;
  let ticking = false;

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(hero);

  const update = () => {
    media.style.transform = `translate3d(0, ${(window.scrollY * 0.22).toFixed(1)}px, 0)`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!visible || ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
}
