'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Zap, 
  MapPin, 
  MessageSquare, 
  Bell, 
  Bot,
  Sparkles
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // Sync unread notification count
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadCount = () => {
        const stored = localStorage.getItem('gbpilot_notifications');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              setUnreadCount(parsed.filter(n => !n.read).length);
            }
          } catch (e) {
            console.error(e);
          }
        }
      };

      loadCount();

      const handleCountUpdate = (e: any) => {
        if (e.detail && typeof e.detail.count === 'number') {
          setUnreadCount(e.detail.count);
        } else {
          loadCount();
        }
      };

      window.addEventListener('unread_notifications_count_updated', handleCountUpdate);
      return () => window.removeEventListener('unread_notifications_count_updated', handleCountUpdate);
    }
  }, []);

  const navItems = [
    {
      id: 'mobile-cockpit',
      label: 'Cockpit',
      href: '/dashboard',
      icon: Zap,
    },
    {
      id: 'mobile-radar',
      label: 'Radar',
      href: '/geo-grid',
      icon: MapPin,
    },
    {
      id: 'mobile-reviews',
      label: 'Reviews',
      href: '/reviews-posts',
      icon: MessageSquare,
    },
    {
      id: 'mobile-alerts',
      label: 'Alerts',
      isAlertsTrigger: true,
      icon: Bell,
    },
    {
      id: 'mobile-copilot',
      label: 'Copilot',
      href: '/copilot',
      icon: Bot,
    },
  ];

  const handleOpenAlerts = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open_notification_center'));
    }
  };

  return (
    <div 
      data-testid="mobile-bottom-navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-bottom"
    >
      <nav className="grid grid-cols-5 items-center justify-around gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !item.isAlertsTrigger && pathname === item.href;

          if (item.isAlertsTrigger) {
            return (
              <button
                key={item.id}
                onClick={handleOpenAlerts}
                aria-label="Open Notifications"
                data-testid="mobile-nav-alerts"
                className="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all text-slate-600 hover:text-google-blue active:scale-95 relative"
              >
                <div className="relative p-1 rounded-lg">
                  <Icon className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-google-red text-white text-[9px] font-black border-2 border-white shadow-xs animate-in zoom-in duration-200">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold tracking-tight mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href || '#'}
              data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-google-blue font-bold bg-blue-50/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="p-1 rounded-lg">
                <Icon className={`w-5 h-5 ${isActive ? 'text-google-blue' : 'text-slate-500'}`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-google-blue' : 'font-medium text-slate-600'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
