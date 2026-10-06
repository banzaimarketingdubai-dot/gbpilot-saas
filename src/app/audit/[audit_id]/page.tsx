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
  Map 
} from 'lucide-react';
import Link from 'next/link';

export default function AuditLandingPage({ params }: { params: { audit_id: string } }) {
  return (
    <div className="min-h-screen bg-google-bg flex flex-col">
      
      {/* Public Header */}
      <header className="bg-white border-b border-google-border py-4 px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-google-blue flex items-center justify-center shadow">
              <Map className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-google-text-primary">
              GB<span className="text-google-blue">Pilot</span> Audit Report
            </span>
          </div>

          <Link href="/onboarding" className="material-button-primary text-xs py-2 px-4">
            <span>Claim Free 14-Day Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Teaser Header Card */}
        <div className="material-card p-6 bg-white border-2 border-google-red/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-google-border-light pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-google-red bg-google-red-light px-2.5 py-1 rounded-full uppercase tracking-wider">
                CONFIDENTIAL LOCAL SEO AUDIT
              </span>
              <h1 className="text-2xl font-black text-google-text-primary mt-2">
                Central District Bakery & Coffee
              </h1>
              <p className="text-xs text-google-text-secondary">102 Central Ave, New York • Audit ID: {params.audit_id}</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-google-text-secondary block">Health Score</span>
              <span className="text-3xl font-black text-amber-600">54 / 100</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Warning:</strong> Your profile is currently losing up to 35% of high-intent morning search queries to neighboring competitors in Sector 4.
            </span>
          </div>
        </div>

        {/* 3x3 Geo-Grid Spatial Snapshot */}
        <div className="material-card p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-google-text-primary text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-google-blue" />
                3x3 Geo-Grid Heatmap (Keyword: "bakery near me")
              </h3>
              <p className="text-xs text-google-text-secondary">Red circles indicate positions where local customers do not see your business.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {[
              { rank: 2 }, { rank: 4 }, { rank: 7 },
              { rank: 3 }, { rank: 9 }, { rank: 12 },
              { rank: 6 }, { rank: 11 }, { rank: 14 }
            ].map((item, idx) => (
              <div 
                key={idx}
                className={`h-20 rounded-xl flex flex-col items-center justify-center font-bold text-white shadow-sm ${
                  item.rank <= 3 ? 'bg-google-green' : item.rank <= 8 ? 'bg-google-yellow' : 'bg-google-red'
                }`}
              >
                <span className="text-[10px] opacity-80">Rank</span>
                <span className="text-2xl font-black">#{item.rank}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Critical Issues Identified */}
        <div className="material-card p-6 bg-white space-y-4">
          <h3 className="font-bold text-google-text-primary text-sm">3 Critical Vulnerabilities Identified</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-google-bg rounded-xl border border-google-border flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-google-red flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-google-text-primary block">Missing Secondary Category: "Artisan Espresso Bar"</strong>
                <span className="text-google-text-secondary">Competitors offering espresso drive 40% higher map impressions.</span>
              </div>
            </div>

            <div className="p-3 bg-google-bg rounded-xl border border-google-border flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-google-red flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-google-text-primary block">No Google Posts in Past 21 Days</strong>
                <span className="text-google-text-secondary">Google freshness algorithm penalizes inactive local listings.</span>
              </div>
            </div>

            <div className="p-3 bg-google-bg rounded-xl border border-google-border flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-google-red flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-google-text-primary block">Profile Guard Sentinel Disabled</strong>
                <span className="text-google-text-secondary">Risk of third parties suggesting unauthorized edits to your phone number or business hours.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Call-to-Action Card */}
        <div className="material-card p-8 bg-gradient-to-r from-google-blue to-blue-700 text-white text-center space-y-4 shadow-material-3">
          <h2 className="text-2xl font-black">Fix These Vulnerabilities in 1-Click</h2>
          <p className="text-xs text-blue-100 max-w-md mx-auto">
            Claim your 14-day free trial of GBPilot AI Growth Copilot to automatically fix these ranking leaks and protect your profile 24/7.
          </p>

          <Link 
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 bg-white text-google-blue font-bold px-8 py-3.5 rounded-xl shadow hover:bg-google-bg transition-all text-sm"
          >
            <Zap className="w-4 h-4 fill-google-blue" />
            <span>Claim 14-Day Free Pro Trial</span>
          </Link>
        </div>

      </main>
    </div>
  );
}
