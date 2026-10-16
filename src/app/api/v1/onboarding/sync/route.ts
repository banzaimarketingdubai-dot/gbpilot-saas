import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { google_place_id, auth_code } = body;

    return NextResponse.json({
      success: true,
      profile: {
        google_location_id: google_place_id || '',
        business_name: body.business_name || '—',
        primary_category: body.primary_category || '—',
        address: body.address || '—',
        health_score: 0,
        autopilot_mode: 'OFF',
        review_count: 0,
        average_rating: 0,
        missing_fields: []
      },
      audit_summary: {
        health_score: 0,
        geo_grid_baseline_rank: 0,
        critical_issues: []
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to sync Google Business Profile' }, { status: 500 });
  }
}
