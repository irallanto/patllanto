/* ─────────────────────────────────────────
   MODULE — Merchant Greeting Overlay
   Shows a fullscreen welcome overlay with the merchant sprite.
   ───────────────────────────────────────── */

import { playWelcomeTone } from './audio-hover.js';
import { initMerchantSprite, playGreetingSequence, syncMerchantToAudio, stopMerchantAnimation } from './merchant.js';

const HINT_DELAY_MS = 1500;

export function initCurtain() {
  const overlay = document.querySelector('.greeting-overlay');
  if (!overlay) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    overlay.remove();
    return;
  }

  initMerchantSprite();

  const hint = overlay.querySelector('.greeting-hint');
  let closed = false;
  let canInteract = true;
  let hasGreeted = false;

  function closeGreeting() {
    if (closed) return;
    closed = true;
    overlay.classList.add('greeting-hidden');
    stopMerchantAnimation();
    window.removeEventListener('pointerdown', skipGreeting);
    window.removeEventListener('keydown', skipGreeting);
    overlay.removeEventListener('click', greetMerchant);
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }

  function skipGreeting(event) {
    // A tap directly on the merchant is handled by greetMerchant, not here —
    // otherwise this pointerdown listener fires first and closes the
    // overlay before the greeting sequence ever gets a chance to play.
    if (event.target.closest('.greeting-sprite')) return;
    closeGreeting();
  }

  async function greetMerchant(event) {
    const sprite = event.target.closest('.greeting-sprite');
    if (!sprite || !canInteract) return;
    event.stopPropagation();

    // Second tap: the greeting already played, so this click means
    // "continue" — close the curtain instead of replaying everything.
    if (hasGreeted) {
      closeGreeting();
      return;
    }

    canInteract = false;
    hint.classList.remove('visible');

    // Play the turn-around sequence
    await playGreetingSequence();

    // Play welcome audio and sync talking animation
    const audio = playWelcomeTone();
    syncMerchantToAudio(audio);
    hasGreeted = true;

    // After audio ends (or after a reasonable delay), show hint again
    if (audio) {
      audio.addEventListener('ended', () => {
        setTimeout(() => {
          if (!closed && hint) hint.classList.add('visible');
          canInteract = true;
        }, 600);
      }, { once: true });
    } else {
      setTimeout(() => {
        if (!closed && hint) hint.classList.add('visible');
        canInteract = true;
      }, 2000);
    }
  }

  overlay.addEventListener('pointerdown', skipGreeting, { once: true, passive: true });
  overlay.addEventListener('click', greetMerchant);
  window.addEventListener('keydown', skipGreeting, { once: true });

  setTimeout(() => {
    if (!closed && hint) hint.classList.add('visible');
  }, HINT_DELAY_MS);
}