import { createCounter, totalOperations, StepLog, joinValues } from './recorder.js';
import { measureAverageMs } from './timer.js';
import { parseCommands, parseIntegerInRange, parseNumberList } from './validate.js';
import { getComplexity } from './complexity.js';
import { bubbleSort } from './sorting/bubbleSort.js';
import { insertionSort } from './sorting/insertionSort.js';
import { mergeSort } from './sorting/mergeSort.js';
import { selectionSort } from './sorting/selectionSort.js';
import { quickSort } from './sorting/quickSort.js';
import { factorial } from './recursion/factorial.js';
import { factorialIterative } from './recursion/factorialIterative.js';
import { fibonacci } from './recursion/fibonacci.js';
import { fibonacciMemoized, fibonacciBottomUp } from './recursion/fibonacciVariants.js';
import { towerOfHanoi } from './recursion/towerOfHanoi.js';
import { Stack } from './structures/Stack.js';
import { Queue } from './structures/Queue.js';
import { LinkedList } from './structures/LinkedList.js';
import { DoublyLinkedList } from './structures/DoublyLinkedList.js';
import { createBenchmarkRows } from './benchmark.js';

const SORTS = {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort: (values, counter, log) => quickSort(values, counter, log, 'first'),
  quickSortRandom: (values, counter, log) => quickSort(values, counter, log, 'random')
};
const COMPARE_SORTS = ['bubbleSort', 'selectionSort', 'insertionSort', 'mergeSort', 'quickSort'];
const STRUCTURE_COMMANDS = {
  stack: ['push', 'pop', 'peek', 'size', 'is_empty', 'is_full', 'display'],
  queue: ['enqueue', 'dequeue', 'front', 'peek', 'size', 'is_empty', 'is_full', 'display'],
  linearQueue: ['enqueue', 'dequeue', 'front', 'peek', 'size', 'is_empty', 'is_full', 'display'],
  circularQueue: ['enqueue', 'dequeue', 'front', 'peek', 'size', 'is_empty', 'is_full', 'display'],
  linkedList: ['insertHead', 'insertTail', 'insertBefore', 'insertAfter', 'deleteHead', 'deleteTail', 'deleteBefore', 'deleteAfter', 'delete', 'search', 'size', 'display'],
  doublyLinkedList: ['insertHead', 'insertTail', 'insertBefore', 'insertAfter', 'deleteHead', 'deleteTail', 'deleteBefore', 'deleteAfter', 'delete', 'search', 'size', 'display', 'displayBack']
};
const SORT_SIZES = [100, 500, 1000, 2000, 5000, 10000];
const EXTENDED_SIZES = [50000, 100000];

function hasKey(table, key) {
  return Object.prototype.hasOwnProperty.call(table, key);
}

function copyLoggedSteps(log) {
  const steps = new Array(log.length);
  for (let i = 0; i < log.length; i++) {
    steps[i] = log.items[i];
  }
  return steps;
}

function parseHanoiInput(input) {
  const parts = input.split(/[,\s]+/).filter((part) => part.length > 0);
  if (parts.length !== 4) {
    return { ok: false, error: 'Enter disk count, source peg, destination peg, and auxiliary peg (for example: 3, A, C, B).' };
  }
  const parsed = parseIntegerInRange(parts[0], 1, 8, 'Disk count');
  if (!parsed.ok) {
    return parsed;
  }
  if (parts[1] === parts[2] || parts[1] === parts[3] || parts[2] === parts[3]) {
    return { ok: false, error: 'Choose three different peg names.' };
  }
  return { ok: true, disks: parsed.value, source: parts[1], destination: parts[2], auxiliary: parts[3] };
}

function runSorting(request) {
  const sort = hasKey(SORTS, request.algorithm) ? SORTS[request.algorithm] : undefined;
  if (sort === undefined) {
    return { ok: false, error: 'Choose a supported sorting algorithm.' };
  }
  const parsed = parseNumberList(request.input);
  if (!parsed.ok) {
    return parsed;
  }
  const stepsEnabled = parsed.values.length <= 30;
  const counter = createCounter();
  const log = stepsEnabled ? new StepLog(5000) : null;
  const result = sort(parsed.values, counter, log);
  const measured = measureAverageMs(() => sort(parsed.values, createCounter(), null), 3);
  const steps = stepsEnabled ? copyLoggedSteps(log) : [];
  return {
    ok: true,
    category: 'sorting',
    algorithm: request.algorithm,
    inputParsed: parsed.values,
    result,
    resultText: joinValues(result),
    steps,
    stepsTruncated: (log !== null && log.truncated) || !stepsEnabled,
    stepsNote: stepsEnabled
      ? (log !== null && log.truncated ? 'The step log reached its display limit.' : '')
      : 'Step-by-step display is limited to 30 items. Counts and time are for the full input.',
    operations: counter,
    totalOperations: totalOperations(counter),
    timeMs: measured.averageMs,
    timeRuns: measured.runs,
    complexity: getComplexity(request.algorithm)
  };
}

function runRecursion(request) {
  if (request.algorithm === 'hanoi') {
    const parsed = parseHanoiInput(request.input);
    if (!parsed.ok) {
      return parsed;
    }
    const counter = createCounter();
    const log = new StepLog(300);
    const moves = towerOfHanoi(parsed.disks, parsed.source, parsed.destination, parsed.auxiliary, counter, log);
    const measured = measureAverageMs(() => towerOfHanoi(
      parsed.disks, parsed.source, parsed.destination, parsed.auxiliary, createCounter(), null
    ), 3);
    return {
      ok: true,
      category: 'recursion',
      algorithm: request.algorithm,
      result: moves,
      resultText: `${moves.length} moves from ${parsed.source} to ${parsed.destination}; expected ${2 ** parsed.disks - 1}. Move count ${moves.length === 2 ** parsed.disks - 1 ? 'matches' : 'does not match'} 2^n - 1.`,
      moves,
      disks: parsed.disks,
      pegs: [parsed.source, parsed.destination, parsed.auxiliary],
      steps: copyLoggedSteps(log),
      stepsTruncated: log.truncated,
      stepsNote: log.truncated ? 'The move list reached its display limit.' : '',
      operations: counter,
      totalOperations: totalOperations(counter),
      timeMs: measured.averageMs,
      timeRuns: measured.runs,
      complexity: getComplexity('hanoi')
    };
  }

  const functions = {
    factorial,
    factorialIterative,
    fibonacci,
    fibonacciMemoized,
    fibonacciBottomUp
  };
  const run = hasKey(functions, request.algorithm) ? functions[request.algorithm] : undefined;
  if (run === undefined) {
    return { ok: false, error: 'Choose a supported recursion algorithm.' };
  }
  const isFactorial = request.algorithm === 'factorial' || request.algorithm === 'factorialIterative';
  const maximum = isFactorial ? 18 : (request.algorithm === 'fibonacci' ? 30 : 77);
  const parsed = parseIntegerInRange(request.input, 0, maximum, request.algorithm);
  if (!parsed.ok) {
    return parsed;
  }
  const counter = createCounter();
  const log = new StepLog(500);
  const result = run(parsed.value, counter, log);
  const measured = measureAverageMs(() => run(parsed.value, createCounter(), null), 3);
  return {
    ok: true,
    category: 'recursion',
    algorithm: request.algorithm,
    inputParsed: parsed.value,
    result,
    resultText: String(result),
    steps: copyLoggedSteps(log),
    stepsTruncated: log.truncated,
    stepsNote: log.truncated ? 'The trace is limited to 500 steps; counts cover the full run.' : '',
    operations: counter,
    totalOperations: totalOperations(counter),
    timeMs: measured.averageMs,
    timeRuns: measured.runs,
    complexity: getComplexity(request.algorithm)
  };
}

function makeStructure(algorithm, counter, capacity) {
  if (algorithm === 'stack') {
    return new Stack(counter, capacity);
  }
  if (algorithm === 'queue' || algorithm === 'circularQueue') {
    return new Queue(counter, capacity, 'circular');
  }
  if (algorithm === 'linearQueue') {
    return new Queue(counter, capacity, 'linear');
  }
  if (algorithm === 'doublyLinkedList') {
    return new DoublyLinkedList(counter);
  }
  return new LinkedList(counter);
}

function executeStructureCommand(structure, command) {
  const { name, arg, value } = command;
  if (name === 'push') {
    return structure.push(arg) ? { message: `push ${arg}` } : { message: 'Stack is full.', error: true };
  }
  if (name === 'pop') {
    const result = structure.pop();
    return result === null ? { message: 'Stack underflow: cannot pop an empty stack.', error: true } : { message: `pop → ${result}` };
  }
  if (name === 'peek') {
    const result = structure.peek();
    return result === null ? { message: 'Stack underflow: cannot peek at an empty stack.', error: true } : { message: `peek → ${result}` };
  }
  if (name === 'enqueue') {
    if (structure.enqueue(arg)) {
      return { message: `enqueue ${arg}` };
    }
    return {
      message: structure.mode === 'linear'
        ? 'Linear queue is full: false-full occurs because freed front slots cannot be reused; a circular queue wraps around.'
        : 'Circular queue is full.',
      error: true
    };
  }
  if (name === 'dequeue') {
    const result = structure.dequeue();
    return result === null ? { message: 'Queue underflow: cannot dequeue an empty queue.', error: true } : { message: `dequeue → ${result}` };
  }
  if (name === 'front') {
    const result = structure.peek();
    return result === null ? { message: 'Queue is empty; it has no front value.', error: true } : { message: `front → ${result}` };
  }
  if (name === 'size') {
    return { message: `size → ${structure.size()}` };
  }
  if (name === 'is_empty') {
    return { message: `is_empty → ${structure.isEmpty()}` };
  }
  if (name === 'is_full') {
    return { message: `is_full → ${structure.isFull()}` };
  }
  if (name === 'display') {
    return { message: `display → [${joinValues(structure.toArray())}]` };
  }
  if (name === 'displayBack') {
    return { message: `display backward → [${joinValues(structure.toArray(true))}]` };
  }
  if (name === 'insertHead') {
    structure.insertAtHead(arg);
    return { message: `insertHead ${arg}` };
  }
  if (name === 'insertTail') {
    structure.insertAtTail(arg);
    return { message: `insertTail ${arg}` };
  }
  if (name === 'insertBefore') {
    return structure.insertBefore(arg, value)
      ? { message: `insert ${value} before ${arg}` }
      : { message: `${arg} was not found.`, error: true };
  }
  if (name === 'insertAfter') {
    return structure.insertAfter(arg, value)
      ? { message: `insert ${value} after ${arg}` }
      : { message: `${arg} was not found.`, error: true };
  }
  if (name === 'deleteHead' || name === 'deleteTail' || name === 'deleteBefore' || name === 'deleteAfter') {
    let result;
    if (name === 'deleteHead') {
      result = structure.deleteAtHead();
    } else if (name === 'deleteTail') {
      result = structure.deleteAtTail();
    } else if (name === 'deleteBefore') {
      result = structure.deleteBefore(arg);
    } else {
      result = structure.deleteAfter(arg);
    }
    return result === null
      ? { message: `${name} could not remove a node.`, error: true }
      : { message: `${name} → removed ${result}` };
  }
  if (name === 'delete') {
    const result = structure.deleteValue(arg);
    const removed = result === true || (typeof result === 'number' && result !== -1);
    return removed ? { message: `delete ${arg} → removed` } : { message: `delete ${arg} → not found`, error: true };
  }
  if (name === 'search') {
    const index = structure.search(arg);
    return index >= 0 ? { message: `search ${arg} → index ${index}` } : { message: `search ${arg} → not found` };
  }
  return { message: `Unknown command: ${name}.`, error: true };
}

function evaluateBrackets(input, counter, log) {
  const stack = new Stack(counter, input.length);
  const matching = { ')': '(', ']': '[', '}': '{' };
  let valid = true;
  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    if (/\s/.test(symbol)) {
      continue;
    }
    if (symbol === '(' || symbol === '[' || symbol === '{') {
      stack.push(symbol);
    } else if (symbol === ')' || symbol === ']' || symbol === '}') {
      if (stack.isEmpty() || stack.peek() !== matching[symbol]) {
        valid = false;
      } else {
        stack.pop();
      }
    } else {
      return { error: `Invalid symbol "${symbol}". Use only brackets and whitespace.` };
    }
    if (log !== null) {
      log.add({
        type: valid ? 'symbol' : 'error',
        message: `Read "${symbol}"`,
        contents: stack.toArray()
      });
    }
  }
  return { balanced: valid && stack.isEmpty() };
}

function runBrackets(request) {
  if (request.input.trim().length === 0) {
    return { ok: false, error: 'Enter a bracket expression such as { ( [ ] ) }.' };
  }
  const counter = createCounter();
  const log = new StepLog(500);
  const evaluated = evaluateBrackets(request.input, counter, log);
  if (evaluated.error !== undefined) {
    return { ok: false, error: evaluated.error };
  }
  const measured = measureAverageMs(() => evaluateBrackets(request.input, createCounter(), null), 3);
  const balanced = evaluated.balanced;
  return {
    ok: true,
    category: 'structure',
    algorithm: 'brackets',
    result: balanced,
    resultText: balanced ? 'Balanced brackets.' : 'Unbalanced brackets.',
    steps: copyLoggedSteps(log),
    stepsTruncated: log.truncated,
    stepsNote: log.truncated ? 'The symbol trace reached its display limit.' : '',
    operations: counter,
    totalOperations: totalOperations(counter),
    timeMs: measured.averageMs,
    timeRuns: measured.runs,
    complexity: getComplexity('brackets')
  };
}

function runStructure(request) {
  const algorithm = request.algorithm === 'queue' ? 'circularQueue' : request.algorithm;
  if (algorithm === 'brackets') {
    return runBrackets(request);
  }
  if (!hasKey(STRUCTURE_COMMANDS, algorithm)) {
    return { ok: false, error: 'Choose a supported data structure.' };
  }
  const capacityResult = parseIntegerInRange(String(request.capacity === undefined ? 5 : request.capacity), 1, 100, 'Capacity');
  if (capacityResult.ok === false && (algorithm === 'stack' || algorithm === 'linearQueue' || algorithm === 'circularQueue')) {
    return capacityResult;
  }
  const capacity = capacityResult.ok ? capacityResult.value : 10;
  const parsed = parseCommands(request.input, STRUCTURE_COMMANDS[algorithm]);
  if (!parsed.ok) {
    return parsed;
  }
  const counter = createCounter();
  const structure = makeStructure(algorithm, counter, capacity);
  const log = new StepLog(500);
  const commandResults = new Array(parsed.commands.length);
  for (let i = 0; i < parsed.commands.length; i++) {
    const outcome = executeStructureCommand(structure, parsed.commands[i]);
    commandResults[i] = outcome.message;
    const step = {
      type: outcome.error ? 'error' : 'command',
      message: outcome.message,
      contents: structure.toArray()
    };
    if (structure instanceof Queue) {
      step.frontIndex = structure.frontIndex;
      step.rearIndex = structure.rearIndex;
      step.mode = structure.mode;
    }
    log.add(step);
  }
  const contents = structure.toArray();
  const measured = measureAverageMs(() => {
    const timedStructure = makeStructure(algorithm, createCounter(), capacity);
    for (let i = 0; i < parsed.commands.length; i++) {
      executeStructureCommand(timedStructure, parsed.commands[i]);
    }
  }, 3);
  return {
    ok: true,
    category: 'structure',
    algorithm,
    inputParsed: parsed.commands,
    result: contents,
    resultText: `[${joinValues(contents)}]`,
    commandResults,
    steps: copyLoggedSteps(log),
    stepsTruncated: log.truncated,
    stepsNote: log.truncated ? 'The structure trace reached its display limit.' : '',
    operations: counter,
    totalOperations: totalOperations(counter),
    timeMs: measured.averageMs,
    timeRuns: measured.runs,
    capacity,
    queueMode: structure instanceof Queue ? structure.mode : undefined,
    frontIndex: structure instanceof Queue ? structure.frontIndex : undefined,
    rearIndex: structure instanceof Queue ? structure.rearIndex : undefined,
    complexity: getComplexity(algorithm)
  };
}

export function runAlgorithm(request) {
  if (request === null || typeof request !== 'object') {
    return { ok: false, error: 'An algorithm request is required.' };
  }
  if (typeof request.input !== 'string') {
    return { ok: false, error: 'Enter input as text.' };
  }
  if (request.category === 'sorting') {
    return runSorting(request);
  }
  if (request.category === 'recursion') {
    return runRecursion(request);
  }
  if (request.category === 'structure') {
    return runStructure(request);
  }
  return { ok: false, error: 'Choose sorting, recursion, or a data structure.' };
}

export function runCompareAll(input) {
  const parsed = parseNumberList(input);
  if (!parsed.ok) {
    return parsed;
  }
  const rows = new Array(COMPARE_SORTS.length);
  for (let i = 0; i < COMPARE_SORTS.length; i++) {
    const name = COMPARE_SORTS[i];
    const sort = SORTS[name];
    const counter = createCounter();
    const result = sort(parsed.values, counter, null);
    const measured = measureAverageMs(() => sort(parsed.values, createCounter(), null), 3);
    rows[i] = {
      algorithm: getComplexity(name).name,
      comparisons: counter.comparisons,
      swaps: counter.swaps,
      writes: counter.writes,
      totalOperations: totalOperations(counter),
      timeMs: measured.averageMs,
      resultText: joinValues(result)
    };
  }
  return { ok: true, rows };
}

export function runBenchmark(request) {
  if (request === null || typeof request !== 'object') {
    return { ok: false, error: 'A benchmark request is required.' };
  }
  const algorithm = request.algorithm;
  const caseType = request.caseType || 'random';
  if (!hasKey(SORTS, algorithm)) {
    return { ok: false, error: 'Choose a supported sorting algorithm.' };
  }
  const sizes = request.sizes === undefined ? SORT_SIZES : request.sizes;
  if (!Array.isArray(sizes) || sizes.length === 0 || sizes.length > 10) {
    return { ok: false, error: 'Provide between 1 and 10 benchmark sizes.' };
  }
  const sort = SORTS[algorithm];
  const quadratic = algorithm === 'bubbleSort' || algorithm === 'selectionSort' || algorithm === 'insertionSort';
  for (let i = 0; i < sizes.length; i++) {
    const n = sizes[i];
    if (!Number.isInteger(n) || n < 1 || n > 100000) {
      return { ok: false, error: 'Benchmark sizes must be whole numbers from 1 to 100000.' };
    }
    if ((quadratic && n > 10000) || (algorithm === 'quickSort' && n > 10000 && caseType !== 'random')) {
      return { ok: false, error: 'For safe run times, quadratic sorts and first-pivot quicksort on sorted/reversed data are limited to 10000 values. Use merge sort or randomized-pivot quicksort for larger inputs.' };
    }
  }
  return createBenchmarkRows(algorithm, sizes, caseType, sort);
}

export const BENCHMARK_SIZES = SORT_SIZES;
export const EXTENDED_BENCHMARK_SIZES = EXTENDED_SIZES;
