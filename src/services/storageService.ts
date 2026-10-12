/**
 * Local storage persistence helper service
 */

export const StorageService = {
  getItem<T>(key: string, fallback: T): T {
    try {
      const val = localStorage.getItem(key);
      if (!val) return fallback;
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  },

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage setItem failed:', e);
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Storage removeItem failed:', e);
    }
  },
};
