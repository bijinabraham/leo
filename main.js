// ==============================================================
// Leo memorial — main.js
// Handles: nav scroll swap, gallery population, lightbox,
// raw-diary modal, and falling petals.
// ==============================================================

// -------- Gallery: chronological list of all photos --------
// Filenames sort chronologically because they start with YYYYMMDD.
// (Non-dated names like IMG-YYYYMMDD-... and UUIDs sort where they fall in ASCII order.)
const GALLERY_PHOTOS = [
  '20230219_154709.jpg',
  '20230219_154710.jpg',
  '20230219_154730.jpg',
  '20230219_154735.jpg',
  '20230219_154737.jpg',
  '20230301_080926.jpg',
  '20230320_165557.jpg',
  '20230320_170341.jpg',
  '20230330_214141.jpg',
  '20230620_164839.jpg',
  '20230620_164843.jpg',
  '20230620_164902.jpg',
  '20230620_164905.jpg',
  '20230620_164933.jpg',
  '20230620_164948.jpg',
  '20230626_204700.jpg',
  '20230829_163105.jpg',
  '20231015_074933.jpg',
  '20231015_074939_2.jpg',
  '20231015_075300.jpg',
  '20231015_075303.jpg',
  '20231016_113108.jpg',
  '20231209_195112.jpg',
  'fac05352-b80c-49f1-809a-8a84791b41cd.jpg',
  'IMG_20260114_195639.jpg',
  'IMG-20231209-WA0007.jpg',
  'IMG-20250123-WA0007.jpg',
  'IMG-20251005-WA0003.jpg',
  'IMG-20251005-WA0005.jpg',
  'IMG-20251005-WA0006.jpg',
  'IMG-20251005-WA0008.jpg'
];

function populateGallery() {
  const grid = document.getElementById('gallery');
  if (!grid) return;
  const frag = document.createDocumentFragment();
  GALLERY_PHOTOS.forEach((filename, i) => {
    const base = filename.replace(/\.(jpg|jpeg)$/i, '');
    const img = document.createElement('img');
    img.src = `photos/${base}-sm.jpg`;
    img.srcset = `photos/${base}-sm.jpg 700w, photos/${base}.jpg 1400w`;
    img.sizes = '(max-width: 540px) 90vw, (max-width: 900px) 45vw, 30vw';
    img.alt = `Leo, photo ${i + 1} of ${GALLERY_PHOTOS.length}`;
    img.loading = 'lazy';
    img.dataset.full = `photos/${base}.jpg`;
    frag.appendChild(img);
  });
  grid.appendChild(frag);
}

populateGallery();

// -------- Falling petals --------
function spawnPetals() {
  const c = document.getElementById('petals');
  if (!c) return;
  const petalSVG = '<svg viewBox="0 0 24 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0 C 4 8, 4 24, 12 32 C 20 24, 20 8, 12 0"/></svg>';
  const N = 24;
  for (let i = 0; i < N; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.innerHTML = petalSVG;
    p.style.left = (Math.random() * 100) + 'vw';
    p.style.animationDelay = (-Math.random() * 22) + 's';
    p.style.animationDuration = (12 + Math.random() * 12) + 's';
    p.style.setProperty('--drift', ((Math.random() * 120) - 60) + 'px');
    p.style.setProperty('--spin', (360 + Math.random() * 540) + 'deg');
    p.style.opacity = 0.32 + Math.random() * 0.4;
    const scale = 0.6 + Math.random() * 0.9;
    p.style.width = (14 * scale) + 'px';
    p.style.height = (22 * scale) + 'px';
    c.appendChild(p);
  }
}

spawnPetals();

// -------- Nav color swap on scroll --------
function initNavScroll() {
  const topnav = document.getElementById('topnav');
  if (!topnav) return;
  const heroHeight = window.innerHeight;
  function update() {
    if (window.scrollY > heroHeight - 100) {
      topnav.classList.remove('dark-nav');
      topnav.classList.add('light-nav');
    } else {
      topnav.classList.add('dark-nav');
      topnav.classList.remove('light-nav');
    }
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

initNavScroll();

// -------- Lightbox for gallery + body photos --------
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  if (!lightbox || !lightboxImg || !closeBtn) return;

  let lastFocused = null;

  function open(src, alt) {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  // Gallery photos: click + keyboard to open
  document.querySelectorAll('.gallery-grid img').forEach(img => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.addEventListener('click', () => open(img.dataset.full || img.src, img.alt));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img.dataset.full || img.src, img.alt); }
    });
  });
  // Body photo figures: click + keyboard to open
  document.querySelectorAll('.photo-figure img, .split-photos img').forEach(img => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.addEventListener('click', () => open(img.src, img.alt));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img.src, img.alt); }
    });
  });

  // Close: X button, click backdrop, Esc key
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (!lightbox.hidden && e.key === 'Escape') close(); });
}

initLightbox();
