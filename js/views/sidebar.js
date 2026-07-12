/* ─────────────────────────────────────────
   VIEW  —  Sidebar + Testimonials
   Renders: experience timeline · testimonials · social links
   ───────────────────────────────────────── */

import { experience, testimonials, socialLinks } from '../data.js';

/* Only show entries that are ready to go public. See data.js for the
   `visible` flag on placeholder entries. */
const visibleExperience  = experience.filter(e => e.visible !== false);
const visibleTestimonials = testimonials.filter(t => t.visible !== false);

/* ── Experience Timeline ── */
export function renderExperience() {
  const container = document.getElementById('experience-timeline');
  if (!container) return;

  container.innerHTML = visibleExperience.map(item => `
    <div class="timeline-item${item.current ? ' current' : ''}" data-scroll-item>
      <div class="timeline-dot"></div>
      <div class="timeline-role">${item.role}</div>
      <div class="timeline-meta">
        <span>${item.company}</span>
        <span>${item.period}</span>
      </div>
    </div>
  `).join('');
}

/* ── Testimonials ── */
export function renderTestimonials() {
  const container = document.getElementById('testimonials-list');
  if (!container) return;

  container.innerHTML = `
    <div class="testimonials">
      ${visibleTestimonials.map(t => `
        <div class="testimonial-card" data-scroll-item>
          <p class="testimonial-quote">${t.quote}</p>
          <div class="testimonial-author">
            <div class="author-avatar">${t.initials}</div>
            <div>
              <div class="author-name">${t.name}</div>
              <div class="author-role">${t.role}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ── Social Links ── */
export function renderSocialLinks() {
  const container = document.getElementById('social-links');
  if (!container) return;

  container.innerHTML = socialLinks.map(s => `
    <a href="${s.href}" target="_blank" rel="noopener noreferrer" class="social-link">
      <div class="social-link-icon"><img src="${s.icon}" alt="${s.label}" loading="lazy" /></div>
      <div>
        <div class="social-link-label">${s.label}</div>
        <div class="social-link-handle">${s.handle}</div>
      </div>
    </a>
  `).join('');
}