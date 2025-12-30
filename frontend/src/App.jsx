  import React from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import LandingPage from './pages/LandingPage';
  import HomePage from './pages/HomePage';
  import HistoryPage from './pages/HistoryPage';

  const App = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/visualizer" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Router>
    );
  };

  export default App;