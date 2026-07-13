/* ─────────────────────────────────────────
   MODULE — Merchant Greeting Overlay
   A fullscreen welcome overlay with the merchant sprite and a brief
   greeting message. The page behind is softly blurred so the merchant
   and text become the primary focus.
   ───────────────────────────────────────── */

import { playWelcomeTone } from './audio-hover.js';
import { initMerchantSprite, syncMerchantToAudio, stopMerchantAnimation } from './merchant.js';

const HINT_DELAY_MS = 1500;

export function initCurtain() {
  const overlay = document.querySelector('.greeting-overlay');
  if (!overlay) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    overlay.remove();
    return;
  }

  initMerchantSprite();
  const welcomeAudio = playWelcomeTone();
  syncMerchantToAudio(welcomeAudio);

  const hint = overlay.querySelector('.greeting-hint');
  let closed = false;

  function closeGreeting() {
    if (closed) return;
    closed = true;
    overlay.classList.add('greeting-hidden');
    stopMerchantAnimation();
    window.removeEventListener('pointerdown', skipGreeting);
    window.removeEventListener('keydown', skipGreeting);
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }

  function skipGreeting(event) {
    if (event.type === 'pointerdown' && !overlay.contains(event.target)) return;
    closeGreeting();
  }

  overlay.addEventListener('pointerdown', skipGreeting, { once: true, passive: true });
  window.addEventListener('keydown', skipGreeting, { once: true });

  setTimeout(() => {
    if (!closed && hint) hint.classList.add('visible');
  }, HINT_DELAY_MS);
}
