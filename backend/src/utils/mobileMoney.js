// Payment-method rules for checkout.
// Mobile Money is offered only in portfolio/demo mode: the live gateway (Stripe) cannot take
// MoMo, so live mode refuses it until a MoMo provider is connected.

// Mobile network prefixes (first three digits of a 10-digit Ghana number).
const MOMO_NETWORKS = {
  momo_mtn: { label: 'MTN Mobile Money', prefixes: ['024', '025', '053', '054', '055', '059'] },
  momo_voda: { label: 'Telecel Cash', prefixes: ['020', '050'] },
  momo_at: { label: 'AT Money', prefixes: ['026', '027', '056', '057'] }
};
const CARD = 'card';

/** Returns a 10-digit local Ghana number (e.g. 0241234567) or null. Accepts 0XX…, +233XX…, 233XX… and XX…. */
function normaliseGhanaPhone(value) {
  if (typeof value !== 'string') return null;
  let digits = value.replace(/[\s().-]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.startsWith('233') && digits.length === 12) digits = '0' + digits.slice(3);
  else if (digits.length === 9) digits = '0' + digits;
  return /^0\d{9}$/.test(digits) ? digits : null;
}

/** Checks the payment choice in a checkout request. Never returns or stores more of the phone than needed. */
function validatePayment({ payment_method = CARD, momo_phone } = {}, { demo }) {
  if (payment_method === CARD) return { ok: true, method: CARD };
  const network = MOMO_NETWORKS[payment_method];
  if (!network) return { ok: false, error: 'Choose a supported payment method.' };
  if (!demo) return { ok: false, error: 'Mobile Money is not available yet. Please pay by card.' };
  const phone = normaliseGhanaPhone(momo_phone);
  if (!phone) return { ok: false, error: 'Enter your 10-digit Mobile Money number, for example 024 123 4567.' };
  if (!network.prefixes.includes(phone.slice(0, 3))) {
    return { ok: false, error: `${phone.slice(0, 3)} is not a ${network.label} number. Check the number or choose a different network.` };
  }
  return { ok: true, method: payment_method, phone };
}

module.exports = { MOMO_NETWORKS, normaliseGhanaPhone, validatePayment };
