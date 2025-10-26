/**
 * Safe localStorage wrapper for Safari compatibility
 * 
 * Safari (especially in private browsing or with ITP) can:
 * - Block localStorage access
 * - Throw QuotaExceededError
 * - Return null silently
 * 
 * This wrapper ensures the app doesn't crash or hang
 */

const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export const safeLocalStorage = {
  getItem: (key, defaultValue = null) => {
    try {
      if (!isStorageAvailable()) {
        console.warn('[SafeStorage] localStorage not available, using fallback');
        return defaultValue;
      }
      const item = localStorage.getItem(key);
      return item !== null ? item : defaultValue;
    } catch (error) {
      console.warn(`[SafeStorage] Failed to get ${key}:`, error.message);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      if (!isStorageAvailable()) {
        console.warn('[SafeStorage] localStorage not available, cannot save');
        return false;
      }
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`[SafeStorage] Failed to set ${key}:`, error.message);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      if (!isStorageAvailable()) {
        return false;
      }
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[SafeStorage] Failed to remove ${key}:`, error.message);
      return false;
    }
  },

  clear: () => {
    try {
      if (!isStorageAvailable()) {
        return false;
      }
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('[SafeStorage] Failed to clear:', error.message);
      return false;
    }
  }
};

export default safeLocalStorage;
