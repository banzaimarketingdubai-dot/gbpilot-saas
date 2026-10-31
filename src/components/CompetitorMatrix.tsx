'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Compass,
  Flame,
  ExternalLink,
  MapPin,
  Globe,
  Phone,
  Camera,
  Send,
  Copy,
  Check,
  X
} from 'lucide-react';

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot.top';

export interface CompetitorComparison {
  placeId?: string;
  name: string;
  address?: string;
  googleMapsUrl?: string;
  websiteUrl?: string;
  phone?: string;
  rating: number;
  reviewsCount: number;
  priceLevel?: string;
  convenience: string[];
  specialtyKeywords: string[];
  diffScore: 'LEADER' | 'CHALLENGER' | 'LAGGING';
  primaryCategory?: string;
  secondaryCategories?: string[];
  missingSecondaryCategories?: string[];
  gridWins?: number;
  avgRank?: number;
  openNow?: boolean | null;
  photosCount?: number;
}

interface CompetitorMatrixProps {
  competitors: CompetitorComparison[];
  targetKeyword?: string;
  activeProfileId?: string;
  activeBusinessName?: string;
  activeBusinessCategory?: string;
  totalGridNodes?: number;
  onCategoriesAdopted?: (newCategories: string[]) => void;
}

export const CompetitorMatrix: React.FC<CompetitorMatrixProps> = ({
  competitors,
  targetKeyword = '',
  activeProfileId = '',
  activeBusinessName = '',
  activeBusinessCategory = '',
  totalGridNodes = 9,
  onCategoriesAdopted
}) => {
  const [viewMode, setViewMode] = useState<'STRATEGY_CARDS' | 'TABLE'>('STRATEGY_CARDS');
  const [adoptedCategories, setAdoptedCategories] = useState<string[]>([]);
  const [stealingForComp, setStealingForComp] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive 1-Click Overtake Action Modal state
  const [overtakeTarget, setOvertakeTarget] = useState<CompetitorComparison | null>(null);
  const [postDraft, setPostDraft] = useState<string>('');
  const [isPublishingPost, setIsPublishingPost] = useState<boolean>(false);
  const [postPublishedMsg, setPostPublishedMsg] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  useEffect(() => {
    try {
      const parsedUserCats = (activeBusinessCategory || '')
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c && c.toLowerCase() !== 'local business');
      const storageKey = activeProfileId ? `gbpilot_adopted_cats_${activeProfileId}` : 'gbpilot_adopted_cats_default';
      const saved = localStorage.getItem(storageKey);
      const savedArr: string[] = saved ? JSON.parse(saved) : [];
      setAdoptedCategories(Array.from(new Set([...parsedUserCats, ...savedArr])));
    } catch {
      // ignore storage errors
    }
  }, [activeProfileId, activeBusinessCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const handleStealCategories = async (catsToSteal: string[], competitorName: string) => {
    const clean = catsToSteal
      .map((c) => c.trim())
      .filter((c) => c && c.toLowerCase() !== 'local business' && c !== '—');
    if (clean.length === 0) return;

    setStealingForComp(competitorName);
    try {
      const apiUrl = getApiUrl();
      const pid = activeProfileId || 'default';
      await fetch(`${apiUrl}/api/v1/profiles/${encodeURIComponent(pid)}/adopt-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: clean,
          business_name: activeBusinessName
        })
      }).catch(() => null);

      const nextAdopted = Array.from(new Set([...adoptedCategories, ...clean]));
      setAdoptedCategories(nextAdopted);

      const storageKey = activeProfileId ? `gbpilot_adopted_cats_${activeProfileId}` : 'gbpilot_adopted_cats_default';
      localStorage.setItem(storageKey, JSON.stringify(nextAdopted));

      const rawActive = localStorage.getItem('gbpilot_active_profile');
      if (rawActive) {
        const parsed = JSON.parse(rawActive);
        const existingCats = String(parsed.category || '')
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s && s.toLowerCase() !== 'local business');
        const merged = Array.from(new Set([...existingCats, ...clean]));
        parsed.category = merged.join(', ');
        localStorage.setItem('gbpilot_active_profile', JSON.stringify(parsed));
      }

      if (onCategoriesAdopted) {
        onCategoriesAdopted(nextAdopted);
      }

      showToast(`✅ Categories (${clean.join(', ')}) added to profile "${activeBusinessName || 'Your Business'}"!`);
    } finally {
      setStealingForComp(null);
    }
  };

  const openOvertakeStudio = (comp: CompetitorComparison, missingCats: string[]) => {
    setOvertakeTarget({
      ...comp,
      missingSecondaryCategories: missingCats
    });
    setPostPublishedMsg(null);
    setCopiedPrompt(false);

    const bizName = activeBusinessName || '';
    const kw = targetKeyword || '';
    setPostDraft(
      bizName && kw
        ? `${bizName} — ${kw}.\nAddress: ${comp.address ? '' : ''}`
            .replace(/\nAddress: $/, '')
        : ''
    );
  };

  const handlePublishOvertakePost = async () => {
    if (!postDraft.trim()) return;
    setIsPublishingPost(true);
    setPostPublishedMsg(null);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/v1/posts/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: activeProfileId || 'default',
          business_name: activeBusinessName,
          post_text: postDraft,
          cta_type: 'LEARN_MORE'
        })
      });
      const data = await res.json();
      setPostPublishedMsg(data.message || 'Post published to Google Business Profile.');
      showToast(`🚀 Post published to Google Business Profile!`);
    } catch {
      setPostPublishedMsg('API connection error while publishing post.');
    } finally {
      setIsPublishingPost(false);
    }
  };

  if (!competitors || competitors.length === 0) {
    return (
      <div className="material-card p-6 space-y-4 border border-google-border rounded-2xl bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-google-border-light pb-4">
          <div>
            <h2 className="text-base font-bold text-google-text-primary flex items-center gap-2">
              <Compass className="w-5 h-5 text-google-blue" />
              Top 3 Google Maps Results for {targetKeyword ? `"${targetKeyword}"` : ''}
            </h2>
            <p className="text-xs text-google-text-secondary">
              Direct Google Places API Data Only
            </p>
          </div>
        </div>
        <div className="p-8 text-center text-xs text-google-text-secondary space-y-1">
          <p className="font-semibold text-google-text-primary">No Scan Data Available</p>
          <p className="text-[11px] max-w-md mx-auto">
            Click "Run Live Grid Scan" to fetch real competitor business profiles from Google Maps for the selected keyword.
          </p>
        </div>
      </div>
    );
  }

  // Strictly real fields from Google Places API — zero invented values
  const realCompetitors = competitors.map((comp) => {
    const rawPrimary = (comp.primaryCategory || '').trim();
    const cleanPrimary =
      rawPrimary && rawPrimary.toLowerCase() !== 'local business' ? rawPrimary : '';
    const secondaryCats = Array.isArray(comp.secondaryCategories)
      ? comp.secondaryCategories.filter(
          (c) => c && c.trim() && c.trim().toLowerCase() !== 'local business'
        )
      : [];

    const allRealCats = Array.from(
      new Set([cleanPrimary, ...secondaryCats].filter(Boolean))
    );

    const adoptedLower = new Set(adoptedCategories.map((c) => c.toLowerCase()));
    const missingCats = allRealCats.filter((c) => !adoptedLower.has(c.toLowerCase()));

    const mapsUrl =
      comp.googleMapsUrl ||
      (comp.placeId && !comp.placeId.includes(' ')
        ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(comp.placeId)}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${comp.name} ${comp.address || ''}`.trim()
          )}`);

    return {
      ...comp,
      googleMapsUrl: mapsUrl,
      primaryCategory: cleanPrimary,
      secondaryCategories: secondaryCats,
      missingSecondaryCategories: missingCats
    };
  });

  return (
    <div className="material-card p-5 sm:p-6 space-y-5 border border-google-border rounded-2xl bg-white shadow-sm relative">
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-900 text-white text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-google-border-light pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-google-text-primary">
              Top 3 Google Maps Results {targetKeyword ? `for "${targetKeyword}"` : ''}
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Google Places API (Direct Live Data)
            </span>
          </div>
          <p className="text-xs text-google-text-secondary mt-0.5">
            Real listings fetched from Google Maps. Missing parameters are displayed with a dash (—).
          </p>
        </div>

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
              Top-3 Cards
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'TABLE'
                  ? 'bg-white text-google-blue shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: STRICT REAL DATA TOP-3 CARDS                     */}
      {/* ======================================================== */}
      {viewMode === 'STRATEGY_CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
          {realCompetitors.slice(0, 3).map((comp, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const missingCats = comp.missingSecondaryCategories || [];
            const hasAnyRealCategories =
              Boolean(comp.primaryCategory) ||
              (comp.secondaryCategories && comp.secondaryCategories.length > 0);

            return (
              <div
                key={comp.placeId || idx}
                className={`p-4.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isFirst
                    ? 'bg-gradient-to-b from-amber-50/30 to-white border-amber-200/90 shadow-sm'
                    : isSecond
                    ? 'bg-gradient-to-b from-blue-50/30 to-white border-blue-200/90 shadow-sm'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Header: Rank, Name, Address, Direct Google Maps Link, Real Rating/Reviews */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            isFirst
                              ? 'bg-amber-100 text-amber-800 border border-amber-300/80'
                              : isSecond
                              ? 'bg-blue-100 text-google-blue border border-blue-300/80'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          #{idx + 1} in Rank
                        </span>
                        {typeof comp.gridWins === 'number' && comp.gridWins > 0 && (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                            Top 3 in {comp.gridWins}/{totalGridNodes} nodes
                            {comp.avgRank ? ` (avg #${comp.avgRank})` : ''}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug break-words">
                        {comp.name}
                      </h3>

                      <p className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{comp.address || '—'}</span>
                      </p>

                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        <a
                          href={comp.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-google-blue bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <span>Open in Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {comp.websiteUrl && (
                          <a
                            href={comp.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-1 rounded-lg"
                          >
                            <Globe className="w-3 h-3" />
                            <span>Website</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Real Rating & Real Reviews Count */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span className="font-extrabold text-xs text-slate-800">
                          {comp.rating > 0 ? comp.rating.toFixed(1) : '—'}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                        {comp.reviewsCount > 0 ? `${comp.reviewsCount} reviews` : '0 reviews'}
                      </span>
                    </div>
                  </div>

                  {/* REAL CATEGORIES BLOCK */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>Categories (Google API)</span>
                      </span>
                    </div>

                    <div className="text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-slate-600 gap-2">
                        <span className="text-slate-500 text-[10px]">Primary Category:</span>
                        <span className="font-bold text-slate-900 text-right">
                          {comp.primaryCategory || '—'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-500 text-[10px] block">Additional API Types:</span>
                        {comp.secondaryCategories && comp.secondaryCategories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {comp.secondaryCategories.map((cat, cIdx) => {
                              const isAdopted = adoptedCategories.some(
                                (a) => a.toLowerCase() === cat.toLowerCase()
                              );
                              return (
                                <span
                                  key={cIdx}
                                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded border flex items-center gap-1 ${
                                    isAdopted
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : 'bg-white text-slate-800 border-slate-200'
                                  }`}
                                >
                                  {cat}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </div>
                    </div>

                    {hasAnyRealCategories && (
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                        {missingCats.length === 0 ? (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Added to your profile
                          </span>
                        ) : (
                          <>
                            <span className="text-[10px] text-slate-600 font-semibold">
                              Missing in yours: {missingCats.slice(0, 2).join(', ')}
                            </span>
                            <button
                              type="button"
                              disabled={stealingForComp === comp.name}
                              onClick={() => handleStealCategories(missingCats, comp.name)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-[10px] font-bold transition-colors shrink-0 cursor-pointer"
                            >
                              {stealingForComp === comp.name ? 'Saving...' : '⚡ Steal Category'}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* REAL FACTUAL METADATA FROM GOOGLE PLACES API ONLY */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between text-slate-600 gap-2">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400" /> Phone:
                      </span>
                      <span className="font-semibold text-slate-800">{comp.phone || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 gap-2">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Globe className="w-3 h-3 text-slate-400" /> Website:
                      </span>
                      {comp.websiteUrl ? (
                        <a
                          href={comp.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-google-blue hover:underline truncate max-w-[160px]"
                        >
                          {comp.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-slate-600 gap-2">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Camera className="w-3 h-3 text-slate-400" /> Photos in API:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {typeof comp.photosCount === 'number' && comp.photosCount > 0
                          ? `${comp.photosCount}`
                          : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 gap-2">
                      <span className="text-slate-500">Live Status:</span>
                      <span className="font-semibold text-slate-800">
                        {comp.openNow === true
                          ? 'Open Now'
                          : comp.openNow === false
                          ? 'Closed Now'
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* MAIN ACTION BUTTON */}
                <div className="pt-3.5 mt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => openOvertakeStudio(comp, missingCats)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isFirst
                        ? 'bg-google-blue hover:bg-blue-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>
                      ⚡ Counter-Action for {targetKeyword ? `"${targetKeyword}"` : ''}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: STRICT REAL DATA TABLE                           */}
      {/* ======================================================== */}
      {viewMode === 'TABLE' && (
        <div className="overflow-x-auto border border-google-border-light rounded-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-google-border text-google-text-tertiary font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Business</th>
                <th className="py-2.5 px-3">Rating / Reviews</th>
                <th className="py-2.5 px-3">Top-3 Nodes</th>
                <th className="py-2.5 px-3">Primary Category</th>
                <th className="py-2.5 px-3">Additional API Types</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">Google Maps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-google-border-light text-google-text-primary bg-white">
              {realCompetitors.map((comp, i) => (
                <tr key={comp.placeId || i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{comp.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{comp.address || '—'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span className="font-bold">
                        {comp.rating > 0 ? comp.rating.toFixed(1) : '—'}
                      </span>
                      <span className="text-slate-500">({comp.reviewsCount || 0})</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {comp.gridWins ? `${comp.gridWins}/${totalGridNodes}` : '—'}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {comp.primaryCategory || '—'}
                  </td>
                  <td className="py-3 px-3">
                    {comp.secondaryCategories && comp.secondaryCategories.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {comp.secondaryCategories.map((cat, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-700">{comp.phone || '—'}</td>
                  <td className="py-3 px-3">
                    <a
                      href={comp.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-google-blue font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1-CLICK ACTION MODAL (NO CANNED CLAIMS)                  */}
      {/* ======================================================== */}
      {overtakeTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Action for "{targetKeyword}" (vs "{overtakeTarget.name}")
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real competitor data: rating {overtakeTarget.rating > 0 ? overtakeTarget.rating.toFixed(1) : '—'} ({overtakeTarget.reviewsCount} reviews), category: {overtakeTarget.primaryCategory || '—'}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOvertakeTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Category Adoption */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="text-xs font-bold text-slate-900">
                  1. Competitor Categories in Google Maps
                </div>
                {overtakeTarget.missingSecondaryCategories &&
                overtakeTarget.missingSecondaryCategories.length > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      handleStealCategories(
                        overtakeTarget.missingSecondaryCategories || [],
                        overtakeTarget.name
                      )
                    }
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    ⚡ Adopt Categories ({overtakeTarget.missingSecondaryCategories.join(', ')})
                  </button>
                ) : (
                  <span className="text-xs text-slate-500">
                    {overtakeTarget.primaryCategory
                      ? 'All categories already added'
                      : 'Competitor has no additional categories in API'}
                  </span>
                )}
              </div>
            </div>

            {/* 2. Publish Google Post */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900">
                2. Publish Post to Google Business Profile targeting "{targetKeyword}"
              </div>
              <textarea
                value={postDraft}
                onChange={(e) => setPostDraft(e.target.value)}
                placeholder={`Enter post copy for "${activeBusinessName || 'Your Business'}" targeting "${targetKeyword}"...`}
                rows={4}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-google-blue"
              />
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={isPublishingPost || !postDraft.trim()}
                  onClick={handlePublishOvertakePost}
                  className="px-4 py-2 bg-google-blue hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isPublishingPost ? 'Publishing...' : 'Publish to Google Maps'}
                  </span>
                </button>
                <a
                  href={overtakeTarget.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-google-blue hover:underline inline-flex items-center gap-1"
                >
                  <span>Competitor Google Maps Card</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              {postPublishedMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  {postPublishedMsg}
                </div>
              )}
            </div>

            {/* 3. Copy Keyword */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <div className="text-xs text-slate-700">
                Target keyword for review replies & posts: <strong>{targetKeyword || '—'}</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(targetKeyword || '');
                  setCopiedPrompt(true);
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? 'Copied' : 'Copy Keyword'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
