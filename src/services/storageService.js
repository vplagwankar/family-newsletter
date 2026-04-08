/**
 * storageService.js — localStorage abstraction for non-auth state.
 * (language preference, dismissed banners, etc.)
 */

export const storageService = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore quota / security errors
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  },
}
