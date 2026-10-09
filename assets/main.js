/* =========================================================
   TAILWIND CONFIGURATION
   (Memastikan konfigurasi tema aktif tanpa inline script)
   ========================================================= */
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          base: 'var(--bg)',
          ink: 'var(--ink)',
          muted: 'var(--muted)',
          accent: 'var(--accent)',
          amber: 'var(--amber)',
        },
        fontFamily: {
          display: ['Space Grotesk', 'sans-serif'],
          body: ['IBM Plex Sans', 'sans-serif'],
        },
      },
    },
  };
}

/* =========================================================
   UTILITAS & NAVIGASI
   ========================================================= */

// Buka/tutup sidebar di layar kecil (semua halaman admin)
function initSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const openBtn = document.getElementById('sidebar-open');
  const closeBtn = document.getElementById('sidebar-close');
  if (!sidebar || !overlay || !openBtn) return;

  const open = () => {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  };
  const close = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  };

  openBtn.addEventListener('click', open);
  overlay.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
}

// Tampilkan/sembunyikan isi input password (di halaman login)
function initPasswordToggle() {
  const btn = document.getElementById('toggle-password');
  const input = document.getElementById('password');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    btn.textContent = isHidden ? 'Sembunyikan' : 'Tampilkan';
  });
}

// Pratinjau gambar yang dipilih lewat <input type="file"> tanpa upload sungguhan
function initImagePreview(inputId, imgId) {
  const input = document.getElementById(inputId);
  const img = document.getElementById(imgId);
  if (!input || !img) return;

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Otomatis inisialisasi semua input gambar yang ada di halaman
function initImagePreviews() {
  initImagePreview('avatar-upload', 'avatar-preview');
  initImagePreview('portfolio-image-upload', 'portfolio-image-preview');
  initImagePreview('modal-image-upload', 'modal-image-preview');
}

// Hapus kartu/baris dari daftar setelah konfirmasi (dipakai di halaman kelola portfolio & FAQ)
function initDeleteButtons() {
  document.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-item]');
      if (!card) return;
      if (confirm('Hapus item ini?')) {
        card.remove();
      }
    });
  });
}

// Otomatisasi form-form dashboard (tambah/edit portfolio & FAQ) tanpa inline script
function initDashboardForms() {
  // 1. Form Portfolio
  const portfolioForm = document.getElementById('portfolio-form');
  if (portfolioForm) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit')) {
      document.title = 'Edit Proyek — Admin';
      const pageTitle = document.getElementById('page-title');
      const pageSubtitle = document.getElementById('page-subtitle');
      if (pageTitle) pageTitle.textContent = 'Edit Data Proyek';
      if (pageSubtitle) pageSubtitle.textContent = 'Perbarui detail dan tautan karya proyek Anda.';

      const judul = document.getElementById('judul_proyek');
      const link = document.getElementById('link_proyek');
      const tags = document.getElementById('tags_proyek');
      const desc = document.getElementById('deskripsi_proyek');
      const imgPrev = document.getElementById('portfolio-image-preview');

      if (judul) judul.value = 'Sentinel Earth — Prediksi Bencana';
      if (link) link.value = 'https://github.com/example/sentinel-earth';
      if (tags) tags.value = 'FastAPI, XGBoost, CNN';
      if (desc) desc.value = 'Proyek Prototipe dengan FastAPI dan CNN untuk klasifikasi infrasound dan risiko bencana alam secara real-time.';
      if (imgPrev) imgPrev.src = 'https://placehold.co/300x300/e2e8f0/1e293b?text=AI';
    }

    portfolioForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Data proyek berhasil disimpan!');
      window.location.href = 'portfolio.html';
    });
  }

  // 2. Form FAQ
  const faqForm = document.getElementById('faq-form');
  if (faqForm) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit')) {
      document.title = 'Edit FAQ — Admin';
      const pageTitle = document.getElementById('page-title');
      const pageSubtitle = document.getElementById('page-subtitle');
      if (pageTitle) pageTitle.textContent = 'Edit Data FAQ';
      if (pageSubtitle) pageSubtitle.textContent = 'Perbarui teks pertanyaan atau jawaban FAQ.';

      const tanya = document.getElementById('pertanyaan');
      const jawab = document.getElementById('jawaban');
      if (tanya) tanya.value = 'Sehari butuh berapa gelas kopi kalo lagi ngoding?';
      if (jawab) jawab.value = 'mungkin 4-6 gelas kopi tanpa gula :)';
    }

    faqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Data FAQ berhasil disimpan!');
      window.location.href = 'faq.html';
    });
  }
}

// Dark/Light mode
function switchTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const darkIcon = document.getElementById('theme-toggle-dark-icon');
  const lightIcon = document.getElementById('theme-toggle-light-icon');

  if (!themeToggleBtn || !darkIcon || !lightIcon) return;

  // Fungsi internal untuk update icon & class di body
  const updateUI = (isDark) => {
    if (isDark) {
      document.body.classList.add('dark');
      lightIcon.classList.remove('hidden');
      darkIcon.classList.add('hidden');
    } else {
      document.body.classList.remove('dark');
      darkIcon.classList.remove('hidden');
      lightIcon.classList.add('hidden');
    }
  };

  // 1. Cek state awal dari localStorage atau OS
  const savedTheme = localStorage.getItem('color-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

  updateUI(initialDark);

  // 2. Pasang Event Listener Klik
  themeToggleBtn.onclick = function (e) {
    e.preventDefault();
    const isDark = document.body.classList.toggle('dark');
    updateUI(isDark);
    localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
  };
}

// penghilang tombol ke login page admin
function initHiddenAdminTrigger() {
  const adminBtn = document.getElementById('admin-trigger');
  if (!adminBtn) return;

  let clickCount = 0;
  let clickTimer = null;

  // Mendengarkan klik di mana saja pada dokumen
  document.addEventListener('click', (e) => {
    // Jika tombol sudah muncul, abaikan logika penghitung
    if (!adminBtn.classList.contains('hidden')) return;

    clickCount++;

    // Reset hitungan jika jeda antar klik lebih dari 1.5 detik
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, 1500);

    // Jika sudah diklik 5x secara beruntun
    if (clickCount >= 5) {
      adminBtn.classList.remove('hidden'); // Munculkan tombol
      clickCount = 0;
      clearTimeout(clickTimer);
    }
  });
}

/* =========================================================
   CHATBOT & TANYA AI (PAGE & WIDGET ENGINE)
   ========================================================= */
function initChatbot() {
  const messagesContainer = document.getElementById('chatbot-messages');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');

  // Jika halaman tidak memiliki container chatbot, lewati
  if (!messagesContainer || !form) return;

  // Elemen popup toggle (jika ada widget collapse)
  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const chatWindow = document.getElementById('chatbot-window');
  const collapseBtn = document.getElementById('chatbot-collapse-btn');
  const iconOpen = document.getElementById('chatbot-icon-open');
  const iconClose = document.getElementById('chatbot-icon-close');
  const toggleText = document.getElementById('chatbot-toggle-text');

  if (toggleBtn && chatWindow) {
    let isOpen = false;
    const setChatState = (open) => {
      isOpen = open;
      if (isOpen) {
        chatWindow.classList.remove('hidden');
        chatWindow.classList.add('flex');
        if (iconOpen) iconOpen.classList.add('hidden');
        if (iconClose) iconClose.classList.remove('hidden');
        if (toggleText) toggleText.textContent = 'Tutup';
        if (input) input.focus();
        scrollBottom();
      } else {
        chatWindow.classList.add('hidden');
        chatWindow.classList.remove('flex');
        if (iconOpen) iconOpen.classList.remove('hidden');
        if (iconClose) iconClose.classList.add('hidden');
        if (toggleText) toggleText.textContent = 'Tanya AI';
      }
    };

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setChatState(!isOpen);
    });

    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setChatState(false);
      });
    }
  }

  const scrollBottom = () => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  };

  const appendUserMessage = (text) => {
    const bubble = document.createElement('div');
    bubble.className = 'flex justify-end';
    bubble.innerHTML = `
      <div class="border-2 border-black bg-yellow-200 p-2.5 sm:p-3 shadow-[2px_2px_0_0] shadow-black max-w-[85%] text-black dark:border-[#282d3c] dark:bg-yellow-500/90 dark:text-black dark:shadow-[#000000]">
        <p class="leading-relaxed break-words">${escapeHTML(text)}</p>
      </div>
    `;
    messagesContainer.appendChild(bubble);
    scrollBottom();
  };

  const parseMarkdown = (md) => {
    if (!md) return '';

    // 1. Ekstrak code blocks dan amankan agar tidak terpengaruh format inline
    const codeBlocks = [];
    let html = md.replace(/```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
      const placeholder = `TOKENCODE${codeBlocks.length}TOKEN`;
      const escapedCode = code.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      codeBlocks.push(
        `<pre class="my-2 p-2.5 bg-gray-900 text-gray-100 dark:bg-black rounded border-2 border-black dark:border-[#282d3c] overflow-x-auto text-xs font-mono"><code>${escapedCode}</code></pre>`
      );
      return placeholder;
    });

    // 2. Heading (# H1, ## H2, ### H3, #### H4)
    html = html.replace(/^####\s+(.*?)$/gm, '<h4 class="font-display font-bold text-xs mt-2 mb-1 text-ink">$1</h4>');
    html = html.replace(/^###\s+(.*?)$/gm, '<h3 class="font-display font-bold text-sm mt-2.5 mb-1 text-ink">$1</h3>');
    html = html.replace(/^##\s+(.*?)$/gm, '<h2 class="font-display font-bold text-base mt-3 mb-1 text-ink border-b border-black/10 dark:border-white/10 pb-1">$1</h2>');
    html = html.replace(/^#\s+(.*?)$/gm, '<h1 class="font-display font-bold text-lg mt-3 mb-1.5 text-ink border-b-2 border-black/20 dark:border-white/20 pb-1">$1</h1>');

    // 3. Blockquote (> kutipan)
    html = html.replace(/^>\s+(.*?)$/gm, '<blockquote class="border-l-4 border-yellow-400 pl-2.5 my-2 italic text-ink/85">$1</blockquote>');

    // 4. Horizontal Rule (---, ***, ___)
    html = html.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr class="my-2.5 border-t border-black/20 dark:border-white/20" />');

    // 5. Inline Code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-yellow-100 text-black dark:bg-[#282d3c] dark:text-yellow-300 font-mono text-xs border border-black/20">$1</code>');

    // 6. Format Teks (Bold, Italic, Strikethrough)
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-ink">$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong class="font-bold text-ink">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em class="italic">$1</em>');
    html = html.replace(/~~(.*?)~~/g, '<del class="line-through text-ink/70">$1</del>');

    // 7. Links ([text](url))
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline font-bold text-blue-600 hover:text-blue-800 dark:text-yellow-400 dark:hover:text-yellow-300">$1</a>');

    // 8. Lists (Unordered & Ordered)
    html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
    html = html.replace(/((?:<li class="ml-4 list-disc">[\s\S]*?<\/li>\n?)+)/g, '<ul class="my-2 space-y-0.5">$1</ul>');
    html = html.replace(/((?:<li class="ml-4 list-decimal">[\s\S]*?<\/li>\n?)+)/g, '<ol class="my-2 space-y-0.5">$1</ol>');

    // 9. Paragraf & Baris Baru
    const blocks = html.split(/\n{2,}/);
    html = blocks.map((b) => {
      b = b.trim();
      if (!b) return '';
      if (/^<(h[1-6]|pre|ul|ol|blockquote|hr|TOKENCODE)/.test(b)) {
        return b;
      }
      return `<p class="leading-relaxed my-1">${b.replace(/\n/g, '<br />')}</p>`;
    }).filter(Boolean).join('\n');

    // 10. Kembalikan code blocks yang disimpan
    codeBlocks.forEach((block, i) => {
      html = html.replace(`TOKENCODE${i}TOKEN`, block);
    });

    return html;
  };

  const appendBotMessage = (text) => {
    const bubble = document.createElement('div');
    bubble.className = 'flex items-start gap-3';
    bubble.innerHTML = `
      <div class="shrink-0 w-8 h-8 rounded-full border-2 border-black bg-yellow-200 flex items-center justify-center text-xs font-bold dark:border-[#282d3c] text-ink">
        AI
      </div>
      <div class="border-2 border-black bg-white p-3 sm:p-4 shadow-[3px_3px_0_0] shadow-black max-w-[88%] text-ink dark:bg-[#1e222d] dark:border-[#282d3c] dark:shadow-[#000000] text-sm overflow-hidden">
        <div class="chatbot-prose leading-relaxed break-words">${parseMarkdown(text)}</div>
      </div>
    `;
    messagesContainer.appendChild(bubble);
    scrollBottom();
  };

  const getBotResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('keahlian') || q.includes('skill') || q.includes('teknologi') || q.includes('stack')) {
      return `### Keahlian & Teknologi
Berikut adalah tools dan teknologi utama yang saya gunakan sehari-hari:
- **Backend**: Laravel, PHP Modern, RESTful API
- **Frontend**: Tailwind CSS, Alpine.js, JavaScript
- **Database**: MySQL, PostgreSQL
- **DevOps/Tools**: Git, Linux Environment, Docker

Ingin tahu lebih banyak tentang proyek yang telah diselesaikan? Coba tanyakan *"Lihat proyek portofolio"*.`;
    }
    if (q.includes('proyek') || q.includes('portofolio') || q.includes('karya') || q.includes('project')) {
      return `### Proyek Pilihan
Beberapa proyek yang pernah saya kerjakan:
1. **Sentinel Earth** — Sistem cerdas pemantau & klasifikasi risiko bencana alam berbasis FastAPI & CNN.
2. **GosGodinov POS** — Aplikasi Point of Sales modern untuk manajemen transaksi kasir toko.

Kamu bisa membuka halaman [Portofolio Saya](portfolio.html) untuk melihat preview dan detail lengkapnya!`;
    }
    if (q.includes('kontak') || q.includes('hubungi') || q.includes('email') || q.includes('sosial') || q.includes('sosmed')) {
      return `### Hubungi Saya
Silakan hubungi saya melalui saluran berikut:
- **Email**: [emailmu@domain.com](mailto:emailmu@domain.com)
- **GitHub**: [github.com/username](https://github.com/username)
- **Instagram**: [instagram.com/username](https://instagram.com/username)
- **X (Twitter)**: [x.com/username](https://x.com/username)

Saya selalu terbuka untuk diskusi proyek baru dan kolaborasi!`;
    }
    if (q.includes('kopi') || q.includes('ngoding') || q.includes('minum')) {
      return `> *"mungkin 4-6 gelas kopi tanpa gula :)"* ☕

Formula rahasia saat ngoding berjam-jam untuk menumpas bug!`;
    }
    if (q.includes('halo') || q.includes('hai') || q.includes('hi') || q.includes('siapa')) {
      return `Halo! 👋 Saya adalah **Asisten AI** di web profil ini.

Saya bisa membantu menjawab seputar:
- Keahlian teknis & teknologi
- Proyek dan karya portofolio
- Informasi kontak & media sosial

Ada yang ingin kamu tanyakan?`;
    }
    if (q.includes('terima kasih') || q.includes('makasih') || q.includes('thanks')) {
      return `Sama-sama! Senang bisa membantu. Jangan ragu bertanya lagi jika butuh info lainnya ya! 🙌`;
    }
    // Jika user menguji format markdown secara langsung
    if (query.startsWith('#') || query.includes('```') || query.includes('**')) {
      return `### Pratinjau Markdown
Berikut hasil parsing dari teks yang kamu masukkan:

${query}`;
    }
    return `Terima kasih atas pertanyaannya!

Kamu bisa menelusuri halaman [Portofolio](portfolio.html) untuk melihat karya saya, atau langsung menghubungi lewat [emailmu@domain.com](mailto:emailmu@domain.com).`;
  };

  const handleSend = (text) => {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();
    appendUserMessage(cleanText);

    // Tampilkan animasi mengetik sementara
    const typingId = 'typing-' + Date.now();
    const typingEl = document.createElement('div');
    typingEl.id = typingId;
    typingEl.className = 'flex items-start gap-2 text-xs text-black/60 dark:text-gray-400 italic pl-11';
    typingEl.textContent = 'AI sedang mengetik...';
    messagesContainer.appendChild(typingEl);
    scrollBottom();

    setTimeout(() => {
      const el = document.getElementById(typingId);
      if (el) el.remove();
      appendBotMessage(getBotResponse(cleanText));
    }, 600);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input) return;
    const val = input.value;
    input.value = '';
    handleSend(val);
  });

  // Quick suggestion chips
  document.querySelectorAll('.chatbot-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const text = chip.textContent.trim();
      handleSend(text);
    });
  });
}

/* =========================================================
   INISIALISASI SEMUA KOMPONEN
   ========================================================= */
function initAll() {
  initSidebarToggle();
  initPasswordToggle();
  initImagePreviews();
  initDeleteButtons();
  initDashboardForms();
  switchTheme();
  initHiddenAdminTrigger();
  initChatbot();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
