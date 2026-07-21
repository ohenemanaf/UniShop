const mysql = require('mysql2/promise');

async function run() {
  try {
    const db = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', multipleStatements: true });
    await db.query('USE ecommerce');
    
    // Create curated_edits table
    const createCuratedEditsSQL = `
      CREATE TABLE IF NOT EXISTS curated_edits (
        id          INT          NOT NULL AUTO_INCREMENT,
        title       VARCHAR(255) NOT NULL,
        subtitle    VARCHAR(255) NULL,
        price       VARCHAR(50)  NULL,
        item_count  VARCHAR(50)  NULL,
        image_url   VARCHAR(500) NOT NULL,
        link_url    VARCHAR(500) NULL,
        size        ENUM('LARGE', 'SMALL') NOT NULL DEFAULT 'SMALL',
        is_active   BOOLEAN      NOT NULL DEFAULT 1,
        created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await db.query(createCuratedEditsSQL);
    console.log('Created curated_edits table.');

    // Seed some initial data
    const seedEditsSQL = `
      INSERT IGNORE INTO curated_edits (id, title, subtitle, price, item_count, image_url, link_url, size, is_active) VALUES 
      (1, 'The Freshman Starter Kit', 'Everything you need for day one. Bedding, lighting, and basic storage essentials bundled to save you time.', '$149', '', '/images/freshman_bundle.png', '/products?search=bundle', 'LARGE', 1),
      (2, 'Study Focus Bundle', '', '$89', '3 items', '/images/study_focus.png', '/products?search=study', 'SMALL', 1),
      (3, 'Cozy Corner', '', '$110', '4 items', '/images/cozy_corner.png', '/products?search=cozy', 'SMALL', 1);
    `;
    await db.query(seedEditsSQL);
    console.log('Seeded curated_edits with initial data.');

    await db.end();
    console.log('Schema updated successfully!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
