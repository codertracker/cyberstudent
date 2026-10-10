/**
 * writeups.js — Writeup/Blog renderer for gm.sec
 * Parses YAML frontmatter from embedded writeup data and renders cards.
 * Since this is a static Jamstack site (no build step), writeup data is embedded.
 */

'use strict';

(function initWriteups() {
  const container = document.getElementById('writeups-list');
  const filterContainer = document.getElementById('writeups-filter');
  const countEl = document.getElementById('writeup-count');
  if (!container) return;

  // ── Writeup Data (embedded from content/writeups/*.md frontmatter) ──
  // In a Jamstack setup with a build step, these would be auto-generated.
  // For a pure static site, we embed the metadata here.
  const writeups = [
    {
      slug: 'htb-challenge-1',
      title: 'HackTheBox — Machine Lame',
      date: '2026-09-15',
      category: 'HackTheBox',
      platform: 'HackTheBox',
      difficulty: 'Easy',
      tags: ['linux', 'samba', 'metasploit', 'CVE-2007-2447'],
      excerpt: 'Exploiting Samba 3.0.20 via CVE-2007-2447 (username map script command injection) per ottenere root immediato sulla macchina Lame.',
      file: '../content/writeups/htb-challenge-1.md',
    },
    {
      slug: 'linux-privesc',
      title: 'Linux Privilege Escalation — SUID Binaries',
      date: '2026-10-01',
      category: 'TryHackMe',
      platform: 'TryHackMe',
      difficulty: 'Medium',
      tags: ['linux', 'privilege-escalation', 'SUID', 'red-team'],
      excerpt: 'Analisi completa della privilege escalation su Linux tramite SUID binaries: dal discovery con find alla shell root via GTFOBins e PATH hijacking.',
      file: '../content/writeups/linux-privesc.md',
    },
  ];

  // ── Difficulty badge colors ────────────────────────────────────
  const difficultyConfig = {
    Easy: { class: 'diff-easy', label: 'Easy' },
    Medium: { class: 'diff-medium', label: 'Medium' },
    Hard: { class: 'diff-hard', label: 'Hard' },
  };

  // ── Platform icons ─────────────────────────────────────────────
  const platformIcons = {
    HackTheBox: '🟩',
    TryHackMe: '🔴',
    CTF: '🏁',
    default: '📄',
  };

  // ── Render all writeups ────────────────────────────────────────
  function renderWriteups(filter = 'all') {
    container.innerHTML = '';
    const filtered = filter === 'all'
      ? writeups
      : writeups.filter((w) => w.category.toLowerCase() === filter.toLowerCase());

    if (countEl) {
      countEl.textContent = `${filtered.length} writeup${filtered.length !== 1 ? 's' : ''} trovati`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="writeup-empty">
          <span class="prompt">➜</span> <span class="cmd">ls writeups/${filter}/</span>
          <p class="output">Nessun writeup trovato per questa categoria.</p>
        </div>
      `;
      return;
    }

    filtered.forEach((wu, index) => {
      const card = document.createElement('article');
      card.className = 'writeup-card glass-card reveal';
      card.dataset.category = wu.category.toLowerCase();
      card.style.setProperty('--card-delay', `${index * 0.1}s`);

      const diff = difficultyConfig[wu.difficulty] || difficultyConfig.Easy;
      const icon = platformIcons[wu.platform] || platformIcons.default;
      const dateFormatted = new Date(wu.date).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      card.innerHTML = `
        <div class="writeup-card-header">
          <div class="writeup-platform">
            <span class="platform-icon">${icon}</span>
            <span class="platform-name">${wu.platform}</span>
          </div>
          <span class="difficulty-badge ${diff.class}">${diff.label}</span>
        </div>
        <h3 class="writeup-title">${wu.title}</h3>
        <p class="writeup-excerpt">${wu.excerpt}</p>
        <div class="writeup-tags">
          ${wu.tags.map((t) => `<span class="writeup-tag">#${t}</span>`).join('')}
        </div>
        <div class="writeup-card-footer">
          <span class="writeup-date">📅 ${dateFormatted}</span>
          <a href="${wu.file}" target="_blank" rel="noopener" class="writeup-read-link" id="read-${wu.slug}">
            Leggi writeup <span>→</span>
          </a>
        </div>
      `;

      container.appendChild(card);
    });

    // Trigger reveal animation
    requestAnimationFrame(() => {
      container.querySelectorAll('.writeup-card').forEach((card) => {
        card.classList.add('visible');
      });
    });
  }

  // ── Filter buttons ─────────────────────────────────────────────
  if (filterContainer) {
    // Build unique category list
    const categories = ['all', ...new Set(writeups.map((w) => w.category))];
    filterContainer.innerHTML = '';

    categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat === 'all' ? ' active' : '');
      btn.dataset.filter = cat;
      btn.id = `filter-wu-${cat.toLowerCase().replace(/\s+/g, '-')}`;
      btn.textContent = cat === 'all' ? 'Tutti' : cat;
      filterContainer.appendChild(btn);
    });

    filterContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        filterContainer.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        e.target.classList.add('active');
        renderWriteups(e.target.dataset.filter);
      }
    });
  }

  // ── Init ───────────────────────────────────────────────────────
  renderWriteups();
})();
