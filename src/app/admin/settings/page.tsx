'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  Key,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Terminal,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Users,
  Lock
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              System Settings &amp; API Keys
            </h1>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Production Config
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Environment telemetry, Creem.io MoR integration secrets, Gemini 2.5 Flash status, and RBAC governance.
          </p>
        </div>
      </div>

      {/* Grid: Keys & Webhooks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active API Keys & Credentials */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Key className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-base text-white">Active Integrations Status</h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Creem Key */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Creem API Key</span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/20">
                    TEST AUTHENTICATED
                  </span>
                </div>
                <code className="text-slate-400 font-mono text-[11px] mt-1 block">
                  creem_test_••••••••••••••••MQa6
                </code>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            </div>

            {/* Creem Product Starter */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Starter Plan Product ID</span>
                  <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-blue-500/20">
                    ACTIVE
                  </span>
                </div>
                <code className="text-slate-400 font-mono text-[11px] mt-1 block">
                  prod_5ByHVBJDCL2gyknzv1VqU4
                </code>
              </div>
              <button
                onClick={() => copyToClipboard('prod_5ByHVBJDCL2gyknzv1VqU4', 'starter_id')}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                {copiedKey === 'starter_id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Creem Product Pro */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Growth / Pro Plan Product ID</span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/20">
                    ACTIVE
                  </span>
                </div>
                <code className="text-slate-400 font-mono text-[11px] mt-1 block">
                  prod_279fuhC5FSVX9DR6MLSuU4
                </code>
              </div>
              <button
                onClick={() => copyToClipboard('prod_279fuhC5FSVX9DR6MLSuU4', 'pro_id')}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                {copiedKey === 'pro_id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Creem Product Agency */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Agency Plan Product ID</span>
                  <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-500/20">
                    ACTIVE
                  </span>
                </div>
                <code className="text-slate-400 font-mono text-[11px] mt-1 block">
                  prod_1CtCL59SfGfm79Mgvtxlf4
                </code>
              </div>
              <button
                onClick={() => copyToClipboard('prod_1CtCL59SfGfm79Mgvtxlf4', 'agency_id')}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                {copiedKey === 'agency_id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Gemini API Key */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Google Gemini 2.5 Flash</span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/20">
                    AI ENGINE ACTIVE
                  </span>
                </div>
                <span className="text-slate-400 text-[11px] mt-1 block">
                  Autonomous spatial audits &amp; sentiment analysis
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Quota
              </span>
            </div>
          </div>
        </div>

        {/* Right: Webhook Forwarding & CLI Tools */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Creem CLI Webhook Forwarding</h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            The installed Creem CLI enables real-time webhook tunneling directly to your local or staging server without ngrok:
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>PowerShell Command:</span>
              <button
                onClick={() =>
                  copyToClipboard(
                    '$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; creem listen --forward-to http://localhost:3000/api/v1/webhooks/creem',
                    'cli_cmd'
                  )
                }
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-sans text-xs"
              >
                {copiedKey === 'cli_cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <code className="text-emerald-400 font-mono text-xs block break-all">
              creem listen --forward-to http://localhost:3000/api/v1/webhooks/creem
            </code>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Supported Webhook Events:</div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['checkout.completed', 'subscription.active', 'subscription.paid', 'subscription.expired'].map((ev) => (
                <span
                  key={ev}
                  className="bg-slate-950 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-800"
                >
                  {ev}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RBAC Governance Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Role-Based Access Control (RBAC)</h3>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/users"
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage Roles &amp; Team →</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white text-sm">Superadmin</div>
            <div className="text-slate-400 text-[11px]">Platform Owner</div>
            <p className="text-slate-500 text-[11px]">Full access to Creem MoR revenue, API keys, and team membership.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white text-sm">Operations Lead</div>
            <div className="text-slate-400 text-[11px]">SEO &amp; Account Manager</div>
            <p className="text-slate-500 text-[11px]">Geo-Grid scans, bulk action approvals, and venue rankings management.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white text-sm">Sentinel Officer</div>
            <div className="text-slate-400 text-[11px]">Security &amp; Trust</div>
            <p className="text-slate-500 text-[11px]">Audit trails, competitor tampering rollbacks, and dispute logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
