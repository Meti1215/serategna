'use client';

import React from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { useSaved } from '@/context/SavedContext';
import { MapPin, Briefcase, Bookmark, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export function JobCard({ job }: { job: Job }) {
  const { isSavedJob, toggleSaveJob } = useSaved();
  const isSaved = isSavedJob(job.id);

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 p-6">
      {/* Featured Pill */}
      {job.isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
            <Sparkles className="w-3 h-3" /> Featured Job
          </span>
        </div>
      )}

      {/* Bookmark Button */}
      <button
        onClick={() => toggleSaveJob(job.id)}
        title={isSaved ? 'Remove from saved' : 'Save job'}
        className={`absolute top-3 right-3 z-10 p-2 rounded-xl transition ${
          isSaved
            ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
            : 'bg-slate-100/80 text-slate-400 hover:text-slate-700 hover:bg-slate-200'
        }`}
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
      </button>

      <div>
        {/* Company & Title Header */}
        <div className="flex items-start gap-4 mt-2">
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-13 h-13 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
          />
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold truncate">{job.company}</span>
              {job.isVerifiedCompany && (
                <span title="Verified Employer">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </span>
              )}
            </div>
            <Link
              href={`/jobs/${job.id}`}
              className="font-bold text-slate-900 text-base hover:text-emerald-700 transition block mt-0.5"
            >
              {job.title}
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">{job.employmentType}</span>
            </div>
          </div>
        </div>

        {/* Salary Pill & Experience */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100">
            💰 {job.salary}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
            <Briefcase className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
            {job.experienceLevel}
          </span>
        </div>

        {/* Description snippet */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 text-slate-600 font-medium"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Deadline: {job.deadline}</span>
        </div>
        <Link
          href={`/jobs/${job.id}`}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition shadow-sm"
        >
          View Job
        </Link>
      </div>
    </div>
  );
}
