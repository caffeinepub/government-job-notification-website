import { useSyncExternalStore, useCallback } from 'react';
import { localStorageStore } from '../utils/localStorageStore';

const AUTH_KEY = 'clientAdminAuth';
const CORRECT_PASSWORD = '@ni#ra&j*gurja:r';

interface AuthState {
  isUnlocked: boolean;
}

const DEFAULT_AUTH_STATE: AuthState = { isUnlocked: false };

function getAuthState(): AuthState {
  return localStorageStore.get(AUTH_KEY, DEFAULT_AUTH_STATE);
}

function setAuthState(state: AuthState): void {
  localStorageStore.set(AUTH_KEY, state);
}

export function useClientAdminAuth() {
  const authState = useSyncExternalStore(
    (callback) => localStorageStore.subscribe(AUTH_KEY, callback),
    () => localStorageStore.getSnapshot(AUTH_KEY, getAuthState()),
    () => getAuthState()
  );

  const login = useCallback((password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      setAuthState({ isUnlocked: true });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuthState({ isUnlocked: false });
  }, []);

  return {
    isUnlocked: authState.isUnlocked,
    login,
    logout,
  };
}
