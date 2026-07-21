/**
 * File: AdminSupport.jsx
 * Description: Auto-generated documentation for AdminSupport.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { IconCheck, IconX, IconLifebuoy } from '@tabler/icons-react';
export default /**
 * Function AdminSupport
 * @returns {any}
 */
function AdminSupport() {
  const {
    showToast
  } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [ticketStatus, setTicketStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  /**
 * Arrow Function fetchTickets
 * @returns {any}
 */
  const fetchTickets = () => {
    setLoading(true);
    api.get('/admin/support').then(res => {
      setTickets(res.data.tickets);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load tickets', err);
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchTickets();
  }, []);
  /**
 * Arrow Function handleOpenTicket
 * @param {any} ticket
 * @returns {any}
 */
  const handleOpenTicket = ticket => {
    setSelectedTicket(ticket);
    setReplyText(ticket.admin_reply || '');
    setTicketStatus(ticket.status);
  };
  /**
 * Arrow Function handleUpdateTicket
 * @param {any} e
 * @returns {any}
 */
  const handleUpdateTicket = async e => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.patch(`/admin/support/${selectedTicket.id}`, {
        status: ticketStatus,
        admin_reply: replyText
      });
      showToast('Ticket updated successfully', 'success');
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update ticket.', 'error');
    } finally {
      setUpdating(false);
    }
  };
  const filteredTickets = filter === 'ALL' ? tickets : tickets.filter(t => t.status === filter);
  /**
 * Arrow Function getStatusBadge
 * @param {any} status
 * @returns {any}
 */
  const getStatusBadge = status => {
    switch (status) {
      case 'OPEN':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-error/10 text-error border border-error/20">Open</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">In Progress</span>;
      case 'RESOLVED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20">Resolved</span>;
      case 'CLOSED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-outline/50">Closed</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-surface border border-outline/50 text-on-surface-variant">{status}</span>;
    }
  };
  return <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Support CRM</h1>
          <p className="text-on-surface-variant font-medium">Manage customer support tickets and inquiries.</p>
        </div>
        <select className="bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm w-full sm:w-48 appearance-none cursor-pointer" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="ALL">All Tickets</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="bg-surface border border-outline/30 rounded-[2rem] overflow-hidden shadow-sm">
        {loading ? <div className="w-full animate-pulse p-lg">
             <div className="h-64 w-full bg-surface-variant/30 rounded-[2rem]" />
          </div> : <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-variant/30 border-b border-outline/30">
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Subject</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/30">
                {filteredTickets.length === 0 ? <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                        <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-2">
                          <IconLifebuoy size={32} stroke={1.5} />
                        </div>
                        <p className="text-lg font-bold text-primary">No tickets found.</p>
                        <p className="text-sm font-medium">You're all caught up with customer support.</p>
                      </div>
                    </td>
                  </tr> : filteredTickets.map(ticket => <tr key={ticket.id} className="hover:bg-surface-variant/30 transition-colors group">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <strong className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">{ticket.customer_name}</strong>
                          <span className="text-xs font-medium text-on-surface-variant">{ticket.customer_email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-bold text-primary">{ticket.subject}</span>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="p-4 text-sm font-medium text-on-surface-variant">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-outline/50 bg-surface text-primary hover:border-primary active:scale-95 transition-all shadow-sm" onClick={() => handleOpenTicket(ticket)}>
                          View / Reply
                        </button>
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>}
      </div>

      {/* Ticket Modal */}
      {selectedTicket && <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-2xl rounded-[2rem] shadow-level-3 overflow-hidden border border-outline/30 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-outline/30 flex justify-between items-center bg-surface-variant/30 shrink-0">
              <h3 className="text-xl font-bold text-primary flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                  <IconLifebuoy stroke={1.5} size={24} /> 
                </div>
                Ticket #{selectedTicket.id}
              </h3>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors border border-transparent hover:border-outline/30" onClick={() => setSelectedTicket(null)}>
                <IconX size={20} stroke={1.5} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-grow flex flex-col gap-8">
              <div className="bg-surface-variant/30 p-6 rounded-2xl border border-outline/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">From Customer</p>
                    <p className="text-base font-bold text-primary">{selectedTicket.customer_name} <span className="text-sm font-semibold text-on-surface-variant ml-1">({selectedTicket.customer_email})</span></p>
                  </div>
                  <span className="text-sm font-semibold text-on-surface-variant bg-surface px-3 py-1.5 rounded-lg border border-outline/30">{new Date(selectedTicket.created_at).toLocaleString()}</span>
                </div>
                <h4 className="text-lg font-bold text-primary mb-4 pb-4 border-b border-outline/30">{selectedTicket.subject}</h4>
                <div className="bg-surface p-5 rounded-xl border border-outline/30 shadow-sm">
                  <p className="text-sm font-medium text-primary whitespace-pre-wrap leading-relaxed">{selectedTicket.message}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateTicket} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Admin Reply</label>
                  <textarea className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-medium text-primary focus:border-primary transition-colors shadow-sm resize-y" value={replyText} onChange={e => setReplyText(e.target.value)} rows={5} placeholder="Type your response here. This will be sent to the customer..." />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Status</label>
                  <select className="bg-surface border border-outline/50 p-4 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm appearance-none cursor-pointer" value={ticketStatus} onChange={e => setTicketStatus(e.target.value)}>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-outline/30 mt-2">
                  <button type="button" className="px-6 py-3 rounded-xl font-semibold bg-surface border border-outline/50 text-primary hover:border-primary transition-all active:scale-95 shadow-sm" onClick={() => setSelectedTicket(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3 rounded-xl font-bold bg-primary text-white shadow-sm hover:shadow-md transition-all active:scale-95 inline-flex items-center gap-2" disabled={updating}>
                    {updating ? 'Saving...' : <><IconCheck size={20} stroke={1.5} /> Save & Reply</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>}
    </div>;
}