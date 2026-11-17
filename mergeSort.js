import { copyArray } from '../recorder.js';

// Sort a copied array by recursively sorting and merging its halves.
export function mergeSort(inputArray, counter, log) {
  const values = copyArray(inputArray);
  // Sort the requested range, splitting it until each range has one item.
  function mergeSortRange(array, left, right, currentCounter, currentLog, depth) {
    if (left >= right) {
      return;
    }
    const middle = Math.floor((left + right) / 2);
    if (currentLog !== null) {
      currentLog.add({ type: 'split', message: `Split indexes ${left}–${right} at ${middle}.`, indexes: [left, right], array: copyArray(array), depth });
    }
    mergeSortRange(array, left, middle, currentCounter, currentLog, depth + 1);
    mergeSortRange(array, middle + 1, right, currentCounter, currentLog, depth + 1);

    const leftLength = middle - left + 1;
    const rightLength = right - middle;
    const leftValues = new Array(leftLength);
    const rightValues = new Array(rightLength);
    // Copy the left half into temporary storage.
    for (let i = 0; i < leftLength; i++) {
      leftValues[i] = array[left + i];
    }
    // Copy the right half into temporary storage.
    for (let j = 0; j < rightLength; j++) {
      rightValues[j] = array[middle + 1 + j];
    }
    let leftIndex = 0;
    let rightIndex = 0;
    let outputIndex = left;
    // Merge while both temporary halves still contain items.
    while (leftIndex < leftLength && rightIndex < rightLength) {
      currentCounter.comparisons++;
      if (leftValues[leftIndex] <= rightValues[rightIndex]) {
        array[outputIndex] = leftValues[leftIndex];
        leftIndex++;
      } else {
        array[outputIndex] = rightValues[rightIndex];
        rightIndex++;
      }
      currentCounter.writes++;
      outputIndex++;
      if (currentLog !== null) {
        currentLog.add({ type: 'write', message: `Write merged value at index ${outputIndex - 1}.`, indexes: [outputIndex - 1], array: copyArray(array), depth });
      }
    }
    // Copy any remaining values from the left half.
    while (leftIndex < leftLength) {
      array[outputIndex] = leftValues[leftIndex];
      leftIndex++;
      outputIndex++;
      currentCounter.writes++;
      if (currentLog !== null) {
        currentLog.add({ type: 'write', message: `Write merged value at index ${outputIndex - 1}.`, indexes: [outputIndex - 1], array: copyArray(array), depth });
      }
    }
    // Copy any remaining values from the right half.
    while (rightIndex < rightLength) {
      array[outputIndex] = rightValues[rightIndex];
      rightIndex++;
      outputIndex++;
      currentCounter.writes++;
      if (currentLog !== null) {
        currentLog.add({ type: 'write', message: `Write merged value at index ${outputIndex - 1}.`, indexes: [outputIndex - 1], array: copyArray(array), depth });
      }
    }
    if (currentLog !== null) {
      currentLog.add({ type: 'merge', message: `Merged indexes ${left}–${right}.`, indexes: [left, right], array: copyArray(array), depth });
    }
  }
  mergeSortRange(values, 0, values.length - 1, counter, log, 0);
  if (log !== null) {
    log.add({ type: 'done', message: 'Sorting complete.', indexes: [], array: copyArray(values) });
  }
  return values;
}
