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

let mockReviewInbox: ReviewInboxItem[] = [
  {
    id: 'rev_01',
    author: 'Omar K.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 5,
    comment: 'Exceptional specialty coffee and attentive service! Hands down the best breakfast cafe in the promenade area.',
    date: '4 hours ago',
    status: 'AUTO_REPLIED',
    confidenceZone: 'GREEN',
    sentiment: 'POSITIVE',
    aiDraftReply: 'Thank you so much, Omar! Our team takes immense pride in roasting fresh single-origin espresso and providing attentive service here at Marina Promenade. We look forward to welcoming you back regularly!',
    injectedKeywords: ['specialty coffee', 'breakfast cafe', 'single-origin espresso', 'Marina Promenade']
  },
  {
    id: 'rev_02',
    author: 'Elena R.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 4,
    comment: 'Loved the artisan sourdough and pour-over coffee. It was quite busy on Sunday morning, had to wait 8 minutes for a table.',
    date: '1 day ago',
    status: 'PENDING',
    confidenceZone: 'YELLOW',
    sentiment: 'NEUTRAL',
    aiDraftReply: 'Thank you for dining with us, Elena! We are thrilled you enjoyed our artisan sourdough and pour-over coffee. Sunday mornings are bustling, so we are expanding our outdoor seating to ensure faster seating. See you again soon!',
    injectedKeywords: ['artisan sourdough', 'pour-over coffee', 'outdoor seating']
  },
  {
    id: 'rev_03',
    author: 'Alex P.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 2,
    comment: 'Coffee was good but WiFi was lagging while I was trying to work on my laptop.',
    date: '2 days ago',
    status: 'PENDING',
    confidenceZone: 'RED',
    sentiment: 'CRITICAL',
    aiDraftReply: 'Hello Alex, thank you for your candid feedback. While we are glad you enjoyed the coffee, we apologize for the WiFi disruption during your work session. We have upgraded to a dedicated high-speed fiber connection this morning. Please contact us directly so we can treat you to your next brew.',
    injectedKeywords: ['dedicated high-speed fiber', 'fresh specialty brew']
  }
];

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
  businessName = 'Artisan Specialty Cafe & Roastery',
  locationKeywords = ['Marina Promenade', 'specialty coffee', 'artisan sourdough']
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
    replyText: `Thank you so much for the 5-star review, ${reviewerName}! The entire team at ${businessName} loves serving our ${locationKeywords[1] || 'specialty coffee'} and handcrafted artisan dishes to guests in ${locationKeywords[0] || 'our area'}. Can't wait to see you again soon!`,
    confidenceZone,
    injectedKeywords: locationKeywords
  };
}
