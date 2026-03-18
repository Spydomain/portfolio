import { generateAndOpenResumePDF } from './cv-generator.js';

if (typeof window !== 'undefined') {
  window.generateAndOpenResumePDF = generateAndOpenResumePDF;
}

function debounce(fn, wait = 100) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function updateFooterOffset() {
  try {
    const footer = document.querySelector('footer');
    const container = document.querySelector('.page-container');
    if (!footer || !container) return;
    const height = footer.getBoundingClientRect().height;
    container.style.paddingBottom = Math.ceil(height + 40) + 'px';
  } catch (_) { /* noop */ }
}

// ─────────────────────────────────────────────
// Main application initialization
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initPages();
  initMenu();
  initContactForm();
  startMatrix();
  initTerminal();
  generateFavicon();
  updateFooterOffset();
  window.addEventListener('resize', debounce(updateFooterOffset, 150));
  window.addEventListener('load', updateFooterOffset);
});

// ─────────────────────────────────────────────
// Mobile menu
// ─────────────────────────────────────────────
function initMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-links');

  // Create overlay if absent
  let navOverlay = document.querySelector('.nav-overlay');
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  if (!hamburger || !navMenu) return;

  // Strip any leftover inline styles so CSS takes full control
  hamburger.removeAttribute('style');

  // ── helpers ──────────────────────────────────
  const isOpen = () => hamburger.classList.contains('active');

  function openMenu() {
    if (isOpen()) return;
    hamburger.classList.add('active');
    navMenu.classList.add('show');
    navOverlay.classList.add('active');
    navOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!isOpen()) return;
    hamburger.classList.remove('active');
    navMenu.classList.remove('show');
    navOverlay.classList.remove('active');
    navOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  // ── hamburger click ───────────────────────────
  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    isOpen() ? closeMenu() : openMenu();
  });

  // ── overlay click closes menu ─────────────────
  navOverlay.addEventListener('click', closeMenu);

  // ── nav link clicks close menu ────────────────
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) closeMenu();
    });
  });

  // ── Escape key ────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });

  // ── resize: reset state when going desktop ────
  function handleResize() {
    if (window.innerWidth > 992) {
      closeMenu();
      // CSS handles display; remove any leftover inline style
      hamburger.removeAttribute('style');
    }
  }

  window.addEventListener('resize', debounce(handleResize, 150));
}

// ─────────────────────────────────────────────
// Favicon (dynamic, generated at runtime)
// ─────────────────────────────────────────────
function generateFavicon() {
  try {
    const size   = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, size, size);

    const grad = ctx.createRadialGradient(size/2, size/2, 8, size/2, size/2, size/2);
    grad.addColorStop(0, '#003322');
    grad.addColorStop(1, '#00110a');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0,255,153,0.2)';
    ctx.font = 'bold 10px monospace';
    for (let y = 10; y < size; y += 12)
      for (let x = 6;  x < size; x += 12)
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y);

    ctx.font          = 'bold 28px Roboto Mono, monospace';
    ctx.fillStyle     = '#00ff99';
    ctx.textAlign     = 'center';
    ctx.textBaseline  = 'middle';
    ctx.shadowColor   = '#00ff99';
    ctx.shadowBlur    = 8;
    ctx.fillText('BS', size/2, size/2 + 2);
    ctx.shadowBlur    = 0;

    const url = canvas.toDataURL('image/png');
    document.querySelectorAll('link[rel="icon"][data-dynamic="true"]').forEach(el => el.remove());
    const link = document.createElement('link');
    link.rel             = 'icon';
    link.type            = 'image/png';
    link.href            = url;
    link.dataset.dynamic = 'true';
    document.head.appendChild(link);
  } catch (e) { /* fallback to static favicon */ }
}

// ─────────────────────────────────────────────
// Contact form
// ─────────────────────────────────────────────
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    fetch(contactForm.action, {
      method:  contactForm.method,
      body:    new FormData(contactForm),
      headers: { 'Accept': 'application/json' },
    })
      .then(response => {
        if (response.ok) {
          alert('Message sent successfully!');
          contactForm.reset();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch(() => alert('Oops! There was a problem submitting your form'));
  });
}

// ─────────────────────────────────────────────
// Page Navigation
// ─────────────────────────────────────────────
function initPages() {
  const hash = window.location.hash.substring(1);
  showPage(hash || 'home');

  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      showPage(pageId);
      window.history.pushState(null, '', `#${pageId}`);
    });
  });

  window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1) || 'home';
    showPage(hash);
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1) || 'home';
    showPage(hash);
  });
}

function showPage(pageId) {
  if (!pageId || !document.getElementById(pageId)) pageId = 'home';

  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
    page.style.display    = 'none';
    page.style.opacity    = '';
    page.style.visibility = '';
  });

  const activePage = document.getElementById(pageId);
  if (activePage) {
    activePage.classList.add('active');
    activePage.style.display = 'block';

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageId) link.classList.add('active');
    });

    window.history.pushState({ pageId }, '', `#${pageId}`);
    window.scrollTo(0, 0);
    updateFooterOffset();
  }
}

// ─────────────────────────────────────────────
// Binary rain animation
// ─────────────────────────────────────────────
function startMatrix() {
  const canvas = document.getElementById('binary-rain');
  if (!canvas) return;

  const ctx      = canvas.getContext('2d');
  canvas.width   = window.innerWidth;
  canvas.height  = window.innerHeight;

  const binary   = ['0', '1'];
  const fontSize = 16;
  const columns  = Math.floor(canvas.width / fontSize);
  const drops    = Array(columns).fill(1);

  ctx.font = fontSize + 'px monospace';

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#39ff14';

    for (let i = 0; i < drops.length; i++) {
      const text = binary[Math.floor(Math.random() * binary.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  setInterval(draw, 40);

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ─────────────────────────────────────────────
// Terminal
// ─────────────────────────────────────────────
function initTerminal() {
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput  = document.getElementById('terminal-input');
  if (!terminalOutput || !terminalInput) return;

  const commands = {
    help: `Available commands:
- whoami         : Display information about me
- education      : View my education background
- experience     : View my work experience
- projects       : View my projects
- contact        : View contact information
- cv             : Download my CV as PDF
- clear          : Clear the terminal
- certifications : View my certifications
- social         : View my social media links`,

    whoami: "I'm Bikash Sarraf, a Cybersecurity & Ethical Hacking Enthusiast from Kathmandu, Nepal. I'm currently studying at Softwarica College of IT and E-Commerce.",

    education: `🎓 Education:
- BSc (Hons) in Cybersecurity and Ethical Hacking
  Softwarica College of IT and E-Commerce, Kathmandu
  Currently pursuing

- +2 Science (Biology)
  Xavier International College, Kalopul, Kathmandu
  Graduated: 2024 | GPA: 3.08

- SEE
  Shree Sharaswasti English Boarding School, Lipanimal-3, Bara
  Graduated: 2022 | GPA: 3.10`,

    experience: '💼 Experience:\nCurrently seeking opportunities to apply my cybersecurity and ethical hacking skills in a professional environment.',

    projects: `🚀 Projects:
1. Keylogger (Python)
   - Created a keylogger using Python
   - GitHub: github.com/Spydomain/keylogger

2. Bike Rental Nepal (Node.js + React.js)
   - Full-stack bike rental platform
   - Frontend: github.com/Spydomain/front
   - Backend: github.com/Spydomain/backend

3. CVE-2023-22809 Automated Exploits (Python)
   - Collection of automated exploits
   - GitHub: github.com/Spydomain/CVE-2023-22809-automated-python-exploits

4. ClipboardAI (Bash)
   - AI-powered clipboard manager
   - GitHub: github.com/Spydomain/ClipboardAI

5. NotesVista (Node.js+React.js)
   - Note-taking application
   - Live: notesvista.netlify.app

6. FGE Identification Test Platform (Flutter)
   - French Army Vehicles/Weapons Identification application
   - Live: https://army-testgit-45113358-666ec.web.app`,

    contact: `📧 Contact Information:
- Email: bikashsarraf83@gmail.com
- Location: Kathmandu, Nepal
- LinkedIn: linkedin.com/in/bikash-sarraf-683787320
- GitHub: github.com/Spydomain

Feel free to reach out for collaborations or just to say hi!`,

    social: `🌐 Social Media:
- LinkedIn: linkedin.com/in/bikash-sarraf-683787320
- Instagram: instagram.com/bikash.sarraf.399
- Facebook: facebook.com/bikash.sarraf.399`,

    certifications: `🎓 Certifications:
- Cisco Certified Ethical Hacker
- Tryhackme Pre-Security Certified
- Tryhackme Cyber Security 101 Certified
- Advent of cyber 2022 Certified
- Advent of cyber 2023 Certified
- Advent of cyber 2024 Certified
- Certified Cybersecurity Educator Professional (CCEP)
- Google Cybersecurity Professional Certificate
- CompTIA PenTest+ (PT0-002)
- Certified API Security Analyst`,

    cv: function () {
      generateAndOpenResumePDF();
      return 'Opening CV in a new tab and starting download...';
    },

    clear: function () {
      terminalOutput.innerHTML = '';
      return '';
    },
  };

  let typingQueue = Promise.resolve();

  function typeOutput(text, className = '') {
    return new Promise(resolve => {
      const output = document.createElement('div');
      output.className = className || 'command-output';
      terminalOutput.appendChild(output);

      let i = 0;
      const speed = 5;

      function type() {
        if (i < text.length) {
          output.textContent += text.charAt(i++);
          setTimeout(type, speed);
        } else {
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
          resolve();
        }
      }
      type();
    });
  }

  function enqueueType(text, className = '') {
    typingQueue = typingQueue.then(() => typeOutput(text, className));
    return typingQueue;
  }

  // Welcome message
  enqueueType("Welcome to Bikash's Portfolio Terminal\nType 'help' to see available commands\n\n", 'welcome-message');

  // Input prompt
  const initialPrompt = document.createElement('div');
  initialPrompt.className = 'command-line';
  initialPrompt.innerHTML = '<span class="prompt">root@bikash#</span> ';
  terminalOutput.appendChild(initialPrompt);

  terminalInput.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const command = terminalInput.value.trim();
    if (!command) return;

    const commandLine = document.createElement('div');
    commandLine.className = 'command-line';
    commandLine.innerHTML = `<span class="prompt">root@bikash#</span> ${command}`;
    terminalOutput.appendChild(commandLine);

    const normalizedCmd = command.toLowerCase();

    if (commands[normalizedCmd] !== undefined) {
      if (typeof commands[normalizedCmd] === 'function') {
        const result = commands[normalizedCmd]();
        if (result) enqueueType(result);
      } else {
        enqueueType(commands[normalizedCmd]);
      }
    } else {
      enqueueType(`Command not found: ${command}\nType 'help' to see available commands`, 'error-message');
    }

    terminalInput.value = '';
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  });

  terminalOutput.addEventListener('click', () => terminalInput.focus());
  setTimeout(() => terminalInput.focus(), 500);
}
