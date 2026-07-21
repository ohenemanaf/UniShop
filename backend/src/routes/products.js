/**
 * File: products.js
 * Description: Auto-generated documentation for products.js
 * Date: 2026-07-21
 */
const express = require('express');
const db = require('../config/db');
const {
  asyncHandler
} = require('../middleware/errorHandler');
const router = express.Router();

// ── GET /api/v1/products ──────────────────────────────────────────────────
// Supports: ?search=, ?category=, ?brand=, ?minPrice=, ?maxPrice=, ?page=, ?limit=, ?sort=
router.get('/', asyncHandler(async (req, res) => {
  const {
    search = '',
    category = '',
    brand = '',
    minPrice = 0,
    maxPrice = 999999,
    page = 1,
    limit = 12,
    sort = 'newest',
    ids = '',
    // comma separated uuids
    color = '',
    // advanced filter
    size = '',
    // advanced filter
    seller_id = '' // new filter
  } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let whereClause = 'WHERE p.is_active = 1';
  const params = [];
  if (ids) {
    const idArray = ids.split(',').map(i => i.trim()).filter(Boolean);
    if (idArray.length > 0) {
      whereClause += ` AND p.id IN (${idArray.map(() => '?').join(',')})`;
      params.push(...idArray);
    }
  }
  if (search) {
    const searchTerms = search.trim().split(/\s+/);
    if (searchTerms.length > 0) {
      // Smart Search: Typo-tolerance using Phonetic SOUNDEX matching + LIKE wildcards
      const clauses = searchTerms.map(() => '(p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ? OR SOUNDEX(p.name) LIKE CONCAT(SUBSTRING(SOUNDEX(?), 1, 3), "%"))').join(' AND ');
      whereClause += ` AND (${clauses})`;
      searchTerms.forEach(word => {
        params.push(`%${word}%`, `%${word}%`, `%${word}%`, word);
      });
    }
  }
  if (category) {
    whereClause += ' AND (c.slug = ? OR pc.slug = ?)';
    params.push(category, category);
  }
  if (brand) {
    whereClause += ' AND p.brand = ?';
    params.push(brand);
  }

  // Price filter on min variant price
  whereClause += ' AND (SELECT MIN(pv.price) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = 1) BETWEEN ? AND ?';
  params.push(parseFloat(minPrice), parseFloat(maxPrice));
  if (color) {
    whereClause += ` AND EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = 1 AND pv.attributes LIKE ?)`;
    params.push(`%"color":"${color}"%`);
  }
  if (size) {
    whereClause += ` AND EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = 1 AND pv.attributes LIKE ?)`;
    params.push(`%"size":"${size}"%`);
  }
  if (seller_id) {
    whereClause += ' AND p.seller_id = ?';
    params.push(seller_id);
  }
  const orderMap = {
    newest: 'p.created_at DESC',
    oldest: 'p.created_at ASC',
    price_asc: 'min_price ASC',
    price_desc: 'min_price DESC',
    rating: 'p.avg_rating DESC',
    popular: 'sales_count DESC, p.review_count DESC'
  };
  const orderBy = orderMap[sort] || 'p.created_at DESC';
  const baseJoins = `
    FROM products p
    LEFT JOIN categories c  ON c.id = p.category_id
    LEFT JOIN categories pc ON pc.id = c.parent_id
  `;
  const [countResult] = await db.query(`SELECT COUNT(DISTINCT p.id) AS total ${baseJoins} ${whereClause}`, params);
  const total = countResult[0].total;
  const [rows] = await db.query(`
    SELECT
      p.id, p.name, p.slug, p.description, p.brand, p.image_url,
      p.avg_rating, p.review_count, p.created_at,
      c.name AS category_name, c.slug AS category_slug,
      MIN(pv.price) AS min_price,
      MAX(pv.price) AS max_price,
      MIN(pv.compare_price) AS compare_price,
      (SELECT SUM(inv.stock - inv.reserved) FROM inventory inv
       JOIN product_variants pv2 ON pv2.sku = inv.sku WHERE pv2.product_id = p.id) AS total_stock,
      IFNULL((SELECT SUM(oi.quantity) FROM order_items oi 
       JOIN product_variants pv2 ON pv2.sku = oi.sku WHERE pv2.product_id = p.id), 0) AS sales_count,
      u.name AS seller_name, u.avatar_url AS seller_avatar
    ${baseJoins}
    LEFT JOIN users u ON u.id = p.seller_id
    LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.is_active = 1
    ${whereClause}
    GROUP BY p.id
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `, [...params, parseInt(limit), offset]);
  res.json({
    products: rows,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// ── GET /api/v1/products/:id ──────────────────────────────────────────────
router.get('/:id', asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  const [products] = await db.query(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug,
           u.name AS seller_name, u.avatar_url AS seller_avatar,
           (SELECT MIN(pv2.price) FROM product_variants pv2 WHERE pv2.product_id = p.id AND pv2.is_active = 1) AS min_price,
           (SELECT MAX(pv2.price) FROM product_variants pv2 WHERE pv2.product_id = p.id AND pv2.is_active = 1) AS max_price,
           (SELECT MIN(pv2.compare_price) FROM product_variants pv2 WHERE pv2.product_id = p.id AND pv2.is_active = 1 AND pv2.compare_price IS NOT NULL) AS compare_price,
           (SELECT SUM(inv.stock - inv.reserved) FROM inventory inv JOIN product_variants pv2 ON pv2.sku = inv.sku WHERE pv2.product_id = p.id) AS total_stock
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN users u ON u.id = p.seller_id
    WHERE p.id = ? AND p.is_active = 1
  `, [id]);
  if (products.length === 0) return res.status(404).json({
    error: 'Product not found.'
  });
  const product = products[0];
  const [variants] = await db.query(`
    SELECT pv.*, inv.stock, inv.reserved,
           (inv.stock - inv.reserved) AS available_stock
    FROM product_variants pv
    LEFT JOIN inventory inv ON inv.sku = pv.sku
    WHERE pv.product_id = ? AND pv.is_active = 1
  `, [id]);
  const [reviews] = await db.query(`
    SELECT r.id, r.rating, r.title, r.body, r.created_at, r.is_verified,
           u.name AS reviewer_name, u.avatar_url AS reviewer_avatar
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
    LIMIT 10
  `, [id]);

  // Rating distribution
  const [ratingDist] = await db.query(`
    SELECT rating, COUNT(*) AS count
    FROM reviews
    WHERE product_id = ?
    GROUP BY rating
  `, [id]);

  // Intelligent Contextual Recommendations (Same category or brand, highly rated)
  const [crossSells] = await db.query(`
    SELECT p.id, p.name, p.slug, p.image_url, p.avg_rating, p.review_count,
           MIN(pv.price) AS min_price, MAX(pv.price) AS max_price, 'dynamic_recommendation' AS relation_type
    FROM products p
    LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.is_active = 1
    WHERE (p.category_id = ? OR p.brand = ?) 
      AND p.id != ? 
      AND p.is_active = 1
    GROUP BY p.id
    ORDER BY p.avg_rating DESC, RAND()
    LIMIT 4
  `, [product.category_id, product.brand, id]);
  res.json({
    ...product,
    variants,
    reviews,
    rating_distribution: ratingDist,
    cross_sells: crossSells
  });
}));

// ── POST /api/v1/products/:id/reviews ─────────────────────────────────────
const {
  authenticate,
  requireSellerOrAdmin
} = require('../middleware/auth');

// ── Admin & Seller: POST /api/v1/products ─────────────────────────────────────────

router.post('/', authenticate, requireSellerOrAdmin, asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    category_id,
    brand,
    image_url,
    gallery_images,
    tags,
    variants
  } = req.body;
  if (!name || !slug) return res.status(400).json({
    error: 'name and slug are required.'
  });
  const seller_id = req.user.role === 'seller' ? req.user.id : null;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query('INSERT INTO products (id, name, slug, description, category_id, brand, image_url, gallery_images, tags, seller_id) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, slug, description || null, category_id || null, brand || null, image_url || null, gallery_images ? JSON.stringify(gallery_images) : null, tags || null, seller_id]);
    const [newProduct] = await conn.query('SELECT id FROM products WHERE slug = ?', [slug]);
    const productId = newProduct[0].id;
    if (variants && variants.length > 0) {
      for (const v of variants) {
        await conn.query('INSERT INTO product_variants (sku, product_id, name, price, compare_price, image_url, attributes) VALUES (?, ?, ?, ?, ?, ?, ?)', [v.sku, productId, v.name || null, v.price, v.compare_price || null, v.image_url || null, JSON.stringify(v.attributes || {})]);
        await conn.query('INSERT INTO inventory (sku, stock, reserved) VALUES (?, ?, 0)', [v.sku, v.stock || 0]);
      }
    }
    await conn.commit();
    res.status(201).json({
      message: 'Product created.',
      id: productId
    });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}));

// ── Admin & Seller: PATCH /api/v1/products/:id ────────────────────────────────────
router.patch('/:id', authenticate, requireSellerOrAdmin, asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category_id,
    brand,
    image_url,
    gallery_images,
    tags,
    is_active
  } = req.body;
  if (req.user.role === 'seller') {
    const [prods] = await db.query('SELECT seller_id FROM products WHERE id = ?', [req.params.id]);
    if (prods.length === 0 || prods[0].seller_id !== req.user.id) {
      return res.status(403).json({
        error: 'You do not own this product.'
      });
    }
  }
  await db.query(`
    UPDATE products SET
      name           = COALESCE(?, name),
      description    = COALESCE(?, description),
      category_id    = COALESCE(?, category_id),
      brand          = COALESCE(?, brand),
      image_url      = COALESCE(?, image_url),
      gallery_images = COALESCE(?, gallery_images),
      tags           = COALESCE(?, tags),
      is_active      = COALESCE(?, is_active)
    WHERE id = ?
  `, [name || null, description || null, category_id || null, brand || null, image_url || null, gallery_images ? JSON.stringify(gallery_images) : null, tags || null, is_active ?? null, req.params.id]);
  res.json({
    message: 'Product updated.'
  });
}));

// ── Admin & Seller: DELETE /api/v1/products/:id ───────────────────────────────────
router.delete('/:id', authenticate, requireSellerOrAdmin, asyncHandler(async (req, res) => {
  if (req.user.role === 'seller') {
    const [prods] = await db.query('SELECT seller_id FROM products WHERE id = ?', [req.params.id]);
    if (prods.length === 0 || prods[0].seller_id !== req.user.id) {
      return res.status(403).json({
        error: 'You do not own this product.'
      });
    }
  }
  await db.query('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]);
  res.json({
    message: 'Product deactivated.'
  });
}));
module.exports = router;