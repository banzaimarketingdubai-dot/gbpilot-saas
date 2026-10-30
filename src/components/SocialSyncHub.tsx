'use client';

import React, { useState } from 'react';
import { 
  Share2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Instagram, 
  Video, 
  MapPin, 
  Zap, 
  Lock, 
  Layers, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { MOCK_SOCIAL_FEED, adaptSocialPostForGbp, BusinessContext, AdaptedPostResult } from '@/lib/social/repostEngine';

interface SocialSyncHubProps {
  venueName?: string;
  category?: string;
  city?: string;
  isPro?: boolean;
  planId?: string;
  onUpgradeClick?: () => void;
}

export function SocialSyncHub({
  venueName = 'Cafe Svoi',
  category = 'Coffee Shop & Bakery',
  city = 'Dubai',
  isPro = false,
  planId = 'FREE_SCOUT',
  onUpgradeClick
}: SocialSyncHubProps) {
  const isSocialAutopilotEnabled = planId === 'PRO_GROWTH' || planId === 'AGENCY' || planId === 'GROWTH_POSTING';

  const [activeTab, setActiveTab] = useState<'feed' | 'settings'>('feed');
  const [syncedPostIds, setSyncedPostIds] = useState<string[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const context: BusinessContext = {
    businessName: venueName,
    primaryCategory: category,
    city: city || 'Dubai',
    neighborhood: 'Downtown Dubai',
    websiteUrl: 'https://svoi.gbpilot.top',
    orderUrl: 'https://svoi.gbpilot.top#order',
    reservationUrl: 'https://svoi.gbpilot.top#book',
    phoneNumber: '+971 4 000 0000'
  };

  const adaptedFeed: AdaptedPostResult[] = MOCK_SOCIAL_FEED.map(post => 
    adaptSocialPostForGbp(post, context)
  );

  const handleSyncPost = (postId: string) => {
    if (!isSocialAutopilotEnabled) {
      if (onUpgradeClick) onUpgradeClick();
      return;
    }
    setSyncingId(postId);
    setTimeout(() => {
      setSyncedPostIds(prev => [...prev, postId]);
      setSyncingId(null);
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white rounded-xl shadow-xs">
              <Share2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Social Autopilot: Instagram &amp; TikTok ➔ Google Maps
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ⚡ 69 AED Flagship
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Automatically repurpose social reels &amp; posts into high-ranking Google Local Posts with direct CTA buttons.
              </p>
            </div>
          </div>
        </div>

        {/* Connected Channels Pill */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
            <Instagram className="w-3.5 h-3.5 text-pink-600" />
            <span>@cafe_svoi_dubai</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
            <Video className="w-3.5 h-3.5 text-slate-900" />
            <span>@svoi_uae</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </div>
        </div>
      </div>

      {/* Flagship Upsell Banner (Visible when on Free or 39 AED Starter) */}
      {!isSocialAutopilotEnabled && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 z-10 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full uppercase tracking-wider">
                Dead Google Card Warning
              </span>
              <span className="text-xs text-blue-200 font-semibold">
                6 Unsynced Social Posts Found
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              You post regularly on Instagram, but your Google Maps profile is stagnant.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Google Maps rewards profiles updated weekly with <strong className="text-white">+35% more Local 3-Pack visibility</strong>. Activate the <strong>69 AED Growth Autopilot</strong> to seamlessly syndicate all new content with zero manual work.
            </p>
          </div>

          <button
            type="button"
            onClick={onUpgradeClick}
            className="z-10 shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>Activate Social Autopilot (69 AED)</span>
          </button>
        </div>
      )}

      {/* Post Adaptation Feed Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Incoming Social Feed ➔ Google Maps Transformation
          </span>
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Refreshed 10 minutes ago</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {adaptedFeed.map((item, idx) => {
            const isSynced = syncedPostIds.includes(item.originalPost.id);
            const isCurrentlySyncing = syncingId === item.originalPost.id;

            return (
              <div 
                key={item.id} 
                className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Original Source Header */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/70">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    {item.originalPost.platform === 'INSTAGRAM' ? (
                      <span className="flex items-center gap-1 text-pink-600 font-extrabold">
                        <Instagram className="w-3.5 h-3.5" /> Instagram Reel
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-900 font-extrabold">
                        <Video className="w-3.5 h-3.5" /> TikTok Video
                      </span>
                    )}
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 text-[11px] font-normal">
                      {item.originalPost.likesCount} likes
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-google-blue border border-blue-200">
                    Gemini AI Formatted
                  </span>
                </div>

                {/* Content Split: Before / After Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                  {/* Media Thumbnail */}
                  <div className="sm:col-span-4 relative rounded-xl overflow-hidden aspect-square bg-slate-200 border border-slate-200 shadow-2xs">
                    <img 
                      src={item.originalPost.mediaUrl} 
                      alt="Social Post" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                      <span>HD Sync</span>
                    </div>
                  </div>

                  {/* Adapted Google Maps Payload */}
                  <div className="sm:col-span-8 space-y-2">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                      <MapPin className="w-3 h-3 text-google-blue" />
                      <span>Google Maps Local Post Preview:</span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium line-clamp-3 bg-white p-2.5 rounded-xl border border-slate-200/80 leading-relaxed shadow-2xs">
                      {item.gbpPost.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                      <span className="text-slate-400 font-semibold">CTA Button:</span>
                      <span className="px-2 py-0.5 rounded-md font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 fill-emerald-700 text-emerald-700" />
                        [{item.gbpPost.callToAction?.actionType || 'ORDER'}]
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Trigger Footer */}
                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hashtags stripped &amp; local keywords injected</span>
                  </div>

                  {isSynced ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Published to Maps</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isCurrentlySyncing}
                      onClick={() => handleSyncPost(item.originalPost.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSocialAutopilotEnabled
                          ? 'bg-google-blue hover:bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {isCurrentlySyncing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : isSocialAutopilotEnabled ? (
                        <>
                          <span>Push to Google Maps</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>Unlock Autopilot (69 AED)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
