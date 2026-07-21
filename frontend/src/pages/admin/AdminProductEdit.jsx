/**
 * File: AdminProductEdit.jsx
 * Description: Auto-generated documentation for AdminProductEdit.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconPackage } from '@tabler/icons-react';
import ImageUpload from '../../components/ImageUpload';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
export default /**
 * Function AdminProductEdit
 * @returns {any}
 */
function AdminProductEdit() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    showToast
  } = useToast();
  const {
    isSeller
  } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category_id: '',
    brand: '',
    image_url: '',
    gallery_images: [],
    tags: ''
  });
  useEffect(() => {
    Promise.all([api.get(`/products/${id}`), api.get('/categories')]).then(([prodRes, catRes]) => {
      const p = prodRes.data;
      setProduct({
        name: p.name || '',
        description: p.description || '',
        category_id: p.category_id || '',
        brand: p.brand || '',
        image_url: p.image_url || '',
        gallery_images: (() => {
          if (!p.gallery_images) return [];
          if (typeof p.gallery_images === 'string') {
            try {
              return JSON.parse(p.gallery_images);
            } catch (e) {
              return [];
            }
          }
          return Array.isArray(p.gallery_images) ? p.gallery_images : [];
        })(),
        tags: p.tags || ''
      });
      setCategories(catRes.data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load product:', err);
      showToast('Failed to load product data.', 'error');
      setLoading(false);
    });
  }, [id, showToast]);
  /**
 * Arrow Function handleChange
 * @param {any} e
 * @returns {any}
 */
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };
  /**
 * Arrow Function handleSubmit
 * @param {any} e
 * @returns {any}
 */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!product.name) {
      showToast('Product name is required.', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/products/${id}`, {
        name: product.name,
        description: product.description || null,
        category_id: product.category_id || null,
        brand: product.brand || null,
        image_url: product.image_url || null,
        gallery_images: product.gallery_images || null,
        tags: product.tags || null
      });
      showToast('Product updated successfully!', 'success');
      navigate(isSeller ? '/seller/products' : '/admin/products');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update product.', 'error');
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return <div className="w-full max-w-4xl mx-auto p-8 animate-pulse">
        <div className="h-10 w-48 bg-surface-variant/30 rounded-lg mb-8" />
        <div className="h-96 w-full bg-surface-variant/30 rounded-[2rem]" />
      </div>;
  }
  return <div className="w-full max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-6 mb-8">
        <button type="button" className="w-12 h-12 rounded-full flex items-center justify-center bg-surface border border-outline/50 hover:border-primary text-primary transition-all active:scale-95 shadow-sm" onClick={() => navigate(isSeller ? '/seller/products' : '/admin/products')}>
          <IconArrowLeft size={24} stroke={1.5} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Edit Product</h1>
          <p className="text-on-surface-variant font-medium">Update product details and metadata.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="bg-surface border border-outline/30 rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-outline/30">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <IconPackage size={24} stroke={1.5} />
            </div>
            <h3 className="text-xl font-bold text-primary">Product Details</h3>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-primary uppercase tracking-wider">Product Name *</label>
              <input name="name" className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={product.name} onChange={handleChange} required />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-primary uppercase tracking-wider">Description</label>
              <textarea name="description" className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-medium text-primary focus:border-primary transition-colors shadow-sm resize-y min-h-[120px]" rows="5" value={product.description} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Category</label>
                <select name="category_id" className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm appearance-none cursor-pointer" value={product.category_id} onChange={handleChange}>
                  <option value="">-- No Category --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Brand</label>
                <input name="brand" className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={product.brand} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Main Image URL</label>
                <ImageUpload value={product.image_url} onChange={url => setProduct(p => ({
                ...p,
                image_url: url
              }))} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Tags (comma separated)</label>
                <input name="tags" className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={product.tags} onChange={handleChange} placeholder="e.g. tech, premium, wireless" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="text-sm font-bold text-primary uppercase tracking-wider">Gallery Images (Optional)</label>
              <p className="text-sm text-on-surface-variant mb-2">Upload additional angles like side view, detail shot, or in use. Maximum 4 images.</p>
              <div className="flex flex-col gap-3">
                {[0, 1, 2, 3].map(index => <ImageUpload key={index} value={product.gallery_images[index] || ''} onChange={url => {
                setProduct(p => {
                  const newGallery = [...p.gallery_images];
                  newGallery[index] = url;
                  // Filter out empty strings to keep array clean
                  return {
                    ...p,
                    gallery_images: newGallery.filter(Boolean)
                  };
                });
              }} />)}
              </div>
            </div>

            {product.image_url && <div className="mt-4 flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Image Preview</label>
                <img src={product.image_url} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-outline/30 bg-surface-variant/30 shadow-sm mix-blend-multiply" onError={e => {
              e.target.style.display = 'none';
            }} />
              </div>}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button type="button" className="px-8 py-3.5 rounded-xl font-bold bg-surface border border-outline/50 text-primary hover:border-primary transition-all active:scale-95 shadow-sm" onClick={() => navigate(isSeller ? '/seller/products' : '/admin/products')}>
            Cancel
          </button>
          <button type="submit" className="px-8 py-3.5 rounded-xl font-bold bg-primary text-white shadow-sm hover:shadow-md transition-all active:scale-95" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>;
}