/* ClearPath eQMS — main.js */
(function () {
  'use strict';

  // ── Nav scroll behaviour ────────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  }, { passive: true });

  // ── Mobile burger menu ──────────────────────────────────────────
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('nav__mobile--open');
      burger.setAttribute('aria-expanded', open);
      mobileMenu.setAttribute('aria-hidden', !open);
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('nav__mobile--open');
        burger.setAttribute('aria-expanded', false);
        mobileMenu.setAttribute('aria-hidden', true);
      });
    });
  }

  // ── Platform tabs + mobile swipe ───────────────────────────────
  const tabs   = document.querySelectorAll('.platform__tab');
  const panels = document.querySelectorAll('.platform__panel');
  const tabList = document.querySelectorAll('.platform__tab');
  let currentIndex = 0;

  function activateTab(index) {
    currentIndex = index;
    tabs.forEach((t, i) => {
      t.classList.toggle('platform__tab--active', i === index);
      t.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    panels.forEach((p, i) => {
      p.classList.toggle('platform__panel--active', i === index);
      p.hidden = i !== index;
    });
    // Update dots
    document.querySelectorAll('.platform__dot').forEach((d, i) => {
      d.classList.toggle('platform__dot--active', i === index);
    });
    // Scroll active tab into view on mobile
    tabs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(i));
  });

  // Inject swipe dots below panels on mobile
  const platformSection = document.querySelector('.platform__panels');
  if (platformSection) {
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'platform__dots';
    tabs.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'platform__dot' + (i === 0 ? ' platform__dot--active' : '');
      dot.setAttribute('aria-label', `View slide ${i + 1}`);
      dot.addEventListener('click', () => activateTab(i));
      dotsWrap.appendChild(dot);
    });
    platformSection.after(dotsWrap);
  }

  // Touch swipe
  const panelWrap = document.querySelector('.platform__panels');
  if (panelWrap) {
    let startX = 0;
    panelWrap.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    panelWrap.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < tabs.length - 1) activateTab(currentIndex + 1);
        if (diff < 0 && currentIndex > 0) activateTab(currentIndex - 1);
      }
    }, { passive: true });
  }

  // ── Scroll reveal ───────────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.feature-card, .why-card, .package-card, .step, .platform__panel-inner, .contact__inner, .section-heading, .section-label'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ── Contact form (mailto fallback) ─────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const company = form.querySelector('#company').value.trim();
      const message = form.querySelector('#message').value.trim();
      if (!name || !email) {
        alert('Please enter your name and email address.');
        return;
      }
      const body = encodeURIComponent(
        `Hi Carlos,\n\nI'd like to request a demo of ClearPath eQMS.\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}\n\nBest regards,\n${name}`
      );
      const subject = encodeURIComponent('ClearPath Demo Request');
      window.location.href = `mailto:carlosmaline@qualisureconsulting.com?subject=${subject}&body=${body}`;
    });
  }

  // ── Smooth scroll for anchor links ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

// Initialise Lucide icons
if (typeof lucide !== 'undefined') { lucide.createIcons(); }
