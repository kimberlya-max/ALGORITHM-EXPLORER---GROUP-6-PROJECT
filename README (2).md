# Algorithm Explorer project guide

The browser application accepts user input, runs student-implemented algorithms in a DOM-free logic layer, and displays results, steps, operation counts, measured running time, and theoretical complexity.

## Features

- **Sorting:** bubble, selection, insertion, merge, first-pivot quicksort using the yellow/green partition, and randomized-pivot quicksort. Every sort supports step snapshots; the UI has Step, Auto-play, Reset, and speed controls. Compare all runs the five required algorithms against the same input.
- **Recursion:** recursive and iterative factorial (0–18); naive Fibonacci (0–30), memoized Fibonacci, and bottom-up Fibonacci (0–77); recursive Tower of Hanoi for 1–8 disks with a complete move sequence and animation controls.
- **Data structures:** fixed-capacity array stack; linear and circular fixed-array queues; singly and doubly linked lists with positional insertion/deletion; and bracket balancing with a stack.
- **Analysis:** random, already-sorted, and reverse-sorted benchmarks. Default input sizes match the assignment; merge sort and randomized quicksort accept 50,000 and 100,000 values. Each benchmark timing includes at least three measured runs.
- **Validation:** malformed, empty, nonnumeric, and out-of-range input is rejected with a user-facing error.

## Architecture

`src/engine/` contains algorithms, structures, counters, validation, complexity metadata, and benchmarking without DOM access. `src/ui/` renders algorithm results, array snapshots, and Hanoi peg states. `src/main.js` connects the interface to the engine. `tests/tests.html` runs the focused browser test suite.

## Run and test

Serve the repository directory over HTTP (for example with VS Code Live Server or `python -m http.server`) and open `http://localhost:8000`. Open `tests/tests.html` to run the browser tests.
