/**
 * File: MiniCart.jsx
 * Description: Auto-generated documentation for MiniCart.jsx
 * Date: 2026-07-21
 */
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { IconX, IconTrash, IconArrowRight, IconShoppingCart } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import GHS from '../utils/currency';
import {useToast} from '../context/ToastContext';
export default /**
 * Function MiniCart
 * @returns {any}
 */
function MiniCart() {
  const {showToast}=useToast();
  const report=err=>showToast(err.response?.data?.error || 'Could not update cart.','error');
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    isGuestCart
  } = useCart();
  const stepBtn = 'w-7 h-full flex items-center justify-center text-on-surface-variant hover:text-on-surface disabled:opacity-40';
  return <AnimatePresence>
      {isCartOpen && <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/35 z-[60]" />

          {/* Drawer */}
          <motion.div role="dialog" aria-modal="true" aria-labelledby="minicart-title" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }} className="fixed top-0 right-0 h-[100dvh] w-full max-w-[380px] bg-background shadow-level-3 z-[70] flex flex-col border-l border-outline-variant">
            <div className="h-14 px-4 flex items-center justify-between border-b border-outline-variant bg-surface">
              <h2 id="minicart-title" className="text-[15px] font-bold text-on-surface">Your cart{cart?.item_count ? <span className="ml-1.5 text-on-surface-variant font-medium">({cart.item_count})</span> : null}</h2>
              <button aria-label="Close cart" onClick={() => setIsCartOpen(false)} className="icon-btn">
                <IconX size={18} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 hide-scrollbar">
              {!cart?.items || cart.items.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center">
                  <span className="w-12 h-12 bg-surface-variant rounded-full flex items-center justify-center text-on-surface-variant mb-3">
                    <IconShoppingCart size={22} stroke={1.6} />
                  </span>
                  <h3 className="section-title">Your cart is empty</h3>
                  <p className="text-sm text-on-surface-variant mt-1">Add something you like and it will show up here.</p>
                  <button onClick={() => setIsCartOpen(false)} className="btn-outline btn-sm mt-4">
                    Continue shopping
                  </button>
                </div> : <ul className="list-group">
                  {cart.items.map(item => <li key={item.sku} className="flex gap-3 p-3">
                      <div className="w-16 h-16 rounded-lg bg-surface-variant overflow-hidden shrink-0">
                        {item.variant_image || item.product_image ? <img src={item.variant_image || item.product_image} alt="" className="w-full h-full object-cover" /> : null}
                      </div>
                      <div className="flex-grow min-w-0 flex flex-col">
                        <p className="text-[13px] font-semibold text-on-surface line-clamp-1">{item.product_name || item.sku}</p>
                        {item.variant_name && <p className="text-xs text-on-surface-variant line-clamp-1">{item.variant_name}</p>}
                        <div className="mt-auto pt-1.5 flex items-center justify-between gap-2">
                          <div className="flex items-center h-7 rounded-md border border-outline bg-surface" role="group" aria-label={`Quantity of ${item.product_name || item.sku}`}>
                            <button onClick={() => updateQuantity(item.sku, item.quantity - 1).catch(report)} className={stepBtn} aria-label="Decrease quantity">−</button>
                            <span className="w-6 text-center text-[13px] font-semibold tabular">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.sku, item.quantity + 1).catch(report)} disabled={item.quantity >= item.available_stock} className={stepBtn} aria-label="Increase quantity">+</button>
                          </div>
                          <span className="text-[13px] font-bold text-on-surface tabular">{GHS(item.price * item.quantity)}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.sku).catch(report)} aria-label={`Remove ${item.product_name || item.sku}`} className="icon-btn w-7 h-7 self-start text-on-surface-variant hover:text-error hover:bg-error-container/60">
                        <IconTrash size={15} stroke={1.7} />
                      </button>
                    </li>)}
                </ul>}
            </div>

            {cart?.items && cart.items.length > 0 && <div className="p-4 border-t border-outline-variant bg-surface">
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-sm text-on-surface-variant">Subtotal</span>
                  <span className="text-lg font-extrabold text-on-surface tabular">{GHS(cart.total)}</span>
                </div>
                <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="btn-primary w-full">
                  Checkout <IconArrowRight size={16} />
                </Link>
                <Link to="/cart" onClick={() => setIsCartOpen(false)} className="btn-ghost btn-sm w-full mt-1">
                  View full cart
                </Link>
                {isGuestCart && <p className="mt-2 text-xs text-center text-on-surface-variant">You will sign in or create an account at checkout. Your cart comes with you.</p>}
              </div>}
          </motion.div>
        </>}
    </AnimatePresence>;
}
