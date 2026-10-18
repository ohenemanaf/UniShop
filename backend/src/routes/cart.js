/**
 * File: cart.js
 * Description: Auto-generated documentation for cart.js
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

// All cart routes require authentication
router.use(authenticate);

// ── GET /api/v1/cart ──────────────────────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [cart] = await db.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
  if (cart.length === 0) return res.json({
    items: [],
    total: 0
  });
  const [items] = await db.query(`
    SELECT
      ci.id, ci.sku, ci.quantity,
      pv.name AS variant_name, pv.price, pv.compare_price, pv.image_url AS variant_image,
      pv.attributes,
      p.id AS product_id, p.name AS product_name, p.slug AS product_slug, p.image_url AS product_image,
      (inv.stock - inv.reserved) AS available_stock
    FROM cart_items ci
    JOIN product_variants pv ON pv.sku = ci.sku
    JOIN products p ON p.id = pv.product_id
    LEFT JOIN inventory inv ON inv.sku = ci.sku
    WHERE ci.cart_id = ?
  `, [cart[0].id]);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  res.json({
    items,
    total: parseFloat(total.toFixed(2)),
    item_count: items.reduce((sum,item)=>sum+Number(item.quantity),0)
  });
}));

// ── POST /api/v1/cart/items ───────────────────────────────────────────────
router.post('/items', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    sku,
    quantity = 1
  } = req.body;
  if (!sku) return res.status(400).json({
    error: 'sku is required.'
  });
  if (!Number.isSafeInteger(quantity) || quantity < 1) return res.status(400).json({
    error: 'quantity must be ≥ 1.'
  });

  // Verify SKU exists and has stock
  const [variant] = await db.query(`
    SELECT pv.sku, inv.stock, inv.reserved
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    LEFT JOIN inventory inv ON inv.sku = pv.sku
    WHERE pv.sku = ? AND pv.is_active = 1 AND p.is_active = 1
  `, [sku]);
  if (variant.length === 0) return res.status(404).json({
    error: 'Product variant not found.'
  });
  const available = (variant[0].stock || 0) - (variant[0].reserved || 0);
  if (available < quantity) {
    return res.status(400).json({
      error: `Only ${available} units available.`
    });
  }

  // Upsert cart
  let [cart] = await db.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
  if (cart.length === 0) {
    await db.query('INSERT INTO cart (id, user_id) VALUES (UUID(), ?)', [userId]);
    [cart] = await db.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
  }
  const cartId = cart[0].id;

  // Upsert cart item
  const [existing] = await db.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND sku = ?', [cartId, sku]);
  if (existing.length > 0) {
    const newQty = existing[0].quantity + parseInt(quantity);
    if (newQty > available) {
      return res.status(400).json({
        error: `Cannot add more. Only ${available} units available.`
      });
    }
    await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
  } else {
    await db.query('INSERT INTO cart_items (cart_id, sku, quantity) VALUES (?, ?, ?)', [cartId, sku, quantity]);
  }
  res.json({
    message: 'Item added to cart.'
  });
}));

// ── PATCH /api/v1/cart/items/:sku ─────────────────────────────────────────
router.patch('/items/:sku', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    sku
  } = req.params;
  const {
    quantity
  } = req.body;
  if (!Number.isSafeInteger(quantity) || quantity < 1) return res.status(400).json({
    error: 'quantity must be ≥ 1.'
  });
  const [cart] = await db.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
  if (cart.length === 0) return res.status(404).json({
    error: 'Cart not found.'
  });
  const [variants] = await db.query('SELECT pv.sku, (COALESCE(inv.stock,0) - COALESCE(inv.reserved,0)) AS available FROM product_variants pv JOIN products p ON p.id = pv.product_id LEFT JOIN inventory inv ON inv.sku = pv.sku WHERE pv.sku = ? AND pv.is_active = 1 AND p.is_active = 1', [sku]);
  if (!variants.length || quantity > variants[0].available) return res.status(400).json({error:'Requested quantity is unavailable.'});
  const [result] = await db.query('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND sku = ?', [quantity, cart[0].id, sku]);
  if (!result.affectedRows) return res.status(404).json({error:'Cart item not found.'});
  res.json({
    message: 'Quantity updated.'
  });
}));

// ── DELETE /api/v1/cart/items/:sku ────────────────────────────────────────
router.delete('/items/:sku', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    sku
  } = req.params;
  const [cart] = await db.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
  if (cart.length === 0) return res.status(404).json({
    error: 'Cart not found.'
  });
  await db.query('DELETE FROM cart_items WHERE cart_id = ? AND sku = ?', [cart[0].id, sku]);
  res.json({
    message: 'Item removed.'
  });
}));

// ── DELETE /api/v1/cart ────────────────────────────────────────────────────
router.delete('/', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [cart] = await db.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
  if (cart.length > 0) {
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cart[0].id]);
  }
  res.json({
    message: 'Cart cleared.'
  });
}));
module.exports = router;