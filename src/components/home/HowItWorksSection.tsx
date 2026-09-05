'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserPlus,
  FileCheck,
  Search,
  CheckCircle,
  Briefcase,
  Building,
  PhoneCall,
  Lock,
  ArrowRight,
} from 'lucide-react';

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<'workers' | 'employers'>('workers');

  const workerSteps = [
    {
      num: '01',
      title: 'Register Your Account',
      desc: 'Sign up with your Ethiopian phone number and create your credentials in less than 2 minutes.',
      icon: UserPlus,
    },
    {
      num: '02',
      title: 'Build Your Verified Profile',
      desc: 'Add your trade or profession, years of experience, TVET certificates, and previous jobs.',
      icon: FileCheck,
    },
    {
      num: '03',
      title: 'Add Skills & Documents',
      desc: 'Upload National ID (Fayda/Kebele) and COC certificates for independent platform verification.',
      icon: CheckCircle,
    },
    {
      num: '04',
      title: 'Find Jobs or Internships',
      desc: 'Browse hundreds of active openings or let employers discover your verified public profile.',
      icon: Search,
    },
    {
      num: '05',
      title: 'Apply with 1 Click',
      desc: 'Submit your profile and CV directly to companies without printing papers.',
      icon: Briefcase,
    },
    {
      num: '06',
      title: 'Get Hired & Build Reputation',
      desc: 'Work professionally and collect 5-star ratings and reviews from previous employers.',
      icon: CheckCircle,
    },
  ];

  const employerSteps = [
    {
      num: '01',
      title: 'Register as an Employer',
      desc: 'Create an account for your household, small business, or corporate enterprise.',
      icon: Building,
    },
    {
      num: '02',
      title: 'Verify Your Company',
      desc: 'Submit your trade license or business registration to earn the "Verified Employer" badge.',
      icon: FileCheck,
    },
    {
      num: '03',
      title: 'Post Job or Internship',
      desc: 'Publish your vacancy with requirements and salary. Publishing unlocks 1 FREE worker contact!',
      icon: Briefcase,
    },
    {
      num: '04',
      title: 'Search Filtered Candidates',
      desc: 'Search by city, sub-city, experience, rating, and TVET certificates.',
      icon: Search,
    },
    {
      num: '05',
      title: 'Unlock Phone & Review Apps',
      desc: 'Unlock worker numbers for 100 ETB via Telebirr or Chapa to call candidates directly.',
      icon: PhoneCall,
    },
    {
      num: '06',
      title: 'Hire & Leave Reviews',
      desc: 'Complete the recruitment and leave transparent ratings to maintain platform trust.',
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            How Serategna Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            A frictionless, trustworthy pathway whether you are looking for work or seeking to hire.
          </p>

          {/* Persona Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-800 border border-slate-700 mt-8">
            <button
              onClick={() => setActiveTab('workers')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'workers'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Workers & Interns
            </button>
            <button
              onClick={() => setActiveTab('employers')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'employers'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Employers & Companies
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'workers' ? workerSteps : employerSteps).map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-emerald-400">{step.num}</span>
                    <div className="p-2.5 rounded-xl bg-slate-700/70 text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-base mb-1.5">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href={activeTab === 'workers' ? '/register?type=worker' : '/register?type=employer'}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-950/20"
          >
            <span>{activeTab === 'workers' ? 'Register as a Worker Free' : 'Register as an Employer'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
