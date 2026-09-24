// Respons�vel: Enzo
import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || 'https://hatingz.onrender.com';
const apiUrl = configuredApiUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL: apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ratingz-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
