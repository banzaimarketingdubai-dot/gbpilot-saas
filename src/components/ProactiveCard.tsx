'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  AlertTriangle, 
  MessageSquare, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ArrowUpRight,
  HelpCircle,
  TrendingUp,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface Recommendation {
  id: string;
  impactBadge: string;
  category: string;
  targetProjection: string;
  title: string;
  description: string;
  actionButtonText: string;
  status: 'PENDING' | 'EXECUTED' | 'DISMISSED';
  previewContent: {
    text?: string;
    keywords?: string[];
    details?: string[];
  };
}

interface ProactiveCardProps {
  recommendation: Recommendation;
  onExecute: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const ProactiveCard: React.FC<ProactiveCardProps> = ({
  recommendation,
  onExecute,
  onDismiss,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDone, setIsDone] = useState(recommendation.status === 'EXECUTED');

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case '⚡ High Impact':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case '🚨 Rank Alert':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case '💬 Review Opportunity':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case '🛠️ Profile Fix':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case '🌙 Dynamic Hours':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getBadgeIcon = (badge: string) => {
    if (badge.includes('⚡')) return <Zap className="w-3.5 h-3.5 mr-1 fill-emerald-600 text-emerald-600" />;
    if (badge.includes('🚨')) return <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />;
    if (badge.includes('💬')) return <MessageSquare className="w-3.5 h-3.5 mr-1 text-blue-600" />;
    if (badge.includes('🛠️')) return <Wrench className="w-3.5 h-3.5 mr-1 text-amber-700" />;
    if (badge.includes('🌙')) return <Clock className="w-3.5 h-3.5 mr-1 text-purple-700" />;
    return <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />;
  };

  const handle1ClickExecute = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExecuting || isDone) return;

    setIsExecuting(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#1A73E8', '#1E8E3E', '#F9AB00', '#10B981']
      });
    } catch {
      // Fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsExecuting(false);
    setIsDone(true);
    onExecute(recommendation.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`material-card p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
        isDone 
          ? 'border-emerald-300 bg-emerald-50/20 shadow-xs' 
          : 'border-slate-200 bg-white hover:shadow-material-2 hover:border-slate-300'
      }`}
    >
      <div className="space-y-4">
        {/* Top Header Row: Impact Badge & Target Projection */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeStyle(recommendation.impactBadge)}`}>
              {getBadgeIcon(recommendation.impactBadge)}
              {recommendation.impactBadge}
            </span>
            <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {recommendation.category.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>{recommendation.targetProjection}</span>
          </div>
        </div>

        {/* 1. What was detected */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <span>Issue Detected:</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {recommendation.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mt-1">
            {recommendation.description}
          </p>
        </div>

        {/* 2. What this gives the business */}
        <div className="p-3 bg-gradient-to-r from-emerald-50/60 to-blue-50/40 rounded-xl border border-emerald-100 text-xs text-slate-700 flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
            📈
          </div>
          <div className="space-y-0.5">
            <span className="font-bold text-emerald-950 block">Projected Business Impact:</span>
            <span className="text-[11px] text-slate-600 leading-normal">
              Improves Google Maps local visibility and yields approx. <strong>{recommendation.targetProjection}</strong> without paid advertising.
            </span>
          </div>
        </div>

        {/* 3. Expandable Action Details / Payload */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 text-xs"
            >
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-slate-700 font-medium">
                  <span className="flex items-center text-google-blue font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    Pre-computed changes for Google Maps:
                  </span>
                  <span className="text-[10px] bg-blue-50 text-google-blue px-2 py-0.5 rounded font-bold border border-blue-200">
                    AI Verified
                  </span>
                </div>

                {recommendation.previewContent.text && (
                  <p className="text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200 text-xs italic leading-relaxed">
                    &ldquo;{recommendation.previewContent.text}&rdquo;
                  </p>
                )}

                {recommendation.previewContent.keywords && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-slate-500 text-[10px] font-bold">SEO Keywords:</span>
                    {recommendation.previewContent.keywords.map((kw, i) => (
                      <span key={i} className="bg-white text-google-blue border border-blue-200 px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}

                {recommendation.previewContent.details && (
                  <ul className="space-y-1 text-slate-600 pt-1">
                    {recommendation.previewContent.details.map((dt, idx) => (
                      <li key={idx} className="flex items-center text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shrink-0" />
                        {dt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Action Controls: Preview & 1-Click Approval */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-500 hover:text-google-blue flex items-center font-medium transition-colors cursor-pointer"
        >
          {isExpanded ? (
            <>
              Hide Details <ChevronUp className="w-3.5 h-3.5 ml-1" />
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 mr-1" />
              What will change? <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </>
          )}
        </button>

        <div className="flex items-center space-x-2">
          {!isDone && (
            <button
              onClick={() => onDismiss(recommendation.id)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Dismiss
            </button>
          )}

          <button
            onClick={handle1ClickExecute}
            disabled={isExecuting || isDone}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isDone
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                : 'bg-google-blue hover:bg-blue-600 text-white'
            }`}
          >
            {isExecuting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Applying...</span>
              </>
            ) : isDone ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Executed (1-Click)</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-white text-white" />
                <span>{recommendation.actionButtonText || 'Apply in 1-Click'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
