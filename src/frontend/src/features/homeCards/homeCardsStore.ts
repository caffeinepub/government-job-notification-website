import { localStorageStore } from '../../utils/localStorageStore';

export interface HomeCardItem {
  id: string;
  title: string;
  lastDate: string;
  category: 'latestJobs' | 'admitCards' | 'results';
}

const STORAGE_KEY = 'homeCards';

const DEFAULT_ITEMS: HomeCardItem[] = [
  // Latest Jobs
  {
    id: '1',
    title: 'Rajasthan Police Constable 2026',
    lastDate: '30 Feb',
    category: 'latestJobs',
  },
  {
    id: '2',
    title: 'REET Mains Level-1',
    lastDate: '30 Feb',
    category: 'latestJobs',
  },
  {
    id: '3',
    title: 'SSC CGL 2026',
    lastDate: '30 Feb',
    category: 'latestJobs',
  },
  {
    id: '4',
    title: 'RPSC 2nd Grade',
    lastDate: '30 Feb',
    category: 'latestJobs',
  },
  {
    id: '5',
    title: 'Indian Army Agniveer',
    lastDate: '30 Feb',
    category: 'latestJobs',
  },
  // Admit Cards
  {
    id: '6',
    title: 'UPSC Prelims Admit Card',
    lastDate: '30 Feb',
    category: 'admitCards',
  },
  {
    id: '7',
    title: 'RSMSSB LDC Hall Ticket',
    lastDate: '30 Feb',
    category: 'admitCards',
  },
  // Results
  {
    id: '8',
    title: 'Rajasthan Board 12th Result',
    lastDate: '30 Feb',
    category: 'results',
  },
  {
    id: '9',
    title: 'SSC GD Final Result',
    lastDate: '30 Feb',
    category: 'results',
  },
];

export function getHomeCards(): HomeCardItem[] {
  // Check if key exists in localStorage
  if (typeof window !== 'undefined') {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing === null) {
      // First time - seed with defaults
      localStorageStore.set(STORAGE_KEY, DEFAULT_ITEMS);
      return DEFAULT_ITEMS;
    }
  }
  return localStorageStore.get(STORAGE_KEY, DEFAULT_ITEMS);
}

export function saveHomeCards(items: HomeCardItem[]): void {
  localStorageStore.set(STORAGE_KEY, items);
}

export function addHomeCard(item: Omit<HomeCardItem, 'id'>): void {
  const items = getHomeCards();
  const newItem: HomeCardItem = {
    ...item,
    id: Date.now().toString(),
  };
  saveHomeCards([...items, newItem]);
}

export function updateHomeCard(id: string, updates: Partial<HomeCardItem>): void {
  const items = getHomeCards();
  const updatedItems = items.map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
  saveHomeCards(updatedItems);
}

export function deleteHomeCard(id: string): void {
  const items = getHomeCards();
  saveHomeCards(items.filter((item) => item.id !== id));
}
