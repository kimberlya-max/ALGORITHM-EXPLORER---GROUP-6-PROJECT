// Calculate a Fibonacci number recursively and optionally record its call trace.
export function fibonacci(n, counter, log, depth = 0) {
  counter.calls++;
  if (log !== null) {
    log.add({ type: 'call', message: `fibonacci(${n})`, depth });
  }
  if (n === 0 || n === 1) {
    if (log !== null) {
      log.add({ type: 'base', message: `fibonacci(${n}) returns ${n}`, depth });
    }
    return n;
  }
  const previous = fibonacci(n - 1, counter, log, depth + 1);
  const beforePrevious = fibonacci(n - 2, counter, log, depth + 1);
  counter.arithmetic++;
  const result = previous + beforePrevious;
  if (log !== null) {
    log.add({ type: 'return', message: `fibonacci(${n}) = ${previous} + ${beforePrevious} = ${result}`, depth });
  }
  return result;
}
