'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { mockApplications, applicationsService } from '@/services/applicationsService';
import { paymentsService } from '@/services/paymentsService';
import {
  Users,
  Lock,
  CreditCard,
  Briefcase,
  GraduationCap,
  FileCheck,
  Bookmark,
  PlusCircle,
  Gift,
  ArrowRight,
  Phone,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function EmployerDashboardPage() {
  const { employerProfile } = useAuth();
  const [totalPayments, setTotalPayments] = useState({ total: 0, count: 0 });
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const payments = await paymentsService.getTotalPayments(employerProfile.id);
      setTotalPayments(payments);

      const apps = await applicationsService.getApplications();
      setApplicationsCount(apps.length);
      setShortlistedCount(apps.filter(a => a.status === 'Shortlisted').length);
    }
    loadStats();
  }, [employerProfile.id]);

  const stats = [
    { label: 'Workers Viewed', value: '128', icon: Users, color: 'text-blue-600' },
    {
      label: 'Phone Unlocks',
      value: employerProfile.phoneUnlocksCount.toString(),
      icon: Lock,
      color: 'text-emerald-600',
    },
    { label: 'Total Payments', value: `${totalPayments.total} ETB`, icon: CreditCard, color: 'text-slate-800' },
    { label: 'Job Posts', value: employerProfile.postedJobsCount.toString(), icon: Briefcase, color: 'text-amber-600' },
    {
      label: 'Internship Posts',
      value: employerProfile.postedInternshipsCount.toString(),
      icon: GraduationCap,
      color: 'text-purple-600',
    },
    { label: 'Applications Received', value: applicationsCount.toString(), icon: FileCheck, color: 'text-indigo-600' },
    { label: 'Shortlisted Candidates', value: shortlistedCount.toString(), icon: CheckCircle2, color: 'text-emerald-700' },
    { label: 'Saved Workers', value: '2', icon: Bookmark, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* First-Job Rule Status Banner */}
      {!employerProfile.hasPostedFirstJob ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-500/15 via-amber-500/10 to-white border-2 border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-rose-500 text-white shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Post Your First Job to Unlock Features
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-200 text-rose-900">
                  Required
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                You must post at least one job or internship before you can unlock worker phone numbers. This ensures employers contribute to the marketplace.
              </p>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                🎁 Reward: <strong>1 Free Phone Unlock</strong> after your first job post!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/employer/jobs/new"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition"
            >
              Post Your First Job
            </Link>
          </div>
        </div>
      ) : employerProfile.freeUnlocksRemaining > 0 ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-amber-500/10 to-white border-2 border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500 text-white shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  First-Job Bonus Earned!
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200 text-emerald-900">
                  Available
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                You have{' '}
                <strong className="text-slate-900">
                  {employerProfile.freeUnlocksRemaining} Free Worker Phone Unlock
                </strong>{' '}
                ready to use (0 ETB) on your next candidate.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/workers"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition"
            >
              Use Free Unlock on Worker
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-500/15 via-slate-500/10 to-white border-2 border-slate-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-slate-500 text-white shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Phone Unlocks Available
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-900">
                  Paid
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Your free unlock has been used. Additional phone unlocks cost <strong>100 ETB each</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/workers"
              className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
            >
              Find Workers (100 ETB/unlock)
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{s.label}</span>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/employer/jobs/new"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900">Post a New Job</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Reach thousands of skilled trades</p>
          </div>
        </Link>

        <Link
          href="/employer/internships/new"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-500 hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="p-3 rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900">Post an Internship</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Connect with university students</p>
          </div>
        </Link>

        <Link
          href="/workers"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="p-3 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900">Find Workers Directly</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Unlock phone numbers for 100 ETB</p>
          </div>
        </Link>
      </div>

      {/* Recent Applications Received */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Recent Candidate Applications
            </h3>
            <p className="text-xs text-slate-500">Applicants for your active jobs and internships.</p>
          </div>
          <Link
            href="/employer/applications"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Manage All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {mockApplications.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={app.applicantAvatar}
                  alt={app.applicantName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-900">{app.applicantName}</h4>
                    <span className="text-[11px] text-slate-500">({app.applicantProfession})</span>
                  </div>
                  <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                    For: {app.opportunityTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'Shortlisted'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : app.status === 'Interview'
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  {app.status}
                </span>

                <Link
                  href="/employer/applications"
                  className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-sm"
                >
                  Review
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
