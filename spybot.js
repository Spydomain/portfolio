/* ═══════════════════════════════════════════════════════════
   SpyBot AI — Static Portfolio AI Agent
   No backend, no API keys — runs entirely in the browser
   ═══════════════════════════════════════════════════════════ */

const PORTFOLIO_DATA = {
  name: "Bikash Sarraf",
  alias: "Spydomain",
  location: "Kathmandu, Nepal",
  email: "bikashsarraf83@gmail.com",
  website: "www.bikashkumarsarraf.com.np",
  college: "Softwarica College of IT and E-Commerce, Gyaneshwor, Kathmandu",
  degree: "BSc (Hons) Cybersecurity & Ethical Hacking",
  tagline: "Cybersecurity & Ethical Hacking Enthusiast",
  about: "A passionate cybersecurity student with a strong interest in ethical hacking and web security. His journey in technology started with a curiosity about how things work. He enjoys participating in CTF challenges, learning about new security vulnerabilities, and contributing to open-source security tools. His goal is to become a skilled cybersecurity professional.",

  education: [
    { title: "BSc (Hons) Cybersecurity & Ethical Hacking", school: "Softwarica College of IT & E-Commerce, Kathmandu", year: "2024 — Present", gpa: "" },
    { title: "+2 Science (Biology)", school: "Xavier International College, Kalopul, Kathmandu", year: "2022 — 2024", gpa: "3.08" },
    { title: "SEE", school: "Shree Sharaswasti English Boarding School, Bara", year: "2022", gpa: "3.10" }
  ],

  skills: {
    languages: [
      { name: "HTML/CSS", level: 75 },
      { name: "Python", level: 70 },
      { name: "JavaScript/Node.js", level: 65 },
      { name: "React.js", level: 55 },
      { name: "C", level: 50 },
      { name: "Bash Scripting", level: 65 },
      { name: "MySQL/PHP", level: 45 }
    ],
    security: [
      { name: "OSINT", level: 70 },
      { name: "Penetration Testing", level: 60 },
      { name: "Web Application Security", level: 65 },
      { name: "Network Security", level: 55 },
      { name: "Bug Bounty", level: 45 },
      { name: "Session Hijacking", level: 50 }
    ]
  },

  projects: [
    { name: "Keylogger", tech: "Python", desc: "A Python-based keylogger for educational purposes", link: "github.com/Spydomain/keylogger" },
    { name: "Bike Rental Nepal", tech: "Node.js + React", desc: "Full-stack bike rental platform", link: "github.com/Spydomain/front" },
    { name: "CVE-2023-22809 Exploits", tech: "Python", desc: "Automated exploits for CVE-2023-22809 vulnerability", link: "github.com/Spydomain/CVE-2023-22809-automated-python-exploits" },
    { name: "ClipboardAI", tech: "Bash", desc: "Sends copied text to LLAMA and pops up instant offline answers", link: "github.com/Spydomain/ClipboardAI" },
    { name: "NotesVista", tech: "MERN Stack", desc: "Modern note-taking application", link: "notesvista.netlify.app" },
    { name: "NebullaComms", tech: "MERN Stack", desc: "Modern communication application", link: "nebullacomms.netlify.app" },
    { name: "FGE Identification Test Platform", tech: "Flutter", desc: "Test-taking app for French Army", link: "army-testgit-45113358-666ec.web.app" }
  ],

  certifications: [
    "Cisco Certified Ethical Hacker",
    "TryHackMe Pre-Security",
    "TryHackMe Cyber Security 101",
    "TryHackMe Advent of Cyber 2022",
    "TryHackMe Advent of Cyber 2023",
    "TryHackMe Advent of Cyber 2024",
    "Certified Cybersecurity Educator Professional (CCEP)",
    "Google Cybersecurity Professional Certificate",
    "CompTIA PenTest+ (PT0-002)",
    "Certified API Security Analyst"
  ],

  social: {
    github: "github.com/Spydomain",
    linkedin: "linkedin.com/in/bikash-sarraf-683787320",
    instagram: "instagram.com/bikash.sarraf.399",
    tryhackme: "tryhackme.com/p/bikashsarraf",
    hackthebox: "app.hackthebox.com/users/2178446",
    medium: "medium.com/@spydomain1"
  },

  interests: ["CTF challenges", "security vulnerabilities", "open-source security tools", "ethical hacking", "web security", "penetration testing", "bug bounty"],

  funFacts: [
    "Bikash has completed 5 TryHackMe learning paths!",
    "His alias 'Spydomain' reflects his passion for OSINT and digital reconnaissance.",
    "He's built 7 projects spanning Python, Node.js, React, Flutter, and Bash!",
    "He holds 10 cybersecurity certifications — and counting!",
    "He's active on both TryHackMe and HackTheBox platforms.",
    "His ClipboardAI project works completely offline using LLAMA!",
    "He built a CVE exploit tool (CVE-2023-22809) for educational purposes.",
    "He created an app for the French Army — the FGE Identification Test Platform!",
    "He started his cybersecurity journey out of pure curiosity.",
    "He's studying at Softwarica College, one of Nepal's top IT colleges."
  ]
};

/* ── Intent Detection ── */
const INTENTS = [
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'sup', 'greetings', 'howdy', 'yo', 'namaste', 'hola'],
    responses: () => [
      `Hey there! 👋 I'm **SpyBot**, Bikash's AI assistant. I know everything about him! Ask me about his **skills**, **projects**, **certifications**, or anything else.`,
      `Hello! 🔒 Welcome to Spydomain's portfolio. I'm his AI agent — ask me anything about Bikash Sarraf!`,
      `Namaste! 🙏 I'm SpyBot. Want to know about Bikash's **hacking skills**, **projects**, or **certifications**? Just ask!`
    ]
  },
  {
    id: 'who',
    keywords: ['who', 'about', 'tell me about', 'introduce', 'yourself', 'bikash', 'spydomain', 'whoami', 'who is', 'who are'],
    responses: () => [
      `**${PORTFOLIO_DATA.name}** (aka **${PORTFOLIO_DATA.alias}**) is a ${PORTFOLIO_DATA.tagline} from ${PORTFOLIO_DATA.location}. 🛡️\n\n${PORTFOLIO_DATA.about}\n\n📍 Based in **${PORTFOLIO_DATA.location}**\n🎓 Studying at **${PORTFOLIO_DATA.college}**`
    ]
  },
  {
    id: 'education',
    keywords: ['education', 'study', 'college', 'university', 'school', 'degree', 'gpa', 'academic', 'qualification', 'learn', 'student'],
    responses: () => {
      const eduList = PORTFOLIO_DATA.education.map(e =>
        `📚 **${e.title}**${e.gpa ? ` (GPA: ${e.gpa})` : ''}\n   ${e.school} — ${e.year}`
      ).join('\n\n');
      return [`Here's Bikash's education background:\n\n${eduList}`];
    }
  },
  {
    id: 'skills',
    keywords: ['skill', 'language', 'technology', 'tech', 'programming', 'code', 'python', 'javascript', 'react', 'node', 'bash', 'html', 'css', 'php', 'mysql', 'c lang'],
    responses: () => {
      const langs = PORTFOLIO_DATA.skills.languages.map(s => `  ${s.name}: **${s.level}%**`).join('\n');
      const sec = PORTFOLIO_DATA.skills.security.map(s => `  ${s.name}: **${s.level}%**`).join('\n');
      return [`💻 **Programming & Languages:**\n${langs}\n\n🔐 **Security Skills:**\n${sec}\n\nHis strongest language is **HTML/CSS (75%)** and in security, **OSINT (70%)** leads!`];
    }
  },
  {
    id: 'hacking',
    keywords: ['hack', 'security', 'pentest', 'penetration', 'osint', 'bug bounty', 'ctf', 'exploit', 'vulnerability', 'offensive', 'defensive', 'cyber', 'infosec', 'session hijack'],
    responses: () => {
      const sec = PORTFOLIO_DATA.skills.security.map(s => `  🎯 ${s.name}: **${s.level}%**`).join('\n');
      return [`Bikash's cybersecurity skills are impressive! 🔒\n\n${sec}\n\nHe actively practices on **TryHackMe** and **HackTheBox**, participates in **CTF challenges**, and has built real-world exploit tools like his **CVE-2023-22809** automated exploits.`];
    }
  },
  {
    id: 'projects',
    keywords: ['project', 'work', 'portfolio', 'built', 'created', 'developed', 'app', 'application', 'tool', 'github'],
    responses: () => {
      const projList = PORTFOLIO_DATA.projects.map((p, i) =>
        `**${i+1}. ${p.name}** (${p.tech})\n   ${p.desc}\n   🔗 ${p.link}`
      ).join('\n\n');
      return [`Bikash has built **${PORTFOLIO_DATA.projects.length} amazing projects**: 🚀\n\n${projList}`];
    }
  },
  {
    id: 'specific_project',
    keywords: ['keylogger', 'bike rental', 'cve', 'clipboardai', 'clipboard', 'notesvista', 'notes', 'nebulla', 'comms', 'fge', 'army'],
    responses: (input) => {
      const lower = input.toLowerCase();
      let project = null;
      if (lower.includes('keylog')) project = PORTFOLIO_DATA.projects[0];
      else if (lower.includes('bike') || lower.includes('rental')) project = PORTFOLIO_DATA.projects[1];
      else if (lower.includes('cve') || lower.includes('exploit')) project = PORTFOLIO_DATA.projects[2];
      else if (lower.includes('clipboard') || lower.includes('llama')) project = PORTFOLIO_DATA.projects[3];
      else if (lower.includes('notes') || lower.includes('vista')) project = PORTFOLIO_DATA.projects[4];
      else if (lower.includes('nebulla') || lower.includes('comms')) project = PORTFOLIO_DATA.projects[5];
      else if (lower.includes('fge') || lower.includes('army') || lower.includes('flutter')) project = PORTFOLIO_DATA.projects[6];
      if (project) {
        return [`**${project.name}** 🛠️\n\n📋 **Tech:** ${project.tech}\n📝 **Description:** ${project.desc}\n🔗 **Link:** ${project.link}`];
      }
      return null;
    }
  },
  {
    id: 'certifications',
    keywords: ['cert', 'certification', 'certified', 'badge', 'tryhackme', 'cisco', 'google', 'comptia', 'ccep', 'api security'],
    responses: () => {
      const certList = PORTFOLIO_DATA.certifications.map(c => `  ✅ ${c}`).join('\n');
      return [`Bikash holds **${PORTFOLIO_DATA.certifications.length} certifications**: 🏅\n\n${certList}\n\nThat's an impressive collection for a current student!`];
    }
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'hire', 'connect', 'message', 'talk', 'mail'],
    responses: () => [
      `Here's how to reach Bikash: 📬\n\n📧 **Email:** ${PORTFOLIO_DATA.email}\n🌐 **Website:** ${PORTFOLIO_DATA.website}\n💼 **LinkedIn:** ${PORTFOLIO_DATA.social.linkedin}\n🐙 **GitHub:** ${PORTFOLIO_DATA.social.github}\n\nOr use the **Contact** page to send a direct message!`
    ]
  },
  {
    id: 'social',
    keywords: ['social', 'instagram', 'linkedin', 'github', 'medium', 'hackthebox', 'htb', 'thm', 'follow'],
    responses: () => {
      const links = Object.entries(PORTFOLIO_DATA.social).map(([k, v]) =>
        `  ${k === 'github' ? '🐙' : k === 'linkedin' ? '💼' : k === 'instagram' ? '📸' : k === 'tryhackme' ? '🔒' : k === 'hackthebox' ? '📦' : '✍️'} **${k}:** ${v}`
      ).join('\n');
      return [`Bikash's social profiles: 🌐\n\n${links}`];
    }
  },
  {
    id: 'location',
    keywords: ['where', 'location', 'country', 'city', 'live', 'based', 'from', 'nepal', 'kathmandu'],
    responses: () => [
      `Bikash is based in **${PORTFOLIO_DATA.location}** 📍🇳🇵\n\nHe studies at **${PORTFOLIO_DATA.college}** in the Gyaneshwor area of Kathmandu.`
    ]
  },
  {
    id: 'experience',
    keywords: ['experience', 'work', 'job', 'intern', 'career', 'employ'],
    responses: () => [
      `Bikash is currently a **student** focusing on building his skills and portfolio. 🎓\n\nWhile he doesn't have formal work experience yet, he has:\n- 🚀 Built **7 real-world projects**\n- 🏅 Earned **10 certifications**\n- 🔒 Active on **TryHackMe** & **HackTheBox**\n- 🛠️ Created actual **CVE exploit tools**\n\nHe's actively seeking cybersecurity opportunities!`
    ]
  },
  {
    id: 'fun_fact',
    keywords: ['fun', 'fact', 'interesting', 'random', 'cool', 'trivia', 'surprise', 'tell me something', 'did you know'],
    responses: () => {
      const fact = PORTFOLIO_DATA.funFacts[Math.floor(Math.random() * PORTFOLIO_DATA.funFacts.length)];
      return [`🎲 **Fun Fact:** ${fact}`];
    }
  },
  {
    id: 'capabilities',
    keywords: ['what can you', 'help', 'what do you', 'how to', 'guide', 'assist', 'options', 'menu'],
    responses: () => [
      `I'm **SpyBot** 🤖 — Bikash's AI assistant! Here's what I can tell you:\n\n👤 **About Bikash** — Who he is\n🎓 **Education** — Academic background\n💻 **Skills** — Programming & security\n🚀 **Projects** — What he's built\n🏅 **Certifications** — His credentials\n📬 **Contact** — How to reach him\n🌐 **Social** — Social media profiles\n🎲 **Fun facts** — Interesting tidbits\n\nJust ask in natural language!`
    ]
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'thx', 'appreciated', 'awesome', 'great', 'nice', 'cool', 'good'],
    responses: () => [
      `You're welcome! 😊 Feel free to ask anything else about Bikash!`,
      `Glad I could help! 🔒 Need anything else?`,
      `Anytime! Ask away if you have more questions about Spydomain! 🛡️`
    ]
  },
  {
    id: 'bye',
    keywords: ['bye', 'goodbye', 'see ya', 'later', 'cya', 'exit', 'quit'],
    responses: () => [
      `Goodbye! 👋 Thanks for visiting Bikash's portfolio. Stay safe in cyberspace! 🔒`,
      `See you later! 🛡️ Remember — hack the planet (ethically)! 😎`
    ]
  }
];

const FALLBACK_RESPONSES = [
  `Hmm, I'm not sure about that. Try asking about Bikash's **skills**, **projects**, **certifications**, or **education**! 🤔`,
  `I didn't quite catch that. I can tell you about Bikash's **work**, **skills**, **certs**, or **contact info**. What would you like to know?`,
  `I'm specifically trained on Bikash's portfolio. Ask me about his **projects**, **certifications**, **skills**, or **background**! 🔒`,
  `That's outside my knowledge! I know all about **Bikash Sarraf (Spydomain)** — his skills, projects, certs, and more. What would you like to explore?`
];

const SUGGESTED_QUESTIONS = [
  "Who is Bikash?",
  "What are his skills?",
  "Show me his projects",
  "What certifications does he have?",
  "Tell me a fun fact",
  "How can I contact him?",
  "What's his education?",
  "What hacking skills does he have?"
];

/* ── Matching Engine ── */
function detectIntent(input) {
  const lower = input.toLowerCase().trim();
  let bestMatch = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (lower.includes(kw)) {
        // Longer keyword matches are more specific
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }
  }

  if (bestMatch && bestScore > 0) {
    const responses = bestMatch.responses(input);
    if (responses && responses.length > 0) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

/* ── Simple Markdown-like formatting ── */
function formatResponse(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

/* ── UI Builder ── */
export function initSpyBot() {
  // Create chatbot UI
  const chatHTML = `
    <div class="spybot-fab" id="spybot-fab" title="Chat with SpyBot AI">
      <i class="fas fa-robot"></i>
      <span class="fab-pulse"></span>
    </div>
    <div class="spybot-panel" id="spybot-panel">
      <div class="spybot-header">
        <div class="spybot-header-left">
          <div class="spybot-avatar"><i class="fas fa-robot"></i></div>
          <div>
            <h4>SpyBot AI</h4>
            <span class="spybot-status"><span class="status-dot"></span> Online</span>
          </div>
        </div>
        <button class="spybot-close" id="spybot-close" aria-label="Close chat"><i class="fas fa-times"></i></button>
      </div>
      <div class="spybot-messages" id="spybot-messages"></div>
      <div class="spybot-suggestions" id="spybot-suggestions"></div>
      <div class="spybot-input-area">
        <input type="text" id="spybot-input" placeholder="Ask me about Bikash..." autocomplete="off" />
        <button id="spybot-send" aria-label="Send message"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.id = 'spybot-container';
  container.innerHTML = chatHTML;
  document.body.appendChild(container);

  // Elements
  const fab = document.getElementById('spybot-fab');
  const panel = document.getElementById('spybot-panel');
  const closeBtn = document.getElementById('spybot-close');
  const messages = document.getElementById('spybot-messages');
  const input = document.getElementById('spybot-input');
  const sendBtn = document.getElementById('spybot-send');
  const suggestions = document.getElementById('spybot-suggestions');

  let isOpen = false;
  let hasGreeted = false;

  function toggleChat() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    fab.classList.toggle('hidden', isOpen);
    if (isOpen && !hasGreeted) {
      hasGreeted = true;
      showGreeting();
    }
    if (isOpen) {
      setTimeout(() => input.focus(), 300);
    }
  }

  fab.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  function showGreeting() {
    addBotMessage(`Hey! 👋 I'm **SpyBot**, Bikash's AI assistant.\n\nI can tell you about his **skills**, **projects**, **certifications**, and more. Ask me anything!`);
    showSuggestions();
  }

  function showSuggestions() {
    const shuffled = SUGGESTED_QUESTIONS.sort(() => 0.5 - Math.random()).slice(0, 4);
    suggestions.innerHTML = shuffled.map(q =>
      `<button class="suggestion-chip">${q}</button>`
    ).join('');

    suggestions.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        input.value = chip.textContent;
        handleSend();
      });
    });
  }

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'spybot-msg user';
    msg.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
    messages.appendChild(msg);
    scrollToBottom();
  }

  function addBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'spybot-msg bot';
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    msg.appendChild(bubble);
    messages.appendChild(msg);

    // Typing animation
    bubble.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
    scrollToBottom();

    const delay = Math.min(400 + text.length * 3, 1500);
    setTimeout(() => {
      bubble.innerHTML = formatResponse(text);
      bubble.classList.add('revealed');
      scrollToBottom();
    }, delay);
  }

  function scrollToBottom() {
    setTimeout(() => {
      messages.scrollTop = messages.scrollHeight;
    }, 50);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = '';
    suggestions.innerHTML = '';

    const response = detectIntent(text);
    setTimeout(() => {
      addBotMessage(response);
      // Show new suggestions after response
      setTimeout(() => showSuggestions(), 1000);
    }, 200);
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn.addEventListener('click', handleSend);
}
