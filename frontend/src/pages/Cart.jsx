/**
 * File: Cart.jsx
 * Description: Auto-generated documentation for Cart.jsx
 * Date: 2026-07-21
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import GHS from '../utils/currency';
import { IconShoppingCart, IconLock, IconAlertTriangle, IconArrowLeft, IconArrowRight, IconTrash } from '@tabler/icons-react';
import PageTransition from '../components/PageTransition';
export default /**
 * Function Cart
 * @returns {any}
 */
function Cart() {
  const {
    cart,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();
  const navigate = useNavigate();
  const [removing, setRemoving] = useState({});
  /**
 * Arrow Function handleRemove
 * @param {any} sku
 * @returns {any}
 */
  const handleRemove = async sku => {
    setRemoving(r => ({
      ...r,
      [sku]: true
    }));
    await removeFromCart(sku);
    setRemoving(r => ({
      ...r,
      [sku]: false
    }));
  };
  /**
 * Arrow Function handleUpdateQty
 * @param {any} sku
 * @param {any} qty
 * @returns {any}
 */
  const handleUpdateQty = async (sku, qty) => {
    if (qty < 1) return handleRemove(sku);
    await updateQuantity(sku, qty);
  };
  if (loading) {
    return <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 tracking-tight">Your Cart</h1>
        <div className="flex flex-col gap-6 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="w-full h-32 bg-surface-variant/50 rounded-2xl"></div>)}
        </div>
      </div>;
  }
  if (!cart || cart.items.length === 0) return (
    <PageTransition className="w-full max-w-[1440px] mx-auto px-4 md:px-8 pt-24 pb-20 flex-grow">
      <div className="flex flex-col items-center justify-center py-24 text-center bg-surface border border-outline/30 rounded-3xl mt-8">
        <div className="w-24 h-24 bg-surface-variant/50 rounded-full flex items-center justify-center text-primary mb-8 border border-outline/30">
          <IconShoppingCart size={40} stroke={1.5} />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">Your cart is empty</h2>
        <p className="text-lg text-on-surface-variant mb-10 max-w-md">Looks like you haven't added anything yet. Discover our curated essentials.</p>
        <Link to="/products" className="bg-primary text-white px-8 py-4 rounded-full font-semibold shadow-sm hover:shadow-level-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
          Start Shopping
        </Link>
      </div>
    </PageTransition>
  );
  const grandTotal = cart.total; // plus shipping/tax later
  return (
    <PageTransition className="w-full pb-32">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 pt-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 tracking-tight">Your Cart</h1>
          <p className="text-lg text-on-surface-variant">{cart.item_count} items in your cart.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {cart.items.map(item => <div key={item.sku} className={`flex gap-6 md:gap-8 bg-surface p-4 md:p-6 rounded-[2rem] border border-outline/30 shadow-sm transition-all duration-300
                  ${removing[item.sku] ? 'opacity-50 scale-95' : 'hover:shadow-level-1'}
                `}>
                <Link to={`/products/${item.product_id}`} className="w-24 h-24 md:w-36 md:h-36 shrink-0 bg-surface-variant/30 rounded-2xl overflow-hidden">
                  <img src={item.variant_image || item.product_image || 'https://placehold.co/400x400/FAFAFA/333333.png?text=Product'} alt={item.product_name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500 mix-blend-multiply" />
                </Link>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">{item.category_name || 'Category'}</span>
                      <Link to={`/products/${item.product_id}`} className="block text-xl md:text-2xl font-bold text-primary hover:text-secondary transition-colors leading-tight mt-1.5 mb-1.5">
                        {item.product_name}
                      </Link>
                      {item.variant_name && <p className="text-sm font-medium text-on-surface-variant">{item.variant_name}</p>}
                    </div>
                    <div className="text-right shrink-0 hidden md:block">
                      <p className="text-2xl font-bold text-primary tracking-tight">{GHS(item.price * item.quantity)}</p>
                      <p className="text-sm text-on-surface-variant font-medium mt-1">{GHS(item.price)} each</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-surface border border-outline/50 rounded-full h-10 px-1 shadow-sm">
                        <button onClick={() => handleUpdateQty(item.sku, item.quantity - 1)} className="w-8 h-full flex items-center justify-center rounded-full text-primary font-medium text-lg active:scale-95 transition-transform">−</button>
                        <span className="w-8 text-center font-bold text-primary text-sm">{item.quantity}</span>
                        <button onClick={() => handleUpdateQty(item.sku, item.quantity + 1)} disabled={item.quantity >= item.available_stock} className="w-8 h-full flex items-center justify-center rounded-full text-primary font-medium text-lg active:scale-95 transition-transform disabled:opacity-50">+</button>
                      </div>
                      
                      {item.available_stock < item.quantity && <span className="text-xs font-bold text-error flex items-center gap-1 uppercase tracking-wider">
                          <IconAlertTriangle size={14} /> Only {item.available_stock} left
                        </span>}
                    </div>
                    
                    <div className="flex items-center gap-4 border-t border-outline/30 md:border-none pt-3 md:pt-0">
                      <div className="text-left shrink-0 md:hidden flex-1">
                        <p className="text-xl font-bold text-primary">{GHS(item.price * item.quantity)}</p>
                      </div>
                      <button onClick={() => handleRemove(item.sku)} className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 text-sm font-semibold active:scale-95">
                        <IconTrash size={18} stroke={1.5} /> <span className="hidden md:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>)}

            <div className="flex justify-between items-center mt-6 px-2">
              <Link to="/products" className="text-sm font-semibold text-primary hover:text-secondary flex items-center gap-2 active:scale-95 transition-colors group">
                <IconArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-sm font-semibold text-on-surface-variant hover:text-error underline active:scale-95 transition-colors">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-surface border border-outline/30 rounded-[2rem] p-8 sticky top-24 shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-6 pb-4 border-b border-outline/30">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between text-lg text-on-surface-variant font-medium">
                  <span>Subtotal ({cart.item_count} items)</span>
                  <span className="font-bold text-primary">{GHS(cart.total)}</span>
                </div>
                <div className="flex justify-between text-lg text-on-surface-variant font-medium">
                  <span>Estimated Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-lg text-on-surface-variant font-medium items-center">
                  <span>Campus Delivery</span>
                  <span className="font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full text-sm border border-secondary/20">Free</span>
                </div>
              </div>
              
              <div className="h-px bg-outline/30 w-full mb-8" />
              
              <div className="flex justify-between items-end mb-10">
                <span className="text-xl font-medium text-on-surface-variant">Total</span>
                <span className="font-headline-xl text-5xl font-bold tracking-tight text-primary leading-none">{GHS(grandTotal)}</span>
              </div>
              
              <button onClick={() => navigate('/checkout')} className="w-full bg-primary text-white py-4 rounded-full font-semibold text-lg hover:bg-primary-fixed shadow-sm hover:shadow-level-2 active:scale-95 transition-all flex items-center justify-center gap-2 group">
                Proceed to Checkout <IconArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-on-surface-variant">
                <IconLock size={16} stroke={1.5} /> Secure Campus Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}