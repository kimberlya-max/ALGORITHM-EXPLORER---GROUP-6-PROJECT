import { configureSortingPlayback } from './visualizer.js';

const OPERATION_LABELS = {
  comparisons: 'Comparisons',
  swaps: 'Swaps',
  writes: 'Writes',
  calls: 'Calls / loop iterations',
  arithmetic: 'Arithmetic operations',
  nodeVisits: 'Node visits'
};

function createTable(headers, rows) {
  const table = document.createElement('table');
  const head = document.createElement('thead');
  const headerRow = document.createElement('tr');
  for (let i = 0; i < headers.length; i++) {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = headers[i];
    headerRow.appendChild(cell);
  }
  head.appendChild(headerRow);
  table.appendChild(head);
  const body = document.createElement('tbody');
  for (let i = 0; i < rows.length; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < rows[i].length; j++) {
      const cell = document.createElement('td');
      cell.textContent = String(rows[i][j]);
      row.appendChild(cell);
    }
    body.appendChild(row);
  }
  table.appendChild(body);
  return table;
}

export function renderResponse(response) {
  document.getElementById('results').hidden = false;
  document.getElementById('result-text').textContent = response.resultText;
  document.getElementById('time-value').textContent =
    `${response.timeMs.toFixed(4)} ms average over ${response.timeRuns} runs.`;
  const complexity = response.complexity;
  document.getElementById('complexity-value').textContent =
    `Best: ${complexity.best} · Average: ${complexity.average} · Worst: ${complexity.worst} · Space: ${complexity.space}` +
    `${complexity.stable === undefined ? '' : ` · Stable: ${complexity.stable}`}. ${complexity.note}`;
  const operationRows = [];
  const keys = Object.keys(OPERATION_LABELS);
  for (let i = 0; i < keys.length; i++) {
    operationRows[i] = [OPERATION_LABELS[keys[i]], response.operations[keys[i]]];
  }
  operationRows[operationRows.length] = ['Total operations', response.totalOperations];
  const operations = document.getElementById('operations-table');
  operations.textContent = '';
  operations.appendChild(createTable(['Operation', 'Count'], operationRows));

  const stepList = document.getElementById('step-list');
  stepList.textContent = '';
  document.getElementById('steps-note').textContent = response.stepsNote;
  for (let i = 0; i < response.steps.length; i++) {
    const step = response.steps[i];
    const item = document.createElement('li');
    item.textContent = step.message;
    item.dataset.type = step.type;
    if (typeof step.depth === 'number') {
      item.style.marginLeft = `${step.depth * 18}px`;
    }
    if (Array.isArray(step.contents)) {
      item.textContent += ` [${step.contents.join(', ')}]`;
    }
    if (typeof step.frontIndex === 'number') {
      item.textContent += ` (front index ${step.frontIndex}, rear index ${step.rearIndex})`;
    }
    if (Array.isArray(step.array)) {
      item.textContent += `  →  [${step.array.join(', ')}]`;
    }
    stepList.appendChild(item);
  }

  const isSort = response.category === 'sorting';
  document.getElementById('visualization-panel').hidden = !isSort;
  if (isSort) {
    configureSortingPlayback(
      response.steps,
      response.inputParsed,
      response.result,
      document.getElementById('bars')
    );
  }
  const isHanoi = response.algorithm === 'hanoi';
  document.getElementById('hanoi-panel').hidden = !isHanoi;
  const recursionPanel = document.getElementById('recursion-panel');
  recursionPanel.hidden = response.category !== 'recursion' || isHanoi;
  if (response.category === 'recursion' && !isHanoi) {
    document.getElementById('base-case').textContent = complexity.baseCase || 'See the algorithm description above.';
    document.getElementById('recursive-case').textContent = complexity.recursiveCase || complexity.note;
  }
}

export function renderCompare(rows) {
  const panel = document.getElementById('compare-panel');
  const container = document.getElementById('compare-results');
  panel.hidden = false;
  container.textContent = '';
  const tableRows = rows.map((row) => [
    row.algorithm,
    row.comparisons,
    row.swaps,
    row.writes,
    row.totalOperations,
    `${row.timeMs.toFixed(4)} ms`,
    row.resultText
  ]);
  container.appendChild(createTable(
    ['Algorithm', 'Comparisons', 'Swaps', 'Writes', 'Total operations', 'Average time', 'Sorted result'],
    tableRows
  ));
}

export function renderBenchmark(rows, algorithm, caseType) {
  const container = document.getElementById('benchmark-results');
  container.textContent = '';
  const tableRows = rows.map((row) => [
    row.n,
    row.totalOperations,
    row.comparisons,
    `${row.timeMs.toFixed(4)} ms (${row.runs} runs)`,
    row.theoretical.toFixed(2)
  ]);
  container.appendChild(createTable(
    ['n', 'Total operations', 'Comparisons', 'Measured average time', 'Theoretical growth reference'],
    tableRows
  ));
  renderBenchmarkChart(rows, algorithm, caseType);
}

function renderBenchmarkChart(rows, algorithm, caseType) {
  const container = document.getElementById('benchmark-chart');
  container.textContent = '';
  if (rows.length === 0) {
    return;
  }
  const namespace = 'http://www.w3.org/2000/svg';
  const chart = document.createElementNS(namespace, 'svg');
  chart.setAttribute('viewBox', '0 0 720 300');
  chart.setAttribute('role', 'img');
  chart.setAttribute('aria-label', `Measured time for ${algorithm} on ${caseType} data`);
  const title = document.createElementNS(namespace, 'text');
  title.setAttribute('x', '360');
  title.setAttribute('y', '22');
  title.setAttribute('text-anchor', 'middle');
  title.textContent = `${algorithm}: ${caseType} input`;
  chart.appendChild(title);
  const left = 64;
  const right = 700;
  const top = 42;
  const bottom = 258;
  const maxN = Math.max(1, ...rows.map((row) => row.n));
  const maxTime = Math.max(0.001, ...rows.map((row) => row.timeMs));
  const axis = document.createElementNS(namespace, 'path');
  axis.setAttribute('d', `M ${left} ${top} V ${bottom} H ${right}`);
  axis.setAttribute('fill', 'none');
  axis.setAttribute('stroke', '#64748b');
  chart.appendChild(axis);
  const points = rows.map((row) => {
    const x = left + (row.n / maxN) * (right - left);
    const y = bottom - (row.timeMs / maxTime) * (bottom - top);
    return `${x},${y}`;
  }).join(' ');
  const line = document.createElementNS(namespace, 'polyline');
  line.setAttribute('points', points);
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', '#2563eb');
  line.setAttribute('stroke-width', '3');
  chart.appendChild(line);
  rows.forEach((row) => {
    const x = left + (row.n / maxN) * (right - left);
    const y = bottom - (row.timeMs / maxTime) * (bottom - top);
    const dot = document.createElementNS(namespace, 'circle');
    dot.setAttribute('cx', String(x));
    dot.setAttribute('cy', String(y));
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', '#1d4ed8');
    dot.setAttribute('aria-label', `n ${row.n}, ${row.timeMs.toFixed(4)} milliseconds`);
    chart.appendChild(dot);
    const label = document.createElementNS(namespace, 'text');
    label.setAttribute('x', String(x));
    label.setAttribute('y', String(bottom + 18));
    label.setAttribute('text-anchor', 'middle');
    label.textContent = String(row.n);
    chart.appendChild(label);
  });
  container.appendChild(chart);
}
