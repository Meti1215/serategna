'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  Bookmark,
  FileCheck,
  Star,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export default function WorkerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, switchDemoPersona } = useAuth();

  useEffect(() => {
    if (role !== 'worker' && role !== 'admin') {
      router.replace('/login');
    }
  }, [role, router]);

  const navItems = [
    { name: 'Dashboard', href: '/worker/dashboard', icon: LayoutDashboard },
    { name: 'My Profile & Documents', href: '/worker/profile', icon: User },
    { name: 'My Applications', href: '/worker/applications', icon: FileCheck },
    { name: 'Saved Jobs & Internships', href: '/worker/saved', icon: Bookmark },
    { name: 'Find Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Find Internships', href: '/internships', icon: GraduationCap },
    { name: 'Employer Reviews', href: '/worker/reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black">
              ሰ
            </div>
            <span className="font-black text-slate-900 text-sm tracking-tight hidden sm:inline">
              SERATEGNA<span className="text-emerald-700">.COM</span>
            </span>
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Worker Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition hidden sm:inline"
          >
            ← Back to Public Website
          </Link>

          <button
            onClick={() => switchDemoPersona('guest')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120"
              alt="Abebe Kebede"
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">Abebe Kebede</p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Verified Electrician</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm h-fit sticky top-20">
          <div className="p-3 mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Phone Protected:</strong> Hidden from public scrapers.
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
