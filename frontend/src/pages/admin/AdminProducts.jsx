/**
 * File: AdminProducts.jsx
 * Description: Auto-generated documentation for AdminProducts.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import GHS from '../../utils/currency';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { IconPackage, IconPlus, IconBox, IconAlertTriangle, IconCheck } from '@tabler/icons-react';
export default /**
 * Function AdminProducts
 * @returns {any}
 */
function AdminProducts() {
  const navigate = useNavigate();
  const {
    showToast
  } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingSku, setUpdatingSku] = useState(null);
  /**
 * Arrow Function fetchProducts
 * @returns {any}
 */
  const fetchProducts = () => {
    setLoading(true);
    api.get('/admin/inventory', {
      params: {
        page,
        limit: 15
      }
    }).then(res => {
      setProducts(res.data.inventory);
      setTotalPages(res.data.pagination.totalPages);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load products', err);
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  /**
 * Arrow Function handleUpdateStock
 * @param {any} sku
 * @param {any} currentStock
 * @returns {any}
 */
  const handleUpdateStock = async (sku, currentStock) => {
    const newStock = prompt(`Update stock for SKU: ${sku}`, currentStock);
    if (newStock === null) return;
    const stockVal = parseInt(newStock);
    if (isNaN(stockVal) || stockVal < 0) {
      showToast('Please enter a valid stock number.', 'error');
      return;
    }
    setUpdatingSku(sku);
    try {
      await api.patch(`/admin/inventory/${sku}`, {
        stock: stockVal
      });
      showToast('Inventory updated successfully!', 'success');
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update inventory.', 'error');
    } finally {
      setUpdatingSku(null);
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
              <IconPackage size={24} stroke={1.5} />
            </div>
            Products & Inventory
          </h1>
          <p className="text-on-surface-variant font-medium">Manage all products and platform inventory.</p>
        </div>
        <button onClick={() => navigate('/admin/products/new')} className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-level-2 transition-all active:scale-95">
          <IconPlus size={20} stroke={1.5} /> Add New Product
        </button>
      </div>

      <div className="bg-surface border border-outline/30 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant/30 border-b border-outline/30">
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Product</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">SKU / Variant</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Price</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Stock</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {products.map(product => {
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= 10;
              return <tr key={product.sku} className={`hover:bg-surface-variant/30 transition-colors group ${isOutOfStock ? 'bg-error/5' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-surface-variant/50 overflow-hidden border border-outline/30 shrink-0">
                          <img src={product.image_url || 'https://placehold.co/400x400/FAFAFA/333333.png?text=Product'} alt={product.product_name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <span className="text-base font-bold text-primary line-clamp-2">{product.product_name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="text-xs font-bold text-primary bg-surface-variant px-2 py-1 rounded-md border border-outline/30 block w-max mb-1">{product.sku}</code>
                      {product.variant_name && <span className="text-xs font-medium text-on-surface-variant">{product.variant_name}</span>}
                    </td>
                    <td className="p-4 text-sm font-bold text-primary">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-1 ${isOutOfStock ? 'bg-error/10 text-error border-error/20' : isLowStock ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-success/10 text-success border-success/20'}`}>
                        {isOutOfStock ? <IconAlertTriangle size={14} stroke={2} /> : isLowStock ? <IconAlertTriangle size={14} stroke={2} /> : <IconCheck size={14} stroke={2} />}
                        {product.stock || 0} in stock
                      </span>
                      {product.reserved > 0 && <span className="block text-xs font-bold text-on-surface-variant ml-1">{product.reserved} reserved</span>}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-surface border border-outline/50 hover:border-primary transition-all active:scale-95 text-primary shadow-sm" onClick={() => navigate(`/admin/products/${product.product_id || ''}/edit`)}>
                          Edit
                        </button>
                        <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:shadow-md transition-all active:scale-95 disabled:opacity-50 shadow-sm" onClick={() => handleUpdateStock(product.sku, product.stock || 0)} disabled={updatingSku === product.sku}>
                          {updatingSku === product.sku ? 'Updating...' : 'Stock'}
                        </button>
                      </div>
                    </td>
                  </tr>;
            })}
              {products.length === 0 && <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant py-8">
                      <IconBox size={48} stroke={1.5} className="mb-4 opacity-50" />
                      <p className="text-lg font-bold text-primary">No products found</p>
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