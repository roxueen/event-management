var mysql = require('mysql2');
require('dotenv').config();

// Crearea unui pool de conexiuni la MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // Limita de conexiuni simultane
  queueLimit: 0
});

// Testare conexiune
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Eroare la conectare:' + err.stack);
    return;
  }
  console.log('✅ Conectat la MySQL!');
  connection.release(); // eliberăm conexiunea pentru a o reutiliza
});

module.exports = pool;
