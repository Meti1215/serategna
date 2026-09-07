'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Users, Briefcase, ArrowRight } from 'lucide-react';
import { mockRegions } from '@/data/mockRegions';

export function RegionalHubsSection() {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Nationwide Ethiopian Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Find Opportunities Across Ethiopia
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active talent and employment hubs from Addis Ababa to regional economic corridors.
            </p>
          </div>

          <Link
            href="/regions"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
          >
            <span>Explore All Regions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {mockRegions.slice(0, 6).map((region) => (
            <Link
              key={region.id}
              href={`/workers?region=${encodeURIComponent(region.name)}`}
              className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-center flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-700 group-hover:text-white transition">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs">{region.name}</h3>
                <p className="text-[11px] text-emerald-800 font-semibold">{region.amharicName}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                <span className="font-bold text-slate-800">{region.activeWorkers}</span> Workers
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const reviews = [
    {
      name: 'Dr. Senait Bekele',
      role: 'Homeowner, Bole Sub-City',
      text: 'Finding a reliable solar technician used to be a gamble on random Facebook groups. Through Serategna, I unlocked Abebe’s contact for 100 ETB, and he completed our 5kW system in 2 days. The verified reviews gave complete peace of mind.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
      rating: 5,
    },
    {
      name: 'Girma Tadesse',
      role: 'Managing Director, ABC Technology PLC',
      text: 'We posted our software internship opening and received our 1 free worker unlock bonus immediately. We screened and hired 2 incredible junior developers from AAU and ASTU in one week. Serategna is the future of Ethiopian hiring.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120',
      rating: 5,
    },
    {
      name: 'Kassahun Worku',
      role: 'Project Engineer, Sunshine Construction',
      text: 'The ability to filter trade workers by verifiable TVET COC certifications and check past contractor reviews saves us hours of screening on commercial job sites.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Verified Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Trusted by Ethiopian Employers & Workers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{rev.name}</h4>
                  <p className="text-[11px] text-slate-500">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
