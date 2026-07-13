/* ─────────────────────────────────────────
   ADMIN  —  Comments review page
   Gated by Supabase Auth: only a signed-in user (you) can read
   pending/declined rows or change their status — see the RLS
   policies in supabase-setup.sql. The anon public key in
   supabase-client.js is safe to ship; it's these policies that do
   the actual access control.
   ───────────────────────────────────────── */

import { supabase } from './supabase-client.js';

const loginForm    = document.getElementById('loginForm');
const loginStatus  = document.getElementById('loginStatus');
const adminMain    = document.getElementById('adminMain');
const logoutBtn    = document.getElementById('logoutBtn');
const pendingList  = document.getElementById('pendingList');
const approvedList = document.getElementById('approvedList');
const declinedList = document.getElementById('declinedList');
const pendingCount = document.getElementById('pendingCount');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

function card(row) {
  const actions = [];
  if (row.status !== 'approved') actions.push(`<button class="btn btn-approve" data-action="approve" data-id="${row.id}">Approve</button>`);
  if (row.status !== 'declined') actions.push(`<button class="btn btn-decline" data-action="decline" data-id="${row.id}">Decline</button>`);
  actions.push(`<button class="btn btn-danger" data-action="delete" data-id="${row.id}">Delete</button>`);

  return `
    <div class="admin-card">
      <p class="admin-card-quote">${escapeHtml(row.message)}</p>
      <p class="admin-card-meta">${escapeHtml(row.name)} · ${formatDate(row.created_at)}</p>
      <div class="admin-card-actions">${actions.join('')}</div>
    </div>
  `;
}

async function loadComments() {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    pendingList.innerHTML = `<p class="admin-empty">Couldn't load comments.</p>`;
    console.warn(error);
    return;
  }

  const pending  = data.filter(r => r.status === 'pending');
  const approved = data.filter(r => r.status === 'approved');
  const declined = data.filter(r => r.status === 'declined');

  pendingCount.textContent = pending.length ? `(${pending.length})` : '';

  pendingList.innerHTML  = pending.length  ? pending.map(card).join('')  : '<p class="admin-empty">No pending comments.</p>';
  approvedList.innerHTML = approved.length ? approved.map(card).join('') : '<p class="admin-empty">No approved comments yet.</p>';
  declinedList.innerHTML = declined.length ? declined.map(card).join('') : '<p class="admin-empty">No declined comments.</p>';
}

async function handleAction(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === 'delete') {
    if (!confirm('Delete this comment permanently?')) return;
    await supabase.from('comments').delete().eq('id', id);
  } else {
    const status = action === 'approve' ? 'approved' : 'declined';
    await supabase.from('comments').update({ status }).eq('id', id);
  }

  loadComments();
}

async function showAdmin() {
  loginForm.classList.add('hidden');
  adminMain.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
  await loadComments();
}

function showLogin() {
  loginForm.classList.remove('hidden');
  adminMain.classList.add('hidden');
  logoutBtn.classList.add('hidden');
}

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  loginStatus.textContent = 'Signing in…';
  loginStatus.className = 'admin-status';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    loginStatus.textContent = 'Wrong email or password.';
    loginStatus.className = 'admin-status error';
    return;
  }

  loginStatus.textContent = '';
  showAdmin();
});

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  showLogin();
});

document.addEventListener('click', handleAction);

/* Restore session on refresh, so you're not re-logging in constantly */
supabase.auth.getSession().then(({ data }) => {
  if (data.session) showAdmin();
  else showLogin();
});