/**
 * File: Wishlist.jsx
 * Description: Auto-generated documentation for Wishlist.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import { IconHeart } from '@tabler/icons-react';
import SEO from '../components/SEO';
export default /**
 * Function Wishlist
 * @returns {any}
 */
function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  /**
 * Arrow Function fetchWishlist
 * @returns {any}
 */
  const fetchWishlist = () => {
    api.get('/wishlist').then(res => {
      setItems(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };
  /**
 * Arrow Function handleWishlistChange
 * @param {any} productId
 * @param {any} isWishlisted
 * @returns {any}
 */
  const handleWishlistChange = (productId, isWishlisted) => {
    if (!isWishlisted) {
      setItems(prev => prev.filter(i => i.product_id !== productId));
    }
    // Silently refresh to ensure sync
    api.get('/wishlist').then(res => setItems(res.data));
  };
  useEffect(() => {
    fetchWishlist();
  }, []);
  if (loading) {
    return <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-20">
        <SEO title="My Wishlist | UniShop" />
        <h1 className="text-3xl font-bold text-primary mb-8">My Wishlist</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-surface-variant/50 rounded-[2rem]" />)}
        </div>
      </div>;
  }

  // Adapt wishlist items to product card format
  const products = items.map(item => ({
    id: item.product_id,
    name: item.name,
    slug: item.slug,
    image_url: item.image_url,
    avg_rating: item.avg_rating,
    review_count: item.review_count,
    min_price: item.price,
    compare_price: item.compare_price,
    total_stock: item.total_stock
  }));
  const wishlistIds = items.map(i => i.product_id);
  return <div className="w-full pb-20 pt-24 bg-background min-h-[80vh]">
      <SEO title="My Wishlist | UniShop" />
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        <div className="mb-10 flex items-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">My Wishlist</h1>
          <span className="bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full border border-primary/20">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {items.length === 0 ? <div className="w-full min-h-[50vh] flex flex-col items-center justify-center text-center bg-surface border border-outline/30 rounded-[2rem] p-12">
            <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center text-primary mb-6 border border-outline/50">
              <IconHeart size={48} stroke={1.5} />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-2">Your wishlist is empty</h2>
            <p className="text-lg text-on-surface-variant font-medium mb-8 max-w-[448px]">Save products you love and come back to them anytime.</p>
            <Link to="/products" className="bg-primary text-white px-8 py-4 rounded-full font-semibold active:scale-95 shadow-sm hover:shadow-level-2 transition-all">
              Browse Products
            </Link>
          </div> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => <ProductCard key={product.id} product={product} wishlistIds={wishlistIds} onWishlistChange={handleWishlistChange} />)}
          </div>}
      </div>
    </div>;
}