import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://erp-backend-0ab5.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    // Log successful responses for debugging
    console.log('[API Response Success]', res.config.url, res.status, res.data);
    return res;
  },
  (error) => {
    // Log error responses for debugging
    console.error('[API Response Error]', error.config?.url, error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
