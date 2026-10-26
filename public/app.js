// public/app.js - Phase 1 status check
async function checkHealth() {
  const el = document.getElementById('status');
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    el.textContent = data.status === 'ok'
      ? 'Server is up and running. ✅'
      : 'Unexpected server response.';
  } catch {
    el.textContent = 'Could not reach the server. ❌';
  }
}
checkHealth();
