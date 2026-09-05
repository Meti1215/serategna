'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { workersService } from '@/services/workersService';
import { reviewsService } from '@/services/reviewsService';
import { WorkerProfile, Review } from '@/types';
import { VerificationBadge, RatingStars } from '@/components/common/VerificationBadge';
import { UnlockPhoneModal } from '@/components/workers/UnlockPhoneModal';
import { useUnlock } from '@/context/UnlockContext';
import { useSaved } from '@/context/SavedContext';
import { useToast } from '@/context/ToastContext';
import {
  MapPin,
  Briefcase,
  Calendar,
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
  Copy,
  ExternalLink,
  Flag,
} from 'lucide-react';

export default function WorkerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const workerId = resolvedParams.id;

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
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
      const data = await workersService.getWorkerById(workerId);
      if (data) {
        setWorker(data);
        const revs = await reviewsService.getReviewsForWorker(workerId);
        setReviews(revs);
      }
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

  if (!worker) {
    notFound();
  }

  const isUnlocked = isWorkerUnlocked(worker.id);
  const isSaved = isSavedWorker(worker.id);

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
          <span className="text-slate-900 font-semibold truncate">{worker.fullName}</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src={worker.avatar}
                  alt={worker.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 border-2 border-white text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {worker.fullName}
                  </h1>
                  {worker.isFeatured && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                <p className="text-base font-semibold text-emerald-800">{worker.profession}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {worker.city}, {worker.region}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {worker.experienceYears} Years Experience
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    Available: {worker.availability}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <RatingStars rating={worker.rating} totalReviews={worker.totalReviews} />
                  <VerificationBadge
                    status={worker.verificationStatus.status}
                    isPhoneVerified={worker.isPhoneVerified}
                    isEmployerVerified={worker.isEmployerVerified}
                  />
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSaveWorker(worker.id)}
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

              {/* PHONE PRIVACY CTA BUTTON */}
              {isUnlocked ? (
                <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-400 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      Unlocked Contact
                    </span>
                    <a
                      href={`tel:${worker.phone}`}
                      className="font-mono text-sm font-extrabold text-emerald-950 hover:underline"
                    >
                      {worker.phone}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <button
                    onClick={() => setShowUnlockModal(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Unlock Phone Number — 100 ETB</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Instant reveal • Telebirr / Chapa / CBE</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Profile Completion Indicator */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                {worker.profileCompletion}%
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Profile {worker.profileCompletion}% Complete
                </p>
                <p className="text-[11px] text-slate-500">
                  Identity and TVET occupational competency certificates verified.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1 font-semibold text-slate-800">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <span>Expected Rate: {worker.expectedSalary}</span>
              </div>
            </div>
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
                { key: 'history', label: 'Work History' },
                { key: 'certificates', label: 'Certificates & Documents' },
                { key: 'reviews', label: `Reviews (${reviews.length})` },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as any)}
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
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                    Professional Biography
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {worker.bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                    Verified Competencies & Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/60"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                    Languages Spoken
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {worker.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100"
                      >
                        🗣️ {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {worker.projects && worker.projects.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                      Notable Projects & Portfolio
                    </h3>
                    <div className="space-y-3">
                      {worker.projects.map((proj, idx) => (
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
              </div>
            )}

            {/* TAB 2: Work History & Education */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
                    Employment Timeline
                  </h3>
                  <div className="space-y-6 relative border-l-2 border-slate-200 pl-4 ml-2">
                    {worker.workHistory.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="w-3 h-3 rounded-full bg-emerald-600 absolute -left-[23px] top-1.5 border-2 border-white ring-2 ring-emerald-200" />
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900">{item.role}</h4>
                          <span className="text-xs text-slate-400 font-medium">{item.duration}</span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-800 mt-0.5">{item.company}</p>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {item.description}
                        </p>
                        {item.verifiedByEmployer && (
                          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Employment record verified by employer</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
                    Education & Vocational Training
                  </h3>
                  <div className="space-y-4">
                    {worker.education.map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900">{edu.degree}</h4>
                          <span className="text-[11px] text-slate-400 font-semibold">{edu.year}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>
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
                      Distinguishing uploaded documents from independently verified credentials.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {worker.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shrink-0">
                          <FileText className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{cert.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Issued by: <span className="font-medium text-slate-700">{cert.issuer}</span> • {cert.year}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {cert.isIndependentlyVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Independently Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                            <FileText className="w-3.5 h-3.5 text-amber-700" />
                            <span>Document Uploaded (Audit In Progress)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                    Only employers who have hired or interacted with {worker.fullName} can submit reviews.
                  </p>
                </div>

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
                          <div className="text-amber-500 text-xs font-bold">
                            {'★'.repeat(rev.rating)} ({rev.rating}.0)
                          </div>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{rev.comment}"
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
              </div>
            )}
          </div>

          {/* Right Column: Rating Breakdown Card & Trust Safeguards */}
          <div className="space-y-6">
            {/* Rating Breakdown Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Ratings Performance</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{worker.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">out of 5.0</span>
              </div>

              {/* Sub-criteria bars */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                {[
                  { label: 'Work Quality', score: worker.ratingsBreakdown.workQuality },
                  { label: 'Reliability', score: worker.ratingsBreakdown.reliability },
                  { label: 'Professionalism', score: worker.ratingsBreakdown.professionalism },
                  { label: 'Punctuality', score: worker.ratingsBreakdown.punctuality },
                  { label: 'Communication', score: worker.ratingsBreakdown.communication },
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
            </div>

            {/* Phone Unlock Guarantee Notice */}
            <div className="p-5 rounded-3xl bg-emerald-950 text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Serategna Contact Guarantee</span>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                When you unlock a worker for 100 ETB, you get direct access to their personal phone. If the
                worker's phone is disconnected or unresponsive, our support team provides an instant credit refund.
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
        worker={worker}
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
