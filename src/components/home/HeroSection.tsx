'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  GraduationCap,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { mockCategories } from '@/data/mockCategories';
import { mockRegions } from '@/data/mockRegions';

export function HeroSection() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'workers' | 'jobs' | 'internships'>('workers');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [region, setRegion] = useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category !== 'All') params.set('category', category);
    if (region !== 'All') params.set('region', region);

    if (searchMode === 'workers') {
      router.push(`/workers?${params.toString()}`);
    } else if (searchMode === 'jobs') {
      router.push(`/jobs?${params.toString()}`);
    } else {
      router.push(`/internships?${params.toString()}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tagline Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ethiopia’s #1 Worker Finding & Employment Ecosystem</span>
          </div>
        </div>

        {/* Hero Headings */}
        <div className="text-center mt-6 max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find the Right Worker.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
              Find the Right Opportunity.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect skilled Ethiopian workers with trusted employers, discover high-paying jobs,
            and explore university internships designed to build your future.
          </p>
        </div>

        {/* Quick Mode Switcher Tabs */}
        <div className="mt-10 max-w-3xl mx-auto flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 backdrop-blur-md">
            <button
              onClick={() => setSearchMode('workers')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                searchMode === 'workers'
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Search Workers</span>
            </button>

            <button
              onClick={() => setSearchMode('jobs')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                searchMode === 'jobs'
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Find Jobs</span>
            </button>

            <button
              onClick={() => setSearchMode('internships')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                searchMode === 'internships'
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-900/40'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Find Internships</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500 text-white font-black">
                NEW
              </span>
            </button>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="mt-4 max-w-4xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="p-3 sm:p-4 rounded-2xl bg-white text-slate-900 shadow-2xl shadow-slate-950/40 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
          >
            {/* Keyword Field */}
            <div className="sm:col-span-5 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  searchMode === 'workers'
                    ? 'What worker are you looking for? (e.g. Electrician, Driver)'
                    : searchMode === 'jobs'
                    ? 'Job title, company or skill... (e.g. Accountant, Chef)'
                    : 'Internship field, university major... (e.g. Software, HR)'
                }
                className="w-full pl-11 pr-3 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Category Dropdown */}
            <div className="sm:col-span-3 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3 relative flex items-center">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 shrink-0 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
                className="w-full pl-9 pr-8 py-2.5 text-xs font-semibold text-slate-700 bg-transparent focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {mockCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Dropdown */}
            <div className="sm:col-span-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3 relative flex items-center">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 shrink-0 pointer-events-none" />
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                aria-label="Filter by Ethiopian region or city"
                className="w-full pl-9 pr-6 py-2.5 text-xs font-semibold text-slate-700 bg-transparent focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Ethiopia</option>
                {mockRegions.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 pt-2 sm:pt-0">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/30 transition flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Popular Search Suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Popular Searches:</span>
            {[
              { label: 'Electrician in Addis', href: '/workers?q=Electrician&region=Addis+Ababa' },
              { label: 'Commercial Driver', href: '/workers?q=Driver' },
              { label: 'Housekeeper (CMC / Bole)', href: '/workers?q=Housekeeper' },
              { label: 'Software Internships', href: '/internships?field=Software+Engineering' },
              { label: 'Chartered Accountant', href: '/jobs?category=Accountants' },
            ].map((pill, idx) => (
              <Link
                key={idx}
                href={pill.href}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 transition text-[11px]"
              >
                {pill.label}
              </Link>
            ))}
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <Link
              href="/workers"
              className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-emerald-500/40 transition text-center group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-white">Find Workers</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">3,800+ Vetted Profiles</p>
            </Link>

            <Link
              href="/jobs"
              className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-emerald-500/40 transition text-center group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-900/60 text-blue-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-white">Find Jobs</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Verified Companies</p>
            </Link>

            <Link
              href="/internships"
              className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-purple-500/40 transition text-center group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-900/60 text-purple-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-white">Find Internships</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Students & Graduates</p>
            </Link>

            <Link
              href="/employer/jobs/new"
              className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-amber-500/40 transition text-center group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-900/60 text-amber-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
                <PlusCircle className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-white">Post a Job</h4>
              <p className="text-[10px] text-amber-300 mt-0.5">1 Free Phone Unlock</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
