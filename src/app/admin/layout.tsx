'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LogOut,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, switchDemoPersona } = useAuth();

  useEffect(() => {
    if (role !== 'admin') {
      router.replace('/login');
    }
  }, [role, router]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-black">
              ሰ
            </div>
            <span className="font-black text-white text-sm tracking-tight hidden sm:inline">
              SERATEGNA<span className="text-purple-400"> ADMIN</span>
            </span>
          </Link>
          <span className="text-slate-700">|</span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
            HQ Trust & Safety Control
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition hidden md:inline"
          >
            ← Public Website
          </Link>

          <button
            onClick={() => switchDemoPersona('guest')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-purple-900 border border-purple-500 flex items-center justify-center text-purple-300 font-bold text-xs">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-none">Super Administrator</p>
              <p className="text-[10px] text-purple-400 font-semibold mt-0.5">Platform Controller</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
