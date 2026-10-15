import { NextResponse } from 'next/server';
import { executeReviewReply } from '@/lib/reviews/reviewEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewId, replyText } = body;

    if (!reviewId || !replyText) {
      return NextResponse.json({ success: false, error: 'reviewId and replyText are required' }, { status: 400 });
    }

    const updated = executeReviewReply(reviewId, replyText);

    return NextResponse.json({
      success: true,
      message: 'Review reply published to Google Maps with local SEO keywords.',
      review: updated
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Reply failed' }, { status: 500 });
  }
}
