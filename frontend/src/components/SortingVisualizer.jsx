import React, { useState } from 'react';
import { useAnimationEngine } from '../hooks/useAnimationEngine';
import SortingControls from './SortingControls';
import ArrayBars from './ArrayBars';

const API_URL = 'http://localhost:3000/api';

const SortingVisualizer = () => {
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

  const { animate, stop, isAnimating, animationSpeed, setAnimationSpeed } =
    useAnimationEngine();

  // INITIAL RANDOM ARRAY
  const [array, setArray] = useState(() =>
    Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 10)
  );

  // Tracks whether user typed or random
  const [inputMode, setInputMode] = useState('random');

  const resetStates = () => {
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setCurrent(null);
    setPivot(null);
    setCurrentStep('');
    setComparisons(0);
    setSwaps(0);
  };

  // Validate & Set Array
  const validateAndSetArray = (value) => {
    const nums = value
      .split(',')
      .map((num) => parseInt(num.trim(), 10));

    if (nums.some((n) => isNaN(n))) {
      setError('Invalid input! Please enter comma-separated integers only.');
      return;
    }

    setError(null);
    setArray(nums);
    resetStates();
  };

  // Generate new random array
  const generateArray = () => {
    setArray(
      Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 10)
    );
    resetStates();
  };

  const handleManualArraySubmit = (value) => {
    setInputMode('manual');
    validateAndSetArray(value);
  };

  // Algorithm info metadata
  const getAlgorithmInfo = () => {
    const info = {
      bubble: {
        name: 'Bubble Sort',
        description:
          'Repeatedly compares adjacent elements and swaps them if out of order.',
        complexity: 'Time: O(n²) | Space: O(1)',
        color: 'text-blue-400',
      },
      selection: {
        name: 'Selection Sort',
        description:
          'Selects the smallest element and swaps it into sorted position.',
        complexity: 'Time: O(n²) | Space: O(1)',
        color: 'text-green-400',
      },
      insertion: {
        name: 'Insertion Sort',
        description:
          'Builds sorted array by inserting items into the correct position.',
        complexity: 'Time: O(n²) | Space: O(1)',
        color: 'text-orange-400',
      },
      quick: {
        name: 'Quick Sort',
        description:
          'Divide-and-conquer algorithm using partitioning around a pivot.',
        complexity: 'Time: O(n log n) | Space: O(log n)',
        color: 'text-purple-400',
      },
      heap: {
        name: 'Heap Sort',
        description:
          'Builds a max heap and extracts the maximum repeatedly.',
        complexity: 'Time: O(n log n) | Space: O(1)',
        color: 'text-pink-400',
      },
    };

    return info[algorithm];
  };

  // START SORT
  const handleStart = async () => {
    setLoading(true);
    setError(null);
    setCurrentStep('Preparing to sort...');
    resetStates();

    try {
      const response = await fetch(`${API_URL}/sort/${algorithm}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

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
            setCurrentStep(
              `Comparing elements at positions ${step.indices[0]} and ${step.indices[1]}`
            );
            break;

          case 'swap':
            swapCount++;
            setSwaps(swapCount);
            setSwapping(step.indices);
            setArray(step.array);
            setCurrentStep(
              `Swapping elements at positions ${step.indices[0]} and ${step.indices[1]}`
            );
            break;

          case 'shift':
            setSwapping(step.indices);
            setArray(step.array);
            setCurrentStep(
              `Shifting element from position ${step.indices[0]} to ${step.indices[1]}`
            );
            break;

          case 'insert':
            setArray(step.array);
            setCurrentStep(`Inserting element at position ${step.index}`);
            break;

          case 'sorted':
            setSorted((prev) => [...prev, step.index]);
            setCurrentStep(
              `Element at position ${step.index} is in final sorted position`
            );
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
            setCurrentStep(
              `Sorting complete. Total: ${compCount} comparisons, ${swapCount} swaps.`
            );
            break;
        }
      });
    } catch (err) {
      setLoading(false);
      setError(
        `Failed to fetch: ${err.message}. Ensure backend is running on port 3000.`
      );
      setCurrentStep('');
    }
  };

  const algorithmInfo = getAlgorithmInfo();

  return (
    <div className="flex gap-6">
      {/* LEFT SIDE */}
      <div className="flex-1 space-y-6">
        <SortingControls
            algorithm={algorithm}
            onAlgorithmChange={setAlgorithm}
            onGenerate={generateArray}
            onManualArraySubmit={handleManualArraySubmit}
            onStart={handleStart}
            onStop={stop}
            onSpeedChange={setAnimationSpeed}
            inputMode={inputMode}
            setInputMode={setInputMode}
            isAnimating={isAnimating || loading}
            speed={animationSpeed}
        />


        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading && <p className="text-center text-white">Loading...</p>}

        <ArrayBars
          array={array}
          comparing={comparing}
          swapping={swapping}
          sorted={sorted}
          current={current}
          pivot={pivot}
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-80 space-y-4">
        {/* color legend */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-bold text-lg mb-3">Color Legend</h3>

          <div className="space-y-2 text-sm text-gray-300">
            <LegendItem color="bg-blue-500" label="Unsorted Element" />
            <LegendItem color="bg-yellow-500" label="Comparing" />
            <LegendItem color="bg-red-500" label="Swapping" />
            <LegendItem color="bg-orange-500" label="Current" />
            <LegendItem color="bg-purple-500" label="Pivot (Quick Sort)" />
            <LegendItem color="bg-green-500" label="Sorted" />
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-bold text-lg mb-3">Algorithm Info</h3>
          <p className={`font-semibold ${algorithmInfo.color}`}>
            {algorithmInfo.name}
          </p>
          <p className="text-gray-300 text-sm">{algorithmInfo.description}</p>
          <p className="text-xs text-gray-500 mt-2">{algorithmInfo.complexity}</p>
        </div>

        {/* Current step */}
        {currentStep && (
          <div className="bg-blue-900 border border-blue-700 p-4 rounded-lg">
            <h3 className="text-white font-bold text-sm mb-2">Current Step</h3>
            <p className="text-blue-200 text-sm">{currentStep}</p>
          </div>
        )}

        {/* Stats */}
        {(comparisons > 0 || swaps > 0) && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-bold text-lg mb-3">Statistics</h3>

            <StatRow label="Comparisons" value={comparisons} color="text-yellow-400" />
            <StatRow label="Swaps" value={swaps} color="text-red-400" />
            <StatRow label="Array Size" value={array.length} color="text-blue-400" />
          </div>
        )}
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <div className={`w-6 h-6 rounded ${color}`}></div>
    <span>{label}</span>
  </div>
);

const StatRow = ({ label, value, color }) => (
  <div className="flex justify-between text-gray-300 text-sm">
    <span>{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

export default SortingVisualizer;
