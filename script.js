// ═══════════════════════════════════════════════════════════
// DRS Softlabs — Interactive Effects
// Particles, Scroll Reveals, Animated Counters, Typing
// ═══════════════════════════════════════════════════════════

// ─── Preloader (only on first visit) ─────────────────────
(function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  // Only show preloader on first visit, not on page navigation
  if (sessionStorage.getItem('drs-loaded')) {
    // Returning visit / internal nav — hide instantly
    preloader.remove();
  } else {
    // First visit — show brief splash
    sessionStorage.setItem('drs-loaded', '1');
    window.addEventListener('load', () => {
      setTimeout(() => { preloader.classList.add('hidden'); }, 800);
      setTimeout(() => { preloader.remove(); }, 1300);
    });
  }
})();

// ─── Mobile Menu ─────────────────────────────────────────
(function initMobileMenu() {
  const btn = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.add('open'));
  menu.addEventListener('click', (e) => {
    if (e.target === menu || e.target.closest('.mobile-menu-close')) menu.classList.remove('open');
  });
  // Close on link click
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();

// ─── Page loads normally — no transitions needed ─────────


// ─── Social Proof Ticker ─────────────────────────────────
(function initSocialProof() {
  const proofs = [
    { name: 'Rajesh', city: 'Jaipur', action: 'signed up for Aushadhi', time: '2 min ago', initials: 'RK' },
    { name: 'Priya', city: 'Delhi', action: 'started NeoShala free trial', time: '5 min ago', initials: 'PS' },
    { name: 'Amit', city: 'Mumbai', action: 'upgraded to Gold plan', time: '8 min ago', initials: 'AP' },
    { name: 'Sunita', city: 'Lucknow', action: 'generated 50 invoices today', time: '12 min ago', initials: 'SV' },
    { name: 'Vikram', city: 'Noida', action: 'registered 200 students', time: '15 min ago', initials: 'VJ' },
    { name: 'Meera', city: 'Pune', action: 'collected ₹1.2L in fees', time: '18 min ago', initials: 'MG' },
    { name: 'Rohit', city: 'Ahmedabad', action: 'started Aushadhi trial', time: '22 min ago', initials: 'RK' },
    { name: 'Ananya', city: 'Bangalore', action: 'exported GST report', time: '25 min ago', initials: 'AS' },
  ];
  let idx = 0;

  function showProof() {
    // Remove existing
    const existing = document.querySelector('.social-proof');
    if (existing) {
      existing.classList.add('hiding');
      setTimeout(() => existing.remove(), 300);
    }

    setTimeout(() => {
      const p = proofs[idx % proofs.length];
      idx++;
      const div = document.createElement('div');
      div.className = 'social-proof';
      div.innerHTML = '<div class="social-proof-avatar">' + p.initials + '</div>' +
        '<div class="social-proof-text"><strong>' + p.name + '</strong> from ' + p.city + ' ' + p.action +
        '<span class="social-proof-time">' + p.time + '</span></div>';
      document.body.appendChild(div);
      // Auto-hide after 8s
      setTimeout(() => {
        div.classList.add('hiding');
        setTimeout(() => div.remove(), 300);
      }, 8000);
    }, 400);
  }

  // First one after 15s, then every 25s (much slower)
  setTimeout(showProof, 15000);
  setInterval(showProof, 25000);
})();

// ─── Particle System ─────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += 0.02;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      const a = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 196, 122, ${a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(34, 196, 122, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ─── Scroll Reveal (improved with stagger) ───────────────
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Stagger children with .reveal class inside grids
        const children = e.target.querySelectorAll('.reveal:not(.visible)');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 80);
        });
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .reveal-scale').forEach(el => observer.observe(el));
})();

// ─── Header Scroll ───────────────────────────────────────
(function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
})();

// ─── Animated Odometer Counter ───────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 'true';
        const target = parseFloat(e.target.dataset.count);
        const suffix = e.target.dataset.suffix || '';
        const fmt = e.target.dataset.format;
        const duration = 2500;
        const start = performance.now();

        // Add odometer transition style
        e.target.style.transition = 'transform 0.3s ease';

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Smooth ease-out-expo for odometer feel
          const eased = 1 - Math.pow(2, -10 * progress);
          const current = target * eased;
          let display;
          if (fmt === 'k' && current >= 1000) {
            display = Math.round(current / 1000) + 'K';
          } else if (Number.isInteger(target)) {
            display = Math.round(current).toLocaleString();
          } else {
            display = current.toFixed(1);
          }
          e.target.textContent = display + suffix;

          // Subtle scale pulse at milestones
          if (progress > 0.9 && progress < 0.95) {
            e.target.style.transform = 'scale(1.08)';
          } else {
            e.target.style.transform = 'scale(1)';
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          } else if (suffix) {
            // Add suffix with bounce animation
            const span = document.createElement('span');
            span.className = 'suffix-bounce';
            span.textContent = suffix;
            e.target.textContent = display;
            e.target.appendChild(span);
          }
        }
        requestAnimationFrame(update);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => observer.observe(c));
})();

// ─── Typing Effect ───────────────────────────────────────
(function initTyping() {
  const el = document.querySelector('.typing-text');
  if (!el) return;
  const words = JSON.parse(el.dataset.words || '[]');
  let wordIdx = 0, charIdx = 0, deleting = false;
  function type() {
    const word = words[wordIdx];
    if (deleting) {
      el.textContent = word.substring(0, charIdx--);
      if (charIdx < 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; setTimeout(type, 500); return; }
    } else {
      el.textContent = word.substring(0, ++charIdx);
      if (charIdx === word.length) { deleting = true; setTimeout(type, 2000); return; }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  setTimeout(type, 1000);
})();

// ─── Mouse Glow ──────────────────────────────────────────
(function initMouseGlow() {
  const glow = document.querySelector('.mouse-glow');
  if (!glow) return;
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// ─── Live Activity Toast (fake real-time events) ─────────
(function initActivityToast() {
  const activities = [
    { icon: '&#128138;', text: 'New pharmacy signed up from Jaipur', color: '#22c47a' },
    { icon: '&#127891;', text: 'School in Delhi started free trial', color: '#60a5fa' },
    { icon: '&#128176;', text: '&#8377;45,000 invoice generated in Aushadhi', color: '#fbbf24' },
    { icon: '&#10003;', text: 'Attendance marked for 500 students', color: '#34d399' },
    { icon: '&#128138;', text: 'Pharmacy in Mumbai upgraded to Gold', color: '#c084fc' },
    { icon: '&#127891;', text: 'Report card generated for Class 10', color: '#60a5fa' },
    { icon: '&#9889;', text: '3-click billing completed in 8 seconds', color: '#f87171' },
    { icon: '&#128200;', text: 'GST report exported for March 2026', color: '#22c47a' },
  ];
  let idx = 0;
  function showToast() {
    const existing = document.getElementById('activity-toast');
    if (existing) existing.remove();
    const a = activities[idx % activities.length];
    idx++;
    const toast = document.createElement('div');
    toast.id = 'activity-toast';
    toast.innerHTML = `<span style="font-size:16px">${a.icon}</span> <span style="font-size:12px;color:#94a3b8">${a.text}</span>`;
    Object.assign(toast.style, {
      position: 'fixed', bottom: '80px', left: '20px', zIndex: '999',
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '10px 16px', borderRadius: '12px',
      background: 'rgba(6,15,26,0.9)', backdropFilter: 'blur(12px)',
      border: `1px solid ${a.color}30`,
      boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 20px ${a.color}10`,
      animation: 'toastSlide 0.4s ease',
      transition: 'opacity 0.3s',
    });
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; }, 6000);
    setTimeout(() => { toast.remove(); }, 6500);
  }
  // Show first after 20s, then every 30s (much slower)
  setTimeout(showToast, 20000);
  setInterval(showToast, 30000);
})();

// ─── Device Demo Slideshow (pause on hover) ──────────────
(function initDemoSlides() {
  let laptopPaused = false, tabletPaused = false, phonePaused = false;

  // Helper: add hover pause to a device container
  function addHoverPause(selector, setFlag) {
    const el = document.querySelector(selector);
    if (el) {
      el.addEventListener('mouseenter', () => setFlag(true));
      el.addEventListener('mouseleave', () => setFlag(false));
    }
  }

  // ── Laptop slides (Aushadhi) ───────────────────────
  const laptopSlides = document.querySelectorAll('.laptop-slide');
  const stepDots = document.querySelectorAll('.demo-step-dot');
  let laptopIdx = 0;

  function showLaptopSlide(idx) {
    laptopSlides.forEach((s, i) => {
      s.style.opacity = i === idx ? '1' : '0';
      s.style.transform = i === idx ? 'translateX(0)' : (i < idx ? 'translateX(-30px)' : 'translateX(30px)');
    });
    stepDots.forEach((d, i) => {
      if (i === idx) {
        d.style.background = 'rgba(26,122,82,0.15)';
        d.style.borderColor = 'rgba(26,122,82,0.3)';
        d.style.color = '#22c47a';
        d.querySelector('span').style.background = '#1a7a52';
        d.querySelector('span').style.color = '#fff';
      } else {
        d.style.background = 'rgba(255,255,255,0.04)';
        d.style.borderColor = 'rgba(255,255,255,0.08)';
        d.style.color = '#94a3b8';
        d.querySelector('span').style.background = 'rgba(255,255,255,0.1)';
        d.querySelector('span').style.color = '#94a3b8';
      }
    });
  }

  if (laptopSlides.length > 0) {
    stepDots.forEach((d, i) => d.addEventListener('click', () => { laptopIdx = i; showLaptopSlide(i); }));
    addHoverPause('.device-laptop', (v) => laptopPaused = v);
    // Progress bar for laptop
    const laptopProgress = document.getElementById('laptop-progress');
    let laptopTimer = 0;
    setInterval(() => {
      if (!laptopPaused) {
        laptopTimer += 100;
        if (laptopProgress) laptopProgress.style.width = (laptopTimer / 4000 * 100) + '%';
        if (laptopTimer >= 4000) {
          laptopTimer = 0;
          laptopIdx = (laptopIdx + 1) % laptopSlides.length;
          showLaptopSlide(laptopIdx);
          if (laptopProgress) laptopProgress.style.width = '0%';
        }
      }
    }, 100);
  }

  // ── Tablet slides ──────────────────────────────────
  const tabletSlides = document.querySelectorAll('.tablet-slide');
  const tabletDots = document.querySelectorAll('.tablet-dot');
  let tabletIdx = 0;

  function showTabletSlide(idx) {
    tabletSlides.forEach((s, i) => {
      s.style.opacity = i === idx ? '1' : '0';
      s.style.transform = i === idx ? 'translateX(0)' : (i < idx ? 'translateX(-30px)' : 'translateX(30px)');
    });
    tabletDots.forEach((d, i) => {
      d.style.background = i === idx ? '#22c47a' : 'rgba(255,255,255,0.15)';
    });
  }

  if (tabletSlides.length > 0) {
    tabletDots.forEach((d, i) => { d.addEventListener('click', () => { tabletIdx = i; showTabletSlide(i); }); d.style.cursor = 'pointer'; });
    addHoverPause('.device-tablet', (v) => tabletPaused = v);
    setInterval(() => { if (!tabletPaused) { tabletIdx = (tabletIdx + 1) % tabletSlides.length; showTabletSlide(tabletIdx); } }, 5000);
  }

  // ── Phone slides (NeoShala) ────────────────────────
  const phoneSlides = document.querySelectorAll('.phone-slide');
  const phoneDots = document.querySelectorAll('.phone-dot');
  let phoneIdx = 0;

  function showPhoneSlide(idx) {
    phoneSlides.forEach((s, i) => {
      s.style.opacity = i === idx ? '1' : '0';
      s.style.transform = i === idx ? 'translateX(0)' : (i < idx ? 'translateX(-30px)' : 'translateX(30px)');
    });
    phoneDots.forEach((d, i) => {
      d.style.background = i === idx ? '#22c47a' : 'rgba(255,255,255,0.15)';
    });
  }

  if (phoneSlides.length > 0) {
    phoneDots.forEach((d, i) => { d.addEventListener('click', () => { phoneIdx = i; showPhoneSlide(i); }); d.style.cursor = 'pointer'; });
    addHoverPause('.device-phone', (v) => phonePaused = v);
    setInterval(() => { if (!phonePaused) { phoneIdx = (phoneIdx + 1) % phoneSlides.length; showPhoneSlide(phoneIdx); } }, 3500);
  }
})();

// ─── Testimonial Carousel ────────────────────────────────
(function initTestimonials() {
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!track || !dots.length) return;
  let idx = 0;
  const total = dots.length;
  let paused = false;

  function show(i) {
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
  }

  dots.forEach((d, i) => d.addEventListener('click', () => { idx = i; show(i); }));
  track.parentElement.addEventListener('mouseenter', () => paused = true);
  track.parentElement.addEventListener('mouseleave', () => paused = false);
  setInterval(() => { if (!paused) { idx = (idx + 1) % total; show(idx); } }, 5000);
})();

// ─── Demo Modal ──────────────────────────────────────────
(function initDemoModal() {
  const btn = document.querySelector('.demo-float-btn');
  const overlay = document.querySelector('.demo-modal-overlay');
  const close = document.querySelector('.demo-modal-close');
  const form = document.getElementById('demo-form');
  if (!btn || !overlay) return;

  btn.addEventListener('click', () => overlay.classList.add('open'));
  close?.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name=name]')?.value || '';
    const phone = form.querySelector('[name=phone]')?.value || '';
    const business = form.querySelector('[name=business]')?.value || '';
    const msg = encodeURIComponent(`Hi DRS Team! I want a demo.\n\nName: ${name}\nPhone: ${phone}\nBusiness: ${business}`);
    window.open(`https://wa.me/919453373823?text=${msg}`, '_blank');
    overlay.classList.remove('open');
  });
})();

// ─── Scroll Progress Bar ─────────────────────────────────
(function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  });
})();

// ─── Back to Top Button ──────────────────────────────────
(function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ─── Dark/Light Mode Toggle ──────────────────────────────
(function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  const saved = localStorage.getItem('drs-theme');
  if (saved === 'light') document.body.classList.add('light-mode');
  updateIcon();
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('drs-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    updateIcon();
  });
  function updateIcon() {
    btn.textContent = document.body.classList.contains('light-mode') ? '\u{1F319}' : '\u2600\uFE0F';
  }
})();

// ─── Cookie Consent ──────────────────────────────────────
(function initCookie() {
  if (localStorage.getItem('drs-cookie-consent')) return;
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;
  banner.style.display = 'flex';
  banner.querySelector('.cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('drs-cookie-consent', 'accepted');
    banner.style.display = 'none';
  });
  banner.querySelector('.cookie-decline')?.addEventListener('click', () => {
    localStorage.setItem('drs-cookie-consent', 'declined');
    banner.style.display = 'none';
  });
})();

// ─── Smooth Scroll for anchors ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
