/**
 * File: AdminOrders.jsx
 * Description: Auto-generated documentation for AdminOrders.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import GHS from '../../utils/currency';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';
import { IconFileText, IconClipboardList, IconPackage } from '@tabler/icons-react';
const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
export default /**
 * Function AdminOrders
 * @returns {any}
 */
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const {
    showToast
  } = useToast();
  /**
 * Arrow Function fetchOrders
 * @returns {any}
 */
  const fetchOrders = () => {
    setLoading(true);
    const params = {
      page,
      limit: 15
    };
    if (statusFilter) params.status = statusFilter;
    api.get('/admin/orders', {
      params
    }).then(res => {
      setOrders(res.data.orders);
      setTotalPages(Math.ceil(res.data.pagination.total / res.data.pagination.limit));
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load orders', err);
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);
  /**
 * Arrow Function handleStatusChange
 * @param {any} id
 * @param {any} newStatus
 * @returns {any}
 */
  const handleStatusChange = async (id, newStatus) => {
    const previousOrders = [...orders];
    setOrders(orders.map(o => o.id === id ? {
      ...o,
      status: newStatus
    } : o));
    try {
      await api.patch(`/admin/orders/${id}/status`, {
        status: newStatus
      });
      showToast('Order status updated.', 'success');
    } catch (err) {
      setOrders(previousOrders);
      showToast(err.response?.data?.error || 'Failed to update status', 'error');
    }
  };
  if (loading) {
    return <div className="w-full animate-pulse p-lg">
        <div className="h-10 w-64 bg-surface-container rounded-lg mb-8" />
        <div className="h-64 w-full bg-surface-container rounded-2xl" />
      </div>;
  }
  return <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-variant/50 flex items-center justify-center text-primary border border-outline/30">
              <IconClipboardList size={24} stroke={1.5} />
            </div>
            Orders Management
          </h1>
          <p className="text-on-surface-variant font-medium">Oversee platform-wide orders and statuses.</p>
        </div>
        <select className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary cursor-pointer shadow-sm active:scale-95 transition-all focus:border-primary appearance-none min-w-[160px]" value={statusFilter} onChange={e => {
        setStatusFilter(e.target.value);
        setPage(1);
      }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-surface border border-outline/30 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant/30 border-b border-outline/30">
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Order ID</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Customer</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Email</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Date</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap text-right">Total</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {orders.map(order => <tr key={order.id} className="hover:bg-surface-variant/30 transition-colors group">
                  <td className="p-4 text-sm font-bold text-primary uppercase tracking-widest">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="p-4 text-base font-bold text-primary">{order.customer_name}</td>
                  <td className="p-4 text-sm font-medium text-on-surface-variant">{order.customer_email}</td>
                  <td className="p-4 text-sm font-medium text-on-surface-variant">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="p-4 text-lg font-bold text-primary text-right">
                    ${parseFloat(order.total).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <select className="bg-surface border border-outline/50 text-primary text-sm font-bold p-2.5 rounded-xl outline-none focus:border-primary cursor-pointer transition-colors shadow-sm appearance-none" value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/orders/${order.id}/packing-slip`} className="inline-flex items-center gap-2 bg-surface-variant/50 text-primary px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-surface-variant border border-outline/30 transition-colors active:scale-95 whitespace-nowrap shadow-sm hover:border-primary">
                      <IconFileText size={18} stroke={1.5} /> Packing Slip
                    </Link>
                  </td>
                </tr>)}
              {orders.length === 0 && <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant py-8">
                      <IconPackage size={48} stroke={1.5} className="mb-4 opacity-50" />
                      <p className="text-lg font-bold text-primary">No orders found</p>
                    </div>
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && <div className="flex items-center justify-center gap-4 mt-8">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-6 py-2.5 bg-surface border border-outline/50 rounded-xl font-semibold text-primary disabled:opacity-50 active:scale-95 hover:border-primary transition-all shadow-sm">Prev</button>
          <span className="text-sm font-semibold text-on-surface-variant">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-6 py-2.5 bg-surface border border-outline/50 rounded-xl font-semibold text-primary disabled:opacity-50 active:scale-95 hover:border-primary transition-all shadow-sm">Next</button>
        </div>}
    </div>;
}