/**
 * File: orders.js
 * Description: Auto-generated documentation for orders.js
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
const emailService = require('../services/emailService');
const router = express.Router();
router.use(authenticate);

// ── POST /api/v1/orders/validate-promo ────────────────────────────────────
router.post('/validate-promo', asyncHandler(async (req, res) => {
  const {
    promoCode
  } = req.body;
  if (!promoCode) return res.status(400).json({
    error: 'Promo code is required.'
  });
  const [promos] = await db.query('SELECT code, discount_percentage FROM promo_codes WHERE code = ? AND is_active = 1', [promoCode]);
  if (promos.length === 0) {
    return res.status(400).json({
      error: 'Invalid or expired promo code.'
    });
  }
  res.json({
    message: 'Promo code applied!',
    code: promos[0].code,
    discount_percentage: parseFloat(promos[0].discount_percentage)
  });
}));

// The /checkout route has been deprecated. Order creation is now handled by /api/v1/stripe/create-payment-intent and /api/v1/stripe/webhook.

// ── GET /api/v1/orders ────────────────────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    page = 1,
    limit = 10
  } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const [orders] = await db.query(`
    SELECT id, status, subtotal, shipping_fee, total, payment_method, payment_status,
           shipping_line1, shipping_city, shipping_country, created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `, [userId, parseInt(limit), offset]);
  const [countResult] = await db.query('SELECT COUNT(*) AS total FROM orders WHERE user_id = ?', [userId]);

  // Attach items to each order
  const ordersWithItems = await Promise.all(orders.map(async order => {
    const [items] = await db.query('SELECT sku, product_name, variant_name, quantity, price_at_purchase, image_url FROM order_items WHERE order_id = ?', [order.id]);
    return {
      ...order,
      items
    };
  }));
  res.json({
    orders: ordersWithItems,
    pagination: {
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(countResult[0].total / parseInt(limit))
    }
  });
}));

// ── GET /api/v1/orders/:id ────────────────────────────────────────────────
router.get('/:id', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [orders] = await db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, userId]);
  if (orders.length === 0) return res.status(404).json({
    error: 'Order not found.'
  });
  const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
  res.json({
    ...orders[0],
    items
  });
}));

// ── POST /api/v1/orders/:id/cancel ────────────────────────────────────────
router.post('/:id/cancel', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [orders] = await db.query('SELECT id, status FROM orders WHERE id = ? AND user_id = ?', [req.params.id, userId]);
  if (orders.length === 0) return res.status(404).json({
    error: 'Order not found.'
  });
  const order = orders[0];
  if (['SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status)) {
    return res.status(400).json({
      error: `Cannot cancel an order with status: ${order.status}.`
    });
  }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Restore inventory
    const [items] = await conn.query('SELECT sku, quantity FROM order_items WHERE order_id = ?', [order.id]);
    for (const item of items) {
      await conn.query('UPDATE inventory SET stock = stock + ? WHERE sku = ?', [item.quantity, item.sku]);
    }
    await conn.query('UPDATE orders SET status = ? WHERE id = ?', ['CANCELLED', order.id]);
    await conn.commit();
    res.json({
      message: 'Order cancelled successfully.'
    });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}));
module.exports = router;