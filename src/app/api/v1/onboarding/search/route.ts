import { NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyD8r_FRNZUDeVxzPYdZP14djmLvbGPWCKc';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let query = (body.query || body.url || '').trim();

    if (!query) {
      return NextResponse.json(
        { found: false, error: 'Please enter a business name or Google Maps link' },
        { status: 400 }
      );
    }

    // 1. Resolve short Google Maps URL if pasted (maps.app.goo.gl, goo.gl/maps, etc.)
    if (query.startsWith('http://') || query.startsWith('https://')) {
      try {
        const resolvedResponse = await fetch(query, {
          method: 'HEAD',
          redirect: 'follow',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const finalUrl = resolvedResponse.url || query;
        
        // Extract place name or query parameter from resolved URL
        if (finalUrl.includes('/place/')) {
          const rawPlace = finalUrl.split('/place/')[1]?.split('/')[0]?.replace(/\+/g, ' ');
          if (rawPlace) query = decodeURIComponent(rawPlace);
        } else if (finalUrl.includes('?q=') || finalUrl.includes('&q=')) {
          const u = new URL(finalUrl);
          const qParam = u.searchParams.get('q');
          if (qParam) query = qParam;
        }
      } catch (err) {
        console.warn('[SearchRoute] Could not expand shortened Maps URL:', err);
      }
    }

    // Clean query from trailing dashes or unwanted characters
    const cleanedQuery = query.replace(/^[\s—\-]+|[\s—\-]+$/g, '').trim();
    if (!cleanedQuery) {
      return NextResponse.json({
        found: false,
        message: 'Venue not found. Please provide an exact business name or direct Google Maps link.'
      });
    }

    // 2. Query Google Places API (New) searchText
    const placesUrl = 'https://places.googleapis.com/v1/places:searchText';
    const fieldMask = [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.location',
      'places.rating',
      'places.userRatingCount',
      'places.internationalPhoneNumber',
      'places.nationalPhoneNumber',
      'places.websiteUri',
      'places.primaryTypeDisplayName',
      'places.photos',
      'places.reviews',
      'places.googleMapsUri',
      'places.regularOpeningHours',
      'places.currentOpeningHours',
      'places.businessStatus'
    ].join(',');

    const placesRes = await fetch(placesUrl, {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': fieldMask,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        textQuery: cleanedQuery
      })
    });

    if (!placesRes.ok) {
      const errText = await placesRes.text();
      console.error('[SearchRoute] Google Places API error:', placesRes.status, errText);
      return NextResponse.json({
        found: false,
        message: 'Could not find venue on Google Maps.',
        errorDetail: errText
      });
    }

    const placesData = await placesRes.json();
    const places = placesData.places || [];

    if (!places || places.length === 0) {
      return NextResponse.json({
        found: false,
        query: cleanedQuery,
        message: `Google Maps could not find a venue matching "${cleanedQuery}". Please check the spelling or paste a direct Google Maps link.`
      });
    }

    // Extract exact place details
    const place = places[0];
    const placeId = place.id;
    const displayName = place.displayName?.text || cleanedQuery;
    const formattedAddress = place.formattedAddress || '—';
    const phone = place.internationalPhoneNumber || place.nationalPhoneNumber || '—';
    const website = place.websiteUri || '';
    const rating = typeof place.rating === 'number' ? place.rating : 0;
    const reviewsCount = typeof place.userRatingCount === 'number' ? place.userRatingCount : 0;
    const category = place.primaryTypeDisplayName?.text || 'Local Business';
    const googleMapsUri = place.googleMapsUri || `https://www.google.com/maps/place/?q=place_id:${placeId}`;
    const lat = place.location?.latitude || 0;
    const lng = place.location?.longitude || 0;

    // Photos
    let coverUrl = '';
    if (place.photos && place.photos.length > 0) {
      const photoName = place.photos[0].name;
      coverUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=800&maxWidthPx=1200&key=${GOOGLE_PLACES_API_KEY}`;
    }

    // Operating Hours
    const openNow = place.currentOpeningHours?.openNow ?? null;
    const weekdayDescriptions: string[] = place.regularOpeningHours?.weekdayDescriptions || [];

    // Real Google reviews
    const reviews = (place.reviews || []).map((r: any, idx: number) => ({
      id: r.name ? r.name.split('/').pop() : `rev_${idx}`,
      author_name: r.authorAttribution?.displayName || 'Google User',
      author_photo_url: r.authorAttribution?.photoUri || '',
      rating: r.rating || 5,
      review_date: r.relativePublishTimeDescription || 'Recently',
      review_text: r.text?.text || r.originalText?.text || ''
    }));

    // City extraction heuristic
    const addressParts = formattedAddress.split(',').map((p: string) => p.trim());
    const city = addressParts.length >= 2 ? addressParts[addressParts.length - 2] : 'Dubai';

    // Calculate real initial health score
    let score = 50;
    if (formattedAddress && formattedAddress !== '—') score += 15;
    if (phone && phone !== '—') score += 10;
    if (website) score += 10;
    if (weekdayDescriptions.length > 0) score += 10;
    if (coverUrl) score += 5;
    if (rating >= 4.0) score += 10;

    const detectedBusiness = {
      id: placeId,
      name: displayName,
      address: formattedAddress,
      city: city,
      category: category,
      rating: rating,
      reviews_count: reviewsCount,
      cover_url: coverUrl,
      phone: phone,
      website_url: website,
      google_maps_url: googleMapsUri,
      latitude: lat,
      longitude: lng,
      open_now: openNow,
      opening_hours: weekdayDescriptions,
      reviews: reviews,
      health_score: Math.min(100, score),
      verified: true
    };

    return NextResponse.json({
      found: true,
      business: detectedBusiness
    });
  } catch (err: any) {
    console.error('[SearchRoute] Unexpected error:', err);
    return NextResponse.json(
      { found: false, error: err.message || 'Google Maps search error' },
      { status: 500 }
    );
  }
}
