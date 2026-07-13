/* ─────────────────────────────────────────
   VIEW  —  Sidebar + Testimonials
   Renders: experience timeline · testimonials · social links
   ───────────────────────────────────────── */

import { experience, testimonials, socialLinks } from '../data.js';
import { supabase } from '../supabase-client.js';

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

/* ── Testimonials ──
   Renders the curated list from data.js immediately, then fetches
   visitor-submitted comments that have been approved (see
   comment-widget.js + /admin.html) and appends them once they're in.
   Approved comments are the only ones Supabase's RLS policy lets an
   anonymous visitor read — pending/declined stay invisible here. */
export async function renderTestimonials() {
  const container = document.getElementById('testimonials-list');
  if (!container) return;

  container.innerHTML = `<div class="testimonials">${visibleTestimonials.map(testimonialCard).join('')}</div>`;

  const { data, error } = await supabase
    .from('comments')
    .select('name, role, company, message, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Approved comments failed to load:', error);
    return;
  }
  if (!data?.length) return;

  const approvedCards = data
    .map(c => ({
      quote: c.message,
      initials: initialsFrom(c.name),
      name: c.name,
      role: formatRole(c.role, c.company),
    }))
    .map(testimonialCard)
    .join('');

  container.querySelector('.testimonials')?.insertAdjacentHTML('beforeend', approvedCards);
}

function testimonialCard(t) {
  return `
    <div class="testimonial-card" data-scroll-item>
      <p class="testimonial-quote">${escapeHtml(t.quote)}</p>
      <div class="testimonial-author">
        <div class="author-avatar">${escapeHtml(t.initials)}</div>
        <div>
          <div class="author-name">${escapeHtml(t.name)}</div>
          <div class="author-role">${escapeHtml(t.role)}</div>
        </div>
      </div>
    </div>
  `;
}

function initialsFrom(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?';
}

/* Matches the "Position, Company" shape your curated testimonials
   already use in data.js. Both fields are optional on the comment
   form, so this gracefully degrades down to "Site visitor". */
function formatRole(role, company) {
  const r = (role || '').trim();
  const c = (company || '').trim();
  if (r && c) return `${r}, ${c}`;
  return r || c || 'Site visitor';
}

/* Comments come from strangers on the internet — escape before
   dropping them into innerHTML so a submitted comment can't inject
   markup/scripts into the page. */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
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