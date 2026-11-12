/**
 * File: ProductDetail.jsx
 * Description: Auto-generated documentation for ProductDetail.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import {useToast} from '../context/ToastContext';
import { useLoginRedirect } from '../hooks/useLoginRedirect';
import GHS from '../utils/currency';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard, { StarRating } from '../components/ProductCard';
import SEO from '../components/SEO';
import { IconArrowBackUp, IconHeart, IconHeartFilled, IconStarFilled, IconChevronRight, IconArrowRight, IconCheck, IconShoppingBag, IconTruckDelivery, IconShieldCheck } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
export default /**
 * Function ProductDetail
 * @returns {any}
 */
function ProductDetail() {
  const {showToast}=useToast();
  const goToLogin = useLoginRedirect();
  const [adding,setAdding]=useState(false);
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    addToCart
  } = useCart();
  const {
    isAuthenticated
  } = useAuth();
  const [product, setProduct] = useState(null);
  const [selectedSku, setSelectedSku] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [review, setReview] = useState({
    rating: 5,
    title: '',
    body: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [upvotedReviews, setUpvotedReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [crossSells, setCrossSells] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({
    x: 0,
    y: 0
  });
  const [isZooming, setIsZooming] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  /**
 * Arrow Function handleMouseMove
 * @param {any} e
 * @returns {any}
 */
  const handleMouseMove = e => {
    const {
      left,
      top,
      width,
      height
    } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;
    setZoomPos({
      x,
      y
    });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data);
      if (res.data.cross_sells) {
        setCrossSells(res.data.cross_sells);
      }
      try {
        const recent = JSON.parse(localStorage.getItem('UniShop_recent') || '[]');
        const updatedRecent = [id, ...recent.filter(item => item !== id)].slice(0, 5);
        localStorage.setItem('UniShop_recent', JSON.stringify(updatedRecent));
      } catch (e) {
        console.error("Failed to parse recent items", e);
      }
      if (res.data.variants?.length > 0) {
        setSelectedSku(res.data.variants[0].sku);
      }
      if (res.data.category_slug) {
        api.get(`/products?category=${res.data.category_slug}&limit=5`).then(relRes => setRelated(relRes.data.products.filter(p => p.id !== id).slice(0, 4))).catch(console.error);
      }
      if (res.data.seller_id) {
        api.get(`/products?seller_id=${res.data.seller_id}&limit=5`).then(sRes => setSellerProducts(sRes.data.products.filter(p => p.id !== id).slice(0, 4))).catch(console.error);
      }
      if (isAuthenticated) {
        api.get('/wishlist').then(wRes => {
          if (wRes.data.some(w => w.product_id === id)) setIsWishlisted(true);
        }).catch(console.error);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      navigate('/');
    });
  }, [id, isAuthenticated, navigate]);
  const selectedVariant = product?.variants?.find(v => v.sku === selectedSku);
  const availableStock = selectedVariant ? Math.max(0,Number(selectedVariant.stock || 0)-Number(selectedVariant.reserved || 0)) : 0;
  useEffect(()=>setQuantity(1),[selectedSku]);
  /**
 * Arrow Function handleAddToCart
 * @returns {any}
 */
  const handleAddToCart = async () => {
    if (!selectedSku) return;
    if(adding || quantity > availableStock || quantity < 1) return;
    setAdding(true);
    try {
      await addToCart(selectedSku, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setAdded(false);
      showToast(err.response?.data?.error || 'Could not add item to cart.', 'error');
    } finally {setAdding(false);}
  };
  /**
 * Arrow Function handleToggleWishlist
 * @returns {any}
 */
  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      goToLogin();
      return;
    }
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${id}`);
        setIsWishlisted(false);
      } else {
        await api.post('/wishlist', {
          product_id: id
        });
        setIsWishlisted(true);
      }
    } catch {
      showToast('Could not update your wishlist. Check your connection and try again.', 'error');
    }
  };
  /**
 * Arrow Function handleReviewSubmit
 * @param {any} e
 * @returns {any}
 */
  const handleReviewSubmit = async e => {
    e.preventDefault();
    if (!isAuthenticated) {
      goToLogin();
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/reviews`, {
        product_id: id,
        ...review
      });
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      setReview({
        rating: 5,
        title: '',
        body: ''
      });
    } catch (err) {
      showToast(err.response?.data?.error || 'Your review could not be posted. Please try again.', 'error');
    } finally {
      setSubmittingReview(false);
      setReviewModalOpen(false);
    }
  };
  /**
 * Arrow Function handleUpvote
 * @param {any} reviewId
 * @returns {any}
 */
  const handleUpvote = reviewId => {
    if (!isAuthenticated) return goToLogin();
    if (upvotedReviews.includes(reviewId)) return;
    setUpvotedReviews(prev => [...prev, reviewId]);
  };
  if (loading) {
    return <div className="page pt-10 animate-pulse grid md:grid-cols-2 gap-6 lg:gap-10" role="status" aria-label="Loading product">
        <div className="aspect-square max-h-[520px] bg-surface-variant rounded-xl"></div>
        <div className="space-y-3 pt-2">
          <div className="h-3 bg-surface-variant rounded w-20"></div>
          <div className="h-7 bg-surface-variant rounded w-3/4"></div>
          <div className="h-6 bg-surface-variant rounded w-28"></div>
          <div className="h-40 bg-surface-variant rounded-xl w-full mt-6"></div>
        </div>
      </div>;
  }
  if (!product) return null;
  const parsedGallery = (() => {
    if (!product?.gallery_images) return [];
    if (typeof product.gallery_images === 'string') {
      try {
        return JSON.parse(product.gallery_images);
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(product.gallery_images) ? product.gallery_images : [];
  })();
  const galleryImages = [selectedVariant?.image_url || product?.image_url || 'https://placehold.co/800x800/FAFAFA/333333.png?text=Product', ...parsedGallery];
  const discount = selectedVariant?.compare_price && selectedVariant.compare_price > selectedVariant.price ? Math.round((selectedVariant.compare_price - selectedVariant.price) / selectedVariant.compare_price * 100) : null;
  const stockPill = availableStock <= 0 ? <span className="pill-danger">Sold out</span> : availableStock <= 5 ? <span className="pill-warning">Only {availableStock} left</span> : <span className="pill-success">In stock</span>;
  const stepBtn = 'w-9 h-full flex items-center justify-center text-on-surface-variant hover:text-on-surface disabled:opacity-40 text-lg';
  return (
    <PageTransition className="w-full pb-24 md:pb-16">
      <SEO title={`${product.name} | UniShop`} description={product.description || `Buy ${product.name} at UniShop.`} image={product.image_url} />

      <div className="page pt-4">
        {/* Breadcrumb replaces the floating back button */}
        <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-4 min-w-0" aria-label="Breadcrumb">
          <Link to="/products" className="hover:text-primary shrink-0">Shop</Link>
          <IconChevronRight size={12} className="shrink-0" aria-hidden="true" />
          {product.category_slug ? <Link to={`/products?category=${product.category_slug}`} className="hover:text-primary shrink-0">{product.category_name}</Link> : <span className="shrink-0">{product.category_name || 'Category'}</span>}
          <IconChevronRight size={12} className="shrink-0" aria-hidden="true" />
          <span className="text-on-surface truncate" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-6 lg:gap-10">
          {/* Gallery */}
          <div className="md:col-span-6 lg:col-span-6">
            <div className="relative aspect-square max-h-[520px] w-full overflow-hidden rounded-xl border border-outline-variant bg-surface cursor-zoom-in" onClick={() => setLightboxOpen(true)} onMouseEnter={() => setIsZooming(true)} onMouseLeave={() => setIsZooming(false)} onMouseMove={handleMouseMove}>
              <img src={galleryImages[currentImageIndex]} alt={product.name} className={`w-full h-full object-cover transition-opacity duration-300 ${isZooming ? 'md:opacity-0' : 'opacity-100'}`} />
              {isZooming && <div className="absolute inset-0 z-10 pointer-events-none hidden md:block" style={{
                backgroundImage: `url(${galleryImages[currentImageIndex]})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '200%'
              }} />}
              {discount && <span className="pill-accent absolute top-3 left-3 z-20">−{discount}%</span>}
            </div>
            {galleryImages.length > 1 && <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
                {galleryImages.map((img, idx) => <button key={idx} onClick={() => setCurrentImageIndex(idx)} aria-label={`Show image ${idx + 1}`} aria-pressed={currentImageIndex === idx} className={`w-16 h-16 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity ${currentImageIndex === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>)}
              </div>}
          </div>

          {/* Details */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col md:sticky md:top-20 h-max">
            <span className="eyebrow">{product.category_name || 'Category'}</span>
            <h1 className="mt-1 text-[22px] md:text-[26px] leading-tight font-extrabold tracking-tight text-on-surface">{product.name}</h1>

            <button onClick={() => { setActiveTab('reviews'); document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-2 flex items-center gap-1.5 text-[13px] text-on-surface-variant hover:text-primary w-max">
              <IconStarFilled size={14} className="text-secondary" aria-hidden="true" />
              <span className="font-semibold text-on-surface">{Number(product.avg_rating || 0).toFixed(1)}</span>
              <span>· {product.review_count || 0} review{product.review_count === 1 ? '' : 's'}</span>
            </button>

            <div className="mt-4 flex items-center gap-2.5 flex-wrap tabular">
              <span className="text-[26px] leading-none font-extrabold text-on-surface">{GHS(selectedVariant?.price || 0)}</span>
              {selectedVariant?.compare_price && selectedVariant.compare_price > selectedVariant.price && <span className="text-sm text-on-surface-variant line-through"><span className="sr-only">Was </span>{GHS(selectedVariant.compare_price)}</span>}
              {stockPill}
            </div>

            {/* Options */}
            {product.variants?.length > 1 && <div className="mt-5">
                <p className="field-label">Option</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Choose an option">
                  {product.variants.map(v => {
                    const outOfStock = v.stock - v.reserved <= 0;
                    const selected = selectedSku === v.sku;
                    return <button key={v.sku} disabled={outOfStock} onClick={() => setSelectedSku(v.sku)} aria-pressed={selected} className={`h-9 px-3 rounded-lg border text-[13px] font-semibold transition-colors ${selected ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline bg-surface text-on-surface hover:border-on-surface-variant'} ${outOfStock ? 'opacity-40 cursor-not-allowed line-through' : ''}`}>
                        {v.name || v.sku}
                      </button>;
                  })}
                </div>
              </div>}

            {/* Buy row (desktop; phones use the sticky bar below) */}
            <div className="hidden md:flex items-center gap-2 mt-5">
              <div className="flex items-center h-10 rounded-lg border border-outline bg-surface" role="group" aria-label="Quantity">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className={stepBtn} aria-label="Decrease quantity">−</button>
                <span className="w-8 text-center text-sm font-semibold tabular" aria-live="polite">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(availableStock, quantity + 1))} disabled={quantity >= availableStock} className={stepBtn} aria-label="Increase quantity">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={availableStock <= 0 || added || adding} className={`flex-1 ${added ? 'btn-secondary' : 'btn-primary'}`}>
                {adding ? 'Adding…' : added ? <><IconCheck size={16} /> Added to cart</> : availableStock <= 0 ? 'Sold out' : <><IconShoppingBag size={16} /> Add to cart · {GHS(parseFloat(selectedVariant?.price || 0) * quantity)}</>}
              </button>
              <button onClick={handleToggleWishlist} aria-pressed={isWishlisted} aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'} className={`btn-outline w-10 px-0 ${isWishlisted ? 'text-secondary' : ''}`}>
                {isWishlisted ? <IconHeartFilled size={17} /> : <IconHeart size={17} stroke={1.8} />}
              </button>
            </div>

            {/* Seller + delivery facts as one grouped list (ClassFlow style) */}
            <div className="list-group mt-5">
              {product.seller_name && <button onClick={() => navigate(`/store/${product.seller_id}`)} className="list-row w-full text-left">
                  <span className="w-8 h-8 rounded-full overflow-hidden bg-primary-container text-on-primary-container flex items-center justify-center text-[13px] font-bold shrink-0">
                    {product.seller_avatar ? <img src={product.seller_avatar} alt="" className="w-full h-full object-cover" /> : product.seller_name.charAt(0)}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs text-on-surface-variant">Sold by</span>
                    <span className="block font-semibold truncate">{product.seller_name}</span>
                  </span>
                  <span className="text-[13px] font-semibold text-primary">Visit store</span>
                  <IconChevronRight size={15} className="text-on-surface-variant" aria-hidden="true" />
                </button>}
              <div className="list-row"><IconTruckDelivery size={18} stroke={1.7} className="text-primary shrink-0" aria-hidden="true" /><span className="flex-1">Free delivery on campus</span></div>
              <div className="list-row"><IconArrowBackUp size={18} stroke={1.7} className="text-primary shrink-0" aria-hidden="true" /><span className="flex-1">Returns within 30 days</span></div>
              <div className="list-row"><IconShieldCheck size={18} stroke={1.7} className="text-primary shrink-0" aria-hidden="true" /><span className="flex-1">Secure checkout with Mobile Money or card</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Description / reviews */}
      <div className="page mt-10 md:mt-14" id="product-tabs">
        <div className="seg mb-5" role="tablist" aria-label="Product information">
          {['description', 'reviews'].map(tab => <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className="seg-item">
              {tab === 'description' ? 'Description' : `Reviews (${product.review_count || 0})`}
            </button>)}
        </div>

        <div>
          {activeTab === 'description' && <div className="max-w-[720px] text-sm leading-relaxed text-on-surface-variant" role="tabpanel">
              <p>{product.description || 'No detailed description available for this product.'}</p>
            </div>}

          {activeTab === 'reviews' && <div className="max-w-[960px] grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10" role="tabpanel">
              {/* Review Summary */}
              <div className="md:col-span-4 h-max card card-pad">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[32px] font-extrabold text-on-surface leading-none tabular">{parseFloat(product.avg_rating || 0).toFixed(1)}</span>
                  <div className="flex flex-col">
                    <StarRating rating={product.avg_rating || 0} />
                    <span className="text-xs text-on-surface-variant mt-1">{product.review_count || 0} reviews</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                const dist = product.rating_distribution?.find(d => d.rating === star);
                const count = dist ? dist.count : 0;
                const percent = product.review_count > 0 ? count / product.review_count * 100 : 0;
                return <div key={star} className="flex items-center gap-3">
                        <span className="text-xs font-semibold w-7 flex items-center justify-end text-on-surface-variant tabular">{star} <IconStarFilled size={10} className="ml-0.5 text-secondary" /></span>
                        <div className="flex-1 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{
                      width: `${percent}%`
                    }}></div>
                        </div>
                        <span className="text-xs text-on-surface-variant w-6 tabular">{count}</span>
                      </div>;
              })}
                </div>
              </div>

              {/* Review List & Form */}
              <div className="md:col-span-8 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="section-title">Customer reviews</h3>
                  {isAuthenticated ? <button onClick={() => setReviewModalOpen(true)} className="btn-primary btn-sm">
                      Write a review
                    </button> : <button onClick={goToLogin} className="btn-outline btn-sm">
                      Log in to review
                    </button>}
                </div>

                <div className="list-group">
                  {product.reviews?.length === 0 ? <p className="px-4 py-6 text-sm text-on-surface-variant text-center">No reviews yet. Be the first to share what you think.</p> : product.reviews?.map(r => <div key={r.id} className="px-4 py-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[13px]">
                              {r.reviewer_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold text-on-surface flex items-center gap-2">
                                {r.reviewer_name}
                                {r.is_verified && <span className="pill-success h-5">Verified buyer</span>}
                              </p>
                              <StarRating rating={r.rating} />
                            </div>
                          </div>
                          <span className="text-xs text-on-surface-variant">{new Date(r.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        {r.title && <p className="text-sm font-semibold text-on-surface mb-0.5">{r.title}</p>}
                        {r.body && <p className="text-sm text-on-surface-variant mb-2 leading-relaxed">{r.body}</p>}

                        <div className="flex justify-end">
                          <button onClick={() => handleUpvote(r.id)} aria-pressed={upvotedReviews.includes(r.id)} className={`flex items-center gap-1 text-xs font-semibold h-7 px-2.5 rounded-full border transition-all active:scale-95
                              ${upvotedReviews.includes(r.id) ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface-variant/30 border-outline/30 text-on-surface-variant hover:bg-surface-variant'}
                            `}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={upvotedReviews.includes(r.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"></path></svg>
                            Helpful {upvotedReviews.includes(r.id) ? '(1)' : ''}
                          </button>
                        </div>
                      </div>)}
                </div>
              </div>
            </div>}
        </div>
      </div>

      {/* More from this seller */}
      {sellerProducts.length > 0 && <section className="page mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">More from {product.seller_name}</h2>
            <button onClick={() => navigate(`/store/${product.seller_id}`)} className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1">
              View all <IconArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {sellerProducts.map(prod => <ProductCard key={prod.id} product={prod} />)}
          </div>
        </section>}

      {/* Cross Sells / Related */}
      {(crossSells.length > 0 || related.length > 0) && <section className="page mt-12">
          <h2 className="section-title mb-4">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {(crossSells.length > 0 ? crossSells : related).map(prod => <ProductCard key={prod.id} product={prod} />)}
          </div>
        </section>}

      {/* Mobile Sticky Buy Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-surface/95 backdrop-blur-xl border-t border-outline-variant px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center gap-2">
          <div className="flex items-center h-10 rounded-lg border border-outline bg-surface" role="group" aria-label="Quantity">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className={stepBtn} aria-label="Decrease quantity">−</button>
            <span className="w-7 text-center text-sm font-semibold tabular" aria-live="polite">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(availableStock, quantity + 1))} disabled={quantity >= availableStock} className={stepBtn} aria-label="Increase quantity">+</button>
          </div>
          <button onClick={handleAddToCart} disabled={availableStock <= 0 || added || adding} className={`flex-1 ${added ? 'btn-secondary' : 'btn-primary'}`}>
            {adding ? 'Adding…' : added ? 'Added ✓' : availableStock <= 0 ? 'Sold out' : `Add to cart · ${GHS(parseFloat(selectedVariant?.price || 0) * quantity)}`}
          </button>
          <button onClick={handleToggleWishlist} aria-pressed={isWishlisted} aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'} className={`btn-outline w-10 px-0 ${isWishlisted ? 'text-secondary' : ''}`}>
            {isWishlisted ? <IconHeartFilled size={17} /> : <IconHeart size={17} stroke={1.8} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-6 cursor-zoom-out backdrop-blur-sm" onClick={() => setLightboxOpen(false)}>
            <motion.img initial={{
          scale: 0.9,
          y: 20
        }} animate={{
          scale: 1,
          y: 0
        }} exit={{
          scale: 0.9,
          y: 20
        }} transition={{
          type: "spring",
          damping: 25,
          stiffness: 300
        }} src={galleryImages[currentImageIndex]} alt={product.name} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full" onClick={() => setLightboxOpen(false)}>
              ✕
            </button>
          </motion.div>}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModalOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReviewModalOpen(false)} />
            <motion.div initial={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} transition={{
          type: "spring",
          damping: 25,
          stiffness: 300
        }} className="relative w-full max-w-[460px] card p-5 shadow-level-3 z-10" role="dialog" aria-modal="true" aria-labelledby="review-title">
              <h2 id="review-title" className="section-title mb-4">Write a review</h2>
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs text-on-surface-variant mb-2">Tap to rate</span>
                  <div className="flex gap-2" onMouseLeave={() => setHoverStar(0)}>
                    {[1, 2, 3, 4, 5].map(n => <motion.button key={n} type="button" whileHover={{
                  scale: 1.2
                }} whileTap={{
                  scale: 0.9
                }} onMouseEnter={() => setHoverStar(n)} onClick={() => setReview({
                  ...review,
                  rating: n
                })} className={`transition-colors ${n <= (hoverStar || review.rating) ? 'text-[#FFD100]' : 'text-surface-variant'}`}>
                        <IconStarFilled size={30} />
                      </motion.button>)}
                  </div>
                </div>

                <div>
                  <label htmlFor="review-title-input" className="field-label">Title <span className="font-normal text-on-surface-variant">(optional)</span></label>
                  <input id="review-title-input" className="field" placeholder="Summarize your experience" value={review.title} onChange={e => setReview({
                ...review,
                title: e.target.value
              })} />
                </div>

                <div>
                  <label htmlFor="review-body-input" className="field-label">Review</label>
                  <textarea id="review-body-input" className="field resize-none" placeholder="What did you like or dislike?" rows={4} value={review.body} onChange={e => setReview({
                ...review,
                body: e.target.value
              })} required />
                </div>

                <div className="flex justify-end gap-2 mt-1">
                  <button type="button" onClick={() => setReviewModalOpen(false)} className="btn-outline">
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingReview} className="btn-primary">
                    {submittingReview ? 'Posting…' : 'Post review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>}
      </AnimatePresence>

    </PageTransition>
  );
}