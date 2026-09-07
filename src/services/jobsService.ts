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

    // Sorting - featured jobs always come first
    const now = new Date().toISOString();
    const activeFeatured = results.filter(
      (j) => j.isFeatured && j.featuredIsActive && j.featuredStartDate && j.featuredEndDate && j.featuredStartDate <= now && j.featuredEndDate >= now
    );
    const nonFeatured = results.filter(
      (j) => !(j.isFeatured && j.featuredIsActive && j.featuredStartDate && j.featuredEndDate && j.featuredStartDate <= now && j.featuredEndDate >= now)
    );

    // Sort featured by priority
    activeFeatured.sort((a, b) => (b.featuredPriority || 0) - (a.featuredPriority || 0));

    // Sort non-featured by posted date (newest first)
    nonFeatured.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

    return [...activeFeatured, ...nonFeatured];
  },

  async getJobById(id: string): Promise<Job | null> {
    const job = mockJobs.find((j) => j.id === id);
    return job ? { ...job } : null;
  },

  async getFeaturedJobs(): Promise<Job[]> {
    const now = new Date().toISOString();
    return mockJobs
      .filter((j) => j.isFeatured && j.featuredIsActive && j.featuredStartDate && j.featuredEndDate && j.featuredStartDate <= now && j.featuredEndDate >= now)
      .sort((a, b) => (b.featuredPriority || 0) - (a.featuredPriority || 0));
  },

  async setJobFeatured(
    jobId: string,
    isFeatured: boolean,
    startDate?: string,
    endDate?: string,
    priority: number = 1
  ): Promise<Job | null> {
    const job = mockJobs.find((j) => j.id === jobId);
    if (!job) return null;

    job.isFeatured = isFeatured;
    job.featuredIsActive = isFeatured;
    job.featuredStartDate = startDate;
    job.featuredEndDate = endDate;
    job.featuredPriority = priority;

    return { ...job };
  },

  async removeJobFeatured(jobId: string): Promise<Job | null> {
    return this.setJobFeatured(jobId, false);
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
