# Etno selo Zlatiborska jezera

Landing stranica za Etno selo Zlatiborska jezera (Semegnjevo bb, Zlatibor).
Čist HTML, CSS i JavaScript (ES moduli), bez frejmvorka i bez build alata.

## Pokretanje

Stranica koristi ES module, pa mora da ide preko lokalnog servera (ne radi kao `file://`).

```bash
npx serve .
# ili
python -m http.server 8000
```

Zatim otvorite adresu koju server ispiše (npr. http://localhost:3000).

## Gde se šta menja

| Šta | Gde |
| --- | --- |
| Telefon, WhatsApp broj, Facebook i Instagram linkovi, link za Google mape | `js/main.js`, objekat `CONFIG` na vrhu |
| Tekst ispod forme („Odgovaramo istog dana…”) i pozdrav u WhatsApp poruci | `js/main.js`, `CONFIG.texts` |
| Kartice smeštaja, jelovnik, sadržaji, galerija, brojke, „Zašto baš ovde” | `js/data.js` |
| Sve fotografije i alt tekstovi | `js/images.js` |
| Boje, fontovi, razmaci | `css/variables.css` |
| Slanje forme (kasnije pravi API) | `js/form.js`, funkcija `sendInquiry()` |

Broj telefona je upisan i direktno u `index.html` (JSON-LD blok za Google i linkovi koji rade i bez JavaScript-a).
Ako se broj promeni, promenite ga u `CONFIG` i u JSON-LD bloku u `<head>`.

## Fotografije

Sada se koriste privremene fotografije sa Unsplash-a. Zamena:

1. Ubacite prave fotografije u `assets/images/` pod imenima ispod (JPG ili WebP, širine oko 2000 px, do 400 KB).
2. U `js/images.js` prebacite `USE_LOCAL` na `true`.
3. Hero sliku zamenite i u `index.html`: `<img class="hero__img">`, `<link rel="preload">` i `og:image` / `twitter:image`.
4. Prilagodite alt tekstove u `js/images.js` tome šta je stvarno na slici.

Spisak mesta za prave fotografije:

| Fajl | Gde se vidi |
| --- | --- |
| `hero.jpg` | velika slika na vrhu stranice (i slika za deljenje na mrežama) |
| `prica-01.jpg` | kolaž u delu „Ovde dan teče sporije”, velika slika (objekat, terasa) |
| `prica-02.jpg` | kolaž, srednja slika (doručak: kačamak, kiselo mleko, sir) |
| `jezerce.jpg` | kolaž, mala slika, i kartica „Jezerca za kupanje” |
| `konaciste.jpg` | kartica Etno konačište |
| `kucice.jpg` | kartica Etno kućice 1 i 2 |
| `etno3.jpg` | kartica Etno 3 (unutrašnjost, hajdučki krevet) |
| `etno-kuca.jpg` | kartica Etno kuća |
| `restoran-hrana.jpg` | velika slika u restoranu |
| `ribnjak.jpg` | mala slika u restoranu (riba ili ribnjak) |
| `akvapark.jpg` | kartica za decu (tobogani) |
| `igraonica.jpg` | mala slika u kartici za decu |
| `galerija-01.jpg` … `galerija-10.jpg` | galerija (01 je najveća, 05 je široka, 02 i 07 su uspravne) |

## Proveriti sa vlasnicima

- „Odgovaramo istog dana, najčešće za par sati.” (ispod forme)
- Vremena vožnje: centar Zlatibora oko 10 minuta, Beograd otprilike 3 sata.
- Etno 3: koliko osoba prima (sada piše „Za broj mesta nas pozovite”).
- Etno kuća: koliko ukupno osoba prima (po broju soba izlazi 27, ali to nije navedeno na sajtu dok se ne proveri).
- Etno konačište: „Od 2 do 6 osoba po jedinici” i „Većina jedinica ima terasu”.
- „Restoran radi i za goste sa strane. Ako dolazite u većem društvu, pozovite pa ćemo vam spremiti sto.”
- Da li su bicikli besplatni za goste i odakle kreću staze za šetnju.
- Tačna lokacija na mapi. Na Google mapama postoje dva unosa za objekat. Najbolje je da vlasnik na svom Google profilu uzme „Podeli → Ugradi mapu” i taj link stavite u `<iframe>` u `index.html` i u `CONFIG.maps.link`.
- Geo koordinate u JSON-LD bloku su okvirne (43.6905, 19.6560). Zamenite tačnim sa Google mapa.
- Facebook i Instagram adrese (sada `#`).
- Utisci gostiju: u `index.html` postoji komentar `SECTION: Utisci gostiju` na mestu gde mogu da idu prave recenzije sa Google-a. Ne izmišljati ih.

## Struktura

```
index.html
css/
  fonts.css        lokalni fontovi (Alegreya, Alegreya Sans, sa latin-ext za naša slova)
  reset.css
  variables.css    boje, tipografija, razmaci (sa proverenim kontrastom)
  base.css         osnova, fokus, pojavljivanje pri skrolu
  components.css   dugmad, kartice, jelovnik, forma, lightbox, plutajuća dugmad
  sections.css     jedna celina po sekciji
js/
  main.js          konfiguracija i pokretanje
  data.js          sadržaj koji se ponavlja
  images.js        sve fotografije na jednom mestu
  render.js        renderovanje sekcija iz podataka
  nav.js           header, aktivni link, mobilni meni
  reveal.js        pojavljivanje pri skrolu
  counter.js       brojke koje se odbrojavaju
  carousel.js      karusel smeštaja na telefonu
  gallery.js       lightbox
  form.js          forma, validacija, slanje (sendInquiry)
  parallax.js      paralaks na hero slici
  floating.js      donja traka na telefonu
  utils.js         zajedničke pomoćne funkcije
assets/
  images/          prave fotografije (videti spisak gore)
  icons/           SVG znak iz logotipa i ornament
  favicon/         favicon.svg, favicon-32.png, apple-touch-icon.png
  fonts/           woff2 fajlovi
```

## Prelazak na Next.js

- Svaka sekcija u `index.html` je obeležena komentarom `<!-- SECTION: Ime -->` i postaje jedna komponenta.
- `js/data.js` i `js/images.js` prelaze u JSON ili props. Funkcije iz `js/render.js` su gotovo direktno JSX.
- CSS klase su po BEM-u (`.stay-card__title`, `.stay-card--featured`), pa se `components.css` i `sections.css` lako dele u CSS module.
- Ikonice su u jednom SVG sprite-u na vrhu `<body>`; u Next.js to postaje `<Icon name="..." />` komponenta.
- Fontovi: `next/font/local` sa fajlovima iz `assets/fonts/`.

## Napomene o performansama

- Lighthouse (mobilni, lokalno, sa gzip kompresijom): performanse 84 do 88 (zavisi od merenja), pristupačnost 100, najbolje prakse 100, SEO 100. Na hostingu sa HTTP/2 šest CSS fajlova se učitava paralelno, pa bi rezultat trebalo da bude bolji. Ako treba još, CSS fajlovi mogu da se spoje u jedan pri objavljivanju.
- Sekcije ispod prvog ekrana koriste `content-visibility: auto` (mnogo brži prvi prikaz). Zato skrol do sidara ide preko `scrollToElement()` u `js/utils.js`, koji posle skrola proveri poziciju i dotera je.
- Na hostingu obavezno uključite gzip ili brotli kompresiju i keširanje za `css/`, `js/` i `assets/`.
- Kad stignu prave fotografije, smanjite ih pre ubacivanja (WebP, do 400 KB). To će dodatno ubrzati stranicu.
