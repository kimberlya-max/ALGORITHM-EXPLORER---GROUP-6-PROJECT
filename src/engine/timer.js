// Measure an untraced function after warming up the JavaScript engine.
export function measureAverageMs(fn, minimumRuns = 1) {
  fn();
  const start = performance.now();
  let runs = 0;
  // Repeat long enough to reduce timer noise and honor the requested minimum.
  while ((performance.now() - start < 20 || runs < minimumRuns) && runs < 1000) {
    fn();
    runs++;
  }
  return { averageMs: (performance.now() - start) / runs, runs };
}
