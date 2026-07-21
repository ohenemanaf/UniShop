/**
 * File: PackingSlip.jsx
 * Description: Auto-generated documentation for PackingSlip.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from "../../api";
import { IconPrinter, IconArrowLeft } from '@tabler/icons-react';
import SEO from '../../components/SEO';
export default /**
 * Function PackingSlip
 * @returns {any}
 */
function PackingSlip() {
  const {
    id
  } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get(`/orders/${id}`).then(res => setOrder(res.data)).catch(err => console.error(err)).finally(() => setLoading(false));
  }, [id]);
  if (loading) {
    return <div className="w-full max-w-[800px] mx-auto p-8 animate-pulse">
        <div className="h-10 w-48 bg-surface-container rounded-lg mb-8" />
        <div className="h-96 w-full bg-surface-container rounded-3xl" />
      </div>;
  }
  if (!order) {
    return <div className="w-full flex items-center justify-center p-12 text-secondary font-headline-md">
        Order not found
      </div>;
  }
  /**
 * Arrow Function handlePrint
 * @returns {any}
 */
  const handlePrint = () => {
    window.print();
  };
  return <div className="w-full bg-background min-h-screen py-8">
      <SEO title={`Packing Slip #${order.id.slice(0, 8)}`} />
      
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 print:hidden flex justify-between items-center mb-8">
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 font-label-md font-bold text-secondary hover:text-primary transition-colors active-scale">
          <IconArrowLeft size={18} /> Back
        </button>
        <button onClick={handlePrint} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-label-md font-bold shadow-sm hover:shadow-md transition-all active-scale">
          <IconPrinter size={18} /> Print Packing Slip
        </button>
      </div>

      <div className="max-w-[800px] mx-auto bg-white text-black p-10 md:p-14 min-h-[1000px] shadow-level-1 print:shadow-none print:p-0 print:min-h-0">
        <div className="flex justify-between border-b-2 border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 m-0">PACKING SLIP</h1>
            <p className="text-gray-500 font-medium mt-2 m-0 uppercase tracking-widest">Order #{order.id.slice(0, 8)}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-gray-900 m-0 tracking-tight">UniShop Fulfillment</h2>
            <p className="text-gray-500 font-medium mt-2 m-0">Date: {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex justify-between mb-12">
          <div>
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-3 m-0">Ship To</h3>
            <div className="text-gray-800 leading-relaxed font-medium">
              <p className="m-0 font-bold text-gray-900">{order.shipping_line1}</p>
              {order.shipping_line2 && <p className="m-0">{order.shipping_line2}</p>}
              <p className="m-0">{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
              <p className="m-0">{order.shipping_country}</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-3 m-0">Shipping Method</h3>
            <div className="text-gray-800 leading-relaxed font-medium">
              <p className="m-0 font-bold text-gray-900">Standard Delivery</p>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse mb-12">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="py-4 px-4 text-left text-gray-600 font-bold uppercase tracking-wider text-sm w-1/5">SKU</th>
              <th className="py-4 px-4 text-left text-gray-600 font-bold uppercase tracking-wider text-sm w-3/5">Item Description</th>
              <th className="py-4 px-4 text-center text-gray-600 font-bold uppercase tracking-wider text-sm w-1/5">Qty To Ship</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map(item => <tr key={item.id}>
                <td className="py-6 px-4 text-sm font-mono text-gray-500">{item.sku}</td>
                <td className="py-6 px-4">
                  <div className="font-bold text-gray-900 text-lg">{item.product_name}</div>
                  {item.variant_name && <div className="text-gray-500 text-sm mt-1">Variant: {item.variant_name}</div>}
                </td>
                <td className="py-6 px-4 text-center text-gray-900 font-black text-2xl">{item.quantity}</td>
              </tr>)}
          </tbody>
        </table>

        <div className="mt-20 text-center text-gray-500 text-sm border-t border-gray-200 pt-8 font-medium">
          Please include this packing slip with the shipment.
        </div>
      </div>
    </div>;
}