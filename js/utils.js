/** Zajedničke pomoćne funkcije. */

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusable(container) {
  return [...container.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

/** Drži Tab i Shift+Tab unutar kontejnera. Vraća funkciju za gašenje. */
export function trapFocus(container) {
  const onKeydown = (e) => {
    if (e.key !== 'Tab') return;
    const items = getFocusable(container);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  container.addEventListener('keydown', onKeydown);
  return () => container.removeEventListener('keydown', onKeydown);
}

/** Zaključava skrol pozadine (meni, galerija). */
let lockCount = 0;
export function lockScroll() {
  lockCount += 1;
  if (lockCount === 1) {
    const gap = window.innerWidth - document.documentElement.clientWidth;
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    document.documentElement.classList.add('is-locked');
  }
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.classList.remove('is-locked');
    document.body.style.paddingRight = '';
  }
}

/** Čeka da skrol stane. Koristi scrollend gde postoji, inače čeka tišinu u skrol događajima. */
function onScrollStop(callback) {
  if ('onscrollend' in window) {
    let fired = false;
    let moved = false;
    const markMoved = () => (moved = true);
    const done = () => {
      if (fired) return;
      fired = true;
      window.removeEventListener('scrollend', done);
      window.removeEventListener('scroll', markMoved);
      callback();
    };
    window.addEventListener('scrollend', done);
    window.addEventListener('scroll', markMoved, { passive: true });
    // Ako skrol uopšte ne krene (već smo na cilju), scrollend ne stiže
    setTimeout(() => {
      if (!moved) done();
    }, 400);
    return;
  }
  let timer;
  const done = () => {
    window.removeEventListener('scroll', onScroll);
    callback();
  };
  const onScroll = () => {
    clearTimeout(timer);
    timer = setTimeout(done, 250);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  timer = setTimeout(done, 300);
}

/**
 * Skrol do elementa sa ispravkom.
 * Sekcije ispod ekrana koriste content-visibility, pa im se visina tačno zna
 * tek kad se prikažu. Zato posle skrola proveravamo poziciju i doterujemo je.
 */
export function scrollToElement(el) {
  const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
  const offset = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  let tries = 0;

  const settle = () => {
    const diff = el.getBoundingClientRect().top - offset();
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (Math.abs(diff) > 3 && !atBottom && tries < 4) {
      tries += 1;
      window.scrollBy({ top: diff, behavior });
      onScrollStop(settle);
    }
  };

  el.scrollIntoView({ behavior, block: 'start' });
  onScrollStop(settle);
}
