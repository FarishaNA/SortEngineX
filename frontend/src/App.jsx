import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SortingVisualizer from './components/SortingVisualizer';
import PathfindingVisualizer from './components/PathfindingVisualizer';

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