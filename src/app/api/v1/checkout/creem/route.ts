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

    // Determine product ID from environment or mapped live products
    let productId = '';
    if (planId === 'STARTER') {
      productId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_STARTER || process.env.CREEM_PRODUCT_STARTER || 'prod_5ByHVBJDCL2gyknzv1VqU4';
    } else if (planId === 'PRO_GROWTH') {
      productId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO || process.env.CREEM_PRODUCT_PRO || 'prod_279fuhC5FSVX9DR6MLSuU4';
    } else if (planId === 'AGENCY') {
      productId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_AGENCY || process.env.CREEM_PRODUCT_AGENCY || 'prod_1CtCL59SfGfm79Mgvtxlf4';
    }

    const host = request.headers.get('origin') || request.headers.get('host') || 'http://localhost:3000';
    const baseUrl = host.startsWith('http') ? host : `https://${host}`;

    const isTestMode = process.env.CREEM_TEST_MODE === 'true';
    const hostedCheckoutUrl = isTestMode
      ? `https://www.creem.io/test/payment/${productId}`
      : `https://www.creem.io/payment/${productId}`;

    // Attempt API checkout session creation if API key is available
    if (process.env.CREEM_API_KEY && productId) {
      try {
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

        if (session?.checkout_url) {
          return NextResponse.json({
            success: true,
            checkout_url: session.checkout_url,
            session_id: session.id
          });
        }
      } catch (apiErr: any) {
        console.warn('[Creem Checkout API Session Fallback]:', apiErr.message);
      }
    }

    // Direct Creem Hosted Payment link fallback (official live product page)
    if (productId) {
      return NextResponse.json({
        success: true,
        hosted: true,
        checkout_url: hostedCheckoutUrl
      });
    }

    return NextResponse.json({
      success: true,
      simulation: true,
      message: 'Product ID not configured. Falling back to simulated activation.',
      checkout_url: `${baseUrl}/dashboard?payment=success&plan=${planId}&simulated=true`
    });
  } catch (error: any) {
    console.error('[Creem Checkout API Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create Creem checkout session' },
      { status: 500 }
    );
  }
}
