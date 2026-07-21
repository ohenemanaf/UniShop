/**
 * File: AdminCategories.jsx
 * Description: Auto-generated documentation for AdminCategories.jsx
 * Date: 2026-07-21
 */
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { IconEdit, IconTrash, IconPlus, IconFolder, IconSearch, IconX, IconCheck } from '@tabler/icons-react';
import ImageUpload from '../../components/ImageUpload';
export default /**
 * Function AdminCategories
 * @returns {any}
 */
function AdminCategories() {
  const {
    showToast
  } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Flattened array for the parent selection dropdown
  const [flatCategories, setFlatCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
    description: '',
    image_url: '',
    parent_id: ''
  });
  /**
 * Arrow Function fetchCategories
 * @returns {any}
 */
  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories').then(res => {
      setCategories(res.data);

      // Flatten the tree for parent dropdown
      const flattened = [];
      /**
 * Arrow Function flatten
 * @param {any} cats
 * @param {any} level
 * @returns {any}
 */
      const flatten = (cats, level = 0) => {
        cats.forEach(c => {
          flattened.push({
            ...c,
            level
          });
          if (c.children?.length > 0) flatten(c.children, level + 1);
        });
      };
      flatten(res.data);
      setFlatCategories(flattened);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load categories', err);
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  /**
 * Arrow Function handleOpenModal
 * @param {any} cat
 * @returns {any}
 */
  const handleOpenModal = (cat = null) => {
    if (cat) {
      setIsEditing(true);
      setFormData({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image_url: cat.image_url || '',
        parent_id: cat.parent_id || ''
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: '',
        name: '',
        slug: '',
        description: '',
        image_url: '',
        parent_id: ''
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
        await api.patch(`/admin/categories/${formData.id}`, formData);
        showToast('Category updated successfully!', 'success');
      } else {
        await api.post('/admin/categories', formData);
        showToast('Category created successfully!', 'success');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save category.', 'error');
    }
  };
  /**
 * Arrow Function handleDelete
 * @param {any} id
 * @returns {any}
 */
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this category? This might affect products.')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      showToast('Category deleted.', 'success');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete category.', 'error');
    }
  };

  // Render a row for a category and its children recursively
  const renderCategoryRows = (cats, level = 0) => {
    return cats.map(cat => <React.Fragment key={cat.id}>
        <tr className="hover:bg-surface-variant/30 transition-colors group border-b border-outline/30 last:border-b-0">
          <td className="p-4" style={{
          paddingLeft: `${level * 24 + 16}px`
        }}>
            <div className="flex items-center gap-4">
              {cat.image_url ? <img src={cat.image_url} alt={cat.name} className="w-12 h-12 object-cover rounded-xl bg-surface-variant/50 border border-outline/30 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" /> : <div className="w-12 h-12 rounded-xl bg-surface-variant/50 border border-outline/30 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform duration-300">
                  <IconFolder size={24} stroke={1.5} />
                </div>}
              <span className="text-base font-bold text-primary">{cat.name}</span>
            </div>
          </td>
          <td className="p-4">
            <code className="bg-surface-variant border border-outline/30 px-2 py-1 rounded-md text-primary text-xs font-bold font-mono">/{cat.slug}</code>
          </td>
          <td className="p-4 text-sm font-bold text-primary">
            {cat.product_count} <span className="text-xs font-semibold text-on-surface-variant opacity-70">products</span>
          </td>
          <td className="p-4">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-outline/50 text-primary hover:border-primary active:scale-95 transition-all shadow-sm" onClick={() => handleOpenModal(cat)} title="Edit">
                <IconEdit size={18} stroke={1.5} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-error/10 border border-error/20 text-error hover:bg-error hover:text-white active:scale-95 transition-all shadow-sm" onClick={() => handleDelete(cat.id)} title="Delete">
                <IconTrash size={18} stroke={1.5} />
              </button>
            </div>
          </td>
        </tr>
        {cat.children && cat.children.length > 0 && renderCategoryRows(cat.children, level + 1)}
      </React.Fragment>);
  };
  return <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Categories</h1>
          <p className="text-on-surface-variant font-medium">Manage your product hierarchy and collections.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary text-white shadow-sm hover:shadow-level-2 transition-all active:scale-95" onClick={() => handleOpenModal()}>
          <IconPlus size={20} stroke={1.5} /> New Category
        </button>
      </div>

      <div className="bg-surface border border-outline/30 rounded-[2rem] overflow-hidden shadow-sm">
        {loading ? <div className="w-full animate-pulse p-lg">
             <div className="h-64 w-full bg-surface-variant/30 rounded-[2rem]" />
          </div> : <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-variant/30 border-b border-outline/30">
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Category Name</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Slug</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Products</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/30">
                {categories.length === 0 ? <tr>
                    <td colSpan="4" className="p-8 text-center text-on-surface-variant font-medium">
                      No categories found. Start by creating one.
                    </td>
                  </tr> : renderCategoryRows(categories)}
              </tbody>
            </table>
          </div>}
      </div>

      {/* Modal */}
      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-[512px] rounded-[2rem] shadow-level-3 overflow-hidden border border-outline/30 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-outline/30 flex justify-between items-center bg-surface-variant/30">
              <h3 className="text-xl font-bold text-primary">
                {isEditing ? 'Edit Category' : 'New Category'}
              </h3>
            </div>
            
            <form onSubmit={handleSave} className="p-8 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Name *</label>
                <input type="text" className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} required />
              </div>

              {!isEditing && <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Slug *</label>
                  <input type="text" className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={formData.slug} onChange={e => setFormData({
              ...formData,
              slug: e.target.value
            })} required placeholder="e.g. electronics" />
                </div>}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Parent Category (Optional)</label>
                <select className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm appearance-none" value={formData.parent_id} onChange={e => setFormData({
              ...formData,
              parent_id: e.target.value
            })}>
                  <option value="">-- None (Top Level) --</option>
                  {flatCategories.filter(c => c.id !== formData.id).map(c => <option key={c.id} value={c.id}>
                      {'- '.repeat(c.level)}{c.name}
                    </option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Image URL</label>
                <ImageUpload value={formData.image_url} onChange={url => setFormData({
              ...formData,
              image_url: url
            })} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Description</label>
                <textarea className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm resize-y" value={formData.description} onChange={e => setFormData({
              ...formData,
              description: e.target.value
            })} rows={3} />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-outline/30">
                <button type="button" className="px-6 py-3 rounded-xl font-semibold bg-surface border border-outline/50 text-primary hover:border-primary transition-all active:scale-95 shadow-sm" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 rounded-xl font-semibold bg-primary text-white shadow-sm hover:shadow-md transition-all active:scale-95">
                  {isEditing ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
}