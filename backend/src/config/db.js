/**
 * File: db.js
 * Description: Auto-generated documentation for db.js
 * Date: 2026-07-21
 */
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'ecommerce',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: '+00:00',
  charset: 'utf8mb4'
});

// Test connection on startup
pool.getConnection().then(conn => {
  console.log('✅ MySQL connected successfully');
  conn.release();
}).catch(err => {
  console.error('❌ MySQL connection failed:', err.message);
  process.exit(1);
});
module.exports = pool;