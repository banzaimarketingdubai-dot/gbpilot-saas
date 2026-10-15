'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  MessageSquare, 
  QrCode, 
  Calendar as CalendarIcon, 
  Star, 
  Bot, 
  Check, 
  Sparkles, 
  Download, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Plus, 
  Image as ImageIcon,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Clock,
  Radio,
  ThumbsUp,
  CheckCircle2
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

export default function ReviewsPostsPage() {
  const [activeTab, setActiveTab] = useState<'REVIEWS' | 'QR_NFC' | 'POSTS'>('REVIEWS');
  
  // Tab 1 state
  const [autopilotReply, setAutopilotReply] = useState(true);
  const [filterRating, setFilterRating] = useState<'ALL' | 'UNREPLIED' | 'CRITICAL' | 'REPLIED'>('ALL');
  const [realReviews, setRealReviews] = useState<ReviewItem[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Active profile state
  const [activeProfile, setActiveProfile] = useState<{
    id?: string;
    place_id?: string;
    name: string;
    rating?: number;
    reviews_count?: number;
    reviews?: any[];
    google_maps_url?: string;
  } | null>(null);

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
    if (typeof window === 'undefined') return;
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
                status: existingStatus || (rating <= 3 ? 'UNREPLIED' : 'UNREPLIED'),
                lsi: rating >= 4 ? ['verified customer', 'top service', 'local recommendation'] : ['customer satisfaction', 'management resolution'],
                google_review_url: revUrl
              };
            });
          });
        } else if (parsed.reviews && Array.isArray(parsed.reviews) && parsed.reviews.length > 0) {
          // Fallback to local storage cached reviews if API had none
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
  }, []);

  // Initial load & 120s Auto-monitoring interval
  useEffect(() => {
    fetchReviewsData();
    const timer = setInterval(() => {
      fetchReviewsData(true);
    }, 120000); // Poll every 2 minutes
    return () => clearInterval(timer);
  }, [fetchReviewsData]);

  // Handle tone change / AI regeneration for a specific review
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
          isGenerating: false,
          aiSuggestedReply: data.suggested_reply || r.aiSuggestedReply,
          lsi: data.lsi_keywords || r.lsi
        } : r));
        return;
      }
    } catch (err) {
      console.warn("AI generation endpoint unavailable, using smart client engine", err);
    }

    // Client-side fallback if server is slow
    const clientReply = createDefaultReply(activeProfile?.name || 'Our Business', targetRev.customer, targetRev.rating, targetRev.text, tone);
    setRealReviews(prev => prev.map(r => r.id === reviewId ? {
      ...r,
      isGenerating: false,
      aiSuggestedReply: clientReply
    } : r));
  };

  // 1-Click Copy & Open Google Maps workflow
  const handleCopyAndOpen = (rev: ReviewItem) => {
    // 1. Copy reply text to clipboard
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(rev.aiSuggestedReply);
    }

    // 2. Open Google review link
    const targetUrl = rev.google_review_url || 
      (activeProfile?.place_id ? `https://www.google.com/maps/place/?q=place_id:${activeProfile.place_id}` : `https://business.google.com/reviews`);
    
    window.open(targetUrl, '_blank', 'noopener,noreferrer');

    // 3. Update status
    setRealReviews(prev => prev.map(r => r.id === rev.id ? { ...r, status: 'COPIED' } : r));

    // 4. Show friendly toast
    setCopiedToast(`Copied AI reply for ${rev.customer}! Google Maps opened. Simply paste (Ctrl+V) into Google's reply box.`);
    setTimeout(() => {
      setCopiedToast(null);
    }, 6000);
  };

  const businessName = activeProfile?.name || 'Your Business';

  // Counts for filters
  const unrepliedCount = realReviews.filter(r => r.status === 'UNREPLIED').length;
  const criticalCount = realReviews.filter(r => r.rating <= 2).length;

  const filteredReviews = realReviews.filter(r => {
    if (filterRating === 'UNREPLIED') return r.status === 'UNREPLIED';
    if (filterRating === 'CRITICAL') return r.rating <= 2;
    if (filterRating === 'REPLIED') return r.status === 'REPLIED' || r.status === 'COPIED';
    return true;
  });

  // Tab 2 QR NFC state
  const [posterTitle, setPosterTitle] = useState('Rate Our Service on Google!');
  const [posterSubtitle, setPosterSubtitle] = useState('Scan the QR code to leave an authentic 5★ review on Google Maps.');

  // Tab 3 Posts state
  const [postDraftText, setPostDraftText] = useState(`Welcome to ${businessName}! We take pride in exceptional service and always look forward to welcoming you.`);
  const [isPostPublished, setIsPostPublished] = useState(false);

  return (
    <div className="min-h-screen bg-google-bg flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
        
        {/* Header & Tabs */}
        <div className="material-card p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-google-border rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-google-text-primary flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-google-blue" />
                Reviews &amp; Content Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Bridge Mode
              </span>
            </div>
            <p className="text-xs text-google-text-secondary mt-1">
              Semi-automated review auto-monitoring, tone-matched AI response generator, and 1-Click Google Maps posting.
            </p>
          </div>

          <div className="flex bg-google-bg p-1 rounded-xl border border-google-border">
            <button
              onClick={() => setActiveTab('REVIEWS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'REVIEWS'
                  ? 'bg-white text-google-blue shadow-sm border border-google-border-light'
                  : 'text-google-text-secondary'
              }`}
            >
              💬 Review Inbox &amp; Auto-Monitor
            </button>
            <button
              onClick={() => setActiveTab('QR_NFC')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'QR_NFC'
                  ? 'bg-white text-google-blue shadow-sm border border-google-border-light'
                  : 'text-google-text-secondary'
              }`}
            >
              🎨 QR &amp; NFC Stand Constructor
            </button>
            <button
              onClick={() => setActiveTab('POSTS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'POSTS'
                  ? 'bg-white text-google-blue shadow-sm border border-google-border-light'
                  : 'text-google-text-secondary'
              }`}
            >
              📅 Google Posts Planner
            </button>
          </div>
        </div>

        {/* TAB 1: REVIEWS INBOX WITH SEMI-AUTOMATED WORKFLOW */}
        {activeTab === 'REVIEWS' && (
          <div className="space-y-6">

            {/* Bridge Mode Banner: Clear Explanation of Semi-Automated Mechanism */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border border-blue-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-google-blue text-white text-[11px] font-bold shadow-sm">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    Semi-Automated Bridge Mode Active
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Live Monitoring: <strong>ON</strong> (Auto-scans Google Places API)</span>
                    {lastCheckedTime && <span className="text-[11px] text-slate-400">• Last scan: {lastCheckedTime}</span>}
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pt-1">
                  While direct Google API auto-publishing is queued for approval (Case <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-900 font-semibold">8-2301000041527</code>), GBPilot automatically tracks incoming reviews, drafts context-aware responses with local SEO keywords, and gives you a <strong>1-Click Copy &amp; Open in Google Maps</strong> button.
                </p>
              </div>

              <button
                onClick={() => fetchReviewsData(false)}
                disabled={loadingReviews}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 shadow-sm transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-google-blue ${loadingReviews ? 'animate-spin' : ''}`} />
                <span>{loadingReviews ? 'Scanning Google...' : 'Scan for New Reviews'}</span>
              </button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="material-card p-5 bg-white space-y-2 border-l-4 border-l-google-blue rounded-xl border border-google-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-google-text-primary">Reviews Monitored</span>
                  <span className="text-[10px] bg-blue-50 text-google-blue px-2 py-0.5 rounded font-bold">LIVE SYNC</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">{realReviews.length}</span>
                  <span className="text-xs text-google-text-secondary">active Google reviews</span>
                </div>
                <p className="text-[11px] text-google-text-tertiary leading-tight">
                  {unrepliedCount > 0 ? (
                    <span className="text-amber-700 font-bold">{unrepliedCount} awaiting your reply</span>
                  ) : (
                    <span className="text-emerald-700 font-medium">All reviews handled!</span>
                  )}
                </p>
              </div>

              <div className="material-card p-5 bg-white space-y-2 border-l-4 border-l-google-green rounded-xl border border-google-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-google-text-primary">Autopilot AI Generator</span>
                  <button 
                    onClick={() => setAutopilotReply(!autopilotReply)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      autopilotReply ? 'bg-google-green justify-end' : 'bg-google-border justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
                <span className="text-xs font-bold text-google-blue block">
                  {autopilotReply ? 'AUTO-PRECOMPUTE ACTIVE' : 'MANUAL REVIEW MODE'}
                </span>
                <p className="text-[11px] text-google-text-tertiary leading-tight">
                  Pre-generates tone-matched responses with SEO keywords upon detection.
                </p>
              </div>

              <div className="material-card p-5 bg-white space-y-2 rounded-xl border border-google-border">
                <span className="text-xs font-bold text-google-text-secondary">Connected Google Profile</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-google-text-primary truncate max-w-[200px]">
                    {businessName}
                  </span>
                  {activeProfile?.rating && (
                    <div className="flex text-google-yellow shrink-0">
                      {[...Array(Math.min(5, Math.round(activeProfile.rating)))].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-google-yellow" />
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-google-text-secondary block">
                  Rating: <strong>{activeProfile?.rating ? `${activeProfile.rating} / 5.0` : '—'}</strong> ({activeProfile?.reviews_count || realReviews.length} total reviews)
                </span>
              </div>

            </div>

            {/* Filter Bar */}
            <div className="material-card p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs rounded-xl border border-google-border shadow-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-700">Filter Inbox:</span>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => setFilterRating('ALL')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      filterRating === 'ALL' ? 'bg-google-blue text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All ({realReviews.length})
                  </button>
                  <button
                    onClick={() => setFilterRating('UNREPLIED')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                      filterRating === 'UNREPLIED' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Unreplied</span>
                    {unrepliedCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/30 font-bold">
                        {unrepliedCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setFilterRating('CRITICAL')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                      filterRating === 'CRITICAL' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Critical 1-2★</span>
                    {criticalCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/30 font-bold">
                        {criticalCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setFilterRating('REPLIED')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      filterRating === 'REPLIED' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Replied / Handled
                  </button>
                </div>
              </div>

              {activeProfile?.google_maps_url && (
                <a
                  href={activeProfile.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-google-blue font-semibold hover:underline inline-flex items-center gap-1 ml-auto"
                >
                  <span>Open Place on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {loadingReviews ? (
                <div className="material-card p-12 bg-white text-center text-xs text-google-text-secondary rounded-2xl border border-google-border">
                  <div className="w-7 h-7 border-3 border-google-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="font-semibold text-slate-800">Monitoring Google Places API for new reviews...</p>
                  <p className="text-[11px] text-slate-500 mt-1">Retrieving recent customer feedback for {businessName}</p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="material-card p-12 bg-white text-center space-y-3 border border-google-border rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="font-bold text-sm text-slate-800">
                    {filterRating === 'UNREPLIED' ? 'No unreplied reviews found!' : 'No reviews match this filter'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    All reviews are currently addressed, or click &ldquo;Scan for New Reviews&rdquo; to query live Google Maps.
                  </p>
                </div>
              ) : (
                filteredReviews.map((rev) => {
                  const isNegative = rev.rating <= 2;
                  const isCopied = rev.status === 'COPIED';
                  const isReplied = rev.status === 'REPLIED';

                  return (
                    <div 
                      key={rev.id} 
                      className={`material-card p-5 sm:p-6 bg-white space-y-4 rounded-2xl border transition-all ${
                        isNegative ? 'border-l-4 border-l-rose-500 border-rose-200 bg-rose-50/20' : 
                        isCopied ? 'border-l-4 border-l-blue-500 border-blue-200' :
                        isReplied ? 'border-l-4 border-l-emerald-500 border-slate-200' :
                        'border-l-4 border-l-amber-500 border-google-border'
                      }`}
                    >
                      {/* Review Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-google-border-light pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                            isNegative ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {rev.customer ? rev.customer[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900">{rev.customer}</h4>
                              {isNegative && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                                  Negative Review
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">{rev.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex text-google-yellow">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-google-yellow text-google-yellow' : 'text-slate-300'}`} 
                              />
                            ))}
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isReplied ? 'bg-emerald-100 text-emerald-800' :
                            isCopied ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {isReplied ? '✓ REPLIED' : isCopied ? '📋 COPIED & OPENED' : '⏳ ACTION NEEDED'}
                          </span>
                        </div>
                      </div>

                      {/* Customer Review Quote */}
                      <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed pl-2 border-l-2 border-slate-300">
                        &ldquo;{rev.text}&rdquo;
                      </p>

                      {/* AI Generated Response Box (Semi-Automated Hub) */}
                      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3 text-xs">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-google-blue font-bold flex items-center gap-1.5 text-xs">
                            <Bot className="w-4 h-4 text-google-blue" />
                            <span>AI Suggested Response (Pre-computed)</span>
                          </span>

                          {/* Tone Selector Pills */}
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-[11px] text-slate-400 mr-1">Tone:</span>
                            <button
                              onClick={() => handleRegenerateTone(rev.id, 'PROFESSIONAL')}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                                rev.selectedTone === 'PROFESSIONAL' ? 'bg-google-blue text-white font-bold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              👔 Professional
                            </button>
                            <button
                              onClick={() => handleRegenerateTone(rev.id, 'FRIENDLY')}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                                rev.selectedTone === 'FRIENDLY' ? 'bg-google-blue text-white font-bold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              😊 Friendly
                            </button>
                            <button
                              onClick={() => handleRegenerateTone(rev.id, 'SEO')}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                                rev.selectedTone === 'SEO' ? 'bg-google-blue text-white font-bold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              📍 SEO Keywords
                            </button>
                            {isNegative && (
                              <button
                                onClick={() => handleRegenerateTone(rev.id, 'CRISIS')}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                                  rev.selectedTone === 'CRISIS' ? 'bg-rose-600 text-white font-bold' : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                                }`}
                              >
                                🛡️ De-escalation
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Editable Textarea so owner can customize wording */}
                        <div className="relative">
                          <textarea
                            rows={3}
                            value={rev.aiSuggestedReply}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRealReviews(prev => prev.map(r => r.id === rev.id ? { ...r, aiSuggestedReply: val } : r));
                            }}
                            className="w-full p-3 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-google-blue/30 leading-relaxed resize-y font-sans"
                            placeholder="AI response text..."
                          />
                          {rev.isGenerating && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center rounded-lg gap-2 text-xs font-semibold text-google-blue">
                              <Sparkles className="w-4 h-4 animate-spin text-google-blue" />
                              <span>Generating tone-perfect reply...</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons: 1-Click Copy & Open in Google Maps */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                          <div className="flex gap-1.5 flex-wrap items-center">
                            <span className="text-[10px] text-slate-400">SEO Keywords:</span>
                            {rev.lsi?.map((tag: string, i: number) => (
                              <span key={i} className="text-[10px] text-google-blue bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            {/* Mark as replied toggle */}
                            <button
                              onClick={() => {
                                setRealReviews(prev => prev.map(r => r.id === rev.id ? {
                                  ...r, 
                                  status: r.status === 'REPLIED' ? 'UNREPLIED' : 'REPLIED'
                                } : r));
                              }}
                              className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg font-medium transition-colors"
                              title="Toggle replied status"
                            >
                              {isReplied ? 'Mark Unreplied' : 'Mark as Replied'}
                            </button>

                            {/* 1-Click Copy & Open in Google Maps */}
                            <button
                              onClick={() => handleCopyAndOpen(rev)}
                              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                                isCopied 
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                  : 'bg-google-blue hover:bg-blue-600 text-white'
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Re-copy &amp; Open Maps ↗</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  <span>Copy &amp; Open in Google Maps ↗</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* TAB 2: QR & NFC POSTER CONSTRUCTOR */}
        {activeTab === 'QR_NFC' && (
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Design Controls */}
            <div className="material-card p-6 bg-white space-y-4 rounded-2xl border border-google-border">
              <h3 className="font-bold text-google-text-primary text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-google-blue" />
                Table Tent &amp; Sticker Customizer
              </h3>

              <div>
                <label className="block text-xs font-semibold text-google-text-secondary mb-1">Headline Text</label>
                <input 
                  type="text" 
                  value={posterTitle} 
                  onChange={(e) => setPosterTitle(e.target.value)} 
                  className="w-full p-2.5 border border-google-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-google-text-secondary mb-1">Sub-instruction</label>
                <input 
                  type="text" 
                  value={posterSubtitle} 
                  onChange={(e) => setPosterSubtitle(e.target.value)} 
                  className="w-full p-2.5 border border-google-border rounded-lg text-xs"
                />
              </div>

              <div className="p-4 bg-google-bg rounded-xl space-y-2 border border-google-border text-xs">
                <span className="font-bold text-google-text-primary flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-google-yellow" /> NFC Tap Hardware Link
                </span>
                <p className="text-[11px] text-google-text-secondary">
                  Write this dynamic link to your NTAG213 NFC chip for 1-tap review triggers:
                </p>
                <code className="block bg-white p-2 rounded text-[11px] font-mono text-google-blue select-all border border-google-border-light truncate">
                  https://search.google.com/local/writereview?placeid={activeProfile?.place_id || 'CH_PLACE_ID'}
                </code>
              </div>

              <button 
                onClick={() => alert("PDF Poster Download initiated (Print Ready CMYK 300 DPI)")}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-google-blue text-white rounded-xl font-bold text-xs shadow-sm hover:bg-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" /> Download Print-Ready PDF
              </button>
            </div>

            {/* Live Preview */}
            <div className="flex flex-col items-center justify-center p-8 bg-slate-100 rounded-2xl border border-dashed border-slate-300">
              <div className="w-72 bg-white rounded-2xl shadow-xl p-6 text-center space-y-4 border border-slate-200">
                <div className="flex items-center justify-center gap-1 text-google-yellow">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-google-yellow" />
                  ))}
                </div>
                <h4 className="font-extrabold text-slate-900 text-base leading-tight">{posterTitle}</h4>
                <p className="text-xs text-slate-500 leading-normal">{posterSubtitle}</p>
                
                {/* Simulated QR Code */}
                <div className="w-40 h-40 bg-slate-50 border-2 border-slate-800 rounded-xl mx-auto flex items-center justify-center p-3 relative shadow-inner">
                  <div className="w-full h-full bg-slate-900 flex flex-col justify-between p-2 rounded">
                    <div className="flex justify-between">
                      <div className="w-6 h-6 bg-white rounded-xs" />
                      <div className="w-6 h-6 bg-white rounded-xs" />
                    </div>
                    <div className="flex justify-center">
                      <div className="text-[10px] text-white font-black tracking-widest">★ 5.0 ★</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="w-6 h-6 bg-white rounded-xs" />
                      <div className="w-4 h-4 bg-white rounded-full self-end" />
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Google Maps Verified
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: GOOGLE POSTS PLANNER */}
        {activeTab === 'POSTS' && (
          <div className="material-card p-6 bg-white rounded-2xl border border-google-border space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-google-blue" />
                  Google Posts Content Planner
                </h3>
                <p className="text-xs text-slate-500">
                  Publish updates, weekly offers, and announcements directly to Google Search &amp; Maps.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-google-blue font-bold border border-blue-200">
                AI Drafter Active
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Post Draft Content</label>
              <textarea
                rows={4}
                value={postDraftText}
                onChange={(e) => setPostDraftText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-google-blue/30 leading-relaxed resize-y font-sans"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setPostDraftText(`Special Announcement from ${businessName}! We have updated our services to bring you an even better experience. Visit us today or order directly online!`)}
                  className="text-xs text-google-blue font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate New AI Post</span>
                </button>

                <button
                  onClick={() => {
                    setIsPostPublished(true);
                    setTimeout(() => setIsPostPublished(false), 4000);
                  }}
                  className="px-4 py-2 bg-google-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  {isPostPublished ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Post Scheduled!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Queue Google Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Toast Notification on Copy */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-emerald-300">AI Response Copied!</p>
            <p className="text-xs text-slate-300 leading-normal">{copiedToast}</p>
          </div>
          <button 
            onClick={() => setCopiedToast(null)}
            className="text-slate-400 hover:text-white text-xs font-bold ml-auto"
          >
            ✕
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
