import express from 'express';
import cors from 'cors';
import pool from './db.js';
import { bubbleSort, selectionSort, insertionSort, quickSort, heapSort } from './algorithms/sorting.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==================== HELPER FUNCTIONS ====================

const saveToHistory = async (algorithm, inputArray, comparisons, swaps) => {
  try {
    const [result] = await pool.execute(
      `INSERT INTO sort_history (algorithm, input_array, array_size, comparisons, swaps) 
       VALUES (?, ?, ?, ?, ?)`,
      [algorithm, JSON.stringify(inputArray), inputArray.length, comparisons, swaps]
    );
    console.log(`✅ Saved to history - ID: ${result.insertId}`);
    return result.insertId;
  } catch (error) {
    console.error('❌ Database error:', error.message);
    return null;
  }
};

// Count operations (handles both swap and shift)
const countOperations = (steps) => {
  return {
    comparisons: steps.filter(s => s.type === 'compare').length,
    swaps: steps.filter(s => s.type === 'swap' || s.type === 'shift').length
  };
};

// ==================== GENERIC SORT HANDLER ====================

const sortAlgorithms = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  quick: quickSort,
  heap: heapSort
};

app.post('/api/sort/:algorithm', async (req, res) => {
  const { algorithm } = req.params;
  const { array } = req.body;
  
  // Check if algorithm exists
  if (!sortAlgorithms[algorithm]) {
    return res.status(400).json({ error: 'Invalid algorithm' });
  }
  
  const startTime = Date.now();
  const steps = sortAlgorithms[algorithm](array);
  const executionTime = Date.now() - startTime;
  
  const { comparisons, swaps } = countOperations(steps);
  const historyId = await saveToHistory(algorithm, array, comparisons, swaps);
  
  res.json({ steps, historyId, comparisons, swaps });
});

// ==================== GET HISTORY ====================

app.get('/api/history', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM sort_history ORDER BY created_at DESC LIMIT 10`
    );
    
    const history = rows.map(row => ({
      ...row,
      input_array: JSON.parse(row.input_array)
    }));
    
    res.json({ history });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});