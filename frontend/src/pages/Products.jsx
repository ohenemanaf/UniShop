/**
 * File: Products.jsx
 * Description: Auto-generated documentation for Products.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { GHS0 } from '../utils/currency';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { IconSearchOff, IconChevronLeft, IconChevronRight, IconChevronDown, IconMenu2, IconX } from '@tabler/icons-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
const SORT_OPTIONS = [{
  value: 'newest',
  label: 'Newest'
}, {
  value: 'popular',
  label: 'Most Popular'
}, {
  value: 'rating',
  label: 'Top Rated'
}, {
  value: 'price_asc',
  label: 'Price: Low → High'
}, {
  value: 'price_desc',
  label: 'Price: High → Low'
}];
export default /**
 * Function Products
 * @returns {any}
 */
function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const color = searchParams.get('color') || '';
  const size = searchParams.get('size') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [priceRange, setPriceRange] = useState([parseInt(minPrice) || 0, parseInt(maxPrice) || 2000]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        sort
      };
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (color) params.color = color;
      if (size) params.size = size;
      const res = await api.get('/products', {
        params
      });
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, minPrice, maxPrice, color, size, page]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(() => {});
  }, []);
  /**
 * Arrow Function setParam
 * @param {any} key
 * @param {any} val
 * @returns {any}
 */
  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val);else next.delete(key);
    if (key !== 'page') {
      next.delete('page');
    }
    setSearchParams(next);
  };
  /**
 * Arrow Function applySliderFilter
 * @param {any} val
 * @returns {any}
 */
  const applySliderFilter = val => {
    const next = new URLSearchParams(searchParams);
    if (val[0] > 0) next.set('minPrice', val[0]);else next.delete('minPrice');
    if (val[1] < 2000) next.set('maxPrice', val[1]);else next.delete('maxPrice');
    next.delete('page');
    setSearchParams(next);
  };
  /**
 * Arrow Function clearFilters
 * @returns {any}
 */
  const clearFilters = () => {
    setSearchParams({});
    setPriceRange([0, 2000]);
  };
  const pageTitle = search ? `Search Results for "${search}"` : category ? `${categories.find(c => c.slug === category)?.name || category}` : 'All Products';
  return (
    <PageTransition className="max-w-[1440px] mx-auto px-4 md:px-8 pt-24 pb-20">
      <SEO title={`${pageTitle} | UniShop`} description={`Browse ${pageTitle.toLowerCase()} on UniShop. Find the best deals and premium products.`} />
      
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="font-headline-xl text-4xl md:text-5xl font-bold tracking-tight text-primary mb-3">
          {search ? `Search Results` : category ? `${categories.find(c => c.slug === category)?.name || category}` : 'All Essentials'}
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant max-w-2xl">Premium gear for study, play, and everything in between.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-gutter relative">
        {/* Mobile Filter Backdrop */}
        {isMobileFilterOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileFilterOpen(false)} />}
        
        {/* Sidebar Filters */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-[320px] max-w-[85vw] bg-surface shadow-2xl p-6 lg:p-0 overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 lg:w-56 lg:bg-transparent lg:shadow-none lg:overflow-visible shrink-0 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center lg:hidden mb-8 pb-4 border-b border-outline/30">
            <h2 className="text-xl font-bold text-primary tracking-tight">Filters & Categories</h2>
            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-surface-variant rounded-full text-on-surface-variant hover:text-primary transition-colors">
              <IconX size={20} />
            </button>
          </div>
          <div className="sticky top-24 space-y-12">
            
            {/* Categories */}
            <div>
              <h3 className="font-bold text-xs text-primary mb-4 uppercase tracking-widest border-b border-outline/30 pb-2">Categories</h3>
              <ul className="flex flex-col space-y-1.5">
                <li>
                  <button onClick={() => setParam('category', '')} className={`text-sm font-semibold transition-all flex items-center justify-between w-full px-3 py-2 rounded-lg outline-none ${!category ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'}`}>
                    All Products
                    {!category && <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>}
                  </button>
                </li>
                {categories.map(cat => <li key={cat.id}>
                    <button onClick={() => setParam('category', cat.slug)} className={`text-sm font-semibold transition-all flex items-center justify-between w-full px-3 py-2 rounded-lg outline-none ${category === cat.slug ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'}`}>
                      {cat.name}
                      {category === cat.slug && <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>}
                    </button>
                  </li>)}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-end mb-5 border-b border-outline/30 pb-2">
                <h3 className="font-bold text-xs text-primary uppercase tracking-widest">Price Range</h3>
                <span className="text-xs text-on-surface-variant font-bold tracking-widest">
                  {GHS0(priceRange[0])} - {priceRange[1] === 2000 ? GHS0(2000) + '+' : GHS0(priceRange[1])}
                </span>
              </div>
              <div className="px-2 pb-2 pt-2">
                <Slider range min={0} max={2000} step={10} value={priceRange} onChange={setPriceRange} onChangeComplete={applySliderFilter} styles={{
                track: {
                  backgroundColor: '#1D4ED8'
                },
                handle: {
                  borderColor: '#1D4ED8',
                  backgroundColor: '#FFFFFF',
                  opacity: 1,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                },
                rail: {
                  backgroundColor: '#E4E4E7'
                }
              }} />
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="font-bold text-xs text-primary mb-5 uppercase tracking-widest border-b border-outline/30 pb-2">Color</h3>
              <div className="flex gap-3 flex-wrap pt-1">
                {['Black', 'White', 'Silver', 'Blue', 'Red'].map(c => <button key={c} onClick={() => setParam('color', color === c ? '' : c)} className={`w-7 h-7 rounded-full border outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${color === c ? 'border-primary ring-2 ring-primary ring-offset-2 scale-110 shadow-sm' : 'border-outline/50 opacity-80'} cursor-pointer hover:scale-110 hover:opacity-100 transition-all`} style={{
                background: c.toLowerCase() === 'white' ? '#F4F4F5' : c.toLowerCase()
              }} title={c} />)}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="font-bold text-xs text-primary mb-5 uppercase tracking-widest border-b border-outline/30 pb-2">Size</h3>
              <div className="flex gap-2 flex-wrap pt-1">
                {['S', 'M', 'L', 'XL'].map(s => <button key={s} onClick={() => setParam('size', size === s ? '' : s)} className={`w-10 h-10 flex items-center justify-center rounded-lg border text-xs font-bold uppercase tracking-widest transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${size === s ? 'bg-primary text-white border-primary shadow-sm' : 'bg-transparent text-on-surface-variant border-outline hover:border-primary hover:text-primary'}`}>
                    {s}
                  </button>)}
              </div>
            </div>

          </div>
        </aside>

        {/* Main Product Grid Area */}
        <main className="flex-grow">
          {/* Active Filters & Sorting */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-medium text-sm text-on-surface-variant">{pagination.total || 0} Products</span>
              {(search || category || minPrice || maxPrice || color || size) && <>
                  <button onClick={clearFilters} className="text-sm font-medium text-secondary hover:text-primary underline transition-colors">Clear All</button>
                </>}
            </div>

            <div className="flex items-center space-x-3">
              {/* Hamburger Menu Toggle (Mobile Only) */}
              <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 text-sm font-bold bg-primary text-white px-4 py-2 rounded-full shadow-md active:scale-95 transition-all">
                <IconMenu2 size={18} /> Menu
              </button>

              <span className="hidden md:inline font-bold text-xs uppercase tracking-widest text-on-surface-variant">Sort by</span>
              <div className="relative">
                <select value={sort} onChange={e => setParam('sort', e.target.value)} className="bg-transparent border-b border-outline hover:border-primary py-1 pl-1 pr-6 focus:border-primary text-sm font-bold text-primary appearance-none outline-none cursor-pointer transition-colors rounded-none">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                  <IconChevronDown size={14} stroke={2} />
                </div>
              </div>
            </div>
          </div>

          {loading ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(12)].map((_, i) => <div key={i} className="flex flex-col bg-surface border border-outline/30 rounded-2xl overflow-hidden min-w-0 h-full shadow-sm">
                  <div className="aspect-[4/5] bg-surface-variant animate-pulse shrink-0" />
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-2.5 w-16 bg-outline/50 animate-pulse rounded-full" />
                    </div>
                    <div className="h-4 w-full bg-outline/50 animate-pulse rounded-md mb-2" />
                    <div className="h-4 w-2/3 bg-outline/50 animate-pulse rounded-md mb-4" />
                    <div className="mt-auto pt-2 flex justify-between items-end border-t border-outline/20">
                      <div className="flex flex-col gap-2">
                        <div className="h-5 w-16 bg-outline/50 animate-pulse rounded-md" />
                        <div className="h-3 w-20 bg-outline/50 animate-pulse rounded-full" />
                      </div>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-outline/50 animate-pulse rounded-full shrink-0" />
                    </div>
                  </div>
                </div>)}
            </div> : products.length === 0 ? <div className="flex flex-col items-center justify-center py-24 text-center bg-surface border border-outline/30 rounded-3xl mt-8">
              <IconSearchOff size={64} className="text-outline mb-6" stroke={1} />
              <h3 className="text-2xl font-bold text-primary mb-2 tracking-tight">No products found</h3>
              <p className="text-on-surface-variant max-w-[400px] mb-8">Try adjusting your filters or searching for something else to find what you're looking for.</p>
              <button onClick={clearFilters} className="px-8 py-3 bg-primary text-white rounded-full font-semibold shadow-sm hover:shadow-md hover:bg-primary-fixed transition-all active:scale-95">Clear All Filters</button>
            </div> : <>
              <motion.div initial="hidden" animate="show" variants={{
                show: {
                  transition: { staggerChildren: 0.05 }
                }
              }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map(product => <ProductCard key={product.id} product={product} />)}
              </motion.div>

              {/* Pagination */}
              {pagination.totalPages > 1 && <div className="flex justify-center items-center mt-20 gap-4">
                  <button disabled={page <= 1} onClick={() => setParam('page', page - 1)} className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <IconChevronLeft size={16} stroke={2} /> Prev
                  </button>
                  <div className="flex gap-1.5 mx-4">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                const p = i + 1;
                if (p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1) {
                  return <button key={p} onClick={() => setParam('page', p)} className={`w-8 h-8 rounded-[3px] flex items-center justify-center font-bold text-sm transition-all ${p === page ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant border border-transparent hover:border-outline hover:bg-surface-variant'}`}>
                            {p}
                          </button>;
                }
                if (Math.abs(p - page) === 2) return <span key={p} className="flex items-center text-outline px-1">…</span>;
                return null;
              })}
                  </div>
                  <button disabled={page >= pagination.totalPages} onClick={() => setParam('page', page + 1)} className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    Next <IconChevronRight size={16} stroke={2} />
                  </button>
                </div>}
            </>}
        </main>
      </div>
    </PageTransition>
  );
}