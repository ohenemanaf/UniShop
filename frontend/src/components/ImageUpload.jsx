/**
 * File: ImageUpload.jsx
 * Description: Auto-generated documentation for ImageUpload.jsx
 * Date: 2026-07-21
 */
import React, { useState, useRef } from 'react';
import { IconUpload, IconLoader2 } from '@tabler/icons-react';
import api from '../api';
export default /**
 * Function ImageUpload
 * @param {any} props
 * @returns {any}
 */
function ImageUpload({
  value,
  onChange,
  placeholder
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  /**
 * Arrow Function handleFileChange
 * @param {any} e
 * @returns {any}
 */
  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.url) {
        onChange(res.data.url);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  return <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2">
        <input type="text" className="flex-1 bg-surface border border-outline/50 p-4 rounded-xl outline-none font-semibold text-primary focus:border-primary transition-colors shadow-sm" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder || 'https://...'} />
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading} className="bg-primary/10 text-primary px-4 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/20 transition-colors disabled:opacity-50">
          {loading ? <IconLoader2 className="animate-spin" size={20} /> : <IconUpload size={20} />}
          Upload
        </button>
      </div>
      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      {error && <p className="text-error text-xs font-bold">{error}</p>}
    </div>;
}