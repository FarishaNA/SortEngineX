import React from 'react';
import Node from './Node';

const Grid = ({ grid, start, end, visited, path, onCellClick }) => {
  return (
    <div className="inline-block bg-gray-100 p-4 rounded-lg">
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${grid[0].length}, 20px)` }}>
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div key={`${rowIdx}-${colIdx}`} onClick={() => onCellClick(rowIdx, colIdx)}>
              <Node
                isStart={start[0] === rowIdx && start[1] === colIdx}
                isEnd={end[0] === rowIdx && end[1] === colIdx}
                isWall={cell === 1}
                isVisited={visited.some(([r, c]) => r === rowIdx && c === colIdx)}
                isPath={path.some(([r, c]) => r === rowIdx && c === colIdx)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;