export type UserRole = 'guest' | 'worker' | 'employer' | 'admin';

export interface RatingsBreakdown {
  overall: number;
  workQuality: number;
  reliability: number;
  professionalism: number;
  punctuality: number;
  communication: number;
}

export interface WorkHistoryItem {
  company: string;
  role: string;
  duration: string;
  description: string;
  verifiedByEmployer?: boolean;
}

export interface EducationItem {
  institution: string;
  degree: string;
  year: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  documentUrl?: string;
  isIndependentlyVerified: boolean;
}

export interface ProjectItem {
  title: string;
  description: string;
  link?: string;
}

export interface WorkerVerification {
  phoneVerified: boolean;
  idUploaded: boolean;
  idVerified: boolean;
  certificatesUploaded: boolean;
  certificatesVerified: boolean;
  status: 'Verified' | 'Pending Verification' | 'Document Uploaded';
}

export interface WorkerProfile {
  id: string;
  fullName: string;
  profession: string;
  category: string;
  region: string;
  city: string;
  subCity?: string;
  avatar: string;
  bio: string;
  experienceYears: number;
  expectedSalary: string;
  hourlyRate?: number;
  availability: 'Immediately' | 'Full-time' | 'Part-time' | 'Weekends' | 'Contract';
  preferredLocation: string;
  phone: string; // The full phone number, masked by default in views
  email?: string;
  gender?: 'Male' | 'Female';
  rating: number;
  totalReviews: number;
  ratingsBreakdown: RatingsBreakdown;
  skills: string[];
  isPhoneVerified: boolean;
  isEmployerVerified: boolean;
  isFeatured: boolean;
  isSponsored: boolean;
  verificationStatus: WorkerVerification;
  workHistory: WorkHistoryItem[];
  education: EducationItem[];
  certificates: CertificateItem[];
  languages: string[];
  projects?: ProjectItem[];
  profileCompletion: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  isVerifiedCompany: boolean;
  category: string;
  location: string;
  region: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Remote';
  experienceLevel: 'Entry Level' | '1-3 Years' | '3-5 Years' | '5+ Years';
  salary: string; // e.g. "15,000 - 20,000 ETB / month"
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
  isFeatured: boolean;
  applicantsCount: number;
  status: 'Active' | 'Under Review' | 'Closed' | 'Draft';
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  isVerifiedCompany: boolean;
  field: string;
  location: string;
  region: string;
  workType: 'On-site' | 'Remote' | 'Hybrid';
  duration: string;
  compensation: 'Paid' | 'Unpaid';
  stipend?: string;
  educationLevel: 'Undergraduate' | 'Fresh Graduate' | 'TVET / Diploma' | 'All Levels';
  requiredSkills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
  numberOfInterns: number;
  isFeatured: boolean;
  applicantsCount: number;
  status: 'Active' | 'Under Review' | 'Closed';
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Accepted'
  | 'Rejected';

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: 'job' | 'internship';
  companyName: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar?: string;
  applicantProfession?: string;
  applicantEmail: string;
  applicantPhone: string;
  coverLetter?: string;
  cvFileName?: string;
  appliedDate: string;
  status: ApplicationStatus;
  notes?: string;
  interviewDate?: string;
}

export interface Review {
  id: string;
  workerId: string;
  employerId: string;
  employerName: string;
  employerCompany?: string;
  employerAvatar?: string;
  rating: number;
  ratingsBreakdown: RatingsBreakdown;
  comment: string;
  jobTitle: string;
  date: string;
  isReported?: boolean;
  reportReason?: string;
  reportStatus?: 'pending' | 'resolved' | 'dismissed';
}

export interface PhoneUnlockTransaction {
  id: string;
  employerId: string;
  employerName: string;
  workerId: string;
  workerName: string;
  workerProfession: string;
  unlockedPhone: string;
  amount: number; // 100 ETB or 0 for free unlock
  currency: 'ETB';
  paymentMethod: 'Chapa' | 'Telebirr' | 'CBE' | 'Free First Unlock';
  reference: string;
  date: string;
  status: 'Paid' | 'Failed' | 'Pending';
}

export interface EmployerProfile {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  businessType: string;
  location: string;
  region: string;
  isVerified: boolean;
  hasPostedFirstJob: boolean;
  freeUnlocksRemaining: number;
  phoneUnlocksCount: number;
  postedJobsCount: number;
  postedInternshipsCount: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category:
    | 'Employment News'
    | 'Career Advice'
    | 'Job Market'
    | 'Worker Rights'
    | 'Employer Advice'
    | 'Training Opportunities'
    | 'Recruitment Tips'
    | 'Platform Announcements';
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
  isFeatured: boolean;
  tags: string[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  workerCount: number;
  jobCount: number;
  internshipCount: number;
  isPopular: boolean;
}

export interface RegionItem {
  id: string;
  name: string;
  amharicName: string;
  capital: string;
  majorCities: string[];
  activeWorkers: number;
  activeJobs: number;
}

export interface PlatformReport {
  id: string;
  reporterName: string;
  reporterRole: string;
  targetType: 'worker' | 'job' | 'employer' | 'review';
  targetId: string;
  targetTitle: string;
  reason: string;
  details: string;
  date: string;
  status: 'Pending' | 'Investigating' | 'Resolved' | 'Dismissed';
}
