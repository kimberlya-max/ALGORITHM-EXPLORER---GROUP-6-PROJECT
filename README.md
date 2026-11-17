<<<<<<< HEAD
# ALGORITHM-EXPLORER---GROUP-6-PROJECT
A browser-based tool that runs sorting, recursion and data structure algorithms on your own input and shows the result, step-by-step trace, operation count, running time and time complexity. Built from scratch in vanilla JavaScrip,CSS and HTML.

Algorithm Explorer is a group project for CSC2107 Design and Analysis of Algorithms at Uganda Christian University. Enter your own input, choose an algorithm, and the app runs it in a separate logic layer, then displays the result, every step taken, the number of operations and the measured running time next to the theoretical time complexity. It covers bubble, insertion and merge sort, recursive factorial and Fibonacci, and a stack, queue and singly linked list, all implemented from scratch with no built-in sort functions or ready-made data structures.
=======
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
>>>>>>> 13cae2ea7a5c8cccef4ce0b8dddd8ca70cdc6ff9
