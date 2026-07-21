/**
 * File: publicSellers.js
 * Description: Auto-generated documentation for publicSellers.js
 * Date: 2026-07-21
 */
const express = require('express');
const db = require('../config/db');
const {
  asyncHandler
} = require('../middleware/errorHandler');
const router = express.Router();

// ── GET /api/v1/sellers/:id ───────────────────────────────────────────────
router.get('/:id', asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  const [sellers] = await db.query(`
    SELECT id, name, avatar_url, created_at, role
    FROM users
    WHERE id = ? AND role IN ('seller', 'admin')
  `, [id]);
  if (sellers.length === 0) {
    return res.status(404).json({
      error: 'Seller not found.'
    });
  }
  const seller = sellers[0];

  // Get some aggregate stats
  const [stats] = await db.query(`
    SELECT COUNT(*) as total_products, AVG(avg_rating) as shop_rating, SUM(review_count) as total_reviews
    FROM products
    WHERE seller_id = ? AND is_active = 1
  `, [id]);
  res.json({
    ...seller,
    stats: stats[0] || {
      total_products: 0,
      shop_rating: 0,
      total_reviews: 0
    }
  });
}));
module.exports = router;