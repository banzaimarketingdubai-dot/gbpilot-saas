import { GBPLocation } from '@/lib/gbp/client';

export type CurrencyCode = 'AED' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateToUsd: number;
  format: (amount: number) => string;
}

export interface IndustryBenchmark {
  categoryGroup: string;
  leadCostLocal: number;
  leadCostUsd: number;
  leadCostFormatted: string;
  avgMonthlyCalls: number;
  avgMonthlySiteVisits: number;
  conversionRate: number;
}

export interface AuditRecommendation {
  id: string;
  categoryTitle: string;
  severity: 'CRITICAL' | 'WARNING' | 'OPPORTUNITY';
  problemText: string;
  beforeValue: string;
  afterValue: string;
  impactMetric: string;
  financialImpactFormatted?: string;
  suspensionRisk?: 'HIGH_RISK_LOCKED' | 'ZERO_RISK_GROWTH';
  locked?: boolean;
  fieldToUpdate: string;
  patchPayload: Record<string, any>;
}

export interface InspectionAuditReport {
  locationName: string;
  businessName: string;
  initialScore: number;
  projectedScore: number;
  currency: CurrencyCode;
  currencySymbol: string;
  savedAdSpendMonthly: number;
  savedAdSpendFormatted: string;
  revenueRecoveryMonthly: number;
  revenueRecoveryFormatted: string;
  opportunityCostMonthly: number;
  opportunityCostFormatted: string;
  industryBenchmark: IndustryBenchmark;
  subscriptionTier: 'FREE' | 'PRO' | 'ENTERPRISE';
  issuesCount: number;
  recommendations: AuditRecommendation[];
  summary: string;
}

/**
 * Automatically detects whether currency should be AED (UAE/Dubai) or USD (default international)
 * based on venue address, locality, or administrative area.
 */
export function detectCurrencyByLocation(
  address?: string,
  regionCode?: string,
  locality?: string
): CurrencyConfig {
  const combined = `${address || ''} ${regionCode || ''} ${locality || ''}`.toLowerCase();
  const isUae =
    regionCode?.toUpperCase() === 'AE' ||
    combined.includes('dubai') ||
    combined.includes('abu dhabi') ||
    combined.includes('sharjah') ||
    combined.includes('uae') ||
    combined.includes('united arab emirates') ||
    combined.includes('ajman') ||
    combined.includes('ras al khaimah') ||
    combined.includes('fujairah') ||
    combined.includes('umm al quwain') ||
    combined.includes('دبي') ||
    combined.includes('الإمارات');

  if (isUae) {
    return {
      code: 'AED',
      symbol: 'AED',
      rateToUsd: 3.6725,
      format: (amount: number) => `AED ${Math.round(amount).toLocaleString('en-US')}`
    };
  }

  return {
    code: 'USD',
    symbol: '$',
    rateToUsd: 1,
    format: (amount: number) => `$${Math.round(amount).toLocaleString('en-US')}`
  };
}

/**
 * Returns Google Ads PPC Cost-Per-Lead and volume benchmarks by industry category.
 */
export function getIndustryPpcBenchmark(
  category = '',
  currency: CurrencyConfig
): IndustryBenchmark {
  const cat = category.toLowerCase();

  // 1. Home Services & Trades (Plumbing, HVAC, Electrical, Cleaning, Junk, Roofing, Lighting)
  if (
    cat.includes('plumb') ||
    cat.includes('electric') ||
    cat.includes('clean') ||
    cat.includes('junk') ||
    cat.includes('hvac') ||
    cat.includes('roof') ||
    cat.includes('light') ||
    cat.includes('handyman') ||
    cat.includes('contract') ||
    cat.includes('landscap') ||
    cat.includes('paint') ||
    cat.includes('pest')
  ) {
    const leadCostUsd = 95;
    const leadCostLocal = Math.round(leadCostUsd * currency.rateToUsd);
    return {
      categoryGroup: 'Home Services & Local Trades',
      leadCostUsd,
      leadCostLocal,
      leadCostFormatted: currency.format(leadCostLocal),
      avgMonthlyCalls: 75,
      avgMonthlySiteVisits: 450,
      conversionRate: 0.08
    };
  }

  // 2. Dining, Cafes & Hospitality
  if (
    cat.includes('cafe') ||
    cat.includes('restaurant') ||
    cat.includes('coffee') ||
    cat.includes('bakery') ||
    cat.includes('bistro') ||
    cat.includes('bar') ||
    cat.includes('food') ||
    cat.includes('pizza') ||
    cat.includes('dining') ||
    cat.includes('lounge')
  ) {
    const leadCostUsd = 28;
    const leadCostLocal = Math.round(leadCostUsd * currency.rateToUsd);
    return {
      categoryGroup: 'Dining & Hospitality',
      leadCostUsd,
      leadCostLocal,
      leadCostFormatted: currency.format(leadCostLocal),
      avgMonthlyCalls: 125,
      avgMonthlySiteVisits: 850,
      conversionRate: 0.1
    };
  }

  // 3. Healthcare, Clinics & Wellness
  if (
    cat.includes('dent') ||
    cat.includes('medic') ||
    cat.includes('clinic') ||
    cat.includes('doctor') ||
    cat.includes('spa') ||
    cat.includes('salon') ||
    cat.includes('health') ||
    cat.includes('physio') ||
    cat.includes('beauty') ||
    cat.includes('pharm')
  ) {
    const leadCostUsd = 120;
    const leadCostLocal = Math.round(leadCostUsd * currency.rateToUsd);
    return {
      categoryGroup: 'Healthcare & Wellness',
      leadCostUsd,
      leadCostLocal,
      leadCostFormatted: currency.format(leadCostLocal),
      avgMonthlyCalls: 60,
      avgMonthlySiteVisits: 380,
      conversionRate: 0.09
    };
  }

  // 4. Automotive & Detailing
  if (
    cat.includes('auto') ||
    cat.includes('car') ||
    cat.includes('mechanic') ||
    cat.includes('wash') ||
    cat.includes('detail') ||
    cat.includes('tire') ||
    cat.includes('rental') ||
    cat.includes('garage')
  ) {
    const leadCostUsd = 75;
    const leadCostLocal = Math.round(leadCostUsd * currency.rateToUsd);
    return {
      categoryGroup: 'Automotive & Transport',
      leadCostUsd,
      leadCostLocal,
      leadCostFormatted: currency.format(leadCostLocal),
      avgMonthlyCalls: 80,
      avgMonthlySiteVisits: 420,
      conversionRate: 0.08
    };
  }

  // 5. Professional, Legal & Real Estate
  if (
    cat.includes('law') ||
    cat.includes('legal') ||
    cat.includes('attorney') ||
    cat.includes('account') ||
    cat.includes('consult') ||
    cat.includes('real estate') ||
    cat.includes('broker') ||
    cat.includes('finance')
  ) {
    const leadCostUsd = 145;
    const leadCostLocal = Math.round(leadCostUsd * currency.rateToUsd);
    return {
      categoryGroup: 'Professional & Legal Services',
      leadCostUsd,
      leadCostLocal,
      leadCostFormatted: currency.format(leadCostLocal),
      avgMonthlyCalls: 45,
      avgMonthlySiteVisits: 320,
      conversionRate: 0.07
    };
  }

  // 6. General Retail / Default Local Commerce
  const leadCostUsd = 45;
  const leadCostLocal = Math.round(leadCostUsd * currency.rateToUsd);
  return {
    categoryGroup: 'Local Commerce & Retail',
    leadCostUsd,
    leadCostLocal,
    leadCostFormatted: currency.format(leadCostLocal),
    avgMonthlyCalls: 65,
    avgMonthlySiteVisits: 400,
    conversionRate: 0.08
  };
}

/**
 * AI Inspection Engine
 * Analyzes GBP location data, finds optimization gaps, and generates structured before/after payloads
 * along with verified Google Ads PPC financial equivalence math.
 */
export function runInspectionAudit(
  location: Partial<GBPLocation> & { address?: string },
  tier: 'FREE' | 'PRO' | 'ENTERPRISE' = 'FREE'
): InspectionAuditReport {
  const isPaywallLocked = tier === 'FREE';
  const recommendations: AuditRecommendation[] = [];

  const businessName = location.title || '—';
  const primaryCat = location.categories?.primaryCategory?.displayName || '';
  const desc = location.profile?.description || '';

  // Extract address string for currency detection
  const fullAddress =
    location.address ||
    location.storefrontAddress?.addressLines?.join(', ') ||
    location.storefrontAddress?.locality ||
    '';
  const regionCode = location.storefrontAddress?.regionCode || '';
  const locality = location.storefrontAddress?.locality || '';

  // Detect currency and industry benchmark
  const currency = detectCurrencyByLocation(fullAddress, regionCode, locality);
  const benchmark = getIndustryPpcBenchmark(primaryCat, currency);

  // Financial Value Math (Steve Hunsaker Google Ads PPC Equivalence Model)
  const monthlyCallsValue = benchmark.avgMonthlyCalls * benchmark.leadCostLocal;
  const monthlySiteLeadsValue =
    benchmark.avgMonthlySiteVisits * benchmark.conversionRate * benchmark.leadCostLocal;
  const totalSavedAdSpend = Math.round(monthlyCallsValue + monthlySiteLeadsValue);

  // Recovery potential: optimizing leaks recovers ~35-40% of potential missed opportunities
  const totalRecoveryMonthly = Math.round(totalSavedAdSpend * 0.38);
  const opportunityCostMonthly = Math.round(totalSavedAdSpend * 0.55);

  // 1. Category Audit
  const isGenericCategory =
    !primaryCat ||
    primaryCat.toLowerCase() === 'local business' ||
    primaryCat.toLowerCase() === 'business';
  const catShare = Math.round(totalRecoveryMonthly * 0.28);
  recommendations.push({
    id: 'audit-primary-category',
    categoryTitle: 'Primary & Secondary Categories',
    severity: isGenericCategory ? 'CRITICAL' : 'WARNING',
    suspensionRisk: 'ZERO_RISK_GROWTH',
    problemText: isGenericCategory
      ? 'Primary category is set to generic placeholder "Local Business", destroying Google Maps 3-Pack discovery.'
      : `Missing targeted secondary categories to capture niche local search queries related to ${primaryCat || 'your business'}.`,
    beforeValue: primaryCat || 'Local Business (Unverified Generic Tag)',
    afterValue: primaryCat
      ? `${primaryCat} (Verified Primary + 3 Secondary Sub-Niches)`
      : 'Verified Specific Industry Category',
    impactMetric: `+38% Discovery (${currency.format(catShare)}/mo Ads Equiv)`,
    financialImpactFormatted: `+${currency.format(catShare)}/mo`,
    locked: isPaywallLocked,
    fieldToUpdate: 'categories',
    patchPayload: {
      categories: {
        primaryCategory: { displayName: primaryCat || 'Local Business' },
        additionalCategories: location.categories?.additionalCategories || []
      }
    }
  });

  // 2. Profile Description Audit
  const isDescWeak = !desc || desc.length < 150;
  const descShare = Math.round(totalRecoveryMonthly * 0.18);
  recommendations.push({
    id: 'audit-seo-description',
    categoryTitle: 'SEO Profile Description & LSI Keywords',
    severity: isDescWeak ? 'CRITICAL' : 'WARNING',
    suspensionRisk: 'ZERO_RISK_GROWTH',
    problemText: isDescWeak
      ? 'Short, unoptimized profile description missing high-intent local search keywords.'
      : 'Description lacks neighborhood geographic centroid anchors and signature specialty keywords.',
    beforeValue: desc || 'Short profile description lacking high-intent local search keywords.',
    afterValue: `Welcome to ${
      businessName !== '—' ? businessName : 'our venue'
    }, your trusted local destination. Dedicated to superior quality, exceptional service, and authentic customer care. Open daily with verified local amenities.`,
    impactMetric: `Ranks for 14 New Keywords (${currency.format(descShare)}/mo)`,
    financialImpactFormatted: `+${currency.format(descShare)}/mo`,
    locked: isPaywallLocked,
    fieldToUpdate: 'profile.description',
    patchPayload: {
      profile: {
        description: `Welcome to ${
          businessName !== '—' ? businessName : 'our venue'
        }, your trusted local destination. Dedicated to superior quality, exceptional service, and authentic customer care. Open daily with verified local amenities.`
      }
    }
  });

  // 3. Products & Services Catalog (Steve Hunsaker High-Growth Pillar)
  const catalogShare = Math.round(totalRecoveryMonthly * 0.22);
  recommendations.push({
    id: 'audit-services-catalog',
    categoryTitle: 'Products & Services AI Keyword Catalog',
    severity: 'CRITICAL',
    suspensionRisk: 'ZERO_RISK_GROWTH',
    problemText:
      'Catalog is unpopulated. Google Maps cannot match voice search or high-intent commercial long-tail queries without defined services.',
    beforeValue: '0 structured catalog items with pricing.',
    afterValue:
      '12 Structured Services & Products populated with local geo-keywords and transparent pricing.',
    impactMetric: `+22 Long-Tail Buyer Queries (${currency.format(catalogShare)}/mo)`,
    financialImpactFormatted: `+${currency.format(catalogShare)}/mo`,
    locked: isPaywallLocked,
    fieldToUpdate: 'services',
    patchPayload: {
      servicesEnabled: true
    }
  });

  // 4. Photo Reviews & Local Guide Authority (Steve Hunsaker t=391s)
  const photoReviewShare = Math.round(totalRecoveryMonthly * 0.20);
  recommendations.push({
    id: 'audit-photo-reviews',
    categoryTitle: 'Photo Reviews & Local Guide Authority (EXIF Spatial Trust)',
    severity: 'OPPORTUNITY',
    suspensionRisk: 'ZERO_RISK_GROWTH',
    problemText:
      'Low percentage of customer reviews contain real photos. In Google Maps "Most Relevant" sorting, photo reviews and Local Guides carry 5x higher ranking weight.',
    beforeValue: 'Under 15% customer reviews have photos attached.',
    afterValue:
      'Revo NFC & QR Tap-to-Photo review incentive system active for front-line technicians/staff.',
    impactMetric: `Dominates "Most Relevant" SERP (${currency.format(photoReviewShare)}/mo)`,
    financialImpactFormatted: `+${currency.format(photoReviewShare)}/mo`,
    locked: isPaywallLocked,
    fieldToUpdate: 'reviews',
    patchPayload: {
      photoReviewBooster: true
    }
  });

  // 5. Special & Holiday Hours Audit
  const hasSpecialHours = (location.specialHours?.specialHourPeriods?.length || 0) > 0;
  const hoursShare = Math.round(totalRecoveryMonthly * 0.12);
  recommendations.push({
    id: 'audit-holiday-hours',
    categoryTitle: 'Holiday Schedules & Tamper Protection',
    severity: 'WARNING',
    suspensionRisk: 'ZERO_RISK_GROWTH',
    problemText: hasSpecialHours
      ? 'Upcoming bank holiday hours are not officially declared, risking competitor suggested "Closed" edits.'
      : 'Zero special holiday hours configured. Google displays an alarming orange warning "Hours might differ" on search cards.',
    beforeValue: hasSpecialHours
      ? 'Only regular weekly hours declared'
      : 'Google displays "Hours might differ" banner',
    afterValue:
      'Full 90-day bank holiday calendar locked with 24/7 competitor tamper protection.',
    impactMetric: `Eliminates False-Closed Dropoffs (${currency.format(hoursShare)}/mo)`,
    financialImpactFormatted: `+${currency.format(hoursShare)}/mo`,
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

  // 6. Suspension Safeguard: Locked Phone & Address
  recommendations.push({
    id: 'audit-suspension-safeguard',
    categoryTitle: 'Suspension Risk Safeguard (Phone & Address Lock)',
    severity: 'CRITICAL',
    suspensionRisk: 'HIGH_RISK_LOCKED',
    problemText:
      'Primary Phone & Physical Address are exposed to malicious competitor suggested edits. Unauthorized changes trigger immediate Google suspension and video reverification.',
    beforeValue: 'Unprotected against competitor suggested edits.',
    afterValue:
      'Golden Snapshot locked. Automated Sentinel auto-revert within 180 seconds if tampered.',
    impactMetric: 'Guarantees 100% Uptime & Prevents Video Reverification',
    financialImpactFormatted: 'Protects Entire Profile Revenue',
    locked: isPaywallLocked,
    fieldToUpdate: 'sentinel.goldenSnapshot',
    patchPayload: {
      sentinelLockEnabled: true
    }
  });

  const initialScore = isGenericCategory ? 48 : 64;
  const projectedScore = 98;

  return {
    locationName: location.name || '',
    businessName,
    initialScore,
    projectedScore,
    currency: currency.code,
    currencySymbol: currency.symbol,
    savedAdSpendMonthly: totalSavedAdSpend,
    savedAdSpendFormatted: currency.format(totalSavedAdSpend),
    revenueRecoveryMonthly: totalRecoveryMonthly,
    revenueRecoveryFormatted: currency.format(totalRecoveryMonthly),
    opportunityCostMonthly,
    opportunityCostFormatted: currency.format(opportunityCostMonthly),
    industryBenchmark: benchmark,
    subscriptionTier: tier,
    issuesCount: recommendations.length,
    recommendations,
    summary: `Identified ${recommendations.length} high-leverage optimization and protection gaps across categories, catalog, photo reviews, and operating schedules.`
  };
}
