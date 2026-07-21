/**
 * File: Support.jsx
 * Description: Auto-generated documentation for Support.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../context/ToastContext';
import { IconLifebuoy, IconMessageCircle, IconPlus } from '@tabler/icons-react';
import SEO from '../components/SEO';
export default /**
 * Function Support
 * @returns {any}
 */
function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const {
    showToast
  } = useToast();
  /**
 * Arrow Function fetchTickets
 * @returns {any}
 */
  const fetchTickets = async () => {
    try {
      const res = await api.get('/crm/tickets/me');
      setTickets(res.data.tickets || res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load tickets', 'error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
 * Arrow Function handleSubmit
 * @param {any} e
 * @returns {any}
 */
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/crm/tickets', form);
      showToast('Support ticket created successfully', 'success');
      setForm({
        subject: '',
        message: ''
      });
      setShowNew(false);
      fetchTickets();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="w-full pb-20 pt-24 bg-background min-h-[80vh]">
      <SEO title="Customer Support | UniShop" />
      <div className="max-w-[800px] mx-auto px-4 md:px-8">
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight flex items-center gap-3">
              <IconLifebuoy size={40} className="text-primary" stroke={1.5} /> Customer Support
            </h1>
            <p className="text-lg text-on-surface-variant font-medium">Get help with your orders or account.</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95" onClick={() => setShowNew(!showNew)}>
            <IconPlus size={20} stroke={1.5} /> New Ticket
          </button>
        </div>

        {showNew && <div className="bg-surface border border-outline/30 rounded-[2rem] p-8 mb-10 shadow-sm animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-primary mb-6 border-b border-outline/30 pb-4">Create New Support Ticket</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Subject</label>
                <input type="text" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" value={form.subject} onChange={e => setForm({
              ...form,
              subject: e.target.value
            })} required placeholder="Brief summary of your issue" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Message</label>
                <textarea className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary resize-y min-h-[120px]" rows="4" value={form.message} onChange={e => setForm({
              ...form,
              message: e.target.value
            })} required placeholder="Please describe your issue in detail..."></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="px-6 py-3 bg-surface border border-outline/50 text-primary font-semibold rounded-full active:scale-95 transition-all hover:border-primary" onClick={() => setShowNew(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-8 py-3 bg-primary text-white font-semibold rounded-full shadow-sm active:scale-95 transition-all disabled:opacity-50 hover:shadow-level-2" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>}

        {loading ? <div className="flex flex-col gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-48 w-full bg-surface-variant/50 rounded-[2rem]" />)}
          </div> : <div className="flex flex-col gap-6">
            {tickets.length === 0 ? <div className="w-full flex flex-col items-center justify-center text-center bg-surface border border-outline/30 rounded-[2rem] p-12 shadow-sm">
                <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center text-primary mb-6 border border-outline/50">
                  <IconMessageCircle size={48} stroke={1.5} />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-2">No active tickets</h2>
                <p className="text-lg text-on-surface-variant font-medium max-w-[448px]">You haven't opened any support tickets yet. If you need help, feel free to create one.</p>
              </div> : tickets.map(ticket => <div key={ticket.id} className="bg-surface border border-outline/30 rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-level-1 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">{ticket.subject}</h3>
                      <span className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase mt-1 block">
                        Ticket #{ticket.id.slice(0, 8)} &bull; {new Date(ticket.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${ticket.status === 'CLOSED' ? 'bg-surface-variant text-on-surface-variant border-outline/50' : ticket.status === 'PENDING' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-base text-primary whitespace-pre-wrap mb-6 bg-surface-variant/30 p-4 rounded-2xl border border-outline/30 font-medium">
                    {ticket.message}
                  </div>

                  {ticket.reply_message && <div className="text-base text-primary whitespace-pre-wrap bg-primary/5 border-l-4 border-primary p-4 rounded-r-2xl font-medium mt-4">
                      <strong className="block font-bold text-primary mb-2">Reply from Support:</strong>
                      {ticket.reply_message}
                    </div>}
                </div>)}
          </div>}
      </div>
    </div>;
}