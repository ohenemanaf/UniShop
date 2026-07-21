/**
 * File: ResetPassword.jsx
 * Description: Auto-generated documentation for ResetPassword.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import SEO from '../components/SEO';
import { IconLock, IconShieldCheck, IconAlertTriangle } from '@tabler/icons-react';
export default /**
 * Function ResetPassword
 * @returns {any}
 */
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState({
    text: '',
    type: ''
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!token) {
      setMsg({
        text: 'Invalid or missing reset token.',
        type: 'error'
      });
    }
  }, [token]);
  /**
 * Arrow Function handleSubmit
 * @param {any} e
 * @returns {any}
 */
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg({
      text: '',
      type: ''
    });
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      setMsg({
        text: res.data.message,
        type: 'success'
      });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMsg({
        text: err.response?.data?.error || 'Failed to reset password',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  if (!token) {
    return <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 md:px-8 py-20 bg-background relative overflow-hidden">
        <SEO title="Reset Password | UniShop" />
        <div className="w-full max-w-[448px] bg-surface p-8 md:p-12 rounded-[2rem] shadow-sm border border-outline/30 text-center relative z-10">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6 border border-error/20">
            <IconAlertTriangle size={32} stroke={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-6">Reset Password</h1>
          <div className="bg-error/10 text-error border border-error/20 p-4 rounded-xl font-medium text-sm mb-8">Invalid or missing reset token.</div>
          <Link to="/login" className="font-bold text-primary hover:text-secondary transition-colors">Back to Login →</Link>
        </div>
      </div>;
  }
  return <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 md:px-8 py-20 bg-background relative overflow-hidden">
      <SEO title="Reset Password | UniShop" />
      {/* Subtle Background Elements */}

      
      <div className="w-full max-w-[448px] bg-surface p-8 md:p-12 rounded-[2rem] shadow-sm border border-outline/30 relative z-10 backdrop-blur-xl">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-surface-variant text-primary rounded-full flex items-center justify-center mb-4 border border-outline/50 shadow-sm">
            <IconShieldCheck size={32} stroke={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">New Password</h1>
          <p className="text-lg text-on-surface-variant font-medium">Enter your new password below.</p>
        </div>

        {msg.text && <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 mb-6 ${msg.type === 'error' ? 'bg-error/10 text-error border border-error/20' : 'bg-success/10 text-success border border-success/20'}`}>
            {msg.type === 'error' ? <IconAlertTriangle size={20} stroke={1.5} /> : <IconShieldCheck size={20} stroke={1.5} />}
            {msg.text}
          </div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50">
                <IconLock size={20} stroke={1.5} />
              </div>
              <input type="password" required minLength={6} placeholder="Min. 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-surface-variant pl-12 p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary placeholder:text-on-surface-variant/50" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-full font-semibold text-lg active:scale-95 shadow-sm hover:shadow-level-2 transition-all disabled:opacity-50 mt-4">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>;
}