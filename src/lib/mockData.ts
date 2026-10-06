export interface Recommendation {
  id: string;
  impactBadge: '⚡ High Impact' | '🚨 Rank Alert' | '💬 Review Opportunity' | '🛠️ Profile Fix' | '🌙 Demand Spike';
  category: 'CONTENT_POST' | 'GEO_GRID_RECOVERY' | 'REVIEW_REPLY' | 'PROFILE_FIX' | 'HOURS_UPDATE';
  title: string;
  description: string;
  targetProjection: string;
  status: 'PENDING' | 'EXECUTED' | 'DISMISSED';
  actionType: string;
  actionButtonText: string;
  previewContent: {
    text?: string;
    details?: string[];
    suggestedUrl?: string;
    keywords?: string[];
  };
}

export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  address: string;
  healthScore: number;
  autopilotMode: 'OFF' | 'MANUAL_APPROVAL' | 'FULL_AUTOPILOT';
  hasExistingGBP: boolean;
  websiteUrl?: string;
  rankingKeyword: string;
  averageRank: number;
}

export interface GeoGridNode {
  id: string;
  lat: number;
  lng: number;
  row: number;
  col: number;
  rank: number;
  topCompetitor: string;
}

export interface CompetitorComparison {
  name: string;
  rating: number;
  reviewsCount: number;
  priceLevel: string;
  convenience: string[];
  specialtyKeywords: string[];
  reviewVelocityPerWeek: number;
  diffScore: string;
}

export interface ReviewItem {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  status: 'UNREPLIED' | 'REPLIED';
  aiSuggestedReply: {
    official: string;
    warm: string;
    seo: string;
  };
}

export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  id: 'gbp_loc_9921',
  name: 'Artisan Roast & Espresso Bar',
  category: 'Coffee Shop & Bakery',
  address: '450 Grand Ave, Downtown Sector B',
  healthScore: 84,
  autopilotMode: 'MANUAL_APPROVAL',
  hasExistingGBP: true,
  websiteUrl: 'https://artisanroastbar.com',
  rankingKeyword: 'breakfast cafe',
  averageRank: 2.8,
};

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec_01',
    impactBadge: '⚡ High Impact',
    category: 'CONTENT_POST',
    title: 'Competitor "Cafe Luna" added 10 photo updates',
    description: 'Counter competitor engagement surge by publishing 3 branded photos tagged with neighborhood LSI geotags.',
    targetProjection: '+18% Maps Impressions',
    status: 'PENDING',
    actionType: 'GENERATE_PHOTOS_AND_POST',
    actionButtonText: 'Publish 3 Geotagged Photos & Post',
    previewContent: {
      text: '☕ Fresh morning roasts at downtown Sector B! Pair your artisanal espresso with handmade croissants on our sunny outdoor patio. #SectorBCafe #ArtisanCoffee #OrganicBreakfast',
      keywords: ['artisanal espresso', 'downtown Sector B', 'outdoor patio cafe', 'fresh croissants'],
      suggestedUrl: 'https://artisanroastbar.com/menu'
    }
  },
  {
    id: 'rec_02',
    impactBadge: '🚨 Rank Alert',
    category: 'GEO_GRID_RECOVERY',
    title: 'Rank dropped from #2 to #5 for "breakfast cafe" in Sector B',
    description: '3 grid nodes in the North Sector dropped position. Publish targeted Google Post featuring high-conversion breakfast keywords.',
    targetProjection: 'Recover #2 Rank in Sector B',
    status: 'PENDING',
    actionType: 'PUBLISH_TARGETED_POST',
    actionButtonText: 'Publish Recovery Post',
    previewContent: {
      text: 'Searching for the best organic breakfast cafe in Sector B? Stop by Artisan Roast for handcrafted lattes, avocado sourdough toast, and gluten-free pastries!',
      keywords: ['breakfast cafe Sector B', 'organic breakfast', 'avocado sourdough toast'],
      suggestedUrl: 'https://artisanroastbar.com/breakfast-menu'
    }
  },
  {
    id: 'rec_03',
    impactBadge: '💬 Review Opportunity',
    category: 'REVIEW_REPLY',
    title: '3 new 5-star reviews highlight "dog-friendly patio"',
    description: 'Unreplied reviews detected. Send LSI-rich responses highlighting pet amenities to boost Local Pack category relevance.',
    targetProjection: '+12% Local Relevance Score',
    status: 'PENDING',
    actionType: 'SEND_AUTO_REPLIES',
    actionButtonText: 'Send 3 LSI Review Replies',
    previewContent: {
      text: 'Thank you so much for the glowing 5-star review! We love welcoming furry friends to our dog-friendly outdoor patio in Sector B. Hope to see you again soon for another fresh cold brew!',
      keywords: ['dog-friendly patio', 'Sector B coffee', 'fresh cold brew']
    }
  },
  {
    id: 'rec_04',
    impactBadge: '🛠️ Profile Fix',
    category: 'PROFILE_FIX',
    title: 'Missing "Online Table Reservation" action link',
    description: 'Competitors in your 1 km radius have active reservation buttons. Inject booking CTA link into your profile.',
    targetProjection: '+15% Conversion Rate',
    status: 'PENDING',
    actionType: 'INJECT_RESERVATION_LINK',
    actionButtonText: 'Inject Booking URL Now',
    previewContent: {
      text: 'Action Link Injection: Add https://artisanroastbar.com/reserve to Google Business Profile primary CTA slot.',
      suggestedUrl: 'https://artisanroastbar.com/reserve'
    }
  },
  {
    id: 'rec_05',
    impactBadge: '🌙 Demand Spike',
    category: 'HOURS_UPDATE',
    title: 'Weekend night demand surge detected in recent reviews',
    description: '6 reviews in past 14 days mention late night dessert demand. Extend Friday & Saturday closing hours by 1 hour.',
    targetProjection: '+25 Weekend Foot Traffic',
    status: 'PENDING',
    actionType: 'UPDATE_BUSINESS_HOURS',
    actionButtonText: 'Update Weekend Hours (+1 Hour)',
    previewContent: {
      details: [
        'Friday: 07:00 AM – 10:00 PM (+1 Hour)',
        'Saturday: 07:00 AM – 10:00 PM (+1 Hour)',
        'Sunday: 08:00 AM – 08:00 PM (Unchanged)'
      ]
    }
  }
];

export const MOCK_GEO_GRID: GeoGridNode[] = [
  { id: 'node_11', lat: 40.7128, lng: -74.0060, row: 1, col: 1, rank: 1, topCompetitor: 'Artisan Roast (You)' },
  { id: 'node_12', lat: 40.7138, lng: -74.0060, row: 1, col: 2, rank: 2, topCompetitor: 'Artisan Roast (You)' },
  { id: 'node_13', lat: 40.7148, lng: -74.0060, row: 1, col: 3, rank: 2, topCompetitor: 'Artisan Roast (You)' },
  { id: 'node_14', lat: 40.7158, lng: -74.0060, row: 1, col: 4, rank: 5, topCompetitor: 'Cafe Luna' },
  { id: 'node_15', lat: 40.7168, lng: -74.0060, row: 1, col: 5, rank: 8, topCompetitor: 'Metropolitan Roasters' },
  
  { id: 'node_21', lat: 40.7128, lng: -74.0070, row: 2, col: 1, rank: 1, topCompetitor: 'Artisan Roast (You)' },
  { id: 'node_22', lat: 40.7138, lng: -74.0070, row: 2, col: 2, rank: 1, topCompetitor: 'Artisan Roast (You)' },
  { id: 'node_23', lat: 40.7148, lng: -74.0070, row: 2, col: 3, rank: 3, topCompetitor: 'Cafe Luna' },
  { id: 'node_24', lat: 40.7158, lng: -74.0070, row: 2, col: 4, rank: 6, topCompetitor: 'Cafe Luna' },
  { id: 'node_25', lat: 40.7168, lng: -74.0070, row: 2, col: 5, rank: 11, topCompetitor: 'Metropolitan Roasters' },

  { id: 'node_31', lat: 40.7128, lng: -74.0080, row: 3, col: 1, rank: 2, topCompetitor: 'Artisan Roast (You)' },
  { id: 'node_32', lat: 40.7138, lng: -74.0080, row: 3, col: 2, rank: 2, topCompetitor: 'Artisan Roast (You)' },
  { id: 'node_33', lat: 40.7148, lng: -74.0080, row: 3, col: 3, rank: 1, topCompetitor: 'Artisan Roast (You)' },
  { id: 'node_34', lat: 40.7158, lng: -74.0080, row: 3, col: 4, rank: 4, topCompetitor: 'Cafe Luna' },
  { id: 'node_35', lat: 40.7168, lng: -74.0080, row: 3, col: 5, rank: 9, topCompetitor: 'Bean & Leaf' },

  { id: 'node_41', lat: 40.7128, lng: -74.0090, row: 4, col: 1, rank: 4, topCompetitor: 'Bean & Leaf' },
  { id: 'node_42', lat: 40.7138, lng: -74.0090, row: 4, col: 2, rank: 3, topCompetitor: 'Artisan Roast (You)' },
  { id: 'node_43', lat: 40.7148, lng: -74.0090, row: 4, col: 3, rank: 3, topCompetitor: 'Cafe Luna' },
  { id: 'node_44', lat: 40.7158, lng: -74.0090, row: 4, col: 4, rank: 7, topCompetitor: 'Cafe Luna' },
  { id: 'node_45', lat: 40.7168, lng: -74.0090, row: 4, col: 5, rank: 14, topCompetitor: 'Metropolitan Roasters' },

  { id: 'node_51', lat: 40.7128, lng: -74.0100, row: 5, col: 1, rank: 7, topCompetitor: 'Bean & Leaf' },
  { id: 'node_52', lat: 40.7138, lng: -74.0100, row: 5, col: 2, rank: 5, topCompetitor: 'Bean & Leaf' },
  { id: 'node_53', lat: 40.7148, lng: -74.0100, row: 5, col: 3, rank: 4, topCompetitor: 'Cafe Luna' },
  { id: 'node_54', lat: 40.7158, lng: -74.0100, row: 5, col: 4, rank: 10, topCompetitor: 'Metropolitan Roasters' },
  { id: 'node_55', lat: 40.7168, lng: -74.0100, row: 5, col: 5, rank: 18, topCompetitor: 'Metropolitan Roasters' },
];

export const MOCK_COMPETITORS: CompetitorComparison[] = [
  {
    name: 'Artisan Roast & Espresso (You)',
    rating: 4.9,
    reviewsCount: 342,
    priceLevel: '$$',
    convenience: ['Dog-Friendly Patio', 'Free Wi-Fi', 'Online Booking', 'Wheelchair Accessible'],
    specialtyKeywords: ['artisanal espresso', 'sourdough toast', 'pour-over', 'pastries'],
    reviewVelocityPerWeek: 6.4,
    diffScore: 'LEADER'
  },
  {
    name: 'Cafe Luna',
    rating: 4.7,
    reviewsCount: 410,
    priceLevel: '$$',
    convenience: ['Outdoor Seating', 'Drive-Thru', 'Takeout'],
    specialtyKeywords: ['breakfast sandwiches', 'cold brew', 'bagels'],
    reviewVelocityPerWeek: 8.2,
    diffScore: '-0.2 Rating'
  },
  {
    name: 'Metropolitan Roasters',
    rating: 4.4,
    reviewsCount: 195,
    priceLevel: '$$$',
    convenience: ['Online Ordering', 'Indoor Seating'],
    specialtyKeywords: ['single origin coffee', 'roastery'],
    reviewVelocityPerWeek: 2.1,
    diffScore: '-0.5 Rating'
  }
];

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 'rev_101',
    reviewerName: 'Elena Rostova',
    reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 5,
    comment: 'The best espresso bar in Sector B hands down! I brought my dog to their sunny outdoor patio and loved the oat milk latte.',
    date: '2 hours ago',
    status: 'UNREPLIED',
    aiSuggestedReply: {
      official: 'Thank you for your visit, Elena! We are proud to serve premium espresso in Sector B.',
      warm: 'Hi Elena! We loved having you and your pup on our patio! Thanks for recommending our oat milk latte!',
      seo: 'Thank you for calling us the best espresso bar in Sector B! Our dog-friendly outdoor patio cafe welcomes you anytime for another fresh oat milk latte.'
    }
  },
  {
    id: 'rev_102',
    reviewerName: 'Marcus Vance',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 5,
    comment: 'Super fast Wi-Fi, incredible avocado sourdough toast, and fantastic breakfast ambiance.',
    date: 'Yesterday',
    status: 'UNREPLIED',
    aiSuggestedReply: {
      official: 'Thank you Marcus for the review of our breakfast and Wi-Fi services.',
      warm: 'Thanks Marcus! So glad you enjoyed the sourdough toast and remote work vibes!',
      seo: 'Thank you Marcus! We strive to be the top breakfast cafe in Sector B with fresh avocado sourdough toast and high-speed Wi-Fi.'
    }
  }
];
