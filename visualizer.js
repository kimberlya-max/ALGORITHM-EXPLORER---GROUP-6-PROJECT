let sortingState = null;
let sortingTimer = null;
let hanoiState = null;
let hanoiTimer = null;

export function drawBars(containerElement, step) {
  const values = step.array || [];
  let maximum = 1;
  for (let i = 0; i < values.length; i++) {
    const magnitude = Math.abs(values[i]);
    if (magnitude > maximum) {
      maximum = magnitude;
    }
  }
  containerElement.textContent = '';
  containerElement.setAttribute('aria-label', `Array values: ${values.join(', ')}`);
  for (let i = 0; i < values.length; i++) {
    const bar = document.createElement('div');
    const height = Math.max(3, (Math.abs(values[i]) / maximum) * 100);
    bar.className = 'bar';
    bar.style.height = `${height}%`;
    bar.title = String(values[i]);
    if (step.type === 'done') {
      bar.dataset.state = 'sorted';
    } else if (step.indexes && step.indexes.includes(i)) {
      bar.dataset.state = step.type === 'swap' ? 'swap' : 'compare';
    }
    containerElement.appendChild(bar);
  }
}

export function configureSortingPlayback(steps, initial, result, container) {
  pauseSorting();
  sortingState = { steps, index: 0, initial, result, container };
  drawBars(container, { array: initial, indexes: [] });
}

export function stepSorting() {
  if (sortingState === null || sortingState.index >= sortingState.steps.length) {
    return false;
  }
  const step = sortingState.steps[sortingState.index++];
  if (Array.isArray(step.array)) {
    drawBars(sortingState.container, step);
  }
  return true;
}

export function playSorting(delayProvider, onComplete = () => {}) {
  if (sortingState === null || sortingTimer !== null) {
    return;
  }
  const playNext = () => {
    if (!stepSorting()) {
      pauseSorting();
      onComplete();
      return;
    }
    sortingTimer = window.setTimeout(() => {
      sortingTimer = null;
      playNext();
    }, delayProvider());
  };
  playNext();
}

export function pauseSorting() {
  if (sortingTimer !== null) {
    window.clearTimeout(sortingTimer);
    sortingTimer = null;
  }
}

export function resetSorting() {
  pauseSorting();
  if (sortingState !== null) {
    sortingState.index = 0;
    drawBars(sortingState.container, { array: sortingState.initial, indexes: [] });
  }
}

function drawHanoi() {
  if (hanoiState === null) {
    return;
  }
  const board = hanoiState.container;
  board.textContent = '';
  for (let i = 0; i < hanoiState.pegNames.length; i++) {
    const name = hanoiState.pegNames[i];
    const peg = document.createElement('div');
    peg.className = 'hanoi-peg';
    const stack = document.createElement('div');
    stack.className = 'hanoi-disks';
    const disks = hanoiState.pegs[name];
    for (let j = 0; j < disks.length; j++) {
      const disk = document.createElement('div');
      disk.className = 'hanoi-disk';
      disk.dataset.disk = String(disks[j]);
      disk.style.width = `${Math.max(22, (disks[j] / hanoiState.diskCount) * 88)}%`;
      disk.textContent = String(disks[j]);
      stack.appendChild(disk);
    }
    const rod = document.createElement('div');
    rod.className = 'hanoi-rod';
    peg.append(stack, rod);
    const base = document.createElement('div');
    base.className = 'hanoi-base';
    const label = document.createElement('strong');
    label.textContent = name;
    peg.append(base, label);
    board.appendChild(peg);
  }
  document.getElementById('hanoi-move-counter').textContent =
    `Move ${hanoiState.index} of ${hanoiState.moves.length}`;
}

export function configureHanoi(disks, pegNames, moves, container) {
  pauseHanoi();
  const pegs = Object.create(null);
  for (let i = 0; i < pegNames.length; i++) {
    pegs[pegNames[i]] = [];
  }
  for (let disk = disks; disk >= 1; disk--) {
    pegs[pegNames[0]].push(disk);
  }
  hanoiState = { diskCount: disks, pegNames, moves, pegs, index: 0, container };
  drawHanoi();
}

export function stepHanoi() {
  if (hanoiState === null || hanoiState.index >= hanoiState.moves.length) {
    return false;
  }
  const move = hanoiState.moves[hanoiState.index];
  const disk = hanoiState.pegs[move.from].pop();
  if (disk !== move.disk) {
    throw new Error('Tower of Hanoi move list is inconsistent with the peg state.');
  }
  hanoiState.pegs[move.to].push(disk);
  hanoiState.index++;
  drawHanoi();
  return true;
}

export function playHanoi(delayProvider, onComplete = () => {}) {
  if (hanoiState === null || hanoiTimer !== null) {
    return;
  }
  const playNext = () => {
    if (!stepHanoi()) {
      pauseHanoi();
      onComplete();
      return;
    }
    hanoiTimer = window.setTimeout(() => {
      hanoiTimer = null;
      playNext();
    }, delayProvider());
  };
  playNext();
}

export function pauseHanoi() {
  if (hanoiTimer !== null) {
    window.clearTimeout(hanoiTimer);
    hanoiTimer = null;
  }
}

export function resetHanoi() {
  if (hanoiState !== null) {
    configureHanoi(hanoiState.diskCount, hanoiState.pegNames, hanoiState.moves, hanoiState.container);
  }
}
