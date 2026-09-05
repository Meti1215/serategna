'use client';

import React from 'react';
import { mockWorkers } from '@/data/mockWorkers';
import { WorkerCard } from '@/components/workers/WorkerCard';
import Link from 'next/link';
import { Bookmark, Users } from 'lucide-react';

export default function EmployerSavedWorkersPage() {
  const saved = mockWorkers.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Saved Worker Shortlist</h1>
        <p className="text-xs text-slate-500">
          Bookmarked candidate profiles for future projects and interviews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {saved.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    </div>
  );
}
