import Navbar from './components/Navbar';
import SortingVisualizer from './components/SortingVisualizer';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto p-8">
        <SortingVisualizer />
      </div>
    </div>
  );
}
