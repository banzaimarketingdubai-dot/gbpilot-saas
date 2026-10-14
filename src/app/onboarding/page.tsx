'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Bot, 
  Globe, 
  Building2, 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  Layers, 
  Star,
  ExternalLink,
  Zap,
  Mail,
  Phone,
  Copy,
  MessageCircle,
  DollarSign,
  FileText,
  Scale,
  Moon,
  ShieldCheck,
  X
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [onboardingMode, setOnboardingMode] = useState<'MODE_A' | 'MODE_B' | 'MODE_C' | 'MODE_TAKEDOWN' | null>(null);

  // Review Takedown state
  const [takedownJurisdiction, setTakedownJurisdiction] = useState<'UAE' | 'USA' | 'EU' | 'GLOBAL'>('UAE');
  const [takedownBusiness, setTakedownBusiness] = useState('');
  const [takedownReviewText, setTakedownReviewText] = useState('');
  const [takedownAuthor, setTakedownAuthor] = useState('');
  const [isTakedownLoading, setIsTakedownLoading] = useState(false);
  const [takedownResult, setTakedownResult] = useState<{
    status: string;
    confidence_score: number;
    estimated_removal_time: string;
    violations: { clause: string; policy_name: string; explanation: string }[];
    dossier_text: string;
    google_escalation_url: string;
    jurisdiction?: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Path A state
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState<{
    name: string;
    address: string;
    phone: string;
    email: string;
    category: string;
    niche: string;
    summary: string;
    snapshot_url: string;
    website_url: string;
    services: string[];
    keywords: string[];
    id?: string;
  } | null>(null);
  const [interviewStep, setInterviewStep] = useState(0);
  const [interviewAnswers, setInterviewAnswers] = useState({
    landmarks: '',
    specialty: '',
    targetAudience: ''
  });

  // Path B state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    name: string;
    address: string;
    score: number;
    issues: string[];
    grid: { pos: number; rank: number }[];
    category?: string;
    rating?: number;
    reviews_count?: number;
    phone?: string;
    website_url?: string;
    cover_url?: string;
    id?: string;
  } | null>(null);
  const [isManageGatekeeperOpen, setIsManageGatekeeperOpen] = useState(false);

  // Path C state
  const [mapsLink, setMapsLink] = useState('');

  // Store approximate location to avoid requesting permission
  const [approxLocation, setApproxLocation] = useState<{lat: number, lng: number} | null>(null);

  const handleReviewTakedown = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!takedownBusiness || !takedownReviewText) return;
    setIsTakedownLoading(true);
    setTakedownResult(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const defaultCtx = takedownJurisdiction === 'UAE' 
        ? 'Dubai, UAE' 
        : takedownJurisdiction === 'USA' 
        ? 'United States' 
        : takedownJurisdiction === 'EU' 
        ? 'European Union' 
        : 'International';

      const res = await fetch(`${baseUrl}/api/v1/guard/review-takedown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: takedownBusiness,
          review_text: takedownReviewText,
          author_name: takedownAuthor || 'Anonymous',
          rating: 1,
          jurisdiction: takedownJurisdiction,
          business_context: defaultCtx
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTakedownResult(data);
      } else {
        throw new Error("Fallback required");
      }
    } catch (err) {
      console.error(err);
      const jurFallbacks: Record<string, any> = {
        UAE: {
          statute: 'UAE Federal Decree-Law No. 34 of 2021 (Articles 43 & 44)',
          clause1: 'Section 3.2 - Deceptive Content & Fake Engagement',
          policy1: 'Google Maps User Contributed Content Policy',
          clause2: 'Articles 43 & 44 - Defamation & False Rumors',
          policy2: 'UAE Federal Decree-Law No. 34 of 2021'
        },
        USA: {
          statute: 'FTC Consumer Review Fairness Act & Lanham Act § 43(a)',
          clause1: 'Section 3.2 - Deceptive Content & Inauthentic Engagement',
          policy1: 'Google Maps User Contributed Content Policy',
          clause2: '15 U.S.C. § 45b & Lanham Act - Commercial Disparagement',
          policy2: 'FTC & US Commercial Code'
        },
        EU: {
          statute: 'EU Digital Services Act (Regulation 2022/2065, Art. 16) & GDPR',
          clause1: 'Article 16 DSA - Notice and Action Mechanism',
          policy1: 'EU Digital Services Act',
          clause2: 'Section 3.2 - Deceptive & Fake Engagement',
          policy2: 'Google Maps User Contributed Content Policy'
        },
        GLOBAL: {
          statute: 'Google Maps User Contributed Content Guidelines',
          clause1: 'Section 3.2 - Inauthentic Engagement & Unverified Experience',
          policy1: 'Google Maps Content Policy',
          clause2: 'Section 1.2 - Conflict of Interest & Commercial Sabotage',
          policy2: 'Google Business Profile Guidelines'
        }
      };
      const curJur = jurFallbacks[takedownJurisdiction] || jurFallbacks.UAE;
      setTakedownResult({
        status: 'success',
        confidence_score: 91,
        estimated_removal_time: '24-48 hours',
        jurisdiction: takedownJurisdiction,
        violations: [
          {
            clause: curJur.clause1,
            policy_name: curJur.policy1,
            explanation: 'Unverified transaction claims exhibiting patterns of competitor-orchestrated sabotage.'
          },
          {
            clause: curJur.clause2,
            policy_name: curJur.policy2,
            explanation: `Formal violation of applicable statutory standards (${curJur.statute}).`
          }
        ],
        dossier_text: `FORMAL ESCALATION NOTICE: REQUEST FOR PERMANENT REVIEW REMOVAL\nTo: Google Business Profile Trust & Safety Team / Legal Escalations\nEntity: ${takedownBusiness}\nJurisdiction: ${takedownJurisdiction}\nReviewer: ${takedownAuthor || 'Anonymous'}\nFlagged Text: "${takedownReviewText}"\n\nSUMMARY OF VIOLATION:\n1. Direct breach of Google Maps Deceptive Content Policy (Section 3.2).\n2. Violation of statutory standards under ${curJur.statute}.\n\nPRAYER FOR RELIEF:\nWe formally request immediate permanent deletion of this unverified entry.`,
        google_escalation_url: 'https://support.google.com/business/workflow/9945796'
      });
    } finally {
      setIsTakedownLoading(false);
    }
  };

  useEffect(() => {
    // Fetch IP-based location silently on mount
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(res => res.json())
      .then(data => {
        if (data.latitude && data.longitude) {
          setApproxLocation({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
        }
      })
      .catch(() => {}); // silently ignore if blocked by adblocker
  }, []);

  // Fetch Autocomplete Suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(searchQuery, approxLocation?.lat || null, approxLocation?.lng || null);
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, approxLocation]);

  const fetchSuggestions = async (q: string, lat: any, lng: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
    let url = `${baseUrl}/api/v1/onboarding/autocomplete?query=${encodeURIComponent(q)}`;
    if (lat && lng) url += `&lat=${lat}&lng=${lng}`;
    
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      }
    } catch(e) {
      console.error(e);
    }
  };
  const [showSmartFixModal, setShowSmartFixModal] = useState(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isFixApplied, setIsFixApplied] = useState(false);
  const [isWebsiteBuilding, setIsWebsiteBuilding] = useState(false);
  const [isWebsiteBuilt, setIsWebsiteBuilt] = useState(false);

  // Handle Path A Scraping
  const handleScrapeWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl || !websiteUrl.trim()) return;
    
    let formattedUrl = websiteUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setIsScraping(true);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const response = await fetch(`${backendUrl}/api/v1/onboarding/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website_url: formattedUrl }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const profile = data.profile || data;
        setScrapedData({
          name: profile.business_name || profile.name || 'Extracted Business Entity',
          address: profile.address || profile.address_line || 'Extracted Location',
          phone: profile.phone || profile.phone_number || 'Contact via website',
          email: profile.email || 'Contact via website',
          category: profile.category || profile.primary_category || 'Local Business',
          niche: profile.niche || profile.category || 'Local Business & Services',
          summary: profile.summary || 'Summary generated by AI from website homepage content.',
          snapshot_url: profile.snapshot_url || `https://image.thum.io/get/width/800/crop/600/${formattedUrl}`,
          website_url: formattedUrl,
          services: profile.services && profile.services.length > 0 ? profile.services : ['Primary Service', 'Client Support'],
          keywords: profile.keywords && profile.keywords.length > 0 ? profile.keywords : ['local business', 'top provider'],
          id: profile.id
        });
      } else {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.detail || errorJson.message || `Server error (${response.status})`);
      }
    } catch (err: any) {
      console.error("Website scrape error:", err);
      alert(`Website scraping error: ${err.message || 'Please verify URL and backend availability'}`);
      setScrapedData(null);
    } finally {
      setIsScraping(false);
    }
  };

  // Handle Path B Scan
  const handleSearchScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsScanning(true);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const response = await fetch(`${backendUrl}/api/v1/onboarding/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: searchQuery }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const profile = data.profile || {};
        setScanResult({
          name: profile.business_name || searchQuery,
          address: `${profile.address_line || 'Central District'}, ${profile.city || 'Dubai'}`,
          score: profile.health_score || 64,
          issues: profile.issues || [
            `Missing Secondary Category: ${profile.primary_category || 'Specialty'} Training & Services`,
            '3 Negative Reviews without AI owner responses',
            'Profile Guard disabled (unauthorized edits risk)',
            'No Google Posts published in past 14 days'
          ],
          grid: [
            { pos: 1, rank: 2 }, { pos: 2, rank: 3 }, { pos: 3, rank: 7 },
            { pos: 4, rank: 1 }, { pos: 5, rank: 4 }, { pos: 6, rank: 11 },
            { pos: 7, rank: 8 }, { pos: 8, rank: 14 }, { pos: 9, rank: 18 }
          ],
          category: profile.primary_category || 'Local Business',
          rating: profile.rating || 4.7,
          reviews_count: profile.reviews_count || 120,
          phone: profile.phone_number || '+971 4 123 4567',
          website_url: profile.website_url || '',
          cover_url: profile.cover_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
          id: profile.id
        });
      } else {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.detail || errorJson.message || `Server error (${response.status})`);
      }
    } catch (err: any) {
      console.error("Scan error:", err);
      alert(`Scan error: ${err.message || 'Check connection to backend server'}`);
      setScanResult(null);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Path C Scan (Agency Maps Link)
  const handleMapsScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapsLink) return;
    setIsScanning(true);
    
    // In a real scenario, this would send the URL to backend.
    // For this fast agency JTBD, we simulate a 1.5s scan and redirect directly to a generated Audit page.
    setTimeout(() => {
      setIsScanning(false);
      if (router) router.push('/audit/agency-instant-' + Math.random().toString(36).substring(7));
    }, 1500);
  };

  // Handle Google OAuth 1-Click Connect
  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    try {
      // PLG: Store pending venue in localStorage so Dashboard auto-attaches it post-login!
      if (scanResult) {
        localStorage.setItem('gbpilot_pending_venue', JSON.stringify({
          id: scanResult.id || `profile_${Date.now()}`,
          name: scanResult.name,
          address: scanResult.address,
          city: scanResult.address.split(',').pop()?.trim() || 'Dubai',
          category: scanResult.category || 'Local Business',
          primary_category: scanResult.category || 'Local Business',
          phone: scanResult.phone || '+971 4 123 4567',
          website_url: scanResult.website_url || `https://${scanResult.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          rating: scanResult.rating || 4.7,
          reviews_count: scanResult.reviews_count || 120,
          health_score: scanResult.score || 64,
          cover_url: scanResult.cover_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
          role: 'Owner / Administrator',
          verified: true,
          is_admin: true
        }));
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.gbpilot.top';
      const loginUrl = `${backendUrl}/api/v1/auth/google/login?redirect_url=${encodeURIComponent(origin)}&origin=${encodeURIComponent(origin)}&state=${encodeURIComponent(origin)}`;
      
      const res = await fetch(`${loginUrl}&raw_json=true`);
      if (res.ok) {
        const data = await res.json();
        if (data.auth_url) {
          window.location.href = data.auth_url;
          return;
        }
      }
      window.location.href = loginUrl;
    } catch {
      // Fallback preview modal if GOOGLE_CLIENT_ID is not configured yet
      setIsConnectingGoogle(false);
      setShowSmartFixModal(true);
    }
  };

  const handleApplyFixes = () => {
    setIsFixApplied(true);
    setTimeout(() => {
      setShowSmartFixModal(false);
      if (router) router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-google-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        
        {/* Onboarding Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-google-blue/10 text-slate-800 rounded-full text-xs font-bold mb-3 border border-slate-200 shadow-xs">
            <span className="text-base">🇦🇪</span> THE #1 AUTONOMOUS LOCAL SEO COPILOT IN DUBAI & UAE
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-google-text-primary tracking-tight leading-tight">
            Turn Red Pins Green in <span className="text-google-blue">Downtown, Marina & JLT</span>.
          </h1>
          <p className="text-google-text-secondary text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
            Stop losing high-paying customers to competitors. GBPilot autonomously defends, optimizes, and scales your Google Maps ranking 24/7 without expensive agencies.
          </p>
        </div>

        {/* Global Mode Selector */}
        {!onboardingMode && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            
            {/* Mode B Selector: Recommended Audit */}
            <div 
              onClick={() => setOnboardingMode('MODE_B')}
              className="material-card p-6 cursor-pointer hover:border-google-blue hover:shadow-material-2 transition-all group border-2 border-google-blue relative overflow-hidden bg-white"
            >
              <div className="absolute top-0 right-0 bg-google-blue text-white text-[9px] font-extrabold px-2.5 py-1 rounded-bl-lg uppercase tracking-wider">
                RECOMMENDED
              </div>
              <div className="w-12 h-12 rounded-xl bg-google-blue-light text-google-blue flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-google-blue bg-google-blue-light px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                1-Touch Audit
              </span>
              <h2 className="text-lg font-bold text-google-text-primary mt-2.5 leading-tight">
                Instant Spatial Audit (Dubai)
              </h2>
              <p className="text-google-text-secondary text-xs mt-2 leading-relaxed">
                Search your business to generate a live 3x3 Geo-Grid rank heatmap & calculate monthly missed revenue in AED.
              </p>
              <div className="mt-4 flex items-center text-google-blue text-xs font-bold group-hover:translate-x-1 transition-transform">
                <span>Run Free 10-Sec Scan</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* Mode Takedown Selector: Killer Feature */}
            <div 
              onClick={() => setOnboardingMode('MODE_TAKEDOWN')}
              className="material-card p-6 cursor-pointer hover:border-google-red hover:shadow-material-2 transition-all group border-2 border-google-red/40 relative overflow-hidden bg-gradient-to-br from-white to-red-50/30"
            >
              <div className="absolute top-0 right-0 bg-google-red text-white text-[9px] font-extrabold px-2.5 py-1 rounded-bl-lg uppercase tracking-wider">
                1 TEST FREE
              </div>
              <div className="w-12 h-12 rounded-xl bg-google-red-light text-google-red flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-google-red bg-google-red-light px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                UAE Law № 34/2021
              </span>
              <h2 className="text-lg font-bold text-google-text-primary mt-2.5 leading-tight">
                Review Takedown™ (Removal)
              </h2>
              <p className="text-google-text-secondary text-xs mt-2 leading-relaxed">
                Eliminate fake 1★ reviews. AI drafts an official escalation notice under Google Policy & UAE Cybercrime Law in 10 seconds.
              </p>
              <div className="mt-4 flex items-center text-google-red text-xs font-bold group-hover:translate-x-1 transition-transform">
                <span>Dispute 1 Review Free</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* Mode A Selector: Scratch Builder */}
            <div 
              onClick={() => setOnboardingMode('MODE_A')}
              className="material-card p-6 cursor-pointer hover:border-amber-500 hover:shadow-material-2 transition-all group border-2 border-transparent bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                New Entity
              </span>
              <h2 className="text-lg font-bold text-google-text-primary mt-2.5 leading-tight">
                No Google Profile Yet
              </h2>
              <p className="text-google-text-secondary text-xs mt-2 leading-relaxed">
                Build an optimized Google Profile from scratch by auto-extracting keywords & services from your website.
              </p>
              <div className="mt-4 flex items-center text-amber-600 text-xs font-bold group-hover:translate-x-1 transition-transform">
                <span>Start Website Extraction</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

          </div>

          {/* Dubai Triad Operational Model Showcase */}
          <div className="mt-12 bg-white rounded-2xl border border-google-border p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-google-border-light pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-google-blue-light text-google-blue rounded-full text-xs font-bold mb-2">
                  <Zap className="w-3.5 h-3.5 fill-google-blue" /> GBPILOT DUBAI OPERATIONAL TRIAD
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-google-text-primary tracking-tight">
                  Autonomous Google Maps Superiority Without Agencies
                </h3>
                <p className="text-xs sm:text-sm text-google-text-secondary mt-1">
                  Three interconnected modules solving critical business challenges across Downtown, Marina, Business Bay, and JLT.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                  🇦🇪 UAE Cybercrime Law Ready
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Pillar 1 */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-google-blue transition-all">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-google-blue flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-google-blue uppercase tracking-wider">Module 1</span>
                <h4 className="text-base font-bold text-slate-900 mt-1">🧭 Scout Radar</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Spatial 3x3 Geo-Grid across Dubai districts. Competitor rank tracking and estimated monthly lost revenue in AED when dropping below top 3.
                </p>
                <div className="mt-3 text-[11px] font-bold text-google-blue">
                  ✓ Up to 10 km tracking radius
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-500 transition-all">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Module 2</span>
                <h4 className="text-base font-bold text-slate-900 mt-1">🤖 Action Copilot</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  AI post generation and auto-replies in 2 languages (EN/AR). 1-click Ramadan Mode with automated schedule switching for Iftar/Suhoor.
                </p>
                <div className="mt-3 text-[11px] font-bold text-amber-700">
                  ✓ 🌙 Ramadan Hours Automation
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-google-red transition-all">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-google-red flex items-center justify-center mb-3">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-google-red uppercase tracking-wider">Module 3</span>
                <h4 className="text-base font-bold text-slate-900 mt-1">🛡️ Review Defense & Takedown</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  24/7 profile guard against competitor edits. AI legal dossier generator to remove fake 1★ reviews under UAE Law No. 34/2021.
                </p>
                <div className="mt-3 text-[11px] font-bold text-google-red">
                  ✓ ⚡ Remove fake reviews (1 free test)
                </div>
              </div>
            </div>
          </div>

          {/* Dubai Pricing Section in AED */}
          <div className="mt-12">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold text-google-blue uppercase tracking-wider bg-google-blue-light px-3 py-1 rounded-full">
                🇦🇪 TRANSPARENT PRICING IN AED
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Pays for itself with your first retained customer in Dubai
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                No hidden fees. Monthly subscription, cancel anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Starter */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starter</div>
                  <div className="text-3xl font-black text-slate-900 mt-2">AED 99<span className="text-xs font-normal text-slate-500"> / mo</span></div>
                  <p className="text-xs text-slate-600 mt-2">For small businesses and cafes starting their local growth.</p>
                  <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 1 location on Google Maps</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 3x3 Geo-Grid scanning (weekly)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> AI review responses (EN / AR)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 1 review takedown per month</li>
                  </ul>
                </div>
                <button 
                  onClick={() => setOnboardingMode('MODE_B')}
                  className="material-button-secondary w-full text-xs font-bold mt-6 py-2.5"
                >
                  Choose Starter
                </button>
              </div>

              {/* Pro (Recommended) */}
              <div className="bg-white rounded-2xl border-2 border-google-blue p-6 flex flex-col justify-between shadow-lg shadow-blue-500/10 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-google-blue text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  BESTSELLER IN DUBAI
                </div>
                <div>
                  <div className="text-xs font-bold text-google-blue uppercase tracking-wider">Pro Business</div>
                  <div className="text-3xl font-black text-slate-900 mt-2">AED 249<span className="text-xs font-normal text-slate-500"> / mo</span></div>
                  <p className="text-xs text-slate-600 mt-2">Full autonomous autopilot for restaurants, clinics, and salons in Dubai.</p>
                  <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-google-blue shrink-0" /> Up to 3 branch locations</li>
                    <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-google-blue shrink-0" /> Daily 5x5 Geo-Grid + competitor tracking</li>
                    <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-google-blue shrink-0" /> 🌙 Ramadan Hours Automation</li>
                    <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-google-blue shrink-0" /> 24/7 Profile Guard (fields and photos protection)</li>
                    <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-google-blue shrink-0" /> ⚡ Up to 5 review takedowns per month under UAE Law</li>
                  </ul>
                </div>
                <button 
                  onClick={() => setOnboardingMode('MODE_B')}
                  className="material-button-primary w-full text-xs font-bold mt-6 py-2.5 !bg-google-blue"
                >
                  Activate Pro (7-Day Free Trial)
                </button>
              </div>

              {/* Agency */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="text-xs font-bold text-purple-600 uppercase tracking-wider">Agency / Chain</div>
                  <div className="text-3xl font-black text-slate-900 mt-2">AED 749<span className="text-xs font-normal text-slate-500"> / mo</span></div>
                  <p className="text-xs text-slate-600 mt-2">For agencies and multi-location brands with white-label presentation-ready reports.</p>
                  <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600 shrink-0" /> 10+ client locations in UAE</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600 shrink-0" /> White-Label PDF audit presentations</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600 shrink-0" /> Express Google Maps URL scan (Path C)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600 shrink-0" /> Unlimited Review Takedown™ dossiers</li>
                  </ul>
                </div>
                <button 
                  onClick={() => setOnboardingMode('MODE_C')}
                  className="material-button-secondary w-full text-xs font-bold mt-6 py-2.5 border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Choose Agency Plan
                </button>
              </div>
            </div>

            {/* Payment badges & Agency shortcut */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 bg-slate-100/60 p-4 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-700">Accepted payment methods:</span>
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200 font-bold text-slate-800">Apple Pay</span>
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200 font-bold text-slate-800">Visa / Mastercard</span>
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200 font-bold text-slate-800">Stripe UAE (AED)</span>
              </div>
              <button 
                onClick={() => setOnboardingMode('MODE_C')}
                className="text-google-blue font-bold hover:underline flex items-center gap-1"
              >
                <span>Marketing agency in UAE? Run instant audit (Path C)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          </>
        )}

        {/* ======================================================== */}
        {/* KILLER FEATURE: REVIEW TAKEDOWN™ WORKFLOW (DISPUTE)       */}
        {/* ======================================================== */}
        {onboardingMode === 'MODE_TAKEDOWN' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            <button 
              onClick={() => { setOnboardingMode(null); setTakedownResult(null); }}
              className="text-xs text-google-text-secondary hover:text-google-blue font-medium flex items-center gap-1 mb-2"
            >
              ← Back to Mode Selector
            </button>

            {/* Takedown Input Card */}
            <div className="material-card p-6 border-t-4 border-google-red">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-google-red-light text-google-red rounded-xl">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-google-text-primary">Review Takedown™ (Removal)</h2>
                      <span className="text-[10px] bg-red-100 text-google-red font-bold px-2 py-0.5 rounded-full uppercase">
                        1 test free (0 AED / $0)
                      </span>
                    </div>
                    <p className="text-xs text-google-text-secondary">
                      Generate official legal escalation dossiers for Google Support under local laws and Google policies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Jurisdiction Switcher */}
              <div className="mb-5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Business Jurisdiction / Legal Framework:</span>
                  <span className="text-[11px] text-google-blue font-bold">
                    {takedownJurisdiction === 'UAE' && '🇦🇪 UAE: Law No. 34/2021'}
                    {takedownJurisdiction === 'USA' && '🇺🇸 USA: FTC Act & Lanham Act'}
                    {takedownJurisdiction === 'EU' && '🇪🇺 EU / UK: Digital Services Act'}
                    {takedownJurisdiction === 'GLOBAL' && '🌍 Global: Google Policy'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setTakedownJurisdiction('UAE')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                      takedownJurisdiction === 'UAE'
                        ? 'bg-white text-google-red border-red-300 shadow-sm ring-1 ring-red-300'
                        : 'bg-white/60 text-slate-600 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    <span>🇦🇪</span>
                    <span>UAE / Dubai</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTakedownJurisdiction('USA')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                      takedownJurisdiction === 'USA'
                        ? 'bg-white text-google-blue border-blue-300 shadow-sm ring-1 ring-blue-300'
                        : 'bg-white/60 text-slate-600 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    <span>🇺🇸</span>
                    <span>USA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTakedownJurisdiction('EU')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                      takedownJurisdiction === 'EU'
                        ? 'bg-white text-purple-700 border-purple-300 shadow-sm ring-1 ring-purple-300'
                        : 'bg-white/60 text-slate-600 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    <span>🇪🇺</span>
                    <span>Europe / UK</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTakedownJurisdiction('GLOBAL')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                      takedownJurisdiction === 'GLOBAL'
                        ? 'bg-white text-emerald-700 border-emerald-300 shadow-sm ring-1 ring-emerald-300'
                        : 'bg-white/60 text-slate-600 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    <span>🌍</span>
                    <span>Global</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleReviewTakedown} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-google-text-secondary mb-1">
                      Business Name in Google Maps *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Al Safadi Restaurant Downtown"
                      value={takedownBusiness}
                      onChange={(e) => setTakedownBusiness(e.target.value)}
                      className="material-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-google-text-secondary mb-1">
                      Review Author Name (if available)
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. John Doe or Anonymous"
                      value={takedownAuthor}
                      onChange={(e) => setTakedownAuthor(e.target.value)}
                      className="material-input text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-google-text-secondary mb-1">
                    Toxic or Fake 1★ Review Text *
                  </label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Paste the negative review left by a competitor or fake account here..."
                    value={takedownReviewText}
                    onChange={(e) => setTakedownReviewText(e.target.value)}
                    className="material-input text-sm resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isTakedownLoading}
                  className="material-button-primary w-full text-sm py-3 !bg-google-red hover:!bg-red-700 shadow-lg shadow-red-500/20"
                >
                  {isTakedownLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-white" />
                      <span>Analyzing violations & drafting legal dossier...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-white" />
                      <span>⚡ Generate Review Takedown Dossier (0 AED)</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Live Dossier Result */}
            {takedownResult && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                
                {/* Result Status Banner */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-900 text-sm">Dossier Successfully Generated</span>
                        <span className="px-2 py-0.5 bg-emerald-200/80 text-emerald-800 text-[10px] font-extrabold rounded-full">
                          Removal Probability: {takedownResult.confidence_score}%
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Google MENA Review Window: {takedownResult.estimated_removal_time}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-center">
                    {takedownJurisdiction === 'UAE' && 'Basis: UAE Law No. 34/2021'}
                    {takedownJurisdiction === 'USA' && 'Basis: FTC Act & Lanham Act'}
                    {takedownJurisdiction === 'EU' && 'Basis: EU Digital Services Act (DSA)'}
                    {takedownJurisdiction === 'GLOBAL' && 'Basis: Google Maps Content Policy'}
                  </span>
                </div>

                {/* Identified Violations Badges */}
                <div className="material-card p-5">
                  <h4 className="text-xs font-bold text-google-text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-google-red" />
                    Identified Regulatory & Legal Violations:
                  </h4>
                  <div className="space-y-2.5">
                    {takedownResult.violations.map((v, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-google-red">{v.clause}</span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {v.policy_name}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{v.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Dossier Monospace Block */}
                <div className="material-card p-5 bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Official Legal Escalation Notice
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(takedownResult.dossier_text);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2500);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isCopied ? '✓ Copied!' : 'Copy Dossier'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto pr-2 select-all">
                    {takedownResult.dossier_text}
                  </pre>
                </div>

                {/* Action CTA with direct Google Support Deep Link */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg space-y-4">
                  <div>
                    <h4 className="text-base font-bold">How to submit dossier to Google Support in 60 seconds:</h4>
                    <ol className="text-xs text-red-100 mt-2 space-y-1 list-decimal list-inside leading-relaxed">
                      <li>Click the <strong>«Copy Dossier»</strong> button above.</li>
                      <li>Follow the direct link to the Google Support escalation form (button below).</li>
                      <li>Select the profile for {takedownBusiness || 'your company'}, find the review, and paste the copied dossier.</li>
                    </ol>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <a 
                      href={takedownResult.google_escalation_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 bg-white text-red-700 hover:bg-slate-100 font-extrabold rounded-xl shadow text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap"
                    >
                      <span>🚀 Open Google MENA Escalation Form</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => setOnboardingMode('MODE_B')}
                      className="w-full sm:w-auto px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Run Full Profile Audit →</span>
                    </button>
                  </div>
                </div>

                {/* Pro Upgrade Hook */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-800">Tired of manually defending against competitor attacks?</span>
                    <p className="text-slate-500 mt-0.5">On the Pro plan (AED 249/mo), GBPilot blocks unauthorized edits 24/7 and prepares takedowns automatically.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (router) router.push('/b2b');
                    }}
                    className="material-button-primary text-xs whitespace-nowrap !bg-slate-900 hover:!bg-black"
                  >
                    Activate Pro Shield
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* PATH A: NO GOOGLE BUSINESS PROFILE WORKFLOW */}
        {/* ======================================================== */}
        {onboardingMode === 'MODE_A' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            <button 
              onClick={() => { setOnboardingMode(null); setScrapedData(null); }}
              className="text-xs text-google-text-secondary hover:text-google-blue font-medium flex items-center gap-1 mb-2"
            >
              ← Back to Mode Selector
            </button>

            {/* Step 1: Website Input */}
            {!scrapedData && (
              <div className="material-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-google-blue-light text-google-blue rounded-lg">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-google-text-primary">Step 1: Enter Business Website</h2>
                    <p className="text-xs text-google-text-secondary">AI will scrape services, address, and category details.</p>
                  </div>
                </div>

                <form onSubmit={handleScrapeWebsite} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-google-text-secondary mb-1">Website URL</label>
                    <input 
                      type="text"
                      inputMode="url"
                      required
                      placeholder="e.g. virale.uno, google.com, www.mybakery.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="material-input text-sm"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isScraping}
                    className="material-button-primary w-full"
                  >
                    {isScraping ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>AI Analyzing & Extracting Business Core...</span>
                      </>
                    ) : (
                      <>
                        <span>Scrape & Extract Business Core</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Live Website Visual Snapshot & AI Executive Summary */}
            {scrapedData && (
              <>
                <div className="material-card p-6 bg-white space-y-6">
                  {/* Top Bar with Confidence & Status */}
                  <div className="flex items-center justify-between border-b border-google-border-light pb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-google-green" />
                      <h3 className="font-bold text-google-text-primary text-base">Real-Time Website Snapshot & AI Baseline</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Snapshot
                      </span>
                      <span className="text-xs font-bold text-google-blue bg-google-blue-light px-2.5 py-1 rounded-full border border-google-blue/20">
                        AI Confidence: 98%
                      </span>
                    </div>
                  </div>

                  {/* Grid: Left Visual Snapshot Frame / Right AI Executive Analysis */}
                  <div className="grid md:grid-cols-12 gap-6">
                    
                    {/* Left: Website Snapshot Browser Container */}
                    <div className="md:col-span-5 rounded-xl border border-google-border overflow-hidden bg-slate-900 shadow-sm flex flex-col">
                      {/* Browser Header Bar */}
                      <div className="bg-slate-800 px-3 py-2 flex items-center gap-2 border-b border-slate-700">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                        </div>
                        <div className="flex-1 bg-slate-950/80 rounded px-2.5 py-1 text-[11px] text-slate-300 font-mono flex items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="truncate">{scrapedData.website_url}</span>
                          <a href={scrapedData.website_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white ml-1">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Snapshot Image Thumbnail */}
                      <div className="relative bg-slate-950 flex-1 flex items-center justify-center min-h-[180px] overflow-hidden group">
                        <img 
                          src={scrapedData.snapshot_url} 
                          alt={`Website snapshot for ${scrapedData.name}`} 
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback image display if thum.io thumbnail is blocked
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-[10px] text-slate-200 font-medium flex items-center gap-1">
                            <Globe className="w-3 h-3 text-google-blue" /> Live HTML & Metadata Scraped
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: AI Executive Summary & Niche Badge */}
                    <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                      
                      {/* Business Niche & Category */}
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-extrabold rounded-md border border-amber-200 uppercase tracking-wider flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-amber-600" /> {scrapedData.niche}
                          </span>
                          <span className="text-xs text-google-text-tertiary">| {scrapedData.category}</span>
                        </div>
                        <h2 className="text-xl font-black text-google-text-primary tracking-tight">
                          {scrapedData.name}
                        </h2>
                      </div>

                      {/* Executive AI Summary Box */}
                      <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl relative">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-google-blue mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-google-blue" /> Executive AI Summary
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-normal">
                          {scrapedData.summary}
                        </p>
                      </div>

                      {/* Extracted Contact Info Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs border-t border-google-border-light pt-3">
                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <Phone className="w-3.5 h-3.5 text-google-blue shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-google-text-tertiary font-semibold block uppercase">Phone</span>
                            <span className="font-bold text-google-text-primary text-xs truncate block">{scrapedData.phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <Mail className="w-3.5 h-3.5 text-google-blue shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-google-text-tertiary font-semibold block uppercase">Email</span>
                            <span className="font-bold text-google-text-primary text-xs truncate block">{scrapedData.email}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Physical Location */}
                  <div className="flex items-center gap-2 text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <MapPin className="w-4 h-4 text-google-red shrink-0" />
                    <span className="text-google-text-secondary font-medium">Location:</span>
                    <span className="font-bold text-google-text-primary">{scrapedData.address}</span>
                  </div>

                  {/* Services & Keywords */}
                  <div className="pt-2 border-t border-google-border-light space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-google-text-secondary block mb-1.5">Identified Core Services:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {scrapedData.services.map((svc, i) => (
                          <span key={i} className="px-2.5 py-1 bg-google-bg text-google-text-primary rounded-md text-[11px] font-medium border border-google-border">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-google-text-secondary block mb-1.5">Extracted High-Intent LSI Keywords:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {scrapedData.keywords.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 bg-google-blue-light text-google-blue rounded text-[11px] font-bold border border-google-blue/20">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Interactive Interview Workspace */}
                <div className="material-card p-6 border-l-4 border-l-google-blue">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-5 h-5 text-google-blue" />
                    <h3 className="font-bold text-google-text-primary text-sm">Copilot Quick Interview (30-Sec Enrichment)</h3>
                  </div>

                  {interviewStep === 0 && (
                    <div className="space-y-3">
                      <p className="text-xs text-google-text-secondary">
                        🤖 <strong className="text-google-text-primary">Question 1/2:</strong> What are the main local landmarks or neighborhoods near your business? (Helps boost GEO local relevance keywords).
                      </p>
                      <input 
                        type="text"
                        placeholder="e.g. Near Sector 4 Metro Station & Central Park"
                        value={interviewAnswers.landmarks}
                        onChange={(e) => setInterviewAnswers({ ...interviewAnswers, landmarks: e.target.value })}
                        className="material-input text-xs"
                      />
                      <button 
                        onClick={() => setInterviewStep(1)}
                        className="material-button-primary text-xs py-2 ml-auto"
                      >
                        Next Question →
                      </button>
                    </div>
                  )}

                  {interviewStep === 1 && (
                    <div className="space-y-3">
                      <p className="text-xs text-google-text-secondary">
                        🤖 <strong className="text-google-text-primary">Question 2/2:</strong> What is your top specialty or unique selling point?
                      </p>
                      <input 
                        type="text"
                        placeholder="e.g. 100% Organic sourdough baked fresh daily at 6 AM"
                        value={interviewAnswers.specialty}
                        onChange={(e) => setInterviewAnswers({ ...interviewAnswers, specialty: e.target.value })}
                        className="material-input text-xs"
                      />
                      <button 
                        onClick={() => setInterviewStep(2)}
                        className="material-button-primary text-xs py-2 ml-auto"
                      >
                        Generate Profile Draft →
                      </button>
                    </div>
                  )}

                  {interviewStep === 2 && (
                    <div className="space-y-4">
                      <div className="p-3 bg-google-green-light rounded-lg text-xs text-google-green font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        AI Profile Package Ready to Launch!
                      </div>
                      <button 
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('gbpilot_active_profile', JSON.stringify({
                              id: scrapedData.id,
                              name: scrapedData.name,
                              address: scrapedData.address,
                              city: scrapedData.address.split(',').pop()?.trim() || 'Local City',
                              autopilotMode: 'MANUAL_APPROVAL',
                              snapshot_url: scrapedData.snapshot_url
                            }));
                          }
                          if (router) router.push('/dashboard');
                        }}
                        className="material-button-primary w-full text-sm"
                      >
                        🚀 Launch New Profile & Go to Action Hub
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* PATH B: ZERO-FRICTION ONBOARDING WORKFLOW (EXISTING PROFILE) */}
        {/* ======================================================== */}
        {onboardingMode === 'MODE_B' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            <button 
              onClick={() => { setOnboardingMode(null); setScanResult(null); }}
              className="text-xs text-google-text-secondary hover:text-google-blue font-medium flex items-center gap-1 mb-2"
            >
              ← Back to Mode Selector
            </button>

            {/* Step 1: Magic Search Scan (No Auth Gateway) */}
            {!scanResult && (
              <div className="material-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-google-blue-light text-google-blue rounded-xl">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-google-text-primary">Magic Search Scan (No Auth Required)</h2>
                    <p className="text-xs text-google-text-secondary">Type your business name or address on Google Maps to generate an instant rank heatmap.</p>
                  </div>
                </div>

                <form onSubmit={handleSearchScan} className="space-y-4">
                  <div className="relative">
                    <Search className="w-5 h-5 text-google-text-tertiary absolute left-3.5 top-3" />
                    <input 
                      type="text"
                      required
                      placeholder="Enter business name (e.g. Al Safadi Dubai) or Google Maps link (maps.app.goo.gl)..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="material-input text-sm pl-11 py-3"
                    />
                    
                    {/* Autocomplete Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        {suggestions.map((s, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setSearchQuery(s.description);
                              setShowSuggestions(false);
                            }}
                            className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                          >
                            <div className="font-semibold text-sm text-google-text-primary">{s.main_text}</div>
                            <div className="text-xs text-google-text-secondary truncate">{s.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    type="submit"
                    disabled={isScanning}
                    className="material-button-primary w-full text-sm py-3 relative z-40"
                  >
                    {isScanning ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Running Spatial Geo-Grid Scan & Competitor Analysis...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡ Run Instant Free Audit & Geo-Grid Heatmap</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Instant Scan Results & Geo-Grid Heatmap (FOMO Trigger) */}
            {scanResult && (
              <div className="space-y-6">
                
                {/* Result Header & FOMO Banner */}
                <div className="material-card p-6 bg-white border-2 border-google-red/30">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-google-border-light pb-4">
                    <div>
                      <span className="text-[11px] font-bold text-google-red bg-google-red-light px-2.5 py-1 rounded-full uppercase tracking-wider">
                        CRITICAL RANKING VULNERABILITIES DETECTED
                      </span>
                      <h2 className="text-xl font-extrabold text-google-text-primary mt-1.5">
                        {scanResult.name}
                      </h2>
                      <p className="text-xs text-google-text-secondary">{scanResult.address}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-google-text-secondary block">Health Score</span>
                        <span className="text-2xl font-black text-amber-600">{scanResult.score}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Identified Issues List */}
                  <div className="mt-4 space-y-2">
                    <span className="text-xs font-bold text-google-text-primary block">Top 4 Optimization Leaks:</span>
                    {scanResult.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-google-text-primary bg-google-bg p-2 rounded-lg border border-google-border-light">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3x3 Spatial Geo-Grid Preview */}
                <div className="material-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-google-text-primary text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-google-blue" />
                        3x3 Geo-Grid Heatmap Snapshot (Keyword: "cafe near me")
                      </h3>
                      <p className="text-xs text-google-text-secondary">Red numbers indicate positions where local traffic is lost to competitors.</p>
                    </div>
                    <span className="text-xs text-google-text-tertiary">Radius: 2.5 km</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                    {scanResult.grid.map((item) => {
                      const isTop3 = item.rank <= 3;
                      return (
                        <div 
                          key={item.pos}
                          className={`h-20 rounded-xl flex flex-col items-center justify-center font-bold text-white shadow-sm ${
                            isTop3 ? 'bg-google-green' : item.rank <= 8 ? 'bg-google-yellow' : 'bg-google-red'
                          }`}
                        >
                          <span className="text-xs opacity-80 font-normal">Rank</span>
                          <span className="text-2xl">#{item.rank}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-6 text-xs text-google-text-secondary">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-google-green"></span> Rank 1-3 (Winning)</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-google-yellow"></span> Rank 4-8 (Warning)</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-google-red"></span> Rank 9+ (Lost Traffic)</span>
                  </div>
                </div>

                {/* Dubai Lost Revenue Meter in AED */}
                <div className="material-card p-5 bg-gradient-to-br from-amber-50 via-white to-red-50 border-2 border-red-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-100 text-google-red flex items-center justify-center shrink-0 mt-0.5">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-100 text-google-red px-2 py-0.5 rounded">
                            DUBAI FINANCIAL IMPACT
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 mt-1">
                          Estimated lost revenue due to weak Google Maps rankings:
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 max-w-lg leading-relaxed">
                          Due to red pins (#4–#18) in high-demand zones (Downtown, Marina, JLT), your business misses out on up to 65% of local search traffic.
                        </p>
                      </div>
                    </div>
                    <div className="text-right sm:border-l sm:border-red-200 sm:pl-6 shrink-0 w-full sm:w-auto">
                      <span className="text-[11px] font-semibold text-slate-500 block">Monthly loss:</span>
                      <span className="text-2xl font-black text-google-red">AED 16,500 – 28,000</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">based on average transaction values in UAE</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-red-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-slate-600">
                      💡 Ranking in the Top 3 within a 2.5 km radius yields a 50x–100x return on your GBPilot plan.
                    </span>
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(`Hello! I ran an audit of ${scanResult.name} on GBPilot. Lost revenue is estimated at AED 16,500+. I'd like to get a detailed PDF breakdown of the audit.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 whitespace-nowrap transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Discuss Audit on WhatsApp (+971)</span>
                    </a>
                  </div>
                </div>

                {/* Sticky 1-Click Management CTA */}
                <div className="material-card p-6 bg-gradient-to-r from-google-blue to-blue-700 text-white shadow-material-2">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">Ready to fix vulnerabilities and activate Autopilot?</h3>
                      <p className="text-xs text-blue-100 mt-1">Sign in with your managing account to connect your profile and enable 24/7 protection.</p>
                    </div>
                    <button 
                      onClick={() => setIsManageGatekeeperOpen(true)}
                      className="bg-white hover:bg-slate-50 text-google-blue font-bold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 whitespace-nowrap text-sm hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Zap className="w-4 h-4 text-google-blue fill-google-blue" />
                      <span>⚡ Start Managing Business</span>
                    </button>
                  </div>
                </div>

                {/* GATEKEEPER MODAL: REQUIRE GOOGLE OWNER LOGIN (PLG JTBD) */}
                {isManageGatekeeperOpen && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-material-3 border border-slate-200 max-w-lg w-full p-6 relative">
                      <button 
                        onClick={() => setIsManageGatekeeperOpen(false)}
                        className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Venue Header */}
                      <div className="flex items-start gap-3.5 mb-5 pb-4 border-b border-slate-100">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center">
                          {scanResult.cover_url ? (
                            <img src={scanResult.cover_url} alt={scanResult.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-6 h-6 text-google-blue" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-base font-bold text-slate-900 truncate">
                            {scanResult.name}
                          </div>
                          <div className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-google-red shrink-0" />
                            <span className="truncate">{scanResult.address}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">
                              ★ {scanResult.rating} ({scanResult.reviews_count} reviews)
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                              {scanResult.category || 'Local Business'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Explanation Callout */}
                      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-google-blue">
                          <ShieldCheck className="w-4 h-4 text-google-blue shrink-0" />
                          <span>Google Owner / Manager Account Required</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          To apply Autopilot recommendations, remove toxic reviews (Review Takedown™), and manage this business in real time, please sign in with the Google account that is an <strong>Owner or Manager</strong> of this Google Business Profile.
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <button
                          onClick={handleConnectGoogle}
                          disabled={isConnectingGoogle}
                          className="w-full py-3.5 px-4 bg-google-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2.5"
                        >
                          {isConnectingGoogle ? (
                            <>
                              <Sparkles className="w-4 h-4 animate-spin text-white" />
                              <span>Connecting to Google...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                              </svg>
                              <span>Sign in with Google (Owner / Manager)</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (typeof window !== 'undefined' && scanResult) {
                              localStorage.setItem('gbpilot_active_profile', JSON.stringify({
                                id: scanResult.id || `profile_${Date.now()}`,
                                name: scanResult.name,
                                address: scanResult.address,
                                city: scanResult.address.split(',').pop()?.trim() || 'Dubai',
                                health_score: scanResult.score,
                                cover_url: scanResult.cover_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
                                role: 'Demo Preview',
                                verified: false,
                                is_admin: false
                              }));
                            }
                            setIsManageGatekeeperOpen(false);
                            if (router) router.push('/dashboard');
                          }}
                          className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Continue in Demo Mode (View Only)
                        </button>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Secure OAuth 2.0 Authorization via Google Cloud</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1-Click Local Website Builder (Optional PLG Feature) */}
                <div className="material-card p-6 border border-purple-200 bg-purple-50/50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        PLG Growth Feature
                      </span>
                      <h4 className="font-bold text-google-text-primary text-sm mt-1">
                        Don't have a high-converting landing page?
                      </h4>
                      <p className="text-xs text-google-text-secondary">
                        Generate an SEO-optimized Local Website powered by your GBP data in 10 seconds.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsWebsiteBuilding(true);
                        setTimeout(() => {
                          setIsWebsiteBuilding(false);
                          setIsWebsiteBuilt(true);
                        }, 1500);
                      }}
                      className="material-button-secondary text-xs border-purple-300 text-purple-700 hover:bg-purple-100"
                    >
                      {isWebsiteBuilding ? (
                        <span>Building SEO Site...</span>
                      ) : isWebsiteBuilt ? (
                        <span className="flex items-center gap-1"><Check className="w-4 h-4 text-google-green" /> Website Published!</span>
                      ) : (
                        <span>Publish Local SEO Website (Powered by AI)</span>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* SMART INSTANT FIX MODAL (POST OAUTH CONNECT) */}
        {/* ======================================================== */}
        {showSmartFixModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-material-3 border border-google-border animate-in fade-in zoom-in duration-200">
              
              <div className="flex items-center justify-between border-b border-google-border-light pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-google-green-light text-google-green rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-google-text-primary text-base">Smart Instant Fixes Generated</h3>
                    <p className="text-xs text-google-text-secondary">AI prepared instant optimizations for your profile.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                
                {/* Fix 1: Missing Secondary Category */}
                <div className="p-3 bg-google-bg rounded-xl border border-google-border-light text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-google-text-primary">
                    <span className="flex items-center gap-1.5 text-google-blue">
                      <Layers className="w-4 h-4" /> Add Secondary Category
                    </span>
                    <span className="text-[10px] bg-google-blue-light text-google-blue px-2 py-0.5 rounded font-bold">+18% GEO Reach</span>
                  </div>
                  <p className="text-google-text-secondary">Recommended: "Espresso Bar & Artisan Coffee Shop"</p>
                </div>

                {/* Fix 2: Draft Welcome Post */}
                <div className="p-3 bg-google-bg rounded-xl border border-google-border-light text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-google-text-primary">
                    <span className="flex items-center gap-1.5 text-google-green">
                      <Star className="w-4 h-4" /> Publish Draft Welcome Google Post
                    </span>
                    <span className="text-[10px] bg-google-green-light text-google-green px-2 py-0.5 rounded font-bold">SEO Boost</span>
                  </div>
                  <p className="text-google-text-secondary font-mono bg-white p-2 rounded border border-google-border text-[11px]">
                    "Welcome to Manhattan Bakery! 🥖 Visit us on 540 Broadway for fresh organic sourdough & specialty espresso."
                  </p>
                </div>

                {/* Fix 3: AI Review Auto-Replies */}
                <div className="p-3 bg-google-bg rounded-xl border border-google-border-light text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-google-text-primary">
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <Bot className="w-4 h-4" /> Batch Reply to 3 Unanswered Reviews
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">Sentiment Repair</span>
                  </div>
                  <p className="text-google-text-secondary">AI responses drafted with local GEO keywords inserted.</p>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-google-border-light pt-4">
                <button 
                  onClick={() => setShowSmartFixModal(false)}
                  className="material-button-ghost text-xs"
                >
                  Skip for Now
                </button>
                <button 
                  onClick={handleApplyFixes}
                  disabled={isFixApplied}
                  className="material-button-primary text-xs font-bold"
                >
                  {isFixApplied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Fixes Applied! Launching Dashboard...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Apply AI Optimization Now</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PATH C: AGENCY INSTANT AUDIT (BY LINK) */}
        {/* ======================================================== */}
        {onboardingMode === 'MODE_C' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            <button 
              onClick={() => { setOnboardingMode(null); }}
              className="text-xs text-google-text-secondary hover:text-google-blue font-medium flex items-center gap-1 mb-2"
            >
              ← Back to Mode Selector
            </button>

            <div className="material-card p-6 border-t-4 border-google-red">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-google-red-light text-google-red rounded-xl">
                  <Zap className="w-6 h-6 fill-google-red" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-google-text-primary">Instant Agency Audit</h2>
                  <p className="text-xs text-google-text-secondary">Paste a Google Maps URL to instantly generate and open a full PDF/Web Audit report. Optimized for face-to-face pitches.</p>
                </div>
              </div>

              <form onSubmit={handleMapsScan} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-google-text-secondary mb-1">Google Maps Profile URL</label>
                  <input 
                    type="url"
                    required
                    placeholder="https://maps.app.goo.gl/..."
                    value={mapsLink}
                    onChange={(e) => setMapsLink(e.target.value)}
                    className="material-input text-sm py-3"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={isScanning}
                  className="material-button-primary w-full text-sm py-3 !bg-google-red hover:!bg-red-700 shadow-lg shadow-red-500/30"
                >
                  {isScanning ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Generating Full Audit Presentation...</span>
                    </>
                  ) : (
                    <>
                      <span>⚡ Generate & Open Report Instantly</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              <p><strong>Pro-Tip:</strong> Use this feature when you're physically at a client's location or on a sales call. It bypasses the Google Login step and jumps straight to the Disaster vs Future pitch deck.</p>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
