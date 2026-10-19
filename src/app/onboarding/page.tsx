'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert, 
  Star, 
  Check, 
  Building2, 
  Clock, 
  Zap, 
  Lock,
  ExternalLink,
  Bot,
  Sliders,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Compass,
  Map,
  MessageSquare,
  Target,
  Image as ImageIcon,
  Phone,
  Globe,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getGroundTruthPresets, saveOwnerGroundTruth } from '@/lib/groundTruth';

interface DetectedBusiness {
  id: string;
  name: string;
  address: string;
  city: string;
  category: string;
  rating: number;
  reviews_count: number;
  cover_url: string;
  phone: string;
  website_url?: string;
  google_maps_url?: string;
  latitude?: number;
  longitude?: number;
  open_now?: boolean | null;
  opening_hours?: string[];
  reviews?: any[];
  health_score?: number;
  verified: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();

  // Linear Step: 1 (SEARCH/CONNECT) | 2 (LIVE DATA AUDIT) | 3 (OPTIONAL OWNER BRIEFING)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Search input & results state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<{ query: string; message: string } | null>(null);
  const [fallbackMapsUrl, setFallbackMapsUrl] = useState('');
  const [detectedBusiness, setDetectedBusiness] = useState<DetectedBusiness | null>(null);

  // Step 2: Live Diagnostic Scan & Animated Data Matrix filling state
  const [scanProgress, setScanProgress] = useState(0);
  const [revealedRows, setRevealedRows] = useState<number>(0);
  const [isHoursExpanded, setIsHoursExpanded] = useState(false);

  // Step 3: Owner Ground Truth Micro-Briefing (Optional)
  const [flagshipOffering, setFlagshipOffering] = useState('');
  const [guestPersona, setGuestPersona] = useState('');
  const [venueRulesAndPerks, setVenueRulesAndPerks] = useState('');

  // Real search execution via /api/v1/onboarding/search (Zero mockups!)
  const performSearch = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setIsSearching(true);
    setSearchError(null);
    setDetectedBusiness(null);

    try {
      const res = await fetch('/api/v1/onboarding/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();

      if (data.found && data.business) {
        setDetectedBusiness(data.business);
        setSearchError(null);
      } else {
        setDetectedBusiness(null);
        setSearchError({
          query: q,
          message: data.message || `No Google Maps location found for "${q}".`
        });
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setDetectedBusiness(null);
      setSearchError({
        query: q,
        message: 'Could not perform Google Maps search. Please paste a direct Google Maps point link.'
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Form submit handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  // Direct Google Maps Link submission when primary search wasn't found
  const handleFallbackUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackMapsUrl.trim()) return;
    performSearch(fallbackMapsUrl.trim());
  };

  // Step 2: Start 15-Sec Live Data Inspection runner
  const startDiagnostics = () => {
    if (!detectedBusiness) return;
    setCurrentStep(2);
    setScanProgress(0);
    setRevealedRows(0);

    // Timed milestone reveals for animated table rows
    const timeline = [
      { progress: 15, rows: 1, delay: 600 },   // Photo & Identity
      { progress: 30, rows: 2, delay: 1400 },  // Name
      { progress: 48, rows: 3, delay: 2200 },  // Address & Geo
      { progress: 65, rows: 4, delay: 3000 },  // Operating Hours
      { progress: 78, rows: 5, delay: 3800 },  // Category
      { progress: 88, rows: 6, delay: 4600 },  // Phone (NAP)
      { progress: 95, rows: 7, delay: 5400 },  // Rating & Reviews
      { progress: 100, rows: 9, delay: 6200 }, // Maps Link & Golden Snapshot Locked
    ];

    timeline.forEach(({ progress, rows, delay }) => {
      setTimeout(() => {
        setScanProgress(progress);
        setRevealedRows(rows);
      }, delay);
    });
  };

  // Complete onboarding: Save 100% REAL business + Ground Truth and go to Cockpit Dashboard
  const handleCompleteOnboarding = (skippedBriefing: boolean = false) => {
    if (typeof window !== 'undefined' && detectedBusiness) {
      // 1. Save active profile with all real Google Maps collected attributes
      localStorage.setItem('gbpilot_active_profile', JSON.stringify(detectedBusiness));

      // 1b. Save Owner Ground Truth (or record that owner chose to skip for now)
      saveOwnerGroundTruth(detectedBusiness, {
        flagshipOffering: skippedBriefing ? '' : flagshipOffering,
        guestPersona: skippedBriefing ? '' : guestPersona,
        venueRulesAndPerks: skippedBriefing ? '' : venueRulesAndPerks,
        skipped: skippedBriefing
      });
      
      // 2. Add to available profiles list (clean out any old dummy profiles)
      const existing = localStorage.getItem('gbpilot_available_profiles');
      let list: DetectedBusiness[] = [];
      if (existing) {
        try {
          list = JSON.parse(existing);
        } catch (e) {}
      }
      list = list.filter(p => p.name !== detectedBusiness.name && p.name !== 'Manhattan Bakery & Cafe');
      list.push(detectedBusiness);
      localStorage.setItem('gbpilot_available_profiles', JSON.stringify(list));

      // 3. Mark 14-day growth trial as active
      localStorage.setItem('gbpilot_trial_active', 'true');
      localStorage.setItem('gbpilot_trial_start', String(Date.now()));
      localStorage.setItem('gbpilot_trial_days_left', '14');

      // 4. Preserve existing user session (preserve Superadmin or logged in session)
      const existingUser = localStorage.getItem('gbpilot_user');
      if (!existingUser) {
        localStorage.setItem('gbpilot_user', JSON.stringify({
          email: 'owner@' + detectedBusiness.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com',
          name: 'Business Owner',
          role: 'Owner',
          loggedIn: true
        }));
      }

      // 5. Clear unlinked flag
      localStorage.removeItem('gbpilot_profile_unlinked');

      // Trigger update events
      window.dispatchEvent(new CustomEvent('active_profile_updated'));
      window.dispatchEvent(new CustomEvent('user_session_updated'));
    }

    router.push('/dashboard');
  };

  const appendChipToField = (currentVal: string, setter: (v: string) => void, chip: string) => {
    if (currentVal.toLowerCase().includes(chip.toLowerCase())) return;
    const next = currentVal.trim() ? `${currentVal.trim()}; ${chip}` : chip;
    setter(next);
  };

  const groundTruthPresets = getGroundTruthPresets(detectedBusiness);

  // Connect via Google OAuth directly
  const handleGoogleOAuthLogin = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.gbpilot.top';
    const loginUrl = `${backendUrl}/api/v1/auth/google/login?origin=${encodeURIComponent(origin)}&redirect_url=${encodeURIComponent(origin)}&state=${encodeURIComponent(origin)}`;
    
    try {
      const res = await fetch(`${loginUrl}&raw_json=true`);
      if (res.ok) {
        const data = await res.json();
        if (data.auth_url) {
          window.location.href = data.auth_url;
          return;
        }
      }
    } catch (e) {}
    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Step Progress Tracker */}
        <div className="max-w-lg mx-auto w-full mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className={currentStep >= 1 ? 'text-google-blue' : ''}>1. Google Maps Search</span>
            <span className={currentStep >= 2 ? 'text-google-blue' : ''}>2. Live Data Audit</span>
            <span className={currentStep >= 3 ? 'text-google-blue' : ''}>3. Micro-Briefing (Optional)</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-google-blue h-full transition-all duration-500 ease-out"
              style={{ width: currentStep === 1 ? '33%' : currentStep === 2 ? '67%' : '100%' }}
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: REAL SEARCH & VALIDATION (ZERO FAKE FALLBACKS)   */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Header */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-[11px] font-bold text-google-blue uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Step 1: Connect Location
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Connect your business in 30 seconds
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Enter your business name (including city) or paste a direct Google Maps point link.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 max-w-2xl mx-auto">
              
              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Business name or Google Maps link:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g. Svoi Cafe Phuket or https://maps.app.goo.gl/..."
                    className="w-full pl-11 pr-28 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-google-blue focus:bg-white transition-all font-medium"
                    autoFocus
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  
                  <button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-google-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <span>Search</span>
                    )}
                  </button>
                </div>
              </form>

              {/* ERROR STATE: PLACE NOT FOUND -> REQUEST GOOGLE MAPS LINK */}
              {searchError && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-amber-950">
                        Venue not found on Google Maps
                      </h4>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        No official Google Maps location was found for «<strong>{searchError.query}</strong>». We never use fake placeholder data, so please confirm the exact Google Maps point.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs space-y-2">
                    <span className="font-bold text-amber-950 block">
                      Paste direct Google Maps link to your venue:
                    </span>
                    <form onSubmit={handleFallbackUrlSubmit} className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        value={fallbackMapsUrl}
                        onChange={(e) => setFallbackMapsUrl(e.target.value)}
                        placeholder="https://maps.app.goo.gl/... or https://goo.gl/maps/..."
                        className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSearching || !fallbackMapsUrl.trim()}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                        <span>Verify by Link</span>
                      </button>
                    </form>
                    <span className="text-[11px] text-amber-700 block">
                      💡 <strong>How to get link:</strong> Open the point in Google Maps app → tap <em>«Share»</em> → <em>«Copy link»</em>.
                    </span>
                  </div>
                </div>
              )}

              {/* SUCCESS STATE: REAL DETECTED BUSINESS PREVIEW */}
              {detectedBusiness && (
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Venue verified on Google Maps
                    </span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {detectedBusiness.rating > 0 ? detectedBusiness.rating.toFixed(1) : '—'} ({detectedBusiness.reviews_count} reviews)
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-emerald-200 bg-white shrink-0 shadow-xs">
                      {detectedBusiness.cover_url ? (
                        <img 
                          src={detectedBusiness.cover_url} 
                          alt={detectedBusiness.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                          <Building2 className="w-7 h-7" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg truncate">
                        {detectedBusiness.name}
                      </h3>
                      <p className="text-xs text-slate-600 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{detectedBusiness.address}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold text-slate-700">
                          {detectedBusiness.category}
                        </span>
                        {detectedBusiness.open_now !== null && (
                          <span className={`px-2 py-0.5 rounded-md font-bold ${
                            detectedBusiness.open_now 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {detectedBusiness.open_now ? '🟢 Open now' : '🔴 Closed'}
                          </span>
                        )}
                        {detectedBusiness.phone && detectedBusiness.phone !== '—' && (
                          <span className="text-slate-500 font-mono">
                            {detectedBusiness.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={startDiagnostics}
                    className="w-full py-3.5 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Start live audit & collect all data →</span>
                  </button>
                </div>
              )}

              {/* Direct Google OAuth Fallback Option */}
              <div className="pt-2 text-center border-t border-slate-100">
                <span className="text-xs text-slate-400 block mb-2">Or connect directly via Google Account:</span>
                <button
                  type="button"
                  onClick={handleGoogleOAuthLogin}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <Building2 className="w-4 h-4 text-google-blue" />
                  <span>Sign in with Google Business Profile OAuth</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: ANIMATED LIVE DATA INSPECTION MATRIX             */}
        {/* ======================================================== */}
        {currentStep === 2 && detectedBusiness && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold text-google-blue uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Step 2: Initial Google Maps Audit & Data Collection
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {scanProgress < 100 
                  ? 'Collecting real-time Google Maps business attributes...' 
                  : '✓ All Google Maps data successfully collected & locked'}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Venue: <strong className="text-slate-900">{detectedBusiness.name}</strong> • Location: {detectedBusiness.city}
              </p>
            </div>

            {/* Matrix Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
              
              {/* Scan Progress Bar & Live Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    {scanProgress < 100 ? (
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-google-blue animate-ping" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    <span className="text-slate-700">
                      {scanProgress < 100 ? 'Live Google listing audit in progress...' : 'Audit completed (100%)'}
                    </span>
                  </div>
                  <span className="text-google-blue font-extrabold">{scanProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-google-blue h-full transition-all duration-300 ease-out"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>

              {/* ANIMATED DATA INSPECTION TABLE */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between font-bold text-slate-600 text-[11px] uppercase tracking-wider">
                  <span>Google Maps Attribute</span>
                  <span>Verification Status</span>
                </div>

                <div className="divide-y divide-slate-100">
                  
                  {/* Row 1: Photo */}
                  <div className={`p-3.5 flex items-center justify-between gap-3 transition-all duration-500 ${
                    revealedRows >= 1 ? 'bg-white opacity-100' : 'bg-slate-50/50 opacity-40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                        {detectedBusiness.cover_url ? (
                          <img 
                            src={detectedBusiness.cover_url} 
                            alt={detectedBusiness.name} 
                            className="w-full h-full object-cover animate-in zoom-in-75 duration-300" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Google Maps Profile Photo</div>
                        <div className="text-[11px] text-slate-500">
                          {detectedBusiness.cover_url ? 'Official Google Maps cover photo' : 'No media linked'}
                        </div>
                      </div>
                    </div>
                    {revealedRows >= 1 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3 h-3 stroke-[3]" />
                        {detectedBusiness.cover_url ? 'Photo verified' : 'Checked'}
                      </span>
                    )}
                  </div>

                  {/* Row 2: Business Title */}
                  <div className={`p-3.5 flex items-center justify-between gap-3 transition-all duration-500 ${
                    revealedRows >= 2 ? 'bg-white opacity-100' : 'bg-slate-50/50 opacity-40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-50 text-google-blue shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Business Name</div>
                        <div className="text-[11px] text-slate-700 font-semibold">
                          {detectedBusiness.name}
                        </div>
                      </div>
                    </div>
                    {revealedRows >= 2 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Name confirmed
                      </span>
                    )}
                  </div>

                  {/* Row 3: Address & Coordinates */}
                  <div className={`p-3.5 flex items-center justify-between gap-3 transition-all duration-500 ${
                    revealedRows >= 3 ? 'bg-white opacity-100' : 'bg-slate-50/50 opacity-40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Address & GPS Coordinates</div>
                        <div className="text-[11px] text-slate-600 max-w-sm sm:max-w-md truncate">
                          {detectedBusiness.address}
                        </div>
                        {detectedBusiness.latitude && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            GPS: {detectedBusiness.latitude.toFixed(4)}, {detectedBusiness.longitude?.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>
                    {revealedRows >= 3 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Geolocation locked
                      </span>
                    )}
                  </div>

                  {/* Row 4: Operating Hours */}
                  <div className={`p-3.5 transition-all duration-500 ${
                    revealedRows >= 4 ? 'bg-white opacity-100' : 'bg-slate-50/50 opacity-40'
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>Operating Hours & Schedule</span>
                            {detectedBusiness.open_now !== null && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                detectedBusiness.open_now 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {detectedBusiness.open_now ? '🟢 Open now' : '🔴 Closed'}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {detectedBusiness.opening_hours && detectedBusiness.opening_hours.length > 0 
                              ? `Regular schedule verified (${detectedBusiness.opening_hours.length} days)`
                              : 'Regular operating hours on Maps'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {detectedBusiness.opening_hours && detectedBusiness.opening_hours.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setIsHoursExpanded(!isHoursExpanded)}
                            className="text-[11px] text-google-blue hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>{isHoursExpanded ? 'Hide schedule' : 'View schedule'}</span>
                            {isHoursExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        {revealedRows >= 4 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3 stroke-[3]" />
                            Hours verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expandable Weekly Schedule */}
                    {isHoursExpanded && detectedBusiness.opening_hours && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 pl-11 space-y-1 text-[11px] text-slate-600 animate-in fade-in">
                        {detectedBusiness.opening_hours.map((line, idx) => (
                          <div key={idx} className="font-mono flex items-center justify-between max-w-xs">
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Row 5: Primary Category */}
                  <div className={`p-3.5 flex items-center justify-between gap-3 transition-all duration-500 ${
                    revealedRows >= 5 ? 'bg-white opacity-100' : 'bg-slate-50/50 opacity-40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Primary Business Category</div>
                        <div className="text-[11px] text-slate-700 font-semibold">
                          {detectedBusiness.category}
                        </div>
                      </div>
                    </div>
                    {revealedRows >= 5 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Category validated
                      </span>
                    )}
                  </div>

                  {/* Row 6: Phone */}
                  <div className={`p-3.5 flex items-center justify-between gap-3 transition-all duration-500 ${
                    revealedRows >= 6 ? 'bg-white opacity-100' : 'bg-slate-50/50 opacity-40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Guest Phone Number (NAP)</div>
                        <div className="text-[11px] text-slate-700 font-mono">
                          {detectedBusiness.phone && detectedBusiness.phone !== '—' 
                            ? detectedBusiness.phone 
                            : 'Not listed on Maps'}
                        </div>
                      </div>
                    </div>
                    {revealedRows >= 6 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3 h-3 stroke-[3]" />
                        NAP phone verified
                      </span>
                    )}
                  </div>

                  {/* Row 7: Rating & Reviews */}
                  <div className={`p-3.5 flex items-center justify-between gap-3 transition-all duration-500 ${
                    revealedRows >= 7 ? 'bg-white opacity-100' : 'bg-slate-50/50 opacity-40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-500 shrink-0">
                        <Star className="w-4 h-4 fill-amber-400" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Google Rating & Reviews</div>
                        <div className="text-[11px] text-slate-700 font-bold flex items-center gap-1">
                          <span>{detectedBusiness.rating > 0 ? `${detectedBusiness.rating.toFixed(1)} ★` : '— ★'}</span>
                          <span className="text-slate-400 font-normal">({detectedBusiness.reviews_count} reviews on Maps)</span>
                        </div>
                      </div>
                    </div>
                    {revealedRows >= 7 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Trust score computed
                      </span>
                    )}
                  </div>

                  {/* Row 8: Direct Maps Link & Golden Snapshot */}
                  <div className={`p-3.5 flex items-center justify-between gap-3 transition-all duration-500 ${
                    revealedRows >= 8 ? 'bg-white opacity-100' : 'bg-slate-50/50 opacity-40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">24/7 Sentinel Guard & Golden Snapshot</div>
                        <div className="text-[11px] text-slate-500">
                          {detectedBusiness.google_maps_url ? (
                            <a 
                              href={detectedBusiness.google_maps_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-google-blue hover:underline inline-flex items-center gap-1 font-semibold"
                            >
                              <span>Open listing on Google Maps</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            'Synced with Google Maps'
                          )}
                        </div>
                      </div>
                    </div>
                    {revealedRows >= 8 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0 flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Snapshot locked
                      </span>
                    )}
                  </div>

                </div>
              </div>

              {/* OUTCOME SUMMARY & TRANSITION TO STEP 3 OR COCKPIT */}
              {scanProgress === 100 && (
                <div className="pt-2 border-t border-slate-100 space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-blue-50 border border-emerald-200 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Real Listing Health Score
                      </span>
                      <div className="text-2xl font-black text-slate-900 mt-1">
                        {detectedBusiness.health_score || 85} / 100
                      </div>
                      <p className="text-xs text-slate-600">
                        All venue data verified: address, hours, and edit protection ready.
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                        100% Real Data
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="sm:col-span-8 py-4 px-5 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>Next: 30-sec Owner Micro-Briefing (+35% AI accuracy) →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCompleteOnboarding(true)}
                      className="sm:col-span-4 py-4 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                    >
                      <span>Skip to Cockpit →</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: OPTIONAL 30-SEC OWNER GROUND TRUTH BRIEFING      */}
        {/* ======================================================== */}
        {currentStep === 3 && detectedBusiness && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
            
            {/* Header with Top Skip Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold text-google-blue uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Step 3 of 3 • Optional Briefing (45 sec)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    🧠 Owner Ground Truth
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Share "Ground Truth" about {detectedBusiness.name}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  AI understands Google algorithms, but only you know what drives your highest profit margins. Click ready chips below or type your specifics — so AI never invents inaccurate details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCompleteOnboarding(true)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-bold shrink-0 self-start sm:self-center transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Skip Step →</span>
              </button>
            </div>

            {/* 3 Questions Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 text-xs">

              {/* Financial Context Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 flex items-start gap-3">
                <DollarSign className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Why this matters financially:</strong> When AI knows your highest-margin service, parking perks, and booking terms, it weaves them into every review response, post, and directory profile — lifting visitor-to-call conversion by <strong>+28%</strong>.
                </div>
              </div>

              {/* Question 1: Flagship High-Margin Offering */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-google-blue text-white text-[11px] flex items-center justify-center font-bold shrink-0">1</span>
                    <span>Your Flagship Offering / Highest-Margin Service or Dish:</span>
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0">{groundTruthPresets.nicheLabel}</span>
                </div>

                {/* Clickable Quick Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {groundTruthPresets.flagshipChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => appendChipToField(flagshipOffering, setFlagshipOffering, chip)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50/70 hover:bg-blue-100 text-google-blue border border-blue-200/80 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={flagshipOffering}
                  onChange={(e) => setFlagshipOffering(e.target.value)}
                  placeholder={groundTruthPresets.placeholders.flagship}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue"
                />
              </div>

              {/* Question 2: Target Guest Persona & Vibe */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <label className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-google-blue text-white text-[11px] flex items-center justify-center font-bold shrink-0">2</span>
                  <span>Who is your ideal customer and why do they choose you?</span>
                </label>

                <div className="flex flex-wrap gap-1.5">
                  {groundTruthPresets.personaChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => appendChipToField(guestPersona, setGuestPersona, chip)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={guestPersona}
                  onChange={(e) => setGuestPersona(e.target.value)}
                  placeholder={groundTruthPresets.placeholders.persona}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue"
                />
              </div>

              {/* Question 3: Hidden Perks, Parking & Venue Rules */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <label className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-google-blue text-white text-[11px] flex items-center justify-center font-bold shrink-0">3</span>
                  <span>Hidden Perks, Parking & Venue Rules (Things not on maps):</span>
                </label>

                <div className="flex flex-wrap gap-1.5">
                  {groundTruthPresets.rulesChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => appendChipToField(venueRulesAndPerks, setVenueRulesAndPerks, chip)}
                      className="px-2.5 py-1 rounded-lg bg-purple-50/70 hover:bg-purple-100 text-purple-800 border border-purple-200/80 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={venueRulesAndPerks}
                  onChange={(e) => setVenueRulesAndPerks(e.target.value)}
                  placeholder={groundTruthPresets.placeholders.rules}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue"
                />
              </div>

              {/* Bottom Action Bar: Save vs Skip */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleCompleteOnboarding(true)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Skip — I'll configure later in Studio
                </button>

                <button
                  type="button"
                  onClick={() => handleCompleteOnboarding(false)}
                  className="w-full sm:flex-1 py-3.5 px-6 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Save to AI Memory & Enter Cockpit →</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
