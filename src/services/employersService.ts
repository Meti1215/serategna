import { EmployerProfile, EmployerVerification } from '@/types';

export interface EmployerRegistrationData {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  password: string;
  businessType: string;
  location: string;
  region: string;
  address: string;
}

export interface EmployerVerificationDocuments {
  businessLicenseFile?: File;
  taxIdFile?: File;
  additionalDocuments?: File[];
}

// In-memory storage for demo purposes (replace with actual backend in production)
let mockEmployers: EmployerProfile[] = [
  {
    id: 'emp-1',
    name: 'Girma Tadesse',
    companyName: 'ABC Technology PLC',
    email: 'hiring@abc-tech.et',
    phone: '+251 91 190 2211',
    businessType: 'Corporate Enterprise',
    location: 'Addis Ababa',
    region: 'Addis Ababa',
    address: 'Bole Subcity, Woreda 3, Building 45',
    isVerified: true,
    verification: {
      businessLicenseUploaded: true,
      businessLicenseVerified: true,
      taxIdUploaded: true,
      taxIdVerified: true,
      additionalDocumentsUploaded: true,
      additionalDocumentsVerified: true,
      status: 'Verified',
      submittedAt: '2024-01-15T10:00:00Z',
      verifiedAt: '2024-01-20T14:30:00Z',
    },
    hasPostedFirstJob: true,
    freeUnlocksRemaining: 0,
    phoneUnlocksCount: 15,
    postedJobsCount: 8,
    postedInternshipsCount: 3,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z',
  },
  {
    id: 'emp-2',
    name: 'Selamawit Bekele',
    companyName: 'Ethiopian Construction Services',
    email: 'info@ethioconstruct.et',
    phone: '+251 91 234 5678',
    businessType: 'Private Limited Company (PLC)',
    location: 'Addis Ababa',
    region: 'Addis Ababa',
    address: 'Kirkos Subcity, Woreda 7',
    isVerified: false,
    verification: {
      businessLicenseUploaded: true,
      businessLicenseVerified: false,
      taxIdUploaded: true,
      taxIdVerified: false,
      additionalDocumentsUploaded: false,
      additionalDocumentsVerified: false,
      status: 'Pending Verification',
      submittedAt: '2024-02-01T09:00:00Z',
    },
    hasPostedFirstJob: false,
    freeUnlocksRemaining: 1,
    phoneUnlocksCount: 0,
    postedJobsCount: 0,
    postedInternshipsCount: 0,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
  },
];

export const employersService = {
  async registerEmployer(data: EmployerRegistrationData): Promise<EmployerProfile> {
    const newEmployer: EmployerProfile = {
      id: `emp-${Date.now()}`,
      name: data.fullName,
      companyName: data.companyName,
      email: data.email,
      phone: data.phone,
      businessType: data.businessType,
      location: data.location,
      region: data.region,
      address: data.address,
      isVerified: false,
      verification: {
        businessLicenseUploaded: false,
        businessLicenseVerified: false,
        taxIdUploaded: false,
        taxIdVerified: false,
        additionalDocumentsUploaded: false,
        additionalDocumentsVerified: false,
        status: 'Not Started',
      },
      hasPostedFirstJob: false,
      freeUnlocksRemaining: 0,
      phoneUnlocksCount: 0,
      postedJobsCount: 0,
      postedInternshipsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockEmployers.push(newEmployer);
    return newEmployer;
  },

  async getEmployerById(id: string): Promise<EmployerProfile | null> {
    return mockEmployers.find((e) => e.id === id) || null;
  },

  async getEmployerByEmail(email: string): Promise<EmployerProfile | null> {
    return mockEmployers.find((e) => e.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getAllEmployers(): Promise<EmployerProfile[]> {
    return [...mockEmployers];
  },

  async getPendingVerifications(): Promise<EmployerProfile[]> {
    return mockEmployers.filter(
      (e) => e.verification.status === 'Pending Verification' || e.verification.status === 'Document Uploaded'
    );
  },

  async submitVerificationDocuments(
    employerId: string,
    documents: EmployerVerificationDocuments
  ): Promise<EmployerProfile> {
    const employer = mockEmployers.find((e) => e.id === employerId);
    if (!employer) {
      throw new Error('Employer not found');
    }

    const updatedVerification: EmployerVerification = {
      ...employer.verification,
      businessLicenseUploaded: !!documents.businessLicenseFile,
      taxIdUploaded: !!documents.taxIdFile,
      additionalDocumentsUploaded: (documents.additionalDocuments?.length || 0) > 0,
      status: 'Pending Verification',
      submittedAt: new Date().toISOString(),
    };

    employer.verification = updatedVerification;
    employer.updatedAt = new Date().toISOString();

    return employer;
  },

  async approveEmployerVerification(
    employerId: string,
    approvedBy: string
  ): Promise<EmployerProfile> {
    const employer = mockEmployers.find((e) => e.id === employerId);
    if (!employer) {
      throw new Error('Employer not found');
    }

    employer.verification = {
      businessLicenseUploaded: true,
      businessLicenseVerified: true,
      taxIdUploaded: true,
      taxIdVerified: true,
      additionalDocumentsUploaded: employer.verification.additionalDocumentsUploaded,
      additionalDocumentsVerified: true,
      status: 'Verified',
      submittedAt: employer.verification.submittedAt,
      verifiedAt: new Date().toISOString(),
    };

    employer.isVerified = true;
    employer.updatedAt = new Date().toISOString();

    return employer;
  },

  async rejectEmployerVerification(
    employerId: string,
    reason: string,
    rejectedBy: string
  ): Promise<EmployerProfile> {
    const employer = mockEmployers.find((e) => e.id === employerId);
    if (!employer) {
      throw new Error('Employer not found');
    }

    employer.verification = {
      ...employer.verification,
      status: 'Document Uploaded',
      rejectionReason: reason,
    };

    employer.isVerified = false;
    employer.updatedAt = new Date().toISOString();

    return employer;
  },

  async updateEmployerProfile(
    id: string,
    updates: Partial<Omit<EmployerProfile, 'id' | 'createdAt' | 'verification'>>
  ): Promise<EmployerProfile> {
    const employer = mockEmployers.find((e) => e.id === id);
    if (!employer) {
      throw new Error('Employer not found');
    }

    Object.assign(employer, updates);
    employer.updatedAt = new Date().toISOString();

    return employer;
  },

  async incrementPostedJobs(employerId: string): Promise<{ isFirstJob: boolean; freeUnlockGranted: boolean }> {
    const employer = mockEmployers.find((e) => e.id === employerId);
    if (!employer) {
      throw new Error('Employer not found');
    }

    const wasFirstJob = !employer.hasPostedFirstJob;
    employer.postedJobsCount += 1;

    if (wasFirstJob) {
      employer.hasPostedFirstJob = true;
      employer.freeUnlocksRemaining = 1; // Grant 1 free unlock for first job
    }

    employer.updatedAt = new Date().toISOString();

    return {
      isFirstJob: wasFirstJob,
      freeUnlockGranted: wasFirstJob,
    };
  },

  async incrementPostedInternships(employerId: string): Promise<{ isFirstJob: boolean; freeUnlockGranted: boolean }> {
    const employer = mockEmployers.find((e) => e.id === employerId);
    if (!employer) {
      throw new Error('Employer not found');
    }

    const wasFirstJob = !employer.hasPostedFirstJob;
    employer.postedInternshipsCount += 1;

    if (wasFirstJob) {
      employer.hasPostedFirstJob = true;
      employer.freeUnlocksRemaining = 1; // Grant 1 free unlock for first job
    }

    employer.updatedAt = new Date().toISOString();

    return {
      isFirstJob: wasFirstJob,
      freeUnlockGranted: wasFirstJob,
    };
  },

  async canUnlockPhone(employerId: string): Promise<{ canUnlock: boolean; reason?: string }> {
    const employer = mockEmployers.find((e) => e.id === employerId);
    if (!employer) {
      return { canUnlock: false, reason: 'Employer not found' };
    }

    if (!employer.hasPostedFirstJob) {
      return {
        canUnlock: false,
        reason: 'You must post at least one job or internship before unlocking worker phone numbers.',
      };
    }

    if (employer.freeUnlocksRemaining > 0) {
      return { canUnlock: true };
    }

    return {
      canUnlock: true,
      reason: 'Payment required (100 ETB per unlock)',
    };
  },

  async recordPhoneUnlock(employerId: string, useFreeUnlock: boolean = false): Promise<void> {
    const employer = mockEmployers.find((e) => e.id === employerId);
    if (!employer) {
      throw new Error('Employer not found');
    }

    if (!employer.hasPostedFirstJob) {
      throw new Error('Employer must post at least one job before unlocking phone numbers');
    }

    if (useFreeUnlock && employer.freeUnlocksRemaining > 0) {
      employer.freeUnlocksRemaining -= 1;
    }

    employer.phoneUnlocksCount += 1;
    employer.updatedAt = new Date().toISOString();
  },
};
