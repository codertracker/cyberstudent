/**
 * terminal.js — Interactive Terminal Engine for gm.sec
 * Replaces the static hero terminal with a fully interactive, typeable shell.
 * Features: command history, blinking cursor, Easter Eggs, mobile-friendly.
 */

'use strict';

(function initTerminal() {
  const terminalBody = document.getElementById('hero-terminal');
  if (!terminalBody) return;

  // ── State ──────────────────────────────────────────────────────
  const history = [];
  let historyIndex = -1;

  // ── Welcome banner (preserves the original static lines) ──────
  const welcomeLines = [
    { type: 'cmd', prompt: '➜', text: 'whoami' },
    { type: 'output', text: 'gian_marco_brandoli' },
    { type: 'cmd', prompt: '➜', text: 'cat /etc/role' },
    { type: 'output', text: 'Security Researcher · Linux Developer' },
    { type: 'cmd', prompt: '➜', text: 'uname -r' },
    { type: 'output', text: 'Linux cyberbox 7.2-arch · GNU/Linux x86_64' },
    { type: 'cmd', prompt: '➜', text: 'type "help" to explore · interactive mode' },
  ];

  // ── Command Map ────────────────────────────────────────────────
  const commands = {
    help: () => [
      '<span class="help-header">╔══════════════════════════════════════╗</span>',
      '<span class="help-header">║   gm.sec — Comandi Disponibili      ║</span>',
      '<span class="help-header">╚══════════════════════════════════════╝</span>',
      '',
      '  <span class="cmd-name">help</span>        <span class="cmd-desc">Mostra questo messaggio di aiuto</span>',
      '  <span class="cmd-name">whoami</span>      <span class="cmd-desc">Info sul profilo di Gian Marco</span>',
      '  <span class="cmd-name">skills</span>      <span class="cmd-desc">Competenze tecniche formattate</span>',
      '  <span class="cmd-name">projects</span>    <span class="cmd-desc">Vai alla pagina progetti</span>',
      '  <span class="cmd-name">writeups</span>    <span class="cmd-desc">Vai alla sezione writeup & blog</span>',
      '  <span class="cmd-name">homelab</span>     <span class="cmd-desc">Specifiche del setup homelab</span>',
      '  <span class="cmd-name">socials</span>     <span class="cmd-desc">Link ai profili social</span>',
      '  <span class="cmd-name">contact</span>     <span class="cmd-desc">Vai alla pagina contatti</span>',
      '  <span class="cmd-name">clear</span>       <span class="cmd-desc">Pulisce il terminale</span>',
      '  <span class="cmd-name">date</span>        <span class="cmd-desc">Data e ora attuali</span>',
      '  <span class="cmd-name">uptime</span>      <span class="cmd-desc">Tempo online del sito</span>',
      '',
      '  <span class="easter-hint">🥚 Prova qualche comando segreto…</span>',
    ],

    whoami: () => [
      '',
      '  <span class="accent-amber">┌─ Profilo ─────────────────────────────┐</span>',
      '  <span class="accent-amber">│</span>  Nome     : <strong>Gian Marco Brandoli</strong>',
      '  <span class="accent-amber">│</span>  Ruolo    : Security Researcher · Linux Dev',
      '  <span class="accent-amber">│</span>  Studi    : Sicurezza Informatica',
      '  <span class="accent-amber">│</span>  Location : Italia 🇮🇹',
      '  <span class="accent-amber">│</span>  Focus    : Red Teaming · CTF · Open Source',
      '  <span class="accent-amber">└───────────────────────────────────────┘</span>',
      '',
    ],

    skills: () => [
      '',
      '  <span class="accent-teal">$ ls -la ~/skills/</span>',
      '',
      '  drwxr-xr-x  <span class="accent-amber">python/</span>          [ ████████░░ ] avanzato',
      '  drwxr-xr-x  <span class="accent-amber">bash-scripting/</span>  [ ████████░░ ] avanzato',
      '  drwxr-xr-x  <span class="accent-amber">linux-sysadmin/</span>  [ █████████░ ] avanzato',
      '  drwxr-xr-x  <span class="accent-amber">cybersecurity/</span>   [ ███████░░░ ] in crescita',
      '  drwxr-xr-x  <span class="accent-amber">networking/</span>      [ ██████░░░░ ] intermedio',
      '  drwxr-xr-x  <span class="accent-amber">docker/</span>          [ ███████░░░ ] avanzato',
      '  drwxr-xr-x  <span class="accent-amber">web-dev/</span>         [ ██████░░░░ ] intermedio',
      '',
    ],

    projects: () => {
      setTimeout(() => {
        window.location.href = window.location.pathname.includes('/pages/')
          ? 'projects.html'
          : 'pages/projects.html';
      }, 600);
      return [
        '',
        '  <span class="accent-teal">⏳ Reindirizzamento a ~/projects/ ...</span>',
        '',
      ];
    },

    writeups: () => {
      setTimeout(() => {
        window.location.href = window.location.pathname.includes('/pages/')
          ? 'writeups.html'
          : 'pages/writeups.html';
      }, 600);
      return [
        '',
        '  <span class="accent-teal">⏳ Reindirizzamento a ~/writeups/ ...</span>',
        '',
      ];
    },

    contact: () => {
      setTimeout(() => {
        window.location.href = window.location.pathname.includes('/pages/')
          ? 'contact.html'
          : 'pages/contact.html';
      }, 600);
      return [
        '',
        '  <span class="accent-teal">⏳ Reindirizzamento a ~/contact/ ...</span>',
        '',
      ];
    },

    homelab: () => [
      '',
      '  <span class="accent-amber">┌─ Homelab ElerNode ─────────────────────┐</span>',
      '  <span class="accent-amber">│</span>',
      '  <span class="accent-amber">│</span>  🖥️  <strong>Host</strong>       : Custom Build x86_64',
      '  <span class="accent-amber">│</span>  🧠  <strong>Hypervisor</strong>  : Proxmox VE 8.x',
      '  <span class="accent-amber">│</span>  🐧  <strong>OS</strong>          : Rocky Linux 10 (RHEL-compat)',
      '  <span class="accent-amber">│</span>  🐳  <strong>Containers</strong>  : Docker · Podman',
      '  <span class="accent-amber">│</span>  🌐  <strong>Reverse Proxy</strong>: Nginx Proxy Manager',
      '  <span class="accent-amber">│</span>  🔒  <strong>Tunnel</strong>      : Cloudflare (cloudflared)',
      '  <span class="accent-amber">│</span>  ☸️  <strong>Orchestrator</strong>: Kubernetes (WIP)',
      '  <span class="accent-amber">│</span>  💾  <strong>Backup</strong>      : Cron + rsync + remote storage',
      '  <span class="accent-amber">│</span>',
      '  <span class="accent-amber">└────────────────────────────────────────┘</span>',
      '',
    ],

    socials: () => [
      '',
      '  <span class="accent-teal">🔗 Link Profili:</span>',
      '',
      '  <a href="https://github.com/codertracker" target="_blank" rel="noopener" class="terminal-link">🐙 GitHub     → github.com/codertracker</a>',
      '  <a href="https://linkedin.com" target="_blank" rel="noopener" class="terminal-link">💼 LinkedIn   → linkedin.com</a>',
      '',
    ],

    clear: () => {
      // Special: handled directly
      return null;
    },

    date: () => {
      const now = new Date();
      const formatted = now.toLocaleString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      return ['', `  ${formatted}`, ''];
    },

    uptime: () => {
      const start = new Date('2026-01-01T00:00:00');
      const now = new Date();
      const diff = now - start;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return [
        '',
        `  <span class="accent-teal">up ${days} days, ${hours}:${String(mins).padStart(2, '0')}</span>`,
        `  <span class="text-muted">load average: 0.42, 0.38, 0.31</span>`,
        '',
      ];
    },

    // ── Easter Eggs ─────────────────────────────────────────────
    'sudo rm -rf /': () => [
      '',
      '  <span class="accent-rose">🛡️ [SECURITY ALERT] Access Denied!</span>',
      '  <span class="accent-rose">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>',
      '  <span class="text-muted">Incident ID  : #SEC-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '</span>',
      '  <span class="text-muted">Timestamp    : ' + new Date().toISOString() + '</span>',
      '  <span class="text-muted">Action       : Destructive command intercepted</span>',
      '  <span class="text-muted">Status       : Evento registrato nel SOC 🏴‍☠️</span>',
      '  <span class="accent-rose">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>',
      '  <span class="accent-amber">Nice try. Il tuo IP è stato loggato. 😏</span>',
      '',
    ],

    flag: () => [
      '',
      '  <span class="accent-teal">🏁 Congratulazioni, hai trovato l\'Easter Egg!</span>',
      '',
      '  <span class="flag-text">FLAG{gm_sec_c0d3_3xpl0r3r_2026}</span>',
      '',
      '  <span class="text-muted">Invia questa flag a gm.sec per un achievement speciale 🎖️</span>',
      '',
    ],

    'cat flag.txt': () => commands.flag(),

    'cat /etc/passwd': () => [
      '',
      '  root:x:0:0:root:/root:/bin/bash',
      '  gm:x:1000:1000:Gian Marco Brandoli:/home/gm:/bin/zsh',
      '  <span class="accent-amber">... nice try, hacker 😎</span>',
      '',
    ],

    'cat /etc/shadow': () => [
      '',
      '  <span class="accent-rose">🔒 Permission denied: cannot read /etc/shadow</span>',
      '  <span class="text-muted">Tip: hai provato "sudo rm -rf /" ? (scherzo 🙃)</span>',
      '',
    ],

    neofetch: () => [
      '',
      '  <span class="accent-teal">        .-/+oossssoo+/-.</span>',
      '  <span class="accent-teal">    .:+ssssssssssssssssss+:.</span>       <strong>gm@cyberbox</strong>',
      '  <span class="accent-teal">  -+ssssssssssssssssssyyssss+-</span>     ──────────────',
      '  <span class="accent-teal">.ossssssssssssssssss</span><span class="accent-amber">dMMMNy</span><span class="accent-teal">sssso.</span>    OS: CyberOS 7.2 x86_64',
      '  <span class="accent-teal">/sssssssssss</span><span class="accent-amber">hdmmNNmmyNMMMMh</span><span class="accent-teal">ssss/</span>    Host: gm.sec portfolio',
      '  <span class="accent-teal">+sssssssss</span><span class="accent-amber">hm</span><span class="accent-teal">yd</span><span class="accent-amber">MMMMMMMNo</span><span class="accent-teal">ssssss+</span>    Kernel: 6.8.0-custom',
      '  <span class="accent-teal">/ssssssss</span><span class="accent-amber">hNMMM</span><span class="accent-teal">yh</span><span class="accent-amber">hyyyyhmNMMMNh</span><span class="accent-teal">sss/</span>    Shell: zsh 5.9',
      '  <span class="accent-teal">.ssssssss</span><span class="accent-amber">dMMMNh</span><span class="accent-teal">ssssssssss</span><span class="accent-amber">hNMMMd</span><span class="accent-teal">ss.</span>    Terminal: gm-terminal',
      '  <span class="accent-teal">+ssss</span><span class="accent-amber">hhhyNMMNy</span><span class="accent-teal">ssssssssssss</span><span class="accent-amber">yNMMMy</span><span class="accent-teal">s+</span>    CPU: Coffee (∞ cores)',
      '  <span class="accent-teal">oss</span><span class="accent-amber">yNMMMNyMMh</span><span class="accent-teal">ssssssssssssss</span><span class="accent-amber">hmmmh</span><span class="accent-teal">so</span>    Memory: ∞ / ∞ MB',
      '',
    ],

    matrix: () => {
      // Fun: apply matrix effect to terminal temporarily
      terminalBody.classList.add('matrix-effect');
      setTimeout(() => terminalBody.classList.remove('matrix-effect'), 3000);
      return [
        '',
        '  <span class="accent-teal">Wake up, Neo...</span>',
        '  <span class="accent-teal">The Matrix has you...</span>',
        '  <span class="accent-teal">Follow the white rabbit. 🐇</span>',
        '',
      ];
    },

    exit: () => [
      '',
      '  <span class="accent-amber">Non puoi uscire. Questo è il tuo destino. 🖥️</span>',
      '  <span class="text-muted">( processo PID 1 — immortale )</span>',
      '',
    ],

    hack: () => [
      '',
      '  <span class="accent-rose">⚠️  ATTENZIONE: Accesso non autorizzato rilevato!</span>',
      '  <span class="text-muted">... sto scherzando. Ma seriamente, studia prima. 📚</span>',
      '  <span class="accent-teal">→ Prova: skills</span>',
      '',
    ],
  };

  // ── Render Engine ──────────────────────────────────────────────

  function renderWelcome() {
    terminalBody.innerHTML = '';
    welcomeLines.forEach((line) => {
      const p = document.createElement('p');
      if (line.type === 'cmd') {
        p.innerHTML = `<span class="prompt">${line.prompt}</span> <span class="cmd">${line.text}</span>`;
      } else {
        p.className = 'output';
        p.textContent = line.text;
      }
      terminalBody.appendChild(p);
    });
    appendInputLine();
  }

  function appendOutputLines(lines) {
    lines.forEach((line) => {
      const p = document.createElement('p');
      p.className = 'output terminal-output-line';
      p.innerHTML = line;
      terminalBody.appendChild(p);
    });
  }

  function appendInputLine() {
    // Remove any existing input lines
    const existing = terminalBody.querySelector('.terminal-input-line');
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.className = 'terminal-input-line';
    wrapper.innerHTML = `
      <span class="prompt">➜</span>
      <span class="input-display"></span><span class="terminal-caret">_</span>
    `;
    terminalBody.appendChild(wrapper);

    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function getCurrentInput() {
    const display = terminalBody.querySelector('.terminal-input-line .input-display');
    return display ? display.textContent : '';
  }

  function setCurrentInput(value) {
    const display = terminalBody.querySelector('.terminal-input-line .input-display');
    if (display) display.textContent = value;
  }

  function executeCommand(rawInput) {
    const input = rawInput.trim();
    if (!input) {
      appendInputLine();
      return;
    }

    // Add to history
    history.push(input);
    historyIndex = history.length;

    // Remove the input line and show it as executed command
    const inputLine = terminalBody.querySelector('.terminal-input-line');
    if (inputLine) inputLine.remove();

    const cmdLine = document.createElement('p');
    cmdLine.innerHTML = `<span class="prompt">➜</span> <span class="cmd">${escapeHtml(input)}</span>`;
    terminalBody.appendChild(cmdLine);

    // Handle clear specially
    if (input.toLowerCase() === 'clear') {
      renderWelcome();
      return;
    }

    // Find command handler
    const handler = commands[input] || commands[input.toLowerCase()];
    if (handler) {
      const output = handler();
      if (output && Array.isArray(output)) {
        appendOutputLines(output);
      }
    } else {
      appendOutputLines([
        '',
        `  <span class="accent-rose">comando non trovato:</span> ${escapeHtml(input)}`,
        `  <span class="text-muted">Digita <span class="accent-amber">help</span> per la lista comandi.</span>`,
        '',
      ]);
    }

    appendInputLine();
  }

  // ── Input Handling ─────────────────────────────────────────────
  // We listen on the terminal itself and capture keystrokes

  // Make terminal focusable
  terminalBody.setAttribute('tabindex', '0');
  terminalBody.style.outline = 'none';
  terminalBody.style.cursor = 'text';

  // Hidden input for mobile keyboard support
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'text';
  hiddenInput.className = 'terminal-hidden-input';
  hiddenInput.setAttribute('autocomplete', 'off');
  hiddenInput.setAttribute('autocapitalize', 'none');
  hiddenInput.setAttribute('autocorrect', 'off');
  hiddenInput.setAttribute('spellcheck', 'false');
  hiddenInput.setAttribute('aria-label', 'Terminal input');
  terminalBody.parentElement.appendChild(hiddenInput);

  // Focus hidden input on terminal click
  terminalBody.addEventListener('click', () => {
    hiddenInput.focus();
  });

  // Handle keyboard input via hidden input (works on mobile + desktop)
  hiddenInput.addEventListener('input', (e) => {
    const value = hiddenInput.value;
    setCurrentInput(value);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  });

  hiddenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = hiddenInput.value;
      hiddenInput.value = '';
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        const cmd = history[historyIndex];
        hiddenInput.value = cmd;
        setCurrentInput(cmd);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        const cmd = history[historyIndex];
        hiddenInput.value = cmd;
        setCurrentInput(cmd);
      } else {
        historyIndex = history.length;
        hiddenInput.value = '';
        setCurrentInput('');
      }
    }
  });

  // Also allow direct keyboard input on terminal (desktop)
  terminalBody.addEventListener('keydown', (e) => {
    // Redirect focus to hidden input
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      hiddenInput.focus();
    }
  });

  // ── Utilities ──────────────────────────────────────────────────
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ── Initialize ─────────────────────────────────────────────────
  renderWelcome();

  // Add role for accessibility
  terminalBody.setAttribute('role', 'application');
  terminalBody.setAttribute('aria-label', 'Terminale interattivo — scrivi help per i comandi');

  console.log('%c🛡️ gm.sec terminal — interactive mode loaded.', 'color: #85CDCA; font-weight: bold;');
})();
