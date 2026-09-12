/* =========================================================
   UTILITAS
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

// Tampilkan pesan status sementara di bawah tombol simpan 
function flashStatus(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.classList.remove('opacity-0');
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => el.classList.add('opacity-0'), 2200);
}

// Hapus kartu/baris dari daftar setelah konfirmasi (dipakai di halaman kelola portfolio & sertifikasi)
function initDeleteButtons(containerSelector) {
  document.querySelectorAll(containerSelector + ' [data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-item]');
      if (!card) return;
      if (confirm('Hapus item ini?')) {
        card.remove();
      }
    });
  });
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

// Fungsi untuk buka tutup Modals
function initModal(config) {
  const modal = document.getElementById(config.modalId);
  if (!modal) return null;

  const modalContent = modal.querySelector('.neo-modal-content');
  const modalTitle = document.getElementById(config.titleId);

  const openModal = (isEdit = false) => {
    modal.classList.remove('hidden');
    // Memastikan display flex aktif saat modal dibuka
    modal.classList.add('flex');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      if (modalContent) {
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
      }
    }, 10);

    if (modalTitle) {
      modalTitle.textContent = isEdit ? config.editTitle : config.addTitle;
    }
  };

  const closeModal = () => {
    modal.classList.add('opacity-0');
    if (modalContent) {
      modalContent.classList.remove('scale-100');
      modalContent.classList.add('scale-95');
    }
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 300);
  };

  // Event Listener untuk Tombol Tambah
  if (config.addBtnSelector) {
    document.querySelectorAll(config.addBtnSelector).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(false);
      });
    });
  }

  // Event Listener untuk Tombol Edit
  if (config.editBtnSelector) {
    document.querySelectorAll(config.editBtnSelector).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(true);
      });
    });
  }

  // Event Listener Global Modal (Menangani Tombol Close & Klik Backdrop)
  modal.addEventListener('click', (e) => {
    // Jika yang diklik adalah tombol close (atau elemen di dalam tombol close)
    if (e.target.closest('.close-modal-btn')) {
      e.preventDefault();
      closeModal();
      return;
    }
    // Jika yang diklik adalah backdrop hitam luar
    if (e.target === modal) {
      closeModal();
    }
  });

  return { open: openModal, close: closeModal };
}

document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initPasswordToggle();
  switchTheme();
  initHiddenAdminTrigger();
  initModal();
});
