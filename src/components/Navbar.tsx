'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Zap, 
  Bot, 
  MapPin, 
  MessageSquare, 
  Target, 
  ChevronDown,
  ShieldCheck,
  Building2,
  Compass,
  Map,
  Menu,
  X,
  Plus,
  Sparkles,
  Trash2,
  Bell
} from 'lucide-react';
import { NotificationCenter } from '@/components/NotificationCenter';
import { MobileBottomNav } from '@/components/MobileBottomNav';

interface BusinessProfile {
  id?: string;
  name: string;
  address?: string;
  city?: string;
  autopilotMode?: string;
  role?: string;
  is_admin?: boolean;
  verified?: boolean;
}

interface GoogleUser {
  email: string;
  name?: string;
  picture?: string;
  role?: string;
  loggedIn: boolean;
}

interface NavbarProps {
  currentProfile?: BusinessProfile;
  onAutopilotToggle?: (mode: 'OFF' | 'MANUAL_APPROVAL' | 'FULL_AUTOPILOT') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentProfile: initialProfile, 
  onAutopilotToggle 
}) => {
  const pathname = usePathname();
  const [autopilotMode, setAutopilotMode] = useState<string>('MANUAL_APPROVAL');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  
  const defaultProfile = { name: 'Connect Business Profile', address: '', autopilotMode: 'MANUAL_APPROVAL' };
  const [activeProfile, setActiveProfile] = useState<BusinessProfile>(initialProfile || defaultProfile);
  const [selectedProfile, setSelectedProfile] = useState<string>(activeProfile.name);

  const [availableProfiles, setAvailableProfiles] = useState<BusinessProfile[]>([]);
  const isLandingMode = (pathname === '/' || pathname === '/onboarding') && !currentUser;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadCount = () => {
        const stored = localStorage.getItem('gbpilot_notifications');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              setUnreadNotificationCount(parsed.filter(n => !n.read).length);
            }
          } catch (e) {
            console.error(e);
          }
        }
      };

      loadCount();

      const handleCountUpdate = (e: any) => {
        if (e.detail && typeof e.detail.count === 'number') {
          setUnreadNotificationCount(e.detail.count);
        } else {
          loadCount();
        }
      };

      const handleOpenNotifs = () => setIsNotificationCenterOpen(true);

      window.addEventListener('unread_notifications_count_updated', handleCountUpdate);
      window.addEventListener('open_notification_center', handleOpenNotifs);

      return () => {
        window.removeEventListener('unread_notifications_count_updated', handleCountUpdate);
        window.removeEventListener('open_notification_center', handleOpenNotifs);
      };
    }
  }, []);

  useEffect(() => {
    if (initialProfile && initialProfile.name && initialProfile.name !== 'Manhattan Bakery & Cafe') {
      setActiveProfile(initialProfile);
      setSelectedProfile(initialProfile.name);
    }
  }, [initialProfile]);

  useEffect(() => {
    const handleProfileSync = () => {
      const storedActive = localStorage.getItem('gbpilot_active_profile');
      if (storedActive) {
        try {
          const parsed = JSON.parse(storedActive);
          if (parsed && parsed.name) {
            setActiveProfile(parsed);
            setSelectedProfile(parsed.name);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener('active_profile_updated', handleProfileSync);
    return () => window.removeEventListener('active_profile_updated', handleProfileSync);
  }, []);

  useEffect(() => {
    // Load active and available profiles from local storage
    if (typeof window !== 'undefined') {
      const storedActive = localStorage.getItem('gbpilot_active_profile');
      const storedList = localStorage.getItem('gbpilot_available_profiles');

      let parsedList: BusinessProfile[] = [];
      if (storedList) {
        try {
          const list = JSON.parse(storedList);
          if (Array.isArray(list) && list.length > 0) {
            parsedList = list.filter(p => p.name !== 'Manhattan Bakery & Cafe');
            setAvailableProfiles(parsedList);
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (storedActive) {
        try {
          const parsed = JSON.parse(storedActive);
          if (parsed.name === 'Manhattan Bakery & Cafe' && parsedList.length > 0) {
            setActiveProfile(parsedList[0]);
            setSelectedProfile(parsedList[0].name);
            localStorage.setItem('gbpilot_active_profile', JSON.stringify(parsedList[0]));
          } else if (parsed.name !== 'Manhattan Bakery & Cafe') {
            setActiveProfile(parsed);
            setSelectedProfile(parsed.name);
            setAutopilotMode(parsed.autopilotMode || 'MANUAL_APPROVAL');
          }
          
          setAvailableProfiles(prev => {
            const exists = prev.find(p => p.name === parsed.name);
            if (!exists && parsed.name !== 'Manhattan Bakery & Cafe') {
              return [parsed, ...prev];
            }
            return prev;
          });
        } catch (e) {
          console.error(e);
        }
      } else if (parsedList.length > 0) {
        setActiveProfile(parsedList[0]);
        setSelectedProfile(parsedList[0].name);
        localStorage.setItem('gbpilot_active_profile', JSON.stringify(parsedList[0]));
      }

      // Load current user from storage
      const storedUser = localStorage.getItem('gbpilot_user');
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u.loggedIn) setCurrentUser(u);
        } catch (e) {
          console.error(e);
        }
      }

      const handleUserUpdate = () => {
        const s = localStorage.getItem('gbpilot_user');
        if (s) {
          try { setCurrentUser(JSON.parse(s)); } catch (e) {}
        } else {
          setCurrentUser(null);
        }
      };
      window.addEventListener('user_session_updated', handleUserUpdate);

      // Also fetch profiles from backend
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      fetch(`${baseUrl}/api/v1/profiles`)
        .then(res => res.json())
        .then(data => {
          if (data?.profiles && Array.isArray(data.profiles) && data.profiles.length > 0) {
            setAvailableProfiles(prev => {
              const combined = [...prev];
              data.profiles.forEach((p: any) => {
                if (!combined.some(c => c.name === p.name || c.id === p.id)) {
                  combined.push(p);
                }
              });
              localStorage.setItem('gbpilot_available_profiles', JSON.stringify(combined));
              return combined;
            });
            const stored = localStorage.getItem('gbpilot_active_profile');
            if (!stored || JSON.parse(stored).name === 'Manhattan Bakery & Cafe') {
              setActiveProfile(data.profiles[0]);
              setSelectedProfile(data.profiles[0].name);
              localStorage.setItem('gbpilot_active_profile', JSON.stringify(data.profiles[0]));
            }
          }
        })
        .catch(e => console.error("Could not fetch profiles from backend", e));

      return () => window.removeEventListener('user_session_updated', handleUserUpdate);
    }
  }, []);

  const handleGoogleLogin = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.gbpilot.top';
    const loginUrl = `${baseUrl}/api/v1/auth/google/login?origin=${encodeURIComponent(origin)}&redirect_url=${encodeURIComponent(origin)}&state=${encodeURIComponent(origin)}`;
    try {
      const res = await fetch(`${loginUrl}&raw_json=true`);
      if (res.ok) {
        const data = await res.json();
        if (data?.auth_url) {
          window.location.href = data.auth_url;
          return;
        }
      }
    } catch (e) {
      console.error("Direct auth fetch failed", e);
    }
    window.location.href = loginUrl;
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gbpilot_user');
      setCurrentUser(null);
      setIsUserMenuOpen(false);
      window.dispatchEvent(new CustomEvent('user_session_updated'));
      window.location.reload();
    }
  };

  const confirmDelete = async () => {
    if (!profileToDelete) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      await fetch(`${baseUrl}/api/v1/profiles/${profileToDelete}`, { method: 'DELETE' });
    } catch (e) {
      console.error("Failed to delete from DB", e);
    }
    localStorage.removeItem('gbpilot_active_profile');
    window.location.href = '/onboarding';
  };

  const navItems: { id: string; label: string; href: string; icon: any; badge?: string }[] = [
    { id: 'nav-dashboard', label: '⚡ Cockpit', href: '/dashboard', icon: Zap },
    { id: 'nav-radar', label: '🎯 Radar', href: '/geo-grid', icon: Target },
    { id: 'nav-shield', label: '🛡️ Shield & Reviews', href: '/reviews-posts', icon: ShieldCheck },
    { id: 'nav-copilot', label: '🤖 Copilot', href: '/copilot', icon: Bot },
    { id: 'nav-b2b', label: '🇦🇪 Pricing', href: '/b2b', icon: Sparkles },
  ];

  const handleModeChange = (mode: 'OFF' | 'MANUAL_APPROVAL' | 'FULL_AUTOPILOT') => {
    setAutopilotMode(mode);
    setIsDropdownOpen(false);
    if (onAutopilotToggle) onAutopilotToggle(mode);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-google-border shadow-sm px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Profile Dropdown */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-button"
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-2 rounded-lg text-google-text-secondary hover:text-google-blue hover:bg-google-bg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" data-testid="nav-brand-logo" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-full bg-google-blue flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-google-text-primary flex items-center">
                GB<span className="text-google-blue">Pilot</span>
                <span className="ml-2 px-2 py-0.5 text-[9px] font-bold tracking-wider bg-google-blue-light text-google-blue rounded-md border border-google-blue/20 whitespace-nowrap hidden sm:inline-block">
                  🇦🇪 DUBAI AI COPILOT
                </span>
              </span>
            </div>
          </Link>

          {/* Business Location Selector Dropdown - Only for authenticated users or internal pages */}
          {(!isLandingMode || currentUser) && (
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  if (!currentUser) {
                    window.dispatchEvent(new CustomEvent('require_google_login'));
                    return;
                  }
                  setIsLocationOpen(!isLocationOpen);
                }}
                data-testid="location-selector"
                className="flex items-center space-x-2 bg-google-bg border border-google-border px-3 py-1.5 rounded-lg text-xs hover:bg-white transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-google-blue" />
                <span className="font-semibold text-google-text-primary max-w-[130px] truncate">{selectedProfile}</span>
                {currentUser ? (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200 hidden sm:inline-block">
                    {((activeProfile as any)?.role || '').toLowerCase().includes('own') || ((activeProfile as any)?.role || '').includes('\u0412\u043b\u0430\u0434\u0435\u043b\u0435\u0446') ? 'Owner' : 'Manager'}
                  </span>
                ) : (
                  <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-200 hidden sm:inline-block">
                    Demo
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-google-text-tertiary" />
              </button>

              {isLocationOpen && (
                <div 
                  data-testid="location-dropdown-menu" 
                  className="absolute left-0 mt-2 w-72 bg-white rounded-xl border border-google-border p-1.5 shadow-material-2 z-50 text-xs"
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-google-text-tertiary border-b border-google-border-light flex items-center justify-between">
                    <span>Your Businesses ({availableProfiles.length})</span>
                    <span className="text-emerald-600 font-bold">Google Verified</span>
                  </div>
                  {availableProfiles.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between mt-1 rounded-lg hover:bg-google-bg transition-colors group pr-1">
                      <button
                        onClick={() => {
                          setSelectedProfile(p.name);
                          setActiveProfile(p);
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('gbpilot_active_profile', JSON.stringify(p));
                            window.location.reload();
                          }
                          setIsLocationOpen(false);
                        }}
                        className={`flex-1 text-left px-3 py-2 flex items-center justify-between font-medium ${
                          selectedProfile === p.name ? 'text-google-blue font-bold bg-google-blue-light/20' : 'text-google-text-primary'
                        }`}
                      >
                        <div className="truncate max-w-[150px]">
                          <div className="truncate font-semibold">{p.name}</div>
                          <div className="text-[10px] text-google-text-tertiary truncate">{p.city || p.address}</div>
                        </div>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold shrink-0 ml-1">
                          {(p.role || '').toLowerCase().includes('own') || (p.role || '').includes('\u0412\u043b\u0430\u0434\u0435\u043b\u0435\u0446') ? 'Owner' : 'Manager'}
                        </span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!p.id) {
                            alert("No ID to delete");
                            return;
                          }
                          setProfileToDelete(p.id);
                          setIsLocationOpen(false);
                        }}
                        className="p-1.5 text-google-text-tertiary hover:text-google-red hover:bg-google-red-light rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete business"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLocationOpen(false);
                      if (!currentUser) {
                        window.dispatchEvent(new CustomEvent('require_google_login'));
                        return;
                      }
                      window.dispatchEvent(new CustomEvent('open_user_profile_modal'));
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg flex items-center space-x-1.5 text-google-blue hover:bg-google-blue-light font-bold mt-1 border-t border-google-border-light pt-2 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>🏢 Manage Businesses in Profile</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Desktop Navigation Tabs */}
        {isLandingMode ? (
          <nav className="hidden lg:flex items-center space-x-2">
            <a 
              href="#triad"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-google-blue hover:bg-slate-50 transition-colors"
            >
              ⚡ Operational Triad
            </a>
            <a 
              href="#takedown"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-google-red hover:bg-slate-50 transition-colors"
            >
              🛡️ Review Takedown™
            </a>
            <a 
              href="#pricing"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-google-blue hover:bg-slate-50 transition-colors"
            >
              🇦🇪 Dubai Pricing
            </a>
          </nav>
        ) : (
          <nav className="hidden lg:flex items-center space-x-1 bg-google-bg border border-google-border p-1 rounded-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-testid={item.id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                    isActive
                      ? 'bg-white text-google-blue shadow-sm font-semibold border border-google-border-light'
                      : 'text-google-text-secondary hover:text-google-text-primary hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-google-blue' : 'text-google-text-tertiary'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-google-blue-light text-google-blue font-bold px-1.5 py-0.2 rounded font-mono">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Controls: Notification Bell + Autopilot + Google Auth Profile */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Notification Center Trigger Bell */}
          <button
            onClick={() => setIsNotificationCenterOpen(true)}
            aria-label="Open notifications"
            data-testid="navbar-notifications-bell"
            className="relative p-2 text-slate-600 hover:text-google-blue hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-slate-600 hover:text-google-blue" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-google-red text-white text-[9px] font-black border-2 border-white shadow-xs animate-in zoom-in duration-150">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>

          {!isLandingMode && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                data-testid="autopilot-dropdown"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-google-bg border border-google-border hover:bg-white transition-colors"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-google-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-google-green"></span>
                </span>
                <span className="text-google-text-secondary hidden sm:inline">Autopilot:</span>
                <span className="text-google-green font-bold uppercase">
                  {autopilotMode.replace('_', ' ')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-google-text-tertiary" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div 
                  data-testid="autopilot-dropdown-menu"
                  className="absolute right-0 mt-2 w-60 bg-white rounded-xl border border-google-border p-1.5 shadow-material-2 z-50 text-xs"
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-google-text-tertiary border-b border-google-border-light">
                    Autopilot Strategy Mode
                  </div>
                  <button
                    onClick={() => handleModeChange('MANUAL_APPROVAL')}
                    data-testid="mode-manual-approval"
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between font-medium mt-1 ${
                      autopilotMode === 'MANUAL_APPROVAL' ? 'bg-google-blue-light text-google-blue font-semibold' : 'text-google-text-primary hover:bg-google-bg'
                    }`}
                  >
                    <span>Manual Approval (1-Click)</span>
                    {autopilotMode === 'MANUAL_APPROVAL' && <ShieldCheck className="w-4 h-4 text-google-blue" />}
                  </button>

                  <button
                    onClick={() => handleModeChange('FULL_AUTOPILOT')}
                    data-testid="mode-full-autopilot"
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between font-medium ${
                      autopilotMode === 'FULL_AUTOPILOT' ? 'bg-google-green-light text-google-green font-semibold' : 'text-google-text-primary hover:bg-google-bg'
                    }`}
                  >
                    <span>100% Full Autopilot</span>
                    {autopilotMode === 'FULL_AUTOPILOT' && <ShieldCheck className="w-4 h-4 text-google-green" />}
                  </button>

                  <button
                    onClick={() => handleModeChange('OFF')}
                    data-testid="mode-off"
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between font-medium ${
                      autopilotMode === 'OFF' ? 'bg-google-red-light text-google-red font-semibold' : 'text-google-text-primary hover:bg-google-bg'
                    }`}
                  >
                    <span>Paused / Off</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Google User Profile or Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 bg-slate-50 hover:bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs transition-colors shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-google-blue text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <span className="font-semibold text-slate-800 max-w-[110px] truncate hidden sm:inline">
                  {currentUser.email.split('@')[0]}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 p-1.5 shadow-material-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900 truncate">{currentUser.email}</div>
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Google Business: Owner
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      window.dispatchEvent(new CustomEvent('open_user_profile_modal'));
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg font-medium text-slate-700 flex items-center gap-2 mt-1"
                  >
                    <Building2 className="w-3.5 h-3.5 text-google-blue" />
                    <span>My GBP Businesses ({availableProfiles.length})</span>
                  </button>
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-600 flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                    <span>Switch Google Account</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg font-medium flex items-center gap-2 border-t border-slate-100 mt-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 shadow-sm transition-all hover:shadow"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div data-testid="mobile-menu-drawer" className="lg:hidden border-t border-google-border-light mt-2 pt-3 pb-2 space-y-1">
          <div className="px-3 text-[10px] font-bold text-google-text-tertiary uppercase tracking-wider mb-2">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`mobile-${item.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  isActive 
                    ? 'bg-google-blue-light text-google-blue border border-google-blue/20'
                    : 'text-google-text-primary hover:bg-google-bg'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-google-blue' : 'text-google-text-tertiary'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] bg-google-blue-light text-google-blue font-bold px-1.5 py-0.5 rounded font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {profileToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-material-3 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-google-red-light rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-google-red" />
              </div>
              <h3 className="text-xl font-bold text-google-text-primary mb-2">Delete Workspace?</h3>
              <p className="text-sm text-google-text-secondary mb-6">
                Are you absolutely sure you want to delete this business profile? This action cannot be undone and will permanently erase all AI analysis and geo-grid history.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setProfileToDelete(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-google-border text-sm font-bold text-google-text-primary hover:bg-google-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-google-red hover:bg-google-red-dark text-white text-sm font-bold transition-colors"
                >
                  Yes, Delete It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>

    {/* Slide-over Actionable Notification Center Drawer */}
    <NotificationCenter 
      isOpen={isNotificationCenterOpen} 
      onClose={() => setIsNotificationCenterOpen(false)} 
    />

    {/* Persistent Mobile Bottom Navigation (Visible only on mobile/tablet) */}
    {!isLandingMode && <MobileBottomNav />}
  </>
  );
};

