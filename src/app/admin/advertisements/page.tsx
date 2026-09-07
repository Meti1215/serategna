'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { advertisementsService } from '@/services/advertisementsService';
import { Advertisement, AdvertisementStatus, AdvertisementLocation } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Power,
  PowerOff,
  Search,
  Calendar,
  ExternalLink,
  Image,
} from 'lucide-react';

export default function AdminAdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<AdvertisementStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    loadAdvertisements();
  }, []);

  async function loadAdvertisements() {
    setIsLoading(true);
    const data = await advertisementsService.getAllAdvertisements();
    setAdvertisements(data);
    setIsLoading(false);
  }

  const handleApprove = async (id: string) => {
    const updated = await advertisementsService.approveAdvertisement(id, 'admin-1');
    if (updated) {
      setAdvertisements((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('Approved', 'Advertisement has been approved and activated.', 'success');
    }
  };

  const handleReject = async (id: string) => {
    const updated = await advertisementsService.rejectAdvertisement(id);
    if (updated) {
      setAdvertisements((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('Rejected', 'Advertisement has been rejected.', 'info');
    }
  };

  const handleActivate = async (id: string) => {
    const updated = await advertisementsService.activateAdvertisement(id);
    if (updated) {
      setAdvertisements((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('Activated', 'Advertisement is now active.', 'success');
    }
  };

  const handleDeactivate = async (id: string) => {
    const updated = await advertisementsService.deactivateAdvertisement(id);
    if (updated) {
      setAdvertisements((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('Deactivated', 'Advertisement has been deactivated.', 'info');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this advertisement?')) {
      const success = await advertisementsService.deleteAdvertisement(id);
      if (success) {
        setAdvertisements((prev) => prev.filter((a) => a.id !== id));
        showToast('Deleted', 'Advertisement has been deleted.', 'success');
      }
    }
  };

  const filtered = advertisements.filter((a) => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.advertiserName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: AdvertisementStatus) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'expired':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'inactive':
        return 'bg-slate-100 text-slate-600 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-xl font-bold text-white">Advertisement Management</h1>
          <p className="text-xs text-slate-400">Manage platform advertisements and sponsored content</p>
        </div>

        <Link
          href="/admin/advertisements/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Advertisement</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search advertisements..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs flex-wrap">
          {(['all', 'pending', 'active', 'rejected', 'inactive'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${
                filterStatus === s
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Advertisements Table */}
      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/50 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Advertisement</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Advertiser</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Date Range</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading advertisements...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No advertisements found
                  </td>
                </tr>
              ) : (
                filtered.map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-700/50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white line-clamp-1">{ad.title}</p>
                          <a
                            href={ad.destinationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-0.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate">{ad.destinationUrl}</span>
                          </a>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-slate-300 capitalize">{ad.type.replace('_', ' ')}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-slate-300">{ad.advertiserName}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-slate-300 capitalize">{ad.location.replace('_', ' ')}</span>
                    </td>

                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      <div className="flex flex-col gap-0.5">
                        <span>{ad.startDate}</span>
                        <span>→ {ad.endDate}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(ad.status)}`}
                      >
                        {ad.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ad.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(ad.id)}
                              className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReject(ad.id)}
                              className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition"
                              title="Reject"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {ad.status === 'active' && (
                          <button
                            onClick={() => handleDeactivate(ad.id)}
                            className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition"
                            title="Deactivate"
                          >
                            <PowerOff className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {(ad.status === 'inactive' || ad.status === 'rejected') && (
                          <button
                            onClick={() => handleActivate(ad.id)}
                            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                            title="Activate"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <Link
                          href={`/admin/advertisements/${ad.id}`}
                          className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
