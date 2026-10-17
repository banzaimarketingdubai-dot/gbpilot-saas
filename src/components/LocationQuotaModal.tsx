'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Sparkles, 
  Check, 
  Mail, 
  Copy, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Unlink, 
  ExternalLink,
  Crown,
  Users,
  MessageSquare
} from 'lucide-react';
import { getSubscription } from '@/lib/subscription';

interface LocationQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocationsCount?: number;
  activeProfileName?: string;
  onUnlinkCurrent?: () => void;
}

export function LocationQuotaModal({
  isOpen,
  onClose,
  currentLocationsCount = 1,
  activeProfileName,
  onUnlinkCurrent
}: LocationQuotaModalProps) {
  const router = useRouter();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'UPGRADE' | 'ENTERPRISE'>('UPGRADE');

  if (!isOpen) return null;

  const subscription = getSubscription();
  const limit = subscription.locationLimit || 1;
  const isStarter = limit <= 1;
  const isPro = limit === 3;
  const isAgency = limit >= 10 && limit < 999;

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('Support@gbpilot.top');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const mailtoUrl = `mailto:Support@gbpilot.top?subject=${encodeURIComponent(
    'Connecting 10+ Locations to GBPilot (Enterprise & Multi-Location)'
  )}&body=${encodeURIComponent(
    `Hello GBPilot Team,\n\nWe would like to connect a multi-location brand / agency with 10+ locations.\nNumber of locations:\nCity / Country:\nContact Phone / WhatsApp:\n`
  )}`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-200 text-slate-900 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-600 border border-amber-200/80 shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  Location Quota Reached
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800 border border-amber-300">
                  {currentLocationsCount} / {limit} used
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Current Plan: <strong className="text-slate-800">{subscription.plan.name}</strong>
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl my-3 shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('UPGRADE')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'UPGRADE'
                ? 'bg-white text-google-blue shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plans (up to 10 venues)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ENTERPRISE')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ENTERPRISE'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>10+ Locations (Enterprise)</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto space-y-3.5 pr-1 text-xs text-slate-600 flex-1">
          
          {activeTab === 'UPGRADE' && (
            <>
              <p className="leading-relaxed text-slate-600 text-xs">
                To connect additional locations, maintain unified ranking analytics, and protect multiple branches 24/7, select a higher location tier:
              </p>

              {/* Tier Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Growth / Pro Card */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  isStarter 
                    ? 'border-blue-400 bg-blue-50/40 ring-2 ring-blue-500/20' 
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-900">Growth / Pro</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-google-blue">
                      Up to 3 venues
                    </span>
                  </div>
                  <div className="text-lg font-black text-slate-900 mb-2">
                    $69 <span className="text-xs font-normal text-slate-500">/ AED 249/mo</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 mb-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-google-blue shrink-0" />
                      <span>3 locations managed simultaneously</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-google-blue shrink-0" />
                      <span>Geo-Grid 5x5 ranking radar</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-google-blue shrink-0" />
                      <span>24/7 Sentinel Guard & Autopilot</span>
                    </li>
                  </ul>
                  <Link
                    href="/b2b"
                    onClick={onClose}
                    className="w-full py-2 px-3 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-xl text-center block text-xs shadow-xs transition-colors"
                  >
                    Select Growth / Pro →
                  </Link>
                </div>

                {/* Agency Card */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  isPro || isAgency
                    ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-500/20' 
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-900">Agency / Chain</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Up to 10 venues
                    </span>
                  </div>
                  <div className="text-lg font-black text-slate-900 mb-2">
                    $199 <span className="text-xs font-normal text-slate-500">/ AED 749/mo</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 mb-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Up to 10 locations in single account</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>White-Label PDF & WhatsApp reports</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Fast multi-location switcher</span>
                    </li>
                  </ul>
                  <Link
                    href="/b2b"
                    onClick={onClose}
                    className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-center block text-xs shadow-xs transition-colors"
                  >
                    Select Agency (up to 10) →
                  </Link>
                </div>

              </div>

              {/* Free Unlink Option (Only for 1/1 Starter users) */}
              {isStarter && onUnlinkCurrent && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Want to switch your current venue for free?</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    If you are testing or want to connect a different venue without upgrading your plan, you can unlink <strong>{activeProfileName || 'your current profile'}</strong> for free. Your 1/1 quota will immediately be freed.
                  </p>
                  <button
                    type="button"
                    onClick={onUnlinkCurrent}
                    className="w-full py-2 px-3 bg-white hover:bg-amber-100 text-amber-900 font-bold rounded-xl border border-amber-300 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Unlink className="w-3.5 h-3.5 text-amber-700" />
                    <span>Unlink current location & connect a new one (Free)</span>
                  </button>
                </div>
              )}

              {/* Teaser for 10+ */}
              <div 
                onClick={() => setActiveTab('ENTERPRISE')} 
                className="p-3 rounded-2xl border border-dashed border-slate-300 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/30 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 group-hover:text-amber-900">
                      Managing more than 10 locations or a franchise network?
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Custom volume terms, enterprise SLA, and direct contact at Support@gbpilot.top
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
              </div>
            </>
          )}

          {activeTab === 'ENTERPRISE' && (
            <div className="space-y-4">
              
              {/* Highlighted Enterprise Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white border border-amber-500/30 shadow-lg space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400">
                      <Crown className="w-5 h-5 fill-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white">
                        Chains & Agencies (10+ Locations)
                      </h4>
                      <p className="text-[11px] text-amber-200/80">
                        Custom Enterprise & Multi-Location Fleet
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    10+ Locations
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  For multi-unit operators, hospitality management groups, franchise chains, and digital agencies, we provide dedicated enterprise onboarding:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-200 pt-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Unlimited locations (10, 50, 100+)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Volume pricing from $15 / venue / month</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Batch onboarding via Google API / CSV</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Dedicated SEO Strategist via WhatsApp</span>
                  </div>
                </div>

                {/* Direct Contact Box */}
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 mt-2">
                  <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
                    Contact our enterprise team:
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-white font-mono font-bold text-sm bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
                      <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Support@gbpilot.top</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Copy email"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Email</span>
                          </>
                        )}
                      </button>

                      <a
                        href={mailtoUrl}
                        className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/30"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Send Email</span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                💡 <strong>Rapid Turnaround:</strong> Our technical team responds within 1–2 hours during business hours (Dubai GST, UTC+4). We can prepare a customized invoice or bulk-import your venues in 1 click.
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 shrink-0 text-xs">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            Support: <span className="font-semibold text-slate-700">Support@gbpilot.top</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
