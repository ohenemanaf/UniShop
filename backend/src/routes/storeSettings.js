const express = require('express');
const db = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { defaults, validateSettings } = require('../config/storeSettings');
const router = express.Router();
let schemaReady;
function ensureSchema() {
  if (!schemaReady) schemaReady = db.query(`CREATE TABLE IF NOT EXISTS store_settings (
    id TINYINT PRIMARY KEY, settings_json JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`).catch(error => { schemaReady = undefined; throw error; });
  return schemaReady;
}
async function readSettings() {
  await ensureSchema();
  const [rows] = await db.query('SELECT settings_json FROM store_settings WHERE id = 1');
  const stored = rows[0]?.settings_json;
  return { ...defaults, ...(typeof stored === 'string' ? JSON.parse(stored) : stored || {}) };
}
router.get('/storefront/settings', asyncHandler(async (req,res) => res.json({ settings: await readSettings() })));
router.get('/admin/settings', authenticate, requireAdmin, asyncHandler(async (req,res) => res.json({ settings: await readSettings() })));
router.put('/admin/settings', authenticate, requireAdmin, asyncHandler(async (req,res) => {
  let settings;
  try { settings = validateSettings(req.body); } catch(error) { return res.status(400).json({error: error.message}); }
  await ensureSchema();
  // Merge partial updates atomically so unrelated controls are not lost.
  await db.query(`INSERT INTO store_settings (id, settings_json) VALUES (1, ?)
    ON DUPLICATE KEY UPDATE settings_json = JSON_MERGE_PATCH(settings_json, VALUES(settings_json))`, [JSON.stringify(settings)]);
  res.json({ settings: await readSettings(), message: 'Store settings saved.' });
}));
module.exports = router;
