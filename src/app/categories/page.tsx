'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { mockCategories } from '@/data/mockCategories';
import {
  Zap,
  Car,
  Home,
  Code,
  Wrench,
  Calculator,
  ShieldCheck,
  Hammer,
  Palette,
  HardHat,
  HeartPulse,
  TrendingUp,
  Search,
  ArrowRight,
  Briefcase,
  Users,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Car,
  Home,
  Code,
  Wrench,
  Calculator,
  ShieldCheck,
  Hammer,
  Palette,
  HardHat,
  HeartPulse,
  TrendingUp,
};

export default function CategoriesPage() {
  const [search, setSearch] = useState('');

  const filtered = mockCategories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Directory & Taxonomy
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Job & Worker Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Discover verified tradespeople and professional candidates categorized across Ethiopian industry sectors.
          </p>

          <div className="mt-6 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category (e.g. Electrician, Driver)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cat) => {
            const Icon = iconMap[cat.iconName] || Wrench;
            return (
              <div
                key={cat.id}
                className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-950/5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition">
                      <Icon className="w-6 h-6" />
                    </div>
                    {cat.isPopular && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900">
                        In Demand
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <strong className="text-slate-900">{cat.workerCount}</strong> Workers
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      <strong className="text-slate-900">{cat.jobCount}</strong> Jobs
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/workers?category=${encodeURIComponent(cat.name)}`}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold text-center transition"
                    >
                      Find Workers
                    </Link>
                    <Link
                      href={`/jobs?category=${encodeURIComponent(cat.name)}`}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold text-center transition"
                    >
                      Browse Jobs
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
