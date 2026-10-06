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
  ExternalLink
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function B2BLandingPage() {
  const router = useRouter();
  
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
    <div className="min-h-screen bg-google-bg text-google-text-primary flex flex-col font-sans">
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
                    <MapPin className="w-5 h-5 text-google-blue absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      required
                      placeholder="Enter business name or Google Maps URL..."
                      value={auditQuery}
                      onChange={(e) => setAuditQuery(e.target.value)}
                      className="material-input text-xs sm:text-sm pl-11 py-3 w-full border-none focus:ring-0"
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

      {/* ======================================================== */}
      {/* FOOTER */}
      {/* ======================================================== */}
      <footer className="bg-white border-t border-google-border py-8 text-xs text-google-text-secondary">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-google-blue flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-google-text-primary text-sm">GBPilot</span>
            <span>© 2026 SHER DIGITAL CORE. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-google-blue transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-google-blue transition-colors">
              Terms of Service
            </Link>
            <Link href="/onboarding" className="hover:text-google-blue transition-colors">
              Audit Scanner
            </Link>
            <Link href="/dashboard" className="hover:text-google-blue transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
