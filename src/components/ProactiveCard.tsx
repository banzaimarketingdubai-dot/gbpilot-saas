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
  ArrowUpRight
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
        return 'bg-google-green-light text-google-green border-google-green/30';
      case '🚨 Rank Alert':
        return 'bg-google-red-light text-google-red border-google-red/30';
      case '💬 Review Opportunity':
        return 'bg-google-blue-light text-google-blue border-google-blue/30';
      case '🛠️ Profile Fix':
        return 'bg-google-yellow-light text-amber-700 border-google-yellow/40';
      case '🌙 Dynamic Hours':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-google-bg text-google-text-secondary border-google-border';
    }
  };

  const getBadgeIcon = (badge: string) => {
    if (badge.includes('⚡')) return <Zap className="w-3.5 h-3.5 mr-1 fill-google-green text-google-green" />;
    if (badge.includes('🚨')) return <AlertTriangle className="w-3.5 h-3.5 mr-1 text-google-red" />;
    if (badge.includes('💬')) return <MessageSquare className="w-3.5 h-3.5 mr-1 text-google-blue" />;
    if (badge.includes('🛠️')) return <Wrench className="w-3.5 h-3.5 mr-1 text-amber-700" />;
    if (badge.includes('🌙')) return <Clock className="w-3.5 h-3.5 mr-1 text-purple-700" />;
    return <Sparkles className="w-3.5 h-3.5 mr-1 text-google-blue" />;
  };

  const handle1ClickExecute = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExecuting || isDone) return;

    setIsExecuting(true);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#1A73E8', '#1E8E3E', '#F9AB00']
      });
    } catch {
      // Fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

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
      className={`material-card p-5 border transition-all duration-200 ${
        isDone ? 'border-google-green/40 bg-google-green-light/20' : 'border-google-border-light hover:shadow-material-2'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(recommendation.impactBadge)}`}>
            {getBadgeIcon(recommendation.impactBadge)}
            {recommendation.impactBadge}
          </span>
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-google-bg text-google-text-secondary border border-google-border">
            {recommendation.category.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-xs font-bold text-google-green bg-google-green-light px-2.5 py-0.5 rounded-full border border-google-green/20">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>{recommendation.targetProjection}</span>
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-base font-bold text-google-text-primary mb-1 leading-snug">
        {recommendation.title}
      </h3>
      <p className="text-xs text-google-text-secondary leading-relaxed mb-3">
        {recommendation.description}
      </p>

      {/* Expandable Preview Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 pt-3 border-t border-google-border-light text-xs"
          >
            <div className="bg-google-bg rounded-lg p-3 border border-google-border space-y-2">
              <div className="flex items-center justify-between text-google-text-secondary font-medium">
                <span className="flex items-center text-google-blue font-bold">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Pre-Computed AI Action Payload:
                </span>
                <span className="text-[10px] bg-google-blue-light text-google-blue px-2 py-0.5 rounded font-bold">
                  GEO LSI Ready
                </span>
              </div>

              {recommendation.previewContent.text && (
                <p className="text-google-text-primary bg-white p-2.5 rounded border border-google-border text-xs italic">
                  "{recommendation.previewContent.text}"
                </p>
              )}

              {recommendation.previewContent.keywords && (
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-google-text-tertiary text-[11px] font-semibold">LSI Tags:</span>
                  {recommendation.previewContent.keywords.map((kw, i) => (
                    <span key={i} className="bg-white text-google-text-secondary border border-google-border px-2 py-0.5 rounded text-[10px] font-medium">
                      #{kw}
                    </span>
                  ))}
                </div>
              )}

              {recommendation.previewContent.details && (
                <ul className="space-y-1 text-google-text-secondary pt-1">
                  {recommendation.previewContent.details.map((dt, idx) => (
                    <li key={idx} className="flex items-center text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-google-green mr-2" />
                      {dt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-google-border-light">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-google-text-secondary hover:text-google-blue flex items-center font-medium transition-colors"
        >
          {isExpanded ? (
            <>
              Hide Payload Details <ChevronUp className="w-3.5 h-3.5 ml-1" />
            </>
          ) : (
            <>
              Preview Content Payload <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </>
          )}
        </button>

        <div className="flex items-center space-x-2">
          {!isDone && (
            <button
              onClick={() => onDismiss(recommendation.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-google-text-secondary hover:text-google-red hover:bg-google-red-light transition-all"
            >
              Dismiss
            </button>
          )}

          <button
            onClick={handle1ClickExecute}
            disabled={isExecuting || isDone}
            className={`material-button-primary text-xs py-2 px-3.5 ${
              isDone
                ? '!bg-google-green-light !text-google-green border border-google-green/30 cursor-default'
                : ''
            }`}
          >
            {isExecuting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                Executing...
              </>
            ) : isDone ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1 text-google-green" />
                Executed (1-Click)
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 mr-1 fill-white" />
                {recommendation.actionButtonText}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
