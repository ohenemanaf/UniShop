/**
 * File: Navbar.jsx
 * Description: Auto-generated documentation for Navbar.jsx
 * Date: 2026-07-21
 */
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginStateFor } from '../hooks/useLoginRedirect';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSocket } from '../context/SocketContext';
import { IconSearch, IconBell, IconShoppingCart, IconMenu2, IconX, IconPackage } from '@tabler/icons-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import SearchOverlay from './SearchOverlay';
import {useStoreSettings} from '../context/StoreSettingsContext';
export default /**
 * Function Navbar
 * @returns {any}
 */
function Navbar() {
  const {settings} = useStoreSettings();
  const {
    user,
    logout,
    isAuthenticated,
    isAdmin,
    isSeller
  } = useAuth();
  const {
    itemCount,
    setIsCartOpen
  } = useCart();
  const {
    notifications,
    clearNotifications
  } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const {
    scrollY
  } = useScroll();
  useMotionValueEvent(scrollY, "change", latest => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
      setMenuOpen(false);
    } else {
      setHidden(false);
    }
  });

  // Ctrl+K / Cmd+K global shortcut
  useEffect(() => {
    /**
 * Arrow Function h
 * @param {any} e
 * @returns {any}
 */
    const h = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  /**
 * Arrow Function handleLogout
 * @returns {any}
 */
  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setMobileMenuOpen(false);
  };
  /**
 * Arrow Function isActive
 * @param {any} path
 * @returns {any}
 */
  const isActive = path => path.startsWith('?category=') ? location.pathname === '/products' && new URLSearchParams(location.search).get('category') === path.split('=')[1] : location.pathname === path;
  const navItems = [
    { to: '/products', label: 'Shop all', active: location.pathname === '/products' && !location.search },
    { to: '/products?category=electronics', label: 'Tech', active: isActive('?category=electronics') },
    { to: '/products?category=fashion', label: 'Fashion', active: isActive('?category=fashion') },
    { to: '/products?category=home-living', label: 'Dorm', active: isActive('?category=home-living') },
    { to: '/products?category=books', label: 'Books', active: isActive('?category=books') },
    { to: '/about', label: 'About', active: isActive('/about') }
  ];
  const menuLink = 'flex items-center h-9 px-3 text-[13px] text-on-surface hover:bg-surface-dim transition-colors';
  return <>
    <motion.header variants={{
      visible: { y: 0 },
      hidden: { y: '-100%' }
    }} animate={hidden ? 'hidden' : 'visible'} transition={{
      duration: 0.3,
      ease: [0.32, 0.72, 0, 1]
    }} className="shop-header fixed top-0 z-50 w-full backdrop-blur-xl">
      <div className="page h-[60px] flex items-center gap-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 min-w-0 shrink-0" aria-label={`${settings.store_name} home`}>
          <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
            <IconPackage size={18} stroke={2} />
          </span>
          <span className="text-[17px] font-extrabold tracking-tight text-primary truncate">{settings.store_name}</span>
        </Link>

        {/* Primary navigation (desktop) */}
        <nav className="hidden lg:flex items-center gap-0.5 ml-4" aria-label="Main">
          {navItems.map(item => <Link key={item.label} to={item.to} aria-current={item.active ? 'page' : undefined} className={`h-8 px-3 inline-flex items-center rounded-md text-[13px] font-semibold transition-colors ${item.active ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'}`}>
              {item.label}
            </Link>)}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Search: single line, never wraps */}
          <button onClick={() => setSearchOpen(true)} className="hidden md:flex items-center gap-2 h-9 w-56 lg:w-64 px-3 rounded-lg border border-outline-variant bg-surface text-left text-[13px] text-on-surface-variant hover:border-outline transition-colors">
            <IconSearch size={15} stroke={1.8} className="shrink-0" />
            <span className="flex-1 truncate">Search products</span>
            <kbd className="hidden lg:inline text-[11px] font-semibold text-on-surface-variant/70 border border-outline-variant rounded px-1.5 leading-5">Ctrl K</kbd>
          </button>
          <button onClick={() => setSearchOpen(true)} className="icon-btn md:hidden" aria-label="Search products">
            <IconSearch size={19} stroke={1.8} />
          </button>

          {isAuthenticated ? <>
              {(isSeller || isAdmin) && <Link to={isAdmin ? '/admin' : '/seller'} className="icon-btn" aria-label="Notifications" onClick={clearNotifications}>
                  <IconBell size={19} stroke={1.8} />
                  {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full ring-2 ring-background"></span>}
                </Link>}
              <button onClick={() => setIsCartOpen(true)} className="icon-btn" aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}>
                <IconShoppingCart size={19} stroke={1.8} />
                {itemCount > 0 && <span className="absolute top-1 right-0.5 bg-primary text-white text-[11px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center ring-2 ring-background tabular">{itemCount}</span>}
              </button>
              <div className="relative ml-1">
                <button onClick={() => setMenuOpen(!menuOpen)} aria-haspopup="menu" aria-expanded={menuOpen} aria-label="Account menu" className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container text-[13px] font-bold flex items-center justify-center hover:ring-2 hover:ring-primary/20 transition-shadow">
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </button>
                <AnimatePresence>
                  {menuOpen && <motion.div role="menu" initial={{ opacity: 0, y: 6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.98 }} transition={{ duration: 0.16, ease: [0.32, 0.72, 0, 1] }} className="absolute top-[calc(100%+8px)] right-0 w-56 z-50 origin-top-right card shadow-level-2 overflow-hidden py-1">
                      <div className="px-3 py-2.5 border-b border-outline-variant mb-1">
                        <p className="font-semibold text-on-surface text-[13px] truncate">{user.name}</p>
                        <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" className={menuLink} onClick={() => setMenuOpen(false)}>My account</Link>
                      <Link to="/orders" className={menuLink} onClick={() => setMenuOpen(false)}>Orders</Link>
                      <Link to="/wishlist" className={menuLink} onClick={() => setMenuOpen(false)}>Wishlist</Link>
                      <Link to="/settings" className={menuLink} onClick={() => setMenuOpen(false)}>Settings</Link>
                      {isSeller && <Link to="/seller" className={menuLink} onClick={() => setMenuOpen(false)}>Seller dashboard</Link>}
                      {isAdmin && <Link to="/admin" className={menuLink} onClick={() => setMenuOpen(false)}>Admin panel</Link>}
                      <div className="h-px bg-outline-variant my-1"></div>
                      <button onClick={handleLogout} className={`${menuLink} w-full text-left text-error hover:bg-error-container/50`}>Sign out</button>
                    </motion.div>}
                </AnimatePresence>
              </div>
            </> : <>
              <Link to="/login" state={loginStateFor(location)} className="btn-ghost btn-sm hidden sm:inline-flex">Log in</Link>
              <Link to="/register" state={loginStateFor(location)} className="btn-primary btn-sm">Sign up</Link>
            </>}

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="icon-btn lg:hidden" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <IconX size={20} stroke={1.8} /> : <IconMenu2 size={20} stroke={1.8} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileMenuOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }} className="lg:hidden overflow-hidden border-t border-outline-variant bg-background">
            <nav className="page py-3" aria-label="Main">
              <div className="list-group">
                {[...navItems, { to: '/faq', label: 'FAQ', active: isActive('/faq') }].map(item => <Link key={item.label} to={item.to} onClick={() => setMobileMenuOpen(false)} aria-current={item.active ? 'page' : undefined} className={`list-row justify-between ${item.active ? 'text-primary font-semibold' : ''}`}>
                    {item.label}
                    {item.active && <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />}
                  </Link>)}
              </div>
            </nav>
          </motion.div>}
      </AnimatePresence>
    </motion.header>

    {/* Global Search Overlay */}
    <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
  </>;
}
