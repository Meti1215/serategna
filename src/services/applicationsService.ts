import { Application, ApplicationStatus } from '@/types';
import { notificationsService } from './notificationsService';

// Mock applications repository
export const mockApplications: Application[] = [
  {
    id: 'app-1',
    opportunityId: 'job-1',
    opportunityTitle: 'Senior Electrical Maintenance Engineer',
    opportunityType: 'job',
    companyName: 'Ethio Telecom Data Centers',
    applicantId: 'worker-1',
    applicantName: 'Abebe Kebede',
    applicantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    applicantProfession: 'Senior Electrician',
    applicantEmail: 'abebe.kebede.electric@gmail.com',
    applicantPhone: '+251 91 142 8892',
    applicantLocation: 'Addis Ababa',
    applicantRegion: 'Addis Ababa',
    applicantExperience: '7 years',
    applicantSkills: ['Industrial Power', 'Backup Generators', 'Safety Protocols'],
    applicantRating: 4.8,
    applicantTotalReviews: 12,
    coverLetter: 'I have 7 years experience in industrial power installations and Tier-3 backup generators matching Ethio Telecom requirements.',
    cvFileName: 'Abebe_Kebede_COC_IV_CV.pdf',
    cvFileUrl: '/files/cvs/Abebe_Kebede_COC_IV_CV.pdf',
    certificates: ['COC Level IV - Electrical', 'Safety Certification'],
    appliedDate: '2026-09-02',
    status: 'Shortlisted',
    updatedAt: '2026-09-05',
  },
  {
    id: 'app-2',
    opportunityId: 'intern-1',
    opportunityTitle: 'Software Engineering Intern (Frontend & Cloud)',
    opportunityType: 'internship',
    companyName: 'ABC Technology PLC',
    applicantId: 'worker-4',
    applicantName: 'Selamawit Tadesse',
    applicantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    applicantProfession: 'Full-Stack Software Engineer',
    applicantEmail: 'selamawit.dev@gmail.com',
    applicantPhone: '+251 93 455 1209',
    applicantLocation: 'Addis Ababa',
    applicantRegion: 'Addis Ababa',
    applicantExperience: '2 years',
    applicantSkills: ['Next.js', 'React', 'TypeScript', 'Payment APIs'],
    applicantRating: 4.5,
    applicantTotalReviews: 8,
    coverLetter: 'Passionate about Next.js and payment API integrations. Built several fullstack applications.',
    cvFileName: 'Selamawit_Tadesse_Software_CV.pdf',
    cvFileUrl: '/files/cvs/Selamawit_Tadesse_Software_CV.pdf',
    certificates: ['AWS Cloud Practitioner', 'Full-Stack Bootcamp'],
    appliedDate: '2026-09-03',
    status: 'Interview',
    interviewDate: '2026-09-10 14:00',
    updatedAt: '2026-09-06',
  },
  {
    id: 'app-3',
    opportunityId: 'job-2',
    opportunityTitle: 'Executive Corporate Driver',
    opportunityType: 'job',
    companyName: 'Dashan Bank Head Office',
    applicantId: 'worker-3',
    applicantName: 'Mohammed Ali',
    applicantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    applicantProfession: 'Commercial Driver',
    applicantEmail: 'mohammed.ali.driver@gmail.com',
    applicantPhone: '+251 91 277 4301',
    applicantLocation: 'Addis Ababa',
    applicantRegion: 'Addis Ababa',
    applicantExperience: '8 years',
    applicantSkills: ['Defensive Driving', 'Vehicle Maintenance', 'Route Planning'],
    applicantRating: 4.9,
    applicantTotalReviews: 15,
    coverLetter: 'Valid Grade 3 commercial license with 8 years clean accident-free driving record.',
    cvFileName: 'Mohammed_Ali_Grade3_License.pdf',
    cvFileUrl: '/files/cvs/Mohammed_Ali_Grade3_License.pdf',
    certificates: ['Grade 3 Commercial License', 'Defensive Driving Certificate'],
    appliedDate: '2026-09-01',
    status: 'Reviewing',
    updatedAt: '2026-09-04',
  },
  {
    id: 'app-4',
    opportunityId: 'job-1',
    opportunityTitle: 'Senior Electrical Maintenance Engineer',
    opportunityType: 'job',
    companyName: 'Ethio Telecom Data Centers',
    applicantId: 'worker-2',
    applicantName: 'Kalkidan Zewdu',
    applicantAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    applicantProfession: 'Electrical Engineer',
    applicantEmail: 'kalkidan.engineer@gmail.com',
    applicantPhone: '+251 92 345 6789',
    applicantLocation: 'Hawassa',
    applicantRegion: 'Sidama',
    applicantExperience: '5 years',
    applicantSkills: ['Power Systems', 'Circuit Design', 'Project Management'],
    applicantRating: 4.6,
    applicantTotalReviews: 10,
    coverLetter: 'Experienced electrical engineer with expertise in power distribution systems.',
    cvFileName: 'Kalkidan_Zewdu_CV.pdf',
    cvFileUrl: '/files/cvs/Kalkidan_Zewdu_CV.pdf',
    certificates: ['BSc Electrical Engineering', 'COC Level III'],
    appliedDate: '2026-09-05',
    status: 'New',
    updatedAt: '2026-09-05',
  },
];

export const applicationsService = {
  async getApplications(userId?: string, role?: 'worker' | 'employer' | 'admin'): Promise<Application[]> {
    if (role === 'worker' && userId) {
      return mockApplications.filter((a) => a.applicantId === userId);
    }
    if (role === 'employer' && userId) {
      // In a real app, filter by employer's jobs/internships
      return [...mockApplications];
    }
    return [...mockApplications];
  },

  async getApplicationsByOpportunity(opportunityId: string): Promise<Application[]> {
    return mockApplications.filter((a) => a.opportunityId === opportunityId);
  },

  async getApplicationById(id: string): Promise<Application | null> {
    return mockApplications.find((a) => a.id === id) || null;
  },

  async submitApplication(
    newApp: Omit<Application, 'id' | 'appliedDate' | 'status' | 'updatedAt'>
  ): Promise<Application> {
    const app: Application = {
      ...newApp,
      id: `app-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'New',
      updatedAt: new Date().toISOString(),
    };
    mockApplications.unshift(app);

    // Create notification for employer (in production, get employerId from job/internship)
    await notificationsService.createNewApplicationNotification(
      'emp-abc', // In production, this would be the actual employer ID
      app.id,
      app.opportunityTitle,
      app.applicantName
    );

    return app;
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string): Promise<Application | null> {
    const app = mockApplications.find((a) => a.id === id);
    if (!app) return null;
    app.status = status;
    app.updatedAt = new Date().toISOString();
    if (notes) {
      app.notes = notes;
    }

    // Create notification for worker
    await notificationsService.createApplicationUpdateNotification(
      app.applicantId,
      app.id,
      app.opportunityTitle,
      status
    );

    return { ...app };
  },

  async updateApplicationNotes(id: string, notes: string): Promise<Application | null> {
    const app = mockApplications.find((a) => a.id === id);
    if (!app) return null;
    app.notes = notes;
    app.updatedAt = new Date().toISOString();
    return { ...app };
  },

  async scheduleInterview(id: string, interviewDate: string): Promise<Application | null> {
    const app = mockApplications.find((a) => a.id === id);
    if (!app) return null;
    app.status = 'Interview';
    app.interviewDate = interviewDate;
    app.updatedAt = new Date().toISOString();
    return { ...app };
  },

  async getApplicationsByStatus(status: ApplicationStatus): Promise<Application[]> {
    return mockApplications.filter((a) => a.status === status);
  },

  async getApplicationStats(opportunityId?: string): Promise<{
    total: number;
    new: number;
    reviewing: number;
    shortlisted: number;
    interview: number;
    accepted: number;
    rejected: number;
  }> {
    const apps = opportunityId 
      ? mockApplications.filter((a) => a.opportunityId === opportunityId)
      : mockApplications;

    return {
      total: apps.length,
      new: apps.filter((a) => a.status === 'New').length,
      reviewing: apps.filter((a) => a.status === 'Reviewing' || a.status === 'Under Review').length,
      shortlisted: apps.filter((a) => a.status === 'Shortlisted').length,
      interview: apps.filter((a) => a.status === 'Interview').length,
      accepted: apps.filter((a) => a.status === 'Accepted').length,
      rejected: apps.filter((a) => a.status === 'Rejected').length,
    };
  },
};
