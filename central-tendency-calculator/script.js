const numberInput = document.getElementById('numberInput');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const messageEl = document.getElementById('message');
const numbersListEl = document.getElementById('numbersList');
const meanEl = document.getElementById('mean');
const medianEl = document.getElementById('median');
const modeEl = document.getElementById('mode');
const numbers = [];

function setMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle('error', isError);
}

function formatValue(value) {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return Number(value).toFixed(2).replace(/\.00$/, '');
}

function calculateMean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function calculateMode(values) {
  const frequency = new Map();

  for (const value of values) {
    frequency.set(value, (frequency.get(value) || 0) + 1);
  }

  const highest = Math.max(...frequency.values());
  const modes = [...frequency.entries()]
    .filter(([, count]) => count === highest)
    .map(([value]) => value);

  return highest === 1 ? [] : modes;
}

function updateResults(numbers) {
  if (!numbers.length) {
    meanEl.textContent = '-';
    medianEl.textContent = '-';
    modeEl.textContent = '-';
    return;
  }

  const mean = calculateMean(numbers);
  const median = calculateMedian(numbers);
  const modes = calculateMode(numbers);

  meanEl.textContent = formatValue(mean);
  medianEl.textContent = formatValue(median);
  modeEl.textContent = modes.length ? modes.map(formatValue).join(', ') : 'No mode';
}

function renderNumbers() {
  if (!numbers.length) {
    numbersListEl.textContent = 'No numbers yet';
    return;
  }

  numbersListEl.textContent = numbers.map(formatValue).join(', ');
}

function handleAdd() {
  const inputText = numberInput.value.trim();

  if (!inputText) {
    setMessage('Please enter at least one number.', true);
    return;
  }

  const number = Number(inputText);

  if (Number.isNaN(number)) {
    setMessage('Please use valid numbers only.', true);
    return;
  }

  numbers.push(number);
  renderNumbers();
  setMessage('');
  updateResults(numbers);
  numberInput.value = '';
  numberInput.focus();
}

function handleClear() {
  numbers.length = 0;
  numberInput.value = '';
  renderNumbers();
  setMessage('');
  updateResults([]);
  numberInput.focus();
}

addBtn.addEventListener('click', handleAdd);
clearBtn.addEventListener('click', handleClear);

numberInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleAdd();
  }
});

renderNumbers();
updateResults([]);
