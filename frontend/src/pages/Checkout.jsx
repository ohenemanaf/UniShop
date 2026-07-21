/**
 * File: Checkout.jsx
 * Description: Auto-generated documentation for Checkout.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import GHS from '../utils/currency';
import { IconCircleCheck, IconPackage, IconCreditCard, IconDeviceMobile, IconBuildingBank, IconCash, IconAlertTriangle } from '@tabler/icons-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');
/**
 * Function CheckoutFormWrapper
 * @param {any} props
 * @returns {any}
 */
function CheckoutFormWrapper({
  grandTotal,
  onSuccess,
  onError
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  /**
 * Arrow Function handleSubmit
 * @param {any} e
 * @returns {any}
 */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    const {
      error,
      paymentIntent
    } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    });
    if (error) {
      onError(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      onError('Payment failed or is still processing.');
      setIsProcessing(false);
    }
  };
  return <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-variant">
        <PaymentElement />
      </div>
      <button type="submit" disabled={isProcessing || !stripe} className="w-full bg-primary text-white py-4 rounded-full font-semibold text-lg hover:bg-primary-fixed shadow-sm hover:shadow-level-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        {isProcessing ? 'Processing Payment...' : `Pay ${GHS(grandTotal)} Securely`}
      </button>
    </form>;
}
export default /**
 * Function Checkout
 * @returns {any}
 */
function Checkout() {
  const {
    cart,
    clearCart
  } = useCart();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    line1: '',
    line2: '',
    city: '',
    region: '',
    zip: '',
    country: 'Ghana',
    payment_method: 'momo_mtn'
  });
  const [validation, setValidation] = useState({});
  const [step, setStep] = useState(1);
  /**
 * Arrow Function validateField
 * @param {any} name
 * @param {any} value
 * @returns {any}
 */
  const validateField = (name, value) => {
    let err = '';
    if (name === 'zip' && value && !/^\d{5,6}$/.test(value.replace(/\s/g, ''))) err = 'ZIP code format appears invalid.';
    if (name === 'line1' && value && value.length < 5) err = 'Please provide a full street address.';
    if (name === 'city' && value && /\d/.test(value)) err = 'City name should not contain numbers.';
    setValidation(prev => ({
      ...prev,
      [name]: err
    }));
  };
  /**
 * Arrow Function handleBlur
 * @param {any} e
 * @returns {any}
 */
  const handleBlur = e => validateField(e.target.name, e.target.value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isMocked, setIsMocked] = useState(false);
  useEffect(() => {
    api.get('/auth/me').then(res => {
      if (res.data.address_line1) {
        setForm(f => ({
          ...f,
          line1: res.data.address_line1 || '',
          line2: res.data.address_line2 || '',
          city: res.data.city || '',
          region: res.data.state || '',
          zip: res.data.zip || '',
          country: res.data.country || 'Ghana'
        }));
      }
    }).catch(() => {});
  }, []);
  /**
 * Arrow Function handleChange
 * @param {any} e
 * @returns {any}
 */
  const handleChange = e => setForm({
    ...form,
    [e.target.name]: e.target.value
  });
  const subtotal = cart.total || 0;
  let discountAmount = 0;
  if (appliedPromo) {
    discountAmount = subtotal * appliedPromo.discount_percentage / 100;
  }
  // Free delivery over ₵500
  const shipping = subtotal >= 500 ? 0 : 15;
  const grandTotal = subtotal - discountAmount + shipping;
  /**
 * Arrow Function applyPromoCode
 * @returns {any}
 */
  const applyPromoCode = async () => {
    setPromoError('');
    if (!promoCodeInput) return;
    try {
      const res = await api.post('/orders/validate-promo', {
        promoCode: promoCodeInput
      });
      setAppliedPromo(res.data);
    } catch (err) {
      setPromoError(err.response?.data?.error || 'Invalid promo code');
      setAppliedPromo(null);
    }
  };
  const [orderId, setOrderId] = useState(null);
  /**
 * Arrow Function initPaymentIntent
 * @returns {any}
 */
  const initPaymentIntent = async () => {
    setError('');
    if (!form.line1 || !form.city || !form.zip) {
      setError('Please fill in all required address fields first.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/stripe/create-payment-intent', {
        items: cart.items,
        promoCode: appliedPromo?.code,
        shipping_address: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.region,
          zip: form.zip,
          country: form.country
        },
        payment_method: form.payment_method
      });
      setClientSecret(res.data.clientSecret);
      setIsMocked(res.data.mocked);
      setOrderId(res.data.orderId);
    } catch {
      setError('Failed to initialize payment.');
    } finally {
      setLoading(false);
    }
  };
  /**
 * Arrow Function handlePaymentSuccess
 * @returns {any}
 */
  const handlePaymentSuccess = () => {
    setSuccess(orderId);
    clearCart();
  };
  /**
 * Arrow Function handleAlternativeSubmit
 * @param {any} e
 * @returns {any}
 */
  const handleAlternativeSubmit = async e => {
    e.preventDefault();
    if (!orderId) {
      setError('Missing order ID. Please refresh and try again.');
      return;
    }
    setLoading(true);
    try {
      // Hit the mock webhook endpoint to simulate Stripe's payment_intent.succeeded
      await api.post('/stripe/webhook/mock', {
        order_id: orderId
      });
      handlePaymentSuccess();
    } catch (err) {
      setError('Mock checkout failed');
      setLoading(false);
    }
  };
  if (success) {
    return <div className="w-full min-h-[70vh] flex items-center justify-center p-4 md:p-8">
        <div className="max-w-[448px] w-full bg-surface p-10 rounded-[2rem] text-center shadow-level-1 border border-outline/30 flex flex-col items-center">
          <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 border border-success/20">
             <IconCircleCheck size={48} stroke={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-3 tracking-tight">Order Confirmed!</h1>
          <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
            Thank you for your purchase. Your order <strong>#{success.substring(0, 8)}</strong> is confirmed.
          </p>
          <button className="w-full bg-primary text-white py-4 rounded-full font-semibold active:scale-95 hover:bg-primary-fixed shadow-sm transition-all" onClick={() => navigate('/orders')}>
            View My Orders
          </button>
        </div>
      </div>;
  }
  if (!cart || cart.items.length === 0) {
    return <div className="w-full min-h-[60vh] flex items-center justify-center p-8 text-center flex-col">
        <h2 className="text-3xl font-bold text-primary mb-6 tracking-tight">Your cart is empty</h2>
        <button className="bg-primary text-white px-8 py-4 rounded-full font-semibold active:scale-95 shadow-sm transition-all" onClick={() => navigate('/products')}>
          Continue Shopping
        </button>
      </div>;
  }
  return <div className="w-full pb-20 pt-24 bg-background">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 tracking-tight">Checkout</h1>
          <p className="text-lg text-on-surface-variant">Complete your order securely.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Checkout Form */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            
            {/* Stepper */}
            <div className="flex items-center justify-between mb-2 relative px-4">
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-outline/50 -z-10 rounded-full"></div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500" style={{
              width: step === 1 ? '0%' : step === 2 ? '50%' : 'calc(100% - 32px)'
            }}></div>
              
              {[{
              num: 1,
              label: 'Shipping'
            }, {
              num: 2,
              label: 'Payment'
            }, {
              num: 3,
              label: 'Review'
            }].map(s => <div key={s.num} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${step >= s.num ? 'bg-primary text-white' : 'bg-surface border-2 border-outline/50 text-on-surface-variant'}`}>
                    {s.num}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-primary' : 'text-on-surface-variant'}`}>{s.label}</span>
                </div>)}
            </div>

            {/* Step 1: Shipping Address */}
            {step === 1 && <div className="bg-surface rounded-[2rem] p-6 md:p-8 border border-outline/30 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-3 border-b border-outline/30 pb-4">
                  <div className="w-10 h-10 rounded-full bg-surface-variant text-primary flex items-center justify-center border border-outline/50">
                     <IconPackage size={20} stroke={1.5} />
                  </div>
                  Shipping Address
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Address Line 1 *</label>
                    <input name="line1" onBlur={handleBlur} className={`bg-surface-variant w-full p-4 rounded-xl border outline-none transition-colors ${validation.line1 ? 'border-error focus:border-error bg-error/5' : 'border-transparent focus:border-outline/50 focus:bg-surface'}`} placeholder="Street address" value={form.line1} onChange={handleChange} required />
                    {validation.line1 && <span className="text-error text-xs font-medium mt-1 animate-in slide-in-from-top-1 fade-in duration-200">{validation.line1}</span>}
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Address Line 2</label>
                    <input name="line2" onBlur={handleBlur} className="bg-surface-variant w-full p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors" placeholder="Apt, suite, etc." value={form.line2} onChange={handleChange} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">City *</label>
                    <input name="city" onBlur={handleBlur} className={`bg-surface-variant w-full p-4 rounded-xl border outline-none transition-colors ${validation.city ? 'border-error focus:border-error bg-error/5' : 'border-transparent focus:border-outline/50 focus:bg-surface'}`} placeholder="City" value={form.city} onChange={handleChange} required />
                    {validation.city && <span className="text-error text-xs font-medium mt-1 animate-in slide-in-from-top-1 fade-in duration-200">{validation.city}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Region *</label>
                    <select name="region" className="bg-surface-variant w-full p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors appearance-none cursor-pointer" value={form.region} onChange={handleChange}>
                      <option value="">Select Region</option>
                      {['Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Northern', 'Upper East', 'Upper West', 'Volta', 'Brong-Ahafo', 'Savannah', 'North East', 'Bono East', 'Ahafo', 'Oti', 'Western North'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">ZIP Code *</label>
                    <input name="zip" onBlur={handleBlur} className={`bg-surface-variant w-full p-4 rounded-xl border outline-none transition-colors ${validation.zip ? 'border-error focus:border-error bg-error/5' : 'border-transparent focus:border-outline/50 focus:bg-surface'}`} placeholder="ZIP" value={form.zip} onChange={handleChange} required />
                    {validation.zip && <span className="text-error text-xs font-medium mt-1 animate-in slide-in-from-top-1 fade-in duration-200">{validation.zip}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Country</label>
                    <select name="country" className="bg-surface-variant w-full p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors appearance-none cursor-pointer" value={form.country} onChange={handleChange}>
                      <option>Ghana</option>
                    </select>
                  </div>
                </div>

                <button onClick={() => {
              if (!form.line1 || !form.city || !form.zip) {
                setError('Please fill in all required address fields.');
                return;
              }
              setError('');
              setStep(2);
            }} className="btn-primary w-full mt-8">
                  Continue to Payment
                </button>
              </div>}

            {/* Step 2: Payment Method */}
            {step === 2 && <div className="bg-surface rounded-[2rem] p-6 md:p-8 border border-outline/30 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-3 border-b border-outline/30 pb-4">
                  <div className="w-10 h-10 rounded-full bg-surface-variant text-primary flex items-center justify-center border border-outline/50">
                     <IconCreditCard size={20} stroke={1.5} />
                  </div>
                  Payment Method
                </h2>
                
                <div className="flex flex-col gap-3">
                  {[{
                id: 'momo_mtn',
                label: 'MTN Mobile Money',
                sub: 'Pay via MTN MoMo',
                icon: <IconDeviceMobile size={20} stroke={1.5} />
              }, {
                id: 'momo_voda',
                label: 'Vodafone Cash',
                sub: 'Pay via Vodafone Cash',
                icon: <IconDeviceMobile size={20} stroke={1.5} />
              }, {
                id: 'momo_at',
                label: 'AirtelTigo Money',
                sub: 'Pay via AirtelTigo',
                icon: <IconDeviceMobile size={20} stroke={1.5} />
              }, {
                id: 'card',
                label: 'Debit / Credit Card',
                sub: 'Visa, Mastercard, etc.',
                icon: <IconCreditCard size={20} stroke={1.5} />
              }, {
                id: 'bank',
                label: 'Bank Transfer (GH)',
                sub: 'GCB, Ecobank, Stanbic…',
                icon: <IconBuildingBank size={20} stroke={1.5} />
              }, {
                id: 'cod',
                label: 'Cash on Delivery',
                sub: 'Pay when item arrives',
                icon: <IconCash size={20} stroke={1.5} />
              }].map(method => <label key={method.id} className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border-2
                        ${form.payment_method === method.id ? 'border-primary bg-surface-variant/30 shadow-sm' : 'border-transparent bg-surface-variant/50 hover:bg-surface-variant'}
                      `}>
                      <input type="radio" name="payment_method" value={method.id} checked={form.payment_method === method.id} onChange={e => {
                  handleChange(e);
                  setClientSecret('');
                }} className="w-5 h-5 accent-primary" />
                      <div className="ml-4 flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${form.payment_method === method.id ? 'bg-primary text-white' : 'bg-surface text-on-surface-variant'}`}>
                          {method.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">{method.label}</p>
                          <p className="text-xs text-on-surface-variant font-medium">{method.sub}</p>
                        </div>
                      </div>
                    </label>)}
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1">Review Order</button>
                </div>
              </div>}

            {/* Step 3: Review */}
            {step === 3 && <div className="bg-surface rounded-[2rem] p-6 md:p-8 border border-outline/30 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-3 border-b border-outline/30 pb-4">
                  <div className="w-10 h-10 rounded-full bg-surface-variant text-primary flex items-center justify-center border border-outline/50">
                     <IconCircleCheck size={20} stroke={1.5} />
                  </div>
                  Review & Complete
                </h2>
                
                <div className="mb-8 p-5 bg-surface-variant/30 rounded-2xl border border-outline/30">
                  <p className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Shipping To</p>
                  <p className="text-primary font-bold text-lg mb-1">{user?.name || 'Customer'}</p>
                  <p className="text-on-surface-variant font-medium">{form.line1}, {form.city}, {form.region} {form.zip}</p>
                  <button onClick={() => setStep(1)} className="text-secondary text-sm font-bold mt-3 hover:underline">Edit Address</button>
                </div>

                <div className="mb-8 p-5 bg-surface-variant/30 rounded-2xl border border-outline/30">
                  <p className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Payment Method</p>
                  <p className="text-primary font-bold text-lg capitalize">
                    {form.payment_method === 'momo_mtn' ? 'MTN Mobile Money' : form.payment_method === 'momo_voda' ? 'Vodafone Cash' : form.payment_method === 'momo_at' ? 'AirtelTigo Money' : form.payment_method === 'card' ? 'Debit / Credit Card' : form.payment_method === 'bank' ? 'Bank Transfer (GH)' : 'Cash on Delivery'}
                  </p>
                  <button onClick={() => {
                setStep(2);
                setClientSecret('');
              }} className="text-secondary text-sm font-bold mt-3 hover:underline">Change Method</button>
                </div>

                {form.payment_method === 'card' && <div className="mt-4 border-t border-outline/30 pt-6">
                    {!clientSecret ? <button onClick={initPaymentIntent} disabled={loading} className="btn-primary w-full">
                        {loading ? 'Initializing...' : 'Proceed to Card Details'}
                      </button> : isMocked ? <div className="flex flex-col gap-4">
                         <div className="bg-error/10 text-error p-4 rounded-xl text-sm font-medium border border-error/20">
                           Stripe Secret Key is missing in backend (.env). Mocking payment success.
                         </div>
                         <button className="btn-primary w-full" onClick={handleAlternativeSubmit} disabled={loading}>
                           {loading ? 'Processing...' : `Place Mock Order — ${GHS(grandTotal)}`}
                         </button>
                       </div> : <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Elements stripe={stripePromise} options={{
                  clientSecret,
                  appearance: {
                    theme: 'flat',
                    variables: {
                      fontFamily: 'Inter, sans-serif',
                      colorPrimary: '#4F46E5',
                      borderRadius: '12px'
                    }
                  }
                }}>
                          <CheckoutFormWrapper grandTotal={grandTotal} onSuccess={handlePaymentSuccess} onError={setError} />
                        </Elements>
                      </div>}
                  </div>}

                {form.payment_method !== 'card' && <div className="mt-4 border-t border-outline/30 pt-6">
                    <button onClick={handleAlternativeSubmit} disabled={loading} className="btn-primary w-full">
                      {loading ? 'Processing...' : `Place Order — ${GHS(grandTotal)}`}
                    </button>
                  </div>}
              </div>}

            {error && <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl font-medium flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-2">
                <IconAlertTriangle size={20} /> {error}
              </div>}

          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-surface rounded-[2rem] p-6 md:p-8 sticky top-24 border border-outline/30 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-6 border-b border-outline/30 pb-4">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 hide-scrollbar">
                {cart.items.map(item => <div key={item.sku} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 bg-surface-variant rounded-lg overflow-hidden shrink-0 border border-outline/30">
                      <img src={item.variant_image || item.product_image} alt={item.product_name} className="w-full h-full object-cover mix-blend-multiply" />
                      <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary truncate">{item.product_name}</p>
                      <p className="text-xs font-medium text-on-surface-variant truncate">{item.variant_name}</p>
                    </div>
                    <div className="text-sm font-bold text-primary shrink-0">
                      {GHS(item.price * item.quantity)}
                    </div>
                  </div>)}
              </div>

              <div className="mb-6 flex gap-2">
                <input type="text" placeholder="Promo code" value={promoCodeInput} onChange={e => setPromoCodeInput(e.target.value.toUpperCase())} className="flex-1 bg-surface-variant p-3 rounded-xl border border-transparent focus:border-outline/50 outline-none text-sm font-medium transition-colors" />
                <button onClick={applyPromoCode} className="bg-surface border border-outline/50 hover:border-primary text-primary px-6 rounded-xl font-semibold text-sm active:scale-95 transition-all">
                  Apply
                </button>
              </div>
              {promoError && <p className="text-error text-xs font-semibold mt-[-16px] mb-4">{promoError}</p>}
              {appliedPromo && <p className="text-secondary text-xs font-semibold mt-[-16px] mb-4">Promo applied: {appliedPromo.discount_percentage}% off</p>}

              <div className="flex flex-col gap-3 mb-6 text-sm font-medium text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-primary">{GHS(subtotal)}</span>
                </div>
                {discountAmount > 0 && <div className="flex justify-between text-secondary">
                    <span>Discount</span>
                    <span>-{GHS(discountAmount)}</span>
                  </div>}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-primary">{shipping === 0 ? 'FREE' : GHS(shipping)}</span>
                </div>
              </div>
              
              <div className="h-px bg-outline/30 w-full mb-6" />
              
              <div className="flex justify-between items-end">
                <span className="text-lg text-primary font-bold">Total</span>
                <span className="text-3xl font-black text-primary leading-none tracking-tight">{GHS(grandTotal)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>;
}