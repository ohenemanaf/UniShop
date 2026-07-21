/**
 * File: admin.js
 * Description: Auto-generated documentation for admin.js
 * Date: 2026-07-21
 */
const express = require('express');
const db = require('../config/db');
const {
  authenticate,
  requireAdmin
} = require('../middleware/auth');
const {
  asyncHandler
} = require('../middleware/errorHandler');
const {
  sendStatusUpdateEmail
} = require('../utils/mailer');
const router = express.Router();
router.use(authenticate, requireAdmin);

// ── GET /api/v1/admin/dashboard ───────────────────────────────────────────
router.get('/dashboard', asyncHandler(async (req, res) => {
  const [[userCount]] = await db.query('SELECT COUNT(*) AS total FROM users WHERE role = ?', ['customer']);
  const [[orderCount]] = await db.query('SELECT COUNT(*) AS total FROM orders');
  const [[revenue]] = await db.query('SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE payment_status = ?', ['PAID']);
  const [[productCount]] = await db.query('SELECT COUNT(*) AS total FROM products WHERE is_active = 1');
  const [recentOrders] = await db.query(`
    SELECT o.id, o.status, o.total, o.created_at, u.name AS customer_name
    FROM orders o JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC LIMIT 10
  `);
  const [topProducts] = await db.query(`
    SELECT p.name, p.image_url, SUM(oi.quantity) AS units_sold, SUM(oi.price_at_purchase * oi.quantity) AS revenue
    FROM order_items oi
    JOIN product_variants pv ON pv.sku = oi.sku
    JOIN products p ON p.id = pv.product_id
    GROUP BY p.id ORDER BY units_sold DESC LIMIT 5
  `);
  const [revenueChart] = await db.query(`
    SELECT DATE(created_at) as date, SUM(total) as revenue 
    FROM orders 
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
      AND payment_status = 'PAID'
    GROUP BY DATE(created_at) 
    ORDER BY date ASC
  `);
  res.json({
    stats: {
      users: userCount.total,
      orders: orderCount.total,
      revenue: parseFloat(revenue.total),
      products: productCount.total
    },
    recent_orders: recentOrders,
    top_products: topProducts,
    revenue_chart: revenueChart.map(r => ({
      date: r.date,
      revenue: parseFloat(r.revenue)
    }))
  });
}));

// ── GET /api/v1/admin/orders ──────────────────────────────────────────────
router.get('/orders', asyncHandler(async (req, res) => {
  const {
    status,
    page = 1,
    limit = 20
  } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let where = '';
  const params = [];
  if (status) {
    where = 'WHERE o.status = ?';
    params.push(status);
  }
  const [orders] = await db.query(`
    SELECT o.*, u.name AS customer_name, u.email AS customer_email
    FROM orders o JOIN users u ON u.id = o.user_id
    ${where}
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
  `, [...params, parseInt(limit), offset]);
  const [[countResult]] = await db.query(`SELECT COUNT(*) AS total FROM orders o ${where}`, params);
  res.json({
    orders,
    pagination: {
      total: countResult.total,
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
}));

// ── PATCH /api/v1/admin/orders/:id/status ─────────────────────────────────
router.patch('/orders/:id/status', asyncHandler(async (req, res) => {
  const {
    status
  } = req.body;
  const orderId = req.params.id;
  const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status.'
    });
  }

  // Get current order and user email
  const [orders] = await db.query(`
    SELECT o.status, u.email, u.id as user_id 
    FROM orders o 
    JOIN users u ON u.id = o.user_id 
    WHERE o.id = ?
  `, [orderId]);
  if (orders.length === 0) {
    return res.status(404).json({
      error: 'Order not found.'
    });
  }
  const currentStatus = orders[0].status;
  const userEmail = orders[0].email;
  const userId = orders[0].user_id;
  if (currentStatus !== status) {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);

    // Emit real-time notification to the user
    req.app.locals.io.to(`user_${userId}`).emit('order_status_updated', {
      order_id: Number(orderId),
      status
    });

    // Fire & Forget email notification if status is relevant
    if (['SHIPPED', 'CANCELLED', 'DELIVERED'].includes(status)) {
      sendStatusUpdateEmail(userEmail, orderId, status).catch(err => console.error('Status email error:', err));
    }
  }
  res.json({
    message: `Order status updated to ${status}.`
  });
}));

// ── GET /api/v1/admin/users ───────────────────────────────────────────────
router.get('/users', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20
  } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const [users] = await db.query(`
    SELECT id, name, email, role, phone, created_at FROM users
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `, [parseInt(limit), offset]);
  const [[countResult]] = await db.query('SELECT COUNT(*) AS total FROM users');
  res.json({
    users,
    pagination: {
      total: countResult.total
    }
  });
}));

// ── GET /api/v1/admin/inventory ───────────────────────────────────────────
router.get('/inventory', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20
  } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const [inventory] = await db.query(`
    SELECT p.name AS product_name, p.image_url, pv.sku, pv.product_id, pv.name AS variant_name, pv.price, inv.stock, inv.reserved
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    LEFT JOIN inventory inv ON inv.sku = pv.sku
    ORDER BY p.name ASC, pv.sku ASC
    LIMIT ? OFFSET ?
  `, [parseInt(limit), offset]);
  const [[countResult]] = await db.query('SELECT COUNT(*) AS total FROM product_variants');
  res.json({
    inventory,
    pagination: {
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit)
    }
  });
}));

// ── PATCH /api/v1/admin/inventory/:sku ───────────────────────────────────
router.patch('/inventory/:sku', asyncHandler(async (req, res) => {
  const {
    stock
  } = req.body;
  if (stock === undefined || stock < 0) return res.status(400).json({
    error: 'Valid stock value required.'
  });
  await db.query('INSERT INTO inventory (sku, stock, reserved) VALUES (?, ?, 0) ON DUPLICATE KEY UPDATE stock = ?', [req.params.sku, stock, stock]);
  res.json({
    message: 'Inventory updated.'
  });
}));

// ── GET /api/v1/admin/promos ──────────────────────────────────────────────
router.get('/promos', asyncHandler(async (req, res) => {
  const [promos] = await db.query('SELECT * FROM promo_codes ORDER BY created_at DESC');
  res.json({
    promos
  });
}));

// ── POST /api/v1/admin/promos ─────────────────────────────────────────────
router.post('/promos', asyncHandler(async (req, res) => {
  const {
    code,
    discount_percentage
  } = req.body;
  if (!code || !discount_percentage) {
    return res.status(400).json({
      error: 'Code and discount_percentage are required.'
    });
  }
  const codeUpper = code.toUpperCase().trim();
  if (discount_percentage <= 0 || discount_percentage >= 100) {
    return res.status(400).json({
      error: 'Discount must be between 1 and 99.'
    });
  }
  try {
    await db.query('INSERT INTO promo_codes (code, discount_percentage, is_active) VALUES (?, ?, 1)', [codeUpper, discount_percentage]);
    res.status(201).json({
      message: 'Promo code created successfully.',
      code: codeUpper
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        error: 'Promo code already exists.'
      });
    }
    throw err;
  }
}));

// ── PATCH /api/v1/admin/promos/:code/status ───────────────────────────────
router.patch('/promos/:code/status', asyncHandler(async (req, res) => {
  const {
    is_active
  } = req.body;
  await db.query('UPDATE promo_codes SET is_active = ? WHERE code = ?', [is_active ? 1 : 0, req.params.code]);
  res.json({
    message: 'Promo code status updated.'
  });
}));

// ── GET /api/v1/admin/support ───────────────────────────────────────────────
router.get('/support', asyncHandler(async (req, res) => {
  const [tickets] = await db.query(`
    SELECT t.*, u.name AS customer_name, u.email AS customer_email
    FROM support_tickets t
    JOIN users u ON u.id = t.user_id
    ORDER BY t.created_at DESC
  `);
  res.json({
    tickets
  });
}));

// ── PATCH /api/v1/admin/support/:id ─────────────────────────────────────────
router.patch('/support/:id', asyncHandler(async (req, res) => {
  const {
    status,
    admin_reply
  } = req.body;
  const ticketId = req.params.id;
  const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status.'
    });
  }
  await db.query('UPDATE support_tickets SET status = COALESCE(?, status), admin_reply = COALESCE(?, admin_reply) WHERE id = ?', [status || null, admin_reply || null, ticketId]);
  res.json({
    message: 'Ticket updated successfully.'
  });
}));

// ── GET /api/v1/admin/reviews ───────────────────────────────────────────────
router.get('/reviews', asyncHandler(async (req, res) => {
  const [reviews] = await db.query(`
    SELECT r.*, p.name AS product_name, u.email AS reviewer_email, u.name AS reviewer_name
    FROM reviews r
    JOIN products p ON p.id = r.product_id
    JOIN users u ON u.id = r.user_id
    ORDER BY r.created_at DESC
  `);
  res.json({
    reviews
  });
}));

// ── DELETE /api/v1/admin/reviews/:id ────────────────────────────────────────
router.delete('/reviews/:id', asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;

  // Need to get product_id before deleting to recalculate average
  const [rows] = await db.query('SELECT product_id FROM reviews WHERE id = ?', [id]);
  if (rows.length === 0) return res.status(404).json({
    error: 'Review not found.'
  });
  const productId = rows[0].product_id;
  await db.query('DELETE FROM reviews WHERE id = ?', [id]);

  // Recalculate product rating
  await db.query(`
    UPDATE products SET
      review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ?),
      avg_rating   = COALESCE((SELECT ROUND(AVG(rating), 2) FROM reviews WHERE product_id = ?), 0)
    WHERE id = ?
  `, [productId, productId, productId]);
  res.json({
    message: 'Review deleted successfully.'
  });
}));

// ── GET /api/v1/admin/payouts ───────────────────────────────────────────────
router.get('/payouts', asyncHandler(async (req, res) => {
  const [payouts] = await db.query(`
    SELECT p.*, u.name as seller_name, u.email as seller_email
    FROM payouts p
    JOIN users u ON u.id = p.seller_id
    ORDER BY p.created_at DESC
  `);
  res.json({
    payouts
  });
}));

// ── PATCH /api/v1/admin/payouts/:id ────────────────────────────────────────
router.patch('/payouts/:id', asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  const {
    status
  } = req.body;
  if (!['PROCESSED', 'REJECTED'].includes(status)) {
    return res.status(400).json({
      error: 'Invalid status.'
    });
  }
  const [[payout]] = await db.query('SELECT seller_id FROM payouts WHERE id = ?', [id]);
  const [result] = await db.query(`
    UPDATE payouts SET status = ?, processed_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'PENDING'
  `, [status, id]);
  if (result.affectedRows === 0) return res.status(400).json({
    error: 'Payout not found or already processed.'
  });
  if (payout && req.app.locals.io) {
    req.app.locals.io.to(`user_${payout.seller_id}`).emit('payout_update', {
      message: `Your payout was ${status.toLowerCase()}`
    });
  }
  res.json({
    message: `Payout marked as ${status}.`
  });
}));

// ── GET /api/v1/admin/banners ───────────────────────────────────────────────
router.get('/banners', asyncHandler(async (req, res) => {
  const [banners] = await db.query('SELECT * FROM banners ORDER BY created_at DESC');
  res.json({
    banners
  });
}));

// ── POST /api/v1/admin/banners ──────────────────────────────────────────────
router.post('/banners', asyncHandler(async (req, res) => {
  const {
    title,
    subtitle,
    image_url,
    link_url,
    position,
    is_active
  } = req.body;
  if (!image_url) return res.status(400).json({
    error: 'Image URL is required.'
  });
  const [result] = await db.query(`
    INSERT INTO banners (title, subtitle, image_url, link_url, position, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [title || null, subtitle || null, image_url, link_url || null, position || 'hero', is_active !== undefined ? is_active : 1]);
  res.status(201).json({
    message: 'Banner created successfully.',
    banner_id: result.insertId
  });
}));

// ── PATCH /api/v1/admin/banners/:id ─────────────────────────────────────────
router.patch('/banners/:id', asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  const {
    title,
    subtitle,
    image_url,
    link_url,
    position,
    is_active
  } = req.body;
  await db.query(`
    UPDATE banners SET
      title = COALESCE(?, title),
      subtitle = COALESCE(?, subtitle),
      image_url = COALESCE(?, image_url),
      link_url = COALESCE(?, link_url),
      position = COALESCE(?, position),
      is_active = COALESCE(?, is_active)
    WHERE id = ?
  `, [title, subtitle, image_url, link_url, position, is_active, id]);
  res.json({
    message: 'Banner updated successfully.'
  });
}));

// ── DELETE /api/v1/admin/banners/:id ────────────────────────────────────────
router.delete('/banners/:id', asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  await db.query('DELETE FROM banners WHERE id = ?', [id]);
  res.json({
    message: 'Banner deleted successfully.'
  });
}));

// ── GET /api/v1/admin/edits ───────────────────────────────────────────────
router.get('/edits', asyncHandler(async (req, res) => {
  const [edits] = await db.query('SELECT * FROM curated_edits ORDER BY size ASC, created_at DESC');
  res.json({
    edits
  });
}));

// ── POST /api/v1/admin/edits ──────────────────────────────────────────────
router.post('/edits', asyncHandler(async (req, res) => {
  const {
    title,
    subtitle,
    price,
    item_count,
    image_url,
    link_url,
    size,
    is_active
  } = req.body;
  if (!title || !image_url) return res.status(400).json({
    error: 'Title and Image URL are required.'
  });
  await db.query(`
    INSERT INTO curated_edits (title, subtitle, price, item_count, image_url, link_url, size, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [title, subtitle, price, item_count, image_url, link_url, size, is_active]);
  res.json({
    message: 'Curated edit created successfully.'
  });
}));

// ── PATCH /api/v1/admin/edits/:id ─────────────────────────────────────────
router.patch('/edits/:id', asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  const {
    title,
    subtitle,
    price,
    item_count,
    image_url,
    link_url,
    size,
    is_active
  } = req.body;
  await db.query(`
    UPDATE curated_edits SET
      title = COALESCE(?, title),
      subtitle = COALESCE(?, subtitle),
      price = COALESCE(?, price),
      item_count = COALESCE(?, item_count),
      image_url = COALESCE(?, image_url),
      link_url = COALESCE(?, link_url),
      size = COALESCE(?, size),
      is_active = COALESCE(?, is_active)
    WHERE id = ?
  `, [title, subtitle, price, item_count, image_url, link_url, size, is_active, id]);
  res.json({
    message: 'Curated edit updated successfully.'
  });
}));

// ── DELETE /api/v1/admin/edits/:id ────────────────────────────────────────
router.delete('/edits/:id', asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  await db.query('DELETE FROM curated_edits WHERE id = ?', [id]);
  res.json({
    message: 'Curated edit deleted successfully.'
  });
}));

// ── PATCH /api/v1/admin/users/:id/role ───────────────────────────────────────
// Admin can change any user's role
router.patch('/users/:id/role', asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  const {
    role
  } = req.body;
  const validRoles = ['customer', 'seller', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      error: `Invalid role. Must be one of: ${validRoles.join(', ')}`
    });
  }

  // Prevent demoting yourself
  if (id === req.user.id && role !== 'admin') {
    return res.status(400).json({
      error: 'You cannot change your own role.'
    });
  }
  const [result] = await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({
      error: 'User not found.'
    });
  }

  // If approving as seller, also mark any pending applications as approved
  if (role === 'seller') {
    await db.query("UPDATE seller_applications SET status = 'APPROVED', reviewed_by = ?, reviewed_at = NOW() WHERE user_id = ? AND status = 'PENDING'", [req.user.id, id]);
  }
  res.json({
    message: `User role updated to ${role}.`
  });
}));

// ── GET /api/v1/admin/seller-applications ────────────────────────────────────
// Admin views all seller applications
router.get('/seller-applications', asyncHandler(async (req, res) => {
  const {
    status
  } = req.query;
  let where = '';
  const params = [];
  if (status) {
    where = 'WHERE sa.status = ?';
    params.push(status);
  }
  const [applications] = await db.query(`
    SELECT sa.*, u.name as user_name, u.email as user_email, u.role as user_role,
           r.name as reviewer_name
    FROM seller_applications sa
    JOIN users u ON u.id = sa.user_id
    LEFT JOIN users r ON r.id = sa.reviewed_by
    ${where}
    ORDER BY sa.created_at DESC
  `, params);
  res.json({
    applications
  });
}));

// ── PATCH /api/v1/admin/seller-applications/:id ───────────────────────────────
// Admin approves or rejects a seller application
router.patch('/seller-applications/:id', asyncHandler(async (req, res) => {
  const {
    id
  } = req.params;
  const {
    status,
    admin_note
  } = req.body;
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({
      error: 'Status must be APPROVED or REJECTED.'
    });
  }

  // Get the application
  const [[app]] = await db.query('SELECT * FROM seller_applications WHERE id = ?', [id]);
  if (!app) return res.status(404).json({
    error: 'Application not found.'
  });
  if (app.status !== 'PENDING') {
    return res.status(400).json({
      error: `Application has already been ${app.status.toLowerCase()}.`
    });
  }

  // Update the application
  await db.query('UPDATE seller_applications SET status = ?, admin_note = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?', [status, admin_note || null, req.user.id, id]);

  // If approved, upgrade user role to seller
  if (status === 'APPROVED') {
    await db.query("UPDATE users SET role = 'seller' WHERE id = ?", [app.user_id]);
  }
  res.json({
    message: `Application ${status.toLowerCase()}.`
  });
}));
module.exports = router;