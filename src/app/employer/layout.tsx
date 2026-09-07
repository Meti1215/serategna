'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  GraduationCap,
  Bookmark,
  FileCheck,
  Lock,
  PlusCircle,
  Gift,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export default function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, employerProfile, switchDemoPersona } = useAuth();

  useEffect(() => {
    if (role !== 'employer' && role !== 'admin') {
      router.replace('/login');
    }
  }, [role, router]);

  const navItems = [
    { name: 'Dashboard', href: '/employer/dashboard', icon: LayoutDashboard },
    { name: 'Find Workers', href: '/workers', icon: Users },
    { name: 'Saved Workers', href: '/employer/saved-workers', icon: Bookmark },
    { name: 'Post a Job', href: '/employer/jobs/new', icon: PlusCircle, badge: 'Bonus' },
    { name: 'Manage Jobs', href: '/employer/jobs', icon: Briefcase },
    { name: 'Post Internship', href: '/employer/internships/new', icon: GraduationCap },
    { name: 'Manage Internships', href: '/employer/internships', icon: Briefcase },
    { name: 'Review Applications', href: '/employer/applications', icon: FileCheck },
    { name: 'Phone Unlocks & Payments', href: '/employer/unlocks', icon: Lock },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Top Bar */}
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
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Employer Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Free Unlocks Remaining Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
            <Gift className="w-3.5 h-3.5 text-amber-600" />
            <span>{employerProfile.freeUnlocksRemaining} Free Unlock Available</span>
          </div>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition hidden md:inline"
          >
            ← Public Marketplace
          </Link>

          <button
            onClick={() => switchDemoPersona('guest')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              ABC
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">
                {employerProfile.companyName}
              </p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                {employerProfile.name} • Verified
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm h-fit sticky top-20">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && !isActive && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
