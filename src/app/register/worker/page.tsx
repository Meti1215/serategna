'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  SkillsEditor,
  ExperienceEditor,
  EducationEditor,
  TrainingEditor,
  LanguagesEditor,
  CertificatesEditor,
  DocumentsUploader,
  AvailabilityPicker,
  SalaryPicker,
  PreferredLocationEditor,
  ProfilePhotoUploader,
} from '@/components/worker/ProfileEditors';
import { workerProfilesService, makeDefaultFullProfile, calculateProfileCompletion } from '@/services/workerProfilesService';
import { mockCategories } from '@/data/mockCategories';
import { mockRegions } from '@/data/mockRegions';
import {
  FullWorkerProfile,
  WorkerSkill,
  WorkerExperience,
  WorkerEducation,
  WorkerTraining,
  WorkerLanguage,
  WorkerCertificate,
  WorkerDocument,
  WorkerAvailability,
  WorkerExpectedSalary,
  WorkerPreferredLocation,
  WorkerGenderIdentity,
} from '@/types';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ShieldCheck,
  Eye,
  Pencil,
  AlertCircle,
  Send,
  User,
  Briefcase,
  GraduationCap,
  Award,
  FileCheck2,
  Sparkles,
  Lock,
  Phone,
  MapPin,
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Basic Information', icon: <User className="w-4 h-4" /> },
  { id: 2, title: 'Professional Information', icon: <Briefcase className="w-4 h-4" /> },
  { id: 3, title: 'Experience & Education', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 4, title: 'Training & Languages', icon: <Award className="w-4 h-4" /> },
  { id: 5, title: 'Documents', icon: <FileCheck2 className="w-4 h-4" /> },
  { id: 6, title: 'Review & Submit', icon: <Sparkles className="w-4 h-4" /> },
];

type BasicInfo = {
  fullName: string;
  avatar?: string;
  phone: string;
  email?: string;
  region?: string;
  city?: string;
  subCityWoreda?: string;
  address?: string;
  genderIdentity: WorkerGenderIdentity;
};

type ProfessionalInfo = {
  jobTitle: string;
  jobCategory?: string;
  aboutBio?: string;
  yearsOfExperience: number;
  skills: WorkerSkill[];
};

type ExpEduInfo = {
  workExperience: WorkerExperience[];
  education: WorkerEducation[];
};

type TrainingLangInfo = {
  training: WorkerTraining[];
  certificates: WorkerCertificate[];
  languages: WorkerLanguage[];
};

type DocsInfo = {
  documents: WorkerDocument[];
};

type OptionsInfo = {
  availability: WorkerAvailability;
  expectedSalary: WorkerExpectedSalary;
  preferredLocation: WorkerPreferredLocation;
};

type FormState = BasicInfo & ProfessionalInfo & ExpEduInfo & TrainingLangInfo & DocsInfo & OptionsInfo;

const INITIAL: FormState = {
  fullName: '',
  phone: '',
  email: '',
  region: '',
  city: '',
  subCityWoreda: '',
  address: '',
  genderIdentity: {},
  jobTitle: '',
  jobCategory: undefined,
  aboutBio: '',
  yearsOfExperience: 0,
  skills: [],
  workExperience: [],
  education: [],
  training: [],
  certificates: [],
  languages: [],
  documents: [],
  availability: { type: 'available_now' },
  expectedSalary: { period: 'negotiable', currency: 'ETB', public: false },
  preferredLocation: { additionalPreferredCities: [], willingToRelocate: false },
};

const DRAFT_STORAGE = 'serategna:worker_registration_draft_v1';

function loadDraft(): FormState {
  try {
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(DRAFT_STORAGE);
      if (raw) return { ...INITIAL, ...(JSON.parse(raw) as FormState) };
    }
  } catch {
    // ignore
  }
  return { ...INITIAL };
}

function saveDraft(state: FormState) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DRAFT_STORAGE, JSON.stringify(state));
    }
  } catch {
    // ignore
  }
}

function validateStep(step: number, state: FormState): string[] {
  const errs: string[] = [];
  if (step === 1) {
    if (!state.fullName.trim()) errs.push('Full name is required.');
    if (!state.phone.trim()) errs.push('Phone number is required.');
    if (!state.region) errs.push('Region is required.');
    if (!state.city) errs.push('City is required.');
  } else if (step === 2) {
    if (!state.jobTitle.trim()) errs.push('Job title is required.');
    if (!state.jobCategory) errs.push('Job category is required.');
    if (state.skills.length < 1) errs.push('Add at least one skill.');
    if (state.yearsOfExperience < 0) errs.push('Years of experience cannot be negative.');
    if (state.aboutBio && state.aboutBio.length < 30) errs.push('Professional summary should be at least 30 characters.');
  }
  return errs;
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full">
      <ol className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2">
        {STEPS.map((s) => {
          const done = s.id < step;
          const current = s.id === step;
          return (
            <li key={s.id} className="flex items-center gap-2 shrink-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition ${
                  done
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : current
                    ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 shadow-md'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? <CheckCircle2 className="w-5 h-5" /> : current ? s.icon : <Circle className="w-4 h-4" />}
              </div>
              <div className="min-w-[80px] max-w-[120px]">
                <p
                  className={`text-[11px] font-bold truncate ${
                    done || current ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  Step {s.id}
                </p>
                <p className={`text-[10px] truncate ${current ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  {s.title}
                </p>
              </div>
              {s.id < STEPS.length && (
                <div className={`h-0.5 w-6 md:w-10 shrink-0 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div>
        <h2 className="text-base font-extrabold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
  );
}

const inputClass =
  'w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none';

export default function WorkerRegistrationPage() {
  const router = useRouter();
  const { registerWorker } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [state, setState] = useState<FormState>(() => loadDraft());
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) saveDraft(state);
    else mountedRef.current = true;
  }, [state]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const profileCompletion = useMemo(() => {
    const dummy = makeDefaultFullProfile('draft-user', { ...state });
    return calculateProfileCompletion(dummy);
  }, [state]);

  const selectedRegion = mockRegions.find((r) => r.name === state.region);
  const cities = selectedRegion?.majorCities ?? [];

  const canGoBack = step > 1;
  const isLast = step === STEPS.length;

  const next = () => {
    const e = validateStep(step, state);
    if (e.length > 0) {
      setErrors(e);
      showToast('Please fix the following', e[0], 'error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors([]);
    if (isLast) return;
    setStep((s) => Math.min(STEPS.length, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setErrors([]);
    if (canGoBack) setStep((s) => Math.max(1, s - 1));
  };

  const jumpToStep = (s: number) => {
    setErrors([]);
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    const e = validateStep(1, state).concat(validateStep(2, state));
    if (e.length > 0) {
      setErrors(e);
      showToast('Incomplete Profile', e[0], 'error');
      return;
    }
    setSubmitting(true);
    try {
      const userId = `worker-user-${Date.now()}`;
      const base = makeDefaultFullProfile(userId, {
        fullName: state.fullName.trim(),
        avatar: state.avatar,
        phone: state.phone.trim(),
        email: state.email?.trim() || undefined,
        genderIdentity: state.genderIdentity,
        region: state.region || undefined,
        city: state.city || undefined,
        subCityWoreda: state.subCityWoreda?.trim() || undefined,
        address: state.address?.trim() || undefined,
        jobTitle: state.jobTitle.trim(),
        jobCategory: state.jobCategory,
        aboutBio: state.aboutBio?.trim() || undefined,
        yearsOfExperience: state.yearsOfExperience,
        skills: state.skills,
        workExperience: state.workExperience,
        education: state.education,
        training: state.training,
        certificates: state.certificates,
        languages: state.languages,
        documents: state.documents,
        availability: state.availability,
        expectedSalary: state.expectedSalary,
        preferredLocation: state.preferredLocation,
      } as Partial<FullWorkerProfile>);

      const created = await workerProfilesService.createProfile(base);
      const submitted = await workerProfilesService.submitProfileForApproval(created.id, created.userId);

      if (submitted) {
        registerWorker(submitted.userId, submitted.id, submitted.fullName, submitted.email, submitted.avatar);
      }

      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(DRAFT_STORAGE);
        }
      } catch {
        // ignore
      }

      showToast(
        'Profile Submitted!',
        'Your profile is pending administrator approval. It will appear on Find Workers once approved.',
        'success'
      );

      router.push('/worker/profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Header */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="relative space-y-2">
              <div className="flex items-center gap-2 text-emerald-300">
                <Sparkles className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Serategna Worker Onboarding</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Create Your Worker Profile</h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
                Showcase your skills, experience, and qualifications to employers. Your phone number is stored securely and never displayed publicly.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-3 text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-emerald-200">
                  <Lock className="w-3.5 h-3.5" /> Phone-number privacy enforced
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Documents secured by visibility level
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-200">
                  <Eye className="w-3.5 h-3.5" /> Draft auto-saved locally
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <ProgressBar step={step} />
          </div>

          {/* Completion summary bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-12 h-12 shrink-0">
                <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#047857"
                    strokeWidth="3"
                    strokeDasharray={`${profileCompletion.percent}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-emerald-800">
                  {profileCompletion.percent}%
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900">Profile {profileCompletion.percent}% Complete</p>
                {profileCompletion.missing.length > 0 && (
                  <p className="text-[11px] text-slate-500 truncate max-w-md">
                    Add: {profileCompletion.missing.slice(0, 4).join(', ')}{' '}
                    {profileCompletion.missing.length > 4 ? `+${profileCompletion.missing.length - 4} more` : ''}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/"
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={() => showToast('Draft Saved', 'Your progress is saved locally in this browser.', 'info')}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Save Draft
              </button>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-rose-900">Please review the following:</p>
                  <ul className="mt-1 space-y-0.5">
                    {errors.map((e, i) => (
                      <li key={i} className="text-[11px] text-rose-800 list-disc list-inside">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* =============== STEP 1: BASIC =============== */}
          {step === 1 && (
            <SectionCard
              title="Step 1 — Basic Information"
              subtitle="Tell employers who you are. Fields marked with * are required."
            >
              <div className="mb-6">
                <Label>Profile Photo</Label>
                <ProfilePhotoUploader value={state.avatar} onChange={(v) => update('avatar', v)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label required>Full Name</Label>
                  <input
                    type="text"
                    value={state.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    placeholder="e.g. Abebe Kebede"
                    className={inputClass}
                  />
                </div>

                <div>
                  <Label required>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone Number
                    </span>
                  </Label>
                  <input
                    type="tel"
                    value={state.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+251 91 123 4567"
                    className={inputClass}
                  />
                  <p className="text-[10px] text-slate-400 mt-1 inline-flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Never shown publicly. Unlocked only by verified employers.
                  </p>
                </div>
                <div>
                  <Label>Email (Optional)</Label>
                  <input
                    type="email"
                    value={state.email ?? ''}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@email.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <Label required>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Region
                    </span>
                  </Label>
                  <select
                    value={state.region ?? ''}
                    onChange={(e) => setState((s) => ({ ...s, region: e.target.value || undefined, city: undefined }))}
                    className={`${inputClass} bg-white cursor-pointer`}
                  >
                    <option value="">Select region...</option>
                    {mockRegions.map((r) => (
                      <option key={r.id} value={r.name}>{r.name} ({r.amharicName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label required>City</Label>
                  <select
                    value={state.city ?? ''}
                    onChange={(e) => update('city', e.target.value || undefined)}
                    disabled={!state.region}
                    className={`${inputClass} bg-white cursor-pointer disabled:bg-slate-100 disabled:text-slate-400`}
                  >
                    <option value="">{state.region ? 'Select city...' : 'Pick a region first'}</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Sub-city / Woreda</Label>
                  <input
                    type="text"
                    value={state.subCityWoreda ?? ''}
                    onChange={(e) => update('subCityWoreda', e.target.value)}
                    placeholder="e.g. Bole, Woreda 3"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label>Address / Location</Label>
                  <input
                    type="text"
                    value={state.address ?? ''}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder="Near Bole Medhanealem Church"
                    className={inputClass}
                  />
                </div>

                <div>
                  <Label>Gender</Label>
                  <select
                    value={state.genderIdentity.gender ?? ''}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        genderIdentity: { ...s.genderIdentity, gender: (e.target.value || undefined) as WorkerGenderIdentity['gender'] },
                      }))
                    }
                    className={`${inputClass} bg-white cursor-pointer`}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <Label>Date of Birth (Private)</Label>
                  <input
                    type="date"
                    value={state.genderIdentity.dateOfBirth ?? ''}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        genderIdentity: { ...s.genderIdentity, dateOfBirth: e.target.value || undefined },
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Marital Status</Label>
                  <select
                    value={state.genderIdentity.maritalStatus ?? ''}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        genderIdentity: {
                          ...s.genderIdentity,
                          maritalStatus: (e.target.value || undefined) as WorkerGenderIdentity['maritalStatus'],
                        },
                      }))
                    }
                    className={`${inputClass} bg-white cursor-pointer md:w-1/2`}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </SectionCard>
          )}

          {/* =============== STEP 2: PROFESSIONAL =============== */}
          {step === 2 && (
            <SectionCard
              title="Step 2 — Professional Information"
              subtitle="Describe your profession and skills."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label required>Job Title</Label>
                  <input
                    type="text"
                    value={state.jobTitle}
                    onChange={(e) => update('jobTitle', e.target.value)}
                    placeholder="e.g. Electrician"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label required>Job Category</Label>
                  <select
                    value={state.jobCategory ?? ''}
                    onChange={(e) => update('jobCategory', e.target.value || undefined)}
                    className={`${inputClass} bg-white cursor-pointer`}
                  >
                    <option value="">Select category...</option>
                    {mockCategories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Years of Professional Experience</Label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={state.yearsOfExperience}
                    onChange={(e) => update('yearsOfExperience', Number(e.target.value) || 0)}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Professional Summary (Min 30 chars recommended)</Label>
                  <textarea
                    rows={4}
                    value={state.aboutBio ?? ''}
                    onChange={(e) => update('aboutBio', e.target.value)}
                    placeholder="Describe your expertise, specialties, and the kinds of work you excel at..."
                    className={`${inputClass} resize-none`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1 text-right">
                    {(state.aboutBio ?? '').length} characters
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Label required>Skills & Competencies</Label>
                <SkillsEditor skills={state.skills} onChange={(v) => update('skills', v)} />
              </div>
            </SectionCard>
          )}

          {/* =============== STEP 3: EXPERIENCE & EDUCATION =============== */}
          {step === 3 && (
            <SectionCard
              title="Step 3 — Experience & Education"
              subtitle="List your work history and qualifications (most recent first)."
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-700" /> Work Experience
                  </h3>
                  <ExperienceEditor items={state.workExperience} onChange={(v) => update('workExperience', v)} />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-700" /> Education
                  </h3>
                  <EducationEditor items={state.education} onChange={(v) => update('education', v)} />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-700" /> Expected Salary
                  </h3>
                  <SalaryPicker value={state.expectedSalary} onChange={(v) => update('expectedSalary', v)} />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" /> Preferred Work Location
                  </h3>
                  <PreferredLocationEditor
                    value={state.preferredLocation}
                    regions={mockRegions}
                    onChange={(v) => update('preferredLocation', v)}
                  />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-4 h-4 text-emerald-700 flex items-center justify-center">⏱</span> Availability
                  </h3>
                  <AvailabilityPicker value={state.availability} onChange={(v) => update('availability', v)} />
                </div>
              </div>
            </SectionCard>
          )}

          {/* =============== STEP 4: TRAINING, CERTIFICATES, LANGUAGES =============== */}
          {step === 4 && (
            <SectionCard
              title="Step 4 — Training, Certificates & Languages"
              subtitle="Boost your profile with professional credentials and language skills."
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Professional Training</h3>
                  <TrainingEditor items={state.training} onChange={(v) => update('training', v)} />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Certificates & Licenses</h3>
                  <CertificatesEditor items={state.certificates} onChange={(v) => update('certificates', v)} />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Languages</h3>
                  <LanguagesEditor items={state.languages} onChange={(v) => update('languages', v)} />
                </div>
              </div>
            </SectionCard>
          )}

          {/* =============== STEP 5: DOCUMENTS =============== */}
          {step === 5 && (
            <SectionCard
              title="Step 5 — Documents"
              subtitle="Upload CV, certificates, and supporting documents. Choose visibility carefully — sensitive documents must stay Private."
            >
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-5">
                <p className="text-xs text-amber-900 font-semibold flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
                  <span>
                    Important: Identity documents and sensitive information should be marked <strong>Private</strong>.
                    Public documents are shown on your profile. Employer-only documents are shared only with employers who interact with you.
                  </span>
                </p>
              </div>
              <DocumentsUploader items={state.documents} onChange={(v) => update('documents', v)} />
            </SectionCard>
          )}

          {/* =============== STEP 6: REVIEW =============== */}
          {step === 6 && (
            <div className="space-y-6">
              <SectionCard
                title="Step 6 — Review & Submit"
                subtitle="Review your profile before submission. Click Edit to return to any section."
              >
                <div className="space-y-6">
                  {/* Personal */}
                  <ReviewBlock
                    title="Personal Information"
                    onEdit={() => jumpToStep(1)}
                    items={[
                      { label: 'Name', value: state.fullName || '—' },
                      { label: 'Photo', value: state.avatar ? '✓ Uploaded' : 'Not uploaded' },
                      { label: 'Phone', value: state.phone ? '●●●●●●●● (stored securely, not public)' : '—', secret: true },
                      { label: 'Email', value: state.email || '—' },
                      { label: 'Region', value: state.region || '—' },
                      { label: 'City', value: state.city || '—' },
                      { label: 'Sub-city / Woreda', value: state.subCityWoreda || '—' },
                      { label: 'Address', value: state.address || '—' },
                      { label: 'Gender', value: state.genderIdentity.gender || 'Prefer not to say' },
                    ]}
                  />

                  {/* Professional */}
                  <ReviewBlock
                    title="Professional Information"
                    onEdit={() => jumpToStep(2)}
                    items={[
                      { label: 'Job Title', value: state.jobTitle || '—' },
                      { label: 'Job Category', value: state.jobCategory || '—' },
                      { label: 'Years Experience', value: `${state.yearsOfExperience}` },
                      { label: 'Skills', value: state.skills.length > 0 ? state.skills.map((s) => `${s.name} (${s.level})`).join('; ') : '—' },
                      { label: 'Summary', value: state.aboutBio ? state.aboutBio.slice(0, 160) + (state.aboutBio.length > 160 ? '...' : '') : '—' },
                    ]}
                  />

                  {/* Experience & Education */}
                  <ReviewBlock
                    title="Experience, Education & Preferences"
                    onEdit={() => jumpToStep(3)}
                    items={[
                      { label: 'Work Experience', value: `${state.workExperience.length} record(s)` },
                      { label: 'Education', value: `${state.education.length} record(s)` },
                      { label: 'Availability', value: state.availability.type.replace(/_/g, ' ') },
                      {
                        label: 'Expected Salary',
                        value:
                          state.expectedSalary.period === 'negotiable'
                            ? 'Negotiable'
                            : `${state.expectedSalary.min ?? '?'} – ${state.expectedSalary.max ?? '?'} ETB / ${state.expectedSalary.period.replace('per_', '')}${state.expectedSalary.public ? ' • Public' : ' • Private'}`,
                      },
                    ]}
                  />

                  {/* Training & languages */}
                  <ReviewBlock
                    title="Training, Certificates & Languages"
                    onEdit={() => jumpToStep(4)}
                    items={[
                      { label: 'Training', value: `${state.training.length} record(s)` },
                      { label: 'Certificates', value: `${state.certificates.length} certificate(s)` },
                      { label: 'Languages', value: state.languages.length > 0 ? state.languages.map((l) => `${l.language} (${l.proficiency})`).join(', ') : '—' },
                    ]}
                  />

                  {/* Documents */}
                  <ReviewBlock
                    title="Documents"
                    onEdit={() => jumpToStep(5)}
                    items={[
                      {
                        label: 'Uploaded Documents',
                        value:
                          state.documents.length === 0
                            ? 'None'
                            : state.documents
                                .map((d) => `${d.title} [${d.visibility.replace('_', ' ')}]`)
                                .join('; '),
                      },
                    ]}
                  />
                </div>
              </SectionCard>

              {/* Submit card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-2 border-emerald-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Send className="w-5 h-5 text-emerald-700" />
                      Ready to Submit
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Once you submit, your profile status becomes <strong>Pending Review</strong>. An administrator will
                      review your profile, and once approved it appears in the Find Workers marketplace.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={back}
                      className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={submit}
                      disabled={submitting}
                      className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md shadow-emerald-700/20 transition flex items-center gap-2 disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <span className="w-3 h-3 rounded-full border-2 border-white/60 border-t-transparent animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Submit Profile for Approval
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step navigation */}
          {step !== 6 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-4 bg-white/95 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-md z-10">
              <button
                type="button"
                onClick={back}
                disabled={!canGoBack}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <div className="text-[11px] font-semibold text-slate-500 order-first sm:order-none">
                Step {step} of {STEPS.length}
              </div>
              <button
                type="button"
                onClick={next}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm shadow-emerald-700/20 flex items-center justify-center gap-1.5"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ReviewBlock({
  title,
  onEdit,
  items,
}: {
  title: string;
  onEdit: () => void;
  items: { label: string; value: React.ReactNode; secret?: boolean }[];
}) {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-emerald-800 hover:bg-emerald-50"
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>
      </div>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-start gap-3 text-xs py-1.5 border-b border-slate-200/60 last:border-b-0">
            <dt className="w-36 shrink-0 font-bold text-slate-700">{it.label}</dt>
            <dd className={`flex-1 text-slate-600 break-words ${it.secret ? 'font-mono' : ''}`}>{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const DollarSign = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
