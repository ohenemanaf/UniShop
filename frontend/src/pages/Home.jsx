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
  const sectionHead = (eyebrow, heading, link) => <div className="flex items-end justify-between gap-4 mb-4">
      <div><p className="eyebrow mb-1">{eyebrow}</p><h2 className="section-title">{heading}</h2></div>
      {link && <Link to={link} className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">Shop all <IconArrowRight size={14} /></Link>}
    </div>;
  return <PageTransition className="gap-8 md:gap-12 pb-4">
    <SEO title="Your campus. Your marketplace." description="Shop tech, style, and everyday university essentials at UniShop." />
    {(settings.announcement || portfolioDemo) && <div className="page flex flex-col gap-2 pt-1">
        {settings.announcement && <p className="pill-accent h-auto py-2 px-4 rounded-lg justify-center text-center text-[13px] font-medium">{settings.announcement}</p>}
        {portfolioDemo && <div className="flex flex-wrap justify-between gap-2 text-xs text-on-surface-variant"><span>Portfolio demo · Sample data · No real charges</span><Link className="font-semibold text-primary hover:underline" to="/demo">Explore all three roles →</Link></div>}
      </div>}

    <section className="page">
      <div className="shop-hero">
        <div className="shop-hero-copy">
          <span className="shop-eyebrow"><IconSparkles size={14} /> The campus edit</span>
          <h1>{title}</h1>
          <p>{banner?.subtitle || settings.hero_subtitle}</p>
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <Link to={banner?.link_url || '/products'} className="btn-primary">Explore the shop <IconArrowRight size={16} /></Link>
            <Link to="/products?category=electronics" className="btn-ghost">Discover tech</Link>
          </div>
        </div>
        <img className="shop-hero-image" src={banner?.image_url || '/images/hero_bg.png'} alt="" fetchPriority="high" />
      </div>

      {/* Value props as one grouped strip */}
      <div className="card mt-3 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-outline-variant">
        {[{Icon: IconSchool, title: 'Made for campus life', text: 'Essentials for your daily routine.'}, {Icon: IconShoppingBag, title: 'One place, more possibilities', text: 'Tech, fashion and home.'}, {Icon: IconMessageCircle, title: 'Help whenever you need it', text: 'Talk to our support team.'}].map(({Icon, title, text}) => <div key={title} className="flex gap-3 items-center px-4 py-3">
            <span className="w-8 h-8 rounded-lg bg-primary-container text-primary flex items-center justify-center shrink-0"><Icon size={17} /></span>
            <div className="min-w-0"><p className="text-[13px] font-semibold">{title}</p><p className="text-xs text-on-surface-variant">{text}</p></div>
          </div>)}
      </div>
    </section>

    <section className="page">
      {sectionHead('Find your next favourite', 'Shop by category')}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        <Link to="/products" className="h-8 px-3.5 inline-flex items-center rounded-full bg-primary text-white text-[13px] font-semibold shrink-0">All products</Link>
        {(categories.length ? categories : [{id:'electronics',slug:'electronics',name:'Tech & electronics'},{id:'fashion',slug:'fashion',name:'Fashion'},{id:'home',slug:'home-living',name:'Home & dorm'}]).map(cat => <Link key={cat.id} to={'/products?category=' + encodeURIComponent(cat.slug)} className="h-8 px-3.5 inline-flex items-center rounded-full bg-surface border border-outline-variant text-[13px] font-medium text-on-surface hover:border-primary hover:text-primary transition-colors shrink-0">{cat.name}</Link>)}
      </div>
    </section>

    {settings.show_trending && <section className="page">
      {sectionHead('Worth a closer look', 'Trending on campus', '/products')}
      {loading ? <div aria-label="Loading products" role="status" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">{Array.from({length:4}, (_, i) => <div key={i} className="product-card"><div className="aspect-square bg-surface-variant animate-pulse" /><div className="p-3 space-y-2"><div className="h-3 w-3/4 bg-outline-variant rounded animate-pulse" /><div className="h-3 w-1/3 bg-outline-variant rounded animate-pulse" /></div></div>)}</div> : products.length ? <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">{products.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="card card-pad text-center"><p className="text-sm font-semibold">{failed ? 'We could not load products right now.' : 'New finds are on their way.'}</p><Link to="/products" className="inline-block mt-2 text-primary text-[13px] font-semibold hover:underline">Browse the shop</Link></div>}
    </section>}

    {settings.show_collections && <section className="page">
      {sectionHead('A little inspiration', 'For every side of campus life')}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">{(edits.length ? edits.slice(0,3) : collections).map((item,i) => <Link to={item.link_url || '/products'} className="shop-collection group" key={item.id || i}><img src={item.image_url} alt="" loading="lazy" /><div className="shop-collection-copy"><h3 className="text-base font-bold tracking-tight">{item.title}</h3><p className="text-[13px] text-white/85 mt-0.5 line-clamp-2">{item.subtitle}</p><span className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold">Explore <IconArrowRight size={14} /></span></div></Link>)}</div>
    </section>}

    {recent.length >= 2 && <section className="page">
      {sectionHead('Recently viewed', 'Another look?')}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">{recent.map(product => <ProductCard key={product.id} product={product} />)}</div>
    </section>}
  </PageTransition>;
}
