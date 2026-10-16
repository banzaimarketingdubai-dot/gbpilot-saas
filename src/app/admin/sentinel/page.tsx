'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Lock,
  Clock,
  Building2,
  Phone,
  Eye,
  Zap,
  Info
} from 'lucide-react';

interface SecurityIncident {
  id: string;
  threatType: 'PHONE_TAMPERING' | 'HOURS_HIJACK' | 'STATUS_CLOSED';
  venueName: string;
  source: string;
  timestamp: string;
  originalValue: string;
  attemptedValue: string;
  status: 'INTERCEPTED' | 'REVERTED';
}

const INITIAL_INCIDENTS: SecurityIncident[] = [
  {
    id: 'sec_1',
    threatType: 'PHONE_TAMPERING',
    venueName: 'Artisan Specialty Coffee & Roastery',
    source: 'Google Maps Public Suggestion (Third-Party)',
    timestamp: '2 hours ago',
    originalValue: '+971 4 399 2200',
    attemptedValue: '+971 50 123 4567 (Rival Lead-Gen)',
    status: 'INTERCEPTED',
  },
  {
    id: 'sec_2',
    threatType: 'STATUS_CLOSED',
    venueName: 'Artisan Specialty Coffee & Roastery',
    source: 'Automated Competitor Crowdsourcing Report',
    timestamp: '1 day ago',
    originalValue: 'Open for Business (Regular Operations)',
    attemptedValue: 'Marked as "Permanently Closed"',
    status: 'REVERTED',
  },
];

export default function AdminSentinelPage() {
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_INCIDENTS);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRollbackAll = () => {
    showToast('🛡️ All Google Business Profile fields verified & reverted to trusted snapshot.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex items-center gap-3 text-xs text-white animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sentinel Guard Shield
            </h1>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Zero-Trust Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            24/7 digital insurance defending Google Maps profiles against unauthorized edits, phone hijacking, and competitor sabotages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRollbackAll}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Enforce Verified Snapshot</span>
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Protection Level</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">100% Locked</div>
          <p className="text-[11px] text-slate-500">Autonomous Sentinel Shield active across all fleet profiles</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Threats Neutralized</span>
          </div>
          <div className="text-2xl font-extrabold text-white">2 Interceptions</div>
          <p className="text-[11px] text-slate-500">Tampering attempts caught and rejected in last 30 days</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-blue-400" />
            <span>Digital Insurance</span>
          </div>
          <div className="text-2xl font-extrabold text-white">Guaranteed</div>
          <p className="text-[11px] text-slate-500">Zero downtime and automated rollback guarantee</p>
        </div>
      </div>

      {/* Interception Logs */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white">Security Incident Audit Trail</h3>
            <p className="text-xs text-slate-400">Detailed records of intercepted competitor and third-party modifications</p>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Audit Trail Encrypted
          </span>
        </div>

        <div className="space-y-3">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded">
                    {inc.threatType.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {inc.venueName}
                  </span>
                  <span className="text-[10px] text-slate-500">• {inc.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase">Trusted Value (Preserved)</div>
                    <div className="font-mono text-slate-200 mt-0.5">{inc.originalValue}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30">
                    <div className="text-[10px] font-bold text-red-400 uppercase">Unauthorized Attempt (Blocked)</div>
                    <div className="font-mono text-red-200/90 mt-0.5 line-through">{inc.attemptedValue}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">Source: {inc.source}</div>
              </div>

              <div className="shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Neutralized</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
