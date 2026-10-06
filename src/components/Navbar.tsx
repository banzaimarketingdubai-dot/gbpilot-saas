'use client';

import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

interface BusinessProfile {
  name: string;
  address: string;
  autopilotMode: string;
}

interface NavbarProps {
  currentProfile?: BusinessProfile;
  onAutopilotToggle?: (mode: 'OFF' | 'MANUAL_APPROVAL' | 'FULL_AUTOPILOT') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentProfile = { name: 'Manhattan Bakery & Cafe', address: '540 Broadway, New York, NY', autopilotMode: 'MANUAL_APPROVAL' }, 
  onAutopilotToggle 
}) => {
  const pathname = usePathname();
  const [autopilotMode, setAutopilotMode] = useState<string>(currentProfile.autopilotMode);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string>(currentProfile.name);

  const availableProfiles = [
    { name: 'Manhattan Bakery & Cafe', city: 'New York, NY' },
    { name: 'Downtown Coffee Hub', city: 'Brooklyn, NY' },
    { name: 'Austin Sourdough Lab', city: 'Austin, TX' }
  ];

  const navItems = [
    { id: 'nav-action-hub', label: 'Action Hub', href: '/dashboard', icon: Zap },
    { id: 'nav-ai-copilot', label: 'AI Copilot', href: '/copilot', icon: Bot, badge: 'GPT-4o' },
    { id: 'nav-geo-grid', label: 'Geo-Grid Radar', href: '/geo-grid', icon: MapPin },
    { id: 'nav-reviews-posts', label: 'Reviews & Posts', href: '/reviews-posts', icon: MessageSquare },
    { id: 'nav-lead-outreach', label: 'Lead Outreach', href: '/outreach', icon: Target },
    { id: 'nav-onboarding', label: 'Onboarding', href: '/onboarding', icon: Compass },
    { id: 'nav-b2b', label: 'B2B Services', href: '/b2b', icon: Sparkles },
  ];

  const handleModeChange = (mode: 'OFF' | 'MANUAL_APPROVAL' | 'FULL_AUTOPILOT') => {
    setAutopilotMode(mode);
    setIsDropdownOpen(false);
    if (onAutopilotToggle) onAutopilotToggle(mode);
  };

  return (
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
                  MAPS COPILOT
                </span>
              </span>
            </div>
          </Link>

          {/* Business Location Selector Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              data-testid="location-selector"
              className="flex items-center space-x-2 bg-google-bg border border-google-border px-3 py-1.5 rounded-lg text-xs hover:bg-white transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-google-blue" />
              <span className="font-semibold text-google-text-primary">{selectedProfile}</span>
              <ChevronDown className="w-3.5 h-3.5 text-google-text-tertiary" />
            </button>

            {isLocationOpen && (
              <div 
                data-testid="location-dropdown-menu" 
                className="absolute left-0 mt-2 w-64 bg-white rounded-xl border border-google-border p-1.5 shadow-material-2 z-50 text-xs"
              >
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-google-text-tertiary border-b border-google-border-light">
                  Active Business Location
                </div>
                {availableProfiles.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedProfile(p.name);
                      setIsLocationOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between font-medium mt-1 ${
                      selectedProfile === p.name ? 'bg-google-blue-light text-google-blue font-bold' : 'text-google-text-primary hover:bg-google-bg'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-[10px] text-google-text-tertiary">{p.city}</span>
                  </button>
                ))}
                <Link
                  href="/onboarding"
                  onClick={() => setIsLocationOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg flex items-center space-x-1.5 text-google-blue hover:bg-google-blue-light font-bold mt-1 border-t border-google-border-light pt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Connect New Location</span>
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Desktop Navigation Tabs */}
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

        {/* Right Autopilot Controls */}
        <div className="flex items-center space-x-3">
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
    </header>
  );
};

