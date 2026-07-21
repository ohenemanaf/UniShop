/**
 * File: currency.js
 * Description: Auto-generated documentation for currency.js
 * Date: 2026-07-21
 */
// Currency utility for Ghana Cedis (GHS)
// Usage: GHS(19.99) → '₵19.99'  |  GHS0(19.99) → '₵20'

const CEDI = '\u20B5'; // Ghana Cedi symbol ₵

export /**
 * Arrow Function GHS
 * @param {any} amount
 * @returns {any}
 */
const GHS = amount => {
  const cleanAmount = typeof amount === 'string' ? amount.replace(/[^0-9.-]+/g, '') : amount;
  const num = parseFloat(cleanAmount) || 0;
  return CEDI + num.toFixed(2);
};
export /**
 * Arrow Function GHS0
 * @param {any} amount
 * @returns {any}
 */
const GHS0 = amount => {
  const cleanAmount = typeof amount === 'string' ? amount.replace(/[^0-9.-]+/g, '') : amount;
  const num = parseFloat(cleanAmount) || 0;
  return CEDI + num.toFixed(0);
};
export default GHS;