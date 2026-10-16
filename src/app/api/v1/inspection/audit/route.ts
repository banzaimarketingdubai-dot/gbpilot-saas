import { NextResponse } from 'next/server';
import { runInspectionAudit } from '@/lib/inspection/auditEngine';
import { GoogleBusinessProfileClient } from '@/lib/gbp/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { locationName, accessToken, subscriptionTier = 'FREE' } = body;

    let locationData = {};

    if (accessToken) {
      try {
        const client = new GoogleBusinessProfileClient(accessToken);
        locationData = await client.getLocationDetails(locationName || '');
      } catch (e) {
        console.warn('Using simulated location data for audit:', e);
      }
    }

    const report = runInspectionAudit(locationData, subscriptionTier);

    return NextResponse.json({
      success: true,
      report
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Audit failed' }, { status: 500 });
  }
}
