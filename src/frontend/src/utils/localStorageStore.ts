type Listener = () => void;

class LocalStorageStore {
  // Key-scoped listeners for targeted notifications
  private keyListeners: Map<string, Set<Listener>> = new Map();
  
  // Snapshot cache to ensure stable references
  private snapshotCache: Map<string, { raw: string; parsed: any }> = new Map();

  constructor() {
    // Listen to storage events from other tabs/windows
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && this.isTrackedKey(e.key)) {
          // Clear cache for changed key
          this.snapshotCache.delete(e.key);
          // Notify only subscribers of this specific key
          this.notifyKeyListeners(e.key);
        }
      });
    }
  }

  private isTrackedKey(key: string): boolean {
    return (
      key === 'officialLinks' ||
      key === 'studyCorner' ||
      key === 'simpleJobs' ||
      key === 'clientAdminAuth' ||
      key === 'homeCards'
    );
  }

  // Key-scoped subscription
  subscribe(key: string, listener: Listener): () => void {
    if (!this.keyListeners.has(key)) {
      this.keyListeners.set(key, new Set());
    }
    this.keyListeners.get(key)!.add(listener);
    
    return () => {
      const listeners = this.keyListeners.get(key);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.keyListeners.delete(key);
        }
      }
    };
  }

  private notifyKeyListeners(key: string): void {
    const listeners = this.keyListeners.get(key);
    if (listeners) {
      listeners.forEach((listener) => listener());
    }
  }

  // Stable snapshot getter with caching
  getSnapshot<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const raw = window.localStorage.getItem(key);
      const rawValue = raw ?? JSON.stringify(defaultValue);
      
      // Check cache
      const cached = this.snapshotCache.get(key);
      if (cached && cached.raw === rawValue) {
        // Return cached parsed value (stable reference)
        return cached.parsed;
      }
      
      // Parse and cache
      const parsed = raw ? JSON.parse(raw) : defaultValue;
      this.snapshotCache.set(key, { raw: rawValue, parsed });
      return parsed;
    } catch {
      return defaultValue;
    }
  }

  // Legacy get method (for non-reactive reads)
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      const newRaw = JSON.stringify(value);
      const oldRaw = window.localStorage.getItem(key);
      
      // Only update if value actually changed
      if (newRaw !== oldRaw) {
        window.localStorage.setItem(key, newRaw);
        // Clear cache for this key
        this.snapshotCache.delete(key);
        // Notify only subscribers of this specific key
        this.notifyKeyListeners(key);
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
}

export const localStorageStore = new LocalStorageStore();
