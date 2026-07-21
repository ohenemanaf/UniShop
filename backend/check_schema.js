const db = require('./src/config/db');

async function run() {
  try {
    const [tables] = await db.query('SHOW TABLES');
    console.log("TABLES:");
    console.log(tables);
    
    const [cols] = await db.query('DESCRIBE products');
    console.log("\nPRODUCTS SCHEMA:");
    console.log(cols);

    const [uCols] = await db.query('DESCRIBE users');
    console.log("\nUSERS SCHEMA:");
    console.log(uCols);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
