/**
 * File: reviews.js
 * Description: Auto-generated documentation for reviews.js
 * Date: 2026-07-21
 */
const express = require('express');
const db = require('../config/db');
const {
  authenticate
} = require('../middleware/auth');
const {
  asyncHandler
} = require('../middleware/errorHandler');
const router = express.Router();

// ── POST /api/v1/reviews ──────────────────────────────────────────────────
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    product_id,
    rating,
    title,
    body
  } = req.body;
  if (!product_id || !rating) {
    return res.status(400).json({
      error: 'product_id and rating are required.'
    });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      error: 'Rating must be between 1 and 5.'
    });
  }

  // Check if user purchased this product (for verified review badge)
  const [purchased] = await db.query(`
    SELECT oi.id FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN product_variants pv ON pv.sku = oi.sku
    WHERE o.user_id = ? AND pv.product_id = ? AND o.status = 'DELIVERED'
    LIMIT 1
  `, [userId, product_id]);
  if (purchased.length === 0) {
    return res.status(403).json({
      error: 'You can only review products you have purchased and received.'
    });
  }
  const isVerified = true;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('INSERT INTO reviews (product_id, user_id, rating, title, body, is_verified) VALUES (?, ?, ?, ?, ?, ?)', [product_id, userId, rating, title || null, body || null, isVerified ? 1 : 0]);

    // Update product avg_rating and review_count
    await conn.query(`
      UPDATE products SET
        review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ?),
        avg_rating   = (SELECT ROUND(AVG(rating), 2) FROM reviews WHERE product_id = ?)
      WHERE id = ?
    `, [product_id, product_id, product_id]);
    await conn.commit();
    res.status(201).json({
      message: 'Review submitted.',
      is_verified: isVerified
    });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}));

// ── GET /api/v1/reviews/product/:productId ────────────────────────────────
router.get('/product/:productId', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10
  } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const [reviews] = await db.query(`
    SELECT r.id, r.rating, r.title, r.body, r.is_verified, r.created_at,
           u.name AS reviewer_name, u.avatar_url AS reviewer_avatar
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?
  `, [req.params.productId, parseInt(limit), offset]);
  const [stats] = await db.query(`
    SELECT
      COUNT(*) AS total,
      ROUND(AVG(rating), 2) AS avg_rating,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star
    FROM reviews WHERE product_id = ?
  `, [req.params.productId]);
  res.json({
    reviews,
    stats: stats[0]
  });
}));

// ── DELETE /api/v1/reviews/:id ────────────────────────────────────────────
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const [rows] = await db.query('SELECT id, product_id FROM reviews WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (rows.length === 0) return res.status(404).json({
    error: 'Review not found.'
  });
  const productId = rows[0].product_id;
  await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);

  // Recalculate product rating
  await db.query(`
    UPDATE products SET
      review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ?),
      avg_rating   = COALESCE((SELECT ROUND(AVG(rating), 2) FROM reviews WHERE product_id = ?), 0)
    WHERE id = ?
  `, [productId, productId, productId]);
  res.json({
    message: 'Review deleted.'
  });
}));
module.exports = router;