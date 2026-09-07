'use client';

import React, { createContext, useContext, useState } from 'react';
import { UserRole, EmployerProfile } from '@/types';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  titleOrCompany?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  employerProfile: EmployerProfile;
  workerProfileId: string | null;
  setRole: (role: UserRole) => void;
  switchDemoPersona: (persona: 'guest' | 'worker' | 'employer' | 'admin') => void;
  markFirstJobPosted: () => void;
  consumeFreeUnlock: () => void;
  registerWorker: (workerUserId: string, workerProfileId: string, workerName: string, workerEmail?: string, workerAvatar?: string) => void;
}

const defaultEmployer: EmployerProfile = {
  id: 'emp-abc',
  name: 'Girma Tadesse',
  companyName: 'ABC Technology PLC',
  email: 'recruitment@abctech.et',
  phone: '+251 91 190 2211',
  businessType: 'Technology Solutions & Engineering',
  location: 'Addis Ababa (Bole Medhanealem)',
  region: 'Addis Ababa',
  isVerified: true,
  hasPostedFirstJob: true, // Already posted 1 job, eligible for free unlock
  freeUnlocksRemaining: 1, // 1 free phone number unlock available!
  phoneUnlocksCount: 2,
  postedJobsCount: 3,
  postedInternshipsCount: 2,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROFILE_ID_STORAGE = 'serategna:auth_worker_profile_id_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('employer');
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile>(defaultEmployer);
  const [workerProfileId, setWorkerProfileId] = useState<string | null>(() => {
    try {
      if (typeof window !== 'undefined') return window.localStorage.getItem(PROFILE_ID_STORAGE);
    } catch {
      // ignore
    }
    return null;
  });

  const [user, setUser] = useState<AuthUser | null>({
    id: 'emp-abc',
    name: 'Girma Tadesse',
    email: 'recruitment@abctech.et',
    role: 'employer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    titleOrCompany: 'ABC Technology PLC',
  });

  const switchDemoPersona = (persona: 'guest' | 'worker' | 'employer' | 'admin') => {
    setRoleState(persona);
    if (persona === 'guest') {
      setUser(null);
    } else if (persona === 'worker') {
      setUser({
        id: 'worker-1',
        name: 'Abebe Kebede',
        email: 'abebe.kebede.electric@gmail.com',
        role: 'worker',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        titleOrCompany: 'Senior Electrician & Power Systems',
      });
    } else if (persona === 'employer') {
      setUser({
        id: 'emp-abc',
        name: 'Girma Tadesse',
        email: 'recruitment@abctech.et',
        role: 'employer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        titleOrCompany: 'ABC Technology PLC',
      });
    } else if (persona === 'admin') {
      setUser({
        id: 'admin-1',
        name: 'Platform Administrator',
        email: 'admin@serategna.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        titleOrCompany: 'Serategna HQ Trust & Safety',
      });
    }
  };

  const markFirstJobPosted = () => {
    setEmployerProfile((prev) => {
      const hadFirstJob = prev.hasPostedFirstJob;
      return {
        ...prev,
        hasPostedFirstJob: true,
        postedJobsCount: prev.postedJobsCount + 1,
        // If they just posted their very first job, award 1 free unlock!
        freeUnlocksRemaining: hadFirstJob ? prev.freeUnlocksRemaining : prev.freeUnlocksRemaining + 1,
      };
    });
  };

  const consumeFreeUnlock = () => {
    setEmployerProfile((prev) => ({
      ...prev,
      freeUnlocksRemaining: Math.max(0, prev.freeUnlocksRemaining - 1),
      phoneUnlocksCount: prev.phoneUnlocksCount + 1,
    }));
  };

  const registerWorker: AuthContextType['registerWorker'] = (workerUserId, workerProfileId, workerName, workerEmail, workerAvatar) => {
    setRoleState('worker');
    setWorkerProfileId(workerProfileId);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(PROFILE_ID_STORAGE, workerProfileId);
      }
    } catch {
      // ignore
    }
    setUser({
      id: workerUserId,
      name: workerName,
      email: workerEmail ?? '',
      role: 'worker',
      avatar: workerAvatar,
      titleOrCompany: 'Worker Profile',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        employerProfile,
        workerProfileId,
        setRole: setRoleState,
        switchDemoPersona,
        markFirstJobPosted,
        consumeFreeUnlock,
        registerWorker,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
