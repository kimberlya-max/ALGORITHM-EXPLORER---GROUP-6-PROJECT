# Algorithm Explorer

A browser-based CSC2107 application for exploring sorting, recursion, data structures, and empirical time complexity. The application reports results, operation counts, measured execution time, and theoretical time/space complexity.

## Run locally

Serve this directory over HTTP because browsers do not reliably load ES modules from `file://`. Use VS Code Live Server or run `python -m http.server` from this directory, then open `http://localhost:8000`.

## Modules

- **Recursion Lab:** recursive and iterative factorial, naive/memoized/bottom-up Fibonacci, and animated Tower of Hanoi for 1–8 disks.
- **Data Structures Lab:** fixed-capacity array stack, linear and circular array queues, singly and doubly linked lists, and bracket balancing with a stack.
- **Sorting Lab:** bubble, selection, insertion, merge, and first-element-pivot quicksort, plus randomized-pivot quicksort. Sorting steps can be stepped through, played, reset, and speed-adjusted; a comparison runs the five required algorithms on the same input.
- **Time Complexity Analysis:** benchmark random, sorted, or reversed data. Default sizes are 100, 500, 1,000, 2,000, 5,000, and 10,000; merge sort and randomized quicksort also accept 50,000 and 100,000. Timings average at least three measured runs.

Algorithms and data structures live in the DOM-free `src/engine/` layer. Browser interactions live in `src/ui/`. Run the browser test page at `tests/tests.html`.

## Input limits

Naive Fibonacci is limited to 30 to bound its exponential call tree. Factorial accepts 0–18. Sorting visualization snapshots are limited to 30 values, while sorting input accepts up to 5,000 values. Quadratic-sort benchmarks are limited to 10,000 values; first-pivot quicksort on sorted or reversed data is also limited to 10,000 to avoid impractically long runs.
