'use client';

import React from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  Zap, 
  Map,
  TrendingUp,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AuditLandingPage({ params }: { params: { audit_id: string } }) {
  // In a real app, we would fetch data using params.audit_id from Supabase
  const healthScore = 54;
  const estimatedRevenueGain = "$1,250";
  const estimatedClientGain = "+45";

  return (
    <div className="min-h-screen bg-google-bg flex flex-col font-sans">
      
      {/* Public Header */}
      <header className="bg-white border-b border-google-border py-4 px-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-google-blue flex items-center justify-center shadow">
              <Map className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-google-text-primary">
              GB<span className="text-google-blue">Pilot</span> Audit Report
            </span>
          </div>

          <Link href="/onboarding" className="material-button-primary text-xs py-2 px-4 shadow hover:shadow-md transition">
            <span>Fix My Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Title Block */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-extrabold text-google-red bg-google-red-light px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            CONFIDENTIAL LOCAL SEO AUDIT
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-google-text-primary tracking-tight">
            Central District Bakery & Coffee
          </h1>
          <p className="text-sm text-google-text-secondary">102 Central Ave, New York • Audit Ref: {params.audit_id}</p>
        </div>

        {/* Top Section: Circular Chart + Potential Gains */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Health Score Circular Chart */}
          <div className="material-card p-8 bg-google-red-light/30 border-2 border-google-red/20 flex flex-col items-center justify-center text-center shadow-sm">
            <h3 className="font-bold text-google-text-primary mb-6 text-sm">Overall GBP Health Score</h3>
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white drop-shadow-sm"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-google-red animate-[dash_1.5s_ease-out_forwards]"
                  strokeDasharray={`${healthScore}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-google-red">{healthScore}%</span>
                <span className="text-[10px] text-google-red uppercase font-bold tracking-widest mt-1">Critical</span>
              </div>
            </div>
            <p className="text-xs text-google-text-primary font-medium mt-6">Your profile is currently losing up to 35% of high-intent search queries to competitors.</p>
          </div>

          {/* Potential Gains */}
          <div className="material-card p-8 bg-google-green-light/30 border-2 border-google-green/30 flex flex-col justify-center shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-google-green" />
              <h3 className="font-bold text-lg text-google-text-primary">Potential Weekly Growth</h3>
            </div>
            
            <p className="text-sm text-google-text-secondary font-medium mb-6">
              By applying our AI-recommended fixes to your Google Business Profile, our algorithm projects the following growth over the next 7 days:
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-google-green/20 shadow-sm">
                <span className="block text-xs text-google-text-secondary font-bold mb-1">New Local Clients</span>
                <span className="text-3xl font-black text-google-green">{estimatedClientGain}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-google-green/20 shadow-sm">
                <span className="block text-xs text-google-text-secondary font-bold mb-1">Est. Revenue Boost</span>
                <span className="text-3xl font-black text-google-blue">{estimatedRevenueGain}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3x3 Geo-Grid Spatial Snapshot */}
        <div className="material-card p-6 bg-white border border-google-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-google-text-primary text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-google-blue" />
                Live 3x3 Geo-Grid Heatmap (Keyword: "bakery near me")
              </h3>
              <p className="text-xs text-google-text-secondary mt-1">Red circles indicate streets where local customers do not see your business.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {[
              { rank: 2 }, { rank: 4 }, { rank: 7 },
              { rank: 3 }, { rank: 9 }, { rank: 12 },
              { rank: 6 }, { rank: 11 }, { rank: 14 }
            ].map((item, idx) => (
              <div 
                key={idx}
                className={`h-20 rounded-xl flex flex-col items-center justify-center font-bold text-white shadow-sm border border-white/20 ${
                  item.rank <= 3 ? 'bg-google-green' : item.rank <= 8 ? 'bg-google-yellow' : 'bg-google-red'
                }`}
              >
                <span className="text-[10px] opacity-90 uppercase tracking-wider font-semibold">Rank</span>
                <span className="text-2xl font-black">#{item.rank}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Red & Green Blocks: Disaster vs Action */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* RED BLOCK: What is decreasing ranking */}
          <div className="material-card p-6 bg-google-red-light/20 border-2 border-google-red/30">
            <h3 className="font-bold text-google-red text-sm flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5" />
              Critical Ranking Leaks (Current State)
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-google-red/20 shadow-sm text-xs">
                <strong className="text-google-text-primary block mb-1">Missing "Artisan Espresso Bar" Category</strong>
                <span className="text-google-text-secondary">Competitors offering espresso in Sector 4 are stealing 40% of morning map impressions.</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-google-red/20 shadow-sm text-xs">
                <strong className="text-google-text-primary block mb-1">Stagnant Profile (0 Posts in 21 Days)</strong>
                <span className="text-google-text-secondary">Google's algorithm penalizes your ranking for lack of fresh content updates.</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-google-red/20 shadow-sm text-xs">
                <strong className="text-google-text-primary block mb-1">15 Unanswered Reviews</strong>
                <span className="text-google-text-secondary">Customer trust is dropping, signaling poor engagement to AI search engines.</span>
              </div>
            </div>
          </div>

          {/* GREEN BLOCK: How to fix it fast */}
          <div className="material-card p-6 bg-google-green-light/20 border-2 border-google-green/40 shadow-material-1">
            <h3 className="font-bold text-google-green text-sm flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5" />
              Quick Action Plan (Next Steps)
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-google-green/20 shadow-sm text-xs flex gap-3">
                <div className="bg-google-green text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <strong className="text-google-text-primary block mb-1">Inject Secondary Categories</strong>
                  <span className="text-google-text-secondary">AI suggests 3 optimal categories to instantly capture hidden traffic.</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-google-green/20 shadow-sm text-xs flex gap-3">
                <div className="bg-google-green text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <strong className="text-google-text-primary block mb-1">Activate Auto-Responder</strong>
                  <span className="text-google-text-secondary">Clear the backlog of 15 reviews in seconds using SEO-optimized AI replies.</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-google-green/20 shadow-sm text-xs flex gap-3">
                <div className="bg-google-green text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <strong className="text-google-text-primary block mb-1">Enable Profile Guard</strong>
                  <span className="text-google-text-secondary">Lock business hours and phone numbers from unauthorized competitor edits.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Call-to-Action Card */}
        <div className="material-card p-8 bg-gradient-to-r from-google-blue to-blue-700 text-white text-center space-y-5 shadow-material-3">
          <h2 className="text-2xl font-black">Execute This Plan on Autopilot</h2>
          <p className="text-sm text-blue-100 max-w-lg mx-auto leading-relaxed">
            Don't waste hours logging into Google Business Manager. Connect your profile securely to GBPilot AI and execute these fixes in 1-Click.
          </p>

          <Link 
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 bg-white text-google-blue font-bold px-8 py-4 rounded-xl shadow-lg hover:scale-105 hover:bg-google-bg transition-all text-sm"
          >
            <Zap className="w-5 h-5 fill-google-blue" />
            <span>Connect Google & Fix Now</span>
          </Link>
          <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest mt-2">14-Day Free Trial included</p>
        </div>

      </main>
    </div>
  );
}
