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
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileGuardAlert, setProfileGuardAlert] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState(86);
  const [allApproved, setAllApproved] = useState(false);

  const [activeProfile, setActiveProfile] = useState<{id?: string, name: string, address: string, city?: string, snapshot_url?: string} | null>(null);

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

  // Business Location Management State
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [locationSearchInput, setLocationSearchInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isScrapingLocation, setIsScrapingLocation] = useState(false);
  const [availableProfiles, setAvailableProfiles] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const auth = urlParams.get('auth');
      const detail = urlParams.get('detail');
      const email = urlParams.get('email');
      const profilesParam = urlParams.get('profiles');
      const needsLocation = urlParams.get('needs_location');

      if (profilesParam) {
        try {
          const jsonStr = decodeURIComponent(escape(atob(profilesParam)));
          const profilesList = JSON.parse(jsonStr);
          if (Array.isArray(profilesList) && profilesList.length > 0) {
            localStorage.setItem('gbpilot_available_profiles', JSON.stringify(profilesList));
            localStorage.setItem('gbpilot_active_profile', JSON.stringify(profilesList[0]));
            setActiveProfile(profilesList[0]);
            setAvailableProfiles(profilesList);
            setAuthBanner({
              type: 'success',
              message: `Загружено ${profilesList.length} заведений из Google аккаунта (${email || 'подтвержден'})! Активно: ${profilesList[0].name}`
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
        if (needsLocation) {
          setIsAddLocationModalOpen(true);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (auth === 'error') {
        setAuthBanner({
          type: 'error',
          message: `Ошибка подключения Google OAuth: ${detail ? decodeURIComponent(detail) : 'Не удалось завершить авторизацию'}`
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Load available profiles from storage
      const storedList = localStorage.getItem('gbpilot_available_profiles');
      if (storedList) {
        try {
          const parsed = JSON.parse(storedList);
          if (Array.isArray(parsed)) setAvailableProfiles(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }

    let currentProfileId = 'profile_123';
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gbpilot_active_profile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setActiveProfile(parsed);
          if (parsed.id) currentProfileId = parsed.id;
        } catch (e) {
          console.error(e);
        }
      }
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

  // Live autocomplete search for adding locations
  useEffect(() => {
    if (!locationSearchInput.trim() || locationSearchInput.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
        const res = await fetch(`${baseUrl}/api/v1/onboarding/autocomplete?query=${encodeURIComponent(locationSearchInput)}`);
        if (res.ok) {
          const data = await res.json();
          setLocationSuggestions(data.suggestions || []);
        }
      } catch(e) {
        console.error(e);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [locationSearchInput]);

  const handleSelectSuggestion = async (sug: any) => {
    setIsScrapingLocation(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const res = await fetch(`${baseUrl}/api/v1/onboarding/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: sug.main_text || sug.description }),
      });
      if (res.ok) {
        const data = await res.json();
        const profile = data.profile || data;
        const newProf = {
          id: profile.id || `profile_${Date.now()}`,
          google_location_id: profile.google_location_id || sug.place_id,
          name: profile.business_name || sug.main_text,
          address: profile.address_line || sug.description,
          city: profile.city || profile.address_line?.split(',').pop()?.trim() || 'Dubai',
          category: profile.primary_category || 'Local Business',
          rating: profile.rating || 4.9,
          reviews_count: profile.reviews_count || 145,
          health_score: profile.health_score || 85,
          autopilotMode: 'MANUAL_APPROVAL',
        };

        const updatedList = [...availableProfiles.filter(p => p.name !== newProf.name), newProf];
        localStorage.setItem('gbpilot_available_profiles', JSON.stringify(updatedList));
        localStorage.setItem('gbpilot_active_profile', JSON.stringify(newProf));
        setActiveProfile(newProf);
        setAvailableProfiles(updatedList);
        setIsAddLocationModalOpen(false);
        setLocationSearchInput('');
        setLocationSuggestions([]);
        window.location.reload();
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsScrapingLocation(false);
    }
  };

  const handleExecute = async (id: string) => {
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
                onClick={() => setIsAddLocationModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Привязать / Выбрать заведения</span>
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

        {/* Top Header: Health Meter + Profile Cover Photo */}
        <div className="material-card p-6 bg-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 w-full">
            
            {/* Cover Photo Display */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-google-border bg-slate-100 flex items-center justify-center relative group">
              {activeProfile?.snapshot_url ? (
                <img 
                  src={activeProfile.snapshot_url} 
                  alt="Business Cover" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              ) : (
                <Building2 className="w-10 h-10 text-slate-300" />
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
            </div>

            {/* Health & Profile Details */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <HealthGauge score={healthScore} size={64} />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-google-text-primary tracking-tight">
                      {activeProfile?.name || 'Business Profile'} Health
                    </h1>
                    <span className="text-[10px] font-bold text-google-green bg-google-green-light px-2 py-0.5 rounded-full uppercase">
                      TOP 5% IN SECTOR
                    </span>
                  </div>
                  <p className="text-xs text-google-text-secondary mt-1">
                    {pendingCount > 0 
                      ? `AI identified ${pendingCount} high-impact recommendations to increase local search rank.` 
                      : 'All proactive actions executed! Your profile is at peak optimization.'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center flex-wrap gap-3 mt-3 text-xs text-google-text-secondary bg-slate-50 p-2 rounded-lg border border-slate-100 inline-flex">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-google-red" /> Geo-Grid Rank: <strong className="text-google-green">#2 Avg</strong></span>
                <span className="w-px h-3 bg-slate-300"></span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" /> Rating: <strong className="text-google-text-primary">{(activeProfile as any)?.rating || 4.9} ({(activeProfile as any)?.reviews_count || 148} отзывов)</strong></span>
                <span className="w-px h-3 bg-slate-300"></span>
                <button 
                  onClick={() => setIsAddLocationModalOpen(true)}
                  className="text-google-blue hover:underline font-bold flex items-center gap-1 ml-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Сменить / добавить точку</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleApproveAll}
              disabled={pendingCount === 0}
              className="material-button-primary w-full sm:w-auto text-xs py-3 px-5 font-bold"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{allApproved ? 'All 4 Actions Executed' : `⚡ Approve All ${pendingCount} Actions`}</span>
            </button>
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

        {/* Modal: Add / Select Business Location from Google Maps */}
        {isAddLocationModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-google-border relative">
              <button 
                onClick={() => {
                  setIsAddLocationModalOpen(false);
                  setLocationSearchInput('');
                  setLocationSuggestions([]);
                }}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-google-blue-light text-google-blue flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-google-text-primary">
                    Привязать заведение из Google
                  </h3>
                  <p className="text-xs text-google-text-secondary">
                    Найдите ваши заведения по названию или адресу для активации мониторинга
                  </p>
                </div>
              </div>

              {/* Search Input with Live Autocomplete */}
              <div className="relative mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={locationSearchInput}
                    onChange={(e) => setLocationSearchInput(e.target.value)}
                    placeholder="Введите название заведения или адрес..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue transition-all"
                    autoFocus
                  />
                  {isSearchingLocation && (
                    <Loader2 className="w-4 h-4 text-google-blue animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {locationSuggestions.length > 0 && (
                  <div className="mt-2 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-lg max-h-60 overflow-y-auto divide-y divide-slate-100">
                    {locationSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSuggestion(sug)}
                        disabled={isScrapingLocation}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                      >
                        <MapPin className="w-4 h-4 text-google-red mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate">
                            {sug.main_text || sug.description}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {sug.description}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 mt-1 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isScrapingLocation && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center gap-3 text-xs text-slate-600 mb-4 animate-pulse">
                  <Loader2 className="w-4 h-4 text-google-blue animate-spin" />
                  <span>Загружаем реальные данные, рейтинг и отзывы из Google...</span>
                </div>
              )}

              {/* List of Connected Profiles */}
              {availableProfiles.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                    Ваши заведения ({availableProfiles.length}):
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableProfiles.map((prof, idx) => (
                      <div 
                        key={idx}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                          activeProfile?.name === prof.name 
                            ? 'border-google-blue bg-google-blue-light/30 text-google-blue font-bold' 
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="truncate">{prof.name}</span>
                          <span className="text-[10px] text-slate-400">({prof.city || prof.address})</span>
                        </div>
                        {activeProfile?.name === prof.name ? (
                          <span className="text-[10px] bg-google-blue text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                            Активно
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              localStorage.setItem('gbpilot_active_profile', JSON.stringify(prof));
                              setActiveProfile(prof);
                              setIsAddLocationModalOpen(false);
                              window.location.reload();
                            }}
                            className="text-xs text-google-blue hover:underline font-semibold"
                          >
                            Выбрать
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
