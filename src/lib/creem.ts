/**
 * Creem.io Payments & Subscriptions Integration Helper
 * Supports isolated Test Mode (https://test-api.creem.io/v1) and Production (https://api.creem.io/v1)
 */

export interface CreemCheckoutRequest {
  productId: string;
  successUrl: string;
  cancelUrl?: string;
  customerEmail?: string;
  metadata?: Record<string, any>;
}

export interface CreemCheckoutResponse {
  id: string;
  checkout_url: string;
  product?: string;
  product_id?: string;
  status: string;
  mode?: string;
}

export interface CreemStatsSummary {
  totals: {
    totalProducts: number;
    totalSubscriptions: number;
    totalCustomers: number;
    totalRevenue: number;
    totalNetRevenue: number;
    totalPayments: number;
    activeSubscriptions: number;
    netMonthlyRecurringRevenue: number;
    monthlyRecurringRevenue: number;
  };
}

export interface CreemTransaction {
  id: string;
  mode: string;
  amount: number;
  currency: string;
  status: string;
  customer?: string;
  product?: string;
  created_at?: string;
  createdAt?: string;
}

export interface CreemSubscription {
  id: string;
  status: string;
  customer?: string;
  product?: string;
  current_period_start?: string;
  current_period_end?: string;
}

const isTestMode = process.env.CREEM_TEST_MODE !== 'false';
export const CREEM_BASE_URL = isTestMode
  ? 'https://test-api.creem.io/v1'
  : 'https://api.creem.io/v1';

function getApiKey(): string {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    throw new Error('CREEM_API_KEY is not configured in environment variables');
  }
  return apiKey;
}

export async function createCreemCheckout(req: CreemCheckoutRequest): Promise<CreemCheckoutResponse> {
  const apiKey = getApiKey();

  const payload: Record<string, any> = {
    product_id: req.productId,
    success_url: req.successUrl,
  };

  if (req.cancelUrl) {
    payload.cancel_url = req.cancelUrl;
  }

  if (req.customerEmail) {
    payload.customer = { email: req.customerEmail };
  }

  if (req.metadata) {
    payload.metadata = req.metadata;
  }

  const response = await fetch(`${CREEM_BASE_URL}/checkouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Creem API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    ...data,
    checkout_url: data.checkout_url || data.checkoutUrl,
  };
}

export async function getCreemStats(currency: string = 'USD'): Promise<CreemStatsSummary> {
  const apiKey = getApiKey();

  const response = await fetch(`${CREEM_BASE_URL}/stats/summary?currency=${encodeURIComponent(currency)}`, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Creem stats error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

export async function getCreemTransactions(limit: number = 20): Promise<{ items: CreemTransaction[]; totalRecords: number }> {
  const apiKey = getApiKey();

  const response = await fetch(`${CREEM_BASE_URL}/transactions/search?limit=${limit}`, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Creem transactions error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    items: data.items || [],
    totalRecords: data.pagination?.total_records ?? data.pagination?.totalRecords ?? (data.items?.length || 0),
  };
}

export async function getCreemSubscriptions(status?: string): Promise<{ items: CreemSubscription[]; totalRecords: number }> {
  const apiKey = getApiKey();

  const url = status
    ? `${CREEM_BASE_URL}/subscriptions/search?status=${encodeURIComponent(status)}`
    : `${CREEM_BASE_URL}/subscriptions/search`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Creem subscriptions error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    items: data.items || [],
    totalRecords: data.pagination?.total_records ?? data.pagination?.totalRecords ?? (data.items?.length || 0),
  };
}
