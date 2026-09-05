import { Application, ApplicationStatus } from '@/types';

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
    coverLetter: 'I have 7 years experience in industrial power installations and Tier-3 backup generators matching Ethio Telecom requirements.',
    cvFileName: 'Abebe_Kebede_COC_IV_CV.pdf',
    appliedDate: '2026-09-02',
    status: 'Shortlisted',
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
    coverLetter: 'Passionate about Next.js and payment API integrations. Built several fullstack applications.',
    cvFileName: 'Selamawit_Tadesse_Software_CV.pdf',
    appliedDate: '2026-09-03',
    status: 'Interview',
    interviewDate: '2026-09-10 14:00',
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
    coverLetter: 'Valid Grade 3 commercial license with 8 years clean accident-free driving record.',
    cvFileName: 'Mohammed_Ali_Grade3_License.pdf',
    appliedDate: '2026-09-01',
    status: 'Under Review',
  },
];

export const applicationsService = {
  async getApplications(userId?: string, role?: 'worker' | 'employer' | 'admin'): Promise<Application[]> {
    if (role === 'worker' && userId) {
      return mockApplications.filter((a) => a.applicantId === userId);
    }
    return [...mockApplications];
  },

  async submitApplication(
    newApp: Omit<Application, 'id' | 'appliedDate' | 'status'>
  ): Promise<Application> {
    const app: Application = {
      ...newApp,
      id: `app-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
    };
    mockApplications.unshift(app);
    return app;
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<Application | null> {
    const app = mockApplications.find((a) => a.id === id);
    if (!app) return null;
    app.status = status;
    return { ...app };
  },
};
