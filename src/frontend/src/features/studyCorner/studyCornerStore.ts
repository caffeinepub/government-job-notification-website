import { localStorageStore } from '../../utils/localStorageStore';

export interface StudyItem {
  id: string;
  title: string;
  url: string;
  type: 'link' | 'pdf';
}

export interface StudyCategory {
  id: string;
  name: string;
  description: string;
  items: StudyItem[];
}

const STORAGE_KEY = 'studyCorner';

const DEFAULT_CATEGORIES: StudyCategory[] = [
  {
    id: '1',
    name: 'Geography (Bhugol)',
    description: 'Notes and Maps for Rajasthan & India',
    items: [
      {
        id: '1-1',
        title: 'Rajasthan Geography Notes',
        url: '#',
        type: 'link',
      },
      {
        id: '1-2',
        title: 'India Geography Maps',
        url: '#',
        type: 'link',
      },
    ],
  },
  {
    id: '2',
    name: 'General Science',
    description: 'Study material for Lab Assistant and LDC exams',
    items: [
      {
        id: '2-1',
        title: 'Physics Notes',
        url: '#',
        type: 'link',
      },
      {
        id: '2-2',
        title: 'Chemistry Notes',
        url: '#',
        type: 'link',
      },
      {
        id: '2-3',
        title: 'Biology Notes',
        url: '#',
        type: 'link',
      },
    ],
  },
  {
    id: '3',
    name: 'LDC & Lab Assistant Special',
    description: 'Dedicated folder for previous papers and syllabus',
    items: [
      {
        id: '3-1',
        title: 'LDC Previous Year Papers',
        url: '#',
        type: 'pdf',
      },
      {
        id: '3-2',
        title: 'Lab Assistant Syllabus',
        url: '#',
        type: 'pdf',
      },
    ],
  },
];

export function getStudyCategories(): StudyCategory[] {
  return localStorageStore.get(STORAGE_KEY, DEFAULT_CATEGORIES);
}

export function saveStudyCategories(categories: StudyCategory[]): void {
  localStorageStore.set(STORAGE_KEY, categories);
}

export function addStudyCategory(category: Omit<StudyCategory, 'id'>): void {
  const categories = getStudyCategories();
  const newCategory: StudyCategory = {
    ...category,
    id: Date.now().toString(),
  };
  saveStudyCategories([...categories, newCategory]);
}

export function updateStudyCategory(id: string, updates: Partial<StudyCategory>): void {
  const categories = getStudyCategories();
  const updatedCategories = categories.map((cat) =>
    cat.id === id ? { ...cat, ...updates } : cat
  );
  saveStudyCategories(updatedCategories);
}

export function deleteStudyCategory(id: string): void {
  const categories = getStudyCategories();
  saveStudyCategories(categories.filter((cat) => cat.id !== id));
}

export function addStudyItem(categoryId: string, item: Omit<StudyItem, 'id'>): void {
  const categories = getStudyCategories();
  const updatedCategories = categories.map((cat) => {
    if (cat.id === categoryId) {
      const newItem: StudyItem = {
        ...item,
        id: `${categoryId}-${Date.now()}`,
      };
      return { ...cat, items: [...cat.items, newItem] };
    }
    return cat;
  });
  saveStudyCategories(updatedCategories);
}

export function updateStudyItem(
  categoryId: string,
  itemId: string,
  updates: Partial<StudyItem>
): void {
  const categories = getStudyCategories();
  const updatedCategories = categories.map((cat) => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        items: cat.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      };
    }
    return cat;
  });
  saveStudyCategories(updatedCategories);
}

export function deleteStudyItem(categoryId: string, itemId: string): void {
  const categories = getStudyCategories();
  const updatedCategories = categories.map((cat) => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        items: cat.items.filter((item) => item.id !== itemId),
      };
    }
    return cat;
  });
  saveStudyCategories(updatedCategories);
}
