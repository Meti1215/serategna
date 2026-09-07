'use client';

import React, { useState } from 'react';
import { WorkerProfile } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useUnlock } from '@/context/UnlockContext';
import { useToast } from '@/context/ToastContext';
import {
  X,
  Lock,
  Phone,
  CheckCircle2,
  Gift,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface UnlockPhoneModalProps {
  worker: WorkerProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (phone: string) => void;
}

export function UnlockPhoneModal({
  worker,
  isOpen,
  onClose,
  onSuccess,
}: UnlockPhoneModalProps) {
  const { employerProfile, role, switchDemoPersona } = useAuth();
  const { unlockWorker, isWorkerUnlocked } = useUnlock();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'Chapa' | 'CBE'>('Telebirr');
  const [phoneNumber, setPhoneNumber] = useState('0911234567');
  const [isProcessing, setIsProcessing] = useState(false);
  const [unlockedPhone, setUnlockedPhone] = useState<string | null>(
    isWorkerUnlocked(worker.id) ? worker.phone : null
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const hasFreeUnlock = employerProfile.freeUnlocksRemaining > 0;
  const isEmployer = role === 'employer';

  const handleUnlock = async (useFree = false) => {
    setIsProcessing(true);
    try {
      // Simulate real Ethiopian payment gateway delay (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const selectedGateway = useFree ? 'Free First Unlock' : paymentMethod;
      const res = await unlockWorker(worker.id, selectedGateway, useFree);

      setUnlockedPhone(res.unmaskedPhone);
      showToast(
        'Phone Number Unlocked!',
        useFree
          ? 'Free unlock applied! You can now contact this worker directly.'
          : `100 ETB paid via ${paymentMethod}. Phone number is now accessible.`,
        'success'
      );

      if (onSuccess) {
        onSuccess(res.unmaskedPhone);
      }
    } catch (err) {
      showToast('Payment Error', 'Failed to process unlock payment. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (unlockedPhone) {
      navigator.clipboard.writeText(unlockedPhone);
      setCopied(true);
      showToast('Copied to clipboard', unlockedPhone, 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Unlock Worker Phone Number</h3>
              <p className="text-xs text-slate-500">Serategna Direct Contact System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {unlockedPhone ? (
            /* SUCCESS STATE */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Phone Number Revealed</h4>
                <p className="text-sm text-slate-600 mt-1">
                  You have unlocked direct contact for{' '}
                  <span className="font-semibold text-slate-900">{worker.fullName}</span> (
                  {worker.profession}).
                </p>
              </div>

              {/* Revealed Phone Box */}
              <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between max-w-xs mx-auto">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-700 animate-pulse" />
                  <span className="font-mono text-xl font-bold text-emerald-900">
                    {unlockedPhone}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  title="Copy Phone Number"
                  className="p-2 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition shadow-sm"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <a
                  href={`tel:${unlockedPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-medium hover:bg-emerald-800 transition shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  Call Worker Now
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  Done
                </button>
              </div>

              <p className="text-xs text-slate-400">
                This number is now saved to your Employer Dashboard under &ldquo;Phone Unlocks&rdquo;.
              </p>
            </div>
          ) : (
            /* PAYMENT CHECKOUT FLOW */
            <div className="space-y-5">
              {/* Worker Summary Card */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <img
                  src={worker.avatar}
                  alt={worker.fullName}
                  className="w-13 h-13 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 text-sm truncate">
                    {worker.fullName}
                  </h4>
                  <p className="text-xs text-slate-600 truncate">{worker.profession}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    📍 {worker.city}, {worker.region} • ⭐ {worker.rating} ({worker.totalReviews} reviews)
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-slate-400 line-through">09•••••••</span>
                  <span className="block text-[11px] font-semibold text-amber-600">Hidden</span>
                </div>
              </div>

              {/* Employer Status Notice / First-Job Incentive */}
              {!isEmployer && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">Employer Access:</span> You are currently viewing as{' '}
                    <span className="capitalize font-bold">{role}</span>. You can test the unlock flow, or{' '}
                    <button
                      onClick={() => switchDemoPersona('employer')}
                      className="underline font-semibold text-blue-900 hover:text-blue-950"
                    >
                      switch to Employer persona
                    </button>
                    .
                  </div>
                </div>
              )}

              {/* Free Unlock Available Promo Banner */}
              {hasFreeUnlock ? (
                <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-200 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Gift className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                        Special First-Job Bonus Available!
                      </h5>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        You have <span className="font-bold">{employerProfile.freeUnlocksRemaining} free unlock</span> remaining from posting your job!
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleUnlock(true)}
                    className="shrink-0 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition shadow-sm"
                  >
                    {isProcessing ? 'Unlocking...' : 'Use Free Unlock (0 ETB)'}
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                  <span>
                    💡 <span className="font-semibold">First-Job Rule:</span> Employers who publish a job opportunity receive 1 free phone unlock!
                  </span>
                </div>
              )}

              {/* Fee Breakdown */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Direct Contact Unlock Fee</span>
                  <span>100.00 ETB</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Platform Verification & Anti-Spam</span>
                  <span className="text-emerald-600 font-medium">Included</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-base text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-emerald-700">100 ETB</span>
                </div>
              </div>

              {/* Payment Gateway Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Select Ethiopian Payment Gateway
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Telebirr')}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'Telebirr'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 text-emerald-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">Telebirr</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Instant USSD</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Chapa')}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'Chapa'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 text-emerald-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">Chapa</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Card / Mobile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CBE')}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'CBE'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 text-emerald-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span className="text-xs">CBE Birr</span>
                    <span className="text-[10px] text-purple-600 font-medium">Bank Transfer</span>
                  </button>
                </div>
              </div>

              {/* Phone / Mobile Account Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Ethiopian Mobile Number ({paymentMethod})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-500">
                    +251
                  </span>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="911 234 567"
                    className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  You will receive an instant payment prompt on your phone for 100 ETB.
                </p>
              </div>

              {/* Pay Button */}
              <button
                disabled={isProcessing}
                onClick={() => handleUnlock(false)}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm transition shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Processing with {paymentMethod}...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay 100 ETB & Unlock Phone</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted & Secured by Serategna Ethiopia Trust Gateway</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
