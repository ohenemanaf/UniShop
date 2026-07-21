/**
 * File: auth.js
 * Description: Auto-generated documentation for auth.js
 * Date: 2026-07-21
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  body,
  validationResult
} = require('express-validator');
const db = require('../config/db');
const {
  asyncHandler
} = require('../middleware/errorHandler');
const {
  authLimiter
} = require('../middleware/rateLimiter');
const router = express.Router();

// ── POST /api/v1/auth/forgot-password ─────────────────────────────────────────
router.post('/forgot-password', authLimiter, asyncHandler(async (req, res) => {
  const {
    email
  } = req.body;
  if (!email) return res.status(400).json({
    error: 'Email is required'
  });
  const [users] = await db.query('SELECT id, name FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    return res.status(404).json({
      error: 'No user found with this email'
    });
  }

  // Generate plain token and hashed token for DB
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  await db.query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [hashedToken, tokenExpiry, users[0].id]);

  // Note: For dev, we just log the URL to console if we don't have an email service fully setup
  const resetUrl = `${req.protocol}://${req.get('host').replace('3001', '5173')}/reset-password?token=${resetToken}`;
  console.log(`\n\n=== PASSWORD RESET LINK ===\n${resetUrl}\n===========================\n\n`);
  res.json({
    message: 'Password reset link sent! Check terminal console.'
  });
}));

// ── POST /api/v1/auth/reset-password ──────────────────────────────────────────
router.post('/reset-password', authLimiter, asyncHandler(async (req, res) => {
  const {
    token,
    newPassword
  } = req.body;
  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(400).json({
      error: 'Valid token and new password (min 6 chars) required'
    });
  }
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const [users] = await db.query('SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()', [hashedToken]);
  if (users.length === 0) {
    return res.status(400).json({
      error: 'Token is invalid or has expired'
    });
  }
  const newHash = await bcrypt.hash(newPassword, 12);
  await db.query('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [newHash, users[0].id]);
  res.json({
    message: 'Password successfully updated! You can now log in.'
  });
}));

// ── Validation rules ──────────────────────────────────────────────────────────
const registerRules = [body('name').trim().notEmpty().withMessage('Name is required'), body('email').isEmail().normalizeEmail().withMessage('Valid email is required'), body('password').isLength({
  min: 6
}).withMessage('Password must be at least 6 characters')];
const loginRules = [body('email').isEmail().normalizeEmail(), body('password').notEmpty()];

// ── Helpers ───────────────────────────────────────────────────────────────────
const signToken = user => jwt.sign({
  id: user.id,
  email: user.email,
  role: user.role,
  name: user.name
}, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

// ── POST /api/v1/auth/register ────────────────────────────────────────────────
router.post('/register', authLimiter, registerRules, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  const {
    name,
    email,
    password
  } = req.body;

  // Check if email already exists
  const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(409).json({
      error: 'An account with this email already exists.'
    });
  }
  const password_hash = await bcrypt.hash(password, 12);
  const [result] = await db.query('INSERT INTO users (id, name, email, password_hash, role) VALUES (UUID(), ?, ?, ?, ?)', [name, email, password_hash, 'customer']);

  // Fetch the created user
  const [rows] = await db.query('SELECT id, name, email, role, avatar_url FROM users WHERE email = ?', [email]);
  const user = rows[0];
  const token = signToken(user);
  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url
    }
  });
}));

// ── POST /api/v1/auth/login ────────────────────────────────────────────────
router.post('/login', authLimiter, loginRules, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  const {
    email,
    password
  } = req.body;
  const [rows] = await db.query('SELECT id, name, email, role, password_hash FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    return res.status(401).json({
      error: 'Invalid email or password.'
    });
  }
  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({
      error: 'Invalid email or password.'
    });
  }
  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url
    }
  });
}));

// ── GET /api/v1/auth/me ────────────────────────────────────────────────────
const {
  authenticate
} = require('../middleware/auth');
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const [rows] = await db.query('SELECT id, name, email, role, avatar_url, phone, created_at FROM users WHERE id = ?', [req.user.id]);
  if (rows.length === 0) return res.status(404).json({
    error: 'User not found.'
  });

  // Fetch user's default address from addresses table
  const [addresses] = await db.query('SELECT label, line1, line2, city, state, zip, country FROM addresses WHERE user_id = ? ORDER BY is_default DESC LIMIT 1', [req.user.id]);
  const user = rows[0];
  if (addresses.length > 0) {
    user.address = addresses[0];
  }
  res.json(user);
}));

// ── PATCH /api/v1/auth/profile ─────────────────────────────────────────────
router.patch('/profile', authenticate, asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    avatar_url,
    address_line1,
    address_line2,
    city,
    state,
    zip,
    country
  } = req.body;

  // Update user core fields
  await db.query(`UPDATE users SET 
      name = COALESCE(?, name), 
      phone = COALESCE(?, phone), 
      avatar_url = COALESCE(?, avatar_url)
     WHERE id = ?`, [name || null, phone || null, avatar_url || null, req.user.id]);

  // Upsert address if any address fields provided
  if (address_line1 || city || zip) {
    const [existingAddr] = await db.query('SELECT id FROM addresses WHERE user_id = ? AND is_default = 1', [req.user.id]);
    if (existingAddr.length > 0) {
      await db.query(`UPDATE addresses SET line1 = COALESCE(?, line1), line2 = ?, city = COALESCE(?, city), 
         state = ?, zip = COALESCE(?, zip), country = COALESCE(?, country)
         WHERE id = ?`, [address_line1 || null, address_line2 || null, city || null, state || null, zip || null, country || 'India', existingAddr[0].id]);
    } else {
      await db.query(`INSERT INTO addresses (user_id, label, line1, line2, city, state, zip, country, is_default)
         VALUES (?, 'Home', ?, ?, ?, ?, ?, ?, 1)`, [req.user.id, address_line1 || '', address_line2 || null, city || '', state || null, zip || '', country || 'India']);
    }
  }
  res.json({
    message: 'Profile updated successfully.'
  });
}));

// ── PATCH /api/v1/auth/password ────────────────────────────────────────────
router.patch('/password', authenticate, asyncHandler(async (req, res) => {
  const {
    current_password,
    new_password
  } = req.body;
  if (!current_password || !new_password || new_password.length < 6) {
    return res.status(400).json({
      error: 'Valid current and new password (min 6 chars) required.'
    });
  }
  const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
  if (rows.length === 0) return res.status(404).json({
    error: 'User not found.'
  });
  const isMatch = await bcrypt.compare(current_password, rows[0].password_hash);
  if (!isMatch) {
    return res.status(401).json({
      error: 'Incorrect current password.'
    });
  }
  const newHash = await bcrypt.hash(new_password, 12);
  await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);
  res.json({
    message: 'Password updated successfully.'
  });
}));

// ── POST /api/v1/auth/seller-application ──────────────────────────────────
// Customer submits an application to become a seller
router.post('/seller-application', authenticate, asyncHandler(async (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(400).json({
      error: 'Admins already have full access.'
    });
  }
  if (req.user.role === 'seller') {
    return res.status(400).json({
      error: 'You are already a seller.'
    });
  }
  const {
    store_name,
    description,
    category,
    phone
  } = req.body;
  if (!store_name) {
    return res.status(400).json({
      error: 'Store name is required.'
    });
  }

  // Check for an existing pending application
  const [existing] = await db.query("SELECT id, status FROM seller_applications WHERE user_id = ? AND status = 'PENDING'", [req.user.id]);
  if (existing.length > 0) {
    return res.status(400).json({
      error: 'You already have a pending seller application.'
    });
  }
  await db.query('INSERT INTO seller_applications (user_id, store_name, description, category, phone) VALUES (?, ?, ?, ?, ?)', [req.user.id, store_name, description || null, category || null, phone || null]);
  res.status(201).json({
    message: 'Application submitted! You will be notified once reviewed.'
  });
}));

// ── GET /api/v1/auth/seller-application ───────────────────────────────────
// Customer checks their application status
router.get('/seller-application', authenticate, asyncHandler(async (req, res) => {
  const [apps] = await db.query('SELECT * FROM seller_applications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [req.user.id]);
  res.json({
    application: apps[0] || null
  });
}));

// ── POST /api/v1/auth/become-seller ──────────────────────────────────────
// Kept for backwards compatibility - now redirects to application flow
router.post('/become-seller', authenticate, asyncHandler(async (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(400).json({
      error: 'Admins cannot become sellers.'
    });
  }
  if (req.user.role === 'seller') {
    return res.status(400).json({
      error: 'You are already a seller.'
    });
  }
  return res.status(400).json({
    error: 'Direct role upgrade is disabled. Please submit a seller application.',
    redirect: '/seller-application'
  });
}));
module.exports = router;