'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { paymentsService } from '@/services/paymentsService';
import { PhoneUnlockTransaction } from '@/types';
import {
  Lock,
  Phone,
  CreditCard,
  Building2,
  Smartphone,
  Gift,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function EmployerUnlocksPage() {
  const [transactions, setTransactions] = useState<PhoneUnlockTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await paymentsService.getTransactions('emp-abc');
      setTransactions(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleCopy = (phone: string) => {
    navigator.clipboard.writeText(phone);
    showToast('Copied', phone, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Phone Unlocks & Payment History</h1>
          <p className="text-xs text-slate-500">
            All worker phone numbers you have unlocked remain permanently accessible in your directory.
          </p>
        </div>

        <Link
          href="/workers"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition"
        >
          <span>Find More Workers</span>
        </Link>
      </div>

      {/* Unlocked Contacts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Worker Candidate</th>
                <th className="py-3.5 px-4">Unlocked Phone</th>
                <th className="py-3.5 px-4">Unlock Fee</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Transaction Ref</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4">
                    <div>
                      <Link
                        href={`/workers/${tx.workerId}`}
                        className="font-bold text-slate-900 hover:text-emerald-700"
                      >
                        {tx.workerName}
                      </Link>
                      <p className="text-[11px] text-slate-500">{tx.workerProfession}</p>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-emerald-900 text-xs bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {tx.unlockedPhone}
                      </span>
                      <button
                        onClick={() => handleCopy(tx.unlockedPhone)}
                        className="p-1 text-slate-400 hover:text-slate-700 transition"
                        title="Copy Phone"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-900">
                    {tx.amount === 0 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Gift className="w-3 h-3" /> Free Bonus
                      </span>
                    ) : (
                      `${tx.amount} ETB`
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                      {tx.paymentMethod === 'Telebirr' && <Smartphone className="w-3.5 h-3.5 text-emerald-600" />}
                      {tx.paymentMethod === 'Chapa' && <CreditCard className="w-3.5 h-3.5 text-emerald-600" />}
                      {tx.paymentMethod === 'CBE' && <Building2 className="w-3.5 h-3.5 text-purple-600" />}
                      {tx.paymentMethod === 'Free First Unlock' && <Gift className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{tx.paymentMethod}</span>
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                    {tx.reference}
                  </td>

                  <td className="py-4 px-4 text-[11px] text-slate-500">
                    {tx.date}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <a
                      href={`tel:${tx.unlockedPhone}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
