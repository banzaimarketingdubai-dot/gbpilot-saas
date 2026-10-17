import { NextResponse } from 'next/server';
import { runInspectionAudit } from '@/lib/inspection/auditEngine';
import { GoogleBusinessProfileClient } from '@/lib/gbp/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { locationName, accessToken, subscriptionTier = 'FREE', locationData: incomingLocationData } = body;

    let locationData: any = incomingLocationData || {};

    if (accessToken) {
      try {
        const client = new GoogleBusinessProfileClient(accessToken);
        const details = await client.getLocationDetails(locationName || '');
        locationData = { ...locationData, ...details };
      } catch (e) {
        console.warn('Using fallback location data for audit:', e);
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
