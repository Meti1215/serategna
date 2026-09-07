'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobsService } from '@/services/jobsService';
import { Job } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Sparkles,
  X,
  Search,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
} from 'lucide-react';

export default function AdminFeaturedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setIsLoading(true);
    const data = await jobsService.getJobs();
    setJobs(data);
    setIsLoading(false);
  }

  const handleToggleFeatured = async (jobId: string, currentFeatured: boolean) => {
    if (currentFeatured) {
      const updated = await jobsService.removeJobFeatured(jobId);
      if (updated) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
        showToast('Removed', 'Job is no longer featured.', 'info');
      }
    } else {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days
      const updated = await jobsService.setJobFeatured(jobId, true, startDate, endDate, 1);
      if (updated) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
        showToast('Featured', 'Job is now featured for 30 days.', 'success');
      }
    }
  };

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      !searchQuery ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const featuredJobs = filtered.filter((j) => j.isFeatured && j.featuredIsActive);
  const regularJobs = filtered.filter((j) => !(j.isFeatured && j.featuredIsActive));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-xl font-bold text-white">Featured Jobs Management</h1>
          <p className="text-xs text-slate-400">Manage job promotions and featured listings</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Featured Jobs Section */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Currently Featured Jobs ({featuredJobs.length})
        </h2>
        {featuredJobs.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 text-center text-slate-400 text-sm">
            No featured jobs
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredJobs.map((job) => (
              <div key={job.id} className="bg-slate-800 rounded-2xl border border-amber-500/30 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white text-sm truncate">{job.title}</p>
                    <p className="text-xs text-slate-400">{job.company}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-300">{job.employmentType}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Featured
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span>{job.location}, {job.region}</span>
                </div>

                <div className="text-xs text-slate-300">{job.salary}</div>

                {job.featuredStartDate && job.featuredEndDate && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{job.featuredStartDate} → {job.featuredEndDate}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    View Job
                  </Link>
                  <button
                    onClick={() => handleToggleFeatured(job.id, true)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Jobs Section */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          All Jobs ({regularJobs.length})
        </h2>
        {isLoading ? (
          <div className="text-center py-8 text-slate-400 text-sm">Loading jobs...</div>
        ) : regularJobs.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 text-center text-slate-400 text-sm">
            No jobs found
          </div>
        ) : (
          <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/50 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Job</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {regularJobs.slice(0, 20).map((job) => (
                    <tr key={job.id} className="hover:bg-slate-700/50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-white">{job.title}</p>
                            <p className="text-[11px] text-slate-400">{job.category}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-300">{job.company}</td>

                      <td className="py-4 px-4 text-slate-300">{job.location}, {job.region}</td>

                      <td className="py-4 px-4">
                        <span className="text-slate-300">{job.employmentType}</span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleToggleFeatured(job.id, false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition text-xs font-semibold"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Feature
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
