/**
 * Forma za upit.
 * Za sada ne šalje na server: sastavlja poruku i otvara WhatsApp ili SMS.
 * Kad bude pravi API, menja se samo funkcija sendInquiry().
 */
import { prefersReducedMotion, scrollToElement } from './utils.js';

const MESSAGES = {
  nameEmpty: 'Upišite ime i prezime, da znamo kako da vam se obratimo.',
  phoneEmpty: 'Bez broja telefona ne možemo da vam se javimo.',
  phoneBad: 'Ovaj broj nam ne izgleda potpuno. Proverite cifre.',
  emailBad: 'Proverite email adresu, nešto nedostaje.',
  arrivalPast: 'Datum dolaska ne može biti u prošlosti.',
  departureNoArrival: 'Upišite i datum dolaska.',
  departureOrder: 'Odlazak mora biti bar dan posle dolaska.',
  summary: 'Nešto nije popunjeno kako treba. Pogledajte polja označena crvenom bojom.',
};

/* ---------- Datumi ---------- */

const toISO = (date) => {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 10);
};

const addDays = (iso, days) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return toISO(d);
};

const formatDate = (iso) => {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}.`;
};

const nightsBetween = (a, b) =>
  Math.round((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`)) / 86400000);

const nightsLabel = (n) => (n % 10 === 1 && n % 100 !== 11 ? 'noć' : 'noći');

/* ---------- Poruka ---------- */

/** Sastavlja čitljivu poruku iz popunjenih polja. */
export function buildMessage(data, { stays = [], greeting = '' } = {}) {
  const stay = stays.find((s) => s.id === data.smestaj);
  const lines = [greeting || 'Dobar dan, šaljem upit za smeštaj.', ''];

  lines.push(`Ime: ${data.ime}`);
  lines.push(`Telefon: ${data.telefon}`);
  if (data.email) lines.push(`Email: ${data.email}`);
  lines.push(`Smeštaj: ${stay ? stay.inquiryLabel : 'svejedno, predložite nam'}`);

  if (data.dolazak && data.odlazak) {
    const n = nightsBetween(data.dolazak, data.odlazak);
    lines.push(`Termin: ${formatDate(data.dolazak)} do ${formatDate(data.odlazak)} (${n} ${nightsLabel(n)})`);
  } else if (data.dolazak) {
    lines.push(`Dolazak: ${formatDate(data.dolazak)}`);
  }

  lines.push(`Odraslih: ${data.odrasli}, dece: ${data.deca}`);
  if (data.poruka) lines.push('', data.poruka);

  return lines.join('\n');
}

/**
 * Slanje upita. Ovo je jedino mesto koje treba menjati za pravi backend.
 * Primer za kasnije:
 *   const res = await fetch('/api/upit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inquiry) });
 *   return { ok: res.ok, channel: 'api' };
 *
 * Napomena: window.open mora da se pozove odmah posle klika (bez await pre njega),
 * inače ga pregledač blokira kao iskačući prozor.
 */
export function sendInquiry(inquiry, { channel = 'whatsapp', config, stays }) {
  const text = buildMessage(inquiry, { stays, greeting: config.texts.whatsappGreeting });

  if (channel === 'sms') {
    window.location.href = `sms:${config.phone.e164}?body=${encodeURIComponent(text)}`;
    return Promise.resolve({ ok: true, channel });
  }

  const url = `https://wa.me/${config.phone.whatsapp}?text=${encodeURIComponent(text)}`;
  const win = window.open(url, '_blank');
  if (win) win.opener = null;
  else window.location.href = url;
  return Promise.resolve({ ok: true, channel });
}

/* ---------- Forma ---------- */

let formRef = null;

/** Skroluje do forme, opciono bira tip smeštaja i stavlja fokus u prvo polje. */
export function openInquiry(stayId) {
  const form = formRef;
  if (!form) return;
  if (stayId) form.elements.smestaj.value = stayId;
  const section = form.closest('section') || form;
  scrollToElement(section);
  setTimeout(() => form.elements.ime.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 450);
}

function initStepper(stepper) {
  const input = stepper.querySelector('input');
  const [minus, plus] = stepper.querySelectorAll('[data-step]');
  const min = Number(input.min);
  const max = Number(input.max);

  const clamp = (v) => Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));
  const sync = () => {
    minus.disabled = Number(input.value) <= min;
    plus.disabled = Number(input.value) >= max;
  };

  stepper.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-step]');
    if (!btn) return;
    input.value = clamp(Number(input.value) + Number(btn.dataset.step));
    sync();
  });
  input.addEventListener('change', () => {
    input.value = clamp(Math.round(Number(input.value)));
    sync();
  });
  sync();
}

export function initForm({ config, stays }) {
  const form = document.querySelector('[data-inquiry-form]');
  if (!form) return;
  formRef = form;

  const { ime, telefon, email, smestaj, dolazak, odlazak } = form.elements;
  const status = form.querySelector('[data-form-status]');

  // Tipovi smeštaja iz podataka
  stays.forEach((s) => smestaj.add(new Option(s.inquiryLabel, s.id)));

  // Datumi: bez prošlih, odlazak posle dolaska
  const today = toISO(new Date());
  dolazak.min = today;
  odlazak.min = addDays(today, 1);

  const validators = {
    ime: () => (ime.value.trim().length >= 2 ? '' : MESSAGES.nameEmpty),
    telefon: () => {
      const v = telefon.value.trim();
      if (!v) return MESSAGES.phoneEmpty;
      const digits = v.replace(/\D/g, '');
      return /^[+\d][\d\s/().-]*$/.test(v) && digits.length >= 8 && digits.length <= 15 ? '' : MESSAGES.phoneBad;
    },
    email: () => {
      const v = email.value.trim();
      return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : MESSAGES.emailBad;
    },
    dolazak: () => (!dolazak.value || dolazak.value >= today ? '' : MESSAGES.arrivalPast),
    odlazak: () => {
      if (!odlazak.value) return '';
      if (!dolazak.value) return MESSAGES.departureNoArrival;
      return odlazak.value > dolazak.value ? '' : MESSAGES.departureOrder;
    },
  };

  const touched = new Set();

  const setError = (input, message) => {
    const error = form.querySelector(`#${input.id}-greska`);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message;
  };

  const validate = (name) => {
    const message = validators[name]();
    setError(form.elements[name], message);
    return !message;
  };

  Object.keys(validators).forEach((name) => {
    const input = form.elements[name];
    input.addEventListener('blur', () => {
      if (input.value.trim()) touched.add(name);
      if (touched.has(name)) validate(name);
    });
    input.addEventListener('input', () => {
      if (touched.has(name)) validate(name);
    });
  });

  dolazak.addEventListener('change', () => {
    odlazak.min = dolazak.value ? addDays(dolazak.value, 1) : addDays(today, 1);
    touched.add('dolazak');
    validate('dolazak');
    if (odlazak.value) validate('odlazak');
  });
  odlazak.addEventListener('change', () => {
    touched.add('odlazak');
    validate('odlazak');
  });

  form.querySelectorAll('[data-stepper]').forEach(initStepper);

  const collect = () => {
    const data = Object.fromEntries(new FormData(form));
    Object.keys(data).forEach((k) => (data[k] = String(data[k]).trim()));
    return data;
  };

  const showStatus = (html, isError = false) => {
    status.innerHTML = `<div class="form-status${isError ? ' form-status--error' : ''}">${html}</div>`;
  };

  const handleSend = (channel) => {
    const names = Object.keys(validators);
    names.forEach((n) => touched.add(n));
    const results = names.map(validate);
    if (results.includes(false)) {
      showStatus(MESSAGES.summary, true);
      form.elements[names[results.indexOf(false)]].focus();
      return;
    }

    sendInquiry(collect(), { channel, config, stays }).then(() => {
      showStatus(
        channel === 'sms'
          ? `Otvorili smo poruku sa vašim upitom, samo je pošaljite. Ako se ništa nije otvorilo, pozovite nas na <a href="tel:${config.phone.e164}">${config.phone.display}</a>.`
          : `Otvorili smo WhatsApp sa vašim upitom, samo pritisnite Pošalji. Ako se ništa nije otvorilo, pozovite nas na <a href="tel:${config.phone.e164}">${config.phone.display}</a>.`,
      );
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSend('whatsapp');
  });
  form.querySelector('[data-send-sms]')?.addEventListener('click', () => handleSend('sms'));

  // Dugmad "Rezervišite" i "Pošaljite upit" sa kartica
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-inquiry], [data-open-inquiry]');
    if (!trigger) return;
    e.preventDefault();
    openInquiry(trigger.dataset.inquiry);
  });
}
