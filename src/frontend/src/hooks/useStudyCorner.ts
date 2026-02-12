import { useSyncExternalStore, useCallback } from 'react';
import { localStorageStore } from '../utils/localStorageStore';
import {
  getStudyCategories,
  addStudyCategory,
  updateStudyCategory,
  deleteStudyCategory,
  addStudyItem,
  updateStudyItem,
  deleteStudyItem,
  type StudyCategory,
  type StudyItem,
} from '../features/studyCorner/studyCornerStore';

const STORAGE_KEY = 'studyCorner';

export function useStudyCorner() {
  const categories = useSyncExternalStore(
    (callback) => localStorageStore.subscribe(STORAGE_KEY, callback),
    () => localStorageStore.getSnapshot(STORAGE_KEY, getStudyCategories()),
    () => getStudyCategories()
  );

  const addCategory = useCallback((category: Omit<StudyCategory, 'id'>) => {
    addStudyCategory(category);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<StudyCategory>) => {
    updateStudyCategory(id, updates);
  }, []);

  const removeCategory = useCallback((id: string) => {
    deleteStudyCategory(id);
  }, []);

  const addItem = useCallback((categoryId: string, item: Omit<StudyItem, 'id'>) => {
    addStudyItem(categoryId, item);
  }, []);

  const updateItem = useCallback(
    (categoryId: string, itemId: string, updates: Partial<StudyItem>) => {
      updateStudyItem(categoryId, itemId, updates);
    },
    []
  );

  const removeItem = useCallback((categoryId: string, itemId: string) => {
    deleteStudyItem(categoryId, itemId);
  }, []);

  return {
    categories,
    addCategory,
    updateCategory,
    removeCategory,
    addItem,
    updateItem,
    removeItem,
  };
}
