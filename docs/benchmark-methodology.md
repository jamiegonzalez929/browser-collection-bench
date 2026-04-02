# Benchmark Methodology

## What the app measures

Each scenario benchmarks a small collection task that many JavaScript applications perform:

- removing duplicates from an array
- checking membership for many queries
- building a frequency table

For each run, the app:

1. generates a deterministic dataset locally
2. performs one warm-up call per strategy
3. measures the strategy repeatedly with `performance.now()`
4. validates that each strategy returns the same logical result
5. ranks strategies by median duration

## Why median is the default signal

Single browser benchmark runs can spike because of garbage collection, tab scheduling, thermal throttling, or unrelated background work. Median is a better ranking signal than a single best run because it is more resistant to those spikes.

The app still reports mean, fastest, and slowest run so the spread is visible.

## Interpreting results

- Treat close results as effectively tied.
- Prefer scenarios that match your real workload.
- `Set.has` can outperform repeated `Array.includes` checks when you reuse the same lookup set many times, but the upfront set construction cost matters in small workloads.
- Object and `Map` frequency tables can trade off ergonomics, insertion order semantics, and performance.

## What this project is not

This is not a replacement for profiling a real app. It is a compact exploratory tool for checking baseline behavior under controlled local conditions.
