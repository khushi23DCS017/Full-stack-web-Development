let count = 0;

async function fetchCount() {
  const res = await fetch('/api/count');
  const data = await res.json();
  count = data.count;
  updateDisplay();
}

async function updateCount() {
  await fetch('/api/count', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count })
  });
}

function updateDisplay() {
  document.getElementById('count-display').textContent = count;
}

function changeCount(val) {
  count += val;
  if (count < 0) count = 0;
  updateDisplay();
  updateCount();
}

function resetCount() {
  count = 0;
  updateDisplay();
  updateCount();
}

window.onload = fetchCount;
