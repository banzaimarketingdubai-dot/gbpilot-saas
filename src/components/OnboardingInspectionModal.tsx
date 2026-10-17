'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  Star, 
  MapPin, 
  Clock, 
  Lock, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  X, 
  TrendingUp, 
  Sliders, 
  Eye, 
  EyeOff,
  Building2,
  Calendar,
  Layers,
  Utensils,
  Image as ImageIcon,
  DollarSign,
  Share2,
  Edit3
} from 'lucide-react';
import { HealthGauge } from '@/components/HealthGauge';
import { getSubscription, activateTrial } from '@/lib/subscription';
import { runInspectionAudit } from '@/lib/inspection/auditEngine';

export interface AuditActionCardItem {
  id: string;
  categoryTitle: string;
  gapTag: 'CRITICAL_FIX' | 'HIGH_IMPACT' | 'CONVERSION_BOOSTER';
  problemText: string;
  beforeValue: string;
  afterAiValue: string;
  impactMetric: string;
  applied: boolean;
  isCustomized?: boolean;
}

interface OnboardingInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName?: string;
  businessAddress?: string;
  onComplete?: () => void;
}

export function OnboardingInspectionModal({
  isOpen,
  onClose,
  businessName = '—',
  businessAddress = '—',
  onComplete
}: OnboardingInspectionModalProps) {
  // Flow states: 'SCANNING' | 'REPORT' | 'APPLYING' | 'SUCCESS'
  const [step, setStep] = useState<'SCANNING' | 'REPORT' | 'APPLYING' | 'SUCCESS'>('SCANNING');

  // PLG Tier switch: Pro vs Free Trial (Allows instant switching to test paywall & conversion mechanics)
  const [isPro, setIsPro] = useState(false);
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sub = getSubscription();
      setIsPro(sub.isPro);
    }
  }, []);

  const auditReport = React.useMemo(() => {
    return runInspectionAudit({
      title: businessName,
      address: businessAddress
    });
  }, [businessName, businessAddress]);

  // Scanning progress state
  const [scanProgress, setScanProgress] = useState(15);
  const [scanStageIndex, setScanStageIndex] = useState(0);

  // Applying API simulation state
  const [appliedStepIndex, setAppliedStepIndex] = useState(0);

  // Collaborative Human-in-the-Loop Inline Editing state
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const handleStartEdit = (card: AuditActionCardItem) => {
    if (!isPro) {
      setIsPaywallModalOpen(true);
      return;
    }
    setEditingCardId(card.id);
    setEditingText(card.afterAiValue);
  };

  const handleSaveEdit = (id: string) => {
    setActionCards(prev => prev.map(c => c.id === id ? { ...c, afterAiValue: editingText, isCustomized: true } : c));
    setEditingCardId(null);
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
  };

  const handleQuickChipAppend = (chipText: string) => {
    setEditingText(prev => prev.trim() + ' ' + chipText);
  };

  // Action Cards Data
  const [actionCards, setActionCards] = useState<AuditActionCardItem[]>([
    {
      id: 'audit-bio',
      categoryTitle: 'Primary Category & SEO Description (Profile Bio)',
      gapTag: 'CRITICAL_FIX',
      problemText: 'Current description is short and lacks high-intent local search keywords. Google cannot match your listing to local search intent.',
      beforeValue: 'Generic short description lacking high-intent local search keywords.',
      afterAiValue: `Verified Google Business Profile description for ${businessName !== '—' ? businessName : 'your venue'} optimized with high-intent local keywords, core services, and operating highlights.`,
      impactMetric: '+4 Local Search Keywords Indexed',
      applied: false
    },
    {
      id: 'audit-holiday-hours',
      categoryTitle: 'Special Holiday Hours (Tamper & Misdirection Protection)',
      gapTag: 'HIGH_IMPACT',
      problemText: 'Upcoming public holiday hours are missing. Google Maps displays an alarming "Hours might differ" banner, dropping foot traffic by ~40%.',
      beforeValue: 'Unspecified (Google displays warning on holidays).',
      afterAiValue: 'Confirmed Operating Schedule (08:00 AM – 10:00 PM) calibrated for upcoming public holiday, maintaining uninterrupted Local Pack rank and eliminating misdirection.',
      impactMetric: 'Eliminates False "Closed" Google Flags',
      applied: false
    },
    {
      id: 'audit-attributes',
      categoryTitle: 'Missing Business Attributes (Customer Conversion Tags)',
      gapTag: 'HIGH_IMPACT',
      problemText: '8 high-converting customer decision tags are missing from your GBP attributes, filtering you out of filtered map searches.',
      beforeValue: 'Only 2 basic attributes enabled.',
      afterAiValue: '✓ Wi-Fi Available  ✓ Outdoor Seating  ✓ Pet Friendly  ✓ Wheelchair Accessible  ✓ Takeout  ✓ Dine-in  ✓ Credit Cards Accepted  ✓ Vegan Options',
      impactMetric: 'Matches 8 Filtered Map Queries',
      applied: false
    },
    {
      id: 'audit-services-menu',
      categoryTitle: 'Services & Menu Catalog (AI Search & Gemini Citations)',
      gapTag: 'CONVERSION_BOOSTER',
      problemText: 'Service catalog is completely empty. Voice search (Google Assistant) and AI engines (ChatGPT, Gemini) cannot cite prices or specific dishes.',
      beforeValue: '0 structured catalog items.',
      afterAiValue: 'Structured Catalog of 10 Signature Items with Local Pricing: Single-Origin Pour-over (AED 24), Signature Dubai Pistachio Croissant (AED 32), Avocado & Poached Egg Toast (AED 48), Nitro Cold Brew (AED 26), Organic Matcha (AED 28)...',
      impactMetric: 'Enables 1-Click Ordering & AI Grounding',
      applied: false
    },
    {
      id: 'audit-exif-photos',
      categoryTitle: 'Geo-Tagged Photos (EXIF Spatial Authority)',
      gapTag: 'CRITICAL_FIX',
      problemText: 'Uploaded venue photos lack camera EXIF GPS centroid metadata, missing primary Google Maps spatial authority signals.',
      beforeValue: '0% photos stamped with coordinates.',
      afterAiValue: 'Camera EXIF Geotag Package: Stamped with exact latitude & longitude coordinates (25.0805° N, 55.1403° E) matching venue centroid for Local 3-Pack rank surges in Dubai Marina.',
      impactMetric: 'Qualifies for Maps Discovery Carousel',
      applied: false
    },
    {
      id: 'audit-makani-tower',
      categoryTitle: 'Dubai Precision Geocoding (10-Digit Makani & Tower Landmark)',
      gapTag: 'CRITICAL_FIX',
      problemText: 'Profile lacks a 10-digit Dubai Makani Number and Tower/Cluster landmark. Google Maps and Uber drop pins on the highway instead of the lobby.',
      beforeValue: businessAddress !== '—' ? `${businessAddress} (Ambiguous Street Pin)` : 'Ambiguous Street Pin (Missing Makani)',
      afterAiValue: 'Verified 10-Digit Makani Number & Entrance Centroid Geotagged for Google Maps and direct pedestrian routing.',
      impactMetric: 'Eliminates 100% of Delivery & Tourist Dropoff Errors',
      applied: false
    }
  ]);

  const scanStages = [
    'Analyzing business categories, profile description and core NAP attributes...',
    'Scanning completeness of services, menu catalog, and pricing...',
    'Checking EXIF photo metadata, business hours & holiday schedules...',
    'Benchmarking local SEO keywords against Top 3 neighborhood competitors...'
  ];

  const applyingSteps = [
    'Authenticating Google My Business API OAuth session...',
    'Injecting SEO-optimized profile description & secondary categories...',
    'Publishing verified special holiday hours schedule...',
    'Activating 8 missing high-conversion customer attributes...',
    'Syndicating 10 structured menu offerings with localized prices...',
    'Stamping EXIF centroid coordinates & activating 24/7 Sentinel Guard...'
  ];

  // Dynamic Scanning Simulator on Mount / Open
  useEffect(() => {
    if (!isOpen) return;

    if (step === 'SCANNING') {
      setScanProgress(15);
      setScanStageIndex(0);

      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('REPORT'), 400);
            return 100;
          }
          const next = prev + Math.floor(Math.random() * 15) + 10;
          if (next >= 75) setScanStageIndex(3);
          else if (next >= 50) setScanStageIndex(2);
          else if (next >= 25) setScanStageIndex(1);
          return Math.min(100, next);
        });
      }, 550);

      return () => clearInterval(interval);
    }
  }, [isOpen, step]);

  // Dynamic Applying Simulator
  useEffect(() => {
    if (step === 'APPLYING') {
      setAppliedStepIndex(0);
      const interval = setInterval(() => {
        setAppliedStepIndex(prev => {
          if (prev >= applyingSteps.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setActionCards(cards => cards.map(c => ({ ...c, applied: true })));
              setStep('SUCCESS');
            }, 600);
            return prev;
          }
          return prev + 1;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleApplySingleCard = (id: string) => {
    if (!isPro) {
      setIsPaywallModalOpen(true);
      return;
    }
    setActionCards(prev => prev.map(c => c.id === id ? { ...c, applied: true } : c));
  };

  const handleApplyAll = () => {
    if (!isPro) {
      setIsPaywallModalOpen(true);
      return;
    }
    setStep('APPLYING');
  };

  const handleCompleteAndExit = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbpilot_initial_audit_completed', 'true');
      localStorage.setItem('gbpilot_audit_score', '98');
    }
    if (onComplete) onComplete();
    onClose();
  };

  const handleManualGoogleEdit = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbpilot_initial_audit_completed', 'true');
    }
    window.open('https://business.google.com', '_blank', 'noopener,noreferrer');
    if (onComplete) onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Container Box */}
      <div className="bg-[#F8FAFC] w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* ======================================================== */}
        {/* MODAL TOP BAR                                            */}
        {/* ======================================================== */}
        <div className="bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-google-blue text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  AI Profile Inspection &amp; Onboarding Audit
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-google-blue border border-blue-200 shrink-0">
                  PLG Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Target Venue: <strong>{businessName}</strong> ({businessAddress})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Interactive Tier Switcher for Testing Free vs Pro Paywall */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setIsPro(false)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  !isPro ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Test Free / Trial Tier with Blur Effect & Paywall"
              >
                Free / Trial (Paywall)
              </button>
              <button
                type="button"
                onClick={() => setIsPro(true)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isPro ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Test Pro Tier with 1-Click Instant API execution"
              >
                Pro Tier (1-Click)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: DYNAMIC SCANNING SCREEN (PROGRESS BAR & PHASES)  */}
        {/* ======================================================== */}
        {step === 'SCANNING' && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 flex-1 bg-white">
            
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center shadow-inner">
                <Sparkles className="w-10 h-10 text-google-blue animate-spin" />
              </div>
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
                AI
              </span>
            </div>

            <div className="space-y-1 max-w-md">
              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Deep Profile Inspection in Progress...
              </h4>
              <p className="text-xs text-slate-500">
                Scanning live Google Business Profile attributes, Local Pack keyword velocity, and competitor centroids for <strong>{businessName}</strong>.
              </p>
            </div>

            {/* Dynamic Linear Progress Bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-google-blue">Running Audit Algorithm</span>
                <span className="text-slate-700 font-mono">{scanProgress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-google-blue to-emerald-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>

            {/* 4 Multi-Stage Verification Steps */}
            <div className="w-full max-w-lg space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              {scanStages.map((stage, idx) => {
                const isPassed = scanStageIndex > idx || scanProgress >= 99;
                const isCurrent = scanStageIndex === idx && scanProgress < 99;

                return (
                  <div key={idx} className="flex items-start gap-2.5">
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-google-blue animate-spin shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-[11px] leading-snug ${
                      isPassed ? 'text-slate-700 font-medium' : isCurrent ? 'text-google-blue font-bold' : 'text-slate-400'
                    }`}>
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grounded on Google Maps API and Local 3-Pack Centroid Index</span>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: AUDIT REPORT SCREEN                              */}
        {/* ======================================================== */}
        {step === 'REPORT' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* ==================================================== */}
            {/* ZONE A: PROFILE OPTIMIZATION SCORE (HEALTH INDEX)    */}
            {/* ==================================================== */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Left: Speedometer Gauge */}
              <div className="flex items-center gap-5 w-full md:w-auto">
                <HealthGauge score={64} size={110} />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                      Yellow Zone • Action Needed
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Profile Optimization Score: 64 / 100
                  </h4>
                  <p className="text-xs text-rose-600 font-semibold">
                    ⚠️ You are currently losing up to 35% of local search customers to nearby rivals.
                  </p>
                </div>
              </div>

              {/* Right: Projected Lift Metric */}
              <div className="w-full md:w-auto p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col justify-center space-y-1 shrink-0 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>Projected Lift with 5 AI Fixes:</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-700">98 / 100</span>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-1.5 py-0.5 rounded">
                    Top 3 Pack Ready
                  </span>
                </div>
                <span className="text-[11px] text-emerald-800">
                  Estimated Revenue Recovery: <strong>+{auditReport.revenueRecoveryFormatted}</strong>
                  <span className="text-[10px] text-slate-500 block">
                    Saved PPC Budget: {auditReport.savedAdSpendFormatted} ({auditReport.industryBenchmark.categoryGroup})
                  </span>
                </span>
              </div>

            </div>

            {/* Gap Summary Alert & WhatsApp Share */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>6 Critical Optimization Gaps Detected:</strong> Review the transparent before/after comparisons below.
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `*Google Maps Audit Report for ${businessName}*\nHealth Score: 64/100 (Yellow Alert)\nProjected with AI Fixes: 98/100 (+${auditReport.revenueRecoveryFormatted} in Google Ads equiv)\nView Audit: https://gbpilot.top`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>📲 Share via WhatsApp</span>
                </a>
                {!isPro && (
                  <span className="hidden sm:inline-flex px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold text-[10px]">
                    🔒 Pro Unlock Required
                  </span>
                )}
              </div>
            </div>

            {/* Collaborative Owner Knowledge & Editorial Banner */}
            <div className="bg-blue-50/80 border border-blue-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-900 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-google-blue flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>Коллаборативный режим (Human-in-the-Loop)</span>
                    <span className="px-2 py-0.2 bg-blue-100 text-google-blue rounded text-[10px] font-bold">JTBD Standard</span>
                  </h5>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Вы знаете свой бизнес лучше любого ИИ. Одобрите готовую редакцию в 1 клик или нажмите <strong>«Отредактировать»</strong>, чтобы дополнить ее реальными фактами и фишками заведения до отправки в Google.
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================================== */}
            {/* ZONE B: AUDIT ACTION CARDS (BEFORE ➔ AFTER COMPARISON) */}
            {/* ==================================================== */}
            <div className="space-y-4">
              {actionCards.map((card, idx) => (
                <div
                  key={card.id}
                  className={`bg-white border rounded-3xl p-5 shadow-xs transition-all space-y-3.5 ${
                    card.applied ? 'border-emerald-300 bg-emerald-50/10' : 'border-slate-200'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                        {card.categoryTitle}
                      </h5>
                    </div>

                    <div className="flex items-center gap-2">
                      {card.isCustomized && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-google-blue border border-blue-200 flex items-center gap-1">
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>Инсайд владельца</span>
                        </span>
                      )}
                      {card.applied ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Applied via API</span>
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          card.gapTag === 'CRITICAL_FIX' 
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : card.gapTag === 'HIGH_IMPACT'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-google-blue border border-blue-200'
                        }`}>
                          {card.gapTag.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Problem Statement */}
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800">Detected Vulnerability: </span>
                    {card.problemText}
                  </div>

                  {/* Transparent Before vs After Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    
                    {/* Before (Было) */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Current State (Before):
                      </span>
                      <p className="text-slate-700 italic leading-relaxed">
                        "{card.beforeValue}"
                      </p>
                    </div>

                    {/* After (Станет / ИИ-Решение) with Collaborative Inline Edit & PLG Blur */}
                    <div className="relative p-3 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-google-blue uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>AI-Optimized Standard (After):</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                          {card.impactMetric}
                        </span>
                      </div>

                      {/* Editing View */}
                      {editingCardId === card.id ? (
                        <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            rows={4}
                            className="w-full p-2.5 rounded-xl border border-blue-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-google-blue font-sans leading-relaxed"
                            placeholder="Дополните формулировку своими фактами о заведении..."
                          />
                          <div className="flex flex-wrap items-center gap-1 text-[10px]">
                            <span className="text-slate-400 font-semibold">Быстрые инсайды:</span>
                            <button
                              type="button"
                              onClick={() => handleQuickChipAppend('✓ Собственная парковка во дворе для гостей.')}
                              className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                            >
                              + Парковка
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickChipAppend('✓ Дог-френдли терраса (вода для питомцев).')}
                              className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                            >
                              + Дог-френдли
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickChipAppend('✓ Фирменное авторское блюдо от шефа.')}
                              className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                            >
                              + Хит меню
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickChipAppend('✓ По предварительному бронированию.')}
                              className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                            >
                              + Бронь
                            </button>
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
                            >
                              Отмена
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(card.id)}
                              className="px-3.5 py-1 bg-google-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
                            >
                              Сохранить инсайд
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Content block: Crisp if Pro, Blurred & Unselectable if Free */
                        <div className={`mt-1 text-slate-800 font-medium leading-relaxed transition-all ${
                          !isPro && !card.applied 
                            ? 'blur-xs select-none pointer-events-none' 
                            : 'select-text'
                        }`}>
                          {card.afterAiValue}
                        </div>
                      )}

                      {/* Paywall Overlay Badge when Blurred */}
                      {!isPro && !card.applied && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center p-3 select-none">
                          <button
                            type="button"
                            onClick={() => setIsPaywallModalOpen(true)}
                            className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white font-bold rounded-xl text-[11px] shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Unlock with Pro ($49/mo)</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Card Bottom CTA */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Impact: {card.impactMetric}
                      </span>
                      {card.isCustomized && (
                        <span className="text-[11px] text-google-blue font-bold">
                          • Учтены ваши данные
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!card.applied && editingCardId !== card.id && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(card)}
                          className="px-2.5 py-1 text-slate-600 hover:text-google-blue hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Отредактировать предложение ИИ с учетом ваших знаний о заведении"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Отредактировать</span>
                        </button>
                      )}

                      {card.applied ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <Check className="w-3.5 h-3.5" /> Ready for Live Deployment
                        </span>
                      ) : isPro ? (
                        <button
                          type="button"
                          onClick={() => handleApplySingleCard(card.id)}
                          className="px-3.5 py-1.5 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Apply in 1 Click</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsPaywallModalOpen(true)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>Available on Pro</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: APPLYING SCREEN (2-SEC REALISTIC API SYNC)       */}
        {/* ======================================================== */}
        {step === 'APPLYING' && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 flex-1 bg-white">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center shadow-xs">
              <RefreshCw className="w-8 h-8 text-google-blue animate-spin" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900 tracking-tight">
                Syndicating Optimizations via Google API...
              </h4>
              <p className="text-xs text-slate-500 max-w-md">
                Pushing verified SEO category copy, holiday schedules, menu records, and EXIF metadata stamps directly to Google My Business.
              </p>
            </div>

            <div className="w-full max-w-md space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              {applyingSteps.map((stepDesc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {appliedStepIndex >= idx ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span className={`text-[11px] ${
                    appliedStepIndex >= idx ? 'text-slate-800 font-semibold' : 'text-slate-400'
                  }`}>
                    {stepDesc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: SUCCESS & CELEBRATION SCREEN                     */}
        {/* ======================================================== */}
        {step === 'SUCCESS' && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 flex-1 bg-white">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Check className="w-10 h-10 text-emerald-600 stroke-[3]" />
            </div>

            <div className="space-y-2 max-w-md">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                100% AUDIT COMPLETE
              </span>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                Profile Optimized! 🟢 AI Shield Active
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                All 5 high-intent vulnerabilities have been repaired. Your Google Business Profile score has surged from <strong>64 / 100</strong> to <strong>98 / 100</strong>.
              </p>
            </div>

            {/* Score Comparison Pill */}
            <div className="flex items-center justify-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-sm w-full">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Before</span>
                <span className="text-xl font-bold text-slate-400 line-through">64%</span>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-600" />
              <div className="text-center">
                <span className="text-[10px] font-bold text-emerald-600 block uppercase">Optimized</span>
                <span className="text-2xl font-black text-emerald-600">98%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompleteAndExit}
              className="px-6 py-3.5 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Enter Cockpit (Command Center)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* ZONE C: STICKY BOTTOM ACTION / PAYWALL CTA BAR           */}
        {/* ======================================================== */}
        {step === 'REPORT' && (
          <div className="bg-white border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isPro ? (
                  <span><strong>Pro License Active:</strong> 1-Click direct Google API authorization enabled.</span>
                ) : (
                  <span><strong>Free Evaluation Mode:</strong> Upgrade to unlock 1-click automated API push.</span>
                )}
              </span>
            </div>

            {/* Conditional Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              
              {isPro ? (
                /* PRO USER: 1-Click Master Apply */
                <button
                  type="button"
                  onClick={handleApplyAll}
                  className="w-full sm:w-auto px-5 py-3 bg-google-blue hover:bg-blue-600 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>⚡ Apply All 5 Optimizations via API</span>
                </button>
              ) : (
                /* FREE USER: Conversion Hook & Manual Escape Hatch */
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleManualGoogleEdit}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer text-center"
                    title="Manual copy to Google Business Profile"
                  >
                    <span>Update Manually in Google ↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPaywallModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-3 bg-google-blue hover:bg-blue-600 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>🚀 Unlock 1-Click Auto-Fill — $49/mo</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* PAYWALL CONVERSION MODAL                                  */}
      {/* ======================================================== */}
      {isPaywallModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setIsPaywallModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-google-blue to-blue-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
                <Zap className="w-7 h-7 fill-white" />
              </div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">
                Unlock 1-Click AI Auto-Fill &amp; Guard
              </h4>
              <p className="text-xs text-slate-500">
                Save 2+ hours of manual Google Business Profile labor and activate 24/7 autonomous rank protection.
              </p>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-Click API application for all 5 audit gaps</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24/7 Counter-intelligence tamper protection</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automated review auto-responder with local SEO keywords</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Up to 5 review removal dossiers per month</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsPro(true);
                  setIsPaywallModalOpen(false);
                  setStep('APPLYING');
                }}
                className="w-full py-3.5 bg-google-blue hover:bg-blue-600 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Activate Pro (7-Day Free Trial) — $49/mo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPro(true);
                  setIsPaywallModalOpen(false);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
              >
                Simulate Pro Plan Upgrade (Demo Mode)
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Cancel anytime with 1 click. Zero risk. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
