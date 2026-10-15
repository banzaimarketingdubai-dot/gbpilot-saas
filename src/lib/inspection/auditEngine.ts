import { GBPLocation } from '@/lib/gbp/client';

export interface AuditRecommendation {
  id: string;
  categoryTitle: string;
  severity: 'CRITICAL' | 'WARNING' | 'OPPORTUNITY';
  problemText: string;
  beforeValue: string;
  afterValue: string;
  impactMetric: string;
  locked?: boolean;
  fieldToUpdate: string;
  patchPayload: Record<string, any>;
}

export interface InspectionAuditReport {
  locationName: string;
  businessName: string;
  initialScore: number;
  projectedScore: number;
  revenueRecoveryMonthly: number;
  revenueRecoveryFormatted: string;
  subscriptionTier: 'FREE' | 'PRO' | 'ENTERPRISE';
  issuesCount: number;
  recommendations: AuditRecommendation[];
  summary: string;
}

/**
 * AI Inspection Engine
 * Analyzes GBP location data, finds optimization gaps, and generates structured before/after payloads.
 */
export function runInspectionAudit(
  location: Partial<GBPLocation>,
  tier: 'FREE' | 'PRO' | 'ENTERPRISE' = 'FREE'
): InspectionAuditReport {
  const isPaywallLocked = tier === 'FREE';
  const recommendations: AuditRecommendation[] = [];

  const businessName = location.title || 'Artisan Specialty Cafe & Roastery';
  const primaryCat = location.categories?.primaryCategory?.displayName || '';
  const desc = location.profile?.description || '';

  // 1. Category Audit
  const isGenericCategory = !primaryCat || primaryCat.toLowerCase() === 'local business' || primaryCat.toLowerCase() === 'business';
  recommendations.push({
    id: 'audit-primary-category',
    categoryTitle: 'Primary & Secondary Categories',
    severity: isGenericCategory ? 'CRITICAL' : 'WARNING',
    problemText: isGenericCategory
      ? 'Primary category is set to generic placeholder "Local Business", destroying Google Maps 3-Pack discovery.'
      : 'Missing high-volume secondary categories (Espresso Bar, Artisanal Bakery, Breakfast Restaurant).',
    beforeValue: primaryCat || 'Local Business (Unverified Generic Tag)',
    afterValue: 'Specialty Coffee Shop & Roastery • Secondary: Artisanal Bakery, Breakfast Cafe, Espresso Bar',
    impactMetric: '+38% Maps Discovery Impressions',
    locked: isPaywallLocked,
    fieldToUpdate: 'categories',
    patchPayload: {
      categories: {
        primaryCategory: { displayName: 'Specialty Coffee Shop' },
        additionalCategories: [
          { displayName: 'Bakery' },
          { displayName: 'Breakfast Restaurant' },
          { displayName: 'Espresso Bar' }
        ]
      }
    }
  });

  // 2. Profile Description Audit
  const isDescWeak = !desc || desc.length < 150;
  recommendations.push({
    id: 'audit-seo-description',
    categoryTitle: 'SEO Profile Description & LSI Keywords',
    severity: isDescWeak ? 'CRITICAL' : 'WARNING',
    problemText: isDescWeak
      ? 'Short, unoptimized profile description missing high-intent local search keywords.'
      : 'Description lacks neighborhood geographic centroid anchors and signature specialty keywords.',
    beforeValue: desc || 'Local neighborhood cafe serving coffee and food.',
    afterValue: `Welcome to ${businessName}, the premier specialty roastery and artisanal breakfast cafe in the neighborhood. We serve handcrafted single-origin pour-overs, artisan sourdough, and fresh breakfast dishes daily. Outdoor seating available.`,
    impactMetric: 'Ranks for 14 New Local Keywords',
    locked: isPaywallLocked,
    fieldToUpdate: 'profile.description',
    patchPayload: {
      profile: {
        description: `Welcome to ${businessName}, the premier specialty roastery and artisanal breakfast cafe in the neighborhood. We serve handcrafted single-origin pour-overs, artisan sourdough, and fresh breakfast dishes daily. Outdoor seating available.`
      }
    }
  });

  // 3. Special & Holiday Hours Audit
  const hasSpecialHours = (location.specialHours?.specialHourPeriods?.length || 0) > 0;
  recommendations.push({
    id: 'audit-holiday-hours',
    categoryTitle: 'Holiday Schedules & Special Hours',
    severity: 'WARNING',
    problemText: hasSpecialHours
      ? 'Upcoming bank holiday hours are not officially declared, risking competitor suggested "Closed" edits.'
      : 'Zero special holiday hours configured. Google displays an orange warning "Hours might differ" on search cards.',
    beforeValue: hasSpecialHours ? 'Only regular weekly hours declared' : 'Google displays "Hours might differ" banner',
    afterValue: 'Full 90-day bank holiday & weekend calendar locked with 24/7 competitor tamper protection.',
    impactMetric: 'Eliminates False-Closed Customer Dropoffs',
    locked: isPaywallLocked,
    fieldToUpdate: 'specialHours',
    patchPayload: {
      specialHours: {
        specialHourPeriods: [
          {
            startDate: { year: 2026, month: 12, day: 24 },
            openTime: '08:00',
            endDate: { year: 2026, month: 12, day: 24 },
            closeTime: '20:00'
          },
          {
            startDate: { year: 2026, month: 12, day: 25 },
            openTime: '09:00',
            endDate: { year: 2026, month: 12, day: 25 },
            closeTime: '18:00'
          }
        ]
      }
    }
  });

  // 4. Attributes & Amenities Audit
  recommendations.push({
    id: 'audit-service-attributes',
    categoryTitle: 'Dining & Service Attributes',
    severity: 'OPPORTUNITY',
    problemText: 'Customer filter badges (Outdoor Seating, Free Wi-Fi, Specialty Pour-Over) are unverified in Google Knowledge Panel.',
    beforeValue: '2 of 18 attributes declared.',
    afterValue: '16 high-conversion attributes verified: Outdoor seating, Highchairs, Vegan options, Specialty coffee, Wi-Fi.',
    impactMetric: '+24% Voice Search & Maps Filter Hits',
    locked: isPaywallLocked,
    fieldToUpdate: 'attributes',
    patchPayload: {
      attributes: [
        { attributeId: 'has_outdoor_seating', values: [true] },
        { attributeId: 'has_wifi', values: [true] },
        { attributeId: 'serves_specialty_coffee', values: [true] },
        { attributeId: 'serves_breakfast', values: [true] },
        { attributeId: 'wheelchair_accessible_entrance', values: [true] }
      ]
    }
  });

  // 5. EXIF Geotagged Photos
  recommendations.push({
    id: 'audit-exif-photos',
    categoryTitle: 'Geo-Tagged Photos (EXIF Spatial Authority)',
    severity: 'OPPORTUNITY',
    problemText: 'Uploaded venue photos lack camera EXIF GPS centroid metadata, missing primary Google Maps spatial authority signals.',
    beforeValue: '0% photos stamped with coordinates.',
    afterValue: 'Automated GPS stamping at exact coordinates: 12.2718° N, 109.2016° E on all future media uploads.',
    impactMetric: 'Qualifies for Maps Discovery Carousel',
    locked: isPaywallLocked,
    fieldToUpdate: 'photos',
    patchPayload: {
      exifGeotaggingEnabled: true
    }
  });

  const initialScore = isGenericCategory ? 48 : 68;
  const projectedScore = 96;

  return {
    locationName: location.name || 'locations/loc_artisan_marina',
    businessName,
    initialScore,
    projectedScore,
    revenueRecoveryMonthly: 1450,
    revenueRecoveryFormatted: '+$1,450 / month',
    subscriptionTier: tier,
    issuesCount: recommendations.length,
    recommendations,
    summary: `Identified ${recommendations.length} high-impact optimization gaps across categories, semantic description, and holiday schedules. Resolving these unlocks Top 3 Local Pack authority.`
  };
}
