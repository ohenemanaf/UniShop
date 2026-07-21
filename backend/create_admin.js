const bcrypt = require('bcryptjs');
const pool = require('./src/config/db');

async function createAdmin() {
  try {
    const email = 'admin@nexstore.com';
    const password = 'Admin@123';
    
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET role = "admin", password_hash = ? WHERE email = ?', [hash, email]);
      console.log('Admin user password and role updated.');
    } else {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO users (id, name, email, password_hash, role) VALUES (UUID(), ?, ?, ?, "admin")',
        ['Admin User', email, hash]
      );
      console.log('Admin user created successfully.');
    }
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    process.exit(0);
  }
}

createAdmin();
