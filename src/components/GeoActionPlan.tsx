'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ClipboardList, Copy, Check, ExternalLink, QrCode, RotateCcw, Plus } from 'lucide-react';

export interface PlanGap {
  id: string;
  kind: string;
  title: string;
  detail: string;
}

interface PlanItem {
  id: number;
  gap_id: string;
  kind: string;
  title: string;
  detail: string;
  status: 'PENDING' | 'APPLIED' | 'DISMISSED';
  baseline_arp: number | null;
  baseline_solv: number | null;
  applied_at: string | null;
  rescan_due: boolean;
  rescan_due_at: string | null;
  after: { at: string | null; arp: number | null; solv: number | null } | null;
  guidance: {
    steps: string[];
    links: Record<string, string>;
    review_link: string | null;
    manual: boolean;
  };
}

interface Props {
  profileId: string;
  businessName: string;
  placeId?: string;
  keyword: string;
  gaps: PlanGap[];
  baselineArp: number | null;
  baselineSolv: number | null; // percent, as returned by the scan metrics
}

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot.top';

const fmtArp = (v: number | null | undefined) => (typeof v === 'number' ? v.toFixed(1) : '—');
const fmtSolv = (v: number | null | undefined) => (typeof v === 'number' ? `${v.toFixed(0)}%` : '—');
const fmtDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString('ru-RU') : '—');

const STATUS_LABEL: Record<PlanItem['status'], { text: string; cls: string }> = {
  PENDING: { text: 'Pending', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  APPLIED: { text: 'Applied', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  DISMISSED: { text: 'Dismissed', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export const GeoActionPlan: React.FC<Props> = ({
  profileId,
  businessName,
  placeId,
  keyword,
  gaps,
  baselineArp,
  baselineSolv,
}) => {
  const [items, setItems] = useState<PlanItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [rescanDue, setRescanDue] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [qrFor, setQrFor] = useState<number | null>(null);

  const identity = useMemo(
    () => ({ profile_id: profileId, business_name: businessName, place_id: placeId || undefined }),
    [profileId, businessName, placeId]
  );

  const apply = (data: { items: PlanItem[]; rescan_due: boolean }) => {
    setItems(Array.isArray(data.items) ? data.items : []);
    setRescanDue(Boolean(data.rescan_due));
    setError(null);
  };

  const load = useCallback(async () => {
    if (!keyword) return;
    try {
      const qs = new URLSearchParams({ profile_id: profileId, business_name: businessName, keyword });
      if (placeId) qs.set('place_id', placeId);
      const res = await fetch(`${getApiUrl()}/api/v1/geo-grid/actions?${qs.toString()}`);
      if (!res.ok) throw new Error(String(res.status));
      apply(await res.json());
    } catch {
      setError('Action log unavailable: server did not respond.');
    }
  }, [profileId, businessName, placeId, keyword]);

  useEffect(() => {
    load();
  }, [load]);

  const post = async (url: string, body: unknown, key: string) => {
    setBusy(key);
    try {
      const res = await fetch(`${getApiUrl()}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(String(res.status));
      apply(await res.json());
    } catch {
      setError('Failed to save action: server did not respond.');
    } finally {
      setBusy(null);
    }
  };

  const addToPlan = (g: PlanGap) =>
    post(
      '/api/v1/geo-grid/actions',
      {
        ...identity,
        keyword,
        gap: { id: g.id, kind: g.kind, title: g.title, detail: g.detail },
        baseline_arp: baselineArp,
        baseline_solv: baselineSolv,
      },
      `add:${g.id}`
    );

  const setStatus = (id: number, status: PlanItem['status']) =>
    post(`/api/v1/geo-grid/actions/${id}/status`, { ...identity, status }, `st:${id}`);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const inPlan = new Set(items.map((i) => i.gap_id));
  const available = gaps.filter((g) => !inPlan.has(g.id));
  const categoryName = (it: PlanItem) => it.title.match(/«(.+)»/)?.[1] || '';

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardList className="w-4 h-4 text-google-blue" />
        <div className="text-xs font-extrabold text-slate-900">Action Plan for "{keyword}"</div>
      </div>
      <p className="text-[10px] text-slate-400">
        Action execution: mark action as applied after updating Google Maps,
        then re-scan after 7 days to verify ranking improvements.
      </p>

      {error && <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2">{error}</div>}

      {rescanDue && (
        <div className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          7+ days have passed since application. Run a re-scan on this keyword to verify ARP and SoLV improvements.
        </div>
      )}

      {items.length === 0 && available.length === 0 && !error && (
        <p className="text-[11px] text-slate-500">No optimization gaps available to add to plan.</p>
      )}

      {available.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Available Optimization Gaps</div>
          {available.map((g) => (
            <div key={g.id} className="flex items-start justify-between gap-2 text-[11px] text-slate-700">
              <span>{g.detail}</span>
              <button
                type="button"
                disabled={busy === `add:${g.id}`}
                onClick={() => addToPlan(g)}
                className="shrink-0 px-2 py-1 rounded-lg bg-google-blue text-white font-bold flex items-center gap-1 disabled:opacity-60 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add to Plan
              </button>
            </div>
          ))}
        </div>
      )}

      {items.map((it) => {
        const st = STATUS_LABEL[it.status];
        const cat = it.kind === 'category' ? categoryName(it) : '';
        return (
          <div key={it.id} className="rounded-lg border border-slate-200 p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="text-[11px] text-slate-800 font-semibold">{it.detail}</div>
              <span className={`shrink-0 px-2 py-0.5 rounded-full border text-[10px] font-bold ${st.cls}`}>{st.text}</span>
            </div>

            {it.status !== 'DISMISSED' && (
              <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-slate-600">
                {it.guidance.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            )}

            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              {it.status !== 'DISMISSED' && (
                <a
                  href={it.guidance.links.profile_editor}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 flex items-center gap-1"
                >
                  Open Google Profile <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {cat && (
                <button
                  type="button"
                  onClick={() => copy(`cat:${it.id}`, cat)}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  {copied === `cat:${it.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Copy "{cat}"
                </button>
              )}
              {it.guidance.review_link && (
                <>
                  <button
                    type="button"
                    onClick={() => copy(`rev:${it.id}`, it.guidance.review_link as string)}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copied === `rev:${it.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    Google Review Form Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setQrFor(qrFor === it.id ? null : it.id)}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3 h-3" /> QR
                  </button>
                </>
              )}
            </div>

            {qrFor === it.id && it.guidance.review_link && (
              <div className="inline-block p-2 bg-white border border-slate-200 rounded-lg">
                <QRCodeSVG value={it.guidance.review_link} size={128} />
              </div>
            )}

            {it.status === 'APPLIED' && (
              <div className="text-[11px] text-slate-600 bg-slate-50 rounded-lg p-2">
                <div>
                  Before ({fmtDate(it.applied_at)}): ARP {fmtArp(it.baseline_arp)} · SoLV {fmtSolv(it.baseline_solv)}
                </div>
                <div>
                  After{it.after ? ` (${fmtDate(it.after.at)})` : ''}:{' '}
                  {it.after ? `ARP ${fmtArp(it.after.arp)} · SoLV ${fmtSolv(it.after.solv)}` : 'no re-scan performed yet'}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              {it.status !== 'APPLIED' && (
                <button
                  type="button"
                  disabled={busy === `st:${it.id}`}
                  onClick={() => setStatus(it.id, 'APPLIED')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-60 cursor-pointer"
                >
                  Mark Applied
                </button>
              )}
              {it.status !== 'PENDING' && (
                <button
                  type="button"
                  disabled={busy === `st:${it.id}`}
                  onClick={() => setStatus(it.id, 'PENDING')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 disabled:opacity-60 cursor-pointer"
                >
                  Revert to Pending
                </button>
              )}
              {it.status === 'PENDING' && (
                <button
                  type="button"
                  disabled={busy === `st:${it.id}`}
                  onClick={() => setStatus(it.id, 'DISMISSED')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 disabled:opacity-60 cursor-pointer"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
