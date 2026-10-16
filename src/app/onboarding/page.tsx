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
  Target
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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
  verified: boolean;
}

const DEFAULT_DEMO_BUSINESS: DetectedBusiness = {
  id: 'demo_venue_1',
  name: 'Artisan Specialty Cafe & Roastery',
  address: '102 Marina Promenade, Sector B',
  city: 'Dubai',
  category: 'Specialty Coffee Shop & Roastery',
  rating: 4.8,
  reviews_count: 184,
  cover_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  phone: '+971 4 399 1234',
  verified: true
};

const SUGGESTED_VENUES: DetectedBusiness[] = [
  DEFAULT_DEMO_BUSINESS,
  {
    id: 'demo_venue_2',
    name: 'Al Safadi Lebanese Restaurant',
    address: 'Sheikh Zayed Rd, Trade Centre 1',
    city: 'Dubai',
    category: 'Lebanese Restaurant & Grill',
    rating: 4.6,
    reviews_count: 2420,
    cover_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    phone: '+971 600 500601',
    verified: true
  },
  {
    id: 'demo_venue_3',
    name: 'Marina Dental & Aesthetic Clinic',
    address: 'Marina Plaza, Floor 14',
    city: 'Dubai',
    category: 'Dental Clinic & Orthodontics',
    rating: 4.9,
    reviews_count: 312,
    cover_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    phone: '+971 4 456 7890',
    verified: true
  }
];

export default function OnboardingPage() {
  const router = useRouter();

  // Linear Step: 1 (SEARCH/CONNECT) | 2 (DIAGNOSTICS) | 3 (CHECKLIST)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Search input: Business name OR Google Maps link
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [detectedBusiness, setDetectedBusiness] = useState<DetectedBusiness>(DEFAULT_DEMO_BUSINESS);
  const [isMapsLinkDetected, setIsMapsLinkDetected] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Step 2: Diagnostics scan state
  const [scanProgress, setScanProgress] = useState(0);
  const [diagnosticStage, setDiagnosticStage] = useState(0);

  // Step 3: Interactive Checklist state
  const [checklist, setChecklist] = useState({
    sentinelGuard: true,
    lsiResponder: true,
    geoGridRadar: true
  });

  // Handle auto-detection of Google Maps link
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.includes('maps.google.') || q.includes('goo.gl/maps') || q.includes('/maps/place')) {
      setIsMapsLinkDetected(true);
      // Extract pseudo-name from URL or set high-confidence venue
      setDetectedBusiness({
        ...DEFAULT_DEMO_BUSINESS,
        name: searchQuery.split('/place/')[1]?.split('/')[0]?.replace(/\+/g, ' ') || 'Connected Google Maps Venue'
      });
    } else {
      setIsMapsLinkDetected(false);
    }
  }, [searchQuery]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      const match = SUGGESTED_VENUES.find(v => 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        setDetectedBusiness(match);
      } else {
        setDetectedBusiness({
          id: `custom_${Date.now()}`,
          name: searchQuery.trim(),
          address: 'Downtown District, Sheikh Mohammed bin Rashid Blvd, Dubai',
          city: 'Dubai',
          category: 'Local Business & Retail',
          rating: 4.7,
          reviews_count: 88,
          cover_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
          phone: '+971 4 123 4567',
          verified: true
        });
      }
      setShowSuggestions(false);
    }, 400);
  };

  // Step 2 Diagnostic Simulation runner
  const startDiagnostics = () => {
    setCurrentStep(2);
    setScanProgress(10);
    setDiagnosticStage(0);

    const stages = [
      { progress: 30, stage: 1, delay: 1200 },
      { progress: 65, stage: 2, delay: 2600 },
      { progress: 90, stage: 3, delay: 4200 },
      { progress: 100, stage: 4, delay: 5800 }
    ];

    stages.forEach(({ progress, stage, delay }) => {
      setTimeout(() => {
        setScanProgress(progress);
        setDiagnosticStage(stage);
      }, delay);
    });
  };

  // Step 3 Completion: Save to Storage and go to Cockpit
  const handleCompleteOnboarding = () => {
    if (typeof window !== 'undefined') {
      // 1. Save active profile
      localStorage.setItem('gbpilot_active_profile', JSON.stringify(detectedBusiness));
      
      // 2. Add to available profiles list
      const existing = localStorage.getItem('gbpilot_available_profiles');
      let list: DetectedBusiness[] = [];
      if (existing) {
        try {
          list = JSON.parse(existing);
        } catch (e) {}
      }
      if (!list.some(p => p.name === detectedBusiness.name)) {
        list.push(detectedBusiness);
      }
      localStorage.setItem('gbpilot_available_profiles', JSON.stringify(list));

      // 3. Mark 14-day growth trial as active
      localStorage.setItem('gbpilot_trial_active', 'true');
      localStorage.setItem('gbpilot_trial_start', String(Date.now()));
      localStorage.setItem('gbpilot_trial_days_left', '14');

      // 4. Set user session
      localStorage.setItem('gbpilot_user', JSON.stringify({
        email: 'owner@' + detectedBusiness.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com',
        name: 'Business Owner',
        role: 'Owner',
        loggedIn: true
      }));

      // 5. Clear unlinked flag
      localStorage.removeItem('gbpilot_profile_unlinked');

      // Trigger update event
      window.dispatchEvent(new CustomEvent('active_profile_updated'));
      window.dispatchEvent(new CustomEvent('user_session_updated'));
    }

    router.push('/dashboard');
  };

  // Connect via Google OAuth directly
  const handleGoogleOAuthLogin = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.gbpilot.top';
    const loginUrl = `${backendUrl}/api/v1/auth/google/login?redirect_url=${encodeURIComponent(origin + '/dashboard')}&origin=${encodeURIComponent(origin)}&state=${encodeURIComponent(origin)}`;
    
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
        <div className="max-w-md mx-auto w-full mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className={currentStep >= 1 ? 'text-google-blue' : ''}>1. Connect Venue</span>
            <span className={currentStep >= 2 ? 'text-google-blue' : ''}>2. 15-Sec Diagnostics</span>
            <span className={currentStep >= 3 ? 'text-google-blue' : ''}>3. Autopilot Setup</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-google-blue h-full transition-all duration-500 ease-out"
              style={{ width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%' }}
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: CONNECT VENUE (NAME OR GOOGLE MAPS LINK)         */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Header */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-[11px] font-bold text-google-blue uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Step 1 of 3: Instant Zero-Friction Setup
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Connect your business in 30 seconds
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Enter your business name or paste your Google Maps link. No credit card required.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 max-w-2xl mx-auto">
              
              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Business Name or Google Maps Link:
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="e.g. Artisan Cafe Dubai or https://maps.google.com/..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-google-blue focus:border-google-blue outline-none transition-all font-medium"
                  />
                  {isMapsLinkDetected && (
                    <span className="absolute right-3 top-3 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                      ✓ Maps Link Detected
                    </span>
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 space-y-1 text-xs">
                    <span className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Quick Suggestions in UAE / Global:
                    </span>
                    {SUGGESTED_VENUES.map((venue) => (
                      <button
                        key={venue.id}
                        type="button"
                        onClick={() => {
                          setDetectedBusiness(venue);
                          setSearchQuery(venue.name);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-white flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img src={venue.cover_url} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-slate-800 group-hover:text-google-blue truncate block">
                              {venue.name}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate block">
                              {venue.address}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-amber-500 shrink-0">
                          {venue.rating} ★
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </form>

              {/* Detected Profile Preview Card */}
              <div className="border border-slate-200 bg-slate-50/80 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Target Business Profile Found:
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0 bg-white">
                    <img
                      src={detectedBusiness.cover_url}
                      alt={detectedBusiness.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-1 border-2 border-white">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg truncate">
                      {detectedBusiness.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {detectedBusiness.category}
                      </span>
                      <span className="font-bold text-amber-500 flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {detectedBusiness.rating} ({detectedBusiness.reviews_count} reviews)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 pt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{detectedBusiness.address}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startDiagnostics}
                  className="w-full py-3.5 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start 15-Sec AI Health Diagnostics →</span>
                </button>
              </div>

              {/* Direct Google OAuth Option */}
              <div className="pt-2 text-center border-t border-slate-100">
                <span className="text-xs text-slate-400 block mb-2">Or connect via official API:</span>
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
        {/* STEP 2: 15-SEC EDUCATIONAL DIAGNOSTICS                   */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl mx-auto">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold text-google-blue uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Step 2 of 3: AI Diagnostic Scan
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {scanProgress < 100 ? 'Scanning your listing & neighborhood rivals...' : 'Diagnostic complete: 3 ranking gaps found'}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Target: <strong>{detectedBusiness.name}</strong> • Catchment: 1.5 km
              </p>
            </div>

            {/* Diagnostic Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Scan Progress</span>
                  <span className="text-google-blue">{scanProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-google-blue h-full transition-all duration-300 ease-out"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>

              {/* 3 Pillars Education Progress Feed */}
              <div className="space-y-3 pt-2">
                
                {/* Pillar 1: Data Stability & Guard */}
                <div className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 text-xs ${
                  diagnosticStage >= 1 ? 'bg-emerald-50/60 border-emerald-200 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                }`}>
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200 shrink-0 text-emerald-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center gap-1.5 text-slate-900">
                      <span>1. Profile Guard & Operating Hours:</span>
                      {diagnosticStage >= 1 && <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-extrabold">Gap Found</span>}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Friday & holiday hours not locked against crowd-sourced suggestions. Risk of competitor unauthorized edits.
                    </p>
                  </div>
                </div>

                {/* Pillar 2: Reputation & LSI Keywords */}
                <div className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 text-xs ${
                  diagnosticStage >= 2 ? 'bg-blue-50/60 border-blue-200 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                }`}>
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200 shrink-0 text-google-blue">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center gap-1.5 text-slate-900">
                      <span>2. Review SEO & Local LSI Keywords:</span>
                      {diagnosticStage >= 2 && <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-extrabold">Gap Found</span>}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      18 reviews answered without neighborhood keywords. Missing indexing for &quot;specialty breakfast&quot; and &quot;near beach&quot;.
                    </p>
                  </div>
                </div>

                {/* Pillar 3: Catchment Area Geo-Grid */}
                <div className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 text-xs ${
                  diagnosticStage >= 3 ? 'bg-purple-50/60 border-purple-200 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                }`}>
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200 shrink-0 text-purple-600">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center gap-1.5 text-slate-900">
                      <span>3. 1.5 km Spatial Rank Radar:</span>
                      {diagnosticStage >= 3 && <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded font-extrabold">Overtaken at Sector B</span>}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Rank #1 at venue door, but drops to #5–#7 at crossroad 500m away. Customer calls redirecting to rivals.
                    </p>
                  </div>
                </div>

              </div>

              {/* Outcome Score & Financial Impact (When scan finishes) */}
              {scanProgress === 100 && (
                <div className="pt-2 border-t border-slate-100 space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-red-50 border border-amber-200 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        Health Score
                      </span>
                      <div className="text-2xl font-black text-slate-900 mt-1">
                        64 / 100
                      </div>
                      <p className="text-xs text-slate-500">
                        Estimated monthly lost revenue: <strong className="text-rose-600 font-bold">~$1,800/mo</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                        Fixable in 1-Click
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="w-full py-3.5 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <span>Proceed to Autopilot Setup Checklist →</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: INTERACTIVE CHECKLIST & TRIAL ACTIVATION        */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl mx-auto">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Step 3 of 3: Confirm Autopilot Setup
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Activate your 3 AI Growth Systems
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Confirm the protections GB Pilot will run for <strong>{detectedBusiness.name}</strong>:
              </p>
            </div>

            {/* Checklist Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
              
              <div className="space-y-3">
                
                {/* Item 1: Sentinel Profile Guard */}
                <div 
                  onClick={() => setChecklist(prev => ({ ...prev, sentinelGuard: !prev.sentinelGuard }))}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-slate-50/70 hover:bg-emerald-50/20 transition-all cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        1. 24/7 Sentinel Profile Guard
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Freezes your Golden Baseline for hours, phone and primary category. Automatically reverts competitor tampering.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={checklist.sentinelGuard}
                    onChange={() => {}}
                    className="w-5 h-5 text-emerald-600 rounded-md focus:ring-emerald-500 mt-1 cursor-pointer"
                  />
                </div>

                {/* Item 2: Smart LSI Review Responder */}
                <div 
                  onClick={() => setChecklist(prev => ({ ...prev, lsiResponder: !prev.lsiResponder }))}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/70 hover:bg-blue-50/20 transition-all cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-100 text-google-blue mt-0.5">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        2. Smart LSI Review Engine
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Drafts keyword-rich responses injecting local search queries to boost Top 3 Local Pack ranking.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={checklist.lsiResponder}
                    onChange={() => {}}
                    className="w-5 h-5 text-google-blue rounded-md focus:ring-google-blue mt-1 cursor-pointer"
                  />
                </div>

                {/* Item 3: 1.5 km Geo-Grid Radar */}
                <div 
                  onClick={() => setChecklist(prev => ({ ...prev, geoGridRadar: !prev.geoGridRadar }))}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 bg-slate-50/70 hover:bg-purple-50/20 transition-all cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-700 mt-0.5">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        3. 1.5 km Spatial Rank Radar
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Tracks rankings across high-demand crossroads and generates counter-strategies against rising rivals.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={checklist.geoGridRadar}
                    onChange={() => {}}
                    className="w-5 h-5 text-purple-600 rounded-md focus:ring-purple-500 mt-1 cursor-pointer"
                  />
                </div>

              </div>

              {/* Free Trial Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">14-Day Free Growth Trial Activated</span>
                    <span className="text-[11px] text-emerald-700">Explore full dashboard and copy manual fixes for free. No credit card required today.</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-900 shrink-0">
                  $0.00
                </span>
              </div>

              {/* Launch Button */}
              <button
                type="button"
                onClick={handleCompleteOnboarding}
                className="w-full py-4 bg-google-blue hover:bg-blue-600 text-white font-extrabold rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>🚀 Launch GB Pilot Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
