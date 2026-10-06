import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { google_place_id, auth_code } = body;

    // Simulate instant Google Business Profile OAuth fetch & health score calculation
    return NextResponse.json({
      success: true,
      profile: {
        google_location_id: google_place_id || 'loc_gmb_8839201',
        business_name: 'Artisan Roast & Espresso Bar',
        primary_category: 'Coffee Shop & Bakery',
        address: '450 Grand Ave, Downtown Sector B',
        health_score: 74,
        autopilot_mode: 'MANUAL_APPROVAL',
        review_count: 342,
        average_rating: 4.9,
        missing_fields: ['Online Table Reservation URL', '3 geotagged photos this week']
      },
      audit_summary: {
        health_score: 74,
        geo_grid_baseline_rank: 3.4,
        critical_issues: [
          'Rank dropped from #2 to #5 for keyword "breakfast cafe" in Sector B',
          'Competitor "Cafe Luna" added 10 photos this week',
          'Missing "Online Reservation" CTA action button'
        ]
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to sync Google Business Profile' }, { status: 500 });
  }
}
