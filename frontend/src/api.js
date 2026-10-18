/**
 * File: api.js
 * Description: Auto-generated documentation for api.js
 * Date: 2026-07-21
 */
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ── Request interceptor: attach JWT token ──────────────────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('UniShop_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// ── Response interceptor: handle 401 globally ─────────────────────────────
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && error.config?.headers?.Authorization && !error.config?.url?.startsWith('/auth/')) {
    localStorage.removeItem('UniShop_token');
    localStorage.removeItem('UniShop_user');
    // Redirect to login
    if (window.location.pathname !== '/login') {
      window.location.href = '/login?expired=true';
    }
  }
  return Promise.reject(error);
});
export default api;