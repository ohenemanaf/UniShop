const db = require('./src/config/db');

async function migrate() {
  try {
    // Check if seller_id exists on products
    const [cols] = await db.query("SHOW COLUMNS FROM products LIKE 'seller_id'");
    if (cols.length === 0) {
      await db.query("ALTER TABLE products ADD COLUMN seller_id CHAR(36) NULL");
      await db.query("ALTER TABLE products ADD CONSTRAINT fk_prod_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE");
      console.log('seller_id added to products');
    } else {
      console.log('seller_id already exists');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
