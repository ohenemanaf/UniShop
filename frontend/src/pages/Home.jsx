import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconSparkles, IconShoppingBag, IconSchool, IconMessageCircle } from '@tabler/icons-react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import {portfolioDemo} from '../utils/demo';
import {useStoreSettings} from '../context/StoreSettingsContext';

const collections = [
  { title: 'Make room for you.', subtitle: 'Little upgrades for your everyday space.', image_url: '/images/cozy_corner.png', link_url: '/products?category=home-living' },
  { title: 'Ready for the semester.', subtitle: 'Find your focus. Bring your best.', image_url: '/images/study_focus.png', link_url: '/products?category=electronics' },
  { title: 'A fresh start.', subtitle: 'Campus essentials, all in one place.', image_url: '/images/freshman_bundle.png', link_url: '/products' },
];
export default function Home() {
  const {settings} = useStoreSettings();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [edits, setEdits] = useState([]);
  const [banner, setBanner] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      api.get('/products', { params: { limit: 8, sort: 'popular' } }),
      api.get('/categories'), api.get('/storefront/edits'), api.get('/storefront/banners'),
    ]).then(([p, c, e, b]) => {
      if (cancelled) return;
      if (p.status === 'fulfilled') setProducts(p.value.data.products || []);
      else setFailed(true);
      if (c.status === 'fulfilled') setCategories(c.value.data || []);
      if (e.status === 'fulfilled') setEdits(e.value.data.edits || []);
      if (b.status === 'fulfilled') setBanner((b.value.data.banners || []).find(item => item.position === 'hero') || null);
      setLoading(false);
    });
    try {
      const ids = JSON.parse(localStorage.getItem('UniShop_recent') || '[]');
      if (Array.isArray(ids) && ids.length >= 2) Promise.allSettled(ids.slice(0, 4).map(id => api.get('/products/' + id))).then(results => {
        if (!cancelled) setRecent(results.filter(r => r.status === 'fulfilled').map(r => r.value.data));
      });
    } catch { /* Browsing history is optional. */ }
    return () => { cancelled = true; };
  }, []);
  // Banner titles may contain legacy formatting; render the text safely.
  const title = banner?.title?.replace(/<[^>]*>/g, '').trim() || settings.hero_title;
  return <PageTransition className="gap-12 md:gap-16">
    {settings.announcement && <div className="max-w-7xl mx-auto w-full px-4 md:px-8"><p className="bg-secondary-container text-on-secondary-container rounded-xl px-5 py-3 text-center text-sm">{settings.announcement}</p></div>}
    <SEO title="Your campus. Your marketplace." description="Shop tech, style, and everyday university essentials at UniShop." />
    {portfolioDemo && <div className="max-w-7xl mx-auto w-full px-4 md:px-8"><div className="flex flex-wrap justify-between gap-2 text-xs text-on-surface-variant"><span>Portfolio demo · Sample data · No real charges</span><Link className="font-semibold text-primary" to="/demo">Explore all three roles →</Link></div></div>}
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8">
      <div className="shop-hero">
        <div className="shop-hero-copy">
          <span className="shop-eyebrow"><IconSparkles size={16} /> The campus edit</span>
          <h1>{title}</h1>
          <p>{banner?.subtitle || settings.hero_subtitle}</p>
          <div className="flex flex-wrap items-center gap-5 mt-8">
            <Link to={banner?.link_url || '/products'} className="btn-primary inline-flex items-center gap-3">Explore the shop <IconArrowRight size={18} /></Link>
            <Link to="/products?category=electronics" className="text-sm font-semibold text-primary hover:underline">Discover tech</Link>
          </div>
          <div className="mt-8 pt-5 border-t border-primary/15 text-xs text-on-surface-variant">Tech. Style. Your everyday essentials.</div>
        </div>
        <img className="shop-hero-image" src={banner?.image_url || '/images/hero_bg.png'} alt="" fetchPriority="high" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 py-6 border-b border-outline-variant">
        {[{Icon: IconSchool, title: 'Made for campus life', text: 'Essentials for your daily routine.'}, {Icon: IconShoppingBag, title: 'One place, more possibilities', text: 'Explore tech, fashion, and home.'}, {Icon: IconMessageCircle, title: 'A little help, whenever', text: 'Questions? Talk to our support team.'}].map(({Icon, title, text}) => <div key={title} className="flex gap-3 items-center"><span className="p-2.5 rounded-xl bg-primary-container text-primary"><Icon size={21} /></span><div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-on-surface-variant mt-1">{text}</p></div></div>)}
      </div>
    </section>
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex items-end justify-between gap-4 mb-5"><div><p className="shop-eyebrow mb-2">Find your next favourite</p><h2 className="shop-heading">Shop by category</h2></div></div>
      <div className="flex flex-wrap gap-2.5">
        <Link to="/products" className="bg-primary text-white px-5 py-3 rounded-full text-sm font-semibold">All products</Link>
        {(categories.length ? categories : [{id:'electronics',slug:'electronics',name:'Tech & electronics'},{id:'fashion',slug:'fashion',name:'Fashion'},{id:'home',slug:'home-living',name:'Home & dorm'}]).map(cat => <Link key={cat.id} to={'/products?category=' + encodeURIComponent(cat.slug)} className="bg-surface border border-outline-variant hover:border-primary hover:text-primary px-5 py-3 rounded-full text-sm font-medium transition-colors">{cat.name}</Link>)}
      </div>
    </section>
    {settings.show_trending && <section className="w-full max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex justify-between items-end gap-4 mb-6"><div><p className="shop-eyebrow mb-2">Worth a closer look</p><h2 className="shop-heading">Trending on campus</h2></div><Link to="/products" className="text-sm font-semibold text-primary flex items-center gap-2 shrink-0">Shop all <IconArrowRight size={16} /></Link></div>
      {loading ? <div aria-label="Loading products" role="status" className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">{Array.from({length:4}, (_, i) => <div key={i} className="aspect-[3/4] rounded-2xl bg-surface-variant animate-pulse" />)}</div> : products.length ? <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">{products.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-2xl border border-outline-variant bg-surface p-8 text-center"><p className="font-semibold">{failed ? 'We could not load products right now.' : 'New finds are on their way.'}</p><Link to="/products" className="inline-block mt-3 text-primary text-sm underline">Browse the shop</Link></div>}
    </section>}
    {settings.show_collections && <section className="w-full max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-6"><p className="shop-eyebrow mb-2">A little inspiration</p><h2 className="shop-heading">For every side of campus life</h2></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{(edits.length ? edits.slice(0,3) : collections).map((item,i) => <Link to={item.link_url || '/products'} className="shop-collection group" key={item.id || i}><img src={item.image_url} alt="" loading="lazy" /><div className="shop-collection-copy"><h3 className="text-2xl font-bold tracking-tight">{item.title}</h3><p className="text-sm text-white/90 mt-2">{item.subtitle}</p><span className="mt-5 flex items-center gap-2 text-sm font-semibold">Explore collection <IconArrowRight size={17} /></span></div></Link>)}</div>
    </section>}
    {recent.length >= 2 && <section className="w-full max-w-7xl mx-auto px-4 md:px-8"><h2 className="shop-heading mb-6">Another look?</h2><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">{recent.map(product => <ProductCard key={product.id} product={product} />)}</div></section>}
  </PageTransition>;
}
