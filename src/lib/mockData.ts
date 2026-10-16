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
  id: '',
  name: '—',
  category: '—',
  address: '—',
  healthScore: 0,
  autopilotMode: 'OFF',
  hasExistingGBP: false,
  websiteUrl: '',
  rankingKeyword: '',
  averageRank: 0,
};

export const MOCK_RECOMMENDATIONS: Recommendation[] = [];

export const MOCK_GEO_GRID: GeoGridNode[] = [];

export const MOCK_COMPETITORS: CompetitorComparison[] = [];

export const MOCK_REVIEWS: ReviewItem[] = [];

