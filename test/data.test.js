import test from "node:test";
import assert from "node:assert/strict";

import { buildMembershipQueries, generateDataset, summarizeDataset } from "../src/data.js";

test("generateDataset returns the requested size with duplicates", () => {
  const dataset = generateDataset(2400, "clustered");
  const summary = summarizeDataset(dataset);

  assert.equal(dataset.length, 2400);
  assert.ok(summary.uniqueCount < summary.size);
  assert.ok(summary.duplicateRate > 0.25);
});

test("uniform distribution remains deterministic", () => {
  assert.deepEqual(generateDataset(20, "uniform"), generateDataset(20, "uniform"));
});

test("buildMembershipQueries includes hits and misses", () => {
  const dataset = generateDataset(500, "clustered");
  const queries = buildMembershipQueries(dataset);
  const matches = queries.filter((value) => dataset.includes(value)).length;

  assert.ok(matches > 0);
  assert.ok(matches < queries.length);
});
