'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  Lock,
  Phone,
  ArrowRight,
  Shield,
  Building,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { switchDemoPersona } = useAuth();
  const { showToast } = useToast();

  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to employer login for standard form submit
    switchDemoPersona('employer');
    showToast('Logged in successfully', 'Welcome back to Serategna!', 'success');
    router.push('/employer/dashboard');
  };

  const handlePersonaSelect = (persona: 'worker' | 'employer' | 'admin') => {
    switchDemoPersona(persona);
    showToast('Demo Account Activated', `Switched to ${persona.toUpperCase()} mode.`, 'success');
    if (persona === 'worker') router.push('/worker/dashboard');
    else if (persona === 'employer') router.push('/employer/dashboard');
    else router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
              <span>ሰ</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Sign In to Serategna
            </h1>
            <p className="text-xs text-slate-500">
              Access your worker profile, employer dashboard, or administrative control panel.
            </p>
          </div>

          {/* Quick 1-Click Persona Access (Great for Evaluators) */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2.5">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block text-center">
              ⚡ Instant 1-Click Demo Login
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handlePersonaSelect('employer')}
                className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-500 text-slate-800 hover:text-emerald-800 transition shadow-sm text-center flex flex-col items-center gap-1"
              >
                <Building className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-[11px]">Employer</span>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaSelect('worker')}
                className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-500 text-slate-800 hover:text-emerald-800 transition shadow-sm text-center flex flex-col items-center gap-1"
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-[11px]">Worker</span>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaSelect('admin')}
                className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-500 text-slate-800 hover:text-emerald-800 transition shadow-sm text-center flex flex-col items-center gap-1"
              >
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-[11px]">Admin</span>
              </button>
            </div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ethiopian Phone or Email
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="0911 234 567 or email@company.et"
                  className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <a href="#" className="text-[11px] text-emerald-700 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-1.5"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don’t have an account yet?{' '}
            <Link href="/register" className="font-bold text-emerald-700 hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
