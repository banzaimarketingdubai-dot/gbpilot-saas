import { OwnerGroundTruth } from '@/lib/groundTruth';
import { detectCurrencyByLocation } from '@/lib/inspection/auditEngine';

export type DirectoryPlatformId = 'APPLE_MAPS' | 'TWOGIS' | 'TRIPADVISOR' | 'TIMEOUT_PR';

export interface DirectoryFieldBlock {
  id: string;
  blockNumber: number;
  fieldTitle: string;
  exactCabinetPath: string;
  maxChars?: number;
  validationRule: string;
  value: string;
  isFreePreview: boolean;
  fieldType: 'TEXT' | 'CATALOG' | 'ATTRIBUTES' | 'MEDIA_SPEC' | 'COORDINATES';
}

export interface DirectoryPlatformBlueprint {
  id: DirectoryPlatformId;
  name: string;
  badge: string;
  portalUrl: string;
  portalDomain: string;
  aiCitationImpact: string;
  financialWhyText: string;
  estimatedMonthlyValue: string;
  completionTime: string;
  blocks: DirectoryFieldBlock[];
}

function clampText(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  const sliced = clean.slice(0, maxLen - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  if (lastSpace > maxLen * 0.65) {
    return sliced.slice(0, lastSpace).replace(/[.,;:-]+$/, '') + '.';
  }
  return sliced.trim() + '.';
}

export function buildDirectoryBlueprints(
  profile: {
    name?: string;
    address?: string;
    city?: string;
    category?: string;
    phone?: string;
    website_url?: string;
    lat?: number;
    lng?: number;
  } | null,
  groundTruth?: OwnerGroundTruth | null
): DirectoryPlatformBlueprint[] {
  const bName = profile?.name && profile.name !== 'No Business Connected' ? profile.name.trim() : 'Your Business';
  const bCategory = profile?.category && !['local business', 'establishment'].includes(profile.category.toLowerCase())
    ? profile.category
    : 'Specialty Venue & Services';
  const bAddress = profile?.address || profile?.city || 'Central Business District';
  const bCity = profile?.city || (bAddress.toLowerCase().includes('dubai') ? 'Dubai' : 'City Center');
  const bPhone = profile?.phone && profile.phone !== '—' ? profile.phone : '+971 50 000 0000';
  const bWebsite = profile?.website_url || 'https://gbpilot.top';
  const lat = profile?.lat ? profile.lat.toFixed(5) : '25.08050';
  const lng = profile?.lng ? profile.lng.toFixed(5) : '55.14030';

  const currency = detectCurrencyByLocation(bAddress, undefined, profile?.city);
  const sym = currency.symbol;
  const isAed = currency.code === 'AED';

  const flagship = groundTruth?.flagshipOffering?.trim() || `Signature ${bCategory} & Top-Rated Client Service`;
  const persona = groundTruth?.guestPersona?.trim() || 'Local residents, expats, and international visitors';
  const rules = groundTruth?.venueRulesAndPerks?.trim() || 'Convenient parking, fast service, and comfortable atmosphere';

  //Price helper
  const p1 = isAed ? `${sym} 45` : `${sym}14`;
  const p2 = isAed ? `${sym} 65` : `${sym}22`;
  const p3 = isAed ? `${sym} 120` : `${sym}39`;
  const p4 = isAed ? `${sym} 190` : `${sym}59`;

  const estAppleVal = isAed ? 'AED 4,800 / mo' : '$1,300 / mo';
  const est2GisVal = isAed ? 'AED 3,900 / mo' : '$1,050 / mo';
  const estTripVal = isAed ? 'AED 5,400 / mo' : '$1,480 / mo';
  const estPrVal = isAed ? 'AED 7,200 / mo' : '$1,950 / mo';

  // 1. APPLE BUSINESS CONNECT (businessconnect.apple.com)
  const appleAboutRaw = `${bName} is an established ${bCategory.toLowerCase()} located at ${bAddress}. Specializing in ${flagship.toLowerCase()}, the venue serves ${persona.toLowerCase()}. Guests appreciate ${rules.toLowerCase()} with convenient access and verified operating hours.`;
  const appleShowcaseHeaderRaw = clampText(`Special: ${flagship}`, 38);
  const appleShowcaseBodyRaw = clampText(`Visit ${bName} for ${flagship.toLowerCase()}. ${rules}. Book or drop in today.`, 100);

  const appleBlueprint: DirectoryPlatformBlueprint = {
    id: 'APPLE_MAPS',
    name: 'Apple Business Connect (Apple Maps & CarPlay)',
    badge: '🍎 70%+ iPhone & Siri',
    portalUrl: 'https://businessconnect.apple.com',
    portalDomain: 'businessconnect.apple.com',
    aiCitationImpact: '+28% Trust Index across Siri, Apple Intelligence & ChatGPT Search (iOS)',
    financialWhyText: 'Over 70% of high-income iPhone drivers navigate using Apple CarPlay and Siri. If your Apple Business Connect profile is incomplete, drivers get routed to your nearest competitors.',
    estimatedMonthlyValue: estAppleVal,
    completionTime: '3 min (Copy-paste 7 blocks)',
    blocks: [
      {
        id: 'apple-1-name',
        blockNumber: 1,
        fieldTitle: 'Block 1. Display Name',
        exactCabinetPath: 'Place Card → Header → Display Name',
        maxChars: 100,
        validationRule: 'Apple Moderation Rule: Official business name only without keyword stuffing, emojis, or ALL-CAPS (or moderation rejects it).',
        value: clampText(bName, 100),
        isFreePreview: true,
        fieldType: 'TEXT'
      },
      {
        id: 'apple-2-categories',
        blockNumber: 2,
        fieldTitle: 'Block 2. Primary & Additional Categories',
        exactCabinetPath: 'Place Card → Details → Categories',
        validationRule: 'Select 1 primary category and exactly 2 additional categories from the Apple Maps taxonomy.',
        value: `Primary Category: ${bCategory}\nAdditional Category 1: Local Services & Hospitality\nAdditional Category 2: Customer Care & Consultation`,
        isFreePreview: true,
        fieldType: 'ATTRIBUTES'
      },
      {
        id: 'apple-3-about',
        blockNumber: 3,
        fieldTitle: 'Block 3. About This Place (Profile Bio)',
        exactCabinetPath: 'Place Card → About → Place Description',
        maxChars: 500,
        validationRule: 'Strict Apple limit: up to 500 characters. Written in 3rd person. Links, phone numbers, and promotional superlatives like "Discount / Best #1" are prohibited.',
        value: clampText(appleAboutRaw, 500),
        isFreePreview: false,
        fieldType: 'TEXT'
      },
      {
        id: 'apple-4-showcase',
        blockNumber: 4,
        fieldTitle: 'Block 4. Apple Showcase (30-Day Featured Special)',
        exactCabinetPath: 'Place Card → Showcases → Add New Showcase',
        maxChars: 138,
        validationRule: 'Exact Apple Showcase formatting: Header — strictly up to 38 characters! Body — strictly up to 100 characters! Action CTA — select from list.',
        value: `[Field 1: Showcase Header — ${appleShowcaseHeaderRaw.length}/38 chars]\n${appleShowcaseHeaderRaw}\n\n[Field 2: Showcase Body — ${appleShowcaseBodyRaw.length}/100 chars]\n${appleShowcaseBodyRaw}\n\n[Field 3: Action Button CTA]\nButton Type: Book / Order Now\nTarget Link: ${bWebsite}`,
        isFreePreview: false,
        fieldType: 'TEXT'
      },
      {
        id: 'apple-5-coords',
        blockNumber: 5,
        fieldTitle: 'Block 5. Location & CarPlay Arrival Point',
        exactCabinetPath: 'Place Card → Location → Map Pin & Entrance Coordinates',
        validationRule: 'Apple CarPlay navigates vehicles to the Arrival Point instead of the building center. Copy the exact entrance coordinates.',
        value: `Full Street Address: ${bAddress}\nPin Latitude: ${lat}\nPin Longitude: ${lng}\nArrival & Parking Note: ${rules}`,
        isFreePreview: false,
        fieldType: 'COORDINATES'
      },
      {
        id: 'apple-6-attributes',
        blockNumber: 6,
        fieldTitle: 'Block 6. Good to Know (Apple Maps Attribute Checkboxes)',
        exactCabinetPath: 'Place Card → Details → Good to Know',
        validationRule: 'Check these boxes in Apple Business Connect — they trigger placement in CarPlay instant filters.',
        value: `☑ Accepts Apple Pay & Contactless Cards\n☑ ${rules}\n☑ Appointment / Walk-ins Welcome\n☑ Free Customer Wi-Fi\n☑ Air-Conditioned Indoor Space\n☑ Wheelchair Accessible Entrance`,
        isFreePreview: false,
        fieldType: 'ATTRIBUTES'
      },
      {
        id: 'apple-7-media',
        blockNumber: 7,
        fieldTitle: 'Block 7. Cover Photo & Square Logo (Apple Media Specs)',
        exactCabinetPath: 'Place Card → Photos & Logo → Upload Media',
        validationRule: 'Apple rejects photos with promotional text or watermarks. Upload high-res photos adhering to the specified aspect ratios.',
        value: `1. Cover Photo: Resolution 1600 × 1040 px (16:10 aspect ratio), JPEG/PNG, clean without overlays.\n2. Company Logo: 1024 × 1024 px (1:1), solid/non-transparent background.\n3. Photo Caption #1: ${bName} — ${flagship} (${bCity}).`,
        isFreePreview: false,
        fieldType: 'MEDIA_SPEC'
      }
    ]
  };

  // 2. 2GIS BUSINESS (account.2gis.com)
  const twoGisShortRaw = clampText(`${bName} (${bCategory}): ${flagship}. ${rules}.`, 150);
  const twoGisFullRaw = `${bName} is a premier ${bCategory.toLowerCase()} located at ${bAddress}.\n\nCore Highlights & Specialties:\n• ${flagship}\n• Dedicated guest experience: ${persona}\n• Venue advantages: ${rules}\n\nOpen daily with verified operating hours. Quick bookings and inquiries available via WhatsApp or by calling ${bPhone}. Direct entrance navigation available on 2GIS!`;

  const twoGisBlueprint: DirectoryPlatformBlueprint = {
    id: 'TWOGIS',
    name: '2GIS Business (Mall, Tower & Floor-Level Navigation)',
    badge: '🗺️ Exact Entrance & Price List',
    portalUrl: 'https://account.2gis.com',
    portalDomain: 'account.2gis.com',
    aiCitationImpact: '+24% local ranking for buildings/clusters & price list indexation',
    financialWhyText: 'Essential directory for precise entrance navigation across business centers, high-rises, and malls. Enables a direct price list and 1-click WhatsApp chat button right in search results.',
    estimatedMonthlyValue: est2GisVal,
    completionTime: '4 min (Copy-paste 6 blocks)',
    blocks: [
      {
        id: '2gis-1-short',
        blockNumber: 1,
        fieldTitle: 'Block 1. Listing Name & Short Tagline',
        exactCabinetPath: '2GIS Dashboard → Profile → Info → Short Description',
        maxChars: 150,
        validationRule: '2GIS limit: strictly up to 150 characters. This snippet is visible to customers in search results before clicking.',
        value: twoGisShortRaw,
        isFreePreview: true,
        fieldType: 'TEXT'
      },
      {
        id: '2gis-2-rubrics',
        blockNumber: 2,
        fieldTitle: 'Block 2. 2GIS Categories & Quick WhatsApp Chat',
        exactCabinetPath: '2GIS Dashboard → Profile → Business Categories & Contacts',
        validationRule: 'Add up to 3 relevant categories and attach your WhatsApp direct chat link.',
        value: `Primary Category: ${bCategory}\nAdditional Categories: Local Services & Hospitality / Customer Consultation\nPhone: ${bPhone}\nWebsite: ${bWebsite}\nWhatsApp Button Link: https://wa.me/${bPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello! Contacting you from your 2GIS listing (${bName}).`)}`,
        isFreePreview: true,
        fieldType: 'ATTRIBUTES'
      },
      {
        id: '2gis-3-fullbio',
        blockNumber: 3,
        fieldTitle: 'Block 3. Extended Business Bio (Info Tab)',
        exactCabinetPath: '2GIS Dashboard → Profile → Info → Full Description',
        maxChars: 2000,
        validationRule: '2GIS limit: up to 2000 characters. Includes LSI keywords for internal 2GIS search indexing.',
        value: clampText(twoGisFullRaw, 2000),
        isFreePreview: false,
        fieldType: 'TEXT'
      },
      {
        id: '2gis-4-entrance',
        blockNumber: 4,
        fieldTitle: 'Block 4. Floor, Landmark & Entrance / Parking Note',
        exactCabinetPath: '2GIS Dashboard → Address & Geometry → Entrance Pin & Address Note',
        validationRule: 'Unique 2GIS feature: specify entrance landmark and parking conditions so clients and taxis arrive seamlessly.',
        value: `Exact Address: ${bAddress}\nEntrance Coordinates (Lat/Lng): ${lat}, ${lng}\nArrival Guidance: Main entrance facing the street, follow signage for ${bName}.\nParking & Rules: ${rules}`,
        isFreePreview: false,
        fieldType: 'COORDINATES'
      },
      {
        id: '2gis-5-pricelist',
        blockNumber: 5,
        fieldTitle: 'Block 5. Products & Services (Ready Table for Price List Tab)',
        exactCabinetPath: '2GIS Dashboard → Products & Services → Add Items',
        validationRule: '2GIS price format: "Category — Item Title — Price — Description up to 100 chars". Listings with prices receive 40% more clicks.',
        value: `1. [Flagship] ${flagship} — From ${p3} | Signature offering of ${bName}, advance reservation recommended.\n2. [Standard] Core Service / Selection (${bCategory}) — ${p1} | Fast service with no wait times.\n3. [Premium] Extended Package — ${p4} | Includes personalized consultation and priority handling.\n4. [Special] First Visit / Introduction — ${p2} | Available for clients discovering us on maps.`,
        isFreePreview: false,
        fieldType: 'CATALOG'
      },
      {
        id: '2gis-6-features',
        blockNumber: 6,
        fieldTitle: 'Block 6. Business Attributes & Payment Methods',
        exactCabinetPath: '2GIS Dashboard → Profile → Amenities & Payment',
        validationRule: 'Check these attribute boxes in the 2GIS dashboard.',
        value: `☑ Credit/Debit Cards / Cash / Apple Pay / QR\n☑ ${rules}\n☑ Consultations & Bookings via WhatsApp\n☑ English & Multilingual Customer Support\n☑ Free Customer Wi-Fi`,
        isFreePreview: false,
        fieldType: 'ATTRIBUTES'
      }
    ]
  };

  // 3. TRIPADVISOR MANAGEMENT CENTER (tripadvisor.com/Owners)
  const tripDescRaw = `Welcome to ${bName}, a top-rated ${bCategory.toLowerCase()} in ${bCity} (${bAddress}). Known for ${flagship.toLowerCase()}, we provide an authentic, high-standard experience tailored for ${persona.toLowerCase()}. Visitors and locals choose ${bName} for our attention to detail and ${rules.toLowerCase()}. Conveniently located with easy taxi and pedestrian access, our team speaks English and is ready to welcome you daily.`;

  const tripBlueprint: DirectoryPlatformBlueprint = {
    id: 'TRIPADVISOR',
    name: 'TripAdvisor Owners (Primary Source for ChatGPT & Perplexity)',
    badge: '🦉 #1 for ChatGPT & Travelers',
    portalUrl: 'https://www.tripadvisor.com/Owners',
    portalDomain: 'tripadvisor.com/Owners',
    aiCitationImpact: '+42% probability of inclusion in ChatGPT & Perplexity Top 3',
    financialWhyText: 'ChatGPT and Perplexity directly query TripAdvisor when answering queries like "Best places / services in city". A 100% completed profile secures direct AI recommendation snippets.',
    estimatedMonthlyValue: estTripVal,
    completionTime: '3 min (Copy-paste 5 blocks)',
    blocks: [
      {
        id: 'trip-1-title',
        blockNumber: 1,
        fieldTitle: 'Block 1. Official Property Name & Location Cluster',
        exactCabinetPath: 'Management Center → Business Info → General Information',
        maxChars: 120,
        validationRule: 'Name must match Google Business Profile exactly (NAP Consistency) for AI models to merge ratings across platforms.',
        value: `Property Name: ${bName}\nAddress: ${bAddress}\nCity / District: ${bCity}\nPhone: ${bPhone}\nWebsite: ${bWebsite}`,
        isFreePreview: true,
        fieldType: 'TEXT'
      },
      {
        id: 'trip-2-description',
        blockNumber: 2,
        fieldTitle: 'Block 2. Property Description (English Bio for AI & Travelers)',
        exactCabinetPath: 'Management Center → Business Info → Description',
        maxChars: 1000,
        validationRule: 'TripAdvisor limit: up to 1000 characters. English description is strongly recommended as LLMs index it as the authoritative global snippet.',
        value: clampText(tripDescRaw, 1000),
        isFreePreview: true,
        fieldType: 'TEXT'
      },
      {
        id: 'trip-3-features',
        blockNumber: 3,
        fieldTitle: 'Block 3. Features, Specialties & Price Range',
        exactCabinetPath: 'Management Center → Business Info → Cuisines / Services & Features',
        validationRule: 'Tag these features in TripAdvisor to qualify for "Travelers Choice / Best Nearby" curated recommendations.',
        value: `Price Range: $$ - $$$ (Mid-range / Premium Quality)\nSignature Highlight: ${flagship}\nBest For: ${persona}\nKey Amenities: ${rules}, English Spoken, Digital Payments Accepted`,
        isFreePreview: false,
        fieldType: 'ATTRIBUTES'
      },
      {
        id: 'trip-4-highlights',
        blockNumber: 4,
        fieldTitle: 'Block 4. Menu / Service Highlights (Top 3 Offerings)',
        exactCabinetPath: 'Management Center → Menu & Offerings → Featured Items',
        validationRule: 'Paste these 3 signature items — AI search engines quote them verbatim when users ask "What should I order / which service to choose".',
        value: `• Featured #1: ${flagship} (From ${p3})\n• Featured #2: Express / Daily Package for ${persona} (${p2})\n• Featured #3: Guest Advantage — ${rules}`,
        isFreePreview: false,
        fieldType: 'CATALOG'
      },
      {
        id: 'trip-5-photocaption',
        blockNumber: 5,
        fieldTitle: 'Block 5. Primary Photo Captions (SEO Alt-Tags)',
        exactCabinetPath: 'Management Center → Photos → Manage Photos → Edit Caption',
        validationRule: 'Most owners leave captions blank. Captions are indexed by Google Images and multimodal Gemini search.',
        value: `Photo 1 (Primary Cover): ${bName} in ${bCity} — ${flagship}\nPhoto 2 (Interior / Process): Welcoming atmosphere for ${persona} at ${bName}\nPhoto 3 (Exterior / Entrance): Easy entrance and ${rules} at ${bAddress}`,
        isFreePreview: false,
        fieldType: 'MEDIA_SPEC'
      }
    ]
  };

  // 4. TIMEOUT / WHAT'S ON / LOCAL AI CURATED LISTS PR-KIT
  const prBlurbRaw = `Tucked away in ${bAddress}, ${bName} has quickly become a go-to spot in ${bCity} for anyone seeking ${flagship.toLowerCase()}. Tailored for ${persona.toLowerCase()}, the venue stands out by combining consistent quality with practical perks like ${rules.toLowerCase()}.`;

  const timeoutBlueprint: DirectoryPlatformBlueprint = {
    id: 'TIMEOUT_PR',
    name: 'TimeOut / What’s On / Local "Top 10" Lists (Editorial PR-Kit)',
    badge: '📰 Feature in "Best in the City" Articles',
    portalUrl: 'https://www.timeoutdubai.com/contact-us',
    portalDomain: 'Editorial Desk / Local Media',
    aiCitationImpact: '+48% citation rate in Google AI Overviews (Gemini) for "Best near me" queries',
    financialWhyText: 'A single press mention in a curated "Top 10" guide cements your listing inside Google Gemini and ChatGPT answers permanently. We prepared a ready-to-publish pitch in editorial style.',
    estimatedMonthlyValue: estPrVal,
    completionTime: '2 min (Copy & Email)',
    blocks: [
      {
        id: 'pr-1-subject',
        blockNumber: 1,
        fieldTitle: 'Block 1. Pitch Email Subject Line',
        exactCabinetPath: 'Editorial Desk (TimeOut / What’s On / Local Curated Guides)',
        maxChars: 90,
        validationRule: 'Concise journalistic subject line without spam words — open rates with "New & Trending" editors exceed 65%.',
        value: clampText(`Editorial Spotlights (${bCity}): ${bName} — ${flagship}`, 90),
        isFreePreview: true,
        fieldType: 'TEXT'
      },
      {
        id: 'pr-2-blurb',
        blockNumber: 2,
        fieldTitle: 'Block 2. 50-Word Editorial Blurb',
        exactCabinetPath: 'Email Body → Publication-ready paragraph for journalists without rewrites',
        maxChars: 420,
        validationRule: 'Editors feature businesses readily when provided with a concise, publication-grade 50-word blurb.',
        value: clampText(prBlurbRaw, 420),
        isFreePreview: false,
        fieldType: 'TEXT'
      },
      {
        id: 'pr-3-factbox',
        blockNumber: 3,
        fieldTitle: 'Block 3. Publication Fact Sheet',
        exactCabinetPath: 'Email Footer → Business Fact Sheet',
        validationRule: 'Standard editorial fact box placed at the conclusion of magazine reviews.',
        value: `• Venue Name: ${bName}\n• Category: ${bCategory}\n• Must-Try / Flagship: ${flagship}\n• Average Spend: From ${p2} – ${p3}\n• Insider Perks: ${rules}\n• Exact Location: ${bAddress} (GPS: ${lat}, ${lng})\n• Contact & Booking: ${bPhone} | ${bWebsite}`,
        isFreePreview: false,
        fieldType: 'CATALOG'
      }
    ]
  };

  return [appleBlueprint, twoGisBlueprint, tripBlueprint, timeoutBlueprint];
}
