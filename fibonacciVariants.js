// Calculate Fibonacci numbers with memoized recursion.
export function fibonacciMemoized(n, counter, log) {
  const memo = new Array(n + 1);
  const ready = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    ready[i] = false;
  }

  function visit(value, depth) {
    counter.calls++;
    if (ready[value]) {
      if (log !== null) {
        log.add({ type: 'memo', message: `fibonacci(${value}) uses cached value ${memo[value]}`, depth });
      }
      return memo[value];
    }
    if (value < 2) {
      memo[value] = value;
      ready[value] = true;
      if (log !== null) {
        log.add({ type: 'base', message: `fibonacci(${value}) returns ${value}`, depth });
      }
      return value;
    }
    if (log !== null) {
      log.add({ type: 'call', message: `fibonacci(${value})`, depth });
    }
    const result = visit(value - 1, depth + 1) + visit(value - 2, depth + 1);
    counter.arithmetic++;
    memo[value] = result;
    ready[value] = true;
    if (log !== null) {
      log.add({ type: 'return', message: `fibonacci(${value}) = ${result}`, depth });
    }
    return result;
  }

  return visit(n, 0);
}

// Calculate Fibonacci numbers bottom-up using dynamic programming.
export function fibonacciBottomUp(n, counter, log) {
  if (n === 0) {
    return 0;
  }
  let previous = 0;
  let current = 1;
  if (log !== null) {
    log.add({ type: 'iteration', message: 'fibonacci(0) = 0' });
  }
  for (let value = 2; value <= n; value++) {
    const next = previous + current;
    previous = current;
    current = next;
    counter.calls++;
    counter.arithmetic++;
    if (log !== null) {
      log.add({ type: 'iteration', message: `fibonacci(${value}) = ${current}` });
    }
  }
  return current;
}
