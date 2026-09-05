'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Building,
  ShieldCheck,
  Lock,
  Star,
  CheckCircle2,
  Zap,
  Car,
  Home,
  Code,
  Wrench,
  Calculator,
  Hammer,
  Palette,
  HardHat,
  HeartPulse,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { mockCategories } from '@/data/mockCategories';

export function TrustStatsBar() {
  const stats = [
    {
      value: '15,200+',
      label: 'Registered Ethiopian Workers',
      sublabel: 'Trades & White Collar',
      icon: Users,
    },
    {
      value: '2,450+',
      label: 'Active Employers & Companies',
      sublabel: 'Verified Corporate Accounts',
      icon: Building,
    },
    {
      value: '100 ETB',
      label: 'Fixed Phone Unlock Fee',
      sublabel: 'Or Free with First Job Post',
      icon: Lock,
    },
    {
      value: '98.6%',
      label: 'Verified Reviews & Safety',
      sublabel: 'Zero Tolerated Spam',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="relative -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-200/80">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="flex items-start gap-3.5 p-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{stat.label}</p>
                <p className="text-[11px] text-slate-400">{stat.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Icon helper map
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

export function CategoryShowcase() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-2">
              <span>Marketplace Taxonomy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Popular Job Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse skilled trade workers and professional talent across Ethiopia.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockCategories.slice(0, 8).map((cat) => {
            const Icon = iconMap[cat.iconName] || Wrench;
            return (
              <Link
                key={cat.id}
                href={`/workers?category=${encodeURIComponent(cat.name)}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-950/5 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-700 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  {cat.isPopular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Popular
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium text-slate-600">
                    <strong className="text-slate-900">{cat.workerCount}</strong> Workers
                  </span>
                  <span>{cat.jobCount} Jobs</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
