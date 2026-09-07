'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { workersService } from '@/services/workersService';
import { workerProfilesService } from '@/services/workerProfilesService';
import { reviewsService } from '@/services/reviewsService';
import { WorkerProfile, Review, PublicWorkerProfile, SkillLevel, LanguageProficiency } from '@/types';
import { VerificationBadge, RatingStars } from '@/components/common/VerificationBadge';
import { UnlockPhoneModal } from '@/components/workers/UnlockPhoneModal';
import { useUnlock } from '@/context/UnlockContext';
import { useSaved } from '@/context/SavedContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Award,
  ShieldCheck,
  Lock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Bookmark,
  Share2,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Flag,
  Languages as LangIcon,
  GraduationCap,
  Building2,
  Pin,
  Clock,
  Star,
} from 'lucide-react';

function availabilityColor(type?: string): string {
  if (type === 'available_now' || type === 'Immediately' || type === 'Available Now') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (type === 'currently_employed' || type === 'Currently Employed') return 'bg-amber-100 text-amber-800 border-amber-200';
  if (type === 'available_from_date' || type === 'Full-time' || type === 'Part-time' || type === 'Contract') return 'bg-sky-100 text-sky-800 border-sky-200';
  if (type === 'not_available' || type === 'Not Available') return 'bg-slate-100 text-slate-700 border-slate-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function skillColor(level: SkillLevel | string): string {
  switch (level) {
    case 'Beginner':
      return 'bg-slate-100 text-slate-800 border-slate-200';
    case 'Intermediate':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'Advanced':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'Expert':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
}

function languageColor(p: LanguageProficiency | string): string {
  switch (p) {
    case 'Native':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'Fluent':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'Intermediate':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'Basic':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

type ProfileUnion =
  | { source: 'new'; data: PublicWorkerProfile }
  | { source: 'legacy'; data: WorkerProfile };

export default function WorkerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const workerId = resolvedParams.id;
  const { role } = useAuth();

  const [profile, setProfile] = useState<ProfileUnion | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'history' | 'certificates' | 'reviews'>('about');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportedReviewId, setReportedReviewId] = useState<string | null>(null);

  const { isWorkerUnlocked } = useUnlock();
  const { isSavedWorker, toggleSaveWorker } = useSaved();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      // First try new service (approved public profiles only)
      const newer = await workerProfilesService.getPublicProfileById(workerId);
      if (newer) {
        setProfile({ source: 'new', data: newer });
      } else {
        // Fall back to legacy mock data
        const legacy = await workersService.getWorkerById(workerId);
        if (legacy) {
          setProfile({ source: 'legacy', data: legacy });
        } else {
          setProfile(null);
        }
      }
      const revs = await reviewsService.getReviewsForWorker(workerId);
      setReviews(revs);
      setIsLoading(false);
    }
    loadData();
  }, [workerId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Loading verified profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    notFound();
  }

  // Helper accessors — unified across legacy and new
  const id = profile.source === 'new' ? profile.data.id : profile.data.id;
  const fullName = profile.source === 'new' ? profile.data.fullName : profile.data.fullName;
  const avatar = profile.source === 'new' ? profile.data.avatar : profile.data.avatar;
  const city = profile.source === 'new' ? profile.data.city : profile.data.city;
  const region = profile.source === 'new' ? profile.data.region : profile.data.region;
  const jobTitle = profile.source === 'new' ? profile.data.jobTitle : profile.data.profession;
  const jobCategory = profile.source === 'new' ? profile.data.jobCategory : profile.data.category;
  const aboutBio = profile.source === 'new' ? profile.data.aboutBio : profile.data.bio;
  const yearsOfExperience = profile.source === 'new' ? profile.data.yearsOfExperience : profile.data.experienceYears;
  const rating = profile.source === 'new' ? profile.data.rating : profile.data.rating;
  const totalReviews = profile.source === 'new' ? profile.data.totalReviews : profile.data.totalReviews;
  const ratingsBreakdown = profile.source === 'new' ? profile.data.ratingsBreakdown : profile.data.ratingsBreakdown;
  const isFeatured = profile.source === 'new' ? profile.data.isFeatured : profile.data.isFeatured;
  const isSponsored = profile.source === 'new' ? profile.data.isSponsored : profile.data.isSponsored;
  const isPhoneVerified = profile.source === 'new' ? profile.data.isPhoneVerified : profile.data.isPhoneVerified;
  const isEmployerVerified = profile.source === 'new' ? profile.data.isEmployerVerified : profile.data.isEmployerVerified;
  const verificationStatus = profile.source === 'new' ? profile.data.verificationStatus : profile.data.verificationStatus;

  // Availability
  const availabilityDisplay =
    profile.source === 'new'
      ? profile.data.availabilityDisplay
      : profile.data.availability;
  const availabilityType = profile.source === 'new' ? profile.data.availability.type : profile.data.availability;

  // Salary display
  const salaryPublicDisplay =
    profile.source === 'new'
      ? profile.data.salaryPublicDisplay
      : profile.data.expectedSalary;

  // Preferred location
  const preferredLocationSummary =
    profile.source === 'new'
      ? profile.data.preferredLocationSummary
      : profile.data.preferredLocation;

  // Skills
  const skillsArr =
    profile.source === 'new'
      ? profile.data.mainSkills.map((s) => ({ name: s.name, level: s.level }))
      : profile.data.skills.map((s) => ({ name: s, level: 'Intermediate' as SkillLevel }));

  // Languages
  const languagesArr =
    profile.source === 'new'
      ? profile.data.languagesDisplay
      : profile.data.languages.map((l) => ({ language: l, proficiency: 'Intermediate' as LanguageProficiency }));

  // Experience timeline
  const experienceTimeline =
    profile.source === 'new'
      ? profile.data.experienceSummary
      : profile.data.workHistory.map((w) => ({ company: w.company, role: w.role, duration: w.duration }));
  const experienceFull =
    profile.source === 'new'
      ? null
      : profile.data.workHistory;

  // Education
  const educationArr =
    profile.source === 'new'
      ? profile.data.educationSummary
      : profile.data.education.map((e) => ({ institution: e.institution, qualification: e.degree, year: e.year }));

  // Certificates
  const certificatesArr =
    profile.source === 'new'
      ? profile.data.publicCertificates
      : profile.data.certificates.map((c) => ({ name: c.title, issuer: c.issuer, issueDate: c.year }));

  // Projects (legacy only)
  const projects = profile.source === 'legacy' ? profile.data.projects : undefined;

  const isUnlocked = isWorkerUnlocked(id);
  const isSaved = isSavedWorker(id);

  // When opening unlock modal, build a minimal WorkerProfile-compatible object
  const modalWorker =
    profile.source === 'new'
      ? // Use service to get the unlocked phone view via separate check if employer already unlocked
        ({
          id: profile.data.id,
          fullName: profile.data.fullName,
          phone: isUnlocked ? '(unlocked — see details after modal)' : '',
          avatar: profile.data.avatar,
          profession: profile.data.jobTitle,
        } as unknown as WorkerProfile)
      : profile.data;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link Copied', 'Profile link copied to clipboard.', 'info');
  };

  const handleReportReview = async () => {
    if (!reportedReviewId || !reportReason) return;
    await reviewsService.reportReview(reportedReviewId, reportReason);
    setReportModalOpen(false);
    setReportReason('');
    setReportedReviewId(null);
    showToast('Report Submitted', 'Our trust & safety team has received your report for review.', 'info');
  };

  const handleContactWorker = async () => {
    if (role !== 'employer' && role !== 'admin') {
      showToast('Sign in as Employer', 'Please sign in or register as an employer to contact workers.', 'info');
      return;
    }
    setShowUnlockModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-700">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href="/workers" className="hover:text-emerald-700">
            Workers
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-semibold truncate">{fullName}</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden mb-8">
          {/* Job category accent */}
          {jobCategory && (
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-emerald-50 blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70 pointer-events-none" />
          )}

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src={avatar ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                  alt={fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-lg bg-slate-100"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
                  }}
                />
                {verificationStatus.status === 'Verified' && (
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 border-2 border-white text-white">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 break-words">{fullName}</h1>
                  {isFeatured && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                  {isSponsored && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-200">
                      Sponsored
                    </span>
                  )}
                </div>

                <p className="text-base font-semibold text-emerald-800">
                  {jobTitle}
                  {jobCategory && (
                    <span className="text-slate-400 font-normal ml-1.5">• {jobCategory}</span>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                  {(city || region) && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {[city, region].filter(Boolean).join(', ')}
                    </span>
                  )}
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {yearsOfExperience} {yearsOfExperience === 1 ? 'Year' : 'Years'} Experience
                  </span>
                  <span>•</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${availabilityColor(availabilityType)}`}>
                    <Clock className="w-3 h-3" />
                    {availabilityDisplay}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <RatingStars rating={rating} totalReviews={totalReviews ?? 0} />
                  <VerificationBadge
                    status={verificationStatus.status}
                    isPhoneVerified={isPhoneVerified}
                    isEmployerVerified={isEmployerVerified}
                  />
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSaveWorker(id)}
                  className={`p-2.5 rounded-xl border transition flex items-center justify-center gap-1.5 text-xs font-semibold ${
                    isSaved
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5 text-xs font-semibold"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              {/* PHONE PRIVACY CTA BUTTON — Phone number NEVER rendered publicly */}
              {isUnlocked ? (
                <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-400 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      Unlocked Contact
                    </span>
                    <p className="text-xs font-bold text-emerald-900">
                      Click below to call or message
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <button
                    onClick={handleContactWorker}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Contact Worker — Unlock Phone</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>100 ETB • Instant reveal • Telebirr / Chapa / CBE</span>
                  </p>
                  {/* Critical phone privacy assertion: NO phone data rendered in this branch */}
                </div>
              )}
            </div>
          </div>

          {/* Completion + Salary line */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Verified Professional Profile
                </p>
                <p className="text-[11px] text-slate-500">
                  Information validated by Serategna Trust & Safety team.
                </p>
              </div>
            </div>

            {salaryPublicDisplay && (
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  <span>Expected: {salaryPublicDisplay}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Tabs & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2-column detail tabs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-x-auto">
              {[
                { key: 'about', label: 'About & Skills' },
                { key: 'history', label: 'Work & Education' },
                { key: 'certificates', label: 'Certificates' },
                { key: 'reviews', label: `Reviews (${reviews.length})` },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as 'about' | 'history' | 'certificates' | 'reviews')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    activeTab === t.key
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB 1: About & Skills */}
            {activeTab === 'about' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8">
                {aboutBio && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                      Professional Biography
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {aboutBio}
                    </p>
                  </div>
                )}

                {skillsArr.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                      Verified Competencies & Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillsArr.map((skill, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${skillColor(skill.level)}`}
                        >
                          <span>{skill.name}</span>
                          <span className="text-[9px] uppercase tracking-wider opacity-75">{skill.level}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {languagesArr.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                      Languages Spoken
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {languagesArr.map((lang, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${languageColor(lang.proficiency)}`}
                        >
                          <LangIcon className="w-3.5 h-3.5 opacity-70" />
                          <span>{lang.language}</span>
                          <span className="text-[9px] uppercase tracking-wider opacity-75">
                            {lang.proficiency}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {preferredLocationSummary && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                      Preferred Work Location
                    </h3>
                    <div className="flex items-start gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <Pin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-slate-800">{preferredLocationSummary}</p>
                    </div>
                  </div>
                )}

                {projects && projects.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                      Notable Projects & Portfolio
                    </h3>
                    <div className="space-y-3">
                      {projects.map((proj, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200"
                        >
                          <h4 className="font-bold text-xs text-slate-900">{proj.title}</h4>
                          <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline mt-2"
                            >
                              <span>View Project Details</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!aboutBio && skillsArr.length === 0 && languagesArr.length === 0 && !preferredLocationSummary && (
                  <div className="text-center py-8 text-slate-400">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No information available yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Work History & Education */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8">
                {experienceTimeline.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
                      Employment Timeline
                    </h3>
                    <div className="space-y-6 relative border-l-2 border-slate-200 pl-4 ml-2">
                      {experienceTimeline.map((item, idx) => {
                        const full = experienceFull?.[idx];
                        return (
                          <div key={idx} className="relative">
                            <div className="w-3 h-3 rounded-full bg-emerald-600 absolute -left-[23px] top-1.5 border-2 border-white ring-2 ring-emerald-200" />
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h4 className="font-bold text-sm text-slate-900">{item.role}</h4>
                              <span className="text-xs text-slate-400 font-medium">{item.duration}</span>
                            </div>
                            <p className="text-xs font-semibold text-emerald-800 mt-0.5 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5" />
                              {item.company}
                            </p>
                            {full?.description && (
                              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                {full.description}
                              </p>
                            )}
                            {full?.verifiedByEmployer && (
                              <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Employment record verified by employer</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {educationArr.length > 0 && (
                  <div className={experienceTimeline.length > 0 ? 'pt-6 border-t border-slate-100' : ''}>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
                      Education & Vocational Training
                    </h3>
                    <div className="space-y-4">
                      {educationArr.map((edu, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0">
                              <GraduationCap className="w-4 h-4 text-emerald-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-bold text-xs text-slate-900">{edu.qualification}</h4>
                                {edu.year && <span className="text-[11px] text-slate-400 font-semibold whitespace-nowrap">{edu.year}</span>}
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">{edu.institution}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {experienceTimeline.length === 0 && educationArr.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Work history and education not yet added.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Certificates & Documents */}
            {activeTab === 'certificates' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Certificates & Licenses
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Only public certificates shared by the worker are displayed.
                    </p>
                  </div>
                </div>

                {certificatesArr.length > 0 ? (
                  <div className="space-y-4">
                    {certificatesArr.map((cert, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shrink-0">
                            <Award className="w-5 h-5 text-emerald-700" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{cert.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Issued by: <span className="font-medium text-slate-700">{cert.issuer}</span>
                              {cert.issueDate ? ` • ${cert.issueDate}` : ''}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0 self-start sm:self-center">
                          <FileText className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Public Document</span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No public certificates shared yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Reviews & Ratings */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                    Verified Employer Reviews
                  </h3>
                  <p className="text-xs text-slate-500">
                    Only employers who have hired or interacted with {fullName} can submit reviews.
                  </p>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-slate-900">{rev.employerName}</h4>
                              {rev.employerCompany && (
                                <span className="text-[11px] text-slate-500">
                                  ({rev.employerCompany})
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                              Job: {rev.jobTitle}
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <Star
                                  key={n}
                                  className={`w-3.5 h-3.5 ${
                                    n <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-1">{rev.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{rev.date}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed italic">
                          &ldquo;{rev.comment}&rdquo;
                        </p>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 text-[11px]">
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified Employer Feedback</span>
                          </span>
                          <button
                            onClick={() => {
                              setReportedReviewId(rev.id);
                              setReportModalOpen(true);
                            }}
                            className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition"
                          >
                            <Flag className="w-3 h-3" />
                            <span>Report Review</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-slate-300" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">No reviews yet</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Be the first employer to work with {fullName.split(' ')[0]} and leave a review.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Rating Breakdown Card & Trust Safeguards */}
          <div className="space-y-6">
            {/* Rating Breakdown Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Ratings Performance</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">out of 5.0</span>
              </div>

              <RatingStars rating={rating} totalReviews={totalReviews ?? 0} showCount={true} />

              {/* Sub-criteria bars */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                {[
                  { label: 'Work Quality', score: ratingsBreakdown.workQuality },
                  { label: 'Reliability', score: ratingsBreakdown.reliability },
                  { label: 'Professionalism', score: ratingsBreakdown.professionalism },
                  { label: 'Punctuality', score: ratingsBreakdown.punctuality },
                  { label: 'Communication', score: ratingsBreakdown.communication },
                ].map((crit, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                      <span>{crit.label}</span>
                      <span className="font-bold text-slate-900">{crit.score.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${(crit.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {totalReviews === 0 && (
                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                  Waiting for verified employer reviews.
                </div>
              )}
            </div>

            {/* Availability quick card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Availability</h3>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${availabilityColor(availabilityType)}`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{availabilityDisplay}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Hire {fullName.split(' ')[0]} now — availability updates in real time as the worker accepts new contracts.
              </p>
            </div>

            {/* Phone Unlock Guarantee Notice */}
            <div className="p-5 rounded-3xl bg-emerald-950 text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Serategna Contact Guarantee</span>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                When you unlock a worker for 100 ETB, you get direct access to their personal phone. If the
                worker&rsquo;s phone is disconnected or unresponsive, our support team provides an instant credit refund.
              </p>
              <div className="pt-2 border-t border-emerald-900 flex justify-between items-center text-[11px] text-emerald-300">
                <span>Chapa • Telebirr • CBE</span>
                <span className="font-bold text-white">100 ETB Fixed</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Unlock Phone Modal */}
      <UnlockPhoneModal
        worker={modalWorker}
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
      />

      {/* Report Review Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">Report Review</h3>
            <p className="text-xs text-slate-600 mb-4">
              Please specify why you are reporting this review. Our administration team will investigate according to Serategna platform moderation standards.
            </p>
            <textarea
              rows={3}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="e.g. Abusive language, false claims, defamatory remarks..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReportReview}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
