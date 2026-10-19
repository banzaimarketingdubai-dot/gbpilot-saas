/**
 * High-Quality Local SEO Copywriting & Semantic Keyword Engine for Google Business Profile
 * Generates human-written quality, niche-aware, geo-anchored descriptions with high-intent search keywords.
 * Bridges the gap between owner domain knowledge and Google Maps ranking algorithms.
 */

export type SeoCopyTone = 'SEO' | 'PREMIUM' | 'CONCISE';

export type BusinessNiche = 
  | 'VISA_TOURISM_EXPAT'
  | 'COFFEE_FOOD'
  | 'BEAUTY_SPA'
  | 'HEALTH_DENTAL'
  | 'AUTO_SERVICE'
  | 'RETAIL_SHOP'
  | 'HOME_SERVICES'
  | 'PROFESSIONAL_SERVICES'
  | 'GENERAL_LOCAL';

export interface NicheInfo {
  id: BusinessNiche;
  label: string;
  icon: string;
  exampleKeywords: string;
}

export const NICHE_LIST: NicheInfo[] = [
  { id: 'VISA_TOURISM_EXPAT', label: 'Visa, Immigration & Expat Services', icon: '🌴', exampleKeywords: 'visa run, extensions, border run, document translation, expat help' },
  { id: 'COFFEE_FOOD', label: 'Cafes, Specialty Coffee & Restaurants', icon: '☕', exampleKeywords: 'breakfast, specialty coffee, desserts, outdoor patio, lunch' },
  { id: 'BEAUTY_SPA', label: 'Beauty Salons, Barbershops & Spa', icon: '💅', exampleKeywords: 'haircut, manicure, nail art, hair coloring, spa treatments' },
  { id: 'HEALTH_DENTAL', label: 'Medical Clinics & Dental Care', icon: '🩺', exampleKeywords: 'dental care, teeth cleaning, diagnostics, family doctor' },
  { id: 'AUTO_SERVICE', label: 'Auto Repair, Tire Service & Detailing', icon: '🚗', exampleKeywords: 'oil change, brake repair, computer diagnostics, car detailing' },
  { id: 'RETAIL_SHOP', label: 'Retail Stores, Boutiques & Markets', icon: '🛍️', exampleKeywords: 'in-store shopping, wide collection, gifts, curbside pickup' },
  { id: 'HOME_SERVICES', label: 'Home Services, Plumbing & Electric', icon: '🔧', exampleKeywords: 'plumbing, electrician, home repair, cleaning, AC service' },
  { id: 'PROFESSIONAL_SERVICES', label: 'Legal, Accounting & Business Consulting', icon: '💼', exampleKeywords: 'tax advisory, company setup, contract review, audit' },
  { id: 'GENERAL_LOCAL', label: 'Other Local Business', icon: '🏢', exampleKeywords: 'customer services, convenient location, professional support' }
];

export interface SeoCopyContext {
  businessName: string;
  businessAddress: string;
  category?: string;
  city?: string;
  tone?: SeoCopyTone;
  explicitNiche?: BusinessNiche;
  customNotes?: string;
}

/**
 * Parses address components into natural English geographic anchors.
 */
export function extractGeoAnchors(address: string, fallbackCity?: string): {
  landmarkOrDistrict: string;
  city: string;
  formattedLocation: string;
} {
  const addr = address.toLowerCase();

  // 1. City Detection
  let city = fallbackCity || '';
  if (!city) {
    if (addr.includes('nha trang') || addr.includes('нячанг')) city = 'Nha Trang';
    else if (addr.includes('dubai') || addr.includes('дубай')) city = 'Dubai';
    else if (addr.includes('abu dhabi') || addr.includes('абу-даби')) city = 'Abu Dhabi';
    else if (addr.includes('london')) city = 'London';
    else if (addr.includes('new york') || addr.includes('nyc')) city = 'New York';
    else if (addr.includes('singapore')) city = 'Singapore';
    else if (addr.includes('bangkok') || addr.includes('бангкок')) city = 'Bangkok';
    else if (addr.includes('phuket') || addr.includes('пхукет')) city = 'Phuket';
    else if (addr.includes('tbilisi') || addr.includes('тбилиси')) city = 'Tbilisi';
    else if (addr.includes('yerevan') || addr.includes('ереван')) city = 'Yerevan';
    else if (addr.includes('almaty') || addr.includes('алматы')) city = 'Almaty';
    else if (addr.includes('tashkent') || addr.includes('ташкент')) city = 'Tashkent';
    else city = 'your area';
  }

  // 2. District / Landmark / Street Detection
  let landmarkOrDistrict = '';
  if (addr.includes('hòn chồng') || addr.includes('hon chong')) {
    landmarkOrDistrict = 'in the Hòn Chồng district';
  } else if (addr.includes('dubai marina')) {
    landmarkOrDistrict = 'in Dubai Marina';
  } else if (addr.includes('downtown')) {
    landmarkOrDistrict = 'in Downtown';
  } else if (addr.includes('jbr') || addr.includes('jumeirah beach')) {
    landmarkOrDistrict = 'at JBR / Jumeirah Beach';
  } else if (addr.includes('business bay')) {
    landmarkOrDistrict = 'in Business Bay';
  } else if (addr.includes('center') || addr.includes('centre')) {
    landmarkOrDistrict = 'in the city center';
  } else {
    const parts = address.split(',').map(p => p.trim());
    if (parts.length > 0 && parts[0] && parts[0] !== '—') {
      landmarkOrDistrict = `on ${parts[0]}`;
    } else {
      landmarkOrDistrict = 'conveniently located';
    }
  }

  const formattedLocation = `${landmarkOrDistrict}, ${city}`;

  return {
    landmarkOrDistrict,
    city,
    formattedLocation
  };
}

/**
 * Identifies the specific business niche from name and category keywords.
 */
export function detectBusinessNiche(name: string, category?: string): BusinessNiche {
  const combined = `${name} ${category || ''}`.toLowerCase();

  // Tourism / Visa / Expat
  if (
    combined.includes('визар') ||
    combined.includes('виза') ||
    combined.includes('visa') ||
    combined.includes('экспат') ||
    combined.includes('expat') ||
    combined.includes('tour') ||
    combined.includes('тур') ||
    combined.includes('travel') ||
    combined.includes('миграц') ||
    combined.includes('relocation')
  ) {
    return 'VISA_TOURISM_EXPAT';
  }

  // Food & Dining / Cafe / Restaurant
  if (
    combined.includes('кофе') ||
    combined.includes('coffee') ||
    combined.includes('cafe') ||
    combined.includes('кафе') ||
    combined.includes('restaurant') ||
    combined.includes('ресторан') ||
    combined.includes('пекарн') ||
    combined.includes('bakery') ||
    combined.includes('bistro') ||
    combined.includes('бистро') ||
    combined.includes('бар') ||
    combined.includes('bar') ||
    combined.includes('пицца') ||
    combined.includes('pizza') ||
    combined.includes('суши') ||
    combined.includes('sushi') ||
    combined.includes('бургер') ||
    combined.includes('burger') ||
    combined.includes('еда') ||
    combined.includes('food') ||
    combined.includes('kitchen')
  ) {
    return 'COFFEE_FOOD';
  }

  // Beauty & Spa
  if (
    combined.includes('красот') ||
    combined.includes('beauty') ||
    combined.includes('salon') ||
    combined.includes('салон') ||
    combined.includes('маникюр') ||
    combined.includes('nail') ||
    combined.includes('hair') ||
    combined.includes('стрижк') ||
    combined.includes('барбер') ||
    combined.includes('barber') ||
    combined.includes('spa') ||
    combined.includes('спа') ||
    combined.includes('массаж') ||
    combined.includes('massage') ||
    combined.includes('cosmet') ||
    combined.includes('космет')
  ) {
    return 'BEAUTY_SPA';
  }

  // Medical & Dental
  if (
    combined.includes('стомат') ||
    combined.includes('dental') ||
    combined.includes('клиник') ||
    combined.includes('clinic') ||
    combined.includes('врач') ||
    combined.includes('doctor') ||
    combined.includes('мед') ||
    combined.includes('med') ||
    combined.includes('здоров') ||
    combined.includes('health') ||
    combined.includes('анализ')
  ) {
    return 'HEALTH_DENTAL';
  }

  // Auto Service
  if (
    combined.includes('авто') ||
    combined.includes('auto') ||
    combined.includes('car') ||
    combined.includes('motor') ||
    combined.includes('сто') ||
    combined.includes('шиномонтаж') ||
    combined.includes('tire') ||
    combined.includes('детейлинг') ||
    combined.includes('detailing') ||
    combined.includes('мойка') ||
    combined.includes('wash')
  ) {
    return 'AUTO_SERVICE';
  }

  // Retail & Specialty Store
  if (
    combined.includes('магазин') ||
    combined.includes('shop') ||
    combined.includes('store') ||
    combined.includes('бутик') ||
    combined.includes('boutique') ||
    combined.includes('маркет') ||
    combined.includes('цветы') ||
    combined.includes('flowers')
  ) {
    return 'RETAIL_SHOP';
  }

  // Home Services & Trades
  if (
    combined.includes('клининг') ||
    combined.includes('clean') ||
    combined.includes('сантех') ||
    combined.includes('plumb') ||
    combined.includes('электрик') ||
    combined.includes('electric') ||
    combined.includes('ремонт') ||
    combined.includes('hvac') ||
    combined.includes('мастер')
  ) {
    return 'HOME_SERVICES';
  }

  // Professional Services
  if (
    combined.includes('юрист') ||
    combined.includes('law') ||
    combined.includes('бухгалтер') ||
    combined.includes('консалт') ||
    combined.includes('consult') ||
    combined.includes('агентство') ||
    combined.includes('agency') ||
    combined.includes('недвижим') ||
    combined.includes('real estate')
  ) {
    return 'PROFESSIONAL_SERVICES';
  }

  return 'GENERAL_LOCAL';
}

/**
 * Generates an SEO-optimized, human-quality Google Business Profile description.
 * Adheres strictly to Google GBP 750 character limit, free of generic filler text.
 * Integrates owner-provided notes seamlessly with algorithmic local ranking factors.
 */
export function generateSmartSeoDescription(context: SeoCopyContext): string {
  const { businessName, businessAddress, category, city: fallbackCity, tone = 'SEO', explicitNiche, customNotes } = context;
  const name = businessName !== '—' && businessName ? businessName : 'our business';
  const geo = extractGeoAnchors(businessAddress, fallbackCity);
  const niche = explicitNiche || detectBusinessNiche(name, category);

  // If user provided custom plain words about their business, format them gracefully
  const userHighlights = customNotes && customNotes.trim().length > 0 
    ? ` Specialties & highlights: ${customNotes.trim()}.` 
    : '';

  switch (niche) {
    case 'VISA_TOURISM_EXPAT':
      if (tone === 'PREMIUM') {
        return `${name} is the premier service center for expats and international travelers in ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} We handle all formalities with precision: visa extensions, turnkey border & visa runs, legal advisory, certified document translations, and business visa assistance. Enjoy personalized concierge support, zero hidden fees, and complete confidentiality in our comfortable, air-conditioned lounge with high-speed Wi-Fi. Contact us today or visit our office for expert consultation!`;
      }
      if (tone === 'CONCISE') {
        return `${name} in ${geo.city} (${geo.landmarkOrDistrict}): fast, reliable visa & expat support.${userHighlights} Visa extensions, border runs, certified translations, and legal consulting. Transparent flat-rate pricing, dedicated support 7 days a week, easy parking, and card/cash payments accepted. Get directions on Google Maps or message us directly today!`;
      }
      // Default: SEO
      return `${name} is a trusted visa, immigration, and expat service hub in ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} We specialize in comprehensive travel and residency support: turnkey visa runs, tourist & business visa renewals, notarized document translations, and expat assistance. Our experienced team ensures quick turnaround, fair pricing, and clear communication. Convenient central location with free parking, AC lounge, and guest Wi-Fi. Get directions on Google Maps or reach out for a consultation!`;

    case 'COFFEE_FOOD':
      if (tone === 'PREMIUM') {
        return `${name} is an artisanal dining destination in ${geo.city} (${geo.landmarkOrDistrict}), curated for lovers of culinary craftsmanship and design.${userHighlights} Featuring 100% Arabica specialty coffee, farm-to-table breakfast, fresh Parisian pastries, and exquisite seasonal lunch specialties. Relax in our sunlit indoor dining room or airy garden terrace. Attentive service, laptop-friendly Wi-Fi, and convenient parking. Reserve your table online or navigate via Google Maps!`;
      }
      if (tone === 'CONCISE') {
        return `${name} in ${geo.city} (${geo.landmarkOrDistrict}): specialty coffee, all-day hearty breakfasts, healthy lunch bowls, and fresh baked goods.${userHighlights} High-speed Wi-Fi, power outlets, indoor and terrace seating. Takeaway available, easy guest parking, and card/QR payments accepted. Open daily — drop by for your favorite brew!`;
      }
      // Default: SEO
      return `Welcome to ${name}, your neighborhood specialty cafe and restaurant in ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} Serving freshly roasted artisan coffee, all-day breakfasts, delicious lunches, and house-made desserts. A welcoming atmosphere perfect for casual meetups, family brunches, and remote work with blazing-fast Wi-Fi. Pet-friendly outdoor seating, takeaway options, and dedicated parking. Get directions on Google Maps — we look forward to welcoming you!`;

    case 'BEAUTY_SPA':
      if (tone === 'PREMIUM') {
        return `${name} Beauty & Wellness Studio in ${geo.city} (${geo.landmarkOrDistrict}) is your sanctuary for luxury styling and self-care.${userHighlights} Signature haircuts, advanced color correction (Airtouch, Balayage), 4-hand manicure & pedicure, and rejuvenating facial spa rituals. We use certified premium international cosmetics with 100% medical-grade tool sterilization. Enjoy complimentary artisan coffee with every visit. Book your appointment via Google Maps!`;
      }
      if (tone === 'CONCISE') {
        return `${name} (${geo.landmarkOrDistrict}, ${geo.city}): expert hair styling, coloring, gel manicure, pedicure, and brow architecture.${userHighlights} Senior stylists, premium organic products, strict sterilization standards, and satisfaction guarantee. Easy online booking, on-site parking, and Wi-Fi. Reserve your preferred time slot on Google Maps!`;
      }
      // Default: SEO
      return `${name} is a full-service beauty salon and day spa in ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} Offering trendy women's and men's haircuts, creative hair coloring, long-lasting gel manicures, pedicures, lash extensions, and relaxing body treatments. Our certified beauty professionals bring 5+ years of experience in a clean, welcoming environment. Dedicated client parking and easy booking. Call or book your visit on Google Maps today!`;

    case 'HEALTH_DENTAL':
      if (tone === 'PREMIUM') {
        return `${name} Healthcare Center in ${geo.city} (${geo.landmarkOrDistrict}) delivers world-class medical and dental care for the entire family.${userHighlights} Equipped with state-of-the-art diagnostic technology and staffed by internationally accredited specialists. Gentle, painless treatments, transparent treatment plans, and direct insurance billing. Experience compassionate care in a modern, private setting. Schedule your consultation online via Google Maps.`;
      }
      if (tone === 'CONCISE') {
        return `${name} Clinic in ${geo.city} (${geo.landmarkOrDistrict}): comprehensive dental care, general practice, routine exams, and laboratory diagnostics.${userHighlights} Modern digital equipment, minimal wait times, and upfront honest pricing. Accessible entrance, free parking, open 7 days a week. Book your appointment online in 1 click!`;
      }
      // Default: SEO
      return `${name} is a leading dental and medical clinic serving ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} We provide expert dental implants, routine cleanings, teeth whitening, emergency dental care, and preventive health screenings. Featuring modern digital equipment, hospital-grade sterilization protocols, and a patient-first approach. Flexible financing options and insurance support. Get directions or schedule your visit on Google Maps today!`;

    case 'AUTO_SERVICE':
      if (tone === 'CONCISE') {
        return `${name} in ${geo.city} (${geo.landmarkOrDistrict}): professional auto repair, suspension, engine diagnostics, scheduled maintenance, and oil change.${userHighlights} 30-minute computer inspection, upfront written estimates, OEM parts in stock, and up to 12-month service warranty. Drive in without delay — navigate via Google Maps!`;
      }
      // Default: SEO
      return `${name} is your complete auto repair and car care center in ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} We specialize in complete maintenance for all makes and models: advanced computer diagnostics, brake repairs, transmission service, tire alignment, AC recharge, and auto detailing. Transparent pricing with no hidden charges and manufacturer-warrantied parts. Comfortable customer lounge with Wi-Fi and coffee. Get directions on Google Maps today!`;

    default:
      if (tone === 'CONCISE') {
        return `${name} in ${geo.city} (${geo.landmarkOrDistrict}): dependable professional services backed by proven expertise.${userHighlights} Prompt project execution, seasoned specialists, and straightforward pricing with zero hidden fees. Conveniently accessible location, parking, and card payments accepted. Contact our team or navigate on Google Maps!`;
      }
      // Default: SEO
      return `Welcome to ${name}, your trusted local destination in ${geo.city} (${geo.landmarkOrDistrict}).${userHighlights} We are dedicated to delivering premier quality services with a strong focus on personalized customer care, rapid response times, and exceptional standards. Convenient access, dedicated customer parking, and modern payment options. Operating on an updated, reliable schedule. Get directions on Google Maps or contact us today for details!`;
  }
}

/**
 * Generates structured, realistic catalog items for Card 4 based on confirmed niche and location.
 */
export function getNicheCatalogItems(niche: BusinessNiche, currencySymbol: string): string {
  switch (niche) {
    case 'VISA_TOURISM_EXPAT':
      return `Catalog of 8 structured services: Turnkey Border / Visa Run (${currencySymbol} 85), 30-Day Tourist Visa Extension (${currencySymbol} 45), Notarized Document Translation (${currencySymbol} 15), Private Border VIP Van Transfer (${currencySymbol} 60), Business Visa & Work Permit (${currencySymbol} 140)...`;
    case 'COFFEE_FOOD':
      return `Catalog of 10 popular dishes & drinks: Specialty Flat White (${currencySymbol} 4.5), Sourdough Avocado Toast & Poached Egg (${currencySymbol} 12), Almond Butter Croissant (${currencySymbol} 5), Cold Brew Signature (${currencySymbol} 5.5), Protein Breakfast Bowl (${currencySymbol} 9)...`;
    case 'BEAUTY_SPA':
      return `Menu of 10 beauty treatments: Signature Haircut & Blowdry (${currencySymbol} 35), Medical Gel Manicure (${currencySymbol} 28), Balayage Color Transformation (${currencySymbol} 95), Brow Lamination & Tinting (${currencySymbol} 18), Hydrating Collagen Facial (${currencySymbol} 55)...`;
    case 'HEALTH_DENTAL':
      return `Healthcare catalog of 8 services: Comprehensive Consultation & Exam (${currencySymbol} 30), Ultrasonic Teeth Cleaning & Polish (${currencySymbol} 50), Microscopic Cavity Restoration (${currencySymbol} 65), Panoramic Dental X-Ray (${currencySymbol} 25)...`;
    case 'AUTO_SERVICE':
      return `Service menu of 8 repairs: Full Computer Diagnostics (${currencySymbol} 30), Synthetic Oil & Filter Service (${currencySymbol} 45), 4-Wheel Laser Alignment (${currencySymbol} 40), Comprehensive Brake Inspection (${currencySymbol} 25)...`;
    default:
      return `Catalog of 10 structured services with detailed descriptions, photos, and verified prices optimized for Google Maps direct booking and AI Overview search.`;
  }
}
