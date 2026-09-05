'use client';

import React from 'react';
import Link from 'next/link';
import { WorkerCard } from '@/components/workers/WorkerCard';
import { WorkerProfile } from '@/types';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function FeaturedWorkersSection({ workers }: { workers: WorkerProfile[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Verified Ethiopian Talent</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Skilled Workers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top-rated electricians, chauffeurs, engineers, and healthcare professionals ready to work.
            </p>
          </div>

          <Link
            href="/workers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition group"
          >
            <span>Browse All Workers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Worker Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.slice(0, 6).map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-3.5 rounded-2xl bg-emerald-800/80 text-emerald-200 shrink-0 hidden sm:block">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Are you a skilled worker or recent graduate?</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Create your verified profile today and start receiving inquiries from vetted Ethiopian employers.
              </p>
            </div>
          </div>
          <Link
            href="/register?type=worker"
            className="shrink-0 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md"
          >
            Create Worker Profile Free
          </Link>
        </div>
      </div>
    </section>
  );
}
