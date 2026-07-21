const mysql = require('mysql2/promise');

async function run() {
  try {
    const db = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', multipleStatements: true });
    await db.query('USE ecommerce');
    
    // Create payouts table
    const createPayoutsSQL = `
      CREATE TABLE IF NOT EXISTS payouts (
        id           INT          NOT NULL AUTO_INCREMENT,
        seller_id    CHAR(36)     NOT NULL,
        amount       DECIMAL(10, 2) NOT NULL,
        status       ENUM('PENDING', 'PROCESSED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
        bank_details TEXT         NOT NULL,
        processed_at DATETIME     NULL,
        created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_payouts_seller (seller_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await db.query(createPayoutsSQL);
    console.log('Created payouts table.');

    // Create banners table
    const createBannersSQL = `
      CREATE TABLE IF NOT EXISTS banners (
        id         INT          NOT NULL AUTO_INCREMENT,
        title      VARCHAR(255) NULL,
        subtitle   VARCHAR(255) NULL,
        image_url  VARCHAR(255) NOT NULL,
        link_url   VARCHAR(255) NULL,
        is_active  BOOLEAN      NOT NULL DEFAULT 1,
        position   VARCHAR(50)  NOT NULL DEFAULT 'hero',
        created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_banners_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await db.query(createBannersSQL);
    console.log('Created banners table.');

    await db.end();
    console.log('Phase 4 schema updated successfully!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
