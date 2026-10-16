'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Building2,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  ExternalLink,
  Users,
  Compass,
  ArrowRight,
  ShieldAlert,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  mode: string;
  currency: string;
  summary: {
    totalRevenue: number;
    netRevenue: number;
    monthlyRecurringRevenue: number;
    activeSubscriptions: number;
    totalCustomers: number;
    totalPayments: number;
  };
  recentTransactions: any[];
  subscriptions: any[];
  meta: {
    products: {
      starter: string | null;
      pro: string | null;
      agency: string | null;
    };
    timestamp: string;
  };
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<any>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/admin/payments/analytics');
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || 'Failed to load Creem analytics');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gbpilot_active_profile');
      if (stored) {
        try {
          setActiveProfile(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Pulse Overview
            </h1>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Operational
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry across Creem.io recurring revenue, Google Maps Geo-Grid, and Sentinel Guard.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/finance"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Finance Hub</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: MRR */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Monthly Recurring Revenue</span>
            <CreditCard className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isLoading ? '...' : formatMoney(data?.summary.monthlyRecurringRevenue ?? 0)}
            </span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              Creem MoR
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Gross Revenue: {isLoading ? '...' : formatMoney(data?.summary.totalRevenue ?? 0)}</span>
            <span className="capitalize text-slate-400">{data?.mode || 'test'} mode</span>
          </div>
        </div>

        {/* Card 2: Active Subscriptions */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Paying Subscriptions</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isLoading ? '...' : data?.summary.activeSubscriptions ?? 0}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">clients</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Total Customers: {data?.summary.totalCustomers ?? 0}</span>
            <span className="text-indigo-400 font-medium">Growth Pro Plan</span>
          </div>
        </div>

        {/* Card 3: Protected Venues Fleet */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Venues Fleet</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeProfile ? '1' : '0'}
            </span>
            <span className="text-[11px] font-bold text-amber-400 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-0.5" />
              Verified OAuth
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 truncate">
            {activeProfile?.name ? activeProfile.name : 'No active venue linked'}
          </div>
        </div>

        {/* Card 4: Sentinel Guard Status */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Sentinel Guard Shield</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
              100%
            </span>
            <span className="text-[11px] font-bold text-emerald-400">Zero Breaches</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>24/7 Digital Insurance</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Modules & Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Quick Operations & Venues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Venue Status Banner */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Primary Venue Telemetry
                </span>
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Dubai Cluster
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {activeProfile?.name || 'Awaiting Venue Selection'}
              </h3>
              <p className="text-xs text-slate-400 max-w-lg">
                {activeProfile?.address || 'Connect or select an active Google Business Profile in Cockpit to stream real-time ranking audits.'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <Link
                href="/admin/venues"
                className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                Fleet Manager
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors shadow-md shadow-blue-600/20"
              >
                Open Cockpit
              </Link>
            </div>
          </div>

          {/* Quick Management Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/queue"
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <ListTodo className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="mt-3 font-bold text-sm text-white">Autopilot Action Queue</h4>
              <p className="mt-1 text-xs text-slate-400">
                Review and bulk-approve AI recommendations, sentiment-analyzed review replies, and spatial updates.
              </p>
            </Link>

            <Link
              href="/admin/sentinel"
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="mt-3 font-bold text-sm text-white">Sentinel Guard Center</h4>
              <p className="mt-1 text-xs text-slate-400">
                Zero-trust audit logs, competitor tampering interceptions, and 1-click snapshot restore.
              </p>
            </Link>
          </div>
        </div>

        {/* Right Column: Creem Payments Stream */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm text-white">Creem.io Stream</h3>
              </div>
              <Link
                href="/admin/finance"
                className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading transactions...</div>
            ) : data?.recentTransactions && data.recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {data.recentTransactions.slice(0, 5).map((txn: any) => (
                  <div
                    key={txn.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{txn.id}</div>
                      <div className="text-[10px] text-slate-400">
                        {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-white">
                        {formatMoney(txn.amount || 0)}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        {txn.status || 'paid'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-500">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-300">No test transactions yet</div>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Complete a checkout using the Creem test link or test card to view live transaction events here.
                </p>
                <a
                  href="https://www.creem.io/test/payment/prod_3bo51T7BdP37akU189a4H8"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 pt-1"
                >
                  <span>Open Test Checkout</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
