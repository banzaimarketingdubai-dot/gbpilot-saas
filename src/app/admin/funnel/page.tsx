'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  RefreshCw,
  Download,
  Copy,
  Check,
  Search,
  Sparkles,
  CreditCard,
  Users,
  MousePointerClick,
  Lock,
  ExternalLink,
  Filter,
} from 'lucide-react';

interface WaitlistRow {
  id: number;
  email: string;
  business_name: string;
  phone: string;
  city: string;
  source: string;
  utm_source: string;
  utm_campaign: string;
  notes: string;
  created_at: string;
}

interface EventRow {
  id: number;
  event_type: string;
  utm_source: string;
  utm_campaign: string;
  utm_content: string;
  business_name: string;
  city: string;
  place_id: string;
  page_path: string;
  email: string;
  phone: string;
  created_at: string;
}

interface FunnelStatsResponse {
  success: boolean;
  campaign: string;
  summary: {
    visits: number;
    live_scans: number;
    trial_activations: number;
    beta_modal_opens: number;
    beta_signups: number;
    checkout_clicks: number;
    scan_rate_pct: number;
    beta_conv_pct: number;
  };
  campaigns: string[];
  waitlist: WaitlistRow[];
  events: EventRow[];
  error?: string;
}

const EVENT_BADGE_MAP: Record<string, { label: string; cls: string }> = {
  outreach_visit: { label: 'Outreach Click', cls: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  live_scan: { label: 'Live Scan', cls: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  trial_activated: { label: 'Trial Activated', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  beta_modal_opened: { label: 'Beta Gate Seen', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  beta_signup: { label: 'Beta Signup ★', cls: 'bg-purple-500/20 text-purple-200 border-purple-400/40' },
  checkout_click: { label: 'Checkout Click $', cls: 'bg-green-500/20 text-green-300 border-green-400/40' },
};

export default function AdminFunnelPage() {
  const [stats, setStats] = useState<FunnelStatsResponse | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [campaignTag, setCampaignTag] = useState<string>('austin_test');
  const [sampleBusiness, setSampleBusiness] = useState<string>('Radiant Plumbing Austin TX');

  const fetchStats = useCallback(async (camp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const qs = camp ? `?campaign=${encodeURIComponent(camp)}` : '';
      const res = await fetch(`/api/v1/funnel/stats${qs}`);
      const data: FunnelStatsResponse = await res.json();
      if (data.success) {
        setStats(data);
      } else {
        setError(data.error || 'Failed to load outreach funnel analytics');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching funnel stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(selectedCampaign);
  }, [selectedCampaign, fetchStats]);

  const copyText = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleExportCsv = () => {
    const rows = stats?.waitlist || [];
    if (rows.length === 0) return;
    const header = ['ID', 'Email', 'Business Name', 'Phone', 'City', 'Source', 'UTM Source', 'UTM Campaign', 'Created At'];
    const csvLines = [
      header.join(','),
      ...rows.map((r) =>
        [
          r.id,
          r.email,
          r.business_name,
          r.phone,
          r.city,
          r.source,
          r.utm_source,
          r.utm_campaign,
          r.created_at,
        ]
          .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
          .join(',')
      ),
    ];
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gbpilot_beta_waitlist_${selectedCampaign || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (iso: string) => {
    if (!iso) return '—';
    try {
      return new Date(iso + (iso.endsWith('Z') ? '' : 'Z')).toLocaleString();
    } catch {
      return iso;
    }
  };

  const templateUrl = `https://gbpilot.top/onboarding?search={{Business_Name}}+Austin+TX&utm_source=outreach&utm_campaign=${encodeURIComponent(campaignTag)}`;
  const liveTestUrl = `https://gbpilot.top/onboarding?search=${encodeURIComponent(sampleBusiness)}&utm_source=outreach&utm_campaign=${encodeURIComponent(campaignTag)}`;

  const s = stats?.summary || {
    visits: 0,
    live_scans: 0,
    trial_activations: 0,
    beta_modal_opens: 0,
    beta_signups: 0,
    checkout_clicks: 0,
    scan_rate_pct: 0,
    beta_conv_pct: 0,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Outreach Funnel &amp; Closed Beta Leads
            </h1>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Live Postgres
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time tracking of UTM outreach clicks, instant live company scans, Closed Beta waitlist subscriptions, and checkout intent.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-semibold text-white cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Campaigns</option>
              {(stats?.campaigns || []).map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => fetchStats(selectedCampaign)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!stats?.waitlist?.length}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Beta CSV ({stats?.waitlist?.length || 0})</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* 5 Funnel KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Outreach Clicks</span>
            <MousePointerClick className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">{s.visits}</div>
          <div className="text-[11px] text-slate-500">Tracked UTM arrivals</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Live Scans</span>
            <Search className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{s.live_scans}</div>
          <div className="text-[11px] text-indigo-300 font-medium">
            {s.scan_rate_pct}% scan rate
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Trial Activations</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{s.trial_activations}</div>
          <div className="text-[11px] text-slate-500">Entered Cockpit</div>
        </div>

        <div className="bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/40 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-purple-200 text-xs font-bold">
            <span>Beta Waitlist Signups</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{s.beta_signups}</div>
          <div className="text-[11px] text-purple-300 font-medium">
            {s.beta_modal_opens} gate views • {s.beta_conv_pct}% conv
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Checkout Clicks</span>
            <CreditCard className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl font-black text-white">{s.checkout_clicks}</div>
          <div className="text-[11px] text-slate-500">Creem plan intent</div>
        </div>
      </div>

      {/* Outreach Live-Scan Link Builder */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Instant Live-Scan Outreach Link Generator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Recipients clicking this link jump straight into a real-time Google Maps diagnostic scan of their business and are logged above.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={campaignTag}
              onChange={(e) => setCampaignTag(e.target.value)}
              placeholder="utm_campaign"
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white w-36 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Outreach Template Variable Link
              </span>
              <button
                type="button"
                onClick={() => copyText('tpl', templateUrl)}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                {copiedId === 'tpl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'tpl' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <code className="block text-[11px] text-slate-300 break-all font-mono">{templateUrl}</code>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Live Test Link (Click to Verify Funnel)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyText('live', liveTestUrl)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer"
                >
                  {copiedId === 'live' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'live' ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={liveTestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Test</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <input
              type="text"
              value={sampleBusiness}
              onChange={(e) => setSampleBusiness(e.target.value)}
              className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Closed Beta Waitlist Subscribers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Closed Beta Subscriptions ({stats?.waitlist?.length || 0})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Captured from the Private Beta modal (replaces Google OAuth 403 block).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Campaign / Source</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {(stats?.waitlist || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No beta subscriptions recorded yet. They will appear here immediately when a prospect submits the Closed Beta modal.
                  </td>
                </tr>
              ) : (
                stats!.waitlist.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{row.email}</td>
                    <td className="py-3 px-4 text-slate-200">{row.business_name || '—'}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{row.phone || '—'}</td>
                    <td className="py-3 px-4 text-slate-300">{row.city || '—'}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                        {row.utm_campaign || row.source || 'direct'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{formatTime(row.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Funnel Events Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Recent Funnel Activity ({stats?.events?.length || 0})</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Business / Email</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">UTM Campaign</th>
                <th className="py-3 px-4">Page</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {(stats?.events || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No funnel events recorded yet. Click the Test Link above to verify live tracking.
                  </td>
                </tr>
              ) : (
                stats!.events.map((ev) => {
                  const badge = EVENT_BADGE_MAP[ev.event_type] || {
                    label: ev.event_type,
                    cls: 'bg-slate-700/50 text-slate-300 border-slate-600',
                  };
                  return (
                    <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-bold ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-200 font-medium">
                        {ev.business_name || ev.email || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{ev.city || '—'}</td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                        {ev.utm_campaign || ev.utm_source || 'organic'}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{ev.page_path || '—'}</td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{formatTime(ev.created_at)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
