/**
 * File: Navbar.jsx
 * Description: Auto-generated documentation for Navbar.jsx
 * Date: 2026-07-21
 */
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import { IconSearch, IconBell, IconShoppingCart, IconMenu2, IconX, IconSun, IconMoon, IconPackage } from '@tabler/icons-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import SearchOverlay from './SearchOverlay';
export default /**
 * Function Navbar
 * @returns {any}
 */
function Navbar() {
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
  const {
    theme,
    toggleTheme
  } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
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
 * Arrow Function handleSearch
 * @param {any} e
 * @returns {any}
 */
  const handleSearch = e => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMobileMenuOpen(false);
    }
  };
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
  const isActive = path => location.pathname === path || location.search.includes(`category=${path.split('=')[1]}`);
  return <>
    <motion.header variants={{
      visible: {
        y: 0
      },
      hidden: {
        y: "-100%"
      }
    }} animate={hidden ? "hidden" : "visible"} transition={{
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1]
    }} className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-[1440px] mx-auto">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-primary text-white p-2 rounded-[3px] shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
            <IconPackage size={22} stroke={2} />
          </div>
          <span className="font-headline-md text-2xl font-black tracking-tight text-primary">UniShop.</span>
        </Link>
        
        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 font-bold text-xs uppercase tracking-widest">
          <Link to="/products" className={`relative group transition-all duration-300 ${location.pathname === '/products' && !location.search ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
            Shop All
            {location.pathname === '/products' && !location.search && <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-primary" />}
          </Link>
          <Link to="/products?category=electronics" className={`relative group transition-all duration-300 ${isActive('?category=electronics') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
            Tech
            {isActive('?category=electronics') && <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-primary" />}
          </Link>
          <Link to="/products?category=fashion" className={`relative group transition-all duration-300 ${isActive('?category=fashion') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
            Fashion
            {isActive('?category=fashion') && <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-primary" />}
          </Link>
          <Link to="/products?category=home-living" className={`relative group transition-all duration-300 ${isActive('?category=home-living') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
            Dorm
            {isActive('?category=home-living') && <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-primary" />}
          </Link>
          <div className="h-4 w-px bg-outline/50 mx-2"></div>
          <Link to="/about" className={`relative group transition-all duration-300 ${isActive('/about') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
            About
          </Link>
        </nav>

        {/* Search Bar & Actions */}
        <div className="flex items-center gap-4 relative">
          {/* Search Trigger (Desktop) */}
          <button onClick={() => setSearchOpen(true)} className="hidden md:flex items-center gap-3 bg-surface-variant/50 hover:bg-surface-variant rounded-[3px] px-4 py-2.5 border border-transparent hover:border-outline/50 transition-all duration-200 w-64 lg:w-80 text-left group">
            <IconSearch size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" stroke={1.5} />
            <span className="flex-1 text-sm text-on-surface-variant/70 font-medium">Search essentials...</span>
            <kbd className="hidden lg:flex items-center gap-0.5 text-[10px] font-bold text-on-surface-variant/50 bg-surface px-1.5 py-0.5 rounded border border-outline/30">
              <span>Ctrl</span><span className="mx-0.5">K</span>
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="hidden md:flex items-center justify-center w-10 h-10 rounded-[3px] text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors active:scale-95" aria-label="Toggle dark mode">
            <motion.div initial={false} animate={{
              rotate: theme === 'dark' ? 180 : 0
            }} transition={{
              type: "spring",
              stiffness: 200,
              damping: 10
            }}>
              {theme === 'dark' ? <IconMoon size={20} stroke={1.5} /> : <IconSun size={20} stroke={1.5} />}
            </motion.div>
          </button>

          {isAuthenticated ? <div className="flex items-center gap-2">
              {(isSeller || isAdmin) && <Link to="/seller" className="flex items-center justify-center w-10 h-10 rounded-[3px] text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors active:scale-95 relative" onClick={clearNotifications}>
                  <IconBell size={20} stroke={1.5} />
                  {notifications.length > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full border-2 border-surface"></span>}
                </Link>}
              <button onClick={() => setIsCartOpen(true)} className="flex items-center justify-center w-10 h-10 rounded-[3px] text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors active:scale-95 relative">
                <IconShoppingCart size={20} stroke={1.5} />
                {itemCount > 0 && <span className="absolute top-1.5 right-1.5 bg-primary text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center border-2 border-surface">
                    {itemCount}
                  </span>}
              </button>
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center justify-center w-10 h-10 rounded-[3px] bg-surface-variant text-primary hover:bg-outline transition-colors active:scale-95 overflow-hidden ml-1 border border-outline/50">
                  <span className="font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                </button>

                <AnimatePresence>
                  {menuOpen && <motion.div initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.95
                }} animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }} exit={{
                  opacity: 0,
                  y: 10,
                  scale: 0.95
                }} transition={{
                  duration: 0.15,
                  ease: "easeOut"
                }} className="absolute top-[120%] right-0 bg-surface border border-outline rounded-[3px] shadow-sm py-2 w-56 z-50 overflow-hidden origin-top-right">
                      <div className="px-4 py-3 border-b border-outline mb-1 bg-surface-variant/30">
                        <p className="font-bold text-primary text-sm truncate">{user.name}</p>
                        <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>Account Settings</Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>Order History</Link>
                      {isSeller && <Link to="/seller" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>Seller Dashboard</Link>}
                      {isAdmin && <Link to="/admin" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                      <div className="h-px bg-outline my-1"></div>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors font-medium">Sign Out</button>
                    </motion.div>}
                </AnimatePresence>
              </div>
            </div> : <div className="flex items-center gap-3 ml-2">
              <Link to="/login" className="text-on-surface-variant font-medium text-sm hidden sm:block hover:text-primary transition-colors">Log In</Link>
              <Link to="/register" className="bg-primary text-white px-5 py-2.5 rounded-[3px] text-xs uppercase tracking-widest font-bold hover:bg-primary-fixed transition-colors shadow-sm active:scale-95">Sign Up</Link>
            </div>}

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden flex items-center justify-center w-10 h-10 rounded-[3px] text-on-surface-variant hover:bg-surface-variant transition-colors active:scale-95">
            {mobileMenuOpen ? <IconX size={24} stroke={1.5} /> : <IconMenu2 size={24} stroke={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overflow */}
      <AnimatePresence>
        {mobileMenuOpen && <motion.div initial={{
          height: 0,
          opacity: 0
        }} animate={{
          height: "auto",
          opacity: 1
        }} exit={{
          height: 0,
          opacity: 0
        }} className="md:hidden overflow-hidden border-t border-outline bg-surface">
            <div className="px-4 py-4 flex flex-col gap-3">
              <button onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(true);
            }} className="flex items-center gap-3 bg-surface-variant rounded-[3px] px-4 py-3 mb-2 w-full text-left hover:bg-outline/30 transition-colors">
                <IconSearch size={18} className="text-on-surface-variant" stroke={1.5} />
                <span className="text-sm text-on-surface-variant/70 font-medium">Search products...</span>
              </button>
              <Link to="/products?category=dorm" className="px-4 py-2 rounded-lg hover:bg-surface-variant text-on-surface font-medium text-sm transition-colors">Dorm</Link>
              <Link to="/products?category=tech" className="px-4 py-2 rounded-lg hover:bg-surface-variant text-on-surface font-medium text-sm transition-colors">Tech</Link>
              <Link to="/products?category=books" className="px-4 py-2 rounded-lg hover:bg-surface-variant text-on-surface font-medium text-sm transition-colors">Books</Link>
              <Link to="/products?category=fashion" className="px-4 py-2 rounded-lg hover:bg-surface-variant text-on-surface font-medium text-sm transition-colors">Fashion</Link>
              <Link to="/about" className="px-4 py-2 rounded-lg hover:bg-surface-variant text-on-surface font-medium text-sm transition-colors">About</Link>
              <Link to="/faq" className="px-4 py-2 rounded-lg hover:bg-surface-variant text-on-surface font-medium text-sm transition-colors">FAQ</Link>
              <div className="h-px bg-outline my-1"></div>
              <button onClick={toggleTheme} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-surface-variant text-on-surface font-medium text-sm transition-colors text-left">
                {theme === 'dark' ? <IconMoon size={18} stroke={1.5} /> : <IconSun size={18} stroke={1.5} />}
                Toggle Theme
              </button>
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.header>

    {/* Global Search Overlay */}
    <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
  </>;
}