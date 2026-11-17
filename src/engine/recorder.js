// Create the operation counters shared by algorithms and structures.
export function createCounter() {
  return { comparisons: 0, swaps: 0, writes: 0, calls: 0, arithmetic: 0, nodeVisits: 0 };
}

// Sum every operation category in a counter.
export function totalOperations(counter) {
  return counter.comparisons + counter.swaps + counter.writes + counter.calls + counter.arithmetic + counter.nodeVisits;
}

// Copy an array without using built-in array-copy methods.
export function copyArray(arr) {
  const copy = new Array(arr.length);
  // Copy each item by index.
  for (let i = 0; i < arr.length; i++) {
    copy[i] = arr[i];
  }
  return copy;
}

// Store a bounded number of steps without using a ready-made list.
export class StepLog {
  constructor(limit) {
    this.items = new Array(limit);
    this.length = 0;
    this.truncated = false;
  }

  // Add a step when the configured capacity allows it.
  add(step) {
    if (this.length < this.items.length) {
      this.items[this.length] = step;
      this.length++;
    } else {
      this.truncated = true;
    }
  }
}

// Join array values into one text string without using the built-in join method.
export function joinValues(values) {
  let text = '';
  // Add each value, separated by a comma and a space.
  for (let i = 0; i < values.length; i++) {
    if (i > 0) {
      text += ', ';
    }
    text += String(values[i]);
  }
  return text;
}
