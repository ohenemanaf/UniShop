const pool = require('./src/config/db');

const products = [
  {
    id: 'prod-7', name: 'Mini Fridge 3.2 Cu Ft', slug: 'mini-fridge-3-2', 
    description: 'Perfect for dorm rooms. Keeps beverages and snacks perfectly chilled.', 
    category_id: 'cat-home', brand: 'CoolLife', image_url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80',
    variants: [{ sku: 'FRIDGE-32-BLK', price: 129.99, compare: 150.00, attrs: '{"color":"Black"}' }]
  },
  {
    id: 'prod-8', name: 'Memory Foam Mattress Topper', slug: 'memory-foam-topper', 
    description: '3-inch cooling gel memory foam for your dorm twin XL bed.', 
    category_id: 'cat-home', brand: 'SleepWell', image_url: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
    variants: [{ sku: 'TOPPER-TWIN-XL', price: 59.99, compare: 80.00, attrs: '{"size":"Twin XL"}' }]
  },
  {
    id: 'prod-9', name: 'Introduction to Algorithms, 4th Edition', slug: 'intro-to-algorithms-4', 
    description: 'The standard textbook on algorithms used in universities worldwide.', 
    category_id: 'cat-books', brand: 'MIT Press', image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
    variants: [{ sku: 'BOOK-ALGO-4', price: 85.00, compare: 110.00, attrs: '{"format":"Hardcover"}' }]
  },
  {
    id: 'prod-10', name: 'LED Desk Lamp with USB', slug: 'led-desk-lamp-usb', 
    description: 'Dimmable eye-caring desk lamp with fast USB charging port.', 
    category_id: 'cat-electronics', brand: 'Lumina', image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    variants: [{ sku: 'LAMP-USB-WHT', price: 29.99, compare: 45.00, attrs: '{"color":"White"}' }]
  },
  {
    id: 'prod-11', name: 'College Hoodie Heavyweight', slug: 'college-hoodie-hw', 
    description: 'Ultra-soft fleece hoodie, perfect for chilly lecture halls.', 
    category_id: 'cat-fashion', brand: 'CampusWear', image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    variants: [{ sku: 'HOODIE-GRY-L', price: 39.99, compare: 55.00, attrs: '{"color":"Grey","size":"L"}' }]
  },
  {
    id: 'prod-12', name: 'Wireless Ergonomic Mouse', slug: 'wireless-ergo-mouse', 
    description: 'Reduce wrist strain during those long study sessions.', 
    category_id: 'cat-electronics', brand: 'LogiTech', image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    variants: [{ sku: 'MOUSE-ERGO-BLK', price: 49.99, compare: 60.00, attrs: '{"color":"Black"}' }]
  },
  {
    id: 'prod-13', name: 'Noise-Isolating Earbuds', slug: 'noise-iso-earbuds', 
    description: 'Compact wired earbuds perfect for library study sessions.', 
    category_id: 'cat-headphones', brand: 'AudioPro', image_url: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800&q=80',
    variants: [{ sku: 'EARBUD-WHT', price: 19.99, compare: 25.00, attrs: '{"color":"White"}' }]
  },
  {
    id: 'prod-14', name: 'Minimalist Backpack', slug: 'minimalist-backpack', 
    description: 'Water-resistant campus backpack with a 15" laptop sleeve.', 
    category_id: 'cat-fashion', brand: 'UrbanCarry', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    variants: [{ sku: 'BAG-MINI-NVY', price: 65.00, compare: 85.00, attrs: '{"color":"Navy"}' }]
  }
];

async function seed() {
  const conn = await pool.getConnection();
  try {
    for (const p of products) {
      await conn.query(
        'INSERT IGNORE INTO products (id, name, slug, description, category_id, brand, image_url, avg_rating, review_count) VALUES (?, ?, ?, ?, ?, ?, ?, 4.5, 10)',
        [p.id, p.name, p.slug, p.description, p.category_id, p.brand, p.image_url]
      );
      for (const v of p.variants) {
        await conn.query(
          'INSERT IGNORE INTO product_variants (sku, product_id, name, price, compare_price, attributes) VALUES (?, ?, ?, ?, ?, ?)',
          [v.sku, p.id, p.name, v.price, v.compare, v.attrs]
        );
        await conn.query(
          'INSERT IGNORE INTO inventory (sku, stock, reserved) VALUES (?, 100, 0)',
          [v.sku]
        );
      }
    }
    console.log('Seeded more products successfully!');
  } finally {
    conn.release();
    pool.end();
  }
}

seed();
