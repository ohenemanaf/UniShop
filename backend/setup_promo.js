const db = require('./src/config/db');

async function run() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        code VARCHAR(50) NOT NULL,
        discount_percentage DECIMAL(5,2) NOT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    await db.query(`
      INSERT IGNORE INTO promo_codes (code, discount_percentage)
      VALUES 
        ('WELCOME10', 10.00),
        ('HALFOFF', 50.00),
        ('SAVE20', 20.00);
    `);
    
    console.log('Promo codes created and seeded');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

run();
