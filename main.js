import { generateAndOpenResumePDF } from './cv-generator.js';
if (typeof window !== 'undefined') window.generateAndOpenResumePDF = generateAndOpenResumePDF;

const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const debounce = (fn, ms = 120) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initPages();
  initContactForm();
  startMatrix();
  initTerminal();
  generateFavicon();
});

/* ══════════════════════════════════════════════════
   HAMBURGER MENU
   ─ Only the PANEL uses transform to show/hide.
   ─ li and a elements are NEVER touched by JS.
   ─ Class used: is-open  (avoids clash with old code)
══════════════════════════════════════════════════ */
function initMenu() {
  const btn   = $('.hamburger');
  const panel = $('.nav-links');
  if (!btn || !panel) return;

  /* Create overlay if missing */
  let overlay = $('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  /* ── CRITICAL: strip every inline style that old JS set ── */
  btn.removeAttribute('style');
  panel.removeAttribute('style');
  /* Strip from every li and a — old code set opacity/transform inline */
  $$('.nav-links li, .nav-links a').forEach(el => {
    el.removeAttribute('style');
    el.style.cssText = ''; /* belt-and-suspenders */
  });

  let open = false;

  function openMenu() {
    open = true;
    btn.classList.add('is-open');
    panel.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    open = false;
    btn.classList.remove('is-open');
    panel.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    open ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closeMenu(); });

  /* Close when any nav link is clicked on mobile */
  /* This handler works for both menu and desktop */
  $$('.nav-links a').forEach(a => {
    a.addEventListener('click', (e) => { 
      e.preventDefault();
      e.stopPropagation();
      const page = a.getAttribute('data-page');
      console.log('Navigation clicked:', page); /* Debug log */
      if (page) {
        showPage(page);
      }
      if (window.innerWidth <= 992) closeMenu();
    });
  });

  /* Reset cleanly when resizing to desktop */
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 992) {
      closeMenu();
      panel.removeAttribute('style');
      btn.removeAttribute('style');
    }
  }));
}

/* ══════════════════════════════════════════════════
   PAGE NAVIGATION
══════════════════════════════════════════════════ */
function initPages() {
  const hash = window.location.hash.slice(1);
  showPage(hash || 'home');

  /* Navigation is handled by initMenu for menu links */
  /* and by window hashchange listener below */

  window.addEventListener('popstate',   () => showPage(window.location.hash.slice(1) || 'home'));
  window.addEventListener('hashchange', () => showPage(window.location.hash.slice(1) || 'home'));
}

function showPage(id) {
  if (!id || !document.getElementById(id)) id = 'home';
  $$('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
  const page = document.getElementById(id);
  if (!page) return;
  page.style.display = 'block';
  page.classList.add('active');
  $$('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('data-page') === id));
  window.history.pushState({ id }, '', '#' + id);
  window.scrollTo(0, 0);
}

/* ══════════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════════ */
function initContactForm() {
  const form = $('.contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(form.action, { method: form.method, body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(r => { if (r.ok) { alert('Message sent!'); form.reset(); } else throw 0; })
      .catch(() => alert('Error sending message. Please try again.'));
  });
}

/* ══════════════════════════════════════════════════
   BINARY RAIN
══════════════════════════════════════════════════ */
function startMatrix() {
  const canvas = document.getElementById('binary-rain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const FS = 16;
  let drops = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array(Math.floor(canvas.width / FS)).fill(1);
  }
  resize();
  window.addEventListener('resize', debounce(resize));
  ctx.font = FS + 'px monospace';

  setInterval(() => {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#39ff14';
    drops.forEach((y, i) => {
      ctx.fillText(Math.random() > 0.5 ? '1' : '0', i * FS, y * FS);
      if (y * FS > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 40);
}

/* ══════════════════════════════════════════════════
   FAVICON
══════════════════════════════════════════════════ */
function generateFavicon() {
  try {
    const S = 64;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const x = c.getContext('2d');
    x.fillStyle = '#0b0f19'; x.fillRect(0, 0, S, S);
    const g = x.createRadialGradient(S/2,S/2,8,S/2,S/2,S/2);
    g.addColorStop(0,'#003322'); g.addColorStop(1,'#00110a');
    x.fillStyle = g; x.beginPath(); x.arc(S/2,S/2,S/2-2,0,Math.PI*2); x.fill();
    x.fillStyle='rgba(0,255,153,0.2)'; x.font='bold 10px monospace';
    for (let y=10;y<S;y+=12) for (let i=6;i<S;i+=12) x.fillText(Math.random()>.5?'1':'0',i,y);
    x.font='bold 28px Roboto Mono,monospace'; x.fillStyle='#00ff99';
    x.textAlign='center'; x.textBaseline='middle';
    x.shadowColor='#00ff99'; x.shadowBlur=8;
    x.fillText('BS', S/2, S/2+2);
    $$('link[rel="icon"]').forEach(e => e.remove());
    const lnk = document.createElement('link');
    lnk.rel='icon'; lnk.type='image/png'; lnk.href=c.toDataURL('image/png');
    document.head.appendChild(lnk);
  } catch(_) {}
}

/* ══════════════════════════════════════════════════
   TERMINAL
══════════════════════════════════════════════════ */
function initTerminal() {
  const out = document.getElementById('terminal-output');
  const inp = document.getElementById('terminal-input');
  if (!out || !inp) return;

  const CMD = {
    help:`Available commands:
- whoami         : About me
- education      : Education background
- experience     : Work experience
- projects       : My projects
- contact        : Contact info
- certifications : My certifications
- social         : Social media links
- cv             : Download CV as PDF
- clear          : Clear the terminal`,
    whoami: "I'm Bikash Sarraf, a Cybersecurity & Ethical Hacking Enthusiast from Kathmandu, Nepal. Currently studying at Softwarica College of IT and E-Commerce.",
    education:`🎓 Education:
- BSc (Hons) Cybersecurity & Ethical Hacking
  Softwarica College, Kathmandu — Currently pursuing
- +2 Science (Biology) | GPA: 3.08
  Xavier International College, Kalopul — 2024
- SEE | GPA: 3.10
  Shree Sharaswasti English Boarding School, Bara — 2022`,
    experience: "💼 Currently seeking professional cybersecurity opportunities.",
    projects:`🚀 Projects:
1. Keylogger (Python) — github.com/Spydomain/keylogger
2. Bike Rental Nepal (Node+React) — github.com/Spydomain/front
3. CVE-2023-22809 Exploits — github.com/Spydomain/CVE-2023-22809-automated-python-exploits
4. ClipboardAI (Bash) — github.com/Spydomain/ClipboardAI
5. NotesVista — notesvista.netlify.app
6. FGE ID Platform (Flutter) — army-testgit-45113358-666ec.web.app`,
    contact:`📧 Contact:
- Email:    bikashsarraf83@gmail.com
- Location: Kathmandu, Nepal
- LinkedIn: linkedin.com/in/bikash-sarraf-683787320
- GitHub:   github.com/Spydomain`,
    social:`🌐 Social:
- LinkedIn:  linkedin.com/in/bikash-sarraf-683787320
- Instagram: instagram.com/bikash.sarraf.399
- Facebook:  facebook.com/bikash.sarraf.399`,
    certifications:`🎓 Certifications:
- Cisco Certified Ethical Hacker
- TryHackMe Pre-Security & Cyber Security 101
- TryHackMe Advent of Cyber 2022 / 2023 / 2024
- Certified Cybersecurity Educator Professional (CCEP)
- Google Cybersecurity Professional Certificate
- CompTIA PenTest+ (PT0-002)
- Certified API Security Analyst`,
    cv()    { generateAndOpenResumePDF(); return 'Opening CV…'; },
    clear() { out.innerHTML = ''; return ''; },
  };

  let q = Promise.resolve();
  const type = (text, cls='command-output') => new Promise(res => {
    const d = document.createElement('div');
    d.className = cls; out.appendChild(d);
    let i = 0;
    const tick = () => i < text.length
      ? (d.textContent += text[i++], setTimeout(tick, 5))
      : (out.scrollTop = out.scrollHeight, res());
    tick();
  });
  const enq = (t, c) => { q = q.then(() => type(t, c)); };

  enq("Welcome to Bikash's Portfolio Terminal\nType 'help' to see available commands\n\n", 'welcome-message');

  inp.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const cmd = inp.value.trim();
    if (!cmd) return;
    const ln = document.createElement('div');
    ln.className = 'command-line';
    ln.innerHTML = `<span class="prompt">root@bikash#</span> ${cmd}`;
    out.appendChild(ln);
    const k = cmd.toLowerCase();
    if (k in CMD) {
      const r = typeof CMD[k] === 'function' ? CMD[k]() : CMD[k];
      if (r) enq(r);
    } else {
      enq(`Command not found: ${cmd}\nType 'help' for available commands`, 'error-message');
    }
    inp.value = '';
    out.scrollTop = out.scrollHeight;
  });

  out.addEventListener('click', () => inp.focus());
  setTimeout(() => inp.focus(), 500);
}
