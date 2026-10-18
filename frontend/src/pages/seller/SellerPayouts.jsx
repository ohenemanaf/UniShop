/**
 * File: SellerPayouts.jsx
 * Description: Auto-generated documentation for SellerPayouts.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import GHS from '../../utils/currency';
import api from '../../api';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';
import { IconBuildingBank, IconHistory, IconCircleCheck, IconClock, IconX, IconWallet, IconArrowUpRight, IconTrendingUp } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
export default /**
 * Function SellerPayouts
 * @returns {any}
 */
function SellerPayouts() {
  const {
    showToast
  } = useToast();
  const [data, setData] = useState({
    balance: 0,
    total_earnings: 0,
    total_withdrawn: 0,
    history: []
  });
  const [loading, setLoading] = useState(true);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  /**
 * Arrow Function fetchPayouts
 * @returns {any}
 */
  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/seller/payouts');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch payouts', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPayouts();
  }, []);
  const {
    socket
  } = useSocket();
  useEffect(() => {
    if (!socket) return;
    /**
 * Arrow Function handleUpdate
 * @returns {any}
 */
    const handleUpdate = () => fetchPayouts();
    socket.on('new_order', handleUpdate);
    socket.on('payout_update', handleUpdate);
    return () => {
      socket.off('new_order', handleUpdate);
      socket.off('payout_update', handleUpdate);
    };
  }, [socket]);
  /**
 * Arrow Function handleWithdraw
 * @param {any} e
 * @returns {any}
 */
  const handleWithdraw = async e => {
    e.preventDefault();
    if (parseFloat(amount) > data.balance) {
      showToast('Amount exceeds available balance', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/seller/payouts', {
        amount: parseFloat(amount),
        bank_details: bankDetails
      });
      showToast('Withdrawal requested successfully', 'success');
      setWithdrawModal(false);
      setAmount('');
      setBankDetails('');
      fetchPayouts();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to request withdrawal', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  /**
 * Arrow Function getStatusBadge
 * @param {any} status
 * @returns {any}
 */
  const getStatusBadge = status => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20"><IconClock size={14} /> Pending</span>;
      case 'PROCESSED':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-success/10 text-success border border-success/20"><IconCircleCheck size={14} /> Processed</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-error/10 text-error border border-error/20"><IconX size={14} /> Rejected</span>;
      default:
        return null;
    }
  };
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="h-48 bg-surface-container rounded-3xl" />
          <div className="h-48 bg-surface-container rounded-3xl" />
          <div className="h-48 bg-surface-container rounded-3xl" />
        </div>
        <div className="h-96 bg-surface-container rounded-3xl" />
      </div>;
  }
  return <motion.div variants={containerVariants} initial="hidden" animate="show" className="w-full max-w-[1400px] mx-auto pb-12">
      <SEO title="Payouts | Seller Dashboard" />
      
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight mb-2">Payouts</h1>
          <p className="text-on-surface-variant font-medium">Manage your earnings and withdraw funds directly to your bank account.</p>
        </div>
        <button onClick={() => setWithdrawModal(true)} disabled={data.balance <= 0} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-primary text-white shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none">
          <IconBuildingBank size={20} stroke={2} /> Request Withdrawal
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Main Balance Card */}
        <motion.div variants={itemVariants} className="md:col-span-1 bg-gradient-to-br from-primary to-primary-fixed rounded-[2rem] p-8 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-tr-full -z-0 group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <IconWallet size={28} stroke={1.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-white px-3 py-1.5 rounded-full shadow-sm">
                Available
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-white/80 uppercase tracking-wider mb-1">Available Balance</p>
              <p className="text-5xl font-black text-white">${parseFloat(data.balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</p>
            </div>
          </div>
        </motion.div>

        {/* Secondary Stats */}
        <motion.div variants={itemVariants} className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-surface border border-outline/20 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-4 right-4 text-success/20">
              <IconTrendingUp size={80} stroke={1} />
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success mb-6">
                <IconArrowUpRight size={24} stroke={2} />
              </div>
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Earnings</p>
              <p className="text-4xl font-black text-primary">${parseFloat(data.total_earnings).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</p>
            </div>
          </div>

          <div className="bg-surface border border-outline/20 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-4 right-4 text-secondary/10">
              <IconBuildingBank size={80} stroke={1} />
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                <IconHistory size={24} stroke={2} />
              </div>
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Withdrawn</p>
              <p className="text-4xl font-black text-primary">${parseFloat(data.total_withdrawn).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-surface border border-outline/20 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-outline/10 bg-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <IconHistory size={20} stroke={2} />
            </div>
            <h2 className="text-xl font-black text-primary">Withdrawal History</h2>
          </div>
        </div>
        
        {data.history.length === 0 ? <div className="p-16 text-center text-on-surface-variant flex flex-col items-center">
            <div className="w-20 h-20 bg-surface-variant/50 rounded-full flex items-center justify-center mb-4">
              <IconHistory size={32} stroke={1.5} className="opacity-50" />
            </div>
            <h2 className="text-2xl font-black text-primary mb-2">No withdrawals yet</h2>
            <p className="max-w-[400px] mx-auto mb-8 text-on-surface-variant font-medium">When you request a payout, its status and history will appear here.</p>
          </div> : <div className="divide-y divide-outline/10">
            {data.history.map(p => <div key={p.id} className="p-6 hover:bg-surface-variant/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-surface-variant/50 flex items-center justify-center border border-outline/20 shrink-0">
                    <IconBuildingBank size={20} stroke={1.5} className="text-on-surface-variant" />
                  </div>
                  <div>
                    <p className="font-bold text-primary mb-1">Bank Transfer</p>
                    <p className="text-sm font-medium text-on-surface-variant whitespace-pre-wrap">{p.bank_details}</p>
                    <p className="text-xs font-semibold text-on-surface-variant/60 mt-2">
                      Requested: {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-outline/10 pt-4 sm:pt-0">
                  <p className="text-2xl font-black text-primary">
                    -${parseFloat(p.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
                  </p>
                  {getStatusBadge(p.status)}
                  {p.processed_at && <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">
                      Processed: {new Date(p.processed_at).toLocaleDateString()}
                    </p>}
                </div>
              </div>)}
          </div>}
      </motion.div>

      <AnimatePresence>
        {withdrawModal && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
            <motion.div initial={{
          scale: 0.9,
          y: 20
        }} animate={{
          scale: 1,
          y: 0
        }} exit={{
          scale: 0.9,
          y: 20
        }} transition={{
          type: "spring",
          stiffness: 300,
          damping: 25
        }} className="bg-surface w-full max-w-[28rem] rounded-[2.5rem] p-10 shadow-level-3 border border-outline/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <IconBuildingBank size={28} stroke={2} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary leading-tight">Request Payout</h2>
                  <p className="text-sm font-bold text-on-surface-variant">Available: ${parseFloat(data.balance).toFixed(2)}</p>
                </div>
              </div>

              <form onSubmit={handleWithdraw} className="flex flex-col gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Amount to Withdraw ($)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black text-xl">$</span>
                    <input type="number" step="0.01" min="1" max={data.balance} required value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-surface-variant/50 focus:bg-surface pl-10 pr-5 py-5 rounded-2xl border border-transparent focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-primary font-black text-xl transition-all shadow-sm" placeholder="0.00" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Bank Details</label>
                  <textarea required rows={4} placeholder="Account Name, Bank Name, Account Number, Routing/Swift Code" value={bankDetails} onChange={e => setBankDetails(e.target.value)} className="w-full bg-surface-variant/50 focus:bg-surface p-5 rounded-2xl border border-transparent focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-primary font-medium transition-all resize-none shadow-sm placeholder:text-on-surface-variant/40" />
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setWithdrawModal(false)} className="w-full sm:w-auto px-8 py-4 font-bold text-on-surface-variant hover:text-primary bg-surface border border-outline/20 rounded-2xl active:scale-95 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting || !amount || !bankDetails} className="w-full sm:w-auto px-8 py-4 font-bold text-white bg-primary rounded-2xl active:scale-95 transition-all shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-50 disabled:shadow-none">
                    {submitting ? 'Submitting...' : 'Confirm Transfer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
}