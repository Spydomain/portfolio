
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

 

// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
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

// Mobile menu functionality
function initMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-links');
  let navOverlay = document.querySelector('.nav-overlay');

  // Create overlay if it doesn't exist
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }
  
  // Close menu by default on page load
  hamburger.classList.remove('active');
  navMenu.classList.remove('show');
  navOverlay.style.display = 'none';

  // Function to close menu
  const closeMenu = () => {
    if (!hamburger.classList.contains('active')) return; // Already closed
    
    // Animate menu items out
    const menuItems = navMenu.querySelectorAll('li');
    menuItems.forEach((item, index) => {
      item.style.animation = `fadeOutRight 0.3s ease forwards ${index * 0.05}s`;
    });
    
    // Close menu after animation
    setTimeout(() => {
      if (!hamburger.classList.contains('active')) return; // Already closed by another action
      
      navMenu.classList.remove('show');
      navOverlay.classList.remove('show');
      document.body.style.overflow = '';
      
      // Reset animations and remove active class after transition
      setTimeout(() => {
        hamburger.classList.remove('active');
        if (navOverlay) navOverlay.style.display = 'none';
        menuItems.forEach(item => {
          item.style.animation = '';
        });
      }, 300);
    }, 100);
  };

  // Function to open menu
  const openMenu = () => {
    if (hamburger.classList.contains('active')) return; // Already open
    
    // Close any other open menus first
    const openMenus = document.querySelectorAll('.nav-links.show');
    openMenus.forEach(menu => {
      if (menu !== navMenu) {
        menu.classList.remove('show');
      }
    });
    
    navOverlay.style.display = 'block';
    // Force reflow to ensure display:block is applied
    void navOverlay.offsetHeight;
    
    hamburger.classList.add('active');
    navMenu.classList.add('show');
    navOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Animate menu items in
    const menuItems = navMenu.querySelectorAll('li');
    menuItems.forEach((item, index) => {
      item.style.animation = `fadeInRight 0.3s ease forwards ${index * 0.1}s`;
    });
  };

  // Function to toggle menu
  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hamburger.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
    
    return false;
  };

  if (hamburger && navMenu) {
    // Toggle menu only on hamburger button click
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (hamburger.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
      return false;
    });

    // Remove all other click handlers that might close the menu
    if (navOverlay) {
      navOverlay.onclick = null;
    }
    
    // Remove document click handler
    document.onclick = null;
    
    // Don't close when clicking inside the menu
    navMenu.onclick = (e) => {
      e.stopPropagation();
      return false;
    };

    // Keep menu open when clicking links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.onclick = (e) => {
        e.stopPropagation();
        // Don't close menu when clicking links
        return true;
      };
    });

    // Close menu when pressing Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && hamburger.classList.contains('active')) {
        closeMenu();
      }
    };
    
    // Add the event listener
    document.addEventListener('keydown', handleKeyDown);

    // Handle window resize
    function handleResize() {
      const isDesktop = window.innerWidth > 992;
      if (isDesktop) {
        // Desktop: show inline nav, hide hamburger and overlay
        navMenu.classList.remove('show');
        hamburger.classList.remove('active');
        hamburger.style.display = 'none';
        if (navOverlay) {
          navOverlay.style.display = 'none';
          navOverlay.classList.remove('show');
        }
        document.body.style.overflow = '';
      } else {
        // Mobile: show hamburger, leave menu visibility to class-based CSS
        hamburger.style.display = 'flex';
      }
    }
    
    // Initial setup
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup when unloading
    window.addEventListener('beforeunload', () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    });
  }
}

// Generate a dynamic favicon (PNG) and inject as rel=icon at runtime
function generateFavicon() {
  try {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Background circle
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, size, size);
    const grad = ctx.createRadialGradient(size/2, size/2, 8, size/2, size/2, size/2);
    grad.addColorStop(0, '#003322');
    grad.addColorStop(1, '#00110a');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Matrix 0/1 background
    ctx.fillStyle = 'rgba(0,255,153,0.2)';
    ctx.font = 'bold 10px monospace';
    for (let y = 10; y < size; y += 12) {
      for (let x = 6; x < size; x += 12) {
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y);
      }
    }

    // Monogram BS
    ctx.font = 'bold 28px Roboto Mono, monospace';
    ctx.fillStyle = '#00ff99';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#00ff99';
    ctx.shadowBlur = 8;
    ctx.fillText('BS', size/2, size/2 + 2);
    ctx.shadowBlur = 0;

    const url = canvas.toDataURL('image/png');

    // Remove existing dynamic icons
    document.querySelectorAll('link[rel="icon"]').forEach(el => {
      if (el.dataset && el.dataset.dynamic === 'true') el.remove();
    });

    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = url;
    link.dataset.dynamic = 'true';
    document.head.appendChild(link);
  } catch (e) {
    // Fail silently; static favicon.svg will be used
  }
}

// Contact form submission
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    fetch(contactForm.action, {
      method: contactForm.method,
      body: new FormData(contactForm),
      headers: {
        'Accept': 'application/json',
      },
    }).then(response => {
      if (response.ok) {
        alert('Message sent successfully!');
        contactForm.reset();
      } else {
        throw new Error('Network response was not ok');
      }
    }).catch(() => {
      alert('Oops! There was a problem submitting your form');
    });
  });
}

// Page Navigation
function initPages() {
  // Show home page by default if no hash in URL
  const hash = window.location.hash.substring(1);
  const defaultPage = hash || 'home';
  showPage(defaultPage);
  
  // Add click event listeners to navigation links
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      showPage(pageId);
      // Update URL without page reload
      window.history.pushState(null, '', `#${pageId}`);
      // Close mobile menu if open
      const hamburger = document.querySelector('.hamburger');
      const navMenu = document.querySelector('.nav-links');
      const navOverlay = document.querySelector('.nav-overlay');
      if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('show');
        if (navOverlay) {
          navOverlay.classList.remove('show');
          navOverlay.style.display = 'none';
        }
        document.body.style.overflow = '';
      }
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function() {
    const hash = window.location.hash.substring(1) || 'home';
    showPage(hash);
  });

  // Handle hash changes from normal anchor clicks (e.g., footer quick links)
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1) || 'home';
    showPage(hash);
    // Close mobile menu if open
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    if (hamburger && navMenu) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('show');
      if (navOverlay) {
        navOverlay.classList.remove('show');
        navOverlay.style.display = 'none';
      }
      document.body.style.overflow = '';
    }
  });
}

function showPage(pageId) {
  // If no pageId is provided or page doesn't exist, default to home
  if (!pageId || !document.getElementById(pageId)) {
    pageId = 'home';
  }
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
    // Hard enforce hidden state to avoid lingering visibility
    page.style.display = 'none';
    page.style.opacity = '';
    page.style.visibility = '';
  });
  
  // Show the active page
  const activePage = document.getElementById(pageId);
  if (activePage) {
    activePage.classList.add('active');
    // Hard enforce visible state
    activePage.style.display = 'block';
    
    // Update active state in navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageId) {
        link.classList.add('active');
      }
    });
    
    // Update URL
    window.history.pushState({ pageId }, '', `#${pageId}`);
    
    // Scroll to top
    window.scrollTo(0, 0);
    // Recompute footer spacing when page changes
    updateFooterOffset();
  }
}

// Binary rain animation
function startMatrix() {
  const canvas = document.getElementById('binary-rain');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const binary = ['0', '1'];
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  ctx.font = fontSize + 'px monospace';

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#39ff14';
    for (let i = 0; i < drops.length; i++) {
      const text = binary[Math.floor(Math.random() * binary.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 40);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Terminal functionality
function initTerminal() {
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  
  if (!terminalOutput || !terminalInput) return;

  const commands = {
    help: `Available commands:
- whoami      : Display information about me
- education   : View my education background
- experience  : View my work experience
- projects    : View my projects
- contact     : View contact information
- cv          : Download my CV as PDF
- clear       : Clear the terminal
- certifications : View my certifications
- social      : View my social media links`,
    whoami: 'I\'m Bikash Sarraf, a Cybersecurity & Ethical Hacking Enthusiast from Kathmandu, Nepal. I\'m currently studying at Softwarica College of IT and E-Commerce.',
    education: '🎓 Education:\n- BSc (Hons) in Cybersecurity and Ethical Hacking\n  Softwarica College of IT and E-Commerce, Kathmandu\n  Currently pursuing\n\n- +2 Science (Biology)\n  Xavier International College, Kalopul, Kathmandu\n  Graduated: 2024 | GPA: 3.08\n\n- SEE\n  Shree Sharaswasti English Boarding School, Lipanimal-3, Bara\n  Graduated: 2022 | GPA: 3.10',
    experience: '💼 Experience:\nCurrently seeking opportunities to apply my cybersecurity and ethical hacking skills in a professional environment.',
    projects: '🚀 Projects:\n1. Keylogger (Python)\n   - Created a keylogger using Python\n   - GitHub: github.com/Spydomain/keylogger\n\n2. Bike Rental Nepal (Node.js + React.js)\n   - Full-stack bike rental platform\n   - Frontend: github.com/Spydomain/front\n   - Backend: github.com/Spydomain/backend\n\n3. CVE-2023-22809 Automated Exploits (Python)\n   - Collection of automated exploits\n   - GitHub: github.com/Spydomain/CVE-2023-22809-automated-python-exploits\n\n4. ClipboardAI (Bash)\n   - AI-powered clipboard manager\n   - GitHub: github.com/Spydomain/ClipboardAI\n\n5. NotesVista (Node.js+React.js)\n   - Note-taking application\n   - Live: notesvista.netlify.app\n\n6. FGE Identification Test Platform (Flutter)\n   - French Army Vechicles/Weapons Indetification application\n   - Live: https://army-testgit-45113358-666ec.web.app\n',
    contact: '📧 Contact Information:\n- Email: bikashsarraf83@gmail.com\n- Location: Kathmandu, Nepal\n- LinkedIn: linkedin.com/in/bikash-sarraf-683787320\n- GitHub: github.com/Spydomain\n\nFeel free to reach out for collaborations or just to say hi!',
    social: '🌐 Social Media:\n- GitHub: github.com/Spydomain\n- LinkedIn: linkedin.com/in/bikash-sarraf-683787320\n- Instagram: instagram.com/bikash.sarraf.399\n- Facebook: facebook.com/bikash.sarraf.399\n- TryHackMe: tryhackme.com/p/bikashsarraf',
    certifications: '🎓 Certifications:\n- Cisco Certified Ethical Hacker\n- Tryhackme Pre-Security Certified\n- Tryhackme Cyber Security 101 Certified\n- Advent of cyber 2022 Certified\n- Advent of cyber 2023 Certified\n- Advent of cyber 2024 Certified\n- Certified Cybersecurity Educator Professional (CCEP)\n- Google Cybersecurity Professional Certificate\n- CompTIA PenTest+ (PT0-002)',
    cv: function() {
      generateAndOpenResumePDF();
      return 'Opening CV in a new tab and starting download...';
    },
    clear: function() { 
      terminalOutput.innerHTML = ''; 
      return ''; 
    }
  };

  function printOutputInstant(text, className = '') {
    const output = document.createElement('div');
    output.className = className || 'command-output';
    output.textContent = text;
    terminalOutput.appendChild(output);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return Promise.resolve();
  }

  let typingQueue = Promise.resolve();

  function typeOutput(text, className = '') {
    return new Promise(resolve => {
      const output = document.createElement('div');
      output.className = className || 'command-output';
      terminalOutput.appendChild(output);
      
      let i = 0;
      const speed = 5; // Typing speed (lower is faster)
      
      function type() {
        if (i < text.length) {
          output.textContent += text.charAt(i);
          i++;
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

  function processCommand(command) {
    // This function is no longer needed as we've moved its logic to the keydown handler
    // Keeping it for backward compatibility with any other code that might call it
    if (command.trim() === '') return;
    
    const normalizedCmd = command.trim().toLowerCase();
    
    if (commands[normalizedCmd] !== undefined) {
      if (typeof commands[normalizedCmd] === 'function') {
        return commands[normalizedCmd]();
      }
      return commands[normalizedCmd];
    }
    return `Command not found: ${command}\nType 'help' to see available commands`;
  }

  function preloadTerminalMessage() {
    const welcomeMsg = `Welcome to Bikash's Portfolio Terminal
Type 'help' to see available commands\n\n`;
    enqueueType(welcomeMsg, 'welcome-message');
  }

  // Handle command input
  terminalInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = terminalInput.value.trim();
      
      // Only process if command is not empty
      if (command) {
        // Create command display
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line';
        commandLine.innerHTML = `<span class="prompt">root@bikash#</span> ${command}`;
        terminalOutput.appendChild(commandLine);
        
        // Process command
        const normalizedCmd = command.toLowerCase();
        
        if (commands[normalizedCmd] !== undefined) {
          if (typeof commands[normalizedCmd] === 'function') {
            const result = commands[normalizedCmd]();
            if (result) {
              enqueueType(result);
            }
          } else {
            enqueueType(commands[normalizedCmd]);
          }
        } else {
          enqueueType(`Command not found: ${command}\nType 'help' to see available commands`, 'error-message');
        }
      }
      
      // Clear input and focus
      terminalInput.value = '';
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  });

  // Auto-focus terminal input when clicking anywhere in the terminal
  terminalOutput.addEventListener('click', () => {
    terminalInput.focus();
  });

  // Initial message and prompt
  preloadTerminalMessage();
  
  // Add initial prompt
  const initialPrompt = document.createElement('div');
  initialPrompt.className = 'command-line';
  initialPrompt.innerHTML = '<span class="prompt">root@bikash#</span> ';
  terminalOutput.appendChild(initialPrompt);
  
  // Focus the input on page load
  setTimeout(() => {
    terminalInput.focus();
  }, 500);
}
