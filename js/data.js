/**
 * Sadržaj koji se ponavlja, kao nizovi objekata.
 * U Next.js ovo prelazi u JSON ili u props komponenti.
 * Pravilo: samo provereni podaci o objektu. Bez cena i bez izmišljenih brojeva.
 */

export const STATS = [
  { value: 4, label: 'tipa smeštaja' },
  { value: 2, label: 'tobogana i skakaonica u akva parku' },
  { value: 1000, prefix: 'skoro', label: 'recenzija na Google mapama' },
];

export const STAYS = [
  {
    id: 'konaciste',
    name: 'Etno konačište',
    inquiryLabel: 'Etno konačište (studiji i apartmani)',
    tag: 'Novi objekat',
    image: 'konaciste',
    capacity: 'Od 2 do 6 osoba po jedinici',
    text: 'Novi objekat sa osam smeštajnih jedinica: studiji za dvoje i troje, studio i lux apartman za šestoro.',
    features: [
      '2 dvokrevetna studija i 3 studija 2+1',
      'Studio 2+2+2, lux studio 2+1, lux apartman 2+2+2',
      'Francuski ležaj, TV i satelitski program',
      'Većina jedinica ima terasu',
    ],
    featured: true,
  },
  {
    id: 'kucice',
    name: 'Etno 1 i Etno 2',
    inquiryLabel: 'Etno kućice (Etno 1 ili Etno 2)',
    tag: 'Dupleks kućice',
    image: 'kucice',
    capacity: 'Etno 1 do 5 osoba, Etno 2 do 7 osoba',
    text: 'Dve kućice na dva nivoa, od 50 i 55 m². Dole su dnevna soba sa kuhinjom, kupatilo i terasa, a gore dve spavaće sobe sa francuskim ležajevima i još jedna terasa.',
    features: [],
    note: 'Unutrašnje stepenice su strme, pa kućice ne preporučujemo porodicama sa malom decom ni starijim gostima. Njima će više odgovarati konačište ili Etno kuća.',
  },
  {
    id: 'etno3',
    name: 'Etno 3',
    inquiryLabel: 'Etno 3, potkrovni apartman',
    tag: 'Potkrovni apartman',
    image: 'etno3',
    capacity: 'Za broj mesta nas pozovite',
    text: 'Apartman u potkrovlju, sa originalnim ručno rađenim nameštajem u starom stilu i hajdučkim krevetom.',
    features: [],
  },
  {
    id: 'etno-kuca',
    name: 'Etno kuća',
    inquiryLabel: 'Etno kuća (sobe)',
    tag: '10 soba',
    image: 'etnoKuca',
    capacity: 'Sobe za 2, 3 i 4 osobe',
    text: 'Deset soba, sve sa kupatilom. Odgovara većim porodicama i društvima koja dolaze zajedno.',
    features: [
      '6 dvokrevetnih soba',
      '1 trokrevetna i 3 četvorokrevetne sobe',
      'Većina soba ima balkon ili francuski balkon',
    ],
    featured: true,
  },
];

export const MENU = [
  {
    title: 'Sa našeg imanja',
    items: [
      { name: 'Sir i kozji sir', note: 'od mleka naših koza' },
      { name: 'Kiselo mleko' },
      { name: 'Domaća jaja' },
      { name: 'Kačamak', note: 'brašno iz vodenice Potočara' },
      { name: 'Proja i heljdin hleb' },
    ],
  },
  {
    title: 'Iz ribnjaka',
    items: [
      { name: 'Pastrmka' },
      { name: 'Dimljeni šaran' },
      { name: 'Som' },
      { name: 'Smuđ' },
    ],
  },
  {
    title: 'Iz kotla i ispod sača',
    items: [
      { name: 'Teletina ispod sača' },
      { name: 'Svadbarski kupus' },
      { name: 'Vojnički pasulj' },
      { name: 'Kolenica' },
      { name: 'Zlatiborski specijaliteti' },
    ],
  },
];

export const AMENITIES = [
  { id: 'jezerca', icon: 'i-water', title: 'Jezerca za kupanje', text: 'Sa ležaljkama i suncobranima.' },
  { id: 'akvapark', icon: 'i-slide', title: 'Mini akva park', text: 'Veliki i mali tobogan i skakaonica.' },
  { id: 'ribnjak', icon: 'i-fish', title: 'Ribnjak i pecanje', text: 'Može da se peca. Iz istog ribnjaka je i riba u restoranu.' },
  { id: 'igraonica', icon: 'i-play', title: 'Igraonica za decu', text: 'Za dane kad nije za kupanje.' },
  { id: 'fitnes', icon: 'i-dumbbell', title: 'Fitnes sala', text: 'Besplatna za goste.' },
  { id: 'bicikli', icon: 'i-bike', title: 'Bicikli i staze', text: 'Staze za šetnju i planinarenje.' },
  { id: 'parking', icon: 'i-parking', title: 'Parking', text: 'Besplatan za goste.' },
];

export const GALLERY = [
  { image: 'galerija01', size: 'big' },
  { image: 'galerija02', size: 'tall' },
  { image: 'galerija03' },
  { image: 'galerija04' },
  { image: 'galerija05', size: 'wide' },
  { image: 'galerija06' },
  { image: 'galerija07', size: 'tall' },
  { image: 'galerija08' },
  { image: 'galerija09' },
  { image: 'galerija10' },
];

export const REASONS = [
  {
    title: 'Mirno je',
    text: 'Selo je van centra, u uvali na putu ka Semegnjevu. Kad vam zatreba centar, kolima je oko deset minuta.',
  },
  {
    title: 'Hrana je domaća',
    text: 'Sir, kiselo mleko i jaja su sa našeg imanja, riba iz našeg ribnjaka, a brašno iz vodenice Potočara.',
  },
  {
    title: 'Ima za decu i za odrasle',
    text: 'Deca imaju jezerca, tobogane i igraonicu. Odrasli terasu, restoran i mir.',
  },
];
