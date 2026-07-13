/* ─────────────────────────────────────────
   MODULE — Curtain Entrance (JRPG tile wipe)
   A grid of solid tiles covers the viewport on load, then dissolves
   corner-to-corner in a chunky, stepped wipe — like a classic 2D RPG
   battle transition — instead of a smooth slide. Purely decorative:
     - opens once fonts/critical assets are ready, not a blind delay
     - a hard safety timeout forces it open no matter what
     - any click or keypress (after a short grace period) skips it
       instantly with a snap-open — the grace period stops an
       incidental early click/keypress from killing the animation
       before a single frame of it has actually been seen
     - fully skipped for reduced-motion users (no tiles even built)
   ───────────────────────────────────────── */

const COLS         = 16;   // tile grid columns
const ROWS         = 9;    // tile grid rows
const STEP_MS       = 40;   // ms between each diagonal step of tiles
const TILE_MS       = 260;  // ms — each tile's own dissolve duration
const MIN_HOLD_MS   = 900;  // ms — floor so the transition is clearly seen
const SAFETY_MS     = 3200; // ms — hard ceiling; opens regardless of state
const SKIP_MS        = 200;  // ms — snappy all-at-once dissolve on skip
const SKIP_GRACE_MS = 500;  // ms — ignore skip attempts before this elapses
const SKIP_HINT_MS  = 1500; // ms — delay before showing "press any key"

export function initCurtain() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const grid = document.querySelector('.curtain-grid');

  if (prefersReducedMotion || !grid) {
    body.classList.add('curtain-done');
    return;
  }

  /* Build the tile grid once. Each tile carries its own diagonal
     delay as a CSS custom property so the dissolve sweeps corner to
     corner rather than firing all at once. */
  const frag = document.createDocumentFragment();
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const tile = document.createElement('div');
      tile.className = 'curtain-tile';
      tile.style.setProperty('--delay', `${(col + row) * STEP_MS}ms`);
      frag.appendChild(tile);
    }
  }
  grid.style.setProperty('--cols', COLS);
  grid.style.setProperty('--rows', ROWS);
  grid.appendChild(frag);

  const maxDelay = (COLS + ROWS - 2) * STEP_MS;
  const startedAt = performance.now();
  let opened = false;

  function open(fast = false) {
    if (opened) return;
    opened = true;
    if (fast) body.classList.add('curtain-skip');
    body.classList.add('curtain-open');

    window.removeEventListener('pointerdown', skip);
    window.removeEventListener('keydown', skip);

    const totalMs = fast ? SKIP_MS : maxDelay + TILE_MS;
    setTimeout(() => body.classList.add('curtain-done'), totalMs + 60);
  }

  /* Ignore skip attempts in the first SKIP_GRACE_MS — this is what
     stops an incidental click or keypress right after load (e.g. the
     click that opened the page, a stray keyboard shortcut) from
     ending the transition before it's had a chance to actually play. */
  function skip() {
    if (performance.now() - startedAt < SKIP_GRACE_MS) return;
    open(true);
  }

  /* Ready = fonts loaded (so the dialog box text isn't unstyled) and
     the minimum hold time has passed. Falls back gracefully if the
     Font Loading API isn't available. */
  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  const minHold = new Promise(res => setTimeout(res, MIN_HOLD_MS));

  Promise.race([
    Promise.all([fontsReady, minHold]),
    new Promise(res => setTimeout(res, SAFETY_MS)), // never get stuck
  ]).then(() => open(false));

  /* Never trap a visitor behind the curtain — any click/tap or
     keypress (after the grace period) skips straight to the page. */
  window.addEventListener('pointerdown', skip, { passive: true });
  window.addEventListener('keydown', skip);

  /* "Press any key" prompt — only shows if still loading after a beat */
  const hint = document.querySelector('.curtain-skip-hint');
  if (hint) {
    setTimeout(() => { if (!opened) hint.classList.add('visible'); }, SKIP_HINT_MS);
  }
}