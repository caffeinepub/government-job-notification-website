import { useSyncExternalStore, useCallback } from 'react';
import { localStorageStore } from '../utils/localStorageStore';
import {
  getSimpleJobs,
  addSimpleJob,
  deleteSimpleJob,
  type SimpleJob,
} from '../features/simpleJobs/simpleJobsStore';

const STORAGE_KEY = 'simpleJobs';

export function useSimpleJobs() {
  const jobs = useSyncExternalStore(
    (callback) => localStorageStore.subscribe(STORAGE_KEY, callback),
    () => localStorageStore.getSnapshot(STORAGE_KEY, getSimpleJobs()),
    () => getSimpleJobs()
  );

  const add = useCallback((job: Omit<SimpleJob, 'id'>) => {
    addSimpleJob(job);
  }, []);

  const remove = useCallback((id: string) => {
    deleteSimpleJob(id);
  }, []);

  return {
    jobs,
    add,
    remove,
  };
}
