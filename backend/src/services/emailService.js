/**
 * File: emailService.js
 * Description: Auto-generated documentation for emailService.js
 * Date: 2026-07-21
 */
/**
 * Email Service for UNISHOP OMS
 * Integrates with SendGrid. If SENDGRID_API_KEY is not provided,
 * it safely falls back to console logging for local development.
 */
const sgMail = require('@sendgrid/mail');
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@unishop.com';
/**
 * Arrow Function sendOrderConfirmationEmail
 * @param {any} user
 * @param {any} order
 * @param {any} items
 * @returns {any}
 */
const sendOrderConfirmationEmail = async (user, order, items) => {
  if(process.env.PORTFOLIO_DEMO === 'true') return;
  const line = '-'.repeat(50);
  const textContent = `
Hello ${user.name},

Thank you for shopping at UNISHOP! We've received your order.

ORDER DETAILS
Order ID: ${order.id}
Date: ${new Date().toLocaleString()}

ITEMS:
${items.map(item => `- ${item.product_name} ${item.variant_name ? `(${item.variant_name})` : ''} x${item.quantity} = $${(item.price_at_purchase * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${parseFloat(order.subtotal).toFixed(2)}
Shipping: $${parseFloat(order.shipping_fee).toFixed(2)}
${order.discount > 0 ? `Discount: -$${parseFloat(order.discount).toFixed(2)}\n` : ''}Total:    $${parseFloat(order.total).toFixed(2)}

SHIPPING TO:
${order.shipping_line1}
${order.shipping_line2 ? order.shipping_line2 + '\n' : ''}${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip}
${order.shipping_country}
  `;
  if (process.env.SENDGRID_API_KEY) {
    try {
      await sgMail.send({
        to: user.email,
        from: FROM_EMAIL,
        subject: `Order Confirmation - #${order.id.substring(0, 8)}`,
        text: textContent
      });
      console.log(`[EMAIL SERVICE] SendGrid email sent to ${user.email}`);
    } catch (error) {
      console.error(`[EMAIL SERVICE] SendGrid Error:`, error);
    }
  } else {
    // Fallback to console
    console.log(`\n\n\x1b[36m[EMAIL SERVICE] Sending Order Confirmation (DEV MODE)\x1b[0m`);
    console.log(`To: ${user.email}`);
    console.log(`Subject: Order Confirmation - #${order.id.substring(0, 8)}`);
    console.log(line);
    console.log(textContent);
    console.log(line);
    console.log(`\x1b[36m[EMAIL SERVICE] Email Sent Successfully (DEV MODE)\x1b[0m\n\n`);
  }
};
/**
 * Arrow Function sendFulfillmentUpdateEmail
 * @param {any} userEmail
 * @param {any} orderId
 * @param {any} item
 * @param {any} trackingNumber
 * @param {any} carrier
 * @returns {any}
 */
const sendFulfillmentUpdateEmail = async (userEmail, orderId, item, trackingNumber, carrier) => {
  if(process.env.PORTFOLIO_DEMO === 'true') return;
  const line = '-'.repeat(50);
  const textContent = `
Great news! A portion of your order has been shipped by the seller.

Item: ${item.product_name} ${item.variant_name ? `(${item.variant_name})` : ''} (x${item.quantity})
Status: SHIPPED
${trackingNumber && carrier ? `Carrier: ${carrier}\nTracking Number: ${trackingNumber}\n` : ''}
You can track this package in your account dashboard.
  `;
  if (process.env.SENDGRID_API_KEY) {
    try {
      await sgMail.send({
        to: userEmail,
        from: FROM_EMAIL,
        subject: `Your item has been shipped! (Order #${orderId.substring(0, 8)})`,
        text: textContent
      });
      console.log(`[EMAIL SERVICE] SendGrid email sent to ${userEmail}`);
    } catch (error) {
      console.error(`[EMAIL SERVICE] SendGrid Error:`, error);
    }
  } else {
    console.log(`\n\n\x1b[36m[EMAIL SERVICE] Sending Fulfillment Update (DEV MODE)\x1b[0m`);
    console.log(`To: ${userEmail}`);
    console.log(`Subject: Your item has been shipped! (Order #${orderId.substring(0, 8)})`);
    console.log(line);
    console.log(textContent);
    console.log(line);
    console.log(`\x1b[36m[EMAIL SERVICE] Email Sent Successfully (DEV MODE)\x1b[0m\n\n`);
  }
};
module.exports = {
  sendOrderConfirmationEmail,
  sendFulfillmentUpdateEmail
};