const mysql = require('mysql2/promise');

async function fix() {
  const db = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'ecommerce' });
  
  try {
    await db.query(`
      ALTER TABLE order_items
      ADD COLUMN seller_id CHAR(36) NULL AFTER order_id,
      ADD COLUMN fulfillment_status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING' AFTER image_url,
      ADD INDEX idx_order_items_seller (seller_id);
    `);
    console.log('Successfully added seller_id and fulfillment_status to order_items!');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Columns already exist.');
    } else {
      console.error('Error:', err);
    }
  }

  await db.end();
}

fix().catch(console.error);
