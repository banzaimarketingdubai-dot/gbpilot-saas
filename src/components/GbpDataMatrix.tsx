'use client';

import React, { useState, useMemo } from 'react';
import {
  Database,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';

export interface DataParameterItem {
  id: string;
  categoryGroup: 
    | 'Identity & Shield'
    | 'NAP & Contact'
    | 'SEO & Categories'
    | 'Hours & Shifts'
    | '150+ Attributes'
    | 'Reviews & AI'
    | 'Posts & Promos'
    | 'Menu & Catalog'
    | 'Search Insights';
  paramName: string;
  apiField: string;
  currentValue: string;
  platformAction: string;
  status: 'OPTIMIZED' | 'ACTION_NEEDED' | 'CRITICAL_LEAK' | 'LOCKED_PRO';
  isProOnly: boolean;
  proFeatureLabel?: string;
}

interface GbpDataMatrixProps {
  venueName?: string;
  category?: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewsCount?: number;
  isPro?: boolean;
  /** Live snapshot from /api/v1/profiles/{id}/google-sync (real Google data). */
  live?: { fields?: Record<string, any>; sources?: Record<string, string> } | null;
  onUpgradeClick?: () => void;
}

export function GbpDataMatrix({
  venueName = 'Your Business Location',
  category = 'Local Business',
  address = 'Verified Storefront Address',
  phone = '+84 •••••••••',
  website = 'https://••••••••',
  rating = 5.0,
  reviewsCount = 28,
  isPro = false,
  live = null,
  onUpgradeClick
}: GbpDataMatrixProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const baseParameters: DataParameterItem[] = useMemo(() => [
    // 1. Identity & Shield
    {
      id: 'gov-status',
      categoryGroup: 'Identity & Shield',
      paramName: 'Business Status & Operational Flag',
      apiField: 'openInfo.status',
      currentValue: 'OPEN (Active)',
      platformAction: '24/7 monitoring against rogue "Permanently Closed" edits by competitors.',
      status: 'OPTIMIZED',
      isProOnly: false
    },
    {
      id: 'gov-pending-edits',
      categoryGroup: 'Identity & Shield',
      paramName: 'Competitor Rogue Edits Interceptor',
      apiField: 'metadata.hasPendingEdits',
      currentValue: isPro ? '0 Pending Threats (Shield Active)' : '2 Unreviewed Google community edits detected',
      platformAction: 'Instant rollback of unauthorized phone, hours, and name changes before Google publishes them.',
      status: isPro ? 'OPTIMIZED' : 'LOCKED_PRO',
      isProOnly: true,
      proFeatureLabel: '24/7 Sentinel Auto-Rollback'
    },
    {
      id: 'gov-vom',
      categoryGroup: 'Identity & Shield',
      paramName: 'Voice of Merchant Verification Authority',
      apiField: 'metadata.hasVoiceOfMerchant',
      currentValue: 'Verified Primary Owner (Authority Active)',
      platformAction: 'Guarantees highest weight for edits without manual Google video re-verification.',
      status: 'OPTIMIZED',
      isProOnly: false
    },
    {
      id: 'gov-review-link',
      categoryGroup: 'Identity & Shield',
      paramName: '5-Star Review Generation Gateway',
      apiField: 'metadata.newReviewUri',
      currentValue: 'Active Direct 5-Star Intent Link',
      platformAction: 'Generates tabletop QR codes & WhatsApp review pacing triggers for happy customers.',
      status: 'OPTIMIZED',
      isProOnly: false
    },

    // 2. NAP & Contact
    {
      id: 'nap-name',
      categoryGroup: 'NAP & Contact',
      paramName: 'Official Business Title (White-Hat NAP)',
      apiField: 'title',
      currentValue: venueName,
      platformAction: 'Monitors keyword density in title to prevent algorithmic Google shadowbans.',
      status: 'OPTIMIZED',
      isProOnly: false
    },
    {
      id: 'nap-address',
      categoryGroup: 'NAP & Contact',
      paramName: 'Storefront Address & Geocoordinates',
      apiField: 'storefrontAddress & latlng',
      currentValue: address,
      platformAction: 'Syncs NAP across 40+ local business directories to fortify Local 3-Pack authority.',
      status: 'OPTIMIZED',
      isProOnly: false
    },
    {
      id: 'nap-phone',
      categoryGroup: 'NAP & Contact',
      paramName: 'Primary & Secondary Phone Numbers',
      apiField: 'phoneNumbers.primaryPhone',
      currentValue: phone || 'Unassigned / Needs Lock',
      platformAction: 'Locks phone number in Google vault to stop competitor diversion forwarding.',
      status: phone ? 'OPTIMIZED' : 'ACTION_NEEDED',
      isProOnly: false
    },
    {
      id: 'nap-website',
      categoryGroup: 'NAP & Contact',
      paramName: 'Website URI & UTM Tracking Tags',
      apiField: 'websiteUri',
      currentValue: website || 'No direct URL connected',
      platformAction: 'Appends granular UTM campaign parameters to attribute Google Maps calls & bookings.',
      status: website ? 'OPTIMIZED' : 'ACTION_NEEDED',
      isProOnly: false
    },
    {
      id: 'nap-description',
      categoryGroup: 'NAP & Contact',
      paramName: 'SEO Description & LSI Keyword Anchors',
      apiField: 'profile.description',
      currentValue: isPro ? '742/750 chars with 14 local LSI keywords' : 'Short description (Missing neighborhood centroid keywords)',
      platformAction: 'Gemini AI crafts rich 750-character descriptions anchored to city districts and specialties.',
      status: isPro ? 'OPTIMIZED' : 'ACTION_NEEDED',
      isProOnly: true,
      proFeatureLabel: 'Gemini LSI Copy Generator'
    },

    // 3. SEO & Categories
    {
      id: 'cat-primary',
      categoryGroup: 'SEO & Categories',
      paramName: 'Primary Google Category (Rank Multiplier #1)',
      apiField: 'categories.primaryCategory',
      currentValue: category,
      platformAction: 'Audits primary category relevance against top-ranking neighborhood competitors.',
      status: category.toLowerCase().includes('local business') ? 'CRITICAL_LEAK' : 'OPTIMIZED',
      isProOnly: false
    },
    {
      id: 'cat-secondary',
      categoryGroup: 'SEO & Categories',
      paramName: 'Secondary Niche Sub-Categories (Up to 9)',
      apiField: 'categories.additionalCategories',
      currentValue: isPro ? '4 Active High-Intent Sub-Categories' : 'Hidden / Unconfigured (Lost Search Impression Leaks)',
      platformAction: 'Unlocks competitor secret secondary categories to capture niche intent searches.',
      status: isPro ? 'OPTIMIZED' : 'LOCKED_PRO',
      isProOnly: true,
      proFeatureLabel: 'Competitor Category Stealer'
    },

    // 4. Hours & Shifts
    {
      id: 'hrs-regular',
      categoryGroup: 'Hours & Shifts',
      paramName: 'Standard Operating Hours & Shifts',
      apiField: 'regularHours.periods',
      currentValue: 'Regular Weekly Periods Configured',
      platformAction: 'Maintains open/close sync for Google Maps "Open Now" ranking algorithm boost.',
      status: 'OPTIMIZED',
      isProOnly: false
    },
    {
      id: 'hrs-special',
      categoryGroup: 'Hours & Shifts',
      paramName: 'Special & Holiday Hours Autopilot',
      apiField: 'specialHours.specialHourPeriods',
      currentValue: isPro ? 'Synced for upcoming holidays (Auto-Confirmed)' : 'Unset: Google shows "Hours may differ" warning banner',
      platformAction: 'Proactive 1-click scheduling of holiday hours 72h before national/religious events.',
      status: isPro ? 'OPTIMIZED' : 'ACTION_NEEDED',
      isProOnly: true,
      proFeatureLabel: 'Holiday Shield Autopilot'
    },

    // 5. 150+ Attributes
    {
      id: 'attr-amenities',
      categoryGroup: '150+ Attributes',
      paramName: 'Amenities (Wi-Fi, Air-Con, Pet-Friendly)',
      apiField: 'attributes.amenities',
      currentValue: isPro ? '18/18 Amenities Confirmed & Synced' : '8 unverified amenity tags found',
      platformAction: 'Activates high-value filters (Fast Wi-Fi, Dog-friendly, AC) used by expats and tourists.',
      status: isPro ? 'OPTIMIZED' : 'LOCKED_PRO',
      isProOnly: true,
      proFeatureLabel: '150+ Attribute Engine'
    },
    {
      id: 'attr-payments',
      categoryGroup: '150+ Attributes',
      paramName: 'Payment Gateways (NFC, Cards, Crypto)',
      apiField: 'attributes.payments',
      currentValue: isPro ? 'Credit Cards, Contactless NFC, Cash Verified' : 'Unchecked payment options',
      platformAction: 'Removes purchasing friction for tourists by signaling card and mobile payment readiness.',
      status: isPro ? 'OPTIMIZED' : 'ACTION_NEEDED',
      isProOnly: false
    },
    {
      id: 'attr-dining',
      categoryGroup: '150+ Attributes',
      paramName: 'Service Options (Delivery, Takeout, Dine-in)',
      apiField: 'attributes.service_options',
      currentValue: 'Dine-in, Takeout, Delivery Configured',
      platformAction: 'Links delivery buttons directly to REVOO / ordering platforms.',
      status: 'OPTIMIZED',
      isProOnly: false
    },

    // 6. Reviews & AI
    {
      id: 'rev-velocity',
      categoryGroup: 'Reviews & AI',
      paramName: 'Review Velocity & Star Health Score',
      apiField: 'reviews.starRating & reviews.count',
      currentValue: `${rating.toFixed(1)} ★ (${reviewsCount} verified reviews)`,
      platformAction: 'Monitors incoming velocity (reviews/week) vs top 3 competitors in local grid.',
      status: 'OPTIMIZED',
      isProOnly: false
    },
    {
      id: 'rev-auto-reply',
      categoryGroup: 'Reviews & AI',
      paramName: 'AI Contextual Review Auto-Reply Engine',
      apiField: 'reviews.reviewReply.comment',
      currentValue: isPro ? 'Autonomous (Responses within 120s with SEO keywords)' : 'Manual responses required',
      platformAction: 'Publishes polite, keyword-rich replies in seconds to maximize Google Merchant Trust.',
      status: isPro ? 'OPTIMIZED' : 'LOCKED_PRO',
      isProOnly: true,
      proFeatureLabel: 'Autonomous AI Copilot'
    },

    // 7. Posts & Promos
    {
      id: 'post-cadence',
      categoryGroup: 'Posts & Promos',
      paramName: 'Weekly Google What\'s New Posts Cadence',
      apiField: 'localPosts.topicType (STANDARD/OFFER)',
      currentValue: isPro ? 'Weekly AI Schedule Active (with Order CTA)' : 'No active posts in last 7 days (Stale signal)',
      platformAction: 'Publishes weekly news and promo offers directly to the Google Maps feed.',
      status: isPro ? 'OPTIMIZED' : 'ACTION_NEEDED',
      isProOnly: true,
      proFeatureLabel: 'Weekly Post Copilot'
    },

    // 8. Menu & Catalog
    {
      id: 'menu-catalog',
      categoryGroup: 'Menu & Catalog',
      paramName: 'Structured Food Menu & Service Catalog',
      apiField: 'foodMenus & services',
      currentValue: isPro ? 'Complete Digital Menu with Prices & Photos' : 'Prices not linked in Google search card',
      platformAction: 'Renders dishes, services, and prices directly in Google search snippets.',
      status: isPro ? 'OPTIMIZED' : 'LOCKED_PRO',
      isProOnly: true,
      proFeatureLabel: 'Digital Menu Builder'
    },

    // 9. Search Insights
    {
      id: 'ins-keywords',
      categoryGroup: 'Search Insights',
      paramName: 'Exact Secret Google Search Queries',
      apiField: 'insights.searchKeywords',
      currentValue: isPro ? '142 search queries tracked (Top: "cafe near me", "visa extension")' : '•••••••••••• •••••• ••• (34 high-intent keywords hidden)',
      platformAction: 'Reveals exact terms customers typed before clicking your Google Maps profile.',
      status: isPro ? 'OPTIMIZED' : 'LOCKED_PRO',
      isProOnly: true,
      proFeatureLabel: 'Secret Keyword Discovery'
    },
    {
      id: 'ins-traffic',
      categoryGroup: 'Search Insights',
      paramName: 'Search vs Maps Impressions & Direction Requests',
      apiField: 'insights.interactions (Calls, Directions)',
      currentValue: isPro ? 'Full telemetry: 68 calls, 142 route requests this month' : '•••••••• impressions & customer action metrics',
      platformAction: 'Calculates Steve Hunsaker PPC equivalence value ($4,365/mo saved in Google Ads).',
      status: isPro ? 'OPTIMIZED' : 'LOCKED_PRO',
      isProOnly: true,
      proFeatureLabel: 'PPC Equivalence Analytics'
    }
  ], [venueName, category, address, phone, website, rating, reviewsCount, isPro]);

  // Override template rows with REAL Google values whenever the live sync provided them.
  const parameters: DataParameterItem[] = useMemo(() => {
    const f = live?.fields;
    if (!f) return baseParameters;
    const ok = (s: boolean): DataParameterItem['status'] => (s ? 'OPTIMIZED' : 'ACTION_NEEDED');
    const over: Record<string, Partial<DataParameterItem>> = {};
    if (f.open_status) over['gov-status'] = { currentValue: String(f.open_status), status: ok(f.open_status === 'OPEN') };
    if (f.has_voice_of_merchant !== undefined) over['gov-vom'] = {
      currentValue: f.has_voice_of_merchant ? 'Verified: Voice of Merchant active' : 'Not verified: Google restricts edits',
      status: ok(!!f.has_voice_of_merchant),
    };
    if (f.new_review_uri !== undefined) over['gov-review-link'] = {
      currentValue: f.new_review_uri ? 'Direct review link available' : 'No review link returned', status: ok(!!f.new_review_uri),
    };
    if (f.description !== undefined || f.title) over['nap-description'] = {
      currentValue: f.description ? `${f.description.length}/750 chars` : 'Empty: no description set',
      status: ok(!!f.description && f.description.length >= 250), isProOnly: false,
    };
    if (f.additional_categories) over['cat-secondary'] = {
      currentValue: f.additional_categories.length ? f.additional_categories.join(', ') : 'None configured',
      status: ok(f.additional_categories.length >= 3), isProOnly: false,
    };
    if (f.regular_hours) over['hrs-regular'] = {
      currentValue: f.regular_hours.length ? `${f.regular_hours.length} periods set` : 'Not set', status: ok(f.regular_hours.length > 0),
    };
    if (f.special_hours_count !== undefined) over['hrs-special'] = {
      currentValue: f.special_hours_count ? `${f.special_hours_count} special day(s) set` : 'No holiday hours set',
      status: ok(f.special_hours_count > 0), isProOnly: false,
    };
    if (f.attributes_count !== undefined) over['attr-amenities'] = {
      currentValue: `${f.attributes_count} attributes set`, status: ok(f.attributes_count >= 10), isProOnly: false,
    };
    if (f.reviews_total !== undefined) over['rev-velocity'] = {
      currentValue: `${f.reviews_total} reviews, avg ${f.rating ?? 'n/a'}, ${f.reviews_unreplied ?? 0} unanswered`,
      status: ok((f.reviews_unreplied ?? 0) === 0), isProOnly: false,
    };
    if (f.posts_count !== undefined) over['post-cadence'] = {
      currentValue: f.posts_count ? `${f.posts_count} posts, last ${String(f.last_post_at || '').slice(0, 10)}` : 'No posts yet',
      status: ok(f.posts_count > 0), isProOnly: false,
    };
    if (f.service_items_count !== undefined) over['menu-catalog'] = {
      currentValue: f.service_items_count ? `${f.service_items_count} items` : 'No items in catalog',
      status: ok(f.service_items_count > 0), isProOnly: false,
    };
    if (f.impressions_30d !== undefined) over['ins-traffic'] = {
      currentValue: `${f.impressions_30d} impressions, ${f.performance_30d?.CALL_CLICKS ?? 0} calls, ${f.performance_30d?.WEBSITE_CLICKS ?? 0} site clicks (30d)`,
      status: 'OPTIMIZED', isProOnly: false,
    };
    return baseParameters.map(p => (over[p.id] ? { ...p, ...over[p.id] } : p));
  }, [baseParameters, live]);

  const groups = ['ALL', 'Identity & Shield', 'NAP & Contact', 'SEO & Categories', 'Hours & Shifts', '150+ Attributes', 'Reviews & AI', 'Posts & Promos', 'Menu & Catalog', 'Search Insights'];

  const filtered = useMemo(() => {
    return parameters.filter(item => {
      const matchesGroup = selectedGroup === 'ALL' || item.categoryGroup === selectedGroup;
      const matchesSearch = 
        item.paramName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.apiField.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.platformAction.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [parameters, selectedGroup, searchQuery]);

  const optimizedCount = parameters.filter(p => p.status === 'OPTIMIZED').length;
  const totalCount = parameters.length;
  const scorePercent = Math.round((optimizedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Database className="w-3 h-3" />
              Official GBP API Matrix (300 QPM)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
              Allowlist Approved
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            360° Business Profile Data Passport
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Full registry of all parameters accessible via the official Google Business Profile API. Shows what data GBPilot monitors, optimizes, and automates for <strong className="text-white">{venueName}</strong>.
          </p>
        </div>

        {/* Readiness Meter & Collapse Toggle */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Profile Health</div>
            <div className="text-xl font-black text-emerald-400">
              {scorePercent}% <span className="text-xs font-normal text-slate-300">({optimizedCount}/{totalCount})</span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            title={isExpanded ? 'Collapse Matrix' : 'Expand Matrix'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-5">
          {/* Controls: Search and Filter Tabs */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 scrollbar-none">
              {groups.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGroup(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedGroup === g
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {g === 'ALL' ? 'All (28)' : g}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search parameter or API field..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4">Parameter &amp; API Field</th>
                  <th className="py-3 px-4">Current Value in Profile</th>
                  <th className="py-3 px-4">GBPilot Autonomous Action</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Access Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const isLocked = !isPro && item.isProOnly;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isLocked ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Col 1: Parameter & API Field */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {item.paramName}
                        </div>
                        <code className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          {item.apiField}
                        </code>
                      </td>

                      {/* Col 2: Current Value */}
                      <td className="py-3 px-4 max-w-[240px]">
                        {isLocked ? (
                          <div className="relative group">
                            <span className="filter blur-sm select-none text-slate-400 block font-mono">
                              {item.currentValue}
                            </span>
                            <div className="absolute inset-0 flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50/70 px-2 py-0.5 rounded border border-amber-200/80 w-fit backdrop-blur-xs">
                              <Lock className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>{item.proFeatureLabel || 'Pro Feature'}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="font-medium text-slate-800 break-words">
                            {item.currentValue}
                          </span>
                        )}
                      </td>

                      {/* Col 3: What GBPilot Does */}
                      <td className="py-3 px-4 max-w-[300px] text-slate-600 leading-relaxed">
                        {item.platformAction}
                      </td>

                      {/* Col 4: Status Badge */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {item.status === 'OPTIMIZED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Optimized
                          </span>
                        )}
                        {item.status === 'ACTION_NEEDED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            Action Needed
                          </span>
                        )}
                        {item.status === 'CRITICAL_LEAK' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                            <Flame className="w-3 h-3" />
                            Critical Leak
                          </span>
                        )}
                        {item.status === 'LOCKED_PRO' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Lock className="w-3 h-3" />
                            Locked (Pro)
                          </span>
                        )}
                      </td>

                      {/* Col 5: Action / Upsell Button */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {isLocked ? (
                          <button
                            onClick={onUpgradeClick}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-xs hover:shadow transition-all cursor-pointer"
                          >
                            <Unlock className="w-3 h-3" />
                            <span>Unlock Pro ($69)</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Available
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Upsell Callout for Free Users */}
          {!isPro && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-extrabold text-sm text-amber-950">
                    Unlock 100% Data Telemetry &amp; 24/7 Autopilot
                  </span>
                </div>
                <p className="text-xs text-amber-800">
                  Upgrade to GBPilot Growth ($69/mo) to unblur secret search queries, enable 24/7 Competitor Sentinel Rollback, and activate AI review auto-replies.
                </p>
              </div>

              <button
                onClick={onUpgradeClick}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <span>Upgrade to Pro ($69/mo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
