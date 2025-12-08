import express from 'express';
import cors from 'cors';
import { bubbleSort, selectionSort, insertionSort, quickSort, heapSort } from './algorithms/sorting.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Sorting endpoints
app.post('/api/sort/bubble', (req, res) => {
  const { array } = req.body;
  const steps = bubbleSort(array);
  res.json({ steps });
});

app.post('/api/sort/selection', (req, res) => {
  const { array } = req.body;
  const steps = selectionSort(array);
  res.json({ steps });
});

app.post('/api/sort/insertion', (req, res) => {
  const { array } = req.body;
  const steps = insertionSort(array);
  res.json({ steps });
});

app.post('/api/sort/quick', (req, res) => {
  const { array } = req.body;
  const steps = quickSort(array);
  res.json({ steps });
});

app.post('/api/sort/heap', (req, res) => {
  const { array } = req.body;
  const steps = heapSort(array);
  res.json({ steps });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Algorithm Visualizer API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});