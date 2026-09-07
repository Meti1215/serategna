'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { workerProfilesService, calculateProfileCompletion } from '@/services/workerProfilesService';
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
  WorkerProfileStatus,
} from '@/types';
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
import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Save,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type LucideIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: string | number }>;

const COMPLETION_LABELS: Record<string, string> = {
  basic: 'Basic Information',
  professional: 'Professional Summary',
  skills: 'Skills (3+)',
  experience: 'Work Experience',
  education: 'Education',
  training: 'Training',
  certificates: 'Certificates',
  languages: 'Languages',
  availability: 'Availability',
  documents: 'Documents (CV/Public)',
};

function StatusBanner({ status, rejectionReason }: { status: WorkerProfileStatus; rejectionReason?: string }) {
  const config: Record<WorkerProfileStatus, { icon: LucideIcon; label: string; desc: string; color: string }> = {
    draft: { icon: Clock, label: 'Draft', desc: 'Your profile is saved as a draft. Complete and submit it for approval.', color: 'bg-slate-50 border-slate-200 text-slate-800' },
    pending: { icon: AlertTriangle, label: 'Pending Review', desc: 'Your profile has been submitted and is waiting for administrator approval.', color: 'bg-amber-50 border-amber-200 text-amber-900' },
    approved: { icon: CheckCircle2, label: 'Approved & Live', desc: 'Your profile is public and visible to employers across Ethiopia.', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
    rejected: { icon: XCircle, label: 'Changes Requested', desc: 'Your profile needs changes. Review the reason below, edit, and resubmit.', color: 'bg-rose-50 border-rose-200 text-rose-900' },
    suspended: { icon: XCircle, label: 'Suspended', desc: 'Your profile has been suspended. Contact support for details.', color: 'bg-slate-900 border-slate-700 text-white' },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <div className={`rounded-2xl border p-5 ${c.color}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-bold text-sm">{c.label}</div>
          <p className="text-xs opacity-80 mt-0.5 leading-relaxed">{c.desc}</p>
          {status === 'rejected' && rejectionReason && (
            <div className="mt-3 p-3 rounded-xl bg-white/60 border border-rose-200/50 text-xs">
              <div className="font-bold mb-1">Admin feedback:</div>
              <p className="whitespace-pre-line">{rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children, defaultOpen = true }: { title: string; subtitle?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-slate-50 transition text-left"
      >
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 sm:px-6 pb-6 space-y-4">{children}</div>}
    </div>
  );
}

export default function WorkerProfileEditPage() {
  const { user, workerProfileId } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [profile, setProfile] = useState<FullWorkerProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const uid = user?.id;
      const pid = workerProfileId;
      if (!uid && !pid) {
        router.push('/register/worker');
        return;
      }
      let p: FullWorkerProfile | null = null;
      if (pid) p = await workerProfilesService.getFullProfileById(pid, uid ?? undefined);
      if (!p && uid) p = await workerProfilesService.getFullProfileByUserId(uid);
      if (!p) {
        router.push('/register/worker');
        return;
      }
      setProfile(p);
    }
    load();
  }, [user, workerProfileId, router]);

  const completion = useMemo(() => (profile ? calculateProfileCompletion(profile) : { percent: 0, missing: [] as string[] }), [profile]);

  const regionObj = profile?.region ? mockRegions.find((r) => r.name === profile.region) : null;
  const cityOptions = regionObj?.majorCities ?? [];

  if (!profile) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const update = <K extends keyof FullWorkerProfile>(key: K, value: FullWorkerProfile[K]) => {
    setProfile((p) => (p ? { ...p, [key]: value } : p));
  };

  type NestedPath = 'genderIdentity' | 'preferredLocation' | 'availability' | 'expectedSalary';

  const updateNested = <K extends NestedPath>(path: K, patch: Partial<FullWorkerProfile[K]>) => {
    setProfile((p) => (p ? { ...p, [path]: { ...p[path], ...patch } } : p));
  };

  const handleSave = async () => {
    if (!profile || !user) return;
    setSaving(true);
    try {
      const updated = await workerProfilesService.updateProfile(profile.id, user.id, profile);
      if (updated) {
        setProfile(updated);
        showToast('Saved', 'Profile changes saved successfully.', 'success');
      } else {
        showToast('Error', 'Could not save. Are you the owner of this profile?', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!profile || !user) return;
    if (completion.percent < 40) {
      showToast('Incomplete Profile', `Please complete at least 40% of your profile before submitting. Currently ${completion.percent}%.`, 'error');
      return;
    }
    setSubmitting(true);
    try {
      const updated = await workerProfilesService.submitProfileForApproval(profile.id, user.id);
      if (updated) {
        setProfile(updated);
        showToast('Submitted', 'Your profile is now pending admin review.', 'success');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = profile.profileStatus === 'draft' || profile.profileStatus === 'rejected';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Manage Your Worker Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Keep your credentials up to date to increase visibility among Ethiopian employers.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-800 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving…' : 'Save Changes'}</span>
          </button>
          {canSubmit && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-700/20"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting…' : profile.profileStatus === 'rejected' ? 'Resubmit for Review' : 'Submit for Approval'}</span>
            </button>
          )}
        </div>
      </div>

      <StatusBanner status={profile.profileStatus} rejectionReason={profile.rejectionReason} />

      {/* Profile Completion Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full border-[6px] border-slate-100 flex items-center justify-center" style={{ background: `conic-gradient(#047857 ${completion.percent * 3.6}deg, #e2e8f0 0deg)` }}>
                <div className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-black text-slate-900">{completion.percent}%</div>
                    <div className="text-[9px] uppercase tracking-wider font-bold text-slate-500">Complete</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Profile Completion</h2>
              <p className="text-xs text-slate-500 mt-1">
                {completion.percent === 100
                  ? 'Excellent! Your profile is fully completed.'
                  : completion.missing.length > 0
                  ? `Complete these sections to reach 100%:`
                  : 'Almost there!'}
              </p>
              {completion.missing.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {completion.missing.map((m) => (
                    <span key={m} className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                      + {COMPLETION_LABELS[m]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section: Basic Information */}
      <Section title="Basic Information" subtitle="Personal details and contact information">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-2">Profile Photo</label>
            <ProfilePhotoUploader value={profile.avatar} onChange={(v) => update('avatar', v)} />
          </div>
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number * (Private)</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+251..."
                  className="w-full pl-9 pr-2.5 p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={profile.email ?? ''}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-2.5 p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Region *</label>
              <select
                value={profile.region ?? ''}
                onChange={(e) => {
                  update('region', e.target.value || undefined);
                  update('city', undefined);
                }}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="">Select region</option>
                {mockRegions.map((r) => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
              <select
                value={profile.city ?? ''}
                onChange={(e) => update('city', e.target.value || undefined)}
                disabled={!profile.region}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">{profile.region ? 'Select city' : 'Select region first'}</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sub-city / Woreda</label>
              <input
                type="text"
                value={profile.subCityWoreda ?? ''}
                onChange={(e) => update('subCityWoreda', e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Address / Location Details</label>
              <input
                type="text"
                value={profile.address ?? ''}
                onChange={(e) => update('address', e.target.value)}
                placeholder="e.g. Bole Medhanealem, behind St. George Church"
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={profile.genderIdentity.gender ?? ''}
                onChange={(e) => updateNested<'genderIdentity'>('genderIdentity', { gender: (e.target.value || undefined) as FullWorkerProfile['genderIdentity']['gender'] })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth (Private)</label>
              <input
                type="date"
                value={profile.genderIdentity.dateOfBirth ?? ''}
                onChange={(e) => updateNested<'genderIdentity'>('genderIdentity', { dateOfBirth: e.target.value || undefined })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Marital Status (Private)</label>
              <select
                value={profile.genderIdentity.maritalStatus ?? ''}
                onChange={(e) => updateNested<'genderIdentity'>('genderIdentity', { maritalStatus: (e.target.value || undefined) as FullWorkerProfile['genderIdentity']['maritalStatus'] })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="">Prefer not to say</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      {/* Section: Professional Information */}
      <Section title="Professional Information" subtitle="Job title, category, experience, and about">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Job Title *</label>
            <input
              type="text"
              value={profile.jobTitle}
              onChange={(e) => update('jobTitle', e.target.value)}
              placeholder="e.g. Electrician, Mason, Driver..."
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Job Category</label>
            <select
              value={profile.jobCategory ?? ''}
              onChange={(e) => update('jobCategory', e.target.value || undefined)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="">Select category</option>
              {mockCategories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience</label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min={0}
                max={60}
                value={profile.yearsOfExperience}
                onChange={(e) => update('yearsOfExperience', Number(e.target.value) || 0)}
                className="w-full pl-9 pr-2.5 p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
          <div />
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Professional Summary / About</label>
            <textarea
              rows={5}
              value={profile.aboutBio ?? ''}
              onChange={(e) => update('aboutBio', e.target.value)}
              placeholder="Tell employers about yourself, your strengths, and why they should hire you..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
            />
            <p className="text-[10px] text-slate-400 mt-1">{(profile.aboutBio ?? '').length} characters — aim for 80+ for better visibility.</p>
          </div>
        </div>
      </Section>

      <Section title="Skills" subtitle="Your core competencies with proficiency levels">
        <SkillsEditor skills={profile.skills} onChange={(v: WorkerSkill[]) => update('skills', v)} />
      </Section>

      <Section title="Work Experience" subtitle="Employment history — show most recent first">
        <ExperienceEditor items={profile.workExperience} onChange={(v: WorkerExperience[]) => update('workExperience', v)} />
      </Section>

      <Section title="Education" subtitle="Formal education and vocational training">
        <EducationEditor items={profile.education} onChange={(v: WorkerEducation[]) => update('education', v)} />
      </Section>

      <Section title="Training Programs" subtitle="Professional short courses and workshops">
        <TrainingEditor items={profile.training} onChange={(v: WorkerTraining[]) => update('training', v)} />
      </Section>

      <Section title="Certificates & Licenses" subtitle="Professional certifications, PDF/JPG supported">
        <CertificatesEditor items={profile.certificates} onChange={(v: WorkerCertificate[]) => update('certificates', v)} />
      </Section>

      <Section title="Languages" subtitle="Languages you can communicate in">
        <LanguagesEditor items={profile.languages} onChange={(v: WorkerLanguage[]) => update('languages', v)} />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Availability" subtitle="When can you start working?">
          <AvailabilityPicker value={profile.availability} onChange={(v: WorkerAvailability) => update('availability', v)} />
        </Section>

        <Section title="Expected Salary" subtitle="Set your compensation expectations (optional)">
          <SalaryPicker value={profile.expectedSalary} onChange={(v: WorkerExpectedSalary) => update('expectedSalary', v)} />
        </Section>
      </div>

      <Section title="Preferred Work Location" subtitle="Where would you like to work?">
        <PreferredLocationEditor value={profile.preferredLocation} regions={mockRegions} onChange={(v: WorkerPreferredLocation) => update('preferredLocation', v)} />
      </Section>

      <Section title="Documents" subtitle="CV, certificates, licenses, and other files. Set visibility per document.">
        <DocumentsUploader items={profile.documents} onChange={(v: WorkerDocument[]) => update('documents', v)} />
      </Section>

      {/* Sticky mobile action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex gap-2 z-40 shadow-2xl">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        {canSubmit && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs disabled:opacity-60 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
          >
            <Send className="w-4 h-4" />
            <span>{profile.profileStatus === 'rejected' ? 'Resubmit' : 'Submit'}</span>
          </button>
        )}
      </div>
      <div className="md:hidden h-20" />
    </div>
  );
}
