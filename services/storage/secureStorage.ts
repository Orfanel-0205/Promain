/**
 * services/storage/secureStorage.ts
 *
 * Single source of truth for reading / writing the persisted session.
 * Every screen that needs the current user imports from here — never
 * calls SecureStore directly for 'token' or 'user'.
 */
import * as SecureStore from 'expo-secure-store';

// ─── Keys ──────────────────────────────────────────────────────────────────
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const BIOMETRIC_KEY = 'biometric_enabled';

// ─── Profile shape (mirrors RegisterInput + server fields) ─────────────────
export interface StoredProfile {
  id?: string;                 // server-assigned
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  barangay: string;
  birthdate: string;
  sex: string;
  isSeniorOrPwd: boolean;
  [key: string]: unknown;     // any extra fields the backend adds
}

// ─── Token ─────────────────────────────────────────────────────────────────
export const saveToken = (token: string) =>
  SecureStore.setItemAsync(TOKEN_KEY, token);

export const getToken = (): Promise<string | null> =>
  SecureStore.getItemAsync(TOKEN_KEY);

export const removeToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);

// ─── Profile ───────────────────────────────────────────────────────────────
export const saveProfile = (profile: StoredProfile) =>
  SecureStore.setItemAsync(USER_KEY, JSON.stringify(profile));

export const getProfile = async (): Promise<StoredProfile | null> => {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? (JSON.parse(raw) as StoredProfile) : null;
};

export const removeProfile = () => SecureStore.deleteItemAsync(USER_KEY);

// ─── Biometric flag ────────────────────────────────────────────────────────
export const setBiometricEnabled = (enabled: boolean) =>
  SecureStore.setItemAsync(BIOMETRIC_KEY, String(enabled));

export const isBiometricEnabled = async (): Promise<boolean> => {
  const val = await SecureStore.getItemAsync(BIOMETRIC_KEY);
  return val === 'true';
};

// ─── Convenience: clear everything (logout) ───────────────────────────────
export const clearSession = async () => {
  await removeToken();
  await removeProfile();
  // intentionally keep biometric_enabled — it's a device-level preference
};