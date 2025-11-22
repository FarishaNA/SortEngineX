export const bfs = (grid, start, end) => {
  const steps = [];
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const parent = Array(rows).fill(null).map(() => Array(cols).fill(null));
  
  const queue = [[start[0], start[1]]];
  visited[start[0]][start[1]] = true;
  
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  
  while (queue.length > 0) {
    const [row, col] = queue.shift();
    steps.push({ type: 'visit', position: [row, col] });
    
    if (row === end[0] && col === end[1]) {
      const path = [];
      let current = [row, col];
      while (current) {
        path.unshift(current);
        current = parent[current[0]][current[1]];
      }
      path.forEach(pos => steps.push({ type: 'path', position: pos }));
      steps.push({ type: 'complete' });
      return steps;
    }
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols &&
          !visited[newRow][newCol] && grid[newRow][newCol] !== 1) {
        visited[newRow][newCol] = true;
        parent[newRow][newCol] = [row, col];
        queue.push([newRow, newCol]);
      }
    }
  }
  
  steps.push({ type: 'complete' });
  return steps;
};

export const dfs = (grid, start, end) => {
  const steps = [];
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const parent = Array(rows).fill(null).map(() => Array(cols).fill(null));
  
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let found = false;
  
  const dfsHelper = (row, col) => {
    if (found) return;
    
    visited[row][col] = true;
    steps.push({ type: 'visit', position: [row, col] });
    
    if (row === end[0] && col === end[1]) {
      found = true;
      const path = [];
      let current = [row, col];
      while (current) {
        path.unshift(current);
        current = parent[current[0]][current[1]];
      }
      path.forEach(pos => steps.push({ type: 'path', position: pos }));
      return;
    }
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols &&
          !visited[newRow][newCol] && grid[newRow][newCol] !== 1) {
        parent[newRow][newCol] = [row, col];
        dfsHelper(newRow, newCol);
      }
    }
  };
  
  dfsHelper(start[0], start[1]);
  steps.push({ type: 'complete' });
  return steps;
};