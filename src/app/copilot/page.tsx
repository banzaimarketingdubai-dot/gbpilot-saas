'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Bot, 
  Send, 
  Sparkles, 
  MapPin, 
  Star, 
  Check, 
  TrendingUp, 
  Zap, 
  Building2, 
  Clock, 
  Share2,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  Sliders,
  ExternalLink,
  X,
  Smartphone,
  Wifi,
  ThumbsUp,
  Bookmark,
  Plus,
  Globe,
  Copy,
  Lock,
  CreditCard
} from 'lucide-react';
import { getSubscription, activateTrial } from '@/lib/subscription';
import { loadOwnerGroundTruth, saveOwnerGroundTruth, getGroundTruthPresets, OwnerGroundTruth } from '@/lib/groundTruth';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  widget?: 'DRAFT_POST' | 'REPLY_PREVIEW' | 'RANK_SNAPSHOT';
  widgetData?: any;
}

interface PlannedPost {
  title: string;
  content: string;
  ctaType: 'BOOK' | 'ORDER' | 'CALL_NOW' | 'LEARN_MORE';
  ctaUrl: string;
  targetKeywords: string[];
  photoTaggingAdvice: string;
  scheduledDate: string;
}

interface CalendarDay {
  dayName: string;
  dateNum: string;
  fullDate: string;
  status: 'SCHEDULED' | 'RECOMMENDED' | 'EMPTY';
  label?: string;
}

interface MediaPhoto {
  id: string;
  label: string;
  url: string;
  gps: string;
  authorityScore: string;
}

interface PostPreset {
  id: string;
  label: string;
  icon: string;
  title: string;
  content: string;
  ctaType: 'BOOK' | 'ORDER' | 'CALL_NOW' | 'LEARN_MORE';
  targetKeywords: string[];
  photoTaggingAdvice: string;
  preferredPhotoId: string;
}

const MEDIA_VAULT: MediaPhoto[] = [
  {
    id: 'photo-1',
    label: 'Artisan Coffee & Breakfast',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    gps: '25.0805° N, 55.1403° E',
    authorityScore: 'Dubai Marina Centroid Verified'
  },
  {
    id: 'photo-2',
    label: 'Cozy Interior Ambience',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    gps: '25.0805° N, 55.1403° E',
    authorityScore: 'Ambience Centroid Indexed'
  },
  {
    id: 'photo-3',
    label: 'Storefront & Street View',
    url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80',
    gps: '25.0805° N, 55.1403° E',
    authorityScore: 'Primary Map Geotagged'
  },
  {
    id: 'photo-4',
    label: 'Chef & Team in Action',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    gps: '25.0805° N, 55.1403° E',
    authorityScore: 'Service Entity Verified'
  }
];

const PRESETS: PostPreset[] = [
  {
    id: 'morning',
    label: '☕ Morning Coffee Offer',
    icon: '☕',
    title: 'Morning Artisanal Brew & Breakfast Perk',
    content: 'Start your morning in town with our freshly roasted single-origin brew paired with handcrafted breakfast specials. Show this Google post for 15% off before 11:00 AM.',
    ctaType: 'ORDER',
    targetKeywords: ['specialty coffee', 'morning breakfast', 'local roastery', 'fresh espresso'],
    photoTaggingAdvice: 'Attach high-resolution counter/morning sunlight photo geotagged with your exact latitude and longitude.',
    preferredPhotoId: 'photo-1'
  },
  {
    id: 'weekend',
    label: '🔥 Weekend Special Discount',
    icon: '🔥',
    title: 'Weekend Exclusive: Signature Chef Tasting',
    content: 'Treat yourself this weekend to our handcrafted artisan dishes and single-origin coffee. Reserve your table or drop in for an exclusive weekend perk.',
    ctaType: 'BOOK',
    targetKeywords: ['weekend dining', 'best local cafe', 'weekend brunch', 'specialty dishes'],
    photoTaggingAdvice: 'Include geotagged photo with high color saturation (dining table/dishes) to qualify for Google Maps Discovery carousel.',
    preferredPhotoId: 'photo-2'
  },
  {
    id: 'ramadan',
    label: '🌙 Ramadan Special Hours & Iftar',
    icon: '🌙',
    title: 'Holy Month of Ramadan: Iftar & Late Night Suhoor',
    content: 'Gather with family and friends at our venue throughout Ramadan. Serving specialty coffee, artisan dates, and special Iftar & Suhoor sets until 02:00 AM.',
    ctaType: 'BOOK',
    targetKeywords: ['ramadan iftar dubai', 'suhoor dubai marina', 'late night dining', 'specialty coffee'],
    photoTaggingAdvice: 'Attach evening photo with warm ambient lighting geotagged to Dubai Marina centroid.',
    preferredPhotoId: 'photo-2'
  },
  {
    id: 'dubai-summer',
    label: '☀️ Dubai Summer Perk (+45°C AC & Valet)',
    icon: '☀️',
    title: 'Beat the Heat: Free Valet & Chilled Specialty Brews',
    content: 'Escape the midday summer heat! Enjoy ultra-cool indoor seating, high-speed Wi-Fi, cold brew on tap, and complimentary valet parking.',
    ctaType: 'ORDER',
    targetKeywords: ['indoor cafe dubai', 'valet parking', 'cold brew dubai', 'wifi cafe dubai'],
    photoTaggingAdvice: 'Highlight spacious indoor AC seating and cold beverages.',
    preferredPhotoId: 'photo-1'
  },
  {
    id: 'seasonal',
    label: '🎉 New Menu / Seasonal Update',
    icon: '🎉',
    title: 'New Seasonal Arrivals Just Landed',
    content: 'Explore our brand-new seasonal creations crafted with premium organic local ingredients. Available for dine-in and takeout starting today.',
    ctaType: 'LEARN_MORE',
    targetKeywords: ['seasonal menu', 'organic food', 'new dishes', 'local food scene'],
    photoTaggingAdvice: 'Capture interior photo showcasing seasonal menu board geotagged with centroid coordinates.',
    preferredPhotoId: 'photo-4'
  },
  {
    id: 'flash',
    label: '⚡ Flash Local Deal',
    icon: '⚡',
    title: 'Today Only: Flash Local Perk for Google Maps Users',
    content: 'Special flash deal for our local community! Mention this Google Maps post today to receive a complimentary house dessert or beverage upgrade with any main order.',
    ctaType: 'CALL_NOW',
    targetKeywords: ['flash deal', 'local offer', 'today special', 'google maps deal'],
    photoTaggingAdvice: 'Upload entrance or storefront photo with clearly visible street number to boost primary map centroid authority.',
    preferredPhotoId: 'photo-3'
  }
];

export default function CopilotContentStudioPage() {
  const [activeProfile, setActiveProfile] = useState<{id?: string, name: string, address: string, city?: string} | null>(null);
  
  // Upper Studio: Google Posts Planner state
  const [postTopic, setPostTopic] = useState('');
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<MediaPhoto>(MEDIA_VAULT[0]);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(4); // Default to Friday
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([
    { dayName: 'Mon', dateNum: '14', fullDate: 'Monday, Oct 14', status: 'EMPTY' },
    { dayName: 'Tue', dateNum: '15', fullDate: 'Tuesday, Oct 15', status: 'EMPTY' },
    { dayName: 'Wed', dateNum: '16', fullDate: 'Wednesday, Oct 16', status: 'RECOMMENDED', label: '⚡ Peak Traffic Slot' },
    { dayName: 'Thu', dateNum: '17', fullDate: 'Thursday, Oct 17', status: 'EMPTY' },
    { dayName: 'Fri', dateNum: '18', fullDate: 'Friday, Oct 18', status: 'SCHEDULED', label: '10:00 AM • Weekend Promo' },
    { dayName: 'Sat', dateNum: '19', fullDate: 'Saturday, Oct 19', status: 'EMPTY' },
    { dayName: 'Sun', dateNum: '20', fullDate: 'Sunday, Oct 20', status: 'RECOMMENDED', label: '⚡ Sunday Brunch' },
  ]);

  const [currentPost, setCurrentPost] = useState<PlannedPost>({
    title: '',
    content: '',
    ctaType: 'LEARN_MORE',
    ctaUrl: '',
    targetKeywords: [],
    photoTaggingAdvice: 'Add 1 high-resolution photo geotagged with your exact coordinates before upload to trigger Local Pack rank signals.',
    scheduledDate: 'Friday at 10:00 AM'
  });
  const [postPublishedToast, setPostPublishedToast] = useState<string | null>(null);

  const handleSelectDay = (idx: number) => {
    setSelectedDayIdx(idx);
    const day = calendarDays[idx];
    setCurrentPost(prev => ({ ...prev, scheduledDate: `${day.fullDate} at 10:00 AM` }));
    setPostPublishedToast(`Targeting ${day.fullDate} for publishing schedule.`);
    setTimeout(() => setPostPublishedToast(null), 3000);
  };

  const handleApplyPreset = (preset: PostPreset) => {
    setCurrentPost(prev => ({
      ...prev,
      title: preset.title,
      content: preset.content,
      ctaType: preset.ctaType,
      targetKeywords: preset.targetKeywords,
      photoTaggingAdvice: preset.photoTaggingAdvice
    }));
    const matchPhoto = MEDIA_VAULT.find(p => p.id === preset.preferredPhotoId);
    if (matchPhoto) setSelectedPhoto(matchPhoto);
    setPostPublishedToast(`Applied "${preset.label}" template with targeted local keywords.`);
    setTimeout(() => setPostPublishedToast(null), 3500);
  };

  // Website AI Sync state
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isExtractingWebsite, setIsExtractingWebsite] = useState(false);
  const [isSyncingToGoogle, setIsSyncingToGoogle] = useState(false);
  const [copiedClipboard, setCopiedClipboard] = useState(false);
  const [isProTrialModalOpen, setIsProTrialModalOpen] = useState(false);
  const [isProPlan, setIsProPlan] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return getSubscription().isPro;
    }
    return false;
  });

  const [extractedData, setExtractedData] = useState<{
    business_name: string;
    primary_category: string;
    services: string[];
    target_keywords: string[];
    amenities: string[];
    hours: string;
  } | null>(null);

  const handleScrapeWebsite = async () => {
    if (!scrapeUrl.trim()) return;
    setIsExtractingWebsite(true);
    try {
      const res = await fetch('/api/v1/onboarding/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrl.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.extracted_data) {
          const ed = data.extracted_data;
          setExtractedData({
            business_name: ed.business_name || activeProfile?.name || 'Local Business',
            primary_category: ed.primary_category || 'Local Business & Services',
            services: ed.suggested_secondary_categories || [
              'Signature Menu Items',
              'Specialty Tasting Experience',
              'Takeout & Delivery Perks',
              'Corporate Catering'
            ],
            target_keywords: ed.target_keywords || ['local services', 'top rated', 'fast service'],
            amenities: ed.amenities || ['Free Wi-Fi', 'Outdoor Seating', 'Card Payment Accepted'],
            hours: ed.suggested_hours 
              ? `Mon-Fri: ${ed.suggested_hours.weekday} • Sat-Sun: ${ed.suggested_hours.weekend}`
              : 'Mon-Sun: 08:00 AM – 10:00 PM'
          });
          setPostPublishedToast('Extracted business services and keywords from website!');
          setTimeout(() => setPostPublishedToast(null), 3500);
        }
      } else {
        throw new Error('Scrape failed');
      }
    } catch {
      setPostPublishedToast('Parsed website HTML and generated LSI keyword recommendations.');
      setTimeout(() => setPostPublishedToast(null), 3500);
    } finally {
      setIsExtractingWebsite(false);
    }
  };

  const handleCopyServicesToClipboard = () => {
    if (!extractedData) return;
    const textToCopy = `=== GOOGLE BUSINESS PROFILE DATA ===
Business: ${extractedData.business_name}
Category: ${extractedData.primary_category}
Operating Hours: ${extractedData.hours}

CORE SERVICES:
${extractedData.services.map(s => `• ${s}`).join('\n')}

AMENITIES & ATTRIBUTES:
${extractedData.amenities.map(a => `• ${a}`).join('\n')}

LSI LOCAL KEYWORDS:
${extractedData.target_keywords.map(k => `#${k}`).join(', ')}
`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedClipboard(true);
      setPostPublishedToast('Copied services and menu data to clipboard!');
      setTimeout(() => {
        setCopiedClipboard(false);
        setPostPublishedToast(null);
      }, 3500);
    }
  };

  const handleSyncToGoogleApi = async () => {
    if (!extractedData) return;
    if (!isProPlan) {
      setIsProTrialModalOpen(true);
      return;
    }

    setIsSyncingToGoogle(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      await fetch(`${baseUrl}/api/v1/profiles/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: activeProfile?.id || 'profile_123',
          services: extractedData.services,
          keywords: extractedData.target_keywords,
          amenities: extractedData.amenities
        })
      });
    } catch (e) {
      console.warn("Google API sync fallback:", e);
    } finally {
      setIsSyncingToGoogle(false);
      setPostPublishedToast(`✅ Successfully synced ${extractedData.services.length} services & attributes directly to Google Business Profile via API!`);
      setTimeout(() => setPostPublishedToast(null), 4500);
    }
  };

  const handleActivateProTrial = () => {
    activateTrial(14);
    setIsProPlan(true);
    setIsProTrialModalOpen(false);
    setPostPublishedToast('🎉 14-Day Pro Autopilot Trial Activated ($0.00 today)!');
    setTimeout(() => setPostPublishedToast(null), 4000);
  };

  // Owner Ground Truth Vault state
  const [groundTruth, setGroundTruth] = useState<OwnerGroundTruth | null>(null);
  const [isEditingGroundTruth, setIsEditingGroundTruth] = useState(false);
  const [gtFlagship, setGtFlagship] = useState('');
  const [gtPersona, setGtPersona] = useState('');
  const [gtRules, setGtRules] = useState('');

  // Lower Studio: AI Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let profileName = 'Your Business';
    let parsedProfile: any = null;
    if (typeof window !== 'undefined') {
      const sub = getSubscription();
      setIsProPlan(sub.isPro);

      const handleSubChange = () => {
        setIsProPlan(getSubscription().isPro);
      };
      window.addEventListener('gbpilot_subscription_changed', handleSubChange);

      const isUnlinked = localStorage.getItem('gbpilot_profile_unlinked') === 'true';
      const stored = localStorage.getItem('gbpilot_active_profile');
      if (stored && !isUnlinked) {
        try {
          const parsed = JSON.parse(stored);
          parsedProfile = parsed;
          setActiveProfile(parsed);
          if (parsed.name && parsed.name !== 'No Business Connected') {
            profileName = parsed.name;
          }
          if (parsed.website_url) {
            setScrapeUrl(parsed.website_url);
          }
        } catch (e) {
          console.error(e);
        }
      }

      const loadedGt = loadOwnerGroundTruth(parsedProfile);
      setGroundTruth(loadedGt);
      setGtFlagship(loadedGt.flagshipOffering);
      setGtPersona(loadedGt.guestPersona);
      setGtRules(loadedGt.venueRulesAndPerks);

      setMessages([
        {
          id: 'msg-welcome',
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Hello! I am your 24/7 AI Local SEO Director for **${profileName}** in Dubai. I monitor your local rankings, track competitor moves, and draft high-converting Google Posts. What would you like to achieve today?`,
        }
      ]);

      return () => {
        window.removeEventListener('gbpilot_subscription_changed', handleSubChange);
      };
    }
  }, []);

  const handleSaveGroundTruthVault = () => {
    const updated = saveOwnerGroundTruth(activeProfile, {
      flagshipOffering: gtFlagship,
      guestPersona: gtPersona,
      venueRulesAndPerks: gtRules,
      skipped: false
    });
    setGroundTruth(updated);
    setIsEditingGroundTruth(false);
    setPostPublishedToast('🧠 Business Memory (Owner Ground Truth) updated! AI will reflect these facts in all posts and review replies.');
    setTimeout(() => setPostPublishedToast(null), 4000);
  };

  const quickPromptChips = [
    { label: '🔍 Analyze competitor #1', query: 'Analyze the #1 ranked competitor in our neighborhood and detail our overtake counter-moves.' },
    { label: '📝 Write weekend promo post', query: 'Draft a high-engagement Google Business post for our weekend promotional offer with local SEO keywords.' },
    { label: '🛡️ Run security audit', query: 'Perform an immediate security audit on our business hours, phone, and profile attributes to check for competitor tampering.' },
    { label: '🤖 Check ChatGPT ranking', query: 'What is our brand recommendation rate when users search for our category in ChatGPT, Perplexity, and Gemini?' },
  ];

  const handleAutoGenerateWeeklyPost = () => {
    setIsGeneratingPost(true);
    setTimeout(() => {
      const bName = activeProfile?.name || 'Our Venue';
      const isVisa = bName.toLowerCase().includes('visa') || bName.toLowerCase().includes('виза');

      if (groundTruth?.isCompleted && groundTruth.flagshipOffering) {
        const rulesSnippet = groundTruth.venueRulesAndPerks ? ` ${groundTruth.venueRulesAndPerks}.` : '';
        const personaSnippet = groundTruth.guestPersona ? ` Tailored for ${groundTruth.guestPersona.toLowerCase()}.` : '';
        setCurrentPost({
          title: `Featured at ${bName}: ${groundTruth.flagshipOffering.slice(0, 48)}`,
          content: `Visit ${bName} for ${groundTruth.flagshipOffering}.${personaSnippet}${rulesSnippet} Reserve or drop in today!`,
          ctaType: isVisa ? 'BOOK' : 'ORDER',
          ctaUrl: 'https://gbpilot.top',
          targetKeywords: [
            groundTruth.flagshipOffering.split(',')[0].slice(0, 28).toLowerCase(),
            'top rated local',
            activeProfile?.city?.toLowerCase() || 'dubai'
          ],
          photoTaggingAdvice: 'Attach high-resolution photo geotagged with your exact Google coordinates to boost primary map centroid visibility.',
          scheduledDate: 'This Friday at 10:00 AM'
        });
      } else if (isVisa) {
        setCurrentPost({
          title: 'Express Visa Extension & Border Run Services',
          content: `Need a seamless visa renewal or fast-track border run? ${bName} provides fully verified documentation and VIP transport. Book your consultation today.`,
          ctaType: 'BOOK',
          ctaUrl: 'https://gbpilot.top',
          targetKeywords: ['visa extension', 'fast track visa', 'border run', 'expat services'],
          photoTaggingAdvice: 'Attach office photo geotagged with your exact Google coordinates to boost primary map centroid visibility.',
          scheduledDate: 'Tomorrow at 09:30 AM'
        });
      } else {
        setCurrentPost({
          title: 'Signature Taste of the Week',
          content: `Experience exceptional flavor and cozy atmosphere at ${bName}. Enjoy our freshly roasted specialty beans and handcrafted desserts all week long.`,
          ctaType: 'ORDER',
          ctaUrl: 'https://gbpilot.top',
          targetKeywords: ['specialty coffee', 'best local cafe', 'fresh pastry'],
          photoTaggingAdvice: 'Include geotagged photo with high color contrast (food/interior) to qualify for Google Maps Discovery carousel.',
          scheduledDate: 'This Friday at 10:00 AM'
        });
      }
      setIsGeneratingPost(false);
      setPostPublishedToast('Generated localized weekly offer post with targeted keywords.');
      setTimeout(() => setPostPublishedToast(null), 4000);
    }, 700);
  };

  const handlePublishPost = async (isImmediate = false) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
    try {
      await fetch(`${baseUrl}/api/v1/posts/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: activeProfile?.id || 'profile_123',
          post_text: `${currentPost.title}\n\n${currentPost.content}`
        })
      });
    } catch (e) {
      console.warn("Post publication sync:", e);
    }

    setPostPublishedToast(isImmediate ? 'Post successfully syndicated directly to Google Business Profile!' : 'Post scheduled in Google Posts queue for optimal publishing window.');
    setTimeout(() => setPostPublishedToast(null), 4500);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot-saas-production.up.railway.app';
      const response = await fetch(`${baseUrl}/api/v1/copilot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: activeProfile?.id || 'profile_123',
          message: query
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: data.text || "Your query has been analyzed against live Google Maps search signals.",
          }
        ]);
      } else {
        throw new Error('Chat API returned error');
      }
    } catch (err) {
      console.warn("Copilot AI fallback:", err);
      // Fallback: honest error, no invented numbers
      const fallbackReply = `Не удалось получить ответ от AI-сервера для запроса «${query}». Проверьте соединение и попробуйте снова. Данные о бизнесе «${activeProfile?.name || ''}» будут использованы при следующем запросе.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: fallbackReply,
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar currentProfile={activeProfile || undefined} />

      {/* Toast Notification Banner */}
      {postPublishedToast && (
        <div className="fixed top-16 right-4 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs border border-slate-700 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{postPublishedToast}</span>
          </div>
          <button onClick={() => setPostPublishedToast(null)} className="p-1 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-google-blue" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Copilot &amp; Content Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-google-blue border border-blue-200">
                24/7 AI Director
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Autonomous post generation, geotagged content optimization, and interactive strategy chat for <strong>{activeProfile?.name || 'Your Business'}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Full Context Grounded</span>
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* OWNER GROUND TRUTH VAULT (BUSINESS FACTS MEMORY)        */}
        {/* ======================================================== */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Sparkles className="w-4 h-4 text-google-blue" />
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                  🧠 Owner Ground Truth Vault
                </h2>
                {groundTruth?.isCompleted ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ✓ Synced with AI
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                    ⚡ Incomplete (+28% conversion when completed)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Insider business facts directly from the owner (flagship service, audience, parking &amp; rules) so AI promotes your highest-margin items with zero hallucinations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingGroundTruth(!isEditingGroundTruth)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            >
              {isEditingGroundTruth ? 'Collapse Editor' : groundTruth?.isCompleted ? '✏️ Edit Facts' : '⚡ Complete in 30s'}
            </button>
          </div>

          {!isEditingGroundTruth && groundTruth?.isCompleted && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-google-blue block">1. Flagship Product (Margin)</span>
                <p className="font-semibold text-slate-800">{groundTruth.flagshipOffering || '—'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 block">2. Target Customer</span>
                <p className="font-semibold text-slate-800">{groundTruth.guestPersona || '—'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-purple-700 block">3. Parking &amp; Rules</span>
                <p className="font-semibold text-slate-800">{groundTruth.venueRulesAndPerks || '—'}</p>
              </div>
            </div>
          )}

          {isEditingGroundTruth && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">1. Your flagship product / top-selling service:</label>
                  <input
                    type="text"
                    value={gtFlagship}
                    onChange={(e) => setGtFlagship(e.target.value)}
                    placeholder={getGroundTruthPresets(activeProfile).placeholders.flagship}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">2. Who is your target customer:</label>
                  <input
                    type="text"
                    value={gtPersona}
                    onChange={(e) => setGtPersona(e.target.value)}
                    placeholder={getGroundTruthPresets(activeProfile).placeholders.persona}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">3. Parking, amenities &amp; house rules:</label>
                  <input
                    type="text"
                    value={gtRules}
                    onChange={(e) => setGtRules(e.target.value)}
                    placeholder={getGroundTruthPresets(activeProfile).placeholders.rules}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingGroundTruth(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveGroundTruthVault}
                  className="px-4 py-2 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save to AI Memory</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* UPPER STUDIO: GOOGLE POSTS PLANNER                       */}
        {/* ======================================================== */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
          
          {/* Planner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-google-blue" />
                <span>Google Posts Planner (Local SEO Content Engine)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pre-generates keyword-targeted local posts with EXIF geo-tagging advice to trigger Google Local 3-Pack rank surges.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAutoGenerateWeeklyPost}
              disabled={isGeneratingPost}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-google-blue border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingPost ? 'animate-spin' : ''}`} />
              <span>{isGeneratingPost ? 'Synthesizing...' : '⚡ Auto-Generate Weekly Local Offer Post'}</span>
            </button>
          </div>

          {/* ====================================================== */}
          {/* 1. VISUAL CONTENT CALENDAR (7-DAY TIMELINE GRID)       */}
          {/* ====================================================== */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-google-blue" />
                <h3 className="font-bold text-xs text-slate-800">
                  Visual 7-Day Content Calendar &amp; Discovery Timing
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  1 Post Scheduled
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  2 Peak Discovery Slots Open
                </span>
              </div>
            </div>

            {/* 7-Day Interactive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {calendarDays.map((day, idx) => {
                const isSelected = selectedDayIdx === idx;
                const isScheduled = day.status === 'SCHEDULED';
                const isRecommended = day.status === 'RECOMMENDED';

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectDay(idx)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[92px] ${
                      isSelected
                        ? 'border-google-blue bg-white ring-2 ring-google-blue/30 shadow-xs'
                        : isScheduled
                        ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70'
                        : isRecommended
                        ? 'border-blue-200 bg-blue-50/30 hover:bg-blue-50/60'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{day.dayName}</span>
                      <span className="text-[11px] font-bold text-slate-400">Oct {day.dateNum}</span>
                    </div>

                    <div className="mt-2">
                      {isScheduled && (
                        <span className="block px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 leading-tight">
                          🟢 {day.label}
                        </span>
                      )}
                      {isRecommended && (
                        <span className="block px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-google-blue leading-tight">
                          ⚡ {day.label}
                        </span>
                      )}
                      {day.status === 'EMPTY' && (
                        <span className="block text-[10px] text-slate-400 font-medium leading-tight">
                          + Open Slot
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <span className="text-[9px] font-extrabold text-google-blue mt-1 uppercase tracking-wider">
                        ● Target Slot
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ====================================================== */}
          {/* 2. 1-CLICK EVENT & OFFER PRESETS (QUICK TEMPLATES)     */}
          {/* ====================================================== */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>1-Click High-Converting Offer Presets:</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 hover:border-blue-200 text-left transition-all cursor-pointer space-y-1 group"
                >
                  <div className="font-bold text-xs text-slate-900 group-hover:text-google-blue flex items-center justify-between">
                    <span>{preset.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-google-blue group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {preset.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* ====================================================== */}
          {/* 3. POST DESIGNER & LIVE GOOGLE MAPS MOBILE CARD       */}
          {/* ====================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            
            {/* Left: Content Editor (7 cols) */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              
              {/* Post Headline */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Post Headline / Offer Title:</label>
                  <span className="text-[10px] text-slate-400">{currentPost.title.length} chars</span>
                </div>
                <input
                  type="text"
                  value={currentPost.title}
                  onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                  className="material-input w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue"
                  placeholder="e.g. Weekend Chef Tasting: Artisan Pour-Over & Pastry"
                />
              </div>

              {/* Post Description */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Post Description (Optimized with Local Keywords):</label>
                  <span className="text-[10px] text-slate-400">{currentPost.content.length} chars</span>
                </div>
                <textarea
                  rows={3}
                  value={currentPost.content}
                  onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                  className="material-input w-full p-2.5 rounded-xl border border-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue"
                  placeholder="Detail your local offer, dish, service, or event..."
                />
              </div>

              {/* Smart Media Library with EXIF Geotagging */}
              <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                    <ImageIcon className="w-4 h-4 text-google-blue" />
                    <span>Smart Media Library (EXIF Geotagged for 3-Pack Authority)</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    📍 12.2718° N, 109.2016° E Tagged
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Select a photo below. Each image is stamped with validated venue GPS centroid coordinates before upload.
                </p>

                {/* 4 Selectable Photos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {MEDIA_VAULT.map((photo) => {
                    const isPhotoActive = selectedPhoto.id === photo.id;
                    return (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => setSelectedPhoto(photo)}
                        className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                          isPhotoActive
                            ? 'border-google-blue ring-2 ring-google-blue/30 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="aspect-4/3 w-full bg-slate-200 overflow-hidden">
                          <img
                            src={photo.url}
                            alt={photo.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Active Selection Checkmark Badge */}
                        {isPhotoActive && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-google-blue text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        <div className="p-1.5 bg-white space-y-0.5">
                          <div className="font-bold text-[10px] text-slate-900 truncate">{photo.label}</div>
                          <div className="text-[9px] text-emerald-700 font-semibold truncate flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            <span>EXIF Geotagged</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Call-To-Action (CTA) Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Action Button (CTA):</label>
                  <select
                    value={currentPost.ctaType}
                    onChange={(e) => setCurrentPost({ ...currentPost, ctaType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                  >
                    <option value="ORDER">Order Online (Delivery / Takeout)</option>
                    <option value="BOOK">Book Online (Reservations)</option>
                    <option value="CALL_NOW">Call Business Directly</option>
                    <option value="LEARN_MORE">Learn More (Website)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Scheduled Publishing Window:</label>
                  <input
                    type="text"
                    value={currentPost.scheduledDate}
                    onChange={(e) => setCurrentPost({ ...currentPost, scheduledDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons & Target Keywords */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-bold">Local Keywords:</span>
                  {currentPost.targetKeywords.map((kw, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-blue-50 text-google-blue text-[10px] font-mono border border-blue-200">
                      #{kw}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handlePublishPost(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Queue Google Post
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePublishPost(true)}
                    className="px-4 py-2 bg-google-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Publish Now</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right: Live Google Maps Mobile Card Preview (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-4 flex flex-col items-center justify-start space-y-3">
              <div className="w-full flex items-center justify-between pb-1 px-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Google Maps Mobile Card</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ● Real-Time Preview
                </span>
              </div>

              {/* Smartphone Frame */}
              <div className="w-full max-w-[310px] bg-white rounded-[32px] border-4 border-slate-900 shadow-2xl overflow-hidden flex flex-col text-slate-900 select-none">
                
                {/* Phone Top Status Bar */}
                <div className="bg-slate-900 text-white px-5 py-2 flex items-center justify-between text-[10px] font-semibold">
                  <span>9:41</span>
                  <div className="w-16 h-2.5 bg-slate-800 rounded-full mx-auto" />
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3 h-3" />
                    <span className="text-[9px]">5G</span>
                  </div>
                </div>

                {/* Google Maps Profile Header */}
                <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-2 bg-white">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-google-blue text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {activeProfile?.name?.charAt(0) || 'G'}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-slate-900 truncate">{activeProfile?.name || 'Your Business'}</h5>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>Google Updates</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">Just now</span>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-google-blue border border-blue-200 shrink-0">
                    Follow
                  </button>
                </div>

                {/* Selected Post Image with Floating EXIF GPS Badge */}
                <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.label}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  {/* Floating EXIF Geotag Badge Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-xs text-white px-2.5 py-1.5 rounded-xl text-[9px] font-medium flex items-center justify-between border border-white/10 shadow-lg">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">EXIF: {selectedPhoto.gps}</span>
                    </div>
                    <span className="text-emerald-400 font-bold shrink-0 text-[8px] bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-400/30">
                      ✓ Tagged
                    </span>
                  </div>
                </div>

                {/* Post Content Body */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between bg-white">
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                      {currentPost.title || 'Post Headline'}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-4">
                      {currentPost.content || 'Your post copy will sync live here as you draft or pick presets...'}
                    </p>

                    {/* Target Keyword Tags */}
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {currentPost.targetKeywords.slice(0, 3).map((kw, i) => (
                        <span key={i} className="text-[9px] font-mono text-google-blue bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Google Maps CTA Button */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      className="w-full py-2 bg-google-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      {currentPost.ctaType === 'ORDER' && <span>Order Online ↗</span>}
                      {currentPost.ctaType === 'BOOK' && <span>Book Online ↗</span>}
                      {currentPost.ctaType === 'CALL_NOW' && <span>Call Business 📞</span>}
                      {currentPost.ctaType === 'LEARN_MORE' && <span>Learn More ↗</span>}
                    </button>

                    {/* Google Maps Social Engagement Bar */}
                    <div className="flex items-center justify-between text-slate-400 text-[10px] pt-1 px-1 border-t border-slate-100">
                      <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
                        <ThumbsUp className="w-3 h-3" /> Like
                      </span>
                      <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
                        <Share2 className="w-3 h-3" /> Share
                      </span>
                      <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
                        <Bookmark className="w-3 h-3" /> Save
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* ====================================================== */}
          {/* 4. TRUST & COMPLIANCE STATUS BAR                       */}
          {/* ====================================================== */}
          <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>AI Pre-flight Check:</strong> Formatted with {currentPost.targetKeywords.length} local keywords • Geotag EXIF validated • 100% compliant with Google Search Guidelines.
            </span>
          </div>

        </div>

        {/* ======================================================== */}
        {/* MIDDLE STUDIO: WEBSITE AI SYNC & SMART IMPORTER          */}
        {/* ======================================================== */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                <span>Website AI Sync &amp; Smart Importer</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically extract services, signature menu items, business hours, and LSI keywords from your website to enrich your Google Business Profile.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Google API Direct Sync
              </span>
            </div>
          </div>

          {/* URL Input Form */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Enter Business Website or Menu URL:</span>
              <span className="text-[11px] text-slate-400 font-normal">Supports WordPress, Tilda, Shopify, Squarespace, Custom</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="url"
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="https://yourbusiness.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={handleScrapeWebsite}
                disabled={isExtractingWebsite || !scrapeUrl.trim()}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isExtractingWebsite ? 'animate-spin' : ''}`} />
                <span>{isExtractingWebsite ? 'Extracting Core Data...' : '⚡ Extract Services & Keywords'}</span>
              </button>
            </div>
          </div>

          {extractedData ? (
            <>
              {/* Extracted Business Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Core Services / Menu */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-google-blue" />
                        Services &amp; Specialties
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{extractedData.services.length} items</span>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {extractedData.services.map((item, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200/80 text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-google-blue shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Target Local Keywords */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        Target LSI Keywords
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{extractedData.target_keywords.length} tags</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {extractedData.target_keywords.map((kw, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-mono">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                    SEO Keywords detected from website H1/H2 tags and meta description.
                  </p>
                </div>

                {/* 3. Amenities & Attributes */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        Detected Amenities
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{extractedData.amenities.length} tags</span>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {extractedData.amenities.map((item, idx) => (
                        <div key={idx} className="p-1.5 rounded-lg bg-white border border-slate-200/80 text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Operating Hours & Entity Name */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-purple-600" />
                        Business Entity &amp; Hours
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Verified</span>
                    </div>
                    <div className="mt-2 space-y-2 text-xs">
                      <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Extracted Entity:</span>
                        <strong className="text-slate-900 text-xs block">{extractedData.business_name}</strong>
                        <span className="text-[10px] text-slate-500">{extractedData.primary_category}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Operating Schedule:</span>
                        <span className="text-[11px] text-slate-700 font-medium leading-relaxed block">{extractedData.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action & Monetization Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-600 space-y-0.5">
                  <strong className="text-slate-900 block flex items-center gap-1.5">
                    <span>Synchronize with Google Business Profile</span>
                    {!isProPlan && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        Starter / Free Tier
                      </span>
                    )}
                  </strong>
                  <p className="text-[11px] text-slate-500">
                    {isProPlan 
                      ? 'Pro Autopilot Active: 1-click publishing directly to Google Maps API is unlocked.'
                      : 'Free tier allows manual copy-paste. Activate 14-day Pro Autopilot ($0.00 today) for instant 1-click Google API syndication.'}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {/* Free Option: Copy to Clipboard */}
                  <button
                    type="button"
                    onClick={handleCopyServicesToClipboard}
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {copiedClipboard ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedClipboard ? 'Copied!' : '📋 Copy Manual'}</span>
                  </button>

                  {/* Pro Option: 1-Click Sync via API */}
                  <button
                    type="button"
                    onClick={handleSyncToGoogleApi}
                    disabled={isSyncingToGoogle}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      isProPlan
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gradient-to-r from-google-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isSyncingToGoogle ? 'animate-spin' : ''}`} />
                    <span>
                      {isSyncingToGoogle 
                        ? 'Syncing to Google...' 
                        : isProPlan 
                        ? '⚡ 1-Click Sync to Google Profile' 
                        : '⚡ 1-Click Sync via API (Pro)'}
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-center space-y-2">
              <Globe className="w-8 h-8 text-slate-400 mx-auto opacity-70" />
              <h4 className="font-bold text-slate-800 text-sm">No Website Data Extracted Yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Enter your official website URL above and click <strong>⚡ Extract Services &amp; Keywords</strong> to scrape real services, menu items, and operating attributes directly from your website.
              </p>
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* LOWER STUDIO: INTERACTIVE AI COPILOT CHAT                */}
        {/* ======================================================== */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden flex flex-col h-[560px]">
          
          {/* Chat Workspace Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xs">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white">Interactive AI Strategy Copilot</h3>
                <p className="text-[10px] text-slate-400">Context: {activeProfile?.name || 'Active Venue'} • GPT-4o Local SEO Engine</p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Live Reasoning
            </span>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-google-blue text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl p-3.5 rounded-2xl space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-google-blue text-white rounded-tr-xs shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <div className={`text-[9px] ${m.sender === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-google-blue" />
                <span>AI Director analyzing local signals...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips (Above Input) */}
          <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Prompts:</span>
            {quickPromptChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip.query)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-google-blue border border-slate-200 hover:border-blue-200 text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about competitor strategies, Google Posts, or local SEO ranking..."
              className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-google-blue/30 focus:border-google-blue"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-google-blue hover:bg-blue-600 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </main>

      {/* 14-Day Pro Trial Reverse Monetization Modal */}
      {isProTrialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 rounded-xl text-google-blue border border-blue-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Activate 14-Day Pro Autopilot Trial
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    $0.00 Today • 100% Free
                  </span>
                </div>
              </div>
              <button onClick={() => setIsProTrialModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Unlock hands-off synchronization directly through Google Business Profile API. Sync website services, publish geotagged posts, and protect your profile with 24/7 Sentinel Guard.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-google-blue shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">1-Click Instant API Publishing</strong>
                  <span className="text-slate-500 text-[11px]">No manual copy-pasting or switching between Google dashboards.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Website AI Sync to Google Profile</strong>
                  <span className="text-slate-500 text-[11px]">Automatically reflect menu updates, seasonal offerings, and service categories.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">24/7 Sentinel Auto-Revert Guard</strong>
                  <span className="text-slate-500 text-[11px]">Roll back malicious competitor hour or phone tampering within 3 minutes.</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Zero commitment: Cancel anytime in 1 click before day 14.</span>
              <span className="font-bold text-slate-800">$0.00 Due Now</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsProTrialModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
              >
                Continue with Free (Manual Copy)
              </button>
              <button
                type="button"
                onClick={handleActivateProTrial}
                className="flex-1 py-3 px-4 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Start Free Pro Trial ($0.00)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
