/* ─────────────────────────────────────────
   MODULE  —  Leave a Comment
   A floating button opens an overlay (same peek-reveal shell as the
   certificate modal — see certs.js/cert-modal.css) where a visitor
   can leave a name + short comment. Submissions land in Supabase
   with status "pending" — they only ever appear on the site once
   approved from /admin.html.
   ───────────────────────────────────────── */

import { supabase } from '../supabase-client.js';

/* Same body-scroll-lock treatment as the cert modal, so opening this
   overlay doesn't cause the sideways content jump a hidden scrollbar
   would otherwise introduce. */
function lockBodyScroll() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
}
function unlockBodyScroll() {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

let modalEl = null;

function ensureModal() {
  if (modalEl) return modalEl;

  modalEl = document.createElement('div');
  modalEl.className = 'cert-modal comment-modal';
  modalEl.innerHTML = `
    <div class="cert-modal-backdrop"></div>
    <div class="cert-modal-stage">
      <div class="cert-modal-peek"></div>
      <div class="cert-modal-card">
        <button type="button" class="cert-modal-close" aria-label="Close">&times;</button>
        <form class="comment-form" novalidate>
          <div>
            <h3 class="cert-modal-name">Leave a comment</h3>
            <p class="cert-modal-issuer">Say hi, or leave feedback about the site — I read every one.</p>
          </div>
          <div class="comment-field">
            <label for="comment-name">Your name</label>
            <input id="comment-name" name="name" type="text" maxlength="60" required autocomplete="name" />
          </div>
          <div class="comment-field">
            <label for="comment-message">Comment</label>
            <textarea id="comment-message" name="message" maxlength="400" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary comment-submit-btn">Submit</button>
          <p class="comment-form-status" role="status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modalEl);

  modalEl.querySelector('.cert-modal-backdrop').addEventListener('click', closeCommentModal);
  modalEl.querySelector('.cert-modal-close').addEventListener('click', closeCommentModal);
  modalEl.querySelector('.comment-form').addEventListener('submit', handleSubmit);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCommentModal();
  });

  return modalEl;
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const statusEl = form.querySelector('.comment-form-status');
  const submitBtn = form.querySelector('.comment-submit-btn');

  const name = form.name.value.trim();
  const message = form.message.value.trim();

  if (!name || !message) {
    statusEl.textContent = 'Please fill in both fields.';
    statusEl.className = 'comment-form-status error';
    return;
  }

  submitBtn.disabled = true;
  statusEl.textContent = 'Sending…';
  statusEl.className = 'comment-form-status';

  const { error } = await supabase
    .from('comments')
    .insert({ name, message, status: 'pending' });

  submitBtn.disabled = false;

  if (error) {
    console.warn('Comment submit failed:', error);
    statusEl.textContent = "Couldn't send that — try again in a moment.";
    statusEl.className = 'comment-form-status error';
    return;
  }

  statusEl.textContent = 'Thanks! Your comment is pending review.';
  statusEl.className = 'comment-form-status success';
  form.reset();
  setTimeout(closeCommentModal, 1400);
}

export function openCommentModal() {
  const modal = ensureModal();
  modal.classList.add('active');

  /* Two rAFs so 'active' (display:flex) paints before 'peek-in' kicks
     off the transition — same reasoning as openCertModal in certs.js. */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => modal.classList.add('peek-in'));
  });

  lockBodyScroll();
  modal.querySelector('#comment-name')?.focus();
}

export function closeCommentModal() {
  if (!modalEl) return;
  modalEl.classList.remove('peek-in');
  unlockBodyScroll();
  setTimeout(() => modalEl.classList.remove('active'), 250);
}

export function initCommentWidget() {
  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'comment-fab';
  fab.setAttribute('aria-label', 'Leave a comment');
  fab.setAttribute('title', 'Leave a comment');
  fab.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  `;

  fab.addEventListener('click', openCommentModal);
  document.body.appendChild(fab);
}