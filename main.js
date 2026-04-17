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

  // ── Platform tabs ───────────────────────────────────────────────
  const tabs = document.querySelectorAll('.platform__tab');
  const panels = document.querySelectorAll('.platform__panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      tabs.forEach(t => {
        t.classList.remove('platform__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => {
        p.classList.remove('platform__panel--active');
        p.hidden = true;
      });
      tab.classList.add('platform__tab--active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(target);
      if (panel) {
        panel.classList.add('platform__panel--active');
        panel.hidden = false;
      }
    });
  });

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
