/**
 * File: AdminPayouts.jsx
 * Description: Auto-generated documentation for AdminPayouts.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import GHS from '../../utils/currency';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { IconCircleCheck, IconX, IconWallet } from '@tabler/icons-react';
export default /**
 * Function AdminPayouts
 * @returns {any}
 */
function AdminPayouts() {
  const {
    showToast
  } = useToast();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [updating, setUpdating] = useState(null);
  /**
 * Arrow Function fetchPayouts
 * @returns {any}
 */
  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/payouts');
      setPayouts(res.data.payouts);
    } catch (err) {
      console.error('Failed to fetch admin payouts', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPayouts();
  }, []);
  /**
 * Arrow Function handleUpdateStatus
 * @param {any} id
 * @param {any} status
 * @returns {any}
 */
  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this payout as ${status}?`)) return;
    setUpdating(id);
    try {
      await api.patch(`/admin/payouts/${id}`, {
        status
      });
      showToast(`Payout marked as ${status}`, 'success');
      fetchPayouts();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update payout', 'error');
    } finally {
      setUpdating(null);
    }
  };
  const filteredPayouts = filter === 'ALL' ? payouts : payouts.filter(p => p.status === filter);
  if (loading) {
    return <div className="w-full animate-pulse p-lg">
        <div className="h-64 bg-surface-container rounded-xl" />
      </div>;
  }
  return <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Payouts</h1>
          <p className="text-on-surface-variant font-medium">Manage seller withdrawal requests.</p>
        </div>
        <select className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm w-full sm:w-48 appearance-none cursor-pointer" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="ALL">All Payouts</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSED">Processed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="bg-surface border border-outline/30 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant/30 border-b border-outline/30">
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Seller</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Bank Details</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {filteredPayouts.length === 0 ? <tr>
                  <td colSpan="6" className="p-12 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-2">
                        <IconWallet size={32} stroke={1.5} />
                      </div>
                      <p className="text-lg font-bold text-primary">No payouts found.</p>
                    </div>
                  </td>
                </tr> : filteredPayouts.map(p => <tr key={p.id} className="hover:bg-surface-variant/30 transition-colors">
                    <td className="p-4 text-sm font-medium text-on-surface-variant">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-primary">{p.seller_name}</p>
                      <p className="text-xs font-medium text-on-surface-variant">{p.seller_email}</p>
                    </td>
                    <td className="p-4 text-base font-black text-primary">{GHS(p.amount)}</td>
                    <td className="p-4 text-sm text-on-surface-variant whitespace-pre-wrap max-w-[250px]">{p.bank_details}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
                        ${p.status === 'PENDING' ? 'bg-secondary/10 text-secondary border-secondary/20' : ''}
                        ${p.status === 'PROCESSED' ? 'bg-success/10 text-success border-success/20' : ''}
                        ${p.status === 'REJECTED' ? 'bg-error/10 text-error border-error/20' : ''}
                      `}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {p.status === 'PENDING' && <div className="flex items-center justify-end gap-2">
                          <button disabled={updating === p.id} onClick={() => handleUpdateStatus(p.id, 'PROCESSED')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-success/10 text-success border border-success/20 hover:bg-success hover:text-white active:scale-95 transition-all shadow-sm disabled:opacity-50" title="Mark as Processed">
                            <IconCircleCheck size={20} stroke={1.5} />
                          </button>
                          <button disabled={updating === p.id} onClick={() => handleUpdateStatus(p.id, 'REJECTED')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-error/10 text-error border border-error/20 hover:bg-error hover:text-white active:scale-95 transition-all shadow-sm disabled:opacity-50" title="Reject">
                            <IconX size={20} stroke={1.5} />
                          </button>
                        </div>}
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}