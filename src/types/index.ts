export type UserRole = 'guest' | 'worker' | 'employer' | 'admin';

export type PaymentMethod = 'chapa' | 'telebirr' | 'cbe' | 'other';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  employerId: string;
  employerName: string;
  workerId: string;
  workerName: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  description: string;
  createdAt: string;
  completedAt?: string;
}

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
  featuredStartDate?: string;
  featuredEndDate?: string;
  featuredPriority?: number;
  featuredIsActive?: boolean;
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
  featuredStartDate?: string;
  featuredEndDate?: string;
  featuredPriority?: number;
  featuredIsActive?: boolean;
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
  | 'New'
  | 'Applied'
  | 'Reviewing'
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
  applicantLocation?: string;
  applicantRegion?: string;
  applicantExperience?: string;
  applicantSkills?: string[];
  applicantRating?: number;
  applicantTotalReviews?: number;
  coverLetter?: string;
  cvFileName?: string;
  cvFileUrl?: string;
  certificates?: string[];
  appliedDate: string;
  status: ApplicationStatus;
  notes?: string;
  interviewDate?: string;
  updatedAt?: string;
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

export interface EmployerVerification {
  businessLicenseUploaded: boolean;
  businessLicenseVerified: boolean;
  taxIdUploaded: boolean;
  taxIdVerified: boolean;
  additionalDocumentsUploaded: boolean;
  additionalDocumentsVerified: boolean;
  status: 'Verified' | 'Pending Verification' | 'Document Uploaded' | 'Not Started';
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
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
  address: string;
  isVerified: boolean;
  verification: EmployerVerification;
  hasPostedFirstJob: boolean;
  freeUnlocksRemaining: number;
  phoneUnlocksCount: number;
  postedJobsCount: number;
  postedInternshipsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type NewsCategory =
  | 'Employment News'
  | 'Career Advice'
  | 'Job Market'
  | 'Worker Rights'
  | 'Employer Advice'
  | 'Training Opportunities'
  | 'Recruitment Tips'
  | 'Platform Announcements';

export type NewsStatus = 'draft' | 'published' | 'unpublished';

export type AdvertisementType =
  | 'banner'
  | 'sponsored_worker'
  | 'sponsored_job'
  | 'featured_company'
  | 'featured_category';

export type AdvertisementStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'expired' | 'inactive';

export type AdvertisementLocation = 'homepage' | 'workers_page' | 'jobs_page' | 'sidebar' | 'footer';

export interface Advertisement {
  id: string;
  title: string;
  type: AdvertisementType;
  advertiserName: string;
  advertiserId?: string;
  imageUrl: string;
  destinationUrl: string;
  location: AdvertisementLocation;
  startDate: string;
  endDate: string;
  status: AdvertisementStatus;
  priority: number;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedWorker {
  workerId: string;
  isFeatured: boolean;
  featuredStartDate?: string;
  featuredEndDate?: string;
  priority: number;
  isActive: boolean;
}

export interface FeaturedJob {
  jobId: string;
  isFeatured: boolean;
  featuredStartDate?: string;
  featuredEndDate?: string;
  priority: number;
  isActive: boolean;
}

export type NotificationType =
  | 'matching_job'
  | 'application_update'
  | 'employer_message'
  | 'profile_approval'
  | 'review'
  | 'new_application'
  | 'matching_worker'
  | 'payment_confirmation'
  | 'phone_unlock'
  | 'system_announcement';

export type NotificationRole = 'worker' | 'employer' | 'admin' | 'all';

export interface Notification {
  id: string;
  userId: string;
  userRole: NotificationRole;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedRecordId?: string;
  relatedPage?: string;
  createdAt: string;
  readAt?: string;
}

export interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  matchingJobEnabled: boolean;
  applicationUpdateEnabled: boolean;
  messageEnabled: boolean;
  reviewEnabled: boolean;
  systemAnnouncementEnabled: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: NewsCategory;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  authorId?: string;
  date: string;
  readTime: string;
  isFeatured: boolean;
  tags: string[];
  status: NewsStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
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

// ==========================================
// NEW: Worker Profile Extended Types
// ==========================================

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface WorkerSkill {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface WorkerExperience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking: boolean;
  description?: string;
}

export interface WorkerEducation {
  id: string;
  institution: string;
  qualification: string;
  fieldOfStudy?: string;
  startYear?: string;
  graduationYear?: string;
  description?: string;
}

export interface WorkerTraining {
  id: string;
  title: string;
  provider: string;
  date?: string;
  duration?: string;
  description?: string;
  certificateFile?: WorkerUploadedFile;
}

export type LanguageProficiency = 'Native' | 'Fluent' | 'Intermediate' | 'Basic';

export interface WorkerLanguage {
  id: string;
  language: string;
  proficiency: LanguageProficiency;
}

export interface WorkerCertificate {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expiryDate?: string;
  file?: WorkerUploadedFile;
}

export type DocumentVisibility = 'public' | 'employers_only' | 'private';

export type DocumentCategory =
  | 'cv'
  | 'certificate'
  | 'training_certificate'
  | 'professional_license'
  | 'id'
  | 'supporting'
  | 'other';

export interface WorkerUploadedFile {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface WorkerDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  description?: string;
  file: WorkerUploadedFile;
  visibility: DocumentVisibility;
}

export type WorkerAvailabilityType =
  | 'available_now'
  | 'available_from_date'
  | 'currently_employed'
  | 'not_available';

export interface WorkerAvailability {
  type: WorkerAvailabilityType;
  availableFromDate?: string;
}

export type SalaryPeriod = 'per_day' | 'per_week' | 'per_month' | 'per_year' | 'negotiable';

export interface WorkerExpectedSalary {
  min?: number;
  max?: number;
  period: SalaryPeriod;
  currency: 'ETB';
  public: boolean;
}

export interface WorkerPreferredLocation {
  preferredRegion?: string;
  preferredCity?: string;
  additionalPreferredCities: string[];
  willingToRelocate: boolean;
}

export type WorkerProfileStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended';

export interface WorkerGenderIdentity {
  gender?: 'Male' | 'Female' | 'Prefer not to say';
  dateOfBirth?: string;
  maritalStatus?: 'Single' | 'Married' | 'Other' | 'Prefer not to say';
}

// Complete worker profile stored in backend (includes sensitive fields)
export interface FullWorkerProfile {
  id: string;
  userId: string;

  // ===== Basic Information (sensitive fields) =====
  fullName: string;
  avatar?: string; // data URL for profile photo
  phone: string;
  email?: string;
  genderIdentity: WorkerGenderIdentity;
  region?: string;
  city?: string;
  subCityWoreda?: string;
  address?: string;

  // ===== Professional Information =====
  jobTitle: string;
  jobCategory?: string;
  aboutBio?: string;
  yearsOfExperience: number;
  skills: WorkerSkill[];

  // ===== Experience, Education, Training =====
  workExperience: WorkerExperience[];
  education: WorkerEducation[];
  training: WorkerTraining[];

  // ===== Certificates & Languages =====
  certificates: WorkerCertificate[];
  languages: WorkerLanguage[];

  // ===== Availability & Salary =====
  availability: WorkerAvailability;
  expectedSalary: WorkerExpectedSalary;
  preferredLocation: WorkerPreferredLocation;

  // ===== Secure Documents =====
  documents: WorkerDocument[];

  // ===== Admin / Status =====
  profileStatus: WorkerProfileStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;

  // ===== Legacy rating fields (for backward compat with WorkerProfile display) =====
  rating: number;
  totalReviews: number;
  ratingsBreakdown: RatingsBreakdown;
  isFeatured: boolean;
  isSponsored: boolean;
  isPhoneVerified: boolean;
  isEmployerVerified: boolean;
  verificationStatus: WorkerVerification;
}

// Subset returned for LIST / CARD views (phone-number privacy, etc.)
export type PublicWorkerProfile = Pick<
  FullWorkerProfile,
  | 'id'
  | 'fullName'
  | 'avatar'
  | 'region'
  | 'city'
  | 'jobTitle'
  | 'jobCategory'
  | 'aboutBio'
  | 'yearsOfExperience'
  | 'availability'
  | 'profileStatus'
  | 'createdAt'
  | 'rating'
  | 'totalReviews'
  | 'ratingsBreakdown'
  | 'isFeatured'
  | 'isSponsored'
  | 'isPhoneVerified'
  | 'isEmployerVerified'
  | 'verificationStatus'
> & {
  mainSkills: { name: string; level: SkillLevel }[];
  preferredLocationSummary: string;
  availabilityDisplay: string;
  languagesDisplay: { language: string; proficiency: LanguageProficiency }[];
  educationSummary: { institution: string; qualification: string; year?: string }[];
  experienceSummary: { company: string; role: string; duration: string }[];
  publicCertificates: { name: string; issuer: string; issueDate?: string }[];
  documentsPublic: { id: string; title: string; category: DocumentCategory }[];
  salaryPublicDisplay?: string;
};

// Subset returned for UNLOCKED employers — includes phone (after payment verification)
export type UnlockedEmployerViewWorkerProfile = PublicWorkerProfile & {
  phone: string;
};

// Worker profile filter params
export interface WorkerProfileFilterParams {
  query?: string;
  category?: string;
  skill?: string;
  region?: string;
  city?: string;
  minExperience?: number;
  minRating?: number;
  availability?: WorkerAvailabilityType | 'All';
  workType?: string;
  verifiedOnly?: boolean;
  sortBy?: 'recommended' | 'rating' | 'experience' | 'newest';
}

// In-memory notification for worker profile events
export interface WorkerNotification {
  id: string;
  workerId: string;
  type:
    | 'profile_submitted'
    | 'profile_approved'
    | 'profile_rejected'
    | 'application_update'
    | 'employer_message'
    | 'announcement';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}
