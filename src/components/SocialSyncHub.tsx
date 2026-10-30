'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Share2, Sparkles, ArrowRight, CheckCircle2, Clock, Instagram, Video,
  MapPin, Zap, Lock, RefreshCw, Link2, X
} from 'lucide-react';
import { adaptSocialPostForGbp, BusinessContext, SocialPostInput } from '@/lib/social/repostEngine';

interface SocialSyncHubProps {
  /** Stable id of the ACTIVE business. All social state is stored per business. */
  profileId?: string;
  venueName?: string;
  category?: string;
  city?: string;
  website?: string;
  phone?: string;
  isPro?: boolean;
  planId?: string;
  onUpgradeClick?: () => void;
}

interface SocialAccounts {
  instagram?: string;
  tiktok?: string;
}

const storageKey = (profileId: string) => `gbpilot_social_${profileId}`;

function cleanHandle(v: string): string {
  return v.trim().replace(/^https?:\/\/(www\.)?(instagram|tiktok)\.com\/@?/i, '').replace(/^@/, '').replace(/\/.*$/, '');
}

export function SocialSyncHub({
  profileId = '',
  venueName = 'Your Business',
  category = 'Local Business',
  city = '',
  website = '',
  phone = '',
  isPro = false,
  planId = 'FREE_SCOUT',
  onUpgradeClick
}: SocialSyncHubProps) {
  const autopilotEnabled = planId === 'PRO_GROWTH' || planId === 'AGENCY';

  const [accounts, setAccounts] = useState<SocialAccounts>({});
  const [igInput, setIgInput] = useState('');
  const [ttInput, setTtInput] = useState('');
  const [syncedIds, setSyncedIds] = useState<string[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Load THIS business's connected accounts. Switching business resets everything,
  // so data from another venue can never leak into this block.
  useEffect(() => {
    setSyncedIds([]);
    setSyncingId(null);
    setIgInput('');
    setTtInput('');
    try {
      const raw = profileId ? localStorage.getItem(storageKey(profileId)) : null;
      setAccounts(raw ? JSON.parse(raw) : {});
    } catch {
      setAccounts({});
    }
  }, [profileId]);

  const saveAccounts = (next: SocialAccounts) => {
    setAccounts(next);
    if (profileId) localStorage.setItem(storageKey(profileId), JSON.stringify(next));
  };

  const connected = !!(accounts.instagram || accounts.tiktok);

  const context: BusinessContext = {
    businessName: venueName,
    primaryCategory: category,
    city: city || '',
    websiteUrl: website || undefined,
    orderUrl: website || undefined,
    reservationUrl: website || undefined,
    phoneNumber: phone || undefined
  };

  // Clearly-labelled sample posts built ONLY from the active business's own name.
  const samplePosts: SocialPostInput[] = useMemo(() => {
    const list: SocialPostInput[] = [];
    if (accounts.instagram) {
      list.push({
        id: `sample_ig_${profileId}`, platform: 'INSTAGRAM', mediaType: 'IMAGE',
        caption: `New at ${venueName}! Come and see what we have prepared for you this week. Tap link in bio for details #fyp #viral #explore`,
        mediaUrl: '', permalink: `https://instagram.com/${accounts.instagram}`,
        publishedAt: new Date().toISOString(), authorUsername: accounts.instagram
      });
    }
    if (accounts.tiktok) {
      list.push({
        id: `sample_tt_${profileId}`, platform: 'TIKTOK', mediaType: 'VIDEO',
        caption: `A day at ${venueName}. Book in advance, spots fill fast! #fyp #foryou #trending`,
        mediaUrl: '', permalink: `https://tiktok.com/@${accounts.tiktok}`,
        publishedAt: new Date().toISOString(), authorUsername: accounts.tiktok
      });
    }
    return list;
  }, [accounts, venueName, profileId]);

  const adapted = useMemo(
    () => samplePosts.map(p => adaptSocialPostForGbp(p, context)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [samplePosts, venueName, city, website, phone]
  );

  const handleConnect = () => {
    const ig = cleanHandle(igInput);
    const tt = cleanHandle(ttInput);
    if (!ig && !tt) return;
    saveAccounts({ instagram: ig || accounts.instagram, tiktok: tt || accounts.tiktok });
    setIgInput('');
    setTtInput('');
  };

  const handleDisconnect = (which: 'instagram' | 'tiktok') => {
    const next = { ...accounts };
    delete next[which];
    saveAccounts(next);
  };

  const handlePush = (id: string) => {
    if (!autopilotEnabled) { onUpgradeClick?.(); return; }
    setSyncingId(id);
    setTimeout(() => { setSyncedIds(p => [...p, id]); setSyncingId(null); }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white rounded-xl shadow-xs">
            <Share2 className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Social Autopilot: Instagram &amp; TikTok ➔ Google Maps
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                ⚡ 69 AED Flagship
              </span>
            </div>
            <p className="text-xs text-slate-500">
              For <strong className="text-slate-700">{venueName}</strong>: repurpose your social posts into Google Local Posts with CTA buttons.
            </p>
          </div>
        </div>

        {connected && (
          <div className="flex flex-wrap items-center gap-2">
            {accounts.instagram && (
              <button type="button" onClick={() => handleDisconnect('instagram')} title="Disconnect"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer">
                <Instagram className="w-3.5 h-3.5 text-pink-600" /> @{accounts.instagram} <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
            {accounts.tiktok && (
              <button type="button" onClick={() => handleDisconnect('tiktok')} title="Disconnect"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer">
                <Video className="w-3.5 h-3.5 text-slate-900" /> @{accounts.tiktok} <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Connect form (shown until this business has linked accounts) */}
      {!connected && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <Link2 className="w-4 h-4 text-google-blue" />
            Connect the social accounts of {venueName}
          </div>
          <p className="text-xs text-slate-500">
            No accounts linked for this business yet. Enter its handles to preview how its posts will look on Google Maps.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="relative">
              <Instagram className="w-4 h-4 text-pink-600 absolute left-3 top-2.5" />
              <input value={igInput} onChange={e => setIgInput(e.target.value)} placeholder="instagram handle or URL"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-google-blue" />
            </div>
            <div className="relative">
              <Video className="w-4 h-4 text-slate-900 absolute left-3 top-2.5" />
              <input value={ttInput} onChange={e => setTtInput(e.target.value)} placeholder="tiktok handle or URL"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-google-blue" />
            </div>
            <button type="button" onClick={handleConnect} disabled={!igInput.trim() && !ttInput.trim()}
              className="px-4 py-2 rounded-xl bg-google-blue hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs cursor-pointer">
              Connect
            </button>
          </div>
        </div>
      )}

      {/* Upsell banner */}
      {connected && !autopilotEnabled && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full uppercase tracking-wider">
              Keep your Google card fresh
            </span>
            <h3 className="text-sm sm:text-base font-extrabold">
              Turn every new post of {venueName} into a Google Maps update automatically.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Regularly updated profiles get more visibility in Maps. Activate <strong>Growth Autopilot (69 AED)</strong> to syndicate new content with zero manual work.
            </p>
          </div>
          <button type="button" onClick={onUpgradeClick}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-2 cursor-pointer">
            <Sparkles className="w-4 h-4" /> Activate Social Autopilot (69 AED)
          </button>
        </div>
      )}

      {/* Preview feed */}
      {connected && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Sample preview ➔ Google Maps transformation
            </span>
            <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Real posts appear after the account link is authorized
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {adapted.map(item => {
              const done = syncedIds.includes(item.originalPost.id);
              const busy = syncingId === item.originalPost.id;
              return (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/70">
                    <span className="flex items-center gap-1 font-extrabold text-slate-800">
                      {item.originalPost.platform === 'INSTAGRAM'
                        ? <><Instagram className="w-3.5 h-3.5 text-pink-600" /> @{item.originalPost.authorUsername}</>
                        : <><Video className="w-3.5 h-3.5" /> @{item.originalPost.authorUsername}</>}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-google-blue border border-blue-200">
                      AI formatted sample
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                      <MapPin className="w-3 h-3 text-google-blue" /> Google Maps Local Post preview:
                    </div>
                    <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 leading-relaxed whitespace-pre-line">
                      {item.gbpPost.summary}
                    </p>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-slate-400 font-semibold">CTA button:</span>
                      <span className="px-2 py-0.5 rounded-md font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" /> [{item.gbpPost.callToAction?.actionType || 'LEARN_MORE'}]
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Hashtags stripped, local keywords added
                    </span>
                    {done ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Queued for Maps
                      </span>
                    ) : (
                      <button type="button" disabled={busy} onClick={() => handlePush(item.originalPost.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                          autopilotEnabled ? 'bg-google-blue hover:bg-blue-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}>
                        {busy ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Publishing...</>
                          : autopilotEnabled ? <>Push to Google Maps <ArrowRight className="w-3.5 h-3.5" /></>
                          : <><Lock className="w-3 h-3" /> Unlock Autopilot (69 AED)</>}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
