/**
 * File: Orders.jsx
 * Description: Auto-generated documentation for Orders.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import GHS from '../utils/currency';
import { Link } from 'react-router-dom';
import api from '../api';
import SEO from '../components/SEO';
import { IconPackage, IconArrowRight, IconHourglassEmpty, IconThumbUp, IconRefresh, IconTruckDelivery, IconCircleCheck, IconCancel, IconCurrencyDollar, IconInfoCircle } from '@tabler/icons-react';
/**
 * Arrow Function getStatusIcon
 * @param {any} status
 * @returns {any}
 */
const getStatusIcon = status => {
  switch (status) {
    case 'PENDING':
      return <IconHourglassEmpty size={16} />;
    case 'CONFIRMED':
      return <IconThumbUp size={16} />;
    case 'PROCESSING':
      return <IconRefresh size={16} />;
    case 'SHIPPED':
      return <IconTruckDelivery size={16} />;
    case 'DELIVERED':
      return <IconCircleCheck size={16} />;
    case 'CANCELLED':
      return <IconCancel size={16} />;
    case 'REFUNDED':
      return <IconCurrencyDollar size={16} />;
    default:
      return <IconInfoCircle size={16} />;
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
 * Function Orders
 * @returns {any}
 */
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/orders').then(res => {
      setOrders(res.data.orders);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  if (loading) {
    return <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-24">
        <SEO title="My Orders | UniShop" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 tracking-tight">My Orders</h1>
        <div className="flex flex-col gap-6 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="w-full h-24 bg-surface-variant/50 rounded-[3px]" />)}
        </div>
      </div>;
  }
  return <div className="w-full pb-20 pt-24 bg-background min-h-[80vh]">
      <SEO title="My Orders | UniShop" />
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 tracking-tight">My Orders</h1>
            <p className="text-lg text-on-surface-variant">Track and manage your purchases.</p>
          </div>
        </div>

        {orders.length === 0 ? <div className="w-full min-h-[50vh] flex flex-col items-center justify-center text-center bg-surface border border-outline/30 rounded-[3px] p-8 shadow-sm">
            <div className="w-24 h-24 bg-surface-variant/50 border border-outline/30 rounded-[3px] flex items-center justify-center text-primary mb-6">
              <IconPackage size={48} stroke={1.5} />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-3 tracking-tight">No orders yet</h2>
            <p className="text-lg text-on-surface-variant mb-10 w-full min-w-[300px] max-w-md">Once you place an order, it will appear here so you can easily track its status.</p>
            <Link to="/products" className="bg-primary text-white px-8 py-4 rounded-[3px] font-bold uppercase tracking-widest text-sm active:scale-95 shadow-sm hover:shadow-md transition-all">
              Start Shopping
            </Link>
          </div> : <div className="flex flex-col gap-6">
            {orders.map(order => <Link key={order.id} to={`/orders/${order.id}`} className="group block bg-surface border border-outline/30 rounded-[3px] p-6 md:p-8 hover:shadow-sm hover:border-outline/50 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Left Side: Order Meta */}
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[3px] bg-surface-variant border border-outline/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconPackage size={28} stroke={1.5} />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-primary mb-1 group-hover:text-secondary transition-colors">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-sm font-medium text-on-surface-variant">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Status & Total */}
                  <div className="flex items-center justify-between md:justify-end gap-8 border-t border-outline/30 md:border-none pt-6 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-2xl font-bold text-primary">{GHS(order.total)}</p>
                      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1">Total Amount</p>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-[3px] text-xs font-bold uppercase tracking-widest border ${STATUS_COLORS[order.status] || STATUS_COLORS.PENDING}`}>
                      {getStatusIcon(order.status)} {order.status}
                    </div>

                    <div className="text-on-surface-variant group-hover:text-primary transition-colors hidden md:block">
                      <IconArrowRight size={24} stroke={1.5} />
                    </div>
                  </div>
                </div>
              </Link>)}
          </div>}
      </div>
    </div>;
}