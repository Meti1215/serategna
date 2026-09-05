'use client';

import React from 'react';
import { mockReviews } from '@/data/mockReviews';
import { RatingStars } from '@/components/common/VerificationBadge';
import { CheckCircle2, ShieldCheck, Flag } from 'lucide-react';

export default function WorkerReviewsPage() {
  const reviews = mockReviews.filter((r) => r.workerId === 'worker-1');

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Employer Feedback & Reviews</h1>
        <p className="text-xs text-slate-500">
          Reviews left by verified employers whom you have previously completed work for.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-3xl font-black text-slate-900">4.9</span>
          <span className="text-xs text-slate-400 ml-1">/ 5.0 Rating</span>
          <p className="text-xs text-slate-600 mt-1">Based on {reviews.length} verified ratings</p>
        </div>
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>Top Rated Worker Tier</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{rev.employerName}</h3>
                <p className="text-xs text-emerald-800 font-medium">Job: {rev.jobTitle}</p>
              </div>
              <span className="text-xs text-slate-400">{rev.date}</span>
            </div>

            <p className="text-xs text-slate-700 italic leading-relaxed">
              "{rev.comment}"
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Employer Review
              </span>
              <span className="text-amber-500 font-bold">★ {rev.rating}.0</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
