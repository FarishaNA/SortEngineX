import React, { useState, useEffect } from 'react';
import { useAnimationEngine } from '../hooks/useAnimationEngine';
import PathfindingControls from './PathfindingControls';
import Grid from './Grid';

const API_URL = 'http://localhost:3000/api';

const PathfindingVisualizer = () => {
  const rows = 20;
  const cols = 30;
  
  const [grid, setGrid] = useState([]);
  const [start] = useState([5, 5]);
  const [end] = useState([15, 25]);
  const [algorithm, setAlgorithm] = useState('bfs');
  const [visited, setVisited] = useState([]);
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState('');
  
  const { animate, stop, isAnimating, animationSpeed, setAnimationSpeed } = useAnimationEngine();

  const initializeGrid = () => {
    const newGrid = Array(rows).fill(null).map(() => Array(cols).fill(0));
    setGrid(newGrid);
    setVisited([]);
    setPath([]);
    setError(null);
    setCurrentStep('');
  };

  useEffect(() => {
    initializeGrid();
  }, []);

  const handleCellClick = (row, col) => {
    if (isAnimating || (row === start[0] && col === start[1]) || (row === end[0] && col === end[1])) return;
    
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
    setGrid(newGrid);
  };

  const clearWalls = () => {
    initializeGrid();
  };

  const handleStart = async () => {
    setVisited([]);
    setPath([]);
    setLoading(true);
    setError(null);
    setCurrentStep('Preparing to search...');

    try {
      console.log('🚀 Starting pathfinding');
      console.log('Algorithm:', algorithm);
      console.log('Grid size:', rows, 'x', cols);
      console.log('Start:', start, 'End:', end);
      
      const response = await fetch(`${API_URL}/pathfind/${algorithm}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid, start, end }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Received steps:', data.steps.length);
      const steps = data.steps;

      setLoading(false);

      let visitedCount = 0;
      let pathFound = false;

      await animate(steps, async (step) => {
        switch (step.type) {
          case 'visit':
            visitedCount++;
            setVisited(prev => [...prev, step.position]);
            setCurrentStep(`Exploring node [${step.position[0]}, ${step.position[1]}] - ${visitedCount} nodes visited`);
            break;
          case 'path':
            if (!pathFound) {
              pathFound = true;
              setCurrentStep('Path found! Tracing back...');
            }
            setPath(prev => [...prev, step.position]);
            break;
          case 'complete':
            if (pathFound) {
              setCurrentStep(`✅ Pathfinding complete! Found path with ${visitedCount} nodes explored.`);
            } else {
              setCurrentStep(`❌ No path found after exploring ${visitedCount} nodes.`);
            }
            break;
        }
      });
    } catch (err) {
      setLoading(false);
      setError(`Failed to fetch: ${err.message}. Is backend running on port 3000?`);
      console.error('Error:', err);
      setCurrentStep('');
    }
  };

  return (
    <div className="flex gap-6">
      {/* Main visualization area */}
      <div className="flex-1 space-y-6">
        <PathfindingControls
          algorithm={algorithm}
          onAlgorithmChange={setAlgorithm}
          onClearWalls={clearWalls}
          onStart={handleStart}
          onStop={stop}
          onSpeedChange={setAnimationSpeed}
          isAnimating={isAnimating || loading}
          speed={animationSpeed}
        />
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {loading && (
          <div className="text-center text-white">
            <p>Loading pathfinding steps from backend...</p>
          </div>
        )}
        
        <div className="flex justify-center">
          <Grid
            grid={grid}
            start={start}
            end={end}
            visited={visited}
            path={path}
            onCellClick={handleCellClick}
          />
        </div>
      </div>

      {/* Sidebar with legend and description */}
      <div className="w-80 space-y-4">
        {/* Color Legend */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-bold text-lg mb-3">Color Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
              <span className="text-gray-300 text-sm">Start Node</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <span className="text-gray-300 text-sm">End Node</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-800 border border-gray-600 rounded"></div>
              <span className="text-gray-300 text-sm">Wall (Click to add/remove)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-300 rounded"></div>
              <span className="text-gray-300 text-sm">Visited Node</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-yellow-400 rounded"></div>
              <span className="text-gray-300 text-sm">Shortest Path</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
              <span className="text-gray-300 text-sm">Unvisited Node</span>
            </div>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-bold text-lg mb-3">Algorithm Info</h3>
          {algorithm === 'bfs' ? (
            <div className="text-gray-300 text-sm space-y-2">
              <p className="font-semibold text-blue-400">Breadth-First Search (BFS)</p>
              <p>Explores nodes level by level, guaranteeing the shortest path in unweighted graphs.</p>
              <p className="text-xs text-gray-400 mt-2">Time: O(V+E) | Space: O(V)</p>
            </div>
          ) : (
            <div className="text-gray-300 text-sm space-y-2">
              <p className="font-semibold text-purple-400">Depth-First Search (DFS)</p>
              <p>Explores as far as possible along each branch before backtracking. Does not guarantee shortest path.</p>
              <p className="text-xs text-gray-400 mt-2">Time: O(V+E) | Space: O(V)</p>
            </div>
          )}
        </div>

        {/* Current Step */}
        {currentStep && (
          <div className="bg-blue-900 border border-blue-700 p-4 rounded-lg">
            <h3 className="text-white font-bold text-sm mb-2">Current Step:</h3>
            <p className="text-blue-200 text-sm">{currentStep}</p>
          </div>
        )}

        {/* Statistics */}
        {(visited.length > 0 || path.length > 0) && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-bold text-lg mb-3">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Nodes Visited:</span>
                <span className="font-bold text-blue-400">{visited.length}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Path Length:</span>
                <span className="font-bold text-yellow-400">{path.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PathfindingVisualizer;