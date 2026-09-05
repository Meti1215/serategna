'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InternshipCard } from '@/components/internships/InternshipCard';
import { internshipsService } from '@/services/internshipsService';
import { Internship } from '@/types';
import { mockRegions } from '@/data/mockRegions';
import {
  Search,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  Clock,
  DollarSign,
  Briefcase,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';

const internshipFields = [
  'All',
  'Software Engineering',
  'Accounting',
  'Marketing',
  'Engineering',
  'Graphic Design',
  'Human Resources',
  'Finance',
  'Data Science',
  'Information Technology',
  'Business',
  'Architecture',
];

function InternshipsMarketplaceContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialField = searchParams.get('field') || 'All';
  const initialRegion = searchParams.get('region') || 'All';

  const [query, setQuery] = useState(initialQuery);
  const [field, setField] = useState(initialField);
  const [region, setRegion] = useState(initialRegion);
  const [workType, setWorkType] = useState('All');
  const [compensation, setCompensation] = useState('All');
  const [educationLevel, setEducationLevel] = useState('All');

  const [internships, setInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInternships() {
      setIsLoading(true);
      const results = await internshipsService.getInternships({
        query,
        field,
        region,
        workType,
        compensation,
        educationLevel,
      });
      setInternships(results);
      setIsLoading(false);
    }
    loadInternships();
  }, [query, field, region, workType, compensation, educationLevel]);

  const handleReset = () => {
    setQuery('');
    setField('All');
    setRegion('All');
    setWorkType('All');
    setCompensation('All');
    setEducationLevel('All');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white py-12 border-b border-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/80 text-purple-300 text-xs font-bold mb-2 border border-purple-700/50">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              <span>University & Graduate Career Launchpad</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Find Your Next Internship Opportunity
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Launch your career with paid and accredited internships across Ethiopia. Discover programs
              in software engineering, accounting, civil engineering, marketing, and design.
            </p>
          </div>

          <Link
            href="/employer/internships/new"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-900/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post an Internship</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <SlidersHorizontal className="w-4 h-4 text-purple-700" />
                <span>Internship Filters</span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-purple-700 flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Field or Skills
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. React, Excel, Civil..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Field of Study
              </label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full p-2.5 text-xs font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white cursor-pointer"
              >
                {internshipFields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Compensation (Paid / Unpaid) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Compensation
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {['All', 'Paid', 'Unpaid'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCompensation(c)}
                    className={`py-1.5 px-2 rounded-lg border text-center font-medium transition ${
                      compensation === c
                        ? 'bg-purple-50 border-purple-500 text-purple-800 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Type (Remote / On-site / Hybrid) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Work Mode
              </label>
              <div className="space-y-1.5 text-xs">
                {['All', 'On-site', 'Hybrid', 'Remote'].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWorkType(w)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition ${
                      workType === w
                        ? 'bg-purple-50 text-purple-800 font-bold border border-purple-300'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {w === 'All' ? 'All Work Modes' : w}
                  </button>
                ))}
              </div>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target Education
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full p-2.5 text-xs font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="All">All Education Levels</option>
                <option value="Undergraduate">Undergraduate Students</option>
                <option value="Fresh Graduate">Fresh Graduates</option>
                <option value="TVET / Diploma">TVET / Diploma Graduates</option>
              </select>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1 w-full min-w-0">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 mb-6">
              <p className="text-xs font-semibold text-slate-600">
                Discovered <strong className="text-slate-900">{internships.length}</strong> verified internship programs
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse p-6"
                  />
                ))}
              </div>
            ) : internships.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Internships Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try selecting "All Fields" or clearing the compensation filter.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-5 px-5 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {internships.map((internship) => (
                  <InternshipCard key={internship.id} internship={internship} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function InternshipsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading internships...</div>}>
      <InternshipsMarketplaceContent />
    </Suspense>
  );
}
