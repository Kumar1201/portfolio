/* =============================================
   KUMARA SWAMY R — PORTFOLIO v2.0
   JavaScript: Animations, Cursor, Particles,
   Scroll Reveal, Typewriter, Counters
   ============================================= */

(function () {
  'use strict';

  // =============================================
  // CUSTOM CURSOR
  // =============================================
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  const ringSpeed = 0.12;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * ringSpeed;
    ringY += (mouseY - ringY) * ringSpeed;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Scale cursor on hover over interactive elements
  document.querySelectorAll('a, button, .skill-card, .exp-card, .info-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform   = 'translate(-50%, -50%) scale(1.8)';
      cursorDot.style.background  = 'var(--purple-l)';
      cursorRing.style.width      = '56px';
      cursorRing.style.height     = '56px';
      cursorRing.style.borderColor= 'rgba(168,85,247,0.8)';
      cursorRing.style.background = 'rgba(168,85,247,0.05)';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform   = 'translate(-50%, -50%) scale(1)';
      cursorDot.style.background  = 'var(--cyan)';
      cursorRing.style.width      = '36px';
      cursorRing.style.height     = '36px';
      cursorRing.style.borderColor= 'rgba(168,85,247,0.6)';
      cursorRing.style.background = 'transparent';
    });
  });

  // =============================================
  // PARTICLE CANVAS
  // =============================================
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      vx:   (Math.random() - 0.5) * 0.3,
      vy:   (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5
        ? `rgba(168,85,247,${Math.random() * 0.5 + 0.2})`
        : Math.random() > 0.5
          ? `rgba(6,182,212,${Math.random() * 0.5 + 0.2})`
          : `rgba(236,72,153,${Math.random() * 0.4 + 0.1})`,
    };
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 120);
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    animFrame = requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  initParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrame);
    resizeCanvas();
    initParticles();
    drawParticles();
  });

  // =============================================
  // TYPEWRITER EFFECT
  // =============================================
  const phrases = [
    'Beautiful Web Experiences',
    'Data-Driven Solutions',
    'Machine Learning Models',
    'Clean, Elegant Code',
    'Interactive Dashboards',
  ];
  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  const typeEl = document.getElementById('type-text');
  const TYPE_SPEED   = 70;
  const DELETE_SPEED = 35;
  const PAUSE_MS     = 1800;

  function typeWriter() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      typeEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        setTimeout(typeWriter, 300);
        return;
      }
      setTimeout(typeWriter, DELETE_SPEED);
    } else {
      typeEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(() => { isDeleting = true; typeWriter(); }, PAUSE_MS);
        return;
      }
      setTimeout(typeWriter, TYPE_SPEED);
    }
  }

  setTimeout(typeWriter, 800);

  // =============================================
  // COUNTER ANIMATION
  // =============================================
  function animateCounter(el, target, duration = 1800) {
    const start     = performance.now();
    const startVal  = 0;

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(startVal + (target - startVal) * ease);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // =============================================
  // NAVBAR SCROLL BEHAVIOUR
  // =============================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    const scrollY = window.scrollY;

    // Scrolled class
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 100) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });

  // Cinematic Curtain Page Transition for Nav Links
  const pageTransContainer = document.getElementById('page-transition');
  const transLabelText = document.querySelector('.trans-label-text');
  let isTransitioning = false;

  function triggerPageTransition(targetEl, label) {
    if (isTransitioning || !pageTransContainer) return;
    isTransitioning = true;

    if (transLabelText) {
      transLabelText.textContent = label || 'Portfolio';
    }

    // Phase 1: Bring curtain up
    pageTransContainer.classList.remove('trans-out');
    pageTransContainer.classList.add('trans-in');

    setTimeout(() => {
      // Scroll target into position while covered
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      }

      // Phase 2: Slide curtain up to reveal page
      setTimeout(() => {
        pageTransContainer.classList.remove('trans-in');
        pageTransContainer.classList.add('trans-out');

        setTimeout(() => {
          pageTransContainer.classList.remove('trans-out');
          isTransitioning = false;
        }, 650);
      }, 350);
    }, 450);
  }

  // Smooth nav links with curtain transition
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const labelText = anchor.textContent.trim() || href.replace('#', '').toUpperCase();
        triggerPageTransition(target, labelText);
      }
    });
  });

  // =============================================
  // SCROLL REVEAL (Intersection Observer)
  // =============================================
  let countersAnimated = false;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reveal element
        entry.target.classList.add('revealed');

        // Animate skill bars
        const bar = entry.target.querySelector('.skill-bar-fill');
        if (bar) {
          setTimeout(() => {
            bar.style.width = bar.dataset.width;
          }, 200);
        }

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  // Observe reveal elements
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  // Reveal section headers
  const sectionHeaderObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.section-tag, .section-heading, .heading-line, .about-para, .skill-tags, .about-stats-row').forEach((el, i) => {
          el.style.transitionDelay = (i * 0.1) + 's';
          el.classList.add('revealed');
        });
        sectionHeaderObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-section').forEach(sec => {
    sectionHeaderObserver.observe(sec);
  });

  // Counter observer (hero stats + about stats)
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count, 10);
          animateCounter(el, target, 1600);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Observe hero stats and about stats
  document.querySelectorAll('.hero-stats, .about-stats-row').forEach(el => {
    counterObserver.observe(el);
  });

  // =============================================
  // MOUSE PARALLAX (Hero orbs + Aurora)
  // =============================================
  let ticking = false;
  document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      const aurora1 = document.querySelector('.aurora-1');
      const aurora2 = document.querySelector('.aurora-2');
      if (aurora1) aurora1.style.transform = `translate(${dx * -30}px, ${dy * -20}px) scale(1)`;
      if (aurora2) aurora2.style.transform = `translate(${dx * 20}px, ${dy * 15}px) scale(1)`;

      const photoWrap = document.querySelector('.hero-photo-wrap');
      if (photoWrap) {
        photoWrap.style.transform = `perspective(1000px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg)`;
      }

      ticking = false;
    });
  });

  // =============================================
  // SKILL CARD GLOW ON MOUSE
  // =============================================
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // =============================================
  // EXPERTISE CARD SPOTLIGHT
  // =============================================
  document.querySelectorAll('.exp-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
  });

  // =============================================
  // INITIAL HERO ANIMATIONS
  // =============================================
  // Stagger the hero content on load
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';

    // Start counter for hero stats
    document.querySelectorAll('.hero-stats [data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      setTimeout(() => animateCounter(el, target, 2000), 600);
    });
  });



  // =============================================
  // SKILL BAR OBSERVER (separate pass)
  // =============================================
  const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = bar.dataset.width || '0%';
          }, i * 120);
        });
        skillBarObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillBarObserver.observe(skillsSection);

  // =============================================
  // SCROLL PROGRESS INDICATOR
  // =============================================
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 9999;
    height: 3px; width: 0%; background: linear-gradient(90deg, #7c3aed, #06b6d4, #ec4899);
    transition: width 0.1s; pointer-events: none;
    box-shadow: 0 0 12px rgba(124,58,237,0.7);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

})();
