/* ═══════════════════════════════════════════
   MAIN ENTRY POINT
   Imports and initialises all JS modules
   ═══════════════════════════════════════════ */

import { initTheme  } from './theme.js';
import { initRouter } from './router.js';
import { initBackgroundParallax } from './views/Background-parallax.js';
import { initThreeAccent } from './views/three-accent.js';
import { initScrollAnimations } from './views/scroll-animations.js';
import { initHoverPreview } from './views/hover-preview.js';
import { initImageOptimization } from './views/image-optimization.js';
import { initAudioHover } from './views/audio-hover.js';
import { initCommentWidget } from './views/comment-widget.js';
import { initCurtain } from './views/curtain.js';

import { renderStackPreview    } from './views/tech.js';
import { renderProjectsPreview } from './views/projects.js';
import { renderCertsPreview    } from './views/certs.js';
import { renderExperience, renderTestimonials, renderSocialLinks } from './views/sidebar.js';
import { renderGithubActivity } from './views/github.js';

document.addEventListener('DOMContentLoaded', () => {
  /* Theme must run first */
  initTheme();

  /* Full-page background parallax (no-ops on reduced-motion) */
  initBackgroundParallax();

  /* Scroll-triggered animations (fade, parallax, scale, etc.) */
  initScrollAnimations();

  /* Hover image previews for projects & certifications */
  initHoverPreview();

  /* Crisp hover sound for interactive content */
  initAudioHover();

  /* Curtain intro + merchant sprite welcome greeting */
  initCurtain();

  /* Image loading optimization & error handling */
  initImageOptimization();

  /* Floating "leave a comment" button + overlay form */
  initCommentWidget();

  /* Render all homepage content from data.js */
  renderStackPreview();
  renderProjectsPreview();
  renderCertsPreview();
  renderExperience();
  renderTestimonials();
  renderSocialLinks();
  renderGithubActivity();

  /* Router wires up navigation after content is in the DOM */
  initRouter();

  /* Footer year — never needs manual updating again */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Add ready state to body for CSS animations */
  document.body.classList.add('ready');

  /* Reveal the intro background loader only after the visitor interacts. */
  const loader = document.querySelector('.page-loader');
  if (loader) {
    const revealLoader = () => {
      document.body.classList.add('page-loading');
      requestAnimationFrame(() => {
        document.body.classList.add('page-loaded');
        window.setTimeout(() => loader.remove(), 1400);
      });
      window.removeEventListener('pointerdown', revealLoader);
      window.removeEventListener('keydown', revealLoader);
    };

    window.addEventListener('pointerdown', revealLoader, { once: true, passive: true });
    window.addEventListener('keydown', revealLoader, { once: true });

    /* If the user never interacts, still reveal the loader after a fallback delay. */
    window.setTimeout(revealLoader, 5000);
  }
});