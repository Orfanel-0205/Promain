import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://ka-agapay-api.vercel.app/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
      // Navigation handled by AuthContext
    }
    return Promise.reject(error);
  }
);