/**
 * File: seller.js
 * Description: Auto-generated documentation for seller.js
 * Date: 2026-07-21
 */
const express = require('express');
const db = require('../config/db');
const {
  authenticate,
  requireSeller
} = require('../middleware/auth');
const {
  asyncHandler
} = require('../middleware/errorHandler');
const emailService = require('../services/emailService');
const router = express.Router();
router.use(authenticate);
router.use(requireSeller);

// ── GET /api/v1/seller/dashboard-stats ──────────────────────────────────
router.get('/dashboard-stats', asyncHandler(async (req, res) => {
  const sellerId = req.user.id;

  // Total Revenue for this seller (only counting items they sold)
  const [revenueRes] = await db.query(`
    SELECT SUM(price_at_purchase * quantity) as total_revenue
    FROM order_items
    WHERE seller_id = ?
  `, [sellerId]);

  // Total Products
  const [productsRes] = await db.query(`
    SELECT COUNT(*) as total_products
    FROM products
    WHERE seller_id = ? AND is_active = 1
  `, [sellerId]);

  // Pending order items
  const [pendingRes] = await db.query(`
    SELECT COUNT(*) as pending_orders
    FROM order_items
    WHERE seller_id = ? AND fulfillment_status = 'PENDING'
  `, [sellerId]);

  // Chart data
  const [revenueChart] = await db.query(`
    SELECT DATE(o.created_at) as date, SUM(oi.price_at_purchase * oi.quantity) as revenue
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE oi.seller_id = ? 
      AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      AND o.payment_status = 'PAID'
    GROUP BY DATE(o.created_at)
    ORDER BY date ASC
  `, [sellerId]);
  res.json({
    total_revenue: revenueRes[0].total_revenue || 0,
    total_products: productsRes[0].total_products || 0,
    pending_orders: pendingRes[0].pending_orders || 0,
    revenue_chart: revenueChart.map(r => ({
      date: r.date,
      revenue: parseFloat(r.revenue)
    }))
  });
}));

// ── GET /api/v1/seller/products ──────────────────────────────────────────
router.get('/products', asyncHandler(async (req, res) => {
  const sellerId = req.user.id;
  const [products] = await db.query(`
    SELECT p.*, c.name AS category_name,
           (SELECT MIN(pv.price) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = 1) AS price
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.seller_id = ?
    ORDER BY p.created_at DESC
  `, [sellerId]);
  res.json({
    products
  });
}));

// ── GET /api/v1/seller/orders ────────────────────────────────────────────
router.get('/orders', asyncHandler(async (req, res) => {
  const sellerId = req.user.id;
  const {
    page = 1,
    limit = 10
  } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Get order items for this seller, join with orders for shipping info
  const [items] = await db.query(`
    SELECT oi.id as order_item_id, oi.product_name, oi.variant_name, oi.quantity, oi.price_at_purchase, oi.image_url, oi.fulfillment_status,
           o.id as order_id, o.created_at, o.shipping_line1, o.shipping_city, o.shipping_country, o.payment_status,
           u.name as customer_name, u.email as customer_email
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN users u ON u.id = o.user_id
    WHERE oi.seller_id = ?
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
  `, [sellerId, parseInt(limit), offset]);
  const [countRes] = await db.query('SELECT COUNT(*) as total FROM order_items WHERE seller_id = ?', [sellerId]);
  res.json({
    orders: items,
    pagination: {
      total: countRes[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(countRes[0].total / parseInt(limit))
    }
  });
}));

// ── PATCH /api/v1/seller/orders/:itemId/status ──────────────────────────
router.patch('/orders/:itemId/status', asyncHandler(async (req, res) => {
  const sellerId = req.user.id;
  const {
    itemId
  } = req.params;
  const {
    fulfillment_status,
    tracking_number,
    carrier
  } = req.body;
  const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(fulfillment_status)) {
    return res.status(400).json({
      error: 'Invalid fulfillment status.'
    });
  }
  const [result] = await db.query(`
    UPDATE order_items
    SET fulfillment_status = ?, tracking_number = COALESCE(?, tracking_number), carrier = COALESCE(?, carrier)
    WHERE id = ? AND seller_id = ?
  `, [fulfillment_status, tracking_number || null, carrier || null, itemId, sellerId]);
  if (result.affectedRows === 0) {
    return res.status(404).json({
      error: 'Order item not found or you do not have permission.'
    });
  }

  // Fetch details for email
  if (fulfillment_status === 'SHIPPED') {
    const [[itemDetails]] = await db.query(`
      SELECT oi.*, u.email as customer_email
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN users u ON u.id = o.user_id
      WHERE oi.id = ?
    `, [itemId]);
    if (itemDetails) {
      emailService.sendFulfillmentUpdateEmail(itemDetails.customer_email, itemDetails.order_id, itemDetails, tracking_number || itemDetails.tracking_number, carrier || itemDetails.carrier);
    }
  }
  res.json({
    message: 'Fulfillment status updated successfully.'
  });
}));

// ── GET /api/v1/seller/payouts ────────────────────────────────────────────
router.get('/payouts', asyncHandler(async (req, res) => {
  const sellerId = req.user.id;

  // Calculate total earnings from DELIVERED orders
  const [[earningsRes]] = await db.query(`
    SELECT SUM(oi.price_at_purchase * oi.quantity) as total_earnings
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE oi.seller_id = ? AND oi.fulfillment_status = 'DELIVERED' AND o.payment_status = 'PAID'
  `, [sellerId]);

  // Calculate total requested/processed payouts
  const [[payoutsRes]] = await db.query(`
    SELECT SUM(amount) as total_withdrawn
    FROM payouts
    WHERE seller_id = ? AND status IN ('PENDING', 'PROCESSED')
  `, [sellerId]);
  const totalEarnings = parseFloat(earningsRes?.total_earnings || 0);
  const totalWithdrawn = parseFloat(payoutsRes?.total_withdrawn || 0);
  const availableBalance = Math.max(0, totalEarnings - totalWithdrawn);

  // Get payout history
  const [history] = await db.query(`
    SELECT * FROM payouts WHERE seller_id = ? ORDER BY created_at DESC
  `, [sellerId]);
  res.json({
    balance: availableBalance,
    total_earnings: totalEarnings,
    total_withdrawn: totalWithdrawn,
    history
  });
}));

// ── POST /api/v1/seller/payouts ───────────────────────────────────────────
router.post('/payouts', asyncHandler(async (req, res) => {
  const sellerId = req.user.id;
  const {
    amount,
    bank_details
  } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({
    error: 'Invalid amount.'
  });
  if (!bank_details) return res.status(400).json({
    error: 'Bank details are required.'
  });

  // Re-calculate balance
  const [[earningsRes]] = await db.query(`
    SELECT SUM(oi.price_at_purchase * oi.quantity) as total_earnings
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE oi.seller_id = ? AND oi.fulfillment_status = 'DELIVERED' AND o.payment_status = 'PAID'
  `, [sellerId]);
  const [[payoutsRes]] = await db.query(`
    SELECT SUM(amount) as total_withdrawn
    FROM payouts
    WHERE seller_id = ? AND status IN ('PENDING', 'PROCESSED')
  `, [sellerId]);
  const availableBalance = parseFloat(earningsRes?.total_earnings || 0) - parseFloat(payoutsRes?.total_withdrawn || 0);
  if (amount > availableBalance) {
    return res.status(400).json({
      error: 'Insufficient balance.'
    });
  }
  await db.query(`
    INSERT INTO payouts (seller_id, amount, bank_details, status)
    VALUES (?, ?, ?, 'PENDING')
  `, [sellerId, amount, bank_details]);
  res.status(201).json({
    message: 'Payout requested successfully.'
  });
}));
module.exports = router;