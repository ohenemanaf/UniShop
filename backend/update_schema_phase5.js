const mysql = require('mysql2/promise');

async function run() {
  try {
    const db = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', multipleStatements: true });
    await db.query('USE ecommerce');

    // Create seller_applications table
    const createAppsSQL = `
      CREATE TABLE IF NOT EXISTS seller_applications (
        id          INT          NOT NULL AUTO_INCREMENT,
        user_id     CHAR(36)     NOT NULL,
        store_name  VARCHAR(255) NOT NULL,
        description TEXT         NULL,
        category    VARCHAR(100) NULL,
        phone       VARCHAR(50)  NULL,
        status      ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
        admin_note  TEXT         NULL,
        reviewed_by CHAR(36)     NULL,
        reviewed_at DATETIME     NULL,
        created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_seller_apps_user (user_id),
        INDEX idx_seller_apps_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await db.query(createAppsSQL);
    console.log('Created seller_applications table.');

    await db.end();
    console.log('Schema phase 5 updated successfully!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
