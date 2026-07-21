const mysql = require('mysql2/promise');

async function fix() {
  const db = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'ecommerce' });
  await db.query("ALTER TABLE users MODIFY COLUMN role ENUM('customer', 'seller', 'admin') NOT NULL DEFAULT 'customer'");
  await db.query("UPDATE users SET role = 'seller' WHERE role = ''");
  console.log('Schema updated and user roles fixed!');
  await db.end();
}

fix().catch(console.error);
