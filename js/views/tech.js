/* ─────────────────────────────────────────
   VIEW  —  Tech Stack
   Renders: homepage preview + full detail view
   ───────────────────────────────────────── */

import { techStack } from '../data.js';

/* ── Homepage preview ── */
export function renderStackPreview() {
  const container = document.getElementById('stack-preview');
  if (!container) return;

  container.innerHTML = `
    <div class="stack-grid">
      ${techStack.preview.map(group => `
        <div data-scroll-item>
          <p class="stack-group-label">${group.label}</p>
          <div class="tags">
            ${group.tags.map(t => `
              <span class="tag${t.accent ? ' accent' : ''}">${t.name}</span>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ── Full detail view ── */
export function renderStackView() {
  const container = document.getElementById('tech-view');
  if (!container) return;

  container.innerHTML = `
    <div class="detail-header">
      <button class="back-btn">← Back to Home</button>
      <h2>Tech Stack</h2>
    </div>
    <div class="detail-content">
      ${techStack.full.map(group => `
        <div class="stack-category">
          <h3>${group.label}</h3>
          <div class="detail-tags">
            ${group.tags.map(t => `<span>${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}