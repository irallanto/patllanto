/* ─────────────────────────────────────────
   MODULE — Merchant Greeting Overlay
   A fullscreen welcome overlay with the merchant sprite and a brief
   greeting message. The page behind is softly blurred so the merchant
   and text become the primary focus.
   ───────────────────────────────────────── */

import { playWelcomeTone } from './audio-hover.js';
import { initMerchantSprite, syncMerchantToAudio, stopMerchantAnimation, setFrame, setFrameSrc, setTalkingSequence, startIdleBreathing } from './merchant.js';

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
  const title = overlay.querySelector('.greeting-title');
  const subtitle = overlay.querySelector('.greeting-subtitle');

  // Reveal the hint immediately on pointer hover/focus to make the
  // merchant's interactivity obvious (helps desktop and keyboard users).
  if (spriteEl) {
    spriteEl.addEventListener('pointerenter', () => { if (hint) hint.classList.add('visible'); }, { passive: true });
    spriteEl.addEventListener('focus', () => { if (hint) hint.classList.add('visible'); });
  }

  let closed = false;
  let stage = 'idle'; // idle -> rotating -> greeting -> ready

  function closeGreeting() {
    if (closed) return;
    closed = true;
    overlay.classList.add('greeting-hidden');
    stopMerchantAnimation();
    overlay.removeEventListener('pointerdown', onMerchantClick);
    window.removeEventListener('keydown', onMerchantClick);
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }

  function onMerchantClick(event) {
      if (stage === 'idle') {
        stage = 'rotating';
        // Rotation sequence: start from northeast since `north` is the
        // default visible image, avoiding showing `north` twice.
        const seqPaths = [
          'assets/merchant/northeast.png',
          'assets/merchant/east.png',
          'assets/merchant/south.png'
        ];
        let i = 0;
        const intervalMs = 140;
        setFrameSrc(seqPaths[0]);
        const rotTimer = setInterval(() => {
          i += 1;
          if (i >= seqPaths.length) {
            clearInterval(rotTimer);
            // After rotation, switch to front-facing numbered frames and play greeting
            setFrame(0);
              // Diagnostic + play: check that the audio file is reachable,
              // enable audio preference and then play once, handling the
              // talking sync and fallback in one place.
              (async () => {
                try {
                  const resp = await fetch('assets/audio/welcome.mp3', { method: 'HEAD' });
                  console.log('welcomeAudio: HEAD response', resp.status, resp.ok, resp.headers.get('content-type'));
                } catch (err) {
                  console.warn('welcomeAudio: HEAD request failed', err);
                }

                try { localStorage.setItem('portfolio-audio', 'on'); } catch (e) {}
                const welcomeAudio = playWelcomeTone();
                if (welcomeAudio) {
                  try { setTalkingSequence([0,1,2,3,4]); } catch (e) {}
                  syncMerchantToAudio(welcomeAudio);
                  welcomeAudio.addEventListener('ended', () => {
                    startIdleBreathing();
                    stage = 'ready';
                    if (hint) { hint.textContent = 'Click the merchant to continue'; hint.classList.add('visible'); }
                  }, { once: true });
                } else {
                  startIdleBreathing();
                  stage = 'ready';
                  if (hint) { hint.textContent = 'Click the merchant to continue'; hint.classList.add('visible'); }
                }
              })();
          } else {
            setFrameSrc(seqPaths[i]);
          }
        }, intervalMs);

        return;
      }

    if (stage === 'ready') {
      closeGreeting();
    }
  }

  // Allow clicking anywhere on the overlay (or pressing any key)
  // to progress the intro so users don't need to hit the small sprite.
  overlay.addEventListener('pointerdown', onMerchantClick, { passive: true });
  window.addEventListener('keydown', onMerchantClick);

  // Show initial hint after a short delay
  setTimeout(() => {
    if (!closed && hint) hint.textContent = 'Click the merchant to greet';
    if (!closed && hint) hint.classList.add('visible');
  }, HINT_DELAY_MS);
}
