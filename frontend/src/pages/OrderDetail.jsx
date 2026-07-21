/**
 * File: OrderDetail.jsx
 * Description: Auto-generated documentation for OrderDetail.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import GHS from '../utils/currency';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';
import { useSocket } from '../context/SocketContext';
import { IconArrowLeft, IconBox, IconTruck, IconCheck, IconX, IconFileText } from '@tabler/icons-react';
const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
/**
 * Function StatusTimeline
 * @param {any} props
 * @returns {any}
 */
function StatusTimeline({
  status
}) {
  const cancelledOrRefunded = ['CANCELLED', 'REFUNDED'].includes(status);
  const currentStep = STATUS_STEPS.indexOf(status);
  if (cancelledOrRefunded) {
    return <div className="flex justify-center py-8">
        <div className="bg-error text-white px-6 py-2 rounded-full inline-flex items-center gap-2 font-label-md font-bold shadow-sm">
          <IconX size={20} /> {status}
        </div>
      </div>;
  }
  return <div className="py-8 flex relative w-full justify-between items-center px-4 md:px-12">
      {/* Background Line */}
      <div className="absolute top-[52px] left-[10%] right-[10%] h-1 bg-surface-variant z-0 rounded-full" />
      
      {/* Active Line */}
      <div className="absolute top-[52px] left-[10%] h-1 bg-primary z-10 rounded-full transition-all duration-500 ease-in-out" style={{
      right: `${100 - (10 + 80 / (STATUS_STEPS.length - 1) * currentStep)}%`
    }} />
      
      {STATUS_STEPS.map((step, i) => {
      const isDone = i <= currentStep;
      const isCurrent = i === currentStep;
      return <div key={step} className="flex flex-col items-center z-20 flex-1">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all duration-300
              ${isDone ? 'bg-primary border-2 border-primary text-white shadow-md scale-110' : 'bg-surface border-2 border-outline/30 text-on-surface-variant/50'}
            `}>
              {isDone ? <IconCheck size={20} stroke={3} /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
            </div>
            <span className={`
              text-xs md:text-sm text-center
              ${isCurrent ? 'font-bold text-on-surface' : isDone ? 'font-bold text-primary' : 'font-medium text-secondary'}
            `}>
              {step.charAt(0) + step.slice(1).toLowerCase()}
            </span>
          </div>;
    })}
    </div>;
}
export default /**
 * Function OrderDetail
 * @returns {any}
 */
function OrderDetail() {
  const {
    id
  } = useParams();
  const {
    showToast
  } = useToast();
  const {
    socket
  } = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  useEffect(() => {
    api.get(`/orders/${id}`).then(res => {
      setOrder(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    if (!socket) return;
    /**
 * Arrow Function handleStatusUpdate
 * @param {any} data
 * @returns {any}
 */
    const handleStatusUpdate = data => {
      if (data.order_id === Number(id)) {
        setOrder(prev => ({
          ...prev,
          status: data.status
        }));
        showToast(`Order status updated to ${data.status}`, 'info');
      }
    };
    socket.on('order_status_updated', handleStatusUpdate);
    return () => socket.off('order_status_updated', handleStatusUpdate);
  }, [socket, id, showToast]);
  const canCancel = order && ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status);
  /**
 * Arrow Function handleCancel
 * @returns {any}
 */
  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.post(`/orders/${id}/cancel`);
      setOrder(prev => ({
        ...prev,
        status: 'CANCELLED'
      }));
      showToast('Order cancelled successfully.', 'success');
      setShowCancelConfirm(false);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to cancel order.', 'error');
    } finally {
      setCancelling(false);
    }
  };
  if (loading) {
    return <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-20 animate-pulse">
        <div className="h-8 w-48 bg-surface-variant/50 rounded-xl mb-8" />
        <div className="h-32 w-full bg-surface-variant/50 rounded-[2rem] mb-8" />
        <div className="h-64 w-full bg-surface-variant/50 rounded-[2rem]" />
      </div>;
  }
  if (!order) {
    return <div className="w-full min-h-[50vh] flex items-center justify-center">
        <h2 className="text-2xl font-bold text-on-surface-variant">Order not found.</h2>
      </div>;
  }
  return <div className="w-full pb-20 pt-24 bg-background min-h-[80vh]">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8">
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-8 group active:scale-95">
          <IconArrowLeft size={18} stroke={1.5} className="group-hover:-translate-x-1 transition-transform" /> Back to Orders
        </Link>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-lg text-on-surface-variant font-medium">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            </p>
          </div>
          <div className="md:text-right bg-surface border border-outline/30 p-4 rounded-[1.5rem] md:border-none md:bg-transparent md:p-0 shadow-sm md:shadow-none">
            <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase mb-1">Total Amount</p>
            <p className="text-4xl md:text-5xl font-black text-primary leading-none">{GHS(order.total)}</p>
          </div>
        </div>

        {/* Tracking */}
        <div className="bg-surface border border-outline/30 rounded-[2rem] p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2">
            <h2 className="text-2xl font-bold text-primary">Tracking Status</h2>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link to={`/orders/${id}/invoice`} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-surface-variant text-primary font-bold px-4 py-2.5 rounded-full hover:bg-surface-variant/80 border border-outline/30 transition-colors active:scale-95">
                <IconFileText size={18} stroke={1.5} /> View Invoice
              </Link>
              {canCancel && <button className="flex-1 md:flex-none bg-error/10 text-error font-bold px-4 py-2.5 rounded-full hover:bg-error hover:text-white border border-error/20 transition-colors active:scale-95" onClick={() => setShowCancelConfirm(true)} disabled={cancelling}>
                  Cancel Order
                </button>}
            </div>
          </div>
          <StatusTimeline status={order.status} />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Items */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <IconBox size={28} className="text-primary" stroke={1.5} /> Order Items
            </h2>
            
            <div className="flex flex-col gap-4">
              {order.items?.map((item, i) => <div key={i} className="flex gap-4 items-center bg-surface border border-outline/30 p-4 rounded-[2rem] hover:shadow-level-1 transition-all">
                  <div className="w-20 h-20 rounded-2xl bg-surface-variant/50 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image_url ? <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" /> : <IconBox size={32} stroke={1.5} className="text-on-surface-variant/50" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-bold text-primary mb-1">{item.product_name}</p>
                    {item.variant_name && <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{item.variant_name}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-primary mb-1">{GHS(item.price_at_purchase)}</p>
                    <p className="text-sm font-semibold text-on-surface-variant">Qty: {item.quantity}</p>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Shipping & Payment summary */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-surface border border-outline/30 rounded-[2rem] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 pb-4 border-b border-outline/30">
                <IconTruck size={24} stroke={1.5} className="text-primary" /> Shipping Address
              </h2>
              <div className="text-base text-primary space-y-1 font-medium">
                <p className="font-bold">{order.shipping_line1}</p>
                {order.shipping_line2 && <p>{order.shipping_line2}</p>}
                <p>{order.shipping_city}, {order.shipping_state || ''} {order.shipping_zip}</p>
                <p className="text-on-surface-variant pt-2">{order.shipping_country}</p>
              </div>
            </div>

            <div className="bg-surface border border-outline/30 rounded-[2rem] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b border-outline/30">Payment Summary</h2>
              
              <div className="flex flex-col gap-3 text-base font-medium mb-6">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="text-primary font-bold">{GHS(order.subtotal)}</span>
                </div>
                {parseFloat(order.discount) > 0 && <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-${parseFloat(order.discount).toFixed(2)}</span>
                  </div>}
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="text-primary font-bold">{parseFloat(order.shipping_fee) === 0 ? 'FREE' : `{GHS(order.shipping_fee)}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-outline/30 pt-4 mb-6">
                <span className="text-lg text-primary font-bold">Total</span>
                <span className="text-3xl font-black text-primary leading-none">{GHS(order.total)}</span>
              </div>

              <div className="bg-surface-variant/50 p-4 rounded-2xl border border-outline/30 flex justify-between items-center">
                <span className="text-xs font-semibold tracking-wider uppercase text-on-surface-variant">Payment Method</span>
                <span className="text-sm font-bold text-primary uppercase">{order.payment_method}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowCancelConfirm(false)}>
          <div className="bg-surface w-full max-w-[384px] p-8 rounded-[2rem] shadow-level-2 border border-outline/30 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6 border border-error/20">
              <IconX size={32} stroke={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2 text-center">Cancel this order?</h3>
            <p className="text-base text-on-surface-variant font-medium mb-8 text-center">
              This action cannot be undone. Your items will be returned to inventory
              and you'll receive a refund if payment was already processed.
            </p>
            <div className="flex gap-3">
              <button className="flex-1 bg-surface border border-outline/50 text-primary font-bold py-3 rounded-full hover:border-primary transition-all active:scale-95" onClick={() => setShowCancelConfirm(false)} disabled={cancelling}>
                Keep
              </button>
              <button className="flex-1 bg-error text-white font-bold py-3 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>}

    </div>;
}