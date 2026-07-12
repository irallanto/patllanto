/* ─────────────────────────────────────────
   VIEW  —  Projects
   Renders: homepage preview + full detail view
   ───────────────────────────────────────── */

import { projects } from '../data.js';

function projectCard({ name, desc, url, href, image }) {
  return `
    <a href="${href}" target="_blank" rel="noopener noreferrer" class="detail-project-card" data-scroll-item data-project-image="${image || ''}">
      <span class="card-arrow">↗</span>
      <h3>${name}</h3>
      <p>${desc}</p>
      <span class="url-badge">${url}</span>
    </a>
  `;
}

/* ── Homepage preview ── */
export function renderProjectsPreview() {
  const container = document.getElementById('projects-preview');
  if (!container) return;

  container.innerHTML = `
    <div class="detail-projects-grid">
      ${projects.preview.map(projectCard).join('')}
    </div>
  `;
}

/* ── Full detail view ── */
export function renderProjectsView() {
  const container = document.getElementById('projects-view');
  if (!container) return;

  container.innerHTML = `
    <div class="detail-header">
      <button class="back-btn">← Back to Home</button>
      <h2>All Projects</h2>
    </div>
    <div class="detail-projects-grid">
      ${projects.full.map(projectCard).join('')}
    </div>
  `;
}