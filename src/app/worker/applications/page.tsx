'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockApplications } from '@/services/applicationsService';
import { ApplicationStatus } from '@/types';
import { FileCheck, Calendar, Building, Clock, ChevronRight, MapPin, Briefcase, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function WorkerApplicationsPage() {
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');

  const filtered = mockApplications.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'New':
        return <Clock className="w-4 h-4" />;
      case 'Reviewing':
        return <AlertCircle className="w-4 h-4" />;
      case 'Shortlisted':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'Interview':
        return <Calendar className="w-4 h-4" />;
      case 'Accepted':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'New':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Reviewing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Shortlisted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Interview':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Accepted':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Job & Internship Applications</h1>
          <p className="text-xs text-slate-500">
            Track the review progress of your submitted applications in real time.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 text-xs">
          {(['all', 'New', 'Reviewing', 'Shortlisted', 'Interview', 'Accepted', 'Rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1.5 rounded-lg font-bold capitalize transition ${
                filterStatus === s
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 mb-1">No Applications Found</h3>
            <p className="text-xs text-slate-500">
              {filterStatus === 'all' 
                ? 'You haven\'t applied to any jobs or internships yet.'
                : `No applications with status "${filterStatus}".`}
            </p>
          </div>
        ) : (
          filtered.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {app.opportunityType}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Applied: {app.appliedDate}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-2">{app.opportunityTitle}</h2>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5">{app.companyName}</p>
                  
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                    {app.applicantLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {app.applicantLocation}
                      </span>
                    )}
                    {app.applicantExperience && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {app.applicantExperience}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:items-end gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(app.status)}`}
                  >
                    {getStatusIcon(app.status)}
                    {app.status}
                  </span>

                  {app.interviewDate && (
                    <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {app.interviewDate}
                    </span>
                  )}

                  {app.updatedAt && app.status !== 'New' && (
                    <span className="text-[10px] text-slate-400">
                      Updated: {app.updatedAt.split('T')[0]}
                    </span>
                  )}
                </div>
              </div>

              {app.coverLetter && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-1">Your Cover Note:</span>
                  &ldquo;{app.coverLetter}&rdquo;
                </div>
              )}

              {app.notes && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 text-xs text-amber-800 leading-relaxed">
                  <span className="font-bold text-amber-900 block mb-1">Employer Note:</span>
                  {app.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
