/**
 * File: ForgotPassword.jsx
 * Description: Auto-generated documentation for ForgotPassword.jsx
 * Date: 2026-07-21
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import SEO from '../components/SEO';
import { IconMail, IconShieldCheck, IconAlertTriangle } from '@tabler/icons-react';
export default /**
 * Function ForgotPassword
 * @returns {any}
 */
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState({
    text: '',
    type: ''
  });
  const [loading, setLoading] = useState(false);
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
      const res = await api.post('/auth/forgot-password', {
        email
      });
      setMsg({
        text: res.data.message,
        type: 'success'
      });
    } catch (err) {
      setMsg({
        text: err.response?.data?.error || 'Failed to send reset link',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-[80vh] flex flex-col justify-center items-center px-gutter py-xl bg-background relative overflow-hidden">
      <SEO title="Forgot Password | UniShop" />
      {/* Subtle Background Elements */}

      
      <div className="w-full max-w-[448px] bg-surface p-8 md:p-12 rounded-[2rem] shadow-sm border border-outline/30 relative z-10 backdrop-blur-xl">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-surface-variant text-primary rounded-full flex items-center justify-center mb-4 border border-outline/50 shadow-sm">
            <IconShieldCheck size={32} stroke={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">Reset Password</h1>
          <p className="text-lg text-on-surface-variant font-medium">Enter your email address to receive a password reset link.</p>
        </div>

        {msg.text && <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 mb-6 ${msg.type === 'error' ? 'bg-error/10 text-error border border-error/20' : 'bg-success/10 text-success border border-success/20'}`}>
            {msg.type === 'error' ? <IconAlertTriangle size={20} stroke={1.5} /> : <IconShieldCheck size={20} stroke={1.5} />}
            {msg.text}
          </div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50">
                <IconMail size={20} stroke={1.5} />
              </div>
              <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-variant pl-12 p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary placeholder:text-on-surface-variant/50" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-full font-semibold text-lg active:scale-95 shadow-sm hover:shadow-level-2 transition-all disabled:opacity-50 mt-4">
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center font-medium text-on-surface-variant mt-8">
          Remembered your password? <Link to="/login" className="font-bold text-primary hover:text-secondary transition-colors">Log In →</Link>
        </p>
      </div>
    </div>;
}