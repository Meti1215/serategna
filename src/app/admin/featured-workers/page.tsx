'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { workersService } from '@/services/workersService';
import { WorkerProfile } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Sparkles,
  X,
  Search,
  Calendar,
  MapPin,
  Star,
  User,
} from 'lucide-react';

export default function AdminFeaturedWorkersPage() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    loadWorkers();
  }, []);

  async function loadWorkers() {
    setIsLoading(true);
    const data = await workersService.getWorkers();
    setWorkers(data);
    setIsLoading(false);
  }

  const handleToggleFeatured = async (workerId: string, currentFeatured: boolean) => {
    if (currentFeatured) {
      const updated = await workersService.removeWorkerFeatured(workerId);
      if (updated) {
        setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
        showToast('Removed', 'Worker is no longer featured.', 'info');
      }
    } else {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days
      const updated = await workersService.setWorkerFeatured(workerId, true, startDate, endDate, 1);
      if (updated) {
        setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
        showToast('Featured', 'Worker is now featured for 30 days.', 'success');
      }
    }
  };

  const filtered = workers.filter((w) => {
    const matchesSearch =
      !searchQuery ||
      w.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const featuredWorkers = filtered.filter((w) => w.isFeatured && w.featuredIsActive);
  const regularWorkers = filtered.filter((w) => !(w.isFeatured && w.featuredIsActive));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-xl font-bold text-white">Featured Workers Management</h1>
          <p className="text-xs text-slate-400">Manage worker promotions and featured listings</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search workers..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Featured Workers Section */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Currently Featured Workers ({featuredWorkers.length})
        </h2>
        {featuredWorkers.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 text-center text-slate-400 text-sm">
            No featured workers
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredWorkers.map((worker) => (
              <div key={worker.id} className="bg-slate-800 rounded-2xl border border-amber-500/30 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={worker.avatar}
                    alt={worker.fullName}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white text-sm truncate">{worker.fullName}</p>
                    <p className="text-xs text-slate-400">{worker.profession}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-slate-300">{worker.rating}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Featured
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span>{worker.city}, {worker.region}</span>
                </div>

                {worker.featuredStartDate && worker.featuredEndDate && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{worker.featuredStartDate} → {worker.featuredEndDate}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <Link
                    href={`/workers/${worker.id}`}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => handleToggleFeatured(worker.id, true)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Workers Section */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          All Workers ({regularWorkers.length})
        </h2>
        {isLoading ? (
          <div className="text-center py-8 text-slate-400 text-sm">Loading workers...</div>
        ) : regularWorkers.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 text-center text-slate-400 text-sm">
            No workers found
          </div>
        ) : (
          <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/50 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Worker</th>
                    <th className="py-3.5 px-4">Profession</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {regularWorkers.slice(0, 20).map((worker) => (
                    <tr key={worker.id} className="hover:bg-slate-700/50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={worker.avatar}
                            alt={worker.fullName}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-white">{worker.fullName}</p>
                            <p className="text-[11px] text-slate-400">{worker.category}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-300">{worker.profession}</td>

                      <td className="py-4 px-4 text-slate-300">{worker.city}, {worker.region}</td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-slate-300">{worker.rating}</span>
                          <span className="text-slate-500">({worker.totalReviews})</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleToggleFeatured(worker.id, false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition text-xs font-semibold"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Feature
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
