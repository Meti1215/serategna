'use client';

import React from 'react';
import Link from 'next/link';
import { mockJobs } from '@/data/mockJobs';
import { Briefcase, PlusCircle, Users, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ManageJobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Manage Job Postings</h1>
          <p className="text-xs text-slate-500">
            View active vacancies, applicant counts, and publication statuses.
          </p>
        </div>

        <Link
          href="/employer/jobs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      <div className="space-y-4">
        {mockJobs.slice(0, 4).map((job) => (
          <div
            key={job.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {job.status}
                </span>
                <span className="text-xs text-slate-400">Posted on {job.postedDate}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">{job.title}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span>📍 {job.location}</span>
                <span>•</span>
                <span className="font-semibold text-emerald-800">💰 {job.salary}</span>
                <span>•</span>
                <span>Exp: {job.experienceLevel}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="font-bold text-slate-900 text-sm">{job.applicantsCount}</span>
                <p className="text-[10px] text-slate-400">Applicants</p>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/employer/applications"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                >
                  View Applicants
                </Link>
                <Link
                  href={`/jobs/${job.id}`}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                >
                  Preview
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
