'use client';

import React from 'react';
import Link from 'next/link';
import {
  Lock,
  Phone,
  ShieldCheck,
  Gift,
  CreditCard,
  Smartphone,
  Building2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export function PhoneUnlockExplainer() {
  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy-First Employment Infrastructure</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Serategna’s Phone Privacy & 100 ETB Unlock System Works
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Unlike free classified websites where workers suffer from unwanted harassment and spam calls,
            Serategna protects worker contact info while ensuring employers connect with serious talent.
          </p>
        </div>

        {/* 3 Steps Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg mb-6">
                1
              </div>
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1">
                <Lock className="w-4 h-4" />
                <span>Phone Number Hidden</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                Worker Contact Remains Private
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Public visitors and search engines see masked phone numbers (e.g.{' '}
                <span className="font-mono font-semibold">09•••••••</span>). Worker experience,
                skills, and reviews remain fully visible for evaluation.
              </p>
            </div>
            <div className="mt-6 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">09•••••••</span>
              <span className="font-bold text-amber-600">Protected</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-6">
                2
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                <CreditCard className="w-4 h-4" />
                <span>100 ETB Micro-Payment</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                Pay via Telebirr, Chapa, or CBE
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When ready to contact, the employer clicks "Unlock Phone Number" and completes the 100 ETB
                fee via Ethiopian mobile payment or direct bank transfer.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3 p-2 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700">
              <span className="text-emerald-700">Telebirr</span>
              <span>•</span>
              <span className="text-emerald-700">Chapa</span>
              <span>•</span>
              <span className="text-purple-700">CBE Birr</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg mb-6">
                3
              </div>
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-1">
                <Phone className="w-4 h-4" />
                <span>Instant Reveal & Call</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                Full Phone Number Displayed
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upon confirmation, the worker's genuine phone number is immediately shown with one-tap
                call and SMS capabilities, and permanently logged in the employer dashboard.
              </p>
            </div>
            <div className="mt-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
              <span className="text-emerald-900 font-mono font-bold">+251 91 142 8892</span>
              <span className="font-bold text-emerald-700">Unlocked</span>
            </div>
          </div>
        </div>

        {/* First-Job Rule Box */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-transparent border-2 border-emerald-500/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-4 rounded-2xl bg-amber-500 text-white shrink-0 shadow-lg shadow-amber-500/20">
                <Gift className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold uppercase tracking-wide">
                  Employer Incentive
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  The First-Job Rule: Post a Job, Get 1 Free Unlock!
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  To encourage authentic job creation across Ethiopia, newly registered employers
                  receive <strong className="text-slate-900">1 Free Worker Phone Unlock (worth 100 ETB)</strong> immediately
                  upon publishing their first legitimate job or internship posting.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex gap-3">
              <Link
                href="/employer/jobs/new"
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition flex items-center gap-1.5"
              >
                <span>Post Your First Job Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
