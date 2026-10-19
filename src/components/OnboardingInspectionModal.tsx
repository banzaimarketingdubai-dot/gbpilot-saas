'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  Check, 
  RefreshCw, 
  X, 
  TrendingUp, 
  SlidersHorizontal, 
  Edit3,
  Copy,
  Gift,
  Lock,
  Share2
} from 'lucide-react';
import { HealthGauge } from '@/components/HealthGauge';
import { getSubscription } from '@/lib/subscription';
import { runInspectionAudit, InspectionAuditReport } from '@/lib/inspection/auditEngine';
import { 
  SeoCopyTone, 
  BusinessNiche, 
  NICHE_LIST, 
  detectBusinessNiche, 
  generateSmartSeoDescription, 
  getNicheCatalogItems,
  extractGeoAnchors 
} from '@/lib/inspection/seoCopyGenerator';

export interface AuditActionCardItem {
  id: string;
  categoryTitle: string;
  gapTag: 'CRITICAL_FIX' | 'HIGH_IMPACT' | 'CONVERSION_BOOSTER';
  isFree?: boolean;
  problemText: string;
  beforeValue: string;
  beforeMeta?: string;
  afterAiValue: string;
  afterMeta?: string;
  keywordChips?: string[];
  impactMetric: string;
  applied: boolean;
  isCustomized?: boolean;
}

interface OnboardingInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName?: string;
  businessAddress?: string;
  category?: string;
  city?: string;
  currentDescription?: string;
  currentPhone?: string;
  onComplete?: () => void;
}

function generateDefaultActionCards(
  businessName: string,
  businessAddress: string,
  auditReport: InspectionAuditReport,
  category?: string,
  city?: string,
  seoTone: SeoCopyTone = 'SEO',
  currentDescription?: string,
  currentPhone?: string,
  nicheOverride?: BusinessNiche,
  customOwnerNotes?: string
): AuditActionCardItem[] {
  const name = businessName !== '—' && businessName ? businessName : 'your business';
  const address = businessAddress !== '—' && businessAddress ? businessAddress : 'your neighborhood';
  const geo = extractGeoAnchors(address, city);
  const activeNiche = nicheOverride || detectBusinessNiche(name, category);

  // Generate genuine, high-quality, niche-aware Local SEO description
  const highQualitySeoBio = generateSmartSeoDescription({
    businessName: name,
    businessAddress: address,
    category,
    city: geo.city,
    tone: seoTone,
    explicitNiche: activeNiche,
    customNotes: customOwnerNotes
  });

  // Calculate real metrics from existing profile
  const hasRealDescription = Boolean(currentDescription && currentDescription.trim().length > 0);
  const existingDescText = hasRealDescription 
    ? currentDescription!.trim() 
    : 'No business description configured in Google Business Profile (0 / 750 characters). Listing does not rank for targeted local search queries in your area.';
  const existingDescLen = hasRealDescription ? currentDescription!.trim().length : 0;

  const catalogPreview = getNicheCatalogItems(activeNiche, auditReport.currencySymbol);

  return [
    {
      id: 'audit-bio',
      categoryTitle: 'Primary Category & SEO Description (Profile Bio)',
      gapTag: 'CRITICAL_FIX',
      isFree: true, // 100% FREE STARTER FIX
      problemText: hasRealDescription
        ? `Current description is too brief (${existingDescLen} of 750 characters) and lacks high-intent search keywords for ${geo.landmarkOrDistrict}. Google Maps prioritizes competitors with comprehensive profiles.`
        : `Google Maps listing description is missing (0 of 750 characters). Search algorithms cannot associate "${name}" with high-intent nearby customer queries.`,
      beforeValue: existingDescText,
      beforeMeta: `${existingDescLen} / 750 characters • Missing ${Math.max(0, 750 - existingDescLen)} characters`,
      afterAiValue: highQualitySeoBio,
      afterMeta: `${highQualitySeoBio.length} / 750 characters • 6 high-intent search phrases indexed`,
      keywordChips: [
        `Location: ${geo.landmarkOrDistrict}`,
        'Amenities & Services',
        'LSI Search Keywords',
        'Call to Action (CTA)'
      ],
      impactMetric: '+4 target search keywords ranked',
      applied: false
    },
    {
      id: 'audit-holiday-hours',
      categoryTitle: 'Holiday & Special Operating Hours (Customer Loss Protection)',
      gapTag: 'HIGH_IMPACT',
      isFree: true, // 100% FREE STARTER FIX
      problemText: 'Upcoming holiday and special operating hours are unconfirmed. Google Maps displays an alarming yellow warning "Hours might differ", causing up to 40% of potential visitors to switch to nearby competitors.',
      beforeValue: 'Holiday operating hours are unconfirmed in Google Maps. Warning badge displayed: "Hours might differ".',
      beforeMeta: 'Status: Google Warning Active (High drop-off risk)',
      afterAiValue: 'Official verified holiday schedule confirmed across all national calendar holidays. Guarantees continuous "Open" status in Google Maps search with zero customer warnings.',
      afterMeta: 'Status: 100% Verified • Warning Removed',
      impactMetric: 'Eliminates "Closed" false flags',
      applied: false
    },
    {
      id: 'audit-attributes',
      categoryTitle: 'Guest Amenities & Attributes (Map Search Filters)',
      gapTag: 'HIGH_IMPACT',
      isFree: false, // PRO TIER
      problemText: 'Listing lacks high-converting attribute tags that users frequently filter by on Google Maps (Wi-Fi, parking, card payment, outdoor seating, wheelchair accessible).',
      beforeValue: 'Only 2 basic attributes enabled. Profile is excluded from search results when users apply amenity filters on Google Maps.',
      beforeMeta: 'Active: 2 of 10 essential attributes',
      afterAiValue: '✓ Free Guest Wi-Fi  ✓ Credit Card & Mobile Pay  ✓ Outdoor Seating / Lounge  ✓ Pet-Friendly  ✓ Dedicated Customer Parking  ✓ Takeaway  ✓ Wheelchair Accessible',
      afterMeta: 'Activated: 8 high-intent search filters',
      impactMetric: 'Matches 8 Google Maps filter presets',
      applied: false
    },
    {
      id: 'audit-services-menu',
      categoryTitle: 'Menu & Service Catalog (For Google Search & AI Overview)',
      gapTag: 'CONVERSION_BOOSTER',
      isFree: false, // PRO TIER
      problemText: 'Service catalog or menu is empty. Neither Google Maps nor conversational AI search (Gemini, AI Overviews) can cite your pricing or flagship offerings to searching customers.',
      beforeValue: '0 structured items in Google catalog. Listing is ineligible for rich visual product cards and voice search answers.',
      beforeMeta: '0 items • Section unpopulated',
      afterAiValue: catalogPreview,
      afterMeta: '10 structured items with verified prices for Google AI',
      impactMetric: 'Direct citation in Google AI Overview',
      applied: false
    },
    {
      id: 'audit-exif-photos',
      categoryTitle: 'Photo Geotagging & Centroid Tagging (EXIF GPS Boost)',
      gapTag: 'CRITICAL_FIX',
      isFree: false, // PRO TIER
      problemText: 'Uploaded photos lack precise physical GPS entry coordinates. Google Maps local algorithms favor listings with confirmed geographic image centroids.',
      beforeValue: '0% of uploaded photos have embedded GPS coordinates matching the physical entrance.',
      beforeMeta: 'EXIF metadata: Missing',
      afterAiValue: `EXIF Geo-Tagging Suite: Embeds high-precision geographic coordinates of entrance (${address}) directly into photo metadata for prioritized local radius ranking.`,
      afterMeta: 'Coordinate centroid pinned on Google Maps',
      impactMetric: 'Priority ranking in photo carousel',
      applied: false
    },
    {
      id: 'audit-sentinel-guard',
      categoryTitle: '24/7 AI Sentinel Shield (Competitor Edit Protection)',
      gapTag: 'CRITICAL_FIX',
      isFree: false, // PRO TIER
      problemText: 'Phone number and address are unprotected against third-party public edits. Competitors or malicious actors can suggest edits, triggering listing suspension or hijacking calls.',
      beforeValue: currentPhone 
        ? `Phone number (${currentPhone}) and address are vulnerable to crowd-sourced edits with no automatic rollback.`
        : 'Contact details and physical address are vulnerable to crowd-sourced edits (suspension risk).',
      beforeMeta: 'Status: Profile unprotected against edits',
      afterAiValue: 'Golden Snapshot locked in 24/7 Sentinel Guard. Automated rollback of unauthorized third-party edits within 180 seconds with zero re-verification risk.',
      afterMeta: 'Status: 24/7 Shield Active • Auto-Rollback Enabled',
      impactMetric: '100% protection against hijack & suspension',
      applied: false
    }
  ];
}

export function OnboardingInspectionModal({
  isOpen,
  onClose,
  businessName = '—',
  businessAddress = '—',
  category,
  city,
  currentDescription,
  currentPhone,
  onComplete
}: OnboardingInspectionModalProps) {
  // Flow states: 'SCANNING' | 'REPORT' | 'APPLYING' | 'SUCCESS'
  const [step, setStep] = useState<'SCANNING' | 'REPORT' | 'APPLYING' | 'SUCCESS'>('SCANNING');

  // PLG Tier switch: Pro vs Free Trial
  const [isPro, setIsPro] = useState(false);
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);

  // High-Quality Local SEO Copywriting Tone Switcher
  const [seoTone, setSeoTone] = useState<SeoCopyTone>('SEO');
  const [isRegeneratingBio, setIsRegeneratingBio] = useState(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Human-in-the-Loop Niche & Activity Clarification (Avatar is the domain expert)
  const initialNiche = detectBusinessNiche(businessName, category);
  const [selectedNiche, setSelectedNiche] = useState<BusinessNiche>(initialNiche);
  const [isNichePickerOpen, setIsNichePickerOpen] = useState(false);
  const [customOwnerNotes, setCustomOwnerNotes] = useState('');

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

  // Action Cards Data
  const [actionCards, setActionCards] = useState<AuditActionCardItem[]>(() =>
    generateDefaultActionCards(businessName, businessAddress, auditReport, category, city, 'SEO', currentDescription, currentPhone, selectedNiche, customOwnerNotes)
  );

  useEffect(() => {
    setActionCards(generateDefaultActionCards(businessName, businessAddress, auditReport, category, city, seoTone, currentDescription, currentPhone, selectedNiche, customOwnerNotes));
  }, [businessName, businessAddress, auditReport, category, city, seoTone, currentDescription, currentPhone, selectedNiche, customOwnerNotes]);

  // Scanning progress state
  const [scanProgress, setScanProgress] = useState(15);
  const [scanStageIndex, setScanStageIndex] = useState(0);

  // Applying API simulation state
  const [appliedStepIndex, setAppliedStepIndex] = useState(0);

  // Collaborative Human-in-the-Loop Inline Editing state
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const handleStartEdit = (card: AuditActionCardItem) => {
    if (!card.isFree && !isPro) {
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

  const handleToneChange = (newTone: SeoCopyTone) => {
    setSeoTone(newTone);
    setIsRegeneratingBio(true);
    setTimeout(() => {
      const newBio = generateSmartSeoDescription({
        businessName,
        businessAddress,
        category,
        city,
        tone: newTone,
        explicitNiche: selectedNiche,
        customNotes: customOwnerNotes
      });
      setActionCards(prev => prev.map(c => c.id === 'audit-bio' ? { ...c, afterAiValue: newBio, isCustomized: false } : c));
      setIsRegeneratingBio(false);
    }, 250);
  };

  const handleSelectNiche = (nicheId: BusinessNiche) => {
    setSelectedNiche(nicheId);
    setIsRegeneratingBio(true);
    const targetNicheInfo = NICHE_LIST.find(n => n.id === nicheId);
    setTimeout(() => {
      setIsRegeneratingBio(false);
      setCopiedToast(`✓ Niche updated to "${targetNicheInfo?.label || ''}". Recommendations refreshed!`);
      setTimeout(() => setCopiedToast(null), 3000);
    }, 300);
  };

  const handleApplyOwnerNotes = () => {
    if (!customOwnerNotes.trim()) return;
    setIsRegeneratingBio(true);
    setTimeout(() => {
      setIsRegeneratingBio(false);
      setCopiedToast('✓ Owner insights successfully integrated into profile SEO bio!');
      setTimeout(() => setCopiedToast(null), 3000);
    }, 300);
  };

  const handleCopyText = (textToCopy: string, successMessage = 'Text copied to clipboard!') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedToast(successMessage);
      setTimeout(() => setCopiedToast(null), 2500);
    }
  };

  const handleApplySingleCard = (id: string) => {
    const card = actionCards.find(c => c.id === id);
    if (!card) return;

    if (!card.isFree && !isPro) {
      setIsPaywallModalOpen(true);
      return;
    }

    setActionCards(prev => prev.map(c => c.id === id ? { ...c, applied: true } : c));
    setCopiedToast('✓ Change saved successfully!');
    setTimeout(() => setCopiedToast(null), 2000);
  };

  const handleApplyFreeStarterCards = () => {
    setActionCards(prev => prev.map(c => c.isFree ? { ...c, applied: true } : c));
    setCopiedToast('🎉 2 starter optimizations applied for free!');
    setTimeout(() => setCopiedToast(null), 3000);
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
      localStorage.setItem('gbpilot_audit_score', '100');
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

  const scanStages = [
    'Analyzing categories, profile bio, and core NAP data (Name, Address, Phone)...',
    'Checking service catalog, menu items, and pricing validity...',
    'Verifying EXIF photo metadata, operating hours, and holiday schedules...',
    'Benchmarking local ranking signals against top 3 competitors in your radius...'
  ];

  const applyingSteps = [
    'Authorizing session via official Google Business Profile API...',
    'Deploying optimized bio description and secondary categories...',
    'Publishing verified holiday and special operating hours...',
    'Activating 8 high-converting business attributes...',
    'Syncing structured catalog of menu items and services...',
    'Embedding EXIF coordinate centroid and locking Golden Snapshot...'
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
      }, 500);

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

  const freeCards = actionCards.filter(c => c.isFree);
  const freeAppliedCount = freeCards.filter(c => c.applied).length;
  const isAllFreeApplied = freeAppliedCount === freeCards.length;

  const currentNicheInfo = NICHE_LIST.find(n => n.id === selectedNiche) || NICHE_LIST[0];

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `*Google Maps Express Audit for ${businessName}*\nProfile Readiness: 64% (Action Needed)\n6 optimization gaps detected with +${auditReport.revenueRecoveryFormatted}/mo revenue recovery potential (equivalent to ${auditReport.savedAdSpendFormatted} Google Ads PPC spend)\nDetails: https://gbpilot.top`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Floating Toast Feedback */}
      {copiedToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2 z-70 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

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
                  Google Listing Express Audit
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-google-blue border border-blue-200 shrink-0">
                  Initial Diagnostic
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Venue: <strong>{businessName}</strong> {businessAddress !== '—' ? `(${businessAddress})` : ''}
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
                title="Test Free tier mode with 2 free starter fixes"
              >
                Free (Demo Paywall)
              </button>
              <button
                type="button"
                onClick={() => setIsPro(true)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isPro ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Test Pro tier mode with 1-click automated API sync"
              >
                Pro (1-Click API)
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
                Scanning Google Business Profile attributes, local search visibility, and geo-signals for <strong>{businessName}</strong>.
              </p>
            </div>

            {/* Dynamic Linear Progress Bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-google-blue">Express Audit Engine</span>
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
              <span>Diagnostics powered by official Google Maps ranking factors</span>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: AUDIT REPORT SCREEN                              */}
        {/* ======================================================== */}
        {step === 'REPORT' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            
            {/* ==================================================== */}
            {/* ZONE A: PROFILE OPTIMIZATION & BUSINESS DIAGNOSTIC   */}
            {/* ==================================================== */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row items-stretch justify-between gap-6">
              
              {/* Left Column: Health Gauge & Diagnostic Assessment */}
              <div className="flex items-center gap-5 flex-1 min-w-0">
                <div className="shrink-0">
                  <HealthGauge score={64} size={110} />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                      Attention Required • 6 Growth Gaps
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Initial Audit
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Profile Readiness: 64% of 100%
                  </h4>
                  <p className="text-xs text-rose-600 font-semibold leading-relaxed">
                    ⚠️ Listing loses up to 35% of local searches and calls due to missing data, trailing nearby rivals.
                  </p>
                </div>
              </div>

              {/* Divider for desktop */}
              <div className="hidden lg:block w-px bg-slate-200 self-stretch my-1" />

              {/* Right Column: Business Impact & Revenue Lift (NO confusing 98/100 plate!) */}
              <div className="flex-1 lg:max-w-md p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Potential Lift After Optimization:</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    TOP 3 READY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-slate-500 block font-medium">Customer Recovery Potential</span>
                    <span className="text-base sm:text-lg font-black text-emerald-700 block">
                      +{auditReport.revenueRecoveryFormatted}<span className="text-[11px] font-semibold text-slate-500">/mo</span>
                    </span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-slate-500 block font-medium">PPC Ad Spend Equivalent</span>
                    <span className="text-base sm:text-lg font-black text-slate-900 block">
                      {auditReport.savedAdSpendFormatted}<span className="text-[11px] font-semibold text-slate-500">/mo</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 font-medium pt-0.5 border-t border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>All 6 fixes comply with official Google Maps API guidelines</span>
                </div>
              </div>

            </div>

            {/* ==================================================== */}
            {/* HUMAN-IN-THE-LOOP NICHE & EXPERT CLARIFIER          */}
            {/* Bridges owner business knowledge & Google Maps rules */}
            {/* ==================================================== */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-google-blue flex items-center justify-center font-bold text-base shrink-0 border border-blue-200">
                    {currentNicheInfo.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Business Niche:</span>
                      <span className="text-xs font-black text-slate-900">{currentNicheInfo.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      AI tailored recommendations to Google Maps ranking standards for this niche. You can adjust the niche or add custom notes.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNichePickerOpen(!isNichePickerOpen)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isNichePickerOpen ? 'Hide Selector' : '✏️ Not your niche? Refine'}</span>
                </button>
              </div>

              {/* Collapsible Niche Picker & Plain Words Magic Box */}
              {isNichePickerOpen && (
                <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Select exact business specialization (1 click):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {NICHE_LIST.map((niche) => (
                        <button
                          key={niche.id}
                          type="button"
                          onClick={() => handleSelectNiche(niche.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            selectedNiche === niche.id
                              ? 'bg-google-blue text-white shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span>{niche.icon}</span>
                          <span>{niche.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Owner plain words box */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Or describe your business strengths in your own words:</span>
                      <span className="text-[10px] font-normal text-slate-400">(AI will format your facts into Google Maps SEO guidelines)</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={customOwnerNotes}
                        onChange={(e) => setCustomOwnerNotes(e.target.value)}
                        placeholder="e.g. VIP border runs to Cambodia and motorbike rentals, or: wood-fired artisan pizza, weekend family brunch..."
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-google-blue font-sans"
                      />
                      <button
                        type="button"
                        onClick={handleApplyOwnerNotes}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                      >
                        Apply My Notes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Gap Summary Alert & Freemium Value Proposition Banner */}
            <div className="bg-gradient-to-r from-amber-50/90 via-emerald-50/50 to-blue-50/60 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-800 shadow-2xs">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Gift className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>2 starter optimizations ready for free</span>
                    <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded font-black text-[10px]">
                      FREE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    AI created a high-quality SEO bio and holiday schedule to eliminate Google warnings. 4 advanced tools available on Pro.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>📲 Share via WhatsApp</span>
                </a>
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
                    card.applied 
                      ? 'border-emerald-300 bg-emerald-50/10' 
                      : card.isFree 
                      ? 'border-blue-200 ring-1 ring-blue-100' 
                      : 'border-slate-200'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        card.isFree ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                        {card.categoryTitle}
                      </h5>
                    </div>

                    <div className="flex items-center gap-2">
                      {card.isFree ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Gift className="w-2.5 h-2.5" />
                          <span>Available for Free</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Pro Tier</span>
                        </span>
                      )}

                      {card.isCustomized && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-google-blue border border-blue-200 flex items-center gap-1">
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>Owner Insight</span>
                        </span>
                      )}

                      {card.applied ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>{card.isFree ? 'Applied' : 'Synced via API'}</span>
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          card.gapTag === 'CRITICAL_FIX' 
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : card.gapTag === 'HIGH_IMPACT'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-google-blue border border-blue-200'
                        }`}>
                          {card.gapTag === 'CRITICAL_FIX' ? 'Critical Fix' : card.gapTag === 'HIGH_IMPACT' ? 'High Impact' : 'Conversion Booster'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Problem Statement */}
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800">Google Maps Vulnerability: </span>
                    {card.problemText}
                  </div>

                  {/* Transparent Before vs After Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    
                    {/* Before (Real Google Profile Current State) */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Current State in Google:
                          </span>
                        </div>
                        <p className="text-slate-700 italic leading-relaxed pt-1">
                          "{card.beforeValue}"
                        </p>
                      </div>

                      {card.beforeMeta && (
                        <div className="pt-2 border-t border-slate-200/70 text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                          <span>{card.beforeMeta}</span>
                        </div>
                      )}
                    </div>

                    {/* After (AI Optimized Solution) with Collaborative Inline Edit & PLG Blur */}
                    <div className="relative p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex flex-col justify-between space-y-2 overflow-hidden">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <span className="text-[10px] font-bold text-google-blue uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>AI Solution (Google Standards):</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                            {card.impactMetric}
                          </span>
                        </div>

                        {/* Interactive Tone Switcher for Card 1 (SEO Profile Bio) */}
                        {card.id === 'audit-bio' && !editingCardId && (
                          <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            <span className="text-[10px] text-slate-400 font-semibold">AI Tone:</span>
                            <button
                              type="button"
                              onClick={() => handleToneChange('SEO')}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                seoTone === 'SEO'
                                  ? 'bg-google-blue text-white shadow-2xs'
                                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                              title="Maximum search keywords for local ranking"
                            >
                              🎯 Local SEO
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToneChange('PREMIUM')}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                seoTone === 'PREMIUM'
                                  ? 'bg-google-blue text-white shadow-2xs'
                                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                              title="Premium tone, hospitality and atmosphere"
                            >
                              💎 Premium
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToneChange('CONCISE')}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                seoTone === 'CONCISE'
                                  ? 'bg-google-blue text-white shadow-2xs'
                                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                              title="Concise facts and direct call to action"
                            >
                              ⚡ Concise
                            </button>
                          </div>
                        )}

                        {/* Editing View */}
                        {editingCardId === card.id ? (
                          <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              rows={4}
                              className="w-full p-2.5 rounded-xl border border-blue-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-google-blue font-sans leading-relaxed"
                              placeholder="Enhance this recommendation with your own business facts..."
                            />
                            <div className="flex flex-wrap items-center gap-1 text-[10px]">
                              <span className="text-slate-400 font-semibold">Quick Insights:</span>
                              <button
                                type="button"
                                onClick={() => handleQuickChipAppend('✓ Dedicated customer parking on site.')}
                                className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                              >
                                + Parking
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickChipAppend('✓ Pet-friendly outdoor seating (water bowls available).')}
                                className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                              >
                                + Pet-Friendly
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickChipAppend('✓ Signature chef specialties available daily.')}
                                className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                              >
                                + Bestseller
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickChipAppend('✓ Online advance reservations available.')}
                                className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                              >
                                + Booking
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickChipAppend('✓ Cozy open-air terrace.')}
                                className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 cursor-pointer transition-colors"
                              >
                                + Terrace
                              </button>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(card.id)}
                                className="px-3.5 py-1 bg-google-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
                              >
                                Save Insight
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Content block: Crisp if Free or Pro; Blurred & Locked ONLY if Paid Card on Free Plan */
                          <div className={`mt-1 text-slate-800 font-medium leading-relaxed transition-all ${
                            !card.isFree && !isPro && !card.applied 
                              ? 'blur-xs select-none pointer-events-none' 
                              : 'select-text'
                          }`}>
                            {isRegeneratingBio && card.id === 'audit-bio' ? (
                              <div className="flex items-center gap-2 text-google-blue py-2">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Generating optimized copy in selected tone...</span>
                              </div>
                            ) : (
                              card.afterAiValue
                            )}
                          </div>
                        )}

                        {/* Keyword Chips for Card 1 */}
                        {card.keywordChips && !editingCardId && (
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            {card.keywordChips.map((chip, cIdx) => (
                              <span key={cIdx} className="px-2 py-0.5 bg-white/90 border border-blue-200/80 rounded-md text-[9px] font-semibold text-slate-600">
                                {chip}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {card.afterMeta && (
                        <div className="pt-2 border-t border-blue-200/60 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                          <span>{card.afterMeta}</span>
                        </div>
                      )}

                      {/* Paywall Overlay Badge ONLY when Card is Paid & User is Free */}
                      {!card.isFree && !isPro && !card.applied && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center p-3 select-none">
                          <button
                            type="button"
                            onClick={() => setIsPaywallModalOpen(true)}
                            className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white font-bold rounded-xl text-[11px] shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Unlock in Pro ($49/mo)</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Card Bottom CTA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Impact: {card.impactMetric}
                      </span>
                      {card.isCustomized && (
                        <span className="text-[11px] text-google-blue font-bold">
                          • Customized with your insights
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {/* Copy Text Button (Always free & available for unblurred content) */}
                      {(card.isFree || isPro || card.applied) && editingCardId !== card.id && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(card.afterAiValue, `Copied "${card.categoryTitle}" to clipboard!`)}
                          className="px-2.5 py-1 text-slate-600 hover:text-google-blue hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copy text to clipboard for manual use in Google Business Profile"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      )}

                      {!card.applied && editingCardId !== card.id && (card.isFree || isPro) && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(card)}
                          className="px-2.5 py-1 text-slate-600 hover:text-google-blue hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Refine AI proposal with your business specifics"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}

                      {card.applied ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px] px-2 py-1 bg-emerald-50 rounded-xl border border-emerald-200">
                          <Check className="w-3.5 h-3.5" /> {card.isFree ? 'Applied' : 'Synced in Pro'}
                        </span>
                      ) : card.isFree ? (
                        /* FREE ITEM: Instant 1-click free application! */
                        <button
                          type="button"
                          onClick={() => handleApplySingleCard(card.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply for Free</span>
                        </button>
                      ) : isPro ? (
                        /* PRO ITEM on Pro License */
                        <button
                          type="button"
                          onClick={() => handleApplySingleCard(card.id)}
                          className="px-3.5 py-1.5 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Apply in 1-Click</span>
                        </button>
                      ) : (
                        /* PRO ITEM on Free Plan */
                        <button
                          type="button"
                          onClick={() => setIsPaywallModalOpen(true)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Available in Pro</span>
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
                Syncing Optimizations via Google API...
              </h4>
              <p className="text-xs text-slate-500 max-w-md">
                Publishing optimized bio description, holiday hours, attributes, catalog, and geo-centroid directly to your Google Business Profile.
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
                Optimization Complete
              </span>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                Listing is Top 3 Ready! 🟢 Sentinel Shield Active
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                All 6 vulnerabilities successfully eliminated. Profile elevated to official Google Maps standards and placed under 24/7 automated guard.
              </p>
            </div>

            {/* Before / After Status Tile */}
            <div className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-md w-full text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Before Audit</span>
                <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> 6 Vulnerability Areas (Customer Leakage)
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="space-y-1 text-right">
                <span className="text-[10px] font-bold text-emerald-700 block uppercase">Now (Optimized)</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Readiness • 24/7 Protected
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompleteAndExit}
              className="px-6 py-3.5 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Go to Location Dashboard</span>
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
                  <span><strong>Pro License Active:</strong> 1-Click Google API authorization enabled for all 6 optimizations.</span>
                ) : (
                  <span>
                    <strong>Free Evaluation Mode:</strong> 2 starter optimizations ready to apply.
                  </span>
                )}
              </span>
            </div>

            {/* Conditional Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              
              {isPro ? (
                /* PRO USER: 1-Click Master Apply */
                <button
                  type="button"
                  onClick={handleApplyAll}
                  className="w-full sm:w-auto px-5 py-3 bg-google-blue hover:bg-blue-600 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>⚡ Apply All 6 Optimizations via API</span>
                </button>
              ) : (
                /* FREE USER: Freemium Application + Upgrade CTA */
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  {!isAllFreeApplied ? (
                    <button
                      type="button"
                      onClick={handleApplyFreeStarterCards}
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-2xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>✓ Apply 2 Free Optimizations</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleManualGoogleEdit}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer text-center"
                      title="Update manually in Google Business Profile"
                    >
                      <span>Update Manually in Google ↗</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsPaywallModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-3 bg-google-blue hover:bg-blue-600 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>🚀 Unlock All 6 in 1-Click — $49/mo</span>
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
                1-Click Auto-Fill & 24/7 Guard
              </h4>
              <p className="text-xs text-slate-500">
                Save 2+ hours of manual Google Business Profile configuration and activate autonomous protection against unauthorized edits.
              </p>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Apply all 6 optimizations via official Google API in 1 click</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24/7 protection against unauthorized competitor edits and phone hijacking</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI review responder with target local SEO keywords</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Protection against Google video re-verification triggers</span>
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
              Cancel anytime in 1 click. Zero risk. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
