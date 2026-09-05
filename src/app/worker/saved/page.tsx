'use client';

import React from 'react';
import Link from 'next/link';
import { mockJobs } from '@/data/mockJobs';
import { mockInternships } from '@/data/mockInternships';
import { JobCard } from '@/components/jobs/JobCard';
import { InternshipCard } from '@/components/internships/InternshipCard';
import { Bookmark } from 'lucide-react';

export default function WorkerSavedPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Saved Opportunities</h1>
        <p className="text-xs text-slate-500">
          Bookmarked jobs and internships ready for application.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
          Saved Jobs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockJobs.slice(0, 2).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
          Saved Internships
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockInternships.slice(0, 1).map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </div>
      </div>
    </div>
  );
}
