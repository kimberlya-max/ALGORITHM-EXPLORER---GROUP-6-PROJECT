// Calculate a factorial recursively and optionally record its call trace.
export function factorial(n, counter, log, depth = 0) {
  counter.calls++;
  if (log !== null) {
    log.add({ type: 'call', message: `factorial(${n})`, depth });
  }
  if (n === 0) {
    if (log !== null) {
      log.add({ type: 'base', message: 'factorial(0) returns 1', depth });
    }
    return 1;
  }
  const previous = factorial(n - 1, counter, log, depth + 1);
  counter.arithmetic++;
  const result = n * previous;
  if (log !== null) {
    log.add({ type: 'return', message: `factorial(${n}) = ${n} × ${previous} = ${result}`, depth });
  }
  return result;
}
