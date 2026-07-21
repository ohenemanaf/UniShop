/**
 * File: errorHandler.js
 * Description: Auto-generated documentation for errorHandler.js
 * Date: 2026-07-21
 */
/**
 * Centralized async error handler.
 * Catches errors thrown in async route handlers.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Duplicate entry — resource already exists.'
    });
  }

  // MySQL foreign key violation
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      error: 'Referenced resource does not exist.'
    });
  }

  // Express-validator / manual validation errors
  if (err.status === 400) {
    return res.status(400).json({
      error: err.message
    });
  }

  // Default: 500
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Something went wrong. Please try again later.' : err.message || 'Internal server error';
  res.status(statusCode).json({
    error: message
  });
};

/**
 * Wraps an async route handler so unhandled promise rejections
 * are forwarded to errorHandler automatically.
 */
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
module.exports = {
  errorHandler,
  asyncHandler
};