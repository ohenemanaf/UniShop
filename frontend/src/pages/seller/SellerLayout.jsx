/**
 * File: SellerLayout.jsx
 * Description: Auto-generated documentation for SellerLayout.jsx
 * Date: 2026-07-21
 */
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconLayoutGrid, IconBox, IconTruckDelivery, IconX, IconPlus, IconLogout, IconMenu2, IconWallet, IconChartBar, IconBuildingStore } from '@tabler/icons-react';
export default /**
 * Function SellerLayout
 * @returns {any}
 */
function SellerLayout() {
  const {
    pathname
  } = useLocation();
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  /**
 * Arrow Function handleLogout
 * @returns {any}
 */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navItems = [{
    name: 'Dashboard',
    path: '/seller',
    icon: IconLayoutGrid
  }, {
    name: 'Analytics',
    path: '/seller/analytics',
    icon: IconChartBar
  }, {
    name: 'Inventory',
    path: '/seller/products',
    icon: IconBox
  }, {
    name: 'Orders',
    path: '/seller/orders',
    icon: IconTruckDelivery
  }, {
    name: 'Payouts',
    path: '/seller/payouts',
    icon: IconWallet
  }];
  return <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* SideNavBar */}
      <aside className={`bg-surface border-r border-outline-variant flex flex-col h-screen w-60 fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 px-4 flex items-center justify-between gap-3 border-b border-outline-variant">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary text-white overflow-hidden shrink-0 flex items-center justify-center">
              {user?.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : <IconBuildingStore size={17} stroke={2} />}
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-extrabold text-on-surface leading-tight tracking-tight">Seller Studio</p>
              <p className="text-[11px] text-on-surface-variant truncate">{user?.name || 'UniShop'}</p>
            </div>
          </Link>
          <button className="icon-btn lg:hidden" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)}>
            <IconX size={18} />
          </button>
        </div>
        
        <nav className="flex-1 flex flex-col gap-0.5 p-3 overflow-y-auto" aria-label="Seller">
          {navItems.map(item => {
          const isActive = pathname === item.path || item.path !== '/seller' && pathname.startsWith(item.path);
          const IconComponent = item.icon;
          return <Link key={item.name} to={item.path} onClick={() => setMobileMenuOpen(false)} aria-current={isActive ? 'page' : undefined} className={`flex items-center gap-3 h-9 px-3 rounded-lg text-[13px] transition-colors ${isActive ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant font-medium hover:bg-surface-dim hover:text-on-surface'}`}>
                <IconComponent size={18} stroke={isActive ? 2.2 : 1.8} />
                <span>{item.name}</span>
              </Link>;
        })}
        </nav>

        <div className="p-3 space-y-1 border-t border-outline-variant">
          <Link to="/seller/products/new" className="btn-primary btn-sm w-full">
            <IconPlus size={15} stroke={2.2} /> New listing
          </Link>
          <button onClick={handleLogout} className="btn-ghost btn-sm w-full text-error hover:text-error hover:bg-error-container/60">
            <IconLogout size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 lg:ml-60 p-4 lg:px-8 lg:py-6 min-h-screen flex flex-col relative z-0">
        {/* Header area for mobile */}
        <header className="lg:hidden flex items-center justify-between mb-4 card h-12 px-3">
          <div className="flex items-center gap-2">
             <div className="w-7 h-7 rounded-md bg-primary text-white overflow-hidden shrink-0 flex items-center justify-center">
               {user?.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : <IconBuildingStore size={15} stroke={2} />}
             </div>
             <p className="text-[15px] font-extrabold text-on-surface tracking-tight">Seller Studio</p>
          </div>
          <button className="icon-btn" aria-label="Open navigation" onClick={() => setMobileMenuOpen(true)}>
            <IconMenu2 size={19} />
          </button>
        </header>

        {/* Page Transition Wrapper */}
        <div className="flex-1 w-full h-full relative">
          <AnimatePresence mode="wait">
            <motion.div key={pathname} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }} transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }} className="h-full">
              <div className="flex justify-between items-center gap-3 mb-4 text-xs"><Link to="/demo" className="font-semibold text-primary hover:underline">Explore demo roles</Link><Link to="/" className="text-on-surface-variant hover:text-primary">View store ↗</Link></div><Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
      </AnimatePresence>
    </div>;
}