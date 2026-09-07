'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { internshipsService } from '@/services/internshipsService';
import { employersService } from '@/services/employersService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { mockRegions } from '@/data/mockRegions';
import { Internship } from '@/types';
import {
  GraduationCap,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle2,
  Save,
  Users,
  Gift,
} from 'lucide-react';

export default function PostInternshipPage() {
  const router = useRouter();
  const { employerProfile } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [field, setField] = useState('Software Engineering');
  const [location, setLocation] = useState('Addis Ababa (Bole)');
  const [region, setRegion] = useState('Addis Ababa');
  const [workType, setWorkType] = useState<'On-site' | 'Remote' | 'Hybrid'>('Hybrid');
  const [duration, setDuration] = useState('3 Months');
  const [compensation, setCompensation] = useState<'Paid' | 'Unpaid'>('Paid');
  const [stipend, setStipend] = useState('7,000 ETB / month');
  const [educationLevel, setEducationLevel] = useState<'Undergraduate' | 'Fresh Graduate' | 'TVET / Diploma' | 'All Levels'>('Undergraduate');
  const [numberOfInterns, setNumberOfInterns] = useState(3);
  const [deadline, setDeadline] = useState('2026-10-20');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await internshipsService.createInternship({
        title,
        company: employerProfile.companyName,
        companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120',
        isVerifiedCompany: true,
        field,
        location,
        region,
        workType,
        duration,
        compensation,
        stipend: compensation === 'Paid' ? stipend : 'Academic Credit',
        educationLevel,
        requiredSkills: ['Problem Solving', 'Team Collaboration', 'Foundational Knowledge'],
        description,
        responsibilities: [
          'Work under senior mentorship on active production projects.',
          'Document learning outcomes and submit bi-weekly progress updates.',
          'Participate in team agile ceremonies and technical workshops.',
        ],
        requirements: [
          `Current student or recent graduate in ${field} or related discipline.`,
          'Strong eagerness to learn, ask questions, and take ownership.',
        ],
        benefits: ['Dedicated Senior 1-on-1 Mentor', 'Certificate of Completion', 'Priority consideration for full-time hire'],
        deadline,
        numberOfInterns,
        isFeatured: false,
      });

      // Increment internship count and grant free unlock if this is first job/internship
      const result = await employersService.incrementPostedInternships(employerProfile.id);

      if (result.freeUnlockGranted) {
        showToast(
          'Internship Posted + Free Unlock Earned!',
          'Your internship is now live on Serategna. You have received 1 Free Worker Phone Unlock (worth 100 ETB)!',
          'success'
        );
      } else {
        showToast(
          'Internship Posted!',
          'Your university internship program is now open for student applications.',
          'success'
        );
      }

      router.push('/employer/internships');
    } catch (err) {
      showToast('Error', 'Failed to publish internship program.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* First-Job Rule Callout */}
      {!employerProfile.hasPostedFirstJob && (
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <Gift className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-sm uppercase tracking-wide text-amber-950">
              First-Job Bonus Rule
            </h2>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              By publishing this internship on Serategna, you contribute authentic employment to the platform.
              Upon publishing, you will instantly receive <strong>1 Free Worker Phone Unlock</strong> (worth 100 ETB)!
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Internship Marketplace</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Post an Internship Opportunity</h1>
          <p className="text-xs text-slate-500">
            Offer mentorship to Ethiopian university students and discover high-potential fresh talent.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Internship Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Junior Frontend Engineering Intern"
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Field / Academic Major</label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Accounting">Accounting & Finance</option>
                <option value="Marketing">Marketing & Growth</option>
                <option value="Engineering">Civil / Electrical Engineering</option>
                <option value="Graphic Design">UI/UX & Graphic Design</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as Internship['educationLevel'])}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="Undergraduate">Undergraduate Students</option>
                <option value="Fresh Graduate">Fresh Graduates</option>
                <option value="TVET / Diploma">TVET / Diploma Graduates</option>
                <option value="All Levels">All Levels Welcome</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="2 Months">2 Months</option>
                <option value="3 Months">3 Months</option>
                <option value="4 Months">4 Months</option>
                <option value="6 Months">6 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Work Mode</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value as Internship['workType'])}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Remote">100% Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Number of Interns</label>
              <input
                type="number"
                min={1}
                max={20}
                required
                value={numberOfInterns}
                onChange={(e) => setNumberOfInterns(Number(e.target.value))}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Compensation</label>
              <select
                value={compensation}
                onChange={(e) => setCompensation(e.target.value as Internship['compensation'])}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="Paid">Paid Stipend</option>
                <option value="Unpaid">Unpaid (Academic Credit)</option>
              </select>
            </div>

            {compensation === 'Paid' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Stipend</label>
                <input
                  type="text"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  placeholder="e.g. 6,000 ETB / month"
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Application Deadline</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Program Description & Mentorship Details
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the projects the intern will contribute to, learning outcomes, and mentorship support provided..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-900/20 transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Publishing Program...</span>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4" />
                  <span>Publish Internship Program</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
