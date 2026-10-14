/**
 * Sve fotografije na jednom mestu.
 *
 * Dok ne stignu prave fotografije, koriste se Unsplash slike (polje `unsplash`).
 * Zamena jednim potezom:
 *   1. ubacite prave fotografije u assets/images/ pod imenom iz polja `file`
 *   2. prebacite USE_LOCAL na true
 *   3. hero slika je zbog brzine upisana i direktno u index.html (img, preload, og:image), zamenite je i tamo
 *
 * Preporuka za prave fotografije: JPG ili WebP, širine oko 2000 px, do 400 KB.
 */

const USE_LOCAL = false;
const LOCAL_DIR = 'assets/images/';
const UNSPLASH = 'https://images.unsplash.com/photo-';

export const IMAGES = {
  hero:          { file: 'hero.jpg',           unsplash: '1470071459604-3b5ec3a7fe05', alt: 'Zelena zlatiborska brda u jutarnjoj magli' },
  konaciste:     { file: 'konaciste.jpg',      unsplash: '1587061949409-02df41d5e562', alt: 'Etno konačište, drveni objekat među borovima' },
  kucice:        { file: 'kucice.jpg',         unsplash: '1595521624992-48a59aef95e3', alt: 'Dupleks kućica od drveta sa terasom' },
  etno3:         { file: 'etno3.jpg',          unsplash: '1611892440504-42a792e24d32', alt: 'Potkrovni apartman Etno 3 sa drvenim nameštajem' },
  etnoKuca:      { file: 'etno-kuca.jpg',      unsplash: '1542718610-a1d656d1884c',    alt: 'Etno kuća u predvečerje, sa svetlom u prozorima' },
  restoranHrana: { file: 'restoran-hrana.jpg', unsplash: '1555939594-58d7cb561ad1',    alt: 'Roštilj i pečeni krompir na drvenoj dasci' },
  ribnjak:       { file: 'ribnjak.jpg',        unsplash: '1510130387422-82bed34b37e9', alt: 'Sveže pastrmke iz ribnjaka na tanjiru' },
  jezerce:       { file: 'jezerce.jpg',        unsplash: '1439066615861-d1af74d74000', alt: 'Jezerce sa drvenim mostićem i borovima na obali' },
  akvapark:      { file: 'akvapark.jpg',       unsplash: '1575783970733-1aaedde1db74', alt: 'Tobogani u dečjem delu kompleksa' },
  igraonica:     { file: 'igraonica.jpg',      unsplash: '1596464716127-f2a82984de30', alt: 'Bojice i dečji crteži na stolu u igraonici' },
  prica01:       { file: 'prica-01.jpg',       unsplash: '1449158743715-0a90ebb6d2d8', alt: 'Drvena kuća u borovoj šumi' },
  prica02:       { file: 'prica-02.jpg',       unsplash: '1559561853-08451507cbe7',    alt: 'Domaći sir i kiselo mleko u zemljanoj činiji' },
  galerija01:    { file: 'galerija-01.jpg',    unsplash: '1510798831971-661eb04b3739', alt: 'Drvena kuća pored vode, zimi pod snegom' },
  galerija02:    { file: 'galerija-02.jpg',    unsplash: '1441974231531-c6227db76b6e', alt: 'Staza kroz šumu u popodnevnom svetlu' },
  galerija03:    { file: 'galerija-03.jpg',    unsplash: '1486297678162-eb2a19b0a32d', alt: 'Kolutovi domaćeg sira' },
  galerija04:    { file: 'galerija-04.jpg',    unsplash: '1544148103-0773bf10d330',    alt: 'Drveni stolovi u restoranu' },
  galerija05:    { file: 'galerija-05.jpg',    unsplash: '1500382017468-9049fed747ef', alt: 'Livada u zalazak sunca' },
  galerija06:    { file: 'galerija-06.jpg',    unsplash: '1549931319-a545dcf3bc73',    alt: 'Domaći hleb isečen na dasci' },
  galerija07:    { file: 'galerija-07.jpg',    unsplash: '1542273917363-3b1817f69a2d', alt: 'Borova šuma u magli' },
  galerija08:    { file: 'galerija-08.jpg',    unsplash: '1447752875215-b2761acb3c5d', alt: 'Drveni most na stazi kroz šumu' },
  galerija09:    { file: 'galerija-09.jpg',    unsplash: '1544025162-d76694265947',    alt: 'Rebarca sa roštilja i povrće na dasci' },
  galerija10:    { file: 'galerija-10.jpg',    unsplash: '1476231682828-37e571bc172f', alt: 'Put kroz šumu snimljen iz vazduha' },
};

/** "4/5" → 0.8 */
function parseRatio(ratio) {
  if (!ratio) return null;
  if (typeof ratio === 'number') return ratio;
  const [w, h] = String(ratio).split('/').map(Number);
  return w && h ? w / h : null;
}

function remoteUrl(id, width, ratio) {
  const crop = ratio ? `&h=${Math.round(width / ratio)}&fit=crop&crop=entropy` : '';
  return `${UNSPLASH}${id}?auto=format&q=70&w=${width}${crop}`;
}

/**
 * Vraća atribute za <img>: src, srcset, sizes, alt.
 * @param {string} key ključ iz IMAGES
 * @param {{widths?: number[], ratio?: string|number, sizes?: string}} options
 */
export function imageAttrs(key, { widths = [480, 800, 1200], ratio, sizes = '100vw' } = {}) {
  const img = IMAGES[key];
  if (!img) {
    console.warn(`[images] Nepoznata slika: ${key}`);
    return { src: '', alt: '' };
  }
  if (USE_LOCAL) {
    return { src: LOCAL_DIR + img.file, alt: img.alt };
  }
  const r = parseRatio(ratio);
  const sorted = [...widths].sort((a, b) => a - b);
  return {
    src: remoteUrl(img.unsplash, sorted[Math.min(1, sorted.length - 1)], r),
    srcset: sorted.map((w) => `${remoteUrl(img.unsplash, w, r)} ${w}w`).join(', '),
    sizes,
    alt: img.alt,
  };
}

/** Popunjava sve <img data-img="kljuc"> koje su već u HTML-u. */
export function hydrateImages(root = document) {
  root.querySelectorAll('img[data-img]').forEach((el) => {
    const attrs = imageAttrs(el.dataset.img, {
      widths: el.dataset.widths ? el.dataset.widths.split(',').map(Number) : undefined,
      ratio: el.dataset.ratio,
      sizes: el.dataset.sizes,
    });
    if (attrs.srcset) {
      el.sizes = attrs.sizes;
      el.srcset = attrs.srcset;
    }
    el.alt = attrs.alt;
    el.src = attrs.src;
  });
}
