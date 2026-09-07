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
  MapPin,
  Award,
  Star,
  Briefcase,
  Clock,
} from 'lucide-react';

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [filterType, setFilterType] = useState<'all' | 'job' | 'internship'>('all');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');
  const { showToast } = useToast();

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    const updated = await applicationsService.updateApplicationStatus(id, newStatus);
    if (updated) {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
      showToast('Status Updated', `Candidate marked as ${newStatus}.`, 'success');
    }
  };

  const filtered = applications.filter((a) => {
    if (filterType === 'all' && filterStatus === 'all') return true;
    if (filterType !== 'all' && a.opportunityType !== filterType) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
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
        <div className="flex items-center gap-2">
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
                {t === 'all' ? 'All' : `${t}s`}
              </button>
            ))}
          </div>

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
      </div>

      <div className="space-y-4">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={app.applicantAvatar}
                  alt={app.applicantName}
                  className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-900">{app.applicantName}</h3>
                    <span className="text-xs text-slate-500">({app.applicantProfession})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {app.opportunityType}
                    </span>
                    {app.applicantRating && (
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span className="font-semibold">{app.applicantRating}</span>
                        <span className="text-slate-400">({app.applicantTotalReviews})</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                    Position: {app.opportunityTitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Applied: {app.appliedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {app.applicantPhone}
                    </span>
                    {app.applicantLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {app.applicantLocation}, {app.applicantRegion}
                      </span>
                    )}
                    {app.applicantExperience && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {app.applicantExperience} exp
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'New'
                      ? 'bg-slate-100 text-slate-800 border border-slate-300'
                      : app.status === 'Reviewing'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : app.status === 'Shortlisted'
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
                  {app.status}
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

            {/* Skills & Certificates */}
            <div className="flex flex-wrap gap-3">
              {app.applicantSkills && app.applicantSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {app.applicantSkills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {app.certificates && app.certificates.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {app.certificates.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 border border-purple-200 text-xs font-medium text-purple-800">
                      <Award className="w-3 h-3" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold text-slate-800">{app.cvFileName || 'Profile_CV.pdf'}</span>
                <span className="text-[11px] text-slate-400">(Attached)</span>
              </div>

              {/* Status Change Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {app.status === 'New' && (
                  <button
                    onClick={() => handleStatusChange(app.id, 'Reviewing')}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold transition"
                  >
                    Start Review
                  </button>
                )}
                {(app.status === 'New' || app.status === 'Reviewing') && (
                  <button
                    onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition"
                  >
                    Shortlist
                  </button>
                )}
                {(app.status !== 'Accepted' && app.status !== 'Rejected') && (
                  <button
                    onClick={() => handleStatusChange(app.id, 'Interview')}
                    className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold transition"
                  >
                    Schedule Interview
                  </button>
                )}
                {(app.status !== 'Accepted' && app.status !== 'Rejected') && (
                  <button
                    onClick={() => handleStatusChange(app.id, 'Accepted')}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold transition"
                  >
                    Accept & Hire
                  </button>
                )}
                {app.status !== 'Rejected' && (
                  <button
                    onClick={() => handleStatusChange(app.id, 'Rejected')}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold transition"
                  >
                    Reject
                  </button>
                )}
                <a
                  href={`tel:${app.applicantPhone}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold transition flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                {app.cvFileUrl && (
                  <a
                    href={app.cvFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold transition flex items-center gap-1 hover:bg-slate-50"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View CV</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
