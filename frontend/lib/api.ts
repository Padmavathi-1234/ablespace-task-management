import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const cleanBaseURL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

export const api = axios.create({
  baseURL: cleanBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Bearer token to every request if available
api.interceptors.request.use((config) => {
  const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  if (token && token !== 'mock-guest-token' && token !== 'mock-demo-token') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear token and redirect to login if token expired or invalid
      Cookies.remove('token');
      localStorage.removeItem('token');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  Cookies.set('token', token, { expires: 7 });
  localStorage.setItem('token', token);
};

export const clearAuthToken = () => {
  Cookies.remove('token');
  localStorage.removeItem('token');
};
