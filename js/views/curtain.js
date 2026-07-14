/* ─────────────────────────────────────────
   MODULE — Merchant Greeting Overlay
   A fullscreen welcome overlay with the merchant sprite and a brief
   greeting message. The page behind is softly blurred so the merchant
   and text become the primary focus.
   ───────────────────────────────────────── */

import { playWelcomeTone } from './audio-hover.js';
import { initMerchantSprite, syncMerchantToAudio, stopMerchantAnimation, setFrame, setFrameSrc, setTalkingSequence, startIdleBreathing } from './merchant.js';
import { resolveAssetUrl } from '../utils/asset-paths.js';

const HINT_DELAY_MS = 300;

export function initCurtain() {
  const overlay = document.querySelector('.greeting-overlay');
  if (!overlay) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    overlay.remove();
    return;
  }

  initMerchantSprite();

  const spriteEl = overlay.querySelector('.greeting-sprite');
  const hint = overlay.querySelector('.greeting-hint');
  let closed = false;
  let stage = 'idle';
  let hasStartedGreeting = false;

  function showHint(message) {
    if (!hint) return;
    hint.textContent = message;
    hint.classList.add('visible');
  }

  function closeGreeting() {
    if (closed) return;
    closed = true;
    overlay.classList.add('greeting-hidden');
    stopMerchantAnimation();
    overlay.removeEventListener('pointerdown', onMerchantClick);
    window.removeEventListener('keydown', onMerchantClick);
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }

  function beginGreetingSequence() {
    if (hasStartedGreeting) return;
    hasStartedGreeting = true;
    stage = 'rotating';

    const seqPaths = [
      resolveAssetUrl('../../assets/merchant/northeast.png'),
      resolveAssetUrl('../../assets/merchant/east.png'),
      resolveAssetUrl('../../assets/merchant/south.png')
    ];

    let i = 0;
    const intervalMs = 140;
    setFrameSrc(seqPaths[0]);

    const rotTimer = window.setInterval(() => {
      i += 1;
      if (i >= seqPaths.length) {
        window.clearInterval(rotTimer);
        setFrame(0);

        (async () => {
          try {
            await fetch(resolveAssetUrl('../../assets/audio/welcome.mp3'), { method: 'HEAD' });
          } catch (err) {
            console.warn('welcomeAudio: HEAD request failed', err);
          }

          try { localStorage.setItem('portfolio-audio', 'on'); } catch (e) {}
          const welcomeAudio = playWelcomeTone();

          if (welcomeAudio) {
            try { setTalkingSequence([0, 1, 2, 3, 4]); } catch (e) {}
            syncMerchantToAudio(welcomeAudio);
            welcomeAudio.addEventListener('ended', () => {
              startIdleBreathing();
              stage = 'ready';
              showHint('Click the merchant to continue');
            }, { once: true });
          } else {
            startIdleBreathing();
            stage = 'ready';
            showHint('Click the merchant to continue');
          }
        })();
      } else {
        setFrameSrc(seqPaths[i]);
      }
    }, intervalMs);
  }

  function onMerchantClick(event) {
    if (event && event.target instanceof HTMLElement && !overlay.contains(event.target)) {
      return;
    }

    if (stage === 'idle') {
      beginGreetingSequence();
      return;
    }

    if (stage === 'ready') {
      closeGreeting();
    }
  }

  if (spriteEl) {
    spriteEl.addEventListener('pointerenter', () => { if (hint) hint.classList.add('visible'); }, { passive: true });
    spriteEl.addEventListener('focus', () => { if (hint) hint.classList.add('visible'); });
  }

  overlay.addEventListener('pointerdown', onMerchantClick, { passive: true });
  window.addEventListener('keydown', onMerchantClick);

  window.setTimeout(() => {
    if (!closed && hint) {
      hint.textContent = 'Click the merchant to greet';
      hint.classList.add('visible');
    }
  }, HINT_DELAY_MS);
}
