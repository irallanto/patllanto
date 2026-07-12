/* ─────────────────────────────────────────
   MODULE  —  Decorative 3D Accent
   A small wireframe icosahedron, fixed to the bottom-right corner of
   the viewport. Idles with a slow auto-rotation and tilts gently
   toward the cursor. Purely decorative:
     - never intercepts clicks/scroll (pointer-events: none in CSS)
     - recolors itself to match --accent when the theme toggles
     - respects prefers-reduced-motion (freezes the spin)
     - pauses the render loop while the tab is hidden
     - hidden on small screens (see css/responsive.css)
   ───────────────────────────────────────── */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const SIZE = 120; // px — must match #three-accent width/height in CSS

export function initThreeAccent() {
  const mount = document.getElementById('three-accent');
  if (!mount || !window.WebGLRenderingContext) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsFinePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch (err) {
    return; // WebGL unavailable — fail silently, it's decorative only
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(SIZE, SIZE);
  mount.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 5;

  const getAccentColor = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#E8873A';

  const geometry = new THREE.IcosahedronGeometry(1.5, 0);
  const material = new THREE.MeshBasicMaterial({
    color: getAccentColor(),
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /* Keep the wireframe color in sync whenever theme.js flips data-theme */
  const syncColor = () => material.color.set(getAccentColor());
  new MutationObserver(syncColor).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  /* Cursor-driven tilt — skipped on touch devices / reduced motion */
  let targetTiltX = 0, targetTiltY = 0;
  if (supportsFinePointer && !prefersReducedMotion) {
    window.addEventListener('mousemove', e => {
      const dx = (e.clientX / window.innerWidth) * 2 - 1;
      const dy = (e.clientY / window.innerHeight) * 2 - 1;
      targetTiltY = dx * 0.4;
      targetTiltX = dy * 0.4;
    }, { passive: true });
  }

  let autoRotX = 0, autoRotY = 0;
  let tiltX = 0, tiltY = 0;
  let isVisible = !document.hidden;
  let rafId = null;

  function renderLoop() {
    if (!isVisible) { rafId = null; return; }

    if (!prefersReducedMotion) {
      autoRotY += 0.004;
      autoRotX += 0.0015;
    }
    tiltX += (targetTiltX - tiltX) * 0.05;
    tiltY += (targetTiltY - tiltY) * 0.05;

    mesh.rotation.set(autoRotX + tiltX, autoRotY + tiltY, 0);
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(renderLoop);
  }

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible && !rafId) renderLoop();
  });

  renderLoop();
}