import React from "react";
import { Link } from "react-router-dom";

const Item = ({ title, text }) => (
  <div className="border-l-4 border-blue-600 pl-4">
    <h3 className="text-white">{title}</h3>
    <p className="text-sm text-gray-400">{text}</p>
  </div>
);

const LandingPage = () => (
  <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center">
    <div className="max-w-4xl mx-auto px-8 space-y-10">

      <div>
        <h1 className="text-5xl text-white font-semibold mb-4">
          Algorithm Visualizer
        </h1>
        <p className="max-w-2xl text-gray-400">
          Interactive visualization of sorting algorithms using
          custom or randomly generated input arrays.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <Item title="Sorting Algorithms" text="Bubble, Selection, Insertion, Quick and Heap Sort" />
        <Item title="User Interaction" text="Step-by-step animation with speed control" />
        <Item title="Input Methods" text="Custom input or random array generation" />
        <Item title="Execution History" text="Stored with metrics using Node.js and MySQL" />
      </div>

      <div className="flex gap-6">
        <Link to="/visualizer" className="px-7 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Open Visualizer
        </Link>
        <Link to="/history" className="px-7 py-3 border border-gray-600 rounded hover:bg-gray-800">
          View History
        </Link>
      </div>

    </div>
  </div>
);

export default LandingPage;
