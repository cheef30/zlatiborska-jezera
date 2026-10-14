/**
 * Lightbox za galeriju: strelice, swipe, Esc, brojač "3 / 10",
 * fokus ostaje u lightboxu dok je otvoren.
 */
import { imageAttrs } from './images.js';
import { trapFocus, lockScroll, unlockScroll } from './utils.js';

export function initGallery(items) {
  const dialog = document.querySelector('[data-lightbox]');
  const grid = document.querySelector('[data-render="gallery"]');
  if (!dialog || !grid || !items.length) return;

  const img = dialog.querySelector('[data-lightbox-img]');
  const caption = dialog.querySelector('[data-lightbox-caption]');
  const current = dialog.querySelector('[data-lightbox-current]');
  const total = dialog.querySelector('[data-lightbox-total]');
  const stage = dialog.querySelector('[data-lightbox-stage]');
  const closeBtn = dialog.querySelector('[data-lightbox-close]');

  const LARGE = { widths: [800, 1200, 1800, 2400], sizes: '(min-width: 1024px) 85vw, 100vw' };
  let index = 0;
  let opener = null;
  let releaseTrap = null;

  total.textContent = items.length;

  const preload = (i) => {
    const a = imageAttrs(items[(i + items.length) % items.length].image, LARGE);
    const pre = new Image();
    if (a.srcset) {
      pre.sizes = a.sizes;
      pre.srcset = a.srcset;
    }
    pre.src = a.src;
  };

  const show = (i) => {
    index = (i + items.length) % items.length;
    const a = imageAttrs(items[index].image, LARGE);
    dialog.classList.add('is-loading');
    img.onload = () => dialog.classList.remove('is-loading');
    img.removeAttribute('srcset');
    if (a.srcset) {
      img.sizes = a.sizes;
      img.srcset = a.srcset;
    }
    img.src = a.src;
    img.alt = a.alt;
    caption.textContent = a.alt;
    current.textContent = index + 1;
    preload(index + 1);
    preload(index - 1);
  };

  const open = (i, trigger) => {
    opener = trigger;
    show(i);
    dialog.showModal();
    lockScroll();
    releaseTrap = trapFocus(dialog);
    closeBtn.focus();
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  dialog.addEventListener('close', () => {
    unlockScroll();
    releaseTrap?.();
    opener?.focus();
  });

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-gallery-index]');
    if (btn) open(Number(btn.dataset.galleryIndex), btn);
  });

  closeBtn.addEventListener('click', close);
  dialog.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lightbox-next]').addEventListener('click', () => show(index + 1));

  // Klik na tamnu pozadinu (van slike) zatvara
  stage.addEventListener('click', (e) => {
    if (e.target === stage) close();
  });

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });

  // Swipe na telefonu
  let startX = 0;
  let startY = 0;
  stage.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
}
