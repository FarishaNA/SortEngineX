  import React, { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';

  const HistoryPage = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
      fetch('http://localhost:3000/api/history')
        .then(res => res.json())
        .then(data => setHistory(data.history));
    }, []);

    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/visualizer"
              className="px-4 py-1.5 text-sm bg-gray-700 rounded hover:bg-gray-600 transition"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-semibold text-white">
              Sort History
            </h1>
          </div>

          {/* Content */}
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No sorting history available.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800 rounded-lg p-2 border border-gray-700"
                >
                <span className="text-blue-400 font-medium capitalize whitespace-nowrap">
                {item.algorithm} Sort
                </span>
                <div className="flex items-center gap-6 flex-nowrap overflow-x-auto">
                  {/* make the array not take the full width of that card and others to be displayed on the same line as array*/}
                  <span className="whitespace-nowrap text-sm font-mono w-1/2 p-2 bg-gray-900 rounded">
                    [{item.input_array.join(', ')}]
                  </span>

                  <span className="whitespace-nowrap text-sm">
                    <span className="text-gray-400">Comparisons:</span>{' '}
                    <span className="text-yellow-400 font-semibold">
                      {item.comparisons}
                    </span>
                  </span>

                  <span className="whitespace-nowrap text-sm">
                    <span className="text-gray-400">Swaps:</span>{' '}
                    <span className="text-red-400 font-semibold">
                      {item.swaps}
                    </span>
                  </span>

                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    #{item.id}
                  </span>
                </div>
              </div>

              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  export default HistoryPage;