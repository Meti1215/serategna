'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  ShieldCheck,
  Lock,
  Phone,
  Gift,
  CheckCircle2,
  Users,
  Building,
  Award,
  ArrowRight,
  CreditCard,
} from 'lucide-react';

export default function HowItWorksPage() {
  const [tab, setTab] = useState<'workers' | 'employers'>('workers');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Platform Trust Architecture
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
            How Serategna Works
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            Connecting Ethiopia’s workforce and businesses with phone privacy safeguards,
            independent TVET credential audits, and transparent employer reviews.
          </p>

          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700">
            <button
              onClick={() => setTab('workers')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
                tab === 'workers' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              For Workers & Students
            </button>
            <button
              onClick={() => setTab('employers')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
                tab === 'employers' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              For Employers & Recruiters
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        {/* Step by Step Breakdown */}
        {tab === 'workers' ? (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-slate-900">Your Journey as a Serategna Worker</h2>
              <p className="text-xs text-slate-500 mt-1">From free registration to verified employment opportunities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Create Your Professional Identity',
                  text: 'Register with your phone number. Select your primary profession (e.g. Electrician, Driver, Software Engineer) and target cities.',
                },
                {
                  step: '02',
                  title: 'Upload COC Certificates & ID',
                  text: 'Upload government-issued Kebele or Fayda ID and TVET Level certificates. Our compliance team verifies your documents to award the "Independently Verified" badge.',
                },
                {
                  step: '03',
                  title: 'Zero Harassment Guarantee',
                  text: 'Your phone number is completely protected behind a 100 ETB unlock barrier. Only serious employers who pay can view your direct line.',
                },
                {
                  step: '04',
                  title: 'Apply to Jobs & Internships',
                  text: 'Submit applications directly with your online CV and portfolio. Track progress from Applied to Interview and Accepted.',
                },
                {
                  step: '05',
                  title: 'Direct Hiring',
                  text: 'Receive direct telephone calls or SMS from companies who unlock your contact. Agree on fair daily or monthly terms.',
                },
                {
                  step: '06',
                  title: 'Earn 5-Star Employer Reviews',
                  text: 'Delivering exceptional work earns you verified reviews on your public profile, elevating you to Featured status.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-xs font-black text-emerald-700">{item.step}</span>
                  <h3 className="font-bold text-slate-900 text-base mt-2 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-slate-900">Hiring with Speed and Certainty</h2>
              <p className="text-xs text-slate-500 mt-1">Find trustworthy talent without endless classified scrolling.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Register as an Employer',
                  text: 'Create your account as an individual homeowner, small business, or corporate enterprise in Addis Ababa or the regions.',
                },
                {
                  step: '02',
                  title: 'Post First Job & Earn Free Unlock',
                  text: 'Publish your first job vacancy. Once published, you automatically receive 1 FREE phone number unlock (worth 100 ETB)!',
                },
                {
                  step: '03',
                  title: 'Granular Search & Filters',
                  text: 'Filter workers by TVET COC Level, years of experience, Ethiopian region, sub-city, and previous contractor ratings.',
                },
                {
                  step: '04',
                  title: 'Unlock Worker Contact (100 ETB)',
                  text: 'When you find a match, click "Unlock Phone Number" and pay 100 ETB via Telebirr, Chapa, or CBE Birr. Contact is instantly revealed.',
                },
                {
                  step: '05',
                  title: 'Direct Telephone Contact',
                  text: 'Call the worker directly to interview, negotiate compensation, and finalize work schedules.',
                },
                {
                  step: '06',
                  title: 'Rate & Review',
                  text: 'Leave ratings on quality, punctuality, and reliability to help maintain a merit-based marketplace.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-xs font-black text-emerald-700">{item.step}</span>
                  <h3 className="font-bold text-slate-900 text-base mt-2 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* First-Job Rule Detailed Section */}
        <div id="first-job-rule" className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-emerald-500/40 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                <Gift className="w-4 h-4 text-amber-600" />
                <span>Special First-Time Employer Incentive</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Understanding the First-Job Rule
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                To prevent employers from creating accounts solely to scrape contact information without
                contributing to the platform, Serategna implements a community-first onboarding standard:
              </p>

              <div className="space-y-2 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Newly registered employers must publish at least 1 job or internship opening.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Upon publishing, the employer receives <strong>1 Free Worker Phone Unlock</strong>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Subsequent phone unlocks remain a nominal <strong>100 ETB</strong>.</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                href="/employer/jobs/new"
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition text-center"
              >
                Post a Job & Get Free Unlock
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
