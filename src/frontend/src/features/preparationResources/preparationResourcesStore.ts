import { localStorageStore } from '../../utils/localStorageStore';

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface PreparationResources {
  books: ResourceItem[];
  testSeries: ResourceItem[];
}

const STORAGE_KEY = 'preparationResources';

const DEFAULT_RESOURCES: PreparationResources = {
  books: [
    {
      id: '1',
      title: 'RBSE Books',
      description: 'Rajasthan Board textbooks and study materials',
      url: 'https://education.rajasthan.gov.in/content/raj/education/en/home.html',
    },
    {
      id: '2',
      title: 'NCERT Books',
      description: 'National Council textbooks for all classes',
      url: 'https://ncert.nic.in/textbook.php',
    },
    {
      id: '3',
      title: 'Hindi Granth Academy',
      description: 'Hindi literature and reference books',
      url: 'https://www.hindigranthaacademy.org/',
    },
  ],
  testSeries: [
    {
      id: '1',
      title: 'Testbook',
      description: 'Mock tests for all government exams',
      url: 'https://testbook.com',
    },
    {
      id: '2',
      title: 'Adda247',
      description: 'Practice tests and quizzes',
      url: 'https://www.adda247.com',
    },
    {
      id: '3',
      title: 'GradeUp',
      description: 'Free and paid mock test series',
      url: 'https://gradeup.co',
    },
  ],
};

export function getPreparationResources(): PreparationResources {
  // Check if key exists in localStorage
  if (typeof window !== 'undefined') {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing === null) {
      // First time - seed with defaults
      localStorageStore.set(STORAGE_KEY, DEFAULT_RESOURCES);
      return DEFAULT_RESOURCES;
    }
  }
  return localStorageStore.get(STORAGE_KEY, DEFAULT_RESOURCES);
}

export function savePreparationResources(resources: PreparationResources): void {
  localStorageStore.set(STORAGE_KEY, resources);
}

// Books CRUD
export function addBook(item: Omit<ResourceItem, 'id'>): void {
  const resources = getPreparationResources();
  const newItem: ResourceItem = {
    ...item,
    id: Date.now().toString(),
  };
  savePreparationResources({
    ...resources,
    books: [...resources.books, newItem],
  });
}

export function updateBook(id: string, updates: Partial<ResourceItem>): void {
  const resources = getPreparationResources();
  const updatedBooks = resources.books.map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
  savePreparationResources({
    ...resources,
    books: updatedBooks,
  });
}

export function deleteBook(id: string): void {
  const resources = getPreparationResources();
  savePreparationResources({
    ...resources,
    books: resources.books.filter((item) => item.id !== id),
  });
}

// Test Series CRUD
export function addTestSeries(item: Omit<ResourceItem, 'id'>): void {
  const resources = getPreparationResources();
  const newItem: ResourceItem = {
    ...item,
    id: Date.now().toString(),
  };
  savePreparationResources({
    ...resources,
    testSeries: [...resources.testSeries, newItem],
  });
}

export function updateTestSeries(id: string, updates: Partial<ResourceItem>): void {
  const resources = getPreparationResources();
  const updatedTestSeries = resources.testSeries.map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
  savePreparationResources({
    ...resources,
    testSeries: updatedTestSeries,
  });
}

export function deleteTestSeries(id: string): void {
  const resources = getPreparationResources();
  savePreparationResources({
    ...resources,
    testSeries: resources.testSeries.filter((item) => item.id !== id),
  });
}
