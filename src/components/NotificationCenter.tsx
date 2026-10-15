'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  X, 
  Check, 
  ShieldAlert, 
  TrendingDown, 
  Star, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Trash2,
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  category: 'RANK_ALERT' | 'REVIEW_ALERT' | 'SHIELD_ALERT' | 'OPPORTUNITY' | 'PACING_ALERT';
  urgency: 'critical' | 'high' | 'medium' | 'low' | 'resolved';
  title: string;
  impact: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
  onAction?: () => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'RANK_ALERT',
    urgency: 'critical',
    title: 'Competitor passed you at Main Crossroad',
    impact: '-$380/wk projected walk-in revenue loss',
    description: 'Nearest competitor updated photo menu and overtook #1 position for "breakfast cafe" within 300m radius.',
    timestamp: '12m ago',
    read: false,
    actionLabel: 'Inspect Geo-Grid',
    actionUrl: '/geo-grid'
  },
  {
    id: 'notif-2',
    category: 'REVIEW_ALERT',
    urgency: 'high',
    title: 'New 5★ review awaiting LSI response',
    impact: '+14% local ranking boost signal',
    description: 'Guest Omar left a 5★ review with dining photo. Semi-automated response prepared with local area keywords.',
    timestamp: '35m ago',
    read: false,
    actionLabel: 'Review & Copy Reply',
    actionUrl: '/reviews-posts'
  },
  {
    id: 'notif-3',
    category: 'SHIELD_ALERT',
    urgency: 'resolved',
    title: 'Malicious hours edit intercepted',
    impact: '$1,800 weekend revenue protected',
    description: 'Third-party user suggested "Closed on Friday". Defense Shield auto-reverted change in 3 mins and locked profile.',
    timestamp: '2h ago',
    read: false,
    actionLabel: 'View Defense Dossier',
    actionUrl: '/dashboard'
  },
  {
    id: 'notif-4',
    category: 'OPPORTUNITY',
    urgency: 'medium',
    title: 'Evening search surge approaching',
    impact: '+45 projected walk-in requests',
    description: 'Local searches for "Open Now" spike by 3.2x starting at 18:00. Shift Google Maps hours to capture top 3 placement.',
    timestamp: '4h ago',
    read: true,
    actionLabel: 'Review Daily Plan',
    actionUrl: '/dashboard'
  },
  {
    id: 'notif-5',
    category: 'PACING_ALERT',
    urgency: 'low',
    title: 'Weekly review velocity: 100% Safe',
    impact: 'Zero Google spam filter risk',
    description: '3 reviews collected this week against safe cap of 6/week. Pacing velocity is completely organic.',
    timestamp: '1d ago',
    read: true,
    actionLabel: 'View Speedometer',
    actionUrl: '/reviews-posts'
  }
];

interface NotificationCenterProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'CRITICAL'>('ALL');

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  // Load notifications from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gbpilot_notifications');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNotifications(parsed);
            return;
          }
        } catch (e) {
          console.error('Failed to parse notifications from storage', e);
        }
      }
      setNotifications(DEFAULT_NOTIFICATIONS);
      localStorage.setItem('gbpilot_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
    }
  }, []);

  // Save to storage and dispatch unread count event
  useEffect(() => {
    if (notifications.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('gbpilot_notifications', JSON.stringify(notifications));
      const unreadCount = notifications.filter(n => !n.read).length;
      window.dispatchEvent(new CustomEvent('unread_notifications_count_updated', {
        detail: { count: unreadCount }
      }));
    }
  }, [notifications]);

  // Listen to open_notification_center custom event
  useEffect(() => {
    const handleOpenEvent = () => setInternalIsOpen(true);
    window.addEventListener('open_notification_center', handleOpenEvent);
    return () => window.removeEventListener('open_notification_center', handleOpenEvent);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbpilot_notifications', JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('unread_notifications_count_updated', {
        detail: { count: 0 }
      }));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.urgency === 'critical' || n.urgency === 'high').length;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'UNREAD') return !n.read;
    if (activeTab === 'CRITICAL') return n.urgency === 'critical' || n.urgency === 'high';
    return true;
  });

  if (!isOpen) return null;

  const getCategoryBadge = (category: NotificationItem['category'], urgency: NotificationItem['urgency']) => {
    switch (category) {
      case 'RANK_ALERT':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-google-red border border-rose-200">
            <TrendingDown className="w-3 h-3 text-google-red" />
            Rank Alert
          </span>
        );
      case 'REVIEW_ALERT':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-google-blue border border-blue-200">
            <Star className="w-3 h-3 text-google-blue" />
            New Review
          </span>
        );
      case 'SHIELD_ALERT':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Defense Shield
          </span>
        );
      case 'OPPORTUNITY':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            Growth Opportunity
          </span>
        );
      case 'PACING_ALERT':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-500" />
            Speedometer
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-google-blue/10 text-google-blue flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Notification Center
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-google-red text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500">Real-time local ranking and defense alerts</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    className="p-1.5 text-xs text-slate-500 hover:text-google-blue hover:bg-white rounded-lg transition-colors font-medium flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Mark read</span>
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 mt-4 bg-slate-200/60 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`flex-1 py-1 px-2.5 rounded-lg text-center transition-all ${
                  activeTab === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('UNREAD')}
                className={`flex-1 py-1 px-2.5 rounded-lg text-center transition-all ${
                  activeTab === 'UNREAD'
                    ? 'bg-white text-google-blue shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setActiveTab('CRITICAL')}
                className={`flex-1 py-1 px-2.5 rounded-lg text-center transition-all ${
                  activeTab === 'CRITICAL'
                    ? 'bg-white text-google-red shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Critical ({criticalCount})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-3 space-y-2.5">
            {filteredNotifications.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-700">All caught up!</div>
                  <p className="text-xs text-slate-400 mt-1">No alerts matching your current filter.</p>
                </div>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    !notif.read
                      ? 'bg-white border-blue-200/90 shadow-sm ring-1 ring-blue-100'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(notif.category, notif.urgency)}
                      <span className="text-[10px] text-slate-400 font-medium">
                        {notif.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          title="Mark as read"
                          className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        title="Dismiss"
                        className="p-1 text-slate-300 hover:text-google-red hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {notif.title}
                  </h3>

                  {/* Impact Tag (JTBD ROI) */}
                  <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Business Impact: {notif.impact}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {notif.description}
                  </p>

                  {/* 1-Click Action */}
                  {notif.actionLabel && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Pre-engineered AI action
                      </span>
                      {notif.actionUrl ? (
                        <Link
                          href={notif.actionUrl}
                          onClick={() => {
                            markAsRead(notif.id);
                            handleClose();
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-google-blue hover:underline bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                        >
                          <span>{notif.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            markAsRead(notif.id);
                            if (notif.onAction) notif.onAction();
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-google-blue hover:underline bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                        >
                          <span>{notif.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>{notifications.length} total notifications</span>
              <button
                onClick={clearAllNotifications}
                className="text-xs text-google-red font-semibold hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
