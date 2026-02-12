import { useSyncExternalStore, useCallback } from 'react';
import { localStorageStore } from '../utils/localStorageStore';
import {
  getPreparationResources,
  addBook,
  updateBook,
  deleteBook,
  addTestSeries,
  updateTestSeries,
  deleteTestSeries,
  type ResourceItem,
} from '../features/preparationResources/preparationResourcesStore';

const STORAGE_KEY = 'preparationResources';

export function usePreparationResources() {
  const resources = useSyncExternalStore(
    (callback) => localStorageStore.subscribe(STORAGE_KEY, callback),
    () => localStorageStore.getSnapshot(STORAGE_KEY, getPreparationResources()),
    () => getPreparationResources()
  );

  // Books operations
  const addBookItem = useCallback((item: Omit<ResourceItem, 'id'>) => {
    addBook(item);
  }, []);

  const updateBookItem = useCallback((id: string, updates: Partial<ResourceItem>) => {
    updateBook(id, updates);
  }, []);

  const deleteBookItem = useCallback((id: string) => {
    deleteBook(id);
  }, []);

  // Test Series operations
  const addTestSeriesItem = useCallback((item: Omit<ResourceItem, 'id'>) => {
    addTestSeries(item);
  }, []);

  const updateTestSeriesItem = useCallback((id: string, updates: Partial<ResourceItem>) => {
    updateTestSeries(id, updates);
  }, []);

  const deleteTestSeriesItem = useCallback((id: string) => {
    deleteTestSeries(id);
  }, []);

  return {
    books: resources.books,
    testSeries: resources.testSeries,
    addBook: addBookItem,
    updateBook: updateBookItem,
    deleteBook: deleteBookItem,
    addTestSeries: addTestSeriesItem,
    updateTestSeries: updateTestSeriesItem,
    deleteTestSeries: deleteTestSeriesItem,
  };
}
