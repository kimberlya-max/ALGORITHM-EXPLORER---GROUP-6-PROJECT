// Store the theoretical complexity and explanation for every algorithm.
export const COMPLEXITY = {
  bubbleSort: { name: 'Bubble sort', best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)', stable: 'Yes', note: 'An early-exit pass makes already sorted input linear.' },
  insertionSort: { name: 'Insertion sort', best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)', stable: 'Yes', note: 'Adjacent swaps stop early when the prefix is ordered.' },
  mergeSort: { name: 'Merge sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: 'Yes', note: 'It divides the array and merges each level using temporary storage.' },
  selectionSort: { name: 'Selection sort', best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)', stable: 'No', note: 'It scans the unsorted suffix to find each next minimum.' },
  quickSort: { name: 'Quicksort (first pivot)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)', space: 'O(log n)', stable: 'No', note: 'The first-element pivot can produce unbalanced partitions on sorted input.' },
  quickSortRandom: { name: 'Quicksort (random pivot)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)', space: 'O(log n)', stable: 'No', note: 'Randomized pivot selection reduces the likelihood of consistently unbalanced partitions.' },
  factorial: {
    name: 'Factorial', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)',
    note: 'There is one recursive call per decreasing value, so the call stack is n + 1 calls deep.',
    baseCase: 'When n = 0 the function returns 1 and makes no further call.',
    recursiveCase: 'When n > 0 the function returns n × factorial(n - 1).'
  },
  fibonacci: {
    name: 'Naive Fibonacci', best: 'O(2^n)', average: 'O(2^n)', worst: 'O(2^n)', space: 'O(n)',
    note: 'Repeated recursive subproblems create an exponential call tree.',
    baseCase: 'When n = 0 the function returns 0, and when n = 1 it returns 1.',
    recursiveCase: 'When n > 1 the function returns fibonacci(n - 1) + fibonacci(n - 2).'
  },
  factorialIterative: {
    name: 'Factorial (iterative)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)',
    note: 'A loop multiplies each integer from 2 through n.'
  },
  fibonacciMemoized: {
    name: 'Fibonacci (memoized recursion)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)',
    note: 'Each Fibonacci value is calculated once and cached.',
    baseCase: 'When n = 0 or n = 1, return n.',
    recursiveCase: 'For n > 1, add the cached values for n - 1 and n - 2.'
  },
  fibonacciBottomUp: {
    name: 'Fibonacci (bottom-up)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)',
    note: 'A loop builds each value from the two preceding values.',
    baseCase: 'F(0) = 0 and F(1) = 1.',
    recursiveCase: 'For each i from 2 through n, compute F(i) = F(i - 1) + F(i - 2).'
  },
  hanoi: {
    name: 'Tower of Hanoi', best: 'O(2^n)', average: 'O(2^n)', worst: 'O(2^n)', space: 'O(n)',
    note: 'The puzzle requires 2^n - 1 moves and uses a recursive call stack.',
    baseCase: 'With zero disks, no move is needed.',
    recursiveCase: 'Move n - 1 disks to the spare peg, move the largest disk, then move n - 1 onto it.'
  },
  stack: { name: 'Stack', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)', note: 'Each push, pop, and peek takes constant time. The total for a run grows with the number of commands.' },
  queue: { name: 'Queue', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)', note: 'Each enqueue, dequeue, and peek takes constant time. The total for a run grows with the number of commands.' },
  linearQueue: { name: 'Linear array queue', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)', note: 'Operations are constant time; rear space is not reclaimed after dequeue.' },
  circularQueue: { name: 'Circular array queue', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)', note: 'Front and rear indices wrap around to reuse freed array slots.' },
  brackets: { name: 'Balanced brackets', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)', note: 'Each bracket is processed once using a stack.' },
  linkedList: { name: 'Singly linked list', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)', note: 'Head insertion is O(1); search and value-relative operations may traverse the list.' },
  doublyLinkedList: { name: 'Doubly linked list', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)', note: 'Each node has next and previous links; search is O(n), while insertion/deletion around a known node is O(1).' }
};

// Look up the complexity entry associated with an algorithm key.
export function getComplexity(algorithmKey) {
  if (!Object.prototype.hasOwnProperty.call(COMPLEXITY, algorithmKey)) {
    return null;
  }
  return COMPLEXITY[algorithmKey];
}
