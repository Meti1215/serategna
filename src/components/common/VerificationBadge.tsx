'use client';

import React from 'react';
import { ShieldCheck, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { WorkerVerification } from '@/types';

interface VerificationBadgeProps {
  status?: WorkerVerification['status'];
  isPhoneVerified?: boolean;
  isEmployerVerified?: boolean;
  isIndependentlyVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({
  status = 'Verified',
  isPhoneVerified = true,
  isEmployerVerified = false,
  size = 'sm',
}: VerificationBadgeProps) {
  const isDocVerified = status === 'Verified';
  const isUploadedOnly = status === 'Document Uploaded';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  }[size];

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5">
      {isDocVerified && (
        <span
          title="Documents independently verified by Serategna compliance team"
          className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Independently Verified</span>
        </span>
      )}

      {isUploadedOnly && (
        <span
          title="ID or certificates uploaded by worker, pending verification"
          className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}
        >
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>Document Uploaded</span>
        </span>
      )}

      {isPhoneVerified && (
        <span
          title="Ethiopian Mobile Number verified via SMS OTP"
          className={`inline-flex items-center font-medium rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${sizeClasses}`}
        >
          <Phone className="w-3.5 h-3.5 text-sky-600" />
          <span>Phone Verified</span>
        </span>
      )}

      {isEmployerVerified && (
        <span
          title="Vetted and recommended by previous registered Ethiopian employers"
          className={`inline-flex items-center font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Employer Verified</span>
        </span>
      )}
    </div>
  );
}

export function RatingStars({
  rating,
  totalReviews,
  showCount = true,
}: {
  rating: number;
  totalReviews?: number;
  showCount?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-1 text-amber-500">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300 fill-slate-200'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="font-semibold text-sm text-slate-800 ml-0.5">{rating.toFixed(1)}</span>
      {showCount && totalReviews !== undefined && (
        <span className="text-xs text-slate-500">({totalReviews})</span>
      )}
    </div>
  );
}
