import { copyArray } from '../recorder.js';

// Sort a copy of the input by swapping adjacent out-of-order values.
export function insertionSort(inputArray, counter, log) {
  const values = copyArray(inputArray);
  // Insert each next item into the sorted prefix by swapping it leftward.
  for (let i = 1; i < values.length; i++) {
    let j = i;
    // Continue while the preceding value is larger than the current value.
    while (j > 0) {
      counter.comparisons++;
      if (log !== null) {
        log.add({ type: 'compare', message: `Compare ${values[j - 1]} and ${values[j]}.`, indexes: [j - 1, j], array: copyArray(values) });
      }
      if (values[j - 1] > values[j]) {
        const temporary = values[j - 1];
        values[j - 1] = values[j];
        values[j] = temporary;
        counter.swaps++;
        if (log !== null) {
          log.add({ type: 'swap', message: `Swap indexes ${j - 1} and ${j}.`, indexes: [j - 1, j], array: copyArray(values) });
        }
        j--;
      } else {
        break;
      }
    }
  }
  if (log !== null) {
    log.add({ type: 'done', message: 'Sorting complete.', indexes: [], array: copyArray(values) });
  }
  return values;
}
