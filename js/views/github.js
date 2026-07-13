/* ─────────────────────────────────────────
   VIEW  —  GitHub Activity
   Fetches real contribution data (unofficial jogruber API, since GitHub
   has no public contributions endpoint) and renders it as a dot-matrix
   graph with month/weekday labels, streak stats, and per-day tooltips.
   Always fetches fresh — this is a low-traffic personal site, so the
   accuracy is worth more than the saved request, and it avoids stale
   counts sitting in a visitor's browser after new activity happens.
   ───────────────────────────────────────── */

import { github } from '../data.js';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export async function renderGithubActivity() {
  const container = document.getElementById('github-preview');
  if (!container) return;

  container.innerHTML = stateMarkup('Loading activity…');

  try {
    const data = await getContributions(github.username);
    container.innerHTML = graphMarkup(data);
    animateDots(container);
  } catch (err) {
    console.warn('GitHub contributions failed to load:', err);
    container.innerHTML = stateMarkup("Couldn't load GitHub activity right now.");
  }
}

/* ── Data fetch ── */
async function getContributions(username) {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
  if (!res.ok) throw new Error(`GitHub contributions API responded ${res.status}`);

  const json = await res.json();
  if (!json?.contributions?.length) throw new Error('Empty contributions payload');

  return json;
}

/* ── Grid shaping ──
   Aligns each day to its real day-of-week row (0=Sun..6=Sat), padding
   the first/last week with empty slots the same way GitHub's own
   calendar does — required for the weekday/month labels to line up. */
function buildWeeks(days) {
  const weeks = [];
  let week = new Array(7).fill(null);

  days.forEach(day => {
    const dow = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    week[dow] = day;
    if (dow === 6) {
      weeks.push(week);
      week = new Array(7).fill(null);
    }
  });
  if (week.some(Boolean)) weeks.push(week);

  return weeks;
}

function monthLabels(weeks) {
  const labels = [];
  let lastMonth = null;

  weeks.forEach((week, col) => {
    const firstDay = week.find(Boolean);
    if (!firstDay) return;
    const month = new Date(`${firstDay.date}T00:00:00Z`).getUTCMonth();
    if (month !== lastMonth) {
      labels.push({ col, text: MONTH_NAMES[month] });
      lastMonth = month;
    }
  });

  return labels;
}

/* ── Streaks & headline stats ── */
function computeStats(days) {
  const total = days.reduce((sum, d) => sum + d.count, 0);

  let longest = 0, run = 0;
  days.forEach(d => {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  });

  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current++;
    else break;
  }

  return { total, current, longest };
}

/* ── Rendering ── */
function graphMarkup(data) {
  const days = data.contributions;
  const stats = computeStats(days);
  const weeks = buildWeeks(days);
  const months = monthLabels(weeks);

  const GAP = 12;
  const PAD = 6;
  const width  = weeks.length * GAP + PAD * 2;
  const height = 7 * GAP + PAD * 2;

  let dots = '';
  let i = 0;
  weeks.forEach((week, col) => {
    week.forEach((day, row) => {
      if (!day) return;
      const { r } = dotForLevel(day.level);
      const x = col * GAP + PAD;
      const y = row * GAP + PAD;
      const dateLabel = formatDate(day.date);
      dots += `<circle class="lvl-${day.level}" cx="${x}" cy="${y}" r="${r}" style="--i:${i}"><title>${day.count} contribution${day.count === 1 ? '' : 's'} on ${dateLabel}</title></circle>`;
      i++;
    });
  });

  const monthRow = months.map(m => {
    const leftPct = (m.col / weeks.length) * 100;
    return `<span style="left:${leftPct}%">${m.text}</span>`;
  }).join('');

  return `
    <div class="github-card">
      <div class="github-stats">
        <div class="github-stat">
          <p class="github-stat-num">${stats.total.toLocaleString()}</p>
          <p class="github-stat-label">Contributions</p>
        </div>
        <div class="github-stat">
          <p class="github-stat-num">${stats.current}</p>
          <p class="github-stat-label">Current streak</p>
        </div>
        <div class="github-stat">
          <p class="github-stat-num">${stats.longest}</p>
          <p class="github-stat-label">Longest streak</p>
        </div>
      </div>

      <div class="github-graph-wrap">
        <div class="github-months">${monthRow}</div>
        <div class="github-graph-row">
          <div class="github-weekdays">
            <span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span>
          </div>
          <svg class="github-dots" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet"
               role="img" aria-label="GitHub contribution graph — ${stats.total.toLocaleString()} contributions in the last year">
            ${dots}
          </svg>
        </div>
      </div>

      <div class="github-footer">
        <p class="github-count">${stats.total.toLocaleString()} contributions in the last year</p>
        <div class="github-legend">
          <span>Less</span>
          <i class="lvl-0"></i><i class="lvl-1"></i><i class="lvl-2"></i><i class="lvl-3"></i><i class="lvl-4"></i>
          <span>More</span>
        </div>
      </div>
    </div>
  `;
}

function dotForLevel(level) {
  switch (level) {
    case 4:  return { r: 3.8 };
    case 3:  return { r: 3.0 };
    case 2:  return { r: 2.2 };
    case 1:  return { r: 1.5 };
    default: return { r: 0.9 };
  }
}

function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

/* ── Staggered entrance (skipped for reduced-motion users) ── */
function animateDots(container) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  container.querySelectorAll('.github-dots circle').forEach(c => c.classList.add('dot-in'));
}

function stateMarkup(message) {
  return `<div class="github-card github-card-state"><p class="github-count">${message}</p></div>`;
}