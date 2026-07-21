/**
 * File: InventoryDashboard.jsx
 * Description: Auto-generated documentation for InventoryDashboard.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import api from '../api';
import { IconPackage, IconAlertTriangle, IconDeviceFloppy, IconCheck } from '@tabler/icons-react';
import SEO from '../components/SEO';
export default /**
 * Function InventoryDashboard
 * @returns {any}
 */
function InventoryDashboard() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Track modified stocks locally before bulk saving
  const [edits, setEdits] = useState({});
  useEffect(() => {
    fetchInventory();
  }, []);
  /**
 * Arrow Function fetchInventory
 * @returns {any}
 */
  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setInventory(res.data);
    } catch {
      setError('Failed to fetch inventory.');
    } finally {
      setLoading(false);
    }
  };
  /**
 * Arrow Function handleStockChange
 * @param {any} sku
 * @param {any} value
 * @returns {any}
 */
  const handleStockChange = (sku, value) => {
    setEdits(prev => ({
      ...prev,
      [sku]: parseInt(value, 10) || 0
    }));
  };
  /**
 * Arrow Function handleBulkSave
 * @returns {any}
 */
  const handleBulkSave = async () => {
    const updates = Object.keys(edits).map(sku => ({
      sku,
      stock: edits[sku]
    }));
    if (updates.length === 0) return;
    setSaving(true);
    setSuccessMsg('');
    setError('');
    try {
      await api.patch('/inventory/bulk', {
        updates
      });
      setSuccessMsg('Inventory successfully updated!');
      setEdits({});
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update inventory.');
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return <div className="w-full animate-pulse p-lg">
        <div className="h-10 w-64 bg-surface-container rounded-lg mb-8" />
        <div className="h-64 w-full bg-surface-container rounded-2xl" />
      </div>;
  }
  /**
 * Arrow Function getAvailable
 * @param {any} stock
 * @param {any} reserved
 * @returns {any}
 */
  const getAvailable = (stock, reserved) => stock - reserved;
  const hasEdits = Object.keys(edits).length > 0;
  return <div className="w-full">
      <SEO title="Inventory Management | Seller Dashboard" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-variant/50 text-primary flex items-center justify-center border border-outline/30">
              <IconPackage size={24} stroke={1.5} />
            </div>
            Inventory Management
          </h1>
          <p className="text-on-surface-variant font-medium">Quickly update stock levels across your products.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-level-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100" disabled={!hasEdits || saving} onClick={handleBulkSave}>
          <IconDeviceFloppy size={20} stroke={1.5} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && <div className="bg-error/10 text-error border border-error/20 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 mb-6">
          <IconAlertTriangle size={20} stroke={1.5} /> {error}
        </div>}
      {successMsg && <div className="bg-success/10 text-success border border-success/20 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 mb-6">
          <IconCheck size={20} stroke={1.5} /> {successMsg}
        </div>}

      <div className="bg-surface border border-outline/30 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant/30 border-b border-outline/30">
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">SKU</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Product</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Variant</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap text-right">Available</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap text-right">Reserved</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap w-32">Total Stock</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {inventory.map(item => {
              const currentStock = edits[item.sku] !== undefined ? edits[item.sku] : item.stock;
              const available = getAvailable(currentStock, item.reserved);
              const isLowStock = available < 10;
              const isOutOfStock = available <= 0;
              const isEdited = edits[item.sku] !== undefined;
              return <tr key={item.sku} className={`hover:bg-surface-variant/30 transition-colors group ${isOutOfStock ? 'bg-error/5' : ''}`}>
                    <td className="p-4">
                      <code className="text-xs font-bold text-primary bg-surface-variant px-2 py-1 rounded-md border border-outline/30">{item.sku}</code>
                    </td>
                    <td className="p-4 text-base font-bold text-primary">{item.product_name}</td>
                    <td className="p-4 text-sm font-medium text-on-surface-variant">{item.variant_name || 'Default'}</td>
                    <td className="p-4 text-right">
                      <span className={`text-lg font-bold ${isOutOfStock ? 'text-error' : 'text-primary'}`}>
                        {available}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xs font-bold text-on-surface-variant bg-surface-variant px-3 py-1 rounded-full">{item.reserved}</span>
                    </td>
                    <td className="p-4">
                      <input type="number" className={`w-full bg-surface-variant p-3 rounded-xl border outline-none focus:border-outline/50 transition-all font-bold text-right shadow-sm ${isEdited ? 'border-primary/50 bg-primary/5 text-primary' : 'border-transparent text-primary'}`} value={currentStock} onChange={e => handleStockChange(item.sku, e.target.value)} min="0" />
                    </td>
                    <td className="p-4 text-center">
                      {isOutOfStock ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-error/10 text-error border-error/20">
                          <IconAlertTriangle size={14} stroke={2} /> Out of Stock
                        </span> : isLowStock ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-secondary/10 text-secondary border-secondary/20">
                          <IconAlertTriangle size={14} stroke={2} /> Low Stock
                        </span> : <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-success/10 text-success border-success/20">
                          <IconCheck size={14} stroke={2} /> In Stock
                        </span>}
                    </td>
                  </tr>;
            })}
              {inventory.length === 0 && <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant py-8">
                      <IconPackage size={48} stroke={1.5} className="mb-4 opacity-50" />
                      <p className="text-lg font-bold text-primary">No inventory items found</p>
                    </div>
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}