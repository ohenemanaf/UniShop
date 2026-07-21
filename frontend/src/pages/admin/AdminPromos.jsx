/**
 * File: AdminPromos.jsx
 * Description: Auto-generated documentation for AdminPromos.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { IconTicket, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
export default /**
 * Function AdminPromos
 * @returns {any}
 */
function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discount_percentage: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const {
    showToast
  } = useToast();
  /**
 * Arrow Function fetchPromos
 * @returns {any}
 */
  const fetchPromos = async () => {
    try {
      const res = await api.get('/admin/promos');
      setPromos(res.data.promos);
    } catch {
      showToast('Failed to load promo codes.', 'error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPromos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
 * Arrow Function handleSubmit
 * @param {any} e
 * @returns {any}
 */
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/promos', {
        code: form.code,
        discount_percentage: parseFloat(form.discount_percentage)
      });
      showToast('Promo code created!', 'success');
      setForm({
        code: '',
        discount_percentage: ''
      });
      setShowNew(false);
      fetchPromos();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create promo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  /**
 * Arrow Function toggleStatus
 * @param {any} code
 * @param {any} currentStatus
 * @returns {any}
 */
  const toggleStatus = async (code, currentStatus) => {
    try {
      await api.patch(`/admin/promos/${code}/status`, {
        is_active: !currentStatus
      });
      setPromos(promos.map(p => p.code === code ? {
        ...p,
        is_active: !currentStatus
      } : p));
      showToast('Promo status updated.', 'success');
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };
  return <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Promo Codes</h1>
          <p className="text-on-surface-variant font-medium">Create and manage discount codes for marketing campaigns.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary text-white shadow-sm hover:shadow-level-2 transition-all active:scale-95" onClick={() => setShowNew(!showNew)}>
          {showNew ? <><IconX size={20} stroke={1.5} /> Cancel</> : <><IconPlus size={20} stroke={1.5} /> Create Promo</>}
        </button>
      </div>

      {showNew && <div className="bg-surface border border-outline/30 rounded-[2rem] p-6 md:p-8 mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex flex-col gap-2 flex-grow w-full">
              <label className="text-sm font-bold text-primary uppercase tracking-wider">Promo Code</label>
              <input type="text" className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-bold text-primary focus:border-primary transition-colors shadow-sm font-mono uppercase" required value={form.code} onChange={e => setForm({
            ...form,
            code: e.target.value.toUpperCase()
          })} placeholder="e.g. SUMMER20" />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-48">
              <label className="text-sm font-bold text-primary uppercase tracking-wider">Discount %</label>
              <input type="number" className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-bold text-primary focus:border-primary transition-colors shadow-sm" required min="1" max="99" step="1" value={form.discount_percentage} onChange={e => setForm({
            ...form,
            discount_percentage: e.target.value
          })} placeholder="20" />
            </div>
            <button type="submit" className="w-full md:w-auto px-8 py-3.5 rounded-xl font-bold bg-primary text-white shadow-sm hover:shadow-md transition-all active:scale-95 whitespace-nowrap h-[54px]" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Code'}
            </button>
          </form>
        </div>}

      <div className="bg-surface border border-outline/30 rounded-[2rem] overflow-hidden shadow-sm">
        {loading ? <div className="w-full animate-pulse p-lg">
             <div className="h-64 w-full bg-surface-variant/30 rounded-[2rem]" />
          </div> : <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-variant/30 border-b border-outline/30">
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Code</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Discount</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Created At</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/30">
                {promos.map(promo => <tr key={promo.code} className="hover:bg-surface-variant/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <IconTicket size={24} stroke={1.5} className="text-secondary" />
                        <span className="text-base font-bold text-primary font-mono tracking-wider">{promo.code}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-base font-black text-success">{parseFloat(promo.discount_percentage)}% OFF</span>
                    </td>
                    <td className="p-4 text-sm font-medium text-on-surface-variant">
                      {new Date(promo.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${promo.is_active ? 'bg-success/10 text-success border-success/20' : 'bg-surface-variant text-on-surface-variant border-outline/50'}`}>
                        {promo.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-colors active:scale-95 shadow-sm ${promo.is_active ? 'bg-error/10 border-error/20 text-error hover:bg-error hover:text-white' : 'bg-success/10 border-success/20 text-success hover:bg-success hover:text-white'}`} onClick={() => toggleStatus(promo.code, promo.is_active)}>
                        {promo.is_active ? <><IconX size={18} stroke={1.5} /> Disable</> : <><IconCheck size={18} stroke={1.5} /> Enable</>}
                      </button>
                    </td>
                  </tr>)}
                {promos.length === 0 && <tr>
                    <td colSpan="5" className="p-8 text-center text-on-surface-variant font-medium">
                      No promo codes found.
                    </td>
                  </tr>}
              </tbody>
            </table>
          </div>}
      </div>
    </div>;
}