import React, { createContext, useContext, useState } from 'react';

interface JobSearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const JobSearchContext = createContext<JobSearchContextType | undefined>(undefined);

export function JobSearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <JobSearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </JobSearchContext.Provider>
  );
}

export function useJobSearch() {
  const context = useContext(JobSearchContext);
  if (context === undefined) {
    throw new Error('useJobSearch must be used within a JobSearchProvider');
  }
  return context;
}
