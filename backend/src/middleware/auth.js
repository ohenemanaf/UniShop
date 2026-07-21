/**
 * File: auth.js
 * Description: Auto-generated documentation for auth.js
 * Date: 2026-07-21
 */
const jwt = require('jsonwebtoken');

/**
 * Role hierarchy: admin > seller > customer
 * Sellers and admins retain customer-level privileges.
 */

/**
 * Middleware: verify JWT token from Authorization header.
 * Attaches decoded payload to req.user.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication required. Please login.'
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, name }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Session expired. Please login again.'
      });
    }
    return res.status(401).json({
      error: 'Invalid token.'
    });
  }
};

/**
 * Middleware: require admin role.
 */
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required.'
    });
  }
  next();
};

/**
 * Middleware: require seller role OR admin.
 * Admins can access all seller features.
 */
const requireSeller = (req, res, next) => {
  if (req.user?.role !== 'seller' && req.user?.role !== 'admin') {
    return res.status(403).json({
      error: 'Seller access required.'
    });
  }
  next();
};
/**
 * Arrow Function requireSellerOrAdmin
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {any}
 */
const requireSellerOrAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'seller') {
    return res.status(403).json({
      error: 'Admin or Seller access required.'
    });
  }
  next();
};
module.exports = {
  authenticate,
  requireAdmin,
  requireSeller,
  requireSellerOrAdmin
};