/**
 * File: stripe.js
 * Description: Auto-generated documentation for stripe.js
 * Date: 2026-07-21
 */
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
const {
  authenticate
} = require('../middleware/auth');
const {
  asyncHandler
} = require('../middleware/errorHandler');
const db = require('../config/db');
const router = express.Router();
const {randomUUID}=require('crypto');
router.post('/create-payment-intent', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    shipping_address,
    payment_method = 'card',
    promoCode,
    notes
  } = req.body;
  if (!shipping_address || !shipping_address.line1 || !shipping_address.city || !shipping_address.zip) {
    return res.status(400).json({
      error: 'Full shipping address is required.'
    });
  }

  // Fetch cart items
  const [cart] = await db.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
  if (cart.length === 0) return res.status(400).json({
    error: 'Your cart is empty.'
  });
  const [cartItems] = await db.query(`
    SELECT ci.sku, ci.quantity,
           pv.price, pv.name AS variant_name,
           p.name AS product_name, p.image_url AS product_image, p.seller_id,
           inv.stock, inv.reserved
    FROM cart_items ci
    JOIN product_variants pv ON pv.sku = ci.sku
    JOIN products p ON p.id = pv.product_id
    LEFT JOIN inventory inv ON inv.sku = ci.sku
    WHERE ci.cart_id = ? AND pv.is_active = 1 AND p.is_active = 1
  `, [cart[0].id]);
  if (cartItems.length === 0) return res.status(400).json({
    error: 'Your cart is empty.'
  });
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const orderId = randomUUID();

    // 1. Check & reserve inventory
    for (const item of cartItems) {
      const available = (item.stock || 0) - (item.reserved || 0);
      if (available < item.quantity) {
        throw Object.assign(new Error(`Insufficient stock for ${item.product_name}. Only ${available} left.`), {
          status: 400
        });
      }
      const [reservation] = await conn.query('UPDATE inventory SET reserved = reserved + ? WHERE sku = ? AND stock - reserved >= ?', [item.quantity, item.sku, item.quantity]);
      if (!reservation.affectedRows) throw Object.assign(new Error('Stock changed. Please review your cart.'), {status:400});
    }

    // 2. Calculate totals
    const subtotal = cartItems.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
    let discount_amount = 0;
    if (promoCode) {
      const [promos] = await conn.query('SELECT discount_percentage FROM promo_codes WHERE code = ? AND is_active = 1', [promoCode]);
      if (promos.length > 0) {
        discount_amount = subtotal * parseFloat(promos[0].discount_percentage) / 100;
      } else {
        throw Object.assign(new Error('Invalid or expired promo code.'), {
          status: 400
        });
      }
    }
    const shipping_fee = subtotal >= 500 ? 0 : 15.00; // Free delivery over GHS 500, otherwise GHS 15
    const total = subtotal - discount_amount + shipping_fee;
    const amountInCents = Math.round(total * 100);

    // 3. Create Pending Order
    await conn.query(`
      INSERT INTO orders (id, user_id, status, shipping_line1, shipping_line2, shipping_city,
                          shipping_state, shipping_zip, shipping_country,
                          subtotal, shipping_fee, discount, total, payment_method, payment_status, notes)
      VALUES (?, ?, 'PENDING', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)
    `, [orderId, userId, shipping_address.line1, shipping_address.line2 || null, shipping_address.city, shipping_address.state || null, shipping_address.zip, shipping_address.country || 'Ghana', subtotal.toFixed(2), shipping_fee.toFixed(2), discount_amount.toFixed(2), total.toFixed(2), payment_method, notes || null]);

    // 4. Create Order Items
    for (const item of cartItems) {
      await conn.query(`
        INSERT INTO order_items (order_id, sku, product_name, variant_name, quantity, price_at_purchase, image_url, seller_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [orderId, item.sku, item.product_name, item.variant_name || null, item.quantity, item.price, item.product_image || null, item.seller_id || null]);
    }

    // 5. Create Stripe PaymentIntent or Mock Response
    if (process.env.PORTFOLIO_DEMO === 'true' || !process.env.STRIPE_SECRET_KEY) {
      if(process.env.NODE_ENV === 'production' && process.env.PORTFOLIO_DEMO !== 'true') throw Object.assign(new Error('Payments are not configured.'),{status:503});
      await conn.commit();
      return res.json({
        clientSecret: 'mock_client_secret_because_no_stripe_key_provided',
        mocked: true,
        amount: total,
        orderId: orderId
      });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'ghs',
      // Ghana Cedis
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        order_id: orderId,
        user_id: userId
      }
    });
    await conn.commit();
    res.json({
      clientSecret: paymentIntent.client_secret,
      mocked: false,
      amount: total,
      orderId: orderId
    });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}));
module.exports = router;