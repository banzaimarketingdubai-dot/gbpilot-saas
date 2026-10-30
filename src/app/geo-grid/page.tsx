'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Info,
  Plus,
  Check,
  X,
  Target,
  Tag,
  Map,
  RotateCcw,
  Copy,
  Lock,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CompetitorMatrix, CompetitorComparison } from '@/components/CompetitorMatrix';
import { getSubscription, activateTrial } from '@/lib/subscription';
import { loadOwnerGroundTruth, OwnerGroundTruth } from '@/lib/groundTruth';
import { buildDirectoryBlueprints, DirectoryPlatformId } from '@/lib/geo/directoryBuilder';

// Real coordinates only: numeric lat/lng on the profile or a parsed POINT(lng lat). No guessed city defaults.
const getProfileCoords = (profile: any): { lat: number; lng: number } | null => {
  if (!profile) return null;

  if (typeof profile.lat === 'number' && typeof profile.lng === 'number') {
    return { lat: profile.lat, lng: profile.lng };
  }

  if (profile.location && typeof profile.location === 'string') {
    try {
      const cleaned = profile.location.replace('POINT(', '').replace(')', '').trim();
      const parts = cleaned.split(/\s+/);
      if (parts.length >= 2) {
        const lng = parseFloat(parts[0]);
        const lat = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return null;
};

type GridNodeState = 'FOUND' | 'NOT_IN_TOP20' | 'NO_DATA';

interface Top3Item {
  rank: number;
  place_id: string;
  name: string;
  rating: number;
  reviews_count: number;
  primary_category: string;
  google_maps_url: string;
  is_you: boolean;
}

interface GridNodeData {
  pos: number;
  rank: number | null;
  state: GridNodeState;
  competitor: string;
  lat?: number;
  lng?: number;
  top3?: Top3Item[];
}

interface ScanMetrics {
  arp: number | null;
  atrp: number | null;
  solv: number | null;
  nodes_total: number;
  nodes_with_data: number;
  nodes_found: number;
  nodes_top3: number;
}

interface ScanMeta {
  cached?: boolean;
  stale?: boolean;
  cached_at?: string | null;
  plan_id?: string;
  scans_used?: number;
  scans_limit?: number | null;
  scans_remaining?: number | null;
  own_place_id?: string | null;
  own_name?: string | null;
  own_resolved_by?: string;
  center_lat?: number | null;
  center_lng?: number | null;
  accuracy_note?: string;
  step_m?: number;
  mode?: string;
}

export interface KeywordPill {
  id: string;
  label: string;
  category: 'PRODUCT' | 'OCCASION' | 'AREA' | 'CUSTOM';
  source?: 'GBP_REAL' | 'GOOGLE_SUGGEST' | 'CUSTOM';
  impressions?: number;
  isCustom?: boolean;
}

const DEMO_COMPETITORS: CompetitorComparison[] = [];

const isPlaceholderCategory = (cat?: string): boolean => {
  if (!cat || typeof cat !== 'string') return true;
  const c = cat.trim().toLowerCase();
  return (
    c === '' ||
    c === 'local business' ||
    c === 'localbusiness' ||
    c === 'establishment' ||
    c === 'point of interest' ||
    c === 'store' ||
    c === 'company' ||
    c === 'corporate office' ||
    c === 'unverified' ||
    c === 'null' ||
    c === 'undefined'
  );
};

const sanitizeQueryLabel = (label: string): boolean => {
  if (!label || typeof label !== 'string') return false;
  const l = label.toLowerCase();
  // Filter out any garbage containing "local business", "establishment", or placeholder phrases
  if (
    l.includes('local business') ||
    l.includes('establishment') ||
    l.includes('point of interest') ||
    l.includes('undefined') ||
    l.includes('null')
  ) {
    return false;
  }
  return true;
};

// NOTE: getDefaultKeywordPills REMOVED — keywords are fetched from /api/v1/geo-grid/suggest-keywords
// which returns real GBP search impressions (GBP_REAL) and Google Autocomplete (GOOGLE_SUGGEST).

const _REMOVED_getDefaultKeywordPills_stub = null; // placeholder to keep diff minimal

// Kept only for "Reset" button label display purposes
const _getCategoryLabel = (profile: any): string => {
  const rawCat = profile?.category || '';
  if (!rawCat || rawCat.toLowerCase() === 'local business') return '';
  return rawCat.split(',')[0].trim();
};

const isVietnam_stub = (address: string) =>
  address.includes('vietnam') || address.includes('nha trang');
const _STUB_isVietnam = isVietnam_stub; void _STUB_isVietnam; // suppress lint

// DEAD CODE STUB — DO NOT USE — real keywords come from API
const getDefaultKeywordPills = (_profile: any): KeywordPill[] => {
  const name = (_profile?.name || '').toLowerCase();
  const rawCat = _profile?.category || '';
  const cat = rawCat.toLowerCase();
  const address = ((_profile?.address || '') + ' ' + (_profile?.city || '')).toLowerCase();
  const isVietnam = address.includes('vietnam') || address.includes('nha trang') || address.includes('вьетнам') || address.includes('нячанг') || address.includes('hòn chồng');
  const isDubai = address.includes('dubai') || address.includes('uae') || address.includes('дубай') || address.includes('оаэ');

  // 1. Visa, Visa Run, Relocation & Immigration (Russian & English keywords)
  if (
    name.includes('виза') || 
    name.includes('визар') || 
    name.includes('visa') || 
    name.includes('релокац') || 
    name.includes('relocat') || 
    name.includes('иммиграц') || 
    cat.includes('visa') || 
    cat.includes('виза') || 
    cat.includes('immigration') || 
    cat.includes('legal')
  ) {
    if (isVietnam) {
      return [
        { id: 'kw-v1', label: 'Vietnam Visa Extension', category: 'PRODUCT' },
        { id: 'kw-v2', label: 'Visa Run Nha Trang', category: 'PRODUCT' },
        { id: 'kw-v3', label: 'Cambodia Border Run', category: 'OCCASION' },
        { id: 'kw-v4', label: 'Fast Track Visa Service', category: 'PRODUCT' },
        { id: 'kw-v5', label: 'Work Permit & TRC Vietnam', category: 'PRODUCT' },
        { id: 'kw-v6', label: 'Urgent Visa Renewal', category: 'AREA' },
      ];
    }
    if (isDubai) {
      return [
        { id: 'kw-d1', label: 'UAE Golden Visa', category: 'PRODUCT' },
        { id: 'kw-d2', label: 'Business Setup Dubai', category: 'PRODUCT' },
        { id: 'kw-d3', label: 'Freelance Visa Services', category: 'PRODUCT' },
        { id: 'kw-d4', label: 'Corporate Bank Account Opening', category: 'OCCASION' },
        { id: 'kw-d5', label: 'PRO Services Downtown', category: 'AREA' },
        { id: 'kw-d6', label: 'Emirates ID & Medical Typing', category: 'PRODUCT' },
      ];
    }
    return [
      { id: 'kw-g1', label: 'Visa Extension Services', category: 'PRODUCT' },
      { id: 'kw-g2', label: 'Border Run & Fast Track', category: 'PRODUCT' },
      { id: 'kw-g3', label: 'Work Permit & Residence Visa', category: 'PRODUCT' },
      { id: 'kw-g4', label: 'Express Visa Renewal', category: 'OCCASION' },
      { id: 'kw-g5', label: 'Expat Legal Consulting', category: 'AREA' },
    ];
  }

  // 2. Cafe, Coffee, Bakery & Restaurant (Russian & English keywords)
  if (
    name.includes('bakery') || 
    name.includes('cafe') || 
    name.includes('coffee') || 
    name.includes('кафе') || 
    name.includes('кофе') || 
    name.includes('пекарн') || 
    name.includes('свои') || 
    name.includes('ресторан') || 
    cat.includes('cafe') || 
    cat.includes('restaurant') || 
    cat.includes('coffee') || 
    cat.includes('bakery')
  ) {
    return [
      { id: 'kw-c1', label: 'Specialty Coffee', category: 'PRODUCT' },
      { id: 'kw-c2', label: 'Breakfast & Syrniki', category: 'PRODUCT' },
      { id: 'kw-c3', label: 'Fresh Bakery & Pastry', category: 'PRODUCT' },
      { id: 'kw-c4', label: 'Work Friendly Cafe with WiFi', category: 'OCCASION' },
      { id: 'kw-c5', label: 'Matcha Latte', category: 'PRODUCT' },
      { id: 'kw-c6', label: 'Best Cafe Near Beach', category: 'AREA' },
    ];
  }

  // 3. Beauty, Hair Salon, Spa, Barber
  if (
    name.includes('salon') || 
    name.includes('barber') || 
    name.includes('spa') || 
    name.includes('beauty') || 
    name.includes('салон') || 
    name.includes('барбер') || 
    name.includes('спа') || 
    name.includes('массаж') || 
    cat.includes('salon') || 
    cat.includes('barber') || 
    cat.includes('spa')
  ) {
    return [
      { id: 'kw-b1', label: 'Hair Salon & Styling', category: 'PRODUCT' },
      { id: 'kw-b2', label: 'English Speaking Barber', category: 'PRODUCT' },
      { id: 'kw-b3', label: 'Relaxing Spa & Massage', category: 'PRODUCT' },
      { id: 'kw-b4', label: 'Manicure & Pedicure', category: 'OCCASION' },
      { id: 'kw-b5', label: 'Facial & Skin Care Near Me', category: 'AREA' },
    ];
  }

  // 4. Real Estate & Rental
  if (
    name.includes('realty') || 
    name.includes('real estate') || 
    name.includes('property') || 
    name.includes('rent') || 
    name.includes('недвиж') || 
    name.includes('аренд') || 
    name.includes('квартир') || 
    cat.includes('real estate')
  ) {
    return [
      { id: 'kw-r1', label: 'Apartment Rental', category: 'PRODUCT' },
      { id: 'kw-r2', label: 'Luxury Villa Rental', category: 'PRODUCT' },
      { id: 'kw-r3', label: 'Long Term Condo Lease', category: 'PRODUCT' },
      { id: 'kw-r4', label: 'Expat Housing Service', category: 'OCCASION' },
    ];
  }

  // 5. If category is valid and not a placeholder
  if (!isPlaceholderCategory(rawCat)) {
    return [
      { id: 'kw-u1', label: `${rawCat}`, category: 'PRODUCT' },
      { id: 'kw-u2', label: `Best ${rawCat} Near Me`, category: 'AREA' },
      { id: 'kw-u3', label: `Top Rated ${rawCat}`, category: 'PRODUCT' },
      { id: 'kw-u4', label: `${rawCat} Open Now`, category: 'OCCASION' },
    ];
  }

  // 6. Generic or unverified category fallback - NEVER use "Local Business"
  const businessTitle = _profile?.name ? _profile.name.trim() : 'Local Services';
  return [
    { id: 'kw-gen-1', label: `${businessTitle}`, category: 'PRODUCT' as const },
    { id: 'kw-gen-2', label: `${businessTitle} Services`, category: 'PRODUCT' as const },
    { id: 'kw-gen-3', label: `${businessTitle} Reviews`, category: 'AREA' as const },
    { id: 'kw-gen-4', label: `Customer Service Contact`, category: 'OCCASION' },
  ];
};

export default function GeoGridPage() {
  const [activeTab, setActiveTab] = useState<'MAPS_GRID' | 'AI_LLM_GEO'>('MAPS_GRID');
  const [activeProfile, setActiveProfile] = useState<{name: string; address: string; category?: string; city?: string; id?: string; lat?: number; lng?: number; location?: string; phone?: string; website_url?: string} | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [gridSize, setGridSize] = useState<'3x3' | '5x5' | '7x7'>('3x3');
  const [showMapBackdrop, setShowMapBackdrop] = useState(true);
  const mapCoords = getProfileCoords(activeProfile);

  // Multi-Platform Field-by-Field Directory Builder state (Tab 2: AI_LLM_GEO)
  const [isProPlan, setIsProPlan] = useState<boolean>(false);
  const [groundTruth, setGroundTruth] = useState<OwnerGroundTruth | null>(null);
  const [selectedDirectoryPlatform, setSelectedDirectoryPlatform] = useState<DirectoryPlatformId>('APPLE_MAPS');
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);
  const [customBlockOverrides, setCustomBlockOverrides] = useState<Record<string, string>>({});
  const [completedPlatforms, setCompletedPlatforms] = useState<Record<string, boolean>>({});
  const [geoToast, setGeoToast] = useState<string | null>(null);

  // Keyword Grounding state
  const [keywordPills, setKeywordPills] = useState<KeywordPill[]>([]);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
  const [keywordsHaveRealData, setKeywordsHaveRealData] = useState(false);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomKeyword, setNewCustomKeyword] = useState('');

  // State for grid ranks & competitors
  const [isScanning, setIsScanning] = useState(false);
  const [competitors, setCompetitors] = useState<CompetitorComparison[]>(DEMO_COMPETITORS);
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  // Category deficiency check
  const isCategoryDeficient = isPlaceholderCategory(activeProfile?.category);
  const getCategoryRecommendation = () => {
    const name = (activeProfile?.name || '').toLowerCase();
    if (name.includes('виза') || name.includes('визар') || name.includes('visa')) {
      return 'Visa Consultant, Immigration Attorney, or Travel Agency';
    }
    if (name.includes('cafe') || name.includes('coffee') || name.includes('кафе') || name.includes('пекарн') || name.includes('свои')) {
      return 'Cafe, Coffee Shop, or Bakery';
    }
    if (name.includes('salon') || name.includes('barber') || name.includes('салон') || name.includes('барбер') || name.includes('spa')) {
      return 'Hair Salon, Barber Shop, or Day Spa';
    }
    return 'Consultant, Specialist Clinic, Retail, or Restaurant';
  };

  // Build grid node template — empty state before first scan
  const buildGridTemplate = (size: '3x3' | '5x5' | '7x7'): GridNodeData[] => {
    const dim = size === '7x7' ? 7 : size === '5x5' ? 5 : 3;
    const total = dim * dim;
    return Array.from({ length: total }, (_, i) => ({
      pos: i + 1,
      rank: null,
      state: 'NO_DATA' as GridNodeState,
      competitor: '—',
    }));
  };

  const [gridRanks, setGridRanks] = useState<GridNodeData[]>(buildGridTemplate('3x3'));
  const [selectedNode, setSelectedNode] = useState<GridNodeData | null>(null);
  const [scanMetrics, setScanMetrics] = useState<ScanMetrics | null>(null);
  const [scanMeta, setScanMeta] = useState<ScanMeta | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sub = getSubscription();
      setIsProPlan(sub.isPro);
      const handleSubChange = () => setIsProPlan(getSubscription().isPro);
      window.addEventListener('gbpilot_subscription_changed', handleSubChange);

      const stored = localStorage.getItem('gbpilot_active_profile');
      let parsedProfile: any = null;
      if (stored) {
        try {
          parsedProfile = JSON.parse(stored);
          setActiveProfile(parsedProfile);
        } catch (e) {
          console.error(e);
        }
      }

      setGroundTruth(loadOwnerGroundTruth(parsedProfile));

      const savedCompleted = localStorage.getItem('gbpilot_directory_completed');
      if (savedCompleted) {
        try {
          setCompletedPlatforms(JSON.parse(savedCompleted));
        } catch (e) {}
      }

      const profileKey = parsedProfile?.id || parsedProfile?.name || 'default';
      
      // Load saved (custom) pills from localStorage for this profile
      const savedPillsJson = localStorage.getItem(`gbpilot_keywords_${profileKey}`);
      let savedCustomPills: KeywordPill[] = [];
      if (savedPillsJson) {
        try {
          const parsed = JSON.parse(savedPillsJson);
          if (Array.isArray(parsed)) {
            // Only keep explicitly custom pills — real/suggest ones refresh from API each time
            savedCustomPills = parsed.filter(
              (p: any) => p && typeof p.label === 'string' && sanitizeQueryLabel(p.label) && p.source === 'CUSTOM'
            );
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Fetch real keywords from backend (GBP impressions + Google Suggest)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      setIsLoadingKeywords(true);
      (async () => {
        try {
          const res = await fetch(
            `${apiUrl}/api/v1/geo-grid/suggest-keywords?profile_id=${encodeURIComponent(parsedProfile?.id || 'default')}`
          );
          if (res.ok) {
            const data = await res.json();
            const apiKeywords: KeywordPill[] = (data.keywords || [])
              .filter((k: any) => k.keyword && sanitizeQueryLabel(k.keyword))
              .map((k: any, i: number) => ({
                id: `kw-api-${i}-${k.source}`,
                label: k.keyword,
                category: 'PRODUCT' as const,
                source: k.source as 'GBP_REAL' | 'GOOGLE_SUGGEST',
                impressions: k.impressions || undefined,
              }));
            setKeywordsHaveRealData(Boolean(data.has_real_data));
            // Merge: API keywords first (dedupe against custom), then custom pills
            const apiLabels = new Set(apiKeywords.map(p => p.label.toLowerCase()));
            const dedupedCustom = savedCustomPills.filter(p => !apiLabels.has(p.label.toLowerCase()));
            const merged = [...apiKeywords, ...dedupedCustom];
            setKeywordPills(merged);
            if (merged.length > 0) setSelectedKeyword(merged[0].label);
          } else {
            // API failed — show only saved custom pills, no hardcoded fallback
            setKeywordPills(savedCustomPills);
            if (savedCustomPills.length > 0) setSelectedKeyword(savedCustomPills[0].label);
          }
        } catch {
          setKeywordPills(savedCustomPills);
          if (savedCustomPills.length > 0) setSelectedKeyword(savedCustomPills[0].label);
        } finally {
          setIsLoadingKeywords(false);
        }
      })();

      return () => {
        window.removeEventListener('gbpilot_subscription_changed', handleSubChange);
      };
    }
  }, []);

  // Scan only on explicit button press — no auto-scan on profile load

  const directoryBlueprints = React.useMemo(() => {
    return buildDirectoryBlueprints(
      activeProfile
        ? {
            ...activeProfile,
            lat: mapCoords?.lat,
            lng: mapCoords?.lng
          }
        : null,
      groundTruth
    );
  }, [activeProfile, mapCoords?.lat, mapCoords?.lng, groundTruth]);

  const activeDirectoryBlueprint = directoryBlueprints.find(d => d.id === selectedDirectoryPlatform) || directoryBlueprints[0];

  const handleCopyDirectoryBlock = (blockId: string, textValue: string, fieldTitle: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textValue);
      setCopiedBlockId(blockId);
      setGeoToast(`📋 Copied: "${fieldTitle}" — ready to paste into dashboard!`);
      setTimeout(() => {
        setCopiedBlockId(null);
        setGeoToast(null);
      }, 3200);
    }
  };

  const handleCopyAllDirectoryBlocks = () => {
    if (!isProPlan) {
      handleUnlockProDirectory();
      return;
    }
    const compiled = activeDirectoryBlueprint.blocks
      .map(b => {
        const val = customBlockOverrides[b.id] !== undefined ? customBlockOverrides[b.id] : b.value;
        return `=== ${b.fieldTitle} (${b.exactCabinetPath}) ===\n${val}`;
      })
      .join('\n\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(compiled);
      setCopiedBlockId('ALL_BLOCKS');
      setGeoToast(`📋 All ${activeDirectoryBlueprint.blocks.length} blocks for ${activeDirectoryBlueprint.name} copied to clipboard!`);
      setTimeout(() => {
        setCopiedBlockId(null);
        setGeoToast(null);
      }, 3500);
    }
  };

  const handleTogglePlatformCompleted = (platformId: string) => {
    const next = { ...completedPlatforms, [platformId]: !completedPlatforms[platformId] };
    setCompletedPlatforms(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbpilot_directory_completed', JSON.stringify(next));
    }
    setGeoToast(
      next[platformId]
        ? '✅ Platform marked as 100% completed! AI visibility index updated.'
        : 'Platform completion status reset.'
    );
    setTimeout(() => setGeoToast(null), 3500);
  };

  const handleUnlockProDirectory = () => {
    activateTrial(14);
    setIsProPlan(true);
    setGeoToast('🎉 14-day Pro access activated ($0 today)! All directory blocks unlocked.');
    setTimeout(() => setGeoToast(null), 4500);
  };

  const handleAddCustomKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCustomKeyword.trim();
    if (!trimmed) return;

    if (!sanitizeQueryLabel(trimmed)) {
      setScanNotice(`Cannot add generic placeholder queries like "Local Business".`);
      return;
    }

    // Check if duplicate exists
    const exists = keywordPills.some(p => p.label.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setSelectedKeyword(trimmed);
      setIsAddingCustom(false);
      setNewCustomKeyword('');
      setScanNotice(`Switched to existing keyword "${trimmed}".`);
      return;
    }

    const newPill: KeywordPill = {
      id: `custom-${Date.now()}`,
      label: trimmed,
      category: 'CUSTOM',
      source: 'CUSTOM',
      isCustom: true
    };

    const updated = [...keywordPills, newPill];
    setKeywordPills(updated);
    setSelectedKeyword(trimmed);
    setIsAddingCustom(false);
    setNewCustomKeyword('');
    setScanNotice(`Added search query "${trimmed}". Ready for live scan.`);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      const profileKey = activeProfile?.id || activeProfile?.name || 'default';
      localStorage.setItem(`gbpilot_keywords_${profileKey}`, JSON.stringify(updated));
    }
  };

  const handleRemoveKeyword = (id: string) => {
    const removedPill = keywordPills.find(p => p.id === id);
    const updated = keywordPills.filter(p => p.id !== id);
    setKeywordPills(updated);
    
    // If the removed pill was currently selected, select the first remaining pill
    if (removedPill && selectedKeyword.toLowerCase() === removedPill.label.toLowerCase()) {
      if (updated.length > 0) {
        setSelectedKeyword(updated[0].label);
      } else {
        setSelectedKeyword('');
      }
    }

    if (typeof window !== 'undefined') {
      const profileKey = activeProfile?.id || activeProfile?.name || 'default';
      localStorage.setItem(`gbpilot_keywords_${profileKey}`, JSON.stringify(updated));
    }

    setScanNotice(removedPill ? `Removed query "${removedPill.label}".` : 'Search query removed.');
  };

  const handleResetKeywords = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
    setIsLoadingKeywords(true);
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/geo-grid/suggest-keywords?profile_id=${encodeURIComponent(activeProfile?.id || 'default')}`
      );
      if (res.ok) {
        const data = await res.json();
        const fresh: KeywordPill[] = (data.keywords || [])
          .filter((k: any) => k.keyword && sanitizeQueryLabel(k.keyword))
          .map((k: any, i: number) => ({
            id: `kw-api-${i}-${k.source}`,
            label: k.keyword,
            category: 'PRODUCT' as const,
            source: k.source as 'GBP_REAL' | 'GOOGLE_SUGGEST',
            impressions: k.impressions || undefined,
          }));
        setKeywordsHaveRealData(Boolean(data.has_real_data));
        setKeywordPills(fresh);
        if (fresh.length > 0) setSelectedKeyword(fresh[0].label);
        // Clear stored custom pills for this profile on reset
        if (typeof window !== 'undefined') {
          const profileKey = activeProfile?.id || activeProfile?.name || 'default';
          localStorage.removeItem(`gbpilot_keywords_${profileKey}`);
        }
        setScanNotice(data.has_real_data
          ? 'Запросы обновлены из реальных данных GBP.'
          : 'Запросы обновлены из Google Suggest. Подключите GBP для реальных данных.'
        );
      } else {
        setScanNotice('Не удалось обновить запросы. Проверьте соединение.');
      }
    } catch {
      setScanNotice('Ошибка загрузки запросов с сервера.');
    } finally {
      setIsLoadingKeywords(false);
    }
  };

  const handleGridSizeChange = (newSize: '3x3' | '5x5' | '7x7') => {
    setGridSize(newSize);
    setSelectedNode(null);
    setGridRanks(buildGridTemplate(newSize));
    setScanMetrics(null);
    setScanMeta(null);
  };

  const generateLocalSpatialRanks = (dimension: number, _businessName: string, _keyword: string) => {
    const ranks: GridNodeData[] = [];
    for (let pos = 1; pos <= dimension * dimension; pos++) {
      ranks.push({ pos, rank: null, state: 'NO_DATA' as GridNodeState, competitor: '—' });
    }
    setGridRanks(ranks);
    setCompetitors([]);
    setScanMetrics(null);
    setScanMeta(null);
  };

  const handleScan = async (keywordOverride?: string) => {
    const kwToScan = (typeof keywordOverride === 'string' ? keywordOverride : selectedKeyword).trim();
    if (!kwToScan) {
      alert('Введите или выберите поисковый запрос для сканирования');
      return;
    }
    setIsScanning(true);
    setScanNotice(null);
    setSelectedNode(null);
    setScanMetrics(null);
    setScanMeta(null);

    const dim = gridSize === '7x7' ? 7 : gridSize === '5x5' ? 5 : 3;
    const bName = activeProfile?.name || kwToScan;
    const bAddress = activeProfile?.address || activeProfile?.city || '';

    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('gbpilot_active_profile') : null;
      let profileId = 'default';
      let placeId: string | undefined;
      let planId = 'FREE_SCOUT';
      let userEmail: string | undefined;

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.id) profileId = String(parsed.id);
          if (parsed.place_id) placeId = parsed.place_id;
          if (parsed.email) userEmail = parsed.email;
        } catch (_) {}
      }

      const sub = typeof window !== 'undefined' ? localStorage.getItem('gbpilot_subscription') : null;
      if (sub) {
        try { planId = JSON.parse(sub).plan_id || 'FREE_SCOUT'; } catch (_) {}
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(`${baseUrl}/api/v1/geo-grid/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: profileId,
          business_name: bName,
          address: bAddress,
          keyword: kwToScan,
          grid_size: dim,
          distance_meters: 500.0,
          place_id: placeId,
          plan_id: planId,
          user_email: userEmail,
          mode: 'bias',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();

        // ── Handle limit_reached ──
        if (data.status === 'limit_reached') {
          setScanNotice(
            `Лимит сканов исчерпан (${data.meta?.scans_used ?? '?'}/${data.meta?.scans_limit ?? '?'} в месяц). ` +
            `Сброс в начале следующего месяца.`
          );
          setIsScanning(false);
          return;
        }

        // ── Handle error (no coordinates etc.) ──
        if (data.status === 'error') {
          setScanNotice(`Ошибка: ${data.message || 'Не удалось определить координаты бизнеса. Подключите Google Business Profile.'}`);
          setIsScanning(false);
          return;
        }

        if (data.grid && Array.isArray(data.grid) && data.grid.length > 0) {
          // Map grid nodes — new schema: state, rank (nullable), top3[]
          const newRanks: GridNodeData[] = data.grid.map((g: any) => ({
            pos: g.pos,
            rank: g.rank ?? null,
            state: (g.state || 'NO_DATA') as GridNodeState,
            competitor: g.state === 'FOUND'
              ? (g.top3?.[0]?.name || '—')
              : g.state === 'NOT_IN_TOP20'
              ? '20+'
              : '—',
            lat: g.lat,
            lng: g.lng,
            top3: Array.isArray(g.top3) ? g.top3 : [],
          }));
          setGridRanks(newRanks);

          // Metrics
          if (data.metrics) setScanMetrics(data.metrics as ScanMetrics);
          if (data.meta)    setScanMeta(data.meta as ScanMeta);

          // Competitors list (from top-level competitors array)
          if (Array.isArray(data.competitors) && data.competitors.length > 0) {
            setCompetitors(
              data.competitors.map((c: any, idx: number) => ({
                placeId: c.place_id,
                name: String(c.name || ''),
                address: c.address || '',
                googleMapsUrl: c.google_maps_url || '',
                websiteUrl: c.website_url || '',
                phone: c.phone || '',
                rating: Number(c.rating || 0),
                reviewsCount: Number(c.reviews_count || 0),
                priceLevel: c.price_level || '',
                convenience: [],
                specialtyKeywords: [kwToScan],
                diffScore: idx === 0 ? 'LEADER' : idx === 1 ? 'CHALLENGER' : 'LAGGING',
                primaryCategory: c.primary_category || '',
                secondaryCategories: Array.isArray(c.secondary_categories) ? c.secondary_categories : [],
                gridWins: Number(c.appearances ?? c.grid_wins ?? 1),
                avgRank: Number(c.avg_rank ?? idx + 1),
                openNow: c.open_now,
                photosCount: Number(c.photos_count || 0),
              }))
            );
          } else {
            setCompetitors([]);
          }

          const cacheMsg = data.meta?.cached ? ' (из кэша)' : '';
          const accuracyMsg = data.meta?.accuracy_note ? ` · ${data.meta.accuracy_note}` : '';
          setScanNotice(
            `Сканирование завершено для «${kwToScan}»${cacheMsg}${accuracyMsg}`
          );
          return;
        }
      }

      // Non-200 or empty grid — show empty state
      generateLocalSpatialRanks(dim, bName, kwToScan);
      setScanNotice('Бэкенд не вернул данные. Проверьте соединение или попробуйте позже.');

    } catch (e: any) {
      if (e?.name === 'AbortError') {
        setScanNotice('Сканирование превысило тайм-аут (30 с). Попробуйте меньшую сетку.');
      } else {
        console.warn('Scan error:', e);
        generateLocalSpatialRanks(
          gridSize === '7x7' ? 7 : gridSize === '5x5' ? 5 : 3,
          activeProfile?.name || '',
          kwToScan
        );
        setScanNotice('Ошибка соединения. Данные не загружены.');
      }
    } finally {
      setIsScanning(false);
    }
  };

    const getColClass = () => {
    if (gridSize === '7x7') return 'grid-cols-7 gap-2 sm:gap-3';
    if (gridSize === '5x5') return 'grid-cols-5 gap-3 sm:gap-4';
    return 'grid-cols-3 gap-4 sm:gap-6';
  };

  const getPinSizeClass = () => {
    if (gridSize === '7x7') return 'w-9 h-9 sm:w-12 sm:h-12 text-[10px] sm:text-xs';
    if (gridSize === '5x5') return 'w-12 h-12 sm:w-16 sm:h-16 text-xs sm:text-sm';
    return 'w-16 h-16 sm:w-22 sm:h-22 text-base sm:text-lg';
  };

  return (
    <div className="min-h-screen bg-google-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
        
        {/* Header & Tab Bar */}
        <div className="material-card p-5 sm:p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-google-border rounded-2xl shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-google-text-primary flex items-center gap-2">
              <MapPin className="w-6 h-6 text-google-blue" />
              Geo-Grid & AI LLM Visibility Radar
            </h1>
            <p className="text-xs text-google-text-secondary mt-1">
              Spatial rank heatmap tracking & AI Search Share-of-Voice (ChatGPT, Gemini, Perplexity).
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-google-bg p-1 rounded-xl border border-google-border self-stretch sm:self-auto">
            <button
              onClick={() => setActiveTab('MAPS_GRID')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'MAPS_GRID'
                  ? 'bg-white text-google-blue shadow-sm border border-google-border-light'
                  : 'text-google-text-secondary hover:text-google-text-primary'
              }`}
            >
              📍 Google Maps Geo-Grid
            </button>
            <button
              onClick={() => setActiveTab('AI_LLM_GEO')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'AI_LLM_GEO'
                  ? 'bg-white text-google-blue shadow-sm border border-google-border-light'
                  : 'text-google-text-secondary hover:text-google-text-primary'
              }`}
            >
              🤖 AI Search Share-of-Voice (GEO)
            </button>
          </div>
        </div>

        {/* TAB 1: GOOGLE MAPS GEO-GRID */}
        {activeTab === 'MAPS_GRID' && (
          <div className="space-y-6">

            {/* ======================================================== */}
            {/* SMART KEYWORD GROUNDING HUB (JTBD Zero-Hallucination)    */}
            {/* ======================================================== */}
            <div className="material-card p-5 bg-white border border-google-border rounded-2xl shadow-sm space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-google-border-light pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-google-blue" />
                    <h2 className="text-sm font-bold text-slate-900">
                      Target Search Queries (Local Keyword Engine)
                    </h2>
                    <span className="text-[10px] font-bold text-google-blue bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      Verified Niche Terms
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    AI pre-extracted high-intent terms real guests use in Google Maps. Select a query, add your own custom terms, or remove unneeded chips.
                  </p>
                </div>

                {/* Actions: Reset Suggestions + Add Custom Query */}
                <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleResetKeywords}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Reset to AI suggested niche queries"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Suggestions</span>
                  </button>

                  {!isAddingCustom ? (
                    <button
                      type="button"
                      onClick={() => setIsAddingCustom(true)}
                      className="text-xs font-bold text-google-blue hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl border border-blue-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Custom Search Query</span>
                    </button>
                  ) : (
                    <form onSubmit={handleAddCustomKeyword} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        value={newCustomKeyword}
                        onChange={(e) => setNewCustomKeyword(e.target.value)}
                        placeholder="e.g. visa extension, border run, coffee..."
                        className="material-input text-xs py-1 px-2.5 w-52 rounded-lg border border-google-blue ring-1 ring-google-blue/30"
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-google-blue hover:bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Add ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsAddingCustom(false); setNewCustomKeyword(''); }}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg text-xs cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Category Deficiency Warning Banner */}
              {isCategoryDeficient && (
                <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5 md:mt-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-amber-950 flex flex-wrap items-center gap-2">
                        <span>Critical Profile Optimization Alert: Missing Verified Category</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-100 text-rose-800 font-extrabold uppercase tracking-wide">
                          Rank Penalty Risk
                        </span>
                      </div>
                      <p className="text-amber-900/80 text-[11px] mt-0.5 leading-relaxed">
                        Your Google Business Profile has assigned fallback placeholder <strong>"{activeProfile?.category || 'Local Business'}"</strong> because no primary niche category is set. Google Maps rank algorithms cannot route high-intent customer searches without a verified category (e.g. <em>{getCategoryRecommendation()}</em>).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <a
                      href="https://business.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Update in Google Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Visual Interactive Chips Flow */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {isLoadingKeywords ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic py-1">
                    <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-google-blue rounded-full animate-spin" />
                    Загружаем реальные поисковые запросы из GBP...
                  </div>
                ) : keywordPills.map((pill) => {
                  const isSelected = selectedKeyword.toLowerCase().trim() === pill.label.toLowerCase().trim();
                  const srcBadge = pill.source === 'GBP_REAL'
                    ? { label: '📊 GBP', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
                    : pill.source === 'GOOGLE_SUGGEST'
                    ? { label: '🔍 G', cls: 'bg-blue-50 text-blue-700 border-blue-200' }
                    : null;
                  return (
                    <div
                      key={pill.id}
                      onClick={() => {
                        setSelectedKeyword(pill.label);
                      }}
                      className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-google-blue text-white border-google-blue shadow-sm ring-2 ring-blue-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-white shrink-0" />
                      ) : (
                        <span className="text-slate-400 font-normal">#</span>
                      )}
                      <span>{pill.label}</span>
                      {/* Source badge — only when not selected */}
                      {srcBadge && !isSelected && (
                        <span className={`text-[9px] font-extrabold px-1 py-0.5 rounded border ${srcBadge.cls}`}>
                          {srcBadge.label}
                          {pill.source === 'GBP_REAL' && pill.impressions
                            ? ` ${pill.impressions}`
                            : ''}
                        </span>
                      )}
                      {/* Impressions tooltip for GBP_REAL when selected */}
                      {isSelected && pill.source === 'GBP_REAL' && pill.impressions && (
                        <span className="text-[9px] font-bold text-white/70 ml-0.5">
                          {pill.impressions} показов
                        </span>
                      )}
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveKeyword(pill.id);
                        }}
                        className={`p-0.5 rounded-full transition-colors ml-0.5 cursor-pointer ${
                          isSelected
                            ? 'text-white/80 hover:text-white hover:bg-white/20'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                        title={`Remove "${pill.label}"`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}

                {!isLoadingKeywords && keywordPills.length === 0 && (
                  <div className="text-xs text-slate-400 italic py-1">
                    Нет запросов. Нажмите «Reset Suggestions» или добавьте вручную.
                  </div>
                )}
              </div>

              {/* GBP Real Data badge */}
              {keywordsHaveRealData && !isLoadingKeywords && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Запросы из реальной статистики Google Business Profile
                </div>
              )}

              {/* Active Focus Pill Status Bar */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-google-blue shrink-0" />
                  <span className="text-slate-700">
                    Active Geo-Grid Query: <strong className="text-slate-900">"{selectedKeyword}"</strong>
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                  High Commercial Intent • Ready for Scan
                </span>
              </div>
            </div>
            
            {/* Control Filters Bar */}
            <div className="material-card p-4 bg-white flex flex-wrap items-center justify-between gap-4 text-xs border border-google-border rounded-2xl shadow-sm">
              
              {/* Keyword Selector Input */}
              <div className="flex items-center gap-2 flex-wrap">
                <Search className="w-4 h-4 text-google-text-tertiary" />
                <span className="font-semibold text-google-text-secondary">Selected Query:</span>
                <input
                  type="text"
                  value={selectedKeyword}
                  onChange={(e) => setSelectedKeyword(e.target.value)}
                  placeholder="e.g. coffee shop, visa service, bakery..."
                  className="material-input text-xs py-1.5 px-3 w-56 sm:w-64 font-medium bg-white border border-google-border rounded-lg"
                />
              </div>

              {/* Grid Selector */}
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-google-text-tertiary" />
                <span className="font-semibold text-google-text-secondary">Grid Dimension:</span>
                <div className="flex bg-google-bg p-1 rounded-lg border border-google-border">
                  {(['3x3', '5x5', '7x7'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleGridSizeChange(size)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        gridSize === size ? 'bg-white text-google-blue shadow-xs' : 'text-google-text-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scan Trigger */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleScan()}
                  disabled={isScanning}
                  className="material-button-primary text-xs py-2 px-5 font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {isScanning ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Scanning API...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5" />
                      Run Live Grid Scan
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Scan Feedback Notice */}
            {scanNotice && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-google-blue flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="font-medium">{scanNotice}</span>
              </div>
            )}

            
              {/* ── Scan Meta: cache badge + quota + accuracy note ── */}
              {scanMeta && (
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  {scanMeta.cached && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-bold flex items-center gap-1">
                      💾 Кэш{scanMeta.cached_at ? ` · ${new Date(scanMeta.cached_at).toLocaleString('ru-RU', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}` : ''}
                    </span>
                  )}
                  {scanMeta.scans_limit !== null && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-google-blue border border-blue-200 font-bold">
                      Сканов: {scanMeta.scans_used ?? 0}/{scanMeta.scans_limit}
                    </span>
                  )}
                  {scanMeta.accuracy_note && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                      ℹ️ {scanMeta.accuracy_note}
                    </span>
                  )}
                </div>
              )}

              {/* ── ARP / ATRP / SoLV metrics bar ── */}
              {scanMetrics && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">ARP</div>
                    <div className="text-lg font-black text-slate-900">{scanMetrics.arp?.toFixed(1) ?? '—'}</div>
                    <div className="text-[10px] text-slate-400">Ср. ранг</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">ATRP</div>
                    <div className="text-lg font-black text-slate-900">{scanMetrics.atrp?.toFixed(1) ?? '—'}</div>
                    <div className="text-[10px] text-slate-400">Топ-ранг</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">SoLV</div>
                    <div className="text-lg font-black text-emerald-800">
                      {scanMetrics.solv !== undefined && scanMetrics.solv !== null
                        ? `${(scanMetrics.solv * 100).toFixed(0)}%`
                        : '—'}
                    </div>
                    <div className="text-[10px] text-emerald-600">Видимость в топ-3</div>
                  </div>
                </div>
              )}

{/* Spatial Map Viewport & Pin Heatmap */}
            <div className="material-card p-4 sm:p-6 bg-white relative overflow-hidden border border-google-border rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-google-text-primary text-sm">
                    Spatial Pin Heatmap ({gridSize}) — {activeProfile?.name || 'Active Profile'}
                  </h3>
                  <p className="text-xs text-google-text-secondary">
                    Distance Step: 0.5 km radius around {activeProfile?.address || activeProfile?.city || 'Selected Venue Address'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setShowMapBackdrop(!showMapBackdrop)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                      showMapBackdrop
                        ? 'bg-blue-50 text-google-blue border-blue-200 hover:bg-blue-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Toggle pale Google Maps street backdrop"
                  >
                    <Map className="w-3.5 h-3.5" />
                    <span>Map Backdrop: {showMapBackdrop ? 'ON' : 'OFF'}</span>
                  </button>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-600" /> Top 3 (Dominance Zone)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Rank 4-8 (Vulnerable Zone)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> Rank 9+ (Lost Customer Zone)</span>
                </div>
              </div>

              {/* Simulated Interactive Map Grid Box */}
              <div className="w-full min-h-[400px] sm:min-h-[440px] bg-slate-100 rounded-2xl relative flex items-center justify-center border border-google-border overflow-hidden p-4 sm:p-6 shadow-inner">
                {showMapBackdrop ? (
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                    <iframe
                      title="Google Maps Street Backdrop"
                      src={`https://www.google.com/maps?q=${mapCoords?.lat},${mapCoords?.lng}&z=15&output=embed`}
                      className="w-full h-full border-0 opacity-35 grayscale-[65%] contrast-[110%] scale-110 pointer-events-none"
                      tabIndex={-1}
                      loading="lazy"
                      aria-hidden="true"
                    />
                    {/* Subtle translucent overlay to guarantee crisp pin badge contrast */}
                    <div className="absolute inset-0 bg-white/45 backdrop-blur-[0.5px]" />
                  </div>
                ) : (
                  /* Background Map Graphic Pattern */
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1A73E8_1px,transparent_1px)] [background-size:16px_16px]" />
                )}
                
                {/* Pin Matrix Overlay */}
                <div className={`grid ${getColClass()} relative z-10 p-2 sm:p-4 max-w-full overflow-x-auto`}>
                  {gridRanks.map((item) => {
                    const isSelected = selectedNode?.pos === item.pos;
                    const state = (item as GridNodeData).state || 'NO_DATA';
                    const rank = (item as GridNodeData).rank;

                    // Colour by state
                    let bgClass = 'bg-slate-300 text-slate-500 border border-slate-300'; // NO_DATA
                    if (state === 'NOT_IN_TOP20') bgClass = 'bg-rose-500 text-white shadow-md shadow-rose-500/20';
                    else if (state === 'FOUND') {
                      if (rank !== null && rank <= 3) bgClass = 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20';
                      else if (rank !== null && rank <= 8) bgClass = 'bg-amber-500 text-white shadow-md shadow-amber-500/20';
                      else bgClass = 'bg-rose-500 text-white shadow-md shadow-rose-500/20';
                    }

                    // Label inside pin
                    let pinLabel = '—';
                    if (state === 'NOT_IN_TOP20') pinLabel = '20+';
                    else if (state === 'FOUND' && rank !== null) pinLabel = `#${rank}`;

                    return (
                      <div
                        key={item.pos}
                        onClick={() => setSelectedNode(item as GridNodeData)}
                        className={`${getPinSizeClass()} rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all transform hover:scale-110 active:scale-95 cursor-pointer relative ${bgClass} ${
                          isSelected ? 'ring-3 ring-google-blue scale-110 shadow-lg' : ''
                        }`}
                        title={`Точка #${item.pos}: ${pinLabel} — ${(item as GridNodeData).competitor || state}`}
                      >
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5 fill-current opacity-90" />
                        <span className="font-black leading-none">{pinLabel}</span>
                        {gridSize !== '7x7' && state === 'FOUND' && (
                          <span className="text-[8px] sm:text-[9px] opacity-90 truncate max-w-[50px] sm:max-w-[65px] px-0.5">
                            {(item as GridNodeData).competitor}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Node Inspector — shows top3 for the selected grid point */}
              {selectedNode && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 text-xs animate-in fade-in overflow-hidden">
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-3 p-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                        selectedNode.state === 'FOUND' && selectedNode.rank !== null && selectedNode.rank <= 3
                          ? 'bg-emerald-600'
                          : selectedNode.state === 'FOUND' && selectedNode.rank !== null && selectedNode.rank <= 8
                          ? 'bg-amber-500'
                          : selectedNode.state === 'NOT_IN_TOP20'
                          ? 'bg-rose-500'
                          : 'bg-slate-400'
                      }`}>
                        {selectedNode.state === 'FOUND' && selectedNode.rank !== null
                          ? `#${selectedNode.rank}`
                          : selectedNode.state === 'NOT_IN_TOP20'
                          ? '20+'
                          : '—'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          Точка #{selectedNode.pos} ·{' '}
                          {selectedNode.state === 'FOUND' && selectedNode.rank !== null && selectedNode.rank <= 3
                            ? 'Зона доминирования'
                            : selectedNode.state === 'FOUND' && selectedNode.rank !== null && selectedNode.rank <= 8
                            ? 'Уязвимая зона'
                            : selectedNode.state === 'NOT_IN_TOP20'
                            ? 'Зона потери клиентов (20+)'
                            : 'Нет данных API'}
                        </div>
                        <div className="text-slate-500 text-[11px]">Запрос: «{selectedKeyword}»</div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${
                      selectedNode.state === 'FOUND' && selectedNode.rank !== null && selectedNode.rank <= 3
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : selectedNode.state === 'NOT_IN_TOP20'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {selectedNode.state === 'FOUND' && selectedNode.rank === 1
                        ? '100% Видимость'
                        : selectedNode.state === 'FOUND' && selectedNode.rank !== null && selectedNode.rank <= 3
                        ? 'Топ-3 Local Pack'
                        : selectedNode.state === 'NOT_IN_TOP20'
                        ? 'Ниже 20-го места'
                        : 'NO DATA'}
                    </span>
                  </div>

                  {/* Top-3 table for this grid point */}
                  {selectedNode.top3 && selectedNode.top3.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="bg-white border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wide text-[10px]">
                            <th className="py-2 px-3">#</th>
                            <th className="py-2 px-3">Бизнес в этой точке</th>
                            <th className="py-2 px-3">Рейтинг</th>
                            <th className="py-2 px-3">Вы?</th>
                            <th className="py-2 px-3">Maps</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedNode.top3.map((t) => (
                            <tr key={t.place_id || t.rank} className={t.is_you ? 'bg-emerald-50' : 'bg-white'}>
                              <td className="py-2 px-3 font-extrabold text-slate-700">#{t.rank}</td>
                              <td className="py-2 px-3 font-semibold text-slate-900 max-w-[180px] truncate">{t.name}</td>
                              <td className="py-2 px-3 text-slate-600">{t.rating > 0 ? t.rating.toFixed(1) : '—'}</td>
                              <td className="py-2 px-3">
                                {t.is_you
                                  ? <span className="text-emerald-700 font-bold">✓ Вы</span>
                                  : <span className="text-slate-400">—</span>}
                              </td>
                              <td className="py-2 px-3">
                                <a
                                  href={t.google_maps_url || `https://www.google.com/maps/place/?q=place_id:${t.place_id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-google-blue hover:underline font-bold"
                                >
                                  ↗
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-3 text-slate-400 italic text-[11px]">
                      {selectedNode.state === 'NO_DATA'
                        ? 'Google Places API не вернул данные для этой точки.'
                        : selectedNode.state === 'NOT_IN_TOP20'
                        ? 'Ваш бизнес не попал в топ-20 из этой точки.'
                        : 'Нажмите «Run Live Grid Scan» для получения данных.'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Competitor Differentiation Matrix Component */}
            <CompetitorMatrix
              competitors={competitors}
              targetKeyword={selectedKeyword}
              activeProfileId={String(activeProfile?.id || 'default')}
              activeBusinessName={activeProfile?.name || ''}
              activeBusinessCategory={activeProfile?.category || ''}
              totalGridNodes={gridRanks.length}
              onCategoriesAdopted={(newCats) => {
                if (activeProfile) {
                  setActiveProfile({
                    ...activeProfile,
                    category: newCats.join(', ')
                  });
                }
              }}
            />

          </div>
        )}

        {/* TAB 2: AI SEARCH SHARE-OF-VOICE (GEO) & FIELD-BY-FIELD DIRECTORY BUILDER */}
        {activeTab === 'AI_LLM_GEO' && (
          <div className="space-y-6 animate-in fade-in duration-300">

            {/* Toast Banner */}
            {geoToast && (
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs font-medium flex items-center justify-between gap-3 shadow-lg border border-slate-700 animate-in slide-in-from-top duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{geoToast}</span>
                </div>
                <button onClick={() => setGeoToast(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Directory Sync Status Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="material-card p-5 bg-white space-y-2 border border-google-border rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-google-text-secondary">Apple Maps &amp; Siri</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-google-blue border border-blue-200">
                    Apple Business Connect
                  </span>
                </div>
                <span className="text-2xl font-black text-google-blue block">
                  {completedPlatforms['APPLE_MAPS'] ? 'Заполнено' : '—'}
                </span>
                <p className="text-[11px] text-google-text-tertiary">
                  Статус размещения карточки в Apple Maps
                </p>
              </div>

              <div className="material-card p-5 bg-white space-y-2 border border-google-border rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-google-text-secondary">2GIS Directory</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    2GIS Business
                  </span>
                </div>
                <span className="text-2xl font-black text-google-green block">
                  {completedPlatforms['TWO_GIS'] ? 'Заполнено' : '—'}
                </span>
                <p className="text-[11px] text-google-text-tertiary">
                  Статус размещения карточки в 2GIS
                </p>
              </div>

              <div className="material-card p-5 bg-white space-y-2 border border-google-border rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-google-text-secondary">TripAdvisor &amp; Каталоги</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Внешние площадки
                  </span>
                </div>
                <span className="text-2xl font-black text-purple-600 block">
                  {Object.values(completedPlatforms).filter(Boolean).length} / {directoryBlueprints.length}
                </span>
                <p className="text-[11px] text-google-text-tertiary">
                  Отмечено заполненными пользователем
                </p>
              </div>
            </div>

            {/* ======================================================== */}
            {/* MULTI-PLATFORM 100% EXACT FIELD-BY-FIELD BUILDER (PRO)   */}
            {/* ======================================================== */}
            <div className="material-card p-5 sm:p-6 bg-white space-y-6 border border-google-border rounded-2xl shadow-sm">
              
              {/* Header & Pro Status */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-google-border-light pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Sparkles className="w-5 h-5 text-google-blue" />
                    <h3 className="font-black text-slate-900 text-base sm:text-lg">
                      Multi-Platform External Maps & AI Directory Builder (100% Exact Field Specs)
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      isProPlan
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {isProPlan ? '✓ Pro Plan Active (All fields unlocked)' : '🔒 Available on Pro Plan'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    AI search engines (ChatGPT, Siri, Perplexity) and iPhone drivers search for your business across <strong>Apple Maps, 2GIS, TripAdvisor, and media directories</strong>. We formatted verified profile data for <strong>{activeProfile?.name || 'your business'}</strong> strictly matching each platform's exact input fields and character limits — open each portal and copy-paste ready blocks in under 3 minutes.
                  </p>
                </div>

                {!isProPlan && (
                  <button
                    type="button"
                    onClick={handleUnlockProDirectory}
                    className="px-4 py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0 self-start lg:self-center"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock All Fields (14-Day Pro for $0)</span>
                  </button>
                )}
              </div>

              {/* 4 Platform Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {directoryBlueprints.map((platform) => {
                  const isSelected = selectedDirectoryPlatform === platform.id;
                  const isDone = Boolean(completedPlatforms[platform.id]);

                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => setSelectedDirectoryPlatform(platform.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'border-google-blue bg-blue-50/40 ring-2 ring-google-blue/20 shadow-xs'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          {platform.badge}
                        </span>
                        {isDone ? (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            100%
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400">
                            {platform.blocks.length} fields
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-xs text-slate-900 leading-snug">
                          {platform.name}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                          <DollarSign className="w-3 h-3 shrink-0" />
                          <span>Potential: {platform.estimatedMonthlyValue}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Platform Summary & Action Bar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                      {activeDirectoryBlueprint.aiCitationImpact}
                    </span>
                    <span className="text-[11px] text-emerald-300 font-bold">
                      • Setup time: {activeDirectoryBlueprint.completionTime}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    {activeDirectoryBlueprint.name}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeDirectoryBlueprint.financialWhyText}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <a
                    href={activeDirectoryBlueprint.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>1. Open {activeDirectoryBlueprint.portalDomain}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyAllDirectoryBlocks}
                    className="px-4 py-2.5 rounded-xl bg-google-blue hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    {copiedBlockId === 'ALL_BLOCKS' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>All fields copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>2. Copy all {activeDirectoryBlueprint.blocks.length} fields</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePlatformCompleted(activeDirectoryBlueprint.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      completedPlatforms[activeDirectoryBlueprint.id]
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : 'bg-white/5 hover:bg-white/15 text-slate-200 border-white/20'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {completedPlatforms[activeDirectoryBlueprint.id] ? '100% Completed' : 'Mark as Complete'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Field-by-Field Blocks List */}
              <div className="space-y-4">
                {activeDirectoryBlueprint.blocks.map((block) => {
                  const isUnlocked = isProPlan || block.isFreePreview;
                  const currentValue =
                    customBlockOverrides[block.id] !== undefined ? customBlockOverrides[block.id] : block.value;
                  const charCount = currentValue.length;
                  const isOverLimit = block.maxChars ? charCount > block.maxChars : false;

                  return (
                    <div
                      key={block.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isUnlocked
                          ? 'bg-white border-slate-200 shadow-2xs'
                          : 'bg-slate-50/80 border-slate-200/80 relative overflow-hidden'
                      }`}
                    >
                      {/* Block Top Bar: Title, Cabinet Path & Copy Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-google-blue border border-blue-200 text-[10px] font-extrabold">
                              Field #{block.blockNumber}
                            </span>
                            <h5 className="font-extrabold text-xs sm:text-sm text-slate-900">
                              {block.fieldTitle}
                            </h5>
                            {block.isFreePreview && !isProPlan && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Free Preview
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-slate-700">Dashboard Path:</span>
                            <code className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] border border-slate-200">
                              {block.exactCabinetPath}
                            </code>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                          {block.maxChars && (
                            <span
                              className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                                isOverLimit
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {charCount} / {block.maxChars} chars ✓
                            </span>
                          )}

                          {isUnlocked ? (
                            <button
                              type="button"
                              onClick={() => handleCopyDirectoryBlock(block.id, currentValue, block.fieldTitle)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                copiedBlockId === block.id
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-google-blue hover:bg-blue-600 text-white shadow-2xs'
                              }`}
                            >
                              {copiedBlockId === block.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>📋 Copy Field</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleUnlockProDirectory}
                              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Unlock on Pro ($0 Trial)</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Validation & Moderation Rule Hint */}
                      <div className="my-2.5 px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-950 flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Platform Requirement:</strong> {block.validationRule}
                        </span>
                      </div>

                      {/* Field Content (Editable when unlocked, blurred preview when locked on Free Scout) */}
                      {isUnlocked ? (
                        <textarea
                          rows={currentValue.split('\n').length > 2 ? Math.min(6, currentValue.split('\n').length + 1) : 2}
                          value={currentValue}
                          onChange={(e) =>
                            setCustomBlockOverrides((prev) => ({
                              ...prev,
                              [block.id]: e.target.value
                            }))
                          }
                          className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs text-slate-800 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue"
                        />
                      ) : (
                        <div className="relative rounded-xl border border-slate-200 bg-slate-100/70 p-3.5 overflow-hidden">
                          <pre className="text-xs font-mono text-slate-400 select-none blur-[4px] whitespace-pre-wrap line-clamp-3">
                            {currentValue}
                          </pre>
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col sm:flex-row items-center justify-center gap-3 p-3 text-center">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <Lock className="w-4 h-4 text-google-blue shrink-0" />
                              <span>Verified block tailored for {activeDirectoryBlueprint.name} limit is available on the Pro plan</span>
                            </span>
                            <button
                              type="button"
                              onClick={handleUnlockProDirectory}
                              className="px-3.5 py-1.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                            >
                              Unlock Free (14-Day Trial) →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
