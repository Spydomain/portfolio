import { generateAndOpenResumePDF } from './cv-generator.js';
if (typeof window !== 'undefined') window.generateAndOpenResumePDF = generateAndOpenResumePDF;

function debounce(fn, wait = 100) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

function updateFooterOffset() {
  try {
    const footer    = document.querySelector('footer');
    const container = document.querySelector('.page-container');
    if (!footer || !container) return;
    container.style.paddingBottom = Math.ceil(footer.getBoundingClientRect().height + 40) + 'px';
  } catch (_) {}
}

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initPages();
  initContactForm();
  startMatrix();
  initTerminal();
  generateFavicon();
  updateFooterOffset();
  window.addEventListener('resize', debounce(updateFooterOffset, 150));
  window.addEventListener('load',   updateFooterOffset);
});

/* ══════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════ */
function initMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  // Create overlay if missing
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  // Strip ALL inline styles — CSS controls everything
  hamburger.removeAttribute('style');
  navLinks.removeAttribute('style');

  const isOpen = () => hamburger.classList.contains('active');

  function open() {
    hamburger.classList.add('active');
    navLinks.classList.add('show');
    overlay.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function close() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('show');
    overlay.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    isOpen() ? close() : open();
  });

  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Close on nav link click on mobile
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { if (window.innerWidth <= 992) close(); });
  });

  // Reset on resize to desktop
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 992) close();
  }, 150));
}

/* ══════════════════════════════════════
   PAGE NAVIGATION
══════════════════════════════════════ */
function initPages() {
  const hash = window.location.hash.slice(1);
  showPage(hash || 'home');

  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(link.getAttribute('data-page'));
    });
  });

  window.addEventListener('popstate',   () => showPage(window.location.hash.slice(1) || 'home'));
  window.addEventListener('hashchange', () => showPage(window.location.hash.slice(1) || 'home'));
}

function showPage(pageId) {
  if (!pageId || !document.getElementById(pageId)) pageId = 'home';

  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });

  const page = document.getElementById(pageId);
  if (!page) return;

  page.classList.add('active');
  page.style.display = 'block';

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-page') === pageId);
  });

  window.history.pushState({ pageId }, '', '#' + pageId);
  window.scrollTo(0, 0);
  updateFooterOffset();
}

/* ══════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════ */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch(form.action, {
      method:  form.method,
      body:    new FormData(form),
      headers: { Accept: 'application/json' },
    })
      .then(r => { if (r.ok) { alert('Message sent!'); form.reset(); } else throw 0; })
      .catch(() => alert('Error submitting form. Please try again.'));
  });
}

/* ══════════════════════════════════════
   BINARY RAIN
══════════════════════════════════════ */
function startMatrix() {
  const canvas = document.getElementById('binary-rain');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  const fontSize = 16;
  let drops = [];
  const resetDrops = () => { drops = Array(Math.floor(canvas.width / fontSize)).fill(1); };
  resetDrops();
  window.addEventListener('resize', resetDrops);

  ctx.font = fontSize + 'px monospace';

  setInterval(() => {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#39ff14';
    drops.forEach((y, i) => {
      ctx.fillText(Math.random() > 0.5 ? '1' : '0', i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 40);
}

/* ══════════════════════════════════════
   FAVICON
══════════════════════════════════════ */
function generateFavicon() {
  try {
    const size = 64;
    const c    = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, size, size);

    const g = ctx.createRadialGradient(size/2, size/2, 8, size/2, size/2, size/2);
    g.addColorStop(0, '#003322');
    g.addColorStop(1, '#00110a');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0,255,153,0.2)';
    ctx.font = 'bold 10px monospace';
    for (let y = 10; y < size; y += 12)
      for (let x = 6; x < size; x += 12)
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y);

    ctx.font         = 'bold 28px Roboto Mono, monospace';
    ctx.fillStyle    = '#00ff99';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor  = '#00ff99';
    ctx.shadowBlur   = 8;
    ctx.fillText('BS', size/2, size/2 + 2);

    document.querySelectorAll('link[rel="icon"]').forEach(el => el.remove());
    const link = document.createElement('link');
    link.rel  = 'icon';
    link.type = 'image/png';
    link.href = c.toDataURL('image/png');
    document.head.appendChild(link);
  } catch (_) {}
}

/* ══════════════════════════════════════
   TERMINAL
══════════════════════════════════════ */
function initTerminal() {
  const output = document.getElementById('terminal-output');
  const input  = document.getElementById('terminal-input');
  if (!output || !input) return;

  const commands = {
    help: `Available commands:
- whoami         : About me
- education      : My education
- experience     : Work experience
- projects       : My projects
- contact        : Contact info
- certifications : My certifications
- social         : Social links
- cv             : Download CV as PDF
- clear          : Clear terminal`,

    whoami: "I'm Bikash Sarraf, a Cybersecurity & Ethical Hacking Enthusiast from Kathmandu, Nepal. Currently studying at Softwarica College of IT and E-Commerce.",

    education: `🎓 Education:
- BSc (Hons) in Cybersecurity and Ethical Hacking
  Softwarica College of IT and E-Commerce, Kathmandu — Currently pursuing

- +2 Science (Biology) | GPA: 3.08
  Xavier International College, Kalopul, Kathmandu — 2024

- SEE | GPA: 3.10
  Shree Sharaswasti English Boarding School, Lipanimal-3, Bara — 2022`,

    experience: "💼 Experience:\nCurrently seeking opportunities to apply cybersecurity and ethical hacking skills professionally.",

    projects: `🚀 Projects:
1. Keylogger (Python)
   github.com/Spydomain/keylogger

2. Bike Rental Nepal (Node.js + React.js)
   Frontend: github.com/Spydomain/front
   Backend:  github.com/Spydomain/backend

3. CVE-2023-22809 Automated Exploits (Python)
   github.com/Spydomain/CVE-2023-22809-automated-python-exploits

4. ClipboardAI (Bash)
   github.com/Spydomain/ClipboardAI

5. NotesVista (Node.js + React.js)
   notesvista.netlify.app

6. FGE Identification Test Platform (Flutter)
   army-testgit-45113358-666ec.web.app`,

    contact: `📧 Contact:
- Email:    bikashsarraf83@gmail.com
- Location: Kathmandu, Nepal
- LinkedIn: linkedin.com/in/bikash-sarraf-683787320
- GitHub:   github.com/Spydomain

Feel free to reach out for collaborations!`,

    social: `🌐 Social Media:
- LinkedIn:  linkedin.com/in/bikash-sarraf-683787320
- Instagram: instagram.com/bikash.sarraf.399
- Facebook:  facebook.com/bikash.sarraf.399`,

    certifications: `🎓 Certifications:
- Cisco Certified Ethical Hacker
- TryHackMe Pre-Security Certified
- TryHackMe Cyber Security 101 Certified
- TryHackMe Advent of Cyber 2022 / 2023 / 2024
- Certified Cybersecurity Educator Professional (CCEP)
- Google Cybersecurity Professional Certificate
- CompTIA PenTest+ (PT0-002)
- Certified API Security Analyst`,

    cv()    { generateAndOpenResumePDF(); return 'Opening CV in a new tab and starting download...'; },
    clear() { output.innerHTML = ''; return ''; },
  };

  let queue = Promise.resolve();

  function typeText(text, cls = 'command-output') {
    return new Promise(resolve => {
      const div = document.createElement('div');
      div.className = cls;
      output.appendChild(div);
      let i = 0;
      const tick = () => {
        if (i < text.length) { div.textContent += text[i++]; setTimeout(tick, 5); }
        else { output.scrollTop = output.scrollHeight; resolve(); }
      };
      tick();
    });
  }

  const enqueue = (text, cls) => { queue = queue.then(() => typeText(text, cls)); };

  // Welcome message
  enqueue("Welcome to Bikash's Portfolio Terminal\nType 'help' to see available commands\n\n", 'welcome-message');

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const cmd = input.value.trim();
    if (!cmd) return;

    const line = document.createElement('div');
    line.className = 'command-line';
    line.innerHTML = `<span class="prompt">root@bikash#</span> ${cmd}`;
    output.appendChild(line);

    const key = cmd.toLowerCase();
    if (key in commands) {
      const result = typeof commands[key] === 'function' ? commands[key]() : commands[key];
      if (result) enqueue(result);
    } else {
      enqueue(`Command not found: ${cmd}\nType 'help' for available commands`, 'error-message');
    }

    input.value = '';
    output.scrollTop = output.scrollHeight;
  });

  output.addEventListener('click', () => input.focus());
  setTimeout(() => input.focus(), 500);
}
