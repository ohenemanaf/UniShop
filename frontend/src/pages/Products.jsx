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
import { IconSearchOff, IconChevronLeft, IconChevronRight, IconChevronDown, IconX, IconCheck, IconAdjustmentsHorizontal } from '@tabler/icons-react';
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
  const [error,setError]=useState('');
  const [loading, setLoading] = useState(true);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const color = searchParams.get('color') || '';
  const size = searchParams.get('size') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1',10) || 1);
  const [priceRange, setPriceRange] = useState([parseInt(minPrice) || 0, parseInt(maxPrice) || 2000]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const fetchProducts = useCallback(async signal => {
    setLoading(true);
    setError('');
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
        params, signal
      });
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      if(signal?.aborted) return;
      setProducts([]);setPagination({});
      setError(err.response?.data?.error || 'Products could not load. Please try again.');
    } finally {
      if(!signal?.aborted) setLoading(false);
    }
  }, [search, category, sort, minPrice, maxPrice, color, size, page]);
  useEffect(() => {
    const controller=new AbortController();
    fetchProducts(controller.signal);
    return ()=>controller.abort();
  }, [fetchProducts]);
  useEffect(()=>setPriceRange([Number(minPrice)||0,maxPrice===''?2000:Number(maxPrice)]),[minPrice,maxPrice]);
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
  const categoryName = category ? categories.find(c => c.slug === category)?.name || category : '';
  const activeFilters = [
    search && { key: 'search', label: `“${search}”` },
    category && { key: 'category', label: categoryName },
    (minPrice || maxPrice) && { key: 'price', label: `${GHS0(Number(minPrice) || 0)} – ${maxPrice ? GHS0(Number(maxPrice)) : GHS0(2000) + '+'}` },
    color && { key: 'color', label: color },
    size && { key: 'size', label: `Size ${size}` }
  ].filter(Boolean);
  const removeFilter = key => {
    if (key === 'price') { applySliderFilter([0, 2000]); setPriceRange([0, 2000]); return; }
    setParam(key, '');
  };
  const brand = '#185C43';
  const filterTitle = 'eyebrow mb-2 px-1';
  return (
    <PageTransition className="page pt-4 md:pt-6 pb-12">
      <SEO title={`${pageTitle} | UniShop`} description={`Browse ${pageTitle.toLowerCase()} on UniShop. Find the best deals and premium products.`} />

      {/* Title row: title + count on the left, filter and sort on the right */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h1 className="page-title truncate">{search ? 'Search results' : categoryName || 'All products'}</h1>
          <p className="page-subtitle">{loading ? 'Loading products…' : `${pagination.total || 0} product${pagination.total === 1 ? '' : 's'}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileFilterOpen(true)} className="btn-outline btn-sm lg:hidden">
            <IconAdjustmentsHorizontal size={15} /> Filters{activeFilters.length > 0 && <span className="pill-brand h-5 px-1.5">{activeFilters.length}</span>}
          </button>
          <label htmlFor="product-sort" className="sr-only">Sort products</label>
          <div className="relative">
            <select id="product-sort" value={sort} onChange={e => setParam('sort', e.target.value)} className="field h-8 w-44 pr-8 text-[13px] font-medium appearance-none cursor-pointer">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <IconChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
          </div>
        </div>
      </div>

      {/* Active filters as removable chips */}
      {activeFilters.length > 0 && <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {activeFilters.map(f => <button key={f.key} onClick={() => removeFilter(f.key)} className="pill-brand h-7 pl-2.5 pr-1.5 hover:bg-primary hover:text-white transition-colors" aria-label={`Remove filter ${f.label}`}>
              {f.label} <IconX size={13} stroke={2.2} />
            </button>)}
          <button onClick={clearFilters} className="text-[13px] font-semibold text-on-surface-variant hover:text-primary px-2">Clear all</button>
        </div>}

      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* Mobile Filter Backdrop */}
        {isMobileFilterOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setIsMobileFilterOpen(false)} />}

        {/* Sidebar filters: grouped lists (ClassFlow style) */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-[300px] max-w-[85vw] bg-background shadow-level-3 p-4 lg:p-0 overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 lg:w-52 lg:bg-transparent lg:shadow-none lg:overflow-visible shrink-0 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Filters">
          <div className="flex justify-between items-center lg:hidden mb-4">
            <h2 className="section-title">Filters</h2>
            <button onClick={() => setIsMobileFilterOpen(false)} className="icon-btn" aria-label="Close filters">
              <IconX size={18} />
            </button>
          </div>
          <div className="lg:sticky lg:top-20 space-y-5">
            <section>
              <h3 className={filterTitle}>Category</h3>
              <ul className="list-group">
                {[{ id: 'all', slug: '', name: 'All products' }, ...categories].map(cat => {
                  const active = (category || '') === cat.slug;
                  return <li key={cat.id}>
                      <button onClick={() => { setParam('category', cat.slug); setIsMobileFilterOpen(false); }} aria-pressed={active} className={`list-row w-full min-h-9 py-2 justify-between text-[13px] ${active ? 'text-primary font-semibold bg-primary-container/40' : 'text-on-surface-variant hover:text-on-surface'}`}>
                        {cat.name}
                        {active && <IconCheck size={15} stroke={2.2} aria-hidden="true" />}
                      </button>
                    </li>;
                })}
              </ul>
            </section>

            <section>
              <div className="flex items-baseline justify-between mb-2 px-1">
                <h3 className="eyebrow">Price</h3>
                <span className="text-xs font-semibold text-on-surface tabular">
                  {GHS0(priceRange[0])} – {priceRange[1] === 2000 ? GHS0(2000) + '+' : GHS0(priceRange[1])}
                </span>
              </div>
              <div className="card px-4 py-4">
                <Slider range min={0} max={2000} step={10} value={priceRange} onChange={setPriceRange} onChangeComplete={applySliderFilter} ariaLabelForHandle={['Minimum price', 'Maximum price']} styles={{
                  track: { backgroundColor: brand },
                  handle: { borderColor: brand, backgroundColor: '#FFFFFF', opacity: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.15)' },
                  rail: { backgroundColor: '#E1E7DE' }
                }} />
              </div>
            </section>

            <section>
              <h3 className={filterTitle}>Colour</h3>
              <div className="card px-3 py-3 flex gap-2.5 flex-wrap">
                {['Black', 'White', 'Silver', 'Blue', 'Red'].map(c => <button key={c} onClick={() => setParam('color', color === c ? '' : c)} aria-pressed={color === c} aria-label={c} title={c} className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${color === c ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-outline'}`} style={{
                  background: c.toLowerCase() === 'white' ? '#F4F4F5' : c.toLowerCase()
                }} />)}
              </div>
            </section>

            <section>
              <h3 className={filterTitle}>Size</h3>
              <div className="seg w-full" role="group" aria-label="Size">
                {['S', 'M', 'L', 'XL'].map(s => <button key={s} onClick={() => setParam('size', size === s ? '' : s)} aria-pressed={size === s} className="seg-item flex-1 px-0">
                    {s}
                  </button>)}
              </div>
            </section>
          </div>
        </aside>

        {/* Product grid */}
        <main className="flex-grow min-w-0">
          {error ? <div role="alert" className="card card-pad text-center"><p className="text-error text-sm">{error}</p><button onClick={()=>fetchProducts()} className="btn-primary btn-sm mt-4">Try again</button></div> : loading ? <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {[...Array(12)].map((_, i) => <div key={i} className="product-card">
                  <div className="aspect-square bg-surface-variant animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-2.5 w-14 bg-outline-variant animate-pulse rounded-full" />
                    <div className="h-3.5 w-full bg-outline-variant animate-pulse rounded" />
                    <div className="h-3.5 w-1/2 bg-outline-variant animate-pulse rounded" />
                  </div>
                </div>)}
            </div> : products.length === 0 ? <div className="card px-6 py-12 text-center flex flex-col items-center">
              <span className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant mb-3"><IconSearchOff size={22} stroke={1.6} /></span>
              <h2 className="section-title">No products found</h2>
              <p className="text-sm text-on-surface-variant max-w-[340px] mt-1 mb-5">Try removing a filter or searching for something else.</p>
              <button onClick={clearFilters} className="btn-primary btn-sm">Clear all filters</button>
            </div> : <>
              <motion.div initial="hidden" animate="show" variants={{
                show: { transition: { staggerChildren: 0.03 } }
              }} className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {products.map(product => <ProductCard key={product.id} product={product} />)}
              </motion.div>

              {/* Pagination */}
              {pagination.totalPages > 1 && <nav className="flex justify-center items-center mt-8 gap-1" aria-label="Pagination">
                  <button disabled={page <= 1} onClick={() => setParam('page', page - 1)} className="btn-ghost btn-sm" aria-label="Previous page">
                    <IconChevronLeft size={15} /> Prev
                  </button>
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const p = i + 1;
                    if (p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1) {
                      return <button key={p} onClick={() => setParam('page', p)} aria-current={p === page ? 'page' : undefined} className={`w-8 h-8 rounded-md text-[13px] font-semibold tabular transition-colors ${p === page ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-variant'}`}>
                          {p}
                        </button>;
                    }
                    if (Math.abs(p - page) === 2) return <span key={p} className="px-1 text-on-surface-variant">…</span>;
                    return null;
                  })}
                  <button disabled={page >= pagination.totalPages} onClick={() => setParam('page', page + 1)} className="btn-ghost btn-sm" aria-label="Next page">
                    Next <IconChevronRight size={15} />
                  </button>
                </nav>}
            </>}
        </main>
      </div>
    </PageTransition>
  );
}