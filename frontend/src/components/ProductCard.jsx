/**
 * File: ProductCard.jsx
 * Description: Auto-generated documentation for ProductCard.jsx
 * Date: 2026-07-21
 */
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLoginRedirect } from '../hooks/useLoginRedirect';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {useToast} from '../context/ToastContext';
import { IconStar, IconStarFilled, IconHeart, IconHeartFilled, IconPlus, IconLoader2 } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { GHS0 } from '../utils/currency';
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
      <span className="sr-only">Rated {Math.round(Number(rating) * 10) / 10} out of 5</span>
      {[1, 2, 3, 4, 5].map(i => i <= Math.round(rating) ? <IconStarFilled key={i} size={14} aria-hidden="true" className="text-secondary w-3 h-3 md:w-3.5 md:h-3.5" /> : <IconStar key={i} size={14} aria-hidden="true" className="text-outline w-3 h-3 md:w-3.5 md:h-3.5" />)}
      {count !== undefined && <span className="font-medium text-on-surface-variant ml-1 text-xs">({count}<span className="sr-only"> reviews</span>)</span>}
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
  const goToLogin = useLoginRedirect();
  const navigate = useNavigate();
  const {showToast}=useToast();
  const [wishlisted, setWishlisted] = useState(wishlistIds.includes(product.id));
  const [adding, setAdding] = useState(false);

  // Optimistic Wishlist Toggle
  const toggleWishlist = async e => {
    e.stopPropagation();
    if (!isAuthenticated) { goToLogin(); return; }
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
      showToast('Could not update your wishlist. Please try again.','error');
    }
  };
  /**
 * Arrow Function handleAddToCart
 * @param {any} e
 * @returns {any}
 */
  const handleAddToCart = async e => {
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      // The product list doesn't include SKUs, so load them. Only add straight away when there is
      // exactly one variant; otherwise let the buyer choose a size or colour rather than guessing.
      const res = await api.get(`/products/${product.id}`);
      const variants = res.data.variants || [];
      if (variants.length === 0) { showToast('This product is unavailable.', 'error'); return; }
      if (variants.length > 1) {
        showToast('This item comes in more than one option. Choose one to add it to your cart.', 'info');
        navigate(`/products/${product.id}`);
        return;
      }
      await addToCart(variants[0].sku, 1);
    } catch (err) {
      showToast(err.response?.data?.error || 'Could not add this item to your cart.', 'error');
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

  // The title link stretches over the whole card (after:inset-0) so the card stays clickable,
  // while the wishlist and add buttons sit beside the link instead of inside it.
  const percentOff = discount ? Math.round((1 - Number(price) / Number(comparePrice)) * 100) : 0;
  const rating = Number(product.avg_rating || 0);
  return <motion.article variants={itemVariants} className="group relative flex flex-col product-card lift min-w-0">
      <div className="relative aspect-square w-full bg-surface-dim overflow-hidden shrink-0">
        <img src={product.image_url || 'https://placehold.co/800x800/F1F5F9/333333.png?text=Product'} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />

        {/* Status */}
        <div className="absolute top-2 left-2 z-10 flex gap-1 pointer-events-none">
          {isOutOfStock ? <span className="pill-neutral bg-surface/95">Sold out</span> : discount && <span className="pill-accent">−{percentOff}%</span>}
        </div>

        {/* Wishlist */}
        <button type="button" aria-label={`${wishlisted ? 'Remove' : 'Save'} ${product.name} ${wishlisted ? 'from' : 'to'} wishlist`} aria-pressed={wishlisted} onClick={toggleWishlist} className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-surface/95 flex items-center justify-center shadow-sm transition-transform active:scale-90 ${wishlisted ? 'text-secondary' : 'text-on-surface-variant hover:text-on-surface'}`}>
          {wishlisted ? <IconHeartFilled size={16} /> : <IconHeart size={16} stroke={1.8} />}
        </button>
      </div>

      <div className="p-3 flex flex-col flex-grow min-w-0">
        <span className="text-[11px] font-semibold text-on-surface-variant truncate">{product.category_name || 'Category'}</span>
        <h3 className="mt-0.5 text-[13.5px] leading-snug font-semibold text-on-surface line-clamp-2 min-h-[2.5em] break-words">
          <Link to={`/products/${product.id}`} className="after:absolute after:inset-0 after:z-[5] after:content-[''] focus:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-primary focus-visible:after:rounded-xl hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto pt-2 flex items-end justify-between gap-2 min-w-0">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap tabular">
              <span className="text-[15px] font-bold text-on-surface">{GHS0(price || 0)}</span>
              {discount && <span className="line-through text-on-surface-variant text-xs"><span className="sr-only">Was </span>{GHS0(comparePrice)}</span>}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-on-surface-variant">
              {rating > 0 ? <>
                  <IconStarFilled size={12} className="text-secondary" aria-hidden="true" />
                  <span className="font-semibold text-on-surface">{rating.toFixed(1)}</span>
                  <span>({product.review_count || 0}<span className="sr-only"> reviews</span>)</span>
                </> : <span>No reviews yet</span>}
            </div>
          </div>

          {!isOutOfStock && <button type="button" onClick={handleAddToCart} disabled={adding} aria-label={`Add ${product.name} to cart`} className="relative z-10 shrink-0 w-8 h-8 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-white flex items-center justify-center transition-colors active:scale-90 disabled:opacity-60">
              {adding ? <IconLoader2 size={15} className="animate-spin" /> : <IconPlus size={16} stroke={2.2} />}
            </button>}
        </div>
      </div>
    </motion.article>;
}
export { StarRating };