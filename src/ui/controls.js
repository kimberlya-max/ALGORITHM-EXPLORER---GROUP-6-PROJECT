const ALGORITHMS = {
  sorting: [
    { value: 'bubbleSort', label: 'Bubble sort' },
    { value: 'selectionSort', label: 'Selection sort' },
    { value: 'insertionSort', label: 'Insertion sort' },
    { value: 'mergeSort', label: 'Merge sort' },
    { value: 'quickSort', label: 'Quicksort (first-element pivot)' },
    { value: 'quickSortRandom', label: 'Quicksort (randomized pivot)' }
  ],
  recursion: [
    { value: 'factorial', label: 'Factorial (recursive)' },
    { value: 'factorialIterative', label: 'Factorial (iterative)' },
    { value: 'fibonacci', label: 'Fibonacci (naive recursion)' },
    { value: 'fibonacciMemoized', label: 'Fibonacci (memoized recursion)' },
    { value: 'fibonacciBottomUp', label: 'Fibonacci (bottom-up)' },
    { value: 'hanoi', label: 'Tower of Hanoi' }
  ],
  structure: [
    { value: 'stack', label: 'Stack (fixed array)' },
    { value: 'linearQueue', label: 'Linear queue (fixed array)' },
    { value: 'circularQueue', label: 'Circular queue (fixed array)' },
    { value: 'linkedList', label: 'Singly linked list' },
    { value: 'doublyLinkedList', label: 'Doubly linked list' },
    { value: 'brackets', label: 'Balanced brackets (stack)' }
  ],
  analysis: [
    { value: 'benchmark', label: 'Sorting benchmarks and growth rates' }
  ]
};

const INPUT_HELP = {
  sorting: 'Enter comma- or space-separated numbers (up to 5000). Step snapshots are shown for up to 30 values.',
  factorial: 'Enter one whole number from 0 to 18.',
  factorialIterative: 'Enter one whole number from 0 to 18.',
  fibonacci: 'Enter one whole number from 0 to 30. Naive recursion is capped because its call tree grows exponentially.',
  fibonacciMemoized: 'Enter one whole number from 0 to 77.',
  fibonacciBottomUp: 'Enter one whole number from 0 to 77.',
  hanoi: 'Enter disk count, source peg, destination peg, auxiliary peg (e.g. 3, A, C, B). Disk count is 1–8.',
  stack: 'Set capacity below. Commands: push <number>, pop, peek, size, is_empty, is_full, display.',
  linearQueue: 'Set capacity below. Commands: enqueue <number>, dequeue, front, size, is_empty, is_full, display.',
  circularQueue: 'Set capacity below. Commands: enqueue <number>, dequeue, front, size, is_empty, is_full, display.',
  linkedList: 'Commands: insertHead <n>, insertTail <n>, insertBefore <target> <n>, insertAfter <target> <n>, deleteHead, deleteTail, deleteBefore <n>, deleteAfter <n>, delete <n>, search <n>, size, display.',
  doublyLinkedList: 'Use the singly-list commands; also use displayBack to traverse backward.',
  brackets: 'Enter only brackets and whitespace, e.g. { ( [ ] ) }.',
  benchmark: 'Choose a sorting algorithm, input case, and the required input sizes in the analysis panel.'
};

const INPUT_EXAMPLES = {
  sorting: 'For example: 5, 2, 9, 1, 5',
  factorial: 'For example: 5',
  factorialIterative: 'For example: 5',
  fibonacci: 'For example: 6',
  fibonacciMemoized: 'For example: 30',
  fibonacciBottomUp: 'For example: 30',
  hanoi: 'For example: 3, A, C, B',
  stack: 'For example: push 4, push 7, pop, peek',
  linearQueue: 'For example: enqueue 4, enqueue 7, dequeue, is_full',
  circularQueue: 'For example: enqueue 4, enqueue 7, dequeue, enqueue 9',
  linkedList: 'For example: insertHead 3, insertTail 8, insertBefore 8 6, search 6',
  doublyLinkedList: 'For example: insertHead 3, insertTail 8, displayBack',
  brackets: 'For example: { ( [ ] ) }',
  benchmark: 'Use the benchmark options below.'
};

export function getRequestFromForm() {
  return {
    category: document.getElementById('category').value,
    algorithm: document.getElementById('algorithm').value,
    input: document.getElementById('user-input').value,
    capacity: document.getElementById('structure-capacity').value
  };
}

export function showError(message) {
  const error = document.getElementById('error-message');
  error.textContent = message;
  error.hidden = message.length === 0;
}

export function updateInputHelp() {
  const category = document.getElementById('category').value;
  const algorithm = document.getElementById('algorithm').value;
  const key = category === 'sorting' ? 'sorting' : algorithm;
  document.getElementById('user-input').placeholder = INPUT_EXAMPLES[key] || '';
  document.getElementById('input-help').textContent = INPUT_HELP[key] || '';
  document.getElementById('capacity-field').hidden =
    category !== 'structure' || !['stack', 'linearQueue', 'circularQueue'].includes(algorithm);
}

export function updateAlgorithmOptions() {
  const category = document.getElementById('category').value;
  const algorithmSelect = document.getElementById('algorithm');
  const options = ALGORITHMS[category];
  algorithmSelect.textContent = '';
  for (let i = 0; i < options.length; i++) {
    const option = document.createElement('option');
    option.value = options[i].value;
    option.textContent = options[i].label;
    algorithmSelect.appendChild(option);
  }
  updateInputHelp();
}
