/**
 * File: AdminBanners.jsx
 * Description: Auto-generated documentation for AdminBanners.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { IconPlus, IconEdit, IconTrash, IconPhoto, IconDeviceDesktopAnalytics, IconX, IconCheck } from '@tabler/icons-react';
import ImageUpload from '../../components/ImageUpload';
export default /**
 * Function AdminBanners
 * @returns {any}
 */
function AdminBanners() {
  const {
    showToast
  } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    is_active: 1,
    position: 'hero'
  });
  /**
 * Arrow Function fetchBanners
 * @returns {any}
 */
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/banners');
      setBanners(res.data.banners);
    } catch (err) {
      console.error('Failed to load banners', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBanners();
  }, []);
  /**
 * Arrow Function handleOpenModal
 * @param {any} banner
 * @returns {any}
 */
  const handleOpenModal = (banner = null) => {
    if (banner) {
      setIsEditing(true);
      setFormData({
        id: banner.id,
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        image_url: banner.image_url || '',
        link_url: banner.link_url || '',
        position: banner.position || 'hero',
        is_active: banner.is_active
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: '',
        title: '',
        subtitle: '',
        image_url: '',
        link_url: '',
        position: 'hero',
        is_active: 1
      });
    }
    setShowModal(true);
  };
  /**
 * Arrow Function handleSave
 * @param {any} e
 * @returns {any}
 */
  const handleSave = async e => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.patch(`/admin/banners/${formData.id}`, formData);
        showToast('Banner updated successfully!', 'success');
      } else {
        await api.post('/admin/banners', formData);
        showToast('Banner created successfully!', 'success');
      }
      setShowModal(false);
      fetchBanners();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save banner.', 'error');
    }
  };
  /**
 * Arrow Function handleDelete
 * @param {any} id
 * @returns {any}
 */
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      await api.delete(`/admin/banners/${id}`);
      showToast('Banner deleted.', 'success');
      fetchBanners();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete banner.', 'error');
    }
  };
  /**
 * Arrow Function handleToggleActive
 * @param {any} banner
 * @returns {any}
 */
  const handleToggleActive = async banner => {
    try {
      await api.patch(`/admin/banners/${banner.id}`, {
        is_active: banner.is_active ? 0 : 1
      });
      fetchBanners();
    } catch (err) {
      showToast('Failed to toggle status.', 'error');
    }
  };
  return <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Banners & Promotions</h1>
          <p className="text-on-surface-variant font-medium">Manage the dynamic hero banners on the storefront homepage.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-primary text-white shadow-sm hover:shadow-md transition-all active:scale-95">
          <IconPlus size={20} stroke={1.5} /> Add Banner
        </button>
      </div>

      <div className="bg-surface border border-outline/30 rounded-[2rem] overflow-hidden shadow-sm">
        {loading ? <div className="w-full animate-pulse p-lg">
             <div className="h-64 w-full bg-surface-variant/30 rounded-[2rem]" />
          </div> : <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-variant/30 border-b border-outline/30">
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Preview</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Details</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/30">
                {banners.length === 0 ? <tr>
                    <td colSpan="4" className="p-12 text-center text-on-surface-variant">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-2">
                          <IconDeviceDesktopAnalytics size={32} stroke={1.5} />
                        </div>
                        <p className="text-lg font-bold text-primary">No banners found.</p>
                        <p className="text-sm font-medium">Create a banner to feature it on the homepage.</p>
                      </div>
                    </td>
                  </tr> : banners.map(b => <tr key={b.id} className="hover:bg-surface-variant/30 transition-colors group">
                      <td className="p-4 w-48">
                        <div className="w-40 h-20 rounded-lg overflow-hidden bg-surface-variant border border-outline/30 flex items-center justify-center">
                           {b.image_url ? <img src={b.image_url} alt="Banner" className="w-full h-full object-cover" /> : <IconPhoto className="text-on-surface-variant opacity-50" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-base font-bold text-primary mb-1">{b.title || <span className="italic opacity-50">No title</span>}</p>
                        <p className="text-sm text-on-surface-variant mb-1">{b.subtitle || '-'}</p>
                        <p className="text-xs font-mono text-secondary truncate max-w-xs">{b.link_url || 'No link'}</p>
                      </td>
                      <td className="p-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={b.is_active === 1} onChange={() => handleToggleActive(b)} />
                          <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success border border-outline/30 shadow-inner"></div>
                          <span className="ml-3 text-sm font-bold text-primary">{b.is_active ? 'Active' : 'Hidden'}</span>
                        </label>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-outline/50 text-primary hover:border-primary active:scale-95 transition-all shadow-sm" onClick={() => handleOpenModal(b)} title="Edit">
                            <IconEdit size={18} stroke={1.5} />
                          </button>
                          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-error/10 border border-error/20 text-error hover:bg-error hover:text-white active:scale-95 transition-all shadow-sm" onClick={() => handleDelete(b.id)} title="Delete">
                            <IconTrash size={18} stroke={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>}
      </div>

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-[512px] rounded-[2rem] shadow-level-3 overflow-hidden border border-outline/30 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-outline/30 flex justify-between items-center bg-surface-variant/30 shrink-0">
              <h3 className="text-xl font-bold text-primary">
                {isEditing ? 'Edit Banner' : 'New Banner'}
              </h3>
            </div>
            
            <form onSubmit={handleSave} className="p-8 flex flex-col gap-5 overflow-y-auto flex-grow">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Image URL *</label>
                <ImageUpload value={formData.image_url} onChange={url => setFormData({
              ...formData,
              image_url: url
            })} placeholder="https://example.com/image.jpg" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Title</label>
                <input type="text" className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={formData.title} onChange={e => setFormData({
              ...formData,
              title: e.target.value
            })} placeholder="e.g. Summer Sale" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Subtitle</label>
                <input type="text" className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={formData.subtitle} onChange={e => setFormData({
              ...formData,
              subtitle: e.target.value
            })} placeholder="e.g. Up to 50% off" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Link URL</label>
                <input type="text" className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={formData.link_url} onChange={e => setFormData({
              ...formData,
              link_url: e.target.value
            })} placeholder="e.g. /products?category=electronics" />
              </div>

              <div className="flex items-center gap-3 mt-2">
                <input type="checkbox" id="isActive" checked={formData.is_active === 1} onChange={e => setFormData({
              ...formData,
              is_active: e.target.checked ? 1 : 0
            })} className="w-5 h-5 rounded border-outline text-primary focus:ring-primary" />
                <label htmlFor="isActive" className="text-sm font-bold text-primary cursor-pointer">Active</label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-outline/30 mt-4 shrink-0">
                <button type="button" className="px-6 py-3 rounded-xl font-semibold bg-surface border border-outline/50 text-primary hover:border-primary transition-all active:scale-95 shadow-sm" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 rounded-xl font-bold bg-primary text-white shadow-sm hover:shadow-md transition-all active:scale-95">
                  {isEditing ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
}