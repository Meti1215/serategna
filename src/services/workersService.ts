import { WorkerProfile, PublicWorkerProfile, SkillLevel, LanguageProficiency, WorkerAvailabilityType } from '@/types';
import { mockWorkers } from '@/data/mockWorkers';
import { workerProfilesService } from './workerProfilesService';

export interface WorkerFilterParams {
  query?: string;
  category?: string;
  region?: string;
  city?: string;
  minExperience?: number;
  minRating?: number;
  availability?: WorkerAvailabilityType | 'All';
  verifiedOnly?: boolean;
  sortBy?: 'recommended' | 'rating' | 'experience' | 'newest';
}

type LegacyAvailability = 'Immediately' | 'Full-time' | 'Part-time' | 'Weekends' | 'Contract';

function mapFilterAvailabilityToLegacy(av: WorkerAvailabilityType | 'All'): LegacyAvailability | null {
  switch (av) {
    case 'available_now':
      return 'Immediately';
    case 'currently_employed':
      return 'Full-time';
    case 'available_from_date':
      return 'Contract';
    case 'not_available':
      return null;
    case 'All':
    default:
      return null;
  }
}

interface LegacyWorkHistory {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface LegacyEducation {
  institution: string;
  degree: string;
  year: string;
}

interface LegacyCertificate {
  id: string;
  title: string;
  issuer: string;
  year: string;
  isIndependentlyVerified: boolean;
}

interface ProjectedPublicSkills {
  name: string;
  level: SkillLevel;
}

interface ProjectedPublicLanguages {
  language: string;
  proficiency: LanguageProficiency;
}

interface ProjectedPublicExperience {
  company: string;
  role: string;
  duration: string;
}

interface ProjectedPublicEducation {
  institution: string;
  qualification: string;
  year?: string;
}

interface ProjectedPublicCertificates {
  name: string;
  issuer: string;
  issueDate?: string;
}

/**
 * Merges PublicWorkerProfile (new profiles service, Approved-only, phone-private projection)
 * into legacy WorkerProfile shape for existing consumers (WorkerCard, Find Workers page).
 * Phone number is NEVER populated for new-profile entries since the projection already omits it.
 */
function toLegacyShape(p: PublicWorkerProfile, sourcePhone = ''): WorkerProfile {
  const mainSkillNames: string[] = p.mainSkills
    ? p.mainSkills.map((s: ProjectedPublicSkills) => s.name)
    : [];
  const langNames: string[] = p.languagesDisplay
    ? p.languagesDisplay.map((l: ProjectedPublicLanguages) => l.language)
    : [];
  const workHistory: LegacyWorkHistory[] = p.experienceSummary
    ? p.experienceSummary.map((e: ProjectedPublicExperience) => ({
        company: e.company,
        role: e.role,
        duration: e.duration,
        description: '',
      }))
    : [];
  const education: LegacyEducation[] = p.educationSummary
    ? p.educationSummary.map((e: ProjectedPublicEducation) => ({
        institution: e.institution,
        degree: e.qualification,
        year: e.year ?? '',
      }))
    : [];
  const certificates: LegacyCertificate[] = p.publicCertificates
    ? p.publicCertificates.map((c: ProjectedPublicCertificates, i: number) => ({
        id: `cert-new-${p.id}-${i}`,
        title: c.name,
        issuer: c.issuer,
        year: c.issueDate ?? '',
        isIndependentlyVerified: true,
      }))
    : [];
  const avType: 'Immediately' | 'Full-time' | 'Part-time' | 'Weekends' | 'Contract' =
    p.availabilityDisplay === 'Available Now'
      ? 'Immediately'
      : p.availabilityDisplay === 'Currently Employed'
      ? 'Full-time'
      : p.availability.type === 'available_from_date'
      ? 'Contract'
      : 'Full-time';

  return {
    id: p.id,
    fullName: p.fullName,
    profession: p.jobTitle,
    category: p.jobCategory ?? 'Other',
    region: p.region ?? '',
    city: p.city ?? '',
    avatar:
      p.avatar ??
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: p.aboutBio ?? '',
    experienceYears: p.yearsOfExperience ?? 0,
    expectedSalary: p.salaryPublicDisplay ?? 'Negotiable',
    availability: avType,
    preferredLocation: p.preferredLocationSummary ?? '',
    phone: sourcePhone, // intentionally '' for new profiles — PRIVACY: only unlocked employers can access
    rating: p.rating ?? 0,
    totalReviews: p.totalReviews ?? 0,
    ratingsBreakdown: p.ratingsBreakdown ?? {
      overall: 0,
      workQuality: 0,
      reliability: 0,
      professionalism: 0,
      punctuality: 0,
      communication: 0,
    },
    skills: mainSkillNames,
    isPhoneVerified: p.isPhoneVerified ?? false,
    isEmployerVerified: p.isEmployerVerified ?? false,
    isFeatured: p.isFeatured ?? false,
    isSponsored: p.isSponsored ?? false,
    verificationStatus: p.verificationStatus ?? {
      phoneVerified: false,
      idUploaded: false,
      idVerified: false,
      certificatesUploaded: false,
      certificatesVerified: false,
      status: 'Pending Verification',
    },
    workHistory,
    education,
    certificates,
    languages: langNames,
    profileCompletion: Math.round(
      (mainSkillNames.length >= 3 ? 25 : 0) +
        (workHistory.length >= 1 ? 20 : 0) +
        (education.length >= 1 ? 15 : 0) +
        (certificates.length >= 1 ? 15 : 0) +
        (p.aboutBio && p.aboutBio.length > 40 ? 15 : 0) +
        (langNames.length >= 1 ? 10 : 0)
    ),
  };
}

export const workersService = {
  async getWorkers(filters?: WorkerFilterParams): Promise<WorkerProfile[]> {
    // 1) New service first: Approved only, phone-private projection
    const newProfiles = await workerProfilesService.getPublicProfiles(filters);
    const mergedFromNew: WorkerProfile[] = newProfiles.map((p) => toLegacyShape(p, ''));
    const newIds = new Set(mergedFromNew.map((p) => p.id));

    // 2) Legacy mock data (fallback for demo) — strip phone from list views for privacy
    let legacy: WorkerProfile[] = mockWorkers.map((w) => ({
      ...w,
      phone: '', // Enforce privacy in list/card views
    }));

    // Deduplicate: if an id already appears in new service, drop legacy entry
    legacy = legacy.filter((w) => !newIds.has(w.id));

    let results = [...mergedFromNew, ...legacy];

    if (!filters) return results;

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      results = results.filter(
        (w) =>
          w.fullName.toLowerCase().includes(q) ||
          w.profession.toLowerCase().includes(q) ||
          w.skills.some((s) => s.toLowerCase().includes(q)) ||
          w.city.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== 'All') {
      results = results.filter(
        (w) => w.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters.region && filters.region !== 'All') {
      results = results.filter(
        (w) => w.region.toLowerCase() === filters.region!.toLowerCase()
      );
    }

    if (filters.city && filters.city !== 'All') {
      results = results.filter(
        (w) => w.city.toLowerCase() === filters.city!.toLowerCase()
      );
    }

    if (filters.minExperience && filters.minExperience > 0) {
      results = results.filter((w) => w.experienceYears >= filters.minExperience!);
    }

    if (filters.minRating && filters.minRating > 0) {
      results = results.filter((w) => w.rating >= filters.minRating!);
    }

    if (filters.availability && filters.availability !== 'All') {
      const legacyFilter = mapFilterAvailabilityToLegacy(filters.availability);
      if (legacyFilter) {
        results = results.filter((w) => w.availability === legacyFilter);
      }
    }

    if (filters.verifiedOnly) {
      results = results.filter(
        (w) => w.isPhoneVerified && w.verificationStatus.status === 'Verified'
      );
    }

    if (filters.sortBy) {
      if (filters.sortBy === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'experience') {
        results.sort((a, b) => b.experienceYears - a.experienceYears);
      } else if (filters.sortBy === 'newest') {
        results.sort(() => Math.random() - 0.5); // legacy mocks have no createdAt
      }
    }

    return results;
  },

  async getWorkerById(id: string): Promise<WorkerProfile | null> {
    // 1) New service first: public profile (phone-private projection)
    const newer = await workerProfilesService.getPublicProfileById(id);
    if (newer) {
      // PRIVACY: phone intentionally empty. Unlock flow separately reveals phone via
      // workerProfilesService.recordPhoneUnlock + UnlockPhoneModal/UnlockContext.
      return toLegacyShape(newer, '');
    }

    // 2) Fallback to legacy mock
    const legacy = mockWorkers.find((w) => w.id === id);
    if (!legacy) return null;
    return { ...legacy };
  },

  async getFeaturedWorkers(): Promise<WorkerProfile[]> {
    const newer = await workerProfilesService.getFeaturedPublicProfiles(6);
    const fromNew = newer.map((p) => toLegacyShape(p, ''));
    const newIds = new Set(fromNew.map((p) => p.id));
    const legacy = mockWorkers
      .filter((w) => w.isFeatured && !newIds.has(w.id))
      .map((w) => ({ ...w, phone: '' }));
    return [...fromNew, ...legacy].slice(0, 6);
  },
};
