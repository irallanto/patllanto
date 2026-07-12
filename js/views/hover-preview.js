/* ─────────────────────────────────────────
   MODULE  —  Hover Image Preview
   Shows a floating image on hover for projects & certs
   ───────────────────────────────────────── */

let previewEl = null;
let hideTimeout = null;

function ensurePreview() {
  if (previewEl) return previewEl;

  previewEl = document.createElement('div');
  previewEl.className = 'hover-preview';
  previewEl.innerHTML = `<img alt="" loading="lazy" />`;
  document.body.appendChild(previewEl);

  return previewEl;
}

function showPreview(e, imageSrc) {
  const preview = ensurePreview();
  const img = preview.querySelector('img');

  // Load image
  if (img.src !== imageSrc) {
    img.src = imageSrc;
  }

  // Position near cursor
  const offsetX = 20;
  const offsetY = 20;
  let x = e.clientX + offsetX;
  let y = e.clientY + offsetY;

  // Keep preview in viewport
  const rect = preview.getBoundingClientRect();
  if (x + 380 > window.innerWidth) {
    x = e.clientX - 400;
  }
  if (y + 250 > window.innerHeight) {
    y = e.clientY - 270;
  }

  preview.style.left = `${x}px`;
  preview.style.top = `${y}px`;
  preview.classList.add('visible');

  clearTimeout(hideTimeout);
}

function hidePreview() {
  if (!previewEl) return;
  hideTimeout = setTimeout(() => {
    previewEl?.classList.remove('visible');
  }, 100);
}

export function initHoverPreview() {
  // Projects
  document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('[data-project-image]');
    if (card) {
      const src = card.dataset.projectImage;
      if (src) showPreview(e, src);
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (previewEl?.classList.contains('visible')) {
      const offsetX = 20;
      const offsetY = 20;
      let x = e.clientX + offsetX;
      let y = e.clientY + offsetY;

      // Keep in viewport
      if (x + 380 > window.innerWidth) {
        x = e.clientX - 400;
      }
      if (y + 250 > window.innerHeight) {
        y = e.clientY - 270;
      }

      previewEl.style.left = `${x}px`;
      previewEl.style.top = `${y}px`;
    }
  });

  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('[data-project-image], [data-cert-image]');
    if (card) {
      hidePreview();
    }
  });

  // Certs
  document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('[data-cert-image]');
    if (card) {
      const src = card.dataset.certImage;
      if (src) showPreview(e, src);
    }
  });

  console.log('✓ Hover preview initialized');
}
