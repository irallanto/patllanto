/* ─────────────────────────────────────────
   MODULE  —  Theme Toggle
   Handles: dark/light switch · localStorage · avatar video (forward + reverse)
   ───────────────────────────────────────── */

export function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const root   = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';

    if (isDark) {
      // → switch page to light immediately
      root.removeAttribute('data-theme');
      root.classList.remove('avatar-done');
      localStorage.setItem('theme', 'light');

      // → play reverse avatar animation independently
      root.classList.add('avatar-reversing');
      playAvatar('reverse', () => {
        root.classList.remove('avatar-reversing');
      });

    } else {
      // → switch page to dark immediately, play forward video
      root.setAttribute('data-theme', 'dark');
      root.classList.remove('avatar-done');
      root.classList.remove('avatar-reversing');
      localStorage.setItem('theme', 'dark');

      playAvatar('forward', () => {
        root.classList.add('avatar-done');
      });
    }
  });
}

function playAvatar(direction, onDone) {
  const video = document.querySelector('.avatar-video');
  if (!video) return;

  const mp4 = direction === 'forward'
    ? '/assets/avatar/profile-to-dark.mp4'
    : '/assets/avatar/profile-to-light.mp4';

  // Swap sources and wait until browser can play before starting
  video.pause();
  const sources = video.querySelectorAll('source');
  sources[0].src = mp4;
  sources[1].src = mp4;
  sources[0].type = 'video/mp4';
  sources[1].type = 'video/mp4';

  video.load();

  video.addEventListener('canplaythrough', () => {
    video.currentTime = 0;
    video.play();
    video.addEventListener('ended', onDone, { once: true });
  }, { once: true });
}