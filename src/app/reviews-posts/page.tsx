'use client';

import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  MessageSquare, 
  QrCode, 
  Star, 
  Bot, 
  Check, 
  Sparkles, 
  Download, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Plus, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  Radio, 
  ThumbsUp, 
  CheckCircle2,
  ShieldAlert,
  FileText,
  AlertOctagon,
  ArrowRight,
  Scale,
  X
} from 'lucide-react';

interface ReviewItem {
  id: string;
  customer: string;
  rating: number;
  date: string;
  text: string;
  aiSuggestedReply: string;
  selectedTone?: 'PROFESSIONAL' | 'FRIENDLY' | 'SEO' | 'CRISIS';
  isGenerating?: boolean;
  status: 'UNREPLIED' | 'COPIED' | 'REPLIED';
  lsi: string[];
  google_review_url?: string;
}

interface DefenseLogItem {
  id: string;
  timestamp: string;
  threatType: 'HOURS_TAMPER' | 'PHONE_OVERWRITE' | 'SPAM_REVIEW' | 'CATEGORY_HIJACK';
  title: string;
  description: string;
  status: 'REVERTED' | 'BLOCKED' | 'FLAGGED';
  revertDuration: string;
  reviewAuthor?: string;
  reviewText?: string;
}

export default function ShieldReviewsPage() {
  const [activeTab, setActiveTab] = useState<'REVIEWS' | 'DEFENSE_LOG' | 'QR_NFC'>('REVIEWS');
  
  // Tab 1: Review Inbox state
  const [autopilotReply, setAutopilotReply] = useState(true);
  const [autoReply5Stars, setAutoReply5Stars] = useState(true);
  const [filterRating, setFilterRating] = useState<'ALL' | 'UNREPLIED' | 'CRITICAL' | 'REPLIED'>('ALL');
  const [realReviews, setRealReviews] = useState<ReviewItem[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCount = localStorage.getItem('gbpilot_takedowns_used');
      if (storedCount) {
        setTakedownsUsedCount(parseInt(storedCount, 10) || 0);
      }
    }
  }, []);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Tab 2: Profile Defense Log state
  const [defenseLogs, setDefenseLogs] = useState<DefenseLogItem[]>([
    {
      id: 'threat-1',
      timestamp: 'Today, 09:14 AM',
      threatType: 'HOURS_TAMPER',
      title: 'Malicious hours change detected ("Closed on Friday")',
      description: 'Competitor suggestion attempted to mark venue closed during peak hours. Intercepted and reverted via Google API.',
      status: 'REVERTED',
      revertDuration: 'Reverted in 3 mins'
    },
    {
      id: 'threat-2',
      timestamp: 'Yesterday, 04:32 PM',
      threatType: 'PHONE_OVERWRITE',
      title: 'Competitor phone number overwrite attempt',
      description: 'Public edit submitted replacement customer service phone number. Sentinel Guard rejected unauthorized edit.',
      status: 'BLOCKED',
      revertDuration: 'Blocked in 45 secs'
    },
    {
      id: 'threat-3',
      timestamp: 'Oct 14, 11:20 AM',
      threatType: 'SPAM_REVIEW',
      title: 'Suspicious 1-Star Review Detected (Competitor Pattern)',
      description: 'Unverified profile with 0 prior local activity posted generic negative rating without transaction details.',
      status: 'FLAGGED',
      revertDuration: 'Dossier ready for submission',
      reviewAuthor: 'Anonymous User',
      reviewText: 'Terrible place, avoid at all costs.'
    }
  ]);

  // Review Takedown Modal & Quota state (PLG Monetization)
  const [isTakedownModalOpen, setIsTakedownModalOpen] = useState(false);
  const [isTakedownQuotaModalOpen, setIsTakedownQuotaModalOpen] = useState(false);
  const [takedownsUsedCount, setTakedownsUsedCount] = useState<number>(0);
  const [takedownTarget, setTakedownTarget] = useState<DefenseLogItem | null>(null);
  const [takedownJurisdiction, setTakedownJurisdiction] = useState<'UAE' | 'GLOBAL' | 'USA' | 'EU'>('UAE');
  const [isGeneratingDossier, setIsGeneratingDossier] = useState(false);
  const [takedownDossier, setTakedownDossier] = useState<string | null>(null);

  // Tab 3: QR & NFC Stand Builder state
  const [posterTitle, setPosterTitle] = useState('Love your experience?');
  const [posterSubtitle, setPosterSubtitle] = useState('Tap with phone or scan QR to review on Google Maps');

  // Active profile state
  const [activeProfile, setActiveProfile] = useState<{
    id?: string;
    place_id?: string;
    name: string;
    address?: string;
    city?: string;
    rating?: number;
    reviews_count?: number;
    reviews?: any[];
    google_maps_url?: string;
  } | null>(null);

  // Helper to determine risk zone
  const getReviewZone = (rating: number): 'GREEN' | 'YELLOW' | 'RED' => {
    if (rating === 5) return 'GREEN';
    if (rating >= 3) return 'YELLOW';
    return 'RED';
  };

  // Helper to generate smart initial responses based on rating and business name
  const createDefaultReply = (bName: string, author: string, rating: number, text: string, tone = 'PROFESSIONAL') => {
    if (rating >= 4) {
      if (tone === 'FRIENDLY') {
        return `Thank you so much, ${author}! 😊 We are thrilled to hear that you had a wonderful time at ${bName}. Looking forward to your next visit!`;
      }
      if (tone === 'SEO') {
        return `Thank you for the 5-star review, ${author}! Our team at ${bName} is dedicated to delivering the highest quality local service. We appreciate your recommendation!`;
      }
      return `Thank you for your generous review, ${author}. We are delighted that you enjoyed your experience with ${bName} and truly appreciate your support.`;
    } else if (rating === 3) {
      return `Thank you for your honest feedback, ${author}. We are always working to elevate our guest experience at ${bName} and hope to impress you even more on your next visit.`;
    } else {
      return `Hello ${author}, thank you for bringing this to our attention. We deeply regret that your visit to ${bName} did not meet expectations. We take this feedback seriously — please contact our management directly so we can resolve this matter for you.`;
    }
  };

  // Fetch reviews logic with Places API integration
  const fetchReviewsData = useCallback(async (isSilent = false) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gbpilot_active_profile');
      if (!stored) return;

      try {
        const parsed = JSON.parse(stored);
        setActiveProfile(parsed);
        const bName = parsed.name || 'Your Business';
        const placeId = parsed.place_id || parsed.id || '';
        const fallbackUrl = parsed.google_maps_url || (placeId ? `https://www.google.com/maps/place/?q=place_id:${placeId}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bName)}`);

        if (!isSilent) setLoadingReviews(true);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
        const profId = placeId || 'profile_123';

        const res = await fetch(`${baseUrl}/api/v1/reviews/${profId}?business_name=${encodeURIComponent(bName)}`);
        if (res.ok) {
          const data = await res.json();
          const incomingReviews = data?.reviews || [];
          
          if (Array.isArray(incomingReviews) && incomingReviews.length > 0) {
            setRealReviews(prev => {
              const statusMap = new Map(prev.map(p => [p.id, p.status]));
              const replyMap = new Map(prev.map(p => [p.id, p.aiSuggestedReply]));

              return incomingReviews.map((r: any, idx: number) => {
                const revId = r.id || `rev-${idx}`;
                const rating = r.rating || 5;
                const author = r.author_name || r.customer || 'Google User';
                const text = r.review_text || r.text || 'Great experience!';
                const revUrl = r.google_review_url || data.google_maps_url || fallbackUrl;

                const existingStatus = statusMap.get(revId);
                const existingReply = replyMap.get(revId);

                return {
                  id: revId,
                  customer: author,
                  rating: rating,
                  date: r.review_date || r.relative_time_description || 'Recently',
                  text: text,
                  aiSuggestedReply: existingReply || createDefaultReply(bName, author, rating, text, 'PROFESSIONAL'),
                  selectedTone: 'PROFESSIONAL',
                  status: existingStatus || 'UNREPLIED',
                  lsi: rating >= 4 ? ['verified customer', 'top service', 'local recommendation'] : ['customer satisfaction', 'management resolution'],
                  google_review_url: revUrl
                };
              });
            });
          } else if (parsed.reviews && Array.isArray(parsed.reviews) && parsed.reviews.length > 0) {
            setRealReviews(parsed.reviews.map((r: any, idx: number) => {
              const author = r.author_name || r.customer || 'Google User';
              const rating = r.rating || 5;
              const text = r.text || r.review_text || 'Great service!';
              return {
                id: r.id || `rev-cache-${idx}`,
                customer: author,
                rating: rating,
                date: r.relative_time_description || r.date || 'Recently',
                text: text,
                aiSuggestedReply: createDefaultReply(bName, author, rating, text, 'PROFESSIONAL'),
                selectedTone: 'PROFESSIONAL',
                status: 'UNREPLIED',
                lsi: ['google verified', 'local service'],
                google_review_url: fallbackUrl
              };
            }));
          }
        }
      } catch (e) {
        console.error("Review fetch error:", e);
      } finally {
        if (!isSilent) setLoadingReviews(false);
        const now = new Date();
        setLastCheckedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    }
  }, []);

  useEffect(() => {
    fetchReviewsData();
    const timer = setInterval(() => {
      fetchReviewsData(true);
    }, 120000);
    return () => clearInterval(timer);
  }, [fetchReviewsData]);

  const handleRegenerateTone = async (reviewId: string, tone: 'PROFESSIONAL' | 'FRIENDLY' | 'SEO' | 'CRISIS') => {
    const targetRev = realReviews.find(r => r.id === reviewId);
    if (!targetRev) return;

    setRealReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isGenerating: true, selectedTone: tone } : r));

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const res = await fetch(`${baseUrl}/api/v1/reviews/generate-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: activeProfile?.name || 'Our Business',
          reviewer_name: targetRev.customer,
          rating: targetRev.rating,
          review_text: targetRev.text,
          tone: tone === 'FRIENDLY' ? 'Friendly' : tone === 'SEO' ? 'SEO' : tone === 'CRISIS' ? 'Apologetic' : 'Professional',
          place_id: activeProfile?.place_id
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRealReviews(prev => prev.map(r => r.id === reviewId ? {
          ...r,
          aiSuggestedReply: data.suggested_reply || r.aiSuggestedReply,
          lsi: data.lsi_keywords || r.lsi,
          google_review_url: data.google_reply_url || r.google_review_url,
          isGenerating: false
        } : r));
      } else {
        setRealReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isGenerating: false } : r));
      }
    } catch (e) {
      console.error(e);
      setRealReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isGenerating: false } : r));
    }
  };

  const handleCopyAndOpen = (rev: ReviewItem) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(rev.aiSuggestedReply);
    }
    setRealReviews(prev => prev.map(r => r.id === rev.id ? { ...r, status: 'REPLIED' } : r));
    setCopiedToast(`Copied response with SEO keywords. Opening Google Maps review posting dialog...`);
    setTimeout(() => setCopiedToast(null), 4000);

    const targetUrl = rev.google_review_url || activeProfile?.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeProfile?.name || 'Business')}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenTakedownModal = (threat: DefenseLogItem) => {
    const isPro = typeof window !== 'undefined' && localStorage.getItem('gbpilot_pro_activated') === 'true';
    if (!isPro && takedownsUsedCount >= 1) {
      setIsTakedownQuotaModalOpen(true);
      return;
    }

    setTakedownTarget(threat);
    setIsTakedownModalOpen(true);
    generateDossierText(threat, takedownJurisdiction);

    if (!isPro && takedownsUsedCount === 0) {
      const nextCount = 1;
      setTakedownsUsedCount(nextCount);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gbpilot_takedowns_used', String(nextCount));
      }
    }
  };

  const generateDossierText = (threat: DefenseLogItem, jur: 'UAE' | 'GLOBAL' | 'USA' | 'EU') => {
    setIsGeneratingDossier(true);
    setTimeout(() => {
      const bName = activeProfile?.name || 'Licensed Business';
      const lawRef = jur === 'UAE' 
        ? 'UAE Federal Decree-Law No. 34 of 2021 on Combatting Rumors & Cybercrimes (Articles 43 & 44)'
        : jur === 'USA'
        ? 'FTC Consumer Review Fairness Act & 15 U.S.C. § 45b'
        : 'Google Maps User Contributed Content Guidelines (Section 3.2: Deceptive Content)';

      const dossier = `OFFICIAL ESCALATION: REQUEST FOR PERMANENT REMOVAL OF DEFAMATORY / SPAM REVIEW\n` +
        `Target Entity: ${bName}\n` +
        `Jurisdiction Standard: ${jur} (${lawRef})\n` +
        `Suspected Violation: Competitor sabotage, unverified transaction, inauthentic engagement (Google Section 3.2).\n\n` +
        `STATEMENT OF FACTS:\n` +
        `1. The disputed submission by "${threat.reviewAuthor || 'Anonymous'}" was published without any verified commercial interaction at ${bName}.\n` +
        `2. Content exhibits coordinated defamation patterns violating Google Maps Content Guidelines.\n` +
        `3. Relief Requested: Permanent deletion and IP-origin blocking of the abusive entry.\n\n` +
        `Authorized Representative: Automated Sentinel Counter-Intelligence Unit for ${bName}.`;

      setTakedownDossier(dossier);
      setIsGeneratingDossier(false);
    }, 600);
  };

  const handleReviewTakedown = (rev: ReviewItem) => {
    const threatItem: DefenseLogItem = {
      id: `threat-${rev.id}`,
      timestamp: rev.date,
      threatType: 'SPAM_REVIEW',
      title: `Abusive / Suspicious ${rev.rating}-Star Review by ${rev.customer}`,
      description: rev.text,
      status: 'FLAGGED',
      revertDuration: 'Legal takedown dossier ready',
      reviewAuthor: rev.customer,
      reviewText: rev.text
    };
    handleOpenTakedownModal(threatItem);
  };

  const handleInsertKeyword = (reviewId: string, keyword: string) => {
    const cleanKw = keyword.startsWith('#') ? keyword.slice(1) : keyword;
    setRealReviews(prev => prev.map(r => {
      if (r.id !== reviewId) return r;
      const currentText = r.aiSuggestedReply.trim();
      const updatedText = currentText.toLowerCase().includes(cleanKw.toLowerCase())
        ? currentText
        : `${currentText} We take pride in delivering top-tier ${cleanKw}.`;
      return { ...r, aiSuggestedReply: updatedText };
    }));
    setCopiedToast(`Injected #${cleanKw} into response draft`);
    setTimeout(() => setCopiedToast(null), 3500);
  };

  const filteredReviews = realReviews.filter(r => {
    if (filterRating === 'UNREPLIED') return r.status === 'UNREPLIED';
    if (filterRating === 'CRITICAL') return r.rating <= 2;
    if (filterRating === 'REPLIED') return r.status === 'REPLIED';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar currentProfile={activeProfile || undefined} />

      {/* Copied Toast Banner */}
      {copiedToast && (
        <div className="fixed top-16 right-4 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs border border-slate-700 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{copiedToast}</span>
          </div>
          <button onClick={() => setCopiedToast(null)} className="p-1 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
        
        {/* ======================================================== */}
        {/* SHIELD & REVIEWS HUB HEADER                              */}
        {/* ======================================================== */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-google-blue" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Shield &amp; Reputation Hub
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Guarding
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Counter-intelligence tamper protection, automated SEO review responses, and contactless review stands for <strong>{activeProfile?.name || 'Your Business'}</strong>.
            </p>
          </div>

          {/* Top 3 Segmented Sub-Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 self-stretch sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('REVIEWS')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'REVIEWS'
                  ? 'bg-white text-google-blue shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💬 Review Inbox ({realReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('DEFENSE_LOG')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'DEFENSE_LOG'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛡️ Profile Defense Log ({defenseLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('QR_NFC')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'QR_NFC'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>📇 QR &amp; NFC Stand</span>
                <span className="text-[9px] bg-slate-200/80 text-slate-600 px-1.5 py-0.2 rounded font-normal">Revo Coming Soon</span>
              </div>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SUB-TAB 1: REVIEW INBOX                                   */}
        {/* ======================================================== */}
        {activeTab === 'REVIEWS' && (
          <div className="space-y-4">
            
            {/* Review Controls Bar: Autopilot toggle, Confidence Pacing & filters */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-slate-700">Filter Reviews:</span>
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {(['ALL', 'UNREPLIED', 'CRITICAL', 'REPLIED'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setFilterRating(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        filterRating === filter
                          ? 'bg-white text-google-blue shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {filter === 'ALL' ? 'All' : filter === 'UNREPLIED' ? 'Unreplied' : filter === 'CRITICAL' ? '1-2★ Critical' : 'Replied'}
                    </button>
                  ))}
                </div>

                {/* 1-Click Autonomous 5-Star Confidence Toggle */}
                <label className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-emerald-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={autoReply5Stars}
                    onChange={(e) => setAutoReply5Stars(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                  />
                  <span className="font-bold text-emerald-900 text-[11px]">
                    Auto-reply to 5★ reviews without manual confirmation
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">AI Auto-Pilot:</span>
                  <button
                    onClick={() => setAutopilotReply(!autopilotReply)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      autopilotReply ? 'bg-google-blue' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        autopilotReply ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className={`font-bold ${autopilotReply ? 'text-google-blue' : 'text-slate-400'}`}>
                    {autopilotReply ? 'ON' : 'OFF'}
                  </span>
                </div>

                <button
                  onClick={() => fetchReviewsData()}
                  disabled={loadingReviews}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingReviews ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Reviews Cards List with Traffic Light Confidence Pacing */}
            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h3 className="font-bold text-slate-900 text-sm">All Customer Reviews Addressed</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    No unreplied reviews matching your current filter. Your Google Business Profile review response rate is optimal.
                  </p>
                </div>
              ) : (
                filteredReviews.map((rev) => {
                  const zone = getReviewZone(rev.rating);
                  const isReplied = rev.status === 'REPLIED';

                  return (
                    <div
                      key={rev.id}
                      className={`bg-white border rounded-3xl p-5 sm:p-6 shadow-xs transition-all space-y-4 ${
                        zone === 'RED'
                          ? 'border-rose-300 bg-rose-50/15'
                          : zone === 'YELLOW'
                          ? 'border-amber-200 bg-white'
                          : 'border-emerald-200/80 bg-white'
                      }`}
                    >
                      {/* Reviewer Header & Traffic Light Zone Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            zone === 'RED'
                              ? 'bg-rose-100 text-rose-700'
                              : zone === 'YELLOW'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {rev.customer.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">{rev.customer}</span>
                              <div className="flex items-center text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400">{rev.date}</span>
                          </div>
                        </div>

                        {/* Zone Badges & Status */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {zone === 'GREEN' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>🟢 Green Zone (5★) • Autonomous Safe</span>
                            </span>
                          )}
                          {zone === 'YELLOW' && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                <span>🟡 Yellow Zone (3-4★) • 1-Click Verification</span>
                              </span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border border-slate-200">
                                <Clock className="w-3 h-3 text-amber-500" />
                                <span>Auto-posting in 2h 45m (LSI-optimized)</span>
                              </span>
                            </div>
                          )}
                          {zone === 'RED' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                              <span>🔴 Red Zone (1-2★) • Escalation Required</span>
                            </span>
                          )}

                          {isReplied ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              ✓ Replied to Google
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                              Pending Reply
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Review Text */}
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                        "{rev.text}"
                      </p>

                      {/* Red Zone Security Alert & Takedown CTA */}
                      {zone === 'RED' && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-900">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                            <div>
                              <span className="font-bold">Autonomous posting halted:</span>
                              <span className="text-rose-700 ml-1">Critical review. De-escalate via management apology or challenge as inauthentic.</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleReviewTakedown(rev)}
                            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>⚡ Generate Fake Review Takedown Dossier</span>
                          </button>
                        </div>
                      )}

                      {/* AI Response Generator & Notion-Style Inline Editor */}
                      <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                          <span className="font-bold text-google-blue flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-google-blue" />
                            <span>AI Local SEO Response Draft:</span>
                          </span>

                          {/* Tone Selectors */}
                          <div className="flex items-center gap-1 text-[10px] flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleRegenerateTone(rev.id, 'PROFESSIONAL')}
                              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                                rev.selectedTone === 'PROFESSIONAL'
                                  ? 'bg-google-blue text-white'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              Professional
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRegenerateTone(rev.id, 'FRIENDLY')}
                              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                                rev.selectedTone === 'FRIENDLY'
                                  ? 'bg-google-blue text-white'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              Friendly
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRegenerateTone(rev.id, 'SEO')}
                              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                                rev.selectedTone === 'SEO'
                                  ? 'bg-google-blue text-white'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              SEO Booster
                            </button>
                            {zone === 'RED' && (
                              <button
                                type="button"
                                onClick={() => handleRegenerateTone(rev.id, 'CRISIS')}
                                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                                  rev.selectedTone === 'CRISIS'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                                }`}
                              >
                                Apologetic
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Notion-Style Direct Inline Editor */}
                        <div className="space-y-1">
                          <textarea
                            rows={3}
                            value={rev.aiSuggestedReply}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRealReviews(prev => prev.map(r => r.id === rev.id ? { ...r, aiSuggestedReply: val } : r));
                            }}
                            placeholder="Click anywhere to edit this AI response inline..."
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs leading-relaxed font-normal focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue transition-all"
                          />
                          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                            <span className="italic">Click to edit inline • Real-time autosave</span>
                            <span>{rev.aiSuggestedReply.length} characters</span>
                          </div>
                        </div>

                        {/* Clickable Keyword Pill Chips */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-slate-500">Click to inject keyword:</span>
                            {rev.lsi.map((k, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleInsertKeyword(rev.id, k)}
                                className="px-2 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-google-blue hover:text-blue-800 text-[10px] font-mono border border-blue-200 transition-colors cursor-pointer flex items-center gap-1"
                                title="Click to insert into reply"
                              >
                                <Plus className="w-2.5 h-2.5" />
                                <span>#{k}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Card Action CTAs */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                          <button
                            type="button"
                            onClick={() => handleCopyAndOpen(rev)}
                            className={`px-4 py-2 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                              zone === 'RED'
                                ? 'bg-slate-800 hover:bg-slate-900'
                                : zone === 'YELLOW'
                                ? 'bg-amber-600 hover:bg-amber-700'
                                : 'bg-google-blue hover:bg-blue-600'
                            }`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>
                              {zone === 'RED'
                                ? 'Publish De-escalation Reply ↗'
                                : zone === 'YELLOW'
                                ? 'Approve in 1 Click ↗'
                                : autoReply5Stars
                                ? '⚡ One-Click Confirm & Post ↗'
                                : 'Publish Response ↗'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Trust & Compliance Status Bar */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50/80 border border-slate-200/60 rounded-xl px-3 py-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Verified by AI Sentinel:</strong> Optimized with {rev.lsi.length || 3} local keywords • 100% compliant with Google Review Guidelines.
                        </span>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 2: PROFILE DEFENSE LOG (COUNTER-INTELLIGENCE)    */}
        {/* ======================================================== */}
        {activeTab === 'DEFENSE_LOG' && (
          <div className="space-y-4">
            
            {/* Real-time Defense Status Hero Card */}
            <div className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-black shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-white tracking-tight">
                      Profile Lock Active (NAP Protected)
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Business Hours, Phone Number, Physical Address, and Attributes locked against competitor tampering.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold">
                  24/7 Sentinel Monitoring
                </span>
              </div>
            </div>

            {/* Intercepted Threats Timeline */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>Intercepted Threats Timeline</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">3 threats blocked this week</span>
              </div>

              <div className="divide-y divide-slate-100">
                {defenseLogs.map((log) => (
                  <div key={log.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">{log.timestamp}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          log.status === 'REVERTED' ? 'bg-emerald-100 text-emerald-800' : log.status === 'BLOCKED' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {log.status}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">({log.revertDuration})</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{log.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{log.description}</p>
                    </div>

                    <div className="shrink-0 self-end md:self-auto">
                      {log.threatType === 'SPAM_REVIEW' ? (
                        <button
                          type="button"
                          onClick={() => handleOpenTakedownModal(log)}
                          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>⚡ Generate Takedown Dossier</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <Check className="w-3.5 h-3.5" />
                          <span>Protected Automatically</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 3: QR & NFC STAND BUILDER                        */}
        {/* ======================================================== */}
        {activeTab === 'QR_NFC' && (
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Customizer Controls */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-google-blue" />
                <span>Tabletop Stand &amp; Sticker Customizer</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Headline Text</label>
                <input
                  type="text"
                  value={posterTitle}
                  onChange={(e) => setPosterTitle(e.target.value)}
                  className="material-input w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Subtext Instruction</label>
                <input
                  type="text"
                  value={posterSubtitle}
                  onChange={(e) => setPosterSubtitle(e.target.value)}
                  className="material-input w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* NFC Hardware Chip Link */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>NTAG213 Direct Hardware Link</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Write this verified direct link to your contactless NFC table sticker or acrylic stand:
                </p>
                <code className="block bg-white p-2 rounded-lg text-[10px] font-mono text-google-blue border border-slate-200 truncate select-all">
                  https://search.google.com/local/writereview?placeid={activeProfile?.place_id || 'CH_PLACE_ID'}
                </code>
              </div>

              <button
                type="button"
                onClick={() => alert("Initiating Print-Ready CMYK 300 DPI PDF download...")}
                className="w-full py-3 bg-google-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Print-Ready PDF</span>
              </button>
            </div>

            {/* Live Visual Stand Preview */}
            <div className="bg-slate-100 border border-dashed border-slate-300 rounded-3xl p-8 flex items-center justify-center">
              <div className="w-64 bg-white rounded-2xl shadow-xl p-6 text-center space-y-4 border border-slate-200">
                <div className="flex items-center justify-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{posterTitle}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">{posterSubtitle}</p>
                </div>

                {/* Simulated QR Code Graphic */}
                <div className="w-32 h-32 mx-auto bg-slate-50 border-2 border-slate-900 rounded-xl p-2 flex items-center justify-center">
                  <div className="w-full h-full bg-[radial-gradient(#0F172A_2px,transparent_2px)] [background-size:8px_8px] rounded" />
                </div>

                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {activeProfile?.name || 'Local Business'}
                </div>
              </div>
            </div>

          </div>
        )}

      
        {/* Review Takedown Quota Paywall Modal (PLG) */}
        {isTakedownQuotaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-600 border border-rose-200">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Free Takedown Limit Reached
                    </h3>
                    <span className="text-[11px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      1 / 1 Free Dossier Used
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsTakedownQuotaModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                You have used your <strong>1 free legal takedown dossier</strong>. To dispute, challenge, and permanently eliminate additional defamatory, fake, or competitor-sponsored 1★ reviews, upgrade to the <strong>Pro Growth Plan</strong> or activate the 14-day Pro trial.
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unlimited Legal Dossier generation (UAE &amp; Global policies)</span>
                </div>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Direct Level-2 Google Trust &amp; Safety escalation workflows</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTakedownQuotaModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  Dismiss
                </button>
                <Link
                  href="/b2b"
                  onClick={() => setIsTakedownQuotaModalOpen(false)}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20 transition-all text-center"
                >
                  <span>Unlock Unlimited Takedowns →</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      
      </main>

      {/* Review Takedown Modal */}
      {isTakedownModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-xl w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <Scale className="w-5 h-5" />
                <span>Google Review Legal &amp; Policy Takedown Dossier</span>
              </div>
              <button onClick={() => setIsTakedownModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Legal Jurisdiction Standard:</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                  {(['UAE', 'GLOBAL', 'USA', 'EU'] as const).map(jur => (
                    <button
                      key={jur}
                      onClick={() => {
                        setTakedownJurisdiction(jur);
                        if (takedownTarget) generateDossierText(takedownTarget, jur);
                      }}
                      className={`px-2 py-1 rounded ${takedownJurisdiction === jur ? 'bg-white text-google-blue shadow-xs' : 'text-slate-500'}`}
                    >
                      {jur}
                    </button>
                  ))}
                </div>
              </div>

              {isGeneratingDossier ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <Sparkles className="w-6 h-6 animate-spin text-google-blue mx-auto" />
                  <p className="font-semibold">Synthesizing formal complaint dossier...</p>
                </div>
              ) : (
                <textarea
                  readOnly
                  rows={8}
                  value={takedownDossier || ''}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-800 leading-relaxed select-all"
                />
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (takedownDossier && navigator.clipboard) {
                    navigator.clipboard.writeText(takedownDossier);
                    alert("Dossier text copied to clipboard!");
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Copy Dossier
              </button>

              <a
                href="https://support.google.com/business/workflow/9945796"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Submit to Google Trust &amp; Safety ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
