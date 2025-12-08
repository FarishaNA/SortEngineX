import React from 'react';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="flex items-center gap-3 p-4 bg-gray-800">
      <img 
        src={logo} 
        alt="logo" 
        className="w-12 h-12 object-contain select-none"
      />
      <h1 className="text-white text-lg font-semibold">SortEngineX</h1>
    </nav>
  );
};

export default Navbar;