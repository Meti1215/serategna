'use client';

import React from 'react';
import Link from 'next/link';
import { mockApplications } from '@/services/applicationsService';
import { FileCheck, Calendar, Building, Clock, ChevronRight } from 'lucide-react';

export default function WorkerApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Job & Internship Applications</h1>
        <p className="text-xs text-slate-500">
          Track the review progress of your submitted applications in real time.
        </p>
      </div>

      <div className="space-y-4">
        {mockApplications.map((app) => (
          <div
            key={app.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                  {app.opportunityType}
                </span>
                <span className="text-xs text-slate-400">Applied: {app.appliedDate}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">{app.opportunityTitle}</h2>
              <p className="text-xs text-emerald-800 font-semibold mt-0.5">{app.companyName}</p>

              {app.coverLetter && (
                <p className="text-xs text-slate-600 mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 max-w-xl italic">
                  &ldquo;{app.coverLetter}&rdquo;
                </p>
              )}
            </div>

            <div className="shrink-0 flex flex-col sm:items-end gap-2">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  app.status === 'Shortlisted'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : app.status === 'Interview'
                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}
              >
                Status: {app.status}
              </span>

              {app.interviewDate && (
                <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  📅 Interview: {app.interviewDate}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
