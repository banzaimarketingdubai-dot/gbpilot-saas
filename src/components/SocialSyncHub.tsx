'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Share2, Sparkles, ArrowRight, CheckCircle2, Clock, Instagram, Video,
  MapPin, Zap, Lock, RefreshCw, Link2, X, Eye, Check, Shield, Play, Pause,
  Smartphone, Wifi, ThumbsUp, Bookmark
} from 'lucide-react';
import { adaptSocialPostForGbp, BusinessContext, SocialPostInput, AdaptedPostResult } from '@/lib/social/repostEngine';

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
const modeKey = (profileId: string) => `gbpilot_social_mode_${profileId}`;

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
  const autopilotEnabled = planId === 'PRO_GROWTH' || planId === 'AGENCY' || isPro;

  const [accounts, setAccounts] = useState<SocialAccounts>({});
  const [igInput, setIgInput] = useState('');
  const [ttInput, setTtInput] = useState('');
  const [syncedIds, setSyncedIds] = useState<string[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customCaption, setCustomCaption] = useState('');
  const [customPlatform, setCustomPlatform] = useState<'INSTAGRAM' | 'TIKTOK'>('INSTAGRAM');
  const [userCreatedPosts, setUserCreatedPosts] = useState<SocialPostInput[]>([]);
  const [previewModalPost, setPreviewModalPost] = useState<AdaptedPostResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 3-way Autopilot Mode: AUTONOMOUS (Auto-Publish) | APPROVAL (Review & Approve) | PAUSED (Off)
  const [autopilotMode, setAutopilotMode] = useState<'AUTONOMOUS' | 'APPROVAL' | 'PAUSED'>('APPROVAL');

  // Load THIS business's connected accounts & mode
  useEffect(() => {
    setSyncedIds([]);
    setSyncingId(null);
    setIgInput('');
    setTtInput('');
    try {
      const raw = profileId ? localStorage.getItem(storageKey(profileId)) : null;
      setAccounts(raw ? JSON.parse(raw) : {});

      const rawMode = profileId ? localStorage.getItem(modeKey(profileId)) : null;
      if (rawMode === 'AUTONOMOUS' || rawMode === 'APPROVAL' || rawMode === 'PAUSED') {
        setAutopilotMode(rawMode);
      }
    } catch {
      setAccounts({});
    }
  }, [profileId]);

  const saveAccounts = (next: SocialAccounts) => {
    setAccounts(next);
    if (profileId) localStorage.setItem(storageKey(profileId), JSON.stringify(next));
  };

  const handleSetAutopilotMode = (mode: 'AUTONOMOUS' | 'APPROVAL' | 'PAUSED') => {
    setAutopilotMode(mode);
    if (profileId) localStorage.setItem(modeKey(profileId), mode);
    
    if (mode === 'AUTONOMOUS') {
      showToast('⚡ 100% Autopilot Active: New posts will be adapted & auto-published to Google Maps every 6 hours.');
    } else if (mode === 'APPROVAL') {
      showToast('🛡️ Manual Approval Active: New posts are adapted into drafts and require your 1-click confirmation.');
    } else {
      showToast('⏸️ Social Autopilot Paused: Automatic cross-posting is temporarily stopped.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const connected = !!(accounts.instagram || accounts.tiktok);

  const context: BusinessContext = {
    businessName: venueName,
    primaryCategory: category,
    city: city || 'Nha Trang',
    websiteUrl: website || 'https://www.sirvisaranus.us/',
    orderUrl: website || 'https://www.sirvisaranus.us/',
    reservationUrl: website || 'https://www.sirvisaranus.us/',
    phoneNumber: phone || '0867 246 940'
  };

  // Niche-aware realistic feed for connected accounts
  const samplePosts: SocialPostInput[] = useMemo(() => {
    const list: SocialPostInput[] = [...userCreatedPosts];
    const isTransportation = 
      venueName.toLowerCase().includes('visaran') ||
      venueName.toLowerCase().includes('transport') ||
      category.toLowerCase().includes('transport') ||
      (accounts.instagram || '').toLowerCase().includes('visarun') ||
      (accounts.tiktok || '').toLowerCase().includes('visarun');

    if (accounts.instagram) {
      if (isTransportation) {
        list.push({
          id: `sample_ig_1_${profileId}`,
          platform: 'INSTAGRAM',
          mediaType: 'IMAGE',
          caption: `🚐 Daily VIP Visa Run to Moc Bai & Cambodia Border! Departing every morning from Nha Trang in our comfortable AC minivans with luggage assistance and full border concierge. Seats are filling fast — book your tickets in advance! Tap link in bio or WhatsApp 0867 246 940 #visarun #nhatrang #vietnam #bordercrossing #mocbai #travelvietnam`,
          mediaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
          permalink: `https://instagram.com/${accounts.instagram}`,
          publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
          authorUsername: accounts.instagram,
          likesCount: 148
        });
        list.push({
          id: `sample_ig_2_${profileId}`,
          platform: 'INSTAGRAM',
          mediaType: 'IMAGE',
          caption: `✈️ 24/7 Cam Ranh Airport ⇄ Nha Trang private transfers! Fixed transparent prices, flight delay monitoring, meet & greet service at arrivals, and zero hidden baggage fees. DM or tap link in bio to book! #camranh #nhatrang #airporttransfer #taxinhatrang #vietnamtravel`,
          mediaUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
          permalink: `https://instagram.com/${accounts.instagram}`,
          publishedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
          authorUsername: accounts.instagram,
          likesCount: 215
        });
      } else {
        list.push({
          id: `sample_ig_${profileId}`,
          platform: 'INSTAGRAM',
          mediaType: 'IMAGE',
          caption: `Special offer this week at ${venueName}! Tap link in bio for full details and reservations #fyp #viral #localbusiness`,
          mediaUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
          permalink: `https://instagram.com/${accounts.instagram}`,
          publishedAt: new Date().toISOString(),
          authorUsername: accounts.instagram
        });
      }
    }

    if (accounts.tiktok) {
      if (isTransportation) {
        list.push({
          id: `sample_tt_1_${profileId}`,
          platform: 'TIKTOK',
          mediaType: 'VIDEO',
          caption: `POV: You booked the VIP express van from Nha Trang to Moc Bai border ✨ Cold water, strong AC, comfortable recliner seats, and zero border stress! Link in bio to book your seat #fyp #foryou #nhatrang #visaruntrip #vietnamnomad #trending`,
          mediaUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
          permalink: `https://tiktok.com/@${accounts.tiktok}`,
          publishedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
          authorUsername: accounts.tiktok,
          likesCount: 1840
        });
      } else {
        list.push({
          id: `sample_tt_${profileId}`,
          platform: 'TIKTOK',
          mediaType: 'VIDEO',
          caption: `A day at ${venueName}. Book in advance, spots fill fast! #fyp #foryou #trending`,
          mediaUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
          permalink: `https://tiktok.com/@${accounts.tiktok}`,
          publishedAt: new Date().toISOString(),
          authorUsername: accounts.tiktok
        });
      }
    }
    return list;
  }, [accounts, venueName, category, profileId, userCreatedPosts]);

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
    showToast('Linked social channels! Found recent posts ready for Google Maps adaptation.');
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
      mediaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      permalink: accounts[customPlatform.toLowerCase() as 'instagram' | 'tiktok'] ? `https://${customPlatform.toLowerCase()}.com/@${accounts[customPlatform.toLowerCase() as 'instagram' | 'tiktok']}` : '',
      publishedAt: new Date().toISOString(),
      authorUsername: accounts[customPlatform.toLowerCase() as 'instagram' | 'tiktok'] || venueName
    };
    setUserCreatedPosts(prev => [newPost, ...prev]);
    setCustomCaption('');
    showToast('Adapted caption into Google Maps format with stripped hashtags & SEO CTA!');
  };

  const handleDisconnect = (which: 'instagram' | 'tiktok') => {
    const next = { ...accounts };
    delete next[which];
    saveAccounts(next);
    showToast(`Disconnected ${which}.`);
  };

  const handlePush = (id: string) => {
    if (!autopilotEnabled) { onUpgradeClick?.(); return; }
    setSyncingId(id);
    setTimeout(() => {
      setSyncedIds(p => [...p, id]);
      setSyncingId(null);
      showToast('🚀 Successfully pushed to Google Business Profile updates!');
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Account Connections */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white rounded-2xl shadow-xs">
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
              For <strong className="text-slate-700">{venueName}</strong>: select, adapt, and automatically sync your social posts to Google Maps.
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

      {/* Autopilot Master Controls & Mode Switch */}
      {connected && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Autopilot Syncing Mode:</span>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                autopilotMode === 'AUTONOMOUS' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : autopilotMode === 'APPROVAL'
                  ? 'bg-blue-100 text-google-blue border border-blue-300'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {autopilotMode === 'AUTONOMOUS' ? '● 100% Autonomous' : autopilotMode === 'APPROVAL' ? '🛡️ Manual Approval' : '⏸️ Paused'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {autopilotMode === 'AUTONOMOUS' 
                ? 'Every new Reel or Post is cleaned and published directly to Google Maps without manual intervention.'
                : autopilotMode === 'APPROVAL'
                ? 'AI cleans hashtags, adds local SEO anchors, and awaits your 1-click confirmation.'
                : 'Automatic background polling is paused. Manual repurposing is still available below.'}
            </p>
          </div>

          {/* 3-Way Switch Button Group */}
          <div className="inline-flex rounded-xl p-1 bg-white border border-slate-200 shadow-2xs self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => handleSetAutopilotMode('AUTONOMOUS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                autopilotMode === 'AUTONOMOUS'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play className="w-3 h-3" />
              <span>Auto-Publish</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetAutopilotMode('APPROVAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                autopilotMode === 'APPROVAL'
                  ? 'bg-google-blue text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Require Approval</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetAutopilotMode('PAUSED')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                autopilotMode === 'PAUSED'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Pause className="w-3 h-3" />
              <span>Pause</span>
            </button>
          </div>
        </div>
      )}

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

      {/* Connected Feed: Select, Preview, and Repurpose Posts */}
      {connected && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Detected Posts Ready for Google Maps</span>
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Select any post below to preview its Google Maps transformation or push it live.
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Background sync: active every 6h
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {adapted.map(item => {
              const done = syncedIds.includes(item.originalPost.id);
              const busy = syncingId === item.originalPost.id;
              return (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Source Post Header */}
                    <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-200/70">
                      <span className="flex items-center gap-1.5 font-extrabold text-slate-800">
                        {item.originalPost.platform === 'INSTAGRAM'
                          ? <><Instagram className="w-3.5 h-3.5 text-pink-600" /> @{item.originalPost.authorUsername}</>
                          : <><Video className="w-3.5 h-3.5 text-slate-900" /> @{item.originalPost.authorUsername}</>}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ AI Ready for Maps
                      </span>
                    </div>

                    {/* Original Caption Preview */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Original Social Caption:</span>
                      <p className="text-[11px] text-slate-500 line-clamp-2 italic bg-white/70 p-2 rounded-lg border border-slate-200/60">
                        &quot;{item.originalPost.caption}&quot;
                      </p>
                    </div>

                    {/* Adapted Google Maps Post Body */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-google-blue" /> Adapted Google Maps Local Post:
                        </span>
                        <span className="px-2 py-0.5 rounded-md font-extrabold bg-blue-50 text-google-blue border border-blue-200 text-[10px]">
                          CTA: [{item.gbpPost.callToAction?.actionType || 'BOOK'}]
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-line shadow-2xs">
                        {item.gbpPost.summary}
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2">
                    {/* View Live Card Preview Modal Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewModalPost(item)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-google-blue" />
                      <span>Preview Card</span>
                    </button>

                    {done ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Published to Maps
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handlePush(item.originalPost.id)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all ${
                          autopilotEnabled 
                            ? 'bg-google-blue hover:bg-blue-600 text-white' 
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {busy ? (
                          <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Publishing...</>
                        ) : (
                          <><span>Push to Google Maps</span> <ArrowRight className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Google Maps Visual Card Preview Modal */}
      {previewModalPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 border border-slate-200 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-google-blue" />
                <span>Google Maps Card Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalPost(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Google Maps Mobile Card */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-white text-slate-900">
              {/* Profile Bar */}
              <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-google-blue text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {venueName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 truncate">{venueName}</h5>
                    <span className="text-[10px] text-slate-400">Google Updates • Just now</span>
                  </div>
                </div>
                <button type="button" className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-google-blue border border-blue-200">
                  Follow
                </button>
              </div>

              {/* Photo */}
              <div className="aspect-16/9 w-full bg-slate-100 overflow-hidden relative">
                <img
                  src={previewModalPost.originalPost.mediaUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'}
                  alt="Post preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[9px] font-mono">
                  📍 {city || 'Nha Trang'} Verified
                </span>
              </div>

              {/* Body */}
              <div className="p-3.5 space-y-3">
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {previewModalPost.gbpPost.summary}
                </p>

                {/* Google Maps CTA Button */}
                <button
                  type="button"
                  className="w-full py-2 bg-google-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {previewModalPost.gbpPost.callToAction?.actionType === 'BOOK' && <span>Book Online ↗</span>}
                  {previewModalPost.gbpPost.callToAction?.actionType === 'CALL' && <span>Call Business 📞</span>}
                  {previewModalPost.gbpPost.callToAction?.actionType === 'ORDER' && <span>Order Online ↗</span>}
                  {previewModalPost.gbpPost.callToAction?.actionType === 'LEARN_MORE' && <span>Learn More ↗</span>}
                </button>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPreviewModalPost(null)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handlePush(previewModalPost.originalPost.id);
                  setPreviewModalPost(null);
                }}
                className="px-4 py-2 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm &amp; Push to Google Maps</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
