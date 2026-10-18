/**
 * File: AdminLayout.jsx
 * Description: Auto-generated documentation for AdminLayout.jsx
 * Date: 2026-07-21
 */
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { IconLayoutGrid, IconTruckDelivery, IconBox, IconUsers, IconShoppingBag, IconCategory, IconTags, IconHeadset, IconMessageCircle, IconStar, IconShieldLock, IconX, IconLogout, IconMenu2, IconWallet, IconPhoto, IconChartBar } from '@tabler/icons-react';
export default /**
 * Function AdminLayout
 * @returns {any}
 */
function AdminLayout() {
  const {
    pathname
  } = useLocation();
  const {
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
    navigate('/');
  };
  const navItems = [{ name: 'Control Center', path: '/admin', icon: IconShieldLock }, { name: 'Contact Inbox', path: '/admin/messages', icon: IconMessageCircle }, { name: 'Store Settings', path: '/admin/settings', icon: IconCategory }, {
    name: 'Dashboard',
    path: '/admin/overview',
    icon: IconLayoutGrid
  }, {
    name: 'Analytics',
    path: '/admin/analytics',
    icon: IconChartBar
  }, {
    name: 'Orders',
    path: '/admin/orders',
    icon: IconTruckDelivery
  }, {
    name: 'Inventory',
    path: '/admin/inventory',
    icon: IconBox
  }, {
    name: 'Users & Sellers',
    path: '/admin/users',
    icon: IconUsers
  }, {
    name: 'Products',
    path: '/admin/products',
    icon: IconShoppingBag
  }, {
    name: 'Categories',
    path: '/admin/categories',
    icon: IconCategory
  }, {
    name: 'Promotions',
    path: '/admin/promos',
    icon: IconTags
  }, {
    name: 'Banners',
    path: '/admin/banners',
    icon: IconPhoto
  }, {
    name: 'Curated Edits',
    path: '/admin/edits',
    icon: IconPhoto
  }, {
    name: 'Payouts',
    path: '/admin/payouts',
    icon: IconWallet
  }, {
    name: 'Support',
    path: '/admin/support',
    icon: IconHeadset
  }, {
    name: 'Live Chat',
    path: '/admin/live-chat',
    icon: IconMessageCircle
  }, {
    name: 'Reviews',
    path: '/admin/reviews',
    icon: IconStar
  }];
  return <div className="bg-surface-variant text-on-background min-h-screen flex flex-col lg:flex-row antialiased">
      {/* SideNavBar */}
      <aside className={`bg-surface/80 backdrop-blur-2xl border-r border-outline/30 shadow-level-1 flex flex-col h-screen w-72 fixed left-0 top-0 z-50 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-4 p-8 flex items-center justify-between lg:justify-start gap-4 border-b border-outline/20">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-xl shadow-md">
              <IconShieldLock size={24} stroke={2} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-primary tracking-tight leading-none mb-1">UniShop.</h1>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Command Center</p>
            </div>
          </div>
          <button aria-label="Close navigation" className="lg:hidden text-on-surface-variant p-2 bg-surface-variant rounded-full active:scale-95" onClick={() => setMobileMenuOpen(false)}>
            <IconX size={20} stroke={2} />
          </button>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1.5 px-6 pb-8 pt-4">
          {navItems.map(item => {
          const isActive = pathname === item.path || item.path !== '/admin' && pathname.startsWith(item.path);
          const IconComponent = item.icon;
          return <Link key={item.name} to={item.path} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 active:scale-95 ${isActive ? 'bg-primary text-[#FFFFFF] font-bold shadow-md shadow-primary/20 scale-[1.02]' : 'text-on-surface hover:bg-surface-variant hover:text-primary font-semibold'}`}>
                <IconComponent size={20} stroke={isActive ? 2.5 : 2} />
                <span className="text-sm tracking-wide">{item.name}</span>
              </Link>;
        })}
        </nav>

        <div className="mt-auto p-6 bg-surface/50 backdrop-blur-md sticky bottom-0 border-t border-outline/30">
          <button onClick={handleLogout} className="w-full bg-error/10 text-error hover:bg-error hover:text-white hover:shadow-md rounded-2xl px-4 py-3.5 text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95">
            <IconLogout size={20} stroke={2} />
            Sign Out
          </button>
        </div>
      </aside>

      {mobileMenuOpen && <button aria-label="Close admin navigation" onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}
      {/* Main Content */}
      <main className="flex-1 min-w-0 lg:ml-72 p-4 lg:p-8 min-h-screen flex flex-col">
        {/* Header area for mobile */}
        <header className="lg:hidden flex items-center justify-between mb-8 bg-surface p-4 rounded-2xl shadow-sm border border-outline/30">
          <div className="flex items-center gap-3">
             <IconShieldLock size={24} stroke={1.5} className="text-primary" />
             <h1 className="text-xl font-black text-primary">Admin Center</h1>
          </div>
          <button aria-label="Open navigation" className="text-primary p-2 active:scale-95" onClick={() => setMobileMenuOpen(true)}>
            <IconMenu2 size={24} stroke={1.5} />
          </button>
        </header>

        <div className="flex justify-between items-center gap-4 mb-6 text-sm text-on-surface-variant"><Link to="/demo" className="text-primary font-semibold">Portfolio demo · Explore roles</Link><Link to="/" className="text-primary font-semibold">View store ↗</Link></div>
        <div className="flex-1 w-full min-w-0">
           <Outlet />
        </div>
      </main>
    </div>;
}