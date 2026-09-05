'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { jobsService } from '@/services/jobsService';
import { Job } from '@/types';
import { ApplyModal } from '@/components/common/ApplyModal';
import { useSaved } from '@/context/SavedContext';
import { useToast } from '@/context/ToastContext';
import {
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  Bookmark,
  Share2,
  ChevronRight,
  Send,
  Building,
  CheckCircle,
} from 'lucide-react';

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const { isSavedJob, toggleSaveJob } = useSaved();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadJob() {
      setIsLoading(true);
      const data = await jobsService.getJobById(jobId);
      setJob(data);
      setIsLoading(false);
    }
    loadJob();
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    notFound();
  }

  const isSaved = isSavedJob(job.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link Copied', 'Job link copied to clipboard.', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-700">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href="/jobs" className="hover:text-emerald-700">
            Jobs
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-semibold truncate">{job.title}</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                  <span className="font-semibold text-slate-900">{job.company}</span>
                  {job.isVerifiedCompany && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Employer
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-800 font-bold">{job.employmentType}</span>
                  <span>•</span>
                  <span>Exp: {job.experienceLevel}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    Deadline: {job.deadline}
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => toggleSaveJob(job.id)}
                className={`p-3 rounded-xl border transition flex items-center justify-center gap-1.5 text-xs font-semibold ${
                  isSaved
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save Job'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-xs font-semibold"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setApplyModalOpen(true)}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply for this Job</span>
              </button>
            </div>
          </div>

          {/* Salary Highlight Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Monthly Compensation:</span>
              <span className="text-lg font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                💰 {job.salary}
              </span>
            </div>

            <span className="text-xs text-slate-400">
              {job.applicantsCount} active applicants • Posted on {job.postedDate}
            </span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                Job Overview
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                Key Responsibilities
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                Required Qualifications & Experience
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                Employee Benefits & Perks
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {job.benefits.map((b, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-medium text-slate-800">
                    🎁 {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">About the Employer</h3>
              <div className="flex items-center gap-3">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{job.company}</h4>
                  <p className="text-[11px] text-slate-500">{job.location}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Registered Ethiopian enterprise recruiting certified talent through Serategna.
              </p>
              <button
                onClick={() => setApplyModalOpen(true)}
                className="w-full py-3 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition"
              >
                Apply for Position
              </button>
            </div>
          </div>
        </div>
      </main>

      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        opportunityId={job.id}
        opportunityTitle={job.title}
        opportunityType="job"
        companyName={job.company}
      />

      <Footer />
    </div>
  );
}
