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
      'Diagnostic Health Score',
      'Free Manual Copy-Paste',
      '1 Free Legal Takedown Dossier',
      'Competitor Hidden Category Teaser (1 Rival)',
      'Community Support'
    ]
  },
  SLEEP_GUARD: {
    id: 'SLEEP_GUARD',
    name: 'Sleep Guard Mode (24/7 Shield Only)',
    priceAed: 35,
    priceUsd: 9,
    locationLimit: 1,
    isPro: false,
    features: [
      '1 Location Protected 24/7',
      '5-Min Auto-Revert of Competitor Edits',
      'Phone (NAP), Hours & Status Lock',
      'AI Posts & Campaigns Paused'
    ]
  },
  STARTER: {
    id: 'STARTER',
    name: 'Starter / Solo Spot',
    priceAed: 99,
    priceUsd: 29,
    locationLimit: 1,
    isPro: true,
    features: [
      '1 Location Connected',
      '24/7 Digital Insurance & Profile Guard',
      '1-Click Optimization Apply',
      'Competitor Category Spy (Top-1 Rival Gap)',
      'Smart Review Auto-Drafts (UAE Law 34/2021)',
      'Peak Traffic & Dynamic Hours Presets'
    ]
  },
  PRO_GROWTH: {
    id: 'PRO_GROWTH',
    name: 'Growth / Pro',
    priceAed: 249,
    priceUsd: 69,
    locationLimit: 3,
    isPro: true,
    features: [
      'Up to 3 Locations Connected',
      'Everything in Starter',
      'Competitor Category Spy™ & 1-Click Click Stealer (All Top 3 Rivals)',
      'Geo-Grid 5x5 Rank Tracking',
      'AI LLM Share-of-Voice (ChatGPT / Gemini)',
      'Unlimited Review Takedown™ Dossiers',
      'Ramadan & Summer Mode Automations'
    ]
  },
  AGENCY: {
    id: 'AGENCY',
    name: 'Agency / Chain',
    priceAed: 749,
    priceUsd: 199,
    locationLimit: 10,
    isPro: true,
    features: [
      'Up to 10 Locations Connected',
      'Everything in Growth / Pro',
      'Bulk Multi-Location Category Espionage Matrix',
      'White-Label PDF & WhatsApp Audit Reports',
      'Multi-Account Fast Switcher',
      'Dedicated Dubai SEO Strategist via WhatsApp'
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
