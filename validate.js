// Check whether a list contains a value using a simple loop.
export function listContains(list, value) {
  // Compare each item in the list with the requested value.
  for (let i = 0; i < list.length; i++) {
    if (list[i] === value) {
      return true;
    }
  }
  return false;
}

// Parse a user-entered list of decimal numbers.
export function parseNumberList(text) {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: 'Please enter at least one number.' };
  }
  if (/^,\s*|,\s*,|,\s*$/.test(trimmed)) {
    return { ok: false, error: 'Invalid value: "". Enter numbers only, e.g. 5, 3, 8.' };
  }
  const tokens = trimmed.split(/[,\s]+/);
  if (tokens.length > 5000) {
    return { ok: false, error: 'Please enter at most 5000 numbers.' };
  }
  const values = new Array(tokens.length);
  // Validate and convert each token in the input list.
  for (let i = 0; i < tokens.length; i++) {
    if (!/^-?\d+(\.\d+)?$/.test(tokens[i])) {
      return { ok: false, error: `Invalid value: "${tokens[i]}". Enter numbers only, e.g. 5, 3, 8.` };
    }
    const value = Number(tokens[i]);
    if (!Number.isFinite(value)) {
      return { ok: false, error: `Invalid value: "${tokens[i]}". Enter finite numbers only.` };
    }
    values[i] = value;
  }
  return { ok: true, values };
}

// Parse an integer and ensure it is within the supplied inclusive range.
export function parseIntegerInRange(text, min, max, label) {
  const trimmed = text.trim();
  const value = Number(trimmed);
  if (!/^-?\d+$/.test(trimmed) || !Number.isSafeInteger(value) || value < min || value > max) {
    return { ok: false, error: `${label} must be a whole number from ${min} to ${max}.` };
  }
  return { ok: true, value };
}

// Parse a comma-separated sequence of structure commands and numeric arguments.
export function parseCommands(text, allowedNames) {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: 'Please enter at least one command.' };
  }
  const parts = trimmed.split(',');
  if (parts.length > 200) {
    return { ok: false, error: 'Please enter at most 200 commands.' };
  }
  const commands = new Array(parts.length);
  const noArgument = [
    'pop', 'dequeue', 'peek', 'front', 'size', 'is_empty', 'is_full',
    'display', 'displayBack', 'deleteHead', 'deleteTail'
  ];
  // Validate the name and argument for each command.
  for (let i = 0; i < parts.length; i++) {
    const tokens = parts[i].trim().split(/\s+/);
    const name = tokens[0];
    if (name.length === 0 || !listContains(allowedNames, name)) {
      return { ok: false, error: `Unknown command: "${name}".` };
    }
    if (listContains(noArgument, name)) {
      if (tokens.length !== 1) {
        return { ok: false, error: `Command "${name}" does not take a value.` };
      }
      commands[i] = { name, arg: null };
    } else if (name === 'insertBefore' || name === 'insertAfter') {
      if (tokens.length !== 3 || !/^-?\d+(\.\d+)?$/.test(tokens[1]) || !/^-?\d+(\.\d+)?$/.test(tokens[2])) {
        return { ok: false, error: `Command "${name}" requires a target and a numeric value.` };
      }
      commands[i] = { name, arg: Number(tokens[1]), value: Number(tokens[2]) };
    } else if (name === 'deleteBefore' || name === 'deleteAfter') {
      if (tokens.length !== 2 || !/^-?\d+(\.\d+)?$/.test(tokens[1])) {
        return { ok: false, error: `Command "${name}" requires one numeric target.` };
      }
      commands[i] = { name, arg: Number(tokens[1]) };
    } else {
      if (tokens.length !== 2 || !/^-?\d+(\.\d+)?$/.test(tokens[1]) || !Number.isFinite(Number(tokens[1]))) {
        return { ok: false, error: `Command "${name}" requires one numeric value.` };
      }
      commands[i] = { name, arg: Number(tokens[1]) };
    }
  }
  return { ok: true, commands };
}
