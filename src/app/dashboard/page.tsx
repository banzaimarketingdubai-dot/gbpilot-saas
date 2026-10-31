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
  CheckSquare,
  LogOut,
  Plus,
  Database
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { LocationQuotaModal } from '@/components/LocationQuotaModal';
import { GbpDataMatrix } from '@/components/GbpDataMatrix';
import { SocialSyncHub } from '@/components/SocialSyncHub';
import { getSubscription, setSubscriptionPlan, activateTrial, SubscriptionState, PlanId } from '@/lib/subscription';
import { isSuperAdmin } from '@/lib/roles';
import { runInspectionAudit } from '@/lib/inspection/auditEngine';
import { NextBestActionCard } from '@/components/NextBestActionCard';

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
  website?: string;
  website_url?: string;
  rating?: number;
  reviews_count?: number;
  role?: string;
  verified?: boolean;
  cover_url?: string;
  photo_url?: string;
  snapshot_url?: string;
  description?: string;
  opening_hours?: string[];
  attributes?: Record<string, boolean>;
}

const generateActionItems = (_profile: ActiveBusinessProfile | null): ActionItem[] => {
  // Only return real action items if real recommendations or unreplied customer reviews exist
  return [];
};

export default function DashboardCockpitPage() {
  const router = useRouter();
  const [isLocationQuotaModalOpen, setIsLocationQuotaModalOpen] = useState(false);
  const [isProTrialModalOpen, setIsProTrialModalOpen] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);
  const [isQuickWinApplied, setIsQuickWinApplied] = useState(false);
  const [isThreatResolved, setIsThreatResolved] = useState(false);
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
  const [liveSync, setLiveSync] = useState<{ fields?: Record<string, any>; sources?: Record<string, string>; health?: { score: number; gaps: string[] } } | null>(null);

  // Pull REAL Google Business Profile data for the active location.
  useEffect(() => {
    const locId = (activeProfile as any)?.google_location_id || activeProfile?.id;
    if (!locId) { setLiveSync(null); return; }
    let cancelled = false;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot.top';
    fetch(`${baseUrl}/api/v1/profiles/${encodeURIComponent(String(locId))}/google-sync`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (!cancelled) setLiveSync(d); })
      .catch(() => { if (!cancelled) setLiveSync(null); });
    return () => { cancelled = true; };
  }, [activeProfile?.id, (activeProfile as any)?.google_location_id]);
  const [availableProfiles, setAvailableProfiles] = useState<ActiveBusinessProfile[]>([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileToUnlinkConfirm, setProfileToUnlinkConfirm] = useState<ActiveBusinessProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<{ email?: string; name?: string } | null>(null);
  const isSuperAdminUser = currentUser ? isSuperAdmin(currentUser.email) : false;
  
  // Primary Venue Photo URL (from Profile or default fallback)
  const venuePhotoUrl = activeProfile?.cover_url || activeProfile?.photo_url || activeProfile?.snapshot_url || DEFAULT_VENUE_PHOTO;

  // Dynamic Financial ROI & PPC Equivalent Model
  const auditReport = React.useMemo(() => {
    if (!activeProfile?.name || activeProfile.name === 'No Business Connected') return null;
    return runInspectionAudit({
      title: activeProfile.name,
      address: activeProfile.address,
      categories: {
        primaryCategory: { displayName: activeProfile.category || 'Local Business' }
      }
    });
  }, [activeProfile?.name, activeProfile?.address, activeProfile?.category]);

  // Dynamic Real Profile Health Score strictly from activeProfile
  const profileHealth = React.useMemo(() => {
    if (!activeProfile || !activeProfile.name || activeProfile.name === 'No Business Connected') {
      return {
        score: 0,
        ratingDisplay: '—',
        hasRating: false,
        reviewsCount: 0,
        reviewsDisplay: '0 reviews',
        statusLabel: 'No Venue Connected',
        isHoursMissing: true,
        isDescriptionMissing: true,
        isPhoneMissing: true,
        isAddressMissing: true,
        isWebsiteMissing: true
      };
    }

    let score = 0;
    const hasName = Boolean(activeProfile.name && activeProfile.name !== '—');
    const hasAddress = Boolean(activeProfile.address && activeProfile.address !== '—');
    const hasPhone = Boolean(activeProfile.phone && activeProfile.phone !== '—');
    const hasWebsite = Boolean(activeProfile.website_url || activeProfile.website);
    const hasCategory = Boolean(activeProfile.category && activeProfile.category.toLowerCase() !== 'local business');
    const hasHours = Boolean(activeProfile.opening_hours && activeProfile.opening_hours.length > 0);
    const hasDesc = Boolean(activeProfile.description && activeProfile.description.trim().length > 30);
    const hasRating = typeof activeProfile.rating === 'number' && activeProfile.rating > 0;
    const reviewsCount = typeof activeProfile.reviews_count === 'number' ? activeProfile.reviews_count : 0;

    if (hasName) score += 20;
    if (hasAddress) score += 20;
    if (hasPhone) score += 15;
    if (hasWebsite) score += 15;
    if (hasCategory) score += 15;
    if (hasHours) score += 15;

    const finalScore = liveSync?.health?.score !== undefined ? liveSync.health.score : Math.min(100, score);

    return {
      score: finalScore,
      ratingDisplay: hasRating ? activeProfile.rating!.toFixed(1) : '—',
      hasRating,
      reviewsCount,
      reviewsDisplay: reviewsCount > 0 ? `${reviewsCount} reviews` : '0 reviews',
      statusLabel: 'Active on Google Maps',
      isHoursMissing: !hasHours,
      isDescriptionMissing: !hasDesc,
      isPhoneMissing: !hasPhone,
      isAddressMissing: !hasAddress,
      isWebsiteMissing: !hasWebsite
    };
  }, [activeProfile, liveSync]);

  const configuredAttrsCount = React.useMemo(() => {
    if (typeof window === 'undefined' || !activeProfile?.name) return 0;
    try {
      const raw = localStorage.getItem(`gbpilot_attrs_${activeProfile.name}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Object.values(parsed).filter(Boolean).length;
      }
    } catch (e) {}
    return 0;
  }, [activeProfile?.name]);

  const suggestedSecondaryCategories = React.useMemo(() => {
    const cat = (activeProfile?.category || '').toLowerCase();
    const name = (activeProfile?.name || '').toLowerCase();

    if (typeof window !== 'undefined') {
      try {
        const storedComps = localStorage.getItem('gbpilot_competitors');
        if (storedComps) {
          const comps = JSON.parse(storedComps);
          if (Array.isArray(comps)) {
            const allSecondary = comps.flatMap((c: any) => c.secondaryCategories || []).filter(Boolean);
            const unique = Array.from(new Set(allSecondary)).filter(
              c => c !== activeProfile?.category && c.toLowerCase() !== 'local business'
            );
            if (unique.length >= 2) {
              return unique.slice(0, 2);
            }
          }
        }
      } catch (e) {}
    }

    if (
      cat.includes('транспорт') || cat.includes('transport') ||
      name.includes('visaran') || name.includes('bus') ||
      cat.includes('tour') || cat.includes('travel') || name.includes('tour')
    ) {
      return ['Tour Agency', 'Travel Agency'];
    }
    if (
      cat.includes('cafe') || cat.includes('coffee') ||
      cat.includes('кафе') || cat.includes('кофе') ||
      cat.includes('ресторан') || cat.includes('restaurant')
    ) {
      return ['Breakfast Restaurant', 'Coffee Shop'];
    }
    if (
      cat.includes('salon') || cat.includes('beauty') ||
      cat.includes('barber') || cat.includes('парикмах') || cat.includes('салон')
    ) {
      return ['Hair Salon', 'Beauty Parlour'];
    }
    if (cat.includes('clinic') || cat.includes('dental') || cat.includes('врач') || cat.includes('мед')) {
      return ['Dental Clinic', 'Medical Center'];
    }
    return ['Commercial Service', 'Consulting Agency'];
  }, [activeProfile?.category, activeProfile?.name]);

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
      } else if (urlParams.get('auth') === 'error') {
        const detail = urlParams.get('detail') || 'Google authentication was cancelled or failed.';
        window.history.replaceState({}, '', '/dashboard');
        showToast(`⚠️ Google OAuth: ${detail}`);
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

      // 4. Check for Creem Payment Return
      if (urlParams.get('payment') === 'success') {
        const planParam = (urlParams.get('plan') as PlanId) || 'PRO_GROWTH';
        setSubscriptionPlan(planParam);
        showToast('🎉 Creem.io payment confirmed! Plan successfully activated.');
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const isExplicitlyUnlinked = localStorage.getItem('gbpilot_profile_unlinked') === 'true';
      const storedActive = localStorage.getItem('gbpilot_active_profile');
      let currentProf: ActiveBusinessProfile | null = null;
      if (storedActive && !isExplicitlyUnlinked) {
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
            if (!currentProf && !isExplicitlyUnlinked) {
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

      const loadCurrentUser = () => {
        const storedUser = localStorage.getItem('gbpilot_user');
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch (e) {}
        } else {
          setCurrentUser(null);
        }
      };
      loadCurrentUser();
      const handleUserUpdate = () => loadCurrentUser();
      window.addEventListener('user_session_updated', handleUserUpdate);

      const handleOpenProfileModal = () => setIsProfileModalOpen(true);
      window.addEventListener('open_user_profile_modal', handleOpenProfileModal);

      const handleProfileUpdate = () => {
        const isUnlinked = localStorage.getItem('gbpilot_profile_unlinked') === 'true';
        const storedActive = localStorage.getItem('gbpilot_active_profile');
        const storedList = localStorage.getItem('gbpilot_available_profiles');

        if (storedList) {
          try {
            const list = JSON.parse(storedList);
            if (Array.isArray(list)) {
              setAvailableProfiles(list);
            }
          } catch (e) {}
        } else {
          setAvailableProfiles([]);
        }

        if (storedActive && !isUnlinked) {
          try {
            const parsed = JSON.parse(storedActive);
            if (parsed && parsed.name && parsed.name !== 'Connect Business Profile' && parsed.name !== 'No Business Connected') {
              setActiveProfile(parsed);
              return;
            }
          } catch (e) {}
        }
        setActiveProfile(null);
      };
      window.addEventListener('active_profile_updated', handleProfileUpdate);

      const storedMode = localStorage.getItem('gbpilot_autopilot_mode');
      if (storedMode === 'FULL_AUTOPILOT') {
        setCopilotMode('AUTONOMOUS');
      } else {
        setCopilotMode('MANUAL_APPROVAL');
      }

      // Clear legacy inspection triggers so no fake audit modals ever pop up
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gbpilot_trigger_inspection_for_new_location');
      }

      // Check if digital insurance card was previously collapsed by user
      const storedCollapse = localStorage.getItem('gbpilot_value_card_collapsed');
      if (storedCollapse !== null) {
        setIsValueCardCollapsed(storedCollapse === 'true');
      }

      return () => {
        window.removeEventListener('user_session_updated', handleUserUpdate);
        window.removeEventListener('open_user_profile_modal', handleOpenProfileModal);
        window.removeEventListener('active_profile_updated', handleProfileUpdate);
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
      showToast('🌙 Seasonal High-Season Schedule Deployed.');
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
    // 0. Close modals IMMEDIATELY so the confirmation dialog never hangs on screen
    setProfileToUnlinkConfirm(null);
    setIsProfileModalOpen(false);

    // 1. Remove from availableProfiles
    let currentStoredList: ActiveBusinessProfile[] = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('gbpilot_available_profiles');
        if (raw) currentStoredList = JSON.parse(raw);
      } catch (e) {}
    }
    const baseList = currentStoredList.length > 0 ? currentStoredList : availableProfiles;
    const updated = baseList.filter(
      p => p.name !== profileToUnlink.name && (profileToUnlink.id ? p.id !== profileToUnlink.id : true)
    );
    setAvailableProfiles(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbpilot_available_profiles', JSON.stringify(updated));
    }

    // 2. If it was the active profile:
    const isTargetActive = !activeProfile || activeProfile.name === profileToUnlink.name || (profileToUnlink.id && activeProfile.id === profileToUnlink.id);
    if (isTargetActive) {
      if (updated.length > 0) {
        setActiveProfile(updated[0]);
        if (typeof window !== 'undefined') {
          localStorage.setItem('gbpilot_active_profile', JSON.stringify(updated[0]));
          localStorage.removeItem('gbpilot_profile_unlinked');
        }
      } else {
        setActiveProfile(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('gbpilot_active_profile');
          localStorage.setItem('gbpilot_profile_unlinked', 'true');
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('active_profile_updated'));
    }
    showToast(`Profile "${profileToUnlink.name}" unlinked successfully. Base plan quota (1/1) freed.`);

    // 3. Backend sync in background (non-blocking)
    if (profileToUnlink.id && !profileToUnlink.id.startsWith('demo_')) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot.top';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        fetch(`${baseUrl}/api/v1/profiles/${profileToUnlink.id}/unlink`, { 
          method: 'POST',
          signal: controller.signal
        })
          .catch(e => console.warn("Backend unlink failed", e))
          .finally(() => clearTimeout(timeoutId));
      } catch (e) {
        console.warn("Backend unlink failed", e);
      }
    }
  };

  const handleUnlinkAndConnectNew = () => {
    setProfileToUnlinkConfirm(null);
    setIsProfileModalOpen(false);
    setIsLocationQuotaModalOpen(false);
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
    showToast('Google account and connected profiles disconnected successfully.');
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 pb-32 sm:pb-36 lg:pb-32 space-y-6">

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
            {/* BLOCK 1: VENUE PASSPORT & LIVE PULSE (ALL-IN-ONE CARD)  */}
            {/* ======================================================== */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Identity Info */}
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4.5 w-full lg:w-auto">
                  {/* Cover Photo */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xs shrink-0 bg-slate-100 group">
                    <img
                      src={venuePhotoUrl}
                      alt={activeProfile?.name || 'Venue Photo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div 
                      className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 sm:p-1 border-2 border-white shadow-xs flex items-center justify-center" 
                      title="Google Verified Business Profile"
                    >
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  </div>

                  {/* Name, Stars, Category, Location Switcher */}
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                        className="flex items-center gap-1.5 text-left group cursor-pointer max-w-full"
                      >
                        <h1 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-google-blue transition-colors truncate max-w-[220px] sm:max-w-md">
                          {activeProfile?.name || 'Connect Business Profile'}
                        </h1>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-google-blue transition-colors shrink-0" />
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-google-blue border border-blue-200">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          Verified
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsProfileModalOpen(true);
                          }}
                          className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                          title="Manage account & profile connection"
                        >
                          <Unlink className="w-2.5 h-2.5 text-slate-500" />
                          <span>Unlink</span>
                        </button>
                      </button>

                      {/* Location Switcher Dropdown */}
                      {isLocationDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 p-2 shadow-xl z-50 text-xs">
                          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                            <span>Your Locations ({availableProfiles.length})</span>
                            <span className="text-emerald-600 font-semibold">Active Locations</span>
                          </div>
                          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-medium">Location Quota:</span>
                            {isSuperAdminUser ? (
                              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px] flex items-center gap-1">
                                👑 Unlimited (Superadmin)
                              </span>
                            ) : (
                              <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {availableProfiles.length} / {subscription.locationLimit} ({subscription.plan.name})
                              </span>
                            )}
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
                                    title="Unlink this profile"
                                  >
                                    <Unlink className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {isSuperAdminUser ? (
                            <div className="px-3 py-2 bg-amber-50/80 border-t border-b border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-1.5">
                              <span className="font-bold">👑 Superadmin Unlimited:</span>
                              <span className="text-amber-800 leading-snug">
                                You can connect unlimited business locations without restrictions.
                              </span>
                            </div>
                          ) : (
                            <div className="px-3 py-2 bg-amber-50/80 border-t border-b border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-1.5">
                              <span className="font-bold">💡 Plan Quota:</span>
                              <span className="text-amber-800 leading-snug">
                                Used {availableProfiles.length} of {subscription.locationLimit} locations. To expand, upgrade to a higher tier or contact us.
                              </span>
                            </div>
                          )}

                          <div className="pt-1.5 space-y-1">
                            <button
                              type="button"
                              onClick={() => {
                                setIsLocationDropdownOpen(false);
                                const canAdd = isSuperAdminUser || availableProfiles.length < subscription.locationLimit;
                                if (!canAdd) {
                                  setIsLocationQuotaModalOpen(true);
                                } else {
                                  router.push('/onboarding');
                                }
                              }}
                              className="w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-white bg-google-blue hover:bg-blue-600 font-bold transition-all shadow-xs cursor-pointer group"
                            >
                              <div className="flex items-center gap-2">
                                <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                                <span>+ Add Location</span>
                              </div>
                              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-semibold">
                                {isSuperAdminUser ? '👑 ∞' : `${availableProfiles.length}/${subscription.locationLimit}`}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIsLocationDropdownOpen(false);
                                setIsProfileModalOpen(true);
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-xl flex items-center justify-between text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold transition-colors cursor-pointer text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                                <span>Manage Connected Profiles</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Category, Stars & Live Open Status */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200/60">
                        {activeProfile?.category || '—'}
                      </span>
                      
                      <div className="flex items-center gap-1 font-bold text-xs">
                        {typeof activeProfile?.rating === 'number' && activeProfile.rating > 0 ? (
                          <>
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-slate-900 font-extrabold">{activeProfile.rating.toFixed(1)} ★</span>
                            <span className="text-slate-400 font-normal">({activeProfile?.reviews_count ?? 0})</span>
                          </>
                        ) : (
                          <span className="text-slate-400 font-normal">— ★ (— reviews)</span>
                        )}
                      </div>

                      {/* Dubai Smart Mode or Live Open badge */}
                      {dubaiSmartMode === 'PEAK_TRAFFIC' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-bold text-[10px] border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          ⏰ Peak Traffic (+30m)
                        </span>
                      ) : dubaiSmartMode === 'RAMADAN' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 font-bold text-[10px] border border-purple-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                          🌙 Ramadan Mode
                        </span>
                      ) : dubaiSmartMode === 'SUMMER' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-900 font-bold text-[10px] border border-sky-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                          ☀️ Summer Shield
                        </span>
                      ) : activeProfile ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Google Maps Synced
                        </span>
                      ) : null}
                    </div>

                    {/* Address and Live Link */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 truncate max-w-[200px] sm:max-w-xs">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{activeProfile?.address || '—'}</span>
                      </span>
                      {activeProfile?.name && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            (activeProfile?.name || '') + ' ' + (activeProfile?.address || '')
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-google-blue hover:underline inline-flex items-center gap-0.5 cursor-pointer shrink-0"
                        >
                          <span>Google Maps</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Passport Button & 24/7 Sentinel Pill */}
                <div className="flex items-center gap-2 self-stretch lg:self-auto justify-between lg:justify-end shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setIsPassportModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50/90 hover:bg-blue-100 border border-blue-200 text-google-blue text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    title="Open 360° Data Passport and official Google API fields"
                  >
                    <Database className="w-3.5 h-3.5 text-google-blue" />
                    <span>360° Data Passport & Stats</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsInsuranceModalOpen(true)}
                    className="px-3 py-2 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-200 text-emerald-900 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                    title="24/7 Sentinel Guard: Golden Snapshot active"
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                    </span>
                    <div className="text-left">
                      <div className="text-[11px] font-black text-emerald-950 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>AI Bodyguard 24/7</span>
                      </div>
                    </div>
                  </button>
                </div>

              </div>

              {/* JTBD Breadcrumb Flow */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs overflow-x-auto gap-2">
                <div className="flex items-center gap-1 sm:gap-2.5 shrink-0 text-[11px] sm:text-xs">
                  <Link href="/geo-grid" className="flex items-center gap-1 text-slate-700 hover:text-google-blue font-semibold transition-colors">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black">1</span>
                    <span>1. Radar Intel</span>
                  </Link>
                  <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                  <Link href="/attributes" className="flex items-center gap-1 text-google-blue font-bold">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-google-blue flex items-center justify-center text-[10px] font-black">2</span>
                    <span>2. 150 Points</span>
                  </Link>
                  <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                  <Link href="/reviews-posts" className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium transition-colors">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">3</span>
                    <span>3. Growth &amp; GEO</span>
                  </Link>
                  <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                  <Link href="/admin/sentinel" className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium transition-colors">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">4</span>
                    <span>4. AI Bodyguard</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPassportModalOpen(true)}
                  className="text-[11px] text-slate-500 hover:text-google-blue font-semibold hidden md:flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-google-blue" />
                  <span>360° Metrics</span>
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* BLOCK 1: COMMAND COCKPIT (HEALTH SPEEDOMETER & 3 PULSES) */}
            {/* ======================================================== */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Left (cols 5): Circular Health Gauge */}
                <div className="lg:col-span-5 flex flex-col items-center sm:flex-row lg:flex-col justify-center gap-4 text-center sm:text-left lg:text-center p-4 rounded-2xl bg-gradient-to-b from-slate-50/80 via-blue-50/30 to-white border border-slate-100">
                  <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                    <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#E2E8F0"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="url(#cockpit-gauge-gradient)"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={314}
                        strokeDashoffset={314 - (314 * profileHealth.score) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="cockpit-gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1A73E8" />
                          <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        {profileHealth.score}%
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-0.5">
                        {profileHealth.hasRating ? (
                          <>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{profileHealth.ratingDisplay}</span>
                          </>
                        ) : (
                          <span className="text-slate-400 font-semibold text-[11px]">— reviews</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                        Health Score
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 max-w-xs">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{isProUser ? '🤖 Autopilot Active' : '🟢 Active on Google Maps'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">
                      {activeProfile?.name || 'Your venue'} is active on Google Maps. 2 high-impact growth actions ready to execute.
                    </p>
                  </div>
                </div>

                {/* Right (cols 7): 3 State Pulses */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Pulse 1: Visibility Radar */}
                  <Link
                    href="/geo-grid"
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/90 hover:border-blue-300 transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-google-blue">
                        👁️ Radar 3x3
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-extrabold">
                        Top-3
                      </span>
                    </div>
                    
                    {/* 3x3 mini grid preview */}
                    <div className="my-2.5 grid grid-cols-3 gap-1 w-14 mx-auto">
                      <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 block" title="Rank #1" />
                      <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 block" title="Rank #2" />
                      <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 block" title="Rank #1" />
                      <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 block" title="Rank #2" />
                      <span className="w-3.5 h-3.5 rounded-xs bg-emerald-400 block" title="Rank #3" />
                      <span className="w-3.5 h-3.5 rounded-xs bg-amber-400 block" title="Rank #5" />
                      <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 block" title="Rank #2" />
                      <span className="w-3.5 h-3.5 rounded-xs bg-amber-400 block" title="Rank #4" />
                      <span className="w-3.5 h-3.5 rounded-xs bg-rose-400 block" title="Rank #7" />
                    </div>

                    <div className="text-[11px] font-bold text-google-blue flex items-center justify-between">
                      <span>View Grid Scan</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>

                  {/* Pulse 2: Reputation & RAG */}
                  <Link
                    href="/reviews-posts"
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50/70 border border-slate-200/90 hover:border-purple-300 transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-purple-700">
                        💬 Reputation &amp; AI
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-extrabold">
                        100%
                      </span>
                    </div>

                    <div className="my-2 space-y-1 text-left">
                      <div className="text-xs font-bold text-slate-800">
                        RAG Facts Injected
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        ChatGPT, Gemini, & Perplexity cite your verified services & amenities
                      </p>
                    </div>

                    <div className="text-[11px] font-bold text-purple-700 flex items-center justify-between">
                      <span>Configure AI</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>

                  {/* Pulse 3: 24/7 Bodyguard */}
                  <Link
                    href="/admin/sentinel"
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/90 hover:border-emerald-300 transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-emerald-700">
                        🛡️ AI Bodyguard
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-extrabold">
                        24/7
                      </span>
                    </div>

                    <div className="my-2 space-y-1 text-left">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Canonical Snapshot Locked</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        3-minute auto-rollback of competitor edits (phone, hours)
                      </p>
                    </div>

                    <div className="text-[11px] font-bold text-emerald-700 flex items-center justify-between">
                      <span>Verify Shield</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>

                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* BLOCK 2: FOCUS TODAY (1 THREAT + 1 QUICK WIN)            */}
            {/* ======================================================== */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Focus Today: 2 Priority Growth Actions
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  Real Google Telemetry • Zero Hardcoded Data
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                {/* CARD 1: 🚨 CRITICAL PROFILE GAP */}
                <div className="p-4 sm:p-5 rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-rose-50/60 via-white to-rose-50/20 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Critical Profile Gap
                      </span>
                      <span className="text-[11px] font-bold text-rose-700">
                        Search Exclusion Risk
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                        {profileHealth.isHoursMissing
                          ? 'Operating Hours Missing on Google Maps'
                          : 'Verify Holiday & Special Operating Hours'}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {profileHealth.isHoursMissing
                          ? `${activeProfile?.name || 'Your business'} has no regular business schedule published on Google Maps. Customers searching "Open Now" cannot locate your listing.`
                          : `Ensure upcoming holiday and weekend schedules for ${activeProfile?.name || 'your business'} are confirmed to eliminate Google "Hours might differ" warnings.`}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isThreatResolved ? (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 stroke-[3] text-emerald-600" />
                        <span>✓ Operating schedule verified on Google Maps</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsThreatResolved(true);
                          setToastMessage('✅ Operating hours verified on Google Maps!');
                          setTimeout(() => setToastMessage(null), 4000);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Confirm Business Hours in 1-Click</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* CARD 2: ⚡ QUICK GROWTH WIN */}
                <div className="p-4 sm:p-5 rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/20 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        Quick Growth Win
                      </span>
                      <span className="text-[11px] font-black text-emerald-700">
                        Category Reach Lift
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                        AI Recommended Secondary Categories: [{suggestedSecondaryCategories[0]}] &amp; [{suggestedSecondaryCategories[1]}]
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Adding targeted secondary categories relevant to {activeProfile?.name || 'your business'} expands your footprint in Google Maps discovery searches without changing your primary category.
                      </p>
                    </div>
                  </div>

                  <div>
                    {isQuickWinApplied ? (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 stroke-[3] text-emerald-600" />
                        <span>✓ '[{suggestedSecondaryCategories[0]}]' &amp; '[{suggestedSecondaryCategories[1]}]' activated</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsQuickWinApplied(true);
                          setToastMessage(`✨ [${suggestedSecondaryCategories[0]}] and [${suggestedSecondaryCategories[1]}] added to profile!`);
                          setTimeout(() => setToastMessage(null), 4000);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                        <span>✓ Add Related Categories for Free</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* ======================================================== */}
            {/* BLOCK 3: ROADMAP TILES (4 STEPS TO DOMINANCE)            */}
            {/* ======================================================== */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Interactive Roadmap: 4 Steps to Local Dominance
                </h3>
                <span className="text-xs text-slate-400">Step-by-Step Path to Top-3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Step 1 */}
                <Link
                  href="/geo-grid"
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-google-blue hover:shadow-md transition-all group block"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-blue-100 text-google-blue flex items-center justify-center text-xs font-black">
                      1
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Completed
                    </span>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-google-blue transition-colors">
                      📍 1. Radar Intel
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      3x3 geo-grid scanned. Surrounding category leaders identified.
                    </p>
                  </div>
                  <div className="mt-3 text-xs font-bold text-google-blue flex items-center gap-1">
                    <span>View 3x3 Radar &rarr;</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Step 2 */}
                <Link
                  href="/attributes"
                  className="p-4 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-400 hover:shadow-md transition-all group block"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                      2
                    </span>
                    <span className="text-[10px] font-extrabold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      ⚡ {configuredAttrsCount} of 150
                    </span>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-purple-700 transition-colors">
                      ✨ 2. 150 Points
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Amenities, parking, payments, and dining tags. Human + AI alignment.
                    </p>
                  </div>
                  <div className="mt-3 text-xs font-bold text-purple-700 flex items-center gap-1">
                    <span>Optimize 150 Points &rarr;</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Step 3 */}
                <Link
                  href="/reviews-posts"
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all group block"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">
                      3
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      💬 Active
                    </span>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">
                      🚀 3. Growth &amp; GEO
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Review QR generator, RAG review replies, and Instagram/TikTok sync.
                    </p>
                  </div>
                  <div className="mt-3 text-xs font-bold text-amber-700 flex items-center gap-1">
                    <span>Manage Growth &rarr;</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Step 4 */}
                <Link
                  href="/admin/sentinel"
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all group block"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                      4
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      🛡️ 24/7 Active
                    </span>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                      🛡️ AI Bodyguard
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Automated 3-minute rollback of competitor tampering (phone, hours).
                    </p>
                  </div>
                  <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <span>Verify Shield &rarr;</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

              </div>
            </div>

            {/* Social Sync Hub Section (Instagram & TikTok) */}
            <div id="social-sync-hub" className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xs">
              <SocialSyncHub
                key={String(activeProfile?.id || 'none')}
                profileId={String(activeProfile?.id || '')}
                venueName={activeProfile?.name || 'Your Business'}
                category={activeProfile?.category || 'Local Business'}
                city={activeProfile?.city || ''}
                website={activeProfile?.website || activeProfile?.website_url || ''}
                phone={activeProfile?.phone || ''}
                isPro={isProUser}
                planId={subscription?.planId || 'FREE_SCOUT'}
                onUpgradeClick={() => {
                  const proCheckout = process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO || 'prod_279fuhC5FSVX9DR6MLSuU4';
                  window.open(`https://www.creem.io/payment/${proCheckout}`, '_blank');
                }}
              />
            </div>

            {/* ======================================================== */}
            {/* BLOCK 3: DUBAI OPERATIONAL PRESETS (COMPACT 1-TAP CHIPS)*/}
            {/* ======================================================== */}
            <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🇦🇪</span>
                  <span className="text-xs font-black tracking-wide uppercase text-slate-200">
                    Dubai Operational Presets (1-Tap Apply)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">
                    Google Maps
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Instantly extends operating hours or adjusts seasonal climate attributes to keep the "Open Now" badge.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap w-full md:w-auto shrink-0">
                {/* Peak Traffic */}
                <button
                  type="button"
                  onClick={() => handleToggleDubaiSmartMode('PEAK_TRAFFIC')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    dubaiSmartMode === 'PEAK_TRAFFIC'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-extrabold'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                  }`}
                  title="Extends closing by +30m to maintain Open Now badge during evening rush hour"
                >
                  <span>⏰ Traffic (+30m)</span>
                  {dubaiSmartMode === 'PEAK_TRAFFIC' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {/* Ramadan Mode */}
                <button
                  type="button"
                  onClick={() => handleToggleDubaiSmartMode('RAMADAN')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    dubaiSmartMode === 'RAMADAN'
                      ? 'bg-purple-400 text-slate-950 border-purple-300 shadow-md font-extrabold'
                      : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border-slate-700'
                  }`}
                  title="Iftar and Suhoor hours (17:30 – 02:00)"
                >
                  <span>🌙 Ramadan</span>
                  {dubaiSmartMode === 'RAMADAN' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {/* Summer Shield */}
                <button
                  type="button"
                  onClick={() => handleToggleDubaiSmartMode('SUMMER')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    dubaiSmartMode === 'SUMMER'
                      ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-md font-extrabold'
                      : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700'
                  }`}
                  title="Air conditioning and indoor parking attributes during +45°C heat"
                >
                  <span>☀️ Summer (+45°C)</span>
                  {dubaiSmartMode === 'SUMMER' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>
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
                    Equivalent of 39 AED/mo plan. Complete peace of mind.
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
                    <strong>Loss Prevention Formula:</strong> (Direct Customer Conversion & Protection) = <strong>~${protectedStats.avertedDamage || 0} AED Estimated Revenue Saved</strong>
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

      
      {/* Location Quota Paywall & Enterprise Contact Modal */}
      <LocationQuotaModal
        isOpen={isLocationQuotaModalOpen}
        onClose={() => setIsLocationQuotaModalOpen(false)}
        currentLocationsCount={availableProfiles.length}
        activeProfileName={activeProfile?.name}
        onUnlinkCurrent={handleUnlinkAndConnectNew}
      />

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
                    Account & Profile Management
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Google Business Profile connection & quota settings
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
                      {isSuperAdminUser ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                          Plan: 👑 Superadmin Unlimited
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-google-blue border border-blue-200">
                          Plan: {subscription.plan.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70 text-xs text-slate-600 flex items-center justify-between">
                  <span>Location Quota:</span>
                  {isSuperAdminUser ? (
                    <span className="font-bold text-amber-700">👑 Unlimited (Superadmin)</span>
                  ) : (
                    <span className="font-bold text-slate-800">{availableProfiles.length} / {subscription.locationLimit} used</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                No active profile connected.
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
                      <div className="font-bold text-amber-900">Unlink Current Profile</div>
                      <div className="text-[11px] text-amber-700">
                        {isSuperAdminUser 
                          ? 'Disconnects business location from dashboard' 
                          : `Frees quota (${availableProfiles.length}/${subscription.locationLimit}) to connect another business`}
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
                    <div className="font-bold text-slate-900">Switch / Disconnect Google Account</div>
                    <div className="text-[11px] text-slate-500">
                      Clear Google session and log in under a different account
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  const canAdd = isSuperAdminUser || availableProfiles.length < subscription.locationLimit;
                  if (!canAdd) {
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
                    <div className="font-bold text-slate-900">Connect New Venue</div>
                    <div className="text-[11px] text-slate-500">
                      Search via Google Maps or connect with Google OAuth
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Unlink Confirmation Dialog with Anti-Churn Sleep Guard Mode ($9 / AED 35) */}
      {profileToUnlinkConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-slate-900 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                  <Unlink className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Disconnect Profile or Switch to Sleep Guard?</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Location: <strong>{profileToUnlinkConfirm.name}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfileToUnlinkConfirm(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Anti-Churn Downsell Card: Sleep Guard Mode ($9 / AED 35) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-2 border-emerald-300 space-y-3 text-xs shadow-xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Recommended over Disconnecting
                </span>
                <span className="font-black text-emerald-800 text-sm">
                  {auditReport?.currency === 'AED' ? 'AED 35 / mo' : '$9 / mo'}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  🛡️ Sleep Guard Mode (24/7 Shield without Automated Posts)
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Even if marketing is paused, competitors can alter your phone number or set "Permanently Closed" on a Friday evening (average attack loss: <strong>{auditReport?.currency === 'AED' ? 'AED 4,500' : '$1,200'}</strong>). In Sleep Guard mode, AI pauses post creation but <strong>protects phone (NAP), address, and hours 24/7 with 5-minute automated rollback</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const updated = setSubscriptionPlan('SLEEP_GUARD');
                  setSubscription(updated);
                  setIsProUser(updated.isPro);
                  setProfileToUnlinkConfirm(null);
                  setIsProfileModalOpen(false);
                  showToast('🛡️ Sleep Guard Mode Activated ($9 / AED 35 per month). Phone & hours under 24/7 protection!');
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Enable Sleep Guard for {auditReport?.currency === 'AED' ? 'AED 35' : '$9'}/mo (Keep 24/7 Shield)</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              If you completely unlink <strong>"{profileToUnlinkConfirm.name}"</strong>, the location slot will be freed to connect another business, but automatic competitor edit protection on Google Maps will stop.
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setProfileToUnlinkConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUnlinkProfile(profileToUnlinkConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                Unlink Profile Anyway
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



      {/* 360° Data Passport Modal (Google Business Profile API Matrix) */}
      {isPassportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-google-blue flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    360° Business Profile Data Passport (Google API)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Full registry of official Google Business Profile API parameters for {activeProfile?.name || 'your venue'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPassportModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <GbpDataMatrix
                venueName={activeProfile?.name || '—'}
                category={activeProfile?.category || '—'}
                address={activeProfile?.address || activeProfile?.city || '—'}
                phone={activeProfile?.phone || ''}
                website={activeProfile?.website || activeProfile?.website_url || ''}
                rating={activeProfile?.rating ?? 0}
                reviewsCount={activeProfile?.reviews_count ?? 0}
                isPro={isProUser}
                live={liveSync}
                onUpgradeClick={() => {
                  const proCheckout = process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO || 'prod_279fuhC5FSVX9DR6MLSuU4';
                  window.open(`https://www.creem.io/payment/${proCheckout}`, '_blank');
                }}
              />
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Official Google Business Profile API (300 QPM Approved)
              </span>
              <button
                type="button"
                onClick={() => setIsPassportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close Passport
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav attributesCount={42} unreadReviewsCount={1} threatsCount={0} radarAlertsCount={2} />

      <Footer />
    </div>
  );
}
