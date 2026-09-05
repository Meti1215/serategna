'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { mockRegions } from '@/data/mockRegions';
import { MapPin, Users, Briefcase, ArrowRight } from 'lucide-react';

export default function RegionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Geographic Coverage
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Ethiopian Regional & City Hubs
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Connecting job seekers, skilled trade workers, and employers across all 11 Ethiopian regional administrations and chartered cities.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRegions.map((region) => (
            <div
              key={region.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-950/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    {region.amharicName}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900">{region.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Administrative Capital: <strong className="text-slate-700">{region.capital}</strong>
                </p>

                <div className="mt-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Key Urban Centers
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {region.majorCities.map((city, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <strong className="text-slate-900">{region.activeWorkers}</strong> Active Workers
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <strong className="text-slate-900">{region.activeJobs}</strong> Active Jobs
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/workers?region=${encodeURIComponent(region.name)}`}
                    className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold text-center transition"
                  >
                    View Workers
                  </Link>
                  <Link
                    href={`/jobs?region=${encodeURIComponent(region.name)}`}
                    className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold text-center transition"
                  >
                    View Jobs
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
