/**
 * File: Home.jsx
 * Description: Auto-generated documentation for Home.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { IconSparkles, IconArrowRight } from '@tabler/icons-react';
import { GHS0 } from '../utils/currency';
import PageTransition from '../components/PageTransition';
export default /**
 * Function Home
 * @returns {any}
 */
function Home() {
  const {
    scrollY
  } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [edits, setEdits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Promise.all([api.get('/products', {
      params: {
        limit: 8,
        sort: 'popular'
      }
    }), api.get('/storefront/banners'), api.get('/storefront/edits'), api.get('/categories')]).then(([productsRes, bannersRes, editsRes, categoriesRes]) => {
      setProducts(productsRes.data.products);
      setBanners(bannersRes.data.banners || []);
      setEdits(editsRes.data.edits || []);
      setCategories(categoriesRes.data || []);
    }).catch(console.error).finally(() => setLoading(false));

    // Load recently viewed from localStorage
    try {
      const recent = JSON.parse(localStorage.getItem('UniShop_recent') || '[]');
      if (recent.length >= 2) {
        Promise.all(recent.slice(0, 5).map(id => api.get(`/products/${id}`))).then(results => {
          setRecentProducts(results.map(r => r.data));
        }).catch(() => {});
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const heroBanners = banners.filter(b => b.position === 'hero');
  const activeBanners = heroBanners.length > 0 ? heroBanners : [{
    id: 'fallback',
    title: 'Elevate Your\n<span class="text-secondary">Space</span>',
    subtitle: 'Curated essentials for a space that feels like you, designed for effortless living and learning.',
    image_url: '/images/hero_bg.png',
    link_url: '/products'
  }];
  const currentBanner = activeBanners[currentBannerIndex];
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);
  const [largeEditIndex, setLargeEditIndex] = useState(0);
  const [smallEditIndex, setSmallEditIndex] = useState(0);
  useEffect(() => {
    const largeCount = edits.filter(e => e.size === 'LARGE').length;
    const smallCount = edits.filter(e => e.size === 'SMALL').length;
    if (largeCount <= 1 && smallCount <= 2) return;
    const interval = setInterval(() => {
      if (largeCount > 1) {
        setLargeEditIndex(prev => (prev + 1) % largeCount);
      }
      if (smallCount > 2) {
        setSmallEditIndex(prev => (prev + 1) % smallCount);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [edits]);
  const largeEdits = edits.filter(e => e.size === 'LARGE');
  const displayLargeEdit = largeEdits.length > 0 ? [largeEdits[largeEditIndex]] : [];
  const smallEdits = edits.filter(e => e.size === 'SMALL');
  const displaySmallEdits = smallEdits.length > 2 ? [smallEdits[smallEditIndex], smallEdits[(smallEditIndex + 1) % smallEdits.length]] : smallEdits.slice(0, 2);
  return (
    <PageTransition>
      <SEO title="Premium Tech & Style" description="Discover premium electronics, fashion, and university essentials." />

      {/* Hero Section */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
        <div className="relative w-full h-[480px] md:h-[600px] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-surface flex items-center shadow-level-1 border border-outline/30 group">
          <AnimatePresence mode="wait">
            <motion.div key={currentBanner.id} initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.8
          }} className="absolute inset-0 z-0">
              {/* Full-bleed background image */}
              <motion.div className="absolute inset-0 z-0 bg-cover bg-center" style={{
              y,
              backgroundImage: `url('${currentBanner.image_url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right'
            }} />
              {/* Left-to-right gradient for text legibility only */}
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-background via-background/70 to-transparent"></div>

              <div className="absolute inset-0 z-10 ml-6 md:ml-16 lg:ml-24 p-4 md:p-8 max-w-[90%] md:max-w-[500px] flex flex-col justify-center">
                <motion.div initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: 0.2,
                duration: 0.5
              }} className="inline-flex items-center gap-2 bg-secondary/10 text-secondary font-medium text-sm px-4 py-1.5 rounded-full mb-6 border border-secondary/20 shadow-sm backdrop-blur-sm w-fit">
                  <IconSparkles size={16} stroke={1.5} /> Featured Collection
                </motion.div>
                <motion.h1 initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.3,
                duration: 0.6
              }} className="text-5xl md:text-[4rem] lg:text-[4.5rem] font-black text-primary mb-4 leading-[1.05] tracking-tight" dangerouslySetInnerHTML={{
                __html: currentBanner.title || 'Elevate Your<br/><span class="text-secondary">Space</span>'
              }} />
                <motion.p initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.4,
                duration: 0.6
              }} className="text-base md:text-lg text-on-surface-variant mt-6 mb-8 leading-relaxed max-w-[400px]">
                  {currentBanner.subtitle || 'Discover premium products curated just for you.'}
                </motion.p>
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.5,
                duration: 0.6
              }}>
                  <Link to={currentBanner.link_url || '/products'} className="inline-flex items-center gap-2 justify-center bg-primary text-white font-semibold text-base px-8 py-4 rounded-full shadow-level-2 hover:shadow-level-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group">
                    Shop Now
                    <IconArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {activeBanners.length > 1 && <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
              {activeBanners.map((b, idx) => <button key={b.id || idx} onClick={() => setCurrentBannerIndex(idx)} className={`h-2 rounded-full transition-all duration-500 ${idx === currentBannerIndex ? 'w-8 bg-primary' : 'w-2 bg-primary/30 hover:bg-primary/50'}`} aria-label={`Go to slide ${idx + 1}`} />)}
            </div>}
        </div>
      </section>

      {/* Category Chips */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 hide-scrollbar mask-edges">
          <Link to="/products" className="whitespace-nowrap px-6 py-2.5 rounded-full font-medium text-sm bg-primary text-white shadow-sm hover:shadow-md transition-all active:scale-95">All Products</Link>
          {categories.map(cat => <Link key={cat.id} to={`/products?category=${cat.slug}`} className="whitespace-nowrap px-6 py-2.5 rounded-full font-medium text-sm bg-surface text-on-surface hover:bg-surface-variant transition-all border border-outline/50 active:scale-95">{cat.name}</Link>)}
        </div>
      </section>

      {/* Curated Bundles Bento Grid */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-primary">Curated <span className="text-secondary">Edits</span></h2>
          <Link to="/products" className="font-bold text-sm text-secondary hover:underline flex items-center gap-1 group pb-2">
            View all <IconArrowRight size={16} className="group-hover:translate-x-1 transition-transform" stroke={2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Large featured bundle */}
          {displayLargeEdit.map(edit => <Link key={edit.id} to={edit.link_url} className="lg:col-span-2 group relative h-[400px] md:h-[500px] bg-surface rounded-[2rem] overflow-hidden shadow-sm hover:shadow-level-2 transition-all duration-500 block min-w-0">
              <img src={edit.image_url} alt={edit.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-10">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="inline-flex items-center gap-2 bg-secondary text-white text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest shadow-md"><IconSparkles size={14} /> Most Popular</div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">{edit.title}</h3>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <p className="text-base text-white/90 max-w-[400px] font-medium leading-relaxed">{edit.subtitle}</p>
                    <span className="text-4xl md:text-5xl font-black text-white shrink-0 tracking-tighter drop-shadow-lg">{GHS0(edit.price)}</span>
                  </div>
                </div>
              </div>
            </Link>)}

          <div className="flex flex-col gap-4 md:gap-6">
            {/* Smaller bundles */}
            {displaySmallEdits.map(edit => <Link key={edit.id} to={edit.link_url} className="group relative h-[200px] md:h-[238px] bg-surface rounded-[2rem] overflow-hidden shadow-sm hover:shadow-level-2 transition-all duration-500 block min-w-0">
                <img src={edit.image_url} alt={edit.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-full p-5 md:p-6 z-10">
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-2xl flex flex-col justify-between h-full transition-transform duration-500 group-hover:-translate-y-1">
                    <h3 className="text-xl font-bold text-white mb-1">{edit.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-medium text-white/80">{edit.item_count}</span>
                      <span className="text-2xl text-white font-black tracking-tight">{GHS0(edit.price)}</span>
                    </div>
                  </div>
                </div>
              </Link>)}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 mb-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Trending Now</h2>
          <Link to="/products" className="font-semibold text-sm text-secondary hover:underline flex items-center gap-1 group">
            View all <IconArrowRight size={16} className="group-hover:translate-x-1 transition-transform" stroke={1.5} />
          </Link>
        </div>

        {loading ? <div className="flex overflow-x-auto gap-4 md:gap-6 lg:gap-8 pb-8 hide-scrollbar mask-edges">
            {[...Array(4)].map((_, i) => <div key={i} className="w-[70vw] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-24px)] shrink-0 aspect-[3/4] bg-surface-variant/50 animate-pulse rounded-[2rem]" />)}
          </div> : <motion.div initial="hidden" animate="show" variants={{
              show: { transition: { staggerChildren: 0.05 } }
            }} className="flex overflow-x-auto gap-4 md:gap-6 lg:gap-8 pb-8 hide-scrollbar mask-edges snap-x snap-mandatory">
            {products.map(product => <div key={product.id} className="w-[70vw] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-24px)] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>)}
          </motion.div>}
      </section>

      {/* Recently Viewed */}
      {recentProducts.length >= 2 && <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 mb-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Recently <span className="text-secondary">Viewed</span></h2>
            <Link to="/products" className="font-semibold text-sm text-secondary hover:underline flex items-center gap-1 group">
              Browse all <IconArrowRight size={16} className="group-hover:translate-x-1 transition-transform" stroke={1.5} />
            </Link>
          </div>
          <motion.div initial="hidden" animate="show" variants={{
              show: { transition: { staggerChildren: 0.05 } }
            }} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {recentProducts.slice(0, 5).map(product => <ProductCard key={product.id} product={product} />)}
          </motion.div>
        </section>}

    </PageTransition>
  );
}