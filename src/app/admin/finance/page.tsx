'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function AdminFinancePage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchFinance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/admin/payments/analytics');
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || 'Failed to load finance telemetry');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching finance data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data?.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Finance & Creem.io Hub
            </h1>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                data?.mode === 'live'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {data?.mode || 'test'} mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Merchant of Record (MoR) billing orchestration, subscription recurring revenue, and checkout testing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchFinance}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <a
            href="https://creem.io/dashboard"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition-all"
          >
            <span>Creem Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Monthly Recurring (MRR)</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
            {isLoading ? '...' : formatMoney(data?.summary.monthlyRecurringRevenue ?? 0)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live Creem API
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Gross Revenue</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
            {isLoading ? '...' : formatMoney(data?.summary.totalRevenue ?? 0)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Net: {isLoading ? '...' : formatMoney(data?.summary.netRevenue ?? 0)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Active Subscriptions</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
            {isLoading ? '...' : data?.summary.activeSubscriptions ?? 0}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Total Customers: {data?.summary.totalCustomers ?? 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Total Payments Processed</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
            {isLoading ? '...' : data?.summary.totalPayments ?? 0}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Gateway: Creem MoR
          </div>
        </div>
      </div>

      {/* Products & Checkout Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configured Products */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white">Configured Creem Products</h3>
              <p className="text-xs text-slate-400">Tied to GBPilot SaaS recurring plans</p>
            </div>
            <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              USD Currency
            </span>
          </div>

          <div className="space-y-3">
            {/* Product 1: Growth Pro */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Growth / Pro Plan</span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">
                    ACTIVE IN CREEM
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Product ID: <code className="text-slate-300 font-mono text-[11px]">prod_279fuhC5FSVX9DR6MLSuU4</code>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">$69.00 / month • Full Autopilot & Sentinel Shield</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard('prod_279fuhC5FSVX9DR6MLSuU4', 'pro_id')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1"
                >
                  {copiedKey === 'pro_id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy ID</span>
                </button>
                <a
                  href="https://www.creem.io/payment/prod_279fuhC5FSVX9DR6MLSuU4"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1 shadow-sm"
                >
                  <span>Hosted Checkout</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Product 2: Starter Plan */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Starter Plan</span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">
                    ACTIVE IN CREEM
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Product ID: <code className="text-slate-300 font-mono text-[11px]">{data?.meta?.products?.starter || 'prod_5ByHVBJDCL2gyknzv1VqU4'}</code>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">$29.00 / month • Single Location diagnostic</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard('prod_5ByHVBJDCL2gyknzv1VqU4', 'starter_id')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1"
                >
                  {copiedKey === 'starter_id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy ID</span>
                </button>
                <a
                  href="https://www.creem.io/payment/prod_5ByHVBJDCL2gyknzv1VqU4"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1 shadow-sm"
                >
                  <span>Hosted Checkout</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Product 3: Agency Plan */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Agency / Multi-Venue Plan</span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">
                    ACTIVE IN CREEM
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Product ID: <code className="text-slate-300 font-mono text-[11px]">{data?.meta?.products?.agency || 'prod_1CtCL59SfGfm79Mgvtxlf4'}</code>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">$199.00 / month • Multi-location Dubai Fleet</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard('prod_1CtCL59SfGfm79Mgvtxlf4', 'agency_id')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1"
                >
                  {copiedKey === 'agency_id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy ID</span>
                </button>
                <a
                  href="https://www.creem.io/payment/prod_1CtCL59SfGfm79Mgvtxlf4"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1 shadow-sm"
                >
                  <span>Hosted Checkout</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Test Card Cheat Sheet */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-base text-white">Creem Test Cards</h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Use these official test cards on any Creem checkout in Test Mode. Expiry can be any future date (e.g. 12/28) and CVC any 3 digits.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-emerald-400">Success Card</div>
                <code className="text-slate-200 font-mono">4111 1111 1111 1111</code>
              </div>
              <button
                onClick={() => copyToClipboard('4111 1111 1111 1111', 'card_success')}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                {copiedKey === 'card_success' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-red-400">Declined Card</div>
                <code className="text-slate-200 font-mono">4507 9900 0000 0028</code>
              </div>
              <button
                onClick={() => copyToClipboard('4507 9900 0000 0028', 'card_declined')}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                {copiedKey === 'card_declined' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-400">Insufficient Funds</div>
                <code className="text-slate-200 font-mono">4507 9900 0000 0010</code>
              </div>
              <button
                onClick={() => copyToClipboard('4507 9900 0000 0010', 'card_funds')}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                {copiedKey === 'card_funds' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriptions & Transactions Log */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-base text-white">Recent Transactions & Events</h3>
          </div>
          <span className="text-xs text-slate-500">Live API polling</span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading ledger...</div>
        ) : data?.recentTransactions && data.recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-semibold">Transaction ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {data.recentTransactions.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-mono text-slate-300">{t.id}</td>
                    <td className="py-3 text-slate-400">{t.customer || 'Guest User'}</td>
                    <td className="py-3 font-bold text-white">{formatMoney(t.amount || 0)}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {t.status || 'paid'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <div className="text-xs text-slate-400">No transactions recorded yet in test mode.</div>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              Run a test purchase using the button above or on the B2B landing page. Once processed, transactions will immediately appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
