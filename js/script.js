/**
 * script.js — Gian Marco Brandoli · gm.sec
 * Handles: scroll-reveal, project filters, detail expand, contact form
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // SCROLL REVEAL
  // ============================================================
  // Observe both .reveal and .reveal-stagger elements
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

  // ============================================================
  // PROJECT FILTER (projects.html)
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectItems.forEach((item) => {
          const category = item.dataset.category;
          const show = filter === 'all' || category === filter;

          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          if (show) {
            item.style.display = 'grid';
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(12px)';
            setTimeout(() => {
              if (item.dataset.category !== filter && filter !== 'all') {
                item.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

  // ============================================================
  // PROJECT EXPAND / COLLAPSE (projects.html)
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
  // CONTACT FORM
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

      // Basic validation
      if (!nome || !email || !messaggio) {
        showNotification('⚠️ Compila tutti i campi obbligatori.', 'warning');
        return;
      }

      if (!isValidEmail(email)) {
        showNotification('⚠️ Inserisci un indirizzo email valido.', 'warning');
        return;
      }

      // UI: loading state
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
          showNotification('✓ Messaggio inviato con successo! Ti risponderò entro 48 ore.', 'success');
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
  // GLITCH HOVER (hero title)
  // ============================================================
  const glitch = document.querySelector('.glitch-text');
  if (glitch) {
    glitch.addEventListener('mouseenter', () => {
      glitch.style.textShadow = '0 0 40px rgba(56,220,195,0.8), 0 0 100px rgba(56,220,195,0.3), 0 0 6px rgba(255,107,138,0.4)';
    });
    glitch.addEventListener('mouseleave', () => {
      glitch.style.textShadow = '';
    });
  }

  // ============================================================
  // FETCH INITIAL DATA (optional health check)
  // ============================================================
  fetch('https://cyberstudent.vercel.app/api/get-data')
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => console.log('[gm.sec] API OK:', data))
    .catch((err) => console.warn('[gm.sec] API unreachable:', err.message));

  console.log('%c🛡️ gm.sec — portfolio loaded.', 'color: #38dcc3; font-weight: bold;');
});

// ============================================================
// UTILITIES
// ============================================================

/**
 * Email validation helper
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Show an in-page notification toast
 * @param {string} message
 * @param {'success'|'warning'|'error'} type
 */
function showNotification(message, type = 'success') {
  // Remove existing toast
  const existing = document.getElementById('gm-toast');
  if (existing) existing.remove();

  const colors = {
    success: { bg: 'rgba(46,204,113,0.15)', border: 'rgba(46,204,113,0.4)', text: '#2ecc71' },
    warning: { bg: 'rgba(240,199,74,0.15)', border: 'rgba(240,199,74,0.4)', text: '#f0c74a' },
    error:   { bg: 'rgba(255,95,109,0.15)', border: 'rgba(255,95,109,0.4)', text: '#ff5f6d' },
  };
  const c = colors[type] || colors.success;

  const toast = document.createElement('div');
  toast.id = 'gm-toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    maxWidth: '360px',
    background: c.bg,
    border: `1px solid ${c.border}`,
    color: c.text,
    padding: '1rem 1.4rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '500',
    zIndex: '9999',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    opacity: '0',
    transform: 'translateY(10px)',
  });

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  // Auto-dismiss after 4.5 s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}