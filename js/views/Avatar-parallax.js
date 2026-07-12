/* ─────────────────────────────────────────
   MODULE  —  Hero Avatar Parallax
   Subtle depth effect: the avatar drifts slightly toward the cursor.
   Skipped entirely on touch devices and when the user has requested
   reduced motion.
   ───────────────────────────────────────── */

const MAX_SHIFT = 8;   // px — how far the avatar can drift from center
const EASE      = 0.15; // 0–1 — higher = snappier, lower = floatier
const SETTLE_THRESHOLD = 0.05; // px — below this we stop animating

export function initAvatarParallax() {
  const wrapper = document.getElementById('avatarWrapper');
  if (!wrapper) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsFinePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Mouse-parallax makes no sense on touch (no persistent cursor position)
     and reduced-motion users have explicitly asked us not to do this. */
  if (prefersReducedMotion || !supportsFinePointer) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId = null;

  function tick() {
    currentX += (targetX - currentX) * EASE;
    currentY += (targetY - currentY) * EASE;
    wrapper.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;

    const settled =
      Math.abs(targetX - currentX) < SETTLE_THRESHOLD &&
      Math.abs(targetY - currentY) < SETTLE_THRESHOLD;

    if (settled) {
      rafId = null;
      wrapper.style.willChange = ''; // release the layer once idle
    } else {
      rafId = requestAnimationFrame(tick);
    }
  }

  function startLoopIfNeeded() {
    if (rafId) return;
    wrapper.style.willChange = 'transform';
    rafId = requestAnimationFrame(tick);
  }

  function onMouseMove(e) {
    const rect = wrapper.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    /* Normalize distance from the avatar's center against half the
       viewport, clamp to [-1, 1], then scale to MAX_SHIFT px. Using the
       whole viewport (rather than just the hero section) means the
       avatar reacts gently no matter where on the page the cursor is. */
    const dx = (e.clientX - cx) / (window.innerWidth / 2);
    const dy = (e.clientY - cy) / (window.innerHeight / 2);

    targetX = Math.max(-1, Math.min(1, dx)) * MAX_SHIFT;
    targetY = Math.max(-1, Math.min(1, dy)) * MAX_SHIFT;

    startLoopIfNeeded();
  }

  function onMouseLeaveWindow() {
    targetX = 0;
    targetY = 0;
    startLoopIfNeeded();
  }

  document.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeaveWindow);
}