/**
 * File: ProductCard.jsx
 * Description: Auto-generated documentation for ProductCard.jsx
 * Date: 2026-07-21
 */
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { IconStar, IconStarFilled, IconHeart, IconHeartFilled, IconPlus, IconLoader2 } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { GHS0 } from '../utils/currency';
const MotionLink = motion(Link);
/**
 * Function StarRating
 * @param {any} props
 * @returns {any}
 */
function StarRating({
  rating,
  count
}) {
  return <div className="flex items-center gap-0.5 md:gap-1">
      {[1, 2, 3, 4, 5].map(i => i <= Math.round(rating) ? <IconStarFilled key={i} size={14} className="text-secondary w-3 h-3 md:w-3.5 md:h-3.5" /> : <IconStar key={i} size={14} className="text-outline w-3 h-3 md:w-3.5 md:h-3.5" />)}
      {count !== undefined && <span className="font-medium text-on-surface-variant ml-1 text-[10px] md:text-[11px]">({count})</span>}
    </div>;
}
export default /**
 * Function ProductCard
 * @param {any} props
 * @returns {any}
 */
function ProductCard({
  product,
  wishlistIds = [],
  onWishlistChange
}) {
  const {
    addToCart
  } = useCart();
  const {
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(wishlistIds.includes(product.id));
  const [adding, setAdding] = useState(false);

  // Optimistic Wishlist Toggle
  const toggleWishlist = async e => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    const wasWishlisted = wishlisted;
    setWishlisted(!wasWishlisted);
    try {
      if (wasWishlisted) {
        await api.delete(`/wishlist/${product.id}`);
      } else {
        await api.post('/wishlist', {
          product_id: product.id
        });
      }
      onWishlistChange?.(product.id, !wasWishlisted);
    } catch {
      setWishlisted(wasWishlisted);
    }
  };
  /**
 * Arrow Function handleAddToCart
 * @param {any} e
 * @returns {any}
 */
  const handleAddToCart = async e => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (adding) return;
    setAdding(true);
    try {
      // Fetch the first active variant SKU — product list doesn't return SKUs
      const res = await api.get(`/products/${product.id}`);
      const firstVariant = res.data.variants?.[0];
      if (!firstVariant) return;
      await addToCart(firstVariant.sku, 1);
    } catch (err) {
      console.error('Quick add failed:', err);
    } finally {
      setAdding(false);
    }
  };
  const price = product.min_price ?? product.price;
  const comparePrice = product.compare_price;
  const discount = comparePrice && comparePrice > price;
  const isOutOfStock = product.total_stock !== undefined && product.total_stock <= 0;
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return <MotionLink to={`/products/${product.id}`} variants={itemVariants} whileHover={{
    y: -6
  }} whileTap={{
    scale: 0.98
  }} className="group relative bg-transparent flex flex-col product-card min-w-0">
      <div className="relative aspect-[3/4] w-full bg-surface-variant overflow-hidden shrink-0 rounded-[3px] shadow-sm group-hover:shadow-level-1 transition-shadow duration-500">
        <img src={product.image_url || 'https://placehold.co/800x1000/F1F5F9/333333.png?text=Product'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply" loading="lazy" />
        
        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:opacity-100">
          <button onClick={toggleWishlist} className={`bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-90 border border-white/40 ${wishlisted ? 'text-secondary' : 'text-on-surface-variant hover:text-primary'}`}>
            {wishlisted ? <IconHeartFilled size={18} className="text-secondary w-4 h-4 md:w-5 md:h-5" /> : <IconHeart size={18} className="w-4 h-4 md:w-5 md:h-5" stroke={1.5} />}
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {discount && <span className="bg-primary text-white font-bold text-[9px] md:text-[10px] uppercase px-2 py-1 md:px-2.5 md:py-1 rounded-md tracking-wider shadow-sm">Sale</span>}
          {isOutOfStock && <span className="bg-error text-white font-bold text-[9px] md:text-[10px] uppercase px-2 py-1 md:px-2.5 md:py-1 rounded-md tracking-wider shadow-sm">Sold Out</span>}
        </div>

        {/* Quick Add Overlay */}
        {!isOutOfStock && <div className="absolute bottom-0 left-0 w-full p-3 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden md:block">
            <button onClick={handleAddToCart} disabled={adding} className="w-full bg-white/90 backdrop-blur-md hover:bg-primary text-primary hover:text-white font-bold text-sm py-3 rounded-[3px] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70">
              {adding ? <IconLoader2 size={18} className="animate-spin" /> : <IconPlus size={18} stroke={2} />}
              {adding ? 'Adding...' : 'Quick Add'}
            </button>
          </div>}
      </div>

      <div className="pt-4 flex flex-col flex-grow relative min-w-0">
        <div className="flex justify-between items-start mb-1 min-w-0 w-full gap-2">
          <span className="text-[10px] md:text-xs text-on-surface-variant font-bold uppercase tracking-widest truncate w-auto min-w-0">{product.category_name || 'Category'}</span>
        </div>
        
        <h3 className="text-sm md:text-base text-primary font-bold mb-2 leading-snug line-clamp-2 min-w-0 break-words group-hover:text-secondary transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto flex justify-between items-end min-w-0 w-full pt-1">
           <div className="flex flex-col gap-1.5 shrink min-w-0">
             <div className="flex items-baseline gap-2 flex-wrap">
               <span className="font-headline-md text-lg md:text-xl font-black text-primary tracking-tight">{GHS0(price || 0)}</span>
               {discount && <span className="line-through text-on-surface-variant text-[11px] md:text-xs font-medium">{GHS0(comparePrice)}</span>}
             </div>
             <StarRating rating={product.avg_rating || 0} count={product.review_count || 0} />
           </div>
           
           {!isOutOfStock && <button onClick={handleAddToCart} disabled={adding} className="md:hidden bg-surface-variant hover:bg-primary text-primary hover:text-white w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 active:scale-95 shrink-0 ml-2 disabled:opacity-70" aria-label="Add to cart">
               {adding ? <IconLoader2 size={14} className="animate-spin" /> : <IconPlus size={16} stroke={2.5} />}
             </button>}
        </div>
      </div>
    </MotionLink>;
}
export { StarRating };