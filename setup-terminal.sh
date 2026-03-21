#!/bin/bash
# ═══════════════════════════════════════════════════════
#  Spydomain Portfolio Terminal Setup
#  Auto-configures Google Debian Cloud Shell
#  Creates a REAL Linux user "Spydomain" and injects data
#  NOTE: Google Cloud Shell has passwordless sudo
# ═══════════════════════════════════════════════════════

# Colors
G='\033[0;32m'; C='\033[0;36m'; Y='\033[1;33m'; R='\033[0;31m'; B='\033[1m'; N='\033[0m'

clear
echo -e "${G}${B}"
echo "  ╔═══════════════════════════════════════════════════════╗"
echo "  ║     🔒 Spydomain Terminal — Setting Up Environment    ║"
echo "  ╚═══════════════════════════════════════════════════════╝"
echo -e "${N}"

# Auto-prime the sudo cache since the Cloud Shell user has an empty password.
# This prevents invisible prompts from hanging the script.
echo "" | sudo -S -v 2>/dev/null

# ── Create Real Spydomain Linux User ──
echo -e "${C}[1/4]${N} Creating isolated Debian Linux user 'Spydomain'..."
if id "Spydomain" &>/dev/null; then
    echo -e "  ${Y}→${N} User Spydomain already exists. Refreshing profile..."
else
    sudo useradd -m -s /bin/bash Spydomain 2>/dev/null
    echo -e "  ${G}→${N} User Spydomain created successfully."
fi

# ALWAYS ensure correct home directory exists and has ownership 
# (Google Cloud Shell wipes /home/Spydomain on VM restart)
sudo mkdir -p /home/Spydomain
sudo chown -R Spydomain:Spydomain /home/Spydomain

echo -e "${C}[2/4]${N} Generating portfolio data..."

# ── Execute File Generation AS the Spydomain user ──
sudo -u Spydomain bash << 'SPYSETUP'
SPYDIR="/home/Spydomain"
cd "$SPYDIR"
mkdir -p projects certs tools docs .config

# 1. PORTFOLIO FILES
cat > about.txt << 'EOF'
👤 About Me
══════════════════════════════════════════════

I am Bikash Sarraf, a passionate cybersecurity student based
in Kathmandu, Nepal 🇳🇵. My journey in technology started
with a deep curiosity about how systems work under the hood.

I love participating in CTF challenges, discovering new
security vulnerabilities, and contributing to open-source
security tools. My ultimate goal is to become a highly
skilled cybersecurity professional and ethical hacker.

"The quieter you become, the more you can hear."
EOF

cat > whoami.txt << 'EOF'
╔══════════════════════════════════════════════════════════╗
║  Name:      Bikash Sarraf                                ║
║  Alias:     Spydomain                                    ║
║  Role:      Cybersecurity & Ethical Hacking Enthusiast    ║
║  Location:  Kathmandu, Nepal 🇳🇵                          ║
║  College:   Softwarica College of IT & E-Commerce        ║
║  Email:     bikashsarraf83@gmail.com                     ║
║  Website:   www.bikashkumarsarraf.com.np                 ║
║  GitHub:    github.com/Spydomain                         ║
╚══════════════════════════════════════════════════════════╝
EOF

cat > skills.txt << 'EOF'
💻 Technical Skills
══════════════════════════════════════════════

Programming & Frameworks:
  HTML/CSS        ████████████████░░░░ 75%
  Python          ██████████████░░░░░░ 70%
  JavaScript      █████████████░░░░░░░ 65%
  Bash Scripting  █████████████░░░░░░░ 65%
  React.js        ███████████░░░░░░░░░ 55%
  C               ██████████░░░░░░░░░░ 50%
  MySQL/PHP       █████████░░░░░░░░░░░ 45%

Security & Hacking:
  OSINT           ██████████████░░░░░░ 70%
  Web AppSec      █████████████░░░░░░░ 65%
  PenTesting      ████████████░░░░░░░░ 60%
  Network Sec     ███████████░░░░░░░░░ 55%
  Session Hijack  ██████████░░░░░░░░░░ 50%
  Bug Bounty      █████████░░░░░░░░░░░ 45%

Tools: Nmap, Burp Suite, Wireshark, Metasploit, Docker, Git
EOF

cat > education.txt << 'EOF'
🎓 Education
══════════════════════════════════════════════

[2024 — Present]
  BSc (Hons) Cybersecurity & Ethical Hacking
  Softwarica College of IT & E-Commerce, Kathmandu

[2022 — 2024]
  +2 Science (Biology) | GPA: 3.08
  Xavier International College, Kalopul, Kathmandu

[2022]
  SEE | GPA: 3.10
  Shree Sharaswasti English Boarding School, Bara
EOF

cat > certs/certifications.txt << 'EOF'
🏅 Certifications
══════════════════════════════════════════════

✅ Cisco Certified Ethical Hacker
✅ TryHackMe Pre-Security
✅ TryHackMe Cyber Security 101
✅ TryHackMe Advent of Cyber 2022
✅ TryHackMe Advent of Cyber 2023
✅ TryHackMe Advent of Cyber 2024
✅ Certified Cybersecurity Educator Professional (CCEP)
✅ Google Cybersecurity Professional Certificate
✅ CompTIA PenTest+ (PT0-002)
✅ Certified API Security Analyst
EOF

cat > contact.txt << 'EOF'
📧 Contact
══════════════════════════════════════════════

Email:      bikashsarraf83@gmail.com
Website:    www.bikashkumarsarraf.com.np
GitHub:     github.com/Spydomain
LinkedIn:   linkedin.com/in/bikash-sarraf-683787320
Instagram:  instagram.com/bikash.sarraf.399
TryHackMe:  tryhackme.com/p/bikashsarraf
HackTheBox: app.hackthebox.com/users/2178446
Medium:     medium.com/@spydomain1
EOF

cat > .secret << 'EOF'
🔐 You found the secret file!
"The quieter you become, the more you can hear."
  — Ram Dass (adapted for hackers)
Keep learning, keep hacking (ethically)! 🛡️
EOF

# 3. CREATE BASHRC FOR SPYDOMAIN
cat > .bash_profile << 'BPROF'
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi
BPROF

cat > .bashrc << 'BASHRC'
# ═══ Spydomain Terminal Config ═══
unset PROMPT_COMMAND
export PS1='\[\033[01;32m\]Spydomain@cloudshell\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '


# Custom Commands
ll() { ls -la --color=auto "$@"; }
la() { ls -A --color=auto "$@"; }
l() { ls -CF --color=auto "$@"; }
cls() { clear; }
myabout() { cat ~/about.txt; }
myinfo() { cat ~/whoami.txt; }
myskills() { cat ~/skills.txt; }
myedu() { cat ~/education.txt; }
myprojects() { ls -l ~/projects/; }
mycerts() { cat ~/certs/certifications.txt; }
mycontact() { cat ~/contact.txt; }

neofetch_spy() {
    echo ""
    echo -e "\033[0;32m       ▄▄▄▄▄▄▄▄▄▄▄       \033[1;37mSpydomain@cloudshell"
    echo -e "\033[0;32m   ▄▀░░░░░░░░░░░░░▀▄     \033[0;32m─────────────────"
    echo -e "\033[0;32m  █░░░░░░░░░░░░░░░░░█    \033[1;37mOS:\033[0m Debian GNU/Linux (Google Cloud Shell)"
    echo -e "\033[0;32m █░░░░░░░░░░░░░░░░░░░█   \033[1;37mUser:\033[0m Spydomain"
    echo -e "\033[0;32m █░░▄▀▀▀▀▀▀▀▀▄░░░░░░░█   \033[1;37mKernel:\033[0m $(uname -r)"
    echo -e "\033[0;32m █░█  🔒  🛡️  █░░░░░░█   \033[1;37mUptime:\033[0m $(uptime -p 2>/dev/null || echo 'N/A')"
    echo -e "\033[0;32m █░█         █░░░░░░░█   \033[1;37mShell:\033[0m $SHELL"
    echo -e "\033[0;32m █░░▀▄▄▄▄▄▄▄▀░░░░░░░░█   \033[1;37mPython:\033[0m $(python3 --version 2>&1 | cut -d' ' -f2)"
    echo -e "\033[0;32m  █░░░░░░░░░░░░░░░░░█    \033[1;37mNode:\033[0m $(node --version 2>/dev/null || echo 'N/A')"
    echo -e "\033[0;32m   ▀▄░░░░░░░░░░░░░▀▄     \033[1;37mDocker:\033[0m $(docker --version 2>/dev/null | cut -d' ' -f3 | tr -d ',' || echo 'N/A')"
    echo -e "\033[0;32m     ▀▀▀▀▀▀▀▀▀▀▀▀▀       \033[1;37mGit:\033[0m $(git --version 2>/dev/null | cut -d' ' -f3)"
    echo -e "\033[0;32m                          \033[1;37mProjects:\033[0m $(ls ~/projects/ 2>/dev/null | wc -l) repos cloned"
    echo -e "\033[0m"
}
alias neofetch='neofetch_spy'

help_spy() {
    echo -e "\033[1;32m"
    echo "╔═══════════════════════════════════════════════════════╗"
    echo "║         Spydomain Terminal — Quick Reference          ║"
    echo "╠═══════════════════════════════════════════════════════╣"
    echo "║  myabout     → Read about Bikash's journey            ║"
    echo "║  myinfo      → Quick ID & Profile info                ║"
    echo "║  myskills    → Technical skills overview              ║"
    echo "║  myedu       → Education background                  ║"
    echo "║  myprojects  → List all cloned GitHub projects        ║"
    echo "║  mycerts     → 10 cybersecurity certifications        ║"
    echo "║  mycontact   → Contact info & social links            ║"
    echo "║  neofetch    → System info display                    ║"
    echo "║  help_spy    → This help message                      ║"
    echo "║                                                       ║"
    echo "║  📂 Browse projects: cd ~/projects/<name>             ║"
    echo "║  🔧 Tools available: python3, node, docker, nmap, git ║"
    echo "╚═══════════════════════════════════════════════════════╝"
    echo -e "\033[0m"
}

cd /home/Spydomain

# Auto-display about me on login
clear
neofetch_spy
echo ""
myabout
echo ""
help_spy
BASHRC
SPYSETUP

echo -e "${C}[3/4]${N} User environment populated successfully."

echo ""
echo -e "${G}${B}  ╔═══════════════════════════════════════════════════════╗"
echo -e "  ║             ✅ Debian Setup Complete!                   ║"
echo -e "  ╠═══════════════════════════════════════════════════════╣"
echo -e "  ║  Real User: Spydomain                                 ║"
echo -e "  ║  Home Dir:  /home/Spydomain                           ║"
echo -e "  ║                                                       ║"
echo -e "  ║  Type 'help_spy' for available commands                ║"
echo -e "  ╚═══════════════════════════════════════════════════════╝${N}"
echo ""
echo -e "${C}[4/4]${N} Dropping you into the Spydomain shell..."

# 4. LAUNCH AS SPYDOMAIN
# Switch user permanently — force bash to explicitly load our .bashrc, bypassing global Google Cloud Shell prompt overrides
exec sudo -u Spydomain bash --rcfile /home/Spydomain/.bashrc -i
