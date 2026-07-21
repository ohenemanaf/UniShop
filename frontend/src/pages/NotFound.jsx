/**
 * File: NotFound.jsx
 * Description: Auto-generated documentation for NotFound.jsx
 * Date: 2026-07-21
 */
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconSearch } from '@tabler/icons-react';
import SEO from '../components/SEO';
export default /**
 * Function NotFound
 * @returns {any}
 */
function NotFound() {
  return <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden p-4 md:p-8">
      <SEO title="Page Not Found | UniShop" />
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
      
      <div className="relative z-10 max-w-[512px] w-full text-center">
        <h1 className="text-[8rem] md:text-[12rem] font-black leading-none tracking-tighter text-primary">
          404
        </h1>
        <h2 className="text-3xl font-bold text-primary mb-4">Page Not Found</h2>
        <p className="text-lg text-on-surface-variant font-medium mb-10">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95">
            <IconArrowLeft size={20} stroke={1.5} /> Back to Home
          </Link>
          <Link to="/products" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-surface border border-outline/50 text-primary font-semibold px-8 py-4 rounded-full hover:bg-surface-variant transition-colors active:scale-95">
            <IconSearch size={20} stroke={1.5} /> Browse Products
          </Link>
        </div>
      </div>
    </div>;
}