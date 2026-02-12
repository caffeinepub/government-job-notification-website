export interface LinkStatus {
  isAvailable: boolean;
  label: string;
}

export function getLinkStatus(url: string | undefined | null): LinkStatus {
  if (!url || url.trim() === '') {
    return {
      isAvailable: false,
      label: 'Link Activate Soon',
    };
  }
  
  return {
    isAvailable: true,
    label: 'Available',
  };
}
