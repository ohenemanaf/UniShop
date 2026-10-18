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
      <aside className={`bg-surface/90 backdrop-blur-3xl border-r border-outline/20 shadow-level-1 flex flex-col h-screen w-72 fixed left-0 top-0 z-50 transition-transform duration-500 ease-spring lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between lg:justify-start gap-4 border-b border-outline/10">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-fixed text-white shadow-md overflow-hidden shrink-0 flex items-center justify-center group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
              {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" /> : <IconBuildingStore size={24} stroke={2} />}
            </div>
            <div>
              <h1 className="text-xl font-black text-primary leading-none tracking-tight mb-1 group-hover:text-primary-fixed transition-colors">Seller Studio.</h1>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{user?.name || 'UniShop'}</p>
            </div>
          </Link>
          <button className="lg:hidden text-on-surface-variant p-2 bg-surface-variant rounded-full active:scale-95 transition-transform" onClick={() => setMobileMenuOpen(false)}>
            <IconX size={20} stroke={2} />
          </button>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 px-6 pb-8 pt-6 overflow-y-auto">
          {navItems.map(item => {
          const isActive = pathname === item.path || item.path !== '/seller' && pathname.startsWith(item.path);
          const IconComponent = item.icon;
          return <Link key={item.name} to={item.path} onClick={() => setMobileMenuOpen(false)} className="relative group">
                <div className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 z-10 relative ${isActive ? 'text-white font-bold' : 'text-on-surface hover:text-primary font-semibold'}`}>
                  <IconComponent size={22} stroke={isActive ? 2.5 : 2} className="relative z-10" />
                  <span className="text-sm tracking-wide relative z-10">{item.name}</span>
                </div>
                {isActive && <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary rounded-2xl shadow-md shadow-primary/30 z-0" transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }} />}
                {!isActive && <div className="absolute inset-0 bg-surface-variant/0 group-hover:bg-surface-variant/80 rounded-2xl transition-colors duration-300 z-0"></div>}
              </Link>;
        })}
        </nav>

        <div className="p-6 space-y-3 bg-surface/50 backdrop-blur-md border-t border-outline/10">
          <Link to="/seller/products/new" className="w-full bg-secondary text-white hover:bg-secondary-fixed rounded-2xl px-4 py-3.5 font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-95 group">
            <IconPlus size={20} stroke={2} className="group-hover:rotate-90 transition-transform duration-300" />
            Post New Item
          </Link>
          <button onClick={handleLogout} className="w-full bg-transparent border border-transparent hover:border-error/30 text-error hover:bg-error/10 rounded-2xl px-4 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 group">
            <IconLogout size={20} stroke={2} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 lg:ml-72 p-4 lg:p-8 min-h-screen flex flex-col relative z-0">
        {/* Header area for mobile */}
        <header className="lg:hidden flex items-center justify-between mb-8 bg-surface/80 backdrop-blur-xl p-4 rounded-3xl shadow-sm border border-outline/20">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-fixed text-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
               {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover mix-blend-multiply" /> : <IconBuildingStore size={20} stroke={1.5} />}
             </div>
             <h1 className="text-xl font-black text-primary tracking-tight">Seller Studio</h1>
          </div>
          <button className="text-primary p-2 bg-surface-variant/50 hover:bg-surface-variant rounded-full border border-outline/20 transition-colors" onClick={() => setMobileMenuOpen(true)}>
            <IconMenu2 size={20} stroke={1.5} />
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
              <div className="flex justify-between items-center gap-3 mb-6 text-sm"><Link to="/demo" className="font-semibold text-primary">Explore demo roles</Link><Link to="/" className="text-on-surface-variant">View store ↗</Link></div><Outlet />
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