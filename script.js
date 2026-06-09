// ===== WAITLIST FORM =====
function submitWaitlist() {
  const input = document.getElementById('emailInput');
  const email = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 400);
    input.focus();
    return;
  }

  // TODO: hook up your API here
  // fetch('/api/waitlist', { method: 'POST', body: JSON.stringify({ email }) });

  document.getElementById('formState').classList.add('hidden');
  document.getElementById('successState').classList.add('show');
}

// Event listeners
document.getElementById('joinBtn').addEventListener('click', submitWaitlist);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitWaitlist();
});
