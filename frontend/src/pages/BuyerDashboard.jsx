/**
 * File: BuyerDashboard.jsx
 * Description: Auto-generated documentation for BuyerDashboard.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import GHS from '../utils/currency';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import { IconHourglassEmpty, IconThumbUp, IconRefresh, IconTruckDelivery, IconCircleCheck, IconCancel, IconCurrencyDollar, IconInfoCircle, IconPackage, IconAccessible, IconSettings, IconHeartFilled, IconBookmarkPlus } from '@tabler/icons-react';
/**
 * Arrow Function getStatusIcon
 * @param {any} status
 * @returns {any}
 */
const getStatusIcon = status => {
  switch (status) {
    case 'PENDING':
      return <IconHourglassEmpty size={14} />;
    case 'CONFIRMED':
      return <IconThumbUp size={14} />;
    case 'PROCESSING':
      return <IconRefresh size={14} />;
    case 'SHIPPED':
      return <IconTruckDelivery size={14} />;
    case 'DELIVERED':
      return <IconCircleCheck size={14} />;
    case 'CANCELLED':
      return <IconCancel size={14} />;
    case 'REFUNDED':
      return <IconCurrencyDollar size={14} />;
    default:
      return <IconInfoCircle size={14} />;
  }
};
const STATUS_COLORS = {
  PENDING: 'bg-surface-variant text-on-surface-variant border-outline/50',
  CONFIRMED: 'bg-secondary/10 text-secondary border-secondary/20',
  PROCESSING: 'bg-secondary/10 text-secondary border-secondary/20',
  SHIPPED: 'bg-primary/10 text-primary border-primary/20',
  DELIVERED: 'bg-success/10 text-success border-success/20',
  CANCELLED: 'bg-error/10 text-error border-error/20',
  REFUNDED: 'bg-surface-variant text-on-surface-variant border-outline/50'
};
export default /**
 * Function BuyerDashboard
 * @returns {any}
 */
function BuyerDashboard() {
  const {
    user
  } = useAuth();
  const {
    addToCart
  } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Preference state
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  useEffect(() => {
    Promise.all([api.get('/orders'), api.get('/wishlist')]).then(([ordersRes, wishlistRes]) => {
      setOrders(ordersRes.data.orders || []);
      setWishlist(wishlistRes.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);
  /**
 * Arrow Function handleRemoveWishlist
 * @param {any} productId
 * @returns {any}
 */
  const handleRemoveWishlist = async productId => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist(prev => prev.filter(i => i.product_id !== productId));
    } catch (err) {
      console.error(err);
    }
  };
  /**
 * Arrow Function handleMoveToCart
 * @param {any} item
 * @returns {any}
 */
  const handleMoveToCart = async item => {
    addToCart({
      id: item.product_id,
      name: item.name,
      min_price: item.price,
      image_url: item.image_url,
      total_stock: item.total_stock
    }, 1);
    await handleRemoveWishlist(item.product_id);
    navigate('/cart');
  };
  if (loading) {
    return <div className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-8 py-24 animate-pulse"><div className="h-32 bg-surface-variant/50 rounded-[2rem] mb-6"></div><div className="h-64 bg-surface-variant/50 rounded-[2rem]"></div></div>;
  }
  return <main className={`flex-grow w-full pb-20 pt-24 bg-background ${largeText ? 'text-lg' : ''}`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <SEO title="My UniShop | Dashboard" />
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 tracking-tight">My UniShop</h1>
          <p className="text-lg text-on-surface-variant font-medium">Welcome back, {user?.name?.split(' ')[0]}. Here's a snapshot of your buyer activity.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Recent Orders */}
          <section className="md:col-span-8 bg-surface rounded-[2rem] p-6 md:p-8 shadow-sm border border-outline/30">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline/30">
              <h2 className="text-xl font-bold text-primary flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-variant text-primary flex items-center justify-center border border-outline/50">
                  <IconTruckDelivery size={20} stroke={1.5} />
                </div>
                Recent Orders
              </h2>
              <Link to="/orders" className="text-sm font-semibold text-primary hover:text-secondary transition-colors">View All</Link>
            </div>
            <div className="space-y-4">
              {orders.length === 0 ? <p className="text-on-surface-variant font-medium py-4">No recent orders.</p> : orders.slice(0, 3).map(order => <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-surface-variant/30 border border-transparent hover:border-outline/30 transition-all group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-variant border border-outline/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconPackage size={28} stroke={1.5} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-secondary transition-colors">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                      <p className="text-sm font-medium text-on-surface-variant">Placed {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 border ${STATUS_COLORS[order.status] || STATUS_COLORS.PENDING}`}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                      <p className="text-lg font-bold text-primary">{GHS(order.total)}</p>
                    </div>
                  </Link>)}
            </div>
          </section>

          {/* Account Settings / Accessibility */}
          <section className="md:col-span-4 bg-surface rounded-[2rem] p-6 md:p-8 shadow-sm border border-outline/30 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline/30">
              <div className="w-10 h-10 rounded-full bg-surface-variant text-primary flex items-center justify-center border border-outline/50">
                <IconAccessible size={20} stroke={1.5} />
              </div>
              <h2 className="text-xl font-bold text-primary">Preferences</h2>
            </div>
            <div className="flex-grow flex flex-col justify-center space-y-4">
              <div className="flex justify-between items-center p-4 hover:bg-surface-variant/30 rounded-2xl transition-colors cursor-pointer group" onClick={() => setHighContrast(!highContrast)}>
                <div>
                  <p className="text-base font-semibold text-primary group-hover:text-secondary transition-colors">High Contrast Mode</p>
                  <p className="text-sm text-on-surface-variant font-medium">Enhance visibility</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative flex items-center p-1 transition-colors duration-300 ${highContrast ? 'bg-primary justify-end' : 'bg-surface-variant border border-outline/50 justify-start'}`}>
                  <div className={`w-4 h-4 rounded-full shadow-sm ${highContrast ? 'bg-on-primary' : 'bg-primary'}`}></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 hover:bg-surface-variant/30 rounded-2xl transition-colors cursor-pointer group" onClick={() => setLargeText(!largeText)}>
                <div>
                  <p className="text-base font-semibold text-primary group-hover:text-secondary transition-colors">Large Text</p>
                  <p className="text-sm text-on-surface-variant font-medium">Increase font size</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative flex items-center p-1 transition-colors duration-300 ${largeText ? 'bg-primary justify-end' : 'bg-surface-variant border border-outline/50 justify-start'}`}>
                  <div className={`w-4 h-4 rounded-full shadow-sm ${largeText ? 'bg-on-primary' : 'bg-primary'}`}></div>
                </div>
              </div>

              <Link to="/settings" className="w-full mt-auto py-3 bg-surface border border-outline/50 hover:border-primary text-primary font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95">
                <IconSettings size={18} stroke={1.5} />
                Full Settings
              </Link>
            </div>
          </section>

        {/* Saved for Later */}
        <section className="md:col-span-12 mt-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-variant text-primary flex items-center justify-center border border-outline/50">
                <IconHeartFilled size={20} stroke={1.5} />
              </div>
              Saved for Later
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {wishlist.map(item => <div key={item.product_id} className="bg-surface rounded-2xl overflow-hidden shadow-sm border border-outline/30 group hover:-translate-y-1 transition-all duration-300">
                <Link to={`/products/${item.product_id}`} className="block aspect-square bg-surface-variant/30 relative overflow-hidden border-b border-outline/30">
                  <img src={item.image_url || 'https://placehold.co/400x400/FAFAFA/333333.png?text=Product'} alt={item.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                  <button onClick={e => {
                  e.preventDefault();
                  handleRemoveWishlist(item.product_id);
                }} className="absolute top-3 right-3 p-2 bg-surface/80 backdrop-blur-md border border-outline/30 rounded-full text-secondary hover:text-primary hover:scale-110 active:scale-95 transition-all z-10">
                    <IconHeartFilled size={20} stroke={1.5} />
                  </button>
                </Link>
                <div className="p-4 md:p-5">
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Product</p>
                  <Link to={`/products/${item.product_id}`} className="text-base font-bold text-primary truncate block hover:text-secondary transition-colors">{item.name}</Link>
                  <p className="text-xl font-bold text-primary mt-2">{GHS(item.price)}</p>
                  {item.total_stock > 0 ? <button onClick={() => handleMoveToCart(item)} className="mt-4 w-full py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-fixed hover:shadow-sm transition-all active:scale-95">Move to Cart</button> : <button disabled className="mt-4 w-full py-2.5 bg-surface-variant text-on-surface-variant font-semibold rounded-xl opacity-50 cursor-not-allowed">Out of Stock</button>}
                </div>
              </div>)}

            {wishlist.length === 0 && <div className="col-span-2 md:col-span-4 bg-surface border border-outline/30 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-12 text-center min-h-[250px]">
                <IconBookmarkPlus className="text-primary/50 mb-4" size={48} stroke={1.5} />
                <p className="text-lg font-medium text-on-surface-variant">Discover more items to save.</p>
                <Link to="/products" className="mt-6 px-8 py-3 bg-surface border border-outline/50 text-primary font-semibold rounded-full hover:border-primary transition-all inline-block active:scale-95 shadow-sm">
                  Explore Deals
                </Link>
              </div>}
          </div>
        </section>
        </div>
      </div>
    </main>;
}