'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ListTodo,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  MessageSquare,
  TrendingUp,
  Building2,
  Check,
  RefreshCw,
  Send
} from 'lucide-react';

interface QueueItem {
  id: string;
  type: 'REVIEW_REPLY' | 'GEO_RANK_BOOST' | 'HOURS_UPDATE';
  venueName: string;
  title: string;
  description: string;
  proposedText?: string;
  rating?: number;
  author?: string;
  impact: string;
  confidence: number;
}

const INITIAL_QUEUE: QueueItem[] = [
  {
    id: 'q_1',
    type: 'REVIEW_REPLY',
    venueName: 'Artisan Specialty Coffee & Roastery',
    title: '5-Star Review Reply Required',
    author: 'Rashid Al Nuaimi',
    rating: 5,
    description: 'Customer praised the Ethiopian Yirgacheffe pour-over and requested weekend pastry pairing recommendations.',
    proposedText: 'Thank you so much Rashid! Our Ethiopian Yirgacheffe is roasted in-house weekly. We would love to welcome you this Saturday to try our fresh pistachio almond croissants baked daily at 8:00 AM!',
    impact: '+2.4% Geo-Grid Conversion',
    confidence: 98,
  },
  {
    id: 'q_2',
    type: 'GEO_RANK_BOOST',
    venueName: 'Artisan Specialty Coffee & Roastery',
    title: 'Add Google Secondary Category: "Specialty Coffee Roastery"',
    description: '3 rival cafes in Dubai Marina 2km radius added this category, gaining +14% Maps search volume for local keywords.',
    proposedText: 'Update profile categories: Primary: Coffee Shop; Secondary: Specialty Coffee Roastery, Cafe, Breakfast Restaurant.',
    impact: '+18% Local 3-Pack Impressions',
    confidence: 94,
  },
  {
    id: 'q_3',
    type: 'HOURS_UPDATE',
    venueName: 'Artisan Specialty Coffee & Roastery',
    title: 'Publish Ramadan Special Operating Hours',
    description: 'Ensure profile remains active during Dubai evening hours to capture Iftar foot traffic.',
    proposedText: 'Ramadan Special Hours: 4:00 PM – 2:00 AM Daily. Verified for Google Maps Search & Directions.',
    impact: 'Zero Customer Abandonment',
    confidence: 96,
  },
];

export default function AdminQueuePage() {
  const [items, setItems] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [executedIds, setExecutedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id: string) => {
    setExecutedIds((prev) => [...prev, id]);
    showToast('⚡ Action approved and dispatched to Google Maps API.');
  };

  const handleBulkApprove = () => {
    const unexecuted = items.map((i) => i.id);
    setExecutedIds(unexecuted);
    showToast(`🚀 All ${items.length} AI actions executed successfully across your fleet!`);
  };

  const handleDismiss = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast('Action dismissed from queue.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex items-center gap-3 text-xs text-white animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Autopilot Action Queue
            </h1>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Gemini 2.5 Flash
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pre-computed high-impact Google Maps actions awaiting 1-click batch execution or autonomous dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleBulkApprove}
            disabled={executedIds.length === items.length}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Approve All (1-Click)</span>
          </button>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {items.map((item) => {
          const isDone = executedIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-slate-950/40 border-slate-800/40 opacity-60'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {item.venueName}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {item.impact}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{item.title}</h3>

                  {item.author && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">Customer Review:</span>
                      <span>{item.author}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-400">{item.description}</p>

                  {item.proposedText && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Proposed AI Response
                      </div>
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        &quot;{item.proposedText}&quot;
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-col items-center justify-end gap-2 shrink-0 pt-2 lg:pt-0">
                  {isDone ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Executed
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 lg:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Approve &amp; Post</span>
                      </button>
                      <button
                        onClick={() => handleDismiss(item.id)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
