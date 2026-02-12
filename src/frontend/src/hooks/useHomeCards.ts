import { useSyncExternalStore, useCallback } from 'react';
import { localStorageStore } from '../utils/localStorageStore';
import {
  getHomeCards,
  addHomeCard,
  updateHomeCard,
  deleteHomeCard,
  type HomeCardItem,
} from '../features/homeCards/homeCardsStore';

const STORAGE_KEY = 'homeCards';

export function useHomeCards() {
  const items = useSyncExternalStore(
    (callback) => localStorageStore.subscribe(STORAGE_KEY, callback),
    () => localStorageStore.getSnapshot(STORAGE_KEY, getHomeCards()),
    () => getHomeCards()
  );

  const add = useCallback((item: Omit<HomeCardItem, 'id'>) => {
    addHomeCard(item);
  }, []);

  const update = useCallback((id: string, updates: Partial<HomeCardItem>) => {
    updateHomeCard(id, updates);
  }, []);

  const remove = useCallback((id: string) => {
    deleteHomeCard(id);
  }, []);

  return {
    items,
    add,
    update,
    remove,
  };
}
