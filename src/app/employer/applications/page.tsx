'use client';

import React, { useState } from 'react';
import { mockApplications, applicationsService } from '@/services/applicationsService';
import { Application, ApplicationStatus } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Calendar,
  Phone,
  Mail,
  User,
  ExternalLink,
} from 'lucide-react';

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [filterType, setFilterType] = useState<'all' | 'job' | 'internship'>('all');
  const { showToast } = useToast();

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    const updated = await applicationsService.updateApplicationStatus(id, newStatus);
    if (updated) {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
      showToast('Status Updated', `Candidate marked as ${newStatus}.`, 'success');
    }
  };

  const filtered = applications.filter((a) => {
    if (filterType === 'all') return true;
    return a.opportunityType === filterType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Review Candidate Applications</h1>
          <p className="text-xs text-slate-500">
            Manage incoming applicants, shortlist talent, schedule interviews, and finalize hiring.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 text-xs">
          {(['all', 'job', 'internship'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${
                filterType === t
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === 'all' ? 'All Applicants' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={app.applicantAvatar}
                  alt={app.applicantName}
                  className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{app.applicantName}</h3>
                    <span className="text-xs text-slate-500">({app.applicantProfession})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {app.opportunityType}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                    Position: {app.opportunityTitle}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span>Applied: {app.appliedDate}</span>
                    <span>•</span>
                    <span>📞 {app.applicantPhone}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'Shortlisted'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : app.status === 'Interview'
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : app.status === 'Accepted'
                      ? 'bg-teal-100 text-teal-900 border border-teal-300'
                      : app.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  Status: {app.status}
                </span>
              </div>
            </div>

            {/* Cover Letter Box */}
            {app.coverLetter && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800 block mb-1">Cover Note:</span>
                &ldquo;{app.coverLetter}&rdquo;
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold text-slate-800">{app.cvFileName || 'Profile_CV.pdf'}</span>
                <span className="text-[11px] text-slate-400">(Attached)</span>
              </div>

              {/* Status Change Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'Interview')}
                  className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold transition"
                >
                  Schedule Interview
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'Accepted')}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold transition"
                >
                  Accept & Hire
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'Rejected')}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold transition"
                >
                  Reject
                </button>
                <a
                  href={`tel:${app.applicantPhone}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold transition flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
