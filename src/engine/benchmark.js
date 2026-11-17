import { createCounter, totalOperations } from './recorder.js';
import { measureAverageMs } from './timer.js';
import { listContains } from './validate.js';
import { bubbleSort } from './sorting/bubbleSort.js';
import { insertionSort } from './sorting/insertionSort.js';
import { mergeSort } from './sorting/mergeSort.js';
import { selectionSort } from './sorting/selectionSort.js';

const SORTS = { bubbleSort, insertionSort, mergeSort, selectionSort };

// Create deterministic random values with a small linear congruential generator.
export function makeRandomArray(n, seed = 12345) {
  const values = new Array(n);
  let state = seed >>> 0;
  // Generate each pseudo-random value from the previous state.
  for (let i = 0; i < n; i++) {
    state = (1664525 * state + 1013904223) >>> 0;
    values[i] = state % 10000;
  }
  return values;
}

// Create an array containing increasing integers from one through n.
export function makeSortedArray(n) {
  const values = new Array(n);
  // Fill the array with values in increasing order.
  for (let i = 0; i < n; i++) {
    values[i] = i + 1;
  }
  return values;
}

// Create an array containing decreasing integers from n through one.
export function makeReversedArray(n) {
  const values = new Array(n);
  // Fill the array with values in decreasing order.
  for (let i = 0; i < n; i++) {
    values[i] = n - i;
  }
  return values;
}

// Generate an input of the requested case type and size.
export function makeBenchmarkInput(n, caseType, seed = 12345) {
  if (caseType === 'sorted') {
    return makeSortedArray(n);
  }
  if (caseType === 'reversed') {
    return makeReversedArray(n);
  }
  return makeRandomArray(n, seed);
}

// Run a sorting algorithm across input sizes and return measured rows.
export function createBenchmarkRows(algorithm, sizes, caseType, selectedSort) {
  const sort = selectedSort || (Object.prototype.hasOwnProperty.call(SORTS, algorithm) ? SORTS[algorithm] : undefined);
  if (sort === undefined) {
    return { ok: false, error: 'Choose a supported sorting algorithm.' };
  }
  if (!listContains(['random', 'sorted', 'reversed'], caseType)) {
    return { ok: false, error: 'Choose random, sorted, or reversed benchmark input.' };
  }
  const rows = new Array(sizes.length);
  // Run and measure the selected sort for each requested input size.
  for (let i = 0; i < sizes.length; i++) {
    const n = sizes[i];
    const input = makeBenchmarkInput(n, caseType, 12345 + n);
    const counter = createCounter();
    sort(input, counter, null);
    const measured = measureAverageMs(() => {
      sort(input, createCounter(), null);
    }, 3);
    // Choose the growth term that matches this algorithm and input case.
    let theoretical = n * n;
    if (algorithm === 'mergeSort') {
      theoretical = n * Math.log2(Math.max(n, 2));
    } else if (caseType === 'sorted' && (algorithm === 'bubbleSort' || algorithm === 'insertionSort')) {
      theoretical = n;
    } else if (algorithm === 'quickSortRandom' || (algorithm === 'quickSort' && caseType === 'random')) {
      theoretical = n * Math.log2(Math.max(n, 2));
    } else if (algorithm === 'quickSort' && (caseType === 'sorted' || caseType === 'reversed')) {
      theoretical = n * n;
    }
    rows[i] = {
      n,
      comparisons: counter.comparisons,
      totalOperations: totalOperations(counter),
      timeMs: measured.averageMs,
      runs: measured.runs,
      theoretical
    };
  }
  return { ok: true, rows };
}
