/**
 * File: FAQ.jsx
 * Description: Auto-generated documentation for FAQ.jsx
 * Date: 2026-07-21
 */
import { useState } from 'react';
import SEO from '../components/SEO';
import { IconChevronDown } from '@tabler/icons-react';
const FAQS = [{
  question: 'How do I sell an item on UniShop?',
  answer: 'Simply log in, navigate to the Seller Dashboard, and click on "Add Product". Fill in the details, upload some high-quality images, and your item will be live in minutes!'
}, {
  question: 'Is UniShop restricted to students only?',
  answer: 'Yes, UniShop requires a valid university email address (.edu) to register, ensuring a secure and trusted environment for our community.'
}, {
  question: 'How are payments handled?',
  answer: 'Payments are processed securely via Stripe. As a seller, you will receive payouts directly to your linked bank account after a successful transaction.'
}, {
  question: 'Can I return an item?',
  answer: 'Returns are handled on a case-by-case basis between the buyer and seller. We recommend reviewing the item condition thoroughly before purchasing. If an item is significantly not as described, our support team can step in.'
}];
export default /**
 * Function FAQ
 * @returns {any}
 */
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  return <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8">
      <SEO title="FAQ | UniShop" />
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 tracking-tight">Frequently Asked Questions</h1>
          <p className="text-xl text-on-surface-variant">
            Everything you need to know about the product and how it works.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => <div key={idx} className={`bg-surface border ${openIndex === idx ? 'border-primary shadow-md' : 'border-outline/50 hover:border-primary/50'} rounded-[1.5rem] overflow-hidden transition-all duration-300`}>
              <button className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                <span className="text-lg font-bold text-primary">{faq.question}</span>
                <IconChevronDown size={24} className={`text-on-surface-variant transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-primary' : ''}`} />
              </button>
              <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-on-surface-variant leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>)}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg text-on-surface-variant mb-6">Still have questions?</p>
          <a href="/contact" className="btn-outline inline-block">Contact Support</a>
        </div>
      </div>
    </div>;
}