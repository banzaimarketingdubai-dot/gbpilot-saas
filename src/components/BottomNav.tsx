'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Gauge, 
  MapPin, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface BottomNavProps {
  attributesCount?: number;
  unreadReviewsCount?: number;
  threatsCount?: number;
  radarAlertsCount?: number;
}

export function BottomNav({
  attributesCount = 42,
  unreadReviewsCount = 1,
  threatsCount = 0,
  radarAlertsCount = 3
}: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      id: 'cockpit',
      label: 'Cockpit',
      href: '/dashboard',
      icon: Gauge,
      isActive: pathname === '/dashboard' || pathname === '/',
      badge: null
    },
    {
      id: 'radar',
      label: 'Radar',
      href: '/geo-grid',
      icon: MapPin,
      isActive: pathname === '/geo-grid',
      badge: radarAlertsCount > 0 ? (
        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white shadow-xs">
          {radarAlertsCount}
        </span>
      ) : null
    },
    {
      id: 'attributes',
      label: '150 Points',
      href: '/attributes',
      icon: Sparkles,
      isActive: pathname === '/attributes',
      badge: (
        <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-100 text-google-blue border border-blue-200 shadow-xs">
          {attributesCount}/150
        </span>
      )
    },
    {
      id: 'growth',
      label: 'Growth & GEO',
      href: '/reviews-posts',
      icon: MessageSquare,
      isActive: pathname === '/reviews-posts',
      badge: unreadReviewsCount > 0 ? (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
      ) : null
    },
    {
      id: 'bodyguard',
      label: 'Bodyguard',
      href: '/admin/sentinel',
      icon: ShieldCheck,
      isActive: pathname.startsWith('/admin/sentinel'),
      badge: (
        <span className="absolute -top-1 -right-1.5 px-1 py-0.2 rounded-full text-[8px] font-extrabold bg-emerald-500 text-white">
          24/7
        </span>
      )
    }
  ];

  return (
    <nav 
      aria-label="Main Application Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe transition-all"
    >
      <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 min-w-[62px] ${
                active 
                  ? 'text-google-blue font-bold scale-105' 
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <div className={`p-1.5 rounded-xl transition-colors ${
                  active ? 'bg-blue-50 text-google-blue' : 'text-slate-500 hover:bg-slate-100'
                }`}>
                  <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                </div>
                {item.badge}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${
                active ? 'font-black text-google-blue' : 'font-semibold text-slate-500'
              }`}>
                {item.label}
              </span>
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-google-blue mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
