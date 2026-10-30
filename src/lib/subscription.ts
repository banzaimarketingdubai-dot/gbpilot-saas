export type PlanId = 'FREE_SCOUT' | 'SLEEP_GUARD' | 'STARTER' | 'PRO_GROWTH' | 'AGENCY';

export interface PlanDetails {
  id: PlanId;
  name: string;
  priceAed: number;
  priceUsd: number;
  locationLimit: number;
  isPro: boolean;
  features: string[];
}

export const PLANS: Record<PlanId, PlanDetails> = {
  FREE_SCOUT: {
    id: 'FREE_SCOUT',
    name: 'Free Scout',
    priceAed: 0,
    priceUsd: 0,
    locationLimit: 1,
    isPro: false,
    features: [
      'Diagnostic Health Score & Geo-Grid Heatmap',
      'Free Manual Copy-Paste Recommendations',
      '1 Free Legal Takedown Dossier',
      'Competitor Hidden Category Teaser (Top-1 Rival)',
      'Read-Only 360° Attribute Matrix'
    ]
  },
  SLEEP_GUARD: {
    id: 'SLEEP_GUARD',
    name: 'Base Monitor & Threat Alerts',
    priceAed: 39,
    priceUsd: 11,
    locationLimit: 1,
    isPro: true,
    features: [
      '1 Location Monitored 24/7',
      'Radar Geo-Grid Rank Tracking',
      'Threat & Competitor Tamper Notifications',
      'Instant WhatsApp/Email Alert on Unauthorized Edits',
      'Review Velocity & Sentiment Tracking'
    ]
  },
  STARTER: {
    id: 'STARTER',
    name: 'Base Monitor & Alerts',
    priceAed: 39,
    priceUsd: 11,
    locationLimit: 1,
    isPro: true,
    features: [
      '1 Location Connected & Monitored 24/7',
      'Radar Geo-Grid Rank Tracking & Discovery Health',
      'Threat & Competitor Tamper Detection Notifications',
      'Instant WhatsApp/Email Alerts (Phone, Hours, Status)',
      'Manual 1-Click Fix Suggestions',
      'Review Velocity & Sentiment Tracking'
    ]
  },
  PRO_GROWTH: {
    id: 'PRO_GROWTH',
    name: 'Growth & Social Repurposer',
    priceAed: 69,
    priceUsd: 19,
    locationLimit: 2,
    isPro: true,
    features: [
      'Up to 2 Locations Connected',
      'Everything in Base Monitor',
      'Instagram & TikTok Auto-Sync to Google Maps',
      'Gemini AI Caption Adaptation & Local SEO CTAs',
      'Automated Weekly Local Updates & Offer Posts',
      'Threat & Tamper Alerts with 1-Click Auto-Fix Upgrade',
      'Competitor Category Spy & Click Stealer'
    ]
  },
  AGENCY: {
    id: 'AGENCY',
    name: 'Shield Sentinel (5 Locations)',
    priceAed: 99,
    priceUsd: 27,
    locationLimit: 5,
    isPro: true,
    features: [
      'Up to 5 Locations Connected',
      'Full 24/7 Sentinel Auto-Rollback Shield (5-Min Auto-Revert)',
      'Guaranteed Immunity to Competitor Tampering & Fake Closures',
      'Instagram & TikTok Auto-Sync for all 5 venues',
      'Autonomous AI Review Replier (UAE Law 34/2021)',
      '150+ Attributes Synchronized via Approved 300 QPM API',
      'Priority WhatsApp Concierge Support'
    ]
  }
};

export interface SubscriptionState {
  planId: PlanId;
  plan: PlanDetails;
  isPro: boolean;
  isTrial: boolean;
  trialDaysLeft: number;
  locationLimit: number;
}

export function getSubscription(): SubscriptionState {
  if (typeof window === 'undefined') {
    return {
      planId: 'FREE_SCOUT',
      plan: PLANS.FREE_SCOUT,
      isPro: false,
      isTrial: false,
      trialDaysLeft: 0,
      locationLimit: 1
    };
  }

  // Check if active user is Root Superadmin
  try {
    const userStr = localStorage.getItem('gbpilot_user');
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u?.email && u.email.trim().toLowerCase() === '0451611@gmail.com') {
        return {
          planId: 'AGENCY',
          plan: {
            ...PLANS.AGENCY,
            name: '👑 Superadmin Unlimited',
            locationLimit: 999,
            isPro: true,
          },
          isPro: true,
          isTrial: false,
          trialDaysLeft: 0,
          locationLimit: 999
        };
      }
    }
  } catch (e) {}

  const savedPlanId = (localStorage.getItem('gbpilot_plan') as PlanId) || null;
  const legacyProActivated = localStorage.getItem('gbpilot_pro_activated') === 'true';
  const legacyIsPro = localStorage.getItem('gbpilot_is_pro') === 'true';
  const trialEndsAt = localStorage.getItem('gbpilot_trial_ends_at');

  let activePlanId: PlanId = 'FREE_SCOUT';

  if (savedPlanId && PLANS[savedPlanId]) {
    activePlanId = savedPlanId;
  } else if (legacyProActivated || legacyIsPro) {
    activePlanId = 'PRO_GROWTH';
  }

  let isTrial = false;
  let trialDaysLeft = 0;

  if (trialEndsAt) {
    const endMs = parseInt(trialEndsAt, 10);
    const nowMs = Date.now();
    if (endMs > nowMs) {
      isTrial = true;
      trialDaysLeft = Math.max(1, Math.ceil((endMs - nowMs) / (1000 * 60 * 60 * 24)));
    }
  }

  const plan = PLANS[activePlanId];
  const isPro = plan.isPro || isTrial;

  return {
    planId: activePlanId,
    plan,
    isPro,
    isTrial,
    trialDaysLeft,
    locationLimit: plan.locationLimit
  };
}

export function setSubscriptionPlan(planId: PlanId): SubscriptionState {
  if (typeof window === 'undefined') return getSubscription();

  const plan = PLANS[planId] || PLANS.FREE_SCOUT;
  localStorage.setItem('gbpilot_plan', plan.id);
  
  if (plan.isPro) {
    localStorage.setItem('gbpilot_pro_activated', 'true');
    localStorage.setItem('gbpilot_is_pro', 'true');
  } else {
    localStorage.removeItem('gbpilot_pro_activated');
    localStorage.removeItem('gbpilot_is_pro');
    localStorage.removeItem('gbpilot_trial_ends_at');
  }

  window.dispatchEvent(new Event('gbpilot_subscription_changed'));
  return getSubscription();
}

export function activateTrial(days: number = 14): SubscriptionState {
  if (typeof window === 'undefined') return getSubscription();

  const endsAt = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem('gbpilot_plan', 'PRO_GROWTH');
  localStorage.setItem('gbpilot_pro_activated', 'true');
  localStorage.setItem('gbpilot_is_pro', 'true');
  localStorage.setItem('gbpilot_trial_ends_at', endsAt.toString());

  window.dispatchEvent(new Event('gbpilot_subscription_changed'));
  return getSubscription();
}
