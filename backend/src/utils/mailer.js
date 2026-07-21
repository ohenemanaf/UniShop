/**
 * File: mailer.js
 * Description: Auto-generated documentation for mailer.js
 * Date: 2026-07-21
 */
const nodemailer = require('nodemailer');
let transporter;
/**
 * Function initMailer
 * @returns {any}
 */
async function initMailer() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });
}

// Initialize asynchronously
initMailer().catch(console.error);
/**
 * Function sendOrderConfirmation
 * @param {any} userEmail
 * @param {any} orderData
 * @returns {any}
 */
async function sendOrderConfirmation(userEmail, orderData) {
  if (!transporter) return;
  const {
    order_id,
    total,
    subtotal,
    discount,
    shipping_fee,
    items
  } = orderData;
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.product_name}</strong> ${item.variant_name ? `(${item.variant_name})` : ''}<br/>
        Qty: ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #2563eb;">UniShop Order Confirmation</h2>
      <p>Thank you for your purchase! Your order has been confirmed.</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Order ID:</strong> ${order_id}</p>
        <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Processing</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Item</th>
            <th style="text-align: right; padding: 10px; border-bottom: 2px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 20px;">
        <p style="margin: 5px 0;">Subtotal: $${subtotal.toFixed(2)}</p>
        ${discount > 0 ? `<p style="margin: 5px 0; color: #16a34a;">Discount: -$${discount.toFixed(2)}</p>` : ''}
        <p style="margin: 5px 0;">Shipping: ${shipping_fee === 0 ? 'FREE' : `$${shipping_fee.toFixed(2)}`}</p>
        <h3 style="margin: 10px 0; font-size: 1.5rem;">Total: $${total.toFixed(2)}</h3>
      </div>

      <p style="margin-top: 40px; font-size: 0.9rem; color: #666; text-align: center;">
        If you have any questions, simply reply to this email!
      </p>
    </div>
  `;
  try {
    const info = await transporter.sendMail({
      from: '"UniShop" <noreply@unishop.com>',
      to: userEmail,
      subject: `Order Confirmation - ${order_id}`,
      html: html
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error sending email:", err);
  }
}
/**
 * Function sendStatusUpdateEmail
 * @param {any} userEmail
 * @param {any} orderId
 * @param {any} status
 * @returns {any}
 */
async function sendStatusUpdateEmail(userEmail, orderId, status) {
  if (!transporter) return;
  let title = '';
  let message = '';
  let color = '#2563eb';
  if (status === 'SHIPPED') {
    title = 'Your Order Has Shipped! 🚚';
    message = 'Great news! Your order has been packed and handed over to our shipping partner. It will be arriving soon.';
    color = '#16a34a';
  } else if (status === 'CANCELLED') {
    title = 'Order Cancelled';
    message = 'Your order has been cancelled and any charges have been refunded. We hope to see you again soon.';
    color = '#dc2626';
  } else if (status === 'DELIVERED') {
    title = 'Order Delivered! 🎉';
    message = 'Your order has been delivered! We hope you love your new items. Enjoy!';
    color = '#16a34a';
  } else {
    // Only send emails for specific statuses
    return;
  }
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; text-align: center;">
      <h2 style="color: ${color};">${title}</h2>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
        <p style="margin: 0; font-size: 1.1rem;"><strong>Order ID:</strong> ${orderId}</p>
        <p style="margin: 10px 0 0 0; line-height: 1.5;">${message}</p>
      </div>

      <p style="margin-top: 40px; font-size: 0.9rem; color: #666;">
        If you have any questions, simply reply to this email!
      </p>
    </div>
  `;
  try {
    const info = await transporter.sendMail({
      from: '"UniShop" <noreply@unishop.com>',
      to: userEmail,
      subject: `Order Update - ${title}`,
      html: html
    });
    console.log("Status update email sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error sending status email:", err);
  }
}
module.exports = {
  sendOrderConfirmation,
  sendStatusUpdateEmail
};