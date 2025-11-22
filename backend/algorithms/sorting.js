export const bubbleSort = (arr) => {
  const steps = [];
  const array = [...arr];
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ type: 'compare', indices: [j, j + 1] });
      
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push({ type: 'swap', indices: [j, j + 1], array: [...array] });
      }
    }
    steps.push({ type: 'sorted', index: n - i - 1 });
  }
  steps.push({ type: 'sorted', index: 0 });
  steps.push({ type: 'complete' });
  
  return steps;
};

export const selectionSort = (arr) => {
  const steps = [];
  const array = [...arr];
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({ type: 'current', index: i });

    for (let j = i + 1; j < n; j++) {
      steps.push({ type: 'compare', indices: [minIdx, j] });
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      steps.push({ type: 'swap', indices: [i, minIdx], array: [...array] });
    }
    steps.push({ type: 'sorted', index: i });
  }
  steps.push({ type: 'sorted', index: n - 1 });
  steps.push({ type: 'complete' });
  
  return steps;
};

export const insertionSort = (arr) => {
  const steps = [];
  const array = [...arr];
  const n = array.length;

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    steps.push({ type: 'current', index: i });

    while (j >= 0 && array[j] > key) {
      steps.push({ type: 'compare', indices: [j, j + 1] });
      array[j + 1] = array[j];
      steps.push({ type: 'shift', indices: [j, j + 1], array: [...array] });
      j--;
    }
    array[j + 1] = key;
    steps.push({ type: 'insert', index: j + 1, array: [...array] });
  }
  
  for (let i = 0; i < n; i++) {
    steps.push({ type: 'sorted', index: i });
  }
  steps.push({ type: 'complete' });
  
  return steps;
};

export const quickSort = (arr) => {
  const steps = [];
  const array = [...arr];

  const partition = (low, high) => {
    const pivot = array[high];
    steps.push({ type: 'pivot', index: high });
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({ type: 'compare', indices: [j, high] });
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        steps.push({ type: 'swap', indices: [i, j], array: [...array] });
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    steps.push({ type: 'swap', indices: [i + 1, high], array: [...array] });
    steps.push({ type: 'sorted', index: i + 1 });
    return i + 1;
  };

  const sort = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high) {
      steps.push({ type: 'sorted', index: low });
    }
  };

  sort(0, array.length - 1);
  steps.push({ type: 'complete' });
  
  return steps;
};

export const heapSort = (arr) => {
  const steps = [];
  const array = [...arr];
  const n = array.length;

  const heapify = (size, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < size) {
      steps.push({ type: 'compare', indices: [left, largest] });
      if (array[left] > array[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      steps.push({ type: 'compare', indices: [right, largest] });
      if (array[right] > array[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      steps.push({ type: 'swap', indices: [i, largest], array: [...array] });
      heapify(size, largest);
    }
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    steps.push({ type: 'swap', indices: [0, i], array: [...array] });
    steps.push({ type: 'sorted', index: i });
    heapify(i, 0);
  }
  steps.push({ type: 'sorted', index: 0 });
  steps.push({ type: 'complete' });
  
  return steps;
};