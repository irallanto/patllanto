/* ─────────────────────────────────────────
   VIEW  —  Certifications
   Renders: sidebar preview + full detail view
   Also handles: click-to-preview modal (peek reveal)
   ───────────────────────────────────────── */

import { certifications } from '../data.js';

/* Only show certs that are ready to go public. See data.js for the
   `visible` flag on placeholder ("Coming soon") entries. */
const visibleCerts = certifications.filter(c => c.visible !== false);

/* ── Modal (lazy-built, shared by preview + detail view) ── */
/* ── Body scroll lock helpers ──
   Hiding overflow removes the scrollbar, which shrinks the
   viewport and shifts all content sideways — that sideways jump
   happening mid-animation is what reads as "laggy". Padding the
   body by the scrollbar's width keeps the layout stable. */
function lockBodyScroll() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function unlockBodyScroll() {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

let modalEl = null;

function ensureModal() {
  if (modalEl) return modalEl;

  modalEl = document.createElement('div');
  modalEl.className = 'cert-modal';
  modalEl.innerHTML = `
    <div class="cert-modal-backdrop"></div>
    <div class="cert-modal-stage">
      <div class="cert-modal-peek"></div>
      <div class="cert-modal-card">
        <button type="button" class="cert-modal-close" aria-label="Close preview">&times;</button>
        <img class="cert-modal-img" src="" alt="" />
        <div class="cert-modal-info">
          <h3 class="cert-modal-name"></h3>
          <p class="cert-modal-issuer"></p>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalEl);

  modalEl.querySelector('.cert-modal-backdrop').addEventListener('click', closeCertModal);
  modalEl.querySelector('.cert-modal-close').addEventListener('click', closeCertModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCertModal();
  });

  return modalEl;
}

export function openCertModal(cert) {
  const modal = ensureModal();

  const img = modal.querySelector('.cert-modal-img');
  const src = cert.image || cert.icon;

  img.alt = cert.name;

  if (img.src !== new URL(src, window.location.href).href) {
    img.removeAttribute('src');

    /* Decode off the render path instead of relying on onload. `decode()`
       returns a promise that resolves once the browser has fully decoded
       the image bytes in the background — onload alone doesn't guarantee
       that, so on a large scan the actual decode work could still land on
       the same frame as the open animation and cause a stutter. Falls
       back to onload for browsers without decode() support. */
    const preloader = new Image();
    preloader.src = src;

    const commit = () => { img.src = src; };

    if (preloader.decode) {
      preloader.decode().then(commit).catch(commit);
    } else {
      preloader.onload = commit;
    }
  }

  modal.querySelector('.cert-modal-name').textContent = cert.name;
  modal.querySelector('.cert-modal-issuer').textContent = cert.issuer;

  modal.classList.add('active');

  /* Two rAFs instead of a synchronous offsetHeight read. The old
     `void modal.offsetHeight` forced the browser to stop and compute
     layout synchronously, right in the middle of the click handler —
     blocking the main thread at the exact moment we want it free to
     start animating. Waiting a frame for 'active' (display:flex) to
     paint, then adding 'peek-in' on the frame after, gives the same
     "commit before animating" guarantee without the forced reflow. */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modal.classList.add('peek-in');
    });
  });

  lockBodyScroll();
}

export function closeCertModal() {
  if (!modalEl) return;
  modalEl.classList.remove('peek-in');
  unlockBodyScroll();
  setTimeout(() => modalEl.classList.remove('active'), 250);
}

/* ── Sidebar preview ── */
export function renderCertsPreview() {
  const container = document.getElementById('certs-preview');
  if (!container) return;

  container.innerHTML = visibleCerts.map((c, i) => `
    <button type="button" class="cert-item" data-cert-index="${i}" data-scroll-item data-cert-image="${c.image || ''}">
      <div class="cert-icon"><img src="${c.icon}" alt="${c.issuer}" loading="lazy" /></div>
      <div>
        <div class="cert-name">${c.name}</div>
        <div class="cert-issuer">${c.issuer}</div>
      </div>
    </button>
  `).join('');

  container.querySelectorAll('.cert-item').forEach(btn => {
    btn.addEventListener('click', () => {
      openCertModal(visibleCerts[Number(btn.dataset.certIndex)]);
    });
  });
}

/* ── Full detail view ── */
export function renderCertsView() {
  const container = document.getElementById('certs-view');
  if (!container) return;

  container.innerHTML = `
    <div class="detail-header">
      <button class="back-btn">← Back to Home</button>
      <h2>Certifications</h2>
    </div>
    <div class="detail-projects-grid">
      ${visibleCerts.map((c, i) => `
        <button type="button" class="detail-project-card cert-card" data-cert-index="${i}">
          <div class="cert-card-icon"><img src="${c.icon}" alt="${c.issuer}" loading="lazy" /></div>
          <h3>${c.name}</h3>
          <p>${c.desc}</p>
          <span class="url-badge">${c.issuer}</span>
        </button>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('.cert-card').forEach(btn => {
    btn.addEventListener('click', () => {
      openCertModal(visibleCerts[Number(btn.dataset.certIndex)]);
    });
  });
}