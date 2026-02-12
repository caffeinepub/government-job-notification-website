import { localStorageStore } from '../../utils/localStorageStore';

export interface OfficialLink {
  id: string;
  label: string;
  url: string;
  isHighlighted?: boolean;
}

const STORAGE_KEY = 'officialLinks';

const DEFAULT_LINKS: OfficialLink[] = [
  {
    id: '1',
    label: 'SSO Login',
    url: 'https://sso.rajasthan.gov.in/',
    isHighlighted: true,
  },
  {
    id: '2',
    label: 'RPSC Official',
    url: 'https://rpsc.rajasthan.gov.in/',
  },
  {
    id: '3',
    label: 'RSMSSB',
    url: 'https://rsmssb.rajasthan.gov.in/',
  },
  {
    id: '4',
    label: 'SSC',
    url: 'https://ssc.nic.in/',
  },
  {
    id: '5',
    label: 'UPSC',
    url: 'https://www.upsc.gov.in/',
  },
];

export function getOfficialLinks(): OfficialLink[] {
  // Check if key exists in localStorage
  if (typeof window !== 'undefined') {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing === null) {
      // First time - seed with defaults
      localStorageStore.set(STORAGE_KEY, DEFAULT_LINKS);
      return DEFAULT_LINKS;
    }
  }
  return localStorageStore.get(STORAGE_KEY, DEFAULT_LINKS);
}

export function saveOfficialLinks(links: OfficialLink[]): void {
  localStorageStore.set(STORAGE_KEY, links);
}

export function addOfficialLink(link: Omit<OfficialLink, 'id'>): void {
  const links = getOfficialLinks();
  const newLink: OfficialLink = {
    ...link,
    id: Date.now().toString(),
  };
  saveOfficialLinks([...links, newLink]);
}

export function updateOfficialLink(id: string, updates: Partial<OfficialLink>): void {
  const links = getOfficialLinks();
  const updatedLinks = links.map((link) =>
    link.id === id ? { ...link, ...updates } : link
  );
  saveOfficialLinks(updatedLinks);
}

export function deleteOfficialLink(id: string): void {
  const links = getOfficialLinks();
  saveOfficialLinks(links.filter((link) => link.id !== id));
}

export function reorderOfficialLinks(startIndex: number, endIndex: number): void {
  const links = getOfficialLinks();
  const result = Array.from(links);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  saveOfficialLinks(result);
}
