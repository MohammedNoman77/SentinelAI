// ============================================
// SentinelAI - Axios API Client
// ============================================

import axios from 'axios';

// Configure this per deployment with VITE_API_URL.  Keeping the fallback makes
// local development work out of the box while avoiding a hard-coded production
// host in the bundle.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// إضافة Token تلقائياً لكل طلب
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sentinel_token') || sessionStorage.getItem('sentinel_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// معالجة الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sentinel_token');
      localStorage.removeItem('sentinel_user');
      sessionStorage.removeItem('sentinel_token');
      sessionStorage.removeItem('sentinel_user');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
