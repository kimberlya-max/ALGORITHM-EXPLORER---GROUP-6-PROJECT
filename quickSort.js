// Sort a copy using the class yellow/green partition and a selectable pivot.
export function quickSort(inputArray, counter, log, pivotMode = 'first', random = Math.random) {
  const values = new Array(inputArray.length);
  for (let i = 0; i < inputArray.length; i++) {
    values[i] = inputArray[i];
  }

  function swap(first, second) {
    if (first === second) {
      return;
    }
    const value = values[first];
    values[first] = values[second];
    values[second] = value;
    counter.swaps++;
    if (log !== null) {
      log.add({ type: 'swap', indexes: [first, second], array: values.slice() });
    }
  }

  function sort(low, high) {
    counter.calls++;
    while (low < high) {
      if (pivotMode === 'random') {
        const pivotIndex = low + Math.floor(random() * (high - low + 1));
        swap(low, pivotIndex);
      }
      const pivot = values[low];
      let yellow = low + 1;
      let green = high;
      while (yellow <= green) {
        counter.comparisons++;
        if (values[yellow] <= pivot) {
          if (log !== null) {
            log.add({ type: 'compare', indexes: [yellow, low], array: values.slice() });
          }
          yellow++;
        } else {
          counter.comparisons++;
          if (values[green] > pivot) {
            if (log !== null) {
              log.add({ type: 'compare', indexes: [green, low], array: values.slice() });
            }
            green--;
          } else {
            if (log !== null) {
              log.add({ type: 'compare', indexes: [yellow, green], array: values.slice() });
            }
            swap(yellow, green);
            yellow++;
            green--;
          }
        }
      }
      swap(low, green);
      if (log !== null) {
        log.add({ type: 'partition', indexes: [green], array: values.slice() });
      }

      const leftSize = green - low;
      const rightSize = high - green;
      if (leftSize < rightSize) {
        if (low < green - 1) {
          sort(low, green - 1);
        }
        low = green + 1;
      } else {
        if (green + 1 < high) {
          sort(green + 1, high);
        }
        high = green - 1;
      }
    }
  }

  if (values.length > 1) {
    sort(0, values.length - 1);
  }
  return values;
}
