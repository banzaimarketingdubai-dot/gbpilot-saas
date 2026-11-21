'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Sparkles,
  CheckCircle2,
  Mail,
  Building2,
  Phone,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { captureAndGetUtm, trackFunnelEvent } from '@/lib/funnel';

interface ClosedBetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectGoogleOAuth?: () => void;
  defaultBusinessName?: string;
  defaultCity?: string;
  source?: string;
}

export function ClosedBetaModal({
  isOpen,
  onClose,
  onDirectGoogleOAuth,
  defaultBusinessName = '',
  defaultCity = '',
  source = 'google_oauth_gate',
}: ClosedBetaModalProps) {
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState(defaultBusinessName);
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(defaultCity);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    position: number;
    already_registered: boolean;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);

    // Pre-fill from active profile if available
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('gbpilot_active_profile');
        if (raw) {
          const p = JSON.parse(raw);
          if (!businessName && p?.name) setBusinessName(p.name);
          if (!city && p?.city) setCity(p.city);
        }
      } catch {}
    }

    if (defaultBusinessName) setBusinessName(defaultBusinessName);
    if (defaultCity) setCity(defaultCity);

    trackFunnelEvent({
      event_type: 'beta_modal_opened',
      business_name: defaultBusinessName || businessName,
      city: defaultCity || city,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    const utm = captureAndGetUtm();

    try {
      const res = await fetch('/api/v1/beta/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          business_name: businessName.trim(),
          phone: phone.trim(),
          city: city.trim(),
          source,
          utm_source: utm.utm_source,
          utm_campaign: utm.utm_campaign,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.detail || data.error || 'Could not complete registration.');
      }

      setSubmittedResult({
        position: data.position || 1,
        already_registered: !!data.already_registered,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-[10px] font-extrabold uppercase tracking-wider mb-3">
            <Lock className="w-3 h-3" />
            <span>Private Closed Beta</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight leading-snug">
            GBPilot is Currently in Closed Beta
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Direct Google Business Profile OAuth connections are rolling out in weekly cohorts. Subscribe now to be first in line to test full autopilot and lock in early-access pricing.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {submittedResult ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {submittedResult.already_registered
                    ? "You're Already on the Priority List!"
                    : "You're In! Priority Beta Slot Reserved"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We recorded <strong className="text-slate-900">{email}</strong>
                  {businessName ? (
                    <>
                      {' '}for <strong className="text-slate-900">{businessName}</strong>
                    </>
                  ) : null}
                  . Your queue priority: <strong className="text-google-blue">#{submittedResult.position}</strong>.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 leading-relaxed">
                <strong>Good news:</strong> You can still explore your full Live Google Maps Diagnostic Scan &amp; Geo-Grid Radar right now without waiting!
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                Continue to My Live Audit →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Work Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@yourbusiness.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Business Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Radiant Plumbing Austin"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Phone / WhatsApp <span className="text-slate-400 font-normal">(optional, for faster invite)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (512) 000-0000"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue text-slate-900"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-700 font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-google-blue hover:bg-blue-600 disabled:opacity-60 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reserving Your Spot...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Subscribe for First Beta Access</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero spam. Instant notification when your beta invite unlocks.</span>
              </div>

              {onDirectGoogleOAuth && (
                <div className="pt-3 mt-2 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={onDirectGoogleOAuth}
                    className="text-[11px] text-slate-400 hover:text-google-blue underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Already an approved beta tester? Sign in with Google OAuth →
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
