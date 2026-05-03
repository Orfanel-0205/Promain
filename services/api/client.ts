// services/api/client.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const DEFAULT_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000/api"
    : "http://localhost:8000/api";

// Set the mobile app API URL via EXPO_PUBLIC_API_URL or use local Laravel default for development.
// For iOS simulator, localhost points to your Windows host machine.
// For Android emulator, use 10.0.2.2.
// For a physical device (Android or iOS), set EXPO_PUBLIC_API_URL to your Windows machine IP address,
// e.g. http://192.168.1.100:8000/api.
const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;

const normalizeBaseUrl = (url: string) => {
  if (Platform.OS === "android") {
    return url.replace(
      /https?:\/\/(localhost|127\.0\.0\.1)/,
      "http://10.0.2.2",
    );
  }
  if (Platform.OS === "ios") {
    // On iOS Simulator, use localhost to reach host machine (not 127.0.0.1)
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
    // Fallback for iOS: try 127.0.0.1 if localhost fails (unlikely to help but worth trying)
    if (/localhost/.test(url)) {
      return url.replace("localhost", "127.0.0.1");
    }
  }

    return Promise.reject(err);
  }
);
};

const BASE_URL = normalizeBaseUrl(rawBaseUrl);
const ALTERNATE_BASE_URL = getAlternateBaseUrl(BASE_URL);

console.log("[api] Platform", Platform.OS);
console.log("[api] rawBaseUrl", rawBaseUrl);
console.log("[api] BASE_URL", BASE_URL);
console.log("[api] ALTERNATE_BASE_URL", ALTERNATE_BASE_URL);

if (Platform.OS === "ios" && /10\.0\.2\.2/.test(BASE_URL)) {
  console.error(
    "[api] ERROR: iOS cannot reach 10.0.2.2. Restart Expo and ensure .env has localhost or your machine IP.",
  );
}

if (Platform.OS === "ios" && /localhost/.test(BASE_URL)) {
  console.log("[api] iOS using localhost to reach host machine.");
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err),
);

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
        console.log("[api] retrying with alternate URL", alternate);
        return api(config);
      }
    }

    return Promise.reject(err);
  },
);
