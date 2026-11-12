// Mirrors backend/src/utils/mobileMoney.js so the buyer gets instant feedback;
// the server re-checks every value.
import { portfolioDemo } from './demo';

export const MOMO_NETWORKS = {
  momo_mtn: { label: 'MTN Mobile Money', sub: 'Numbers starting 024, 025, 053, 054, 055, 059', prefixes: ['024', '025', '053', '054', '055', '059'] },
  momo_voda: { label: 'Telecel Cash', sub: 'Formerly Vodafone Cash · 020, 050', prefixes: ['020', '050'] },
  momo_at: { label: 'AT Money', sub: 'Formerly AirtelTigo Money · 026, 027, 056, 057', prefixes: ['026', '027', '056', '057'] }
};
export const isMomo = method => Boolean(MOMO_NETWORKS[method]);

// Mobile Money is listed first because it is how most students pay. It is simulated until a
// MoMo provider is connected, so it only appears in portfolio/demo mode.
export const PAYMENT_METHODS = [
  ...(portfolioDemo ? Object.entries(MOMO_NETWORKS).map(([id, n]) => ({ id, label: n.label, sub: n.sub })) : []),
  { id: 'card', label: 'Debit / Credit Card', sub: 'Visa, Mastercard' }
];
export const DEFAULT_PAYMENT_METHOD = PAYMENT_METHODS[0].id;
export const paymentLabel = method => PAYMENT_METHODS.find(m => m.id === method)?.label || 'Debit / Credit Card';

export function normaliseGhanaPhone(value) {
  if (typeof value !== 'string') return null;
  let digits = value.replace(/[\s().-]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.startsWith('233') && digits.length === 12) digits = '0' + digits.slice(3);
  else if (digits.length === 9) digits = '0' + digits;
  return /^0\d{9}$/.test(digits) ? digits : null;
}

/** Returns an error message, or '' when the number suits the chosen network. */
export function momoPhoneError(method, value) {
  const network = MOMO_NETWORKS[method];
  if (!network) return '';
  const phone = normaliseGhanaPhone(value);
  if (!phone) return 'Enter your 10-digit Mobile Money number, for example 024 123 4567.';
  if (!network.prefixes.includes(phone.slice(0, 3))) return `${phone.slice(0, 3)} is not a ${network.label} number. Check the number or choose a different network.`;
  return '';
}

/** "024 ••• 4567": enough for the buyer to recognise their own number. */
export const maskPhone = value => {
  const phone = normaliseGhanaPhone(value);
  return phone ? `${phone.slice(0, 3)} ••• ${phone.slice(6)}` : '';
};
