import React from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

const SortingControls = ({ 
  onAlgorithmChange, 
  onGenerate, 
  onStart, 
  onStop, 
  onSpeedChange, 
  setInputMode,
  inputMode,
  onManualArraySubmit,
  isAnimating, 
  speed, 
  algorithm 
}) => {
  const [tempInput, setTempInput] = React.useState('');

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-4">
      
      {/* MODE SWITCH + INPUT + SELECT + BUTTONS */}
      <div className="flex flex-wrap gap-4 items-center">

        {/* MODE BUTTONS */}
        <div className="inline-flex bg-gray-700 rounded-full p-1">
          <button
            onClick={() => setInputMode("random")}
            disabled={isAnimating}
            className={`px-3 py-1 text-xs rounded-full transition
              ${inputMode === "random" ? "bg-blue-600 text-white" : "text-gray-300"}
              disabled:opacity-50`}
          >
            Auto-Generate
          </button>
          <button
            onClick={() => setInputMode("manual")}
            disabled={isAnimating}
            className={`px-3 py-1 text-xs rounded-full transition
              ${inputMode === "manual" ? "bg-blue-600 text-white" : "text-gray-300"}
              disabled:opacity-50`}
          >
            Custom Input
          </button>
        </div>

        {/* MANUAL INPUT FIELD */}
        {inputMode === "manual" && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter numbers (e.g. 10, 5, 22)"
              disabled={isAnimating}
              onChange={(e) => setTempInput(e.target.value)}
              className="px-3 py-2 bg-gray-700 text-white rounded w-64 placeholder-gray-400"
            />

            <button
              onClick={() => onManualArraySubmit(tempInput)}
              disabled={isAnimating}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Set Array
            </button>
          </div>
        )}


        {/* ALGORITHM DROPDOWN */}
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

        {/* GENERATE RANDOM ARRAY */}
        {inputMode === "random" && (
        <button
          onClick={onGenerate}
          disabled={isAnimating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Generate
        </button>
        )}

        {/* START / STOP BUTTON */}
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

      {/* SPEED SLIDER */}
      <div className="flex items-center gap-4">
        <Zap size={20} className="text-yellow-500" />
        <input
          type="range"
          min="100"
          max="2000"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-white w-20">{speed}ms</span>
      </div>
    </div>
  );
};

export default SortingControls;
