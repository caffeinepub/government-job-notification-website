import { useSyncExternalStore, useCallback } from 'react';
import { localStorageStore } from '../utils/localStorageStore';
import {
  getOfficialLinks,
  addOfficialLink,
  updateOfficialLink,
  deleteOfficialLink,
  reorderOfficialLinks,
  type OfficialLink,
} from '../features/officialLinks/officialLinksStore';

const STORAGE_KEY = 'officialLinks';

export function useOfficialLinks() {
  const links = useSyncExternalStore(
    (callback) => localStorageStore.subscribe(STORAGE_KEY, callback),
    () => localStorageStore.getSnapshot(STORAGE_KEY, getOfficialLinks()),
    () => getOfficialLinks()
  );

  const add = useCallback((link: Omit<OfficialLink, 'id'>) => {
    addOfficialLink(link);
  }, []);

  const update = useCallback((id: string, updates: Partial<OfficialLink>) => {
    updateOfficialLink(id, updates);
  }, []);

  const remove = useCallback((id: string) => {
    deleteOfficialLink(id);
  }, []);

  const reorder = useCallback((startIndex: number, endIndex: number) => {
    reorderOfficialLinks(startIndex, endIndex);
  }, []);

  return {
    links,
    add,
    update,
    remove,
    reorder,
  };
}
