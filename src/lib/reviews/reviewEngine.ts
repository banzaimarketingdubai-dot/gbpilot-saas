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

export const INITIAL_MOCK_REVIEWS: ReviewInboxItem[] = [
  {
    id: 'rev_1',
    author: 'Cynthia Martinez',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    comment: 'Exceptional craftsmanship and precision! The team arrived on time, completed the installation flawlessly, and left everything spotless. Photos attached show the final setup in the evening — breathtaking!',
    date: '2 days ago',
    status: 'AUTO_REPLIED',
    confidenceZone: 'GREEN',
    sentiment: 'POSITIVE',
    aiDraftReply: 'Thank you so much Cynthia! We truly appreciate you sharing the stunning photos of our installation. Visual feedback like yours helps local neighbors see the quality standards we strive for every day.',
    injectedKeywords: ['installation', 'craftsmanship', 'quality standards'],
    hasPhotos: true,
    photosCount: 3,
    photoUrls: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80'
    ],
    isLocalGuide: true,
    localGuideLevel: 6,
    exifVerified: true,
    reviewWeight: 'MAX_LOCAL_GUIDE'
  },
  {
    id: 'rev_2',
    author: 'Pamela Sterling',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    comment: 'Top-tier service from start to finish! Tapped their NFC stand at checkout, super smooth. Highly recommend to anyone seeking genuine quality in this area.',
    date: '4 days ago',
    status: 'APPROVED',
    confidenceZone: 'GREEN',
    sentiment: 'POSITIVE',
    aiDraftReply: 'Thank you Pamela for the wonderful 5-star review! The whole team is thrilled to deliver exceptional service. Looking forward to welcoming you back soon!',
    injectedKeywords: ['service quality', 'local area'],
    hasPhotos: true,
    photosCount: 1,
    photoUrls: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80'
    ],
    isLocalGuide: true,
    localGuideLevel: 5,
    exifVerified: true,
    reviewWeight: 'HIGH_EXIF_TRUST'
  },
  {
    id: 'rev_3',
    author: 'David Henderson',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    rating: 4,
    comment: 'Great overall work and friendly technicians. Only slight delay in arrival due to morning traffic, but communication was prompt throughout.',
    date: '1 week ago',
    status: 'PENDING',
    confidenceZone: 'YELLOW',
    sentiment: 'NEUTRAL',
    aiDraftReply: 'Thank you for your candid feedback, David! We are glad you enjoyed our service and will continue refining our scheduling dispatch to minimize transit delays.',
    injectedKeywords: ['friendly technicians', 'scheduling'],
    hasPhotos: false,
    isLocalGuide: false,
    reviewWeight: 'STANDARD'
  },
  {
    id: 'rev_extortion_demo',
    author: 'Anonymous Local Guide',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    rating: 1,
    comment: 'Terrible experience, fraudulent service! To delete this negative review and protect your profile reputation, contact our team on Telegram: @reputation_fix_bot',
    date: 'Yesterday',
    status: 'PENDING',
    confidenceZone: 'RED',
    sentiment: 'CRITICAL',
    aiDraftReply: 'We have zero customer records matching your profile. Demanding Telegram contact or payment to delete negative reviews is a direct violation of Google Maps Review Extortion Policy. An expedited takedown dossier has been submitted to Google Trust & Safety.',
    injectedKeywords: ['fraud investigation', 'legal escalation'],
    hasPhotos: false,
    isLocalGuide: true,
    localGuideLevel: 7,
    reviewWeight: 'STANDARD'
  }
];

let mockReviewInbox: ReviewInboxItem[] = [...INITIAL_MOCK_REVIEWS];

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
  let pacingRecommendation = 'Безопасный темп: 3 из 6 отзывов на этой неделе. Риск спам-фильтра: 0%.';

  if (weeklyVelocity > weeklySafeCap) {
    pacingStatus = 'VELOCITY_SPIKE_RISK';
    pacingRecommendation = 'Внимание: темп слишком высок. Google может посчитать резкий всплеск накруткой. Рекомендуется замедлить сбор.';
  } else if (weeklyVelocity < 1) {
    pacingStatus = 'TOO_SLOW';
    pacingRecommendation = 'Темп замедлился. Рекомендуется отправить 2-3 запроса клиентам через Revo NFC / WhatsApp.';
  }

  const savedAdSpendVal = currencyCode === 'AED' ? 'AED 2,500/мес' : '$680/mo';

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
