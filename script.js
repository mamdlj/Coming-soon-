'use strict';
const START = new Date('2026-10-01T00:00:00').getTime();   // project start
const LAUNCH = new Date('2026-12-31T23:59:59').getTime();  // launch date
const $ = id => document.getElementById(id);

/* Countdown */
const prev = {};
function setVal(id, v) {
  const el = $(id), s = String(v).padStart(2, '0');
  if (prev[id] !== s) { el.textContent = s; el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); prev[id] = s; }
}
function update() {
  const now = Date.now(), d = Math.max(0, LAUNCH - now);
  setVal('days', Math.floor(d / 864e5)); setVal('hours', Math.floor(d / 36e5) % 24);
  setVal('minutes', Math.floor(d / 6e4) % 60); setVal('seconds', Math.floor(d / 1e3) % 60);
  const p = Math.min(100, Math.max(0, (now - START) / (LAUNCH - START) * 100));
  $('bar').style.width = p + '%'; $('pct').textContent = p.toFixed(0) + '%';
}
update(); setInterval(update, 1000);

/* Rotating word */
const words = ['great', 'bold', 'beautiful', 'powerful', 'new'], w = $('word'); let wi = 0;
setInterval(() => {
  w.classList.add('out');
  setTimeout(() => { wi = (wi + 1) % words.length; w.textContent = words[wi]; w.classList.remove('out'); }, 350);
}, 2800);

/* Mouse spotlight */
addEventListener('pointermove', e => {
  document.documentElement.style.setProperty('--x', e.clientX + 'px');
  document.documentElement.style.setProperty('--y', e.clientY + 'px');
}, { passive: true });

/* Confetti */
function confetti() {
  const c = $('fx'), g = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const cols = ['#8f85ff', '#4ddcff', '#4ade80', '#fff'];
  const ps = Array.from({ length: 90 }, () => ({ x: innerWidth / 2, y: innerHeight / 2, vx: (Math.random() - .5) * 14, vy: Math.random() * -13 - 3, s: Math.random() * 6 + 3, c: cols[Math.random() * 4 | 0], l: 90 }));
  (function f() {
    g.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.l--; g.globalAlpha = Math.max(0, p.l / 90); g.fillStyle = p.c; g.fillRect(p.x, p.y, p.s, p.s); });
    if (ps[0].l > 0) requestAnimationFrame(f); else g.clearRect(0, 0, c.width, c.height);
  })();
}

/* Waitlist form (saved in this browser only — connect a backend to collect emails) */
$('form').addEventListener('submit', e => {
  e.preventDefault();
  const em = $('email'), msg = $('message'), ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim());
  msg.classList.toggle('err', !ok);
  if (!ok) { e.target.classList.remove('bad'); void e.target.offsetWidth; e.target.classList.add('bad'); msg.textContent = 'Please enter a valid email address.'; return; }
  try { const l = JSON.parse(localStorage.getItem('waitlist') || '[]'); if (!l.includes(em.value)) l.push(em.value); localStorage.setItem('waitlist', JSON.stringify(l)); } catch (x) {}
  msg.textContent = "You're on the list! We'll notify " + em.value.trim() + ' 🎉';
  em.value = ''; confetti();
});
