// =============================================
// KUMARA SWAMY R — Portfolio JS (Multi-Page)
// =============================================

/* ===== State ===== */
let currentPage = 0;
const totalPages = 5;
const pages = document.querySelectorAll('.page');
const navBtns = document.querySelectorAll('.nav-btn');
const dots = document.querySelectorAll('.dot');

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

  if (index === 2) triggerSkillBars();
  if (index === 1) triggerCounters();

  currentPage = index;
}

// Re-position on window resize
window.addEventListener('resize', () => goToPage(currentPage));

// Initialise — position all pages correctly then show page 0
pages.forEach((p, i) => {
  // disable transition during init
  p.style.transition = 'none';
  p.style.transform = `translateX(${i * window.innerWidth}px)`;
  p.style.opacity = i === 0 ? '1' : '0';
  p.style.pointerEvents = i === 0 ? 'auto' : 'none';
});
// Force reflow then re-enable transitions
requestAnimationFrame(() => {
  pages.forEach(p => {
    p.style.transition = 'transform 0.55s cubic-bezier(.77,0,.18,1), opacity 0.55s';
  });
  goToPage(0);
});


// Nav button clicks
navBtns.forEach(btn => {
  btn.addEventListener('click', () => goToPage(parseInt(btn.dataset.page)));
});

// Dot clicks
dots.forEach(dot => {
  dot.addEventListener('click', () => goToPage(parseInt(dot.dataset.page)));
});

// Keyboard arrow navigation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage(currentPage + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goToPage(currentPage - 1);
});

// Touch / swipe support
let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) + 20) {
    if (dx < -50) goToPage(currentPage + 1);
    if (dx > 50)  goToPage(currentPage - 1);
  }
}, { passive: true });

// Initialise first page
goToPage(0);

/* ===== Skill Bars ===== */
let skillsTriggered = false;
function triggerSkillBars() {
  if (skillsTriggered) return;
  skillsTriggered = true;
  document.querySelectorAll('.skill-bar').forEach(bar => {
    setTimeout(() => { bar.style.width = bar.dataset.level; }, 200);
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

/* ===== Typing Effect ===== */
const roles = ['Web Developer', 'Data Scientist', 'Python Engineer', 'Problem Solver'];
let roleIndex = 0, charIndex = 0, isTyping = true;
const typingEl = document.getElementById('typing-text');

function typeRole() {
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

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.4 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.alpha = Math.random() * 0.45 + 0.1;
    this.color = `hsla(${Math.random()*60+260},90%,75%,${this.alpha})`;
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

function initParticles(n = 100) { particles = Array.from({length:n}, () => new Particle()); }
function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx*dx+dy*dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(168,85,247,${0.07*(1-d/100)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}
function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animate);
}
initParticles();
animate();
