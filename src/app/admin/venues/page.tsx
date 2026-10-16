'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Star,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Phone,
  Eye,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface VenueProfile {
  id?: string;
  name: string;
  address: string;
  city?: string;
  category?: string;
  phone?: string;
  rating?: number;
  reviews_count?: number;
  verified?: boolean;
  cover_url?: string;
  photo_url?: string;
}

export default function AdminVenuesPage() {
  const [venues, setVenues] = useState<VenueProfile[]>([]);
  const [activeVenue, setActiveVenue] = useState<VenueProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'VERIFIED' | 'NEEDS_ATTENTION'>('ALL');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedActive = localStorage.getItem('gbpilot_active_profile');
      const storedList = localStorage.getItem('gbpilot_available_profiles');

      let currentActive: VenueProfile | null = null;
      if (storedActive) {
        try {
          currentActive = JSON.parse(storedActive);
          setActiveVenue(currentActive);
        } catch (e) {}
      }

      let list: VenueProfile[] = [];
      if (storedList) {
        try {
          list = JSON.parse(storedList);
        } catch (e) {}
      }

      if (currentActive && !list.some((v) => v.name === currentActive?.name)) {
        list = [currentActive, ...list];
      }

      setVenues(list);
    }
  }, []);

  const filteredVenues = venues.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.address && v.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.category && v.category.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterMode === 'VERIFIED') return v.verified !== false;
    if (filterMode === 'NEEDS_ATTENTION') return (v.rating || 5) < 4.5 || !v.verified;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Venues Fleet Manager
            </h1>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {venues.length} Locations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centrally monitor Google Business Profiles, spatial Geo-Grid matrix ranks, and verified sync credentials.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/onboarding"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Connect New Venue</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search venue by name, address, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              filterMode === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All ({venues.length})
          </button>
          <button
            onClick={() => setFilterMode('VERIFIED')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              filterMode === 'VERIFIED'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Verified Only
          </button>
        </div>
      </div>

      {/* Venues Grid / Table */}
      {filteredVenues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVenues.map((venue, idx) => (
            <div
              key={venue.id || venue.name + idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white line-clamp-1">{venue.name}</h4>
                      <span className="text-[11px] text-slate-400">{venue.category || 'Local Business'}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    #1.4 Top 3
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{venue.address || 'Address registered on Google'}</span>
                  </div>
                  {venue.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{venue.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{venue.rating ? venue.rating.toFixed(1) : '5.0'}</span>
                    </div>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-medium">{venue.reviews_count ?? 0} reviews</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <Link
                  href="/dashboard"
                  className="flex-1 text-center px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Inspect Cockpit
                </Link>
                <Link
                  href="/geo-grid"
                  className="flex-1 text-center px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors shadow-sm"
                >
                  3x3 Geo-Radar
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No active venues found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Connect an authentic Google Business Profile in onboarding or select your venue in the Cockpit.
          </p>
          <div className="pt-2">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-600/20"
            >
              <span>Launch Onboarding Flow</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
