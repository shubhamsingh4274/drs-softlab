// ═══════════════════════════════════════════════════════════
// DRS SoftLab — Site Configuration
// Change URLs and settings here. They apply across ALL pages.
// ═══════════════════════════════════════════════════════════

const CONFIG = {
  // ─── Product URLs ────────────────────────────────────
  NEOSHALA_URL: 'https://neo-shala.vercel.app',
  AUSHADHI_URL: 'https://aushadhi-kappa.vercel.app/',

  // ─── Contact Info ────────────────────────────────────
  PHONE: '9453373823',
  EMAIL: 'shubhamsingh4274@gmail.com',
  WHATSAPP_MSG: 'Hi DRS Team, I want to know about your products',

  // ─── Company Info ────────────────────────────────────
  COMPANY_NAME: 'DRS SoftLab',
  TAGLINE: 'Digital Retail Solutions',
  ADDRESS: 'B-12, Sector 62, Noida, Uttar Pradesh 201301, India',
  FOUNDED_YEAR: '2026',

  // ─── Social Links (add when you have them) ──────────
  LINKEDIN_URL: '',
  TWITTER_URL: '',
  INSTAGRAM_URL: '',

  // ─── Computed URLs (don't edit these) ────────────────
  get GMAIL_URL() {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${this.EMAIL}`;
  },
  get WHATSAPP_URL() {
    return `https://wa.me/91${this.PHONE}?text=${encodeURIComponent(this.WHATSAPP_MSG)}`;
  },
  get PHONE_URL() {
    return `tel:+91${this.PHONE}`;
  },
  get PHONE_DISPLAY() {
    return `+91 ${this.PHONE.slice(0,5)} ${this.PHONE.slice(5)}`;
  },
};

// ─── Auto-apply config to all pages on load ────────────
document.addEventListener('DOMContentLoaded', () => {

  // Update all product links
  document.querySelectorAll('[data-link="neoshala"]').forEach(el => {
    if (CONFIG.NEOSHALA_URL) {
      el.href = CONFIG.NEOSHALA_URL;
      el.target = '_blank';
    } else {
      el.href = '#products';
      el.removeAttribute('target');
    }
  });

  document.querySelectorAll('[data-link="aushadhi"]').forEach(el => {
    el.href = CONFIG.AUSHADHI_URL || '#products';
    if (CONFIG.AUSHADHI_URL) el.target = '_blank';
  });

  // Update all email links
  document.querySelectorAll('[data-link="email"]').forEach(el => {
    el.href = CONFIG.GMAIL_URL;
    el.target = '_blank';
  });

  // Update email links with subject
  document.querySelectorAll('[data-link="email-apply"]').forEach(el => {
    const subject = el.dataset.subject || '';
    el.href = `${CONFIG.GMAIL_URL}&su=${encodeURIComponent(subject)}`;
    el.target = '_blank';
  });

  // Update all WhatsApp links
  document.querySelectorAll('[data-link="whatsapp"]').forEach(el => {
    el.href = CONFIG.WHATSAPP_URL;
    el.target = '_blank';
  });

  // Update WhatsApp links with custom message
  document.querySelectorAll('[data-link="whatsapp-custom"]').forEach(el => {
    const msg = el.dataset.msg || CONFIG.WHATSAPP_MSG;
    el.href = `https://wa.me/91${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`;
    el.target = '_blank';
  });

  // Update all phone links
  document.querySelectorAll('[data-link="phone"]').forEach(el => {
    el.href = CONFIG.PHONE_URL;
  });

  // Update displayed email text
  document.querySelectorAll('[data-text="email"]').forEach(el => {
    el.textContent = CONFIG.EMAIL;
  });

  // Update displayed phone text
  document.querySelectorAll('[data-text="phone"]').forEach(el => {
    el.textContent = CONFIG.PHONE_DISPLAY;
  });

  // Contact form WhatsApp submit
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const n = document.getElementById('cf-name')?.value || '';
      const em = document.getElementById('cf-email')?.value || '';
      const ph = document.getElementById('cf-phone')?.value || '';
      const s = document.getElementById('cf-subject')?.value || '';
      const m = document.getElementById('cf-msg')?.value || '';
      const msg = `Hi DRS Team!\n\nName: ${n}\nEmail: ${em}\nPhone: ${ph}\nSubject: ${s}\n\nMessage:\n${m}`;
      window.open(`https://wa.me/91${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }
});
