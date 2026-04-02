function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function generateDataset(size, distribution = "clustered") {
  const normalizedSize = clamp(Number(size) || 1000, 100, 100000);
  const distinctCount = Math.max(25, Math.floor(normalizedSize * 0.18));
  const values = [];

  for (let index = 0; index < normalizedSize; index += 1) {
    if (distribution === "uniform") {
      values.push((index * 48271) % (distinctCount * 11));
      continue;
    }

    const cluster = Math.floor(index / 7) % distinctCount;
    const noise = (index * 13) % 5;
    values.push(cluster * 3 + noise);
  }

  return values;
}

export function buildMembershipQueries(dataset) {
  const hitCount = Math.max(10, Math.floor(dataset.length * 0.08));
  const misses = Math.floor(hitCount / 3);
  const hits = dataset.slice(0, hitCount);
  const absentBase = Math.max(...dataset) + 1000;
  const missValues = Array.from({ length: misses }, (_, index) => absentBase + index * 11);
  return hits.concat(missValues);
}

export function summarizeDataset(dataset) {
  const uniqueCount = new Set(dataset).size;
  const duplicateRate = 1 - uniqueCount / dataset.length;
  const min = Math.min(...dataset);
  const max = Math.max(...dataset);
  return {
    size: dataset.length,
    uniqueCount,
    duplicateRate,
    min,
    max
  };
}
