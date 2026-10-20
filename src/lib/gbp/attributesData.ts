export interface GoogleAttributeItem {
  id: string;
  name: string;
  category: string;
  description: string;
  seoImpact: 'HIGH' | 'MEDIUM' | 'STANDARD';
  recommendedNiches?: string[]; // Niche keywords that prioritize this
  defaultState?: boolean;
}

export interface GoogleAttributeGroup {
  id: string;
  name: string;
  iconName: string;
  description: string;
  items: GoogleAttributeItem[];
}

export const GOOGLE_ATTRIBUTE_GROUPS: GoogleAttributeGroup[] = [
  {
    id: 'accessibility',
    name: 'Accessibility',
    iconName: 'Accessibility',
    description: 'Wheelchair access, elevators, and assistive accommodations on Google Maps.',
    items: [
      {
        id: 'wheelchair_accessible_entrance',
        name: 'Wheelchair accessible entrance',
        category: 'accessibility',
        description: 'Level or ramped entrance allowing unassisted wheelchair entry.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'wheelchair_accessible_seating',
        name: 'Wheelchair accessible seating',
        category: 'accessibility',
        description: 'Designated seating spaces with appropriate table heights for wheelchairs.',
        seoImpact: 'HIGH',
        recommendedNiches: ['cafe', 'restaurant', 'office', 'service']
      },
      {
        id: 'wheelchair_accessible_restroom',
        name: 'Wheelchair accessible restroom',
        category: 'accessibility',
        description: 'Wide door restrooms equipped with handrails and clear turning space.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'wheelchair_accessible_parking',
        name: 'Wheelchair accessible parking lot',
        category: 'accessibility',
        description: 'Designated handicap parking spots near the main facility entrance.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'wheelchair_accessible_elevator',
        name: 'Wheelchair accessible elevator',
        category: 'accessibility',
        description: 'Braille buttons, wide cabin, and audible floor announcements.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['office', 'hotel', 'mall']
      },
      {
        id: 'assistive_hearing_loop',
        name: 'Assistive hearing loop',
        category: 'accessibility',
        description: 'Induction loop system for telecoil-equipped hearing aids.',
        seoImpact: 'STANDARD',
        recommendedNiches: ['office', 'medical', 'consulting']
      },
      {
        id: 'wheelchair_rental',
        name: 'Wheelchair rental available',
        category: 'accessibility',
        description: 'On-demand wheelchairs provided for guests on site.',
        seoImpact: 'STANDARD',
        recommendedNiches: ['tourist', 'hospitality']
      },
      {
        id: 'accessible_braille_menu',
        name: 'Braille & large-print documents',
        category: 'accessibility',
        description: 'Services and documentation available in accessible formats.',
        seoImpact: 'STANDARD',
        recommendedNiches: ['restaurant', 'legal', 'service']
      }
    ]
  },
  {
    id: 'amenities',
    name: 'Amenities & Environment',
    iconName: 'Coffee',
    description: 'Customer comforts, air conditioning, Wi-Fi, and venue facilities.',
    items: [
      {
        id: 'free_wifi',
        name: 'Free Wi-Fi',
        category: 'amenities',
        description: 'High-speed complimentary wireless internet for customers.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'paid_wifi',
        name: 'Paid Wi-Fi',
        category: 'amenities',
        description: 'Premium paid high-bandwidth Wi-Fi network available.',
        seoImpact: 'STANDARD'
      },
      {
        id: 'air_conditioning',
        name: 'Air conditioning (AC)',
        category: 'amenities',
        description: 'Fully climate-controlled indoor lounge and client spaces.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'restroom',
        name: 'Customer restrooms',
        category: 'amenities',
        description: 'Clean on-site restrooms dedicated for clients and guests.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'gender_neutral_restroom',
        name: 'Gender-neutral restrooms',
        category: 'amenities',
        description: 'Inclusive single-stall or all-gender restroom facilities.',
        seoImpact: 'MEDIUM'
      },
      {
        id: 'outdoor_seating',
        name: 'Outdoor seating / Open-air patio',
        category: 'amenities',
        description: 'Terrace or sidewalk seating for open-air meetings and dining.',
        seoImpact: 'HIGH',
        recommendedNiches: ['cafe', 'restaurant', 'lounge']
      },
      {
        id: 'covered_outdoor_seating',
        name: 'Covered outdoor seating',
        category: 'amenities',
        description: 'Canopy or pergolas providing sun and rain protection.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['cafe', 'restaurant']
      },
      {
        id: 'heated_outdoor_seating',
        name: 'Heated outdoor seating',
        category: 'amenities',
        description: 'Outdoor patio equipped with heaters for winter / evening comfort.',
        seoImpact: 'STANDARD'
      },
      {
        id: 'rooftop_seating',
        name: 'Rooftop seating / Terrace',
        category: 'amenities',
        description: 'Elevated scenic roof terrace with panoramic views.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['lounge', 'restaurant']
      },
      {
        id: 'waterfront_view',
        name: 'Waterfront / Ocean view',
        category: 'amenities',
        description: 'Scenic sea, marina, or lakeside views from the venue.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['restaurant', 'hotel']
      },
      {
        id: 'bar_on_site',
        name: 'Bar on site',
        category: 'amenities',
        description: 'Dedicated bar counter serving alcoholic or artisanal beverages.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['restaurant', 'lounge']
      },
      {
        id: 'dogs_allowed_outside',
        name: 'Dogs allowed (outdoor area)',
        category: 'amenities',
        description: 'Pet-friendly patio with fresh water bowls for pets.',
        seoImpact: 'HIGH',
        recommendedNiches: ['cafe', 'restaurant', 'park']
      },
      {
        id: 'dogs_allowed_inside',
        name: 'Dogs allowed inside',
        category: 'amenities',
        description: 'Pets permitted inside the indoor waiting area or dining room.',
        seoImpact: 'MEDIUM'
      },
      {
        id: 'free_charging_stations',
        name: 'Device charging stations & power outlets',
        category: 'amenities',
        description: 'Accessible power sockets and mobile phone charging docks.',
        seoImpact: 'HIGH',
        recommendedNiches: ['cafe', 'office', 'service']
      },
      {
        id: 'quiet_work_friendly',
        name: 'Quiet / Laptop & work-friendly',
        category: 'amenities',
        description: 'Comfortable desks, calm acoustics, and stable connection for work.',
        seoImpact: 'HIGH',
        recommendedNiches: ['cafe', 'coworking', 'office']
      },
      {
        id: 'swimming_pool',
        name: 'Swimming pool',
        category: 'amenities',
        description: 'Indoor or outdoor pool on the property.',
        seoImpact: 'STANDARD',
        recommendedNiches: ['hotel', 'fitness']
      },
      {
        id: 'tv_screens',
        name: 'TV screens & monitors',
        category: 'amenities',
        description: 'Displays for live sports, presentations, or entertainment.',
        seoImpact: 'STANDARD'
      },
      {
        id: 'live_music',
        name: 'Live music performances',
        category: 'amenities',
        description: 'Scheduled live acoustic or DJ sets.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['lounge', 'bar']
      },
      {
        id: 'non_smoking_throughout',
        name: 'Non-smoking throughout',
        category: 'amenities',
        description: '100% smoke-free indoor and outdoor areas.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['all']
      },
      {
        id: 'coat_check',
        name: 'Coat check / Luggage storage',
        category: 'amenities',
        description: 'Secure temporary holding for luggage, jackets, or documents.',
        seoImpact: 'STANDARD',
        recommendedNiches: ['office', 'restaurant', 'travel']
      }
    ]
  },
  {
    id: 'parking',
    name: 'Parking & Transit',
    iconName: 'Car',
    description: 'Parking spaces, street parking, valet, and transit accessibility.',
    items: [
      {
        id: 'free_parking_lot',
        name: 'Free parking lot on site',
        category: 'parking',
        description: 'Complimentary private parking lot for customers.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'paid_parking_lot',
        name: 'Paid parking lot',
        category: 'parking',
        description: 'Fee-based parking lot directly on premises.',
        seoImpact: 'MEDIUM'
      },
      {
        id: 'free_street_parking',
        name: 'Free street parking',
        category: 'parking',
        description: 'Public curbside parking available on nearby streets.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'paid_street_parking',
        name: 'Paid street parking',
        category: 'parking',
        description: 'Metered or pay-and-display parking on adjacent roads.',
        seoImpact: 'STANDARD'
      },
      {
        id: 'valet_parking',
        name: 'Valet parking',
        category: 'parking',
        description: 'Attendant valet service at main venue entrance.',
        seoImpact: 'HIGH',
        recommendedNiches: ['luxury', 'restaurant', 'hotel']
      },
      {
        id: 'dedicated_customer_parking',
        name: 'Dedicated client parking bays',
        category: 'parking',
        description: 'Reserved parking spots marked specifically for your customers.',
        seoImpact: 'HIGH',
        recommendedNiches: ['office', 'legal', 'service', 'medical']
      },
      {
        id: 'garage_parking',
        name: 'Covered garage parking',
        category: 'parking',
        description: 'Underground or multi-story parking garage structure.',
        seoImpact: 'MEDIUM'
      },
      {
        id: 'ev_charging_station',
        name: 'Electric vehicle (EV) charging stations',
        category: 'parking',
        description: 'Level 2 or DC fast chargers for electric cars.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'bike_parking',
        name: 'Bicycle parking racks',
        category: 'parking',
        description: 'Secure locking bike racks located near entry.',
        seoImpact: 'MEDIUM'
      }
    ]
  },
  {
    id: 'services',
    name: 'Service Options & Fulfillment',
    iconName: 'Briefcase',
    description: 'On-site appointments, online consulting, delivery, and service methods.',
    items: [
      {
        id: 'online_appointments',
        name: 'Online appointments available',
        category: 'services',
        description: 'Customers can book consultations or services online in advance.',
        seoImpact: 'HIGH',
        recommendedNiches: ['legal', 'service', 'medical', 'beauty']
      },
      {
        id: 'on_site_services',
        name: 'On-site services',
        category: 'services',
        description: 'Full range of services delivered directly at the physical location.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'online_classes_consultations',
        name: 'Remote / Video consultations',
        category: 'services',
        description: 'Video conferencing support via Zoom, Google Meet, or WhatsApp.',
        seoImpact: 'HIGH',
        recommendedNiches: ['consulting', 'legal', 'education', 'service']
      },
      {
        id: 'free_consultation',
        name: 'Free initial consultation / estimate',
        category: 'services',
        description: 'Zero-cost preliminary assessment or price quotation.',
        seoImpact: 'HIGH',
        recommendedNiches: ['legal', 'visa', 'construction', 'service']
      },
      {
        id: 'emergency_service_24_7',
        name: '24/7 Emergency response service',
        category: 'services',
        description: 'Round-the-clock urgent assistance hotline.',
        seoImpact: 'HIGH',
        recommendedNiches: ['medical', 'emergency', 'travel', 'locksmith']
      },
      {
        id: 'languages_spoken_english',
        name: 'English-speaking staff',
        category: 'services',
        description: 'Fluent English communication for international expats and tourists.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'languages_spoken_multilingual',
        name: 'Multilingual support (Russian, Vietnamese, French)',
        category: 'services',
        description: 'Staff speaks multiple global languages for expatriates.',
        seoImpact: 'HIGH',
        recommendedNiches: ['travel', 'visa', 'hospitality', 'service']
      },
      {
        id: 'dine_in',
        name: 'Dine-in service',
        category: 'services',
        description: 'Table service inside the restaurant or cafe.',
        seoImpact: 'HIGH',
        recommendedNiches: ['restaurant', 'cafe']
      },
      {
        id: 'takeout',
        name: 'Takeout / Carry-out',
        category: 'services',
        description: 'Order food or goods to take home.',
        seoImpact: 'HIGH',
        recommendedNiches: ['restaurant', 'cafe', 'bakery']
      },
      {
        id: 'delivery',
        name: 'Delivery service',
        category: 'services',
        description: 'Door-to-door delivery dispatched to customer address.',
        seoImpact: 'HIGH',
        recommendedNiches: ['restaurant', 'retail', 'service']
      },
      {
        id: 'curbside_pickup',
        name: 'Curbside pickup',
        category: 'services',
        description: 'Order brought directly to your vehicle outside the venue.',
        seoImpact: 'MEDIUM'
      },
      {
        id: 'in_store_pickup',
        name: 'In-store pickup',
        category: 'services',
        description: 'Pick up prepaid orders at designated store counter.',
        seoImpact: 'MEDIUM'
      },
      {
        id: 'no_contact_delivery',
        name: 'No-contact delivery',
        category: 'services',
        description: 'Delivery package left at doorstep with digital photo proof.',
        seoImpact: 'MEDIUM'
      },
      {
        id: 'same_day_delivery',
        name: 'Same-day urgent delivery',
        category: 'services',
        description: 'Orders delivered within hours on the date of request.',
        seoImpact: 'HIGH'
      },
      {
        id: 'drive_through',
        name: 'Drive-through window',
        category: 'services',
        description: 'Ordering and pickup without exiting vehicle.',
        seoImpact: 'MEDIUM'
      },
      {
        id: 'outdoor_counter',
        name: 'Walk-up / Outdoor service window',
        category: 'services',
        description: 'Dedicated walk-up window on street front.',
        seoImpact: 'STANDARD'
      }
    ]
  },
  {
    id: 'payments',
    name: 'Payment Methods',
    iconName: 'CreditCard',
    description: 'Supported cards, digital wallets, cash, and invoicing options.',
    items: [
      {
        id: 'credit_cards',
        name: 'Credit cards accepted (Visa, Mastercard, Amex)',
        category: 'payments',
        description: 'Major international credit card processing.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'debit_cards',
        name: 'Debit cards accepted',
        category: 'payments',
        description: 'Direct debit card payment supported.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'nfc_mobile_payments',
        name: 'NFC Contactless Mobile Payments',
        category: 'payments',
        description: 'Tap-to-pay using smartphones and smartwatch terminals.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        category: 'payments',
        description: 'Direct Apple Pay support via iPhone/Apple Watch.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'google_pay',
        name: 'Google Pay',
        category: 'payments',
        description: 'Instant Google Pay support via Android devices.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'cash_accepted',
        name: 'Cash accepted (Local & Foreign currency)',
        category: 'payments',
        description: 'Physical cash payments welcomed.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'cash_only',
        name: 'Cash only (No card terminal)',
        category: 'payments',
        description: 'Cash-only business without card terminals.',
        seoImpact: 'MEDIUM'
      },
      {
        id: 'bank_wire_transfer',
        name: 'Bank wire transfer / QR banking',
        category: 'payments',
        description: 'Direct bank transfer and local instant QR payment codes.',
        seoImpact: 'HIGH',
        recommendedNiches: ['office', 'legal', 'service']
      },
      {
        id: 'corporate_invoicing',
        name: 'Corporate VAT invoicing (VAT Tax Receipts)',
        category: 'payments',
        description: 'Official corporate invoices and fiscal tax receipts issued.',
        seoImpact: 'HIGH',
        recommendedNiches: ['office', 'b2b', 'legal']
      },
      {
        id: 'cryptocurrency',
        name: 'Cryptocurrency accepted (USDT / BTC)',
        category: 'payments',
        description: 'Digital stablecoin and crypto payment acceptance.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['tech', 'expat', 'hospitality']
      }
    ]
  },
  {
    id: 'crowd_vibe',
    name: 'Crowd, Atmosphere & Culture',
    iconName: 'Users',
    description: 'Target audience, hospitality culture, and venue atmosphere.',
    items: [
      {
        id: 'family_friendly',
        name: 'Family-friendly environment',
        category: 'crowd_vibe',
        description: 'Welcoming space suitable for families and children of all ages.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'tourists_expats_welcome',
        name: 'Popular with tourists & foreign expats',
        category: 'crowd_vibe',
        description: 'Frequently visited and reviewed by international travelers.',
        seoImpact: 'HIGH',
        recommendedNiches: ['travel', 'visa', 'hospitality', 'restaurant']
      },
      {
        id: 'groups_welcome',
        name: 'Good for groups & corporate delegations',
        category: 'crowd_vibe',
        description: 'Capacity and layout accommodating parties of 6+ people.',
        seoImpact: 'HIGH',
        recommendedNiches: ['restaurant', 'coworking', 'event']
      },
      {
        id: 'lgbtq_friendly',
        name: 'LGBTQ+ friendly',
        category: 'crowd_vibe',
        description: 'Respectful, welcoming, and safe space for LGBTQ+ individuals.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'transgender_safe_space',
        name: 'Transgender safe space',
        category: 'crowd_vibe',
        description: 'Zero-tolerance discrimination policy and inclusive staff.',
        seoImpact: 'MEDIUM'
      },
      {
        id: 'good_for_kids',
        name: 'Good for kids',
        category: 'crowd_vibe',
        description: 'Safe environment for young children.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['family', 'restaurant']
      },
      {
        id: 'high_chairs_available',
        name: 'High chairs available',
        category: 'crowd_vibe',
        description: 'Toddler high chairs provided upon request.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['restaurant', 'cafe']
      },
      {
        id: 'cozy_atmosphere',
        name: 'Cozy atmosphere',
        category: 'crowd_vibe',
        description: 'Warm, intimate interior lighting and comfortable decor.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['cafe', 'restaurant']
      },
      {
        id: 'casual_atmosphere',
        name: 'Casual & relaxed vibe',
        category: 'crowd_vibe',
        description: 'No strict dress code; relaxed customer reception.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['all']
      },
      {
        id: 'trendy_atmosphere',
        name: 'Trendy & Instagrammable modern interior',
        category: 'crowd_vibe',
        description: 'Photogenic, contemporary aesthetics appealing to young audiences.',
        seoImpact: 'MEDIUM'
      },
      {
        id: 'historic_venue',
        name: 'Historic landmark venue',
        category: 'crowd_vibe',
        description: 'Housed within a preserved historical building or landmark.',
        seoImpact: 'STANDARD'
      }
    ]
  },
  {
    id: 'planning',
    name: 'Planning & Booking Policies',
    iconName: 'CalendarCheck',
    description: 'Reservation rules, walk-in reception, and booking policies.',
    items: [
      {
        id: 'appointment_required',
        name: 'Appointment required',
        category: 'planning',
        description: 'Clients must schedule a confirmed slot prior to arrival.',
        seoImpact: 'HIGH',
        recommendedNiches: ['legal', 'medical', 'consulting']
      },
      {
        id: 'walk_ins_welcome',
        name: 'Walk-ins welcome (No appointment needed)',
        category: 'planning',
        description: 'Immediate reception and queue management on arrival.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'accepts_reservations',
        name: 'Accepts advance reservations',
        category: 'planning',
        description: 'Guaranteed reserved seating or meeting slots.',
        seoImpact: 'HIGH',
        recommendedNiches: ['restaurant', 'hospitality', 'service']
      },
      {
        id: 'free_cancellation',
        name: 'Free cancellation policy',
        category: 'planning',
        description: 'No penalty for cancellations up to 24 hours prior.',
        seoImpact: 'HIGH',
        recommendedNiches: ['service', 'travel', 'hotel']
      },
      {
        id: 'advance_booking_discount',
        name: 'Early booking promotions',
        category: 'planning',
        description: 'Discounts offered for bookings made 7+ days in advance.',
        seoImpact: 'STANDARD'
      }
    ]
  },
  {
    id: 'ownership',
    name: 'Ownership & Identity',
    iconName: 'Shield',
    description: 'Official Google Business diversity and ownership identity badges.',
    items: [
      {
        id: 'women_owned',
        name: 'Identifies as Women-owned',
        category: 'ownership',
        description: 'Google verified Women-owned business badge on Maps.',
        seoImpact: 'HIGH'
      },
      {
        id: 'veteran_owned',
        name: 'Identifies as Veteran-owned',
        category: 'ownership',
        description: 'Google verified Veteran-owned business badge.',
        seoImpact: 'HIGH'
      },
      {
        id: 'asian_owned',
        name: 'Identifies as Asian-owned',
        category: 'ownership',
        description: 'Google verified Asian-owned business badge.',
        seoImpact: 'HIGH'
      },
      {
        id: 'black_owned',
        name: 'Identifies as Black-owned',
        category: 'ownership',
        description: 'Google verified Black-owned business badge.',
        seoImpact: 'HIGH'
      },
      {
        id: 'latino_owned',
        name: 'Identifies as Latino-owned',
        category: 'ownership',
        description: 'Google verified Latino-owned business badge.',
        seoImpact: 'HIGH'
      },
      {
        id: 'lgbtq_owned',
        name: 'Identifies as LGBTQ+ owned',
        category: 'ownership',
        description: 'Google verified LGBTQ+ owned business badge.',
        seoImpact: 'HIGH'
      },
      {
        id: 'family_operated',
        name: 'Family-owned & operated',
        category: 'ownership',
        description: 'Independent family business spanning generations.',
        seoImpact: 'MEDIUM'
      }
    ]
  },
  {
    id: 'legal_professional',
    name: 'Legal, Visa & Expat Advisory',
    iconName: 'FileCheck2',
    description: 'Official document, visa run, notarization, and immigration service attributes.',
    items: [
      {
        id: 'turnkey_visa_support',
        name: 'Turnkey visa & residency assistance',
        category: 'legal_professional',
        description: 'End-to-end tourist, business, and temporary residency extensions.',
        seoImpact: 'HIGH',
        recommendedNiches: ['visa', 'legal', 'travel', 'consulting']
      },
      {
        id: 'certified_translations',
        name: 'Notarized & certified document translations',
        category: 'legal_professional',
        description: 'Official state-certified multi-language document translation.',
        seoImpact: 'HIGH',
        recommendedNiches: ['visa', 'legal', 'translation']
      },
      {
        id: 'notary_public_service',
        name: 'Notary public on premises',
        category: 'legal_professional',
        description: 'State licensed notary verification for contracts and powers of attorney.',
        seoImpact: 'HIGH',
        recommendedNiches: ['legal', 'office']
      },
      {
        id: 'expat_relocation_hub',
        name: 'Expat relocation & banking assistance',
        category: 'legal_professional',
        description: 'Bank account opening, work permit, and lease agreement facilitation.',
        seoImpact: 'HIGH',
        recommendedNiches: ['visa', 'relocation', 'consulting']
      },
      {
        id: 'urgent_express_filing',
        name: 'Urgent express 24h filing available',
        category: 'legal_professional',
        description: 'Expedited processing for critical deadlines.',
        seoImpact: 'HIGH',
        recommendedNiches: ['visa', 'legal']
      },
      {
        id: 'free_document_precheck',
        name: 'Free document pre-inspection via WhatsApp',
        category: 'legal_professional',
        description: 'Preliminary photo check of passports and certificates with zero fee.',
        seoImpact: 'HIGH',
        recommendedNiches: ['visa', 'legal']
      },
      {
        id: 'transparent_fixed_pricing',
        name: 'Fixed transparent pricing (Zero hidden fees)',
        category: 'legal_professional',
        description: 'All-inclusive pricing guaranteed in advance.',
        seoImpact: 'HIGH',
        recommendedNiches: ['all']
      },
      {
        id: 'strict_nda_privacy',
        name: 'Strict data privacy & NDA compliance',
        category: 'legal_professional',
        description: 'Secure digital document destruction and privacy encryption.',
        seoImpact: 'HIGH',
        recommendedNiches: ['legal', 'consulting']
      }
    ]
  },
  {
    id: 'food_dining',
    name: 'Food & Beverage Offerings',
    iconName: 'UtensilsCrossed',
    description: 'Menu items, dietary choices, coffee, and drink service on Google Maps.',
    items: [
      {
        id: 'coffee_specialty',
        name: 'Specialty coffee & espresso',
        category: 'food_dining',
        description: 'Single-origin beans, V60 pour-over, and barista espresso.',
        seoImpact: 'HIGH',
        recommendedNiches: ['cafe', 'bakery', 'restaurant']
      },
      {
        id: 'artisan_tea',
        name: 'Artisan tea selection',
        category: 'food_dining',
        description: 'Loose-leaf organic teas and matcha.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['cafe', 'restaurant']
      },
      {
        id: 'breakfast_served',
        name: 'Breakfast & brunch served',
        category: 'food_dining',
        description: 'Morning hot breakfast and brunch specials.',
        seoImpact: 'HIGH',
        recommendedNiches: ['cafe', 'restaurant']
      },
      {
        id: 'fresh_bakery',
        name: 'Fresh daily bakery & pastries',
        category: 'food_dining',
        description: 'Croissants, sourdough, and handmade pastries baked on site.',
        seoImpact: 'HIGH',
        recommendedNiches: ['bakery', 'cafe']
      },
      {
        id: 'vegetarian_options',
        name: 'Vegetarian options available',
        category: 'food_dining',
        description: 'Dedicated plant-based dishes on the menu.',
        seoImpact: 'HIGH',
        recommendedNiches: ['restaurant', 'cafe']
      },
      {
        id: 'vegan_options',
        name: 'Vegan options available',
        category: 'food_dining',
        description: '100% dairy-free and animal-free options.',
        seoImpact: 'HIGH',
        recommendedNiches: ['restaurant', 'cafe']
      },
      {
        id: 'gluten_free_options',
        name: 'Gluten-free menu items',
        category: 'food_dining',
        description: 'Gluten-free certified bread, pasta, and treats.',
        seoImpact: 'HIGH',
        recommendedNiches: ['restaurant', 'bakery']
      },
      {
        id: 'halal_certified',
        name: 'Halal certified food',
        category: 'food_dining',
        description: 'Halal slaughter certified meats and kitchen compliance.',
        seoImpact: 'HIGH',
        recommendedNiches: ['restaurant', 'cafe']
      },
      {
        id: 'craft_beer',
        name: 'Craft beer & draft selection',
        category: 'food_dining',
        description: 'Local and imported craft beers on tap.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['bar', 'restaurant']
      },
      {
        id: 'wine_selection',
        name: 'Curated wine list',
        category: 'food_dining',
        description: 'Organic and international wines by the glass or bottle.',
        seoImpact: 'MEDIUM',
        recommendedNiches: ['restaurant', 'lounge']
      },
      {
        id: 'cocktails_signature',
        name: 'Signature handcrafted cocktails',
        category: 'food_dining',
        description: 'Artisanal cocktails mixed with fresh ingredients.',
        seoImpact: 'HIGH',
        recommendedNiches: ['bar', 'lounge', 'restaurant']
      },
      {
        id: 'late_night_food',
        name: 'Late-night food (Serving past 10 PM)',
        category: 'food_dining',
        description: 'Kitchen remains open late for evening guests.',
        seoImpact: 'HIGH',
        recommendedNiches: ['restaurant', 'bar']
      }
    ]
  }
];

export function getAllGoogleAttributes(): GoogleAttributeItem[] {
  return GOOGLE_ATTRIBUTE_GROUPS.flatMap(g => g.items);
}

export function getRecommendedAttributeIds(nicheQuery: string = ''): string[] {
  const q = (nicheQuery || '').toLowerCase();
  const all = getAllGoogleAttributes();
  
  return all
    .filter(attr => {
      if (attr.seoImpact === 'HIGH') return true;
      if (!attr.recommendedNiches) return false;
      if (attr.recommendedNiches.includes('all')) return true;
      return attr.recommendedNiches.some(n => q.includes(n));
    })
    .map(a => a.id);
}
