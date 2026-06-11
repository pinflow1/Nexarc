// ===== SUPABASE CONFIG =====
const SUPABASE_URL = 'https://lfwoptswzsqdbahdurky.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmd29wdHN3enNxZGJhaGR1cmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwOTkwNzgsImV4cCI6MjA5NjY3NTA3OH0.ZIe0LKiqk_gwxhfYwR3QtPCjbAgOQjC4NnJEwEoimEo';

// ===== WAITLIST FORM =====
async function submitWaitlist() {
  const input = document.getElementById('emailInput');
  const btn = document.getElementById('joinBtn');
  const email = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 400);
    input.focus();
    return;
  }

  // Loading state
  btn.textContent = 'Joining...';
  btn.disabled = true;
  input.disabled = true;

  try {
    // Sign up via Supabase Auth — triggers confirmation email automatically
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email,
        password: crypto.randomUUID(), // random password since we only need email
        options: {
          emailRedirectTo: 'https://quext.vercel.app'
        }
      })
    });

    const data = await response.json();

    // Already signed up
    if (data?.code === 'user_already_exists' || response.status === 422) {
      input.disabled = false;
      btn.textContent = 'Join Waitlist';
      btn.disabled = false;
      input.classList.add('error');
      input.placeholder = 'Already signed up!';
      input.value = '';
      setTimeout(() => {
        input.classList.remove('error');
        input.placeholder = 'Enter email';
      }, 2500);
      return;
    }

    if (!response.ok) throw new Error('Signup failed');

    // Also insert into waitlist table for easy tracking
    await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ email })
    });

    // Show success
    document.getElementById('formState').classList.add('hidden');
    document.getElementById('successState').classList.add('show');

  } catch (err) {
    input.disabled = false;
    btn.textContent = 'Try again';
    btn.disabled = false;
    btn.style.background = '#ff5a3c';
    btn.style.color = 'white';
    setTimeout(() => {
      btn.style.background = '';
      btn.style.color = '';
      btn.textContent = 'Join Waitlist';
    }, 2500);
  }
}

// Event listeners
document.getElementById('joinBtn').addEventListener('click', submitWaitlist);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitWaitlist();
});
