const pool = require('./src/config/db');
const http = require('http');
const https = require('https');

function checkImage(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function fix() {
  const conn = await pool.getConnection();
  try {
    const [products] = await conn.query('SELECT id, image_url, name FROM products');
    let fallbackCounter = 1;
    
    for (const p of products) {
      const isValid = await checkImage(p.image_url);
      if (!isValid) {
        console.log(`❌ Broken image found for: ${p.name}`);
        // Create a reliable fallback image using placehold.co with the product's name
        const encodedName = encodeURIComponent(p.name);
        // Using an abstract unsplash placeholder with a random seed
        const fallbackUrl = `https://placehold.co/800x800/e2e8f0/475569.png?text=${encodedName}`;
        
        await conn.query('UPDATE products SET image_url = ? WHERE id = ?', [fallbackUrl, p.id]);
        console.log(`✅ Fixed: ${p.name} -> ${fallbackUrl}`);
        fallbackCounter++;
      } else {
        console.log(`✅ Image OK: ${p.name}`);
      }
    }
    console.log('Done checking images!');
  } finally {
    conn.release();
    pool.end();
  }
}

fix();
