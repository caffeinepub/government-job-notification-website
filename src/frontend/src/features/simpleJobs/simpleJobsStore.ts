import { localStorageStore } from '../../utils/localStorageStore';

export interface SimpleJob {
  id: string;
  title: string;
  category: 'Rajasthan' | 'India';
  lastDate: string;
  notificationLink: string;
}

const STORAGE_KEY = 'simpleJobs';

export function getSimpleJobs(): SimpleJob[] {
  return localStorageStore.get(STORAGE_KEY, []);
}

export function saveSimpleJobs(jobs: SimpleJob[]): void {
  localStorageStore.set(STORAGE_KEY, jobs);
}

export function addSimpleJob(job: Omit<SimpleJob, 'id'>): void {
  const jobs = getSimpleJobs();
  const newJob: SimpleJob = {
    ...job,
    id: Date.now().toString(),
  };
  saveSimpleJobs([newJob, ...jobs]);
}

export function deleteSimpleJob(id: string): void {
  const jobs = getSimpleJobs();
  saveSimpleJobs(jobs.filter((job) => job.id !== id));
}
