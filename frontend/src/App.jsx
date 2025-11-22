import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

// ==================== ANIMATION ENGINE ====================

const useAnimationEngine = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(50);

  const animate = async (steps, onStep, onComplete) => {
    setIsAnimating(true);
    
    for (let i = 0; i < steps.length; i++) {
      if (!isAnimating && i > 0) break;
      
      setCurrentStep(i);
      await onStep(steps[i], i);
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
    
    setIsAnimating(false);
    setCurrentStep(0);
    if (onComplete) onComplete();
  };

  const stop = () => {
    setIsAnimating(false);
  };

  return { animate, stop, isAnimating, currentStep, animationSpeed, setAnimationSpeed };
};

// ==================== COMPONENTS ====================

// ArrayBars Component
const ArrayBars = ({ array, comparing, swapping, sorted, current, pivot }) => {
  const maxValue = Math.max(...array);
  
  return (
    <div className="flex items-end justify-center gap-1 h-96 p-8">
      {array.map((value, idx) => {
        let bgColor = 'bg-blue-500';
        
        if (sorted.includes(idx)) bgColor = 'bg-green-500';
        else if (pivot === idx) bgColor = 'bg-purple-500';
        else if (comparing.includes(idx)) bgColor = 'bg-yellow-500';
        else if (swapping.includes(idx)) bgColor = 'bg-red-500';
        else if (current === idx) bgColor = 'bg-orange-500';
        
        const height = (value / maxValue) * 100;
        
        return (
          <div
            key={idx}
            className={`${bgColor} transition-all duration-200 flex-1 max-w-16 rounded-t`}
            style={{ height: `${height}%` }}
          >
            <div className="text-xs text-white text-center pt-1">{value}</div>
          </div>
        );
      })}
    </div>
  );
};

// SortingControls Component
const SortingControls = ({ onAlgorithmChange, onGenerate, onStart, onStop, onSpeedChange, isAnimating, speed, algorithm }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-4">
      <div className="flex flex-wrap gap-4">
        <select
          value={algorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          disabled={isAnimating}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="heap">Heap Sort</option>
        </select>
        
        <button
          onClick={onGenerate}
          disabled={isAnimating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Generate Array
        </button>
        
        {!isAnimating ? (
          <button
            onClick={onStart}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <Play size={16} />
            Start
          </button>
        ) : (
          <button
            onClick={onStop}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
          >
            <Pause size={16} />
            Stop
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <Zap size={20} className="text-yellow-500" />
        <input
          type="range"
          min="10"
          max="200"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-white w-20">{speed}ms</span>
      </div>
    </div>
  );
};

// SortingVisualizer Component
const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [current, setCurrent] = useState(null);
  const [pivot, setPivot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { animate, stop, isAnimating, animationSpeed, setAnimationSpeed } = useAnimationEngine();

  const generateArray = () => {
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setCurrent(null);
    setPivot(null);
    setError(null);
  };

  React.useEffect(() => {
    generateArray();
  }, []);

  const handleStart = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call backend API to get algorithm steps
      const response = await fetch(`${API_URL}/sort/${algorithm}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ array }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const steps = data.steps;

      setLoading(false);

      // Animate the steps received from backend
      animate(steps, async (step) => {
        setComparing([]);
        setSwapping([]);
        setCurrent(null);
        setPivot(null);
        
        switch (step.type) {
          case 'compare':
            setComparing(step.indices);
            break;
          case 'swap':
          case 'shift':
            setSwapping(step.indices);
            setArray(step.array);
            break;
          case 'insert':
            setArray(step.array);
            break;
          case 'sorted':
            setSorted(prev => [...prev, step.index]);
            break;
          case 'current':
            setCurrent(step.index);
            break;
          case 'pivot':
            setPivot(step.index);
            break;
          case 'complete':
            setComparing([]);
            setSwapping([]);
            setCurrent(null);
            setPivot(null);
            break;
        }
      });
    } catch (err) {
      setLoading(false);
      setError(`Failed to fetch algorithm: ${err.message}. Make sure backend is running on port 3000.`);
      console.error('Error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <SortingControls
        algorithm={algorithm}
        onAlgorithmChange={setAlgorithm}
        onGenerate={generateArray}
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
          <p>Loading algorithm steps from backend...</p>
        </div>
      )}
      
      <ArrayBars
        array={array}
        comparing={comparing}
        swapping={swapping}
        sorted={sorted}
        current={current}
        pivot={pivot}
      />
    </div>
  );
};

// Node Component
const Node = ({ isStart, isEnd, isWall, isVisited, isPath }) => {
  let bgColor = 'bg-white';
  
  if (isStart) bgColor = 'bg-green-500';
  else if (isEnd) bgColor = 'bg-red-500';
  else if (isWall) bgColor = 'bg-gray-800';
  else if (isPath) bgColor = 'bg-yellow-400';
  else if (isVisited) bgColor = 'bg-blue-300';
  
  return (
    <div className={`${bgColor} border border-gray-300 transition-all duration-200`} />
  );
};

// Grid Component
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

// PathfindingControls Component
const PathfindingControls = ({ onAlgorithmChange, onClearWalls, onStart, onStop, onSpeedChange, isAnimating, speed, algorithm }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-4">
      <div className="flex flex-wrap gap-4">
        <select
          value={algorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          disabled={isAnimating}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          <option value="bfs">Breadth-First Search</option>
          <option value="dfs">Depth-First Search</option>
        </select>
        
        <button
          onClick={onClearWalls}
          disabled={isAnimating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Clear Walls
        </button>
        
        {!isAnimating ? (
          <button
            onClick={onStart}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <Play size={16} />
            Start
          </button>
        ) : (
          <button
            onClick={onStop}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
          >
            <Pause size={16} />
            Stop
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <Zap size={20} className="text-yellow-500" />
        <input
          type="range"
          min="10"
          max="200"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-white w-20">{speed}ms</span>
      </div>
      
      <p className="text-gray-400 text-sm">Click cells to add/remove walls</p>
    </div>
  );
};

// PathfindingVisualizer Component
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
  
  const { animate, stop, isAnimating, animationSpeed, setAnimationSpeed } = useAnimationEngine();

  const initializeGrid = () => {
    const newGrid = Array(rows).fill(null).map(() => Array(cols).fill(0));
    setGrid(newGrid);
    setVisited([]);
    setPath([]);
    setError(null);
  };

  React.useEffect(() => {
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

    try {
      // Call backend API to get pathfinding steps
      const response = await fetch(`${API_URL}/pathfind/${algorithm}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grid, start, end }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const steps = data.steps;

      setLoading(false);

      // Animate the steps received from backend
      animate(steps, async (step) => {
        switch (step.type) {
          case 'visit':
            setVisited(prev => [...prev, step.position]);
            break;
          case 'path':
            setPath(prev => [...prev, step.position]);
            break;
        }
      });
    } catch (err) {
      setLoading(false);
      setError(`Failed to fetch algorithm: ${err.message}. Make sure backend is running on port 3000.`);
      console.error('Error:', err);
    }
  };

  return (
    <div className="space-y-6">
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
  );
};

// Navbar Component
const Navbar = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">Algorithm Visualizer</h1>
        <div className="flex gap-4">
          <button
            onClick={() => onTabChange('sorting')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'sorting' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Sorting
          </button>
          <button
            onClick={() => onTabChange('pathfinding')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'pathfinding' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Pathfinding
          </button>
        </div>
      </div>
    </nav>
  );
};

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('sorting');

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="container mx-auto p-8">
        {activeTab === 'sorting' ? <SortingVisualizer /> : <PathfindingVisualizer />}
      </div>
    </div>
  );
};

export default App;