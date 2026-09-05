'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Phone,
  Mail,
  MapPin,
  Heart,
  ExternalLink,
  Gift,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-xl shadow-md">
                <span>ሰ</span>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  SERATEGNA<span className="text-emerald-400">.COM</span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium">ሰራተኛ • Ethiopian Worker & Employment Marketplace</p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Serategna.com is Ethiopia’s premier employment ecosystem connecting skilled workers,
              corporate employers, and university interns. Built on phone privacy, verified credentials,
              and transparent employer ratings.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1.5 max-w-sm">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Phone Privacy & 100 ETB Unlock Policy</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Worker numbers remain strictly hidden to safeguard against harassment. Employers unlock
                for 100 ETB, or get their first unlock free after publishing a job.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Addis Ababa, Ethiopia</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@serategna.com</span>
              </div>
            </div>
          </div>

          {/* For Workers & Students */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              For Workers & Interns
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/register?type=worker" className="hover:text-white transition">
                  Create Worker Profile
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-white transition">
                  Browse Ethiopian Jobs
                </Link>
              </li>
              <li>
                <Link href="/internships" className="hover:text-white transition flex items-center gap-1.5">
                  <span>Find Internships</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-700 text-white font-bold">
                    HOT
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/worker/profile" className="hover:text-white transition">
                  Profile Completion Tips
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">
                  Worker Verification Guide
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white transition">
                  Ethiopian Labor Law Rights
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/workers" className="hover:text-white transition">
                  Search Skilled Workers
                </Link>
              </li>
              <li>
                <Link href="/employer/jobs/new" className="hover:text-white transition flex items-center gap-1.5">
                  <span>Post a Job</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-600 text-white font-bold">
                    1 Free Unlock
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/employer/internships/new" className="hover:text-white transition">
                  Post an Internship
                </Link>
              </li>
              <li>
                <Link href="/employer/unlocks" className="hover:text-white transition">
                  Unlocked Workers Phonebook
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#first-job-rule" className="hover:text-white transition">
                  First-Job Rule Explained
                </Link>
              </li>
              <li>
                <Link href="/employer/dashboard" className="hover:text-white transition">
                  Employer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Payment Partners */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Ethiopian Payment Gateways
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-xs font-bold text-white">
                  TLB
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Telebirr (Ethio Telecom)</p>
                  <p className="text-[10px] text-slate-400">Direct USSD & App checkout</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-xs font-bold text-white">
                  CHP
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Chapa Financial Tech</p>
                  <p className="text-[10px] text-slate-400">Card & Bank processing</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-purple-900 flex items-center justify-center text-xs font-bold text-white">
                  CBE
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Commercial Bank of Ethiopia</p>
                  <p className="text-[10px] text-slate-400">CBE Birr & direct deposit</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SERATEGNA.COM (Syntax Software Solution PLC). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-400 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition">
              Contact & Support
            </Link>
            <Link href="/news" className="hover:text-slate-400 transition">
              News & Advice
            </Link>
            <Link href="/admin/dashboard" className="text-emerald-500 hover:text-emerald-400 font-semibold">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
