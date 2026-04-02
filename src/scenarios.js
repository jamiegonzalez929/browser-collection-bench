import { buildMembershipQueries, generateDataset } from "./data.js";
import {
  dedupeWithFilter,
  dedupeWithObject,
  dedupeWithSet,
  frequencyMap,
  frequencyObject,
  frequencyReduce,
  membershipIncludes,
  membershipSet
} from "./strategies.js";

function sortNumeric(values) {
  return [...values].sort((left, right) => left - right);
}

export const scenarios = [
  {
    id: "dedupe",
    label: "Remove duplicates",
    description: "Keep one copy of each value from a duplicate-heavy array.",
    createInput: (size, distribution) => generateDataset(size, distribution),
    formatOutput: (output) => JSON.stringify(sortNumeric(output)),
    strategies: [
      { label: "Set", run: (input) => dedupeWithSet(input) },
      { label: "filter + indexOf", run: (input) => dedupeWithFilter(input) },
      { label: "Object lookup", run: (input) => dedupeWithObject(input) }
    ]
  },
  {
    id: "membership",
    label: "Membership checks",
    description: "Answer many contains? checks against the same dataset.",
    createInput: (size, distribution) => {
      const values = generateDataset(size, distribution);
      return { values, queries: buildMembershipQueries(values) };
    },
    formatOutput: (output) => JSON.stringify(output),
    strategies: [
      { label: "Array.includes", run: (input) => membershipIncludes(input.values, input.queries) },
      { label: "Set.has", run: (input) => membershipSet(input.values, input.queries) }
    ]
  },
  {
    id: "frequency",
    label: "Frequency tables",
    description: "Count how often every value appears in the array.",
    createInput: (size, distribution) => generateDataset(size, distribution),
    formatOutput: (output) => JSON.stringify(output),
    strategies: [
      { label: "Object loop", run: (input) => frequencyObject(input) },
      { label: "Map loop", run: (input) => frequencyMap(input) },
      { label: "Array.reduce", run: (input) => frequencyReduce(input) }
    ]
  }
];

export function getScenarioById(id) {
  return scenarios.find((scenario) => scenario.id === id) || scenarios[0];
}
