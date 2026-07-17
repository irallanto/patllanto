/* ─────────────────────────────────────────
   MODULE  —  Merchant Sprite
   Frame-by-frame mouth animation + directional poses.
   ───────────────────────────────────────── */

const FRAME_PATHS = [
  'assets/merchant/frame_000.png',
  'assets/merchant/frame_001.png',
  'assets/merchant/frame_002.png',
  'assets/merchant/frame_003.png',
  'assets/merchant/frame_004.png',
];

const DIRECTION_PATHS = {
  north: 'assets/merchant/north.png',
  southeast: 'assets/merchant/southeast.png',
  east: 'assets/merchant/east.png',
  south: 'assets/merchant/south.png',
};

const IDLE_FRAMES = [0, 2, 4, 2];
const TALK_FRAMES = [0, 1, 2, 3, 4];
const IDLE_INTERVAL_MS = 420;
const TALK_INTERVAL_MS = 110;

let imgEl = null;
let timerId = null;
let stepIndex = 0;
let mode = 'idle';
let reducedMotion = false;
let currentDirection = 'north';
let containerEl = null;

function setFrame(i) {
  if (imgEl) imgEl.src = FRAME_PATHS[i];
}

function setDirection(direction) {
  if (currentDirection === direction || !imgEl) return;
  currentDirection = direction;
  imgEl.src = DIRECTION_PATHS[direction] || FRAME_PATHS[0];
}

function tick() {
  const sequence = mode === 'talking' ? TALK_FRAMES : IDLE_FRAMES;
  stepIndex = (stepIndex + 1) % sequence.length;
  setFrame(sequence[stepIndex]);
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

export function initMerchantSprite() {
  imgEl = document.querySelector('.greeting-sprite');
  containerEl = document.querySelector('.greeting-overlay');
  if (!imgEl) return;

  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Preload all sprites
  [...Object.values(DIRECTION_PATHS), ...FRAME_PATHS].forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Start in north pose
  setDirection('north');
  if (!reducedMotion) startLoop(IDLE_INTERVAL_MS);
}

export async function playGreetingSequence() {
  if (reducedMotion) return;
  
  return new Promise(resolve => {
    let turnStep = 0;
    const directions = ['southeast', 'east', 'south'];
    
    const turnInterval = setInterval(() => {
      if (turnStep < directions.length) {
        setDirection(directions[turnStep]);
        turnStep++;
      } else {
        clearInterval(turnInterval);
        setMode('talking');
        resolve();
      }
    }, 200);
  });
}

export function syncMerchantToAudio(audio) {
  if (!audio) return;
  audio.addEventListener('play', () => setMode('talking'));
  audio.addEventListener('pause', () => setMode('idle'));
  audio.addEventListener('ended', () => setMode('idle'));
}

export function stopMerchantAnimation() {
  clearInterval(timerId);
  timerId = null;
}