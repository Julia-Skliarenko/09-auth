import axios from 'axios';

const baseURL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    
    const token = 
      localStorage.getItem('token') || 
      localStorage.getItem('accessToken') || 
      localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});