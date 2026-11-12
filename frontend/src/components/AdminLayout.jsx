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
  return <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row antialiased">
      {/* SideNavBar */}
      <aside className={`bg-surface border-r border-outline-variant flex flex-col h-screen w-60 fixed left-0 top-0 z-50 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 px-4 flex items-center justify-between gap-3 border-b border-outline-variant shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <IconShieldLock size={17} stroke={2} />
            </div>
            <div>
              <p className="text-[15px] font-extrabold text-on-surface tracking-tight leading-tight">UniShop</p>
              <p className="text-[11px] text-on-surface-variant">Admin centre</p>
            </div>
          </div>
          <button aria-label="Close navigation" className="icon-btn lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <IconX size={18} />
          </button>
        </div>
        
        <nav className="flex-1 flex flex-col gap-0.5 p-3" aria-label="Admin">
          {navItems.map(item => {
          const isActive = pathname === item.path || item.path !== '/admin' && pathname.startsWith(item.path);
          const IconComponent = item.icon;
          return <Link key={item.name} to={item.path} onClick={() => setMobileMenuOpen(false)} aria-current={isActive ? 'page' : undefined} className={`flex items-center gap-3 h-9 px-3 rounded-lg text-[13px] transition-colors ${isActive ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant font-medium hover:bg-surface-dim hover:text-on-surface'}`}>
                <IconComponent size={18} stroke={isActive ? 2.2 : 1.8} />
                <span>{item.name}</span>
              </Link>;
        })}
        </nav>

        <div className="mt-auto p-3 bg-surface sticky bottom-0 border-t border-outline-variant">
          <button onClick={handleLogout} className="btn-ghost btn-sm w-full text-error hover:text-error hover:bg-error-container/60">
            <IconLogout size={15} /> Sign out
          </button>
        </div>
      </aside>

      {mobileMenuOpen && <button aria-label="Close admin navigation" onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}
      {/* Main Content */}
      <main className="flex-1 min-w-0 lg:ml-60 p-4 lg:px-8 lg:py-6 min-h-screen flex flex-col">
        {/* Header area for mobile */}
        <header className="lg:hidden flex items-center justify-between mb-4 card h-12 px-3">
          <div className="flex items-center gap-2">
             <IconShieldLock size={18} stroke={1.8} className="text-primary" />
             <p className="text-[15px] font-extrabold text-on-surface tracking-tight">Admin centre</p>
          </div>
          <button aria-label="Open navigation" className="icon-btn" onClick={() => setMobileMenuOpen(true)}>
            <IconMenu2 size={19} />
          </button>
        </header>

        <div className="flex justify-between items-center gap-4 mb-4 text-xs text-on-surface-variant"><Link to="/demo" className="text-primary font-semibold hover:underline">Portfolio demo · Explore roles</Link><Link to="/" className="hover:text-primary">View store ↗</Link></div>
        <div className="flex-1 w-full min-w-0">
           <Outlet />
        </div>
      </main>
    </div>;
}