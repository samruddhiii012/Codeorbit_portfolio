/* ================================================================
   PORTFOLIO — script.js (Two-way scroll animations + Deep Blue Theme)
   Author: Samruddhi Harel
   ================================================================ */

'use strict';

const CREDENTIALS = [
  {
    title:   'IETE Website Development',
    category:  'competition',
    tag:       'Competition',
    award:     'Runner-up',
    issuer:    'IETE Committee, DMCE',
    date:      'Oct 2026',
    summary:   'Runner-up in the Website Development Competition organised by the IETE Committee, Department of Electronics & Telecommunication, Datta Meghe College of Engineering.',
    image:     'assets/certificates/iete-web-development.jpeg',
    alt:       'IETE Website Development Competition certificate, runner-up',
    featured:  true,
  },
  {
    title:   'NCATEX 2026: "CLOUD BME"',
    category:  'research',
    tag:       'Research paper',
    issuer:    'ISTE-DMCE Chapter',
    date:      'Mar 2026',
    summary:   'Presented a paper on cloud-based BME280 monitoring at the 2nd National Conference on Advanced Trends in E&TC Engineering. Published in the proceedings (ISBN 978-93-5780-986-3).',
    image:     'assets/certificates/ncatex-2026.png',
    alt:       'NCATEX 2026 paper presentation certificate',
  },
  {
    title:   'HackCelestial 3.0',
    category:  'competition',
    tag:       'Hackathon',
    issuer:    'Pillai University, Tech Alegria',
    date:      'Sep 2026',
    summary:   'Took part in the two-day hackathon held as part of Tech Alegria 2026.',
    image:     'assets/certificates/hackcelestial-3-0.png',
    alt:       'HackCelestial 3.0 participation certificate',
  },
  {
    title:   'Eureka Pitching Competition',
    category:  'competition',
    tag:       'Pitching',
    issuer:    'E-Cell, DMCE',
    date:      'Aug 2026',
    summary:   'Presented an idea to judges at the Entrepreneurship Cell pitching competition.',
    image:     'assets/certificates/eureka-pitching-competition.png',
    alt:       'Eureka Pitching Competition participation certificate',
  },
  {
    title:   'Cybersecurity Analyst Job Simulation',
    category:  'certification',
    tag:       'Job simulation',
    issuer:    'Tata, via Forage',
    date:      'Apr 2026',
    summary:   'Practical tasks in identity and access management: strategy assessment, custom IAM solutions and platform integration.',
    image:     'assets/certificates/cybersecurity-analyst.png',
    alt:       'Tata Cybersecurity Analyst job simulation certificate',
  },
  {
    title:   'GenAI Powered Data Analytics Job Simulation',
    category:  'certification',
    tag:       'Job simulation',
    issuer:    'Tata, via Forage',
    date:      'Apr 2026',
    summary:   'Exploratory data analysis, predicting delinquency with AI, and an AI-driven collections strategy.',
    image:     'assets/certificates/genai-data-analytics.png',
    alt:       'Tata GenAI Powered Data Analytics job simulation certificate',
  },
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.documentElement.classList.add('js-loading');
window.addEventListener('DOMContentLoaded', init);

function init() {
  document.body.classList.add('js-ready');
  document.documentElement.classList.remove('js-loading');

  const safe = fn => { try { fn(); } catch (err) { console.error(fn.name, err); } };

  [
    initTheme, initNavbarScroll, initHamburger, initSmoothScroll,
    initScrollProgress, initFabTop, initRevealObserver,
    initHeadingUnderlines, initTimelineDraw, initChipStagger,
    initHeroReveal, initCredentialsDeck, buildModal,
    initContactForm, initFooterYear, initCursorTrail, initMagneticButtons
  ].forEach(safe);

  if (!prefersReducedMotion) {
    [initCardTilt, initCardGlow, initOrbParallax].forEach(safe);
  }
}

/* ================================================================
   SMOOTH MAGNETIC BUTTON EFFECT
   ================================================================ */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches || prefersReducedMotion) return;

  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) translateY(-2px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ================================================================
   CURSOR TRAIL EFFECT (Water Fade / Ghost Effect)
   ================================================================ */
function initCursorTrail() {
  if (window.matchMedia('(hover: none)').matches) return;

  const container = document.querySelector('.cursor-trail-container');
  if (!container) return;

  const arrowSvg = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 3.214V20.786L10.5 16.5L14.5 21.5L17.5 19.5L13.5 14.5H19.5L5.5 3.214Z" />
    </svg>
  `;

  let lastX = 0;
  let lastY = 0;
  const distanceThreshold = 18; // Closer spacing for smooth water trail

  window.addEventListener('mousemove', (e) => {
    const currentX = e.clientX;
    const currentY = e.clientY;
    const distance = Math.hypot(currentX - lastX, currentY - lastY);

    if (distance > distanceThreshold) {
      lastX = currentX;
      lastY = currentY;
      createTrailArrow(currentX, currentY);
    }
  });

  function createTrailArrow(x, y) {
    const arrow = document.createElement('div');
    arrow.classList.add('trail-arrow');
    arrow.innerHTML = arrowSvg;
    arrow.style.left = `${x}px`;
    arrow.style.top = `${y}px`;
    
    // Initial state for water fade
    arrow.style.opacity = '0.7';
    arrow.style.transform = 'translate(-50%, -50%) scale(1)';

    container.appendChild(arrow);

    // Smooth water/ghost fade-out transition
    requestAnimationFrame(() => {
      arrow.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      arrow.style.opacity = '0';
      arrow.style.transform = 'translate(-50%, -50%) scale(0.6)';
    });

    // Remove element after fade completes
    setTimeout(() => {
      arrow.remove();
    }, 600);
  }
}

/* ================================================================
   THEME TOGGLE
   ================================================================ */
function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const KEY  = 'portfolio-theme';

  let saved = 'dark';
  try { saved = localStorage.getItem(KEY) || 'dark'; } catch (e) {}
  root.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
  });
}

/* ================================================================
   NAVBAR & SCROLL
   ================================================================ */
function initNavbarScroll() {
  const navbar    = document.getElementById('navbar');
  const indicator = document.querySelector('.nav-indicator');
  const links     = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  function moveIndicator(link) {
    if (!link || !indicator) return;
    const navRect  = link.parentElement.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    indicator.style.left    = (linkRect.left - navRect.left) + 'px';
    indicator.style.width   = linkRect.width + 'px';
    indicator.style.opacity = '1';
  }

  function setActive(section) {
    links.forEach(l => l.classList.remove('active'));
    const link = document.querySelector(`.nav-link[data-section="${section}"]`);
    if (link) {
      link.classList.add('active');
      moveIndicator(link);
    }
  }

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) current = sec.id;
    });
    if (current) setActive(current);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const nav   = document.getElementById('nav-links');
  const links = nav.querySelectorAll('.nav-link');

  function close() {
    btn.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('open', !isOpen);
  });

  links.forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id      = anchor.getAttribute('href').slice(1);
      const target  = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;

      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });
}

function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  function update() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initFabTop() {
  const fab = document.getElementById('fab-top');
  if (!fab) return;

  window.addEventListener('scroll', () => {
    fab.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  fab.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

/* ================================================================
   TWO-WAY REVEAL ANIMATIONS (Animate In & Out on Scroll)
   ================================================================ */
function initRevealObserver() {
  if (!window.IntersectionObserver) {
    document.querySelectorAll('.reveal-up, .reveal-line, .reveal-slide').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('visible');
        setTimeout(() => el.classList.add('reveal-done'), 1100);
      } else {
        el.classList.remove('visible', 'reveal-done');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-line, .reveal-slide').forEach(el => observer.observe(el));
}

function initHeadingUnderlines() {
  if (!window.IntersectionObserver) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('heading-visible');
      } else {
        entry.target.classList.remove('heading-visible');
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.section-heading').forEach(h => observer.observe(h));
}

function initTimelineDraw() {
  const lineEl = document.getElementById('timeline-line');
  if (!lineEl) return;
  if (!window.IntersectionObserver) { lineEl.style.height = '100%'; return; }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lineEl.style.height = '100%';
      } else {
        lineEl.style.height = '0%';
      }
    });
  }, { threshold: 0.15 });

  observer.observe(lineEl.parentElement);
}

function initChipStagger() {
  if (!window.IntersectionObserver) {
    document.querySelectorAll('.chip').forEach(c => c.classList.add('chip-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.chip').forEach((chip, i) => {
          setTimeout(() => chip.classList.add('chip-visible'), i * 60);
        });
      } else {
        entry.target.querySelectorAll('.chip').forEach(chip => {
          chip.classList.remove('chip-visible');
        });
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.chip-group').forEach(g => observer.observe(g));
}

function initHeroReveal() {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.reveal-hero, .reveal-hero-item, .reveal-hero-photo').forEach(el => el.classList.add('hero-visible'));
  }));
}

function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const MAX = 6;
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const xRatio = (e.clientX - rect.left)  / rect.width  - 0.5;
      const yRatio = (e.clientY - rect.top)   / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-yRatio * MAX}deg) rotateY(${xRatio * MAX}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

function initCardGlow() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.card-hover').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
      const glow = card.querySelector('.card-glow');
      if (glow) { glow.style.setProperty('--gx', x); glow.style.setProperty('--gy', y); }
    });
  });
}

function initCredentialsDeck() {
  const btnViewAll = document.getElementById('btn-view-all-certs');
  if (btnViewAll) {
    btnViewAll.addEventListener('click', () => {
      openModal(0);
    });
  }
}

let currentModalIndex = 0;

function buildModal() {
  const backdrop  = document.getElementById('modal-backdrop');
  const closeBtn  = document.getElementById('modal-close');
  const prevBtn   = document.getElementById('modal-prev');
  const nextBtn   = document.getElementById('modal-next');
  const imgEl     = document.getElementById('modal-img');
  const titleEl   = document.getElementById('modal-title');
  const labelEl   = document.getElementById('modal-label');

  if (!backdrop) return;

  function render(index) {
    const cred = CREDENTIALS[index];
    currentModalIndex = index;
    imgEl.style.display = '';
    const existingErr = document.getElementById('modal-img-err');
    if (existingErr) existingErr.remove();

    imgEl.src = cred.image;
    imgEl.alt = cred.alt || cred.title;
    titleEl.textContent = cred.title;
    if (labelEl) labelEl.textContent = `${cred.issuer} \u00b7 ${cred.date}`;

    imgEl.onerror = () => {
      imgEl.style.display = 'none';
      const errMsg = document.createElement('p');
      errMsg.id = 'modal-img-err';
      errMsg.className = 'modal-img-error';
      errMsg.textContent = 'Certificate image could not be loaded.';
      imgEl.parentNode.insertBefore(errMsg, imgEl.nextSibling);
    };
  }

  window.openModal = function(index) {
    render(index);
    backdrop.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtn.focus(), 50);
  };

  function closeModal() {
    backdrop.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });

  document.addEventListener('keydown', e => {
    if (backdrop.hasAttribute('hidden')) return;
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      render((currentModalIndex - 1 + CREDENTIALS.length) % CREDENTIALS.length);
    } else if (e.key === 'ArrowRight') {
      render((currentModalIndex + 1) % CREDENTIALS.length);
    }
  });

  prevBtn.addEventListener('click', () => render((currentModalIndex - 1 + CREDENTIALS.length) % CREDENTIALS.length));
  nextBtn.addEventListener('click', () => render((currentModalIndex + 1) % CREDENTIALS.length));
}

function initContactForm() {
  const EMAIL  = 'samruddhiharel@gmail.com';
  const status = document.getElementById('copy-status');

  document.querySelectorAll('[data-copy-email]').forEach(btn => {
    btn.addEventListener('click', async () => {
      let copied = false;
      try {
        await navigator.clipboard.writeText(EMAIL);
        copied = true;
      } catch (e) {
        try {
          const ta = document.createElement('textarea');
          ta.value = EMAIL; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          copied = document.execCommand('copy');
          ta.remove();
        } catch (e2) {}
      }
      const original = btn.textContent;
      btn.textContent = copied ? 'Copied!' : EMAIL;
      if (status) status.textContent = copied ? 'Email address copied' : 'Email: ' + EMAIL;
      setTimeout(() => { btn.textContent = original; }, 2000);
    });
  });
}

function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

function initOrbParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs[0] && (orbs[0].style.transform = `translateY(${y * 0.08}px)`);
    orbs[1] && (orbs[1].style.transform = `translateY(${-y * 0.06}px)`);
    orbs[2] && (orbs[2].style.transform = `translateY(${y * 0.04}px)`);
  }, { passive: true });
}