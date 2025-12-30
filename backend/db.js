import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // ← XAMPP default is empty password
  database: 'sort_engine',
  port: 3306
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
  });

export default pool;