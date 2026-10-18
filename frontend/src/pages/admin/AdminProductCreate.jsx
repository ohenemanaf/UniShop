/**
 * File: AdminProductCreate.jsx
 * Description: Auto-generated documentation for AdminProductCreate.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconPlus, IconTrash, IconDeviceFloppy, IconCurrencyDollar, IconPackage, IconPhoto, IconBarcode, IconTag, IconInfoCircle } from '@tabler/icons-react';
import ImageUpload from '../../components/ImageUpload';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
export default /**
 * Function AdminProductCreate
 * @returns {any}
 */
function AdminProductCreate() {
  const navigate = useNavigate();
  const {
    isAdmin
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [product, setProduct] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    brand: '',
    image_url: '',
    gallery_images: [],
    tags: ''
  });
  const [variants, setVariants] = useState([{
    sku: '',
    name: '',
    price: '',
    compare_price: '',
    stock: '',
    image_url: ''
  }]);
  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(err => console.error(err));
  }, []);
  /**
 * Arrow Function generateSlug
 * @param {any} name
 * @returns {any}
 */
  const generateSlug = name => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };
  /**
 * Arrow Function handleProductChange
 * @param {any} e
 * @returns {any}
 */
  const handleProductChange = e => {
    const {
      name,
      value
    } = e.target;
    setProduct(prev => {
      const next = {
        ...prev,
        [name]: value
      };
      if (name === 'name' && !prev.slug) {
        next.slug = generateSlug(value);
      }
      return next;
    });
  };
  /**
 * Arrow Function handleVariantChange
 * @param {any} index
 * @param {any} field
 * @param {any} value
 * @returns {any}
 */
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };
  /**
 * Arrow Function addVariant
 * @returns {any}
 */
  const addVariant = () => {
    setVariants([...variants, {
      sku: '',
      name: '',
      price: '',
      compare_price: '',
      stock: '',
      image_url: ''
    }]);
  };
  /**
 * Arrow Function removeVariant
 * @param {any} index
 * @returns {any}
 */
  const removeVariant = index => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };
  /**
 * Arrow Function handleSubmit
 * @param {any} e
 * @returns {any}
 */
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Validation
    if (!product.name || !product.slug) {
      setError('Product Name and Slug are required.');
      return;
    }
    if (variants.length === 0) {
      setError('At least one variant is required.');
      return;
    }
    for (let v of variants) {
      if (!v.sku || !v.price) {
        setError('All variants must have a SKU and Price.');
        return;
      }
    }
    setLoading(true);
    const payload = {
      ...product,
      category_id: product.category_id || null,
      variants: variants.map(v => ({
        ...v,
        price: parseFloat(v.price),
        compare_price: v.compare_price ? parseFloat(v.compare_price) : null,
        stock: v.stock ? parseInt(v.stock) : 0,
        attributes: v.name ? {
          variant: v.name
        } : {}
      }))
    };
    try {
      await api.post('/products', payload);
      navigate(isAdmin ? '/admin/products' : '/seller/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product.');
      setLoading(false);
    }
  };
  return <div className="w-full max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-6 mb-8">
        <button type="button" className="w-12 h-12 rounded-full flex items-center justify-center bg-surface border border-outline/50 hover:border-primary text-primary transition-all active:scale-95 shadow-sm" onClick={() => navigate(isAdmin ? '/admin/products' : '/seller/products')}>
          <IconArrowLeft size={24} stroke={1.5} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Add New Product</h1>
          <p className="text-on-surface-variant font-medium">Create a new product listing with multiple variants.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {error && <div className="bg-error/10 border border-error/20 text-error p-5 rounded-2xl flex items-center gap-4 font-medium shadow-sm">
            <IconInfoCircle className="text-error shrink-0" size={24} stroke={1.5} /> {error}
          </div>}

        {/* Basic Details Section */}
        <div className="bg-surface border border-outline/30 rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-outline/30">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <IconPackage size={24} stroke={1.5} />
            </div>
            <h3 className="text-xl font-bold text-primary">Basic Details</h3>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Product Name *</label>
                <input name="name" className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={product.name} onChange={handleProductChange} required placeholder="e.g. Premium Wireless Headphones" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">URL Slug *</label>
                <input name="slug" className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={product.slug} onChange={handleProductChange} required placeholder="e.g. premium-wireless-headphones" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-primary uppercase tracking-wider">Description</label>
              <textarea name="description" className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-medium text-primary focus:border-primary transition-colors shadow-sm resize-y min-h-[120px]" value={product.description} onChange={handleProductChange} placeholder="Write a detailed product description..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Category</label>
                <select name="category_id" className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm appearance-none cursor-pointer" value={product.category_id} onChange={handleProductChange}>
                  <option value="">-- Select Category --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Brand</label>
                <input name="brand" className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={product.brand} onChange={handleProductChange} placeholder="e.g. Sony" />
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
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Tags</label>
                <input name="tags" className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={product.tags} onChange={handleProductChange} placeholder="audio, wireless, noise-cancelling" />
                <span className="text-xs font-semibold text-on-surface-variant">Comma separated</span>
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
          </div>
        </div>

        {/* Variants Section */}
        <div className="bg-surface border border-outline/30 rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-outline/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0 border border-success/20">
                <IconCurrencyDollar size={24} stroke={1.5} />
              </div>
              <h3 className="text-xl font-bold text-primary">Variants & Pricing</h3>
            </div>
            <button type="button" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-surface border border-outline/50 text-primary hover:border-primary transition-all active:scale-95 shadow-sm" onClick={addVariant}>
              <IconPlus size={18} stroke={1.5} /> Add Variant
            </button>
          </div>

          <div className="flex flex-col gap-8">
            {variants.map((variant, index) => <div key={index} className="bg-surface-variant/30 rounded-2xl p-6 relative group border border-outline/30">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline/30">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Variant #{index + 1}</h4>
                  {variants.length > 1 && <button type="button" className="text-error/70 hover:text-error bg-error/10 hover:bg-error/20 p-2 rounded-xl transition-colors border border-error/20" onClick={() => removeVariant(index)}>
                      <IconTrash size={18} stroke={1.5} />
                    </button>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">SKU *</label>
                    <input className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} required placeholder="e.g. WH-1000XM4-BLK" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">Variant Name</label>
                    <input className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={variant.name} onChange={e => handleVariantChange(index, 'name', e.target.value)} placeholder="e.g. Midnight Black" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">Price ($) *</label>
                    <input type="number" step="0.01" className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} required placeholder="0.00" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">Compare at Price ($)</label>
                    <input type="number" step="0.01" className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={variant.compare_price} onChange={e => handleVariantChange(index, 'compare_price', e.target.value)} placeholder="Original price" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">Initial Stock</label>
                    <input type="number" className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} placeholder="0" />
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-4">
          <button type="button" className="px-8 py-3.5 rounded-xl font-bold bg-surface border border-outline/50 text-primary hover:border-primary transition-all active:scale-95 shadow-sm" onClick={() => navigate(isAdmin ? '/admin/products' : '/seller/products')}>
            Cancel
          </button>
          <button type="submit" className="px-8 py-3.5 rounded-xl font-bold bg-primary text-white shadow-sm hover:shadow-md transition-all active:scale-95" disabled={loading}>
            {loading ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>;
}