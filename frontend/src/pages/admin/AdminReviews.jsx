/**
 * File: AdminReviews.jsx
 * Description: Auto-generated documentation for AdminReviews.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { IconTrash, IconStarFilled, IconMessageCircle } from '@tabler/icons-react';
export default /**
 * Function AdminReviews
 * @returns {any}
 */
function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    showToast
  } = useToast();
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reviews');
      setReviews(res.data.reviews);
    } catch (err) {
      console.error(err);
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);
  /**
 * Arrow Function handleDelete
 * @param {any} id
 * @returns {any}
 */
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      showToast('Review deleted successfully', 'success');
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete review', 'error');
    }
  };
  return <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Customer Reviews</h1>
          <p className="text-on-surface-variant font-medium">Manage customer feedback and product ratings.</p>
        </div>
      </div>

      <div className="bg-surface border border-outline/30 rounded-[2rem] overflow-hidden shadow-sm">
        {loading ? <div className="w-full animate-pulse p-lg">
             <div className="h-64 w-full bg-surface-variant/30 rounded-[2rem]" />
          </div> : <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-variant/30 border-b border-outline/30">
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Product</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Rating</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Review</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">User</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/30">
                {reviews.length === 0 ? <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                        <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-2">
                          <IconMessageCircle size={32} stroke={1.5} />
                        </div>
                        <p className="text-lg font-bold text-primary">No reviews found.</p>
                        <p className="text-sm font-medium">When customers leave reviews, they'll appear here.</p>
                      </div>
                    </td>
                  </tr> : reviews.map(r => <tr key={r.id} className="hover:bg-surface-variant/30 transition-colors group">
                      <td className="p-4">
                        <span className="text-sm font-bold text-primary">{r.product_name}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-md w-max border border-yellow-500/20">
                          <span className="text-sm font-black">{r.rating}</span>
                          <IconStarFilled size={14} />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="max-w-[20rem] min-w-[250px]">
                          {r.title && <strong className="block text-sm font-bold text-primary mb-1 truncate">{r.title}</strong>}
                          <p className="text-sm font-medium text-on-surface-variant line-clamp-2" title={r.body}>{r.body}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-primary">{r.reviewer_name}</span>
                          <span className="text-xs font-semibold text-on-surface-variant">{r.reviewer_email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-on-surface-variant">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-error/10 border border-error/20 text-error hover:bg-error hover:text-white active:scale-95 transition-all shadow-sm" onClick={() => handleDelete(r.id)} title="Delete Review">
                          <IconTrash size={18} stroke={1.5} />
                        </button>
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>}
      </div>
    </div>;
}