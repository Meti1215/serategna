'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Job, Internship } from '@/types';
import { JobCard } from '@/components/jobs/JobCard';
import { InternshipCard } from '@/components/internships/InternshipCard';
import { Briefcase, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export function OpportunitiesSection({
  jobs,
  internships,
}: {
  jobs: Job[];
  internships: Internship[];
}) {
  const [tab, setTab] = useState<'jobs' | 'internships'>('jobs');

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold mb-2">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Career & Skill Building</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Employment & Internships
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Apply to active openings from verified Ethiopian institutions and technology startups.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm self-start sm:self-auto">
            <button
              onClick={() => setTab('jobs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                tab === 'jobs'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Hot Jobs ({jobs.length})</span>
            </button>

            <button
              onClick={() => setTab('internships')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                tab === 'internships'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Internships ({internships.length})</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500 text-white font-extrabold">
                NEW
              </span>
            </button>
          </div>
        </div>

        {/* Content Tab: Jobs */}
        {tab === 'jobs' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.slice(0, 6).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 hover:border-emerald-500 transition shadow-sm"
              >
                <span>View All Ethiopian Job Openings</span>
                <ArrowRight className="w-4 h-4 text-emerald-700" />
              </Link>
            </div>
          </div>
        )}

        {/* Content Tab: Internships */}
        {tab === 'internships' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.slice(0, 6).map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/internships"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-purple-50 hover:border-purple-500 transition shadow-sm"
              >
                <span>Explore All University & Graduate Internships</span>
                <ArrowRight className="w-4 h-4 text-purple-700" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
