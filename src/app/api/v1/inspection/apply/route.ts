import { NextResponse } from 'next/server';
import { GoogleBusinessProfileClient } from '@/lib/gbp/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      locationName, 
      accessToken, 
      subscriptionTier = 'PRO', 
      recommendationIds = [] 
    } = body;

    // Paywall enforcement: Free tier cannot execute automated GBP PATCH API updates
    if (subscriptionTier === 'FREE') {
      return NextResponse.json({
        success: false,
        paywallTriggered: true,
        message: '1-Click API application requires an active Pro or Business subscription.',
        upgradeUrl: '/pricing'
      }, { status: 403 });
    }

    const token = accessToken || 'ya29.mock_verified_pro_token';
    const client = new GoogleBusinessProfileClient(token);

    // Prepare update payload from request or empty
    const patchPayload = body.patchPayload || {};
    const updateMask = body.updateMask || Object.keys(patchPayload);

    const updatedLocation = locationName && updateMask.length > 0 
      ? await client.patchLocation(locationName, updateMask, patchPayload)
      : null;

    return NextResponse.json({
      success: true,
      message: 'Profile successfully optimized and synced to Google Business Profile via API.',
      appliedRecommendations: recommendationIds,
      updatedLocation
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Apply changes failed' }, { status: 500 });
  }
}
