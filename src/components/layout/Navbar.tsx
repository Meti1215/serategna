'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Menu,
  X,
  Briefcase,
  Users,
  GraduationCap,
  Sparkles,
  PlusCircle,
  LogIn,
  ChevronDown,
  UserCheck,
  Building,
  Shield,
  Layers,
  MapPin,
  Newspaper,
  HelpCircle,
  Info,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, role, switchDemoPersona, employerProfile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Find Workers', href: '/workers' },
    { name: 'Find Jobs', href: '/jobs' },
    { name: 'Internships', href: '/internships', isNew: true },
    { name: 'Categories', href: '/categories' },
    { name: 'Regions', href: '/regions' },
    { name: 'News', href: '/news' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
  ];

  const getDashboardHref = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'employer') return '/employer/dashboard';
    if (role === 'worker') return '/worker/dashboard';
    return '/login';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top Utility Announcement Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide uppercase">
              Notice
            </span>
            <span>
              🔒 All worker phone numbers are protected. Employers unlock for 100 ETB or post a first job for 1 free unlock!
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-200">
            <span>🇪🇹 Ethiopian Employment Platform</span>
            <span>•</span>
            <span>Addis Ababa HQ: +251 11 667 9900</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                <span className="text-xl leading-none">ሰ</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900">
                    SERATEGNA
                  </span>
                  <span className="text-xs font-bold text-emerald-700">.COM</span>
                </div>
                <span className="text-[10px] font-medium text-slate-500 tracking-wider">
                  ሰራተኛ • Ethiopian Worker Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition relative ${
                      isActive
                        ? 'text-emerald-800 bg-emerald-50'
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                    {link.isNew && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-purple-600 text-white animate-pulse">
                        NEW
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Demo Persona Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition"
                title="Switch persona to test all roles"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="capitalize font-semibold text-slate-900">
                  Role: {role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {personaMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Fast Demo Role Switch
                  </div>
                  <button
                    onClick={() => {
                      switchDemoPersona('employer');
                      setPersonaMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 ${
                      role === 'employer' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <Building className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-semibold">Employer Mode</p>
                      <p className="text-[10px] text-slate-500">ABC Tech (Unlock & Post)</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoPersona('worker');
                      setPersonaMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 ${
                      role === 'worker' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-semibold">Worker / Intern Mode</p>
                      <p className="text-[10px] text-slate-500">Abebe Kebede (Profile & Apply)</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoPersona('admin');
                      setPersonaMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 ${
                      role === 'admin' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="font-semibold">Administrator Mode</p>
                      <p className="text-[10px] text-slate-500">Full Moderation & Revenue</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoPersona('guest');
                      setPersonaMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 ${
                      role === 'guest' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <Users className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-semibold">Guest Mode</p>
                      <p className="text-[10px] text-slate-500">Public visitor</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons or Dashboard */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={getDashboardHref()}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>Dashboard</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Post a Job CTA */}
            <Link
              href="/employer/jobs/new"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm shadow-emerald-700/20 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-1.5 pb-2 border-b border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-medium ${
                  pathname === link.href
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {/* Quick Demo Switch in mobile */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
              <span className="font-semibold text-slate-600">Active Role:</span>
              <div className="flex gap-1">
                {(['employer', 'worker', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchDemoPersona(r)}
                    className={`px-2 py-1 rounded text-[11px] font-bold capitalize ${
                      role === r ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href={getDashboardHref()}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs text-center"
            >
              Go to {role.toUpperCase()} Dashboard
            </Link>

            <Link
              href="/employer/jobs/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs text-center"
            >
              Post a Job (Get 1 Free Unlock)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
