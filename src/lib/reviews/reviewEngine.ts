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
}

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

export function generateLSIReviewReply(
  reviewerName: string,
  rating: number,
  comment: string,
  businessName = 'Our Venue',
  locationKeywords: string[] = []
): { replyText: string; confidenceZone: 'GREEN' | 'YELLOW' | 'RED'; injectedKeywords: string[] } {
  let confidenceZone: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';

  if (rating <= 2) {
    confidenceZone = 'RED';
    return {
      replyText: `Dear ${reviewerName}, thank you for sharing your experience at ${businessName}. We take our hospitality and quality standards very seriously. We apologize for falling short during your visit. Please reach out to our management team directly so we can resolve this promptly and welcome you back.`,
      confidenceZone,
      injectedKeywords: ['quality standards', 'hospitality']
    };
  }

  if (rating <= 4) {
    confidenceZone = 'YELLOW';
    return {
      replyText: `Thank you for visiting ${businessName}, ${reviewerName}! We appreciate your feedback and are thrilled you enjoyed our ${locationKeywords[1] || 'menu'}. We are actively refining our services in ${locationKeywords[0] || 'our location'} and look forward to welcoming you back soon!`,
      confidenceZone,
      injectedKeywords: [locationKeywords[0] || '', locationKeywords[1] || '']
    };
  }

  // 5 Star Positive (Green Zone - Safe for Autonomous execution)
  confidenceZone = 'GREEN';
  return {
    replyText: `Thank you so much for the 5-star review, ${reviewerName}! The entire team at ${businessName} is thrilled to provide ${locationKeywords[1] || 'exceptional service and quality'} to our guests in ${locationKeywords[0] || 'our area'}. Can't wait to see you again soon!`,
    confidenceZone,
    injectedKeywords: locationKeywords
  };
}
