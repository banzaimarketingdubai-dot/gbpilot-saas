'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  Bot, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Star, 
  Check, 
  ChevronDown, 
  Globe, 
  Building2, 
  Flame, 
  ShieldAlert, 
  Layers, 
  Award, 
  HelpCircle, 
  Users, 
  CheckCircle, 
  XCircle,
  Clock,
  Phone,
  Navigation,
  Lock,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { setSubscriptionPlan, PlanId } from '@/lib/subscription';

export default function B2BLandingPage() {
  const router = useRouter();

  // Pricing State
  const [currency, setCurrency] = useState<'AED' | 'USD'>('AED');
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [pricingToast, setPricingToast] = useState<string | null>(null);

  const handleSelectPlan = async (planId: PlanId) => {
    if (planId === 'FREE_SCOUT') {
      setSubscriptionPlan(planId);
      setPricingToast(`🎉 Free Scout activated! Redirecting to Cockpit...`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      return;
    }

    setIsCheckoutLoading(true);
    setPricingToast(`⏳ Переход к безопасной оплате Creem.io...`);
    try {
      const res = await fetch('/api/v1/checkout/creem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
    } catch (e) {
      console.error('Creem checkout redirect failed:', e);
    } finally {
      setIsCheckoutLoading(false);
    }

    setSubscriptionPlan(planId);
    setPricingToast(`🎉 ${planId === 'STARTER' ? 'Starter Plan' : planId === 'PRO_GROWTH' ? 'Growth / Pro Plan' : 'Agency Plan'} activated! Redirecting to Cockpit...`);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };
  
  // FOMO Slider State
  const [fomoIndex, setFomoIndex] = useState(0);
  const fomoSlides = [
    {
      badge: "🚨 Competitor Alert",
      badgeColor: "bg-google-red-light text-google-red border-google-red/20",
      title: "Competitors are Stealing 68% of Your Local Traffic Right Now",
      description: "While you sleep, rival businesses in your 2 km radius updated their categories and posted geotagged updates. Every hour you're not in the Top 3 Maps Pack, 7 out of 10 ready-to-buy local customers walk into your competitor's doors.",
      stat: "-68%",
      statLabel: "Local Foot Traffic Lost"
    },
    {
      badge: "⚠️ Unanswered Reviews Risk",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      title: "Negative Reviews Without AI Response Hurt Your Ranking Algorithm",
      description: "Google's 2026 local search algorithm penalizes profiles with unreplied reviews. Leaving customer feedback ignored drops your Geo-Grid position by an average of 4.2 ranks within 14 days.",
      stat: "4.2 Ranks",
      statLabel: "Average Ranking Drop"
    },
    {
      badge: "🛡️ Unauthorized Edit Danger",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      title: "Third-Parties & Competitors Can Secretly Change Your Phone & Hours",
      description: "Anyone on Google Maps can suggest edits to your business phone number or mark you as 'Temporarily Closed'. Without 24/7 Profile Guard Sentinel, unauthorized edits take effect automatically.",
      stat: "24/7 Risk",
      statLabel: "Without Active Sentinel Guard"
    },
    {
      badge: "⚡ Conversion Velocity Opportunity",
      badgeColor: "bg-google-blue-light text-google-blue border-google-blue/20",
      title: "1-Click AI Autopilot Recovers +34% Maps Views in 7 Days",
      description: "GBPilot analyzes 3x3 spatial rank heatmaps every 6 hours and delivers exact, pre-formatted Next Best Actions that you execute in a single click.",
      stat: "+34%",
      statLabel: "Average Maps View Increase"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFomoIndex((prev) => (prev + 1) % fomoSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Quick Audit Search Input
  const [auditQuery, setAuditQuery] = useState('');

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditQuery.trim()) return;
    router.push(`/onboarding?search=${encodeURIComponent(auditQuery)}`);
  };

  // FAQ State
  const [openFaq, setOpenFaq] = useState(0 as number | null);

  const faqs = [
    {
      q: "How does GBPilot increase my Google Maps rank without manual work?",
      a: "GBPilot acts as your 24/7 Autonomous Local SEO Manager. It continuously monitors your 3x3 Geo-Grid spatial heatmaps, tracks competitor category changes, and generates daily 1-Click optimization actions (secondary categories, GEO-targeted Google Posts, and AI review replies)."
    },
    {
      q: "Is GBPilot safe and compliant with Google's Terms of Service?",
      a: "Yes, 100%. GBPilot uses official Google Business Profile APIs and Google OAuth 2.0. All review response suggestions and profile updates strictly adhere to FTC and Google guidelines."
    },
    {
      q: "What is the 24/7 Profile Guard Sentinel?",
      a: "Profile Guard is an automated baseline monitoring system. If a competitor or random user submits an unauthorized edit (like changing your phone number or listed hours), Profile Guard detects the discrepancy and alerts you or auto-reverts it instantly."
    },
    {
      q: "Can marketing agencies use GBPilot for multiple client locations?",
      a: "Absolutely. GBPilot includes Agency Multi-Location Workspaces, White-Label PDF Audit reporting, and multi-user team permissions."
    },
    {
      q: "How quickly will I see results in my local search rankings?",
      a: "Most businesses see an immediate rank improvement in their 3x3 Geo-Grid heatmap within 5 to 10 days after executing their first set of 1-Click Next Best Actions."
    }
  ];
  return (
    <main className="min-h-screen bg-google-bg text-google-text-primary flex flex-col font-sans">
      <Navbar />
      {/* ======================================================== */}
      {/* HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-google-bg to-google-bg pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-google-border">
        {/* Google Maps Grid Background Graphic Overlay */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#3c4043_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition & Hero CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-google-blue-light text-google-blue rounded-full text-xs font-bold border border-google-blue/20 shadow-sm">
                <Sparkles className="w-4 h-4 text-google-blue" />
                <span>Next-Gen B2B Autonomous Local SEO Engine</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-google-text-primary leading-[1.15]">
                Dominate Google Maps <br className="hidden sm:inline" />
                <span className="text-google-blue bg-gradient-to-r from-google-blue to-blue-700 bg-clip-text text-transparent">
                  On 24/7 AI Autopilot
                </span>
              </h1>

              <p className="text-base sm:text-lg text-google-text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                The world’s first Proactive Growth Copilot that monitors 3x3 spatial rank heatmaps, defends against unauthorized edits, and delivers daily <strong className="text-google-text-primary font-bold">1-Click Next Best Actions</strong> to capture top #1 Google Maps positions.
              </p>

              {/* Instant Audit Search Bar (PLG Hero Hook) */}
              <div className="material-card p-3 bg-white border-2 border-google-blue/30 shadow-material-2 max-w-xl mx-auto lg:mx-0">
                <form onSubmit={handleAuditSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <MapPin className="w-5 h-5 text-google-blue absolute left-3.5 top-3.5 pointer-events-none" />
                    <input 
                      type="text"
                      required
                      placeholder="Enter business name or Google Maps URL..."
                      value={auditQuery}
                      onChange={(e) => setAuditQuery(e.target.value)}
                      className="material-input text-xs sm:text-sm !pl-11 py-3 w-full border-none focus:ring-0"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="material-button-primary w-full sm:w-auto text-xs sm:text-sm py-3 px-6 whitespace-nowrap font-bold flex items-center justify-center gap-2"
                  >
                    <span>Run Free Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-google-text-tertiary">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-google-green" /> No Google Login Required to Scan</span>
                  <span>⚡ 60-Second Geo-Grid Heatmap</span>
                </div>
              </div>

              {/* Social Proof Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-google-text-secondary">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-google-yellow">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-google-yellow text-google-yellow" />
                    ))}
                  </div>
                  <span className="font-bold text-google-text-primary">4.9/5 Rating</span>
                </div>
                <span>•</span>
                <span>📍 <strong>12,400+</strong> Business Profiles Managed</span>
                <span>•</span>
                <span className="text-google-green font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-google-green" /> 1-Click Execution
                </span>
              </div>

            </div>

            {/* Right Column: Hero Visual Asset (Geo-Grid Heatmap Card) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="material-card p-3 bg-white shadow-material-3 border border-google-border rounded-2xl overflow-hidden group">
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-google-bg">
                    <img 
                      src="/images/hero_geo_grid.png" 
                      alt="Google Maps 3x3 Geo-Grid Spatial Heatmap"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Floating Overlay Badges */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-google-border text-xs font-bold text-google-text-primary flex items-center gap-2 shadow-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-google-green animate-pulse" />
                      <span>Live Geo-Grid Radar: Rank #1</span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-google-blue text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                      <span>AI Autopilot Active</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-google-text-primary">Manhattan Bakery & Cafe</span>
                      <span className="text-google-green font-bold bg-google-green-light px-2 py-0.5 rounded">
                        Top 3 Winner
                      </span>
                    </div>
                    <p className="text-[11px] text-google-text-secondary">
                      Automated 24/7 category optimization increased Maps search views by +34% this week.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* FOMO CAROUSEL SECTION (CLIENT PAIN POINTS) */}
      {/* ======================================================== */}
      <section className="py-12 bg-white border-b border-google-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-google-red bg-google-red-light px-3 py-1 rounded-full uppercase tracking-wider">
              REAL-TIME LOCAL MAPS THREAT MONITOR
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-google-text-primary mt-2">
              Why Unmanaged Google Profiles Lose Revenue Every Hour
            </h2>
          </div>

          {/* Dynamic Interactive Carousel */}
          <div className="material-card p-6 sm:p-8 bg-google-bg border border-google-border shadow-material-1 relative overflow-hidden">
            
            <div className="grid md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-8 space-y-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${fomoSlides[fomoIndex].badgeColor}`}>
                  {fomoSlides[fomoIndex].badge}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-google-text-primary leading-tight">
                  {fomoSlides[fomoIndex].title}
                </h3>

                <p className="text-xs sm:text-sm text-google-text-secondary leading-relaxed">
                  {fomoSlides[fomoIndex].description}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <Link 
                    href="/onboarding"
                    className="material-button-primary text-xs py-2.5 px-4 font-bold flex items-center gap-1.5"
                  >
                    <span>Protect Profile in 1-Click</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-google-border text-center shadow-sm">
                <span className="text-4xl sm:text-5xl font-black text-google-red">
                  {fomoSlides[fomoIndex].stat}
                </span>
                <span className="text-xs font-bold text-google-text-secondary mt-2">
                  {fomoSlides[fomoIndex].statLabel}
                </span>
              </div>

            </div>

            {/* Slider Navigation Dots */}
            <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-google-border-light">
              {fomoSlides.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setFomoIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === fomoIndex ? 'w-8 bg-google-blue' : 'w-2 bg-google-border'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* UNFAIR ADVANTAGE & APP FEATURES (BENTO GRID) */}
      {/* ======================================================== */}
      <section className="py-16 bg-white border-b border-google-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-google-green bg-google-green-light px-3 py-1 rounded-full uppercase tracking-wider">
              The Unfair Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-google-text-primary">
              Not Just Analytics. Autonomous Execution.
            </h2>
            <p className="text-sm text-google-text-secondary leading-relaxed">
              Standard SEO tools just show you complicated dashboards and leave the hard work to you. GBPilot takes autonomous action to rank your business in the Maps Pack and AI Search Engines, keeping you in complete control with 1-Click approvals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Feature 1: AI Search Visibility */}
            <div className="material-card bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <Sparkles className="w-32 h-32 text-purple-400" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="p-2 bg-white/10 rounded-xl inline-block backdrop-blur-md">
                  <Bot className="w-6 h-6 text-purple-300" />
                </div>
                <h3 className="text-xl font-bold">AI Engine Optimization (LLM SOV)</h3>
                <p className="text-sm text-slate-300">
                  Customers are moving to ChatGPT and Perplexity for local recommendations. GBPilot optimizes your profile data so AI engines cite you first as the top local authority.
                </p>
                <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/10">
                  <span className="text-xs text-purple-300 font-bold mb-2 block">ChatGPT Query:</span>
                  <p className="text-sm italic">"What's the best bakery near me?"</p>
                  <div className="mt-3 bg-white/10 p-3 rounded-lg flex gap-3 items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs">Based on local sentiment and Google ratings, you should visit <strong>Your Business</strong>.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Maps UI & Geo-Grid */}
            <div className="material-card bg-google-bg p-6 sm:p-8 border border-google-border overflow-hidden relative">
              <div className="relative z-10 space-y-4">
                <div className="p-2 bg-google-blue-light rounded-xl inline-block">
                  <MapPin className="w-6 h-6 text-google-blue" />
                </div>
                <h3 className="text-xl font-bold text-google-text-primary">3x3 Spatial Geo-Grid</h3>
                <p className="text-sm text-google-text-secondary">
                  Track your exact Google Maps ranking across every street in your city. Don't rely on average metrics—see exactly where competitors are beating you and where you dominate.
                </p>
                
                {/* Realistic Google Maps Mockup */}
                <div className="mt-4 aspect-video rounded-xl overflow-hidden relative shadow-md group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: 'url(/images/real_google_maps.jpg)' }}
                  />
                  {/* Subtle dark overlay to make pins pop */}
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* Grid Pins */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="grid grid-cols-3 gap-3 w-full h-full max-w-[240px] max-h-[240px]">
                      {[3, 2, 3, 2, 1, 4, 3, 2, 3].map((rank, i) => (
                        <div key={i} className={`flex items-center justify-center rounded-full font-bold text-white text-sm shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-2 border-white backdrop-blur-sm transition-transform hover:scale-110 ${
                          rank === 1 ? 'bg-google-green z-10 scale-125 ring-4 ring-google-green/30' : 'bg-google-yellow'
                        }`}>
                          #{rank}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* ======================================================== */}
      {/* STORYBRAND HERO'S JOURNEY: PROBLEM -> EMPATHY -> GUIDE */}
      {/* ======================================================== */}
      <section className="py-16 bg-google-bg border-b border-google-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-16">
          
          {/* Act 1: The Problem & Character Empathy */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-google-blue bg-google-blue-light px-3 py-1 rounded-full uppercase tracking-wider">
                Act 1: The Local Business Struggle
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-google-text-primary">
                You Built a Great Business. But Google Maps Keeps Changing the Rules.
              </h2>
              <p className="text-xs sm:text-sm text-google-text-secondary leading-relaxed">
                As a business owner or marketing leader, your time should be spent serving customers and growing your revenue. Instead, you're forced to worry about invisible Google Maps rank drops, competitor category updates, and unreplied customer reviews.
              </p>
              <div className="p-4 bg-white rounded-xl border border-google-border space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-google-text-primary">
                  <XCircle className="w-4 h-4 text-google-red" />
                  <span>Manual Google Profile Management is Broken</span>
                </div>
                <p className="text-google-text-secondary">
                  Logging into Google Business Manager every day to check positions, type manual review replies, and publish posts takes hours of repetitive friction.
                </p>
              </div>
            </div>

            <div className="material-card p-6 bg-white space-y-4 border border-google-border">
              <h3 className="font-bold text-google-text-primary text-base border-b border-google-border-light pb-3">
                The Painful Reality of Manual Management
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-google-red-light/50 border border-google-red/20 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-google-red flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-google-text-primary block">Invisible Rank Drops</strong>
                    <span className="text-google-text-secondary">Your position drops from #2 to #11 in Sector 4 without any warning or notification.</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-google-text-primary block">Wasted Hours Writing Replies</strong>
                    <span className="text-google-text-secondary">Spending 45 minutes every evening drafting review replies instead of relaxing.</span>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-3">
                  <Lock className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-google-text-primary block">Vulnerable Profile Fields</strong>
                    <span className="text-google-text-secondary">Competitors suggest edits to your business category while your dashboard sits unmonitored.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Act 2: Enter The Guide (GBPilot AI Copilot) */}
          <div className="material-card p-8 bg-gradient-to-r from-google-blue to-blue-700 text-white shadow-material-2">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
                  <Bot className="w-4 h-4 text-white" /> Meet Your AI Guide
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  Meet GBPilot: Your Autonomous 24/7 Google Maps Sentinel & Copilot
                </h2>

                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  We built GBPilot to eliminate manual Google Business Manager friction forever. GBPilot acts as an intelligent co-pilot: it continuously monitors spatial 3x3 Geo-Grids, detects competitor moves, and delivers pre-formatted recommendations that you execute in 1-Click.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                    <Check className="w-4 h-4 text-google-green" /> 100% Google API Compliant
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                    <Check className="w-4 h-4 text-google-green" /> Zero Manual Typing Required
                  </span>
                </div>
              </div>

              <div className="md:col-span-4 flex justify-center">
                <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                  <Bot className="w-16 h-16 text-white animate-bounce" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3-STEP AUTOPILOT PLAN (THE SOLUTION) */}
      {/* ======================================================== */}
      <section className="py-16 bg-white border-b border-google-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-google-green bg-google-green-light px-3 py-1 rounded-full uppercase tracking-wider">
              SIMPLE 3-STEP PLAN
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-google-text-primary">
              How GBPilot Powers Autonomous Growth in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-google-text-secondary">
              No complex setup or technical marketing background required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="material-card p-6 bg-google-bg border border-google-border space-y-4 hover:shadow-material-2 transition-all relative">
              <div className="w-10 h-10 rounded-xl bg-google-blue text-white font-black text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-bold text-google-text-primary">
                Run Instant Magic Audit
              </h3>
              <p className="text-xs text-google-text-secondary leading-relaxed">
                Type your business name to trigger an instant 3x3 Geo-Grid spatial rank scan and identify top ranking leaks without logging in.
              </p>
            </div>

            {/* Step 2 */}
            <div className="material-card p-6 bg-google-bg border border-google-border space-y-4 hover:shadow-material-2 transition-all relative">
              <div className="w-10 h-10 rounded-xl bg-google-blue text-white font-black text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-bold text-google-text-primary">
                Connect Google in 1-Click
              </h3>
              <p className="text-xs text-google-text-secondary leading-relaxed">
                Authorize official Google OAuth 2.0 to link your profile. AI instantly drafts secondary category updates, welcome posts, and review replies.
              </p>
            </div>

            {/* Step 3 */}
            <div className="material-card p-6 bg-google-bg border border-google-border space-y-4 hover:shadow-material-2 transition-all relative">
              <div className="w-10 h-10 rounded-xl bg-google-green text-white font-black text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-bold text-google-text-primary">
                Enable 24/7 Autopilot
              </h3>
              <p className="text-xs text-google-text-secondary leading-relaxed">
                Sit back while Profile Guard Sentinel defends your profile 24/7 and AI delivers daily high-impact recommendations to hold #1 rank.
              </p>
            </div>

          </div>

          {/* CTA Banner */}
          <div className="text-center pt-4">
            <Link 
              href="/onboarding"
              className="material-button-primary text-sm py-3.5 px-8 font-bold inline-flex items-center gap-2 shadow-material-1"
            >
              <span>Start Free 60-Second Audit Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* BEFORE VS AFTER: PICTURE OF DISASTER VS IDEAL FUTURE */}
      {/* ======================================================== */}
      <section className="py-16 bg-google-bg border-b border-google-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-google-blue bg-google-blue-light px-3 py-1 rounded-full uppercase tracking-wider">
              TRANSFORMATION COMPARISON
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-google-text-primary">
              Manual Management vs. GBPilot AI Autopilot
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Disaster / Without GBPilot */}
            <div className="material-card p-6 bg-white border-2 border-google-red/30 space-y-4">
              <div className="flex items-center justify-between border-b border-google-border-light pb-3">
                <span className="font-bold text-google-red text-sm flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-google-red" />
                  WITHOUT GBPILOT (DISASTER)
                </span>
                <span className="text-xs text-google-red font-bold bg-google-red-light px-2.5 py-0.5 rounded">
                  High Churn Risk
                </span>
              </div>

              <ul className="space-y-3 text-xs text-google-text-secondary">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-google-red flex-shrink-0 mt-0.5" />
                  <span>Unaware of competitor category changes taking rank #1 positions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-google-red flex-shrink-0 mt-0.5" />
                  <span>Customer reviews left unreplied for days, lowering search algorithm trust.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-google-red flex-shrink-0 mt-0.5" />
                  <span>Unauthorized edits to phone numbers or hours go unnoticed.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-google-red flex-shrink-0 mt-0.5" />
                  <span>Stagnant local traffic and zero weekly Google Posts published.</span>
                </li>
              </ul>
            </div>

            {/* Ideal Future / With GBPilot */}
            <div className="material-card p-6 bg-white border-2 border-google-green/40 space-y-4 shadow-material-1">
              <div className="flex items-center justify-between border-b border-google-border-light pb-3">
                <span className="font-bold text-google-green text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-google-green" />
                  WITH GBPILOT (IDEAL FUTURE)
                </span>
                <span className="text-xs text-google-green font-bold bg-google-green-light px-2.5 py-0.5 rounded">
                  +34% Traffic Growth
                </span>
              </div>

              <ul className="space-y-3 text-xs text-google-text-primary font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-google-green flex-shrink-0 mt-0.5" />
                  <span>24/7 3x3 Geo-Grid spatial rank tracking with instant competitor alerts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-google-green flex-shrink-0 mt-0.5" />
                  <span>AI GEO-optimized review replies drafted automatically in 1-Click.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-google-green flex-shrink-0 mt-0.5" />
                  <span>Profile Guard Sentinel actively locks and reverts unauthorized edits.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-google-green flex-shrink-0 mt-0.5" />
                  <span>Daily proactive Next Best Actions delivering steady #1 Maps visibility.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Embedded Visual Comparison Image Asset */}
          <div className="material-card p-4 bg-white border border-google-border rounded-2xl overflow-hidden max-w-4xl mx-auto">
            <img 
              src="/images/disaster_vs_future.png" 
              alt="GBPilot Transformation Comparison Diagram"
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>

        </div>
      </section>

      {/* Pricing Toast Banner */}
      {pricingToast && (
        <div className="fixed top-16 right-4 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs border border-slate-700 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{pricingToast}</span>
          </div>
          <button onClick={() => setPricingToast(null)} className="p-1 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* DUBAI & GLOBAL PRICING PLANS (SECTION 6 & 10 SOT)        */}
      {/* ======================================================== */}
      <section id="pricing" className="py-20 bg-white border-b border-google-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-google-blue bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
              🇦🇪 TRANSPARENT DUBAI &amp; GLOBAL PRICING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Predictable ROI. Zero Agency Retainers.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Start with diagnostic scout mode, then deploy autonomous 24/7 protection and 1-click Local 3-Pack rank surges.
            </p>

            {/* Currency & Billing Period Switchers */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              {/* Currency Toggle */}
              <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCurrency('AED')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    currency === 'AED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🇦🇪 AED (Dirhams)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    currency === 'USD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🌐 USD ($)
                </button>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setBillingCycle('MONTHLY')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    billingCycle === 'MONTHLY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('ANNUAL')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingCycle === 'ANNUAL' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>Annual</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${billingCycle === 'ANNUAL' ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-800'}`}>
                    -20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Tier 1: Free Scout */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scout &amp; Diagnose</span>
                  <h3 className="text-xl font-bold text-slate-900">Free Scout</h3>
                  <p className="text-xs text-slate-500">For business owners testing ranking leaks before committing.</p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">
                      {currency === 'AED' ? 'AED 0' : '$0'}
                    </span>
                    <span className="text-xs text-slate-400">/forever</span>
                  </div>
                  <span className="text-[11px] text-slate-400">1 Location (Audit &amp; Diagnostic)</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Instant Health Score &amp; 3x3 Geo-Grid Heatmap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Free Manual Copy-Paste recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>1 Free Review Takedown™ legal dossier</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-400">
                    <XCircle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    <span>No 1-Click Auto-Apply</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan('FREE_SCOUT')}
                className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Start Free Scout
              </button>
            </div>

            {/* Tier 2: Starter / Solo Spot */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-google-blue uppercase tracking-wider">Solo Business Spot</span>
                  <h3 className="text-xl font-bold text-slate-900">Starter</h3>
                  <p className="text-xs text-slate-500">Full 24/7 autonomous protection and 1-click execution for 1 venue.</p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">
                      {currency === 'AED'
                        ? billingCycle === 'ANNUAL' ? 'AED 79' : 'AED 99'
                        : billingCycle === 'ANNUAL' ? '$23' : '$29'}
                    </span>
                    <span className="text-xs text-slate-400">/month</span>
                  </div>
                  <span className="text-[11px] text-google-blue font-semibold">1 Location Included</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>1-Click Instant Optimization Apply</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>24/7 Digital Insurance &amp; Sentinel Guard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>AI Review Auto-Drafts (UAE Law 34/2021)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Dynamic Hours &amp; Peak Traffic Guard</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan('STARTER')}
                className="w-full py-2.5 rounded-xl border border-blue-300 bg-blue-50/70 hover:bg-blue-100 text-google-blue font-bold text-xs transition-colors cursor-pointer"
              >
                Choose Starter
              </button>
            </div>

            {/* Tier 3: Growth / Pro (Most Popular) */}
            <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl border-2 border-blue-400 p-6 flex flex-col justify-between shadow-xl relative space-y-6">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black text-[10px] uppercase tracking-wider rounded-full shadow-md">
                ⭐ Most Popular in Dubai
              </div>

              <div className="space-y-4 pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Multi-Location &amp; Growth</span>
                  <h3 className="text-xl font-bold text-white">Growth / Pro</h3>
                  <p className="text-xs text-slate-300">Dominant rank tracking, AI search citations, and unlimited takedowns.</p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">
                      {currency === 'AED'
                        ? billingCycle === 'ANNUAL' ? 'AED 199' : 'AED 249'
                        : billingCycle === 'ANNUAL' ? '$55' : '$69'}
                    </span>
                    <span className="text-xs text-slate-400">/month</span>
                  </div>
                  <span className="text-[11px] text-blue-300 font-semibold">Up to 3 Locations Included</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-slate-800">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Everything in Starter for 3 Locations</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Geo-Grid 5x5 Rank Matrix</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>AI LLM Share-of-Voice (ChatGPT / Gemini)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Unlimited Review Takedown™</strong> Dossiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>🌙 Ramadan &amp; ☀️ Summer Mode Automations</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan('PRO_GROWTH')}
                className="w-full py-3 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Deploy Growth Pro (14-Day Free)
              </button>
            </div>

            {/* Tier 4: Agency / Chain */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Agencies &amp; Franchises</span>
                  <h3 className="text-xl font-bold text-slate-900">Agency / Chain</h3>
                  <p className="text-xs text-slate-500">White-label reports and high-volume multi-account workflows.</p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">
                      {currency === 'AED'
                        ? billingCycle === 'ANNUAL' ? 'AED 599' : 'AED 749'
                        : billingCycle === 'ANNUAL' ? '$159' : '$199'}
                    </span>
                    <span className="text-xs text-slate-400">/month</span>
                  </div>
                  <span className="text-[11px] text-purple-700 font-semibold">Up to 10 Locations Included</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Up to 10 Locations Connected</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>White-Label PDF &amp; WhatsApp Audit Reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>Dedicated Dubai Strategist via WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>Priority Google API Level-2 Queuing</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan('AGENCY')}
                className="w-full py-2.5 rounded-xl border border-purple-300 bg-purple-50/70 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Choose Agency
              </button>
            </div>

          </div>

          {/* Seasonal Sleep Mode Downsell Banner (From Bible_SoT Monetization) */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-base">🌙</span>
                <h4 className="font-bold text-amber-950 text-sm">
                  Dubai Seasonal Business or Summer Vacation? Meet Sleep Mode.
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200/60 text-amber-900 rounded-full">
                  {currency === 'AED' ? 'AED 33 / mo' : '$9 / mo'}
                </span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed max-w-2xl">
                Don't lose your hard-earned Google Maps rankings during the July–August low season. Sleep Mode freezes your baseline Golden Snapshot, prevents malicious tampering while you are away, and wakes up instantly when season starts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setPricingToast('Sleep Mode activated for seasonal freeze.');
                setTimeout(() => setPricingToast(null), 3500);
              }}
              className="px-4 py-2 bg-white hover:bg-amber-100/60 text-amber-950 font-bold rounded-xl border border-amber-300 text-xs shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              Learn about Sleep Mode ($9/mo)
            </button>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SOCIAL PROOF & CASE STUDIES */}
      {/* ======================================================== */}
      <section className="py-16 bg-white border-b border-google-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-google-blue bg-google-blue-light px-3 py-1 rounded-full uppercase tracking-wider">
              PROVEN CASE STUDIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-google-text-primary">
              Trusted by 12,400+ Local Businesses & Agencies
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Testimonial 1 */}
            <div className="material-card p-6 bg-google-bg border border-google-border space-y-4">
              <div className="flex text-google-yellow">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-google-yellow text-google-yellow" />
                ))}
              </div>
              <p className="text-xs text-google-text-primary italic leading-relaxed">
                "GBPilot identified that our top competitor added 'Espresso Bar' as a secondary category. We injected it in 1-Click, and our weekend foot traffic jumped +28% in under 10 days."
              </p>
              <div className="pt-2 border-t border-google-border-light flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-google-blue text-white font-bold text-xs flex items-center justify-center">
                  MS
                </div>
                <div>
                  <strong className="text-xs text-google-text-primary block">Marcus S.</strong>
                  <span className="text-[11px] text-google-text-secondary">Owner, Manhattan Specialty Cafe</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="material-card p-6 bg-google-bg border border-google-border space-y-4">
              <div className="flex text-google-yellow">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-google-yellow text-google-yellow" />
                ))}
              </div>
              <p className="text-xs text-google-text-primary italic leading-relaxed">
                "Profile Guard saved our business! A rival suggested an edit changing our listed closing hours to 5 PM on Fridays. Profile Guard flagged it instantly and prevented lost weekend calls."
              </p>
              <div className="pt-2 border-t border-google-border-light flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-google-green text-white font-bold text-xs flex items-center justify-center">
                  EL
                </div>
                <div>
                  <strong className="text-xs text-google-text-primary block">Elena L.</strong>
                  <span className="text-[11px] text-google-text-secondary">Manager, Sector 4 Dental Clinic</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="material-card p-6 bg-google-bg border border-google-border space-y-4">
              <div className="flex text-google-yellow">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-google-yellow text-google-yellow" />
                ))}
              </div>
              <p className="text-xs text-google-text-primary italic leading-relaxed">
                "As an agency managing 45 local profiles, GBPilot’s daily Next Best Actions and 1-Click execution saved our account managers 20+ hours every single week."
              </p>
              <div className="pt-2 border-t border-google-border-light flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  DK
                </div>
                <div>
                  <strong className="text-xs text-google-text-primary block">David K.</strong>
                  <span className="text-[11px] text-google-text-secondary">Founder, Local Reach Agency</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {/* ======================================================== */}
      <section className="py-16 bg-google-bg border-b border-google-border">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-google-blue bg-google-blue-light px-3 py-1 rounded-full uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-google-text-primary">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="material-card bg-white border border-google-border overflow-hidden transition-all"
                >
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-google-text-primary hover:bg-google-bg/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-google-text-tertiary transition-transform ${isOpen ? 'rotate-180 text-google-blue' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-google-text-secondary leading-relaxed border-t border-google-border-light pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* BOTTOM HERO CTA BANNER */}
      {/* ======================================================== */}
      <section className="py-16 bg-gradient-to-r from-google-blue to-blue-700 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4 text-white" /> Start Autonomous Growth Today
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Ready to Take #1 Google Maps Positions on 24/7 Autopilot?
          </h2>

          <p className="text-xs sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Run your free 60-second Geo-Grid spatial rank audit right now. No credit card required.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/onboarding"
              className="bg-white text-google-blue font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-google-bg transition-all text-sm flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-google-blue fill-google-blue" />
              <span>Launch 60-Second Free Audit</span>
            </Link>
          </div>

          <div className="pt-4 text-xs text-blue-200 flex items-center justify-center gap-6">
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-google-green" /> Free 3x3 Geo-Grid Heatmap</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-google-green" /> Official Google OAuth 2.0</span>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
