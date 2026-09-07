'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobsService } from '@/services/jobsService';
import { employersService } from '@/services/employersService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { mockCategories } from '@/data/mockCategories';
import { mockRegions } from '@/data/mockRegions';
import { Job } from '@/types';
import {
  Briefcase,
  Gift,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Save,
  Plus,
} from 'lucide-react';

export default function PostJobPage() {
  const router = useRouter();
  const { employerProfile, markFirstJobPosted } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electricians');
  const [location, setLocation] = useState('Addis Ababa (Bole)');
  const [region, setRegion] = useState('Addis Ababa');
  const [salary, setSalary] = useState('18,000 - 25,000 ETB / month');
  const [employmentType, setEmploymentType] = useState<Job['employmentType']>('Full-time');
  const [experienceLevel, setExperienceLevel] = useState<Job['experienceLevel']>('3-5 Years');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-10-15');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await jobsService.createJob({
        title,
        company: employerProfile.companyName,
        companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120',
        isVerifiedCompany: true,
        category,
        location,
        region,
        employmentType,
        experienceLevel,
        salary,
        description,
        responsibilities: [
          'Execute scheduled tasks with highest attention to technical quality.',
          'Adhere strictly to industry safety standards and reporting logs.',
          'Collaborate effectively with team members and site foremen.',
        ],
        requirements: [
          'Relevant TVET COC Level certification or engineering degree.',
          `Minimum ${experienceLevel} verifiable work experience.`,
          'Strong reliability, punctuality, and clean police clearance record.',
        ],
        skills: ['Technical Troubleshooting', 'Equipment Operation', 'Safety Protocols'],
        benefits: ['Medical Insurance', 'Overtime Allowance', 'Transport Support'],
        deadline,
        isFeatured: false,
      });

      // Increment job count and grant free unlock if this is first job
      const result = await employersService.incrementPostedJobs(employerProfile.id);
      
      markFirstJobPosted();

      if (result.freeUnlockGranted) {
        showToast(
          'Job Published + Free Unlock Earned!',
          'Your job is now live on Serategna. You have received 1 Free Worker Phone Unlock (worth 100 ETB)!',
          'success'
        );
      } else {
        showToast(
          'Job Published Successfully!',
          'Your job is now live on Serategna.',
          'success'
        );
      }

      router.push('/employer/jobs');
    } catch (err) {
      showToast('Error', 'Failed to publish job opening. Please check your fields.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* First-Job Rule Callout */}
      <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
        <Gift className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h2 className="font-bold text-sm uppercase tracking-wide text-amber-950">
            First-Job Bonus Rule
          </h2>
          <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
            By publishing this job vacancy on Serategna, you contribute authentic employment to the platform.
            Upon publishing, you will instantly receive <strong>1 Free Worker Phone Unlock</strong> (worth 100 ETB)!
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-900">Post a New Job Opportunity</h1>
          <p className="text-xs text-slate-500">
            Reach thousands of certified Ethiopian trade workers and career professionals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Commercial Electrician"
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location Details</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Addis Ababa (Bole Atlas)"
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Salary (ETB)</label>
              <input
                type="text"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. 20,000 - 30,000 ETB"
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as Job['employmentType'])}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Required Experience
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as Job['experienceLevel'])}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Job Description & Duties
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the day-to-day duties, work environment, and expectations for the position..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Publishing Job Opening...</span>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  <span>Publish Job & Claim Free Unlock</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
