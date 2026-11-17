import { copyArray } from '../recorder.js';

// Sort a copy of the input with an early-exit bubble sort.
export function bubbleSort(inputArray, counter, log) {
  const values = copyArray(inputArray);
  // Make passes through the unsorted suffix until no swap is needed.
  for (let end = values.length - 1; end > 0; end--) {
    let swapped = false;
    // Compare each neighboring pair in this pass.
    for (let j = 0; j < end; j++) {
      counter.comparisons++;
      if (log !== null) {
        log.add({ type: 'compare', message: `Compare ${values[j]} and ${values[j + 1]}.`, indexes: [j, j + 1], array: copyArray(values) });
      }
      if (values[j] > values[j + 1]) {
        const temporary = values[j];
        values[j] = values[j + 1];
        values[j + 1] = temporary;
        counter.swaps++;
        swapped = true;
        if (log !== null) {
          log.add({ type: 'swap', message: `Swap indexes ${j} and ${j + 1}.`, indexes: [j, j + 1], array: copyArray(values) });
        }
      }
    }
    if (log !== null) {
      log.add({ type: 'pass-done', message: `Pass complete; the last ${values.length - end} item(s) are in place.`, indexes: [], array: copyArray(values) });
    }
    if (!swapped) {
      break;
    }
  }
  if (log !== null) {
    log.add({ type: 'done', message: 'Sorting complete.', indexes: [], array: copyArray(values) });
  }
  return values;
}
