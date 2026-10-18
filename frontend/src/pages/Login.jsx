/**
 * File: Login.jsx
 * Description: Auto-generated documentation for Login.jsx
 * Date: 2026-07-21
 */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconSparkles, IconLock, IconAlertTriangle, IconEye, IconEyeOff } from '@tabler/icons-react';
import {demoAccounts,portfolioDemo} from '../utils/demo';
import { useAuth } from '../context/AuthContext';
export default /**
 * Function Login
 * @returns {any}
 */
function Login() {
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from;
  const from = destination?.pathname?.startsWith('/') && !destination.pathname.startsWith('//') ? destination.pathname + (destination.search || '') : null;
  const [form, setForm] = useState(()=>{const account=portfolioDemo && demoAccounts[new URLSearchParams(location.search).get('demo')];return {email:account?.email||'',password:account?.password||''};});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  /**
 * Arrow Function handleChange
 * @param {any} e
 * @returns {any}
 */
  const handleChange = e => setForm({
    ...form,
    [e.target.name]: e.target.value
  });
  /**
 * Arrow Function handleSubmit
 * @param {any} e
 * @returns {any}
 */
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const account = await login(form.email.trim(), form.password);
      navigate(from || (account.role === 'admin' ? '/admin' : account.role === 'seller' ? '/seller' : '/'), {
        replace: true
      });
    } catch (err) {
      setError(err.response?.data?.error || (!err.response ? 'Cannot reach the store server. Please try again shortly.' : 'Login failed. Please check your details.'));
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-[75vh] flex bg-background">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-12 xl:px-20 relative z-10 py-12">
        
        <div className="max-w-[440px] w-full mx-auto">
          {/* Brand/Header */}
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl mb-8">
              <IconSparkles size={24} stroke={1.5} />
            </Link>
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Welcome back</h1>
            <p className="text-lg text-on-surface-variant">Sign in to your account to continue.</p>
          </div>

          {location.search.includes('expired') && <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl text-sm font-semibold flex items-center gap-2 mb-8">
              <IconAlertTriangle size={20} stroke={1.5} /> Your session expired. Please sign in again.
            </div>}

          {portfolioDemo && <div className="mb-7 rounded-2xl border border-outline-variant bg-surface p-4"><p className="text-sm font-bold mb-1">Try a demo account</p><p className="text-xs text-on-surface-variant mb-3">Choose a role to fill the form. Sample data, no real payments.</p><div className="flex gap-2">{Object.entries(demoAccounts).map(([role,account])=><button type="button" key={role} onClick={()=>{setForm({email:account.email,password:account.password});setError('');}} className="flex-1 py-2 text-sm font-semibold rounded-lg border border-outline hover:border-primary hover:bg-primary-container">{account.label}</button>)}</div></div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="login-email" className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Email Address</label>
              <input id="login-email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required className="w-full bg-surface-variant p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary placeholder:text-on-surface-variant/50" autoComplete="email" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-sm font-bold text-primary hover:text-secondary transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50">
                  <IconLock size={20} stroke={1.5} />
                </div>
                <input id="login-password" autoComplete="current-password" type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" className="w-full bg-surface-variant pl-12 pr-12 p-4 rounded-xl border border-transparent focus:border-outline/50 focus:bg-surface outline-none transition-colors font-medium text-primary placeholder:text-on-surface-variant/50" />
                <button aria-label={showPassword ? "Hide password" : "Show password"} type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant/50 hover:text-primary transition-colors">
                  {showPassword ? <IconEyeOff size={20} stroke={1.5} /> : <IconEye size={20} stroke={1.5} />}
                </button>
              </div>
            </div>

            {error && <div role="alert" className="bg-error/10 border border-error/20 text-error p-4 rounded-xl text-sm font-semibold">{error}</div>}

            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 mt-2 rounded-xl font-bold text-lg active:scale-95 shadow-md hover:bg-primary-fixed transition-all disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="font-medium text-on-surface-variant mt-10 text-center lg:text-left">
            Don't have an account? <Link to="/register" className="font-bold text-primary hover:text-secondary transition-colors underline underline-offset-4 decoration-primary/30">Create one</Link>
          </p>
        </div>
      </div>

      {/* Right Side: Image / Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-variant relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-primary"></div>
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80" alt="Login Banner" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" />
        
        <div className="relative z-10 w-full min-w-0 max-w-[32rem] text-center text-white">
          <IconSparkles size={64} className="mb-8 mx-auto opacity-80" stroke={1.5} />
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">Your gateway to premium shopping.</h2>
          <p className="text-lg opacity-80 font-medium">Experience curated collections, secure checkout, and lightning-fast delivery.</p>
        </div>
      </div>
    </div>;
}