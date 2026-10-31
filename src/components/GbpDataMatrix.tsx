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
  venueName = '—',
  category = '—',
  address = '—',
  phone = '',
  website = '',
  rating = 0,
  reviewsCount = 0,
  isPro = false,
  live = null,
  onUpgradeClick
}: GbpDataMatrixProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const baseParameters: DataParameterItem[] = useMemo(() => {
    const cleanCat = category && category.toLowerCase() !== 'local business' ? category : '—';
    return [
      // 1. Identity & Shield
      {
        id: 'gov-status',
        categoryGroup: 'Identity & Shield',
        paramName: 'Business Status & Operational Flag',
        apiField: 'openInfo.status',
        currentValue: '—',
        platformAction: 'Monitors operational status via Google Business Profile API.',
        status: 'ACTION_NEEDED',
        isProOnly: false
      },
      {
        id: 'gov-pending-edits',
        categoryGroup: 'Identity & Shield',
        paramName: 'Pending Google Community Edits',
        apiField: 'metadata.hasPendingEdits',
        currentValue: '—',
        platformAction: 'Detects unauthorized external edits and third-party suggestions.',
        status: 'ACTION_NEEDED',
        isProOnly: false
      },
      {
        id: 'gov-vom',
        categoryGroup: 'Identity & Shield',
        paramName: 'Voice of Merchant Verification Authority',
        apiField: 'metadata.hasVoiceOfMerchant',
        currentValue: '—',
        platformAction: 'Verifies owner authority and Google business verification badge.',
        status: 'ACTION_NEEDED',
        isProOnly: false
      },
      {
        id: 'gov-review-link',
        categoryGroup: 'Identity & Shield',
        paramName: 'Direct Review Generation URI',
        apiField: 'metadata.newReviewUri',
        currentValue: '—',
        platformAction: 'Generates direct Google review links and QR codes for customers.',
        status: 'ACTION_NEEDED',
        isProOnly: false
      },

      // 2. NAP & Contact
      {
        id: 'nap-name',
        categoryGroup: 'NAP & Contact',
        paramName: 'Official Business Title',
        apiField: 'title',
        currentValue: venueName || '—',
        platformAction: 'Monitors official business brand name and keyword consistency.',
        status: venueName && venueName !== '—' ? 'OPTIMIZED' : 'ACTION_NEEDED',
        isProOnly: false
      },
      {
        id: 'nap-address',
        categoryGroup: 'NAP & Contact',
        paramName: 'Storefront Address & Geocoordinates',
        apiField: 'storefrontAddress & latlng',
        currentValue: address || '—',
        platformAction: 'Guards physical storefront address and map pin coordinates.',
        status: address && address !== '—' ? 'OPTIMIZED' : 'ACTION_NEEDED',
        isProOnly: false
      },
      {
        id: 'nap-phone',
        categoryGroup: 'NAP & Contact',
        paramName: 'Primary Phone Number',
        apiField: 'phoneNumbers.primaryPhone',
        currentValue: phone || '—',
        platformAction: 'Monitors primary phone number and click-to-call routing.',
        status: phone ? 'OPTIMIZED' : 'ACTION_NEEDED',
        isProOnly: false
      },
      {
        id: 'nap-website',
        categoryGroup: 'NAP & Contact',
        paramName: 'Website URI',
        apiField: 'websiteUri',
        currentValue: website || '—',
        platformAction: 'Monitors website URL and tracking UTM parameters.',
        status: website ? 'OPTIMIZED' : 'ACTION_NEEDED',
        isProOnly: false
      },
      {
        id: 'nap-description',
        categoryGroup: 'NAP & Contact',
        paramName: 'Profile Description',
        apiField: 'profile.description',
        currentValue: '—',
        platformAction: 'Optimizes business profile description (up to 750 characters).',
        status: 'ACTION_NEEDED',
        isProOnly: false
      },

      // 3. SEO & Categories
      {
        id: 'cat-primary',
        categoryGroup: 'SEO & Categories',
        paramName: 'Primary Google Category',
        apiField: 'categories.primaryCategory',
        currentValue: cleanCat,
        platformAction: 'Guards primary Google category for local search visibility.',
        status: cleanCat !== '—' ? 'OPTIMIZED' : 'ACTION_NEEDED',
        isProOnly: false
      },
      {
        id: 'cat-secondary',
        categoryGroup: 'SEO & Categories',
        paramName: 'Additional Categories',
        apiField: 'categories.additionalCategories',
        currentValue: '—',
        platformAction: 'Enriches profile with secondary categories to outrank competitors.',
        status: 'ACTION_NEEDED',
        isProOnly: false
      },

      // 4. Hours & Shifts
      {
        id: 'hrs-regular',
        categoryGroup: 'Hours & Shifts',
        paramName: 'Standard Operating Hours',
        apiField: 'regularHours.periods',
        currentValue: '—',
        platformAction: 'Synchronizes daily business opening hours and break intervals.',
        status: 'ACTION_NEEDED',
        isProOnly: false
      },
      {
        id: 'hrs-special',
        categoryGroup: 'Hours & Shifts',
        paramName: 'Special & Holiday Hours',
        apiField: 'specialHours.specialHourPeriods',
        currentValue: '—',
        platformAction: 'Configures holiday schedules to eliminate Google warning badges.',
        status: 'ACTION_NEEDED',
        isProOnly: false
      },

      // 5. 150+ Attributes
      {
        id: 'attr-amenities',
        categoryGroup: '150+ Attributes',
        paramName: 'Configured Profile Attributes',
        apiField: 'attributes',
        currentValue: '—',
        platformAction: 'Enriches all 150+ Google profile attributes and features.',
        status: 'ACTION_NEEDED',
        isProOnly: false
      },

      // 6. Reviews & AI
      {
        id: 'rev-velocity',
        categoryGroup: 'Reviews & AI',
        paramName: 'Rating & Reviews Count',
        apiField: 'reviews.starRating & reviews.count',
        currentValue: rating > 0 ? `${rating.toFixed(1)} ★ (${reviewsCount} reviews)` : '—',
        platformAction: 'Synchronizes live Google star rating and customer review counts.',
        status: rating > 0 ? 'OPTIMIZED' : 'ACTION_NEEDED',
        isProOnly: false
      },

      // 7. Posts & Promos
      {
        id: 'post-cadence',
        categoryGroup: 'Posts & Promos',
        paramName: 'Published Local Posts',
        apiField: 'localPosts',
        currentValue: '—',
        platformAction: 'Publishes local updates, offers, and events directly to Google Maps.',
        status: 'ACTION_NEEDED',
        isProOnly: false
      },

      // 8. Menu & Catalog
      {
        id: 'menu-catalog',
        categoryGroup: 'Menu & Catalog',
        paramName: 'Service Items & Catalog',
        apiField: 'serviceItems',
        currentValue: '—',
        platformAction: 'Synchronizes structured service catalog and food & drink menus.',
        status: 'ACTION_NEEDED',
        isProOnly: false
      },

      // 9. Search Insights
      {
        id: 'ins-keywords',
        categoryGroup: 'Search Insights',
        paramName: 'Monthly Search Keywords (GBP Performance API)',
        apiField: 'searchkeywords.impressions.monthly',
        currentValue: '—',
        platformAction: 'Monitors organic discovery queries from GBP Performance API.',
        status: 'ACTION_NEEDED',
        isProOnly: false
      },
      {
        id: 'ins-traffic',
        categoryGroup: 'Search Insights',
        paramName: '30-Day Interactions (Calls, Website, Directions)',
        apiField: 'fetchMultiDailyMetricsTimeSeries',
        currentValue: '—',
        platformAction: 'Tracks 30-day customer actions: phone calls, directions, website visits.',
        status: 'ACTION_NEEDED',
        isProOnly: false
      }
    ];
  }, [venueName, category, address, phone, website, rating, reviewsCount]);

  // Override template rows with REAL Google values whenever the live sync provided them.
  const parameters: DataParameterItem[] = useMemo(() => {
    const f = live?.fields;
    if (!f) return baseParameters;
    const ok = (s: boolean): DataParameterItem['status'] => (s ? 'OPTIMIZED' : 'ACTION_NEEDED');
    const over: Record<string, Partial<DataParameterItem>> = {};
    if (f.title) over['nap-name'] = { currentValue: String(f.title), status: 'OPTIMIZED' };
    if (f.address) over['nap-address'] = { currentValue: String(f.address), status: 'OPTIMIZED' };
    if (f.phone) over['nap-phone'] = { currentValue: String(f.phone), status: 'OPTIMIZED' };
    if (f.website) over['nap-website'] = { currentValue: String(f.website), status: 'OPTIMIZED' };
    if (f.primary_category) over['cat-primary'] = { currentValue: String(f.primary_category), status: 'OPTIMIZED' };
    if (f.open_status) over['gov-status'] = { currentValue: String(f.open_status), status: ok(f.open_status === 'OPEN') };
    if (f.has_pending_edits !== undefined) over['gov-pending-edits'] = {
      currentValue: f.has_pending_edits ? 'External edits pending' : '0 pending edits',
      status: ok(!f.has_pending_edits),
    };
    if (f.has_voice_of_merchant !== undefined) over['gov-vom'] = {
      currentValue: f.has_voice_of_merchant ? 'Verified (Voice of Merchant)' : 'Not Verified',
      status: ok(!!f.has_voice_of_merchant),
    };
    if (f.new_review_uri !== undefined) over['gov-review-link'] = {
      currentValue: f.new_review_uri ? String(f.new_review_uri) : '—',
      status: ok(!!f.new_review_uri),
    };
    if (f.description !== undefined) over['nap-description'] = {
      currentValue: f.description ? `${f.description.length}/750 chars` : '— (Empty)',
      status: ok(!!f.description),
    };
    if (f.additional_categories !== undefined) over['cat-secondary'] = {
      currentValue: f.additional_categories?.length ? f.additional_categories.join(', ') : '— (Not set)',
      status: ok(Boolean(f.additional_categories?.length)),
    };
    if (f.regular_hours !== undefined) over['hrs-regular'] = {
      currentValue: f.regular_hours?.length ? `${f.regular_hours.length} days set` : '— (Not set)',
      status: ok(Boolean(f.regular_hours?.length)),
    };
    if (f.special_hours_count !== undefined) over['hrs-special'] = {
      currentValue: f.special_hours_count ? `${f.special_hours_count} holiday dates` : '—',
      status: ok(f.special_hours_count > 0),
    };
    if (f.attributes_count !== undefined) over['attr-amenities'] = {
      currentValue: f.attributes_count > 0 ? `${f.attributes_count} attributes` : '— (0 attributes)',
      status: ok(f.attributes_count > 0),
    };
    if (f.reviews_total !== undefined || f.rating !== undefined) over['rev-velocity'] = {
      currentValue: f.rating ? `${f.rating} ★ (${f.reviews_total ?? 0} reviews, unreplied: ${f.reviews_unreplied ?? 0})` : '—',
      status: ok(Boolean(f.rating)),
    };
    if (f.posts_count !== undefined) over['post-cadence'] = {
      currentValue: f.posts_count > 0 ? `${f.posts_count} posts` : '— (0 posts)',
      status: ok(f.posts_count > 0),
    };
    if (f.service_items_count !== undefined) over['menu-catalog'] = {
      currentValue: f.service_items_count > 0 ? `${f.service_items_count} items` : '— (0 items)',
      status: ok(f.service_items_count > 0),
    };
    if (f.top_search_keywords !== undefined) over['ins-keywords'] = {
      currentValue: f.top_search_keywords?.length
        ? f.top_search_keywords.slice(0, 5).map((k: any) => `${k.keyword} (${k.impressions})`).join(', ')
        : '—',
      status: ok(Boolean(f.top_search_keywords?.length)),
    };
    if (f.impressions_30d !== undefined) over['ins-traffic'] = {
      currentValue: `${f.impressions_30d} views • ${f.performance_30d?.CALL_CLICKS ?? 0} calls • ${f.performance_30d?.WEBSITE_CLICKS ?? 0} clicks (30d)`,
      status: ok(f.impressions_30d > 0),
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
                            <span>Unlock Pro (69 AED)</span>
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
                  Upgrade to GBPilot Pro (69 AED/mo) to unblur secret search queries, enable 24/7 Competitor Sentinel Rollback, and activate AI review auto-replies.
                </p>
              </div>

              <button
                onClick={onUpgradeClick}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <span>Upgrade to Pro (69 AED/mo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
