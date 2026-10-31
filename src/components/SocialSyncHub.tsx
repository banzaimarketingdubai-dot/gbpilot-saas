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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customCaption, setCustomCaption] = useState('');
  const [customPlatform, setCustomPlatform] = useState<'INSTAGRAM' | 'TIKTOK'>('INSTAGRAM');
  const [userCreatedPosts, setUserCreatedPosts] = useState<SocialPostInput[]>([]);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

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

  // Sample posts and user-submitted custom captions
  const samplePosts: SocialPostInput[] = useMemo(() => {
    const list: SocialPostInput[] = [...userCreatedPosts];
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
  }, [accounts, venueName, profileId, userCreatedPosts]);

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
    setIsFormOpen(false);
  };

  const handleAddCustomCaption = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customCaption.trim();
    if (!trimmed) return;
    const newPost: SocialPostInput = {
      id: `custom_${Date.now()}`,
      platform: customPlatform,
      mediaType: customPlatform === 'TIKTOK' ? 'VIDEO' : 'IMAGE',
      caption: trimmed,
      mediaUrl: '',
      permalink: accounts[customPlatform.toLowerCase() as 'instagram' | 'tiktok'] ? `https://${customPlatform.toLowerCase()}.com/@${accounts[customPlatform.toLowerCase() as 'instagram' | 'tiktok']}` : '',
      publishedAt: new Date().toISOString(),
      authorUsername: accounts[customPlatform.toLowerCase() as 'instagram' | 'tiktok'] || venueName
    };
    setUserCreatedPosts(prev => [newPost, ...prev]);
    setCustomCaption('');
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

        <div className="flex flex-wrap items-center gap-2">
          {accounts.instagram && (
            <button type="button" onClick={() => handleDisconnect('instagram')} title="Disconnect Instagram"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 border border-pink-200 rounded-xl text-xs font-bold text-pink-800 hover:bg-pink-100 cursor-pointer">
              <Instagram className="w-3.5 h-3.5 text-pink-600" /> @{accounts.instagram} <X className="w-3 h-3 text-pink-400 hover:text-pink-700" />
            </button>
          )}
          {accounts.tiktok && (
            <button type="button" onClick={() => handleDisconnect('tiktok')} title="Disconnect TikTok"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-200 cursor-pointer">
              <Video className="w-3.5 h-3.5 text-slate-900" /> @{accounts.tiktok} <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>{connected ? (isFormOpen ? 'Close Settings' : 'Edit / Add Accounts') : '+ Connect Socials'}</span>
          </button>
        </div>
      </div>

      {/* Connect form (shown when not connected or user toggles edit) */}
      {(!connected || isFormOpen) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <Link2 className="w-4 h-4 text-google-blue" />
              <span>Link Social Accounts for {venueName}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Zero Passwords Needed • 100% Ban-Safe
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Enter your public Instagram and TikTok handles or profile links. GBPilot automatically extracts your new posts and adapts them into Google Local Posts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="relative">
              <Instagram className="w-4 h-4 text-pink-600 absolute left-3 top-2.5" />
              <input
                value={igInput}
                onChange={e => setIgInput(e.target.value)}
                placeholder={accounts.instagram ? `@${accounts.instagram}` : 'Instagram handle or URL'}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-google-blue font-medium"
              />
            </div>
            <div className="relative">
              <Video className="w-4 h-4 text-slate-900 absolute left-3 top-2.5" />
              <input
                value={ttInput}
                onChange={e => setTtInput(e.target.value)}
                placeholder={accounts.tiktok ? `@${accounts.tiktok}` : 'TikTok handle or URL'}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-google-blue font-medium"
              />
            </div>
            <button
              type="button"
              onClick={handleConnect}
              disabled={!igInput.trim() && !ttInput.trim()}
              className="px-4 py-2 rounded-xl bg-google-blue hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs cursor-pointer shadow-xs transition-all"
            >
              {connected ? 'Update Accounts' : 'Connect & Preview'}
            </button>
          </div>
        </div>
      )}

      {/* Manual Quick-Repurpose Box */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-google-blue" />
            <span>Instant Post Repurposer (Paste any Reel or Post Caption)</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setCustomPlatform('INSTAGRAM')}
              className={`px-2 py-0.5 rounded-md cursor-pointer ${customPlatform === 'INSTAGRAM' ? 'bg-pink-100 text-pink-800 border border-pink-300' : 'text-slate-500'}`}
            >
              Instagram
            </button>
            <button
              type="button"
              onClick={() => setCustomPlatform('TIKTOK')}
              className={`px-2 py-0.5 rounded-md cursor-pointer ${customPlatform === 'TIKTOK' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
            >
              TikTok
            </button>
          </div>
        </div>
        <form onSubmit={handleAddCustomCaption} className="space-y-2">
          <textarea
            rows={2}
            value={customCaption}
            onChange={e => setCustomCaption(e.target.value)}
            placeholder={`Paste recent caption from ${customPlatform} here (e.g. "Special trip this weekend to Moc Bai! Book tickets via link in bio #fyp #vietnam")...`}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-google-blue resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              AI automatically removes hashtags, inserts local SEO anchors, and selects the optimal CTA button.
            </span>
            <button
              type="submit"
              disabled={!customCaption.trim()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Adapt to Google Post</span>
            </button>
          </div>
        </form>
      </div>

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
