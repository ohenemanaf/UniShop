/**
 * File: AdminUsers.jsx
 * Description: Auto-generated documentation for AdminUsers.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect, useCallback } from 'react';
import GHS from '../../utils/currency';
import api from '../../api';
import { IconUsers, IconMessageCircle, IconX, IconInbox, IconShoppingBag, IconTicket, IconSearch, IconShieldLock, IconChevronRight, IconUserCheck, IconMail, IconPhone, IconCalendar, IconBuildingStore, IconCheck, IconClockHour4, IconChevronDown } from '@tabler/icons-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
const ROLE_COLORS = {
  admin: 'bg-error/10 text-error border-error/20',
  seller: 'bg-secondary/10 text-secondary border-secondary/20',
  customer: 'bg-surface-variant text-on-surface-variant border-outline/50'
};
const APP_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
  },
  APPROVED: {
    label: 'Approved',
    color: 'bg-success/10 text-success border-success/30'
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-error/10 text-error border-error/20'
  }
};
const STATUS_COLORS = {
  OPEN: 'bg-secondary/10 text-secondary border-secondary/20',
  IN_PROGRESS: 'bg-primary/10 text-primary border-primary/20',
  RESOLVED: 'bg-success/10 text-success border-success/20',
  CLOSED: 'bg-surface-variant text-on-surface-variant border-outline/50'
};

// â”€â”€ User Detail Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function UserDetailModal({
  userId,
  onClose,
  onRoleChanged
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changingRole, setChangingRole] = useState(false);
  const {
    showToast
  } = useToast();
  const {
    user: currentUser
  } = useAuth();
  const fetchUser = useCallback(() => {
    api.get(`/crm/users/${userId}`).then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(() => {
      showToast('Failed to load user details', 'error');
      onClose();
    });
  }, [userId, onClose, showToast]);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  /**
 * Arrow Function handleRoleChange
 * @param {any} newRole
 * @returns {any}
 */
  const handleRoleChange = async newRole => {
    if (!window.confirm(`Change this user's role to "${newRole}"?`)) return;
    setChangingRole(true);
    try {
      await api.patch(`/admin/users/${userId}/role`, {
        role: newRole
      });
      showToast(`Role changed to ${newRole}`, 'success');
      fetchUser();
      onRoleChanged?.();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to change role', 'error');
    } finally {
      setChangingRole(false);
    }
  };
  if (loading) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/40 backdrop-blur-sm p-4">
        <div className="bg-surface w-full max-w-2xl rounded-[2rem] p-12 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>;
  }
  if (!data) return null;
  const {
    user,
    stats,
    recent_orders,
    tickets
  } = data;
  const isSelf = user.id === currentUser?.id;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-3xl rounded-[2rem] shadow-level-3 border border-outline/30 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline/30 bg-surface-variant/30 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary font-black text-xl flex items-center justify-center border border-secondary/20">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">{user.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${ROLE_COLORS[user.role] || ROLE_COLORS.customer}`}>
                  {user.role}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">{user.email}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-outline/30 text-on-surface-variant hover:text-primary hover:border-primary transition-all active:scale-95">
            <IconX size={18} stroke={2} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-surface-variant/30 rounded-2xl border border-outline/30">
              <IconMail size={20} stroke={1.5} className="text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Email</p>
                <p className="text-sm font-bold text-primary truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-surface-variant/30 rounded-2xl border border-outline/30">
              <IconPhone size={20} stroke={1.5} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Phone</p>
                <p className="text-sm font-bold text-primary">{user.phone || 'â€”'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-surface-variant/30 rounded-2xl border border-outline/30">
              <IconCalendar size={20} stroke={1.5} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Joined</p>
                <p className="text-sm font-bold text-primary">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface border border-outline/30 rounded-2xl p-5">
              <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-1">Total Orders</p>
              <p className="text-3xl font-black text-primary">{stats?.total_orders ?? 0}</p>
            </div>
            <div className="bg-primary border border-primary-fixed rounded-2xl p-5">
              <p className="text-xs text-white/70 font-semibold uppercase tracking-wider mb-1">Lifetime Value</p>
              <p className="text-3xl font-black text-white">{GHS(stats?.lifetime_value ?? 0)}</p>
            </div>
          </div>

          {/* Role Management */}
          <div className="border border-outline/30 rounded-2xl p-5">
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-4">Change Role</p>
            {isSelf ? <p className="text-sm text-on-surface-variant font-medium">You cannot change your own role.</p> : <div className="flex flex-wrap gap-2">
                {['customer', 'seller', 'admin'].map(role => <button key={role} onClick={() => handleRoleChange(role)} disabled={changingRole || user.role === role} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 border disabled:opacity-50 disabled:cursor-not-allowed
                      ${user.role === role ? ROLE_COLORS[role] + ' opacity-80 cursor-default' : 'bg-surface border-outline/40 text-primary hover:border-primary'}`}>
                    {user.role === role ? `âœ“ ${role}` : `Set as ${role}`}
                  </button>)}
              </div>}
          </div>

          {/* Recent Orders */}
          <div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <IconShoppingBag size={16} stroke={2} /> Recent Orders
            </h4>
            {(recent_orders || []).length === 0 ? <p className="text-sm text-on-surface-variant font-medium py-4 text-center border border-outline/30 rounded-2xl">No orders yet.</p> : <div className="overflow-hidden border border-outline/30 rounded-2xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-surface-variant/30 border-b border-outline/30">
                      <th className="p-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Order ID</th>
                      <th className="p-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                      <th className="p-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date</th>
                      <th className="p-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline/30">
                    {recent_orders.map(o => <tr key={o.id} className="hover:bg-surface-variant/20 transition-colors">
                        <td className="p-3 font-bold text-primary">#{String(o.id).slice(0, 8).toUpperCase()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${STATUS_COLORS[o.status] || STATUS_COLORS.CLOSED}`}>{o.status}</span>
                        </td>
                        <td className="p-3 text-on-surface-variant font-medium">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="p-3 text-right font-bold text-primary">{GHS(o.total)}</td>
                      </tr>)}
                  </tbody>
                </table>
              </div>}
          </div>

          {/* Tickets */}
          <div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <IconTicket size={16} stroke={2} /> Support Tickets ({(tickets || []).length})
            </h4>
            {(tickets || []).length === 0 ? <p className="text-sm text-on-surface-variant font-medium py-4 text-center border border-outline/30 rounded-2xl">No support tickets.</p> : <div className="space-y-2">
                {tickets.slice(0, 3).map(t => <div key={t.id} className="flex items-center justify-between p-4 border border-outline/30 rounded-2xl hover:bg-surface-variant/20 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-primary text-sm truncate">{t.subject}</p>
                      <p className="text-xs text-on-surface-variant font-medium">{new Date(t.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`ml-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shrink-0 ${STATUS_COLORS[t.status] || STATUS_COLORS.CLOSED}`}>
                      {t.status?.replace('_', ' ')}
                    </span>
                  </div>)}
              </div>}
          </div>
        </div>
      </div>
    </div>;
}

// â”€â”€ Seller Application Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SellerAppCard({
  app,
  onAction
}) {
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    showToast
  } = useToast();
  /**
 * Arrow Function handleAction
 * @param {any} status
 * @returns {any}
 */
  const handleAction = async status => {
    setLoading(true);
    try {
      await api.patch(`/admin/seller-applications/${app.id}`, {
        status,
        admin_note: note || null
      });
      showToast(`Application ${status.toLowerCase()}`, 'success');
      onAction?.();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update application', 'error');
    } finally {
      setLoading(false);
    }
  };
  const cfg = APP_STATUS_CONFIG[app.status];
  return <div className="border border-outline/30 rounded-2xl p-5 bg-surface hover:shadow-sm transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary font-bold text-lg flex items-center justify-center border border-secondary/20 shrink-0">
            {app.user_name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-primary text-base">{app.user_name}</p>
            <p className="text-xs text-on-surface-variant font-medium">{app.user_email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border bg-secondary/10 text-secondary border-secondary/20">
                <IconBuildingStore size={10} className="mr-1" /> {app.store_name}
              </span>
              {app.category && <span className="text-xs text-on-surface-variant font-medium border border-outline/40 px-2 py-0.5 rounded-full">{app.category}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${cfg.color}`}>
            {cfg.label}
          </span>
          <span className="text-xs text-on-surface-variant">{new Date(app.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {app.description && <p className="text-sm font-medium text-on-surface-variant bg-surface-variant/40 rounded-xl p-3 mb-4 border border-outline/30">
          {app.description}
        </p>}

      {app.status === 'PENDING' && <div className="border-t border-outline/30 pt-4 mt-2">
          {showNote && <div className="mb-3">
              <textarea rows={2} className="w-full bg-surface-variant p-3 rounded-xl text-sm font-medium text-primary outline-none border border-transparent focus:border-primary/30 transition-colors resize-none" placeholder="Optional admin note (visible to applicant)â€¦" value={note} onChange={e => setNote(e.target.value)} />
            </div>}
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => handleAction('APPROVED')} disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-success/10 text-success border border-success/30 hover:bg-success hover:text-white transition-all active:scale-95 disabled:opacity-50">
              <IconCheck size={16} stroke={2} /> Approve
            </button>
            <button onClick={() => handleAction('REJECTED')} disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-error/10 text-error border border-error/30 hover:bg-error hover:text-white transition-all active:scale-95 disabled:opacity-50">
              <IconX size={16} stroke={2} /> Reject
            </button>
            <button onClick={() => setShowNote(!showNote)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-surface border border-outline/40 text-primary hover:border-primary transition-all active:scale-95">
              {showNote ? 'Hide Note' : 'Add Note'}
            </button>
          </div>
        </div>}

      {app.admin_note && app.status !== 'PENDING' && <div className="mt-3 pt-3 border-t border-outline/30">
          <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-1">Admin Note</p>
          <p className="text-sm font-medium text-primary">{app.admin_note}</p>
        </div>}
    </div>;
}

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default /**
 * Function AdminUsers
 * @returns {any}
 */
function AdminUsers() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [appFilter, setAppFilter] = useState('PENDING');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {
    showToast
  } = useToast();
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const fetchUsers = useCallback(async (p = 1) => {
    setLoading(true);
    setPage(p);
    try {
      const res = await api.get('/admin/users', {
        params: {
          page: p,
          limit: 15
        }
      });
      setUsers(res.data.users);
      setTotalPages(Math.ceil((res.data.pagination?.total || 0) / 15));
    } catch {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/support');
      setTickets(res.data.tickets || []);
    } catch {
      showToast('Failed to load tickets', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/seller-applications', {
        params: {
          status: appFilter || undefined
        }
      });
      setApplications(res.data.applications || []);
    } catch {
      showToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  }, [appFilter, showToast]);
  useEffect(() => {
    if (activeTab === 'users') fetchUsers(1);else if (activeTab === 'tickets') fetchTickets();else if (activeTab === 'applications') fetchApplications();
  }, [activeTab, fetchUsers, fetchTickets, fetchApplications]);
  /**
 * Arrow Function handleReply
 * @param {any} ticketId
 * @returns {any}
 */
  const handleReply = async ticketId => {
    if (!replyText.trim()) return;
    try {
      await api.patch(`/admin/support/${ticketId}`, {
        admin_reply: replyText,
        status: 'IN_PROGRESS'
      });
      showToast('Reply sent successfully', 'success');
      setReplyText('');
      setReplyingTo(null);
      fetchTickets();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to send reply', 'error');
    }
  };
  /**
 * Arrow Function handleCloseTicket
 * @param {any} ticketId
 * @returns {any}
 */
  const handleCloseTicket = async ticketId => {
    try {
      await api.patch(`/admin/support/${ticketId}`, {
        status: 'RESOLVED'
      });
      showToast('Ticket resolved', 'success');
      fetchTickets();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update ticket', 'error');
    }
  };
  const filteredUsers = search ? users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) : users;
  const pendingAppsCount = applications.filter(a => a.status === 'PENDING').length;
  const TABS = [{
    key: 'users',
    label: 'Customers',
    icon: IconUsers
  }, {
    key: 'applications',
    label: 'Seller Applications',
    icon: IconBuildingStore,
    badge: appFilter === 'PENDING' ? pendingAppsCount : null
  }, {
    key: 'tickets',
    label: 'Support Tickets',
    icon: IconMessageCircle
  }];
  return <div className="w-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-variant/30 p-1 rounded-2xl border border-outline/30 mb-8 w-fit flex-wrap">
        {TABS.map(tab => {
        const Icon = tab.icon;
        return <button key={tab.key} className={`px-5 py-2.5 text-sm font-bold flex items-center gap-2 rounded-xl transition-all ${activeTab === tab.key ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`} onClick={() => {
          setActiveTab(tab.key);
          setPage(1);
        }}>
              <Icon size={18} stroke={1.5} />
              {tab.label}
              {tab.badge > 0 && <span className="bg-error text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center ml-0.5">
                  {tab.badge}
                </span>}
            </button>;
      })}
      </div>

      {/* Users search */}
      {activeTab === 'users' && <div className="mb-4">
          <div className="relative w-full md:w-80">
            <IconSearch size={18} stroke={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input type="text" className="w-full pl-10 pr-4 py-3 bg-surface border border-outline/50 rounded-xl text-sm font-medium text-primary focus:border-primary focus:outline-none transition-colors" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>}

      {/* Applications filter */}
      {activeTab === 'applications' && <div className="flex items-center gap-2 mb-4 flex-wrap">
          {['PENDING', 'APPROVED', 'REJECTED', ''].map(s => <button key={s} onClick={() => setAppFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${appFilter === s ? 'bg-primary text-white border-primary shadow-sm' : 'bg-surface text-on-surface-variant border-outline/40 hover:border-primary'}`}>
              {s || 'All'}
            </button>)}
        </div>}

      {/* Content */}
      <div className="bg-surface border border-outline/30 rounded-[2rem] overflow-hidden shadow-sm">
        {loading ? <div className="p-12 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div> : activeTab === 'users' ? <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-variant/30 border-b border-outline/30">
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">User</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Email</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Joined</th>
                  <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/30">
                {filteredUsers.map(user => <tr key={user.id} className="hover:bg-surface-variant/30 transition-colors group cursor-pointer" onClick={() => setSelectedUserId(user.id)}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center shrink-0 border border-secondary/20 group-hover:scale-110 transition-transform">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-primary group-hover:text-secondary transition-colors">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-on-surface-variant">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${ROLE_COLORS[user.role] || ROLE_COLORS.customer}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-on-surface-variant">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button onClick={e => {
                  e.stopPropagation();
                  setSelectedUserId(user.id);
                }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-surface border border-outline/50 text-primary hover:border-primary transition-all active:scale-95 shadow-sm">
                        View <IconChevronRight size={14} stroke={2} />
                      </button>
                    </td>
                  </tr>)}
                {filteredUsers.length === 0 && <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="flex flex-col items-center text-on-surface-variant">
                        <IconUsers size={48} stroke={1.5} className="mb-4 opacity-40" />
                        <p className="font-bold text-primary">{search ? 'No users match your search.' : 'No users found.'}</p>
                      </div>
                    </td>
                  </tr>}
              </tbody>
            </table>
          </div> : activeTab === 'applications' ? <div className="p-6 space-y-4">
            {applications.length === 0 ? <div className="flex flex-col items-center text-on-surface-variant py-16">
                <IconBuildingStore size={64} stroke={1.5} className="mb-4 opacity-40" />
                <p className="text-xl font-bold text-primary mb-2">No {appFilter || ''} Applications</p>
                <p className="text-sm font-medium">Seller applications will appear here once customers submit them.</p>
              </div> : applications.map(app => <SellerAppCard key={app.id} app={app} onAction={fetchApplications} />)}
          </div> : <div className="p-6 flex flex-col gap-4">
            {tickets.map(ticket => <div key={ticket.id} className="border border-outline/30 rounded-2xl p-6 bg-surface shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1">{ticket.subject}</h3>
                    <p className="text-xs font-semibold text-on-surface-variant">
                      From: <span className="text-primary">{ticket.customer_name}</span> ({ticket.customer_email}) &bull; {new Date(ticket.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shrink-0 ${STATUS_COLORS[ticket.status] || STATUS_COLORS.CLOSED}`}>
                    {ticket.status?.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-4 bg-surface-variant/30 rounded-xl mb-4 text-sm font-medium text-primary whitespace-pre-wrap border border-outline/30">
                  {ticket.message}
                </div>

                {ticket.admin_reply && <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-xl mb-4 text-sm font-medium text-primary">
                    <strong className="font-bold flex items-center gap-2 mb-1">
                      <IconShieldLock size={14} stroke={2} /> Admin Reply:
                    </strong>
                    {ticket.admin_reply}
                  </div>}

                <div className="flex flex-wrap gap-3 justify-end mt-4">
                  {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && <>
                      <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-surface border border-outline/50 text-primary hover:border-primary transition-all active:scale-95 shadow-sm" onClick={() => setReplyingTo(ticket.id === replyingTo ? null : ticket.id)}>
                        <IconMessageCircle size={16} stroke={1.5} /> {replyingTo === ticket.id ? 'Cancel' : 'Reply'}
                      </button>
                      <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-success/10 text-success hover:bg-success hover:text-white transition-all active:scale-95 shadow-sm" onClick={() => handleCloseTicket(ticket.id)}>
                        <IconUserCheck size={16} stroke={1.5} /> Mark Resolved
                      </button>
                    </>}
                </div>

                {replyingTo === ticket.id && <div className="mt-4 flex gap-3 animate-in fade-in duration-200">
                    <input type="text" className="flex-1 bg-surface border border-outline/50 p-3.5 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" placeholder="Type your reply..." value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReply(ticket.id)} />
                    <button className="bg-primary text-white font-bold px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95" onClick={() => handleReply(ticket.id)}>
                      Send
                    </button>
                  </div>}
              </div>)}
            {tickets.length === 0 && <div className="flex flex-col items-center justify-center text-on-surface-variant py-16">
                <IconInbox size={64} stroke={1.5} className="mb-4 opacity-40" />
                <p className="text-xl font-bold text-primary mb-2">No Support Tickets</p>
                <p className="text-sm font-medium">When customers submit support requests, they'll appear here.</p>
              </div>}
          </div>}
      </div>

      {/* Pagination */}
      {totalPages > 1 && activeTab === 'users' && <div className="flex items-center justify-center gap-4 mt-8">
          <button disabled={page === 1} onClick={() => fetchUsers(page - 1)} className="px-6 py-2.5 bg-surface border border-outline/50 rounded-xl font-semibold text-primary disabled:opacity-50 active:scale-95 hover:border-primary transition-all shadow-sm">Prev</button>
          <span className="text-sm font-semibold text-on-surface-variant">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => fetchUsers(page + 1)} className="px-6 py-2.5 bg-surface border border-outline/50 rounded-xl font-semibold text-primary disabled:opacity-50 active:scale-95 hover:border-primary transition-all shadow-sm">Next</button>
        </div>}

      {/* User Detail Modal */}
      {selectedUserId && <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} onRoleChanged={fetchUsers} />}
    </div>;
}