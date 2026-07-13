const INTERACTION_SELECTOR = [
  '#themeToggle',
  '.btn-primary',
  '.btn-secondary',
  '#btn-view-projects',
  '#btn-view-certs',
  '#btn-view-tech',
  '.back-btn',
  '#projects-preview .project-card',
  '#certs-preview .cert-card',
  '#stack-preview .stack-item',
  '#social-links a',
  '.social-link',
  '.view-all'
].join(',');

let lastPlayedAt = 0;
let isEnabled = true;
let clickSound = null;
let welcomeSound = null;
let lastHoveredElement = null;
let audioUnlocked = false;

function shouldPlay(target) {
  if (!target) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.matchMedia('(hover: none)').matches) return false;
  if (target.closest('audio, video')) return false;
  return true;
}

function loadWelcomeSound() {
  if (welcomeSound) return welcomeSound;
  welcomeSound = new Audio('assets/audio/welcome.mp3');
  welcomeSound.preload = 'auto';
  welcomeSound.volume = 0.3;
  return welcomeSound;
}

function playWelcomeTone() {
  if (!isEnabled) return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const audio = loadWelcomeSound();
  if (!audio) return null;

  audio.currentTime = 0;
  return audio.play().catch(() => null);
}

function loadClickSound() {
  if (clickSound) return clickSound;

  clickSound = new Audio('assets/audio/click.MP3');
  clickSound.preload = 'auto';
  clickSound.volume = 0.2;
  return clickSound;
}

function playInteractionTone() {
  if (!isEnabled) return;

  const now = performance.now();
  if (now - lastPlayedAt < 90) return;

  const audio = loadClickSound();
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch(() => {});

  lastPlayedAt = now;
}

function handleClick(event) {
  const target = event.target instanceof Element
    ? event.target.closest(INTERACTION_SELECTOR)
    : null;

  if (!target || !shouldPlay(target)) return;

  playInteractionTone();
}

function unlockAudioPlayback() {
  if (audioUnlocked) return;
  audioUnlocked = true;

  if (!isEnabled) return;
  playWelcomeTone();
}

function toggleAudio() {
  isEnabled = !isEnabled;
  localStorage.setItem('portfolio-audio', isEnabled ? 'on' : 'off');

  const button = document.getElementById('audioToggle');
  if (button) {
    button.setAttribute('aria-pressed', String(isEnabled));
    button.setAttribute('aria-label', isEnabled ? 'Turn click sound off' : 'Turn click sound on');
    button.setAttribute('title', isEnabled ? 'Audio on' : 'Audio off');
  }

  const toggleSound = new Audio(isEnabled ? 'assets/audio/on.MP3' : 'assets/audio/off.mp3');
  toggleSound.volume = 0.25;
  toggleSound.play().catch(() => {});
}

export function initAudioHover() {
  if (window.__audioHoverInitialized) return;

  const saved = localStorage.getItem('portfolio-audio');
  if (saved === 'off') {
    isEnabled = false;
  }

  const button = document.getElementById('audioToggle');
  if (button) {
    button.addEventListener('click', toggleAudio);
    button.setAttribute('aria-pressed', String(isEnabled));
    button.setAttribute('aria-label', isEnabled ? 'Turn click sound off' : 'Turn click sound on');
    button.setAttribute('title', isEnabled ? 'Audio on' : 'Audio off');
  }

  document.addEventListener('click', handleClick, true);
  document.addEventListener('pointerdown', unlockAudioPlayback, { once: true, passive: true });
  document.addEventListener('touchstart', unlockAudioPlayback, { once: true, passive: true });
  document.addEventListener('keydown', unlockAudioPlayback, { once: true });
  window.addEventListener('focus', unlockAudioPlayback, { once: true });

  window.addEventListener('load', () => {
    if (!isEnabled || !audioUnlocked) return;
    playWelcomeTone();
  });

  window.__audioHoverInitialized = true;
}
