import { Job } from '@/types';
import { mockJobs } from '@/data/mockJobs';

export interface JobFilterParams {
  query?: string;
  category?: string;
  region?: string;
  employmentType?: string;
  experienceLevel?: string;
  isFeatured?: boolean;
}

export const jobsService = {
  async getJobs(filters?: JobFilterParams): Promise<Job[]> {
    let results = [...mockJobs];

    if (!filters) return results;

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      results = results.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.location.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== 'All') {
      results = results.filter(
        (j) => j.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters.region && filters.region !== 'All') {
      results = results.filter(
        (j) => j.region.toLowerCase() === filters.region!.toLowerCase()
      );
    }

    if (filters.employmentType && filters.employmentType !== 'All') {
      results = results.filter((j) => j.employmentType === filters.employmentType);
    }

    if (filters.experienceLevel && filters.experienceLevel !== 'All') {
      results = results.filter((j) => j.experienceLevel === filters.experienceLevel);
    }

    return results;
  },

  async getJobById(id: string): Promise<Job | null> {
    const job = mockJobs.find((j) => j.id === id);
    return job ? { ...job } : null;
  },

  async getFeaturedJobs(): Promise<Job[]> {
    return mockJobs.filter((j) => j.isFeatured);
  },

  async createJob(newJob: Omit<Job, 'id' | 'postedDate' | 'applicantsCount' | 'status'>): Promise<Job> {
    const job: Job = {
      ...newJob,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
      status: 'Active',
    };
    mockJobs.unshift(job);
    return job;
  },
};
