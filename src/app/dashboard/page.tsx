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
  Camera,
  Lock,
  Activity,
  Shield
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
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);

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
            {/* BLOCK 1: DIGITAL TWIN OF THE VENUE (GOOGLE MAPS LIVE)   */}
            {/* ======================================================== */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                {/* Left Column: Real Knowledge Panel Card */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full lg:w-auto">
                  {/* Avatar / Cover Photo with Google Verified Badge */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xs shrink-0 bg-slate-100 group">
                    <img
                      src={venuePhotoUrl}
                      alt={activeProfile?.name || 'Venue Photo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div 
                      className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white shadow-xs flex items-center justify-center" 
                      title="Google Verified Business Profile"
                    >
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    </div>
                  </div>

                  {/* Identity & Knowledge Panel Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Business Name with Location Switcher Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                        className="flex items-center gap-2 text-left group cursor-pointer max-w-full"
                      >
                        <h1 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-google-blue transition-colors truncate max-w-[260px] sm:max-w-md">
                          {activeProfile?.name || 'Connect Business Profile'}
                        </h1>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-google-blue transition-colors shrink-0" />
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-google-blue border border-blue-200">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          Verified GBP
                        </span>
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

                    {/* Category, Stars & Live Open Status */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                        {activeProfile?.category || 'Specialty Coffee Shop & Roastery'}
                      </span>
                      
                      <div className="flex items-center gap-1.5 font-bold">
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-slate-900 font-extrabold">
                          {activeProfile?.rating ? activeProfile.rating.toFixed(1) : '4.9'} ★
                        </span>
                        <span className="text-slate-500 font-normal">
                          ({activeProfile?.reviews_count || 184} reviews)
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Open Now • Closes at 22:00
                      </span>
                    </div>

                    {/* Address, Phone & Direct Google Maps Live Link */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{activeProfile?.address || '102 Marina Promenade, Sector B, Downtown'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>+971 4 399 1234</span>
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          (activeProfile?.name || '') + ' ' + (activeProfile?.address || '')
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-google-blue hover:text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Live on Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                  </div>
                </div>

                {/* Right Column: 24/7 Guard Status Pill + Autopilot Mode Toggle */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  
                  {/* 24/7 Profile Guard Button (Triggers Digital Insurance & Security Drawer) */}
                  <button
                    type="button"
                    onClick={() => setIsInsuranceModalOpen(true)}
                    className="group px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-2xs flex items-center gap-2.5 transition-all cursor-pointer"
                    title="Click to view 24/7 Sentinel Protection, Golden Snapshot & Loss Prevention Valuation"
                  >
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
                    </span>
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>24/7 Profile Guard: 100% Locked</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold group-hover:underline">
                        View Insurance &amp; Risk Valuation →
                      </div>
                    </div>
                  </button>

                  {/* Mode Toggle: Autonomous vs Manual Approval */}
                  <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => handleToggleMode('AUTONOMOUS')}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
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
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
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
            </div>

            {/* ======================================================== */}
            {/* BLOCK 2: OPERATIONAL MONITOR & ACTION HUB               */}
            {/* ======================================================== */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
              
              {/* Traffic Light Status Bar (Светофор статусов) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 🟢 Protection Active */}
                <button
                  type="button"
                  onClick={() => setIsInsuranceModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-left hover:bg-emerald-100/60 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                        Protection Active
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      100% Stability
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-semibold mt-1">
                    0 breaches in {protectedStats.safeUptimeDays} days
                  </p>
                  <p className="text-[11px] text-emerald-700/80 mt-0.5 leading-snug">
                    Golden Snapshot locked 24/7. Zero unauthorized tampering.
                  </p>
                </button>

                {/* 🟡 Requires Attention */}
                <div className={`p-3.5 rounded-2xl border text-left transition-colors ${
                  pendingActions.filter(a => a.type === 'REVIEW').length > 0 
                    ? 'bg-amber-50/80 border-amber-200/90 text-amber-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        pendingActions.filter(a => a.type === 'REVIEW').length > 0 ? 'bg-amber-500 animate-ping' : 'bg-slate-400'
                      }`} />
                      <span className="text-xs font-black uppercase tracking-wide">
                        Requires Attention
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-amber-200 text-amber-800">
                      {pendingActions.filter(a => a.type === 'REVIEW').length} Pending
                    </span>
                  </div>
                  <p className="text-xs font-semibold mt-1">
                    {pendingActions.filter(a => a.type === 'REVIEW').length > 0 
                      ? '1 review reply from Omar awaiting approval'
                      : 'All reviews responded with local keywords'}
                  </p>
                  <p className="text-[11px] opacity-80 mt-0.5 leading-snug">
                    {copilotMode === 'AUTONOMOUS' ? 'Auto-publishing enabled in 3 hrs' : 'Requires 1-click confirmation'}
                  </p>
                </div>

                {/* 🔴 Competitor Alert */}
                <div className={`p-3.5 rounded-2xl border text-left transition-colors ${
                  pendingActions.filter(a => a.type === 'COMPETITOR').length > 0 
                    ? 'bg-rose-50/80 border-rose-200/90 text-rose-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        pendingActions.filter(a => a.type === 'COMPETITOR').length > 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'
                      }`} />
                      <span className="text-xs font-black uppercase tracking-wide">
                        Competitor Alert
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-rose-200 text-rose-800">
                      {pendingActions.filter(a => a.type === 'COMPETITOR').length} Shift
                    </span>
                  </div>
                  <p className="text-xs font-semibold mt-1">
                    {pendingActions.filter(a => a.type === 'COMPETITOR').length > 0 
                      ? 'Competitor shift detected in Sector B'
                      : 'No competitor rank shifts in 1.5 km'}
                  </p>
                  <p className="text-[11px] opacity-80 mt-0.5 leading-snug">
                    Catchment area: 1.2 km radius around venue
                  </p>
                </div>
              </div>

              {/* 1-Click Action Feed Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 pt-1">
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
                  {pendingActions.map((item) => (
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
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
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
            {/* BLOCK 3: PULSE OF GROWTH & LOCAL RANKS (3 VITAL METRICS) */}
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

              {/* Metric 3: Profile Health Score */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Profile Health Score
                    </span>
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400" />
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900">
                        88 / 100
                      </span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {activeProfile.rating ? activeProfile.rating.toFixed(1) : '4.9'} ★ ({activeProfile.reviews_count || 184})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      0 toxic reviews, 100% keyword response coverage. 2 minor gap opportunities detected.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Audit Status:</span>
                  <button
                    type="button"
                    onClick={() => setIsInspectionModalOpen(true)}
                    className="font-bold text-google-blue hover:text-blue-700 flex items-center gap-1.5 cursor-pointer bg-blue-50/80 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-google-blue" />
                    <span>⚡ Re-run Inspection / View Gaps</span>
                  </button>
                </div>
              </div>

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
      
      {/* Digital Insurance & Security Drawer / Modal */}
      {isInsuranceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/50">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg text-white">
                      Autonomous Profile Uptime &amp; Digital Insurance
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Cloudflare Grade
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Continuous 24/7 profile integrity and loss mitigation for <strong>{activeProfile?.name}</strong>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsInsuranceModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Simulator Switcher */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div>
                  <span className="font-bold text-slate-200 block">Scenario Simulator</span>
                  <span className="text-[11px] text-slate-400">Toggle to view normal vs intercepted threat modes</span>
                </div>
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
                  <button
                    onClick={() => setSentinelState('QUIET_GUARD')}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      sentinelState === 'QUIET_GUARD'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Quiet Guard</span>
                  </button>
                  <button
                    onClick={() => setSentinelState('THREAT_INTERCEPTED')}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      sentinelState === 'THREAT_INTERCEPTED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>Threat Blocked</span>
                  </button>
                </div>
              </div>

              {/* 3 Core Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Pillar 1: Safe Profile Uptime */}
                <div className="bg-slate-800/60 border border-slate-700/80 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Safe Uptime
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      100% Locked
                    </span>
                  </div>
                  <div className="text-xl font-black text-white">
                    {protectedStats.safeUptimeDays} Days
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Golden Snapshot verified. Zero unauthorized edits.
                  </p>
                </div>

                {/* Pillar 2: Daily Risk Insurance */}
                <div className="bg-slate-800/60 border border-slate-700/80 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-blue-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      Daily Protection
                    </span>
                    <span className="text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                      Micro-Cost
                    </span>
                  </div>
                  <div className="text-xl font-black text-white">
                    ~{protectedStats.dailyRiskCost} <span className="text-xs font-normal text-slate-400">/ day</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Equivalent of $9.99/mo plan. Cheaper than 1 coffee cup.
                  </p>
                </div>

                {/* Pillar 3: Routine Hours Saved */}
                <div className="bg-slate-800/60 border border-slate-700/80 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-purple-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Labor Saved
                    </span>
                    <span className="text-[10px] bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                      Labor ROI
                    </span>
                  </div>
                  <div className="text-xl font-black text-white">
                    {protectedStats.hoursSaved} Hours
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Automated {protectedStats.reviewsReplied} review replies &amp; {protectedStats.photosPublished} photo posts.
                  </p>
                </div>
              </div>

              {/* Dynamic Scenario Callout */}
              {sentinelState === 'QUIET_GUARD' ? (
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Quiet Guard Mode Active: Baseline Golden Snapshot Locked</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Operating hours, phone numbers, and primary categories are locked against competitor crowd-sourced suggestions. Risk mitigation works in the background like Cloudflare DNS: 100% quiet protection without spamming false alarms.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-950/50 border border-amber-500/40 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Competitor Edit Intercepted &amp; Reverted via Google API</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Reverted in 3m 12s
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    A competitor attempted to alter your Friday operating hours to <strong className="text-rose-400">"Closed"</strong>. GB Pilot detected and blocked the change before Google published it.
                  </p>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-mono">
                    <strong>Loss Prevention Formula:</strong> (Avg Ticket $32 × 15 Peak Foot-Traffic Diners) = <strong>~$${protectedStats.avertedDamage} Direct Revenue Saved</strong>
                  </div>
                </div>
              )}

              {/* Recent Audit & Defense Log Feed */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Live Sentinel Integrity Verifications:
                </span>
                <div className="space-y-1.5">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-300 font-medium">Hourly Baseline Snapshot verified via Google API</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">12 mins ago</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span className="text-slate-300 font-medium">EXIF Geotags &amp; Category integrity checksum verified</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">2 hours ago</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between gap-3">
              <Link
                href="/reviews-posts"
                onClick={() => setIsInsuranceModalOpen(false)}
                className="text-xs font-bold text-google-blue hover:underline flex items-center gap-1.5"
              >
                <span>View Full Tamper Defense Logs in Shield</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setIsInsuranceModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

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
