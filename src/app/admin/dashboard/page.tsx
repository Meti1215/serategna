'use client';

import React, { useState } from 'react';
import { mockWorkers } from '@/data/mockWorkers';
import { mockJobs } from '@/data/mockJobs';
import { mockInternships } from '@/data/mockInternships';
import { mockReviews, mockTransactions } from '@/data/mockReviews';
import { useToast } from '@/context/ToastContext';
import {
  Users,
  Building,
  Briefcase,
  GraduationCap,
  CreditCard,
  Star,
  Flag,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Phone,
  FileText,
  AlertTriangle,
  Smartphone,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'workers' | 'employers' | 'jobs' | 'payments' | 'reviews' | 'reports'
  >('overview');

  const [workersList, setWorkersList] = useState(mockWorkers);
  const [reviewsList, setReviewsList] = useState(mockReviews);

  const handleApproveWorker = (id: string) => {
    setWorkersList((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              verificationStatus: {
                ...w.verificationStatus,
                status: 'Verified',
                certificatesVerified: true,
                idVerified: true,
              },
            }
          : w
      )
    );
    showToast('Worker Verified', 'Worker credentials and COC have been approved.', 'success');
  };

  const handleSuspendWorker = (id: string) => {
    setWorkersList((prev) => prev.filter((w) => w.id !== id));
    showToast('Account Suspended', 'Worker has been temporarily suspended.', 'warning');
  };

  const handleDismissReport = (id: string) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isReported: false } : r))
    );
    showToast('Report Dismissed', 'Review verified as policy-compliant.', 'info');
  };

  const handleRemoveReview = (id: string) => {
    setReviewsList((prev) => prev.filter((r) => r.id !== id));
    showToast('Review Removed', 'Inappropriate review has been deleted.', 'error');
  };

  const stats = [
    { label: 'Total Workers', value: '15,240', change: '+14% this month', icon: Users, color: 'text-emerald-400' },
    { label: 'Total Employers', value: '2,450', change: '+8% this month', icon: Building, color: 'text-blue-400' },
    { label: 'Platform Revenue', value: '184,500 ETB', change: '1,845 Phone Unlocks', icon: CreditCard, color: 'text-amber-400' },
    { label: 'Total Jobs Posted', value: '680', change: 'Active across regions', icon: Briefcase, color: 'text-purple-400' },
    { label: 'Total Internships', value: '124', change: 'Student openings', icon: GraduationCap, color: 'text-pink-400' },
    { label: 'Pending Approvals', value: '12', change: 'Require COC review', icon: Clock, color: 'text-rose-400' },
    { label: 'Reported Reviews', value: '2', change: 'Flagged by users', icon: Flag, color: 'text-amber-500' },
    { label: 'Reported Accounts', value: '1', change: 'Under investigation', icon: AlertTriangle, color: 'text-rose-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
            Serategna Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            System Administration & Moderation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor transactions, verify documents, audit reviews, and maintain platform trust.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'workers', label: 'Workers Audit' },
            { key: 'jobs', label: 'Jobs & Internships' },
            { key: 'payments', label: 'Payments (184k ETB)' },
            { key: 'reviews', label: 'Reviews Moderation' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-3.5 py-2 rounded-xl font-bold transition ${
                activeTab === t.key
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">{s.label}</span>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className="text-2xl font-black text-white tracking-tight">{s.value}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{s.change}</p>
                </div>
              );
            })}
          </div>

          {/* Revenue Breakdown Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-800 border border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Monetization Analytics</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Primary revenue generated by the 100 ETB phone number unlock micro-transaction model.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
                100,000 ETB / Month Target Achieved
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
                <span className="text-[11px] text-slate-400 font-bold uppercase">Telebirr Volume</span>
                <p className="text-xl font-black text-white mt-1">112,400 ETB</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">61% of transactions</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
                <span className="text-[11px] text-slate-400 font-bold uppercase">Chapa Card / Banks</span>
                <p className="text-xl font-black text-white mt-1">48,600 ETB</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">26% of transactions</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
                <span className="text-[11px] text-slate-400 font-bold uppercase">CBE Birr & Transfers</span>
                <p className="text-xl font-black text-white mt-1">23,500 ETB</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">13% of transactions</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORKERS AUDIT */}
      {activeTab === 'workers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-base font-bold text-white">Worker Verification Queue</h2>
            <span className="text-xs text-slate-400">{workersList.length} workers in database</span>
          </div>

          <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Worker</th>
                    <th className="py-3 px-4">Profession</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Verification Status</th>
                    <th className="py-3 px-4">Certificates</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {workersList.map((worker) => (
                    <tr key={worker.id} className="hover:bg-slate-700/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={worker.avatar}
                            alt={worker.fullName}
                            className="w-9 h-9 rounded-xl object-cover"
                          />
                          <div>
                            <span className="font-bold text-white">{worker.fullName}</span>
                            <p className="text-[11px] text-slate-400">{worker.phone}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-medium">{worker.profession}</td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {worker.city}, {worker.region}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            worker.verificationStatus.status === 'Verified'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {worker.verificationStatus.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {worker.certificates.length} attached
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        {worker.verificationStatus.status !== 'Verified' && (
                          <button
                            onClick={() => handleApproveWorker(worker.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] transition"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleSuspendWorker(worker.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[11px] transition"
                        >
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JOBS & INTERNSHIPS MODERATION */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-white mb-3">Active Job Vacancies ({mockJobs.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-white text-xs">{job.title}</h3>
                    <p className="text-xs text-emerald-400 font-medium mt-0.5">{job.company}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {job.location} • {job.salary}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-900 text-emerald-300">
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h2 className="text-base font-bold text-white mb-3">Active Internship Programs ({mockInternships.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockInternships.map((intern) => (
                <div
                  key={intern.id}
                  className="p-5 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-white text-xs">{intern.title}</h3>
                    <p className="text-xs text-purple-400 font-medium mt-0.5">{intern.company}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {intern.field} • {intern.duration} • {intern.compensation}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-900 text-purple-300">
                    {intern.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENTS LEDGER */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-base font-bold text-white">Phone Unlock Transaction Ledger</h2>
            <span className="text-xs text-emerald-400 font-bold">100 ETB fixed per transaction</span>
          </div>

          <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Transaction Ref</th>
                    <th className="py-3 px-4">Employer</th>
                    <th className="py-3 px-4">Worker Contact</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Gateway</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {mockTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-700/40 transition">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                        {tx.reference}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">{tx.employerName}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-200">{tx.workerName}</span>
                        <span className="block font-mono text-[11px] text-emerald-400">
                          {tx.unlockedPhone}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-white">{tx.amount} ETB</td>
                      <td className="py-3 px-4 text-slate-300">{tx.paymentMethod}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-base font-bold text-white">Review Moderation Queue</h2>
            <p className="text-xs text-slate-400">Investigate reports of fake, abusive, or discriminatory reviews.</p>
          </div>

          <div className="space-y-3">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{rev.employerName}</span>
                    <span className="text-slate-400 text-xs">on</span>
                    <span className="font-semibold text-emerald-400 text-xs">{rev.jobTitle}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 italic">"{rev.comment}"</p>
                  <span className="text-[10px] text-slate-500 block mt-1">Date: {rev.date}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDismissReport(rev.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition"
                  >
                    Keep Review
                  </button>
                  <button
                    onClick={() => handleRemoveReview(rev.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-xs font-semibold transition"
                  >
                    Remove Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
