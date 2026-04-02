export function dedupeWithSet(values) {
  return [...new Set(values)];
}

export function dedupeWithFilter(values) {
  return values.filter((value, index) => values.indexOf(value) === index);
}

export function dedupeWithObject(values) {
  const seen = Object.create(null);
  const output = [];

  for (const value of values) {
    const key = String(value);
    if (seen[key]) {
      continue;
    }

    seen[key] = true;
    output.push(value);
  }

  return output;
}

export function membershipIncludes(values, queries) {
  return queries.map((query) => values.includes(query));
}

export function membershipSet(values, queries) {
  const lookup = new Set(values);
  return queries.map((query) => lookup.has(query));
}

export function frequencyObject(values) {
  const counts = Object.create(null);

  for (const value of values) {
    counts[value] = (counts[value] || 0) + 1;
  }

  return counts;
}

export function frequencyMap(values) {
  const counts = new Map();

  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  return Object.fromEntries(counts.entries());
}

export function frequencyReduce(values) {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, Object.create(null));
}
