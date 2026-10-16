import { NextResponse } from 'next/server';
import { createCreemCheckout } from '@/lib/creem';
import { PlanId, PLANS } from '@/lib/subscription';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { planId, customerEmail, userId } = body;

    if (!planId || !PLANS[planId as PlanId]) {
      return NextResponse.json({ success: false, error: 'Invalid or missing planId' }, { status: 400 });
    }

    // Determine product ID from environment or mapped constants
    let productId = '';
    if (planId === 'STARTER') {
      productId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_STARTER || process.env.CREEM_PRODUCT_STARTER || '';
    } else if (planId === 'PRO_GROWTH') {
      productId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO || process.env.CREEM_PRODUCT_PRO || 'prod_3bo51T7BdP37akU189a4H8';
    } else if (planId === 'AGENCY') {
      productId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_AGENCY || process.env.CREEM_PRODUCT_AGENCY || '';
    }

    const host = request.headers.get('origin') || request.headers.get('host') || 'http://localhost:3000';
    const baseUrl = host.startsWith('http') ? host : `https://${host}`;

    // If no Creem API Key is configured yet, use direct Creem Hosted Payment link
    if (!process.env.CREEM_API_KEY && productId) {
      return NextResponse.json({
        success: true,
        hosted: true,
        checkout_url: `https://www.creem.io/test/payment/${productId}`
      });
    }

    if (!process.env.CREEM_API_KEY || !productId) {
      return NextResponse.json({
        success: true,
        simulation: true,
        message: 'Creem API Key or Product ID not configured in .env. Falling back to local test activation.',
        checkout_url: `${baseUrl}/dashboard?payment=success&plan=${planId}&simulated=true`
      });
    }

    const session = await createCreemCheckout({
      productId,
      successUrl: `${baseUrl}/dashboard?payment=success&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/b2b?payment=cancelled`,
      customerEmail: customerEmail || undefined,
      metadata: {
        planId,
        userId: userId || 'anonymous',
        source: 'gbpilot-web'
      }
    });

    return NextResponse.json({
      success: true,
      checkout_url: session.checkout_url,
      session_id: session.id
    });
  } catch (error: any) {
    console.error('[Creem Checkout API Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create Creem checkout session' },
      { status: 500 }
    );
  }
}
