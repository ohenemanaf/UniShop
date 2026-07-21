/**
 * File: dbInit.js
 * Description: Auto-generated documentation for dbInit.js
 * Date: 2026-07-21
 */
const fs = require('fs');
const path = require('path');
const pool = require('./db');
/**
 * Function initDatabase
 * @returns {any}
 */
async function initDatabase() {
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  // Remove single-line comments
  const noComments = sql.replace(/--.*$/gm, '');
  const statements = noComments.split(';').map(s => s.trim()).filter(s => s.length > 0);
  const conn = await pool.getConnection();
  try {
    for (const stmt of statements) {
      await conn.query(stmt);
    }
    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Database init error:', err.message);
    throw err;
  } finally {
    conn.release();
    await pool.end();
  }
}
initDatabase();