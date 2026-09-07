'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { mockCategories } from '@/data/mockCategories';
import { mockRegions } from '@/data/mockRegions';
import {
  User,
  Phone,
  Mail,
  Lock,
  Building,
  Gift,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as 'worker' | 'employer') || 'worker';

  const [accountType, setAccountType] = useState<'worker' | 'employer'>(initialType);
  const { switchDemoPersona } = useAuth();
  const { showToast } = useToast();

  // Worker Form State
  const [wName, setWName] = useState('');
  const [wPhone, setWPhone] = useState('');
  const [wEmail, setWEmail] = useState('');
  const [wPassword, setWPassword] = useState('');
  const [wCategory, setWCategory] = useState('Electricians');
  const [wRegion, setWRegion] = useState('Addis Ababa');
  const [wLookingForInternship, setWLookingForInternship] = useState(false);

  // Employer Form State
  const [eName, setEName] = useState('');
  const [eCompany, setECompany] = useState('');
  const [ePhone, setEPhone] = useState('');
  const [eEmail, setEEmail] = useState('');
  const [ePassword, setEPassword] = useState('');
  const [eType, setEType] = useState('Corporate Enterprise');
  const [eRegion, setERegion] = useState('Addis Ababa');

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchDemoPersona('worker');
    showToast(
      'Account Created!',
      'Welcome to Serategna. You can now complete your profile and upload certificates.',
      'success'
    );
    router.push('/worker/dashboard');
  };

  const handleEmployerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchDemoPersona('employer');
    showToast(
      'Employer Account Created!',
      'Welcome to Serategna. Post your first job to receive 1 Free Worker Phone Unlock!',
      'success'
    );
    router.push('/employer/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create Your Serategna Account
            </h1>
            <p className="text-xs text-slate-500">
              Join Ethiopia&rsquo;s verified employment marketplace.
            </p>
          </div>

          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100">
            <button
              type="button"
              onClick={() => setAccountType('worker')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                accountType === 'worker'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>I am a Worker / Student</span>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('employer')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                accountType === 'employer'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4 text-emerald-600" />
              <span>I am an Employer</span>
            </button>
          </div>

          {/* WORKER REGISTRATION */}
          {accountType === 'worker' ? (
            <form onSubmit={handleWorkerSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
                <span>
                  <strong>Phone Privacy Guaranteed:</strong> Your phone number is never shown publicly without verification and an unlock fee.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={wName}
                    onChange={(e) => setWName(e.target.value)}
                    placeholder="e.g. Abebe Kebede"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ethiopian Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={wPhone}
                      onChange={(e) => setWPhone(e.target.value)}
                      placeholder="+251 91 123 4567"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={wEmail}
                      onChange={(e) => setWEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Profession / Trade
                  </label>
                  <select
                    value={wCategory}
                    onChange={(e) => setWCategory(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white cursor-pointer"
                  >
                    {mockCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Region
                  </label>
                  <select
                    value={wRegion}
                    onChange={(e) => setWRegion(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white cursor-pointer"
                  >
                    {mockRegions.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Internship Seeker Checkbox */}
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-purple-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wLookingForInternship}
                    onChange={(e) => setWLookingForInternship(e.target.checked)}
                    className="rounded text-purple-700 focus:ring-purple-500 w-4 h-4"
                  />
                  <span>I am a student or recent graduate looking for Internships</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={wPassword}
                    onChange={(e) => setWPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2"
              >
                <span>Register as Worker</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* EMPLOYER REGISTRATION */
            <form onSubmit={handleEmployerSubmit} className="space-y-4">
              {/* First Job Rule Incentive Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                <Gift className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[11px] text-amber-950">
                    First-Job Bonus Rule
                  </h4>
                  <p className="mt-0.5 text-amber-800 leading-normal">
                    When you publish your first job or internship vacancy on Serategna, you receive{' '}
                    <strong>1 Free Phone Unlock</strong> to contact your first candidate at no charge!
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={eName}
                    onChange={(e) => setEName(e.target.value)}
                    placeholder="e.g. Girma Tadesse"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company / Organization / Household Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={eCompany}
                    onChange={(e) => setECompany(e.target.value)}
                    placeholder="e.g. ABC Technology PLC or Private Household"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Type</label>
                  <select
                    value={eType}
                    onChange={(e) => setEType(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Corporate Enterprise">Corporate Enterprise</option>
                    <option value="Private Limited Company (PLC)">Private Limited Company (PLC)</option>
                    <option value="Small Business / Startup">Small Business / Startup</option>
                    <option value="Private Household">Private Household</option>
                    <option value="NGO / Non-Profit">NGO / Non-Profit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location / Region</label>
                  <select
                    value={eRegion}
                    onChange={(e) => setERegion(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white cursor-pointer"
                  >
                    {mockRegions.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={ePhone}
                      onChange={(e) => setEPhone(e.target.value)}
                      placeholder="+251 91 190 2211"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={eEmail}
                      onChange={(e) => setEEmail(e.target.value)}
                      placeholder="hiring@company.et"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={ePassword}
                    onChange={(e) => setEPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2"
              >
                <span>Register as Employer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-emerald-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading registration...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
