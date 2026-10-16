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
  product_id: string;
  status: string;
}

const isTestMode = process.env.CREEM_TEST_MODE !== 'false';
export const CREEM_BASE_URL = isTestMode
  ? 'https://test-api.creem.io/v1'
  : 'https://api.creem.io/v1';

export async function createCreemCheckout(req: CreemCheckoutRequest): Promise<CreemCheckoutResponse> {
  const apiKey = process.env.CREEM_API_KEY;

  if (!apiKey) {
    throw new Error('CREEM_API_KEY is not configured in environment variables');
  }

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

  return await response.json();
}
