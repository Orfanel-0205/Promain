import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Base URLs
 */
const DEFAULT_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000/api"
    : "http://localhost:8000/api";

/**
 * ENV override (Expo)
 */
const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;

/**
 * Normalize URLs depending on platform
 */
const normalizeBaseUrl = (url: string) => {
  if (Platform.OS === "android") {
    return url.replace(
      /https?:\/\/(localhost|127\.0\.0\.1)/,
      "http://10.0.2.2",
    );
  }

  if (Platform.OS === "ios") {
    return url.replace(
      /https?:\/\/(10\.0\.2\.2|127\.0\.0\.1)/,
      "http://localhost",
    );
  }

  return url;
};

const getAlternateBaseUrl = (url: string) => {
  if (Platform.OS === "android") {
    if (/localhost|127\.0\.0\.1/.test(url)) {
      return url.replace(
        /https?:\/\/(localhost|127\.0\.0\.1)/,
        "http://10.0.2.2",
      );
    }
  }

  if (Platform.OS === "ios") {
    if (/localhost/.test(url)) {
      return url.replace("localhost", "127.0.0.1");
    }
  }

  return null;
};

const BASE_URL = normalizeBaseUrl(rawBaseUrl);
const ALTERNATE_BASE_URL = getAlternateBaseUrl(BASE_URL);

/**
 * Axios instance
 */
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request interceptor (attach token)
 */
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

/**
 * Response interceptor (handle auth + retry)
 */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const config = err.config as any;

    if (err.response?.status === 401) {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
    }

    const isNetworkError =
      err.message === "Network Error" ||
      err.code === "ERR_NETWORK" ||
      err.message?.includes("Network Error");

    if (isNetworkError && config && !config._retry) {
      const alternate = getAlternateBaseUrl(config.baseURL || BASE_URL);

      if (alternate && alternate !== config.baseURL) {
        config._retry = true;
        config.baseURL = alternate;
        return api(config);
      }
    }

    return Promise.reject(err);
  },
);
