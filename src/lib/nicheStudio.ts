export interface MediaPhoto {
  id: string;
  label: string;
  url: string;
  gps: string;
  authorityScore: string;
}

export interface PostPreset {
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

export interface CalendarDayPreset {
  dayName: string;
  dateNum: string;
  fullDate: string;
  status: 'SCHEDULED' | 'RECOMMENDED' | 'EMPTY';
  label?: string;
}

export interface NicheStudioConfig {
  nicheType: 'TRANSPORTATION' | 'CLINIC' | 'BEAUTY' | 'RESTAURANT_CAFE' | 'PROFESSIONAL_SERVICE';
  nicheLabel: string;
  mediaVault: MediaPhoto[];
  presets: PostPreset[];
  calendarDays: CalendarDayPreset[];
  placeholders: {
    headline: string;
    description: string;
  };
  defaultPost: {
    title: string;
    content: string;
    ctaType: 'BOOK' | 'ORDER' | 'CALL_NOW' | 'LEARN_MORE';
    targetKeywords: string[];
  };
}

export function detectNiche(profile?: { name?: string; category?: string; address?: string } | null): 'TRANSPORTATION' | 'CLINIC' | 'BEAUTY' | 'RESTAURANT_CAFE' | 'PROFESSIONAL_SERVICE' {
  const text = `${profile?.name || ''} ${profile?.category || ''} ${profile?.address || ''}`.toLowerCase();

  // 1. Transportation / Visa Run / Airport Transfer / Tours / Bus
  if (
    text.includes('transport') || text.includes('транспорт') ||
    text.includes('visaran') || text.includes('visa') || text.includes('виза') ||
    text.includes('transfer') || text.includes('airport') || text.includes('aeroport') ||
    text.includes('bus') || text.includes('shuttle') || text.includes('tour') ||
    text.includes('travel') || text.includes('border') || text.includes('driver') ||
    text.includes('car rental') || text.includes('van') || text.includes('taxi')
  ) {
    return 'TRANSPORTATION';
  }

  // 2. Dental / Medical / Aesthetics
  if (
    text.includes('clinic') || text.includes('dental') || text.includes('med') ||
    text.includes('клиник') || text.includes('стомат') || text.includes('aesthetic') ||
    text.includes('doctor') || text.includes('dentist')
  ) {
    return 'CLINIC';
  }

  // 3. Beauty Salon / Barbershop / Spa
  if (
    text.includes('salon') || text.includes('barber') || text.includes('spa') ||
    text.includes('beauty') || text.includes('салон') || text.includes('барбер') ||
    text.includes('nail') || text.includes('hair') || text.includes('парикмах')
  ) {
    return 'BEAUTY';
  }

  // 4. Restaurant / Cafe / F&B
  if (
    text.includes('cafe') || text.includes('coffee') || text.includes('кафе') ||
    text.includes('кофе') || text.includes('restaurant') || text.includes('ресторан') ||
    text.includes('bakery') || text.includes('bistro') || text.includes('food') ||
    text.includes('bar') || text.includes('dining')
  ) {
    return 'RESTAURANT_CAFE';
  }

  return 'PROFESSIONAL_SERVICE';
}

export function getNicheStudioConfig(profile?: {
  name?: string;
  category?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  cover_url?: string;
  photo_url?: string;
  snapshot_url?: string;
} | null): NicheStudioConfig {
  const niche = detectNiche(profile);
  const name = profile?.name || 'Your Business';
  const city = profile?.city || 'Local Area';
  const nameLower = (profile?.name || '').toLowerCase();
  const addressLower = (profile?.address || '').toLowerCase();
  let defaultLat = 12.2718;
  let defaultLng = 109.2016;
  if (nameLower.includes('visaran') || nameLower.includes('визар') || addressLower.includes('hòn chồng') || addressLower.includes('hon chong')) {
    defaultLat = 12.2690;
    defaultLng = 109.2020;
  }
  const rawLat = profile?.latitude ?? (profile as any)?.lat;
  const rawLng = profile?.longitude ?? (profile as any)?.lng;
  const latNum = typeof rawLat === 'number' && !isNaN(rawLat) && rawLat !== 25.2048 ? rawLat : defaultLat;
  const lngNum = typeof rawLng === 'number' && !isNaN(rawLng) && rawLng !== 55.2708 ? rawLng : defaultLng;
  const lat = `${latNum.toFixed(4)}° N`;
  const lng = `${lngNum.toFixed(4)}° E`;
  const gpsFormatted = `${lat}, ${lng}`;

  const realPrimaryPhoto = profile?.cover_url || profile?.photo_url || profile?.snapshot_url;

  // ==============================================================
  // 1. TRANSPORTATION / VISA RUN / SHUTTLE / TOURS
  // ==============================================================
  if (niche === 'TRANSPORTATION') {
    return {
      nicheType: 'TRANSPORTATION',
      nicheLabel: 'Transportation & Travel Service',
      mediaVault: [
        {
          id: 'photo-1',
          label: realPrimaryPhoto ? `${name} Verified Fleet Photo` : 'Modern Express Transfer Fleet',
          url: realPrimaryPhoto || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Primary Map Geotagged'
        },
        {
          id: 'photo-2',
          label: 'Spacious VIP Cabin & AC Interior',
          url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Comfort & Amenities Verified'
        },
        {
          id: 'photo-3',
          label: 'Scenic Express Route & Highway',
          url: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Route Entity Indexed'
        },
        {
          id: 'photo-4',
          label: 'Professional Driver & Service Concierge',
          url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Service Entity Verified'
        }
      ],
      presets: [
        {
          id: 'visa-run-daily',
          label: '🚐 Daily Express Visa Run',
          icon: '🚐',
          title: `Daily VIP Visa Run to Moc Bai & Border: Guaranteed Departures`,
          content: `Scheduled daily express departures from ${city}. Travel in premium air-conditioned minivans with spacious legroom, complimentary cold water, and full border crossing assistance. Book your seat online today.`,
          ctaType: 'BOOK',
          targetKeywords: ['visa run nha trang', 'bus to moc bai', 'cambodia border run', 'visa run vietnam'],
          photoTaggingAdvice: 'Attach photo of vehicle fleet or comfortable passenger cabin geotagged with your exact Google coordinates.',
          preferredPhotoId: 'photo-1'
        },
        {
          id: 'airport-transfer',
          label: '✈️ Airport VIP Transfer',
          icon: '✈️',
          title: `Cam Ranh Airport ⇄ ${city} Door-to-Door Private Transfer`,
          content: `24/7 reliable airport transfers with flight tracking and meet & greet service. Fixed transparent pricing, no surge charges, and spacious AC transport directly to your hotel.`,
          ctaType: 'BOOK',
          targetKeywords: ['cam ranh airport transfer', 'nha trang airport taxi', 'private driver nha trang', 'airport shuttle'],
          photoTaggingAdvice: 'Upload passenger pickup or vehicle exterior photo with clean license plate visibility.',
          preferredPhotoId: 'photo-2'
        },
        {
          id: 'visa-extension',
          label: '🛂 Visa Extension Assistance',
          icon: '🛂',
          title: `Vietnam Visa Extension & Renewal: 100% Legal & Fast-Track`,
          content: `Hassle-free visa renewal and extension support for expats and long-term travelers in ${city}. Fast turnaround, document verification, and dedicated WhatsApp support throughout every step.`,
          ctaType: 'CALL_NOW',
          targetKeywords: ['visa extension vietnam', 'expat visa service', 'fast track visa extension', 'border run support'],
          photoTaggingAdvice: 'Attach office reception or verified concierge service photo.',
          preferredPhotoId: 'photo-4'
        },
        {
          id: 'early-bird',
          label: '⚡ 48h Advance Seat Guarantee',
          icon: '⚡',
          title: `Book 48 Hours Ahead: Guaranteed Departure & Free Hotel Pickup`,
          content: `Guarantee your seat on upcoming express routes. Book at least 48 hours in advance to secure prime seats and enjoy complimentary door-to-door hotel pickup across ${city}.`,
          ctaType: 'BOOK',
          targetKeywords: ['early bird booking', 'guaranteed departure', 'express van booking', 'intercity transport'],
          photoTaggingAdvice: 'Include clear image of comfortable seating interior geotagged to office centroid.',
          preferredPhotoId: 'photo-2'
        },
        {
          id: 'private-charter',
          label: '💼 Private Minivan Charter',
          icon: '💼',
          title: `Private Minivan Charter for Intercity Trips & Day Excursions`,
          content: `Explore Da Lat, Cam Ranh, or Mui Ne on your schedule. Modern 7-seat and 16-seat vehicles with experienced professional drivers. Tailored itineraries for families and private groups.`,
          ctaType: 'CALL_NOW',
          targetKeywords: ['private van charter', 'intercity transfer', 'da lat private car', 'family tour transfer'],
          photoTaggingAdvice: 'Highlight modern vehicle fleet on scenic route.',
          preferredPhotoId: 'photo-3'
        },
        {
          id: 'holiday-schedule',
          label: '⏰ Holiday Schedule & Advisory',
          icon: '⏰',
          title: `Upcoming Public Holiday Departure Timetable & Booking Advisory`,
          content: `Operating at full capacity throughout the upcoming holiday season. High demand expected — reserve your seats early to ensure guaranteed departure times.`,
          ctaType: 'LEARN_MORE',
          targetKeywords: ['holiday travel schedule', 'departure timetable', 'visa transport schedule'],
          photoTaggingAdvice: 'Post verified timetable notice with office coordinates.',
          preferredPhotoId: 'photo-1'
        }
      ],
      calendarDays: [
        { dayName: 'Mon', dateNum: '14', fullDate: 'Monday, Oct 14', status: 'EMPTY' },
        { dayName: 'Tue', dateNum: '15', fullDate: 'Tuesday, Oct 15', status: 'RECOMMENDED', label: '⚡ Morning Departure Alert' },
        { dayName: 'Wed', dateNum: '16', fullDate: 'Wednesday, Oct 16', status: 'EMPTY' },
        { dayName: 'Thu', dateNum: '17', fullDate: 'Thursday, Oct 17', status: 'RECOMMENDED', label: '⚡ Midweek Border Schedule' },
        { dayName: 'Fri', dateNum: '18', fullDate: 'Friday, Oct 18', status: 'SCHEDULED', label: '🟢 Weekend Booking Rush' },
        { dayName: 'Sat', dateNum: '19', fullDate: 'Saturday, Oct 19', status: 'EMPTY' },
        { dayName: 'Sun', dateNum: '20', fullDate: 'Sunday, Oct 20', status: 'RECOMMENDED', label: '⚡ Weekly Timetable Announcement' }
      ],
      placeholders: {
        headline: 'e.g. Daily VIP Visa Run to Moc Bai: Guaranteed Departures & AC Comfort',
        description: 'Detail your departure timetable, route, pickup points, vehicle comfort, luggage allowance, or booking links...'
      },
      defaultPost: {
        title: `Express Visa Run & Airport Transfer Services in ${city}`,
        content: `Need reliable, comfortable transport from ${city}? ${name} provides daily express border runs, airport transfers, and private charters with modern AC vehicles and experienced drivers. Book your seat online today.`,
        ctaType: 'BOOK',
        targetKeywords: ['visa run nha trang', 'airport transfer', 'express transport', 'private driver']
      }
    };
  }

  // ==============================================================
  // 2. DENTAL / CLINIC / MEDICAL
  // ==============================================================
  if (niche === 'CLINIC') {
    return {
      nicheType: 'CLINIC',
      nicheLabel: 'Healthcare & Dental Clinic',
      mediaVault: [
        {
          id: 'photo-1',
          label: realPrimaryPhoto ? `${name} Verified Clinic Photo` : 'Modern Clinical Reception',
          url: realPrimaryPhoto || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Primary Map Geotagged'
        },
        {
          id: 'photo-2',
          label: 'Advanced Dental & Treatment Suite',
          url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Equipment Entity Verified'
        },
        {
          id: 'photo-3',
          label: 'Sterile Consultation & Exam Room',
          url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Hygiene Centroid Verified'
        },
        {
          id: 'photo-4',
          label: 'Specialist Doctor & Patient Care',
          url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Provider Entity Verified'
        }
      ],
      presets: [
        {
          id: 'free-exam',
          label: '🩺 Free First Consultation',
          icon: '🩺',
          title: `Complimentary 3D Digital Consultation & Checkup`,
          content: `Take charge of your health. Book a comprehensive initial exam with digital imaging and a personalized treatment roadmap with zero obligations.`,
          ctaType: 'BOOK',
          targetKeywords: ['dental checkup', 'dentist consultation', 'top rated clinic', 'digital dental exam'],
          photoTaggingAdvice: 'Attach clinic reception or modern exam chair photo geotagged to clinic centroid.',
          preferredPhotoId: 'photo-1'
        },
        {
          id: 'urgent-care',
          label: '⚡ Same-Day Emergency Slots',
          icon: '⚡',
          title: `Emergency Appointments Available: Same-Day Pain Relief`,
          content: `Experiencing acute toothache or dental discomfort? We reserve dedicated same-day emergency slots for swift, gentle relief. Call directly to book.`,
          ctaType: 'CALL_NOW',
          targetKeywords: ['emergency dentist', 'urgent dental clinic', 'tooth pain relief', 'same day appointment'],
          photoTaggingAdvice: 'Include photo of high-tech treatment suite.',
          preferredPhotoId: 'photo-2'
        },
        {
          id: 'aesthetic-perk',
          label: '✨ Smile Transformation Perk',
          icon: '✨',
          title: `Professional Teeth Whitening & Aesthetic Consultation`,
          content: `Brighten your smile with safe, hospital-grade in-office whitening and aesthetic restorations. Mention this Google Maps post to claim exclusive package pricing.`,
          ctaType: 'BOOK',
          targetKeywords: ['teeth whitening', 'cosmetic dentistry', 'smile makeover', 'veneer consultation'],
          photoTaggingAdvice: 'Upload well-lit treatment room photo.',
          preferredPhotoId: 'photo-3'
        },
        {
          id: 'family-care',
          label: '👨‍👩‍👧 Family Health Checkup',
          icon: '👨‍👩‍👧',
          title: `Comprehensive Family & Pediatric Care Appointments`,
          content: `Gentle, patient-first care for children, parents, and seniors. Convenient weekend slots and painless procedures in a calm environment.`,
          ctaType: 'BOOK',
          targetKeywords: ['family dentist', 'pediatric dental', 'gentle dental care'],
          photoTaggingAdvice: 'Highlight friendly practitioner and patient care area.',
          preferredPhotoId: 'photo-4'
        }
      ],
      calendarDays: [
        { dayName: 'Mon', dateNum: '14', fullDate: 'Monday, Oct 14', status: 'RECOMMENDED', label: '⚡ Urgent Slot Advisory' },
        { dayName: 'Tue', dateNum: '15', fullDate: 'Tuesday, Oct 15', status: 'EMPTY' },
        { dayName: 'Wed', dateNum: '16', fullDate: 'Wednesday, Oct 16', status: 'RECOMMENDED', label: '⚡ Midweek Health Tip' },
        { dayName: 'Thu', dateNum: '17', fullDate: 'Thursday, Oct 17', status: 'EMPTY' },
        { dayName: 'Fri', dateNum: '18', fullDate: 'Friday, Oct 18', status: 'SCHEDULED', label: '🟢 Weekend Appointments' },
        { dayName: 'Sat', dateNum: '19', fullDate: 'Saturday, Oct 19', status: 'EMPTY' },
        { dayName: 'Sun', dateNum: '20', fullDate: 'Sunday, Oct 20', status: 'EMPTY' }
      ],
      placeholders: {
        headline: 'e.g. Free 3D Digital Exam & Gentle Same-Day Consultation',
        description: 'Detail your medical services, doctor credentials, sterilization protocols, emergency slots, or booking links...'
      },
      defaultPost: {
        title: `Comprehensive Medical & Dental Care in ${city}`,
        content: `Looking for top-rated, gentle care? ${name} offers digital diagnostics, cosmetic treatments, and emergency appointments in ${city}. Reserve your visit today.`,
        ctaType: 'BOOK',
        targetKeywords: ['dental clinic', 'medical center', 'best clinic in town', 'certified doctors']
      }
    };
  }

  // ==============================================================
  // 3. BEAUTY / SALON / SPA / BARBER
  // ==============================================================
  if (niche === 'BEAUTY') {
    return {
      nicheType: 'BEAUTY',
      nicheLabel: 'Beauty Salon, Barber & Day Spa',
      mediaVault: [
        {
          id: 'photo-1',
          label: realPrimaryPhoto ? `${name} Verified Salon Photo` : 'Modern Salon Interior & Chairs',
          url: realPrimaryPhoto || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Primary Map Geotagged'
        },
        {
          id: 'photo-2',
          label: 'Master Hair Styling & Coloring Suite',
          url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Service Entity Verified'
        },
        {
          id: 'photo-3',
          label: 'Luxury Spa & Relaxing Lounge',
          url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Ambience Centroid Indexed'
        },
        {
          id: 'photo-4',
          label: 'Nail Art & Aesthetic Studio',
          url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Treatment Entity Verified'
        }
      ],
      presets: [
        {
          id: 'first-visit-perk',
          label: '✨ 15% First-Visit Welcome Perk',
          icon: '✨',
          title: `Welcome Perk: 15% Off Your First Visit at ${name}`,
          content: `Experience 5-star hair styling, color correction, and nail care. Mention this Google Maps post on your first visit to enjoy 15% off any premium service.`,
          ctaType: 'BOOK',
          targetKeywords: ['hair salon', 'best salon in town', 'first visit discount', 'master colorist'],
          photoTaggingAdvice: 'Attach bright salon interior photo showing styling chairs and clean aesthetics.',
          preferredPhotoId: 'photo-1'
        },
        {
          id: 'weekend-pamper',
          label: '💆 Weekend Self-Care Special',
          icon: '💆',
          title: `Weekend Self-Care: Express Manicure & Hair Restoration`,
          content: `Treat yourself to our signature hair treatment and 4-hand manicure combo. Relax in our quiet spa lounge with complimentary specialty drinks.`,
          ctaType: 'BOOK',
          targetKeywords: ['weekend spa', 'hair treatment', 'gel manicure', 'beauty parlor'],
          photoTaggingAdvice: 'Include close-up aesthetic photo with warm natural lighting.',
          preferredPhotoId: 'photo-3'
        },
        {
          id: 'barber-grooming',
          label: '✂️ Master Beard & Haircut',
          icon: '✂️',
          title: `Executive Grooming: Haircut, Hot Towel & Beard Trim`,
          content: `Precision fade, beard shaping, and traditional hot towel treatment by senior master barbers. Walk-ins welcome or reserve online.`,
          ctaType: 'CALL_NOW',
          targetKeywords: ['barbershop', 'mens haircut', 'beard trim', 'hot towel shave'],
          photoTaggingAdvice: 'Attach barber station photo geotagged to centroid.',
          preferredPhotoId: 'photo-2'
        }
      ],
      calendarDays: [
        { dayName: 'Mon', dateNum: '14', fullDate: 'Monday, Oct 14', status: 'EMPTY' },
        { dayName: 'Tue', dateNum: '15', fullDate: 'Tuesday, Oct 15', status: 'RECOMMENDED', label: '⚡ Midweek Glow Up' },
        { dayName: 'Wed', dateNum: '16', fullDate: 'Wednesday, Oct 16', status: 'EMPTY' },
        { dayName: 'Thu', dateNum: '17', fullDate: 'Thursday, Oct 17', status: 'RECOMMENDED', label: '⚡ Weekend Slots Opening' },
        { dayName: 'Fri', dateNum: '18', fullDate: 'Friday, Oct 18', status: 'SCHEDULED', label: '🟢 Friday Prime Slots' },
        { dayName: 'Sat', dateNum: '19', fullDate: 'Saturday, Oct 19', status: 'EMPTY' },
        { dayName: 'Sun', dateNum: '20', fullDate: 'Sunday, Oct 20', status: 'EMPTY' }
      ],
      placeholders: {
        headline: 'e.g. Master Color Correction, Airtouch & Tokio Inkarami Hair Spa',
        description: 'Detail your beauty services, master stylists, organic product lines, amenities, or direct booking links...'
      },
      defaultPost: {
        title: `Premium Hair, Nail & Spa Treatments in ${city}`,
        content: `Treat yourself to expert hair styling, color correction, and restorative treatments at ${name}. Book your appointment today.`,
        ctaType: 'BOOK',
        targetKeywords: ['beauty salon', 'hair salon', 'nail spa', 'top stylists']
      }
    };
  }

  // ==============================================================
  // 4. RESTAURANT / CAFE / F&B (ONLY when truly HoReCa)
  // ==============================================================
  if (niche === 'RESTAURANT_CAFE') {
    return {
      nicheType: 'RESTAURANT_CAFE',
      nicheLabel: 'Restaurant, Cafe & Dining',
      mediaVault: [
        {
          id: 'photo-1',
          label: realPrimaryPhoto ? `${name} Dining Photo` : 'Artisan Coffee & Breakfast',
          url: realPrimaryPhoto || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Primary Map Geotagged'
        },
        {
          id: 'photo-2',
          label: 'Cozy Interior Ambience & Dining',
          url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Ambience Centroid Indexed'
        },
        {
          id: 'photo-3',
          label: 'Storefront & Outdoor Seating',
          url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Storefront Entity Verified'
        },
        {
          id: 'photo-4',
          label: 'Chef Signature Dish & Prep',
          url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
          gps: gpsFormatted,
          authorityScore: 'Service Entity Verified'
        }
      ],
      presets: [
        {
          id: 'morning-offer',
          label: '☕ Morning Breakfast Perk',
          icon: '☕',
          title: `Fresh Morning Brew & Breakfast Special at ${name}`,
          content: `Start your day with freshly brewed single-origin coffee and artisan breakfast specials. Mention this Google post before 11:00 AM for 15% off.`,
          ctaType: 'ORDER',
          targetKeywords: ['specialty coffee', 'breakfast special', 'morning cafe', 'local roastery'],
          photoTaggingAdvice: 'Attach counter or morning sunlight photo geotagged to centroid.',
          preferredPhotoId: 'photo-1'
        },
        {
          id: 'chef-tasting',
          label: '🔥 Chef Special Dinner',
          icon: '🔥',
          title: `Weekend Exclusive: Signature Chef Tasting Menu`,
          content: `Indulge this weekend in handcrafted seasonal dishes and signature drinks. Table reservations recommended.`,
          ctaType: 'BOOK',
          targetKeywords: ['weekend dinner', 'best local dining', 'chef tasting', 'signature dishes'],
          photoTaggingAdvice: 'Include saturated photo of dining table or signature dish.',
          preferredPhotoId: 'photo-2'
        }
      ],
      calendarDays: [
        { dayName: 'Mon', dateNum: '14', fullDate: 'Monday, Oct 14', status: 'EMPTY' },
        { dayName: 'Tue', dateNum: '15', fullDate: 'Tuesday, Oct 15', status: 'EMPTY' },
        { dayName: 'Wed', dateNum: '16', fullDate: 'Wednesday, Oct 16', status: 'RECOMMENDED', label: '⚡ Peak Lunch Slot' },
        { dayName: 'Thu', dateNum: '17', fullDate: 'Thursday, Oct 17', status: 'EMPTY' },
        { dayName: 'Fri', dateNum: '18', fullDate: 'Friday, Oct 18', status: 'SCHEDULED', label: '🟢 Weekend Promo' },
        { dayName: 'Sat', dateNum: '19', fullDate: 'Saturday, Oct 19', status: 'EMPTY' },
        { dayName: 'Sun', dateNum: '20', fullDate: 'Sunday, Oct 20', status: 'RECOMMENDED', label: '⚡ Sunday Special' }
      ],
      placeholders: {
        headline: 'e.g. Weekend Chef Tasting: Handcrafted Special & Artisan Drinks',
        description: 'Detail your seasonal dishes, signature drinks, ingredients, allergen info, or reservation links...'
      },
      defaultPost: {
        title: `Signature Dining & Coffee in ${city}`,
        content: `Enjoy exceptional flavors and a cozy atmosphere at ${name}. Fresh seasonal ingredients and handcrafted dishes all week long.`,
        ctaType: 'ORDER',
        targetKeywords: ['local restaurant', 'cozy dining', 'fresh dishes', 'best food in town']
      }
    };
  }

  // ==============================================================
  // 5. PROFESSIONAL SERVICE / GENERAL LOCAL BUSINESS (Fallback)
  // ==============================================================
  return {
    nicheType: 'PROFESSIONAL_SERVICE',
    nicheLabel: 'Professional Services & Local Business',
    mediaVault: [
      {
        id: 'photo-1',
        label: realPrimaryPhoto ? `${name} Verified Office Photo` : 'Official Office & Storefront',
        url: realPrimaryPhoto || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
        gps: gpsFormatted,
        authorityScore: 'Primary Map Geotagged'
      },
      {
        id: 'photo-2',
        label: 'Modern Conference & Consultation Space',
        url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
        gps: gpsFormatted,
        authorityScore: 'Facility Entity Indexed'
      },
      {
        id: 'photo-3',
        label: 'Certified Specialist Team in Action',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
        gps: gpsFormatted,
        authorityScore: 'Team Authority Verified'
      },
      {
        id: 'photo-4',
        label: 'Client Advisory & Consulting Room',
        url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
        gps: gpsFormatted,
        authorityScore: 'Service Entity Verified'
      }
    ],
    presets: [
      {
        id: 'consultation',
        label: '💼 Free Initial Consultation',
        icon: '💼',
        title: `Schedule Your Initial Strategy Consultation with ${name}`,
        content: `Looking for trusted professional advice in ${city}? Connect with our certified team for a comprehensive consultation tailored to your goals.`,
        ctaType: 'CALL_NOW',
        targetKeywords: ['consulting service', 'professional advisory', 'local specialist', 'free consultation'],
        photoTaggingAdvice: 'Attach office reception or modern conference room photo geotagged to office centroid.',
        preferredPhotoId: 'photo-1'
      },
      {
        id: 'service-spotlight',
        label: '⭐ Core Service Spotlight',
        icon: '⭐',
        title: `Comprehensive Services & Guaranteed Client Results`,
        content: `Discover how our experienced specialists help clients achieve outstanding results. Fast turnaround, transparent pricing, and 5-star support.`,
        ctaType: 'LEARN_MORE',
        targetKeywords: ['professional services', 'top rated provider', 'client satisfaction', 'verified services'],
        photoTaggingAdvice: 'Upload verified specialist team photo.',
        preferredPhotoId: 'photo-3'
      }
    ],
    calendarDays: [
      { dayName: 'Mon', dateNum: '14', fullDate: 'Monday, Oct 14', status: 'RECOMMENDED', label: '⚡ Weekly Service Spotlight' },
      { dayName: 'Tue', dateNum: '15', fullDate: 'Tuesday, Oct 15', status: 'EMPTY' },
      { dayName: 'Wed', dateNum: '16', fullDate: 'Wednesday, Oct 16', status: 'EMPTY' },
      { dayName: 'Thu', dateNum: '17', fullDate: 'Thursday, Oct 17', status: 'RECOMMENDED', label: '⚡ Consultation Slots Open' },
      { dayName: 'Fri', dateNum: '18', fullDate: 'Friday, Oct 18', status: 'SCHEDULED', label: '🟢 Client Advisory Briefing' },
      { dayName: 'Sat', dateNum: '19', fullDate: 'Saturday, Oct 19', status: 'EMPTY' },
      { dayName: 'Sun', dateNum: '20', fullDate: 'Sunday, Oct 20', status: 'EMPTY' }
    ],
    placeholders: {
      headline: 'e.g. Turnkey Advisory & Direct Consultation with Verified Specialists',
      description: 'Detail your specialized services, client benefits, transparent pricing, team credentials, or booking links...'
    },
    defaultPost: {
      title: `Professional Business Services in ${city}`,
      content: `Trusted local expertise from ${name}. We deliver high-impact solutions with personalized attention and proven reliability. Connect with us today.`,
      ctaType: 'LEARN_MORE',
      targetKeywords: ['professional services', 'trusted advisor', 'local business', 'top rated']
    }
  };
}
