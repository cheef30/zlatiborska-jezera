/**
 * Renderovanje sekcija iz podataka (js/data.js).
 * Svaka funkcija odgovara jednoj budućoj React komponenti.
 */
import { imageAttrs } from './images.js';

const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const icon = (id, cls = 'icon') =>
  `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#${id}"/></svg>`;

function img(key, { widths, ratio, sizes, width, height, cls = '' }) {
  const a = imageAttrs(key, { widths, ratio, sizes });
  const srcset = a.srcset ? ` srcset="${esc(a.srcset)}" sizes="${esc(a.sizes)}"` : '';
  return `<img${cls ? ` class="${cls}"` : ''} src="${esc(a.src)}"${srcset} width="${width}" height="${height}" alt="${esc(a.alt)}" loading="lazy" decoding="async">`;
}

const delay = (i, step = 90) => ` style="--reveal-delay:${i * step}ms"`;

/* Brojke ispod priče */
export function renderStats(el, stats) {
  el.innerHTML = stats
    .map((s, i) => {
      const number =
        s.value != null
          ? `<span data-count="${s.value}">${s.value.toLocaleString('sr-RS')}</span>`
          : `<span>${esc(s.text)}</span>`;
      return `
        <li class="stats__item" data-reveal${delay(i)}>
          <p class="stats__value">
            ${s.prefix ? `<span class="stats__prefix">${esc(s.prefix)}</span>` : ''}${number}${s.suffix ? `<span class="stats__suffix">${esc(s.suffix)}</span>` : ''}
          </p>
          <p class="stats__label">${esc(s.label)}</p>
        </li>`;
    })
    .join('');
}

/* Kartice smeštaja */
export function renderStays(el, stays) {
  el.innerHTML = stays
    .map((s, i) => {
      const titleId = `smestaj-${s.id}`;
      return `
        <article class="stay-card${s.featured ? ' stay-card--featured' : ''}" aria-labelledby="${titleId}" data-slide data-reveal${delay(i % 2)}>
          <div class="stay-card__media">
            ${img(s.image, {
              widths: [400, 600, 900],
              ratio: '4/3',
              sizes: '(min-width: 1024px) 50vw, (min-width: 768px) 46vw, 86vw',
              width: 1000,
              height: 750,
            })}
            ${s.tag ? `<span class="stay-card__tag">${esc(s.tag)}</span>` : ''}
          </div>
          <div class="stay-card__body">
            <h3 class="stay-card__title" id="${titleId}">${esc(s.name)}</h3>
            <p class="stay-card__capacity">${icon('i-users')}${esc(s.capacity)}</p>
            <p class="stay-card__text">${esc(s.text)}</p>
            ${s.features.length ? `<ul class="stay-card__features">
              ${s.features.map((f) => `<li>${esc(f)}</li>`).join('')}
            </ul>` : ''}
            ${s.note ? `<p class="stay-card__note">${icon('i-stairs')}<span>${esc(s.note)}</span></p>` : ''}
            <a class="link-arrow stay-card__cta" href="#rezervacija" data-inquiry="${esc(s.id)}">
              Pošaljite upit<span class="visually-hidden"> za ${esc(s.name)}</span>
              ${icon('i-arrow')}
            </a>
          </div>
        </article>`;
    })
    .join('');
}

/* Jelovnik */
export function renderMenu(el, groups) {
  el.innerHTML = groups
    .map(
      (g) => `
      <div class="menu-group">
        <h3 class="menu-group__title">${esc(g.title)}</h3>
        <ul class="menu-group__list">
          ${g.items
            .map(
              (item) => `
            <li class="menu-item">
              <span class="menu-item__name">${esc(item.name)}</span>
              ${item.note ? `<span class="menu-item__leader" aria-hidden="true"></span><span class="menu-item__note">${esc(item.note)}</span>` : ''}
            </li>`,
            )
            .join('')}
        </ul>
        ${g.foot ? `<p class="menu-group__foot">${esc(g.foot)}</p>` : ''}
      </div>`,
    )
    .join('');
}

/* Spisak sadržaja */
export function renderAmenities(el, amenities) {
  el.innerHTML = amenities
    .map(
      (a) => `
      <li class="amenity">
        ${icon(a.icon, 'icon amenity__icon')}
        <div>
          <h3 class="amenity__title">${esc(a.title)}</h3>
          <p class="amenity__text">${esc(a.text)}</p>
        </div>
      </li>`,
    )
    .join('');
}

/* Galerija */
const GALLERY_SIZES = {
  big: { ratio: '1/1', widths: [480, 800, 1100], sizes: '(min-width: 768px) 50vw, 100vw', width: 1100, height: 1100 },
  tall: { ratio: '2/3', widths: [320, 480, 720], sizes: '(min-width: 768px) 25vw, 50vw', width: 480, height: 720 },
  wide: { ratio: '2/1', widths: [480, 800, 1100], sizes: '(min-width: 768px) 50vw, 100vw', width: 1100, height: 550 },
  regular: { ratio: '4/3', widths: [320, 480, 720], sizes: '(min-width: 768px) 25vw, 50vw', width: 720, height: 540 },
};

export function renderGallery(el, items) {
  const total = items.length;
  el.innerHTML = items
    .map((item, i) => {
      const size = item.size || 'regular';
      const opts = GALLERY_SIZES[size];
      const alt = imageAttrs(item.image).alt;
      return `
        <li class="gallery__item gallery__item--${size}" data-reveal${delay(i % 4, 70)}>
          <button class="gallery__btn" type="button" data-gallery-index="${i}" aria-label="Otvorite fotografiju ${i + 1} od ${total}: ${esc(alt)}">
            ${img(item.image, opts)}
            <span class="gallery__zoom" aria-hidden="true">${icon('i-expand')}</span>
          </button>
        </li>`;
    })
    .join('');
}

/* Zašto baš ovde */
export function renderReasons(el, reasons) {
  el.innerHTML = reasons
    .map(
      (r, i) => `
      <li class="why__item" data-reveal${delay(i, 120)}>
        <h3 class="why__title">${esc(r.title)}</h3>
        <p class="why__text">${esc(r.text)}</p>
      </li>`,
    )
    .join('');
}
