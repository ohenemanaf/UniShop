const bcrypt = require('bcryptjs');
const pool = require('./src/config/db');

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password || password.length < 16) throw new Error('Set ADMIN_EMAIL and a unique ADMIN_PASSWORD of at least 16 characters');
    
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Existing account preserved; use the password reset flow to change credentials.');
    } else {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO users (id, name, email, password_hash, role) VALUES (UUID(), ?, ?, ?, "admin")',
        ['Admin User', email, hash]
      );
      console.log('Admin user created successfully.');
    }
  } catch (err) {
    console.error('Admin setup failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

createAdmin();
