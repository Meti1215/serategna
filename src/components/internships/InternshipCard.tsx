'use client';

import React from 'react';
import Link from 'next/link';
import { Internship } from '@/types';
import { useSaved } from '@/context/SavedContext';
import {
  MapPin,
  Clock,
  GraduationCap,
  Bookmark,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';

export function InternshipCard({ internship }: { internship: Internship }) {
  const { isSavedInternship, toggleSaveInternship } = useSaved();
  const isSaved = isSavedInternship(internship.id);

  const isPaid = internship.compensation === 'Paid';

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 p-6">
      {/* Featured Pill */}
      {internship.isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-600 text-white shadow-sm">
            <Sparkles className="w-3 h-3" /> Featured Internship
          </span>
        </div>
      )}

      {/* Bookmark Button */}
      <button
        onClick={() => toggleSaveInternship(internship.id)}
        title={isSaved ? 'Remove from saved' : 'Save internship'}
        className={`absolute top-3 right-3 z-10 p-2 rounded-xl transition ${
          isSaved
            ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
            : 'bg-slate-100/80 text-slate-400 hover:text-slate-700 hover:bg-slate-200'
        }`}
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
      </button>

      <div>
        {/* Header with Logo */}
        <div className="flex items-start gap-4 mt-2">
          <img
            src={internship.companyLogo}
            alt={internship.company}
            className="w-13 h-13 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
          />
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold truncate">{internship.company}</span>
              {internship.isVerifiedCompany && (
                <span title="Verified Company">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </span>
              )}
            </div>

            <Link
              href={`/internships/${internship.id}`}
              className="font-bold text-slate-900 text-base hover:text-emerald-700 transition block mt-0.5"
            >
              {internship.title}
            </Link>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {internship.location}
              </span>
              <span>•</span>
              <span className="text-purple-700 font-semibold">{internship.workType}</span>
            </div>
          </div>
        </div>

        {/* Duration & Compensation Row */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold border ${
              isPaid
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {isPaid ? `💵 Paid • ${internship.stipend || 'Stipend'}` : 'Unpaid (Academic Credit)'}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-medium border border-blue-100">
            <Clock className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
            {internship.duration}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
            <GraduationCap className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
            {internship.educationLevel}
          </span>
        </div>

        {/* Description snippet */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {internship.description}
        </p>

        {/* Skills Required */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {internship.requiredSkills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 text-slate-700 font-medium"
            >
              {skill}
            </span>
          ))}
          {internship.requiredSkills.length > 4 && (
            <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
              +{internship.requiredSkills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1 text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Deadline: {internship.deadline}</span>
        </div>
        <Link
          href={`/internships/${internship.id}`}
          className="px-3.5 py-1.5 rounded-lg bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 transition shadow-sm"
        >
          View Internship
        </Link>
      </div>
    </div>
  );
}
