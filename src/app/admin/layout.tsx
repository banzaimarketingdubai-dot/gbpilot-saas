'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  Building2,
  ListTodo,
  ShieldAlert,
  Settings,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  Menu,
  X,
  Compass,
  ArrowUpRight
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<{ mode: string; live: boolean }>({
    mode: 'test',
    live: false,
  });

  useEffect(() => {
    fetch('/api/v1/admin/payments/analytics')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setGatewayStatus({
            mode: data.mode || 'test',
            live: data.mode === 'live',
          });
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    {
      name: 'Pulse Overview',
      href: '/admin',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      name: 'Finance & Creem.io',
      href: '/admin/finance',
      icon: CreditCard,
      badge: 'MoR',
    },
    {
      name: 'Venues Fleet',
      href: '/admin/venues',
      icon: Building2,
      badge: null,
    },
    {
      name: 'Autopilot Queue',
      href: '/admin/queue',
      icon: ListTodo,
      badge: 'AI',
    },
    {
      name: 'Sentinel Guard',
      href: '/admin/sentinel',
      icon: ShieldAlert,
      badge: 'Shield',
    },
    {
      name: 'Settings & Keys',
      href: '/admin/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
            GB
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            GBPilot <span className="text-blue-400 font-semibold text-xs ml-1">Admin</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between px-2 pt-1">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                  GBPilot
                  <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-500/20">
                    MASTER
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Enterprise Control Panel</div>
              </div>
            </Link>
          </div>

          {/* Gateway Status Badge */}
          <div className="mx-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-semibold text-[11px]">Creem Gateway</span>
            </div>
            <span
              className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                gatewayStatus.live
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {gatewayStatus.mode} mode
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Management Modules
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Info & Client Switcher */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Quick Client Links
          </div>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                <span>Client Cockpit</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
            <Link
              href="/b2b"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Landing & Pricing</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800/80 px-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>GBPilot v1.0 Enterprise</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3 h-3" /> Secure
            </span>
          </div>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}
