'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { mockApplications, applicationsService } from '@/services/applicationsService';
import { mockJobs } from '@/data/mockJobs';
import { workersService } from '@/services/workersService';
import {
  FileCheck,
  Bookmark,
  Eye,
  Star,
  ArrowRight,
  Upload,
  Bell,
  MessageSquare,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function WorkerDashboardPage() {
  const { user } = useAuth();
  const [profilePercent, setProfilePercent] = useState(85);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(5);
  const [profileViews, setProfileViews] = useState(284);
  const [rating, setRating] = useState(4.9);
  const [totalReviews, setTotalReviews] = useState(12);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    async function loadStats() {
      if (user?.id) {
        const worker = await workersService.getWorkerById(user.id);
        if (worker) {
          // Calculate profile completion
          const requiredFields = [
            worker.avatar,
            worker.bio,
            worker.skills.length > 0,
            worker.certificates.length > 0,
            worker.workHistory.length > 0,
            worker.education.length > 0,
          ];
          const completed = requiredFields.filter(Boolean).length;
          setProfilePercent(Math.round((completed / requiredFields.length) * 100));

          setRating(worker.rating);
          setTotalReviews(worker.totalReviews);
        }

        const apps = await applicationsService.getApplications(user.id, 'worker');
        setApplicationsCount(apps.length);
      }
    }
    loadStats();
  }, [user]);

  const missingItems = [];
  if (profilePercent < 100) {
    if (profilePercent < 80) missingItems.push('Profile photo');
    if (profilePercent < 85) missingItems.push('Work experience');
    if (profilePercent < 90) missingItems.push('Skills');
    if (profilePercent < 95) missingItems.push('Certificates');
    if (profilePercent < 100) missingItems.push('CV');
  }

  return (
    <div className="space-y-6">
      {/* Profile Completion Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center shrink-0 ${
            profilePercent === 100 ? 'bg-emerald-50 border-emerald-600' : 'bg-amber-50 border-amber-500'
          }`}>
            <span className="font-black text-slate-900 text-base">{profilePercent}%</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Your Profile is {profilePercent}% Complete</h2>
              {profilePercent === 100 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Excellent
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  In Progress
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {profilePercent === 100
                ? 'Your profile is complete! You\'re ready to attract employers.'
                : `Add ${missingItems.slice(0, 2).join(', ')}${missingItems.length > 2 ? ', and more' : ''} to reach 100% and appear higher in employer searches.`}
            </p>
          </div>
        </div>

        <Link
          href="/worker/profile"
          className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 text-xs font-bold transition flex items-center gap-1.5"
        >
          <Upload className="w-4 h-4 text-emerald-700" />
          <span>{profilePercent === 100 ? 'View Profile' : 'Complete Profile'}</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Applications', value: applicationsCount.toString(), icon: FileCheck, color: 'text-blue-600' },
          { label: 'Saved Jobs', value: savedJobsCount.toString(), icon: Bookmark, color: 'text-amber-600' },
          { label: 'Profile Views', value: profileViews.toString(), icon: Eye, color: 'text-emerald-600' },
          { label: 'Employer Rating', value: `${rating} ★ (${totalReviews})`, icon: Star, color: 'text-amber-500' },
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{s.label}</span>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Application Tracking Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Submitted Applications Status
            </h3>
            <p className="text-xs text-slate-500">Track responses from employers and internship hosts.</p>
          </div>
          <Link
            href="/worker/applications"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {mockApplications.slice(0, 3).map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-slate-900">{app.opportunityTitle}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase">
                    {app.opportunityType}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 font-semibold mt-0.5">{app.companyName}</p>
                <p className="text-[11px] text-slate-400 mt-1">Applied on {app.appliedDate}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'Shortlisted'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : app.status === 'Interview'
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : app.status === 'Accepted'
                      ? 'bg-teal-100 text-teal-900 border border-teal-300'
                      : app.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  {app.status}
                </span>
                {app.interviewDate && (
                  <span className="text-[11px] text-purple-700 font-medium">
                    📅 {app.interviewDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Notifications
            </h3>
            {notifications > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {notifications} New
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Application Shortlisted</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Ethio Telecom has shortlisted your application for Senior Electrical Maintenance Engineer.</p>
              <p className="text-[10px] text-slate-400 mt-1">2 hours ago</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Interview Scheduled</p>
              <p className="text-[11px] text-slate-600 mt-0.5">ABC Technology has scheduled an interview for Software Engineering Intern on Sep 10, 2026 at 2:00 PM.</p>
              <p className="text-[10px] text-slate-400 mt-1">1 day ago</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Profile Viewed</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Dashan Bank viewed your profile today.</p>
              <p className="text-[10px] text-slate-400 mt-1">3 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Openings */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          Recommended Openings Matching Your Skills
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockJobs.slice(0, 2).map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">{job.company}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 mt-1">{job.title}</h4>
                <p className="text-xs font-bold text-emerald-700 mt-1">💰 {job.salary}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Deadline: {job.deadline}</span>
                <Link
                  href={`/jobs/${job.id}`}
                  className="font-bold text-emerald-700 hover:text-emerald-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
