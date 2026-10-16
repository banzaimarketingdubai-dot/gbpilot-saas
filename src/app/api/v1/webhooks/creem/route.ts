import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('creem-signature');
    const secret = process.env.CREEM_WEBHOOK_SECRET;

    // Signature verification (HMAC SHA-256)
    if (secret && signature) {
      const computed = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (computed !== signature) {
        console.warn('[Creem Webhook] Invalid signature');
        return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
      }
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    const event = payload.event || payload.type;
    const data = payload.data || {};

    console.log(`[Creem Webhook] Received event: ${event}`, {
      customerId: data.customer_id,
      productId: data.product_id,
      metadata: data.metadata
    });

    switch (event) {
      case 'subscription.active':
      case 'subscription.paid':
      case 'checkout.completed': {
        const planId = data.metadata?.planId || 'PRO_GROWTH';
        console.log(`[Creem Webhook] Granting access for plan: ${planId}`);
        // Backend DB update logic can be plugged here
        break;
      }

      case 'subscription.canceled':
      case 'subscription.expired': {
        console.log(`[Creem Webhook] Revoking access`);
        // Backend DB downgrade logic can be plugged here
        break;
      }

      default:
        console.log(`[Creem Webhook] Unhandled event: ${event}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('[Creem Webhook Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
