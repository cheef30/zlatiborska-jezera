/** Donja traka na telefonu (Pozovite, WhatsApp) se sklanja dok je forma na ekranu. */
export function initFloating() {
  const bar = document.querySelector('[data-mobile-bar]');
  const form = document.querySelector('[data-inquiry-form]');
  if (!bar || !form) return;

  new IntersectionObserver(
    ([entry]) => bar.classList.toggle('is-hidden', entry.isIntersecting),
    { threshold: 0.05 },
  ).observe(form);
}
