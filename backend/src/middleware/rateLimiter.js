/**
 * File: rateLimiter.js
 * Description: Auto-generated documentation for rateLimiter.js
 * Date: 2026-07-21
 */
const rateLimit = require('express-rate-limit');

/** Strict limiter for auth endpoints (login/register) */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 20,
  message: {
    error: 'Too many attempts. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/** General API limiter */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  // 1 minute
  max: 200,
  message: {
    error: 'Too many requests. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
module.exports = {
  authLimiter,
  apiLimiter
};