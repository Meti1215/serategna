'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { applicationsService } from '@/services/applicationsService';
import { workersService } from '@/services/workersService';
import {
  X,
  Send,
  CheckCircle2,
  FileText,
  Upload,
  User,
  Phone,
  Mail,
  GraduationCap,
  MapPin,
  Award,
  Star,
} from 'lucide-react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: 'job' | 'internship';
  companyName: string;
}

export function ApplyModal({
  isOpen,
  onClose,
  opportunityId,
  opportunityTitle,
  opportunityType,
  companyName,
}: ApplyModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.name || 'Abebe Kebede');
  const [email, setEmail] = useState(user?.email || 'abebe.kebede.electric@gmail.com');
  const [phone, setPhone] = useState('+251 91 142 8892');
  const [location, setLocation] = useState('Addis Ababa');
  const [region, setRegion] = useState('Addis Ababa');
  const [experience, setExperience] = useState('5 years');
  const [skills, setSkills] = useState('Technical Troubleshooting, Equipment Operation');
  const [coverLetter, setCoverLetter] = useState(
    `Dear Hiring Team at ${companyName},\n\nI am excited to submit my application for the ${opportunityTitle} position. With my background and hands-on experience in Ethiopia, I am confident in adding immediate value to your team.`
  );
  const [cvFile, setCvFile] = useState<string>('Serategna_Verified_Profile_CV.pdf');
  const [certificates, setCertificates] = useState<string[]>(['COC Level IV']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user?.role === 'worker' && user.id) {
      workersService.getWorkerById(user.id).then((worker) => {
        if (worker) {
          setPhone(worker.phone);
          setLocation(worker.city);
          setRegion(worker.region);
          setExperience(`${worker.experienceYears} years`);
          setSkills(worker.skills.join(', '));
          setCertificates(worker.certificates.map(c => c.title));
        }
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await applicationsService.submitApplication({
        opportunityId,
        opportunityTitle,
        opportunityType,
        companyName,
        applicantId: user?.id || 'worker-temp',
        applicantName: fullName,
        applicantAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        applicantProfession: user?.titleOrCompany || 'Worker',
        applicantEmail: email,
        applicantPhone: phone,
        applicantLocation: location,
        applicantRegion: region,
        applicantExperience: experience,
        applicantSkills: skills.split(',').map(s => s.trim()),
        applicantRating: 4.5,
        applicantTotalReviews: 10,
        coverLetter,
        cvFileName: cvFile,
        cvFileUrl: `/files/cvs/${cvFile}`,
        certificates: certificates,
      });

      setIsSuccess(true);
      showToast(
        'Application Submitted!',
        `Your application for ${opportunityTitle} at ${companyName} was submitted successfully.`,
        'success'
      );
    } catch (err) {
      showToast('Error', 'Failed to submit application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Apply for {opportunityType === 'internship' ? 'Internship' : 'Job'}
            </span>
            <h3 className="font-bold text-slate-900 text-base line-clamp-1">{opportunityTitle}</h3>
            <p className="text-xs text-slate-500">{companyName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Application Received!</h4>
                <p className="text-sm text-slate-600 mt-1.5 max-w-sm mx-auto">
                  Your application has been delivered to <span className="font-semibold text-slate-900">{companyName}</span>.
                  You can track your application status in your Worker Dashboard.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition"
                >
                  Close & View More Opportunities
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Region
                  </label>
                  <input
                    type="text"
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 5 years"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. Welding, Safety, Teamwork"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attach CV / Resume / Academic Record
                </label>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50">
                  <FileText className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{cvFile}</p>
                    <p className="text-[11px] text-slate-400">Auto-synced from your Serategna profile</p>
                  </div>
                  <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition shadow-sm">
                    <span>Change</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setCvFile(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Certificates (from profile)
                </label>
                <div className="flex flex-wrap gap-2">
                  {certificates.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-xs font-medium text-purple-800">
                      <Award className="w-3.5 h-3.5" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Letter / Note to Employer
                </label>
                <textarea
                  rows={4}
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition shadow-sm shadow-emerald-700/20"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
