const form = document.getElementById('contactForm');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');
const loading = document.getElementById('loading');

function setStatus(type, text) {
  statusEl.style.display = 'block';
  statusEl.className = 'msg ' + (type === 'success' ? 'success' : 'error');
  statusEl.textContent = text;
}

function clearStatus() {
  statusEl.style.display = 'none';
  statusEl.textContent = '';
  statusEl.className = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearStatus();

  // clear field errors
  ['nameError', 'emailError', 'messageError'].forEach(
    (id) => (document.getElementById(id).textContent = '')
  );

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  let hasError = false;
  if (!name) {
    document.getElementById('nameError').textContent = 'Name is required';
    hasError = true;
  }
  if (!email || !validateEmail(email)) {
    document.getElementById('emailError').textContent = 'Valid email is required';
    hasError = true;
  }
  if (!message || message.length < 5) {
    document.getElementById('messageError').textContent = 'Message too short';
    hasError = true;
  }

  if (hasError) return;

  submitBtn.disabled = true;
  loading.style.display = 'inline';

  try {
    const res = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setStatus('success', data.message || 'Message sent! I will reply soon.');
      form.reset();

      if (data.previewUrl) {
        const a = document.createElement('a');
        a.href = data.previewUrl;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'Preview email (Ethereal)';
        a.style.display = 'block';
        a.style.marginTop = '8px';
        statusEl.appendChild(a);
      }
    } else {
      if (data && data.errors && Array.isArray(data.errors)) {
        data.errors.forEach((err) => {
          if (err.param === 'name')
            document.getElementById('nameError').textContent = err.msg;
          if (err.param === 'email')
            document.getElementById('emailError').textContent = err.msg;
          if (err.param === 'message')
            document.getElementById('messageError').textContent = err.msg;
        });
        setStatus('error', 'Please correct the highlighted fields.');
      } else {
        setStatus(
          'error',
          data && data.message ? data.message : 'Failed to send your message.'
        );
      }
    }
  } catch (err) {
    console.error('Submit error', err);
    setStatus('error', 'Network or server error. Try again later.');
  } finally {
    submitBtn.disabled = false;
    loading.style.display = 'none';
  }
});
