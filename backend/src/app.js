/**
 * File: app.js
 * Description: Auto-generated documentation for app.js
 * Date: 2026-07-21
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('Configure JWT_SECRET with at least 32 characters');
const express = require('express');
const http = require('http');
const {
  Server
} = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./config/db');
const {
  apiLimiter
} = require('./middleware/rateLimiter');
const {
  errorHandler
} = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const wishlistRoutes = require('./routes/wishlist');
const adminRoutes = require('./routes/admin');
const sellerRoutes = require('./routes/seller');
const crmRoutes = require('./routes/crm');
const inventoryRoutes = require('./routes/inventory');
const stripeRoutes = require('./routes/stripe');
const uploadRoutes = require('./routes/upload');
const publicSellersRoutes = require('./routes/publicSellers');
const app = express();

// Serve the uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Expose io to routes
app.locals.io = io;

// Socket.io Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});
io.on('connection', socket => {
  console.log(`Socket connected: ${socket.id} (User: ${socket.user.id}, Role: ${socket.user.role})`);

  // Join a room specific to the user ID to receive direct notifications
  socket.join(`user_${socket.user.id}`);
  if (socket.user.role === 'admin' || socket.user.role === 'seller') {
    socket.join('sellers'); // A room for all sellers
    if (socket.user.role === 'admin') socket.join('admins');
  }

  // Live Chat Events
  socket.on('send_message', async (data, callback) => {
    // Customer sending message to admin
    try {
      const {
        message
      } = data;
      const [result] = await db.query('INSERT INTO chat_messages (user_id, sender_type, message) VALUES (?, ?, ?)', [socket.user.id, 'user', message]);
      const chatMsg = {
        id: result.insertId,
        user_id: socket.user.id,
        sender_type: 'user',
        message,
        created_at: new Date()
      };

      // Broadcast to admins
      io.to('admins').emit('new_chat_message', chatMsg);
      // Callback to sender to confirm
      if (typeof callback === 'function') callback(chatMsg);
    } catch (err) {
      console.error('Socket send_message error', err);
    }
  });
  socket.on('admin_reply', async (data, callback) => {
    // Admin sending message to customer
    if (socket.user.role !== 'admin') return;
    try {
      const {
        targetUserId,
        message
      } = data;
      const [result] = await db.query('INSERT INTO chat_messages (user_id, sender_type, message) VALUES (?, ?, ?)', [targetUserId, 'admin', message]);
      const chatMsg = {
        id: result.insertId,
        user_id: targetUserId,
        sender_type: 'admin',
        message,
        created_at: new Date()
      };

      // Send to the specific user's room
      io.to(`user_${targetUserId}`).emit('new_chat_message', chatMsg);
      // Send to all other admins so their dashboards update
      io.to('admins').emit('new_chat_message', chatMsg);
      if (typeof callback === 'function') callback(chatMsg);
    } catch (err) {
      console.error('Socket admin_reply error', err);
    }
  });
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// ── Chat Session Auto-Cleanup (every 5 minutes) ───────────────────────────
// Deletes chat messages for users who haven't sent/received a message in 1 hour.
// Also emits 'chat_session_expired' to those users via socket so the UI can react.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes

setInterval(async () => {
  try {
    // Find all user IDs whose last chat message is older than 1 hour
    const [expiredUsers] = await db.query(`
      SELECT user_id
      FROM chat_messages
      GROUP BY user_id
      HAVING MAX(created_at) < DATE_SUB(NOW(), INTERVAL 1 HOUR)
    `);
    if (expiredUsers.length === 0) return;
    const userIds = expiredUsers.map(u => u.user_id);

    // Delete their messages
    await db.query(`DELETE FROM chat_messages WHERE user_id IN (${userIds.map(() => '?').join(',')})`, userIds);

    // Notify each affected user via socket
    userIds.forEach(userId => {
      io.to(`user_${userId}`).emit('chat_session_expired');
    });
    console.log(`[Chat Cleanup] Deleted expired sessions for ${userIds.length} user(s).`);
  } catch (err) {
    console.error('[Chat Cleanup] Error:', err);
  }
}, CLEANUP_INTERVAL_MS);

// ── Middleware ────────────────────────────────────────────────────────────
// In order to allow serving static files (like images) that cross origins if needed,
// Helmet crossOriginResourcePolicy can sometimes block them. Adjusting Helmet for images:
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(cors({
  origin: '*',
  // For dev. In production, specify frontend URL.
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Stripe webhook must receive raw body, so we mount it BEFORE express.json()
app.use('/api/v1/stripe/webhook', (req,res,next) => {
  if(req.path === '/mock') return next();
  return express.raw({type:'application/json'})(req,res,next);
}, require('./routes/webhook'));
app.use(express.json());
app.use('/api', apiLimiter);

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1', require('./routes/storeSettings'));
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/seller', sellerRoutes);
app.use('/api/v1/crm', crmRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/stripe', stripeRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/sellers', publicSellersRoutes);

// Public Storefront Routes
app.get('/api/v1/storefront/banners', async (req, res, next) => {
  try {
    const [banners] = await db.query('SELECT * FROM banners WHERE is_active = 1 ORDER BY created_at DESC');
    res.json({
      banners
    });
  } catch (err) {
    next(err);
  }
});
app.get('/api/v1/storefront/edits', async (req, res, next) => {
  try {
    const [edits] = await db.query('SELECT * FROM curated_edits WHERE is_active = 1 ORDER BY size ASC, created_at DESC');
    res.json({
      edits
    });
  } catch (err) {
    next(err);
  }
});

// ── 404 Handler (API) ─────────────────────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found.`
  });
});

// ── Error Handler (must be last middleware) ───────────────────────────────
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
module.exports = app;