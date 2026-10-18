/**
 * File: AboutUs.jsx
 * Description: Auto-generated documentation for AboutUs.jsx
 * Date: 2026-07-21
 */
import {Link} from 'react-router-dom';
import SEO from '../components/SEO';
import { IconUsers, IconTarget, IconSparkles } from '@tabler/icons-react';
export default /**
 * Function AboutUs
 * @returns {any}
 */
function AboutUs() {
  return <div className="min-h-[75vh] bg-background pt-6 pb-20 px-4 md:px-8">
      <SEO title="About Us | UniShop" />
      <div className="max-w-[1024px] mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 tracking-tight">Meet UniShop</h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
            A portfolio marketplace exploring a simple idea: make campus shopping feel connected, considered, and easy.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Empowering Students</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              We believe that students should have a safe, reliable, and easy-to-use platform to buy, sell, and trade items within their campus. From textbooks to electronics, UniShop connects you with your peers.
            </p>
            <Link to="/demo" className="btn-primary inline-block">Explore the experience</Link>
          </div>
          <div className="rounded-[2rem] overflow-hidden shadow-level-3">
            <img src="/images/cozy_corner.png" alt="Campus Life" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-surface p-8 rounded-[2rem] shadow-sm hover-lift border border-outline/30 text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <IconUsers size={32} stroke={1.5} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Community First</h3>
            <p className="text-on-surface-variant">Designed around student life, with dedicated buyer, seller, and admin experiences.</p>
          </div>
          <div className="bg-surface p-8 rounded-[2rem] shadow-sm hover-lift border border-outline/30 text-center">
            <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <IconTarget size={32} stroke={1.5} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Sustainable</h3>
            <p className="text-on-surface-variant">Extend the lifecycle of products by passing them on to the next generation of students.</p>
          </div>
          <div className="bg-surface p-8 rounded-[2rem] shadow-sm hover-lift border border-outline/30 text-center">
            <div className="w-16 h-16 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <IconSparkles size={32} stroke={1.5} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Premium Experience</h3>
            <p className="text-on-surface-variant">A considered interface with responsive layouts and connected shopping workflows.</p>
          </div>
        </div>
      </div>
    </div>;
}