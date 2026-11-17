import { bubbleSort } from '../src/engine/sorting/bubbleSort.js';
import { insertionSort } from '../src/engine/sorting/insertionSort.js';
import { mergeSort } from '../src/engine/sorting/mergeSort.js';
import { selectionSort } from '../src/engine/sorting/selectionSort.js';
import { quickSort } from '../src/engine/sorting/quickSort.js';
import { factorial } from '../src/engine/recursion/factorial.js';
import { factorialIterative } from '../src/engine/recursion/factorialIterative.js';
import { fibonacci } from '../src/engine/recursion/fibonacci.js';
import { fibonacciMemoized, fibonacciBottomUp } from '../src/engine/recursion/fibonacciVariants.js';
import { towerOfHanoi } from '../src/engine/recursion/towerOfHanoi.js';
import { createCounter, totalOperations, joinValues } from '../src/engine/recorder.js';
import { getComplexity } from '../src/engine/complexity.js';
import { parseCommands, parseIntegerInRange, parseNumberList } from '../src/engine/validate.js';
import { LinkedList } from '../src/engine/structures/LinkedList.js';
import { Queue } from '../src/engine/structures/Queue.js';
import { Stack } from '../src/engine/structures/Stack.js';
import { DoublyLinkedList } from '../src/engine/structures/DoublyLinkedList.js';
import { runAlgorithm, runBenchmark, runCompareAll } from '../src/engine/index.js';
import { makeRandomArray } from '../src/engine/benchmark.js';

// Assert that two values are strictly equal and describe a mismatch clearly.
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, received ${actual}`);
  }
}

// Assert that two arrays contain the same values in the same order.
function assertArraysEqual(actual, expected, message) {
  assertEqual(actual.length, expected.length, `${message} length`);
  // Compare each pair of values in the arrays.
  for (let i = 0; i < expected.length; i++) {
    assertEqual(actual[i], expected[i], `${message} at index ${i}`);
  }
}

// Check that a list is in nondecreasing order.
function isSorted(values) {
  // Compare every adjacent pair in the list.
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] > values[i]) {
      return false;
    }
  }
  return true;
}

// Check that two arrays contain the same values, including duplicate counts.
function sameItems(first, second) {
  if (first.length !== second.length) {
    return false;
  }
  const matched = new Array(second.length);
  // Mark every position in the second array as not yet matched.
  for (let i = 0; i < matched.length; i++) {
    matched[i] = false;
  }
  // Find one unmatched equal value for each item in the first array.
  for (let i = 0; i < first.length; i++) {
    let found = false;
    // Search for a matching unused value in the second array.
    for (let j = 0; j < second.length; j++) {
      if (!matched[j] && first[i] === second[j]) {
        matched[j] = true;
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }
  }
  return true;
}

// Execute focused checks and return a pass/fail result for each one.
export function runTests() {
  const results = [];
  // Run a test and capture any assertion failure for the browser report.
  function test(name, action) {
    try {
      action();
      results[results.length] = { name, ok: true };
    } catch (error) {
      results[results.length] = { name, ok: false, error: error.message };
    }
  }

  test('number input validation rejects empty entries and decimals in integers', () => {
    assertEqual(parseNumberList('').ok, false, 'Empty number input');
    assertEqual(parseNumberList('5, , 3').ok, false, 'Empty comma token');
    assertEqual(parseNumberList('5, abc, 3').ok, false, 'Invalid number token');
    assertEqual(parseIntegerInRange('2.5', 0, 18, 'factorial').ok, false, 'Decimal integer input');
  });

  test('bubble sort handles normal, duplicate, and unchanged input cases', () => {
    const input = [5, 2, 9, 1, 5];
    const counter = createCounter();
    assertArraysEqual(bubbleSort(input, counter, null), [1, 2, 5, 5, 9], 'Bubble output');
    assertArraysEqual(input, [5, 2, 9, 1, 5], 'Bubble preserves input');
    const sortedCounter = createCounter();
    bubbleSort([1, 2, 3, 4, 5], sortedCounter, null);
    assertEqual(sortedCounter.comparisons, 4, 'Bubble sorted comparisons');
    assertEqual(sortedCounter.swaps, 0, 'Bubble sorted swaps');
    const reversedCounter = createCounter();
    bubbleSort([5, 4, 3, 2, 1], reversedCounter, null);
    assertEqual(reversedCounter.comparisons, 10, 'Bubble reversed comparisons');
    assertEqual(reversedCounter.swaps, 10, 'Bubble reversed swaps');
  });

  test('insertion sort reports best and worst case counts', () => {
    const sortedCounter = createCounter();
    insertionSort([1, 2, 3, 4, 5], sortedCounter, null);
    assertEqual(sortedCounter.comparisons, 4, 'Insertion sorted comparisons');
    assertEqual(sortedCounter.swaps, 0, 'Insertion sorted swaps');
    const reversedCounter = createCounter();
    insertionSort([5, 4, 3, 2, 1], reversedCounter, null);
    assertEqual(reversedCounter.comparisons, 10, 'Insertion reversed comparisons');
    assertEqual(reversedCounter.swaps, 10, 'Insertion reversed swaps');
  });

  test('merge sort matches the documented comparison and write counts', () => {
    const bestCounter = createCounter();
    assertArraysEqual(mergeSort([1, 2, 3, 4, 5, 6, 7, 8], bestCounter, null), [1, 2, 3, 4, 5, 6, 7, 8], 'Merge output');
    assertEqual(bestCounter.comparisons, 12, 'Merge sorted comparisons');
    assertEqual(bestCounter.writes, 24, 'Merge writes');
    const worstCounter = createCounter();
    mergeSort([1, 5, 4, 8, 2, 6, 3, 7], worstCounter, null);
    assertEqual(worstCounter.comparisons, 17, 'Merge worst-case comparisons');
  });

  test('selection sort returns a sorted copy and counts comparisons', () => {
    const counter = createCounter();
    const input = [4, 2, 4, 2, 4];
    assertArraysEqual(selectionSort(input, counter, null), [2, 2, 4, 4, 4], 'Selection output');
    assertEqual(counter.comparisons, 10, 'Selection comparisons');
    assertArraysEqual(input, [4, 2, 4, 2, 4], 'Selection preserves input');
  });

  test('all sorting algorithms handle decimals, negatives, one item, and empty arrays', () => {
    const sorters = [bubbleSort, insertionSort, mergeSort, selectionSort];
    const input = [-3, 0.5, -10, 2, -3];
    const expected = [-10, -3, -3, 0.5, 2];
    // Check each sort against the same edge-case input.
    for (let i = 0; i < sorters.length; i++) {
      const original = new Array(input.length);
      // Copy the original values to verify that the sorter leaves them alone.
      for (let j = 0; j < input.length; j++) {
        original[j] = input[j];
      }
      const result = sorters[i](input, createCounter(), null);
      assertArraysEqual(result, expected, `Edge-case sorter ${i}`);
      assertEqual(isSorted(result), true, `Sorted result ${i}`);
      assertEqual(sameItems(input, result), true, `Same input items ${i}`);
      assertArraysEqual(input, original, `Input preserved ${i}`);
      assertArraysEqual(sorters[i]([77], createCounter(), null), [77], `Single item ${i}`);
      assertArraysEqual(sorters[i]([], createCounter(), null), [], `Empty internal array ${i}`);
    }
  });

  test('bubble and merge sort handle 2000 generated values', () => {
    const input = makeRandomArray(2000, 76543);
    const bubbleCounter = createCounter();
    const bubbleResult = bubbleSort(input, bubbleCounter, null);
    assertEqual(isSorted(bubbleResult), true, 'Large bubble result is sorted');
    assertEqual(bubbleCounter.comparisons <= 2000 * 1999 / 2, true, 'Large bubble comparison bound');
    const mergeCounter = createCounter();
    const mergeResult = mergeSort(input, mergeCounter, null);
    assertEqual(isSorted(mergeResult), true, 'Large merge result is sorted');
    assertEqual(mergeCounter.comparisons < 2000 * 11, true, 'Large merge growth bound');
  });

  test('factorial and Fibonacci return values and recursive call counts', () => {
    const factorialCounter = createCounter();
    assertEqual(factorial(5, factorialCounter, null), 120, 'factorial(5)');
    assertEqual(factorialCounter.calls, 6, 'factorial calls');
    assertEqual(factorialCounter.arithmetic, 5, 'factorial multiplications');
    const fibonacciCounter = createCounter();
    assertEqual(fibonacci(10, fibonacciCounter, null), 55, 'fibonacci(10)');
    assertEqual(fibonacciCounter.calls, 177, 'fibonacci calls');
  });

  test('stack is LIFO and handles underflow without changing its size', () => {
    const counter = createCounter();
    const stack = new Stack(counter);
    stack.push(1);
    stack.push(2);
    stack.push(3);
    assertEqual(stack.pop(), 3, 'Stack top removal');
    assertArraysEqual(stack.toArray(), [2, 1], 'Stack contents');
    assertEqual(stack.pop(), 2, 'Stack next removal');
    assertEqual(stack.pop(), 1, 'Stack final removal');
    assertEqual(stack.pop(), null, 'Stack underflow result');
    assertEqual(stack.size(), 0, 'Stack size after underflow');
    assertEqual(counter.writes, 6, 'Stack array writes');
  });

  test('queue is FIFO and can be reused after becoming empty', () => {
    const counter = createCounter();
    const queue = new Queue(counter);
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    assertEqual(queue.dequeue(), 1, 'Queue front removal');
    assertEqual(queue.dequeue(), 2, 'Queue next removal');
    assertEqual(queue.dequeue(), 3, 'Queue final removal');
    assertEqual(queue.tail, null, 'Queue tail after empty');
    assertEqual(queue.dequeue(), null, 'Queue underflow result');
    queue.enqueue(4);
    assertArraysEqual(queue.toArray(), [4], 'Queue after reuse');
    assertEqual(queue.dequeue(), 4, 'Queue reused removal');
    assertEqual(queue.size(), 0, 'Queue size after reuse');
    assertEqual(counter.writes, 8, 'Queue array writes');
  });

  test('linked list supports head/tail insertion, deletion, and search', () => {
    const counter = createCounter();
    const list = new LinkedList(counter);
    list.insertAtHead(2);
    list.insertAtHead(1);
    list.insertAtTail(3);
    assertArraysEqual(list.toArray(), [1, 2, 3], 'Linked list contents');
    assertEqual(list.search(2), 1, 'Linked list search');
    assertEqual(list.search(7), -1, 'Linked list missing search');
    assertEqual(list.deleteValue(1), true, 'Delete head');
    assertEqual(list.deleteValue(3), true, 'Delete tail');
    assertEqual(list.deleteValue(7), false, 'Delete missing value');
    assertArraysEqual(list.toArray(), [2], 'Linked list after deletion');
    assertEqual(list.size(), 1, 'Linked list size');
    assertEqual(counter.writes, 7, 'Linked list pointer writes');
    assertEqual(counter.nodeVisits, 10, 'Linked list node visits');
    const emptyList = new LinkedList(createCounter());
    assertEqual(emptyList.deleteValue(1), false, 'Delete from an empty list');
    assertEqual(emptyList.search(1), -1, 'Search an empty list');
  });

  test('engine returns measured results, underflow steps, and validation errors', () => {
    const sorting = runAlgorithm({ category: 'sorting', algorithm: 'bubbleSort', input: '3, 1, 2' });
    assertEqual(sorting.ok, true, 'Sorting request');
    assertArraysEqual(sorting.result, [1, 2, 3], 'Engine sort result');
    assertEqual(sorting.totalOperations, totalOperations(sorting.operations), 'Engine total operations');
    const underflow = runAlgorithm({ category: 'structure', algorithm: 'stack', input: 'pop, push 4' });
    assertEqual(underflow.ok, true, 'Underflow request');
    assertEqual(underflow.steps[0].type, 'error', 'Underflow step type');
    assertArraysEqual(underflow.result, [4], 'Structure continues after underflow');
    assertEqual(runAlgorithm({ category: 'recursion', algorithm: 'factorial', input: '19' }).ok, false, 'Out-of-range factorial');
  });

  test('benchmark generates rows for supported sorting algorithms', () => {
    const benchmark = runBenchmark({ algorithm: 'mergeSort', sizes: [8, 16], caseType: 'sorted' });
    assertEqual(benchmark.ok, true, 'Benchmark request');
    assertEqual(benchmark.rows.length, 2, 'Benchmark row count');
    assertEqual(benchmark.rows[1].n, 16, 'Benchmark second size');
    assertEqual(runBenchmark({ algorithm: 'unknown', sizes: [8], caseType: 'random' }).ok, false, 'Unknown benchmark algorithm');
  });

  test('stack and queue are constant time per operation', () => {
    assertEqual(getComplexity('stack').worst, 'O(1)', 'Stack worst case');
    assertEqual(getComplexity('queue').worst, 'O(1)', 'Queue worst case');
    assertEqual(getComplexity('linkedList').worst, 'O(n)', 'Linked list worst case');
  });

  test('benchmark reference growth matches the input case', () => {
    const sortedBubble = runBenchmark({ algorithm: 'bubbleSort', sizes: [100], caseType: 'sorted' });
    assertEqual(sortedBubble.rows[0].theoretical, 100, 'Sorted bubble reference is n');
    assertEqual(sortedBubble.rows[0].totalOperations, 99, 'Sorted bubble operations');
    const reversedBubble = runBenchmark({ algorithm: 'bubbleSort', sizes: [100], caseType: 'reversed' });
    assertEqual(reversedBubble.rows[0].theoretical, 10000, 'Reversed bubble reference is n squared');
  });

  test('iterative, memoized, and bottom-up variants return matching values', () => {
    assertEqual(factorialIterative(5, createCounter(), null), 120, 'iterative factorial');
    assertEqual(fibonacciMemoized(10, createCounter(), null), 55, 'memoized Fibonacci');
    assertEqual(fibonacciBottomUp(10, createCounter(), null), 55, 'bottom-up Fibonacci');
  });

  test('Tower of Hanoi generates the expected moves and respects chosen pegs', () => {
    const moves = towerOfHanoi(3, 'X', 'Z', 'Y', createCounter(), null);
    assertEqual(moves.length, 7, 'Hanoi move count');
    assertEqual(moves[0].from, 'X', 'Hanoi source peg');
    assertEqual(moves[moves.length - 1].to, 'Z', 'Hanoi destination peg');
  });

  test('both quicksort pivot strategies sort duplicates and negative values', () => {
    const input = [4, -2, 4, 0, 9, -2, 1];
    assertArraysEqual(quickSort(input, createCounter(), null), [-2, -2, 0, 1, 4, 4, 9], 'First-pivot quicksort');
    assertArraysEqual(quickSort(input, createCounter(), null, 'random', () => 0.4), [-2, -2, 0, 1, 4, 4, 9], 'Random-pivot quicksort');
    assertArraysEqual(input, [4, -2, 4, 0, 9, -2, 1], 'Quicksort preserves input');
  });

  test('array stack reports capacity and full-state operations', () => {
    const stack = new Stack(createCounter(), 2);
    assertEqual(stack.push(1), true, 'First stack push');
    assertEqual(stack.push(2), true, 'Second stack push');
    assertEqual(stack.isFull(), true, 'Stack is full');
    assertEqual(stack.push(3), false, 'Stack rejects overflow');
    assertEqual(stack.size(), 2, 'Stack capacity respected');
  });

  test('linear queue demonstrates false-full while circular queue wraps', () => {
    const linear = new Queue(createCounter(), 3, 'linear');
    linear.enqueue(1);
    linear.enqueue(2);
    linear.enqueue(3);
    linear.dequeue();
    linear.dequeue();
    assertEqual(linear.isFull(), true, 'Linear queue reaches false-full');
    assertEqual(linear.enqueue(4), false, 'Linear queue does not wrap');

    const circular = new Queue(createCounter(), 3, 'circular');
    circular.enqueue(1);
    circular.enqueue(2);
    circular.enqueue(3);
    circular.dequeue();
    assertEqual(circular.enqueue(4), true, 'Circular queue reuses a slot');
    assertArraysEqual(circular.toArray(), [2, 3, 4], 'Circular queue order after wrap');
    assertEqual(circular.rearIndex, 0, 'Circular rear wrapped to index zero');
  });

  test('singly and doubly linked lists support insertion and deletion around values', () => {
    const list = new LinkedList(createCounter());
    list.insertAtHead(2);
    list.insertAtHead(1);
    list.insertAtTail(4);
    list.insertBefore(4, 3);
    list.insertAfter(2, 2.5);
    assertArraysEqual(list.toArray(), [1, 2, 2.5, 3, 4], 'Singly list insertions');
    assertEqual(list.deleteBefore(4), 3, 'Singly delete before');
    assertEqual(list.deleteAfter(2), 2.5, 'Singly delete after');

    const doubly = new DoublyLinkedList(createCounter());
    doubly.insertAtHead(2);
    doubly.insertAtHead(1);
    doubly.insertAtTail(4);
    doubly.insertBefore(4, 3);
    doubly.insertAfter(2, 2.5);
    assertArraysEqual(doubly.toArray(), [1, 2, 2.5, 3, 4], 'Doubly forward order');
    assertArraysEqual(doubly.toArray(true), [4, 3, 2.5, 2, 1], 'Doubly backward order');
    assertEqual(doubly.deleteBefore(4), 3, 'Doubly delete before');
    assertEqual(doubly.deleteAfter(2), 2.5, 'Doubly delete after');
    assertEqual(doubly.deleteValue(4), true, 'Doubly delete value');
    assertArraysEqual(doubly.toArray(), [1, 2], 'Doubly list after removals');
  });

  test('engine exposes the required brackets, Hanoi, and compare-all features', () => {
    const balanced = runAlgorithm({ category: 'structure', algorithm: 'brackets', input: '{ ( [ ] ) }' });
    assertEqual(balanced.ok, true, 'Bracket request');
    assertEqual(balanced.result, true, 'Balanced brackets');
    assertEqual(balanced.steps.length, 6, 'Bracket steps');
    const unbalanced = runAlgorithm({ category: 'structure', algorithm: 'brackets', input: '([)]' });
    assertEqual(unbalanced.result, false, 'Unbalanced brackets');
    const hanoi = runAlgorithm({ category: 'recursion', algorithm: 'hanoi', input: '3, A, C, B' });
    assertEqual(hanoi.moves.length, 7, 'Engine Hanoi moves');
    assertEqual(runCompareAll('3, 1, 2').rows.length, 5, 'Compare all five sorts');
  });

  test('structure command engine exposes capacity, queue indices, and list operations', () => {
    const stack = runAlgorithm({
      category: 'structure', algorithm: 'stack', capacity: 2,
      input: 'push 1, push 2, is_full, push 3, display'
    });
    assertEqual(stack.ok, true, 'Fixed stack commands');
    assertEqual(stack.steps[2].message, 'is_full → true', 'Stack full command');
    assertEqual(stack.steps[3].type, 'error', 'Stack overflow is visible');

    const linear = runAlgorithm({
      category: 'structure', algorithm: 'linearQueue', capacity: 3,
      input: 'enqueue 1, enqueue 2, enqueue 3, dequeue, dequeue, is_full, enqueue 4'
    });
    assertEqual(linear.ok, true, 'Linear queue commands');
    assertEqual(linear.steps[5].message, 'is_full → true', 'Linear queue false-full state');
    assertEqual(linear.steps[6].type, 'error', 'Linear queue overflow is visible');

    const list = runAlgorithm({
      category: 'structure', algorithm: 'doublyLinkedList',
      input: 'insertHead 2, insertHead 1, insertTail 4, insertBefore 4 3, insertAfter 2 5, displayBack'
    });
    assertEqual(list.ok, true, 'Doubly linked-list commands');
    assertEqual(list.steps[list.steps.length - 1].message, 'display backward → [4, 3, 5, 2, 1]', 'Backward display');
  });

  test('benchmark timings enforce at least three measurements and size limits', () => {
    const benchmark = runBenchmark({ algorithm: 'mergeSort', sizes: [8], caseType: 'random' });
    assertEqual(benchmark.ok, true, 'Merge benchmark');
    assertEqual(benchmark.rows[0].runs >= 3, true, 'Minimum benchmark repetitions');
    assertEqual(runBenchmark({ algorithm: 'bubbleSort', sizes: [50000], caseType: 'random' }).ok, false, 'Quadratic size guard');
  });

  test('inherited object names are rejected without throwing', () => {
    const names = ['toString', 'constructor', '__proto__', 'hasOwnProperty'];
    // Try each inherited name as a sorting, structure, and benchmark algorithm.
    for (let i = 0; i < names.length; i++) {
      assertEqual(runAlgorithm({ category: 'sorting', algorithm: names[i], input: '2, 1' }).ok, false, `Sorting ${names[i]}`);
      assertEqual(runAlgorithm({ category: 'structure', algorithm: names[i], input: 'push 1' }).ok, false, `Structure ${names[i]}`);
      assertEqual(runBenchmark({ algorithm: names[i], sizes: [10], caseType: 'random' }).ok, false, `Benchmark ${names[i]}`);
    }
  });

  test('recursion traces record every call until the step limit', () => {
    const small = runAlgorithm({ category: 'recursion', algorithm: 'fibonacci', input: '10' });
    assertEqual(small.steps.length, 354, 'fibonacci(10) steps');
    assertEqual(small.stepsTruncated, false, 'fibonacci(10) is not truncated');
    const large = runAlgorithm({ category: 'recursion', algorithm: 'fibonacci', input: '12' });
    assertEqual(large.steps.length, 500, 'fibonacci(12) step limit');
    assertEqual(large.stepsTruncated, true, 'fibonacci(12) is truncated');
    assertEqual(large.operations.calls, 465, 'fibonacci(12) calls are still fully counted');
  });

  test('queue and stack peek on an empty structure give error steps', () => {
    const stack = runAlgorithm({ category: 'structure', algorithm: 'stack', input: 'peek, push 1, peek' });
    assertEqual(stack.steps[0].type, 'error', 'Empty stack peek step');
    assertEqual(stack.steps[2].type, 'command', 'Stack peek after push');
    const queue = runAlgorithm({ category: 'structure', algorithm: 'queue', input: 'dequeue, peek, enqueue 5' });
    assertEqual(queue.steps[0].type, 'error', 'Empty queue dequeue step');
    assertEqual(queue.steps[1].type, 'error', 'Empty queue peek step');
    assertEqual(queue.resultText, '[5]', 'Queue result text');
  });

  test('sorting response text and helper formatting', () => {
    assertEqual(joinValues([1, 2.5, -3]), '1, 2.5, -3', 'joinValues output');
    assertEqual(joinValues([]), '', 'joinValues empty');
    const response = runAlgorithm({ category: 'sorting', algorithm: 'mergeSort', input: '3 1 2' });
    assertEqual(response.resultText, '1, 2, 3', 'Merge sort result text');
  });

  return results;
}
