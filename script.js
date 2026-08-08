// =============================================
// KUMARA SWAMY R — Portfolio JS
// =============================================

/* ===== State ===== */
let currentPage = 0;
const totalPages = 6;
const pages = document.querySelectorAll('.page');
const navBtns = document.querySelectorAll('.nav-btn');
const dots = document.querySelectorAll('.dot');
const mobNavItems = document.querySelectorAll('.mob-nav-item');

/* ===== Page Navigation ===== */
function goToPage(index) {
  if (index < 0 || index >= totalPages) return;
  const W = window.innerWidth;

  pages.forEach((p, i) => {
    p.classList.remove('active-page', 'prev-page');
    if (i === index) {
      p.style.transform = 'translateX(0px)';
      p.style.opacity = '1';
      p.style.pointerEvents = 'auto';
      p.classList.add('active-page');
    } else if (i < index) {
      p.style.transform = `translateX(-${W}px)`;
      p.style.opacity = '0';
      p.style.pointerEvents = 'none';
      p.classList.add('prev-page');
    } else {
      p.style.transform = `translateX(${W}px)`;
      p.style.opacity = '0';
      p.style.pointerEvents = 'none';
    }
  });

  navBtns.forEach((b, i) => b.classList.toggle('active', i === index));
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  mobNavItems.forEach((b, i) => b.classList.toggle('active', i === index));

  if (index === 2) triggerSkillBars();
  if (index === 3) triggerProjects();
  if (index === 1) triggerCounters();

  currentPage = index;
  closeMobileNav();
}

/* Re-position pages on resize */
window.addEventListener('resize', () => goToPage(currentPage));

/* Initialise — position off-screen then show page 0 */
pages.forEach((p, i) => {
  p.style.transition = 'none';
  p.style.transform = `translateX(${i * window.innerWidth}px)`;
  p.style.opacity = i === 0 ? '1' : '0';
  p.style.pointerEvents = i === 0 ? 'auto' : 'none';
});
requestAnimationFrame(() => {
  pages.forEach(p => {
    p.style.transition = 'transform 0.55s cubic-bezier(.77,0,.18,1), opacity 0.55s';
  });
  goToPage(0);
});

/* Nav button clicks */
navBtns.forEach(btn => {
  btn.addEventListener('click', () => goToPage(parseInt(btn.dataset.page)));
});

/* Dot clicks */
dots.forEach(dot => {
  dot.addEventListener('click', () => goToPage(parseInt(dot.dataset.page)));
});

/* Mobile nav item clicks */
mobNavItems.forEach(btn => {
  btn.addEventListener('click', () => {
    goToPage(parseInt(btn.dataset.page));
  });
});

/* Keyboard arrow navigation */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeProfilePreview(); closeMobileNav(); return; }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage(currentPage + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goToPage(currentPage - 1);
});

/* Touch / swipe support */
let touchStartX = 0, touchStartY = 0, isSwiping = false;
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  isSwiping = false;
}, { passive: true });
document.addEventListener('touchmove', e => {
  const dx = Math.abs(e.touches[0].clientX - touchStartX);
  const dy = Math.abs(e.touches[0].clientY - touchStartY);
  if (dx > dy + 10) isSwiping = true;
}, { passive: true });
document.addEventListener('touchend', e => {
  if (!isSwiping) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) + 20) {
    if (dx < -50) goToPage(currentPage + 1);
    if (dx >  50) goToPage(currentPage - 1);
  }
  isSwiping = false;
}, { passive: true });


/* ===== Hamburger / Mobile Nav ===== */
const hamburger = document.getElementById('hamburger');
const mobNav = document.getElementById('mobNav');
const mobNavOverlay = document.getElementById('mobNavOverlay');

function openMobileNav() {
  mobNav.classList.add('open');
  mobNavOverlay.classList.add('show');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
}
function closeMobileNav() {
  mobNav.classList.remove('open');
  mobNavOverlay.classList.remove('show');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}
hamburger.addEventListener('click', () => {
  if (mobNav.classList.contains('open')) closeMobileNav();
  else openMobileNav();
});
mobNavOverlay.addEventListener('click', closeMobileNav);


/* ===== Skill Bars ===== */
let skillsTriggered = false;
function triggerSkillBars() {
  if (skillsTriggered) return;
  skillsTriggered = true;
  const cards = document.querySelectorAll('.skill-card');
  cards.forEach((card, i) => {
    card.classList.remove('card-visible');
    void card.offsetWidth;
    setTimeout(() => card.classList.add('card-visible'), i * 110);
  });
  document.querySelectorAll('.skill-bar').forEach(bar => {
    setTimeout(() => { bar.style.width = bar.dataset.level; }, 380);
  });
}


/* ===== Project Cards Animation ===== */
let projectsTriggered = false;
function triggerProjects() {
  if (projectsTriggered) return;
  projectsTriggered = true;
  document.querySelectorAll('.proj-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(38px) scale(0.95)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.6s cubic-bezier(.34,1.56,.64,1), transform 0.6s cubic-bezier(.34,1.56,.64,1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
    }, i * 130);
  });
}


/* ===== Animated Counters ===== */
let countersTriggered = false;
function triggerCounters() {
  if (countersTriggered) return;
  countersTriggered = true;
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 1400, 1);
      el.textContent = Math.floor(progress * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}


/* ===== GitHub Profile Page ===== */
let githubTriggered = false;
function triggerGithubPage() {
  if (githubTriggered) return;
  githubTriggered = true;

  /* Animate language bars */
  setTimeout(() => {
    document.querySelectorAll('.gh-lang-bar-fill').forEach(bar => {
      bar.style.width = bar.getAttribute('data-w') + '%';
    });
  }, 200);

  /* Animate repo cards */
  document.querySelectorAll('.gh-repo-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(.34,1.56,.64,1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 300 + i * 100);
  });

  /* Generate heatmap */
  generateHeatmap();
}

function generateHeatmap() {
  const grid = document.getElementById('gh-heatmap-grid');
  if (!grid || grid.children.length > 0) return;

  const weeks = 26;
  const days = 7;

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const cell = document.createElement('div');
      cell.className = 'gh-cell';

      /* Simulate realistic contribution data */
      const recency = w / weeks; // 0 = oldest, 1 = newest
      const rand = Math.random();
      const adjusted = rand + (recency * 0.25);

      let level = 0;
      if (adjusted > 0.42) level = 1;
      if (adjusted > 0.62) level = 2;
      if (adjusted > 0.78) level = 3;
      if (adjusted > 0.91) level = 4;

      /* Weekends slightly less active */
      if ((d === 0 || d === 6) && level > 0) {
        level = Math.max(0, level - 1);
      }

      /* Recent burst of activity */
      if (w >= weeks - 3 && Math.random() > 0.45) {
        level = Math.min(4, level + 1);
      }

      cell.setAttribute('data-level', level);
      const contribs = level === 0 ? 'No contributions' : `${level * 2} contribution${level * 2 !== 1 ? 's' : ''}`;
      cell.title = contribs;

      /* Staggered fade-in */
      cell.style.opacity = '0';
      cell.style.transform = 'scale(0.4)';
      const delay = (w * days + d) * 4;
      setTimeout(() => {
        cell.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(.34,1.56,.64,1)';
        cell.style.opacity = '1';
        cell.style.transform = 'scale(1)';
      }, delay + 400);

      grid.appendChild(cell);
    }
  }
}


/* ===== Typing Effect ===== */
const roles = ['Web Developer', 'Data Scientist', 'Python Engineer', 'Problem Solver'];
let roleIndex = 0, charIndex = 0, isTyping = true;
const typingEl = document.getElementById('typing-text');

function typeRole() {
  if (!typingEl) return;
  const cur = roles[roleIndex];
  if (isTyping) {
    typingEl.textContent = cur.slice(0, ++charIndex);
    if (charIndex === cur.length) { isTyping = false; setTimeout(typeRole, 1800); return; }
  } else {
    typingEl.textContent = cur.slice(0, --charIndex);
    if (charIndex === 0) { isTyping = true; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(typeRole, isTyping ? 80 : 40);
}
typeRole();


/* ===== Particle Canvas ===== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.3 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.32;
    this.vy = (Math.random() - 0.5) * 0.32;
    this.alpha = Math.random() * 0.4 + 0.1;
    const hues = [180, 200, 320, 45, 270, 0, 90];
    const h = hues[Math.floor(Math.random() * hues.length)];
    this.color = `hsla(${h},100%,65%,${this.alpha})`;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles(n = 90) { particles = Array.from({ length: n }, () => new Particle()); }
function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 95) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,245,255,${0.06 * (1 - d / 95)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animate);
}
initParticles();
animate();


/* ===== Ripple Effect ===== */
document.querySelectorAll('.btn-primary, .btn-outline, .arrow-btn, .nav-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;border-radius:50%;pointer-events:none;
      width:6px;height:6px;left:${x-3}px;top:${y-3}px;
      background:rgba(255,255,255,.45);
      transform:scale(0);opacity:1;
      animation:rippleAnim .55s ease-out forwards;
    `;
    if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleAnim{to{transform:scale(60);opacity:0}}`;
document.head.appendChild(rippleStyle);



/* ===== Profile Preview Modal ===== */
const PROFILES = {
  github: {
    name: 'Kumara Swamy R', handle: '@Kumar1201',
    tagline: '// Web Developer & Data Scientist',
    desc: 'Passionate builder of beautiful web experiences and data-driven solutions. Open source enthusiast.',
    url: 'https://github.com/Kumar1201', btnLabel: 'View GitHub Profile',
    stats: [{ val: '4+', lbl: 'Repositories' }, { val: 'Python', lbl: 'Top Language' }, { val: '2025', lbl: 'Since' }],
    tags: ['Python', 'JavaScript', 'Java', 'C', 'ML', 'Web Dev'],
    banner: 'linear-gradient(135deg,rgba(0,245,255,.14),rgba(57,255,20,.08))',
    ring: 'conic-gradient(from 0deg,#00f5ff,#8b5cf6,#39ff14,#00f5ff)',
    grad: 'linear-gradient(135deg,#00f5ff,#39ff14)',
    ctaBg: 'linear-gradient(135deg,#00f5ff,#8b5cf6)',
    ctaGlow: 'rgba(0,245,255,.45)',
    clr: '#00f5ff',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`
  },
  linkedin: {
    name: 'Kumara Swamy R', handle: 'kumara-swamy-r-3177b8312',
    tagline: '// Web Developer & Data Scientist',
    desc: 'Building elegant web solutions and uncovering data insights. Open to exciting opportunities & collaborations.',
    url: 'https://www.linkedin.com/in/kumara-swamy-r-3177b8312', btnLabel: 'View LinkedIn Profile',
    stats: [{ val: '500+', lbl: 'Connections' }, { val: 'India', lbl: 'Location' }, { val: 'Open', lbl: 'To Work' }],
    tags: ['Python', 'Data Science', 'Machine Learning', 'Web Dev', 'Java'],
    banner: 'linear-gradient(135deg,rgba(10,102,194,.18),rgba(0,119,181,.1))',
    ring: 'conic-gradient(from 0deg,#0a84ff,#0077b5,#38bdf8,#0a84ff)',
    grad: 'linear-gradient(135deg,#0a84ff,#38bdf8)',
    ctaBg: 'linear-gradient(135deg,#0a84ff,#0077b5)',
    ctaGlow: 'rgba(10,102,194,.5)',
    clr: '#0a84ff',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
  }
};

function showProfilePreview(type) {
  const p = PROFILES[type];
  if (!p) return;

  const modal = document.getElementById('profilePreviewModal');
  const overlay = document.getElementById('profilePreviewOverlay');
  const inner = document.getElementById('ppmInner');

  modal.style.setProperty('--ppm-banner', p.banner);
  modal.style.setProperty('--ppm-ring', p.ring);
  modal.style.setProperty('--ppm-grad', p.grad);
  modal.style.setProperty('--ppm-cta-bg', p.ctaBg);
  modal.style.setProperty('--ppm-cta-glow', p.ctaGlow);
  modal.style.setProperty('--ppm-clr', p.clr);

  const statsHTML = p.stats.map(s =>
    `<div class="ppm-stat"><div class="ppm-stat-val">${s.val}</div><div class="ppm-stat-lbl">${s.lbl}</div></div>`
  ).join('');
  const tagsHTML = p.tags.map(t => `<span class="ppm-tag">${t}</span>`).join('');

  inner.innerHTML = `
    <div class="ppm-banner"></div>
    <div class="ppm-avatar-wrap">
      <div class="ppm-avatar-ring"></div>
      <img src="me.jpg" alt="Kumara Swamy R" class="ppm-avatar" />
    </div>
    <div class="ppm-name">${p.name}</div>
    <div class="ppm-tagline">${p.tagline}</div>
    <div class="ppm-desc">${p.desc}</div>
    <div class="ppm-stats">${statsHTML}</div>
    <div class="ppm-tags">${tagsHTML}</div>
    <a href="${p.url}" target="_blank" rel="noopener" class="ppm-cta" id="ppm-cta-link">
      ${p.icon} ${p.btnLabel}
    </a>
  `;

  overlay.classList.add('ppo-active');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { modal.classList.add('ppm-active'); });
  });
  document.body.style.overflow = 'hidden';
}

function closeProfilePreview() {
  const modal = document.getElementById('profilePreviewModal');
  const overlay = document.getElementById('profilePreviewOverlay');
  modal.classList.remove('ppm-active');
  overlay.classList.remove('ppo-active');
  document.body.style.overflow = '';
}
