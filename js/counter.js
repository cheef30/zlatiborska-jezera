/**
 * Brojke koje se odbrojavaju kad dođu na ekran ([data-count]).
 * U HTML-u je uvek upisana konačna vrednost, pa bez JS-a sve stoji kako treba.
 */
import { prefersReducedMotion } from './utils.js';

const format = (n) => Math.round(n).toLocaleString('sr-RS');
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function animate(el) {
  const target = Number(el.dataset.count);
  const duration = target > 100 ? 1800 : 1200;
  const start = performance.now();

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    el.textContent = format(target * easeOutCubic(t));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function initCounters(root = document) {
  const items = [...root.querySelectorAll('[data-count]')];
  if (!items.length || prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        animate(entry.target);
      });
    },
    { threshold: 0.6 },
  );

  items.forEach((el) => {
    const value = el.parentElement;
    // Čitač ekrana dobija samo konačnu vrednost
    const finalText = value.textContent.replace(/\s+/g, ' ').trim();
    [...value.children].forEach((c) => c.setAttribute('aria-hidden', 'true'));
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = finalText;
    value.append(sr);
    el.textContent = '0';
    observer.observe(el);
  });
}
