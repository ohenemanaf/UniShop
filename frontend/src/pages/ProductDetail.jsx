/**
 * File: ProductDetail.jsx
 * Description: Auto-generated documentation for ProductDetail.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import GHS from '../utils/currency';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard, { StarRating } from '../components/ProductCard';
import SEO from '../components/SEO';
import { IconArrowBackUp, IconHeart, IconHeartFilled, IconStarFilled, IconChevronDown, IconArrowRight } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
export default /**
 * Function ProductDetail
 * @returns {any}
 */
function ProductDetail() {
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
  const [activeAccordion, setActiveAccordion] = useState(null);
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
  const availableStock = selectedVariant ? selectedVariant.stock - selectedVariant.reserved : 0;
  /**
 * Arrow Function handleAddToCart
 * @returns {any}
 */
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedSku) return;
    setAdded(true);
    try {
      await addToCart(selectedSku, quantity);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setAdded(false);
      alert(err.response?.data?.error || 'Failed to add');
    }
  };
  /**
 * Arrow Function handleToggleWishlist
 * @returns {any}
 */
  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
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
      alert('Error updating wishlist');
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
      navigate('/login');
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
      alert(err.response?.data?.error || 'Error submitting review');
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
    if (!isAuthenticated) return navigate('/login');
    if (upvotedReviews.includes(reviewId)) return;
    setUpvotedReviews(prev => [...prev, reviewId]);
  };
  if (loading) {
    return <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-24 animate-pulse flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2 aspect-square bg-surface-variant/50 rounded-[2rem]"></div>
        <div className="w-full md:w-1/2 space-y-6 pt-8">
          <div className="h-12 bg-surface-variant/50 rounded-xl w-3/4"></div>
          <div className="h-6 bg-surface-variant/50 rounded-md w-1/4"></div>
          <div className="h-32 bg-surface-variant/50 rounded-xl w-full mt-8"></div>
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
  return (
    <PageTransition className="w-full pb-32">
      <SEO title={`${product.name} | UniShop`} description={product.description || `Buy ${product.name} at UniShop.`} image={product.image_url} />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-24 flex flex-col md:flex-row gap-12 md:gap-16">

        {/* Left Column: Image gallery & Mobile top controls */}
        <div className="w-full md:w-1/2 relative">
          <div className="absolute top-4 left-4 z-10">
            <button onClick={() => navigate(-1)} className="bg-surface/80 backdrop-blur-md p-3 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 text-on-surface-variant hover:text-primary border border-outline/30">
              <IconArrowBackUp size={24} stroke={1.5} />
            </button>
          </div>
          <div className="absolute top-4 right-4 z-10">
            <button onClick={handleToggleWishlist} className={`bg-surface/80 backdrop-blur-md p-3 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 border border-outline/30 ${isWishlisted ? 'text-secondary' : 'text-on-surface-variant hover:text-primary'}`}>
              {isWishlisted ? <IconHeartFilled size={24} /> : <IconHeart size={24} stroke={1.5} />}
            </button>
          </div>

          <div className="w-full aspect-square overflow-hidden bg-surface-variant/30 border border-outline/30 relative cursor-zoom-in group shadow-sm rounded-[3px]" onClick={() => setLightboxOpen(true)} onMouseEnter={() => setIsZooming(true)} onMouseLeave={() => setIsZooming(false)} onMouseMove={handleMouseMove}>
            <img src={galleryImages[currentImageIndex]} alt={product.name} className={`w-full h-full object-cover transition-opacity duration-300 mix-blend-multiply ${isZooming ? 'opacity-0' : 'opacity-100'}`} />

            {isZooming && <div className="absolute inset-0 z-10 pointer-events-none transition-all duration-75 ease-out hidden md:block" style={{
            backgroundImage: `url(${galleryImages[currentImageIndex]})`,
            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            backgroundSize: '200%'
          }} />}

            {discount && <span className="absolute bottom-6 right-6 bg-primary text-white font-bold px-4 py-2 rounded-full shadow-sm z-20 text-sm tracking-wider uppercase">
                -{discount}% OFF
              </span>}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-6 overflow-x-auto hide-scrollbar pb-2">
            {galleryImages.map((img, idx) => <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-20 h-20 md:w-24 md:h-24 overflow-hidden shrink-0 border-2 transition-all rounded-[3px] ${currentImageIndex === idx ? 'border-primary shadow-md opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover mix-blend-multiply" />
              </button>)}
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="w-full md:w-1/2 flex flex-col md:py-8 md:sticky md:top-24 h-max">
          <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-3">{product.category_name || 'Category'}</span>
          <h1 className="font-headline-xl text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight tracking-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mb-8">
            <StarRating rating={product.avg_rating || 0} count={product.review_count || 0} />
          </div>

          <div className="flex items-end gap-3 mb-10">
            <span className="font-headline-xl text-4xl md:text-5xl font-black text-primary tracking-tight">
              {GHS(selectedVariant?.price || 0)}
            </span>
            {selectedVariant?.compare_price && selectedVariant.compare_price > selectedVariant.price && <span className="text-xl text-on-surface-variant line-through mb-1.5 font-medium">
                {GHS(selectedVariant.compare_price)}
              </span>}
          </div>

          {/* Variant Selector */}
          {product.variants?.length > 1 && <div className="mb-10">
              <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Select Option</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map(v => {
              const outOfStock = v.stock - v.reserved <= 0;
              return <button key={v.sku} disabled={outOfStock} onClick={() => setSelectedSku(v.sku)} className={`
                        px-6 py-3 rounded-[3px] font-bold uppercase tracking-widest text-xs transition-all duration-200 border-2
                        ${selectedSku === v.sku ? 'bg-primary text-white border-primary shadow-sm scale-105' : 'bg-surface text-on-surface border-outline/50 hover:border-outline'}
                        ${outOfStock ? 'opacity-40 cursor-not-allowed line-through' : 'cursor-pointer'}
                      `}>
                      {v.name || v.sku}
                    </button>;
            })}
              </div>
            </div>}

          {/* Sold By Card */}
          {product.seller_name && <div className="mb-10 p-5 rounded-2xl bg-surface-variant/20 border border-outline/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-outline/30 shadow-sm flex items-center justify-center">
                  {product.seller_avatar ? <img src={product.seller_avatar} alt={product.seller_name} className="w-full h-full object-cover" /> : <span className="text-primary font-bold text-xl">{product.seller_name.charAt(0)}</span>}
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Sold By</p>
                  <p className="text-base font-bold text-primary">{product.seller_name}</p>
                </div>
              </div>
              <button onClick={() => navigate(`/store/${product.seller_id}`)} className="px-4 py-2 text-sm font-bold bg-white text-primary rounded-full border border-primary/20 hover:bg-primary/5 transition-colors shadow-sm">
                Visit Store
              </button>
            </div>}

          {/* Action Row */}
          <div className="fixed bottom-0 left-0 right-0 z-[60] bg-surface/95 backdrop-blur-xl border-t border-outline/30 p-4 md:static md:bg-transparent md:border-t-0 md:p-0 md:mt-auto flex items-center gap-4">
            <div className="hidden md:flex items-center bg-surface border border-outline/50 rounded-[3px] h-[60px] px-2 shadow-sm">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-variant text-primary font-medium text-xl transition-colors">−</button>
              <span className="w-10 text-center font-bold text-primary">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(availableStock, quantity + 1))} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-variant text-primary font-medium text-xl transition-colors">+</button>
            </div>
            
            <button onClick={handleAddToCart} disabled={availableStock <= 0 || added} className={`flex-1 h-[60px] rounded-2xl md:rounded-[3px] font-bold uppercase tracking-widest text-sm transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:shadow-sm flex items-center justify-center gap-2 active:scale-95
                ${added ? 'bg-secondary text-white' : 'bg-primary text-white hover:bg-primary-fixed hover:shadow-md'}
                ${availableStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
              `}>
              {added ? 'Added to Cart ✓' : availableStock <= 0 ? 'Out of Stock' : `Add to Cart — ${GHS(parseFloat(selectedVariant?.price || 0) * quantity)}`}
            </button>
          </div>

          {/* Accordions */}
          <div className="mt-8 space-y-4">
            <div className="border-t border-outline/30 pt-4">
              <button onClick={() => setActiveAccordion(activeAccordion === 'specs' ? null : 'specs')} className="w-full flex justify-between items-center text-sm uppercase tracking-widest font-bold text-primary py-3">
                Product Specifications
                <IconChevronDown className={`transition-transform duration-300 ${activeAccordion === 'specs' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === 'specs' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <p className="text-on-surface-variant leading-relaxed">High-quality materials designed for durability. Premium finish and compact size for easy portability.</p>
              </div>
            </div>
            <div className="border-t border-outline/30 pt-4">
              <button onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')} className="w-full flex justify-between items-center text-sm uppercase tracking-widest font-bold text-primary py-3">
                Shipping & Returns
                <IconChevronDown className={`transition-transform duration-300 ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === 'shipping' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <p className="text-on-surface-variant leading-relaxed">Free standard shipping on campus. Express delivery available. Hassle-free returns within 30 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-16 md:mt-24">
        <div className="flex border-b border-outline/30 gap-8 overflow-x-auto hide-scrollbar mb-8">
          {['description', 'reviews'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 font-semibold whitespace-nowrap transition-colors relative text-lg
                ${activeTab === tab ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}
              `}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'reviews' && ` (${product.review_count || 0})`}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>}
            </button>)}
        </div>

        <div className="py-8">
          {activeTab === 'description' && <div className="prose prose-p:text-lg prose-p:text-on-surface-variant max-w-3xl leading-relaxed">
              <p>{product.description || 'No detailed description available for this product.'}</p>
            </div>}

          {activeTab === 'reviews' && <div className="max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-xl">
              {/* Review Summary */}
              <div className="md:col-span-4 h-max">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-5xl font-black text-primary leading-none">{parseFloat(product.avg_rating || 0).toFixed(1)}</span>
                  <div className="flex flex-col">
                    <StarRating rating={product.avg_rating || 0} />
                    <span className="text-sm font-semibold text-on-surface-variant mt-1">{product.review_count || 0} reviews</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                const dist = product.rating_distribution?.find(d => d.rating === star);
                const count = dist ? dist.count : 0;
                const percent = product.review_count > 0 ? count / product.review_count * 100 : 0;
                return <div key={star} className="flex items-center gap-3">
                        <span className="text-sm font-bold w-8 flex items-center justify-end text-on-surface-variant">{star} <IconStarFilled size={12} className="ml-1 text-primary" /></span>
                        <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden border border-outline/10">
                          <div className="h-full bg-primary" style={{
                      width: `${percent}%`
                    }}></div>
                        </div>
                        <span className="text-sm font-bold text-on-surface-variant w-8">{count}</span>
                      </div>;
              })}
                </div>
              </div>

              {/* Review List & Form */}
              <div className="md:col-span-8 flex flex-col gap-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold text-primary">Customer Reviews</h3>
                  {isAuthenticated ? <button onClick={() => setReviewModalOpen(true)} className="bg-primary text-white font-bold uppercase tracking-widest py-3 px-8 rounded-[3px] text-xs active:scale-95 shadow-sm hover:shadow-md transition-all">
                      Write a Review
                    </button> : <button onClick={() => navigate('/login')} className="bg-surface-variant/50 border border-outline/30 text-primary font-bold uppercase tracking-widest py-3 px-8 rounded-[3px] text-xs active:scale-95 transition-all hover:bg-surface-variant">
                      Login to Review
                    </button>}
                </div>

                <div className="space-y-6">
                  {product.reviews?.length === 0 ? <p className="text-on-surface-variant font-medium italic">No reviews yet. Be the first!</p> : product.reviews?.map(r => <div key={r.id} className="pb-6 border-b border-outline/30 last:border-b-0">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                              {r.reviewer_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-primary flex items-center gap-2">
                                {r.reviewer_name}
                                {r.is_verified && <span className="bg-surface-variant/50 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm border border-outline/30">Verified</span>}
                              </p>
                              <StarRating rating={r.rating} />
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                        {r.title && <p className="text-base font-bold text-primary mb-1">{r.title}</p>}
                        {r.body && <p className="text-base text-on-surface-variant mb-4 leading-relaxed">{r.body}</p>}

                        <div className="flex justify-end">
                          <button onClick={() => handleUpvote(r.id)} className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition-all active:scale-95
                              ${upvotedReviews.includes(r.id) ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface-variant/30 border-outline/30 text-on-surface-variant hover:bg-surface-variant'}
                            `}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={upvotedReviews.includes(r.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"></path></svg>
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
      {sellerProducts.length > 0 && <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-16 md:mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-primary">More from {product.seller_name}</h2>
            <button onClick={() => navigate(`/store/${product.seller_id}`)} className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1">
              View all <IconArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {sellerProducts.map(prod => <ProductCard key={prod.id} product={prod} />)}
          </div>
        </div>}

      {/* Cross Sells / Related */}
      {(crossSells.length > 0 || related.length > 0) && <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-24 mb-24">
          <h2 className="text-3xl font-bold tracking-tight text-primary mb-8">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {(crossSells.length > 0 ? crossSells : related).map(prod => <ProductCard key={prod.id} product={prod} />)}
          </div>
        </div>}

      {/* Mobile Sticky Buy Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-outline/30 p-4 z-40 md:hidden pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface border border-outline/50 rounded-[3px] h-12 px-1 shadow-sm">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center rounded-full text-primary font-medium text-xl active:scale-95">−</button>
            <span className="w-6 text-center font-bold text-primary text-sm">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(availableStock, quantity + 1))} className="w-10 h-10 flex items-center justify-center rounded-full text-primary font-medium text-xl active:scale-95">+</button>
          </div>
          <button onClick={handleAddToCart} disabled={availableStock <= 0 || added} className={`flex-1 h-12 rounded-[3px] font-bold uppercase tracking-widest text-xs active:scale-95 flex items-center justify-center shadow-sm transition-all
              ${added ? 'bg-secondary text-white' : 'bg-primary text-white'}
              ${availableStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
            `}>
            {added ? 'Added ✓' : availableStock <= 0 ? 'Out of Stock' : `Add to Cart — ${GHS(parseFloat(selectedVariant?.price || 0) * quantity)}`}
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
      }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8 cursor-zoom-out backdrop-blur-sm" onClick={() => setLightboxOpen(false)}>
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
        }} className="relative w-full max-w-[512px] bg-surface rounded-[3px] p-6 md:p-8 shadow-2xl z-10 border border-outline/30">
              <h2 className="text-2xl font-bold text-primary mb-6">Write a Review</h2>
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col items-center justify-center mb-4">
                  <span className="font-label-md text-secondary mb-3 uppercase tracking-wider">Tap to Rate</span>
                  <div className="flex gap-2" onMouseLeave={() => setHoverStar(0)}>
                    {[1, 2, 3, 4, 5].map(n => <motion.button key={n} type="button" whileHover={{
                  scale: 1.2
                }} whileTap={{
                  scale: 0.9
                }} onMouseEnter={() => setHoverStar(n)} onClick={() => setReview({
                  ...review,
                  rating: n
                })} className={`transition-colors ${n <= (hoverStar || review.rating) ? 'text-[#FFD100]' : 'text-surface-variant'}`}>
                        <IconStarFilled size={48} />
                      </motion.button>)}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Title (Optional)</label>
                  <input className="w-full p-4 rounded-xl border border-transparent bg-surface-variant focus:bg-surface focus:border-outline/50 outline-none transition-colors text-primary font-medium" placeholder="Summarize your experience" value={review.title} onChange={e => setReview({
                ...review,
                title: e.target.value
              })} />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Review</label>
                  <textarea className="w-full p-4 rounded-xl border border-transparent bg-surface-variant focus:bg-surface focus:border-outline/50 outline-none transition-colors text-primary font-medium resize-none" placeholder="What did you like or dislike?" rows={5} value={review.body} onChange={e => setReview({
                ...review,
                body: e.target.value
              })} required />
                </div>

                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setReviewModalOpen(false)} className="flex-1 bg-surface border border-outline/50 text-primary font-bold py-4 rounded-xl active:scale-95 transition-all hover:border-primary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingReview} className="flex-1 bg-primary text-white font-bold py-4 rounded-xl active:scale-95 shadow-sm hover:shadow-level-2 transition-all disabled:opacity-50">
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>}
      </AnimatePresence>

    </PageTransition>
  );
}