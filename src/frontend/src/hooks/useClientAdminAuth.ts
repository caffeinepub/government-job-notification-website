import { useSyncExternalStore, useCallback } from 'react';
import { storeSessionParameter, clearSessionParameter } from '../utils/urlParams';

const CORRECT_PASSWORD = '@ni#ra&j*gurja:r';
const ADMIN_TOKEN_KEY = 'caffeineAdminToken';
const LOCAL_STORAGE_KEY = 'isAdmin';

function getIsUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
}

function setIsUnlocked(unlocked: boolean): void {
  if (typeof window === 'undefined') return;
  if (unlocked) {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

// Simple subscription mechanism for localStorage changes
const subscribers = new Set<() => void>();

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function notifySubscribers() {
  subscribers.forEach(callback => callback());
}

// Listen to storage events from other tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      notifySubscribers();
    }
  });
}

export function useClientAdminAuth() {
  const isUnlocked = useSyncExternalStore(
    subscribe,
    getIsUnlocked,
    () => false
  );

  const login = useCallback((password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      setIsUnlocked(true);
      // Persist the admin access secret to sessionStorage
      storeSessionParameter(ADMIN_TOKEN_KEY, password);
      notifySubscribers();
      return true;
    } else {
      alert('Wrong Password!');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsUnlocked(false);
    // Clear the admin secret from sessionStorage
    clearSessionParameter(ADMIN_TOKEN_KEY);
    notifySubscribers();
  }, []);

  return {
    isUnlocked,
    login,
    logout,
  };
}
