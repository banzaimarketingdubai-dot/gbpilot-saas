'use client';

import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
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
    category: string;
    services: string[];
    keywords: string[];
  } | null>(null);
  const [interviewStep, setInterviewStep] = useState(0);
  const [interviewAnswers, setInterviewAnswers] = useState({
    landmarks: '',
    specialty: '',
    targetAudience: ''
  });

  // Path B state
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    name: string;
    address: string;
    score: number;
    issues: string[];
    grid: { pos: number; rank: number }[];
  } | null>(null);
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
  const handleScrapeWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl) return;
    setIsScraping(true);
    setTimeout(() => {
      setIsScraping(false);
      setScrapedData({
        name: 'Artisan Sourdough & Cafe',
        address: '742 Evergreen Terrace, Springfield',
        phone: '+1 (555) 019-2834',
        category: 'Bakery & Coffee Shop',
        services: ['Organic Sourdough', 'Espresso Bar', 'Breakfast Catering', 'Custom Cakes'],
        keywords: ['artisan bakery springfield', 'best espresso near me', 'sourdough bread']
      });
    }, 1800);
  };

  // Handle Path B Scan
  const handleSearchScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        name: searchQuery,
        address: '540 Broadway, Sector 4, Central District',
        score: 64,
        issues: [
          'Missing Secondary Category: Espresso Bar & Breakfast Restaurant',
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
    }, 1500);
  };

  // Handle Google OAuth 1-Click Connect
  const handleConnectGoogle = () => {
    setIsConnectingGoogle(true);
    setTimeout(() => {
      setIsConnectingGoogle(false);
      setShowSmartFixModal(true);
    }, 1200);
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
                      type="url"
                      required
                      placeholder="https://mybakery.com"
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

            {/* Step 2: Scraped Data Preview & Mini Interview */}
            {scrapedData && (
              <>
                <div className="material-card p-6 bg-white">
                  <div className="flex items-center justify-between border-b border-google-border-light pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-google-green" />
                      <h3 className="font-bold text-google-text-primary">Extracted Entity Baseline</h3>
                    </div>
                    <span className="text-xs font-bold text-google-green bg-google-green-light px-2.5 py-1 rounded-full">
                      Confidence Score: 98%
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-google-text-secondary font-semibold block">Business Name</span>
                      <span className="font-bold text-google-text-primary text-sm">{scrapedData.name}</span>
                    </div>
                    <div>
                      <span className="text-google-text-secondary font-semibold block">Primary Category</span>
                      <span className="font-bold text-google-blue">{scrapedData.category}</span>
                    </div>
                    <div>
                      <span className="text-google-text-secondary font-semibold block">Extracted Phone</span>
                      <span>{scrapedData.phone}</span>
                    </div>
                    <div>
                      <span className="text-google-text-secondary font-semibold block">Extracted Location</span>
                      <span>{scrapedData.address}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-google-border-light">
                    <span className="text-xs font-semibold text-google-text-secondary block mb-1.5">Identified Core Services:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scrapedData.services.map((svc, i) => (
                        <span key={i} className="px-2.5 py-1 bg-google-bg text-google-text-primary rounded-md text-[11px] font-medium border border-google-border">
                          {svc}
                        </span>
                      ))}
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
                        onClick={() => router && router.push('/dashboard')}
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="material-input text-sm pl-11 py-3"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isScanning}
                    className="material-button-primary w-full text-sm py-3"
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
    </div>
  );
}
