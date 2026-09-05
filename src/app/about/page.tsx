'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Users, Target, Award, Heart, CheckCircle2, Building, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            About Serategna.com
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
            Transforming Employment in Ethiopia
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            "Find the Right Worker. Find the Right Opportunity."
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Our Vision</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To become Ethiopia’s most trusted digital employment ecosystem where workers discover dignifying
              opportunities, employers discover verified talent, and both sides establish long-term trust through
              transparent profiles, ratings, and phone privacy protections.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Our Core Innovation</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We eliminate the harassment inherent in unprotected classifieds. By securing contact information
              behind an affordable 100 ETB micro-payment and rewarding job creators with free unlocks, we balance
              worker privacy with friction-free employer recruiting.
            </p>
          </div>
        </div>

        {/* The 4 Pillars */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-black text-slate-900">The 4 Pillars of Serategna</h2>
            <p className="text-xs text-slate-500 mt-1">Foundational principles built for the Ethiopian marketplace.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Phone Number Privacy',
                desc: 'Safeguarding workers from random spam callers, scam brokers, and unsolicited disturbances.',
                icon: ShieldCheck,
              },
              {
                title: 'Independent Verification',
                desc: 'Auditing National IDs (Fayda) and TVET COC competency certificates before awarding badges.',
                icon: Award,
              },
              {
                title: 'Transparent Ratings',
                desc: 'Only genuine employers who hired a worker can submit reviews on punctuality and craftsmanship.',
                icon: CheckCircle2,
              },
              {
                title: 'Internship Launchpad',
                desc: 'Connecting university students with hands-on technical mentors and corporate stipends.',
                icon: Users,
              },
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company Info Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Developed by Syntax Software Solution PLC</h3>
            <p className="text-xs text-slate-400 mt-1">
              Registered technology provider based in Addis Ababa, Ethiopia. Prepared for nationwide employment impact.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition"
          >
            Contact Headquarters
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
