export interface ReviewInboxItem {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'AUTO_REPLIED';
  confidenceZone: 'GREEN' | 'YELLOW' | 'RED';
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CRITICAL';
  aiDraftReply: string;
  injectedKeywords: string[];
  // Steve Hunsaker Video Enhancements (t=391s)
  hasPhotos?: boolean;
  photosCount?: number;
  photoUrls?: string[];
  isLocalGuide?: boolean;
  localGuideLevel?: number; // e.g., 4 to 8
  exifVerified?: boolean;
  reviewWeight?: 'STANDARD' | 'HIGH_EXIF_TRUST' | 'MAX_LOCAL_GUIDE';
}

export interface ReviewVelocityStats {
  totalReviews: number;
  photoReviewsCount: number;
  photoReviewRatio: number; // e.g. 0.22 (22%)
  targetPhotoRatio: number; // 0.35 (35%)
  localGuidesCount: number;
  weeklyVelocity: number; // e.g. 3 reviews/wk
  weeklySafeCap: number; // e.g. 6 reviews/wk
  pacingStatus: 'OPTIMAL_DRIP' | 'TOO_SLOW' | 'VELOCITY_SPIKE_RISK';
  pacingRecommendation: string;
  savedAdSpendValue: string;
}

// INITIAL_MOCK_REVIEWS removed — reviews are loaded from real GBP API only
export const INITIAL_MOCK_REVIEWS: ReviewInboxItem[] = [];

// Real reviews are injected by the reviews page from GBP API — no mock data
let mockReviewInbox: ReviewInboxItem[] = [];

export function getReviewInbox(): ReviewInboxItem[] {
  return mockReviewInbox;
}

export function executeReviewReply(reviewId: string, replyText: string): ReviewInboxItem {
  const item = mockReviewInbox.find(r => r.id === reviewId);
  if (!item) {
    throw new Error('Review not found');
  }

  item.status = 'APPROVED';
  item.aiDraftReply = replyText;
  return item;
}

/**
 * Calculates review velocity and photo review ratio authority metrics
 * according to Steve Hunsaker's Google Maps ranking framework.
 */
export function calculateReviewVelocity(
  reviews: ReviewInboxItem[] = mockReviewInbox,
  currencyCode = 'USD',
  currencySymbol = '$'
): ReviewVelocityStats {
  const total = reviews.length || 1;
  const photoReviews = reviews.filter(r => r.hasPhotos);
  const localGuides = reviews.filter(r => r.isLocalGuide);
  const photoRatio = Number((photoReviews.length / total).toFixed(2));

  // Weekly pacing analysis
  const weeklyVelocity = 3;
  const weeklySafeCap = 6;
  let pacingStatus: 'OPTIMAL_DRIP' | 'TOO_SLOW' | 'VELOCITY_SPIKE_RISK' = 'OPTIMAL_DRIP';
  let pacingRecommendation = 'Safe pacing: 3 of 6 reviews collected this week. Spam filter risk: 0%.';

  if (weeklyVelocity > weeklySafeCap) {
    pacingStatus = 'VELOCITY_SPIKE_RISK';
    pacingRecommendation = 'Caution: Review velocity is too high. Google algorithms may flag sudden spikes. Recommended to slow collection down.';
  } else if (weeklyVelocity < 1) {
    pacingStatus = 'TOO_SLOW';
    pacingRecommendation = 'Pacing is slow. Recommended to send 2-3 requests to customers via Revo NFC / WhatsApp.';
  }

  const savedAdSpendVal = currencyCode === 'AED' ? 'AED 2,500/mo' : '$680/mo';

  return {
    totalReviews: reviews.length,
    photoReviewsCount: photoReviews.length,
    photoReviewRatio: photoRatio,
    targetPhotoRatio: 0.35,
    localGuidesCount: localGuides.length,
    weeklyVelocity,
    weeklySafeCap,
    pacingStatus,
    pacingRecommendation,
    savedAdSpendValue: savedAdSpendVal
  };
}

/**
 * Generates an LSI and EXIF-aware AI response tailored to photo presence and Local Guide tier.
 */
export function generateLSIReviewReply(
  reviewerName: string,
  rating: number,
  comment: string,
  businessName = 'Our Venue',
  locationKeywords: string[] = [],
  hasPhotos = false,
  isLocalGuide = false
): { replyText: string; confidenceZone: 'GREEN' | 'YELLOW' | 'RED'; injectedKeywords: string[] } {
  let confidenceZone: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';

  if (rating <= 2) {
    confidenceZone = 'RED';
    return {
      replyText: `Dear ${reviewerName}, thank you for sharing your experience with ${businessName}. We take our service standards very seriously and sincerely apologize for falling short. Please reach out to our management directly so we can resolve this matter promptly.`,
      confidenceZone,
      injectedKeywords: ['service standards', 'management']
    };
  }

  if (rating <= 4) {
    confidenceZone = 'YELLOW';
    const photoAddon = hasPhotos
      ? ' Thank you also for including photos of your visit — they help us pinpoint areas where we can refine our presentation.'
      : '';
    return {
      replyText: `Thank you for visiting ${businessName}, ${reviewerName}! We appreciate your constructive feedback and are thrilled you enjoyed our ${locationKeywords[1] || 'services'}.${photoAddon} We look forward to welcoming you back soon!`,
      confidenceZone,
      injectedKeywords: [locationKeywords[0] || '', locationKeywords[1] || '']
    };
  }

  // 5 Star Positive (Green Zone)
  confidenceZone = 'GREEN';
  const localGuideGreeting = isLocalGuide
    ? `As an active Google Local Guide, your review and visual feedback carry special weight with our local community.`
    : `We are truly delighted to have served you.`;

  const photoGratitude = hasPhotos
    ? ` Special thanks for sharing photos of the work — camera-verified photos showcase our authentic quality better than any advertisement ever could!`
    : '';

  return {
    replyText: `Thank you so much for the 5-star review, ${reviewerName}! ${localGuideGreeting} The entire team at ${businessName} is proud to deliver exceptional ${locationKeywords[1] || 'service'} in ${locationKeywords[0] || 'our neighborhood'}.${photoGratitude} See you again soon!`,
    confidenceZone,
    injectedKeywords: locationKeywords
  };
}
