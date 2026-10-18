/**
 * File: ContactUs.jsx
 * Description: Auto-generated documentation for ContactUs.jsx
 * Date: 2026-07-21
 */
import { useState } from 'react';
import {useStoreSettings} from '../context/StoreSettingsContext';
import SEO from '../components/SEO';
import { IconMail, IconPhone, IconMapPin, IconSend } from '@tabler/icons-react';
import api from '../api';
import { useToast } from '../context/ToastContext';
export default /**
 * Function ContactUs
 * @returns {any}
 */
function ContactUs() {
  const {settings}=useStoreSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const {
    showToast
  } = useToast();
  /**
 * Arrow Function handleSubmit
 * @param {any} e
 * @returns {any}
 */
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/crm/contact', formData);
      showToast('Message sent! We will get back to you soon.', 'success');
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to send message.', 'error');
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-[75vh] bg-background pt-6 pb-20 px-4 md:px-8">
      <SEO title="Contact Us | UniShop" />
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 tracking-tight">Get in Touch</h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
            Have a question, feedback, or need support? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-surface rounded-[3rem] p-8 md:p-12 shadow-level-2 border border-outline/30">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-8">Contact Information</h2>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                  <IconMail size={28} stroke={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Email</p>
                  <p className="text-lg font-medium text-primary">{settings.support_email || 'Use the message form'}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-full flex items-center justify-center shrink-0">
                  <IconPhone size={28} stroke={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Demo support</p>
                  <p className="text-lg font-medium text-primary">Messages appear in the admin support inbox.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-tertiary/10 text-tertiary rounded-full flex items-center justify-center shrink-0">
                  <IconMapPin size={28} stroke={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Project scope</p>
                  <p className="text-lg font-medium text-primary">University marketplace · Portfolio demonstration</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-variant/30 p-8 rounded-[2rem] border border-outline/50">
            <h3 className="text-2xl font-bold text-primary mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Your Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} className="w-full bg-surface px-4 py-3 rounded-xl border border-outline focus:border-primary outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Your Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({
                ...formData,
                email: e.target.value
              })} className="w-full bg-surface px-4 py-3 rounded-xl border border-outline focus:border-primary outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Message</label>
                <textarea required rows="4" value={formData.message} onChange={e => setFormData({
                ...formData,
                message: e.target.value
              })} className="w-full bg-surface px-4 py-3 rounded-xl border border-outline focus:border-primary outline-none transition-colors resize-none"></textarea>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                <IconSend size={20} /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>;
}