'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Copy, 
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
  Shield,
  Unlink,
  LogOut
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { OnboardingInspectionModal } from '@/components/OnboardingInspectionModal';
import { getSubscription, setSubscriptionPlan, activateTrial, SubscriptionState } from '@/lib/subscription';

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
  phone?: string;
  rating?: number;
  reviews_count?: number;
  role?: string;
  verified?: boolean;
  cover_url?: string;
  photo_url?: string;
  snapshot_url?: string;
}

const generateActionItems = (_profile: ActiveBusinessProfile | null): ActionItem[] => {
  // Only return real action items if real recommendations or unreplied customer reviews exist
  return [];
};

export default function DashboardCockpitPage() {
  const router = useRouter();
  const [isLocationQuotaModalOpen, setIsLocationQuotaModalOpen] = useState(false);
  const [isProTrialModalOpen, setIsProTrialModalOpen] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionState>({
    planId: 'FREE_SCOUT',
    plan: { id: 'FREE_SCOUT', name: 'Free Scout', priceAed: 0, priceUsd: 0, locationLimit: 1, isPro: false, features: [] },
    isPro: false,
    isTrial: false,
    trialDaysLeft: 0,
    locationLimit: 1
  });
  const [dubaiSmartMode, setDubaiSmartMode] = useState<'STANDARD' | 'PEAK_TRAFFIC' | 'RAMADAN' | 'SUMMER'>('STANDARD');
  const [pendingActionToExecute, setPendingActionToExecute] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<ActiveBusinessProfile | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<ActiveBusinessProfile[]>([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [profileToUnlinkConfirm, setProfileToUnlinkConfirm] = useState<ActiveBusinessProfile | null>(null);
  
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
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  // Protected Digital Insurance & Safe Uptime Stats
  const [protectedStats, setProtectedStats] = useState({
    safeUptimeDays: 0,
    dailyRiskCost: '—',
    hoursSaved: 0,
    reviewsReplied: 0,
    photosPublished: 0,
    unauthorizedEditsBlocked: 0,
    avertedDamage: 0
  });

  // Load active profile and settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Check Google OAuth URL Callback Parameters
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('auth') === 'success') {
        const email = urlParams.get('email') || '';
        const name = urlParams.get('name') || '';
        const b64Profiles = urlParams.get('profiles');
        const selectLocation = urlParams.get('select_location') === 'true';

        localStorage.setItem('gbpilot_user', JSON.stringify({
          email,
          name,
          loggedIn: true
        }));
        localStorage.removeItem('gbpilot_profile_unlinked');

        let incomingList: ActiveBusinessProfile[] = [];
        if (b64Profiles) {
          try {
            const jsonStr = decodeURIComponent(escape(atob(b64Profiles)));
            const parsed = JSON.parse(jsonStr);
            if (Array.isArray(parsed) && parsed.length > 0) {
              incomingList = parsed.map((p: any) => ({
                ...p,
                cover_url: p.cover_url || p.photo_url || p.snapshot_url || DEFAULT_VENUE_PHOTO
              }));
              localStorage.setItem('gbpilot_available_profiles', JSON.stringify(incomingList));
              localStorage.setItem('gbpilot_active_profile', JSON.stringify(incomingList[0]));
              setAvailableProfiles(incomingList);
              setActiveProfile(incomingList[0]);
            }
          } catch (e) {
            console.error('Error parsing OAuth profiles:', e);
          }
        }

        window.dispatchEvent(new CustomEvent('user_session_updated'));
        window.dispatchEvent(new CustomEvent('active_profile_updated'));
        window.history.replaceState({}, '', '/dashboard');

        if (selectLocation && incomingList.length > 1) {
          setIsLocationDropdownOpen(true);
          showToast(`Welcome ${name || email}! Please select which business location to manage.`);
        } else {
          showToast(`Welcome ${name || email}! Business profile connected successfully.`);
        }
      }

      // 2. Load Subscription State
      const currentSub = getSubscription();
      setSubscription(currentSub);
      setIsProUser(currentSub.isPro);

      const handleSubChange = () => {
        const updated = getSubscription();
        setSubscription(updated);
        setIsProUser(updated.isPro);
      };
      window.addEventListener('gbpilot_subscription_changed', handleSubChange);

      // 3. Load Dubai Smart Mode
      const savedDubaiMode = localStorage.getItem('gbpilot_dubai_mode') as any;
      if (savedDubaiMode) {
        setDubaiSmartMode(savedDubaiMode);
      }

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

      // Purge any lingering fake demo profile from localStorage
      if (currentProf && (currentProf.id === 'demo_artisan_cafe' || currentProf.name === 'Artisan Specialty Cafe & Roastery')) {
        localStorage.removeItem('gbpilot_active_profile');
        currentProf = null;
        setActiveProfile(null);
      }
      if (storedAvailable) {
        try {
          const list = JSON.parse(storedAvailable);
          if (Array.isArray(list)) {
            const cleanList = list.filter((p: any) => p && p.id !== 'demo_artisan_cafe' && p.name !== 'Artisan Specialty Cafe & Roastery');
            if (cleanList.length !== list.length) {
              localStorage.setItem('gbpilot_available_profiles', JSON.stringify(cleanList));
              setAvailableProfiles(cleanList);
              if (!currentProf && cleanList.length > 0) {
                setActiveProfile(cleanList[0]);
                currentProf = cleanList[0];
              }
            }
          }
        } catch (e) {}
      }

      // Generate dynamic actions tailored to current profile
      const tailoredActions = generateActionItems(currentProf);
      const handled = localStorage.getItem('gbpilot_handled_actions');
      if (handled) {
        try {
          const handledIds: string[] = JSON.parse(handled);
          setActionItems(tailoredActions.map(a => handledIds.includes(a.id) ? { ...a, status: 'EXECUTED' } : a));
        } catch (e) {
          setActionItems(tailoredActions);
        }
      } else {
        setActionItems(tailoredActions);
      }

      const handleOpenProfileModal = () => setIsProfileModalOpen(true);
      window.addEventListener('open_user_profile_modal', handleOpenProfileModal);

      const storedMode = localStorage.getItem('gbpilot_autopilot_mode');
      if (storedMode === 'FULL_AUTOPILOT') {
        setCopilotMode('AUTONOMOUS');
      } else {
        setCopilotMode('MANUAL_APPROVAL');
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

      return () => {
        window.removeEventListener('open_user_profile_modal', handleOpenProfileModal);
        window.removeEventListener('gbpilot_subscription_changed', handleSubChange);
      };
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

  const handleCopyManual = (item: ActionItem) => {
    const textToCopy = item.aiDraft || (item.title + ' - ' + item.subtitle);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      showToast('📋 Copied to clipboard! You can now manually paste it into Google Maps.');
    }
  };

  const handleToggleDubaiSmartMode = (mode: 'STANDARD' | 'PEAK_TRAFFIC' | 'RAMADAN' | 'SUMMER') => {
    const nextMode = dubaiSmartMode === mode ? 'STANDARD' : mode;
    setDubaiSmartMode(nextMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbpilot_dubai_mode', nextMode);
    }
    if (nextMode === 'PEAK_TRAFFIC') {
      showToast('⏰ Peak Traffic Guard Active: Operating hours extended +30m. "Open Now" badge locked!');
    } else if (nextMode === 'RAMADAN') {
      showToast('🌙 Ramadan Mode Deployed: Special Iftar (17:30 - 21:00) & Suhoor (23:00 - 02:30) schedule active.');
    } else if (nextMode === 'SUMMER') {
      showToast('☀️ Dubai Summer Mode Active: +45°C AC & Indoor Valet attributes prioritized over outdoor patio.');
    } else {
      showToast('Switched back to standard operating schedule.');
    }
  };

  const handleStartProTrialAndExecute = () => {
    activateTrial(14);
    setIsProUser(true);
    setIsProTrialModalOpen(false);
    showToast('🎉 14-Day Pro Autopilot Activated ($0.00 today)!');
    if (pendingActionToExecute) {
      handleExecuteAction(pendingActionToExecute);
      setPendingActionToExecute(null);
    }
  };

  const handleActionClick = (actionId: string) => {
    if (!isProUser) {
      setPendingActionToExecute(actionId);
      setIsProTrialModalOpen(true);
    } else {
      handleExecuteAction(actionId);
    }
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

  const handleUnlinkProfile = async (profileToUnlink: ActiveBusinessProfile) => {
    // 1. Remove from availableProfiles
    const updated = availableProfiles.filter(
      p => p.name !== profileToUnlink.name && (profileToUnlink.id ? p.id !== profileToUnlink.id : true)
    );
    setAvailableProfiles(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbpilot_available_profiles', JSON.stringify(updated));
    }

    // 2. If it was the active profile:
    if (activeProfile?.name === profileToUnlink.name || (profileToUnlink.id && activeProfile?.id === profileToUnlink.id)) {
      if (updated.length > 0) {
        setActiveProfile(updated[0]);
        if (typeof window !== 'undefined') {
          localStorage.setItem('gbpilot_active_profile', JSON.stringify(updated[0]));
        }
      } else {
        setActiveProfile(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('gbpilot_active_profile');
          localStorage.setItem('gbpilot_profile_unlinked', 'true');
        }
      }
    }

    // 3. Backend sync if it has an id
    if (profileToUnlink.id && !profileToUnlink.id.startsWith('demo_')) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
        await fetch(`${baseUrl}/api/v1/profiles/${profileToUnlink.id}/unlink`, { method: 'POST' });
      } catch (e) {
        console.warn("Backend unlink failed", e);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('active_profile_updated'));
    }
    setProfileToUnlinkConfirm(null);
    setIsProfileModalOpen(false);
    showToast(`Профиль "${profileToUnlink.name}" успешно отвязан. Квота базового тарифа (1/1) освобождена.`);
  };

  const handleUnlinkAndConnectNew = () => {
    if (activeProfile) {
      handleUnlinkProfile(activeProfile);
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gbpilot_active_profile');
        localStorage.setItem('gbpilot_available_profiles', '[]');
        localStorage.setItem('gbpilot_profile_unlinked', 'true');
        window.dispatchEvent(new CustomEvent('active_profile_updated'));
      }
    }
    setIsLocationQuotaModalOpen(false);
    router.push('/onboarding');
  };

  const handleDisconnectGoogleAccount = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gbpilot_user');
      localStorage.removeItem('gbpilot_active_profile');
      localStorage.removeItem('gbpilot_available_profiles');
      localStorage.setItem('gbpilot_profile_unlinked', 'true');
      setActiveProfile(null);
      setAvailableProfiles([]);
      window.dispatchEvent(new CustomEvent('user_session_updated'));
      window.dispatchEvent(new CustomEvent('active_profile_updated'));
    }
    setIsProfileModalOpen(false);
    showToast('Google-аккаунт и привязанные профили успешно отключены.');
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
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsProfileModalOpen(true);
                          }}
                          className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                          title="Управление привязкой аккаунта и профиля"
                        >
                          <Unlink className="w-2.5 h-2.5 text-slate-500" />
                          <span>Отвязать / Настройки</span>
                        </button>
                      </button>

                      {/* Location Switcher Dropdown */}
                      {isLocationDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 p-2 shadow-xl z-50 text-xs">
                          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                            <span>Your Businesses ({availableProfiles.length})</span>
                            <span className="text-emerald-600 font-semibold">Active Locations</span>
                          </div>
                          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-medium">Location Quota:</span>
                            <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {availableProfiles.length} / 1 Location Used (Starter)
                            </span>
                          </div>

                          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 my-1">
                            {availableProfiles.map((p, idx) => (
                              <div
                                key={idx}
                                className={`w-full px-2 py-1.5 rounded-xl flex items-center justify-between transition-colors ${
                                  activeProfile?.name === p.name ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSwitchProfile(p)}
                                  className="flex-1 flex items-center gap-2.5 truncate pr-2 text-left cursor-pointer"
                                >
                                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                                    <img
                                      src={p.cover_url || p.photo_url || p.snapshot_url || DEFAULT_VENUE_PHOTO}
                                      alt={p.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="truncate">
                                    <div className={`font-semibold truncate ${activeProfile?.name === p.name ? 'text-google-blue font-bold' : 'text-slate-700'}`}>
                                      {p.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate">{p.address || p.city}</div>
                                  </div>
                                </button>
                                <div className="flex items-center gap-1 shrink-0">
                                  {activeProfile?.name === p.name && (
                                    <Check className="w-3.5 h-3.5 text-google-blue shrink-0 mr-1" />
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setProfileToUnlinkConfirm(p);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                                    title="Отвязать этот профиль"
                                  >
                                    <Unlink className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Helper note for Starter Plan */}
                          <div className="px-3 py-2 bg-amber-50/80 border-t border-b border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-1.5">
                            <span className="font-bold">💡 Базовый тариф:</span>
                            <span className="text-amber-800 leading-snug">
                              Доступно 1 заведение. Чтобы сменить заведение, отвяжите текущий тестовый профиль.
                            </span>
                          </div>

                          <div className="pt-1.5 space-y-1">
                            <button
                              type="button"
                              onClick={() => {
                                setIsLocationDropdownOpen(false);
                                setIsProfileModalOpen(true);
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 font-semibold transition-colors cursor-pointer text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                                <span>Управление привязкой профилей</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (availableProfiles.length >= 1 && !isProUser) {
                                  setIsLocationQuotaModalOpen(true);
                                } else {
                                  router.push('/onboarding');
                                }
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-google-blue hover:bg-blue-50 font-bold transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Building2 className="w-3.5 h-3.5" />
                                <span>+ Connect New Location</span>
                              </div>
                              <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">
                                Quota {availableProfiles.length}/1
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Category, Stars & Live Open Status */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                        {activeProfile?.category || '—'}
                      </span>
                      
                      <div className="flex items-center gap-1.5 font-bold">
                        {typeof activeProfile?.rating === 'number' && activeProfile.rating > 0 ? (
                          <>
                            <div className="flex items-center text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.round(activeProfile.rating || 0)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-slate-900 font-extrabold">
                              {activeProfile.rating.toFixed(1)} ★
                            </span>
                            <span className="text-slate-500 font-normal">
                              ({activeProfile?.reviews_count ?? 0} reviews)
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400 font-normal">— ★ (— reviews)</span>
                        )}
                      </div>

                      {dubaiSmartMode === 'PEAK_TRAFFIC' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 font-bold text-[11px] border border-amber-300">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          Extended Hours Active • Closes at 23:30 (Peak Traffic Protected 🛡️)
                        </span>
                      ) : dubaiSmartMode === 'RAMADAN' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-900 font-bold text-[11px] border border-purple-300">
                          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                          🌙 Ramadan Mode • Iftar &amp; Suhoor Hours Active (17:30 – 02:00)
                        </span>
                      ) : dubaiSmartMode === 'SUMMER' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-900 font-bold text-[11px] border border-sky-300">
                          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                          ☀️ Summer Mode Active • High AC &amp; Indoor Valet (+45°C Shield)
                        </span>
                      ) : activeProfile ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Google Maps Synced
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium text-[11px] border border-slate-200">
                          Operating Schedule: —
                        </span>
                      )}
                    </div>

                    {/* Address, Phone & Direct Google Maps Live Link */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{activeProfile?.address || '—'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{activeProfile?.phone || (activeProfile as any)?.formatted_phone_number || '—'}</span>
                      </span>
                      {activeProfile?.name && (
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
                      )}
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
              
              {/* 🇦🇪 Dubai Smart Operations Presets (Job Story 4 & Dubai Localization) */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 shadow-sm border border-slate-700/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🇦🇪</span>
                    <span className="text-xs font-extrabold tracking-wide text-white uppercase">
                      Dubai Dynamic Operations &amp; Seasonality Presets
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">
                      1-Click Apply
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Prevent customer misdirection, lock "Open Now" maps badges, and adapt amenities for UAE climate &amp; holy months.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
                  {/* Peak Traffic Guard */}
                  <button
                    type="button"
                    onClick={() => handleToggleDubaiSmartMode('PEAK_TRAFFIC')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      dubaiSmartMode === 'PEAK_TRAFFIC'
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-amber-300 border-slate-600'
                    }`}
                    title="Extends closing hour by +30m to maintain 'Open Now' Google Maps badge"
                  >
                    <span>⏰ Peak Traffic Guard (+30m)</span>
                    {dubaiSmartMode === 'PEAK_TRAFFIC' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Ramadan Mode */}
                  <button
                    type="button"
                    onClick={() => handleToggleDubaiSmartMode('RAMADAN')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      dubaiSmartMode === 'RAMADAN'
                        ? 'bg-purple-400 text-slate-950 border-purple-300 shadow-md'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-purple-300 border-slate-600'
                    }`}
                    title="1-Click deploy special Iftar & Suhoor opening hours"
                  >
                    <span>🌙 Ramadan Mode</span>
                    {dubaiSmartMode === 'RAMADAN' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Summer Mode */}
                  <button
                    type="button"
                    onClick={() => handleToggleDubaiSmartMode('SUMMER')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      dubaiSmartMode === 'SUMMER'
                        ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-md'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-sky-300 border-slate-600'
                    }`}
                    title="Prioritizes Indoor AC & Valet over outdoor patio in +45°C heat"
                  >
                    <span>☀️ Summer (+45°C Shield)</span>
                    {dubaiSmartMode === 'SUMMER' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                </div>
              </div>
              
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
                      ? `${pendingActions.filter(a => a.type === 'REVIEW').length} reviews awaiting approval`
                      : 'All reviews addressed with local keywords'}
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
                      ? `${pendingActions.filter(a => a.type === 'COMPETITOR').length} competitor rank shift detected`
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
                        {/* Free Manual Copy Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyManual(item)}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          title="Free manual option: copy text and paste directly into Google Maps"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Manual</span>
                        </button>

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

                        {/* 1-Click Pro Automated Publish */}
                        <button
                          type="button"
                          onClick={() => handleActionClick(item.id)}
                          className="flex-1 md:flex-none px-4 py-2 bg-google-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>{isProUser ? item.primaryCtaText : '⚡ 1-Click Auto-Publish (Pro)'}</span>
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
                      —
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Awaiting Geo-Grid Scan
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Average rank across neighborhood catchment radius. Run a Geo-Grid Radar scan to benchmark live positions.
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
                      —
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Requires Google Insights Sync
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Direct phone calls, driving directions, and website bookings synced from Google Business Profile Insights.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div>
                    <span className="block font-bold text-slate-800">—</span>
                    <span className="text-slate-400 text-[10px]">Calls</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">—</span>
                    <span className="text-slate-400 text-[10px]">Routes</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">—</span>
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
                        {activeProfile
                          ? `${Math.min(100, (activeProfile.name ? 20 : 0) + (activeProfile.address ? 20 : 0) + (activeProfile.phone ? 20 : 0) + (activeProfile.category ? 20 : 0) + (activeProfile.rating ? 20 : 0))} / 100`
                          : '— / 100'}
                      </span>
                      {activeProfile && typeof activeProfile.rating === 'number' && activeProfile.rating > 0 ? (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {activeProfile.rating.toFixed(1)} ★ ({activeProfile.reviews_count ?? 0})
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          No Rating Synced
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {activeProfile
                        ? 'Profile verified. Core NAP data and Google Business Profile attributes synchronized.'
                        : 'Connect Google Business Profile to calculate real completeness score.'}
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

      
      {/* Location Quota Paywall Modal (Avatar 2 in MVP) */}
      {isLocationQuotaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Location Limit Reached
                  </h3>
                  <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    1 / 1 Locations Used
                  </span>
                </div>
              </div>
              <button onClick={() => setIsLocationQuotaModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your current <strong>Starter / Trial plan</strong> includes 1 active Google Business Profile ($29 / AED 99/mo). To connect, monitor, and defend multiple locations or franchise branches, upgrade to the <strong>Growth / Pro Plan</strong> (up to 3 locations at $69 / AED 249/mo) or <strong>Agency Plan</strong> (up to 10 locations at $199 / AED 749/mo).
            </p>

            {/* Free Unlink Option for Starter Tier Users */}
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Хотите подключить другое заведение на базовом тарифе?</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                На базовом тарифе доступна 1 активная локация. Вы можете <strong>бесплатно отвязать текущий профиль</strong> ({activeProfile?.name || 'текущее заведение'}) и сразу привязать свой реальный бизнес.
              </p>
              <button
                type="button"
                onClick={handleUnlinkAndConnectNew}
                className="w-full py-2 px-3 bg-white hover:bg-amber-100/80 text-amber-900 font-bold rounded-xl border border-amber-300 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Unlink className="w-3.5 h-3.5 text-amber-700" />
                <span>Отвязать текущий профиль и привязать новый (Бесплатно)</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-google-blue" />
                <span>Growth / Pro: Up to 3 locations simultaneously</span>
              </div>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-google-blue" />
                <span>Agency / Chain: Up to 10 locations with White-Label reports</span>
              </div>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-google-blue" />
                <span>Unified 24/7 Sentinel Guard protection for all branches</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsLocationQuotaModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                Закрыть
              </button>
              <Link
                href="/b2b"
                onClick={() => setIsLocationQuotaModalOpen(false)}
                className="flex-1 py-2.5 bg-google-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all text-center"
              >
                <span>Upgrade to Pro →</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Manage Profile & Connected Accounts Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 rounded-xl text-google-blue border border-blue-200">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Управление профилем и аккаунтом
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Настройки привязки Google Business Profile и квоты
                  </span>
                </div>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Active Profile Overview */}
            {activeProfile ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                    <img src={venuePhotoUrl} alt={activeProfile.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 text-sm truncate">{activeProfile.name}</div>
                    <div className="text-xs text-slate-500 truncate">{activeProfile.address || activeProfile.city}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {activeProfile.verified ? 'Google Verified' : 'Demo Profile'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-google-blue border border-blue-200">
                        Тариф: Базовый (Starter)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70 text-xs text-slate-600 flex items-center justify-between">
                  <span>Квота локаций:</span>
                  <span className="font-bold text-slate-800">{availableProfiles.length} / 1 использовано</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Нет активного подключенного профиля.
              </div>
            )}

            {/* Actions List */}
            <div className="space-y-2 text-xs">
              {activeProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileToUnlinkConfirm(activeProfile);
                  }}
                  className="w-full p-3.5 rounded-2xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-left transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                      <Unlink className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-amber-900">Отвязать текущий профиль</div>
                      <div className="text-[11px] text-amber-700">
                        Освобождает квоту (1/1) для подключения другого бизнеса
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              <button
                type="button"
                onClick={handleDisconnectGoogleAccount}
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Сменить / Отвязать Google-аккаунт</div>
                    <div className="text-[11px] text-slate-500">
                      Очистить сессию Google и войти под другой учетной записью
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  if (availableProfiles.length >= 1 && !isProUser) {
                    setIsLocationQuotaModalOpen(true);
                  } else {
                    router.push('/onboarding');
                  }
                }}
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 text-google-blue border border-blue-100">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Подключить новое заведение</div>
                    <div className="text-[11px] text-slate-500">
                      Поиск по Google Maps или привязка через Google OAuth
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Unlink Confirmation Dialog */}
      {profileToUnlinkConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-slate-900 space-y-4">
            <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600">
              <Unlink className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Отвязать профиль?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Вы действительно хотите отвязать <strong>"{profileToUnlinkConfirm.name}"</strong>? Слот локации (1/1 на базовом тарифе) будет освобожден, и вы сможете сразу подключить свой реальный бизнес.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProfileToUnlinkConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => handleUnlinkProfile(profileToUnlinkConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                Да, отвязать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 14-Day Pro Autopilot Trial Modal (PLG Reverse Trial Activation) */}
      {isProTrialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 rounded-xl text-google-blue border border-blue-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Activate 14-Day Pro Autopilot Trial
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    $0.00 Today • 100% Free
                  </span>
                </div>
              </div>
              <button onClick={() => setIsProTrialModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Experience the power of hands-off Google Business Profile growth. Publish LSI-optimized review responses and deploy rank-overtake strategies in <strong>1 click via official Google API</strong>.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-google-blue shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">1-Click Instant API Publishing</strong>
                  <span className="text-slate-500 text-[11px]">No manual copy-pasting or switching between Google dashboards.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">24/7 Sentinel Auto-Revert Guard</strong>
                  <span className="text-slate-500 text-[11px]">Automatic background rollback of competitor tampering within 3 minutes.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Autonomous Copilot Mode</strong>
                  <span className="text-slate-500 text-[11px]">Automatic review responses to 5★ reviews without waiting for owner confirmation.</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Zero commitment: Cancel anytime in 1 click before day 14.</span>
              <span className="font-bold text-slate-800">$0.00 Due Now</span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsProTrialModalOpen(false)}
                className="py-3 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Keep Manual Mode
              </button>
              <button
                type="button"
                onClick={handleStartProTrialAndExecute}
                className="flex-1 py-3 bg-google-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Start 14-Day Free Pro Trial ($0)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <OnboardingInspectionModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        businessName={activeProfile?.name || '—'}
        businessAddress={activeProfile?.address || '—'}
        onComplete={() => {
          setIsInspectionModalOpen(false);
          showToast('Profile optimization applied successfully! AI Sentinel Shield Active.');
        }}
      />

      <Footer />
    </div>
  );
}
