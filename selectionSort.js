import { copyArray } from '../recorder.js';

// Sort a copy by selecting the smallest item in each unsorted suffix.
export function selectionSort(inputArray, counter, log) {
  const values = copyArray(inputArray);
  // Place the next minimum value at each position.
  for (let i = 0; i < values.length - 1; i++) {
    let minimum = i;
    // Search the remainder of the array for a smaller item.
    for (let j = i + 1; j < values.length; j++) {
      counter.comparisons++;
      if (values[j] < values[minimum]) {
        minimum = j;
      }
    }
    if (minimum !== i) {
      const temporary = values[i];
      values[i] = values[minimum];
      values[minimum] = temporary;
      counter.swaps++;
      if (log !== null) {
        log.add({ type: 'swap', message: `Swap indexes ${i} and ${minimum}.`, indexes: [i, minimum], array: copyArray(values) });
      }
    }
  }
  if (log !== null) {
    log.add({ type: 'done', message: 'Sorting complete.', indexes: [], array: copyArray(values) });
  }
  return values;
}
