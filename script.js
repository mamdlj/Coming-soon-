// Launch time: Dec 31 2026 23:59:59 Tehran time (UTC+03:30), same moment for every visitor.
const launchDate = new Date('2026-12-31T23:59:59+03:30').getTime();

// Set this to your backend URL (Cloudflare Worker, Firebase function, ...) to store emails.
// It must accept POST {"email": "..."}. Leave empty to keep the form in demo mode.
const SUBSCRIBE_URL = '';

const I18N = {
  en: {
    badge: '● UNDER DEVELOPMENT',
    title: 'Something <span>great</span><br>is coming.',
    text: 'We’re crafting a new experience. Stay tuned — the launch is closer than you think.',
    days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds',
    placeholder: 'Enter your email', button: 'Notify me',
    footer: '© 2026 • Built with passion',
    thanks: e => `Thanks! ${e} will be notified.`,
    error: 'Something went wrong. Please try again.',
    toggle: 'فارسی', dir: 'ltr'
  },
  fa: {
    badge: '● در حال توسعه',
    title: 'چیزی <span>عالی</span><br>در راه است.',
    text: 'در حال ساخت تجربه‌ای تازه‌ایم. با ما همراه بمانید؛ زمان راه‌اندازی نزدیک‌تر از چیزی است که فکر می‌کنید.',
    days: 'روز', hours: 'ساعت', minutes: 'دقیقه', seconds: 'ثانیه',
    placeholder: 'ایمیل خود را وارد کنید', button: 'خبرم کن',
    footer: '© ۲۰۲۶ • ساخته‌شده با عشق',
    thanks: e => `ممنون! به ${e} اطلاع می‌دهیم.`,
    error: 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
    toggle: 'English', dir: 'rtl'
  }
};

let lang = (navigator.language || '').toLowerCase().startsWith('fa') ? 'fa' : 'en';
try { lang = localStorage.getItem('lang') || lang; } catch (e) {}

function applyLang(l){
  lang = l;
  const t = I18N[l];
  document.documentElement.lang = l;
  document.documentElement.dir = t.dir;
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t[el.dataset.i18n]);
  document.querySelectorAll('[data-i18n-html]').forEach(el => el.innerHTML = t[el.dataset.i18nHtml]);
  document.querySelectorAll('[data-i18n-ph]').forEach(el => el.placeholder = t[el.dataset.i18nPh]);
  document.getElementById('lang').textContent = t.toggle;
  document.getElementById('message').textContent = '';
  try { localStorage.setItem('lang', l); } catch (e) {}
  updateCountdown();
}

const fmt = n => {
  const s = String(n).padStart(2, '0');
  return lang === 'fa' ? s.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]) : s;
};

function updateCountdown(){
  const distance = Math.max(0, launchDate - Date.now());
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor(distance / 3600000) % 24;
  const minutes = Math.floor(distance / 60000) % 60;
  const seconds = Math.floor(distance / 1000) % 60;
  document.getElementById('days').textContent = fmt(days);
  document.getElementById('hours').textContent = fmt(hours);
  document.getElementById('minutes').textContent = fmt(minutes);
  document.getElementById('seconds').textContent = fmt(seconds);
}

async function subscribe(event){
  event.preventDefault();
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  const value = email.value.trim();
  try {
    if (SUBSCRIBE_URL) {
      const res = await fetch(SUBSCRIBE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value })
      });
      if (!res.ok) throw new Error('bad status');
    }
    message.textContent = I18N[lang].thanks(value);
    email.value = '';
  } catch (err) {
    message.textContent = I18N[lang].error;
  }
  return false;
}

document.getElementById('lang').addEventListener('click', () => applyLang(lang === 'en' ? 'fa' : 'en'));
applyLang(lang);
setInterval(updateCountdown, 1000);
