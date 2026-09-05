'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WorkerProfile } from '@/types';
import { VerificationBadge, RatingStars } from '@/components/common/VerificationBadge';
import { UnlockPhoneModal } from '@/components/workers/UnlockPhoneModal';
import { useUnlock } from '@/context/UnlockContext';
import { useSaved } from '@/context/SavedContext';
import { MapPin, Briefcase, Bookmark, Lock, Phone, ArrowRight, Sparkles } from 'lucide-react';

export function WorkerCard({
  worker,
  showFullContact = false,
}: {
  worker: WorkerProfile;
  showFullContact?: boolean;
}) {
  const { isWorkerUnlocked } = useUnlock();
  const { isSavedWorker, toggleSaveWorker } = useSaved();
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const isUnlocked = showFullContact || isWorkerUnlocked(worker.id);
  const isSaved = isSavedWorker(worker.id);

  return (
    <>
      <div className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 overflow-hidden">
        {/* Featured / Sponsored Pill */}
        {(worker.isFeatured || worker.isSponsored) && (
          <div className="absolute top-3 left-3 z-10 flex gap-1">
            {worker.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
            {worker.isSponsored && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-200">
                Sponsored
              </span>
            )}
          </div>
        )}

        {/* Save Bookmark Button */}
        <button
          onClick={() => toggleSaveWorker(worker.id)}
          title={isSaved ? 'Remove from saved' : 'Save worker'}
          className={`absolute top-3 right-3 z-10 p-2 rounded-xl transition ${
            isSaved
              ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
              : 'bg-slate-100/80 text-slate-400 hover:text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
        </button>

        {/* Card Body */}
        <div className="p-6">
          {/* Header Info */}
          <div className="flex items-start gap-4">
            <Link href={`/workers/${worker.id}`} className="shrink-0 relative group-hover:opacity-95">
              <img
                src={worker.avatar}
                alt={worker.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </Link>

            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2">
                <Link
                  href={`/workers/${worker.id}`}
                  className="font-bold text-slate-900 text-base hover:text-emerald-700 transition truncate"
                >
                  {worker.fullName}
                </Link>
              </div>
              <p className="text-sm font-medium text-emerald-800 line-clamp-1 mt-0.5">
                {worker.profession}
              </p>

              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  {worker.city}, {worker.region}
                </span>
              </div>
            </div>
          </div>

          {/* Rating & Experience Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <RatingStars rating={worker.rating} totalReviews={worker.totalReviews} />
            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{worker.experienceYears} Years Exp.</span>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-3">
            <VerificationBadge
              status={worker.verificationStatus.status}
              isPhoneVerified={worker.isPhoneVerified}
              isEmployerVerified={worker.isEmployerVerified}
              size="sm"
            />
          </div>

          {/* Bio snippet */}
          <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {worker.bio}
          </p>

          {/* Skills Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {worker.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 text-slate-700 font-medium"
              >
                {skill}
              </span>
            ))}
            {worker.skills.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                +{worker.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Locked / Unlocked Phone Bar */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
          {isUnlocked ? (
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-xs">{worker.phone}</span>
            </div>
          ) : (
            <button
              onClick={() => setShowUnlockModal(true)}
              className="group/btn flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition"
            >
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 group-hover/btn:bg-emerald-100 group-hover/btn:text-emerald-700 transition">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span>Unlock Phone • 100 ETB</span>
            </button>
          )}

          <Link
            href={`/workers/${worker.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <UnlockPhoneModal
        worker={worker}
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
      />
    </>
  );
}
