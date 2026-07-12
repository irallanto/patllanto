/* ─────────────────────────────────────────
   MODULE  —  Image Loading Optimization
   Handles fallbacks for missing images
   ───────────────────────────────────────── */

export function initImageOptimization() {
  // Fallback for images that fail to load
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      const img = e.target;
      
      // Add error class for styling
      img.classList.add('image-error');
      
      // Optional: Set a placeholder or hide the element
      if (!img.dataset.noFallback) {
        img.style.opacity = '0.5';
      }
      
      console.warn(`Image failed to load: ${img.src}`);
    }
  }, true);

  // Preload check for hover preview images
  const preloadImages = document.querySelectorAll('[data-project-image], [data-cert-image]');
  preloadImages.forEach((el) => {
    const src = el.dataset.projectImage || el.dataset.certImage;
    if (src) {
      const img = new Image();
      img.onerror = () => {
        console.warn(`Hover preview image failed: ${src}`);
      };
      img.src = src;
    }
  });

  console.log('✓ Image optimization initialized');
}
