/**
 * script.js — Gian Marco Brandoli · gm.sec
 * Luxury Organic Cyberpunk / Warm Dark / Kernel Glass
 * Features: GSAP ScrollTrigger, Canvas Particle Engine, Project Filtering, Detail Accordion, Contact Form
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. GSAP SCROLLTRIGGER & FALLBACK REVEAL
  // ============================================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Smooth reveal for all .reveal elements
    gsap.utils.toArray('.reveal').forEach((element) => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    // About cards: handled by CSS + IntersectionObserver below (not GSAP)

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetHref = this.getAttribute('href');
        if (targetHref && targetHref !== '#') {
          const target = document.querySelector(targetHref);
          if (target) {
            e.preventDefault();
            gsap.to(window, {
              duration: 1,
              scrollTo: { y: target, offsetY: 70 },
              ease: 'power3.inOut'
            });
          }
        }
      });
    });

  } else {
    // Fallback: IntersectionObserver for reveal
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
    if (revealElements.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );
      revealElements.forEach((el) => observer.observe(el));
    }
  }

  // ============================================================
  // 1b. ABOUT CARDS — CSS + IntersectionObserver (GSAP-independent)
  // ============================================================
  const aboutCards = document.querySelectorAll('.about-card');
  if (aboutCards.length > 0) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('card-visible');
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );
    aboutCards.forEach((card, i) => {
      card.style.setProperty('--card-delay', `${i * 0.13}s`);
      cardObserver.observe(card);
    });
  }

  // ============================================================
  // 2. FLOATING PARTICLES CANVAS SYSTEM
  // ============================================================
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = -1000, mouseY = -1000;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 15;
        this.size = Math.random() * 2 + 0.6;
        this.speedY = Math.random() * 0.45 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.opacity = Math.random() * 0.45 + 0.15;
        this.warmth = Math.random();
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        // Subtle mouse repulsion
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          this.x -= dx * 0.012;
          this.y -= dy * 0.012;
        }

        if (this.y < -10) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        const r = Math.floor(232 * this.warmth + 180 * (1 - this.warmth));
        const g = Math.floor(168 * this.warmth + 140 * (1 - this.warmth));
        const b = Math.floor(124 * this.warmth + 120 * (1 - this.warmth));
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particleCount = window.innerWidth < 768 ? 35 : 65;
    for (let i = 0; i < particleCount; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ============================================================
  // 3. GLITCH TEXT HOVER EFFECT (Hero title)
  // ============================================================
  const glitch = document.querySelector('.glitch-text');
  if (glitch) {
    glitch.addEventListener('mouseenter', () => {
      glitch.style.textShadow = '0 0 35px rgba(232, 168, 124, 0.75), 0 0 70px rgba(133, 205, 202, 0.35), 0 0 6px rgba(195, 141, 158, 0.5)';
    });
    glitch.addEventListener('mouseleave', () => {
      glitch.style.textShadow = '';
    });
  }

  // ============================================================
  // 4. PROJECT FILTER (projects.html)
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectItems.forEach((item) => {
          const category = item.dataset.category;
          const show = filter === 'all' || category === filter;

          item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          if (show) {
            item.style.display = 'grid';
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            setTimeout(() => {
              if (item.dataset.category !== filter && filter !== 'all') {
                item.style.display = 'none';
              }
            }, 350);
          }
        });
      });
    });
  }

  // ============================================================
  // 5. PROJECT DETAILS ACCORDION (projects.html)
  // ============================================================
  const expandBtns = document.querySelectorAll('.btn-expand');

  expandBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const details = document.getElementById(targetId);
      if (!details) return;

      const isOpen = btn.classList.contains('open');

      if (isOpen) {
        details.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        details.classList.add('open');
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ============================================================
  // 6. CONTACT FORM SUBMISSION (contact.html)
  // ============================================================
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnSubmit = contactForm.querySelector('.btn-submit');
      const btnText = contactForm.querySelector('.btn-text');
      const btnIcon = contactForm.querySelector('.btn-icon');

      const nome = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const messaggio = document.getElementById('message')?.value.trim();
      const subject = document.getElementById('subject')?.value.trim() || '';

      if (!nome || !email || !messaggio) {
        showNotification('⚠️ Compila tutti i campi obbligatori.', 'warning');
        return;
      }

      if (!isValidEmail(email)) {
        showNotification('⚠️ Inserisci un indirizzo email valido.', 'warning');
        return;
      }

      btnSubmit.disabled = true;
      btnText.textContent = 'Invio in corso…';
      if (btnIcon) btnIcon.style.opacity = '0';

      try {
        const response = await fetch('https://cyberstudent.vercel.app/api/contact/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, messaggio, subject }),
        });

        if (response.ok) {
          contactForm.reset();
          showNotification('✓ Messaggio inviato con successo! Ti risponderò entro 24–48 ore.', 'success');
        } else {
          const data = await response.json().catch(() => ({}));
          showNotification(`Errore: ${data.error || 'Riprova più tardi.'}`, 'error');
        }
      } catch (err) {
        console.error('[contact] network error:', err);
        showNotification('⚠️ Errore di rete. Controlla la connessione e riprova.', 'error');
      } finally {
        btnSubmit.disabled = false;
        btnText.textContent = 'Invia messaggio';
        if (btnIcon) btnIcon.style.opacity = '1';
      }
    });
  }

  // ============================================================
  // 7. API HEALTH CHECK
  // ============================================================
  fetch('https://cyberstudent.vercel.app/api/get-data')
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => console.log('[gm.sec] API Status OK:', data))
    .catch((err) => console.warn('[gm.sec] API check skipped:', err.message));

  console.log('%c🛡️ gm.sec — system online. Theme: Organic Kernel Glass.', 'color: #E8A87C; font-weight: bold;');
});

// ============================================================
// UTILITIES
// ============================================================
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = 'success') {
  const existing = document.getElementById('gm-toast');
  if (existing) existing.remove();

  const colors = {
    success: { bg: 'rgba(26, 20, 18, 0.9)', border: 'rgba(133, 205, 202, 0.5)', text: '#85CDCA' },
    warning: { bg: 'rgba(26, 20, 18, 0.9)', border: 'rgba(232, 168, 124, 0.5)', text: '#E8A87C' },
    error:   { bg: 'rgba(26, 20, 18, 0.9)', border: 'rgba(195, 141, 158, 0.5)', text: '#C38D9E' },
  };
  const c = colors[type] || colors.success;

  const toast = document.createElement('div');
  toast.id = 'gm-toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    maxWidth: '380px',
    background: c.bg,
    border: `1px solid ${c.border}`,
    color: c.text,
    padding: '1rem 1.4rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '500',
    zIndex: '99999',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
    transition: 'opacity 0.35s ease, transform 0.35s ease',
    opacity: '0',
    transform: 'translateY(15px)',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}