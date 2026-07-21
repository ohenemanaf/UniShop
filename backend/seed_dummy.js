const db = require('./src/config/db');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

async function seed() {
  try {
    console.log('Starting seed process...');
    
    // Get an admin user to act as the seller
    const [users] = await db.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    if (users.length === 0) {
      console.log('No admin user found to act as seller.');
      process.exit(1);
    }
    const sellerId = users[0].id;
    console.log(`Using seller ID: ${sellerId}`);

    // Category mappings
    const categoryMapping = {
      'cat-beauty': ['beauty', 'fragrances', 'skin-care'],
      'cat-electronics': ['smartphones', 'laptops', 'tablets', 'mobile-accessories'],
      'cat-fashion': ['womens-dresses', 'mens-shirts', 'womens-shoes', 'mens-shoes', 'mens-watches', 'womens-watches'],
      'cat-home': ['furniture', 'home-decoration', 'kitchen-accessories'],
      'cat-sports': ['sports-accessories']
    };

    console.log('Fetching products from DummyJSON...');
    const dummyRes = await axios.get('https://dummyjson.com/products?limit=200');
    const dummyProducts = dummyRes.data.products;
    
    let insertedCount = 0;

    for (const [categoryId, dummyCategories] of Object.entries(categoryMapping)) {
      // Find up to 10 products that match the dummy categories
      const categoryProducts = dummyProducts.filter(p => dummyCategories.includes(p.category)).slice(0, 10);
      
      console.log(`Inserting ${categoryProducts.length} products for category ${categoryId}...`);
      
      for (const dp of categoryProducts) {
        const productId = uuidv4();
        // Assume DummyJSON price is USD, convert to roughly reasonable GHS (e.g. * 15)
        const price = dp.price * 15;
        const comparePrice = dp.discountPercentage ? (price / (1 - dp.discountPercentage / 100)) : null;

        const slug = dp.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + uuidv4().substring(0, 4);

        await db.query(`
          INSERT INTO products (id, seller_id, category_id, name, slug, description, image_url, avg_rating, review_count)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [productId, sellerId, categoryId, dp.title, slug, dp.description, dp.images?.[0] || dp.thumbnail || null, dp.rating || 0, dp.reviews?.length || 0]);

        const sku = dp.sku || uuidv4().substring(0, 8).toUpperCase();
        
        await db.query(`
          INSERT INTO product_variants (sku, product_id, name, price, compare_price, image_url)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [sku, productId, 'Default', price, comparePrice, dp.images?.[0] || dp.thumbnail || null]);

        await db.query(`
          INSERT INTO inventory (sku, stock)
          VALUES (?, ?)
        `, [sku, dp.stock || 50]);
        
        insertedCount++;
      }
    }

    // Now insert hardcoded books
    console.log('Inserting books...');
    const books = [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 150, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop' },
      { title: '1984', author: 'George Orwell', price: 180, image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop' },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 165, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop' },
      { title: 'Sapiens', author: 'Yuval Noah Harari', price: 250, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop' },
      { title: 'Atomic Habits', author: 'James Clear', price: 210, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop' }
    ];

    for (const b of books) {
      const productId = uuidv4();
      const slug = b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + uuidv4().substring(0, 4);

      await db.query(`
        INSERT INTO products (id, seller_id, category_id, name, slug, description, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [productId, sellerId, 'cat-books', b.title, slug, `A classic book by ${b.author}`, b.image]);

      const sku = uuidv4().substring(0, 8).toUpperCase();
      await db.query(`
        INSERT INTO product_variants (sku, product_id, name, price, compare_price, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [sku, productId, 'Default', b.price, b.price * 1.2, b.image]);

      await db.query(`
        INSERT INTO inventory (sku, stock)
        VALUES (?, ?)
      `, [sku, 100]);
      
      insertedCount++;
    }

    console.log(`Successfully seeded ${insertedCount} products!`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
