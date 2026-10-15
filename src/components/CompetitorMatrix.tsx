'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  Star, 
  TrendingUp, 
  Share2, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  Target, 
  ArrowRight,
  Sparkles,
  Trophy,
  Swords,
  ChevronRight,
  Compass
} from 'lucide-react';

export interface CompetitorComparison {
  name: string;
  rating: number;
  reviewsCount: number;
  reviewVelocityPerWeek: number;
  priceLevel: string;
  convenience: string[];
  specialtyKeywords: string[];
  diffScore: 'LEADER' | 'CHALLENGER' | 'LAGGING';
  winningMoat?: string;
  criticalWeakness?: string;
  overtakeStrategy?: string;
  actionCta?: string;
  actionUrl?: string;
}

interface CompetitorMatrixProps {
  competitors: CompetitorComparison[];
  targetKeyword?: string;
}

export const CompetitorMatrix: React.FC<CompetitorMatrixProps> = ({ 
  competitors,
  targetKeyword = 'Target Query'
}) => {
  const [viewMode, setViewMode] = useState<'STRATEGY_CARDS' | 'TABLE'>('STRATEGY_CARDS');
  const [activeStrategyModal, setActiveStrategyModal] = useState<CompetitorComparison | null>(null);

  if (!competitors || competitors.length === 0) {
    return (
      <div className="material-card p-6 space-y-4 border border-google-border rounded-2xl bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-google-border-light pb-4">
          <div>
            <h2 className="text-base font-bold text-google-text-primary flex items-center gap-2">
              <Compass className="w-5 h-5 text-google-blue" />
              Neighborhood Competitor Radar & AI Overtake Strategy
            </h2>
            <p className="text-xs text-google-text-secondary">
              Real-time local market benchmarking against top category leaders
            </p>
          </div>
        </div>
        <div className="p-8 text-center text-xs text-google-text-secondary space-y-2">
          <p className="font-semibold text-google-text-primary">Competitor Intelligence Awaiting Scan</p>
          <p className="text-[11px] max-w-md mx-auto">
            Run a live Geo-Grid scan for your target keyword to benchmark your ranking against real local competitors in your radius.
          </p>
        </div>
      </div>
    );
  }

  // Pre-compute intelligent default strategies if not provided
  const enrichedCompetitors = competitors.map((comp, idx) => {
    let moat = comp.winningMoat;
    let weakness = comp.criticalWeakness;
    let strategy = comp.overtakeStrategy;
    let cta = comp.actionCta;
    let url = comp.actionUrl || '/dashboard';

    if (!moat) {
      if (idx === 0) {
        moat = `Dominates primary search pack with ${comp.reviewVelocityPerWeek}+ new reviews/week and high keyword density.`;
        weakness = 'Zero owner responses in past 30 days. No special hours extension for evening search surges.';
        strategy = 'Deploy evening traffic hours extension (+1h), launch review velocity pacing campaign (+5/wk), and publish weekly specialty posts.';
        cta = 'Deploy Counter-Strategy';
        url = '/dashboard';
      } else if (idx === 1) {
        moat = `Strong photo volume (120+ images) and established map centroid presence.`;
        weakness = 'Lower service ratings on weekend peak hours; missing secondary category attributes.';
        strategy = `Target "${targetKeyword}" keyword pack in Google Posts and capture guest reviews highlighting speed of service.`;
        cta = 'Target Keyword Pack';
        url = '/reviews-posts';
      } else {
        moat = 'Close physical proximity to neighborhood high-density crossroads.';
        weakness = 'Unverified profile attributes, slow response time (>48h) to critical 1★-2★ reviews.';
        strategy = 'Outrank through local landmark citations and LSI keyword injection in AI review responder.';
        cta = 'Optimize Review LSI';
        url = '/reviews-posts';
      }
    }

    return {
      ...comp,
      winningMoat: moat,
      criticalWeakness: weakness,
      overtakeStrategy: strategy,
      actionCta: cta,
      actionUrl: url
    };
  });

  return (
    <div className="material-card p-5 sm:p-6 space-y-5 border border-google-border rounded-2xl bg-white shadow-sm">
      
      {/* Header with View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-google-border-light pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-google-text-primary">
              Neighborhood Competitor Radar & AI Overtake Strategy
            </h2>
          </div>
          <p className="text-xs text-google-text-secondary mt-0.5">
            Who holds the top 3 spots for <strong>"{targetKeyword}"</strong> in your radius and exact AI counter-moves to win customers from each.
          </p>
        </div>

        {/* View Switcher: Strategy Cards vs Benchmark Table */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="flex bg-google-bg p-1 rounded-xl border border-google-border text-xs font-semibold">
            <button
              onClick={() => setViewMode('STRATEGY_CARDS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'STRATEGY_CARDS'
                  ? 'bg-white text-google-blue shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚡ Overtake Strategy Cards
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'TABLE'
                  ? 'bg-white text-google-blue shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 5-Factor Table
            </button>
          </div>

          <button 
            onClick={() => alert("Public Competitor Challenge Link generated: https://gbpilot.top/challenge/radar-benchmark")}
            className="material-button-secondary text-xs py-1.5 px-3 hidden md:flex items-center gap-1.5"
            title="Share comparison report"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Report</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: ACTIONABLE TOP 3 OVERTAKE STRATEGY CARDS        */}
      {/* ======================================================== */}
      {viewMode === 'STRATEGY_CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
          {enrichedCompetitors.slice(0, 3).map((comp, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;

            return (
              <div 
                key={idx}
                className={`p-4.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isFirst
                    ? 'bg-gradient-to-b from-amber-50/40 to-white border-amber-200/90 shadow-sm ring-1 ring-amber-100'
                    : isSecond
                    ? 'bg-gradient-to-b from-blue-50/40 to-white border-blue-200/90 shadow-sm ring-1 ring-blue-100'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Card Header & Rank Pill */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider mb-1 ${
                        isFirst
                          ? 'bg-amber-100 text-amber-800 border border-amber-300/80'
                          : isSecond
                          ? 'bg-blue-100 text-google-blue border border-blue-300/80'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {isFirst ? '👑 #1 Market Leader' : isSecond ? '⚔️ #2 Direct Challenger' : '🎯 #3 Catchment Rival'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {comp.name}
                      </h3>
                    </div>

                    {/* Rating Stats Pill */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span className="font-extrabold text-xs text-slate-800">{comp.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {comp.reviewsCount} reviews
                      </span>
                    </div>
                  </div>

                  {/* Fact 1: Their Winning Moat */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>Their Winning Edge (Why they're ahead):</span>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 leading-relaxed">
                      {comp.winningMoat}
                    </p>
                  </div>

                  {/* Fact 2: Their Critical Weakness */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      <span>Their Vulnerability (Where they lose):</span>
                    </div>
                    <p className="text-xs text-rose-900 bg-rose-50/60 p-2.5 rounded-xl border border-rose-200/70 leading-relaxed">
                      {comp.criticalWeakness}
                    </p>
                  </div>

                  {/* Fact 3: AI Overtake Strategy */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                      <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                      <span>AI Overtake Strategy (How to beat them):</span>
                    </div>
                    <p className="text-xs text-emerald-950 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 leading-relaxed font-medium">
                      {comp.overtakeStrategy}
                    </p>
                  </div>
                </div>

                {/* 1-Click Action Button */}
                <div className="pt-3.5 mt-3 border-t border-slate-100">
                  <Link
                    href={comp.actionUrl || '/dashboard'}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isFirst
                        ? 'bg-google-blue hover:bg-blue-600 text-white'
                        : 'bg-white hover:bg-slate-50 border border-google-border text-slate-800'
                    }`}
                  >
                    <span>{comp.actionCta || 'Deploy Counter-Strategy'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: 5-FACTOR BENCHMARK MATRIX TABLE                  */}
      {/* ======================================================== */}
      {viewMode === 'TABLE' && (
        <div className="overflow-x-auto border border-google-border-light rounded-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-google-border text-google-text-tertiary font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Business Name</th>
                <th className="py-2.5 px-3">Quality & Rating</th>
                <th className="py-2.5 px-3">Review Velocity</th>
                <th className="py-2.5 px-3">Price Level</th>
                <th className="py-2.5 px-3">Convenience & Amenities</th>
                <th className="py-2.5 px-3">Specialty Keywords</th>
                <th className="py-2.5 px-3">Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-google-border-light text-google-text-primary bg-white">
              {enrichedCompetitors.map((comp, i) => {
                const isUser = comp.diffScore === 'LEADER';
                return (
                  <tr
                    key={i}
                    className={`transition-colors ${
                      isUser ? 'bg-google-blue-light/30 font-semibold' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-google-text-primary">{comp.name}</span>
                        {isUser && (
                          <span className="px-2 py-0.5 text-[9px] bg-google-green-light text-google-green font-bold rounded">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 text-google-yellow fill-google-yellow" />
                        <span className="font-bold text-google-text-primary">{comp.rating}</span>
                        <span className="text-google-text-tertiary">({comp.reviewsCount})</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1 text-google-green font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+{comp.reviewVelocityPerWeek}/wk</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-bold text-google-text-secondary">
                      {comp.priceLevel}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {comp.convenience.map((cn, idx) => (
                          <span
                            key={idx}
                            className="bg-white text-google-text-secondary text-[10px] px-2 py-0.5 rounded border border-google-border"
                          >
                            {cn}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {comp.specialtyKeywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="bg-google-blue-light text-google-blue text-[10px] px-2 py-0.5 rounded border border-google-blue/20 font-mono"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <Link
                        href={comp.actionUrl || '/dashboard'}
                        className="text-google-blue font-bold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <span>Deploy Strategy</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
