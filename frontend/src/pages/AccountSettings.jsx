/**
 * File: AccountSettings.jsx
 * Description: Auto-generated documentation for AccountSettings.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { IconUser, IconLock, IconMapPin, IconBuildingStore, IconAlertTriangle, IconCheck, IconClock, IconX, IconChevronRight, IconSend, IconShieldLock } from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
const SELLER_CATEGORIES = ['Electronics & Tech', 'Books & Stationery', 'Fashion & Clothing', 'Dorm & Home', 'Food & Snacks', 'Sports & Fitness', 'Art & Crafts', 'Services & Tutoring', 'Other'];
const STATUS_CONFIG = {
  PENDING: {
    icon: IconClock,
    color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600',
    iconColor: 'text-yellow-500',
    label: 'Application Under Review',
    desc: 'Your application is being reviewed by our team. You\'ll hear back within 24–48 hours.'
  },
  APPROVED: {
    icon: IconCheck,
    color: 'bg-success/10 border-success/30 text-success',
    iconColor: 'text-success',
    label: 'Application Approved!',
    desc: 'Congratulations! Your seller account is active. Head to your Seller Dashboard to start listing products.'
  },
  REJECTED: {
    icon: IconX,
    color: 'bg-error/10 border-error/30 text-error',
    iconColor: 'text-error',
    label: 'Application Not Approved',
    desc: 'Unfortunately your application wasn\'t approved at this time. You can submit a new application.'
  }
};
/**
 * Function SellerSection
 * @param {any} props
 * @returns {any}
 */
function SellerSection({
  user,
  isSeller
}) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState({
    text: '',
    type: ''
  });
  const [form, setForm] = useState({
    store_name: '',
    description: '',
    category: '',
    phone: ''
  });
  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'seller') {
      setLoading(false);
      return;
    }
    api.get('/auth/seller-application').then(res => {
      setApplication(res.data.application);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user?.role]);
  /**
 * Arrow Function handleSubmit
 * @param {any} e
 * @returns {any}
 */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.store_name.trim()) {
      setMsg({
        text: 'Store name is required.',
        type: 'error'
      });
      return;
    }
    setSubmitting(true);
    setMsg({
      text: '',
      type: ''
    });
    try {
      await api.post('/auth/seller-application', form);
      setMsg({
        text: 'Application submitted successfully!',
        type: 'success'
      });
      setShowForm(false);
      // Re-fetch application status
      const res = await api.get('/auth/seller-application');
      setApplication(res.data.application);
    } catch (err) {
      setMsg({
        text: err.response?.data?.error || 'Failed to submit application.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return <div className="h-32 bg-surface-variant/30 rounded-[2rem] animate-pulse" />;
  }

  // Admin — already has everything
  if (user?.role === 'admin') {
    return <div className="bg-surface border border-outline/30 rounded-[2rem] p-6 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <IconShieldLock size={24} stroke={1.5} />
        </div>
        <div>
          <p className="font-bold text-primary">You have Admin access</p>
          <p className="text-sm text-on-surface-variant font-medium">Admins have unrestricted access to all platform features.</p>
        </div>
      </div>;
  }

  // Already a seller
  if (user?.role === 'seller') {
    return <div className="bg-surface border border-outline/30 rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
            <IconBuildingStore size={24} stroke={1.5} />
          </div>
          <div>
            <p className="font-bold text-primary text-lg">You're a Seller!</p>
            <p className="text-sm text-on-surface-variant font-medium">Manage your listings, orders, and earnings from the Seller Dashboard.</p>
          </div>
        </div>
        <Link to="/seller" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl active:scale-95 transition-all hover:shadow-md shrink-0">
          Seller Dashboard <IconChevronRight size={18} stroke={2} />
        </Link>
      </div>;
  }

  // Has a pending/approved/rejected application
  if (application && application.status !== 'REJECTED') {
    const config = STATUS_CONFIG[application.status];
    const Icon = config.icon;
    return <div className={`border rounded-[2rem] p-6 ${config.color}`}>
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full bg-white/50 flex items-center justify-center shrink-0 ${config.iconColor}`}>
            <Icon size={24} stroke={1.5} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg mb-1">{config.label}</p>
            <p className="text-sm font-medium opacity-80">{config.desc}</p>
          </div>
        </div>
        <div className="bg-white/40 rounded-2xl p-4 mt-3 space-y-1.5 text-sm font-medium">
          <div className="flex justify-between"><span className="opacity-70">Store Name</span><span className="font-bold">{application.store_name}</span></div>
          {application.category && <div className="flex justify-between"><span className="opacity-70">Category</span><span className="font-bold">{application.category}</span></div>}
          <div className="flex justify-between"><span className="opacity-70">Submitted</span><span className="font-bold">{new Date(application.created_at).toLocaleDateString()}</span></div>
          {application.admin_note && <div className="pt-2 mt-2 border-t border-current/20">
              <p className="opacity-70 text-xs uppercase tracking-wider mb-1">Admin Note</p>
              <p className="font-semibold">{application.admin_note}</p>
            </div>}
        </div>
        {application.status === 'APPROVED' && <Link to="/seller" className="mt-4 inline-flex items-center gap-2 bg-success text-white font-bold px-6 py-3 rounded-xl active:scale-95 transition-all hover:shadow-md">
            Go to Seller Dashboard <IconChevronRight size={18} stroke={2} />
          </Link>}
      </div>;
  }

  // No application or rejected — show form / apply button
  return <div className="bg-surface border border-outline/30 rounded-[2rem] p-6 shadow-sm">
      {!showForm ? <div className="flex flex-col items-start gap-4">
          {application?.status === 'REJECTED' && <div className="w-full bg-error/5 border border-error/20 rounded-2xl p-4 text-sm">
              <p className="font-bold text-error mb-1">Previous application was not approved</p>
              {application.admin_note && <p className="text-on-surface-variant font-medium">Reason: {application.admin_note}</p>}
            </div>}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <IconBuildingStore size={28} stroke={1.5} />
            </div>
            <div>
              <p className="font-bold text-primary text-lg">Become a Seller on UniShop</p>
              <p className="text-sm text-on-surface-variant font-medium">
                Start your own storefront and reach thousands of campus buyers. Free to apply.
              </p>
            </div>
          </div>
          <ul className="text-sm font-medium text-on-surface-variant space-y-1.5 ml-2">
            <li className="flex items-center gap-2"><IconCheck size={14} className="text-success shrink-0" /> List unlimited products</li>
            <li className="flex items-center gap-2"><IconCheck size={14} className="text-success shrink-0" /> Manage orders & track fulfillment</li>
            <li className="flex items-center gap-2"><IconCheck size={14} className="text-success shrink-0" /> Request payouts to your bank account</li>
            <li className="flex items-center gap-2"><IconCheck size={14} className="text-success shrink-0" /> Keep your buyer account — shop as usual</li>
          </ul>
          {msg.text && <div className={`w-full p-3 rounded-xl text-sm font-semibold flex items-center gap-2 border ${msg.type === 'error' ? 'bg-error/10 border-error/20 text-error' : 'bg-success/10 border-success/20 text-success'}`}>
              {msg.type === 'error' ? <IconAlertTriangle size={16} /> : <IconCheck size={16} />} {msg.text}
            </div>}
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl active:scale-95 transition-all hover:shadow-md">
            Apply to Sell <IconChevronRight size={18} stroke={2} />
          </button>
        </div> : <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-primary text-lg">Seller Application</h3>
            <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-all">
              <IconX size={18} stroke={2} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-wider">Store Name *</label>
            <input type="text" required maxLength={100} className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" placeholder="e.g. Alex's Tech Store" value={form.store_name} onChange={e => setForm({
          ...form,
          store_name: e.target.value
        })} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-wider">Category</label>
            <select className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary appearance-none" value={form.category} onChange={e => setForm({
          ...form,
          category: e.target.value
        })}>
              <option value="">Select a category…</option>
              {SELLER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-wider">Phone Number</label>
            <input type="tel" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm({
          ...form,
          phone: e.target.value
        })} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-primary uppercase tracking-wider">Tell us about your store</label>
            <textarea rows={3} className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary resize-y" placeholder="What will you sell? What makes your store unique?" value={form.description} onChange={e => setForm({
          ...form,
          description: e.target.value
        })} />
          </div>

          {msg.text && <div className={`p-3 rounded-xl text-sm font-semibold flex items-center gap-2 border ${msg.type === 'error' ? 'bg-error/10 border-error/20 text-error' : 'bg-success/10 border-success/20 text-success'}`}>
              {msg.type === 'error' ? <IconAlertTriangle size={16} /> : <IconCheck size={16} />} {msg.text}
            </div>}

          <div className="flex gap-3 justify-end pt-2 border-t border-outline/30">
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-semibold bg-surface border border-outline/50 text-primary hover:border-primary transition-all active:scale-95">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary text-white shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-60">
              <IconSend size={18} stroke={1.5} />
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </form>}
    </div>;
}
export default /**
 * Function AccountSettings
 * @returns {any}
 */
function AccountSettings() {
  const {
    user,
    isSeller,
    setUser
  } = useAuth();
  const navigate = useNavigate();
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    avatar_url: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: ''
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState({
    text: '',
    type: ''
  });
  const [passwordMsg, setPasswordMsg] = useState({
    text: '',
    type: ''
  });
  useEffect(() => {
    api.get('/auth/me').then(res => {
      setProfileForm({
        name: res.data.name || '',
        phone: res.data.phone || '',
        avatar_url: res.data.avatar_url || '',
        address_line1: res.data.address?.line1 || '',
        address_line2: res.data.address?.line2 || '',
        city: res.data.address?.city || '',
        state: res.data.address?.state || '',
        zip: res.data.address?.zip || '',
        country: res.data.address?.country || ''
      });
    }).catch(console.error);
  }, []);
  /**
 * Arrow Function handleProfileSubmit
 * @param {any} e
 * @returns {any}
 */
  const handleProfileSubmit = async e => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMsg({
      text: '',
      type: ''
    });
    try {
      await api.patch('/auth/profile', profileForm);
      setProfileMsg({
        text: 'Profile updated successfully!',
        type: 'success'
      });
      const updatedUser = {
        ...user,
        name: profileForm.name,
        avatar_url: profileForm.avatar_url
      };
      localStorage.setItem('UniShop_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      setProfileMsg({
        text: err.response?.data?.error || 'Failed to update profile.',
        type: 'error'
      });
    } finally {
      setLoadingProfile(false);
    }
  };
  /**
 * Arrow Function handlePasswordSubmit
 * @param {any} e
 * @returns {any}
 */
  const handlePasswordSubmit = async e => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMsg({
      text: '',
      type: ''
    });
    try {
      await api.patch('/auth/password', passwordForm);
      setPasswordMsg({
        text: 'Password changed successfully!',
        type: 'success'
      });
      setPasswordForm({
        current_password: '',
        new_password: ''
      });
    } catch (err) {
      setPasswordMsg({
        text: err.response?.data?.error || 'Failed to change password.',
        type: 'error'
      });
    } finally {
      setLoadingPassword(false);
    }
  };
  return <div className="w-full pb-20 pt-24 bg-background min-h-[80vh]">
      <SEO title="Account Settings | UniShop" />
      <div className="max-w-[1000px] mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-surface-variant text-primary flex items-center justify-center border border-outline/30 shrink-0">
            {profileForm.avatar_url ? <img src={profileForm.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-2xl mix-blend-multiply" /> : <IconUser size={32} stroke={1.5} />}
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Account Settings</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${user?.role === 'admin' ? 'bg-error/10 text-error border-error/20' : user?.role === 'seller' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-surface-variant text-on-surface-variant border-outline/50'}`}>
                {user?.role}
              </span>
              <span className="text-sm text-on-surface-variant font-medium">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-12">

          {/* Profile Info */}
          <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 pb-12 border-b border-outline/30">
            <div>
              <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-variant text-primary flex items-center justify-center border border-outline/50">
                  <IconUser size={20} stroke={1.5} />
                </div>
                Personal Info
              </h2>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">Update your photo and personal details here.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6 items-start mb-2">
                <div className="w-24 h-24 rounded-2xl bg-surface-variant shrink-0 overflow-hidden flex items-center justify-center border border-outline/30 shadow-sm">
                  {profileForm.avatar_url ? <img src={profileForm.avatar_url} alt="Avatar" className="w-full h-full object-cover mix-blend-multiply" /> : <IconUser size={40} stroke={1.5} className="text-primary/50" />}
                </div>
                <div className="flex flex-col gap-2 flex-1 w-full">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Avatar Image URL</label>
                  <input type="url" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary placeholder:text-on-surface-variant/50" value={profileForm.avatar_url} onChange={e => setProfileForm({
                  ...profileForm,
                  avatar_url: e.target.value
                })} placeholder="https://example.com/my-photo.jpg" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                <input type="text" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" value={profileForm.name} onChange={e => setProfileForm({
                ...profileForm,
                name: e.target.value
              })} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Phone Number</label>
                  <input type="tel" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" value={profileForm.phone} onChange={e => setProfileForm({
                  ...profileForm,
                  phone: e.target.value
                })} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Email Address</label>
                  <input type="email" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent outline-none font-medium text-on-surface-variant opacity-70 cursor-not-allowed" value={user?.email || ''} disabled title="Email cannot be changed" />
                </div>
              </div>

              {profileMsg.text && <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 mt-2 border ${profileMsg.type === 'error' ? 'bg-error/10 border-error/20 text-error' : 'bg-success/10 border-success/20 text-success'}`}>
                  {profileMsg.type === 'error' ? <IconAlertTriangle size={20} stroke={1.5} /> : <IconCheck size={20} stroke={1.5} />}
                  {profileMsg.text}
                </div>}

              <div className="mt-2">
                <button type="submit" disabled={loadingProfile} className="bg-primary text-white font-semibold px-8 py-4 rounded-full active:scale-95 shadow-sm hover:shadow-level-2 transition-all">
                  {loadingProfile ? 'Saving...' : 'Save Personal Info'}
                </button>
              </div>
            </form>
          </section>

          {/* Address */}
          <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 pb-12 border-b border-outline/30">
            <div>
              <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-variant text-primary flex items-center justify-center border border-outline/50">
                  <IconMapPin size={20} stroke={1.5} />
                </div>
                Shipping Address
              </h2>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">Where should we send your orders?</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Address Line 1</label>
                <input type="text" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" value={profileForm.address_line1} onChange={e => setProfileForm({
                ...profileForm,
                address_line1: e.target.value
              })} placeholder="Street address, P.O. box, etc." />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Address Line 2</label>
                <input type="text" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" value={profileForm.address_line2} onChange={e => setProfileForm({
                ...profileForm,
                address_line2: e.target.value
              })} placeholder="Apt, suite, unit, building, floor, etc." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">City</label>
                  <input type="text" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" value={profileForm.city} onChange={e => setProfileForm({
                  ...profileForm,
                  city: e.target.value
                })} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">State / Province</label>
                  <input type="text" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" value={profileForm.state} onChange={e => setProfileForm({
                  ...profileForm,
                  state: e.target.value
                })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">ZIP / Postal Code</label>
                  <input type="text" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" value={profileForm.zip} onChange={e => setProfileForm({
                  ...profileForm,
                  zip: e.target.value
                })} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Country</label>
                  <input type="text" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" value={profileForm.country} onChange={e => setProfileForm({
                  ...profileForm,
                  country: e.target.value
                })} />
                </div>
              </div>
              <div className="mt-2">
                <button type="submit" disabled={loadingProfile} className="bg-primary text-white font-semibold px-8 py-4 rounded-full active:scale-95 shadow-sm hover:shadow-level-2 transition-all">
                  {loadingProfile ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </section>

          {/* Security */}
          <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 pb-12 border-b border-outline/30">
            <div>
              <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-variant text-primary flex items-center justify-center border border-outline/50">
                  <IconLock size={20} stroke={1.5} />
                </div>
                Security
              </h2>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">Update your password and secure your account.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Current Password</label>
                <input type="password" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" value={passwordForm.current_password} onChange={e => setPasswordForm({
                ...passwordForm,
                current_password: e.target.value
              })} required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">New Password</label>
                <input type="password" className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary" value={passwordForm.new_password} onChange={e => setPasswordForm({
                ...passwordForm,
                new_password: e.target.value
              })} minLength={6} required />
              </div>
              {passwordMsg.text && <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 mt-2 border ${passwordMsg.type === 'error' ? 'bg-error/10 border-error/20 text-error' : 'bg-success/10 border-success/20 text-success'}`}>
                  {passwordMsg.type === 'error' ? <IconAlertTriangle size={20} stroke={1.5} /> : <IconCheck size={20} stroke={1.5} />}
                  {passwordMsg.text}
                </div>}
              <div className="mt-2">
                <button type="submit" disabled={loadingPassword} className="bg-surface border border-outline/50 hover:border-primary text-primary font-semibold px-8 py-4 rounded-full active:scale-95 transition-all">
                  {loadingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </section>

          {/* Seller Account */}
          <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 pb-4">
            <div>
              <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-variant text-primary flex items-center justify-center border border-outline/50">
                  <IconBuildingStore size={20} stroke={1.5} />
                </div>
                Seller Account
              </h2>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">Apply to list products and manage your storefront.</p>
            </div>
            <SellerSection user={user} isSeller={isSeller} />
          </section>

        </div>
      </div>
    </div>;
}