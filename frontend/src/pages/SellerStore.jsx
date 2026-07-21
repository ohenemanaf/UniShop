/**
 * File: SellerStore.jsx
 * Description: Auto-generated documentation for SellerStore.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { IconBuildingStore, IconStarFilled, IconPackage } from '@tabler/icons-react';
export default /**
 * Function SellerStore
 * @returns {any}
 */
function SellerStore() {
  const {
    id
  } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    Promise.all([api.get(`/sellers/${id}`), api.get(`/products?seller_id=${id}&limit=50`)]).then(([sellerRes, prodRes]) => {
      setSeller(sellerRes.data);
      setProducts(prodRes.data.products);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setError('Failed to load storefront');
      setLoading(false);
    });
  }, [id]);
  if (loading) {
    return <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-24 animate-pulse">
        <div className="w-full h-[240px] bg-surface-variant/50 rounded-3xl mb-12"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-80 bg-surface-variant/50 rounded-2xl"></div>)}
        </div>
      </div>;
  }
  if (error || !seller) {
    return <div className="py-32 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Store Not Found</h2>
        <p className="text-on-surface-variant">The storefront you are looking for does not exist or has been removed.</p>
      </div>;
  }
  return <div className="w-full pb-32">
      <SEO title={`${seller.name}'s Store | UniShop`} description={`Shop all products from ${seller.name} on UniShop.`} />

      {/* Store Header */}
      <div className="bg-primary/5 border-b border-primary/10 pt-24 pb-16">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg flex items-center justify-center shrink-0">
            {seller.avatar_url ? <img src={seller.avatar_url} alt={seller.name} className="w-full h-full object-cover" /> : <IconBuildingStore size={64} className="text-primary/30" stroke={1.5} />}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 tracking-tight">{seller.name}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-bold text-on-surface-variant uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <IconStarFilled size={18} className="text-amber-400" />
                <span>{parseFloat(seller.stats?.shop_rating || 0).toFixed(1)} Shop Rating</span>
                <span className="opacity-50">({seller.stats?.total_reviews || 0})</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-outline/50 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <IconPackage size={18} className="text-secondary" />
                <span>{seller.stats?.total_products || 0} Products</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-outline/50 hidden md:block"></div>
              <div>Joined {new Date(seller.created_at).getFullYear()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-primary uppercase tracking-widest">All Products</h2>
          <span className="text-sm font-semibold text-on-surface-variant bg-surface-variant/50 px-3 py-1 rounded-full">
            {products.length} Items
          </span>
        </div>

        {products.length === 0 ? <div className="py-24 text-center bg-surface-variant/20 rounded-3xl border border-outline/30">
            <p className="text-on-surface-variant font-medium">This seller has not published any products yet.</p>
          </div> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>}
      </div>
    </div>;
}