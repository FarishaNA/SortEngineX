  import React from 'react';
  import { Link } from 'react-router-dom';
  import { Clock } from 'lucide-react';
  import SortingVisualizer from '../components/SortingVisualizer';
  import logo from '../assets/logo.png';

  const HomePage = () => {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Navbar */}
        <nav className="flex items-center gap-3 p-4 bg-gray-800">
          <img 
            src={logo} 
            alt="logo" 
            className="w-12 h-12 object-contain select-none"
          />
          <h1 className="text-white text-lg font-semibold">SortEngineX</h1>
          <div className="ml-auto flex items-center gap-4 mb-6">
            <Link
              to="/"
              className="px-4 py-1.5 text-sm bg-gray-500 rounded hover:bg-gray-600 transition"
            >
              ← Back
            </Link>
            <Link to="/history" className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            <Clock size={18} />
              View History
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto p-8">
          <SortingVisualizer />
        </div>
      </div>
    );
  };

  export default HomePage;