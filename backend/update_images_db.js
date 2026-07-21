const pool = require('./src/config/db');

const imageMap = {
  'prod-1': 'http://localhost:5173/images/products/macbook_pro.png',
  'prod-2': 'http://localhost:5173/images/products/sony_headphones.png',
  'prod-3': 'http://localhost:5173/images/products/keychron_keyboard.png',
  'prod-4': 'http://localhost:5173/images/products/iphone_15.png',
  'prod-5': 'http://localhost:5173/images/products/nike_shoes.png',
  'prod-6': 'http://localhost:5173/images/products/oled_tv.png',
  'prod-15': 'http://localhost:5173/images/products/smart_coffee_maker.png',
  'prod-17': 'http://localhost:5173/images/products/denim_jacket.png'
};

async function updateImages() {
  const conn = await pool.getConnection();
  try {
    for (const [id, url] of Object.entries(imageMap)) {
      await conn.query('UPDATE products SET image_url = ? WHERE id = ?', [url, id]);
      console.log(`Updated image for ${id}`);
    }
    
    // Update all others to a nicer generic placeholder instead of ugly gray
    const fallbackUrl = 'https://placehold.co/800x800/FAFAFA/333333.png?text=Product+Image';
    await conn.query('UPDATE products SET image_url = ? WHERE id NOT IN (?)', [fallbackUrl, Object.keys(imageMap)]);
    console.log('Updated remaining products to clear placeholder.');

    console.log('All done!');
  } catch (err) {
    console.error(err);
  } finally {
    conn.release();
    pool.end();
  }
}

updateImages();
