'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { UnlockProvider } from '@/context/UnlockContext';
import { SavedProvider } from '@/context/SavedContext';
import { ToastProvider } from '@/context/ToastContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UnlockProvider>
        <SavedProvider>
          <ToastProvider>{children}</ToastProvider>
        </SavedProvider>
      </UnlockProvider>
    </AuthProvider>
  );
}
