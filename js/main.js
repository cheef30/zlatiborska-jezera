/**
 * Etno selo Zlatiborska jezera
 * Ulazna tačka: konfiguracija i pokretanje svih modula.
 */
import { STATS, STAYS, MENU, AMENITIES, GALLERY, REASONS } from './data.js';
import { hydrateImages } from './images.js';
import { renderStats, renderStays, renderMenu, renderAmenities, renderGallery, renderReasons } from './render.js';
import { initNav } from './nav.js';
import { initReveal } from './reveal.js';
import { initCounters } from './counter.js';
import { initCarousel } from './carousel.js';
import { initGallery } from './gallery.js';
import { initForm } from './form.js';
import { initParallax } from './parallax.js';
import { initFloating } from './floating.js';

/* ==========================================================================
   KONFIGURACIJA
   Ovde se menjaju telefon, linkovi i tekstovi koje treba proveriti.
   (Broj telefona je zbog pretraživača upisan i u index.html, JSON-LD blok.)
   ========================================================================== */
const CONFIG = {
  name: 'Etno selo Zlatiborska jezera',
  phone: {
    display: '062 856 9214',   // kako se prikazuje na sajtu
    e164: '+381628569214',     // za tel: i sms: linkove
    whatsapp: '381628569214',  // za wa.me link, bez + i bez nule
  },
  social: {
    facebook: '#',   // npr. https://www.facebook.com/...
    instagram: '#',  // npr. https://www.instagram.com/...
  },
  maps: {
    link: 'https://www.google.com/maps/search/?api=1&query=Etno+selo+Zlatiborska+jezera+Semegnjevo',
  },
  texts: {
    // PROVERITI SA VLASNICIMA: da li je ovo tačno?
    responseNote: 'Odgovaramo istog dana, najčešće za par sati.',
    whatsappGreeting: 'Dobar dan, zanima me smeštaj u Etno selu Zlatiborska jezera.',
    whatsappTooltip: 'Pišite nam na WhatsApp',
  },
};

/** Upisuje vrednosti iz CONFIG u sve elemente koji ih koriste. */
function applyConfig(config) {
  const waUrl = `https://wa.me/${config.phone.whatsapp}?text=${encodeURIComponent(config.texts.whatsappGreeting)}`;

  document.querySelectorAll('[data-tel]').forEach((el) => (el.href = `tel:${config.phone.e164}`));
  document.querySelectorAll('[data-phone-text]').forEach((el) => (el.textContent = config.phone.display));
  document.querySelectorAll('[data-wa]').forEach((el) => (el.href = waUrl));
  document.querySelectorAll('[data-wa-tooltip]').forEach((el) => (el.textContent = config.texts.whatsappTooltip));
  document.querySelectorAll('[data-maps-link]').forEach((el) => (el.href = config.maps.link));
  document.querySelectorAll('[data-response-note]').forEach((el) => (el.textContent = config.texts.responseNote));
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  document.querySelectorAll('[data-social]').forEach((el) => {
    const url = config.social[el.dataset.social];
    el.href = url || '#';
    // Dok nema pravog linka, ne otvaramo prazan tab
    if (!url || url === '#') {
      el.removeAttribute('target');
      el.removeAttribute('rel');
    }
  });
}

function renderAll() {
  const slot = (name) => document.querySelector(`[data-render="${name}"]`);
  if (slot('stats')) renderStats(slot('stats'), STATS);
  if (slot('stays')) renderStays(slot('stays'), STAYS);
  if (slot('menu')) renderMenu(slot('menu'), MENU);
  if (slot('amenities')) renderAmenities(slot('amenities'), AMENITIES);
  if (slot('gallery')) renderGallery(slot('gallery'), GALLERY);
  if (slot('reasons')) renderReasons(slot('reasons'), REASONS);
}

function init() {
  applyConfig(CONFIG);
  renderAll();
  hydrateImages();

  initNav();
  initCarousel(document.querySelector('[data-carousel-track]'), document.querySelector('[data-carousel-dots]'));
  initGallery(GALLERY);
  initForm({ config: CONFIG, stays: STAYS });
  initCounters();
  initReveal();
  initParallax();
  initFloating();
}

init();
