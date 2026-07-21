const fs = require('fs');
const https = require('https');
const path = require('path');
const pool = require('./src/config/db');

const imagesDir = path.join(__dirname, '../frontend/public/images/products');

// Create directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const products = {
  'prod-1': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
  'prod-2': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
  'prod-3': 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
  'prod-4': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
  'prod-5': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  'prod-6': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80',
  'prod-7': 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80',
  'prod-8': 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
  'prod-9': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
  'prod-10': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
  'prod-11': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
  'prod-12': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
  'prod-13': 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800&q=80',
  'prod-14': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  'prod-15': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
  'prod-16': 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=800&q=80',
  'prod-17': 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80',
  'prod-18': 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
  'prod-19': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
  'prod-20': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
  'prod-21': 'https://images.unsplash.com/photo-1522771731470-8ee0ce8b3353?w=800&q=80',
  'prod-22': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
  'prod-23': 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&q=80',
  'prod-24': 'https://images.unsplash.com/photo-1597633244018-7065961a9b2b?w=800&q=80',
  'prod-25': 'https://images.unsplash.com/photo-1595348020949-87cdfbbaf617?w=800&q=80',
  'prod-26': 'https://images.unsplash.com/photo-1598331668908-608670eb0641?w=800&q=80'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }).on('error', (err) => {
          fs.unlink(dest, () => reject(err));
        });
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  const conn = await pool.getConnection();
  try {
    for (const [id, url] of Object.entries(products)) {
      const destPath = path.join(imagesDir, `${id}.jpg`);
      console.log(`Downloading ${id}.jpg...`);
      await download(url, destPath);
      
      const localUrl = `/images/products/${id}.jpg`;
      await conn.query('UPDATE products SET image_url = ? WHERE id = ?', [localUrl, id]);
      console.log(`Updated DB for ${id} -> ${localUrl}`);
    }
    console.log('All images downloaded and database updated successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    conn.release();
    pool.end();
  }
}

run();
