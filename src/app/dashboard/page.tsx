'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ShieldCheck, 
  Star, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Building2, 
  Phone, 
  Navigation, 
  MousePointerClick, 
  Check, 
  Edit3, 
  DollarSign, 
  X,
  Sliders,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
  Bot,
  Target,
  Share2,
  Trash2
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { OnboardingInspectionModal } from '@/components/OnboardingInspectionModal';

interface ActionItem {
  id: string;
  type: 'COMPETITOR' | 'REVIEW';
  title: string;
  subtitle: string;
  impact: string;
  reviewAuthor?: string;
  reviewRating?: number;
  aiDraft?: string;
  primaryCtaText: string;
  primaryCtaUrl?: string;
  status: 'PENDING' | 'EXECUTED';
}

interface ActiveBusinessProfile {
  id?: string;
  name: string;
  address: string;
  city?: string;
  category?: string;
  rating?: number;
  reviews_count?: number;
  role?: string;
  verified?: boolean;
}

export default function DashboardCockpitPage() {
  const [activeProfile, setActiveProfile] = useState<ActiveBusinessProfile | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<ActiveBusinessProfile[]>([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  
  // Cockpit Mode: Autonomous vs Manual Approval
  const [copilotMode, setCopilotMode] = useState<'AUTONOMOUS' | 'MANUAL_APPROVAL'>('MANUAL_APPROVAL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Review editing modal state
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [editedDraft, setEditedDraft] = useState('');

  // Urgent Action Hub items
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: 'action-competitor-overtake',
      type: 'COMPETITOR',
      title: 'Competitor updated photo menu and overtook #1 rank at Main Crossroad',
      subtitle: 'Catchment Area: 1.2 km radius around venue • Traffic impact: ~15 calls/wk redirected',
      impact: 'Est. Revenue at risk: $450/week',
      primaryCtaText: 'Deploy Overtake Counter-Strategy',
      primaryCtaUrl: '/geo-grid',
      status: 'PENDING',
    },
    {
      id: 'action-review-omar',
      type: 'REVIEW',
      title: 'New 5-star review received from Omar',
      subtitle: '"Exceptional experience! The staff was super attentive and service was fast. Will definitely come back regularly."',
      impact: 'Review velocity: +4/week • LSI keywords injected into draft response',
      reviewAuthor: 'Omar K.',
      reviewRating: 5,
      aiDraft: 'Thank you so much, Omar! Our team takes immense pride in providing attentive, fast local service. We look forward to welcoming you back regularly!',
      primaryCtaText: 'Approve & Publish',
      status: 'PENDING',
    }
  ]);

  // Protected ROI stats
  const [protectedStats, setProtectedStats] = useState({
    revenueProtected: '$1,800+',
    reviewsReplied: 14,
    photosPublished: 5,
    unauthorizedEditsBlocked: 3
  });

  // Load active profile and settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedActive = localStorage.getItem('gbpilot_active_profile');
      let currentProf: ActiveBusinessProfile | null = null;
      if (storedActive) {
        try {
          currentProf = JSON.parse(storedActive);
          setActiveProfile(currentProf);
        } catch (e) {
          console.error(e);
        }
      }

      const storedAvailable = localStorage.getItem('gbpilot_available_profiles');
      if (storedAvailable) {
        try {
          const list = JSON.parse(storedAvailable);
          if (Array.isArray(list)) setAvailableProfiles(list);
        } catch (e) {
          console.error(e);
        }
      }

      const storedMode = localStorage.getItem('gbpilot_autopilot_mode');
      if (storedMode === 'FULL_AUTOPILOT') {
        setCopilotMode('AUTONOMOUS');
      } else {
        setCopilotMode('MANUAL_APPROVAL');
      }

      // Check if user handled actions previously
      const handled = localStorage.getItem('gbpilot_handled_actions');
      if (handled) {
        try {
          const handledIds: string[] = JSON.parse(handled);
          setActionItems(prev => prev.map(a => handledIds.includes(a.id) ? { ...a, status: 'EXECUTED' } : a));
        } catch (e) {}
      }

      // Check if initial onboarding inspection was completed
      const auditCompleted = localStorage.getItem('gbpilot_initial_audit_completed');
      if (auditCompleted !== 'true') {
        setIsInspectionModalOpen(true);
      }
    }
  }, []);

  const handleToggleMode = (mode: 'AUTONOMOUS' | 'MANUAL_APPROVAL') => {
    setCopilotMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbpilot_autopilot_mode', mode === 'AUTONOMOUS' ? 'FULL_AUTOPILOT' : 'MANUAL_APPROVAL');
      window.dispatchEvent(new CustomEvent('autopilot_mode_changed', { detail: { mode } }));
    }
    showToast(`Switched Cockpit to ${mode === 'AUTONOMOUS' ? 'Autonomous Autopilot' : 'Manual Approval'} mode.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleExecuteAction = (actionId: string) => {
    const item = actionItems.find(a => a.id === actionId);
    if (!item) return;

    setActionItems(prev => prev.map(a => a.id === actionId ? { ...a, status: 'EXECUTED' } : a));

    if (typeof window !== 'undefined') {
      const handled = localStorage.getItem('gbpilot_handled_actions');
      const list = handled ? JSON.parse(handled) : [];
      if (!list.includes(actionId)) {
        list.push(actionId);
        localStorage.setItem('gbpilot_handled_actions', JSON.stringify(list));
      }
    }

    if (item.type === 'COMPETITOR') {
      setProtectedStats(prev => ({
        ...prev,
        photosPublished: prev.photosPublished + 1,
        unauthorizedEditsBlocked: prev.unauthorizedEditsBlocked + 1
      }));
      showToast('⚡ Overtake Strategy deployed: Keyword-targeted local post scheduled & review pacing adjusted.');
    } else {
      setProtectedStats(prev => ({
        ...prev,
        reviewsReplied: prev.reviewsReplied + 1
      }));
      showToast('💬 Review response approved & published with local SEO keywords.');
    }
  };

  const handleOpenEditDraft = (action: ActionItem) => {
    setEditingActionId(action.id);
    setEditedDraft(action.aiDraft || '');
  };

  const handleSaveEditedDraft = () => {
    if (!editingActionId) return;
    setActionItems(prev => prev.map(a => {
      if (a.id === editingActionId) {
        return { ...a, aiDraft: editedDraft };
      }
      return a;
    }));
    setEditingActionId(null);
    showToast('AI draft response updated.');
  };

  const handleSwitchProfile = (p: ActiveBusinessProfile) => {
    setActiveProfile(p);
    setIsLocationDropdownOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbpilot_active_profile', JSON.stringify(p));
      window.dispatchEvent(new CustomEvent('active_profile_updated'));
      window.location.reload();
    }
  };

  const pendingActions = actionItems.filter(a => a.status === 'PENDING');
  const isAllClear = pendingActions.length === 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar currentProfile={activeProfile || undefined} />

      {/* Toast Notification Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs border border-slate-700 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">

        {/* ======================================================== */}
        {/* SECTION A: HEADER & PROFILE BAR                          */}
        {/* ======================================================== */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Business Switcher & Identity */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-11 h-11 rounded-2xl bg-google-blue/10 border border-google-blue/20 flex items-center justify-center text-google-blue font-black shrink-0">
              <Building2 className="w-6 h-6" />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-2 text-left group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-google-blue transition-colors max-w-[200px] sm:max-w-xs truncate">
                      {activeProfile?.name || 'Connect Business Profile'}
                    </h1>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-google-blue transition-colors shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 max-w-[240px] sm:max-w-sm truncate">
                    {activeProfile?.address || activeProfile?.city || 'No verified address set'}
                  </p>
                </div>
              </button>

              {/* Location Switcher Dropdown */}
              {isLocationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 p-2 shadow-xl z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                    <span>Your Businesses ({availableProfiles.length})</span>
                    <span className="text-emerald-600 font-semibold">Active Locations</span>
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 my-1">
                    {availableProfiles.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSwitchProfile(p)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                          activeProfile?.name === p.name ? 'bg-blue-50 text-google-blue font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-semibold truncate">{p.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{p.address || p.city}</div>
                        </div>
                        {activeProfile?.name === p.name && (
                          <Check className="w-4 h-4 text-google-blue shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <Link
                    href="/onboarding"
                    className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-google-blue hover:bg-blue-50 font-bold border-t border-slate-100 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>+ Connect New Location</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Status Bar: Guard Status Pill + Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Live Status Pill: 🟢 AI Shield Active & Guarding */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
              </span>
              <span>AI Shield Active &amp; Guarding</span>
            </div>

            {/* Mode Toggle: Autonomous vs Manual Approval */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleToggleMode('AUTONOMOUS')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  copilotMode === 'AUTONOMOUS'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="AI executes verified growth actions automatically"
              >
                ⚡ Autonomous
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode('MANUAL_APPROVAL')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  copilotMode === 'MANUAL_APPROVAL'
                    ? 'bg-white text-google-blue shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Review each action in 1-click before publishing"
              >
                ✍️ Manual Approval
              </button>
            </div>

          </div>

        </div>

        {/* If no profile is connected, show Graceful Onboarding Hero Card */}
        {(!activeProfile || !activeProfile.name || activeProfile.name === 'No Business Connected') ? (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-700/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <ShieldCheck className="w-80 h-80" />
            </div>

            <div className="max-w-2xl space-y-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Google Business Pilot</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Connect your Google Business Profile in 1-Click to unlock AI Protection and Top 3 Maps ranking.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                GB Pilot continuously intercepts competitor tampering, drafts keyword-optimized review responses, and analyzes local search heatmaps to overtake neighborhood rivals.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/onboarding"
                  className="px-6 py-3.5 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 text-sm flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Connect Google Profile Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/geo-grid"
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl text-sm border border-white/10 transition-colors"
                >
                  Explore Geo-Grid Radar Demo
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ======================================================== */}
            {/* SECTION B: HERO VALUE CARD (PROTECTED ROI SUMMARY)        */}
            {/* ======================================================== */}
            <div className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                
                <div className="space-y-1.5 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      7-Day Autonomous Protection Value
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Value Generated by AI Co-Pilot
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Real-time financial impact across customer calls, competitor defense, and review engagement for <strong>{activeProfile.name}</strong>.
                  </p>
                </div>

                {/* 3 Core Value Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
                  
                  {/* Pillar 1: Projected Revenue Protected */}
                  <div className="bg-slate-800/80 border border-slate-700/70 p-4 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Protected Revenue</span>
                    </div>
                    <div className="text-2xl font-black text-white">
                      {protectedStats.revenueProtected}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Competitor hour changes &amp; phone tampering blocked
                    </p>
                  </div>

                  {/* Pillar 2: Reviews Replied */}
                  <div className="bg-slate-800/80 border border-slate-700/70 p-4 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                      <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
                      <span>Reviews Replied</span>
                    </div>
                    <div className="text-2xl font-black text-white">
                      {protectedStats.reviewsReplied}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Replied with local SEO keywords in &lt;15 mins
                    </p>
                  </div>

                  {/* Pillar 3: Geotagged Photos */}
                  <div className="bg-slate-800/80 border border-slate-700/70 p-4 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Geotagged Posts</span>
                    </div>
                    <div className="text-2xl font-black text-white">
                      {protectedStats.photosPublished}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Local Pack visibility signals syndicated to Google
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION C: URGENT ACTION HUB (ACTION-ORIENTED FEED)      */}
            {/* ======================================================== */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Urgent Action Hub</span>
                    {pendingActions.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                        {pendingActions.length} Pending Approval
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pre-calculated strategic moves requiring 1-click owner confirmation to secure rankings.
                  </p>
                </div>

                <div className="text-xs text-slate-400 font-medium">
                  {copilotMode === 'AUTONOMOUS' ? 'Auto-execution active' : 'Owner approval mode'}
                </div>
              </div>

              {/* Action Stack */}
              {!isAllClear ? (
                <div className="space-y-3">
                  {actionItems.filter(a => a.status === 'PENDING').map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2">
                          {item.type === 'COMPETITOR' ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-800 uppercase">
                              Competitor Shift
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
                              5★ Customer Review
                            </span>
                          )}
                          <span className="text-xs font-semibold text-slate-400">
                            {item.impact}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {item.subtitle}
                          </p>
                        </div>

                        {/* Review Draft Preview */}
                        {item.aiDraft && (
                          <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                            <span className="text-[10px] font-bold text-google-blue uppercase tracking-wider block">
                              AI Suggested Response Preview:
                            </span>
                            <p className="text-slate-800 italic leading-relaxed">
                              "{item.aiDraft}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 1-Click Action Buttons */}
                      <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0 flex-wrap">
                        {item.aiDraft && (
                          <button
                            type="button"
                            onClick={() => handleOpenEditDraft(item)}
                            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleExecuteAction(item.id)}
                          className="flex-1 md:flex-none px-4 py-2 bg-google-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{item.primaryCtaText}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Clean Green State */
                <div className="p-6 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs animate-in fade-in">
                  <div className="flex items-center gap-3.5 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2 justify-center sm:justify-start">
                        <span>All systems optimal. Your AI Co-Pilot is actively monitoring.</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        No competitor threats or pending review replies detected. Next automated security sweep in 28 mins.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/geo-grid"
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold rounded-xl text-xs transition-colors shrink-0 shadow-2xs"
                  >
                    View Radar Map →
                  </Link>
                </div>
              )}
            </div>

            {/* ======================================================== */}
            {/* SECTION D: ESSENTIAL HEALTH METRICS (TOP 3 CLEAN CARDS)  */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Metric 1: Local Rank Position */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Local Rank Position
                  </span>
                  <div className="p-2 rounded-xl bg-blue-50 text-google-blue">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      #2
                    </span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Top 3 Pack
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Average rank across 0.5 – 1.5 km neighborhood catchment radius for primary search keywords.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Target Area:</span>
                  <Link href="/geo-grid" className="font-bold text-google-blue hover:underline flex items-center gap-1">
                    <span>Inspect Geo-Grid</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Metric 2: Customer Actions (30d) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Customer Actions (30d)
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <MousePointerClick className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      495
                    </span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +18.4%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Includes direct phone calls, route driving directions, and website bookings from Google Maps.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div>
                    <span className="block font-bold text-slate-800">64</span>
                    <span className="text-slate-400 text-[10px]">Calls</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">142</span>
                    <span className="text-slate-400 text-[10px]">Routes</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">289</span>
                    <span className="text-slate-400 text-[10px]">Clicks</span>
                  </div>
                </div>
              </div>

              {/* Metric 3: Reputation Score */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Reputation Score
                  </span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      {activeProfile.rating ? activeProfile.rating.toFixed(1) : '4.9'} ★
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      0 Toxic Reviews
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Clean profile health score. 100% of reviews addressed with Google Maps keyword indexing.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Shield Defense:</span>
                  <Link href="/reviews-posts" className="font-bold text-google-blue hover:underline flex items-center gap-1">
                    <span>Manage Reviews</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>

            {/* ======================================================== */}
            {/* ONBOARDING INSPECTION & AUDIT BANNER (PLG PERSISTENCE)   */}
            {/* ======================================================== */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-google-blue/20 text-blue-400 border border-blue-400/30 flex items-center justify-center font-black shrink-0">
                  <Zap className="w-6 h-6 fill-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                      AI Profile Inspection &amp; Onboarding Audit
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      PLG Engine
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Continuous 5-gap inspection: SEO description, holiday schedules, customer attributes, menu catalog, and EXIF coordinates.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsInspectionModalOpen(true)}
                className="px-4 py-2.5 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ Re-run Full Profile Inspection</span>
              </button>
            </div>

            {/* Quick Hub Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              <Link
                href="/geo-grid"
                className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all flex items-center justify-between group shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-google-blue flex items-center justify-center font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs group-hover:text-google-blue transition-colors">
                      Radar &amp; Heatmap
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Spatial ranks &amp; competitor tactics
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-google-blue transition-colors" />
              </Link>

              <Link
                href="/reviews-posts"
                className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all flex items-center justify-between group shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs group-hover:text-emerald-600 transition-colors">
                      Shield &amp; Reputation
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Review responder &amp; tamper lock
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
              </Link>

              <Link
                href="/copilot"
                className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all flex items-center justify-between group shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                      Copilot AI Studio
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Post planner &amp; 24/7 AI chat
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </Link>

            </div>
          </>
        )}

      </main>

      {/* Edit Review Draft Modal */}
      {editingActionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Edit AI Review Response
              </h3>
              <button onClick={() => setEditingActionId(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">
                Response Draft (Injected with Local SEO Keywords):
              </label>
              <textarea
                rows={4}
                value={editedDraft}
                onChange={(e) => setEditedDraft(e.target.value)}
                className="material-input w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-google-blue focus:border-google-blue"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingActionId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditedDraft}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-google-blue hover:bg-blue-600 shadow-sm"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Inspection Flow Modal (PLG Framework) */}
      <OnboardingInspectionModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        businessName={activeProfile?.name || 'Artisan Specialty Cafe & Roastery'}
        businessAddress={activeProfile?.address || '102 Marina Promenade, Dubai, UAE'}
        onComplete={() => {
          setIsInspectionModalOpen(false);
          showToast('Profile optimization applied successfully! AI Sentinel Shield Active.');
        }}
      />

      <Footer />
    </div>
  );
}
