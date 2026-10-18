/**
 * File: inventory.js
 * Description: Auto-generated documentation for inventory.js
 * Date: 2026-07-21
 */
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {
  authenticate,
  requireSellerOrAdmin
} = require('../middleware/auth');
const {
  asyncHandler
} = require('../middleware/errorHandler');

// All inventory routes require authentication + seller/admin role
router.use(authenticate, requireSellerOrAdmin);

// GET /api/v1/inventory - Get inventory levels
router.get('/', asyncHandler(async (req, res) => {
  let query = `
    SELECT i.sku, i.stock, i.reserved, v.name as variant_name, p.name as product_name, p.seller_id
    FROM inventory i
    JOIN product_variants v ON i.sku = v.sku
    JOIN products p ON v.product_id = p.id
  `;
  const params = [];
  if (req.user.role === 'seller') {
    query += ` WHERE p.seller_id = ?`;
    params.push(req.user.id);
  }
  query += ` ORDER BY i.stock ASC`;
  const [rows] = await db.query(query, params);
  res.json(rows);
}));

// PATCH /api/v1/inventory/bulk - Update multiple stock levels at once
router.patch('/bulk', asyncHandler(async (req, res) => {
  const {
    updates
  } = req.body; // Array of { sku, stock }
  if (!Array.isArray(updates)) return res.status(400).json({
    error: 'Updates must be an array'
  });
  if (!updates.length || updates.length > 100 || updates.some(item => !item || typeof item.sku !== 'string' || !item.sku.trim() || !Number.isSafeInteger(item.stock) || item.stock < 0)) return res.status(400).json({error:'Provide 1–100 SKUs with nonnegative whole-number stock.'});
  if (new Set(updates.map(item=>item.sku)).size !== updates.length) return res.status(400).json({error:'Duplicate SKUs are not allowed.'});
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (let item of updates) {
      if (req.user.role === 'seller') {
        // Verify seller owns this SKU
        const [[product]] = await connection.query(`
          SELECT p.seller_id FROM products p
          JOIN product_variants v ON p.id = v.product_id
          WHERE v.sku = ?
        `, [item.sku]);
        if (!product || product.seller_id !== req.user.id) {
          throw Object.assign(new Error(`Unauthorized to update SKU ${item.sku}`), {
            status: 403
          });
        }
      }
      const [result] = await connection.query('UPDATE inventory SET stock = ? WHERE sku = ? AND reserved <= ?', [item.stock, item.sku, item.stock]);
      if(!result.affectedRows) throw Object.assign(new Error('SKU missing or stock is below reserved quantity: ' + item.sku),{status:400});
    }
    await connection.commit();
    res.json({
      message: 'Inventory updated successfully'
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));
module.exports = router;