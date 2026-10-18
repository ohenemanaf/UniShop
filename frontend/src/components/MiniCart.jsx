/**
 * File: MiniCart.jsx
 * Description: Auto-generated documentation for MiniCart.jsx
 * Date: 2026-07-21
 */
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { IconX, IconTrash, IconArrowRight } from '@tabler/icons-react';
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
    updateQuantity
  } = useCart();
  return <AnimatePresence>
      {isCartOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />

          {/* Drawer */}
          <motion.div initial={{
        x: '100%'
      }} animate={{
        x: 0
      }} exit={{
        x: '100%'
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 200
      }} className="fixed top-0 right-0 h-[100dvh] w-full max-w-[400px] bg-surface shadow-level-3 z-[70] flex flex-col border-l border-outline/30">
            <div className="flex items-center justify-between p-6 border-b border-outline/30 bg-surface-variant/30">
              <h2 className="text-2xl font-bold text-primary tracking-tight">Your Cart</h2>
              <button aria-label="Close cart" onClick={() => setIsCartOpen(false)} className="p-2 bg-surface rounded-full text-on-surface-variant hover:text-primary hover:bg-outline transition-colors active:scale-95">
                <IconX size={20} stroke={1.5} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 hide-scrollbar">
              {!cart?.items || cart.items.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-surface-variant rounded-full flex items-center justify-center text-primary/30 mb-2">
                    <IconX size={40} stroke={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-primary">Your cart is empty</h3>
                  <p className="text-on-surface-variant">Looks like you haven't added any essentials yet.</p>
                  <button onClick={() => setIsCartOpen(false)} className="btn-outline mt-4">
                    Start Shopping
                  </button>
                </div> : <div className="space-y-6">
                  {cart.items.map(item => <div key={item.sku} className="flex gap-4 p-4 rounded-2xl bg-surface-variant/20 border border-outline/30">
                      <div className="w-20 h-20 rounded-xl bg-surface-variant flex items-center justify-center overflow-hidden shrink-0">
                        {item.variant_image || item.product_image ? <img src={item.variant_image || item.product_image} alt={item.product_name || item.sku} className="w-full h-full object-cover mix-blend-multiply" /> : <span className="text-xs text-on-surface-variant font-medium">No Img</span>}
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-primary line-clamp-1">{item.product_name || item.sku}</h4>
                          {item.variant_name && <p className="text-xs text-on-surface-variant">{item.variant_name}</p>}
                          <p className="text-sm font-bold text-primary mt-1">{GHS(item.price)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 bg-surface border border-outline rounded-lg px-2 py-1">
                            <button onClick={() => updateQuantity(item.sku, item.quantity - 1).catch(report)} className="text-on-surface-variant hover:text-primary transition-colors font-bold text-lg leading-none">-</button>
                            <span className="text-sm font-bold text-primary w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.sku, item.quantity + 1).catch(report)} disabled={item.quantity >= item.available_stock} className="text-on-surface-variant hover:text-primary transition-colors font-bold text-lg leading-none">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.sku).catch(report)} className="p-1.5 text-error/70 hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                            <IconTrash size={18} stroke={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>)}
                </div>}
            </div>

            {cart?.items && cart.items.length > 0 && <div className="p-6 border-t border-outline/30 bg-surface-variant/30">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium text-on-surface-variant">Subtotal</span>
                  <span className="text-2xl font-black text-primary">{GHS(cart.total)}</span>
                </div>
                <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4">
                  Proceed to Checkout <IconArrowRight size={20} />
                </Link>
                <Link to="/cart" onClick={() => setIsCartOpen(false)} className="block text-center mt-4 text-sm font-bold text-secondary hover:text-primary transition-colors">
                  View Full Cart
                </Link>
              </div>}
          </motion.div>
        </>}
    </AnimatePresence>;
}