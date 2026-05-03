import axios from "axios";
import * as SecureStore from "expo-secure-store";

function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (/\/api\/v\d+$/i.test(trimmed)) {
    return trimmed;
  }
  if (/\/api$/i.test(trimmed)) {
    return `${trimmed}/v1`;
  }
  return `${trimmed}/api/v1`;
}

const BASE_URL =
  normalizeBaseUrl(
    process.env.EXPO_PUBLIC_API_URL ||
      process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
      "https://ka-agapay-api.vercel.app/api/v1",
  );

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      // Navigation handled by AuthContext
    }
    return Promise.reject(error);
  },
);
