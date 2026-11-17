import { runAlgorithm, runBenchmark, runCompareAll } from './engine/index.js';
import { getRequestFromForm, showError, updateAlgorithmOptions, updateInputHelp } from './ui/controls.js';
import { renderBenchmark, renderCompare, renderResponse } from './ui/render.js';
import {
  configureHanoi,
  pauseHanoi,
  pauseSorting,
  playHanoi,
  playSorting,
  resetHanoi,
  resetSorting,
  stepHanoi,
  stepSorting
} from './ui/visualizer.js';

const form = document.getElementById('algorithm-form');
let sortingPlaying = false;
let hanoiPlaying = false;

function updateModuleView() {
  const analysisSelected = document.getElementById('category').value === 'analysis';
  document.getElementById('algorithm-inputs').hidden = analysisSelected;
  document.getElementById('benchmark-panel').hidden = !analysisSelected;
}

function setSortingPlaying(value) {
  sortingPlaying = value;
  document.getElementById('sort-play').textContent = value ? 'Pause' : 'Auto-play';
}

function setHanoiPlaying(value) {
  hanoiPlaying = value;
  document.getElementById('hanoi-play').textContent = value ? 'Pause' : 'Start';
}

document.getElementById('category').addEventListener('change', () => {
  updateAlgorithmOptions();
  updateModuleView();
});
document.getElementById('algorithm').addEventListener('change', updateInputHelp);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  showError('');
  if (document.getElementById('category').value === 'analysis') {
    showError('Use the Time Complexity Analysis controls below to run a benchmark.');
    return;
  }
  pauseSorting();
  pauseHanoi();
  setSortingPlaying(false);
  setHanoiPlaying(false);
  const response = runAlgorithm(getRequestFromForm());
  if (!response.ok) {
    document.getElementById('results').hidden = true;
    showError(response.error);
    return;
  }
  renderResponse(response);
  if (response.algorithm === 'hanoi') {
    configureHanoi(response.disks, response.pegs, response.moves, document.getElementById('hanoi-board'));
  }
});

document.getElementById('sort-step').addEventListener('click', () => {
  pauseSorting();
  setSortingPlaying(false);
  stepSorting();
});

document.getElementById('sort-play').addEventListener('click', () => {
  if (sortingPlaying) {
    pauseSorting();
    setSortingPlaying(false);
  } else {
    setSortingPlaying(true);
    playSorting(
      () => Number(document.getElementById('sort-speed').value),
      () => setSortingPlaying(false)
    );
  }
});

document.getElementById('sort-reset').addEventListener('click', () => {
  resetSorting();
  setSortingPlaying(false);
});

document.getElementById('sort-speed').addEventListener('input', (event) => {
  document.getElementById('sort-speed-value').textContent = `${event.target.value} ms`;
});

document.getElementById('hanoi-step').addEventListener('click', () => {
  pauseHanoi();
  setHanoiPlaying(false);
  stepHanoi();
});

document.getElementById('hanoi-play').addEventListener('click', () => {
  if (hanoiPlaying) {
    pauseHanoi();
    setHanoiPlaying(false);
  } else {
    setHanoiPlaying(true);
    playHanoi(
      () => Number(document.getElementById('hanoi-speed').value),
      () => setHanoiPlaying(false)
    );
  }
});

document.getElementById('hanoi-reset').addEventListener('click', () => {
  resetHanoi();
  setHanoiPlaying(false);
});

document.getElementById('hanoi-speed').addEventListener('input', (event) => {
  document.getElementById('hanoi-speed-value').textContent = `${event.target.value} ms`;
});

document.getElementById('compare-button').addEventListener('click', () => {
  showError('');
  if (document.getElementById('category').value !== 'sorting') {
    showError('Select the Sorting Lab to compare the five sorting algorithms.');
    return;
  }
  const response = runCompareAll(document.getElementById('user-input').value);
  if (!response.ok) {
    showError(response.error);
    return;
  }
  renderCompare(response.rows);
});

document.getElementById('benchmark-button').addEventListener('click', () => {
  showError('');
  const sizeText = document.getElementById('benchmark-sizes').value.trim();
  const tokens = sizeText.split(/[,\s]+/);
  if (sizeText.length === 0 || tokens.some((token) => !/^\d+$/.test(token))) {
    showError('Enter benchmark sizes as positive whole numbers separated by commas.');
    return;
  }
  const sizes = tokens.map(Number);
  const algorithm = document.getElementById('benchmark-algorithm').value;
  const caseType = document.getElementById('benchmark-case').value;
  const response = runBenchmark({ algorithm, caseType, sizes });
  if (!response.ok) {
    showError(response.error);
    return;
  }
  renderBenchmark(response.rows, algorithm, caseType);
});

updateAlgorithmOptions();
updateModuleView();
