import { WorkerProfile } from '@/types';
import { mockWorkers } from '@/data/mockWorkers';

export interface WorkerFilterParams {
  query?: string;
  category?: string;
  region?: string;
  city?: string;
  minExperience?: number;
  minRating?: number;
  availability?: string;
  verifiedOnly?: boolean;
  sortBy?: 'recommended' | 'rating' | 'experience' | 'newest';
}

export const workersService = {
  async getWorkers(filters?: WorkerFilterParams): Promise<WorkerProfile[]> {
    // Simulating async API call for easy backend connection later
    let results = [...mockWorkers];

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
      results = results.filter((w) => w.availability === filters.availability);
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
      }
    }

    return results;
  },

  async getWorkerById(id: string): Promise<WorkerProfile | null> {
    const worker = mockWorkers.find((w) => w.id === id);
    return worker ? { ...worker } : null;
  },

  async getFeaturedWorkers(): Promise<WorkerProfile[]> {
    return mockWorkers.filter((w) => w.isFeatured);
  },
};
