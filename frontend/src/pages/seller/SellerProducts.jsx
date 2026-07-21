/**
 * File: SellerProducts.jsx
 * Description: Auto-generated documentation for SellerProducts.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import GHS from '../../utils/currency';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useSocket } from '../../context/SocketContext';
import { IconPlus, IconEdit, IconTrash, IconPackage, IconSearch, IconFilter, IconDotsVertical } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
export default /**
 * Function SellerProducts
 * @returns {any}
 */
function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  /**
 * Arrow Function fetchProducts
 * @returns {any}
 */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/seller/products');
      setProducts(res.data.products);
    } catch (err) {
      console.error('Failed to fetch seller products:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const {
    socket
  } = useSocket();
  useEffect(() => {
    if (!socket) return;
    socket.on('new_order', fetchProducts);
    return () => socket.off('new_order', fetchProducts);
  }, [socket]);
  /**
 * Arrow Function handleDelete
 * @param {any} id
 * @returns {any}
 */
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete product');
    }
  };
  /**
 * Arrow Function handleBulkDelete
 * @returns {any}
 */
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    setIsDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => api.delete(`/products/${id}`)));
      setSelectedIds([]);
      fetchProducts();
    } catch {
      alert('Failed to delete some products. They may have existing orders.');
    } finally {
      setIsDeleting(false);
    }
  };
  /**
 * Arrow Function toggleSelectAll
 * @returns {any}
 */
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };
  /**
 * Arrow Function toggleSelect
 * @param {any} id
 * @returns {any}
 */
  const toggleSelect = id => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
      y: 10
    },
    show: {
      opacity: 1,
      y: 0,
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="h-64 bg-surface-container rounded-3xl" />
          <div className="h-64 bg-surface-container rounded-3xl" />
          <div className="h-64 bg-surface-container rounded-3xl" />
        </div>
      </div>;
  }
  return <div className="w-full max-w-[1400px] mx-auto">
      <SEO title="My Products | Seller Dashboard" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight mb-2">My Products</h1>
          <p className="text-on-surface-variant font-medium">Manage your product catalog and listings.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {selectedIds.length > 0 && <motion.button initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} onClick={handleBulkDelete} disabled={isDeleting} className="inline-flex items-center justify-center gap-2 bg-error/10 text-error font-bold px-6 py-3.5 rounded-2xl hover:bg-error hover:text-white transition-all active:scale-95">
              <IconTrash size={20} stroke={2} /> {isDeleting ? 'Deleting...' : `Delete (${selectedIds.length})`}
            </motion.button>}
          <Link to="/seller/products/new" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3.5 rounded-2xl shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95">
            <IconPlus size={20} stroke={2} /> Add Product
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-surface border border-outline/20 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-on-surface-variant/50 shadow-sm" />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
          <button className="whitespace-nowrap py-4 px-6 bg-surface border border-outline/20 rounded-2xl text-on-surface-variant font-bold flex items-center gap-2 hover:bg-surface-variant/50 transition-colors shadow-sm">
            <IconFilter size={20} /> Filter
          </button>
          {filteredProducts.length > 0 && <button onClick={toggleSelectAll} className={`whitespace-nowrap py-4 px-6 border rounded-2xl font-bold flex items-center gap-2 transition-all shadow-sm ${selectedIds.length === filteredProducts.length ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface border-outline/20 text-on-surface-variant hover:bg-surface-variant/50'}`}>
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedIds.length === filteredProducts.length ? 'bg-primary border-primary text-white' : 'border-outline/50'}`}>
                {selectedIds.length === filteredProducts.length && <IconPlus size={14} className="rotate-45" />}
              </div>
              Select All
            </button>}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map(p => <motion.div key={p.id} variants={itemVariants} className={`group bg-surface border rounded-3xl overflow-hidden shadow-sm hover:shadow-level-2 transition-all duration-300 relative ${selectedIds.includes(p.id) ? 'border-primary/50 ring-2 ring-primary/20' : 'border-outline/20'}`}>
              
              {/* Checkbox Overlay */}
              <div className="absolute top-4 left-4 z-10">
                <button onClick={() => toggleSelect(p.id)} className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center backdrop-blur-md transition-all ${selectedIds.includes(p.id) ? 'bg-primary text-white scale-110' : 'bg-white/80 text-transparent hover:bg-white border border-outline/20'}`}>
                  <IconPlus size={18} stroke={3} className={selectedIds.includes(p.id) ? 'rotate-45' : ''} />
                </button>
              </div>

              {/* Action Menu (Top Right) */}
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 backdrop-blur-md rounded-full shadow-md flex items-center p-1 border border-outline/10">
                   <Link to={`/seller/products/${p.id}/edit`} className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-secondary/10 transition-colors">
                     <IconEdit size={16} stroke={2} />
                   </Link>
                   <div className="w-px h-4 bg-outline/20 mx-1"></div>
                   <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error/10 transition-colors">
                     <IconTrash size={16} stroke={2} />
                   </button>
                </div>
              </div>

              {/* Image */}
              <div className="aspect-[4/3] w-full bg-surface-variant/30 overflow-hidden relative">
                {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out" /> : <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                    <IconPackage size={64} stroke={1} />
                  </div>}
                {/* Status Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md ${p.is_active ? 'bg-success/90 text-white' : 'bg-surface-variant/90 text-on-surface-variant'}`}>
                    {p.is_active ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-bold text-lg text-primary leading-tight line-clamp-1">{p.name}</h3>
                  <p className="font-black text-lg text-primary">{GHS(p.price)}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                  <span className="bg-surface-variant/50 px-2 py-1 rounded-md">{p.category_name || 'No Category'}</span>
                  {p.brand && <span className="bg-surface-variant/50 px-2 py-1 rounded-md truncate max-w-[100px]">{p.brand}</span>}
                </div>
              </div>

            </motion.div>)}
        </motion.div> : <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="bg-surface border border-outline/20 rounded-[2rem] p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-6">
            <IconPackage size={48} stroke={1.5} />
          </div>
          <h2 className="text-2xl font-black text-primary mb-2">No products found</h2>
          <p className="max-w-[400px] mx-auto mb-8 text-on-surface-variant font-medium">
            {searchTerm ? "We couldn't find any products matching your search. Try different keywords." : "You haven't listed any products yet. Create your first listing to start selling!"}
          </p>
          {!searchTerm && <Link to="/seller/products/new" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl shadow-md hover:-translate-y-1 transition-all">
              <IconPlus size={20} stroke={2} /> Post New Item
            </Link>}
        </motion.div>}

    </div>;
}