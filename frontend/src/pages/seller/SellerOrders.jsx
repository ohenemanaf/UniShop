/**
 * File: SellerOrders.jsx
 * Description: Auto-generated documentation for SellerOrders.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import api from '../../api';
import { useSocket } from '../../context/SocketContext';
import { IconPackageExport, IconBox, IconTruckDelivery, IconMapPin, IconSearch, IconChevronRight } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
const STATUS_CONFIG = {
  PENDING: {
    color: 'bg-surface-variant text-on-surface-variant',
    border: 'border-outline/50',
    label: 'Pending'
  },
  PROCESSING: {
    color: 'bg-secondary/10 text-secondary',
    border: 'border-secondary/30',
    label: 'Processing'
  },
  SHIPPED: {
    color: 'bg-primary/10 text-primary',
    border: 'border-primary/30',
    label: 'Shipped'
  },
  DELIVERED: {
    color: 'bg-success/10 text-success',
    border: 'border-success/30',
    label: 'Delivered'
  },
  CANCELLED: {
    color: 'bg-error/10 text-error',
    border: 'border-error/30',
    label: 'Cancelled'
  }
};
export default /**
 * Function SellerOrders
 * @returns {any}
 */
function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [trackingModal, setTrackingModal] = useState({
    isOpen: false,
    itemId: null
  });
  const [trackingForm, setTrackingForm] = useState({
    tracking_number: '',
    carrier: 'FedEx'
  });
  const {
    socket
  } = useSocket();
  /**
 * Arrow Function fetchOrders
 * @param {any} p
 * @returns {any}
 */
  const fetchOrders = async (p = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/seller/orders?page=${p}&limit=10`);
      setOrders(res.data.orders);
      setTotalPages(res.data.pagination.totalPages);
      setPage(p);
    } catch (err) {
      console.error('Failed to fetch seller orders:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  useEffect(() => {
    if (!socket) return;
    /**
 * Arrow Function handleNewOrder
 * @returns {any}
 */
    const handleNewOrder = () => {
      fetchOrders(page); // Refresh current page
    };
    socket.on('new_order', handleNewOrder);
    return () => socket.off('new_order', handleNewOrder);
  }, [socket, page]);
  /**
 * Arrow Function handleStatusChange
 * @param {any} itemId
 * @param {any} newStatus
 * @returns {any}
 */
  const handleStatusChange = async (itemId, newStatus) => {
    if (newStatus === 'SHIPPED') {
      setTrackingModal({
        isOpen: true,
        itemId
      });
      return;
    }
    try {
      setUpdating(itemId);
      await api.patch(`/seller/orders/${itemId}/status`, {
        fulfillment_status: newStatus
      });
      await fetchOrders(page);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };
  /**
 * Arrow Function submitTracking
 * @param {any} e
 * @returns {any}
 */
  const submitTracking = async e => {
    e.preventDefault();
    if (!trackingForm.tracking_number || !trackingForm.carrier) return;
    try {
      setUpdating(trackingModal.itemId);
      await api.patch(`/seller/orders/${trackingModal.itemId}/status`, {
        fulfillment_status: 'SHIPPED',
        tracking_number: trackingForm.tracking_number,
        carrier: trackingForm.carrier
      });
      setTrackingModal({
        isOpen: false,
        itemId: null
      });
      setTrackingForm({
        tracking_number: '',
        carrier: 'FedEx'
      });
      await fetchOrders(page);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit tracking info');
    } finally {
      setUpdating(null);
    }
  };
  const filteredOrders = orders.filter(o => o.order_id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || o.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  if (loading) {
    return <div className="w-full animate-pulse p-4">
        <div className="h-12 w-64 bg-surface-container rounded-2xl mb-8" />
        <div className="space-y-4">
          <div className="h-32 w-full bg-surface-container rounded-3xl" />
          <div className="h-32 w-full bg-surface-container rounded-3xl" />
          <div className="h-32 w-full bg-surface-container rounded-3xl" />
        </div>
      </div>;
  }
  return <div className="w-full max-w-[1400px] mx-auto pb-12">
      <SEO title="Orders | Seller Dashboard" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight mb-2">Orders</h1>
          <p className="text-on-surface-variant font-medium">Manage and fulfill your customer orders.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input type="text" placeholder="Search by order ID, customer, or product..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-surface border border-outline/20 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-on-surface-variant/50 shadow-sm" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-4">
            {filteredOrders.map(item => {
          const statusConfig = STATUS_CONFIG[item.fulfillment_status] || STATUS_CONFIG.PENDING;
          return <motion.div key={item.order_item_id} variants={itemVariants} className="bg-surface border border-outline/20 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col xl:flex-row gap-6 relative overflow-hidden">
                  {/* Left: Product & Customer Info */}
                  <div className="flex gap-5 flex-1 min-w-0">
                    <div className="w-24 h-24 rounded-2xl bg-surface-variant/50 overflow-hidden shrink-0 border border-outline/20 hidden sm:block">
                       {item.image_url ? <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover mix-blend-multiply" /> : <div className="w-full h-full flex items-center justify-center text-on-surface-variant/50"><IconBox size={32} /></div>}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded-md">
                          ORDER #{item.order_id.substring(0, 8)}
                        </span>
                        <span className="text-xs font-semibold text-on-surface-variant">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-primary truncate mb-1">{item.product_name}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="font-semibold text-on-surface-variant">Qty: {item.quantity}</span>
                        <span className="font-black text-secondary">${item.price_at_purchase} <span className="font-medium text-xs text-on-surface-variant">ea</span></span>
                        {item.variant_name && <span className="px-2 py-0.5 bg-surface-variant rounded-md font-medium">{item.variant_name}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Customer / Shipping */}
                  <div className="flex-1 flex flex-col justify-center border-t xl:border-t-0 xl:border-l border-outline/10 pt-4 xl:pt-0 xl:pl-6 min-w-[200px]">
                    <div className="flex items-start gap-2">
                      <IconMapPin size={18} className="text-on-surface-variant shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-primary">{item.customer_name}</p>
                        <p className="text-xs font-medium text-on-surface-variant truncate mb-1">{item.customer_email}</p>
                        <p className="text-xs text-on-surface-variant truncate">
                          {item.shipping_city}, {item.shipping_country}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="flex flex-col sm:flex-row xl:flex-col justify-between xl:justify-center items-start sm:items-center xl:items-end gap-4 border-t xl:border-t-0 xl:border-l border-outline/10 pt-4 xl:pt-0 xl:pl-6 min-w-[250px] shrink-0">
                    
                    <div className="w-full flex justify-between items-center xl:flex-col xl:items-end gap-2">
                      {/* Status Badge */}
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${statusConfig.color} ${statusConfig.border}`}>
                        {statusConfig.label}
                      </span>
                      
                      {/* Tracking Info (if shipped) */}
                      {item.tracking_number && <div className="text-right">
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{item.carrier}</p>
                          <p className="text-xs font-semibold text-primary font-mono">{item.tracking_number}</p>
                        </div>}
                    </div>

                    {/* Action Select */}
                    <div className="w-full relative">
                      <select className="w-full bg-surface-variant/50 hover:bg-surface-variant border border-outline/20 text-primary text-sm font-bold py-2.5 pl-4 pr-10 rounded-xl outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50 appearance-none shadow-sm transition-all" value={item.fulfillment_status} onChange={e => handleStatusChange(item.order_item_id, e.target.value)} disabled={updating === item.order_item_id}>
                        <option value="PENDING">Mark as Pending</option>
                        <option value="PROCESSING">Mark as Processing</option>
                        <option value="SHIPPED">Mark as Shipped</option>
                        <option value="DELIVERED">Mark as Delivered</option>
                        <option value="CANCELLED">Cancel Order</option>
                      </select>
                      <IconChevronRight size={16} stroke={2} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary rotate-90 pointer-events-none" />
                      {updating === item.order_item_id && <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>}
                    </div>

                  </div>
                </motion.div>;
        })}
          </motion.div> : <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="bg-surface border border-outline/20 rounded-[2rem] p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-6">
              <IconBox size={48} stroke={1.5} />
            </div>
            <h2 className="text-2xl font-black text-primary mb-2">No orders found</h2>
            <p className="max-w-[400px] mx-auto mb-8 text-on-surface-variant font-medium">
              {searchTerm ? "No orders matched your search." : "You haven't received any orders yet. Once someone buys your product, it will appear here."}
            </p>
          </motion.div>}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && <div className="flex items-center justify-center gap-4 mt-10">
          <button disabled={page === 1} onClick={() => fetchOrders(page - 1)} className="px-6 py-3 bg-surface border border-outline/20 rounded-2xl font-bold text-primary disabled:opacity-50 active:scale-95 hover:border-primary/50 transition-all shadow-sm">Prev</button>
          <span className="text-sm font-black text-on-surface-variant bg-surface-variant/50 px-4 py-2 rounded-xl">
            {page} / {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => fetchOrders(page + 1)} className="px-6 py-3 bg-surface border border-outline/20 rounded-2xl font-bold text-primary disabled:opacity-50 active:scale-95 hover:border-primary/50 transition-all shadow-sm">Next</button>
        </div>}

      {/* Tracking Info Modal */}
      <AnimatePresence>
        {trackingModal.isOpen && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div initial={{
          scale: 0.9,
          y: 20
        }} animate={{
          scale: 1,
          y: 0
        }} exit={{
          scale: 0.9,
          y: 20
        }} transition={{
          type: "spring",
          stiffness: 300,
          damping: 25
        }} className="bg-surface w-full max-w-md p-8 rounded-[2rem] shadow-level-3 border border-outline/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
              
              <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <IconTruckDelivery size={24} stroke={2} />
                </div>
                Ship Order
              </h2>
              
              <form onSubmit={submitTracking} className="flex flex-col gap-5 relative z-10">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Carrier</label>
                  <div className="relative">
                    <select className="w-full bg-surface-variant/50 hover:bg-surface-variant focus:bg-surface p-4 rounded-xl border border-transparent focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-primary shadow-sm appearance-none cursor-pointer" value={trackingForm.carrier} onChange={e => setTrackingForm({
                  ...trackingForm,
                  carrier: e.target.value
                })} required>
                      <option value="FedEx">FedEx</option>
                      <option value="UPS">UPS</option>
                      <option value="USPS">USPS</option>
                      <option value="DHL">DHL</option>
                      <option value="Other">Other</option>
                    </select>
                    <IconChevronRight size={16} stroke={2} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary rotate-90 pointer-events-none" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tracking Number</label>
                  <input type="text" className="w-full bg-surface-variant/50 focus:bg-surface p-4 rounded-xl border border-transparent focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-primary placeholder:text-on-surface-variant/40 shadow-sm" placeholder="e.g. 1Z9999999999999999" value={trackingForm.tracking_number} onChange={e => setTrackingForm({
                ...trackingForm,
                tracking_number: e.target.value
              })} required />
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" className="px-6 py-3.5 bg-surface border border-outline/20 text-on-surface-variant hover:text-primary font-bold rounded-2xl active:scale-95 transition-all" onClick={() => setTrackingModal({
                isOpen: false,
                itemId: null
              })}>
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3.5 bg-primary text-white font-bold rounded-2xl active:scale-95 disabled:opacity-50 shadow-md shadow-primary/20 hover:shadow-lg transition-all flex items-center gap-2" disabled={updating === trackingModal.itemId}>
                    {updating === trackingModal.itemId ? 'Saving...' : 'Save & Mark Shipped'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}