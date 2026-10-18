/**
 * File: webhook.js
 * Description: Auto-generated documentation for webhook.js
 * Date: 2026-07-21
 */
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
const db = require('../config/db');
const emailService = require('../services/emailService');
const router = express.Router();
const {authenticate}=require('../middleware/auth');

// Mock webhook for testing without Stripe API keys
// We parse JSON here because this specific route is used in the mock flow
router.post('/mock', express.json(), authenticate, async (req, res) => {
  if(process.env.PORTFOLIO_DEMO !== 'true' && (process.env.NODE_ENV === 'production' || process.env.STRIPE_SECRET_KEY)) return res.status(403).json({error:'Test payments are disabled.'});
  const {
    order_id
  } = req.body;
  if (!order_id) return res.status(400).send('Missing order_id');
  try {
    const [owned] = await db.query('SELECT id FROM orders WHERE id = ? AND user_id = ?', [order_id, req.user.id]);
    if(!owned.length) return res.status(404).json({error:'Order not found.'});
    await handleSuccessfulPayment(order_id, req.app.locals.io);
    res.json({
      received: true,
      mocked: true
    });
  } catch (err) {
    console.error('Mock Webhook Error:', err);
    res.status(500).send('Webhook handler failed.');
  }
});

// Real Stripe webhook (express.raw is applied in app.js before reaching here)
router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    if (!endpointSecret) {
      return res.status(503).json({error:'Payment webhook is not configured.'});
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.order_id;
    if (orderId) {
      try {
        await handleSuccessfulPayment(orderId, req.app.locals.io);
      } catch (err) {
        console.error('Failed to process successful payment:', err);
        return res.status(500).send('Database error');
      }
    } else {
      console.warn('payment_intent.succeeded received, but no order_id in metadata');
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});
/**
 * Function handleSuccessfulPayment
 * @param {any} orderId
 * @param {any} io
 * @returns {any}
 */
async function handleSuccessfulPayment(orderId, io) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Get the order
    const [orders] = await conn.query("SELECT * FROM orders WHERE id = ? AND payment_status = ? AND status = 'PENDING' FOR UPDATE", [orderId, 'PENDING']);
    if (orders.length === 0) {
      // Order already processed or doesn't exist
      await conn.rollback();
      return;
    }
    const order = orders[0];

    // 2. Update order status
    await conn.query(`
      UPDATE orders 
      SET status = 'CONFIRMED', payment_status = 'PAID'
      WHERE id = ?
    `, [orderId]);

    // 3. Get order items to deduct inventory
    const [items] = await conn.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    // 4. Deduct actual stock (reserved → sold)
    for (const item of items) {
      await conn.query('UPDATE inventory SET stock = stock - ?, reserved = reserved - ? WHERE sku = ?', [item.quantity, item.quantity, item.sku]);
    }
    await conn.commit();

    // 5. Notifications
    if (io) {
      const sellerIds = [...new Set(items.map(i => i.seller_id).filter(id => id))];
      sellerIds.forEach(sellerId => {
        io.to(`user_${sellerId}`).emit('new_order', {
          orderId,
          total: order.total,
          message: 'A new order has been placed!'
        });
      });
      io.to('admins').emit('new_order', {
        orderId,
        total: order.total,
        message: 'A new order has been placed!'
      });
    }

    // 6. Send email
    // Get user details
    const [users] = await conn.query('SELECT name, email FROM users WHERE id = ?', [order.user_id]);
    if (users.length > 0) {
      emailService.sendOrderConfirmationEmail({
        name: users[0].name,
        email: users[0].email
      }, {
        id: order.id,
        subtotal: order.subtotal,
        shipping_fee: order.shipping_fee,
        discount: order.discount,
        total: order.total,
        shipping_line1: order.shipping_line1,
        shipping_line2: order.shipping_line2,
        shipping_city: order.shipping_city,
        shipping_state: order.shipping_state,
        shipping_zip: order.shipping_zip,
        shipping_country: order.shipping_country
      }, items);
    }
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
module.exports = router;