/* ─────────────────────────────────────────
   MODULE  —  Background Parallax
   Moves the fixed .parallax-bg layer at a fraction of scroll speed,
   giving it a sense of depth relative to the foreground content.
   ───────────────────────────────────────── */

const SPEED = 0.15; // 0–1 — lower = background lags further behind scroll

export function initBackgroundParallax() {
  const bg = document.getElementById('parallaxBg');
  if (!bg) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  function update() {
    const offset = window.scrollY * SPEED;
    bg.style.transform = `translateY(${offset.toFixed(2)}px)`;
    ticking = false;
  }

  function onScroll() {
    /* Coalesce rapid scroll events into a single update per frame,
       rather than doing layout work on every single scroll tick. */
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* Set the correct initial position in case the page loads already
     scrolled (e.g. arriving via a #anchor link). */
  update();
}