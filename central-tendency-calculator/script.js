const numbersInput = document.getElementById('numbers');
const calculateBtn = document.getElementById('calculateBtn');
const clearBtn = document.getElementById('clearBtn');
const messageEl = document.getElementById('message');
const meanEl = document.getElementById('mean');
const medianEl = document.getElementById('median');
const modeEl = document.getElementById('mode');

function setMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle('error', isError);
}

function parseNumbers(value) {
  const items = value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!items.length) {
    return [];
  }

  const numbers = items.map((item) => Number(item));

  if (numbers.some((num) => Number.isNaN(num))) {
    return null;
  }

  return numbers;
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

function handleCalculate() {
  const inputText = numbersInput.value.trim();

  if (!inputText) {
    setMessage('Please enter at least one number.', true);
    updateResults([]);
    return;
  }

  const numbers = parseNumbers(inputText);

  if (!numbers) {
    setMessage('Please use valid numbers only.', true);
    updateResults([]);
    return;
  }

  setMessage('');
  updateResults(numbers);
}

function handleClear() {
  numbersInput.value = '';
  setMessage('');
  updateResults([]);
  numbersInput.focus();
}

calculateBtn.addEventListener('click', handleCalculate);
clearBtn.addEventListener('click', handleClear);

numbersInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    handleCalculate();
  }
});

updateResults([]);
