'use client';

export interface UtmContext {
  utm_source: string;
  utm_campaign: string;
  utm_medium: string;
  utm_content: string;
}

const UTM_STORAGE_KEY = 'gbpilot_utm_context';

export function captureAndGetUtm(): UtmContext {
  const empty: UtmContext = {
    utm_source: '',
    utm_campaign: '',
    utm_medium: '',
    utm_content: '',
  };
  if (typeof window === 'undefined') return empty;

  let stored: UtmContext = { ...empty };
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (raw) stored = { ...empty, ...JSON.parse(raw) };
  } catch {}

  const params = new URLSearchParams(window.location.search);
  const next: UtmContext = {
    utm_source: params.get('utm_source') || stored.utm_source || '',
    utm_campaign: params.get('utm_campaign') || stored.utm_campaign || '',
    utm_medium: params.get('utm_medium') || stored.utm_medium || '',
    utm_content: params.get('utm_content') || stored.utm_content || '',
  };

  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(next));
  } catch {}

  return next;
}

export function trackFunnelEvent(payload: {
  event_type:
    | 'outreach_visit'
    | 'live_scan'
    | 'trial_activated'
    | 'beta_modal_opened'
    | 'beta_signup'
    | 'checkout_click';
  business_name?: string;
  city?: string;
  place_id?: string;
  page_path?: string;
  email?: string;
  phone?: string;
  metadata_json?: string;
}) {
  if (typeof window === 'undefined') return;
  const utm = captureAndGetUtm();
  const body = {
    ...utm,
    page_path: payload.page_path || window.location.pathname,
    ...payload,
  };

  try {
    fetch('/api/v1/funnel/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
