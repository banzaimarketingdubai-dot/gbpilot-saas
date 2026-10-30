import { NextResponse } from 'next/server';
import { 
  adaptSocialPostForGbp, 
  MOCK_SOCIAL_FEED, 
  SocialPostInput, 
  BusinessContext 
} from '@/lib/social/repostEngine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessName = searchParams.get('businessName') || 'Cafe Svoi';
  const city = searchParams.get('city') || 'Dubai';
  const neighborhood = searchParams.get('neighborhood') || 'Downtown Dubai';
  const orderUrl = searchParams.get('orderUrl') || 'https://svoi.gbpilot.top';
  const websiteUrl = searchParams.get('websiteUrl') || 'https://svoi.gbpilot.top';

  const context: BusinessContext = {
    businessName,
    primaryCategory: 'Coffee Shop & Bakery',
    city,
    neighborhood,
    orderUrl,
    websiteUrl,
    reservationUrl: `${websiteUrl}#book`
  };

  const adaptedFeed = MOCK_SOCIAL_FEED.map(post => adaptSocialPostForGbp(post, context));

  return NextResponse.json({
    success: true,
    totalRawPosts: MOCK_SOCIAL_FEED.length,
    adaptedPosts: adaptedFeed
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { post, context } = body as {
      post: SocialPostInput;
      context: BusinessContext;
    };

    if (!post || !context) {
      return NextResponse.json(
        { success: false, error: 'Missing required post or context payload' },
        { status: 400 }
      );
    }

    const result = adaptSocialPostForGbp(post, context);

    return NextResponse.json({
      success: true,
      adaptedPost: result
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to adapt social post' },
      { status: 500 }
    );
  }
}
