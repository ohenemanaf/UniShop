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
import { IconPackage, IconChevronRight, IconHourglassEmpty, IconThumbUp, IconRefresh, IconTruckDelivery, IconCircleCheck, IconCancel, IconCurrencyDollar, IconInfoCircle } from '@tabler/icons-react';
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
const STATUS_PILL = {
  PENDING: 'pill-neutral',
  CONFIRMED: 'pill-accent',
  PROCESSING: 'pill-accent',
  SHIPPED: 'pill-brand',
  DELIVERED: 'pill-success',
  CANCELLED: 'pill-danger',
  REFUNDED: 'pill-neutral'
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
    return <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-10">
        <SEO title="My Orders | UniShop" />
        <h1 className="page-title mb-2">My Orders</h1>
        <div className="flex flex-col gap-6 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="w-full h-24 bg-surface-variant/50 rounded-xl" />)}
        </div>
      </div>;
  }
  return <div className="w-full pb-12 pt-6 bg-background min-h-[80vh]">
      <SEO title="My Orders | UniShop" />
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="page-title mb-2">My Orders</h1>
            <p className="text-lg text-on-surface-variant">Track and manage your purchases.</p>
          </div>
        </div>

        {orders.length === 0 ? <div className="w-full min-h-[50vh] flex flex-col items-center justify-center text-center bg-surface border border-outline/30 rounded-xl p-6 shadow-sm">
            <div className="w-24 h-24 bg-surface-variant/50 border border-outline/30 rounded-xl flex items-center justify-center text-primary mb-6">
              <IconPackage size={48} stroke={1.5} />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-3 tracking-tight">No orders yet</h2>
            <p className="text-lg text-on-surface-variant mb-6 w-full min-w-[300px] max-w-[28rem]">Once you place an order, it will appear here so you can easily track its status.</p>
            <Link to="/products" className="btn-primary btn-lg">
              Start Shopping
            </Link>
          </div> : <ul className="list-group">
            {orders.map(order => <li key={order.id}><Link to={`/orders/${order.id}`} className="list-row group px-4 py-3">
                <span className="w-9 h-9 rounded-lg bg-primary-container text-primary flex items-center justify-center shrink-0">
                  <IconPackage size={18} stroke={1.7} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className="block text-xs text-on-surface-variant">Placed {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className={`${STATUS_PILL[order.status] || 'pill-neutral'} mt-1.5 sm:hidden`}>{order.status.charAt(0) + order.status.slice(1).toLowerCase()}</span>
                </span>
                <span className={`${STATUS_PILL[order.status] || 'pill-neutral'} hidden sm:inline-flex`}>
                  {getStatusIcon(order.status)} {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </span>
                <span className="sm:w-24 text-right text-sm font-bold text-on-surface tabular shrink-0">{GHS(order.total)}</span>
                <IconChevronRight size={16} className="text-on-surface-variant hidden sm:block" aria-hidden="true" />
              </Link></li>)}
          </ul>}
      </div>
    </div>;
}