const mysql = require('mysql2/promise');
const fs = require('fs');

async function run() {
  try {
    const db = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', multipleStatements: true });
    await db.query('USE ecommerce');
    
    // Add columns to order_items (ignore if already exists)
    try {
      await db.query('ALTER TABLE order_items ADD COLUMN tracking_number VARCHAR(100) NULL, ADD COLUMN carrier VARCHAR(100) NULL;');
      console.log('Added tracking columns to order_items.');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('Tracking columns already exist, skipping.');
      } else {
        throw err;
      }
    }

    // Create support_tickets table
    const createTicketsSQL = `
      CREATE TABLE IF NOT EXISTS support_tickets (
        id          INT          NOT NULL AUTO_INCREMENT,
        user_id     CHAR(36)     NOT NULL,
        subject     VARCHAR(255) NOT NULL,
        message     TEXT         NOT NULL,
        status      ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',
        admin_reply TEXT         NULL,
        created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_tickets_user (user_id),
        INDEX idx_tickets_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await db.query(createTicketsSQL);
    console.log('Created support_tickets table.');

    // Create product_cross_sells table
    const createCrossSellsSQL = `
      CREATE TABLE IF NOT EXISTS product_cross_sells (
        id                 INT          NOT NULL AUTO_INCREMENT,
        product_id         CHAR(36)     NOT NULL,
        related_product_id CHAR(36)     NOT NULL,
        type               ENUM('UPSELL', 'CROSS_SELL') NOT NULL DEFAULT 'CROSS_SELL',
        created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (related_product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY idx_cross_sells_unique (product_id, related_product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await db.query(createCrossSellsSQL);
    console.log('Created product_cross_sells table.');

    await db.end();
    console.log('Schema updated successfully!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
