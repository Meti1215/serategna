'use client';

import React, { createContext, useContext, useState } from 'react';

interface SavedContextType {
  savedWorkerIds: string[];
  savedJobIds: string[];
  savedInternshipIds: string[];
  toggleSaveWorker: (id: string) => void;
  toggleSaveJob: (id: string) => void;
  toggleSaveInternship: (id: string) => void;
  isSavedWorker: (id: string) => boolean;
  isSavedJob: (id: string) => boolean;
  isSavedInternship: (id: string) => boolean;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [savedWorkerIds, setSavedWorkerIds] = useState<string[]>(['worker-1', 'worker-4']);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job-1', 'job-3']);
  const [savedInternshipIds, setSavedInternshipIds] = useState<string[]>(['intern-1']);

  const toggleSaveWorker = (id: string) => {
    setSavedWorkerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSaveJob = (id: string) => {
    setSavedJobIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSaveInternship = (id: string) => {
    setSavedInternshipIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <SavedContext.Provider
      value={{
        savedWorkerIds,
        savedJobIds,
        savedInternshipIds,
        toggleSaveWorker,
        toggleSaveJob,
        toggleSaveInternship,
        isSavedWorker: (id) => savedWorkerIds.includes(id),
        isSavedJob: (id) => savedJobIds.includes(id),
        isSavedInternship: (id) => savedInternshipIds.includes(id),
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
}
