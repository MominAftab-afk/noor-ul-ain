'use strict';

/* ═══════════════════════════════════════════════════════════
   Noor-ul-Ain Shahzad — Portfolio JavaScript (Galekto Aesthetic)
   ═══════════════════════════════════════════════════════════ */

// ── LOADER / BOOT SEQUENCE ────────────────────────────────
function initLoader() {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loader-fill');
  const status = document.getElementById('loader-status');
  if (!loader || !fill || !status) return;

  const bootLogs = [
    'CONNECTING TO DATABASE STORAGE...',
    'initializing mongodb & mysql connections...',
    'mounting express.js API endpoints...',
    'loading dynamic react application layers...',
    'initializing antigravity agentic framework...',
    'NAS_CONSOLE CONNECTED. DEPLOYING...'
  ];

  let progress = 0;
  let logIndex = 0;

  document.body.style.overflow = 'hidden';

  const progressInterval = setInterval(() => {
    progress += Math.random() * 8;
    if (progress >= 100) {
      progress = 100;
      fill.style.width = '100%';
      status.textContent = bootLogs[bootLogs.length - 1];
      clearInterval(progressInterval);

      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        animateHeroEntrance();
      }, 500);
    } else {
      fill.style.width = progress + '%';

      // Rotate status logs based on loader progress
      const currentLog = Math.floor((progress / 100) * bootLogs.length);
      if (currentLog > logIndex && currentLog < bootLogs.length) {
        logIndex = currentLog;
        status.textContent = bootLogs[logIndex];
      }
    }
  }, 40);
}

// ── CUSTOM RETRO CROSSHAIR CURSOR ─────────────────────────
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }, { passive: true });

  // Smooth ring transition
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';

    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Add hover class to body for custom interactive states
  const interactives = document.querySelectorAll('a, button, input, textarea, .skill-card, .pf-dot, .pf-arrow');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ── HERO ENTRANCE STAGGER ────────────────────────────────
function animateHeroEntrance() {
  const h1 = document.getElementById('hero-h1');
  const tag = document.querySelector('.hero-eyebrow');
  const sub = document.querySelector('.hero-sub');
  const cta = document.querySelector('.hero-cta');

  // Stagger entrance transitions
  if (tag) {
    tag.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    tag.style.opacity = '1';
    tag.style.transform = 'translateY(0)';
  }

  if (h1) {
    const html = h1.innerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    let newHTML = '';

    doc.body.childNodes.forEach(node => {
      if (node.nodeType === 3) { // text node
        node.textContent.split(/(\s+)/).forEach(w => {
          if (w.trim()) {
            newHTML += `<span class="word-reveal" style="display: inline-block; overflow: hidden; vertical-align: top;"><span class="word-inner" style="display: inline-block; opacity: 0; transform: translateY(100%); transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;">${w}</span></span>`;
          } else if (w === ' ') {
            newHTML += ' ';
          }
        });
      } else if (node.nodeType === 1) { // element node (like <em class="accent">)
        const tagName = node.tagName.toLowerCase();
        const className = node.className ? ` class="${node.className}"` : '';
        newHTML += `<${tagName}${className}><span class="word-reveal" style="display: inline-block; overflow: hidden; vertical-align: top;"><span class="word-inner" style="display: inline-block; opacity: 0; transform: translateY(100%); transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;">${node.textContent}</span></span></${tagName}>`;
      }
    });
    h1.innerHTML = newHTML;

    const children = h1.querySelectorAll('.word-inner');
    children.forEach((span, index) => {
      setTimeout(() => {
        span.style.transform = 'translateY(0)';
        span.style.opacity = '1';
      }, 150 + index * 60);
    });
  }

  setTimeout(() => {
    if (sub) {
      sub.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      sub.style.opacity = '1';
      sub.style.transform = 'translateY(0)';
    }
  }, 600);

  setTimeout(() => {
    if (cta) {
      cta.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      cta.style.opacity = '1';
      cta.style.transform = 'translateY(0)';
    }
  }, 850);
}

// ── WORD-BY-WORD ABOUT SCROLL ─────────────────────────────
function initAboutScrollReveal() {
  const wordPara = document.getElementById('word-para');
  const aboutSection = document.getElementById('about');
  if (!wordPara || !aboutSection) return;

  const originalText = wordPara.textContent;
  const words = originalText.split(/\s+/).filter(Boolean);

  wordPara.innerHTML = words.map(w => `<span class="word-fade">${w}</span>`).join(' ');
  const spans = wordPara.querySelectorAll('.word-fade');

  function revealWords() {
    const rect = aboutSection.getBoundingClientRect();
    const winHeight = window.innerHeight;

    // Calculate progress (0 = section entering viewport, 1 = section middle)
    const progress = Math.max(0, Math.min(1, (-rect.top + winHeight * 0.4) / (rect.height * 0.8)));

    spans.forEach((span, i) => {
      const threshold = i / spans.length;
      if (threshold <= progress) {
        span.classList.add('lit');
      } else {
        span.classList.remove('lit');
      }
    });
  }

  window.addEventListener('scroll', revealWords, { passive: true });
  revealWords();
}

// ── PROJECT SLIDERS ─────────────────────────────────────────
function setupSlider(trackId, dotsId, prevId, nextId) {
  const track = document.getElementById(trackId);
  const dotsContainer = document.getElementById(dotsId);
  if (!track || !dotsContainer) return;
  const slides = track.querySelectorAll('.pf-slide');
  const btnPrev = document.getElementById(prevId);
  const btnNext = document.getElementById(nextId);

  if (slides.length === 0) return;

  let currentSlide = 0;
  const totalSlides = slides.length;

  // Create dot navigators
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'pf-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Navigate to slide ${i + 1}`);
    dot.addEventListener('click', () => {
      currentSlide = i;
      updateSlider();
    });
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.pf-dot');

  function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    });
  }

  // Auto scroll
  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }, 5000);
}

function initProjectSlider() {
  setupSlider('bs-track', 'bs-dots', 'bs-prev', 'bs-next');
  setupSlider('dsa-track', 'dsa-dots', 'dsa-prev', 'dsa-next');
}

// ── RADIAL SKILL GLOW EFFECT ──────────────────────────────
function initSkillGlow() {
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(212,175,55,0.06), var(--bg-panel) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
}

// ── GALEKTO SCRAMBLED DECRYPT EFFECT ──────────────────────
class TextScrambler {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end, char: '' });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span style="color: var(--gold); text-shadow: 0 0 4px var(--gold-glow);">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// ── SCROLL REVEALS ─────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // If it is a section title, trigger Galekto decrypt sequence!
        if (entry.target.tagName.toLowerCase() === 'h2') {
          const originalText = entry.target.innerText;
          const scrambler = new TextScrambler(entry.target);
          scrambler.setText(originalText);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

  elements.forEach((el, index) => {
    el.style.transitionDelay = `${(index % 4) * 80}ms`;
    observer.observe(el);
  });
}

// ── COUNTER UP STAGGER ─────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.meta-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.textContent);
        if (isNaN(targetValue)) return;

        let startValue = 0;
        const duration = 1500;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);

          el.textContent = Math.floor(progress * targetValue) + (el.textContent.includes('+') ? '+' : '');

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = targetValue + (el.textContent.includes('+') ? '+' : '');
          }
        }

        requestAnimationFrame(updateCount);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ── NAV SCROLL ACTIONS ─────────────────────────────────────
function initNavActions() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const logo = document.querySelector('.nav-logo');

  if (logo) {
    const logoScrambler = new TextScrambler(logo);
    logo.addEventListener('mouseenter', () => {
      logoScrambler.setText('NAS_PORTFOLIO');
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
      }
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(span => {
          span.style.transform = '';
          span.style.opacity = '1';
        });
      });
    });
  }
}

// ── AJAX CONTACT SUBMISSION & RETRO TERMINAL LOGS ─────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  const terminal = document.getElementById('contact-status-terminal');
  if (!form || !terminal) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const submitBtn = document.getElementById('submit-btn');

    // Display Terminal logs
    terminal.style.display = 'block';
    terminal.innerHTML = '';
    submitBtn.disabled = true;

    const logLines = [
      `> INITIATING SECURE ENVELOPE HANDSHAKE...`,
      `> ESTABLISHING RELATIONAL TUNNEL TO DATABASE...`,
      `> COMPILING PARAMS [name: ${name.slice(0, 15)}..., email: ${email}]`,
      `> SANITIZING FOR SQL INJECTION & XSS ATTACKS...`,
      `> SENDING TRANSACTION PAYLOAD TO /api/inquiry...`
    ];

    for (let i = 0; i < logLines.length; i++) {
      await appendLogLine(logLines[i], 300);
    }

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();

      if (data.success) {
        await appendLogLine(`> STATUS: TRANSACTION ACCEPTED (HTTP_200)`, 200);
        await appendLogLine(`> SQLITE_DB: ROW INSERTED (ID #${data.id}) [WAL_MODE_SYNC]`, 300);
        await appendLogLine(`> SUCCESS: CORES LOGGED SUCCESSFULLY!`, 200);

        terminal.style.borderColor = 'var(--green)';
        terminal.style.boxShadow = '0 0 10px rgba(74, 222, 128, 0.2)';
        submitBtn.querySelector('span').textContent = '[ INQUIRY COMPLETED ]';
        submitBtn.style.borderColor = 'var(--green)';
        submitBtn.style.color = 'var(--green)';
        form.reset();
      } else {
        throw new Error(data.error || 'Unknown server response');
      }
    } catch (err) {
      await appendLogLine(`> ERROR: DATA TRANSMISSION FAILED`, 200);
      await appendLogLine(`> EXCEPTION: ${err.message}`, 200);
      terminal.style.borderColor = '#ff5f56';
      submitBtn.disabled = false;
    }
  });

  function appendLogLine(text, delay) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.textContent = text;
        if (text.startsWith('> ERROR') || text.startsWith('> EXCEPTION')) {
          line.style.color = '#ff5f56';
        } else if (text.startsWith('> SUCCESS') || text.startsWith('> STATUS')) {
          line.style.color = 'var(--green)';
        } else {
          line.style.color = 'var(--text-muted)';
        }
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
        resolve();
      }, delay);
    });
  }
}



// ── DYNAMIC PROJECTS ──────────────────────────────────────────
async function loadDynamicProjects() {
  const container = document.getElementById('dynamic-projects-container');
  if (!container) return;

  try {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (!data.success) return;

    if (data.projects.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = '';
    let terminalCardsHTML = '';
    
    data.projects.forEach(proj => {
      if (proj.type === 'featured') {
        const techList = proj.tech_tags.map(t => `<li><strong>•</strong> ${t}</li>`).join('');
        container.innerHTML += `
          <div class="project-featured reveal">
            <div class="pf-screenshots">
              <div class="pf-track">
                <div class="pf-slide">
                  <img src="${proj.image_url || 'assets/projects/blackstone-hero.png'}" alt="${proj.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
              </div>
            </div>
            <div class="pf-info">
              <div class="pf-meta">
                <div class="pf-status">${proj.status}</div>
                <div class="pf-role">${proj.role}</div>
              </div>
              <h3>${proj.title}</h3>
              <p>${proj.description}</p>
              <ul class="pf-bullets">
                ${techList}
              </ul>
              ${proj.link ? `<a href="${proj.link}" target="_blank" class="pf-link">↗ View Live Production</a>` : ''}
            </div>
          </div>
        `;
      } else if (proj.type === 'terminal') {
        terminalCardsHTML += `
          <div class="t-card reveal">
            <div class="t-head">
              <div class="t-dots"><span class="dr"></span><span class="dy"></span><span class="dg"></span></div>
              <span class="t-label">${proj.title}</span>
            </div>
            <div class="t-body">
              <div><span class="tc">// ${proj.role}</span></div>
              <br />
              <div><span class="tc">${proj.description}</span></div>
              <br />
              <div><span class="tc">// ✓ ${proj.status}</span></div>
            </div>
          </div>
        `;
      } else if (proj.type === 'roadmap') {
        container.innerHTML += `
          <div class="roadmap-strip reveal">
            <div>
              <span class="rm-badge">⚡ ${proj.status}</span>
              <h3>${proj.title} <span class="gold-text">(${proj.role})</span></h3>
              <p>${proj.description}</p>
            </div>
            <div class="rm-icon">🗃</div>
          </div>
        `;
      }
    });

    if (terminalCardsHTML) {
      container.innerHTML += `<div class="terminal-row">${terminalCardsHTML}</div>`;
    }

    // Re-initialize scroll reveal for newly injected elements
    initScrollReveal();

  } catch (err) {
    console.error('Failed to load projects:', err);
  }
}

// ── INITIALIZATION ──
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNavActions();
  initAboutScrollReveal();
  initProjectSlider();
  initSkillGlow();
  initScrollReveal();
  initCounters();
  initContactForm();
  loadDynamicProjects();
});
