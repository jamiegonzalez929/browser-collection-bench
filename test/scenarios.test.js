import test from "node:test";
import assert from "node:assert/strict";

import { summarizeSamples } from "../src/benchmark.js";
import { scenarios } from "../src/scenarios.js";

test("all strategies agree on scenario outputs", () => {
  for (const scenario of scenarios) {
    const input = scenario.createInput(600, "clustered");
    const expected = scenario.formatOutput(scenario.strategies[0].run(input));

    for (const strategy of scenario.strategies.slice(1)) {
      const actual = scenario.formatOutput(strategy.run(input));
      assert.equal(actual, expected, `${scenario.id} failed for ${strategy.label}`);
    }
  }
});

test("summarizeSamples reports sorted metrics", () => {
  const summary = summarizeSamples([4.6, 1.2, 7.1, 3.5]);

  assert.equal(summary.minMs, 1.2);
  assert.equal(summary.maxMs, 7.1);
  assert.equal(summary.medianMs, 4.6);
  assert.equal(summary.meanMs, (4.6 + 1.2 + 7.1 + 3.5) / 4);
  assert.deepEqual(summary.samples, [1.2, 3.5, 4.6, 7.1]);
});
