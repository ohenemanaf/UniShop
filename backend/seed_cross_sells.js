const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function seedCrossSells() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce',
  };

  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Clearing existing product_cross_sells...');
    await connection.query('TRUNCATE TABLE product_cross_sells');

    console.log('Fetching products...');
    const [products] = await connection.query('SELECT id, category_id FROM products WHERE is_active = 1');

    console.log(`Found ${products.length} products. Generating cross-sells...`);
    let insertCount = 0;

    for (const product of products) {
      if (!product.category_id) continue;

      // Find other products in the same category, excluding itself
      const [related] = await connection.query(`
        SELECT id FROM products 
        WHERE category_id = ? AND id != ? AND is_active = 1
        ORDER BY RAND() 
        LIMIT 3
      `, [product.category_id, product.id]);

      for (const rel of related) {
        await connection.query(
          'INSERT IGNORE INTO product_cross_sells (product_id, related_product_id, type) VALUES (?, ?, ?)',
          [product.id, rel.id, 'CROSS_SELL']
        );
        insertCount++;
      }
    }

    console.log(`Successfully generated ${insertCount} cross-sells!`);
  } catch (error) {
    console.error('Error seeding cross-sells:', error);
  } finally {
    await connection.end();
  }
}

seedCrossSells();
