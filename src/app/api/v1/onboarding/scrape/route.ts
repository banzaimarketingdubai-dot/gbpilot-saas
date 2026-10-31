import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://gbpilot.top';
    
    try {
      const res = await fetch(`${backendUrl}/api/v1/onboarding/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_url: url })
      });
      if (res.ok) {
        const backendData = await res.json();
        const prof = backendData.profile || {};
        return NextResponse.json({
          success: true,
          extracted_data: {
            business_name: prof.business_name || prof.name || '—',
            primary_category: prof.category || prof.primary_category || '—',
            suggested_secondary_categories: prof.suggested_secondary_categories || [],
            phone_number: prof.phone || prof.phone_number || '—',
            address: prof.address || '—',
            website_url: url,
            target_keywords: prof.keywords || [],
            amenities: prof.amenities || [],
            suggested_hours: prof.suggested_hours || null
          },
          interview_questions: [
            'What is your primary revenue service or specialty?',
            'What physical landmarks or districts are you closest to?',
            'Do you offer online reservations or direct appointments?'
          ]
        });
      }
    } catch {
      // Backend unavailable, fallback to real domain extraction
    }

    let parsedBrand = '—';
    try {
      const u = new URL(url);
      const hostParts = u.hostname.replace(/^www\./, '').split('.');
      if (hostParts[0]) {
        parsedBrand = hostParts[0].charAt(0).toUpperCase() + hostParts[0].slice(1);
      }
    } catch {
      // Ignore URL parsing error
    }

    return NextResponse.json({
      success: true,
      extracted_data: {
        business_name: parsedBrand,
        primary_category: '—',
        suggested_secondary_categories: [],
        phone_number: '—',
        address: '—',
        website_url: url,
        target_keywords: [],
        amenities: [],
        suggested_hours: null
      },
      interview_questions: [
        'What is your primary revenue service or specialty?',
        'What physical landmarks or districts are you closest to?',
        'Do you offer online reservations or direct appointments?'
      ]
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to scrape website' }, { status: 500 });
  }
}
