// script.js — animazioni, form handler, glow interattivo

document.addEventListener('DOMContentLoaded', () => {

  // ---------- NAVBAR ACTIVE LINK ----------
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function setActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink(); // on load

  // ---------- CONTACT FORM (simula invio) ----------
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('⚠️ Compila tutti i campi prima di inviare.');
        return;
      }

      // effetto “invio” con animazione
      const btn = form.querySelector('.btn-submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="btn-text">✓ inviato</span>';
      btn.style.borderColor = '#2ecc71';
      btn.style.boxShadow = '0 0 30px #2ecc7160';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.borderColor = '#3fe0d0';
        btn.style.boxShadow = 'none';
        form.reset();
        alert('📨 Messaggio inviato (simulazione) — Grazie per avermi contattato!');
      }, 1800);
    });
  }

  // ---------- ANIMAZIONE GLITCH SOTTILE (effetto hover su titolo) ----------
  const glitch = document.querySelector('.glitch-text');
  if (glitch) {
    glitch.addEventListener('mouseenter', () => {
      glitch.style.textShadow = '0 0 30px #3fe0d0, 0 0 80px #3fe0d080, 0 0 120px #ff6b8a40';
    });
    glitch.addEventListener('mouseleave', () => {
      glitch.style.textShadow = '0 0 20px #3fe0d080, 0 0 60px #3fe0d030';
    });
  }

  // ---------- TERMINAL CURSOR BLINK (già in css) ----------

  // ---------- (opzionale) piccolo effetto “digitazione” su hero description ----------
  const editable = document.getElementById('editable-text');
  if (editable) {
    // se l'utente clicca fuori, non perde lo stile
    editable.addEventListener('blur', () => {
      // mantiene il contenuto
    });
  }

  // ---------- RANDOM TAGS HOVER GLOW ----------
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 0 20px #3fe0d070';
    });
    tag.addEventListener('mouseleave', function() {
      this.style.boxShadow = '0 0 4px #2d455560';
    });
  });

  console.log('🐧 cyber.cv — ready.');
});

// Inserisci l'URL completo del tuo progetto Vercel
const VERCEL_API_URL = "https://cyberstudent.vercel.app/";

async function caricaDati() {
  try {
    const response = await fetch(VERCEL_API_URL);
    
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }

    const utenti = await response.json();
    console.log('Dati ricevuti da Vercel:', utenti);

    // Esempio: Inserisci i dati all'interno del terminale HTML
    const outputTerminal = document.querySelector('.terminal-body');
    if (outputTerminal && utenti.length > 0) {
      utenti.forEach(utente => {
        const p = document.createElement('p');
        p.className = 'output';
        p.textContent = `Utente trovato: ID ${utente.id} - Nome: ${utente.nome || 'N/D'}`;
        outputTerminal.appendChild(p);
      });
    }

  } catch (error) {
    console.error('Impossibile recuperare i dati:', error);
  }
}

// Avvia la chiamata al caricamento della pagina
document.addEventListener('DOMContentLoaded', caricaDati);

/* deploy delle informazioni dal form */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnSubmit = contactForm.querySelector('.btn-submit');
      const btnText = contactForm.querySelector('.btn-text');
      
      // Prendi i valori dagli input di contact.html
      const nome = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const messaggio = document.getElementById('message').value.trim();

      // Disabilita il pulsante durante l'invio
      btnSubmit.disabled = true;
      btnText.textContent = 'invio in corso...';

      try {
        const response = await fetch('https://cyberstudent.vercel.app/api/contact/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nome, email, messaggio }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Messaggio inviato con successo!');
          contactForm.reset();
        } else {
          alert(`Errore nell'invio: ${data.error}`);
        }
      } catch (error) {
        console.error('Errore durante l\'invio:', error);
        alert('Si è verificato un errore di rete.');
      } finally {
        btnSubmit.disabled = false;
        btnText.textContent = 'invia';
      }
    });
  }
});