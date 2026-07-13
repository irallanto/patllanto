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

function shouldPlay(target) {
  if (!target) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.matchMedia('(hover: none)').matches) return false;
  if (target.closest('audio, video')) return false;
  return true;
}

function loadWelcomeSound() {
  if (welcomeSound) return welcomeSound;
  welcomeSound = new Audio('/assets/audio/welcome.mp3');
  welcomeSound.preload = 'auto';
  welcomeSound.volume = 0.3;
  return welcomeSound;
}

/* Exported so curtain.js can trigger this itself, timed to the
   merchant sprite — see curtain.js's docblock for why. Checks
   localStorage directly rather than the `isEnabled` variable above,
   since curtain.js runs before initAudioHover() has had a chance to
   read that preference in from storage. Returns the Audio element
   (or null if skipped) so the caller can sync animation to its
   real play/pause/ended events. */
export function playWelcomeTone() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  if (localStorage.getItem('portfolio-audio') === 'off') return null;

  const audio = loadWelcomeSound();
  audio.currentTime = 0;
  // Ensure audio isn't muted and has a sensible volume
  try { audio.muted = false; } catch (e) {}
  audio.volume = Math.max(0.15, audio.volume || 0.3);

  // Diagnostic logs to help debug playback issues in deployed environments
  audio.addEventListener('play', () => console.log('welcomeAudio: play event')); 
  audio.addEventListener('playing', () => console.log('welcomeAudio: playing')); 
  audio.addEventListener('error', (ev) => console.warn('welcomeAudio: error', ev));

  // Try to play immediately; if the browser blocks autoplay, attach
  // a one-time gesture listener to resume playback when the user
  // interacts (required on many hosting platforms like Vercel).
  audio.play().catch((err) => {
    console.warn('welcomeAudio: play rejected', err);
    const resumePlayback = () => {
      audio.play().then(() => console.log('welcomeAudio: resumed after gesture')).catch((e) => console.warn('welcomeAudio: resume failed', e));
      window.removeEventListener('pointerdown', resumePlayback);
      window.removeEventListener('keydown', resumePlayback);
    };

    window.addEventListener('pointerdown', resumePlayback, { once: true, passive: true });
    window.addEventListener('keydown', resumePlayback, { once: true });
  });
  return audio;
}

function loadClickSound() {
  if (clickSound) return clickSound;

  clickSound = new Audio('/assets/audio/click.MP3');
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

function toggleAudio() {
  isEnabled = !isEnabled;
  localStorage.setItem('portfolio-audio', isEnabled ? 'on' : 'off');

  const button = document.getElementById('audioToggle');
  if (button) {
    button.setAttribute('aria-pressed', String(isEnabled));
    button.setAttribute('aria-label', isEnabled ? 'Turn click sound off' : 'Turn click sound on');
    button.setAttribute('title', isEnabled ? 'Audio on' : 'Audio off');
  }

  const toggleSound = new Audio(isEnabled ? '/assets/audio/on.MP3' : '/assets/audio/off.mp3');
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

  window.__audioHoverInitialized = true;
}