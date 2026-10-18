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
  try {require('../config/productValidation').validateVariants(variants);}catch(error){return res.status(400).json({error:error.message});}
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
router.patch('/:id', authenticate, requireSellerOrAdmin, asyncHandler(async(req,res)=>{
  const allowed=['name','description','category_id','brand','image_url','gallery_images','tags','is_active'];
  const fields=allowed.filter(key=>Object.hasOwn(req.body,key));
  let variants;
  try {if(Object.hasOwn(req.body,'variants')) variants=require('../config/productValidation').validateVariants(req.body.variants);}
  catch(error){return res.status(400).json({error:error.message});}
  if(!fields.length && !variants)return res.status(400).json({error:'No changes provided.'});
  if(fields.includes('name') && (typeof req.body.name!=='string'||!req.body.name.trim()||req.body.name.length>255))return res.status(400).json({error:'A product name under 256 characters is required.'});
  if(fields.includes('gallery_images') && (!Array.isArray(req.body.gallery_images)||req.body.gallery_images.length>4||req.body.gallery_images.some(url=>typeof url!=='string')))return res.status(400).json({error:'Provide up to four gallery image URLs.'});
  if(fields.includes('is_active') && ![true,false,0,1].includes(req.body.is_active))return res.status(400).json({error:'Invalid product visibility.'});
  for(const key of ['description','category_id','brand','image_url','tags'])if(fields.includes(key) && req.body[key]!=null && typeof req.body[key]!=='string')return res.status(400).json({error:'Invalid '+key});
  const conn=await db.getConnection();
  try {
    await conn.beginTransaction();
    const [products]=await conn.query('SELECT seller_id FROM products WHERE id = ? FOR UPDATE',[req.params.id]);
    if(!products.length)throw Object.assign(new Error('Product not found.'),{status:404});
    if(req.user.role==='seller' && products[0].seller_id!==req.user.id)throw Object.assign(new Error('You do not own this product.'),{status:403});
    if(fields.length){
      const values=fields.map(key=>key==='gallery_images'?JSON.stringify(req.body[key]):key==='name'?req.body[key].trim():req.body[key]);
      await conn.query('UPDATE products SET '+fields.map(key=>key+' = ?').join(', ')+' WHERE id = ?',[...values,req.params.id]);
    }
    if(variants)for(const variant of variants){
      const [rows]=await conn.query('SELECT pv.sku,inv.reserved FROM product_variants pv JOIN inventory inv ON inv.sku=pv.sku WHERE pv.sku=? AND pv.product_id=? FOR UPDATE',[variant.sku,req.params.id]);
      if(!rows.length)throw Object.assign(new Error('Variant does not belong to this product.'),{status:400});
      if(variant.stock<rows[0].reserved)throw Object.assign(new Error('Stock cannot be below reserved units for '+variant.sku),{status:400});
      await conn.query('UPDATE product_variants SET name=?,price=?,compare_price=? WHERE sku=?',[variant.name,variant.price,variant.compare_price,variant.sku]);
      await conn.query('UPDATE inventory SET stock=? WHERE sku=?',[variant.stock,variant.sku]);
    }
    await conn.commit();res.json({message:'Product and variants updated.'});
  }catch(error){await conn.rollback();throw error;}finally{conn.release();}
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