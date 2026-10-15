import { NextResponse } from 'next/server';
import { getReviewInbox } from '@/lib/reviews/reviewEngine';

export async function GET() {
  const reviews = getReviewInbox();
  return NextResponse.json({
    success: true,
    totalReviews: reviews.length,
    pendingApprovalCount: reviews.filter(r => r.status === 'PENDING').length,
    reviews
  });
}
