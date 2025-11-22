import React from 'react';

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

export default Navbar;