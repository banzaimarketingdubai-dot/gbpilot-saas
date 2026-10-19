export interface OwnerGroundTruth {
  profileKey: string;
  flagshipOffering: string;
  guestPersona: string;
  venueRulesAndPerks: string;
  updatedAt: string;
  isCompleted: boolean;
  skipped?: boolean;
}

export interface GroundTruthPresets {
  nicheLabel: string;
  flagshipChips: string[];
  personaChips: string[];
  rulesChips: string[];
  placeholders: {
    flagship: string;
    persona: string;
    rules: string;
  };
}

export function getGroundTruthKey(profile?: { id?: string; name?: string } | null): string {
  const raw = profile?.id || profile?.name || 'default';
  return `gbpilot_ground_truth_${raw.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
}

export function loadOwnerGroundTruth(profile?: { id?: string; name?: string } | null): OwnerGroundTruth {
  const key = getGroundTruthKey(profile);
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key) || localStorage.getItem('gbpilot_owner_ground_truth_latest');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            profileKey: key,
            flagshipOffering: parsed.flagshipOffering || '',
            guestPersona: parsed.guestPersona || '',
            venueRulesAndPerks: parsed.venueRulesAndPerks || '',
            updatedAt: parsed.updatedAt || new Date().toISOString(),
            isCompleted: Boolean(
              (parsed.flagshipOffering && parsed.flagshipOffering.trim()) ||
              (parsed.guestPersona && parsed.guestPersona.trim()) ||
              (parsed.venueRulesAndPerks && parsed.venueRulesAndPerks.trim())
            ),
            skipped: Boolean(parsed.skipped)
          };
        }
      } catch (e) {
        console.error('Failed to parse OwnerGroundTruth:', e);
      }
    }
  }
  return {
    profileKey: key,
    flagshipOffering: '',
    guestPersona: '',
    venueRulesAndPerks: '',
    updatedAt: '',
    isCompleted: false,
    skipped: false
  };
}

export function saveOwnerGroundTruth(
  profile: { id?: string; name?: string } | null | undefined,
  data: {
    flagshipOffering: string;
    guestPersona: string;
    venueRulesAndPerks: string;
    skipped?: boolean;
  }
): OwnerGroundTruth {
  const key = getGroundTruthKey(profile);
  const payload: OwnerGroundTruth = {
    profileKey: key,
    flagshipOffering: data.flagshipOffering.trim(),
    guestPersona: data.guestPersona.trim(),
    venueRulesAndPerks: data.venueRulesAndPerks.trim(),
    updatedAt: new Date().toISOString(),
    isCompleted: Boolean(
      data.flagshipOffering.trim() ||
      data.guestPersona.trim() ||
      data.venueRulesAndPerks.trim()
    ),
    skipped: Boolean(data.skipped)
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(payload));
    localStorage.setItem('gbpilot_owner_ground_truth_latest', JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('gbpilot_ground_truth_updated', { detail: payload }));
  }

  return payload;
}

export function getGroundTruthPresets(profile?: { name?: string; category?: string; address?: string } | null): GroundTruthPresets {
  const text = `${profile?.name || ''} ${profile?.category || ''} ${profile?.address || ''}`.toLowerCase();

  if (text.includes('clinic') || text.includes('dental') || text.includes('med') || text.includes('клиник') || text.includes('стомат') || text.includes('aesthetic')) {
    return {
      nicheLabel: 'Healthcare / Aesthetic Clinic',
      flagshipChips: [
        'Same-day dental implants & E-Max veneers',
        'Non-surgical facial lifting & aesthetics',
        'Laser hair removal & HydraFacial',
        'Free 3D digital exam on first visit'
      ],
      personaChips: [
        'High-value residents and expat families',
        'Patients seeking gentle, painless treatments',
        'English & multilingual local community',
        'VIP patients prioritizing privacy & zero wait'
      ],
      rulesChips: [
        'Complimentary valet parking at tower entrance',
        'Strictly by appointment + same-day urgent slots',
        'Direct insurance billing supported',
        '0% installment plans (Tabby / Tamara / Card)'
      ],
      placeholders: {
        flagship: 'e.g. Turnkey dental implants and porcelain veneers (70% margin)',
        persona: 'e.g. Working professionals aged 28-55 seeking premium care with zero wait time',
        rules: 'e.g. Free valet parking, 1st floor entrance, English/Arabic spoken, direct billing'
      }
    };
  }

  if (text.includes('visa') || text.includes('виза') || text.includes('legal') || text.includes('setup') || text.includes('real estate') || text.includes('недвиж')) {
    return {
      nicheLabel: 'Visa Center / Consulting / B2B Services',
      flagshipChips: [
        'Express visa extensions & Fast-Track processing',
        'VIP turnkey border runs via luxury minivan',
        'Company formation & Golden Visa concierge',
        'Residency TRC & work permit legalization'
      ],
      personaChips: [
        'Expats, digital nomads, and remote workers',
        'Relocating founders and international families',
        'Tourists needing urgent 24h assistance'
      ],
      rulesChips: [
        '100% money-back guarantee with zero hidden fees',
        'Dedicated account manager via WhatsApp 24/7',
        'Doorstep document courier pickup & drop-off',
        'Cash, credit card, and crypto payments accepted'
      ],
      placeholders: {
        flagship: 'e.g. Urgent visa renewals, VIP border runs, and turnkey Golden Visas',
        persona: 'e.g. Expats and travelers seeking reliability without bureaucratic hassles',
        rules: 'e.g. Central office with easy parking, door-to-door courier, multilingual team'
      }
    };
  }

  if (text.includes('salon') || text.includes('barber') || text.includes('spa') || text.includes('beauty') || text.includes('салон') || text.includes('барбер') || text.includes('спа')) {
    return {
      nicheLabel: 'Beauty Salon / Barbershop / Day Spa',
      flagshipChips: [
        'Airtouch color correction & hair restoration',
        '4-hand gel manicure & pedicure in 60 mins',
        'Royal beard grooming & executive haircuts',
        'Balinese therapeutic & lymphatic massage'
      ],
      personaChips: [
        'Residents of nearby towers and business towers',
        'Clients prioritizing hospital-grade sterilization',
        'Busy executives who value fast service'
      ],
      rulesChips: [
        'Free 2-hour customer parking on site',
        'Complimentary specialty coffee, matcha & bubbles',
        'Pet-friendly lounge (small dogs welcome)',
        '1-click booking via WhatsApp or Walk-ins welcome'
      ],
      placeholders: {
        flagship: 'e.g. Airtouch coloring, Tokio Inkarami hair spa, and 4-hand manicure',
        persona: 'e.g. Area residents seeking 5-star service and top-tier stylists',
        rules: 'e.g. Free parking in building, specialty coffee included, 15% first-visit discount'
      }
    };
  }

  // Default: Cafe / Restaurant / Hospitality / Local Venue
  return {
    nicheLabel: 'Restaurant / Cafe / Bakery / Local Business',
    flagshipChips: [
      'Artisanal all-day brunch & sourdough toast',
      'In-house roasted specialty flat whites & pastries',
      'Dry-aged signature steaks & dinner tasting sets',
      '45-minute executive lunch & freshly baked goods'
    ],
    personaChips: [
      'Remote workers & laptop founders (blazing Wi-Fi)',
      'Families and groups of friends for weekend brunch',
      'Tourists and neighborhood residential community',
      'Specialty coffee lovers & health-conscious diners'
    ],
    rulesChips: [
      'Pet-friendly terrace (water bowls provided)',
      'Free customer parking / valet at entrance',
      'Air-conditioned indoor dining + open garden patio',
      'Walk-ins welcome for breakfast, dinner reservations recommended'
    ],
    placeholders: {
      flagship: 'e.g. Signature cottage cheese pancakes, French butter croissants, and single-origin coffee',
      persona: 'e.g. Expats, families for breakfast, and remote workers needing reliable Wi-Fi and power outlets',
      rules: 'e.g. Pet-friendly, free parking around the corner, vegan options, 10-minute takeaway'
    }
  };
}
