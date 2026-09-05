import { Internship } from '@/types';
import { mockInternships } from '@/data/mockInternships';

export interface InternshipFilterParams {
  query?: string;
  field?: string;
  region?: string;
  workType?: string;
  duration?: string;
  compensation?: string;
  educationLevel?: string;
}

export const internshipsService = {
  async getInternships(filters?: InternshipFilterParams): Promise<Internship[]> {
    let results = [...mockInternships];

    if (!filters) return results;

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.company.toLowerCase().includes(q) ||
          item.field.toLowerCase().includes(q) ||
          item.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters.field && filters.field !== 'All') {
      results = results.filter(
        (item) => item.field.toLowerCase() === filters.field!.toLowerCase()
      );
    }

    if (filters.region && filters.region !== 'All') {
      results = results.filter(
        (item) => item.region.toLowerCase() === filters.region!.toLowerCase()
      );
    }

    if (filters.workType && filters.workType !== 'All') {
      results = results.filter((item) => item.workType === filters.workType);
    }

    if (filters.compensation && filters.compensation !== 'All') {
      results = results.filter((item) => item.compensation === filters.compensation);
    }

    if (filters.educationLevel && filters.educationLevel !== 'All') {
      results = results.filter(
        (item) =>
          item.educationLevel === filters.educationLevel || item.educationLevel === 'All Levels'
      );
    }

    return results;
  },

  async getInternshipById(id: string): Promise<Internship | null> {
    const item = mockInternships.find((i) => i.id === id);
    return item ? { ...item } : null;
  },

  async getFeaturedInternships(): Promise<Internship[]> {
    return mockInternships.filter((i) => i.isFeatured);
  },

  async createInternship(
    newInternship: Omit<Internship, 'id' | 'postedDate' | 'applicantsCount' | 'status'>
  ): Promise<Internship> {
    const item: Internship = {
      ...newInternship,
      id: `intern-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
      status: 'Active',
    };
    mockInternships.unshift(item);
    return item;
  },
};
