const mysql = require('mysql2/promise');

async function createDb() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });

    console.log('Connected to MySQL. Creating database...');
    await connection.query('CREATE DATABASE IF NOT EXISTS `ecommerce`;');
    console.log('Database ecommerce created or already exists.');
    
    await connection.end();
  } catch (err) {
    console.error('Error creating database:', err.message);
    process.exit(1);
  }
}

createDb();
