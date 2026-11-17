// Generate the recursive sequence of moves for Tower of Hanoi.
export function towerOfHanoi(disks, source, destination, auxiliary, counter, log) {
  const moves = [];

  function move(count, from, to, spare) {
    counter.calls++;
    if (count === 0) {
      return;
    }
    move(count - 1, from, spare, to);
    const entry = { disk: count, from, to };
    moves[moves.length] = entry;
    if (log !== null) {
      log.add({ type: 'move', message: `Move disk ${count} from ${from} to ${to}` });
    }
    move(count - 1, spare, to, from);
  }

  move(disks, source, destination, auxiliary);
  return moves;
}
