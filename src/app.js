import { runScenarioBenchmark } from "./benchmark.js";
import { getScenarioById, scenarios } from "./scenarios.js";
import { summarizeDataset } from "./data.js";

const scenarioSelect = document.querySelector("#scenario");
const datasetSizeInput = document.querySelector("#dataset-size");
const datasetSizeValue = document.querySelector("#dataset-size-value");
const distributionSelect = document.querySelector("#distribution");
const iterationsInput = document.querySelector("#iterations");
const iterationsValue = document.querySelector("#iterations-value");
const runButton = document.querySelector("#run-button");
const statusNode = document.querySelector("#status");
const chartNode = document.querySelector("#chart");
const summaryNode = document.querySelector("#dataset-summary");
const resultsBody = document.querySelector("#results-body");

function formatInteger(value) {
  return Number(value).toLocaleString("en-US");
}

function formatDuration(ms) {
  return `${ms.toFixed(ms >= 10 ? 1 : 2)} ms`;
}

function renderScenarioOptions() {
  scenarioSelect.innerHTML = scenarios
    .map((scenario) => `<option value="${scenario.id}">${scenario.label}</option>`)
    .join("");
}

function renderDatasetSummary(summary) {
  summaryNode.innerHTML = [
    ["Items", formatInteger(summary.size)],
    ["Unique values", formatInteger(summary.uniqueCount)],
    ["Duplicate rate", `${(summary.duplicateRate * 100).toFixed(1)}%`],
    ["Range", `${summary.min} to ${summary.max}`]
  ]
    .map(
      ([label, value]) => `
        <div>
          <dt>${label}</dt>
          <dd>${value}</dd>
        </div>
      `
    )
    .join("");
}

function renderChart(results) {
  const slowest = Math.max(...results.map((result) => result.medianMs));
  chartNode.innerHTML = results
    .map((result) => {
      const width = slowest === 0 ? 100 : (result.medianMs / slowest) * 100;
      return `
        <div class="bar-row">
          <strong>${result.label}</strong>
          <div class="bar-track"><div class="bar-fill" style="width: ${width}%"></div></div>
          <span>${formatDuration(result.medianMs)}</span>
        </div>
      `;
    })
    .join("");
}

function renderTable(results) {
  resultsBody.innerHTML = results
    .map(
      (result) => `
        <tr>
          <td>${result.label}</td>
          <td>${formatDuration(result.medianMs)}</td>
          <td>${formatDuration(result.meanMs)}</td>
          <td>${formatDuration(result.minMs)}</td>
          <td>${formatDuration(result.maxMs)}</td>
        </tr>
      `
    )
    .join("");
}

function updateRangeLabels() {
  datasetSizeValue.textContent = formatInteger(datasetSizeInput.value);
  iterationsValue.textContent = formatInteger(iterationsInput.value);
}

async function runBenchmark() {
  const scenario = getScenarioById(scenarioSelect.value);
  const size = Number(datasetSizeInput.value);
  const iterations = Number(iterationsInput.value);
  const distribution = distributionSelect.value;

  statusNode.textContent = `Running ${scenario.label.toLowerCase()} benchmark...`;
  runButton.disabled = true;

  await new Promise((resolve) => requestAnimationFrame(resolve));

  const input = scenario.createInput(size, distribution);
  const dataset = Array.isArray(input) ? input : input.values;
  const summary = summarizeDataset(dataset);
  const results = runScenarioBenchmark(scenario, input, iterations);

  renderDatasetSummary(summary);
  renderChart(results);
  renderTable(results);
  statusNode.textContent = `${scenario.label} complete on ${formatInteger(summary.size)} items.`;
  runButton.disabled = false;
}

renderScenarioOptions();
updateRangeLabels();

datasetSizeInput.addEventListener("input", updateRangeLabels);
iterationsInput.addEventListener("input", updateRangeLabels);
runButton.addEventListener("click", () => {
  runBenchmark().catch((error) => {
    statusNode.textContent = error.message;
    runButton.disabled = false;
  });
});

runBenchmark().catch((error) => {
  statusNode.textContent = error.message;
});
