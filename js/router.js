/* ─────────────────────────────────────────
   MODULE  —  SPA View Router
   Handles: main / tech-stack / projects / certs view switching
   ───────────────────────────────────────── */

import { renderStackView    } from './views/tech.js';
import { renderProjectsView } from './views/projects.js';
import { renderCertsView    } from './views/certs.js';

export function initRouter() {
  const views = {
    main:     document.getElementById('main-view'),
    tech:     document.getElementById('tech-view'),
    projects: document.getElementById('projects-view'),
    certs:    document.getElementById('certs-view'),
  };

  const btnViewTech     = document.getElementById('btn-view-tech');
  const btnViewProjects = document.getElementById('btn-view-projects');
  const btnViewCerts    = document.getElementById('btn-view-certs');

  /* Hides all views, then reveals the one requested */
  function showView(target) {
    Object.values(views).forEach(v => v.classList.add('hidden'));
    target.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* Back buttons are injected dynamically into detail views, and those
     views only ever render once (see the *Rendered flags below), so a
     freshly-queried addEventListener on each showView() call would keep
     stacking duplicate listeners onto the same button. Delegating the
     click from `document` binds it exactly once, regardless of how many
     times views get rendered or re-shown. */
  document.addEventListener('click', e => {
    if (e.target.closest('.back-btn')) {
      e.preventDefault();
      showView(views.main);
    }
  });

  /* "View All →" triggers — render content on first visit, then just show */
  let techRendered = false;
  btnViewTech?.addEventListener('click', e => {
    e.preventDefault();
    if (!techRendered) { renderStackView(); techRendered = true; }
    showView(views.tech);
  });

  let projectsRendered = false;
  btnViewProjects?.addEventListener('click', e => {
    e.preventDefault();
    if (!projectsRendered) { renderProjectsView(); projectsRendered = true; }
    showView(views.projects);
  });

  let certsRendered = false;
  btnViewCerts?.addEventListener('click', e => {
    e.preventDefault();
    if (!certsRendered) { renderCertsView(); certsRendered = true; }
    showView(views.certs);
  });
}