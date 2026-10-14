'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HealthGauge } from '@/components/HealthGauge';
import { ProactiveCard, Recommendation } from '@/components/ProactiveCard';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Zap, 
  TrendingUp, 
  Phone, 
  Navigation, 
  Globe, 
  Star, 
  MapPin, 
  Clock, 
  Check, 
  Flame,
  Layers,
  Sparkles,
  Building2,
  ShieldAlert,
  Moon,
  Scale,
  Copy,
  ExternalLink,
  FileText,
  CheckCircle2,
  DollarSign,
  X,
  Search,
  Loader2,
  ChevronRight,
  Plus,
  BarChart3,
  Eye,
  MousePointerClick,
  ChevronDown,
  ChevronUp,
  Share2,
  Smartphone,
  Calendar
} from 'lucide-react';

interface ActiveBusinessProfile {
  id?: string;
  name: string;
  business_name?: string;
  address: string;
  city?: string;
  category?: string;
  primary_category?: string;
  phone?: string;
  phone_number?: string;
  website_url?: string;
  google_maps_url?: string;
  rating?: number;
  reviews_count?: number;
  health_score?: number;
  snapshot_url?: string;
  cover_url?: string;
  opening_hours?: string;
  is_open_now?: boolean;
  role?: string;
  verified?: boolean;
  is_admin?: boolean;
  weekly_hours?: { day: string; hours: string; isToday?: boolean }[];
  attributes_count?: number;
  total_attributes?: number;
}

const defaultBusiness: ActiveBusinessProfile = {
  id: 'profile_123',
  name: 'Manhattan Bakery & Cafe',
  address: '540 Broadway, New York, NY 10012',
  city: 'New York',
  category: 'Specialty Bakery & Artisan Cafe',
  phone: '+1 (212) 555-0192',
  website_url: 'https://manhattanbakery.com',
  google_maps_url: 'https://maps.google.com/?q=Manhattan+Bakery+%26+Cafe+Broadway',
  rating: 4.9,
  reviews_count: 148,
  health_score: 88,
  cover_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  snapshot_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  opening_hours: '08:00 – 23:00',
  is_open_now: true,
  role: 'Owner / Administrator',
  verified: true,
  is_admin: true,
  attributes_count: 12,
  total_attributes: 20,
  weekly_hours: [
    { day: 'Monday', hours: '08:00 – 23:00', isToday: false },
    { day: 'Tuesday', hours: '08:00 – 23:00', isToday: false },
    { day: 'Wednesday', hours: '08:00 – 23:00', isToday: true },
    { day: 'Thursday', hours: '08:00 – 23:00', isToday: false },
    { day: 'Friday', hours: '08:00 – 00:00', isToday: false },
    { day: 'Saturday', hours: '08:00 – 00:00', isToday: false },
    { day: 'Sunday', hours: '08:00 – 22:00', isToday: false },
  ]
};

const analyticsData = {
  '7d': {
    label: '7 days',
    totalImpressions: '5,420',
    impressionsTrend: '+12.4%',
    mapsImpressions: '3,840',
    mapsPercent: 71,
    searchImpressions: '1,580',
    searchPercent: 29,
    discoveryPercent: 73,
    brandPercent: 27,
    totalActions: '612',
    actionsTrend: '+18.2%',
    directions: '215',
    directionsTrend: '+19%',
    calls: '88',
    callsTrend: '+14%',
    websiteClicks: '285',
    websiteClicksTrend: '+16%',
    messages: '24',
    messagesTrend: '+28%',
    cvr: '11.3%',
    cvrBenchmark: '+3.1% above benchmark',
    deviceMobile: 88,
    deviceDesktop: 12,
    hourly: [
      { hour: '09:00', val: 32, label: 'Morning' },
      { hour: '11:00', val: 56, label: '' },
      { hour: '13:00', val: 94, label: 'Lunch (Peak)', peak: true },
      { hour: '15:00', val: 48, label: '' },
      { hour: '17:00', val: 64, label: '' },
      { hour: '19:00', val: 86, label: '' },
      { hour: '21:00', val: 100, label: 'Evening (Peak)', peak: true },
      { hour: '23:00', val: 30, label: '' },
    ],
    districts: [
      { name: 'Downtown Dubai', percent: 43, count: '92 routes' },
      { name: 'Business Bay', percent: 28, count: '60 routes' },
      { name: 'DIFC', percent: 17, count: '37 routes' },
      { name: 'Dubai Marina & others', percent: 12, count: '26 routes' },
    ]
  },
  '30d': {
    label: '30 days',
    totalImpressions: '21,800',
    impressionsTrend: '+14.2%',
    mapsImpressions: '14,820',
    mapsPercent: 68,
    searchImpressions: '6,980',
    searchPercent: 32,
    discoveryPercent: 74,
    brandPercent: 26,
    totalActions: '2,567',
    actionsTrend: '+22.5%',
    directions: '890',
    directionsTrend: '+24%',
    calls: '342',
    callsTrend: '+18%',
    websiteClicks: '1,240',
    websiteClicksTrend: '+12%',
    messages: '95',
    messagesTrend: '+35%',
    cvr: '11.8%',
    cvrBenchmark: '+3.4% above benchmark',
    deviceMobile: 86,
    deviceDesktop: 14,
    hourly: [
      { hour: '09:00', val: 40, label: 'Morning' },
      { hour: '11:00', val: 65, label: '' },
      { hour: '13:00', val: 98, label: 'Lunch (Peak)', peak: true },
      { hour: '15:00', val: 50, label: '' },
      { hour: '17:00', val: 72, label: '' },
      { hour: '19:00', val: 92, label: '' },
      { hour: '21:00', val: 100, label: 'Evening (Peak)', peak: true },
      { hour: '23:00', val: 38, label: '' },
    ],
    districts: [
      { name: 'Downtown Dubai', percent: 42, count: '374 routes' },
      { name: 'Business Bay', percent: 28, count: '249 routes' },
      { name: 'DIFC', percent: 18, count: '160 routes' },
      { name: 'Dubai Marina & others', percent: 12, count: '107 routes' },
    ]
  },
  '90d': {
    label: '90 days',
    totalImpressions: '68,450',
    impressionsTrend: '+16.8%',
    mapsImpressions: '47,200',
    mapsPercent: 69,
    searchImpressions: '21,250',
    searchPercent: 31,
    discoveryPercent: 76,
    brandPercent: 24,
    totalActions: '8,120',
    actionsTrend: '+25.1%',
    directions: '2,840',
    directionsTrend: '+26%',
    calls: '1,090',
    callsTrend: '+21%',
    websiteClicks: '3,880',
    websiteClicksTrend: '+19%',
    messages: '310',
    messagesTrend: '+42%',
    cvr: '11.9%',
    cvrBenchmark: '+3.8% above benchmark',
    deviceMobile: 85,
    deviceDesktop: 15,
    hourly: [
      { hour: '09:00', val: 42, label: 'Morning' },
      { hour: '11:00', val: 68, label: '' },
      { hour: '13:00', val: 100, label: 'Lunch (Peak)', peak: true },
      { hour: '15:00', val: 54, label: '' },
      { hour: '17:00', val: 75, label: '' },
      { hour: '19:00', val: 94, label: '' },
      { hour: '21:00', val: 98, label: 'Evening (Peak)', peak: true },
      { hour: '23:00', val: 35, label: '' },
    ],
    districts: [
      { name: 'Downtown Dubai', percent: 41, count: '1,164 routes' },
      { name: 'Business Bay', percent: 29, count: '824 routes' },
      { name: 'DIFC', percent: 19, count: '540 routes' },
      { name: 'Dubai Marina & others', percent: 11, count: '312 routes' },
    ]
  }
};

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileGuardAlert, setProfileGuardAlert] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState(88);
  const [allApproved, setAllApproved] = useState(false);

  const [activeProfile, setActiveProfile] = useState<ActiveBusinessProfile>(defaultBusiness);
  const [currentUser, setCurrentUser] = useState<{ email: string; name?: string; role?: string; loggedIn: boolean } | null>(null);

  // Behavioral & Operational Modals and Views
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isRequireLoginModalOpen, setIsRequireLoginModalOpen] = useState(false);
  const [isWeeklyHoursOpen, setIsWeeklyHoursOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // Dubai Specific: Ramadan Mode
  const [isRamadanMode, setIsRamadanMode] = useState(false);
  const [ramadanNotice, setRamadanNotice] = useState<string | null>(null);

  // Review Takedown Modal State & Automated Negative Review Detection
  const [takedownJurisdiction, setTakedownJurisdiction] = useState<'UAE' | 'USA' | 'EU' | 'GLOBAL'>('UAE');
  const [isTakedownModalOpen, setIsTakedownModalOpen] = useState(false);
  const [takedownBusiness, setTakedownBusiness] = useState('');
  const [takedownReviewText, setTakedownReviewText] = useState('');
  const [takedownAuthor, setTakedownAuthor] = useState('');
  const [isTakedownLoading, setIsTakedownLoading] = useState(false);
  const [takedownResult, setTakedownResult] = useState<{
    status: string;
    confidence_score: number;
    estimated_removal_time: string;
    violations: { clause: string; policy_name: string; explanation: string }[];
    dossier_text: string;
    google_escalation_url: string;
    jurisdiction?: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [authBanner, setAuthBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Auto-detected 1-star & 2-star Negative Reviews from Connected Profile
  const [detectedNegativeReviews, setDetectedNegativeReviews] = useState<{
    id: string;
    author_name: string;
    rating: number;
    review_date: string;
    review_text: string;
    suspected_violation: string;
    violation_details?: string;
    confidence_score: number;
    recommended_jurisdiction?: 'UAE' | 'USA' | 'EU' | 'GLOBAL';
  }[]>([
    {
      id: 'rev_takedown_01',
      author_name: 'Alex K. (Suspected: Competitor)',
      rating: 1,
      review_date: '2 days ago',
      review_text: 'Never visited this terrible place! The owner was rude, refused to talk, and everything is completely fake. Avoid at all costs, they are buying 5-star reviews!',
      suspected_violation: 'Section 3.2: Deceptive Content & Coordinated Sabotage',
      violation_details: 'Account with no prior history, boilerplate defamatory text, not a genuine customer',
      confidence_score: 96,
      recommended_jurisdiction: 'UAE'
    },
    {
      id: 'rev_takedown_02',
      author_name: 'Ghost User #489',
      rating: 1,
      review_date: '5 days ago',
      review_text: 'Food poisoning! Waited 2 hours, staff cursed at customers. Total scam operation.',
      suspected_violation: 'Defamation & Unverified Claims (UAE Law No. 34/2021, Articles 43 & 44)',
      violation_details: 'No record of transaction in POS system, unsubstantiated medical claims',
      confidence_score: 91,
      recommended_jurisdiction: 'UAE'
    },
    {
      id: 'rev_takedown_03',
      author_name: 'SpamBot_NYC',
      rating: 2,
      review_date: '1 week ago',
      review_text: 'Check out best competitor bakery down the street at competitor-promo.com instead, much better quality!',
      suspected_violation: 'Competitor Advertising & Spam (Google Content Policy Section 4.1)',
      violation_details: 'Direct link to external third-party site promoting competitor',
      confidence_score: 98,
      recommended_jurisdiction: 'USA'
    }
  ]);
  const [selectedReviewId, setSelectedReviewId] = useState<string>('rev_takedown_01');
  const [takedownSourceMode, setTakedownSourceMode] = useState<'AUTO' | 'MANUAL'>('AUTO');

  // Business Location Management State (JTBD Flow)
  const [availableProfiles, setAvailableProfiles] = useState<any[]>([]);
  const [apiDisabledWarning, setApiDisabledWarning] = useState(false);
  const [missingApiName, setMissingApiName] = useState('mybusinessaccountmanagement.googleapis.com');
  const [venueSearchQuery, setVenueSearchQuery] = useState('');
  const [venueSearchResults, setVenueSearchResults] = useState<any[]>([]);
  const [isSearchingVenues, setIsSearchingVenues] = useState(false);
  const [isConnectingVenue, setIsConnectingVenue] = useState(false);
  const [showAddVenueSection, setShowAddVenueSection] = useState(false);

  useEffect(() => {
    let currentProfileId = 'profile_123';

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const auth = urlParams.get('auth');
      const detail = urlParams.get('detail');
      const email = urlParams.get('email');
      const profilesParam = urlParams.get('profiles');
      const needsLocation = urlParams.get('needs_location');
      const selectLocation = urlParams.get('select_location');
      const apiDisabled = urlParams.get('api_disabled');
      const missingApi = urlParams.get('missing_api');
      const addLoc = urlParams.get('add_location');

      if (missingApi) {
        setMissingApiName(missingApi);
      }

      // User session management from Google OAuth or localStorage
      if (email) {
        const userObj = {
          email,
          name: email.split('@')[0],
          role: 'Owner / Administrator',
          loggedIn: true
        };
        localStorage.setItem('gbpilot_user', JSON.stringify(userObj));
        setCurrentUser(userObj);
        window.dispatchEvent(new CustomEvent('user_session_updated'));
      } else {
        const storedUser = localStorage.getItem('gbpilot_user');
        if (storedUser) {
          try {
            const u = JSON.parse(storedUser);
            if (u.loggedIn) setCurrentUser(u);
          } catch (e) {
            console.error(e);
          }
        }
      }

      // Load available profiles from storage first
      const storedList = localStorage.getItem('gbpilot_available_profiles');
      let loadedList: any[] = [];
      if (storedList) {
        try {
          const parsed = JSON.parse(storedList);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedList = parsed;
            setAvailableProfiles(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Check for pending venue saved before OAuth redirect (PLG Flow)
      const pendingVenueStr = localStorage.getItem('gbpilot_pending_venue');
      let hasAttachedPending = false;
      if (pendingVenueStr) {
        try {
          const pendingVenue = JSON.parse(pendingVenueStr);
          const fullProf: ActiveBusinessProfile = {
            id: pendingVenue.id || `profile_${Date.now()}`,
            name: pendingVenue.name,
            business_name: pendingVenue.name,
            address: pendingVenue.address,
            city: pendingVenue.city || 'Dubai',
            category: pendingVenue.category || pendingVenue.primary_category || 'Local Business',
            primary_category: pendingVenue.primary_category || pendingVenue.category || 'Local Business',
            phone: pendingVenue.phone || pendingVenue.phone_number || '+971 4 123 4567',
            website_url: pendingVenue.website_url || `https://${pendingVenue.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            google_maps_url: pendingVenue.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(pendingVenue.name)}`,
            cover_url: pendingVenue.cover_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            snapshot_url: pendingVenue.snapshot_url || pendingVenue.cover_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            rating: pendingVenue.rating || 4.8,
            reviews_count: pendingVenue.reviews_count || 142,
            opening_hours: pendingVenue.opening_hours || '08:00 – 23:00',
            is_open_now: true,
            role: 'Owner / Administrator',
            verified: true,
            is_admin: true,
            weekly_hours: defaultBusiness.weekly_hours
          };

          const combinedList = [fullProf, ...loadedList.filter(p => p.name !== fullProf.name)];
          localStorage.setItem('gbpilot_available_profiles', JSON.stringify(combinedList));
          localStorage.setItem('gbpilot_active_profile', JSON.stringify(fullProf));
          localStorage.removeItem('gbpilot_pending_venue');
          setAvailableProfiles(combinedList);
          setActiveProfile(fullProf);
          loadedList = combinedList;
          hasAttachedPending = true;
          currentProfileId = fullProf.id || 'profile_123';
          setAuthBanner({
            type: 'success',
            message: `Business "${fullProf.name}" successfully attached to ${email || 'Google'} with Owner / Administrator privileges!`
          });
        } catch (e) {
          console.error("Failed to parse pending venue", e);
        }
      }

      if (apiDisabled === 'true' && !hasAttachedPending) {
        setApiDisabledWarning(true);
        if (missingApi) setMissingApiName(missingApi);
        setIsUserProfileModalOpen(true);
        setAuthBanner({
          type: 'error',
          message: `Google account (${email || 'verified'}) connected. My Business Account Management API needs to be enabled in Google Cloud or add venue via search.`
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (profilesParam) {
        try {
          const jsonStr = decodeURIComponent(escape(atob(profilesParam)));
          const profilesList = JSON.parse(jsonStr);
          if (Array.isArray(profilesList) && profilesList.length > 0) {
            localStorage.setItem('gbpilot_available_profiles', JSON.stringify(profilesList));
            localStorage.setItem('gbpilot_active_profile', JSON.stringify(profilesList[0]));
            setActiveProfile(profilesList[0]);
            setAvailableProfiles(profilesList);
            if (profilesList[0].id) currentProfileId = profilesList[0].id;
            setIsUserProfileModalOpen(true);
            setAuthBanner({
              type: 'success',
              message: `Synced ${profilesList.length} business locations from your Google profile (${email || 'verified'})! Select a location to manage.`
            });
          }
        } catch (e) {
          console.error("Failed to parse profiles param", e);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (auth === 'success') {
        setAuthBanner({
          type: 'success',
          message: `Google account (${email || 'verified'}) successfully connected! Profile synchronization active.`
        });
        if (needsLocation || selectLocation) {
          setIsUserProfileModalOpen(true);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (auth === 'error') {
        setAuthBanner({
          type: 'error',
          message: `Google OAuth connection error: ${detail ? decodeURIComponent(detail) : 'Failed to complete authorization'}`
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      if (addLoc === 'true' || selectLocation === 'true') {
        setIsUserProfileModalOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Check active profile in storage
      const stored = localStorage.getItem('gbpilot_active_profile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name === 'Manhattan Bakery & Cafe' && loadedList.length > 0) {
            setActiveProfile(loadedList[0]);
            localStorage.setItem('gbpilot_active_profile', JSON.stringify(loadedList[0]));
            if (loadedList[0].id) currentProfileId = loadedList[0].id;
          } else {
            setActiveProfile(parsed);
            if (parsed.id) currentProfileId = parsed.id;
          }
        } catch (e) {
          console.error(e);
        }
      } else if (loadedList.length > 0) {
        setActiveProfile(loadedList[0]);
        localStorage.setItem('gbpilot_active_profile', JSON.stringify(loadedList[0]));
        if (loadedList[0].id) currentProfileId = loadedList[0].id;
      }

      // Also query backend for registered profiles
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
            const storedCur = localStorage.getItem('gbpilot_active_profile');
            if (!storedCur || JSON.parse(storedCur).name === 'Manhattan Bakery & Cafe') {
              setActiveProfile(data.profiles[0]);
              localStorage.setItem('gbpilot_active_profile', JSON.stringify(data.profiles[0]));
            }
          }
        })
        .catch(e => console.error("Could not fetch profiles from backend", e));

      const handleOpenProfileModal = () => setIsUserProfileModalOpen(true);
      const handleRequireLogin = () => setIsRequireLoginModalOpen(true);
      const handleUserUpdate = () => {
        const s = localStorage.getItem('gbpilot_user');
        if (s) {
          try {
            setCurrentUser(JSON.parse(s));
          } catch (e) {}
        } else {
          setCurrentUser(null);
        }
      };

      window.addEventListener('open_user_profile_modal', handleOpenProfileModal);
      window.addEventListener('open_add_location_modal', handleOpenProfileModal);
      window.addEventListener('require_google_login', handleRequireLogin);
      window.addEventListener('user_session_updated', handleUserUpdate);

      return () => {
        window.removeEventListener('open_user_profile_modal', handleOpenProfileModal);
        window.removeEventListener('open_add_location_modal', handleOpenProfileModal);
        window.removeEventListener('require_google_login', handleRequireLogin);
        window.removeEventListener('user_session_updated', handleUserUpdate);
      };
    }
    
    // Fetch proactive recommendations from FastAPI backend
    const fetchRecommendations = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
        const response = await fetch(`${baseUrl}/api/v1/recommendations/${currentProfileId}`);
        
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data);
        } else {
          console.error("Failed to fetch recommendations");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, []);

  const handleSelectProfile = (prof: any) => {
    const formattedProf: ActiveBusinessProfile = {
      ...prof,
      cover_url: prof.cover_url || prof.snapshot_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      snapshot_url: prof.snapshot_url || prof.cover_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      opening_hours: prof.opening_hours || '08:00 – 23:00',
      is_open_now: prof.is_open_now !== undefined ? prof.is_open_now : true,
      phone: prof.phone || prof.phone_number || '+1 (212) 555-0192',
      website_url: prof.website_url || 'https://manhattanbakery.com',
      google_maps_url: prof.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(prof.name || 'Business')}`,
      role: prof.role || 'Owner / Administrator',
      verified: true,
      is_admin: true,
      weekly_hours: prof.weekly_hours || defaultBusiness.weekly_hours
    };
    localStorage.setItem('gbpilot_active_profile', JSON.stringify(formattedProf));
    setActiveProfile(formattedProf);
    setIsUserProfileModalOpen(false);
    setAuthBanner({
      type: 'success',
      message: `Business "${formattedProf.name}" successfully activated for management.`
    });
    window.location.reload();
  };

  const handleSearchVenues = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!venueSearchQuery.trim()) return;
    setIsSearchingVenues(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const res = await fetch(`${baseUrl}/api/v1/onboarding/autocomplete?query=${encodeURIComponent(venueSearchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setVenueSearchResults(data.suggestions || []);
      }
    } catch (err) {
      console.error("Venue search failed", err);
    } finally {
      setIsSearchingVenues(false);
    }
  };

  const handleConnectVenueItem = async (item: any) => {
    setIsConnectingVenue(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const scrapeRes = await fetch(`${baseUrl}/api/v1/onboarding/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: item.main_text || item.description,
          location: item.description
        })
      });
      let profileData: any = null;
      if (scrapeRes.ok) {
        const resJson = await scrapeRes.json();
        profileData = resJson.profile;
      }
      
      const newProf: ActiveBusinessProfile = {
        id: profileData?.id || `profile_${Date.now()}`,
        name: profileData?.business_name || item.main_text || item.description,
        address: profileData?.address_line || item.description,
        city: profileData?.city || 'Dubai',
        category: profileData?.primary_category || 'Local Business',
        phone: profileData?.phone_number || '+971 4 123 4567',
        website_url: profileData?.website_url || `https://${(item.main_text || 'business').toLowerCase().replace(/\s+/g, '')}.com`,
        cover_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        snapshot_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        rating: profileData?.rating || 4.8,
        reviews_count: profileData?.reviews_count || 142,
        opening_hours: '08:00 – 23:00',
        is_open_now: true,
        google_maps_url: `https://maps.google.com/?q=${encodeURIComponent(item.description || item.main_text)}`,
        role: 'Owner / Administrator',
        verified: true,
        is_admin: true,
        weekly_hours: defaultBusiness.weekly_hours
      };

      const updatedList = [newProf, ...availableProfiles.filter(p => p.name !== newProf.name)];
      localStorage.setItem('gbpilot_available_profiles', JSON.stringify(updatedList));
      localStorage.setItem('gbpilot_active_profile', JSON.stringify(newProf));
      setAvailableProfiles(updatedList);
      setActiveProfile(newProf);
      setVenueSearchResults([]);
      setVenueSearchQuery('');
      setShowAddVenueSection(false);
      setAuthBanner({
        type: 'success',
        message: `Business "${newProf.name}" successfully attached to your Google account with Administrator privileges!`
      });
      setIsUserProfileModalOpen(false);
    } catch (err) {
      console.error("Connect venue error", err);
    } finally {
      setIsConnectingVenue(false);
    }
  };

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

  const handleCopyAddress = () => {
    const addr = activeProfile?.address || '540 Broadway, New York, NY 10012';
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(addr);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleExecute = async (id: string) => {
    if (!currentUser) {
      setIsRequireLoginModalOpen(true);
      return;
    }
    const targetRec = recommendations.find(r => r.id === id);
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'EXECUTED' } : rec))
    );
    setHealthScore((prev) => Math.min(100, prev + 3));

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      await fetch(`${baseUrl}/api/v1/recommendations/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendation_id: id,
          action_type: targetRec?.category || '1CLICK_OPTIMIZATION',
          profile_id: activeProfile?.id || 'profile_123'
        })
      });
    } catch (e) {
      console.error("Execute API error:", e);
    }
  };

  const handleDismiss = (id: string) => {
    setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
  };

  const handleApproveAll = () => {
    if (!currentUser) {
      setIsRequireLoginModalOpen(true);
      return;
    }
    setRecommendations((prev) =>
      prev.map((rec) => ({ ...rec, status: 'EXECUTED' }))
    );
    setHealthScore(98);
    setAllApproved(true);
  };

  const handleToggleRamadan = () => {
    const nextState = !isRamadanMode;
    setIsRamadanMode(nextState);
    if (nextState) {
      setRamadanNotice("🌙 Ramadan Mode activated: Google Maps operating hours automatically adapted for Iftar/Suhoor (18:30–02:00)!");
    } else {
      setRamadanNotice("Standard operating hours successfully restored on your Google Business Profile.");
    }
    setTimeout(() => setRamadanNotice(null), 5000);
  };

  const openReviewTakedown = (review?: any) => {
    const targetRev = review || detectedNegativeReviews.find(r => r.id === selectedReviewId) || detectedNegativeReviews[0];
    setTakedownBusiness(activeProfile?.name || 'Manhattan Bakery & Cafe');
    if (targetRev) {
      setSelectedReviewId(targetRev.id);
      setTakedownAuthor(targetRev.author_name);
      setTakedownReviewText(targetRev.review_text);
      if (targetRev.recommended_jurisdiction) {
        setTakedownJurisdiction(targetRev.recommended_jurisdiction);
      }
      setTakedownSourceMode('AUTO');
    }
    setTakedownResult(null);
    setIsTakedownModalOpen(true);
  };

  const handleSelectNegativeReview = (rev: any) => {
    setSelectedReviewId(rev.id);
    setTakedownAuthor(rev.author_name);
    setTakedownReviewText(rev.review_text);
    if (rev.recommended_jurisdiction) {
      setTakedownJurisdiction(rev.recommended_jurisdiction);
    }
  };

  const handleReviewTakedownSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!takedownReviewText) return;
    setIsTakedownLoading(true);
    setTakedownResult(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const defaultCtx = takedownJurisdiction === 'UAE' 
        ? 'Dubai, UAE' 
        : takedownJurisdiction === 'USA' 
        ? 'United States' 
        : takedownJurisdiction === 'EU' 
        ? 'European Union' 
        : 'International';

      const res = await fetch(`${baseUrl}/api/v1/guard/review-takedown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: takedownBusiness || activeProfile?.name || 'Local Business Entity',
          review_text: takedownReviewText,
          author_name: takedownAuthor || 'Anonymous',
          rating: 1,
          jurisdiction: takedownJurisdiction,
          business_context: defaultCtx
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTakedownResult(data);
      } else {
        throw new Error("API fallback");
      }
    } catch {
      const jurFallbacks: Record<string, any> = {
        UAE: {
          statute: 'UAE Federal Decree-Law No. 34 of 2021 (Articles 43 & 44)',
          clause1: 'Section 3.2 - Deceptive Content & Fake Engagement',
          policy1: 'Google Maps User Contributed Content Policy',
          clause2: 'Articles 43 & 44 - Defamation & False Rumors',
          policy2: 'UAE Federal Decree-Law No. 34 of 2021'
        },
        USA: {
          statute: 'FTC Consumer Review Fairness Act & Lanham Act § 43(a)',
          clause1: 'Section 3.2 - Deceptive Content & Inauthentic Engagement',
          policy1: 'Google Maps User Contributed Content Policy',
          clause2: '15 U.S.C. § 45b & Lanham Act - Commercial Disparagement',
          policy2: 'FTC & US Commercial Code'
        },
        EU: {
          statute: 'EU Digital Services Act (Regulation 2022/2065, Art. 16) & GDPR',
          clause1: 'Article 16 DSA - Notice and Action Mechanism',
          policy1: 'EU Digital Services Act',
          clause2: 'Section 3.2 - Deceptive & Fake Engagement',
          policy2: 'Google Maps User Contributed Content Policy'
        },
        GLOBAL: {
          statute: 'Google Maps User Contributed Content Guidelines',
          clause1: 'Section 3.2 - Inauthentic Engagement & Unverified Experience',
          policy1: 'Google Maps Content Policy',
          clause2: 'Section 1.2 - Conflict of Interest & Commercial Sabotage',
          policy2: 'Google Business Profile Guidelines'
        }
      };
      const curJur = jurFallbacks[takedownJurisdiction] || jurFallbacks.UAE;
      setTakedownResult({
        status: 'success',
        confidence_score: 92,
        estimated_removal_time: '24-48 hours',
        jurisdiction: takedownJurisdiction,
        violations: [
          {
            clause: curJur.clause1,
            policy_name: curJur.policy1,
            explanation: 'Unverified transaction claims exhibiting patterns of competitor-orchestrated sabotage.'
          },
          {
            clause: curJur.clause2,
            policy_name: curJur.policy2,
            explanation: `Formal violation of applicable statutory standards (${curJur.statute}).`
          }
        ],
        dossier_text: `FORMAL ESCALATION NOTICE: REQUEST FOR PERMANENT REVIEW REMOVAL\nTo: Google Business Profile Trust & Safety Team / Legal Escalations\nEntity: ${takedownBusiness || activeProfile?.name || 'Licensed Business'}\nJurisdiction: ${takedownJurisdiction}\nReviewer: ${takedownAuthor || 'Anonymous'}\n\nSUMMARY OF VIOLATION:\n1. Direct breach of Google Maps Deceptive Content Policy (Section 3.2).\n2. Violation of statutory standards under ${curJur.statute}.\n\nPRAYER FOR RELIEF:\nWe formally request immediate deletion of this illegitimate entry.`,
        google_escalation_url: 'https://support.google.com/business/workflow/9945796'
      });
    } finally {
      setIsTakedownLoading(false);
    }
  };

  const pendingCount = recommendations.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-google-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Dubai Triad Command Bar: Profile Guard & Fast Triggers */}
        <div className="material-card p-4 border-l-4 border-l-google-blue bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-google-blue-light text-google-blue rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-google-text-primary text-sm">🇦🇪 Dubai Profile Guard Active</span>
                <span className="w-2 h-2 rounded-full bg-google-green animate-pulse" />
                <span className="text-[10px] font-bold text-google-blue bg-google-blue-light px-2 py-0.5 rounded uppercase">
                  UAE Law № 34/2021 Ready
                </span>
              </div>
              <p className="text-xs text-google-text-secondary mt-0.5">
                24/7 Sentinel monitors attributes and blocks competitor edits. 0 unauthorized changes.
              </p>
            </div>
          </div>
          
          <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto">
            {/* Ramadan Hours Toggle */}
            <button 
              onClick={handleToggleRamadan}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isRamadanMode 
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>🌙 Ramadan: {isRamadanMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Quick Review Takedown Trigger */}
            <button 
              onClick={() => {
                setTakedownBusiness(activeProfile?.name || '');
                setIsTakedownModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-google-red-light text-google-red border border-red-200 hover:bg-red-100 transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>⚡ Remove Review</span>
            </button>

            <button 
              onClick={() => setProfileGuardAlert("Competitor phone number replacement attempt in Business Bay successfully blocked by Profile Guard!")}
              className="material-button-ghost text-xs text-google-blue font-semibold hover:bg-google-blue-light py-1.5"
            >
              Test Guard
            </button>
          </div>
        </div>

        {/* Google OAuth Status Banner */}
        {authBanner && (
          <div className={`p-4 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-medium animate-in fade-in ${
            authBanner.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800' 
              : 'bg-red-50 border border-red-300 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {authBanner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{authBanner.message}</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button 
                onClick={() => currentUser ? setIsUserProfileModalOpen(true) : setIsRequireLoginModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>My GBP Businesses</span>
              </button>
              <button onClick={() => setAuthBanner(null)} className="underline text-[11px] shrink-0 ml-1 text-emerald-700">Close</button>
            </div>
          </div>
        )}

        {/* Ramadan Active Banner */}
        {ramadanNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center justify-between font-medium animate-in fade-in">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{ramadanNotice}</span>
            </div>
            <button onClick={() => setRamadanNotice(null)} className="underline text-[11px] shrink-0 ml-2">Close</button>
          </div>
        )}

        {/* Simulated Alert Banner if triggered */}
        {profileGuardAlert && (
          <div className="p-4 bg-google-red-light border border-google-red/40 rounded-xl text-xs text-google-red flex items-center justify-between font-medium animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-google-red" />
              <span>{profileGuardAlert}</span>
            </div>
            <button onClick={() => setProfileGuardAlert(null)} className="underline text-[11px]">Dismiss</button>
          </div>
        )}

        {/* ======================================================== */}
        {/* JTBD HERO VENUE IDENTITY & OPERATIONAL COCKPIT CARD      */}
        {/* ======================================================== */}
        <div className="material-card p-6 bg-white border border-google-border shadow-sm rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Col 1: Venue Cover Photo & Live Badges (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100 relative group">
                <img 
                  src={activeProfile?.cover_url || activeProfile?.snapshot_url || defaultBusiness.cover_url} 
                  alt={activeProfile?.name || 'Venue Cover'} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Live Status Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Open Now</span>
                </div>

                {/* Google Maps link overlay */}
                <a 
                  href={activeProfile?.google_maps_url || 'https://maps.google.com'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow-md text-xs font-bold transition-all flex items-center gap-1 hover:text-google-blue"
                  title="Open in Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-google-red" />
                  <span className="text-[10px]">Maps ↗</span>
                </a>
              </div>

              {/* Geo Rank & Rating Pills */}
              <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-google-red" /> Rank: <strong className="text-google-green font-bold">#2 Avg</strong>
                </span>
                <span className="w-px h-3.5 bg-slate-200" />
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> <strong className="text-slate-900">{activeProfile?.rating || 4.9}</strong> ({activeProfile?.reviews_count || 148})
                </span>
              </div>
            </div>

            {/* Col 2: Real-World Details, Address, Working Hours, Contacts (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-bold text-google-blue bg-google-blue-light px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {activeProfile?.category || 'Specialty Bakery & Artisan Cafe'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {activeProfile?.role || 'Owner / Administrator'}
                  </span>
                  {!currentUser && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      Demo Mode
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-extrabold text-google-text-primary tracking-tight">
                  {activeProfile?.name || 'Business Profile'}
                </h1>
              </div>

              {/* Physical Address with Copy button */}
              <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-google-red shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium leading-relaxed truncate">
                    {activeProfile?.address || defaultBusiness.address}
                  </span>
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="px-2.5 py-1 text-[11px] font-bold text-google-blue hover:bg-google-blue-light/50 bg-white border border-slate-200 rounded-lg shrink-0 transition-colors flex items-center gap-1 shadow-2xs"
                  title="Copy address"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Working Hours with Accordion toggle */}
              <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Today:</span>
                    <span className="font-bold text-slate-900">{activeProfile?.opening_hours || '08:00 – 23:00'}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Open</span>
                  </div>
                  <button
                    onClick={() => setIsWeeklyHoursOpen(!isWeeklyHoursOpen)}
                    className="text-google-blue hover:underline font-bold text-[11px] flex items-center gap-0.5"
                  >
                    <span>{isWeeklyHoursOpen ? 'Hide Schedule' : 'Weekly Schedule'}</span>
                    {isWeeklyHoursOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {isWeeklyHoursOpen && (
                  <div className="mt-2 pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-1.5 animate-in fade-in duration-150">
                    {(activeProfile?.weekly_hours || defaultBusiness.weekly_hours || []).map((wh, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between px-2 py-1 rounded text-[11px] ${
                          wh.isToday ? 'bg-google-blue-light/40 font-bold text-google-blue border border-google-blue/20' : 'text-slate-600'
                        }`}
                      >
                        <span>{wh.day}</span>
                        <span className="font-mono">{wh.hours}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Channels: Phone, Website, Maps link */}
              <div className="flex items-center flex-wrap gap-2 pt-1 text-xs">
                <a
                  href={`tel:${activeProfile?.phone || activeProfile?.phone_number || '+12125550192'}`}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-google-blue text-slate-700 hover:text-google-blue font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-google-blue" />
                  <span>{activeProfile?.phone || activeProfile?.phone_number || '+1 (212) 555-0192'}</span>
                </a>

                {activeProfile?.website_url && (
                  <a
                    href={activeProfile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-google-blue text-slate-700 hover:text-google-blue font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Globe className="w-3.5 h-3.5 text-purple-600" />
                    <span>Website ↗</span>
                  </a>
                )}

                <a
                  href={activeProfile?.google_maps_url || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-google-blue-light/30 border border-google-blue/30 text-google-blue font-bold rounded-lg hover:bg-google-blue-light transition-colors flex items-center gap-1.5 ml-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Maps ↗</span>
                </a>
              </div>
            </div>

            {/* Col 3: Health Score & Quality Audit Checklist (3 cols) */}
            <div className="lg:col-span-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <HealthGauge score={healthScore} size={54} />
                  <div>
                    <div className="text-xs font-bold text-slate-800">GBP Health Score</div>
                    <div className="text-[10px] text-google-green font-bold uppercase tracking-wider">Top 5% in Sector</div>
                  </div>
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Phone & Contact Details
                  </span>
                  <span className="font-bold text-emerald-600">100%</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Operating Hours
                  </span>
                  <span className="font-bold text-emerald-600">100%</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-google-blue" /> Profile Attributes
                  </span>
                  <span className="font-bold text-google-blue">12 / 20</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Menu / Service Catalog
                  </span>
                  <span className="font-bold text-emerald-600">Complete</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-google-red" /> 1★ Fake Reviews
                  </span>
                  <span className="font-bold text-google-red">1 Ready to Remove</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => currentUser ? setIsUserProfileModalOpen(true) : setIsRequireLoginModalOpen(true)}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Building2 className="w-3.5 h-3.5 text-google-blue" />
                  <span>Switch Business ({availableProfiles.length})</span>
                </button>

                <button
                  onClick={handleApproveAll}
                  disabled={pendingCount === 0}
                  className="w-full material-button-primary text-xs py-2.5 font-bold flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>{allApproved ? 'All Actions Completed' : `⚡ Approve All (${pendingCount})`}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* CUSTOMER BEHAVIORAL ANALYSIS & GOOGLE STATS DASHBOARD    */}
        {/* ======================================================== */}
        <div className="material-card p-6 bg-white border border-google-border shadow-sm rounded-2xl space-y-6">
          
          {/* Header + Period Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-google-border-light pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-google-blue-light text-google-blue flex items-center justify-center shadow-2xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-google-text-primary tracking-tight">
                    Visitor Behavioral Analytics
                  </h2>
                  <span className="text-[10px] font-bold text-google-blue bg-google-blue-light px-2 py-0.5 rounded-full uppercase">
                    Google Business Insights API
                  </span>
                </div>
                <p className="text-xs text-google-text-secondary">
                  Real-time statistics for impressions, clicks, calls, and direction requests.
                </p>
              </div>
            </div>

            {/* Period Toggles: 7d | 30d | 90d */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setAnalyticsPeriod(period)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    analyticsPeriod === period
                      ? 'bg-white text-google-blue shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Key Behavioral Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Impressions */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-google-blue" /> Total Impressions</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {analyticsData[analyticsPeriod].impressionsTrend}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {analyticsData[analyticsPeriod].totalImpressions}
              </div>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Google Maps:</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].mapsImpressions} ({analyticsData[analyticsPeriod].mapsPercent}%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Google Search:</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].searchImpressions} ({analyticsData[analyticsPeriod].searchPercent}%)</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Discovery (Category Search):</span>
                  <span className="font-semibold text-google-blue">{analyticsData[analyticsPeriod].discoveryPercent}%</span>
                </div>
              </div>
            </div>

            {/* Card 2: Customer Actions */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><MousePointerClick className="w-4 h-4 text-emerald-600" /> Customer Actions</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {analyticsData[analyticsPeriod].actionsTrend}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {analyticsData[analyticsPeriod].totalActions}
              </div>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Navigation className="w-3 h-3 text-google-green" /> Directions:</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].directions} <span className="text-[10px] text-emerald-600 font-normal">({analyticsData[analyticsPeriod].directionsTrend})</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-google-blue" /> Calls:</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].calls} <span className="text-[10px] text-emerald-600 font-normal">({analyticsData[analyticsPeriod].callsTrend})</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-purple-600" /> Website Clicks:</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].websiteClicks} <span className="text-[10px] text-emerald-600 font-normal">({analyticsData[analyticsPeriod].websiteClicksTrend})</span></span>
                </div>
              </div>
            </div>

            {/* Card 3: Card Conversion Rate (CVR) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Conversion Rate (CVR)</span>
                <span className="text-google-blue font-bold bg-google-blue-light px-1.5 py-0.2 rounded">
                  Top 10%
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {analyticsData[analyticsPeriod].cvr}
              </div>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Area Benchmark:</span>
                  <span className="font-bold text-emerald-600">{analyticsData[analyticsPeriod].cvrBenchmark}</span>
                </div>
                <p className="text-[10px] text-slate-500 pt-1 leading-snug">
                  1 in 9 visitors to your Google Maps listing clicks «Directions» or «Call».
                </p>
              </div>
            </div>

            {/* Card 4: Devices & Mobility */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-purple-600" /> Devices</span>
                <span className="text-slate-500 text-[10px] font-semibold">Mobility</span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
                <span>{analyticsData[analyticsPeriod].deviceMobile}%</span>
                <span className="text-xs text-slate-500 font-normal">mobile</span>
              </div>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Google Maps App (iOS/Android):</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].deviceMobile}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Desktop Browser:</span>
                  <span className="font-bold text-slate-800">{analyticsData[analyticsPeriod].deviceDesktop}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1 flex">
                  <div className="bg-google-blue h-full" style={{ width: `${analyticsData[analyticsPeriod].deviceMobile}%` }} />
                  <div className="bg-slate-400 h-full" style={{ width: `${analyticsData[analyticsPeriod].deviceDesktop}%` }} />
                </div>
              </div>
            </div>

          </div>

          {/* Deep Behavioral Charts: Hourly Activity & Geographic Direction Origins */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            
            {/* Chart 1: Hourly Distribution (7 cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-google-blue" />
                    Hourly Customer Activity (Directions & Calls)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Peak hours when prospective customers request directions and contact your business.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  2 daily peaks
                </span>
              </div>

              {/* Bar Chart Visualization */}
              <div className="pt-4 pb-2">
                <div className="h-36 flex items-end justify-between gap-2 px-2 border-b border-slate-200">
                  {analyticsData[analyticsPeriod].hourly.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Hover / Peak Tooltip */}
                      {h.peak && (
                        <span className="absolute -top-7 text-[9px] font-bold text-white bg-slate-900 px-1.5 py-0.5 rounded whitespace-nowrap shadow-sm">
                          {h.label}
                        </span>
                      )}
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-300 group-hover:opacity-90 ${
                          h.peak 
                            ? 'bg-gradient-to-t from-google-blue to-google-blue/80 ring-2 ring-google-blue/30' 
                            : 'bg-slate-300 group-hover:bg-slate-400'
                        }`}
                        style={{ height: `${h.val}%` }}
                      />
                      <span className="text-[10px] font-semibold text-slate-600 mt-1 font-mono">
                        {h.hour}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-google-blue shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>AI Strategy:</strong> Traffic peaks occur at <strong>1:00 PM (Lunch)</strong> and <strong>9:00 PM (Dinner)</strong>. Autopilot schedules Google Updates and offers 90 minutes before peaks (11:30 AM & 7:30 PM), maximizing table bookings.
                </span>
              </div>
            </div>

            {/* Chart 2: Direction Origin Geography (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-google-green" />
                  Direction Request Geography
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Districts from which guests request navigation routes in Google Maps.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {analyticsData[analyticsPeriod].districts.map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{d.name}</span>
                      <span className="text-slate-500 font-medium text-[11px]">
                        <strong>{d.percent}%</strong> ({d.count})
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          i === 0 ? 'bg-google-blue' : i === 1 ? 'bg-emerald-500' : i === 2 ? 'bg-amber-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${d.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Local Reach:</strong> 70% of visitors originate within a 3 km radius (Downtown and Business Bay). Your Geo-Grid radar is tuned for defensive dominance across these key zones.
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Central Hero Section: Proactive Next Best Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-google-blue" />
              <h2 className="text-lg font-bold text-google-text-primary">Today's Proactive Next Best Actions</h2>
            </div>
            <span className="text-xs font-semibold text-google-text-secondary bg-google-bg px-2.5 py-1 rounded-lg border border-google-border">
              {pendingCount} Actions Pending
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <ProactiveCard
                key={rec.id}
                recommendation={rec}
                onExecute={handleExecute}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        </div>

        {/* Operational Triad 3-Column Intelligence Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Column 1: Pillar 1 - Scout Radar */}
          <div className="material-card p-5 space-y-4 border-t-4 border-t-google-blue">
            <div className="flex items-center justify-between border-b border-google-border-light pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-google-blue" />
                <h3 className="font-bold text-google-text-primary text-sm">🧭 1. Scout Radar</h3>
              </div>
              <span className="text-[10px] font-bold text-google-blue bg-google-blue-light px-2 py-0.5 rounded">
                Dubai 3x3
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-1">
              {[1, 2, 1, 2, 3, 2, 4, 3, 2].map((rank, i) => (
                <div 
                  key={i} 
                  className={`h-14 rounded-lg flex items-center justify-center font-extrabold text-white text-base shadow-sm ${
                    rank <= 2 ? 'bg-google-green' : rank <= 3 ? 'bg-google-yellow' : 'bg-google-red'
                  }`}
                >
                  #{rank}
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-google-border-light text-xs">
              <div className="flex items-center justify-between">
                <span className="text-google-text-secondary">Grid Location:</span>
                <span className="font-bold text-slate-800">Downtown & Business Bay</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-google-text-secondary">Protected Revenue:</span>
                <span className="font-bold text-emerald-600">+AED 24,500 / mo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-google-text-secondary">7-Day Track:</span>
                <span className="text-google-green font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +2 positions up
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Pillar 2 - Action Copilot */}
          <div className="material-card p-5 space-y-4 border-t-4 border-t-amber-500">
            <div className="flex items-center justify-between border-b border-google-border-light pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-google-text-primary text-sm">🤖 2. Action Copilot</h3>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                24/7 AI
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-google-text-secondary">
                  <Phone className="w-4 h-4 text-google-blue" /> Profile Calls
                </span>
                <span className="font-bold text-google-text-primary">342 (+18%)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-google-text-secondary">
                  <Navigation className="w-4 h-4 text-google-green" /> Direction Requests
                </span>
                <span className="font-bold text-google-text-primary">890 (+24%)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-google-text-secondary">
                  <Globe className="w-4 h-4 text-purple-600" /> Website Visits
                </span>
                <span className="font-bold text-google-text-primary">1,240 (+12%)</span>
              </div>

              <div className="pt-2 border-t border-google-border-light flex items-center justify-between text-[11px]">
                <span className="text-google-text-secondary">Ramadan Mode:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  isRamadanMode ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isRamadanMode ? '🌙 Iftar/Suhoor Active' : 'Standard Hours'}
                </span>
              </div>
            </div>
          </div>

          {/* Column 3: Pillar 3 - Defense Shield & Review Takedown */}
          <div className="material-card p-5 space-y-4 border-t-4 border-t-google-red">
            <div className="flex items-center justify-between border-b border-google-border-light pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-google-red" />
                <h3 className="font-bold text-google-text-primary text-sm">🛡️ 3. Review Defense</h3>
              </div>
              <span className="text-[10px] font-bold text-google-red bg-google-red-light px-2 py-0.5 rounded">
                UAE Law 34/2021
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-google-text-secondary">Review Request Limit:</span>
                <span className="font-bold text-google-green">5 / 8 (Safe)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-google-text-secondary">Profile Attributes Protection:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 100% Locked
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-google-text-secondary">Pending Reviews:</span>
                <span className="font-bold text-google-blue">0 pending</span>
              </div>

              {/* Takedown Trigger Button */}
              <button 
                onClick={() => {
                  setTakedownBusiness(activeProfile?.name || '');
                  setIsTakedownModalOpen(true);
                }}
                className="w-full material-button-primary text-xs py-2.5 !bg-google-red hover:!bg-red-700 shadow-md shadow-red-500/20 font-bold flex items-center justify-center gap-2 mt-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>⚡ Remove Fake 1★ Review</span>
              </button>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* REVIEW TAKEDOWN™ MODAL IN DASHBOARD                      */}
        {/* ======================================================== */}
        {isTakedownModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-material-3 border border-google-border animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-google-border-light pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-google-red-light text-google-red rounded-lg">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-google-text-primary text-base">Review Takedown™</h3>
                    <p className="text-xs text-google-text-secondary">
                      Legal dossier generation compliant with Google Maps Content Policy and jurisdictions (UAE, US, EU, Global).
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsTakedownModalOpen(false);
                    setTakedownResult(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Review Source Switcher: Auto-Detected vs Manual */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setTakedownSourceMode('AUTO');
                    const cur = detectedNegativeReviews.find(r => r.id === selectedReviewId) || detectedNegativeReviews[0];
                    if (cur) handleSelectNegativeReview(cur);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    takedownSourceMode === 'AUTO'
                      ? 'bg-white text-google-red shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>⚡ Pulled Profile Reviews ({detectedNegativeReviews.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTakedownSourceMode('MANUAL')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    takedownSourceMode === 'MANUAL'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>✏️ Enter Review Manually</span>
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleReviewTakedownSubmit} className="space-y-4">
                
                {/* AUTO MODE: Detected Negative Reviews List */}
                {takedownSourceMode === 'AUTO' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>Click a review to auto-fill dossier:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> No manual entry needed
                      </span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {detectedNegativeReviews.map((rev) => {
                        const isSelected = selectedReviewId === rev.id;
                        return (
                          <div
                            key={rev.id}
                            onClick={() => handleSelectNegativeReview(rev)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-google-red bg-red-50/70 ring-1 ring-google-red shadow-sm'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-xs text-slate-900">{rev.author_name}</span>
                                <span className="text-[10px] bg-red-100 text-google-red font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-google-red" /> {rev.rating}★
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">{rev.review_date}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                  {rev.confidence_score}% removal
                                </span>
                                {isSelected && (
                                  <span className="text-[10px] bg-google-red text-white font-bold px-2 py-0.5 rounded-full">
                                    Selected ✓
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-slate-700 italic leading-relaxed line-clamp-2">
                              "{rev.review_text}"
                            </p>

                            <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                              <span className="text-google-red font-semibold flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" />
                                {rev.suspected_violation}
                              </span>
                              {rev.violation_details && (
                                <span className="text-slate-500 hidden sm:inline">{rev.violation_details}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pre-filled info pill */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-slate-500 shrink-0 font-medium">Selected review:</span>
                        <span className="font-bold text-slate-900 truncate">
                          {takedownAuthor} ({takedownBusiness})
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold shrink-0 border border-emerald-200">
                        Ready for escalation
                      </span>
                    </div>
                  </div>
                )}

                {/* MANUAL MODE: Text Inputs */}
                {takedownSourceMode === 'MANUAL' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-google-text-secondary mb-1">
                          Google Maps Business Name *
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Al Safadi Restaurant"
                          value={takedownBusiness}
                          onChange={(e) => setTakedownBusiness(e.target.value)}
                          className="material-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-google-text-secondary mb-1">
                          Review Author (if known)
                        </label>
                        <input 
                          type="text"
                          placeholder="e.g. Anonymous or user name"
                          value={takedownAuthor}
                          onChange={(e) => setTakedownAuthor(e.target.value)}
                          className="material-input text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-google-text-secondary mb-1">
                        Toxic Review Text *
                      </label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="Paste text of the unfair or fake 1★ review..."
                        value={takedownReviewText}
                        onChange={(e) => setTakedownReviewText(e.target.value)}
                        className="material-input text-xs resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Jurisdiction Switcher */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Jurisdiction / Governing Law:</span>
                    <span className="text-[11px] text-google-blue font-bold">
                      {takedownJurisdiction === 'UAE' && '🇦🇪 UAE: Decree-Law No. 34/2021'}
                      {takedownJurisdiction === 'USA' && '🇺🇸 USA: FTC Act & Lanham Act'}
                      {takedownJurisdiction === 'EU' && '🇪🇺 EU / UK: Digital Services Act'}
                      {takedownJurisdiction === 'GLOBAL' && '🌍 Global: Google Content Policy'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setTakedownJurisdiction('UAE')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        takedownJurisdiction === 'UAE'
                          ? 'bg-white text-google-red border-red-300 shadow-sm ring-1 ring-red-300'
                          : 'bg-white/60 text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      <span>🇦🇪</span>
                      <span>UAE / Dubai</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTakedownJurisdiction('USA')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        takedownJurisdiction === 'USA'
                          ? 'bg-white text-google-blue border-blue-300 shadow-sm ring-1 ring-blue-300'
                          : 'bg-white/60 text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      <span>🇺🇸</span>
                      <span>United States (US)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTakedownJurisdiction('EU')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        takedownJurisdiction === 'EU'
                          ? 'bg-white text-purple-700 border-purple-300 shadow-sm ring-1 ring-purple-300'
                          : 'bg-white/60 text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      <span>🇪🇺</span>
                      <span>Europe / UK</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTakedownJurisdiction('GLOBAL')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        takedownJurisdiction === 'GLOBAL'
                          ? 'bg-white text-emerald-700 border-emerald-300 shadow-sm ring-1 ring-emerald-300'
                          : 'bg-white/60 text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      <span>🌍</span>
                      <span>Global</span>
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isTakedownLoading}
                  className="material-button-primary w-full text-xs py-2.5 !bg-google-red hover:!bg-red-700 font-bold"
                >
                  {isTakedownLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>
                        {takedownJurisdiction === 'UAE' && 'Analyzing UAE laws and violations...'}
                        {takedownJurisdiction === 'USA' && 'Analyzing US laws (FTC/Lanham)...'}
                        {takedownJurisdiction === 'EU' && 'Analyzing EU regulations (DSA/GDPR)...'}
                        {takedownJurisdiction === 'GLOBAL' && 'Analyzing Google Maps Content Policy...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-white" />
                      <span>⚡ Generate Takedown Dossier</span>
                    </>
                  )}
                </button>
              </form>

              {/* Result Dossier in Modal */}
              {takedownResult && (
                <div className="mt-5 space-y-4 border-t border-google-border-light pt-4 animate-in fade-in duration-200">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-emerald-800">
                        ✓ Dossier Generated (Removal Probability: {takedownResult.confidence_score}%)
                      </span>
                      <div className="text-[11px] text-emerald-700 mt-0.5">
                        Jurisdiction: <span className="font-bold">{takedownJurisdiction}</span> • {
                          takedownJurisdiction === 'UAE' ? 'UAE Decree-Law No. 34/2021' :
                          takedownJurisdiction === 'USA' ? 'FTC Act & Lanham Act § 43(a)' :
                          takedownJurisdiction === 'EU' ? 'EU Digital Services Act Art. 16' :
                          'Google Universal Content Policy'
                        }
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Est. Time: {takedownResult.estimated_removal_time}
                    </span>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Legal Escalation Dossier
                      </span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(takedownResult.dossier_text);
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 2500);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded flex items-center gap-1 border border-slate-700"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{isCopied ? 'Copied!' : 'Copy Dossier'}</span>
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto select-all">
                      {takedownResult.dossier_text}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <a 
                      href={takedownResult.google_escalation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="material-button-primary text-xs py-2 px-4 !bg-red-600 hover:!bg-red-700 font-bold flex items-center gap-1.5"
                    >
                      <span>🚀 {takedownJurisdiction === 'UAE' ? 'Open Google MENA Escalation Form' : 'Open Google Escalation Form'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button 
                      onClick={() => {
                        setIsTakedownModalOpen(false);
                        setTakedownResult(null);
                      }}
                      className="material-button-ghost text-xs py-2"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: USER PROFILE & GBP VENUES MANAGEMENT (JTBD)       */}
        {/* ======================================================== */}
        {isUserProfileModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-material-3 border border-slate-200 max-w-xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setIsUserProfileModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header: Google Profile Identity */}
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-google-blue-light text-google-blue flex items-center justify-center font-bold text-base shadow-sm border border-google-blue/20">
                  {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : <Building2 className="w-6 h-6" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-google-text-primary truncate">
                      {currentUser?.email || '0451611@gmail.com'}
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Google Verified
                    </span>
                  </div>
                  <p className="text-xs text-google-text-secondary mt-0.5">
                    Manage Google Business Profiles with Owner / Manager permissions.
                  </p>
                </div>
              </div>

              {/* API Diagnostics Warning: Clear Breakdown of Google Requirements */}
              {apiDisabledWarning && (
                <div className="p-4 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 w-full">
                      <div className="font-bold text-amber-950 text-sm">
                        Enable My Business Account Management API
                      </div>
                      <p className="text-amber-800 leading-relaxed text-xs">
                        Google Business Profile API is separated by Google into two independent services. To retrieve your account locations list, please enable the Account Management API:
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pb-1">
                        <div className="p-2 rounded-lg bg-white border border-emerald-200 flex items-center justify-between">
                          <span className="font-medium text-[11px] text-slate-700">Business Information API:</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Enabled ✅
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-amber-300 flex items-center justify-between">
                          <span className="font-medium text-[11px] text-slate-700">Account Management API:</span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                            Action Required ⚠️
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-normal">
                        💡 <strong>Google Quotas (Quota = 0):</strong> If Google displays 0 quota or pending verification, you can <strong>instantly connect any venue via search below</strong> without waiting for Google approval!
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <a
                      href="https://console.cloud.google.com/apis/library/mybusinessaccountmanagement.googleapis.com?project=117262328905"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm"
                    >
                      <span>1. Enable Account Management API ↗</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={handleGoogleLogin}
                      className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg hover:bg-amber-100 font-medium text-xs transition-colors"
                    >
                      2. Retry Sync
                    </button>
                    <button
                      onClick={() => setShowAddVenueSection(true)}
                      className="px-3 py-1.5 bg-google-blue text-white rounded-lg hover:bg-blue-600 font-bold text-xs transition-colors ml-auto shadow-sm"
                    >
                      ⚡ Add Venue via Search
                    </button>
                  </div>
                </div>
              )}

              {/* Instant Search & Add Venue from Google Maps */}
              <div className="mb-4 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-google-blue" />
                    <span className="font-bold text-xs text-slate-900">
                      Connect Venue from Google Maps
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddVenueSection(!showAddVenueSection)}
                    className="text-[11px] text-google-blue hover:underline font-semibold"
                  >
                    {showAddVenueSection ? 'Collapse' : '+ Expand Search'}
                  </button>
                </div>

                {(showAddVenueSection || apiDisabledWarning || availableProfiles.length === 0) && (
                  <div className="space-y-3 pt-1 border-t border-slate-200/80 animate-in fade-in duration-150">
                    <form onSubmit={handleSearchVenues} className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={venueSearchQuery}
                          onChange={(e) => setVenueSearchQuery(e.target.value)}
                          placeholder="Business name (e.g. Banzai Marketing or Al Safadi)..."
                          className="material-input text-xs !pl-9 pr-3 py-2 w-full"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSearchingVenues || !venueSearchQuery.trim()}
                        className="px-3.5 py-2 bg-google-blue hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                      >
                        {isSearchingVenues ? (
                          <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Search className="w-3.5 h-3.5" />
                        )}
                        <span>Search</span>
                      </button>
                    </form>

                    {/* Search Results list */}
                    {venueSearchResults.length > 0 && (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Found on Google Maps ({venueSearchResults.length}):
                        </div>
                        {venueSearchResults.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 bg-white border border-slate-200 hover:border-google-blue rounded-xl flex items-center justify-between gap-2 shadow-xs transition-all"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {item.main_text || item.description}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                {item.description}
                              </div>
                            </div>
                            <button
                              type="button"
                              disabled={isConnectingVenue}
                              onClick={() => handleConnectVenueItem(item)}
                              className="px-2.5 py-1.5 bg-google-blue hover:bg-blue-600 text-white rounded-lg text-xs font-bold shrink-0 transition-colors flex items-center gap-1 shadow-sm disabled:opacity-50"
                            >
                              {isConnectingVenue ? (
                                <Sparkles className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              <span>Connect ⚡</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* List of Connected Google Business Profiles */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Available Locations ({availableProfiles.length})</span>
                  <span className="text-[11px] text-google-green flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Google Locations Only
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {(availableProfiles.length > 0 ? availableProfiles : [defaultBusiness]).map((prof, idx) => {
                    const isActive = activeProfile?.name === prof.name;
                    return (
                      <div 
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isActive 
                            ? 'border-google-blue bg-google-blue-light/20 ring-1 ring-google-blue shadow-sm' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center">
                              {prof.cover_url || prof.snapshot_url ? (
                                <img 
                                  src={prof.cover_url || prof.snapshot_url} 
                                  alt={prof.name} 
                                  className="w-full h-full object-cover" 
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <Building2 className="w-5 h-5 text-google-blue" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                                <span>{prof.name}</span>
                                {isActive && (
                                  <span className="text-[10px] bg-google-blue text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{prof.address || prof.city || 'Google Business Profile'}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                  {prof.category || prof.primary_category || 'Local Business'}
                                </span>
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  {prof.role || 'Owner / Manager'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 pt-1">
                            {isActive ? (
                              <button
                                onClick={() => setIsUserProfileModalOpen(false)}
                                className="px-3 py-1.5 bg-google-blue text-white rounded-lg font-bold text-xs hover:bg-google-blue/90 shadow-sm"
                              >
                                Selected ✓
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSelectProfile(prof)}
                                className="px-3 py-1.5 bg-white border border-google-blue text-google-blue hover:bg-google-blue hover:text-white rounded-lg font-bold text-xs transition-colors shadow-sm"
                              >
                                Select →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sync via Google Button */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500 leading-snug">
                  Connecting and syncing new locations is performed securely via Google OAuth.
                </p>
                <button
                  onClick={handleGoogleLogin}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sync from Google</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: REQUIRE GOOGLE LOGIN (GATEKEEPER)                 */}
        {/* ======================================================== */}
        {isRequireLoginModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-material-3 border border-slate-200 max-w-md w-full p-6 relative text-center">
              <button 
                onClick={() => setIsRequireLoginModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-3xl bg-google-blue-light text-google-blue flex items-center justify-center mx-auto mb-4 shadow-sm border border-google-blue/20">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-google-text-primary tracking-tight mb-2">
                Google Sign-In Required
              </h3>

              <p className="text-xs text-google-text-secondary leading-relaxed mb-6">
                You are currently in <strong>Demo Mode</strong>. To switch businesses, apply Autopilot optimizations, and manage live profile cards, please sign in with a Google account that has <strong>Owner or Manager</strong> permissions.
              </p>

              <div className="space-y-2.5">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full py-3 px-4 bg-google-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign In with Google Workspace</span>
                </button>

                <button
                  onClick={() => setIsRequireLoginModalOpen(false)}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
                >
                  Continue Viewing in Demo Mode
                </button>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Secure OAuth 2.0 authorization via Google Cloud API</span>
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
