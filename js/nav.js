/**
 * Header i navigacija:
 * - header postaje krem i niži posle skrolovanja
 * - aktivna stavka menija prati sekciju na ekranu
 * - mobilni meni (Esc, klik na link, klik van panela, zaključan skrol)
 */
import { trapFocus, lockScroll, unlockScroll, scrollToElement } from './utils.js';

function initScrolledState(header) {
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:48px;pointer-events:none;';
  document.body.prepend(sentinel);

  new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }).observe(sentinel);
}

function initActiveLink() {
  const links = [...document.querySelectorAll('[data-nav-link]')];
  const byId = new Map(links.map((link) => [link.hash.slice(1), link]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.hash === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => observer.observe(s));

  // Na vrhu stranice nijedna stavka nije aktivna
  const hero = document.getElementById('pocetak');
  if (hero) {
    new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(null);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    ).observe(hero);
  }
}

function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (!toggle || !menu) return;

  const panel = menu.querySelector('.mobile-menu__panel');
  const closeBtn = menu.querySelector('[data-menu-close]');
  const label = toggle.querySelector('.visually-hidden');
  let releaseTrap = null;

  const open = () => {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = 'Zatvorite meni';
    lockScroll();
    releaseTrap = trapFocus(menu);
    setTimeout(() => closeBtn.focus(), 60);
  };

  const close = ({ restoreFocus = true } = {}) => {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = 'Otvorite meni';
    unlockScroll();
    releaseTrap?.();
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => (menu.classList.contains('is-open') ? close() : open()));
  closeBtn.addEventListener('click', () => close());

  // Klik van panela
  menu.addEventListener('click', (e) => {
    if (!panel.contains(e.target)) close();
  });

  // Klik na link: zatvori pre nego što pregledač skroluje do sidra
  menu.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => close({ restoreFocus: false })),
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Ako se ekran proširi preko granice za desktop, meni se zatvara
  window.matchMedia('(min-width: 64em)').addEventListener('change', (e) => {
    if (e.matches) close({ restoreFocus: false });
  });
}

/** Linkovi ka sidrima na stranici: skrol sa ispravkom i fokus na cilj (tastatura, čitači ekrana). */
function initAnchorLinks() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.closest('[data-inquiry], [data-open-inquiry]')) return;
    const id = link.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    history.pushState(null, '', `#${id}`);
    scrollToElement(target);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

export function initNav() {
  const header = document.querySelector('[data-header]');
  if (header) initScrolledState(header);
  initActiveLink();
  initMobileMenu();
  initAnchorLinks();
}
