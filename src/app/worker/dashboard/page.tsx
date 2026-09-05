'use client';

import React from 'react';
import Link from 'next/link';
import { mockApplications } from '@/services/applicationsService';
import { mockJobs } from '@/data/mockJobs';
import {
  FileCheck,
  Bookmark,
  Eye,
  Star,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Upload,
} from 'lucide-react';

export default function WorkerDashboardPage() {
  const profilePercent = 95;

  return (
    <div className="space-y-6">
      {/* Profile Completion Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-600 flex items-center justify-center shrink-0">
            <span className="font-black text-slate-900 text-base">{profilePercent}%</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Your Profile is {profilePercent}% Complete</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Add your recent project photo gallery to reach 100% and appear higher in employer searches.
            </p>
          </div>
        </div>

        <Link
          href="/worker/profile"
          className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 text-xs font-bold transition flex items-center gap-1.5"
        >
          <Upload className="w-4 h-4 text-emerald-700" />
          <span>Complete Profile</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Applications', value: '3', icon: FileCheck, color: 'text-blue-600' },
          { label: 'Saved Jobs', value: '5', icon: Bookmark, color: 'text-amber-600' },
          { label: 'Profile Views', value: '284', icon: Eye, color: 'text-emerald-600' },
          { label: 'Employer Rating', value: '4.9 ★', icon: Star, color: 'text-amber-500' },
        ].map((s, idx) => {
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

      {/* Application Tracking Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Submitted Applications Status
            </h3>
            <p className="text-xs text-slate-500">Track responses from employers and internship hosts.</p>
          </div>
          <Link
            href="/worker/applications"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {mockApplications.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-slate-900">{app.opportunityTitle}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase">
                    {app.opportunityType}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 font-semibold mt-0.5">{app.companyName}</p>
                <p className="text-[11px] text-slate-400 mt-1">Applied on {app.appliedDate}</p>
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
                {app.interviewDate && (
                  <span className="text-[11px] text-purple-700 font-medium">
                    📅 {app.interviewDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Openings */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          Recommended Openings Matching Your Skills
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockJobs.slice(0, 2).map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">{job.company}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 mt-1">{job.title}</h4>
                <p className="text-xs font-bold text-emerald-700 mt-1">💰 {job.salary}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Deadline: {job.deadline}</span>
                <Link
                  href={`/jobs/${job.id}`}
                  className="font-bold text-emerald-700 hover:text-emerald-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
