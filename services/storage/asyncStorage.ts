import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEYS = {
  PROGRAMS: '@kaagapay/programs',
  ANNOUNCEMENTS: '@kaagapay/announcements',
  APPOINTMENTS: '@kaagapay/appointments',
  CACHE_TIME: '@kaagapay/cacheTime',
} as const;

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const timeKey = `${key}_time`;
    const timeStr = await AsyncStorage.getItem(timeKey);
    if (timeStr && Date.now() - Number(timeStr) > CACHE_TTL_MS) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setCached<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    await AsyncStorage.setItem(`${key}_time`, String(Date.now()));
  } catch {
    // ignore
  }
}

export { CACHE_KEYS };
