import React, { useState, useEffect } from 'react';
import { useAnimationEngine } from '../hooks/useAnimationEngine';
import SortingControls from './SortingControls';
import ArrayBars from './ArrayBars';

const API_URL = 'http://localhost:3000/api';

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
  const [currentStep, setCurrentStep] = useState('');
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  
  const { animate, stop, isAnimating, animationSpeed, setAnimationSpeed } = useAnimationEngine();

  const generateArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setCurrent(null);
    setPivot(null);
    setError(null);
    setCurrentStep('');
    setComparisons(0);
    setSwaps(0);
  };

  useEffect(() => {
    generateArray();
  }, []);

  const getAlgorithmInfo = () => {
    const info = {
      bubble: {
        name: 'Bubble Sort',
        description: 'Repeatedly compares adjacent elements and swaps them if they are in wrong order. Simple but inefficient.',
        complexity: 'Time: O(n²) | Space: O(1)',
        color: 'text-blue-400'
      },
      selection: {
        name: 'Selection Sort',
        description: 'Finds the minimum element and places it at the beginning. Divides array into sorted and unsorted parts.',
        complexity: 'Time: O(n²) | Space: O(1)',
        color: 'text-green-400'
      },
      insertion: {
        name: 'Insertion Sort',
        description: 'Builds the sorted array one item at a time by inserting elements into their correct position.',
        complexity: 'Time: O(n²) | Space: O(1)',
        color: 'text-orange-400'
      },
      quick: {
        name: 'Quick Sort',
        description: 'Divide-and-conquer algorithm that picks a pivot and partitions array around it. Very efficient on average.',
        complexity: 'Time: O(n log n) avg | Space: O(log n)',
        color: 'text-purple-400'
      },
      heap: {
        name: 'Heap Sort',
        description: 'Uses binary heap data structure. First builds a max heap, then repeatedly extracts maximum element.',
        complexity: 'Time: O(n log n) | Space: O(1)',
        color: 'text-pink-400'
      }
    };
    return info[algorithm];
  };

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    setCurrentStep('Preparing to sort...');
    setComparisons(0);
    setSwaps(0);

    try {
      const response = await fetch(`${API_URL}/sort/${algorithm}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const steps = data.steps;

      setLoading(false);

      let compCount = 0;
      let swapCount = 0;

      await animate(steps, async (step) => {
        setComparing([]);
        setSwapping([]);
        setCurrent(null);
        setPivot(null);
        
        switch (step.type) {
          case 'compare':
            compCount++;
            setComparisons(compCount);
            setComparing(step.indices);
            setCurrentStep(`Comparing elements at positions ${step.indices[0]} and ${step.indices[1]}`);
            break;
          case 'swap':
            swapCount++;
            setSwaps(swapCount);
            setSwapping(step.indices);
            setArray(step.array);
            setCurrentStep(`Swapping elements at positions ${step.indices[0]} and ${step.indices[1]}`);
            break;
          case 'shift':
            setSwapping(step.indices);
            setArray(step.array);
            setCurrentStep(`Shifting element from position ${step.indices[0]} to ${step.indices[1]}`);
            break;
          case 'insert':
            setArray(step.array);
            setCurrentStep(`Inserting element at position ${step.index}`);
            break;
          case 'sorted':
            setSorted(prev => [...prev, step.index]);
            setCurrentStep(`Element at position ${step.index} is now in its final sorted position`);
            break;
          case 'current':
            setCurrent(step.index);
            setCurrentStep(`Examining element at position ${step.index}`);
            break;
          case 'pivot':
            setPivot(step.index);
            setCurrentStep(`Selected pivot at position ${step.index}`);
            break;
          case 'complete':
            setComparing([]);
            setSwapping([]);
            setCurrent(null);
            setPivot(null);
            setCurrentStep(`✅ Sorting complete! Made ${compCount} comparisons and ${swapCount} swaps.`);
            break;
        }
      });
    } catch (err) {
      setLoading(false);
      setError(`Failed to fetch: ${err.message}. Is backend running on port 3000?`);
      setCurrentStep('');
    }
  };

  const algorithmInfo = getAlgorithmInfo();

  return (
    <div className="flex gap-6">
      {/* Main visualization area */}
      <div className="flex-1 space-y-6">
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

      {/* Sidebar with legend and description */}
      <div className="w-80 space-y-4">
        {/* Color Legend */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-bold text-lg mb-3">Color Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
              <span className="text-gray-300 text-sm">Unsorted Element</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
              <span className="text-gray-300 text-sm">Comparing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <span className="text-gray-300 text-sm">Swapping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded"></div>
              <span className="text-gray-300 text-sm">Current Element</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded"></div>
              <span className="text-gray-300 text-sm">Pivot (Quick Sort)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
              <span className="text-gray-300 text-sm">Sorted</span>
            </div>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-bold text-lg mb-3">Algorithm Info</h3>
          <div className="text-gray-300 text-sm space-y-2">
            <p className={`font-semibold ${algorithmInfo.color}`}>{algorithmInfo.name}</p>
            <p>{algorithmInfo.description}</p>
            <p className="text-xs text-gray-400 mt-2">{algorithmInfo.complexity}</p>
          </div>
        </div>

        {/* Current Step */}
        {currentStep && (
          <div className="bg-blue-900 border border-blue-700 p-4 rounded-lg">
            <h3 className="text-white font-bold text-sm mb-2">Current Step:</h3>
            <p className="text-blue-200 text-sm">{currentStep}</p>
          </div>
        )}

        {/* Statistics */}
        {(comparisons > 0 || swaps > 0) && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-bold text-lg mb-3">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Comparisons:</span>
                <span className="font-bold text-yellow-400">{comparisons}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Swaps:</span>
                <span className="font-bold text-red-400">{swaps}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Array Size:</span>
                <span className="font-bold text-blue-400">{array.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingVisualizer;