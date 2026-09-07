import {
  FullWorkerProfile,
  PublicWorkerProfile,
  UnlockedEmployerViewWorkerProfile,
  WorkerProfileFilterParams,
  WorkerUploadedFile,
  WorkerNotification,
  RatingsBreakdown,
  WorkerVerification,
  WorkerAvailabilityType,
} from '@/types';

const STORAGE_KEY = 'serategna:worker_profiles_v1';
const UNLOCKS_KEY = 'serategna:phone_unlocks_v1';
const NOTIFS_KEY = 'serategna:worker_notifications_v1';

const emptyRatings: RatingsBreakdown = {
  overall: 0,
  workQuality: 0,
  reliability: 0,
  professionalism: 0,
  punctuality: 0,
  communication: 0,
};

const emptyVerification: WorkerVerification = {
  phoneVerified: false,
  idUploaded: false,
  idVerified: false,
  certificatesUploaded: false,
  certificatesVerified: false,
  status: 'Pending Verification',
};

let profilesCache: FullWorkerProfile[] | null = null;
let unlocksCache: Record<string, string[]> | null = null;
let notifsCache: WorkerNotification[] | null = null;

function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

function loadProfiles(): FullWorkerProfile[] {
  if (profilesCache) return profilesCache;
  try {
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        profilesCache = JSON.parse(raw) as FullWorkerProfile[];
        return profilesCache!;
      }
    }
  } catch {
    // ignore
  }
  profilesCache = [];
  return profilesCache;
}

function saveProfiles() {
  if (typeof window !== 'undefined' && profilesCache) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profilesCache));
    } catch {
      // ignore quota errors
    }
  }
}

function loadUnlocks(): Record<string, string[]> {
  if (unlocksCache) return unlocksCache;
  try {
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(UNLOCKS_KEY);
      if (raw) {
        unlocksCache = JSON.parse(raw) as Record<string, string[]>;
        return unlocksCache!;
      }
    }
  } catch {
    // ignore
  }
  unlocksCache = {};
  return unlocksCache;
}

function saveUnlocks() {
  if (typeof window !== 'undefined' && unlocksCache) {
    try {
      window.localStorage.setItem(UNLOCKS_KEY, JSON.stringify(unlocksCache));
    } catch {
      // ignore
    }
  }
}

function loadNotifications(): WorkerNotification[] {
  if (notifsCache) return notifsCache;
  try {
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(NOTIFS_KEY);
      if (raw) {
        notifsCache = JSON.parse(raw) as WorkerNotification[];
        return notifsCache!;
      }
    }
  } catch {
    // ignore
  }
  notifsCache = [];
  return notifsCache;
}

function saveNotifications() {
  if (typeof window !== 'undefined' && notifsCache) {
    try {
      window.localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifsCache));
    } catch {
      // ignore
    }
  }
}

function pushNotification(workerId: string, notif: Omit<WorkerNotification, 'id' | 'workerId' | 'createdAt' | 'read'>) {
  const list = loadNotifications();
  list.unshift({
    ...notif,
    id: uid('notif'),
    workerId,
    createdAt: new Date().toISOString(),
    read: false,
  });
  saveNotifications();
}

export function makeDefaultFullProfile(userId: string, overrides: Partial<FullWorkerProfile> = {}): FullWorkerProfile {
  const now = new Date().toISOString();
  return {
    id: uid('worker'),
    userId,
    fullName: overrides.fullName ?? '',
    avatar: overrides.avatar,
    phone: overrides.phone ?? '',
    email: overrides.email,
    genderIdentity: overrides.genderIdentity ?? {},
    region: overrides.region,
    city: overrides.city,
    subCityWoreda: overrides.subCityWoreda,
    address: overrides.address,

    jobTitle: overrides.jobTitle ?? '',
    jobCategory: overrides.jobCategory,
    aboutBio: overrides.aboutBio,
    yearsOfExperience: overrides.yearsOfExperience ?? 0,
    skills: overrides.skills ?? [],

    workExperience: overrides.workExperience ?? [],
    education: overrides.education ?? [],
    training: overrides.training ?? [],

    certificates: overrides.certificates ?? [],
    languages: overrides.languages ?? [],

    availability: overrides.availability ?? { type: 'available_now' },
    expectedSalary: overrides.expectedSalary ?? { period: 'negotiable', currency: 'ETB', public: false },
    preferredLocation: overrides.preferredLocation ?? { additionalPreferredCities: [], willingToRelocate: false },

    documents: overrides.documents ?? [],

    profileStatus: overrides.profileStatus ?? 'draft',
    rejectionReason: overrides.rejectionReason,
    createdAt: now,
    updatedAt: now,
    submittedAt: overrides.submittedAt,

    rating: overrides.rating ?? 0,
    totalReviews: overrides.totalReviews ?? 0,
    ratingsBreakdown: overrides.ratingsBreakdown ?? { ...emptyRatings },
    isFeatured: overrides.isFeatured ?? false,
    isSponsored: overrides.isSponsored ?? false,
    isPhoneVerified: overrides.isPhoneVerified ?? false,
    isEmployerVerified: overrides.isEmployerVerified ?? false,
    verificationStatus: overrides.verificationStatus ?? { ...emptyVerification },
  };
}

// -------------------- PROFILE COMPLETION --------------------

type CompletionKey =
  | 'basic'
  | 'professional'
  | 'skills'
  | 'experience'
  | 'education'
  | 'training'
  | 'certificates'
  | 'languages'
  | 'availability'
  | 'documents';

const COMPLETION_WEIGHTS: Record<CompletionKey, number> = {
  basic: 18,
  professional: 15,
  skills: 12,
  experience: 12,
  education: 10,
  training: 6,
  certificates: 8,
  languages: 5,
  availability: 7,
  documents: 7,
};

export function calculateProfileCompletion(p: FullWorkerProfile): { percent: number; missing: CompletionKey[] } {
  const checks: Record<CompletionKey, boolean> = {
    basic: Boolean(p.fullName && p.phone && p.region && p.city),
    professional: Boolean(p.jobTitle && p.jobCategory && p.yearsOfExperience >= 0 && p.aboutBio && p.aboutBio.length > 30),
    skills: p.skills.length >= 3,
    experience: p.workExperience.length >= 1,
    education: p.education.length >= 1,
    training: p.training.length >= 1,
    certificates: p.certificates.length >= 1,
    languages: p.languages.length >= 1,
    availability: p.availability.type === 'available_now' || p.availability.type === 'available_from_date' || p.availability.type === 'currently_employed',
    documents: p.documents.some((d) => d.visibility !== 'private') || p.documents.some((d) => d.category === 'cv'),
  };

  let total = 0;
  const missing: CompletionKey[] = [];
  (Object.keys(COMPLETION_WEIGHTS) as CompletionKey[]).forEach((k) => {
    if (checks[k]) total += COMPLETION_WEIGHTS[k];
    else missing.push(k);
  });
  return { percent: Math.min(100, total), missing };
}

// -------------------- PUBLIC VIEW PROJECTION (PHONE PRIVACY ENFORCED HERE) --------------------

function formatExperienceDuration(startDate?: string, endDate?: string, currentlyWorking = false): string {
  const start = startDate ? new Date(startDate).getFullYear() : '';
  if (currentlyWorking) return start ? `${start} – Present` : 'Present';
  const end = endDate ? new Date(endDate).getFullYear() : '';
  if (start && end) return `${start} – ${end}`;
  return start ? `${start}` : end ? `${end}` : 'Unknown Duration';
}

function availabilityDisplay(type: WorkerAvailabilityType, availableFromDate?: string): string {
  switch (type) {
    case 'available_now':
      return 'Available Now';
    case 'available_from_date':
      return availableFromDate
        ? `Available from ${new Date(availableFromDate).toLocaleDateString()}`
        : 'Available from a date';
    case 'currently_employed':
      return 'Currently Employed';
    case 'not_available':
      return 'Not Available';
  }
}

function projectToPublic(p: FullWorkerProfile): PublicWorkerProfile {
  const locParts: string[] = [];
  if (p.preferredLocation.preferredCity) locParts.push(p.preferredLocation.preferredCity);
  if (p.preferredLocation.preferredRegion) locParts.push(p.preferredLocation.preferredRegion);
  const willing = p.preferredLocation.willingToRelocate ? ' • Willing to relocate' : '';
  const preferredLocationSummary =
    locParts.length > 0 ? `${locParts.join(', ')}${willing}` : willing.length > 0 ? willing.slice(3) : '';

  let salaryPublicDisplay: string | undefined;
  if (p.expectedSalary.public && p.expectedSalary.period !== 'negotiable') {
    const etb = 'ETB';
    const parts: string[] = [];
    if (p.expectedSalary.min) parts.push(`${p.expectedSalary.min.toLocaleString()} ${etb}`);
    if (p.expectedSalary.max) parts.push(`${p.expectedSalary.max.toLocaleString()} ${etb}`);
    const range = parts.length === 2 ? `${parts[0]} - ${parts[1]}` : parts[0] ?? '';
    const periodMap: Record<string, string> = {
      per_day: 'per day',
      per_week: 'per week',
      per_month: 'per month',
      per_year: 'per year',
    };
    salaryPublicDisplay = range ? `${range} ${periodMap[p.expectedSalary.period] ?? ''}` : undefined;
  } else if (p.expectedSalary.public && p.expectedSalary.period === 'negotiable') {
    salaryPublicDisplay = 'Negotiable';
  }

  return {
    id: p.id,
    fullName: p.fullName,
    avatar: p.avatar,
    region: p.region,
    city: p.city,
    jobTitle: p.jobTitle,
    jobCategory: p.jobCategory,
    aboutBio: p.aboutBio,
    yearsOfExperience: p.yearsOfExperience,
    availability: p.availability,
    profileStatus: p.profileStatus,
    createdAt: p.createdAt,
    rating: p.rating,
    totalReviews: p.totalReviews,
    ratingsBreakdown: p.ratingsBreakdown,
    isFeatured: p.isFeatured,
    isSponsored: p.isSponsored,
    isPhoneVerified: p.isPhoneVerified,
    isEmployerVerified: p.isEmployerVerified,
    verificationStatus: p.verificationStatus,
    mainSkills: p.skills.slice(0, 6).map((s) => ({ name: s.name, level: s.level })),
    preferredLocationSummary,
    availabilityDisplay: availabilityDisplay(p.availability.type, p.availability.availableFromDate),
    languagesDisplay: p.languages.map((l) => ({ language: l.language, proficiency: l.proficiency })),
    educationSummary: p.education.map((e) => ({
      institution: e.institution,
      qualification: e.qualification,
      year: e.graduationYear ?? e.startYear,
    })),
    experienceSummary: p.workExperience.map((e) => ({
      company: e.company,
      role: e.jobTitle,
      duration: formatExperienceDuration(e.startDate, e.endDate, e.currentlyWorking),
    })),
    publicCertificates: p.certificates.map((c) => ({
      name: c.name,
      issuer: c.issuingOrganization,
      issueDate: c.issueDate,
    })),
    documentsPublic: p.documents
      .filter((d) => d.visibility === 'public')
      .map((d) => ({ id: d.id, title: d.title, category: d.category })),
    salaryPublicDisplay,
  };
}

// -------------------- SERVICE API --------------------

export const workerProfilesService = {
  // ===== Create =====
  async createProfile(input: Omit<FullWorkerProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<FullWorkerProfile> {
    const profiles = loadProfiles();
    const now = new Date().toISOString();
    const newProfile: FullWorkerProfile = {
      ...input,
      id: uid('worker'),
      createdAt: now,
      updatedAt: now,
    };
    profiles.push(newProfile);
    saveProfiles();
    return { ...newProfile };
  },

  // ===== Full profile (worker only — requires auth check at call site) =====
  async getFullProfileById(profileId: string, requestingUserId?: string): Promise<FullWorkerProfile | null> {
    const profiles = loadProfiles();
    const p = profiles.find((x) => x.id === profileId);
    if (!p) return null;
    // Authorization boundary: only owner can access FULL profile (phone, private docs, DOB, address)
    if (requestingUserId && p.userId !== requestingUserId) {
      return null;
    }
    return { ...p };
  },

  async getFullProfileByUserId(userId: string): Promise<FullWorkerProfile | null> {
    const profiles = loadProfiles();
    const p = profiles.find((x) => x.userId === userId);
    if (!p) return null;
    return { ...p };
  },

  // ===== Public list (Approved + public only) =====
  async getPublicProfiles(filters?: WorkerProfileFilterParams): Promise<PublicWorkerProfile[]> {
    const profiles = loadProfiles();
    // ONLY approved profiles appear in search
    let results = profiles.filter((p) => p.profileStatus === 'approved');

    if (!filters) return results.map(projectToPublic);

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      results = results.filter((p) => {
        const inName = p.fullName.toLowerCase().includes(q);
        const inTitle = p.jobTitle.toLowerCase().includes(q);
        const inSkills = p.skills.some((s) => s.name.toLowerCase().includes(q));
        const inCity = (p.city ?? '').toLowerCase().includes(q);
        return inName || inTitle || inSkills || inCity;
      });
    }

    if (filters.category && filters.category !== 'All') {
      results = results.filter((p) => (p.jobCategory ?? '').toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters.skill) {
      const s = filters.skill.toLowerCase();
      results = results.filter((p) => p.skills.some((sk) => sk.name.toLowerCase().includes(s)));
    }

    if (filters.region && filters.region !== 'All') {
      results = results.filter((p) => (p.region ?? '').toLowerCase() === filters.region!.toLowerCase());
    }

    if (filters.city && filters.city !== 'All') {
      results = results.filter((p) => (p.city ?? '').toLowerCase() === filters.city!.toLowerCase());
    }

    if (filters.minExperience && filters.minExperience > 0) {
      results = results.filter((p) => p.yearsOfExperience >= filters.minExperience!);
    }

    if (filters.minRating && filters.minRating > 0) {
      results = results.filter((p) => p.rating >= filters.minRating!);
    }

    if (filters.availability && filters.availability !== 'All') {
      results = results.filter((p) => p.availability.type === filters.availability);
    }

    if (filters.verifiedOnly) {
      results = results.filter(
        (p) => p.isPhoneVerified && p.verificationStatus.status === 'Verified'
      );
    }

    if (filters.sortBy) {
      if (filters.sortBy === 'rating') results.sort((a, b) => b.rating - a.rating);
      else if (filters.sortBy === 'experience') results.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
      else if (filters.sortBy === 'newest')
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return results.map(projectToPublic);
  },

  async getFeaturedPublicProfiles(limit = 6): Promise<PublicWorkerProfile[]> {
    const all = await this.getPublicProfiles({ sortBy: 'rating' });
    return all.filter((p) => p.isFeatured).slice(0, limit);
  },

  // ===== Single public profile (phone number NOT exposed) =====
  async getPublicProfileById(id: string): Promise<PublicWorkerProfile | null> {
    const profiles = loadProfiles();
    const p = profiles.find((x) => x.id === id);
    if (!p) return null;
    // Never serve draft/rejected/suspended publicly
    if (p.profileStatus !== 'approved') return null;
    return projectToPublic(p);
  },

  // ===== Unlocked employer view (phone exposed ONLY after unlock) =====
  async getUnlockedEmployerViewById(
    employerId: string,
    workerId: string
  ): Promise<UnlockedEmployerViewWorkerProfile | null> {
    const unlocks = loadUnlocks();
    const employerUnlocks = unlocks[employerId] ?? [];
    if (!employerUnlocks.includes(workerId)) {
      return null; // NEVER send phone if not unlocked
    }
    const profiles = loadProfiles();
    const p = profiles.find((x) => x.id === workerId);
    if (!p || p.profileStatus !== 'approved') return null;
    const pub = projectToPublic(p);
    return { ...pub, phone: p.phone };
  },

  // ===== Unlock (payment verification boundary) =====
  async recordPhoneUnlock(params: {
    employerId: string;
    workerId: string;
    paymentReference: string;
    paymentSuccessful: boolean;
  }): Promise<{ success: boolean; phone?: string }> {
    if (!params.paymentSuccessful) {
      return { success: false };
    }
    const profiles = loadProfiles();
    const p = profiles.find((x) => x.id === params.workerId);
    if (!p) return { success: false };

    const unlocks = loadUnlocks();
    if (!unlocks[params.employerId]) unlocks[params.employerId] = [];
    if (!unlocks[params.employerId].includes(params.workerId)) {
      unlocks[params.employerId].push(params.workerId);
    }
    saveUnlocks();

    return { success: true, phone: p.phone };
  },

  async hasEmployerUnlocked(employerId: string, workerId: string): Promise<boolean> {
    const unlocks = loadUnlocks();
    return (unlocks[employerId] ?? []).includes(workerId);
  },

  // ===== Update =====
  async updateProfile(
    profileId: string,
    requestingUserId: string,
    updates: Partial<FullWorkerProfile>
  ): Promise<FullWorkerProfile | null> {
    const profiles = loadProfiles();
    const idx = profiles.findIndex((x) => x.id === profileId);
    if (idx === -1) return null;
    if (profiles[idx].userId !== requestingUserId) return null; // ownership enforcement

    const merged: FullWorkerProfile = {
      ...profiles[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
      // do not allow changing id or userId via updates
      id: profiles[idx].id,
      userId: profiles[idx].userId,
      createdAt: profiles[idx].createdAt,
    };
    profiles[idx] = merged;
    saveProfiles();
    return { ...merged };
  },

  // ===== Submit (Draft -> Pending) =====
  async submitProfileForApproval(
    profileId: string,
    requestingUserId: string
  ): Promise<FullWorkerProfile | null> {
    const profiles = loadProfiles();
    const idx = profiles.findIndex((x) => x.id === profileId);
    if (idx === -1) return null;
    if (profiles[idx].userId !== requestingUserId) return null;
    const now = new Date().toISOString();
    profiles[idx] = {
      ...profiles[idx],
      profileStatus: 'pending',
      submittedAt: now,
      updatedAt: now,
    };
    saveProfiles();
    pushNotification(profiles[idx].id, {
      type: 'profile_submitted',
      title: 'Profile Submitted',
      message: 'Your profile is awaiting administrator review. You will be notified once reviewed.',
    });
    return { ...profiles[idx] };
  },

  // ===== Admin decisions (admin role enforcement handled at call site) =====
  async adminApproveProfile(profileId: string): Promise<FullWorkerProfile | null> {
    const profiles = loadProfiles();
    const idx = profiles.findIndex((x) => x.id === profileId);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    profiles[idx] = {
      ...profiles[idx],
      profileStatus: 'approved',
      rejectionReason: undefined,
      updatedAt: now,
      verificationStatus: {
        ...profiles[idx].verificationStatus,
        status: 'Verified',
      },
      isPhoneVerified: true,
    };
    saveProfiles();
    pushNotification(profiles[idx].id, {
      type: 'profile_approved',
      title: 'Profile Approved!',
      message: 'Your profile has been approved and is now visible to employers on Find Workers.',
    });
    return { ...profiles[idx] };
  },

  async adminRejectProfile(profileId: string, reason: string): Promise<FullWorkerProfile | null> {
    const profiles = loadProfiles();
    const idx = profiles.findIndex((x) => x.id === profileId);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    profiles[idx] = {
      ...profiles[idx],
      profileStatus: 'rejected',
      rejectionReason: reason,
      updatedAt: now,
    };
    saveProfiles();
    pushNotification(profiles[idx].id, {
      type: 'profile_rejected',
      title: 'Profile Requires Updates',
      message: `Your profile was not approved. Reason: ${reason}`,
    });
    return { ...profiles[idx] };
  },

  // ===== Notifications =====
  async getNotificationsForWorker(workerId: string): Promise<WorkerNotification[]> {
    const list = loadNotifications();
    return list.filter((n) => n.workerId === workerId).map((n) => ({ ...n }));
  },

  async markNotificationRead(notifId: string, workerId: string): Promise<void> {
    const list = loadNotifications();
    const idx = list.findIndex((n) => n.id === notifId && n.workerId === workerId);
    if (idx !== -1) {
      list[idx].read = true;
      saveNotifications();
    }
  },

  // ===== File helpers =====
  validateImageFile(file: File): { ok: boolean; error?: string } {
    const maxMb = 5;
    if (!file.type.startsWith('image/')) return { ok: false, error: 'Please upload a valid image (JPG, PNG, etc.).' };
    if (file.size > maxMb * 1024 * 1024) return { ok: false, error: `Image must be under ${maxMb} MB.` };
    return { ok: true };
  },

  validateDocumentFile(file: File): { ok: boolean; error?: string } {
    const maxMb = 12;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type) && !/\.(pdf|jpe?g|png)$/i.test(file.name)) {
      return { ok: false, error: 'Allowed document formats: PDF, JPG, PNG.' };
    }
    if (file.size > maxMb * 1024 * 1024) return { ok: false, error: `Document must be under ${maxMb} MB.` };
    return { ok: true };
  },

  async fileToUploadedFile(file: File): Promise<WorkerUploadedFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = () => {
        resolve({
          id: uid('file'),
          name: file.name,
          dataUrl: reader.result as string,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
    });
  },
};
