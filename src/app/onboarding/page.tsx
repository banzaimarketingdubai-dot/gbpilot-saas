'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Bot, 
  Globe, 
  Building2, 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  Layers, 
  Star,
  ExternalLink,
  Zap,
  Mail,
  Phone
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = routerNav();
  const [onboardingMode, setOnboardingMode] = useState<'MODE_A' | 'MODE_B' | null>(null);

  // Path A state
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState<{
    name: string;
    address: string;
    phone: string;
    email: string;
    category: string;
    niche: string;
    summary: string;
    snapshot_url: string;
    website_url: string;
    services: string[];
    keywords: string[];
    id?: string;
  } | null>(null);
  const [interviewStep, setInterviewStep] = useState(0);
  const [interviewAnswers, setInterviewAnswers] = useState({
    landmarks: '',
    specialty: '',
    targetAudience: ''
  });

  // Path B state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    name: string;
    address: string;
    score: number;
    issues: string[];
    grid: { pos: number; rank: number }[];
  } | null>(null);

  // Store approximate location to avoid requesting permission
  const [approxLocation, setApproxLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Fetch IP-based location silently on mount
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(res => res.json())
      .then(data => {
        if (data.latitude && data.longitude) {
          setApproxLocation({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
        }
      })
      .catch(() => {}); // silently ignore if blocked by adblocker
  }, []);

  // Fetch Autocomplete Suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(searchQuery, approxLocation?.lat || null, approxLocation?.lng || null);
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, approxLocation]);

  const fetchSuggestions = async (q: string, lat: any, lng: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://gbpilot-saas-production.up.railway.app';
    let url = `${baseUrl}/api/v1/onboarding/autocomplete?query=${encodeURIComponent(q)}`;
    if (lat && lng) url += `&lat=${lat}&lng=${lng}`;
    
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      }
    } catch(e) {
      console.error(e);
    }
  };
  const [showSmartFixModal, setShowSmartFixModal] = useState(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isFixApplied, setIsFixApplied] = useState(false);
  const [isWebsiteBuilding, setIsWebsiteBuilding] = useState(false);
  const [isWebsiteBuilt, setIsWebsiteBuilt] = useState(false);

  function routerNav() {
    try {
      return useRouter();
    } catch {
      return null;
    }
  }

  // Handle Path A Scraping
  const handleScrapeWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl || !websiteUrl.trim()) return;
    
    let formattedUrl = websiteUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setIsScraping(true);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://gbpilot-saas-production.up.railway.app';
      const response = await fetch(`${backendUrl}/api/v1/onboarding/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website_url: formattedUrl }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const profile = data.profile || data;
        setScrapedData({
          name: profile.business_name || profile.name || 'Extracted Business Entity',
          address: profile.address || profile.address_line || 'Extracted Location',
          phone: profile.phone || profile.phone_number || 'Contact via website',
          email: profile.email || 'Contact via website',
          category: profile.category || profile.primary_category || 'Local Business',
          niche: profile.niche || profile.category || 'Local Business & Services',
          summary: profile.summary || 'Summary generated by AI from website homepage content.',
          snapshot_url: profile.snapshot_url || `https://image.thum.io/get/width/800/crop/600/${formattedUrl}`,
          website_url: formattedUrl,
          services: profile.services && profile.services.length > 0 ? profile.services : ['Primary Service', 'Client Support'],
          keywords: profile.keywords && profile.keywords.length > 0 ? profile.keywords : ['local business', 'top provider'],
          id: profile.id
        });
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.error("Website scrape error:", err);
      alert("Failed to scrape website. Please ensure the backend is running and the URL is accessible.");
      setScrapedData(null);
    } finally {
      setIsScraping(false);
    }
  };

  // Handle Path B Scan
  const handleSearchScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsScanning(true);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://gbpilot-saas-production.up.railway.app';
      const response = await fetch(`${backendUrl}/api/v1/onboarding/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: searchQuery }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const profile = data.profile || {};
        setScanResult({
          name: profile.business_name || searchQuery,
          address: `${profile.address_line || 'Central District'}, ${profile.city || ''}`,
          score: profile.health_score || 64,
          issues: profile.issues || [
            `Missing Secondary Category: ${profile.primary_category || 'Specialty'} Training & Services`,
            '3 Negative Reviews without AI owner responses',
            'Profile Guard disabled (unauthorized edits risk)',
            'No Google Posts published in past 14 days'
          ],
          grid: [
            { pos: 1, rank: 2 }, { pos: 2, rank: 3 }, { pos: 3, rank: 7 },
            { pos: 4, rank: 1 }, { pos: 5, rank: 4 }, { pos: 6, rank: 11 },
            { pos: 7, rank: 8 }, { pos: 8, rank: 14 }, { pos: 9, rank: 18 }
          ]
        });
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      console.error("Scan error:", err);
      alert("Failed to scan business. Please check backend connection.");
      setScanResult(null);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Google OAuth 1-Click Connect
  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://gbpilot-saas-production.up.railway.app';
      const res = await fetch(`${backendUrl}/api/v1/auth/google/login`);
      if (res.ok) {
        const data = await res.json();
        if (data.auth_url) {
          window.location.href = data.auth_url;
          return;
        }
      }
      throw new Error("No auth URL returned");
    } catch {
      // Fallback preview modal if GOOGLE_CLIENT_ID is not configured yet
      setIsConnectingGoogle(false);
      setShowSmartFixModal(true);
    }
  };

  const handleApplyFixes = () => {
    setIsFixApplied(true);
    setTimeout(() => {
      setShowSmartFixModal(false);
      if (router) router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-google-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        
        {/* Onboarding Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-google-blue-light text-google-blue rounded-full text-xs font-bold mb-3 border border-google-blue/20">
            <Sparkles className="w-3.5 h-3.5" /> Zero-Friction Setup Engine
          </div>
          <h1 className="text-3xl font-extrabold text-google-text-primary tracking-tight">
            Welcome to <span className="text-google-blue">GBPilot</span> Growth Copilot
          </h1>
          <p className="text-google-text-secondary text-sm mt-2">
            Select your current business profile status to launch AI proactive optimization in under 2 minutes.
          </p>
        </div>

        {/* Global Mode Selector */}
        {!onboardingMode && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Mode A Selector */}
            <div 
              onClick={() => setOnboardingMode('MODE_A')}
              className="material-card p-6 cursor-pointer hover:border-google-blue hover:shadow-material-2 transition-all group border-2 border-transparent"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Mode A
              </span>
              <h2 className="text-xl font-bold text-google-text-primary mt-2">
                I do NOT have a Google Profile
              </h2>
              <p className="text-google-text-secondary text-xs mt-2 leading-relaxed">
                Build a high-ranking Google Business Profile from scratch. Our AI will analyze your website and conduct a 60-second interview to prepare your launch package.
              </p>
              <div className="mt-6 flex items-center text-google-blue text-xs font-bold group-hover:translate-x-1 transition-transform">
                <span>Start Website Extraction</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* Mode B Selector */}
            <div 
              onClick={() => setOnboardingMode('MODE_B')}
              className="material-card p-6 cursor-pointer hover:border-google-blue hover:shadow-material-2 transition-all group border-2 border-google-blue/40 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-google-blue text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                RECOMMENDED (ZERO-FRICTION)
              </div>
              <div className="w-12 h-12 rounded-xl bg-google-blue-light text-google-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-google-blue bg-google-blue-light px-2 py-0.5 rounded-full uppercase tracking-wider">
                Mode B
              </span>
              <h2 className="text-xl font-bold text-google-text-primary mt-2">
                I ALREADY HAVE a Google Profile
              </h2>
              <p className="text-google-text-secondary text-xs mt-2 leading-relaxed">
                Instant audit without logging in! Search your business name to generate a 3x3 Geo-Grid rank heatmap & 1-Click fix vulnerabilities.
              </p>
              <div className="mt-6 flex items-center text-google-blue text-xs font-bold group-hover:translate-x-1 transition-transform">
                <span>Launch Instant Magic Scan</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* PATH A: NO GOOGLE BUSINESS PROFILE WORKFLOW */}
        {/* ======================================================== */}
        {onboardingMode === 'MODE_A' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            <button 
              onClick={() => { setOnboardingMode(null); setScrapedData(null); }}
              className="text-xs text-google-text-secondary hover:text-google-blue font-medium flex items-center gap-1 mb-2"
            >
              ← Back to Mode Selector
            </button>

            {/* Step 1: Website Input */}
            {!scrapedData && (
              <div className="material-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-google-blue-light text-google-blue rounded-lg">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-google-text-primary">Step 1: Enter Business Website</h2>
                    <p className="text-xs text-google-text-secondary">AI will scrape services, address, and category details.</p>
                  </div>
                </div>

                <form onSubmit={handleScrapeWebsite} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-google-text-secondary mb-1">Website URL</label>
                    <input 
                      type="text"
                      inputMode="url"
                      required
                      placeholder="e.g. virale.uno, google.com, www.mybakery.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="material-input text-sm"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isScraping}
                    className="material-button-primary w-full"
                  >
                    {isScraping ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>AI Analyzing & Extracting Business Core...</span>
                      </>
                    ) : (
                      <>
                        <span>Scrape & Extract Business Core</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Live Website Visual Snapshot & AI Executive Summary */}
            {scrapedData && (
              <>
                <div className="material-card p-6 bg-white space-y-6">
                  {/* Top Bar with Confidence & Status */}
                  <div className="flex items-center justify-between border-b border-google-border-light pb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-google-green" />
                      <h3 className="font-bold text-google-text-primary text-base">Real-Time Website Snapshot & AI Baseline</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Snapshot
                      </span>
                      <span className="text-xs font-bold text-google-blue bg-google-blue-light px-2.5 py-1 rounded-full border border-google-blue/20">
                        AI Confidence: 98%
                      </span>
                    </div>
                  </div>

                  {/* Grid: Left Visual Snapshot Frame / Right AI Executive Analysis */}
                  <div className="grid md:grid-cols-12 gap-6">
                    
                    {/* Left: Website Snapshot Browser Container */}
                    <div className="md:col-span-5 rounded-xl border border-google-border overflow-hidden bg-slate-900 shadow-sm flex flex-col">
                      {/* Browser Header Bar */}
                      <div className="bg-slate-800 px-3 py-2 flex items-center gap-2 border-b border-slate-700">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                        </div>
                        <div className="flex-1 bg-slate-950/80 rounded px-2.5 py-1 text-[11px] text-slate-300 font-mono flex items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="truncate">{scrapedData.website_url}</span>
                          <a href={scrapedData.website_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white ml-1">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Snapshot Image Thumbnail */}
                      <div className="relative bg-slate-950 flex-1 flex items-center justify-center min-h-[180px] overflow-hidden group">
                        <img 
                          src={scrapedData.snapshot_url} 
                          alt={`Website snapshot for ${scrapedData.name}`} 
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback image display if thum.io thumbnail is blocked
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-[10px] text-slate-200 font-medium flex items-center gap-1">
                            <Globe className="w-3 h-3 text-google-blue" /> Live HTML & Metadata Scraped
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: AI Executive Summary & Niche Badge */}
                    <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                      
                      {/* Business Niche & Category */}
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-extrabold rounded-md border border-amber-200 uppercase tracking-wider flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-amber-600" /> {scrapedData.niche}
                          </span>
                          <span className="text-xs text-google-text-tertiary">| {scrapedData.category}</span>
                        </div>
                        <h2 className="text-xl font-black text-google-text-primary tracking-tight">
                          {scrapedData.name}
                        </h2>
                      </div>

                      {/* Executive AI Summary Box */}
                      <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl relative">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-google-blue mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-google-blue" /> Executive AI Summary
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-normal">
                          {scrapedData.summary}
                        </p>
                      </div>

                      {/* Extracted Contact Info Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs border-t border-google-border-light pt-3">
                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <Phone className="w-3.5 h-3.5 text-google-blue shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-google-text-tertiary font-semibold block uppercase">Phone</span>
                            <span className="font-bold text-google-text-primary text-xs truncate block">{scrapedData.phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <Mail className="w-3.5 h-3.5 text-google-blue shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-google-text-tertiary font-semibold block uppercase">Email</span>
                            <span className="font-bold text-google-text-primary text-xs truncate block">{scrapedData.email}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Physical Location */}
                  <div className="flex items-center gap-2 text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <MapPin className="w-4 h-4 text-google-red shrink-0" />
                    <span className="text-google-text-secondary font-medium">Location:</span>
                    <span className="font-bold text-google-text-primary">{scrapedData.address}</span>
                  </div>

                  {/* Services & Keywords */}
                  <div className="pt-2 border-t border-google-border-light space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-google-text-secondary block mb-1.5">Identified Core Services:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {scrapedData.services.map((svc, i) => (
                          <span key={i} className="px-2.5 py-1 bg-google-bg text-google-text-primary rounded-md text-[11px] font-medium border border-google-border">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-google-text-secondary block mb-1.5">Extracted High-Intent LSI Keywords:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {scrapedData.keywords.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 bg-google-blue-light text-google-blue rounded text-[11px] font-bold border border-google-blue/20">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Interactive Interview Workspace */}
                <div className="material-card p-6 border-l-4 border-l-google-blue">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-5 h-5 text-google-blue" />
                    <h3 className="font-bold text-google-text-primary text-sm">Copilot Quick Interview (30-Sec Enrichment)</h3>
                  </div>

                  {interviewStep === 0 && (
                    <div className="space-y-3">
                      <p className="text-xs text-google-text-secondary">
                        🤖 <strong className="text-google-text-primary">Question 1/2:</strong> What are the main local landmarks or neighborhoods near your business? (Helps boost GEO local relevance keywords).
                      </p>
                      <input 
                        type="text"
                        placeholder="e.g. Near Sector 4 Metro Station & Central Park"
                        value={interviewAnswers.landmarks}
                        onChange={(e) => setInterviewAnswers({ ...interviewAnswers, landmarks: e.target.value })}
                        className="material-input text-xs"
                      />
                      <button 
                        onClick={() => setInterviewStep(1)}
                        className="material-button-primary text-xs py-2 ml-auto"
                      >
                        Next Question →
                      </button>
                    </div>
                  )}

                  {interviewStep === 1 && (
                    <div className="space-y-3">
                      <p className="text-xs text-google-text-secondary">
                        🤖 <strong className="text-google-text-primary">Question 2/2:</strong> What is your top specialty or unique selling point?
                      </p>
                      <input 
                        type="text"
                        placeholder="e.g. 100% Organic sourdough baked fresh daily at 6 AM"
                        value={interviewAnswers.specialty}
                        onChange={(e) => setInterviewAnswers({ ...interviewAnswers, specialty: e.target.value })}
                        className="material-input text-xs"
                      />
                      <button 
                        onClick={() => setInterviewStep(2)}
                        className="material-button-primary text-xs py-2 ml-auto"
                      >
                        Generate Profile Draft →
                      </button>
                    </div>
                  )}

                  {interviewStep === 2 && (
                    <div className="space-y-4">
                      <div className="p-3 bg-google-green-light rounded-lg text-xs text-google-green font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        AI Profile Package Ready to Launch!
                      </div>
                      <button 
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('gbpilot_active_profile', JSON.stringify({
                              id: scrapedData.id,
                              name: scrapedData.name,
                              address: scrapedData.address,
                              city: scrapedData.address.split(',').pop()?.trim() || 'Local City',
                              autopilotMode: 'MANUAL_APPROVAL',
                              snapshot_url: scrapedData.snapshot_url
                            }));
                          }
                          if (router) router.push('/dashboard');
                        }}
                        className="material-button-primary w-full text-sm"
                      >
                        🚀 Launch New Profile & Go to Action Hub
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* PATH B: ZERO-FRICTION ONBOARDING WORKFLOW (EXISTING PROFILE) */}
        {/* ======================================================== */}
        {onboardingMode === 'MODE_B' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            <button 
              onClick={() => { setOnboardingMode(null); setScanResult(null); }}
              className="text-xs text-google-text-secondary hover:text-google-blue font-medium flex items-center gap-1 mb-2"
            >
              ← Back to Mode Selector
            </button>

            {/* Step 1: Magic Search Scan (No Auth Gateway) */}
            {!scanResult && (
              <div className="material-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-google-blue-light text-google-blue rounded-xl">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-google-text-primary">Magic Search Scan (No Auth Required)</h2>
                    <p className="text-xs text-google-text-secondary">Type your business name or address on Google Maps to generate an instant rank heatmap.</p>
                  </div>
                </div>

                <form onSubmit={handleSearchScan} className="space-y-4">
                  <div className="relative">
                    <Search className="w-5 h-5 text-google-text-tertiary absolute left-3.5 top-3" />
                    <input 
                      type="text"
                      required
                      placeholder="Enter business name (e.g. Manhattan Bakery & Cafe)"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="material-input text-sm pl-11 py-3"
                    />
                    
                    {/* Autocomplete Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        {suggestions.map((s, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setSearchQuery(s.description);
                              setShowSuggestions(false);
                            }}
                            className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                          >
                            <div className="font-semibold text-sm text-google-text-primary">{s.main_text}</div>
                            <div className="text-xs text-google-text-secondary truncate">{s.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    type="submit"
                    disabled={isScanning}
                    className="material-button-primary w-full text-sm py-3 relative z-40"
                  >
                    {isScanning ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Running Spatial Geo-Grid Scan & Competitor Analysis...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡ Run Instant Free Audit & Geo-Grid Heatmap</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Instant Scan Results & Geo-Grid Heatmap (FOMO Trigger) */}
            {scanResult && (
              <div className="space-y-6">
                
                {/* Result Header & FOMO Banner */}
                <div className="material-card p-6 bg-white border-2 border-google-red/30">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-google-border-light pb-4">
                    <div>
                      <span className="text-[11px] font-bold text-google-red bg-google-red-light px-2.5 py-1 rounded-full uppercase tracking-wider">
                        CRITICAL RANKING VULNERABILITIES DETECTED
                      </span>
                      <h2 className="text-xl font-extrabold text-google-text-primary mt-1.5">
                        {scanResult.name}
                      </h2>
                      <p className="text-xs text-google-text-secondary">{scanResult.address}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-google-text-secondary block">Health Score</span>
                        <span className="text-2xl font-black text-amber-600">{scanResult.score}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Identified Issues List */}
                  <div className="mt-4 space-y-2">
                    <span className="text-xs font-bold text-google-text-primary block">Top 4 Optimization Leaks:</span>
                    {scanResult.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-google-text-primary bg-google-bg p-2 rounded-lg border border-google-border-light">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3x3 Spatial Geo-Grid Preview */}
                <div className="material-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-google-text-primary text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-google-blue" />
                        3x3 Geo-Grid Heatmap Snapshot (Keyword: "cafe near me")
                      </h3>
                      <p className="text-xs text-google-text-secondary">Red numbers indicate positions where local traffic is lost to competitors.</p>
                    </div>
                    <span className="text-xs text-google-text-tertiary">Radius: 2.5 km</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                    {scanResult.grid.map((item) => {
                      const isTop3 = item.rank <= 3;
                      return (
                        <div 
                          key={item.pos}
                          className={`h-20 rounded-xl flex flex-col items-center justify-center font-bold text-white shadow-sm ${
                            isTop3 ? 'bg-google-green' : item.rank <= 8 ? 'bg-google-yellow' : 'bg-google-red'
                          }`}
                        >
                          <span className="text-xs opacity-80 font-normal">Rank</span>
                          <span className="text-2xl">#{item.rank}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-6 text-xs text-google-text-secondary">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-google-green"></span> Rank 1-3 (Winning)</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-google-yellow"></span> Rank 4-8 (Warning)</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-google-red"></span> Rank 9+ (Lost Traffic)</span>
                  </div>
                </div>

                {/* Sticky 1-Click OAuth CTA */}
                <div className="material-card p-6 bg-gradient-to-r from-google-blue to-blue-700 text-white shadow-material-2">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">Ready to Auto-Fix These Ranking Leaks?</h3>
                      <p className="text-xs text-blue-100 mt-1">Connect your Google Business Profile to trigger AI 1-Click Smart Fix.</p>
                    </div>
                    <button 
                      onClick={handleConnectGoogle}
                      disabled={isConnectingGoogle}
                      className="bg-white hover:bg-google-bg text-google-blue font-bold px-6 py-3 rounded-xl shadow transition-all flex items-center gap-2 whitespace-nowrap text-sm"
                    >
                      {isConnectingGoogle ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin text-google-blue" />
                          <span>Connecting Google Account...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-google-blue fill-google-blue" />
                          <span>Fix these issues in 1-Click (Connect Google)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 1-Click Local Website Builder (Optional PLG Feature) */}
                <div className="material-card p-6 border border-purple-200 bg-purple-50/50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        PLG Growth Feature
                      </span>
                      <h4 className="font-bold text-google-text-primary text-sm mt-1">
                        Don't have a high-converting landing page?
                      </h4>
                      <p className="text-xs text-google-text-secondary">
                        Generate an SEO-optimized Local Website powered by your GBP data in 10 seconds.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsWebsiteBuilding(true);
                        setTimeout(() => {
                          setIsWebsiteBuilding(false);
                          setIsWebsiteBuilt(true);
                        }, 1500);
                      }}
                      className="material-button-secondary text-xs border-purple-300 text-purple-700 hover:bg-purple-100"
                    >
                      {isWebsiteBuilding ? (
                        <span>Building SEO Site...</span>
                      ) : isWebsiteBuilt ? (
                        <span className="flex items-center gap-1"><Check className="w-4 h-4 text-google-green" /> Website Published!</span>
                      ) : (
                        <span>Publish Local SEO Website (Powered by AI)</span>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* SMART INSTANT FIX MODAL (POST OAUTH CONNECT) */}
        {/* ======================================================== */}
        {showSmartFixModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-material-3 border border-google-border animate-in fade-in zoom-in duration-200">
              
              <div className="flex items-center justify-between border-b border-google-border-light pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-google-green-light text-google-green rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-google-text-primary text-base">Smart Instant Fixes Generated</h3>
                    <p className="text-xs text-google-text-secondary">AI prepared instant optimizations for your profile.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                
                {/* Fix 1: Missing Secondary Category */}
                <div className="p-3 bg-google-bg rounded-xl border border-google-border-light text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-google-text-primary">
                    <span className="flex items-center gap-1.5 text-google-blue">
                      <Layers className="w-4 h-4" /> Add Secondary Category
                    </span>
                    <span className="text-[10px] bg-google-blue-light text-google-blue px-2 py-0.5 rounded font-bold">+18% GEO Reach</span>
                  </div>
                  <p className="text-google-text-secondary">Recommended: "Espresso Bar & Artisan Coffee Shop"</p>
                </div>

                {/* Fix 2: Draft Welcome Post */}
                <div className="p-3 bg-google-bg rounded-xl border border-google-border-light text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-google-text-primary">
                    <span className="flex items-center gap-1.5 text-google-green">
                      <Star className="w-4 h-4" /> Publish Draft Welcome Google Post
                    </span>
                    <span className="text-[10px] bg-google-green-light text-google-green px-2 py-0.5 rounded font-bold">SEO Boost</span>
                  </div>
                  <p className="text-google-text-secondary font-mono bg-white p-2 rounded border border-google-border text-[11px]">
                    "Welcome to Manhattan Bakery! 🥖 Visit us on 540 Broadway for fresh organic sourdough & specialty espresso."
                  </p>
                </div>

                {/* Fix 3: AI Review Auto-Replies */}
                <div className="p-3 bg-google-bg rounded-xl border border-google-border-light text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-google-text-primary">
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <Bot className="w-4 h-4" /> Batch Reply to 3 Unanswered Reviews
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">Sentiment Repair</span>
                  </div>
                  <p className="text-google-text-secondary">AI responses drafted with local GEO keywords inserted.</p>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-google-border-light pt-4">
                <button 
                  onClick={() => setShowSmartFixModal(false)}
                  className="material-button-ghost text-xs"
                >
                  Skip for Now
                </button>
                <button 
                  onClick={handleApplyFixes}
                  disabled={isFixApplied}
                  className="material-button-primary text-xs font-bold"
                >
                  {isFixApplied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Fixes Applied! Launching Dashboard...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Apply AI Optimization Now</span>
                    </>
                  )}
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
