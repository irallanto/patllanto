/* ─────────────────────────────────────────
   MODULE  —  Merchant Sprite (curtain greeter)
   Frame-by-frame pixel-art character shown inside the curtain intro
   (reuses the existing .greeting-sprite element/positioning).

   Two states:
     idle    — slow breathing loop using frames 000/002/004 only
               (no mouth movement), runs continuously while visible
     talking — cycles through all 5 frames (000–004) in sync with
               the welcome audio's real play/pause/ended events, so
               the mouth only moves while the voice line is
               genuinely playing — no guessed durations.

   Respects prefers-reduced-motion: frame-swapping is skipped
   entirely and the sprite just holds its first frame.
   ───────────────────────────────────────── */

import { resolveAssetUrl } from '../utils/asset-paths.js';

const FRAME_PATHS = [
  resolveAssetUrl('../../assets/merchant/frame_000.png'),
  resolveAssetUrl('../../assets/merchant/frame_001.png'),
  resolveAssetUrl('../../assets/merchant/frame_002.png'),
  resolveAssetUrl('../../assets/merchant/frame_003.png'),
  resolveAssetUrl('../../assets/merchant/frame_004.png'),
];

const IDLE_FRAMES = [0, 2, 4];                // breathing loop uses 000,002,004
let TALK_FRAMES = [0, 1, 2, 3, 4];           // full 0–4 cycle while the voice line plays

const IDLE_INTERVAL_MS = 420;
const TALK_INTERVAL_MS = 110;

let imgEl = null;
let timerId = null;
let stepIndex = 0;
let mode = 'idle';
let reducedMotion = false;

export function setFrame(i) {
  if (imgEl) imgEl.src = FRAME_PATHS[i];
}

// Set the sprite source directly by path (used for the rotation images
// the designer renamed to human-friendly names like 'behind.png').
export function setFrameSrc(src) {
  if (imgEl) imgEl.src = src;
}

function tick() {
  const sequence = mode === 'talking' ? TALK_FRAMES : IDLE_FRAMES;
  stepIndex = (stepIndex + 1) % sequence.length;
  setFrame(sequence[stepIndex]);
}

// Allow runtime override of the talking sequence (e.g. to use
// frames [0,2,4] during a specific greeting).
export function setTalkingSequence(seq) {
  if (!Array.isArray(seq) || seq.length === 0) return;
  TALK_FRAMES = seq.slice();
}

function startLoop(intervalMs) {
  clearInterval(timerId);
  stepIndex = 0;
  timerId = setInterval(tick, intervalMs);
}

function setMode(next) {
  if (reducedMotion || mode === next) return;
  mode = next;
  startLoop(next === 'talking' ? TALK_INTERVAL_MS : IDLE_INTERVAL_MS);
}

/* Call once, as soon as the curtain is confirmed to be running.
   Preloads every frame up front so swapping .src mid-animation never
   shows a half-loaded flash, then starts the idle breathing loop. */
export function initMerchantSprite() {
  imgEl = document.querySelector('.greeting-sprite');
  if (!imgEl) return;

  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  FRAME_PATHS.forEach(src => { const im = new Image(); im.src = src; });

  // Preload alternate orientation frames (named images) used for the
  // initial rotation sequence so there is no flash when swapping src.
  ['north.png', 'behind.png', 'east.png', 'northeast.png', 'south.png'].forEach(name => {
    const im = new Image(); im.src = resolveAssetUrl(`../../assets/merchant/${name}`);
  });

  // Set default orientation to the 'north' asset so the merchant
  // initially faces away before the user clicks.
  setFrameSrc(resolveAssetUrl('../../assets/merchant/north.png'));
}

// Start the idle breathing loop (uses IDLE_FRAMES). Call this after
// the greeting audio finishes so the merchant returns to breathing.
export function startIdleBreathing() {
  if (reducedMotion) return;
  setMode('idle');
}

/* Ties the talking animation to the welcome audio's actual playback
   state rather than a guessed timer — stays correct no matter the
   clip's length, and if the browser blocks autoplay the merchant
   simply never leaves its idle breathing loop. */
export function syncMerchantToAudio(audio) {
  if (!audio) return;
  audio.addEventListener('play',  () => setMode('talking'));
  audio.addEventListener('pause', () => setMode('idle'));
  audio.addEventListener('ended', () => setMode('idle'));
}

/* Stops the frame-swap timer once the curtain is fully closed — no
   reason to keep an interval running on a sprite nobody can see. */
export function stopMerchantAnimation() {
  clearInterval(timerId);
  timerId = null;
}