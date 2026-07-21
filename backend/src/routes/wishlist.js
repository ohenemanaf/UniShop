/**
 * File: wishlist.js
 * Description: Auto-generated documentation for wishlist.js
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
router.use(authenticate);

// ── GET /api/v1/wishlist ──────────────────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const [items] = await db.query(`
    SELECT w.id, w.added_at,
           p.id AS product_id, p.name, p.slug, p.image_url, p.avg_rating, p.review_count,
           MIN(pv.price) AS price, MIN(pv.compare_price) AS compare_price,
           (SELECT SUM(inv.stock - inv.reserved) FROM inventory inv
            JOIN product_variants pv2 ON pv2.sku = inv.sku WHERE pv2.product_id = p.id) AS total_stock
    FROM wishlist w
    JOIN products p ON p.id = w.product_id
    LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.is_active = 1
    WHERE w.user_id = ?
    GROUP BY w.id, p.id
    ORDER BY w.added_at DESC
  `, [req.user.id]);
  res.json(items);
}));

// ── POST /api/v1/wishlist ─────────────────────────────────────────────────
router.post('/', asyncHandler(async (req, res) => {
  const {
    product_id
  } = req.body;
  if (!product_id) return res.status(400).json({
    error: 'product_id is required.'
  });
  const [existing] = await db.query('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);
  if (existing.length > 0) {
    return res.status(409).json({
      error: 'Already in wishlist.'
    });
  }
  await db.query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.user.id, product_id]);
  res.status(201).json({
    message: 'Added to wishlist.'
  });
}));

// ── DELETE /api/v1/wishlist/:productId ────────────────────────────────────
router.delete('/:productId', asyncHandler(async (req, res) => {
  await db.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
  res.json({
    message: 'Removed from wishlist.'
  });
}));
module.exports = router;