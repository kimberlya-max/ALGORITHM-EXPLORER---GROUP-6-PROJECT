# Complexity and measurement notes

## Sorting

| Algorithm | Best | Average | Worst | Auxiliary space | Stable |
|---|---:|---:|---:|---:|---|
| Bubble sort (early exit) | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Selection sort | O(n^2) | O(n^2) | O(n^2) | O(1) | No |
| Insertion sort (adjacent swaps) | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quicksort (first-element pivot) | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |
| Quicksort (randomized pivot) | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |

The first-element quicksort uses the class yellow/green partition. Sorted or reverse-sorted input can make its partitions maximally unbalanced; the randomized version reduces the likelihood of that case. The in-place quicksort implementation processes the smaller partition recursively to bound call-stack depth.

## Recursion

| Algorithm | Time | Auxiliary space |
|---|---:|---:|
| Recursive factorial | O(n) | O(n) call stack |
| Iterative factorial | O(n) | O(1) |
| Naive Fibonacci | O(2^n) | O(n) call stack |
| Memoized Fibonacci | O(n) | O(n) |
| Bottom-up Fibonacci | O(n) | O(1) |
| Tower of Hanoi | O(2^n) | O(n) call stack |

The naive Fibonacci limit is 30 to bound its exponential call tree. Factorial accepts 0–18; the optimized Fibonacci versions accept 0–77. Hanoi accepts 1–8 disks and requires exactly 2^n - 1 moves.

## Data structures

| Structure/operation | Time | Auxiliary space |
|---|---:|---:|
| Array stack push, pop, peek | O(1) | O(capacity) |
| Linear/circular array queue enqueue, dequeue, front | O(1) | O(capacity) |
| Singly linked list head insertion/deletion | O(1) | O(n) |
| Singly linked list search, tail and value-relative operations | O(n) | O(n) |
| Doubly linked list search | O(n) | O(n) |
| Doubly linked list insertion/deletion around a found node | O(1) after search | O(n) |
| Bracket balancing | O(n) | O(n) |

The linear queue does not wrap its rear index after dequeue, so it can become false-full while unused slots remain at the front. The circular queue wraps indices and reuses those slots.

## Operation-count conventions

- Sorting comparisons count element-to-element comparisons. Swaps count exchanges; merge-sort writes count assignments back into the working array.
- Recursive algorithms count function entries. Iterative versions count loop iterations; arithmetic counts multiplications or additions.
- Structure writes count array or pointer updates. Node visits count nodes examined while traversing.

## Timing and benchmarks

Measured time is the average duration of at least three untraced executions after a warm-up. Additional runs continue until at least 20 ms has elapsed or 1,000 runs have completed. Browser timer resolution, JIT warm-up, system load, and hardware affect the result; measured time is not a Big O value.

The benchmark UI defaults to n = 100, 500, 1,000, 2,000, 5,000, and 10,000 and supports random, already sorted, and reverse-sorted input. Merge sort and randomized quicksort accept 50,000 and 100,000 values. Quadratic sorts and first-pivot quicksort on sorted/reversed data are limited to 10,000 to avoid impractically long runs.
