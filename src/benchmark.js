function measureOnce(task) {
  const started = performance.now();
  task();
  return performance.now() - started;
}

export function summarizeSamples(samples) {
  const sorted = [...samples].sort((left, right) => left - right);
  const total = sorted.reduce((sum, sample) => sum + sample, 0);
  return {
    medianMs: sorted[Math.floor(sorted.length / 2)],
    meanMs: total / sorted.length,
    minMs: sorted[0],
    maxMs: sorted[sorted.length - 1],
    samples: sorted
  };
}

export function runScenarioBenchmark(scenario, input, iterations = 16) {
  const expected = scenario.formatOutput(scenario.strategies[0].run(input));

  return scenario.strategies.map((strategy) => {
    strategy.run(input);

    const samples = [];
    for (let count = 0; count < iterations; count += 1) {
      const sample = measureOnce(() => {
        const output = strategy.run(input);
        const serialized = scenario.formatOutput(output);
        if (serialized !== expected) {
          throw new Error(`Strategy ${strategy.label} produced a different result.`);
        }
      });
      samples.push(sample);
    }

    return {
      label: strategy.label,
      ...summarizeSamples(samples)
    };
  }).sort((left, right) => left.medianMs - right.medianMs);
}
