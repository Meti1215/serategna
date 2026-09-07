'use client';

import React, { useRef, useState } from 'react';
import {
  WorkerSkill,
  SkillLevel,
  WorkerExperience,
  WorkerEducation,
  WorkerTraining,
  WorkerLanguage,
  LanguageProficiency,
  WorkerCertificate,
  WorkerDocument,
  DocumentVisibility,
  DocumentCategory,
  WorkerAvailability,
  WorkerExpectedSalary,
  WorkerPreferredLocation,
  WorkerUploadedFile,
} from '@/types';
import { workerProfilesService } from '@/services/workerProfilesService';
import {
  Plus,
  X,
  Pencil,
  Trash2,
  UploadCloud,
  Eye,
  Calendar,
  MapPin,
  Building2,
  GraduationCap,
  Award,
  Languages,
  Briefcase,
  DollarSign,
  Pin,
} from 'lucide-react';

function newId(prefix = 'item'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function LevelBadge({ level }: { level: SkillLevel }) {
  const palette: Record<SkillLevel, string> = {
    Beginner: 'bg-slate-100 text-slate-700 border-slate-200',
    Intermediate: 'bg-blue-50 text-blue-800 border-blue-200',
    Advanced: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Expert: 'bg-amber-50 text-amber-800 border-amber-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${palette[level]}`}>
      {level}
    </span>
  );
}

// ============== SKILLS EDITOR ==============
export function SkillsEditor({
  skills,
  onChange,
}: {
  skills: WorkerSkill[];
  onChange: (v: WorkerSkill[]) => void;
}) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<SkillLevel>('Intermediate');

  const add = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onChange([...skills, { id: newId('skill'), name: trimmed, level }]);
    setName('');
    setLevel('Intermediate');
  };

  const update = (id: string, patch: Partial<WorkerSkill>) => {
    onChange(skills.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const remove = (id: string) => onChange(skills.filter((s) => s.id !== id));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Skill name (e.g. Electrical Installation)"
          className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as SkillLevel)}
          className="p-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
        >
          {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillLevel[]).map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={add}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 justify-center"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          No skills added yet. Add at least 3 skills for a complete profile.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {skills.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-900 truncate">{s.name}</p>
                  <LevelBadge level={s.level} />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <select
                  value={s.level}
                  onChange={(e) => update(s.id, { level: e.target.value as SkillLevel })}
                  className="text-[10px] border border-slate-200 rounded-lg p-1 bg-white cursor-pointer"
                >
                  {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillLevel[]).map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Remove skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============== EXPERIENCE EDITOR ==============
export function ExperienceEditor({
  items,
  onChange,
}: {
  items: WorkerExperience[];
  onChange: (v: WorkerExperience[]) => void;
}) {
  const empty: WorkerExperience = {
    id: '',
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
  };
  const [draft, setDraft] = useState<WorkerExperience>({ ...empty, id: newId('exp') });
  const [editingId, setEditingId] = useState<string | null>(null);

  const reset = () => {
    setDraft({ ...empty, id: newId('exp') });
    setEditingId(null);
  };

  const save = () => {
    if (!draft.jobTitle.trim() || !draft.company.trim()) return;
    if (editingId) {
      onChange(items.map((x) => (x.id === editingId ? { ...draft, id: editingId } : x)));
    } else {
      onChange([draft, ...items]);
    }
    reset();
  };

  const startEdit = (item: WorkerExperience) => {
    setDraft({ ...item });
    setEditingId(item.id);
  };

  const remove = (id: string) => onChange(items.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-emerald-700" />
          {editingId ? 'Edit Work Experience' : 'Add Work Experience'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Job Title *</label>
            <input
              type="text"
              value={draft.jobTitle}
              onChange={(e) => setDraft({ ...draft, jobTitle: e.target.value })}
              placeholder="Electrician"
              className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company / Organization *</label>
            <input
              type="text"
              value={draft.company}
              onChange={(e) => setDraft({ ...draft, company: e.target.value })}
              placeholder="ABC Construction PLC"
              className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </label>
            <input
              type="text"
              value={draft.location ?? ''}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              placeholder="Addis Ababa"
              className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start Date</label>
              <input
                type="month"
                value={draft.startDate ?? ''}
                onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
                className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">End Date</label>
              <input
                type="month"
                disabled={draft.currentlyWorking}
                value={draft.endDate ?? ''}
                onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
                className="w-full p-2 text-xs border border-slate-200 rounded-lg disabled:bg-slate-100 disabled:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={draft.currentlyWorking}
            onChange={(e) => setDraft({ ...draft, currentlyWorking: e.target.checked })}
            className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
          />
          I currently work here
        </label>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description / Responsibilities</label>
          <textarea
            rows={3}
            value={draft.description ?? ''}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="Installed and maintained electrical systems for residential and commercial buildings..."
            className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
          >
            {editingId ? 'Save Changes' : '+ Add Experience'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List (most recent first) */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-white border border-slate-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h4 className="font-bold text-sm text-slate-900">{item.jobTitle}</h4>
                  <span className="text-slate-300">—</span>
                  <span className="text-xs font-semibold text-emerald-800">{item.company}</span>
                  {item.currentlyWorking && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Currently
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 mt-1">
                  {item.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {item.location}
                    </span>
                  )}
                  {(item.startDate || item.endDate || item.currentlyWorking) && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.startDate ? new Date(item.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '?'} –{' '}
                      {item.currentlyWorking
                        ? 'Present'
                        : item.endDate
                        ? new Date(item.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
                        : '?'}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            No work experience added yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ============== EDUCATION EDITOR ==============
export function EducationEditor({
  items,
  onChange,
}: {
  items: WorkerEducation[];
  onChange: (v: WorkerEducation[]) => void;
}) {
  const [draft, setDraft] = useState<WorkerEducation>({
    id: newId('edu'),
    institution: '',
    qualification: '',
    fieldOfStudy: '',
    startYear: '',
    graduationYear: '',
    description: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const reset = () => {
    setDraft({ id: newId('edu'), institution: '', qualification: '', fieldOfStudy: '', startYear: '', graduationYear: '', description: '' });
    setEditingId(null);
  };

  const save = () => {
    if (!draft.institution.trim() || !draft.qualification.trim()) return;
    if (editingId) {
      onChange(items.map((x) => (x.id === editingId ? { ...draft, id: editingId } : x)));
    } else {
      onChange([draft, ...items]);
    }
    reset();
  };

  const startEdit = (e: WorkerEducation) => {
    setDraft({ ...e });
    setEditingId(e.id);
  };
  const remove = (id: string) => onChange(items.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-emerald-700" />
          {editingId ? 'Edit Education' : 'Add Education'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Institution *</label>
            <input
              type="text"
              value={draft.institution}
              onChange={(e) => setDraft({ ...draft, institution: e.target.value })}
              placeholder="Adama Technical College"
              className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Qualification *</label>
            <input
              type="text"
              value={draft.qualification}
              onChange={(e) => setDraft({ ...draft, qualification: e.target.value })}
              placeholder="Diploma / BSc / Certificate"
              className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Field of Study</label>
            <input
              type="text"
              value={draft.fieldOfStudy ?? ''}
              onChange={(e) => setDraft({ ...draft, fieldOfStudy: e.target.value })}
              placeholder="Electrical Installation"
              className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start Year</label>
              <input
                type="text"
                inputMode="numeric"
                value={draft.startYear ?? ''}
                onChange={(e) => setDraft({ ...draft, startYear: e.target.value })}
                placeholder="2018"
                className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Graduation Year</label>
              <input
                type="text"
                inputMode="numeric"
                value={draft.graduationYear ?? ''}
                onChange={(e) => setDraft({ ...draft, graduationYear: e.target.value })}
                placeholder="2021"
                className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description (Optional)</label>
          <textarea
            rows={2}
            value={draft.description ?? ''}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
          />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={save} className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold">
            {editingId ? 'Save Changes' : '+ Add Education'}
          </button>
          {editingId && (
            <button type="button" onClick={reset} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold">
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {items.map((e) => (
          <div key={e.id} className="p-4 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h4 className="font-bold text-sm text-slate-900">{e.qualification}</h4>
                  {e.fieldOfStudy && <span className="text-xs text-slate-500">in {e.fieldOfStudy}</span>}
                </div>
                <p className="text-xs font-semibold text-emerald-800 mt-0.5">{e.institution}</p>
                {(e.startYear || e.graduationYear) && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {e.startYear || '?'} – {e.graduationYear || 'Present'}
                  </p>
                )}
                {e.description && <p className="text-xs text-slate-600 mt-2">{e.description}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => startEdit(e)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => remove(e.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            No education added yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ============== TRAINING EDITOR ==============
export function TrainingEditor({
  items,
  onChange,
}: {
  items: WorkerTraining[];
  onChange: (v: WorkerTraining[]) => void;
}) {
  const [draft, setDraft] = useState<WorkerTraining>({
    id: newId('trn'),
    title: '',
    provider: '',
    date: '',
    duration: '',
    description: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const reset = () => {
    setDraft({ id: newId('trn'), title: '', provider: '', date: '', duration: '', description: '' });
    setEditingId(null);
    setUploadError(null);
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setUploading(true);
    setUploadError(null);
    try {
      const v = workerProfilesService.validateDocumentFile(f);
      if (!v.ok) throw new Error(v.error);
      const uploaded = await workerProfilesService.fileToUploadedFile(f);
      setDraft({ ...draft, certificateFile: uploaded });
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const save = () => {
    if (!draft.title.trim() || !draft.provider.trim()) return;
    if (editingId) onChange(items.map((x) => (x.id === editingId ? { ...draft, id: editingId } : x)));
    else onChange([draft, ...items]);
    reset();
  };

  const startEdit = (e: WorkerTraining) => {
    setDraft({ ...e });
    setEditingId(e.id);
  };
  const remove = (id: string) => onChange(items.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-700" />
          {editingId ? 'Edit Training' : 'Add Professional Training'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Training Title *</label>
            <input type="text" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Advanced Solar PV Installation" className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Training Provider *</label>
            <input type="text" value={draft.provider} onChange={(e) => setDraft({ ...draft, provider: e.target.value })} placeholder="Ethiopian Energy Authority" className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date</label>
            <input type="month" value={draft.date ?? ''} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duration</label>
            <input type="text" value={draft.duration ?? ''} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} placeholder="4 weeks / 80 hours" className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
          <textarea rows={2} value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Training Certificate (PDF/JPG/PNG)</label>
          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-50">
              <UploadCloud className="w-3.5 h-3.5" />
              {uploading ? 'Uploading...' : draft.certificateFile ? 'Replace File' : 'Upload Certificate'}
            </button>
            {draft.certificateFile && (
              <div className="flex items-center gap-2 text-xs text-emerald-700">
                <Eye className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{draft.certificateFile.name}</span>
                <button type="button" onClick={() => setDraft({ ...draft, certificateFile: undefined })} className="text-slate-400 hover:text-rose-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
          {uploadError && <p className="text-[11px] text-rose-600 mt-1">{uploadError}</p>}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={save} className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold">
            {editingId ? 'Save Changes' : '+ Add Training'}
          </button>
          {editingId && (
            <button type="button" onClick={reset} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold">
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="p-4 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-slate-900">{t.title}</h4>
                <p className="text-xs font-semibold text-emerald-800 mt-0.5">{t.provider}</p>
                <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 mt-1">
                  {t.date && <span>{new Date(t.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>}
                  {t.duration && <span>⏱ {t.duration}</span>}
                  {t.certificateFile && (
                    <a href={t.certificateFile.dataUrl} target="_blank" rel="noreferrer" download={t.certificateFile.name} className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-semibold">
                      <Eye className="w-3 h-3" /> View Certificate
                    </a>
                  )}
                </div>
                {t.description && <p className="text-xs text-slate-600 mt-2">{t.description}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => startEdit(t)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => remove(t.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            No training added yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ============== LANGUAGES EDITOR ==============
const LANGUAGE_OPTIONS = [
  'Amharic', 'Afaan Oromo', 'Tigrinya', 'English', 'Arabic',
  'Somali', 'Sidamo', 'Wolaytta', 'Gurage', 'Hadiyya',
  'Kambata', 'Afar', 'Somali', 'Harari', 'Gedeo',
];

export function LanguagesEditor({
  items,
  onChange,
}: {
  items: WorkerLanguage[];
  onChange: (v: WorkerLanguage[]) => void;
}) {
  const [lang, setLang] = useState('');
  const [prof, setProf] = useState<LanguageProficiency>('Intermediate');

  const add = () => {
    const trimmed = lang.trim();
    if (!trimmed) return;
    if (items.some((i) => i.language.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...items, { id: newId('lang'), language: trimmed, proficiency: prof }]);
    setLang('');
    setProf('Intermediate');
  };

  const update = (id: string, patch: Partial<WorkerLanguage>) => {
    onChange(items.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const remove = (id: string) => onChange(items.filter((x) => x.id !== id));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2">
        <div className="relative">
          <input
            list="lang-list"
            type="text"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            placeholder="Language (e.g. Amharic)"
            className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <datalist id="lang-list">
            {LANGUAGE_OPTIONS.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </div>
        <select
          value={prof}
          onChange={(e) => setProf(e.target.value as LanguageProficiency)}
          className="p-2.5 text-xs border border-slate-200 rounded-xl bg-white cursor-pointer"
        >
          {(['Native', 'Fluent', 'Intermediate', 'Basic'] as LanguageProficiency[]).map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <button type="button" onClick={add} className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 justify-center">
          <Languages className="w-3.5 h-3.5" />
          Add Language
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          No languages added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {items.map((l) => (
            <div key={l.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200">
              <div className="flex items-center gap-2 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{l.language}</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 uppercase tracking-wider">
                  {l.proficiency}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <select
                  value={l.proficiency}
                  onChange={(e) => update(l.id, { proficiency: e.target.value as LanguageProficiency })}
                  className="text-[10px] border border-slate-200 rounded-lg p-1 bg-white"
                >
                  {(['Native', 'Fluent', 'Intermediate', 'Basic'] as LanguageProficiency[]).map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <button type="button" onClick={() => remove(l.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============== CERTIFICATES EDITOR ==============
export function CertificatesEditor({
  items,
  onChange,
}: {
  items: WorkerCertificate[];
  onChange: (v: WorkerCertificate[]) => void;
}) {
  const empty: WorkerCertificate = { id: newId('cert'), name: '', issuingOrganization: '', issueDate: '', expiryDate: '' };
  const [draft, setDraft] = useState<WorkerCertificate>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const reset = () => {
    setDraft({ ...empty, id: newId('cert') });
    setEditingId(null);
    setUploadError(null);
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setUploading(true);
    setUploadError(null);
    try {
      const v = workerProfilesService.validateDocumentFile(f);
      if (!v.ok) throw new Error(v.error);
      const uploaded = await workerProfilesService.fileToUploadedFile(f);
      setDraft({ ...draft, file: uploaded });
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const save = () => {
    if (!draft.name.trim() || !draft.issuingOrganization.trim()) return;
    if (editingId) onChange(items.map((x) => (x.id === editingId ? { ...draft, id: editingId } : x)));
    else onChange([draft, ...items]);
    reset();
  };

  const startEdit = (c: WorkerCertificate) => {
    setDraft({ ...c });
    setEditingId(c.id);
  };
  const remove = (id: string) => onChange(items.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {editingId ? 'Edit Certificate' : 'Add Certificate / License'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Certificate Name *</label>
            <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="COC Level IV - Electrical Installation" className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Issuing Organization *</label>
            <input type="text" value={draft.issuingOrganization} onChange={(e) => setDraft({ ...draft, issuingOrganization: e.target.value })} placeholder="Federal TVET Agency" className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Issue Date</label>
            <input type="month" value={draft.issueDate ?? ''} onChange={(e) => setDraft({ ...draft, issueDate: e.target.value })} className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry Date (Optional)</label>
            <input type="month" value={draft.expiryDate ?? ''} onChange={(e) => setDraft({ ...draft, expiryDate: e.target.value })} className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Certificate File (PDF/JPG/PNG)</label>
          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-50">
              <UploadCloud className="w-3.5 h-3.5" />
              {uploading ? 'Uploading...' : draft.file ? 'Replace File' : 'Upload Certificate'}
            </button>
            {draft.file && (
              <div className="flex items-center gap-2 text-xs text-emerald-700">
                <Eye className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{draft.file.name}</span>
                <button type="button" onClick={() => setDraft({ ...draft, file: undefined })} className="text-slate-400 hover:text-rose-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
          {uploadError && <p className="text-[11px] text-rose-600 mt-1">{uploadError}</p>}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={save} className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold">
            {editingId ? 'Save Changes' : '+ Add Certificate'}
          </button>
          {editingId && (
            <button type="button" onClick={reset} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold">
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="p-4 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                <p className="text-xs font-semibold text-emerald-800 mt-0.5">{c.issuingOrganization}</p>
                <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 mt-1">
                  {c.issueDate && <span>Issued {new Date(c.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>}
                  {c.expiryDate && <span>Expires {new Date(c.expiryDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>}
                  {c.file && (
                    <a href={c.file.dataUrl} target="_blank" rel="noreferrer" download={c.file.name} className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-semibold">
                      <Eye className="w-3 h-3" /> View File
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => startEdit(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => remove(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            No certificates added yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ============== DOCUMENTS UPLOADER ==============
export function DocumentsUploader({
  items,
  onChange,
}: {
  items: WorkerDocument[];
  onChange: (v: WorkerDocument[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('other');
  const [visibility, setVisibility] = useState<DocumentVisibility>('private');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<WorkerUploadedFile | null>(null);

  const CATEGORIES: { key: DocumentCategory; label: string }[] = [
    { key: 'cv', label: 'CV / Resume' },
    { key: 'certificate', label: 'Certificate' },
    { key: 'training_certificate', label: 'Training Certificate' },
    { key: 'professional_license', label: 'Professional License' },
    { key: 'supporting', label: 'Supporting Document' },
    { key: 'other', label: 'Other' },
  ];

  const reset = () => {
    setTitle('');
    setCategory('other');
    setVisibility('private');
    setDescription('');
    setPendingFile(null);
    setUploadError(null);
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setUploading(true);
    setUploadError(null);
    try {
      const v = workerProfilesService.validateDocumentFile(f);
      if (!v.ok) throw new Error(v.error);
      const uploaded = await workerProfilesService.fileToUploadedFile(f);
      setPendingFile(uploaded);
      if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const addDoc = () => {
    if (!pendingFile) return;
    const doc: WorkerDocument = {
      id: newId('doc'),
      title: title.trim() || pendingFile.name,
      category,
      description: description.trim() || undefined,
      file: pendingFile,
      visibility,
    };
    onChange([doc, ...items]);
    reset();
  };

  const updateVisibility = (id: string, v: DocumentVisibility) => {
    onChange(items.map((x) => (x.id === id ? { ...x, visibility: v } : x)));
  };

  const remove = (id: string) => onChange(items.filter((x) => x.id !== id));

  const visibilityBadge = (v: DocumentVisibility) => {
    const m: Record<DocumentVisibility, string> = {
      public: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      employers_only: 'bg-sky-50 text-sky-800 border-sky-200',
      private: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${m[v]}`}>
        {v.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Upload form */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-700" />
          Upload Professional Documents
        </p>
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-6 text-center hover:border-emerald-300 transition cursor-pointer" onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" onChange={(e) => { const f = e.target.files?.[0]; onFile(f); }} />
          <UploadCloud className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">Click to upload CV, certificates, licenses</p>
          <p className="text-[11px] text-slate-400 mt-0.5">PDF, JPG, PNG — max 12 MB per file</p>
          {pendingFile && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              <Eye className="w-3 h-3" />
              <span className="truncate max-w-[220px]">{pendingFile.name}</span>
              {(pendingFile.size / 1024).toFixed(0)} KB
            </div>
          )}
          {uploading && <p className="text-[11px] text-emerald-700 mt-2 font-semibold">Uploading...</p>}
          {uploadError && <p className="text-[11px] text-rose-600 mt-2">{uploadError}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Main CV - English 2025" className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as DocumentCategory)} className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer">
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Visibility (Security)</label>
            <select value={visibility} onChange={(e) => setVisibility(e.target.value as DocumentVisibility)} className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer">
              <option value="private">🔒 Private — Only me</option>
              <option value="employers_only">👔 Employers Only</option>
              <option value="public">🌍 Public — Anyone can view</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional notes" className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
        </div>
        <button
          type="button"
          onClick={addDoc}
          disabled={!pendingFile}
          className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          Attach to Profile
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((d) => (
          <div key={d.id} className="p-4 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{d.title}</h4>
                  {visibilityBadge(d.visibility)}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 capitalize">
                    {d.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 mt-1">
                  <span>{d.file.name}</span>
                  <span>{(d.file.size / 1024).toFixed(0)} KB</span>
                  <a href={d.file.dataUrl} target="_blank" rel="noreferrer" download={d.file.name} className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-semibold">
                    <Eye className="w-3 h-3" /> Open
                  </a>
                </div>
                {d.description && <p className="text-xs text-slate-600 mt-2">{d.description}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <select
                  value={d.visibility}
                  onChange={(e) => updateVisibility(d.id, e.target.value as DocumentVisibility)}
                  className="text-[10px] border border-slate-200 rounded-lg p-1 bg-white"
                  title="Change visibility"
                >
                  <option value="private">Private</option>
                  <option value="employers_only">Employers</option>
                  <option value="public">Public</option>
                </select>
                <button type="button" onClick={() => remove(d.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50" title="Delete document">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            No documents uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ============== AVAILABILITY PICKER ==============
export function AvailabilityPicker({
  value,
  onChange,
}: {
  value: WorkerAvailability;
  onChange: (v: WorkerAvailability) => void;
}) {
  const opts: { key: WorkerAvailability['type']; label: string; icon: React.ReactNode }[] = [
    { key: 'available_now', label: 'Available Now', icon: <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> },
    { key: 'available_from_date', label: 'Available From Date', icon: <Calendar className="w-3.5 h-3.5" /> },
    { key: 'currently_employed', label: 'Currently Employed', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { key: 'not_available', label: 'Not Available', icon: <span className="w-2 h-2 rounded-full bg-rose-500" /> },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {opts.map((o) => {
          const active = value.type === o.key;
          return (
            <button
              type="button"
              key={o.key}
              onClick={() => onChange({ type: o.key, availableFromDate: o.key === 'available_from_date' ? value.availableFromDate : undefined })}
              className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center gap-2 transition ${
                active
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {o.icon}
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>
      {value.type === 'available_from_date' && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <label className="block text-[11px] font-semibold text-emerald-900 mb-1">Available From</label>
          <input
            type="date"
            value={value.availableFromDate ?? ''}
            onChange={(e) => onChange({ ...value, availableFromDate: e.target.value })}
            className="w-full p-2 text-xs border border-emerald-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

// ============== SALARY PICKER ==============
export function SalaryPicker({
  value,
  onChange,
}: {
  value: WorkerExpectedSalary;
  onChange: (v: WorkerExpectedSalary) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Minimum (ETB)
          </label>
          <input
            type="number"
            min={0}
            value={value.min ?? ''}
            onChange={(e) => onChange({ ...value, min: e.target.value ? Number(e.target.value) : undefined })}
            disabled={value.period === 'negotiable'}
            placeholder="10000"
            className="w-full p-2 text-xs border border-slate-200 rounded-lg disabled:bg-slate-100 disabled:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Maximum (ETB, optional)
          </label>
          <input
            type="number"
            min={0}
            value={value.max ?? ''}
            onChange={(e) => onChange({ ...value, max: e.target.value ? Number(e.target.value) : undefined })}
            disabled={value.period === 'negotiable'}
            placeholder="18000"
            className="w-full p-2 text-xs border border-slate-200 rounded-lg disabled:bg-slate-100 disabled:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Period</label>
          <select
            value={value.period}
            onChange={(e) => onChange({ ...value, period: e.target.value as WorkerExpectedSalary['period'] })}
            className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer"
          >
            <option value="per_day">Per Day</option>
            <option value="per_week">Per Week</option>
            <option value="per_month">Per Month</option>
            <option value="per_year">Per Year</option>
            <option value="negotiable">💰 Negotiable</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={value.public}
          onChange={(e) => onChange({ ...value, public: e.target.checked })}
          className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
        />
        Show salary publicly on my profile
      </label>
    </div>
  );
}

// ============== PREFERRED LOCATION ==============
export function PreferredLocationEditor({
  value,
  regions,
  onChange,
}: {
  value: WorkerPreferredLocation;
  regions: { id: string; name: string; majorCities: string[] }[];
  onChange: (v: WorkerPreferredLocation) => void;
}) {
  const selectedRegion = regions.find((r) => r.name === value.preferredRegion);
  const cities = selectedRegion?.majorCities ?? [];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
            <Pin className="w-3 h-3" /> Preferred Region
          </label>
          <select
            value={value.preferredRegion ?? ''}
            onChange={(e) => onChange({ ...value, preferredRegion: e.target.value || undefined, preferredCity: undefined })}
            className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer"
          >
            <option value="">Select region...</option>
            {regions.map((r) => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Preferred City</label>
          <select
            value={value.preferredCity ?? ''}
            onChange={(e) => onChange({ ...value, preferredCity: e.target.value || undefined })}
            className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
            disabled={!value.preferredRegion}
          >
            <option value="">{value.preferredRegion ? 'Select city...' : 'Pick region first'}</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={value.willingToRelocate}
          onChange={(e) => onChange({ ...value, willingToRelocate: e.target.checked })}
          className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
        />
        I am willing to relocate for work
      </label>
    </div>
  );
}

// ============== PROFILE PHOTO UPLOADER ==============
export function ProfilePhotoUploader({
  value,
  onChange,
}: {
  value?: string;
  onChange: (dataUrl?: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setUploading(true);
    setError(null);
    try {
      const v = workerProfilesService.validateImageFile(f);
      if (!v.ok) throw new Error(v.error);
      const uploaded = await workerProfilesService.fileToUploadedFile(f);
      onChange(uploaded.dataUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-start gap-4">
      <div className="relative shrink-0">
        {value ? (
          <img src={value} alt="Profile photo preview" className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md" />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border-4 border-white shadow-md flex items-center justify-center text-emerald-600 text-3xl font-black">
            ?
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50">
            <UploadCloud className="w-3.5 h-3.5" />
            {value ? 'Change Photo' : 'Upload Photo'}
          </button>
          {value && (
            <button type="button" onClick={() => onChange(undefined)} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Remove
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-500">Clear, front-facing photo recommended. JPG/PNG up to 5 MB.</p>
        {uploading && <p className="text-[11px] text-emerald-700 font-semibold">Uploading...</p>}
        {error && <p className="text-[11px] text-rose-600">{error}</p>}
      </div>
    </div>
  );
}
