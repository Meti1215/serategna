'use client';

import React, { createContext, useContext, useState } from 'react';
import { paymentsService } from '@/services/paymentsService';
import { useAuth } from '@/context/AuthContext';

interface UnlockContextType {
  unlockedWorkerIds: string[];
  isWorkerUnlocked: (workerId: string) => boolean;
  unlockWorker: (
    workerId: string,
    paymentMethod: 'Chapa' | 'Telebirr' | 'CBE' | 'Free First Unlock',
    isFree?: boolean
  ) => Promise<{ success: boolean; unmaskedPhone: string }>;
}

const UnlockContext = createContext<UnlockContextType | undefined>(undefined);

export function UnlockProvider({ children }: { children: React.ReactNode }) {
  // Pre-populate worker-3 (Mohammed Ali) as previously unlocked for demonstration
  const [unlockedWorkerIds, setUnlockedWorkerIds] = useState<string[]>(['worker-3']);
  const { employerProfile, useOneFreeUnlock } = useAuth();

  const isWorkerUnlocked = (workerId: string) => {
    return unlockedWorkerIds.includes(workerId);
  };

  const unlockWorker = async (
    workerId: string,
    paymentMethod: 'Chapa' | 'Telebirr' | 'CBE' | 'Free First Unlock',
    isFree = false
  ) => {
    const res = await paymentsService.unlockWorkerPhone({
      employerId: employerProfile.id,
      employerName: employerProfile.companyName,
      workerId,
      paymentMethod,
      isUsingFreeUnlock: isFree,
    });

    if (res.success) {
      setUnlockedWorkerIds((prev) => [...prev, workerId]);
      if (isFree || paymentMethod === 'Free First Unlock') {
        useOneFreeUnlock();
      }
    }

    return res;
  };

  return (
    <UnlockContext.Provider
      value={{
        unlockedWorkerIds,
        isWorkerUnlocked,
        unlockWorker,
      }}
    >
      {children}
    </UnlockContext.Provider>
  );
}

export function useUnlock() {
  const context = useContext(UnlockContext);
  if (!context) {
    throw new Error('useUnlock must be used within an UnlockProvider');
  }
  return context;
}
