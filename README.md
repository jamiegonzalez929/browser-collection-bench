# Browser Collection Bench

Browser Collection Bench is a small local-first benchmark explorer for common JavaScript collection operations. It exists to make everyday performance tradeoffs visible in a way that is easy to run, inspect, and share from a single static site.

## Why it exists

JavaScript performance advice is often repeated without context. This project lets you run a few focused comparisons in your own browser and on your own machine, using the same core logic that is covered by automated tests.

## Features

- Runs fully locally with no third-party APIs
- Benchmarks three real collection tasks:
  - duplicate removal
  - repeated membership checks
  - frequency table creation
- Generates deterministic datasets with two data shapes
- Reports median, mean, fastest, and slowest runs
- Includes documentation on benchmark methodology
- Ships as a static site that also works on GitHub Pages

## Setup

Requirements:

- Node.js 25+
- Python 3

Install:

```bash
npm install
```

There are no package dependencies, but `npm install` will create a lockfile and make the scripts available in a standard workflow.

## How to run

Start a local static server from the repo root:

```bash
npm start
```

Then open `http://localhost:4173`.

## How to test

```bash
npm test
```

## Example usage

1. Open the app in a browser.
2. Choose `Membership checks`.
3. Increase dataset size to `50,000`.
4. Run the benchmark and compare `Array.includes` with `Set.has`.
5. Switch the data shape from `Clustered duplicates` to `Uniform spread` and rerun.

## Project structure

- `index.html`: static app shell
- `styles.css`: visual design and responsive layout
- `src/`: shared benchmark, dataset, and UI code
- `test/`: Node test suite for benchmark logic
- `docs/`: extra documentation

## Limitations

- Browser timing is noisy, especially on laptops under load.
- The scenarios are intentionally narrow and do not replace application-level profiling.
- The app compares a few baseline strategies, not every possible algorithm.

## Next ideas

- Add export-to-JSON for result snapshots
- Add string-heavy scenarios and object-keyed datasets
- Compare across browsers with a saved history format
