const pool = require('./src/config/db');

const products = [
  {
    id: 'prod-15', name: 'Smart Coffee Maker', slug: 'smart-coffee-maker', 
    description: 'Wi-Fi enabled coffee maker. Start your brew from bed using the app.', 
    category_id: 'cat-home', brand: 'BrewTech', image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
    variants: [{ sku: 'CM-SMART-BLK', price: 89.99, compare: 120.00, attrs: '{"color":"Black"}' }]
  },
  {
    id: 'prod-16', name: 'Over-Ear Gaming Headset', slug: 'gaming-headset-rgb', 
    description: 'Immersive 7.1 surround sound with noise-canceling mic and RGB lighting.', 
    category_id: 'cat-headphones', brand: 'PlayGear', image_url: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=800&q=80',
    variants: [{ sku: 'HS-RGB-BLK', price: 79.99, compare: 99.99, attrs: '{"color":"Black"}' }]
  },
  {
    id: 'prod-17', name: 'Vintage Denim Jacket', slug: 'vintage-denim-jacket', 
    description: 'Classic oversized denim jacket, a staple for any campus wardrobe.', 
    category_id: 'cat-fashion', brand: 'RetroFit', image_url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80',
    variants: [{ sku: 'DJ-VINT-M', price: 65.00, compare: 85.00, attrs: '{"color":"Blue","size":"M"}' }]
  },
  {
    id: 'prod-18', name: 'Portable SSD 1TB', slug: 'portable-ssd-1tb', 
    description: 'Ultra-fast NVMe solid state drive for backing up your projects and media.', 
    category_id: 'cat-electronics', brand: 'DataTech', image_url: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
    variants: [{ sku: 'SSD-1TB-GRY', price: 109.99, compare: 130.00, attrs: '{"storage":"1TB"}' }]
  },
  {
    id: 'prod-19', name: 'Artificial Potted Plant', slug: 'artificial-plant-pot', 
    description: 'Zero-maintenance greenery to liven up your dorm room desk or shelf.', 
    category_id: 'cat-home', brand: 'NatureDecor', image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
    variants: [{ sku: 'PLANT-SUCC-01', price: 15.99, compare: 25.00, attrs: '{"type":"Succulent"}' }]
  },
  {
    id: 'prod-20', name: 'Yoga Mat with Alignment Lines', slug: 'yoga-mat-align', 
    description: 'Non-slip eco-friendly TPE yoga mat. Perfect for dorm room workouts.', 
    category_id: 'cat-sports', brand: 'ZenFlex', image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    variants: [{ sku: 'MAT-YOGA-PURP', price: 24.99, compare: 35.00, attrs: '{"color":"Purple"}' }]
  },
  {
    id: 'prod-21', name: 'Organic Cotton Bed Sheets', slug: 'organic-cotton-sheets-twinxl', 
    description: 'Breathable, ultra-soft 400 thread count sheets tailored for Twin XL beds.', 
    category_id: 'cat-home', brand: 'SleepWell', image_url: 'https://images.unsplash.com/photo-1522771731470-8ee0ce8b3353?w=800&q=80',
    variants: [{ sku: 'SHEET-TWINXL-WHT', price: 45.00, compare: 60.00, attrs: '{"color":"White","size":"Twin XL"}' }]
  },
  {
    id: 'prod-22', name: 'Calculus: Early Transcendentals', slug: 'calculus-early-trans', 
    description: 'The required textbook for your freshman math requirement.', 
    category_id: 'cat-books', brand: 'AcademicPress', image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    variants: [{ sku: 'BOOK-CALC-8', price: 120.00, compare: 150.00, attrs: '{"format":"Hardcover"}' }]
  },
  {
    id: 'prod-23', name: 'Wireless Charging Pad', slug: 'wireless-charging-pad', 
    description: 'Fast 15W Qi-certified wireless charger for your phone and earbuds.', 
    category_id: 'cat-electronics', brand: 'Lumina', image_url: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&q=80',
    variants: [{ sku: 'CHG-PAD-WHT', price: 19.99, compare: 30.00, attrs: '{"color":"White"}' }]
  },
  {
    id: 'prod-24', name: 'Canvas Tote Bag', slug: 'canvas-tote-bag', 
    description: 'Heavy-duty 100% cotton canvas tote. Great for groceries or carrying books.', 
    category_id: 'cat-fashion', brand: 'UrbanCarry', image_url: 'https://images.unsplash.com/photo-1597633244018-7065961a9b2b?w=800&q=80',
    variants: [{ sku: 'TOTE-NATURAL', price: 12.99, compare: 18.00, attrs: '{"color":"Natural"}' }]
  },
  {
    id: 'prod-25', name: 'Protein Shaker Bottle', slug: 'protein-shaker-bottle', 
    description: '24oz leak-proof shaker bottle with wire whisk for smooth supplements.', 
    category_id: 'cat-sports', brand: 'FitGear', image_url: 'https://images.unsplash.com/photo-1595348020949-87cdfbbaf617?w=800&q=80',
    variants: [{ sku: 'SHAKER-24-BLK', price: 9.99, compare: 15.00, attrs: '{"color":"Black","size":"24oz"}' }]
  },
  {
    id: 'prod-26', name: 'Noise-Canceling Sleep Earplugs', slug: 'sleep-earplugs-silicone', 
    description: 'Reusable silicone earplugs to block out noisy roommates.', 
    category_id: 'cat-home', brand: 'QuietNight', image_url: 'https://images.unsplash.com/photo-1598331668908-608670eb0641?w=800&q=80',
    variants: [{ sku: 'PLUG-SIL-BLU', price: 14.99, compare: 20.00, attrs: '{"color":"Blue"}' }]
  }
];

async function seed() {
  const conn = await pool.getConnection();
  try {
    for (const p of products) {
      await conn.query(
        'INSERT IGNORE INTO products (id, name, slug, description, category_id, brand, image_url, avg_rating, review_count) VALUES (?, ?, ?, ?, ?, ?, ?, 4.7, 25)',
        [p.id, p.name, p.slug, p.description, p.category_id, p.brand, p.image_url]
      );
      for (const v of p.variants) {
        await conn.query(
          'INSERT IGNORE INTO product_variants (sku, product_id, name, price, compare_price, attributes) VALUES (?, ?, ?, ?, ?, ?)',
          [v.sku, p.id, p.name, v.price, v.compare, v.attrs]
        );
        await conn.query(
          'INSERT IGNORE INTO inventory (sku, stock, reserved) VALUES (?, 150, 0)',
          [v.sku]
        );
      }
    }
    console.log('Seeded 12 MORE diverse products successfully!');
  } finally {
    conn.release();
    pool.end();
  }
}

seed();
