/**
 * File: Invoice.jsx
 * Description: Auto-generated documentation for Invoice.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import GHS from '../utils/currency';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { IconPrinter, IconArrowLeft, IconDownload } from '@tabler/icons-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import SEO from '../components/SEO';
export default /**
 * Function Invoice
 * @returns {any}
 */
function Invoice() {
  const {
    id
  } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get(`/orders/${id}`).then(res => setOrder(res.data)).catch(err => console.error(err)).finally(() => setLoading(false));
  }, [id]);
  if (loading) {
    return <div className="w-full max-w-[800px] mx-auto px-4 md:px-8 py-12 animate-pulse">
        <div className="h-10 w-48 bg-surface-variant/50 rounded-xl mb-8" />
        <div className="h-96 w-full bg-surface-variant/50 rounded-[2rem]" />
      </div>;
  }
  if (!order) {
    return <div className="w-full flex items-center justify-center p-12 text-on-surface-variant text-2xl font-bold">
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
  /**
 * Arrow Function handleDownloadPDF
 * @returns {any}
 */
  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-document');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`UniShop_Invoice_${order.id.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('Failed to generate PDF');
    }
  };
  return <div className="w-full bg-background min-h-screen py-8">
      <SEO title={`Invoice #${order.id.slice(0, 8)} | UniShop`} />
      
      <div className="max-w-[800px] mx-auto px-4 md:px-8 print:hidden flex justify-between items-center mb-8 gap-4">
        <Link to={`/orders/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors active:scale-95">
          <IconArrowLeft size={18} stroke={1.5} /> Back to Order
        </Link>
        <div className="flex gap-3">
          <button onClick={handleDownloadPDF} className="inline-flex items-center gap-2 bg-surface border border-outline/50 text-primary px-6 py-2.5 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95">
            <IconDownload size={18} stroke={1.5} /> Download PDF
          </button>
          <button onClick={handlePrint} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95">
            <IconPrinter size={18} stroke={1.5} /> Print Invoice
          </button>
        </div>
      </div>

      <div id="invoice-document" className="max-w-[800px] mx-auto bg-white text-black p-10 md:p-14 min-h-[1000px] rounded-[2rem] shadow-sm border border-outline/30 print:shadow-none print:p-0 print:min-h-0 print:rounded-none print:border-none">
        <div className="flex justify-between border-b-2 border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 m-0">INVOICE</h1>
            <p className="text-gray-500 font-medium mt-2 m-0 uppercase tracking-widest">Order #{order.id.slice(0, 8)}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-gray-900 m-0 tracking-tight">UniShop</h2>
            <p className="text-gray-500 font-medium mt-2 m-0">Date: {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex justify-between mb-12">
          <div>
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-3 m-0">Billed To</h3>
            <div className="text-gray-800 leading-relaxed font-medium">
              <p className="m-0 font-bold text-gray-900">{order.shipping_line1}</p>
              {order.shipping_line2 && <p className="m-0">{order.shipping_line2}</p>}
              <p className="m-0">{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
              <p className="m-0">{order.shipping_country}</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-3 m-0">Payment Info</h3>
            <div className="text-gray-800 leading-relaxed font-medium">
              <p className="m-0">Method: <span className="font-bold text-gray-900 uppercase">{order.payment_method}</span></p>
              <p className="m-0">Status: <span className="font-bold text-gray-900">{order.payment_status}</span></p>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse mb-12">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="py-4 px-4 text-left text-gray-600 font-bold uppercase tracking-wider text-sm">Item</th>
              <th className="py-4 px-4 text-center text-gray-600 font-bold uppercase tracking-wider text-sm">Qty</th>
              <th className="py-4 px-4 text-right text-gray-600 font-bold uppercase tracking-wider text-sm">Unit Price</th>
              <th className="py-4 px-4 text-right text-gray-600 font-bold uppercase tracking-wider text-sm">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map(item => <tr key={item.id}>
                <td className="py-4 px-4">
                  <div className="font-bold text-gray-900">{item.product_name}</div>
                  {item.variant_name && <div className="text-gray-500 text-sm mt-1">{item.variant_name}</div>}
                  {item.tracking_number && <div className="text-gray-400 text-xs mt-1 font-mono uppercase tracking-wider">Tracking: {item.carrier} {item.tracking_number}</div>}
                </td>
                <td className="py-4 px-4 text-center text-gray-800 font-medium">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-gray-800 font-medium">{GHS(item.price_at_purchase)}</td>
                <td className="py-4 px-4 text-right text-gray-900 font-bold">{GHS(item.quantity * item.price_at_purchase)}</td>
              </tr>)}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-72">
            <div className="flex justify-between py-2 text-gray-600 font-medium">
              <span>Subtotal:</span>
              <span className="text-gray-900">{GHS(order.subtotal)}</span>
            </div>
            {parseFloat(order.discount) > 0 && <div className="flex justify-between py-2 text-green-600 font-medium">
                <span>Discount:</span>
                <span>-{GHS(order.discount)}</span>
              </div>}
            <div className="flex justify-between py-2 text-gray-600 font-medium border-b border-gray-200 pb-4">
              <span>Shipping:</span>
              <span className="text-gray-900">{GHS(order.shipping_fee)}</span>
            </div>
            <div className="flex justify-between py-4 text-xl font-black text-gray-900">
              <span>Total:</span>
              <span>{GHS(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center text-gray-500 text-sm border-t border-gray-200 pt-8 font-medium">
          Thank you for shopping at UniShop! If you have any questions, please contact our support team.
        </div>
      </div>
    </div>;
}