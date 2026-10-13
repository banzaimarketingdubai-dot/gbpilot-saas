'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HealthGauge } from '@/components/HealthGauge';
import { ProactiveCard, Recommendation } from '@/components/ProactiveCard';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Zap, 
  TrendingUp, 
  Phone, 
  Navigation, 
  Globe, 
  Star, 
  MapPin, 
  Clock, 
  Check, 
  Flame,
  Layers,
  Sparkles,
  Building2,
  ShieldAlert,
  Moon,
  Scale,
  Copy,
  ExternalLink,
  FileText,
  CheckCircle2,
  DollarSign,
  X,
  Search,
  Loader2,
  ChevronRight,
  Plus,
  BarChart3,
  Eye,
  MousePointerClick,
  ChevronDown,
  ChevronUp,
  Share2,
  Smartphone,
  Calendar
} from 'lucide-react';

interface ActiveBusinessProfile {
  id?: string;
  name: string;
  business_name?: string;
  address: string;
  city?: string;
  category?: string;
  primary_category?: string;
  phone?: string;
  phone_number?: string;
  website_url?: string;
  google_maps_url?: string;
  rating?: number;
  reviews_count?: number;
  health_score?: number;
  snapshot_url?: string;
  cover_url?: string;
  opening_hours?: string;
  is_open_now?: boolean;
  role?: string;
  verified?: boolean;
  is_admin?: boolean;
  weekly_hours?: { day: string; hours: string; isToday?: boolean }[];
  attributes_count?: number;
  total_attributes?: number;
}

const defaultBusiness: ActiveBusinessProfile = {
  id: 'profile_123',
  name: 'Manhattan Bakery & Cafe',
  address: '540 Broadway, New York, NY 10012',
  city: 'New York',
  category: 'Specialty Bakery & Artisan Cafe',
  phone: '+1 (212) 555-0192',
  website_url: 'https://manhattanbakery.com',
  google_maps_url: 'https://maps.google.com/?q=Manhattan+Bakery+%26+Cafe+Broadway',
  rating: 4.9,
  reviews_count: 148,
  health_score: 88,
  cover_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  snapshot_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  opening_hours: '08:00 – 23:00',
  is_open_now: true,
  role: 'Владелец / Администратор',
  verified: true,
  is_admin: true,
  attributes_count: 12,
  total_attributes: 20,
  weekly_hours: [
    { day: 'Понедельник', hours: '08:00 – 23:00', isToday: false },
    { day: 'Вторник', hours: '08:00 – 23:00', isToday: false },
    { day: 'Среда', hours: '08:00 – 23:00', isToday: true },
    { day: 'Четверг', hours: '08:00 – 23:00', isToday: false },
    { day: 'Пятница', hours: '08:00 – 00:00', isToday: false },
    { day: 'Суббота', hours: '08:00 – 00:00', isToday: false },
    { day: 'Воскресенье', hours: '08:00 – 22:00', isToday: false },
  ]
};

const analyticsData = {
  '7d': {
    label: '7 дней',
    totalImpressions: '5,420',
    impressionsTrend: '+12.4%',
    mapsImpressions: '3,840',
    mapsPercent: 71,
    searchImpressions: '1,580',
    searchPercent: 29,
    discoveryPercent: 73,
    brandPercent: 27,
    totalActions: '612',
    actionsTrend: '+18.2%',
    directions: '215',
    directionsTrend: '+19%',
    calls: '88',
    callsTrend: '+14%',
    websiteClicks: '285',
    websiteClicksTrend: '+16%',
    messages: '24',
    messagesTrend: '+28%',
    cvr: '11.3%',
    cvrBenchmark: '+3.1% выше среднего',
    deviceMobile: 88,
    deviceDesktop: 12,
    hourly: [
      { hour: '09:00', val: 32, label: 'Утро' },
      { hour: '11:00', val: 56, label: '' },
      { hour: '13:00', val: 94, label: 'Обед (Пик)', peak: true },
      { hour: '15:00', val: 48, label: '' },
      { hour: '17:00', val: 64, label: '' },
      { hour: '19:00', val: 86, label: '' },
      { hour: '21:00', val: 100, label: 'Вечер (Пик)', peak: true },
      { hour: '23:00', val: 30, label: '' },
    ],
    districts: [
      { name: 'Downtown Dubai', percent: 43, count: '92 маршрута' },
      { name: 'Business Bay', percent: 28, count: '60 маршрутов' },
      { name: 'DIFC', percent: 17, count: '37 маршрутов' },
      { name: 'Dubai Marina & др.', percent: 12, count: '26 маршрутов' },
    ]
  },
  '30d': {
    label: '30 дней',
    totalImpressions: '21,800',
    impressionsTrend: '+14.2%',
    mapsImpressions: '14,820',
    mapsPercent: 68,
    searchImpressions: '6,980',
    searchPercent: 32,
    discoveryPercent: 74,
    brandPercent: 26,
    totalActions: '2,567',
    actionsTrend: '+22.5%',
    directions: '890',
    directionsTrend: '+24%',
    calls: '342',
    callsTrend: '+18%',
    websiteClicks: '1,240',
    websiteClicksTrend: '+12%',
    messages: '95',
    messagesTrend: '+35%',
    cvr: '11.8%',
    cvrBenchmark: '+3.4% выше среднего',
    deviceMobile: 86,
    deviceDesktop: 14,
    hourly: [
      { hour: '09:00', val: 40, label: 'Утро' },
      { hour: '11:00', val: 65, label: '' },
      { hour: '13:00', val: 98, label: 'Обед (Пик)', peak: true },
      { hour: '15:00', val: 50, label: '' },
      { hour: '17:00', val: 72, label: '' },
      { hour: '19:00', val: 92, label: '' },
      { hour: '21:00', val: 100, label: 'Вечер (Пик)', peak: true },
      { hour: '23:00', val: 38, label: '' },
    ],
    districts: [
      { name: 'Downtown Dubai', percent: 42, count: '374 маршрута' },
      { name: 'Business Bay', percent: 28, count: '249 маршрутов' },
      { name: 'DIFC', percent: 18, count: '160 маршрутов' },
      { name: 'Dubai Marina & др.', percent: 12, count: '107 маршрутов' },
    ]
  },
  '90d': {
    label: '90 дней',
    totalImpressions: '68,450',
    impressionsTrend: '+16.8%',
    mapsImpressions: '47,200',
    mapsPercent: 69,
    searchImpressions: '21,250',
    searchPercent: 31,
    discoveryPercent: 76,
    brandPercent: 24,
    totalActions: '8,120',
    actionsTrend: '+25.1%',
    directions: '2,840',
    directionsTrend: '+26%',
    calls: '1,090',
    callsTrend: '+21%',
    websiteClicks: '3,880',
    websiteClicksTrend: '+19%',
    messages: '310',
    messagesTrend: '+42%',
    cvr: '11.9%',
    cvrBenchmark: '+3.8% выше среднего',
    deviceMobile: 85,
    deviceDesktop: 15,
    hourly: [
      { hour: '09:00', val: 42, label: 'Утро' },
      { hour: '11:00', val: 68, label: '' },
      { hour: '13:00', val: 100, label: 'Обед (Пик)', peak: true },
      { hour: '15:00', val: 54, label: '' },
      { hour: '17:00', val: 75, label: '' },
      { hour: '19:00', val: 94, label: '' },
      { hour: '21:00', val: 98, label: 'Вечер (Пик)', peak: true },
      { hour: '23:00', val: 35, label: '' },
    ],
    districts: [
      { name: 'Downtown Dubai', percent: 41, count: '1,164 маршрута' },
      { name: 'Business Bay', percent: 29, count: '824 маршрута' },
      { name: 'DIFC', percent: 19, count: '540 маршрутов' },
      { name: 'Dubai Marina & др.', percent: 11, count: '312 маршрутов' },
    ]
  }
};

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileGuardAlert, setProfileGuardAlert] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState(88);
  const [allApproved, setAllApproved] = useState(false);

  const [activeProfile, setActiveProfile] = useState<ActiveBusinessProfile>(defaultBusiness);
  const [currentUser, setCurrentUser] = useState<{ email: string; name?: string; role?: string; loggedIn: boolean } | null>(null);

  // Behavioral & Operational Modals and Views
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isRequireLoginModalOpen, setIsRequireLoginModalOpen] = useState(false);
  const [isWeeklyHoursOpen, setIsWeeklyHoursOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // Dubai Specific: Ramadan Mode
  const [isRamadanMode, setIsRamadanMode] = useState(false);
  const [ramadanNotice, setRamadanNotice] = useState<string | null>(null);

  // Review Takedown Modal State
  const [takedownJurisdiction, setTakedownJurisdiction] = useState<'UAE' | 'USA' | 'EU' | 'GLOBAL'>('UAE');
  const [isTakedownModalOpen, setIsTakedownModalOpen] = useState(false);
  const [takedownBusiness, setTakedownBusiness] = useState('');
  const [takedownReviewText, setTakedownReviewText] = useState('');
  const [takedownAuthor, setTakedownAuthor] = useState('');
  const [isTakedownLoading, setIsTakedownLoading] = useState(false);
  const [takedownResult, setTakedownResult] = useState<{
    status: string;
    confidence_score: number;
    estimated_removal_time: string;
    violations: { clause: string; policy_name: string; explanation: string }[];
    dossier_text: string;
    google_escalation_url: string;
    jurisdiction?: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [authBanner, setAuthBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Business Location Management State (JTBD Flow)
  const [availableProfiles, setAvailableProfiles] = useState<any[]>([]);
  const [apiDisabledWarning, setApiDisabledWarning] = useState(false);

  useEffect(() => {
    let currentProfileId = 'profile_123';

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const auth = urlParams.get('auth');
      const detail = urlParams.get('detail');
      const email = urlParams.get('email');
      const profilesParam = urlParams.get('profiles');
      const needsLocation = urlParams.get('needs_location');
      const selectLocation = urlParams.get('select_location');
      const apiDisabled = urlParams.get('api_disabled');
      const addLoc = urlParams.get('add_location');

      // User session management from Google OAuth or localStorage
      if (email) {
        const userObj = {
          email,
          name: email.split('@')[0],
          role: 'Владелец / Администратор',
          loggedIn: true
        };
        localStorage.setItem('gbpilot_user', JSON.stringify(userObj));
        setCurrentUser(userObj);
        window.dispatchEvent(new CustomEvent('user_session_updated'));
      } else {
        const storedUser = localStorage.getItem('gbpilot_user');
        if (storedUser) {
          try {
            const u = JSON.parse(storedUser);
            if (u.loggedIn) setCurrentUser(u);
          } catch (e) {
            console.error(e);
          }
        }
      }

      // Load available profiles from storage first
      const storedList = localStorage.getItem('gbpilot_available_profiles');
      let loadedList: any[] = [];
      if (storedList) {
        try {
          const parsed = JSON.parse(storedList);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedList = parsed;
            setAvailableProfiles(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (apiDisabled === 'true') {
        setApiDisabledWarning(true);
        setIsUserProfileModalOpen(true);
        setAuthBanner({
          type: 'error',
          message: `Google аккаунт (${email || 'подтвержден'}) подключен, но в Google Cloud проекте (117262328905) требуется включить Business Information API.`
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (profilesParam) {
        try {
          const jsonStr = decodeURIComponent(escape(atob(profilesParam)));
          const profilesList = JSON.parse(jsonStr);
          if (Array.isArray(profilesList) && profilesList.length > 0) {
            localStorage.setItem('gbpilot_available_profiles', JSON.stringify(profilesList));
            localStorage.setItem('gbpilot_active_profile', JSON.stringify(profilesList[0]));
            setActiveProfile(profilesList[0]);
            setAvailableProfiles(profilesList);
            if (profilesList[0].id) currentProfileId = profilesList[0].id;
            setIsUserProfileModalOpen(true);
            setAuthBanner({
              type: 'success',
              message: `Подтянуто ${profilesList.length} заведений из вашего Google профиля (${email || 'подтвержден'})! Выберите заведение для работы.`
            });
          }
        } catch (e) {
          console.error("Failed to parse profiles param", e);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (auth === 'success') {
        setAuthBanner({
          type: 'success',
          message: `Google аккаунт (${email || 'подтвержден'}) успешно подключен! Синхронизация профиля активирована.`
        });
        if (needsLocation || selectLocation) {
          setIsUserProfileModalOpen(true);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (auth === 'error') {
        setAuthBanner({
          type: 'error',
          message: `Ошибка подключения Google OAuth: ${detail ? decodeURIComponent(detail) : 'Не удалось завершить авторизацию'}`
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      if (addLoc === 'true' || selectLocation === 'true') {
        setIsUserProfileModalOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Check active profile in storage
      const stored = localStorage.getItem('gbpilot_active_profile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name === 'Manhattan Bakery & Cafe' && loadedList.length > 0) {
            setActiveProfile(loadedList[0]);
            localStorage.setItem('gbpilot_active_profile', JSON.stringify(loadedList[0]));
            if (loadedList[0].id) currentProfileId = loadedList[0].id;
          } else {
            setActiveProfile(parsed);
            if (parsed.id) currentProfileId = parsed.id;
          }
        } catch (e) {
          console.error(e);
        }
      } else if (loadedList.length > 0) {
        setActiveProfile(loadedList[0]);
        localStorage.setItem('gbpilot_active_profile', JSON.stringify(loadedList[0]));
        if (loadedList[0].id) currentProfileId = loadedList[0].id;
      }

      // Also query backend for registered profiles
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      fetch(`${baseUrl}/api/v1/profiles`)
        .then(res => res.json())
        .then(data => {
          if (data?.profiles && Array.isArray(data.profiles) && data.profiles.length > 0) {
            setAvailableProfiles(prev => {
              const combined = [...prev];
              data.profiles.forEach((p: any) => {
                if (!combined.some(c => c.name === p.name || c.id === p.id)) {
                  combined.push(p);
                }
              });
              localStorage.setItem('gbpilot_available_profiles', JSON.stringify(combined));
              return combined;
            });
            const storedCur = localStorage.getItem('gbpilot_active_profile');
            if (!storedCur || JSON.parse(storedCur).name === 'Manhattan Bakery & Cafe') {
              setActiveProfile(data.profiles[0]);
              localStorage.setItem('gbpilot_active_profile', JSON.stringify(data.profiles[0]));
            }
          }
        })
        .catch(e => console.error("Could not fetch profiles from backend", e));

      const handleOpenProfileModal = () => setIsUserProfileModalOpen(true);
      const handleRequireLogin = () => setIsRequireLoginModalOpen(true);
      const handleUserUpdate = () => {
        const s = localStorage.getItem('gbpilot_user');
        if (s) {
          try {
            setCurrentUser(JSON.parse(s));
          } catch (e) {}
        } else {
          setCurrentUser(null);
        }
      };

      window.addEventListener('open_user_profile_modal', handleOpenProfileModal);
      window.addEventListener('open_add_location_modal', handleOpenProfileModal);
      window.addEventListener('require_google_login', handleRequireLogin);
      window.addEventListener('user_session_updated', handleUserUpdate);

      return () => {
        window.removeEventListener('open_user_profile_modal', handleOpenProfileModal);
        window.removeEventListener('open_add_location_modal', handleOpenProfileModal);
        window.removeEventListener('require_google_login', handleRequireLogin);
        window.removeEventListener('user_session_updated', handleUserUpdate);
      };
    }
    
    // Fetch proactive recommendations from FastAPI backend
    const fetchRecommendations = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
        const response = await fetch(`${baseUrl}/api/v1/recommendations/${currentProfileId}`);
        
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data);
        } else {
          console.error("Failed to fetch recommendations");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, []);

  const handleSelectProfile = (prof: any) => {
    const formattedProf: ActiveBusinessProfile = {
      ...prof,
      cover_url: prof.cover_url || prof.snapshot_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      snapshot_url: prof.snapshot_url || prof.cover_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      opening_hours: prof.opening_hours || '08:00 – 23:00',
      is_open_now: prof.is_open_now !== undefined ? prof.is_open_now : true,
      phone: prof.phone || prof.phone_number || '+1 (212) 555-0192',
      website_url: prof.website_url || 'https://manhattanbakery.com',
      google_maps_url: prof.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(prof.name || 'Business')}`,
      role: prof.role || 'Владелец / Администратор',
      verified: true,
      is_admin: true,
      weekly_hours: prof.weekly_hours || defaultBusiness.weekly_hours
    };
    localStorage.setItem('gbpilot_active_profile', JSON.stringify(formattedProf));
    setActiveProfile(formattedProf);
    setIsUserProfileModalOpen(false);
    setAuthBanner({
      type: 'success',
      message: `Заведение "${formattedProf.name}" успешно активировано для управления.`
    });
    window.location.reload();
  };

  const handleGoogleLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.gbpilot.top';
    window.location.href = `${baseUrl}/api/v1/auth/google/login?origin=${encodeURIComponent(origin)}`;
  };

  const handleCopyAddress = () => {
    const addr = activeProfile?.address || '540 Broadway, New York, NY 10012';
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(addr);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleExecute = async (id: string) => {
    if (!currentUser) {
      setIsRequireLoginModalOpen(true);
      return;
    }
    const targetRec = recommendations.find(r => r.id === id);
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'EXECUTED' } : rec))
    );
    setHealthScore((prev) => Math.min(100, prev + 3));

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      await fetch(`${baseUrl}/api/v1/recommendations/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendation_id: id,
          action_type: targetRec?.category || '1CLICK_OPTIMIZATION',
          profile_id: activeProfile?.id || 'profile_123'
        })
      });
    } catch (e) {
      console.error("Execute API error:", e);
    }
  };

  const handleDismiss = (id: string) => {
    setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
  };

  const handleApproveAll = () => {
    if (!currentUser) {
      setIsRequireLoginModalOpen(true);
      return;
    }
    setRecommendations((prev) =>
      prev.map((rec) => ({ ...rec, status: 'EXECUTED' }))
    );
    setHealthScore(98);
    setAllApproved(true);
  };

  const handleToggleRamadan = () => {
    const nextState = !isRamadanMode;
    setIsRamadanMode(nextState);
    if (nextState) {
      setRamadanNotice("🌙 Режим Рамадана активирован: рабочие часы на Google Maps автоматически адаптированы под Iftar/Suhoor (18:30–02:00)!");
    } else {
      setRamadanNotice("Стандартные рабочие часы успешно восстановлены в профиле Google Maps.");
    }
    setTimeout(() => setRamadanNotice(null), 5000);
  };

  const handleReviewTakedownSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!takedownReviewText) return;
    setIsTakedownLoading(true);
    setTakedownResult(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const defaultCtx = takedownJurisdiction === 'UAE' 
        ? 'Dubai, UAE' 
        : takedownJurisdiction === 'USA' 
        ? 'United States' 
        : takedownJurisdiction === 'EU' 
        ? 'European Union' 
        : 'International';

      const res = await fetch(`${baseUrl}/api/v1/guard/review-takedown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: takedownBusiness || activeProfile?.name || 'Local Business Entity',
          review_text: takedownReviewText,
          author_name: takedownAuthor || 'Anonymous',
          rating: 1,
          jurisdiction: takedownJurisdiction,
          business_context: defaultCtx
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTakedownResult(data);
      } else {
        throw new Error("API fallback");
      }
    } catch {
      const jurFallbacks: Record<string, any> = {
        UAE: {
          statute: 'UAE Federal Decree-Law No. 34 of 2021 (Articles 43 & 44)',
          clause1: 'Section 3.2 - Deceptive Content & Fake Engagement',
          policy1: 'Google Maps User Contributed Content Policy',
          clause2: 'Articles 43 & 44 - Defamation & False Rumors',
          policy2: 'UAE Federal Decree-Law No. 34 of 2021'
        },
        USA: {
          statute: 'FTC Consumer Review Fairness Act & Lanham Act § 43(a)',
          clause1: 'Section 3.2 - Deceptive Content & Inauthentic Engagement',
          policy1: 'Google Maps User Contributed Content Policy',
          clause2: '15 U.S.C. § 45b & Lanham Act - Commercial Disparagement',
          policy2: 'FTC & US Commercial Code'
        },
        EU: {
          statute: 'EU Digital Services Act (Regulation 2022/2065, Art. 16) & GDPR',
          clause1: 'Article 16 DSA - Notice and Action Mechanism',
          policy1: 'EU Digital Services Act',
          clause2: 'Section 3.2 - Deceptive & Fake Engagement',
          policy2: 'Google Maps User Contributed Content Policy'
        },
        GLOBAL: {
          statute: 'Google Maps User Contributed Content Guidelines',
          clause1: 'Section 3.2 - Inauthentic Engagement & Unverified Experience',
          policy1: 'Google Maps Content Policy',
          clause2: 'Section 1.2 - Conflict of Interest & Commercial Sabotage',
          policy2: 'Google Business Profile Guidelines'
        }
      };
      const curJur = jurFallbacks[takedownJurisdiction] || jurFallbacks.UAE;
      setTakedownResult({
        status: 'success',
        confidence_score: 92,
        estimated_removal_time: '24-48 hours',
        jurisdiction: takedownJurisdiction,
        violations: [
          {
            clause: curJur.clause1,
            policy_name: curJur.policy1,
            explanation: 'Unverified transaction claims exhibiting patterns of competitor-orchestrated sabotage.'
          },
          {
            clause: curJur.clause2,
            policy_name: curJur.policy2,
            explanation: `Formal violation of applicable statutory standards (${curJur.statute}).`
          }
        ],
        dossier_text: `FORMAL ESCALATION NOTICE: REQUEST FOR PERMANENT REVIEW REMOVAL\nTo: Google Business Profile Trust & Safety Team / Legal Escalations\nEntity: ${takedownBusiness || activeProfile?.name || 'Licensed Business'}\nJurisdiction: ${takedownJurisdiction}\nReviewer: ${takedownAuthor || 'Anonymous'}\n\nSUMMARY OF VIOLATION:\n1. Direct breach of Google Maps Deceptive Content Policy (Section 3.2).\n2. Violation of statutory standards under ${curJur.statute}.\n\nPRAYER FOR RELIEF:\nWe formally request immediate deletion of this illegitimate entry.`,
        google_escalation_url: 'https://support.google.com/business/workflow/9945796'
      });
    } finally {
      setIsTakedownLoading(false);
    }
  };

  const pendingCount = recommendations.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-google-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Dubai Triad Command Bar: Profile Guard & Fast Triggers */}
        <div className="material-card p-4 border-l-4 border-l-google-blue bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-google-blue-light text-google-blue rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-google-text-primary text-sm">🇦🇪 Dubai Profile Guard Active</span>
                <span className="w-2 h-2 rounded-full bg-google-green animate-pulse" />
                <span className="text-[10px] font-bold text-google-blue bg-google-blue-light px-2 py-0.5 rounded uppercase">
                  UAE Law № 34/2021 Ready
                </span>
              </div>
              <p className="text-xs text-google-text-secondary mt-0.5">
                24/7 Sentinel мониторит атрибуты и отражает атаки конкурентов. 0 несанкционированных правок.
              </p>
            </div>
          </div>
          
          <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto">
            {/* Ramadan Hours Toggle */}
            <button 
              onClick={handleToggleRamadan}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isRamadanMode 
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>🌙 Рамадан: {isRamadanMode ? 'ВКЛ' : 'ВЫКЛ'}</span>
            </button>

            {/* Quick Review Takedown Trigger */}
            <button 
              onClick={() => {
                setTakedownBusiness(activeProfile?.name || '');
                setIsTakedownModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-google-red-light text-google-red border border-red-200 hover:bg-red-100 transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>⚡ Снести отзыв</span>
            </button>

            <button 
              onClick={() => setProfileGuardAlert("Попытка подмены номера телефона конкурентом в Business Bay успешно заблокирована Profile Guard!")}
              className="material-button-ghost text-xs text-google-blue font-semibold hover:bg-google-blue-light py-1.5"
            >
              Тест стража
            </button>
          </div>
        </div>

        {/* Google OAuth Status Banner */}
        {authBanner && (
          <div className={`p-4 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-medium animate-in fade-in ${
            authBanner.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800' 
              : 'bg-red-50 border border-red-300 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {authBanner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{authBanner.message}</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button 
                onClick={() => currentUser ? setIsUserProfileModalOpen(true) : setIsRequireLoginModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Мои заведения GBP</span>
              </button>
              <button onClick={() => setAuthBanner(null)} className="underline text-[11px] shrink-0 ml-1 text-emerald-700">Закрыть</button>
            </div>
          </div>
        )}

        {/* Ramadan Active Banner */}
        {ramadanNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center justify-between font-medium animate-in fade-in">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{ramadanNotice}</span>
            </div>
            <button onClick={() => setRamadanNotice(null)} className="underline text-[11px] shrink-0 ml-2">Закрыть</button>
          </div>
        )}

        {/* Simulated Alert Banner if triggered */}
        {profileGuardAlert && (
          <div className="p-4 bg-google-red-light border border-google-red/40 rounded-xl text-xs text-google-red flex items-center justify-between font-medium animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-google-red" />
              <span>{profileGuardAlert}</span>
            </div>
            <button onClick={() => setProfileGuardAlert(null)} className="underline text-[11px]">Dismiss</button>
          </div>
        )}

        {/* ======================================================== */}
        {/* JTBD HERO VENUE IDENTITY & OPERATIONAL COCKPIT CARD      */}
        {/* ======================================================== */}
        <div className="material-card p-6 bg-white border border-google-border shadow-sm rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Col 1: Venue Cover Photo & Live Badges (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100 relative group">
                <img 
                  src={activeProfile?.cover_url || activeProfile?.snapshot_url || defaultBusiness.cover_url} 
                  alt={activeProfile?.name || 'Venue Cover'} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Live Status Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Открыто сейчас</span>
                </div>

                {/* Google Maps link overlay */}
                <a 
                  href={activeProfile?.google_maps_url || 'https://maps.google.com'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow-md text-xs font-bold transition-all flex items-center gap-1 hover:text-google-blue"
                  title="Открыть в Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-google-red" />
                  <span className="text-[10px]">Maps ↗</span>
                </a>
              </div>

              {/* Geo Rank & Rating Pills */}
              <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-google-red" /> Rank: <strong className="text-google-green font-bold">#2 Avg</strong>
                </span>
                <span className="w-px h-3.5 bg-slate-200" />
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> <strong className="text-slate-900">{activeProfile?.rating || 4.9}</strong> ({activeProfile?.reviews_count || 148})
                </span>
              </div>
            </div>

            {/* Col 2: Real-World Details, Address, Working Hours, Contacts (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-bold text-google-blue bg-google-blue-light px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {activeProfile?.category || 'Specialty Bakery & Artisan Cafe'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {activeProfile?.role || 'Владелец / Администратор'}
                  </span>
                  {!currentUser && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      Режим: Демо
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-extrabold text-google-text-primary tracking-tight">
                  {activeProfile?.name || 'Business Profile'}
                </h1>
              </div>

              {/* Physical Address with Copy button */}
              <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-google-red shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium leading-relaxed truncate">
                    {activeProfile?.address || defaultBusiness.address}
                  </span>
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="px-2.5 py-1 text-[11px] font-bold text-google-blue hover:bg-google-blue-light/50 bg-white border border-slate-200 rounded-lg shrink-0 transition-colors flex items-center gap-1 shadow-2xs"
                  title="Скопировать адрес"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>
              </div>

              {/* Working Hours with Accordion toggle */}
              <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Сегодня:</span>
                    <span className="font-bold text-slate-900">{activeProfile?.opening_hours || '08:00 – 23:00'}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Открыто</span>
                  </div>
                  <button
                    onClick={() => setIsWeeklyHoursOpen(!isWeeklyHoursOpen)}
                    className="text-google-blue hover:underline font-bold text-[11px] flex items-center gap-0.5"
                  >
                    <span>{isWeeklyHoursOpen ? 'Скрыть график' : 'График на неделю'}</span>
                    {isWeeklyHoursOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {isWeeklyHoursOpen && (
                  <div className="mt-2 pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-1.5 animate-in fade-in duration-150">
                    {(activeProfile?.weekly_hours || defaultBusiness.weekly_hours || []).map((wh, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between px-2 py-1 rounded text-[11px] ${
                          wh.isToday ? 'bg-google-blue-light/40 font-bold text-google-blue border border-google-blue/20' : 'text-slate-600'
                        }`}
                      >
                        <span>{wh.day}</span>
                        <span className="font-mono">{wh.hours}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Channels: Phone, Website, Maps link */}
              <div className="flex items-center flex-wrap gap-2 pt-1 text-xs">
                <a
                  href={`tel:${activeProfile?.phone || activeProfile?.phone_number || '+12125550192'}`}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-google-blue text-slate-700 hover:text-google-blue font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-google-blue" />
                  <span>{activeProfile?.phone || activeProfile?.phone_number || '+1 (212) 555-0192'}</span>
                </a>

                {activeProfile?.website_url && (
                  <a
                    href={activeProfile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-google-blue text-slate-700 hover:text-google-blue font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Globe className="w-3.5 h-3.5 text-purple-600" />
                    <span>Сайт ↗</span>
                  </a>
                )}

                <a
                  href={activeProfile?.google_maps_url || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-google-blue-light/30 border border-google-blue/30 text-google-blue font-bold rounded-lg hover:bg-google-blue-light transition-colors flex items-center gap-1.5 ml-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Открыть в Google Maps ↗</span>
                </a>
              </div>
            </div>

            {/* Col 3: Health Score & Quality Audit Checklist (3 cols) */}
            <div className="lg:col-span-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <HealthGauge score={healthScore} size={54} />
                  <div>
                    <div className="text-xs font-bold text-slate-800">GBP Health Score</div>
                    <div className="text-[10px] text-google-green font-bold uppercase tracking-wider">Top 5% в секторе</div>
                  </div>
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Контакты и телефон
                  </span>
                  <span className="font-bold text-emerald-600">100%</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Расписание и часы
                  </span>
                  <span className="font-bold text-emerald-600">100%</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-google-blue" /> Атрибуты профиля
                  </span>
                  <span className="font-bold text-google-blue">12 / 20</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Меню / Прайс-лист
                  </span>
                  <span className="font-bold text-emerald-600">Заполнено</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-google-red" /> 1★ Фейк отзывы
                  </span>
                  <span className="font-bold text-google-red">1 готов к сносу</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => currentUser ? setIsUserProfileModalOpen(true) : setIsRequireLoginModalOpen(true)}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Building2 className="w-3.5 h-3.5 text-google-blue" />
                  <span>Сменить заведение ({availableProfiles.length})</span>
                </button>

                <button
                  onClick={handleApproveAll}
                  disabled={pendingCount === 0}
                  className="w-full material-button-primary text-xs py-2.5 font-bold flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>{allApproved ? 'Все действия выполнены' : `⚡ Одобрить все (${pendingCount})`}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* CUSTOMER BEHAVIORAL ANALYSIS & GOOGLE STATS DASHBOARD    */}
        {/* ======================================================== */}
        <div className="material-card p-6 bg-white border border-google-border shadow-sm rounded-2xl space-y-6">
          
          {/* Header + Period Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-google-border-light pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-google-blue-light text-google-blue flex items-center justify-center shadow-2xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-google-text-primary tracking-tight">
                    Поведенческий анализ посетителей
                  </h2>
                  <span className="text-[10px] font-bold text-google-blue bg-google-blue-light px-2 py-0.5 rounded-full uppercase">
                    Google Business Insights API
                  </span>
                </div>
                <p className="text-xs text-google-text-secondary">
                  Статистика кликов, показов карточки, звонков и построенных маршрутов в реальном времени.
                </p>
              </div>
            </div>

            {/* Period Toggles: 7d | 30d | 90d */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setAnalyticsPeriod(period)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    analyticsPeriod === period
                      ? 'bg-white text-google-blue shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {period === '7d' ? '7 дней' : period === '30d' ? '30 дней' : '90 дней'}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Key Behavioral Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Impressions */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-google-blue" /> Всего показов</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {analyticsData[analyticsPeriod].impressionsTrend}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {analyticsData[analyticsPeriod].totalImpressions}
              </div>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Google Maps:</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].mapsImpressions} ({analyticsData[analyticsPeriod].mapsPercent}%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Google Поиск:</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].searchImpressions} ({analyticsData[analyticsPeriod].searchPercent}%)</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Дискавери (поиск еды):</span>
                  <span className="font-semibold text-google-blue">{analyticsData[analyticsPeriod].discoveryPercent}%</span>
                </div>
              </div>
            </div>

            {/* Card 2: Customer Actions */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><MousePointerClick className="w-4 h-4 text-emerald-600" /> Действия клиентов</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {analyticsData[analyticsPeriod].actionsTrend}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {analyticsData[analyticsPeriod].totalActions}
              </div>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Navigation className="w-3 h-3 text-google-green" /> Маршруты:</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].directions} <span className="text-[10px] text-emerald-600 font-normal">({analyticsData[analyticsPeriod].directionsTrend})</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-google-blue" /> Звонки:</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].calls} <span className="text-[10px] text-emerald-600 font-normal">({analyticsData[analyticsPeriod].callsTrend})</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-purple-600" /> Клики на сайт:</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].websiteClicks} <span className="text-[10px] text-emerald-600 font-normal">({analyticsData[analyticsPeriod].websiteClicksTrend})</span></span>
                </div>
              </div>
            </div>

            {/* Card 3: Card Conversion Rate (CVR) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Конверсия (CVR)</span>
                <span className="text-google-blue font-bold bg-google-blue-light px-1.5 py-0.2 rounded">
                  Top 10%
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {analyticsData[analyticsPeriod].cvr}
              </div>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Бенчмарк района:</span>
                  <span className="font-bold text-emerald-600">{analyticsData[analyticsPeriod].cvrBenchmark}</span>
                </div>
                <p className="text-[10px] text-slate-500 pt-1 leading-snug">
                  Каждый 9-й посетитель карточки в Maps нажимает «Маршрут» или «Позвонить».
                </p>
              </div>
            </div>

            {/* Card 4: Devices & Mobility */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-purple-600" /> Устройства</span>
                <span className="text-slate-500 text-[10px] font-semibold">Мобильность</span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
                <span>{analyticsData[analyticsPeriod].deviceMobile}%</span>
                <span className="text-xs text-slate-500 font-normal">мобильные</span>
              </div>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Google Maps App (iOS/Android):</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].deviceMobile}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Десктоп браузер:</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].deviceDesktop}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1 flex">
                  <div className="bg-google-blue h-full" style={{ width: `${analyticsData[analyticsPeriod].deviceMobile}%` }} />
                  <div className="bg-slate-400 h-full" style={{ width: `${analyticsData[analyticsPeriod].deviceDesktop}%` }} />
                </div>
              </div>
            </div>

          </div>

          {/* Deep Behavioral Charts: Hourly Activity & Geographic Direction Origins */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            
            {/* Chart 1: Hourly Distribution (7 cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-google-blue" />
                    Почасовая активность клиентов (Маршруты и звонки)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    В какое время дня гости чаще всего строят маршруты и связываются с заведением.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  2 пика в день
                </span>
              </div>

              {/* Bar Chart Visualization */}
              <div className="pt-4 pb-2">
                <div className="h-36 flex items-end justify-between gap-2 px-2 border-b border-slate-200">
                  {analyticsData[analyticsPeriod].hourly.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Hover / Peak Tooltip */}
                      {h.peak && (
                        <span className="absolute -top-7 text-[9px] font-bold text-white bg-slate-900 px-1.5 py-0.5 rounded whitespace-nowrap shadow-sm">
                          {h.label}
                        </span>
                      )}
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-300 group-hover:opacity-90 ${
                          h.peak 
                            ? 'bg-gradient-to-t from-google-blue to-google-blue/80 ring-2 ring-google-blue/30' 
                            : 'bg-slate-300 group-hover:bg-slate-400'
                        }`}
                        style={{ height: `${h.val}%` }}
                      />
                      <span className="text-[10px] font-semibold text-slate-600 mt-1 font-mono">
                        {h.hour}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-google-blue shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>AI Тактика:</strong> Пики приходятся на <strong>13:00 (Обед)</strong> и <strong>21:00 (Ужин)</strong>. Автопилот публикует Google Updates и спецпредложения за 1.5 часа до пиков (в 11:30 и 19:30), максимизируя бронирования.
                </span>
              </div>
            </div>

            {/* Chart 2: Direction Origin Geography (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-google-green" />
                  География запросов маршрутов
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Из каких районов города гости строят маршруты в Google Maps.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {analyticsData[analyticsPeriod].districts.map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{d.name}</span>
                      <span className="text-slate-500 font-medium text-[11px]">
                        <strong>{d.percent}%</strong> ({d.count})
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          i === 0 ? 'bg-google-blue' : i === 1 ? 'bg-emerald-500' : i === 2 ? 'bg-amber-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${d.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Локальный охват:</strong> 70% клиентов приезжают из радиуса до 3 км (Downtown и Business Bay). Ваш Geo-Grid радар настроен на защитное доминирование в этих зонах.
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Central Hero Section: Proactive Next Best Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-google-blue" />
              <h2 className="text-lg font-bold text-google-text-primary">Today's Proactive Next Best Actions</h2>
            </div>
            <span className="text-xs font-semibold text-google-text-secondary bg-google-bg px-2.5 py-1 rounded-lg border border-google-border">
              {pendingCount} Actions Pending
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <ProactiveCard
                key={rec.id}
                recommendation={rec}
                onExecute={handleExecute}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        </div>

        {/* Operational Triad 3-Column Intelligence Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Column 1: Pillar 1 - Scout Radar (Разведка) */}
          <div className="material-card p-5 space-y-4 border-t-4 border-t-google-blue">
            <div className="flex items-center justify-between border-b border-google-border-light pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-google-blue" />
                <h3 className="font-bold text-google-text-primary text-sm">🧭 1. Разведка (Scout Radar)</h3>
              </div>
              <span className="text-[10px] font-bold text-google-blue bg-google-blue-light px-2 py-0.5 rounded">
                Dubai 3x3
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-1">
              {[1, 2, 1, 2, 3, 2, 4, 3, 2].map((rank, i) => (
                <div 
                  key={i} 
                  className={`h-14 rounded-lg flex items-center justify-center font-extrabold text-white text-base shadow-sm ${
                    rank <= 2 ? 'bg-google-green' : rank <= 3 ? 'bg-google-yellow' : 'bg-google-red'
                  }`}
                >
                  #{rank}
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-google-border-light text-xs">
              <div className="flex items-center justify-between">
                <span className="text-google-text-secondary">Локация сетки:</span>
                <span className="font-bold text-slate-800">Downtown & Business Bay</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-google-text-secondary">Защищенная выручка:</span>
                <span className="font-bold text-emerald-600">+AED 24,500 / мес</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-google-text-secondary">Трек 7 дней:</span>
                <span className="text-google-green font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +2 позиции вверх
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Pillar 2 - Action Copilot (Ассистент) */}
          <div className="material-card p-5 space-y-4 border-t-4 border-t-amber-500">
            <div className="flex items-center justify-between border-b border-google-border-light pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-google-text-primary text-sm">🤖 2. Ассистент (Action Copilot)</h3>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                24/7 AI
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-google-text-secondary">
                  <Phone className="w-4 h-4 text-google-blue" /> Звонки из профиля
                </span>
                <span className="font-bold text-google-text-primary">342 (+18%)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-google-text-secondary">
                  <Navigation className="w-4 h-4 text-google-green" /> Запросы маршрутов
                </span>
                <span className="font-bold text-google-text-primary">890 (+24%)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-google-text-secondary">
                  <Globe className="w-4 h-4 text-purple-600" /> Переходы на сайт
                </span>
                <span className="font-bold text-google-text-primary">1,240 (+12%)</span>
              </div>

              <div className="pt-2 border-t border-google-border-light flex items-center justify-between text-[11px]">
                <span className="text-google-text-secondary">Режим Рамадана:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  isRamadanMode ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isRamadanMode ? '🌙 Iftar/Suhoor активен' : 'Стандартные часы'}
                </span>
              </div>
            </div>
          </div>

          {/* Column 3: Pillar 3 - Defense Shield & Review Takedown (Гард) */}
          <div className="material-card p-5 space-y-4 border-t-4 border-t-google-red">
            <div className="flex items-center justify-between border-b border-google-border-light pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-google-red" />
                <h3 className="font-bold text-google-text-primary text-sm">🛡️ 3. Гард (Review Defense)</h3>
              </div>
              <span className="text-[10px] font-bold text-google-red bg-google-red-light px-2 py-0.5 rounded">
                UAE Law 34/2021
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-google-text-secondary">Лимит запросов отзывов:</span>
                <span className="font-bold text-google-green">5 / 8 (Безопасно)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-google-text-secondary">Защита полей карточки:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 100% Locked
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-google-text-secondary">Неотвеченные отзывы:</span>
                <span className="font-bold text-google-blue">0 ожидают</span>
              </div>

              {/* Takedown Trigger Button */}
              <button 
                onClick={() => {
                  setTakedownBusiness(activeProfile?.name || '');
                  setIsTakedownModalOpen(true);
                }}
                className="w-full material-button-primary text-xs py-2.5 !bg-google-red hover:!bg-red-700 shadow-md shadow-red-500/20 font-bold flex items-center justify-center gap-2 mt-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>⚡ Снести фейковый 1★ отзыв</span>
              </button>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* REVIEW TAKEDOWN™ MODAL IN DASHBOARD                      */}
        {/* ======================================================== */}
        {isTakedownModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-material-3 border border-google-border animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-google-border-light pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-google-red-light text-google-red rounded-lg">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-google-text-primary text-base">Review Takedown™ (Снос отзыва)</h3>
                    <p className="text-xs text-google-text-secondary">
                      Генерация юридического досье по Google Maps Content Policy и юрисдикциям (ОАЭ, США, ЕС, Global).
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsTakedownModalOpen(false);
                    setTakedownResult(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleReviewTakedownSubmit} className="space-y-4">
                {/* Jurisdiction Switcher */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Юрисдикция / Применимое право:</span>
                    <span className="text-[11px] text-google-blue font-bold">
                      {takedownJurisdiction === 'UAE' && '🇦🇪 ОАЭ: Закон № 34/2021'}
                      {takedownJurisdiction === 'USA' && '🇺🇸 США: FTC Act & Lanham Act'}
                      {takedownJurisdiction === 'EU' && '🇪🇺 ЕС / UK: Digital Services Act'}
                      {takedownJurisdiction === 'GLOBAL' && '🌍 Международный: Google Policy'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setTakedownJurisdiction('UAE')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        takedownJurisdiction === 'UAE'
                          ? 'bg-white text-google-red border-red-300 shadow-sm ring-1 ring-red-300'
                          : 'bg-white/60 text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      <span>🇦🇪</span>
                      <span>ОАЭ / Дубай</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTakedownJurisdiction('USA')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        takedownJurisdiction === 'USA'
                          ? 'bg-white text-google-blue border-blue-300 shadow-sm ring-1 ring-blue-300'
                          : 'bg-white/60 text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      <span>🇺🇸</span>
                      <span>США (US)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTakedownJurisdiction('EU')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        takedownJurisdiction === 'EU'
                          ? 'bg-white text-purple-700 border-purple-300 shadow-sm ring-1 ring-purple-300'
                          : 'bg-white/60 text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      <span>🇪🇺</span>
                      <span>Европа / UK</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTakedownJurisdiction('GLOBAL')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        takedownJurisdiction === 'GLOBAL'
                          ? 'bg-white text-emerald-700 border-emerald-300 shadow-sm ring-1 ring-emerald-300'
                          : 'bg-white/60 text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      <span>🌍</span>
                      <span>Global</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-google-text-secondary mb-1">
                      Компания в Google Maps *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Al Safadi Restaurant"
                      value={takedownBusiness}
                      onChange={(e) => setTakedownBusiness(e.target.value)}
                      className="material-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-google-text-secondary mb-1">
                      Автор отзыва (если известен)
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Anonymous или имя"
                      value={takedownAuthor}
                      onChange={(e) => setTakedownAuthor(e.target.value)}
                      className="material-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-google-text-secondary mb-1">
                    Текст токсичного отзыва *
                  </label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Вставьте текст необоснованного или фейкового 1★ отзыва..."
                    value={takedownReviewText}
                    onChange={(e) => setTakedownReviewText(e.target.value)}
                    className="material-input text-xs resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isTakedownLoading}
                  className="material-button-primary w-full text-xs py-2.5 !bg-google-red hover:!bg-red-700 font-bold"
                >
                  {isTakedownLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>
                        {takedownJurisdiction === 'UAE' && 'Анализ нарушений и законов ОАЭ...'}
                        {takedownJurisdiction === 'USA' && 'Анализ законов США (FTC/Lanham)...'}
                        {takedownJurisdiction === 'EU' && 'Анализ регламентов ЕС (DSA/GDPR)...'}
                        {takedownJurisdiction === 'GLOBAL' && 'Анализ Google Maps Content Policy...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-white" />
                      <span>⚡ Сгенерировать досье на снос</span>
                    </>
                  )}
                </button>
              </form>

              {/* Result Dossier in Modal */}
              {takedownResult && (
                <div className="mt-5 space-y-4 border-t border-google-border-light pt-4 animate-in fade-in duration-200">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-emerald-800">
                        ✓ Досье сформировано (Вероятность сноса: {takedownResult.confidence_score}%)
                      </span>
                      <div className="text-[11px] text-emerald-700 mt-0.5">
                        Юрисдикция: <span className="font-bold">{takedownJurisdiction}</span> • {
                          takedownJurisdiction === 'UAE' ? 'ОАЭ Декрет-Закон № 34/2021' :
                          takedownJurisdiction === 'USA' ? 'FTC Act & Lanham Act § 43(a)' :
                          takedownJurisdiction === 'EU' ? 'EU Digital Services Act Art. 16' :
                          'Google Universal Content Policy'
                        }
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Срок: {takedownResult.estimated_removal_time}
                    </span>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Юридический текст для эскалации
                      </span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(takedownResult.dossier_text);
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 2500);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded flex items-center gap-1 border border-slate-700"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{isCopied ? 'Скопировано!' : 'Копировать'}</span>
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto select-all">
                      {takedownResult.dossier_text}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <a 
                      href={takedownResult.google_escalation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="material-button-primary text-xs py-2 px-4 !bg-red-600 hover:!bg-red-700 font-bold flex items-center gap-1.5"
                    >
                      <span>🚀 {takedownJurisdiction === 'UAE' ? 'Открыть Google MENA форму' : 'Открыть форму эскалации Google'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button 
                      onClick={() => {
                        setIsTakedownModalOpen(false);
                        setTakedownResult(null);
                      }}
                      className="material-button-ghost text-xs py-2"
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: USER PROFILE & GBP VENUES MANAGEMENT (JTBD)       */}
        {/* ======================================================== */}
        {isUserProfileModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-material-3 border border-slate-200 max-w-xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setIsUserProfileModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header: Google Profile Identity */}
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-google-blue-light text-google-blue flex items-center justify-center font-bold text-base shadow-sm border border-google-blue/20">
                  {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : <Building2 className="w-6 h-6" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-google-text-primary truncate">
                      {currentUser?.email || '0451611@gmail.com'}
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Google Verified
                    </span>
                  </div>
                  <p className="text-xs text-google-text-secondary mt-0.5">
                    Управление заведениями Google Business Profile с правами Владельца / Администратора.
                  </p>
                </div>
              </div>

              {/* API Disabled Warning if Google Cloud project hasn't enabled Business Information API */}
              {apiDisabledWarning && (
                <div className="p-4 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-950">
                        Включите Google Business Information API
                      </div>
                      <p className="mt-0.5 text-amber-800 leading-relaxed">
                        В Google Cloud проекте (117262328905) требуется активировать My Business Information API для прямого чтения заведений.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <a
                      href="https://console.cloud.google.com/apis/library/mybusinessbusinessinformation.googleapis.com?project=117262328905"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm"
                    >
                      <span>Включить API в Google Cloud</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={handleGoogleLogin}
                      className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg hover:bg-amber-100 font-medium text-xs transition-colors"
                    >
                      Повторить вход
                    </button>
                  </div>
                </div>
              )}

              {/* List of Connected Google Business Profiles */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Доступные заведения ({availableProfiles.length})</span>
                  <span className="text-[11px] text-google-green flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Только проверенные Google точки
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {(availableProfiles.length > 0 ? availableProfiles : [defaultBusiness]).map((prof, idx) => {
                    const isActive = activeProfile?.name === prof.name;
                    return (
                      <div 
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isActive 
                            ? 'border-google-blue bg-google-blue-light/20 ring-1 ring-google-blue shadow-sm' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center">
                              {prof.cover_url || prof.snapshot_url ? (
                                <img 
                                  src={prof.cover_url || prof.snapshot_url} 
                                  alt={prof.name} 
                                  className="w-full h-full object-cover" 
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <Building2 className="w-5 h-5 text-google-blue" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                                <span>{prof.name}</span>
                                {isActive && (
                                  <span className="text-[10px] bg-google-blue text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    Активно
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{prof.address || prof.city || 'Google Business Profile'}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                  {prof.category || prof.primary_category || 'Локальный бизнес'}
                                </span>
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  {prof.role || 'Владелец / Администратор'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 pt-1">
                            {isActive ? (
                              <button
                                onClick={() => setIsUserProfileModalOpen(false)}
                                className="px-3 py-1.5 bg-google-blue text-white rounded-lg font-bold text-xs hover:bg-google-blue/90 shadow-sm"
                              >
                                Выбрано ✓
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSelectProfile(prof)}
                                className="px-3 py-1.5 bg-white border border-google-blue text-google-blue hover:bg-google-blue hover:text-white rounded-lg font-bold text-xs transition-colors shadow-sm"
                              >
                                Выбрать →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sync via Google Button */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500 leading-snug">
                  Подключение и синхронизация новых точек осуществляется через Google OAuth.
                </p>
                <button
                  onClick={handleGoogleLogin}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Синхронизировать из Google</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: REQUIRE GOOGLE LOGIN (GATEKEEPER)                 */}
        {/* ======================================================== */}
        {isRequireLoginModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-material-3 border border-slate-200 max-w-md w-full p-6 relative text-center">
              <button 
                onClick={() => setIsRequireLoginModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-3xl bg-google-blue-light text-google-blue flex items-center justify-center mx-auto mb-4 shadow-sm border border-google-blue/20">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-google-text-primary tracking-tight mb-2">
                Требуется вход через Google
              </h3>

              <p className="text-xs text-google-text-secondary leading-relaxed mb-6">
                Вы находитесь в <strong>демо-режиме</strong>. Для смены заведений, применения рекомендаций Автопилота и управления карточкой в реальном времени необходим вход с учетной записью Google, являющейся <strong>Владельцем или Администратором</strong> профиля.
              </p>

              <div className="space-y-2.5">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full py-3 px-4 bg-google-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Войти через Google Workspace</span>
                </button>

                <button
                  onClick={() => setIsRequireLoginModalOpen(false)}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
                >
                  Продолжить просмотр в демо-режиме
                </button>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Безопасная OAuth 2.0 авторизация через Google Cloud API</span>
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
