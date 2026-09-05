'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WorkerCard } from '@/components/workers/WorkerCard';
import { workersService } from '@/services/workersService';
import { WorkerProfile } from '@/types';
import { mockCategories } from '@/data/mockCategories';
import { mockRegions } from '@/data/mockRegions';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  Star,
  ShieldCheck,
  CheckCircle2,
  X,
  RefreshCw,
  Users,
} from 'lucide-react';

function WorkersMarketplaceContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialRegion = searchParams.get('region') || 'All';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [region, setRegion] = useState(initialRegion);
  const [minExp, setMinExp] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [availability, setAvailability] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'experience'>('recommended');

  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    async function fetchWorkers() {
      setIsLoading(true);
      const results = await workersService.getWorkers({
        query,
        category,
        region,
        minExperience: minExp,
        minRating,
        availability,
        verifiedOnly,
        sortBy,
      });
      setWorkers(results);
      setIsLoading(false);
    }
    fetchWorkers();
  }, [query, category, region, minExp, minRating, availability, verifiedOnly, sortBy]);

  const handleResetFilters = () => {
    setQuery('');
    setCategory('All');
    setRegion('All');
    setMinExp(0);
    setMinRating(0);
    setAvailability('All');
    setVerifiedOnly(false);
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Ethiopian Worker Marketplace
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Find Skilled & Verified Workers
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Browse thousands of certified electricians, drivers, mechanics, chefs, nurses, and IT
              specialists across Ethiopia. Phone numbers unlocked safely for 100 ETB.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <span>Filters</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Keywords
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Skill, name, profession..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Job Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="All">All Categories</option>
                {mockCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.workerCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Region / Location
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-2.5 text-xs font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="All">All Ethiopia</option>
                {mockRegions.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name} ({r.amharicName})
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Experience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Min. Experience ({minExp === 0 ? 'Any' : `${minExp}+ years`})
              </label>
              <input
                type="range"
                min={0}
                max={10}
                value={minExp}
                onChange={(e) => setMinExp(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Any</span>
                <span>3 yrs</span>
                <span>6 yrs</span>
                <span>10+ yrs</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Rating
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[0, 4.5, 4.8].map((star) => (
                  <button
                    key={star}
                    onClick={() => setMinRating(star)}
                    className={`py-1.5 px-2 rounded-lg border text-center font-medium transition ${
                      minRating === star
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {star === 0 ? 'All' : `${star}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Only Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>Independently Verified Only</span>
              </label>
            </div>
          </aside>

          {/* Results Grid Area */}
          <div className="flex-1 w-full min-w-0">
            {/* Top Bar with Count, Sort, and Mobile Filter Button */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center justify-between w-full sm:w-auto">
                <p className="text-xs font-semibold text-slate-600">
                  Showing <strong className="text-slate-900">{workers.length}</strong> available workers
                </p>
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                <span className="text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest Rating</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>
            </div>

            {/* Loading / Results / Empty State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse p-6"
                  />
                ))}
              </div>
            ) : workers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Workers Found Matching Criteria</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try broadening your keyword search, selecting "All Categories", or clearing the minimum rating filter.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {workers.map((worker) => (
                  <WorkerCard key={worker.id} worker={worker} />
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

export default function WorkersMarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading marketplace...</div>}>
      <WorkersMarketplaceContent />
    </Suspense>
  );
}
