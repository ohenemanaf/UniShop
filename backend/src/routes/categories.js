/**
 * File: categories.js
 * Description: Auto-generated documentation for categories.js
 * Date: 2026-07-21
 */
const express = require('express');
const db = require('../config/db');
const {
  asyncHandler
} = require('../middleware/errorHandler');
const router = express.Router();

// ── GET /api/v1/categories ─────────────────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const [rows] = await db.query(`
    SELECT c.id, c.name, c.slug, c.description, c.image_url, c.parent_id,
           COUNT(p.id) AS product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
    GROUP BY c.id
    ORDER BY c.parent_id IS NOT NULL, c.name
  `);

  // Build tree structure
  const map = {};
  const roots = [];
  rows.forEach(row => {
    map[row.id] = {
      ...row,
      children: []
    };
  });
  rows.forEach(row => {
    if (row.parent_id && map[row.parent_id]) {
      map[row.parent_id].children.push(map[row.id]);
    } else {
      roots.push(map[row.id]);
    }
  });
  res.json(roots);
}));

// ── GET /api/v1/categories/:slug ───────────────────────────────────────────
router.get('/:slug', asyncHandler(async (req, res) => {
  const [rows] = await db.query('SELECT * FROM categories WHERE slug = ?', [req.params.slug]);
  if (rows.length === 0) return res.status(404).json({
    error: 'Category not found.'
  });
  res.json(rows[0]);
}));

// ── Admin CRUD ─────────────────────────────────────────────────────────────
const {
  authenticate,
  requireAdmin
} = require('../middleware/auth');
router.post('/', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    image_url,
    parent_id
  } = req.body;
  if (!name || !slug) return res.status(400).json({
    error: 'name and slug are required.'
  });
  await db.query('INSERT INTO categories (id, name, slug, description, image_url, parent_id) VALUES (UUID(), ?, ?, ?, ?, ?)', [name, slug, description || null, image_url || null, parent_id || null]);
  res.status(201).json({
    message: 'Category created.'
  });
}));
router.patch('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const {
    name,
    description,
    image_url
  } = req.body;
  await db.query('UPDATE categories SET name = COALESCE(?, name), description = COALESCE(?, description), image_url = COALESCE(?, image_url) WHERE id = ?', [name || null, description || null, image_url || null, req.params.id]);
  res.json({
    message: 'Category updated.'
  });
}));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
  res.json({
    message: 'Category deleted.'
  });
}));
module.exports = router;