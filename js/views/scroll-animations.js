/* ─────────────────────────────────────────
   MODULE  —  Scroll Animations with GSAP
   Triggers animations as elements enter viewport.
   ───────────────────────────────────────── */

export function initScrollAnimations() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded—scroll animations disabled.');
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // ──────────────────────────────────────────
  // 1. FADE IN ON SCROLL
  // ──────────────────────────────────────────
  gsap.utils.toArray('[data-scroll="fade"]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%', // Trigger when 80% of viewport height from bottom
          end: 'top 50%',
          scrub: false, // Set to 1 for smooth scrubbing effect
          markers: false, // Set to true for debugging
        },
      }
    );
  });

  // ──────────────────────────────────────────
  // 2. STAGGERED ANIMATIONS (for lists)
  // ──────────────────────────────────────────
  gsap.utils.toArray('[data-scroll="stagger"]').forEach((container) => {
    const items = container.querySelectorAll('[data-scroll-item]');
    gsap.fromTo(
      items,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15, // Delay between each item
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          end: 'top 25%',
        },
      }
    );
  });

  // ──────────────────────────────────────────
  // 3. PARALLAX EFFECT ON SCROLL
  // ──────────────────────────────────────────
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const speed = el.dataset.parallax || 0.5;
    gsap.to(el, {
      y: (i, target) => ScrollTrigger.getVelocity(target) * speed * -1,
      scrollTrigger: {
        trigger: el,
        onUpdate: (self) => {
          gsap.to(el, {
            y: self.getVelocity() * speed * -1,
            overwrite: 'auto',
            duration: 0.8,
          });
        },
      },
    });
  });

  // ──────────────────────────────────────────
  // 4. SCALE UP ON SCROLL
  // ──────────────────────────────────────────
  gsap.utils.toArray('[data-scroll="scale"]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      }
    );
  });

  // ──────────────────────────────────────────
  // 5. TEXT REVEAL ON SCROLL
  // ──────────────────────────────────────────
  gsap.utils.toArray('[data-scroll="text-reveal"]').forEach((el) => {
    const lines = el.querySelectorAll('[data-line]');
    gsap.fromTo(
      lines,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
        },
      }
    );
  });

  // ──────────────────────────────────────────
  // 6. SCRUB ANIMATION (tied to scroll bar)
  // ──────────────────────────────────────────
  gsap.utils.toArray('[data-scroll="scrub"]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 100, rotation: -10 },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1, // Tied to scrollbar (1 = 1 second ease after scroll ends)
        },
      }
    );
  });

  console.log('✓ Scroll animations initialized');
}

/* Usage in HTML:
   ─────────────────────────────────────────
   
   <!-- Fade in -->
   <div data-scroll="fade">Content</div>

   <!-- Staggered list -->
   <div data-scroll="stagger">
     <div data-scroll-item>Item 1</div>
     <div data-scroll-item>Item 2</div>
   </div>

   <!-- Parallax -->
   <img data-parallax="0.5" src="..." />

   <!-- Scale up -->
   <div data-scroll="scale">Content</div>

   <!-- Text reveal -->
   <div data-scroll="text-reveal">
     <div data-line>Line 1</div>
     <div data-line>Line 2</div>
   </div>

   <!-- Scrub (scroll-linked) -->
   <div data-scroll="scrub">Content</div>
*/
