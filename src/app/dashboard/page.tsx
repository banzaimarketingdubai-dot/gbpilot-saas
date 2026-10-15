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
  ChevronUp,
  ExternalLink,
  ShieldAlert,
  Bot,
  Target,
  Share2,
  Trash2,
  Camera
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { OnboardingInspectionModal } from '@/components/OnboardingInspectionModal';

const DEFAULT_VENUE_PHOTO = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80';

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
  cover_url?: string;
  photo_url?: string;
  snapshot_url?: string;
}

export default function DashboardCockpitPage() {
  const [activeProfile, setActiveProfile] = useState<ActiveBusinessProfile | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<ActiveBusinessProfile[]>([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  
  // Primary Venue Photo URL (from Profile or default fallback)
  const venuePhotoUrl = activeProfile?.cover_url || activeProfile?.photo_url || activeProfile?.snapshot_url || DEFAULT_VENUE_PHOTO;

  // Collapsible Digital Insurance & Safe Uptime Hub state
  const [isValueCardCollapsed, setIsValueCardCollapsed] = useState(false);
  const [sentinelState, setSentinelState] = useState<'QUIET_GUARD' | 'THREAT_INTERCEPTED'>('QUIET_GUARD');

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

  // Protected Digital Insurance & Safe Uptime Stats
  const [protectedStats, setProtectedStats] = useState({
    safeUptimeDays: 45,
    dailyRiskCost: '$0.33',
    hoursSaved: 14.5,
    reviewsReplied: 18,
    photosPublished: 4,
    unauthorizedEditsBlocked: 3,
    avertedDamage: 480
  });

  // Load active profile and settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedActive = localStorage.getItem('gbpilot_active_profile');
      let currentProf: ActiveBusinessProfile | null = null;
      if (storedActive) {
        try {
          currentProf = JSON.parse(storedActive);
          if (currentProf && currentProf.name) {
            if (!currentProf.cover_url && !currentProf.photo_url) {
              currentProf.cover_url = DEFAULT_VENUE_PHOTO;
            }
            setActiveProfile(currentProf);
          }
        } catch (e) {
          console.error(e);
        }
      }

      const storedAvailable = localStorage.getItem('gbpilot_available_profiles');
      if (storedAvailable) {
        try {
          const list = JSON.parse(storedAvailable);
          if (Array.isArray(list) && list.length > 0) {
            const enriched = list.map((p: ActiveBusinessProfile) => ({
              ...p,
              cover_url: p.cover_url || p.photo_url || p.snapshot_url || DEFAULT_VENUE_PHOTO
            }));
            setAvailableProfiles(enriched);
            if (!currentProf) {
              setActiveProfile(enriched[0]);
              currentProf = enriched[0];
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      // If still no profile in demo/fresh state, initialize default profile with photo
      if (!currentProf) {
        const defaultDemoProfile: ActiveBusinessProfile = {
          id: 'demo_artisan_cafe',
          name: 'Artisan Specialty Cafe & Roastery',
          address: '102 Marina Promenade, Sector B',
          city: 'Downtown',
          category: 'Specialty Coffee Shop & Roastery',
          rating: 4.8,
          reviews_count: 342,
          role: 'Owner',
          verified: true,
          cover_url: DEFAULT_VENUE_PHOTO
        };
        setActiveProfile(defaultDemoProfile);
        setAvailableProfiles([defaultDemoProfile]);
        localStorage.setItem('gbpilot_active_profile', JSON.stringify(defaultDemoProfile));
        localStorage.setItem('gbpilot_available_profiles', JSON.stringify([defaultDemoProfile]));
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

      // Launch inspection modal ONLY if explicitly triggered by newly added location onboarding
      const newLocationOnboardingTriggered = localStorage.getItem('gbpilot_trigger_inspection_for_new_location');
      if (newLocationOnboardingTriggered === 'true') {
        setIsInspectionModalOpen(true);
        // Immediately clear the one-time trigger so refreshing the page will NEVER reopen it
        localStorage.removeItem('gbpilot_trigger_inspection_for_new_location');
      }

      // Check if digital insurance card was previously collapsed by user
      const storedCollapse = localStorage.getItem('gbpilot_value_card_collapsed');
      if (storedCollapse !== null) {
        setIsValueCardCollapsed(storedCollapse === 'true');
      }
    }
  }, []);

  const handleToggleValueCardCollapse = () => {
    setIsValueCardCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gbpilot_value_card_collapsed', String(next));
      }
      return next;
    });
  };

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
        unauthorizedEditsBlocked: prev.unauthorizedEditsBlocked + 1,
        hoursSaved: Number((prev.hoursSaved + 1.5).toFixed(1))
      }));
      showToast('⚡ Overtake Strategy deployed: Keyword-targeted local post scheduled & review pacing adjusted.');
    } else {
      setProtectedStats(prev => ({
        ...prev,
        reviewsReplied: prev.reviewsReplied + 1,
        hoursSaved: Number((prev.hoursSaved + 0.3).toFixed(1))
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
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs shrink-0 bg-slate-100 group">
              <img
                src={venuePhotoUrl}
                alt={activeProfile?.name || 'Venue Photo'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5 border-2 border-white shadow-xs" title="Google Verified Business">
                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
              </div>
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
                  <p className="text-xs text-slate-500 max-w-[240px] sm:max-w-sm truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{activeProfile?.address || activeProfile?.city || 'No verified address set'}</span>
                  </p>
                </div>
              </button>

              {/* Location Switcher Dropdown */}
              {isLocationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 p-2 shadow-xl z-50 text-xs">
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
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                            <img
                              src={p.cover_url || p.photo_url || p.snapshot_url || DEFAULT_VENUE_PHOTO}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="truncate">
                            <div className="font-semibold truncate">{p.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{p.address || p.city}</div>
                          </div>
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
            {/* SECTION B: DIGITAL INSURANCE & SAFE UPTIME HUB (COLLAPSIBLE) */}
            {/* ======================================================== */}
            {isValueCardCollapsed ? (
              /* Collapsed Mini Pill Bar with Ambient Venue Photo Slice */
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-800 text-white transition-all group">
                {/* Ambient Background photo slice */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <img
                    src={venuePhotoUrl}
                    alt=""
                    className="w-full h-full object-cover opacity-20 filter brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#070D18] via-[#0A1120]/95 to-[#0F172A]/90" />
                </div>

                <div className="relative z-10 p-3 sm:px-5 sm:py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden text-xs sm:text-sm">
                    <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-xs">
                      <img src={venuePhotoUrl} alt={activeProfile.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-300 font-medium">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        100% Safe Uptime
                      </span>
                      <span className="text-slate-600 hidden sm:inline">•</span>
                      <span className="text-slate-300">
                        <strong className="text-emerald-400 font-bold">{protectedStats.safeUptimeDays} Days</strong> Continuous Guard
                      </span>
                      <span className="text-slate-600 hidden md:inline">•</span>
                      <span className="text-slate-400 hidden md:inline">
                        Risk Coverage: <strong className="text-slate-200 font-semibold">{protectedStats.dailyRiskCost}/day</strong>
                      </span>
                      <span className="text-slate-600 hidden lg:inline">•</span>
                      <span className="text-slate-400 hidden lg:inline">
                        Routine Saved: <strong className="text-purple-300 font-semibold">{protectedStats.hoursSaved} hrs</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleValueCardCollapse}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer backdrop-blur-xs"
                    title="Expand Digital Insurance & Uptime Hub"
                  >
                    <span>Expand Details</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            ) : (
              /* Expanded Full Authority Card with Cinematic Venue Photo Background */
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white group">
                {/* Background Venue Cover Photo with Cinematic Dark Blur Gradients */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <img
                    src={venuePhotoUrl}
                    alt={activeProfile?.name || 'Venue Background'}
                    className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-700 opacity-25 filter brightness-75 contrast-125 saturate-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#070D18]/95 via-[#0A1120]/90 to-[#0F172A]/85 backdrop-blur-[1px]" />
                  <div className="absolute inset-0 bg-radial-at-t from-transparent via-[#070D18]/50 to-[#070D18]" />
                </div>

                <div className="relative z-10 p-6 sm:p-7 space-y-6">
                  {/* Header row with badges, venue asset badge, mode simulator toggle, and Collapse button */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Digital Insurance &amp; Safe Uptime Standard
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                          Cloudflare Grade for GBP
                        </span>
                        <span className="text-[11px] font-semibold text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
                          <Camera className="w-3 h-3 text-blue-400" />
                          <span>Venue Photo Synced</span>
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                        <span>Autonomous Profile Uptime &amp; Risk Valuation</span>
                      </h2>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                        Continuous risk mitigation and verified profile integrity for <strong>{activeProfile.name}</strong>. Zero tampering, hours locked, and routine tasks automated.
                      </p>
                    </div>

                    {/* Right Controls: Venue Asset Pill + Scenario Switcher + Collapse */}
                    <div className="flex items-center gap-3 self-start md:self-center shrink-0 flex-wrap sm:flex-nowrap">
                      {/* Venue Photo Badge */}
                      <div className="hidden xl:flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-xs">
                        <img 
                          src={venuePhotoUrl} 
                          alt={activeProfile.name} 
                          className="w-8 h-8 rounded-lg object-cover border border-slate-600" 
                        />
                        <div className="text-left text-xs">
                          <div className="font-bold text-white truncate max-w-[120px]">{activeProfile.name}</div>
                          <div className="text-[10px] text-emerald-400 font-medium">Primary Asset</div>
                        </div>
                      </div>

                      {/* Simulation Toggle */}
                      <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 text-xs font-semibold backdrop-blur-xs">
                        <button
                          onClick={() => setSentinelState('QUIET_GUARD')}
                          className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                            sentinelState === 'QUIET_GUARD'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                          title="Simulate normal operation where profile integrity is 100% stable without alerts"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>Quiet Guard</span>
                        </button>
                        <button
                          onClick={() => setSentinelState('THREAT_INTERCEPTED')}
                          className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                            sentinelState === 'THREAT_INTERCEPTED'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                          title="Simulate when an unauthorized competitor edit is intercepted and averted"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                          <span>Threat Blocked</span>
                        </button>
                      </div>

                      {/* Collapse button */}
                      <button
                        onClick={handleToggleValueCardCollapse}
                        className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
                        title="Collapse Digital Insurance & Uptime Hub"
                      >
                        <span className="hidden sm:inline">Collapse</span>
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* 3 Core Value Pillars with Glassmorphism */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Pillar 1: Safe Profile Uptime */}
                    <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800/90 p-4 rounded-2xl space-y-1.5 relative group/card hover:border-emerald-500/40 transition-colors shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>Safe Profile Uptime</span>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          100% Stability
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {protectedStats.safeUptimeDays} Days
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Zero unauthorized data breaches or profile hijacks. Operating hours, phone &amp; primary categories verified 24/7.
                      </p>
                    </div>

                    {/* Pillar 2: Daily Risk Insurance */}
                    <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800/90 p-4 rounded-2xl space-y-1.5 relative group/card hover:border-blue-500/40 transition-colors shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                          <DollarSign className="w-4 h-4 text-blue-400" />
                          <span>Daily Protection Cost</span>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                          Micro-Insurance
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        ~{protectedStats.dailyRiskCost} <span className="text-sm font-semibold text-slate-400">/ day</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Cost equivalent of $9.99/mo subscription. Cheaper than a cup of coffee for comprehensive catastrophic risk defense.
                      </p>
                    </div>

                    {/* Pillar 3: Routine Hours Saved */}
                    <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800/90 p-4 rounded-2xl space-y-1.5 relative group/card hover:border-purple-500/40 transition-colors shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                          <Clock className="w-4 h-4 text-purple-400" />
                          <span>Routine Time Saved</span>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20">
                          Labor ROI
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {protectedStats.hoursSaved} Hours
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Automated {protectedStats.reviewsReplied} SEO review replies, {protectedStats.photosPublished} geotagged posts &amp; keyword pacing without manual owner labor.
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Scenario Callout: Quiet Guard vs Threat Intercepted */}
                  {sentinelState === 'QUIET_GUARD' ? (
                    <div className="bg-emerald-950/40 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                            <span>Quiet Guard Mode Active: Uninterrupted Profile Integrity</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            All Google Business attributes are in continuous compliance. No competitor changes detected over the past 45 days. Your risk protection functions identically to Cloudflare: zero disruptions while you run your daily business.
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-left sm:text-right">
                        <span className="text-[11px] font-semibold text-slate-400 block">Risk Evaluation</span>
                        <span className="text-xs font-bold text-emerald-400">0 Breaches • 100% Stable</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-950/50 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                            <span>Tampering Incident Intercepted &amp; Reverted via Google API</span>
                            <span className="px-1.5 py-0.5 text-[10px] font-black uppercase rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              High Severity Prevented
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            A competitor suggested an unauthorized edit altering your Friday operating hours to <span className="text-rose-400 font-bold">&quot;Closed&quot;</span>. GB Pilot detected and blocked the change within 3 minutes before Google published it.
                          </p>
                          <div className="text-[11px] text-amber-200/90 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 inline-block font-mono">
                            <strong>Loss Prevention Formula:</strong> (Avg Ticket $32 × 15 Peak Foot-Traffic Diners) = <strong>~${protectedStats.avertedDamage} Direct Revenue Saved</strong>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 text-left sm:text-right bg-slate-900/90 p-3 rounded-xl border border-slate-700/80 backdrop-blur-xs">
                        <span className="text-[10px] font-semibold text-slate-400 block uppercase">Prevented Incident Damage</span>
                        <span className="text-xl font-black text-amber-400">~${protectedStats.avertedDamage}</span>
                        <span className="text-[10px] text-emerald-400 block font-medium">Reverted in 3m 12s</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
