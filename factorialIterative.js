// Calculate a factorial iteratively and record loop iterations.
export function factorialIterative(n, counter, log) {
  let result = 1;
  for (let value = 2; value <= n; value++) {
    counter.calls++;
    counter.arithmetic++;
    result *= value;
    if (log !== null) {
      log.add({ type: 'iteration', message: `${value}! partial result = ${result}` });
    }
  }
  return result;
}
