/**
 * GBPilot Social Cross-Posting & Repurposing Engine
 * 
 * Seamlessly ingests new posts and reels from connected Instagram & TikTok accounts,
 * strips social fluff/hashtags, runs local SEO GEO adaptation via AI,
 * and formats actionable Google Business Profile Local Posts (STANDARD, OFFER, EVENT)
 * with dedicated Call-to-Action (CTA) buttons (ORDER, BOOK, LEARN_MORE, CALL).
 */

export type SocialPlatform = 'INSTAGRAM' | 'TIKTOK';

export interface SocialPostInput {
  id: string;
  platform: SocialPlatform;
  caption: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  permalink: string;
  publishedAt: string;
  authorUsername: string;
  likesCount?: number;
}

export interface BusinessContext {
  businessName: string;
  primaryCategory: string;
  city: string;
  neighborhood?: string;
  websiteUrl?: string;
  orderUrl?: string;
  reservationUrl?: string;
  phoneNumber?: string;
}

export type GbpCtaActionType = 'BOOK' | 'ORDER' | 'SHOP' | 'LEARN_MORE' | 'CALL';

export interface GbpCallToAction {
  actionType: GbpCtaActionType;
  url: string;
}

export interface GbpLocalPost {
  languageCode: string;
  summary: string;
  callToAction?: GbpCallToAction;
  media?: Array<{
    mediaFormat: 'PHOTO' | 'VIDEO';
    sourceUrl: string;
  }>;
  topicType: 'STANDARD' | 'EVENT' | 'OFFER';
}

export interface AdaptedPostResult {
  id: string;
  originalPost: SocialPostInput;
  gbpPost: GbpLocalPost;
  status: 'READY' | 'SCHEDULED' | 'PUBLISHED';
  adaptedAt: string;
  suggestedScheduleTime: string;
  modifications: string[];
  geoIntentKeywordsAdded: string[];
}

/**
 * Strips social platform noise: hashtags, "link in bio" phrases, follow begging.
 */
export function cleanSocialCaption(caption: string): string {
  if (!caption) return '';

  return caption
    // Remove hashtags like #fyp #viral #dubailife
    .replace(/#\w+/gi, '')
    // Remove typical Instagram/TikTok callouts
    .replace(/(link in bio|check (the )?bio|tap bio|link in description|comment below|save for later|double tap|share with friends)/gi, '')
    // Remove multiple consecutive empty lines
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Remove excessive trailing punctuation or spaces
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Detects local customer intent to select the highest-converting Google Maps CTA button.
 */
export function detectLocalCta(
  caption: string,
  context: BusinessContext
): GbpCallToAction {
  const text = caption.toLowerCase();

  // Booking / Reservation Intent
  const isBooking = /table|reserv|book|appointment|seat|slot|weekend table|masterclass/i.test(text);
  if (isBooking && (context.reservationUrl || context.websiteUrl)) {
    return {
      actionType: 'BOOK',
      url: context.reservationUrl || context.websiteUrl || 'https://gbpilot.top'
    };
  }

  // Delivery / Food Order / E-commerce Intent
  const isOrder = /order|deliver|takeaway|menu|dish|burger|pizza|coffee|breakfast|lunch|dinner|cocktail|dessert|taste|combo|special|revoo|talabat|deliveroo/i.test(text);
  if (isOrder && (context.orderUrl || context.websiteUrl)) {
    return {
      actionType: 'ORDER',
      url: context.orderUrl || context.websiteUrl || 'https://gbpilot.top'
    };
  }

  // Phone Call Intent
  const isCall = /call us|call to|dial|give us a call|phone/i.test(text);
  if (isCall && context.phoneNumber) {
    return {
      actionType: 'CALL',
      url: `tel:${context.phoneNumber.replace(/[^\d+]/g, '')}`
    };
  }

  // Default to Learn More
  return {
    actionType: 'LEARN_MORE',
    url: context.websiteUrl || context.orderUrl || 'https://gbpilot.top'
  };
}

/**
 * Adapts an incoming social post (Instagram / TikTok) into a high-ranking Google Maps Local Post.
 */
export function adaptSocialPostForGbp(
  post: SocialPostInput,
  context: BusinessContext
): AdaptedPostResult {
  const modifications: string[] = [];
  const geoKeywords: string[] = [];

  // 1. Clean noisy tags and platform-specific text
  const cleaned = cleanSocialCaption(post.caption);
  modifications.push('Stripped viral hashtags (#fyp, #explore, platform tags)');
  modifications.push('Removed "link in bio" and engagement-bait phrases');

  // 2. Determine Local SEO Geo Anchor
  const locationTag = context.neighborhood
    ? `${context.neighborhood}, ${context.city}`
    : context.city || 'Dubai';

  geoKeywords.push(context.businessName);
  geoKeywords.push(locationTag);
  if (context.primaryCategory) {
    geoKeywords.push(context.primaryCategory);
  }

  // 3. Synthesize Google Maps Local Post Copy
  let summary = cleaned;
  if (!summary || summary.length < 20) {
    summary = `Welcome to ${context.businessName}! Visit our location in ${locationTag} for fresh handcrafted selections, warm hospitality, and unforgettable experiences.`;
    modifications.push('Expanded short caption with local discovery anchor');
  } else {
    // Add local grounding header or footer if missing
    if (!summary.toLowerCase().includes(context.city.toLowerCase())) {
      summary = `${summary}\n\n📍 Visit us at ${context.businessName} (${locationTag}).`;
      modifications.push(`Injected local geographical anchor: "${locationTag}"`);
    }
  }

  // Enforce GBP 1500 character ceiling
  if (summary.length > 1400) {
    summary = summary.substring(0, 1390).trim() + '...';
    modifications.push('Trimmed text to fit Google Maps 1500-char update limit');
  }

  // 4. Select Action Button
  const cta = detectLocalCta(post.caption, context);
  modifications.push(`Generated high-intent Google Maps CTA: [${cta.actionType}]`);

  // 5. Build Google Business Profile Local Post Payload
  const gbpPost: GbpLocalPost = {
    languageCode: 'en',
    summary,
    callToAction: cta,
    media: [
      {
        mediaFormat: 'PHOTO',
        sourceUrl: post.mediaUrl
      }
    ],
    topicType: 'STANDARD'
  };

  // Schedule for next peak traffic window (e.g. +2 hours or 12:00 lunch rush)
  const scheduleDate = new Date(Date.now() + 2 * 60 * 60 * 1000);

  return {
    id: `adapted_${post.id}_${Date.now()}`,
    originalPost: post,
    gbpPost,
    status: 'READY',
    adaptedAt: new Date().toISOString(),
    suggestedScheduleTime: scheduleDate.toISOString(),
    modifications,
    geoIntentKeywordsAdded: geoKeywords
  };
}

/**
 * Realistic Mock Social Feed for Dubai/UAE demo and instant testing in Cockpit.
 */
export const MOCK_SOCIAL_FEED: SocialPostInput[] = [
  {
    id: 'ig_post_8921',
    platform: 'INSTAGRAM',
    caption: 'Fresh morning roast is brewing! ☕ Nothing beats a cold brew or pistachio flat white under the palm trees. Tap link in bio to check our full morning menu or order straight to your door! #coffee #dubai #coffeelover #fyp #dxblife #foodie #specialtycoffee #viral',
    mediaUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/p/C39xKa1',
    publishedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    authorUsername: 'cafe_svoi_dubai',
    likesCount: 342
  },
  {
    id: 'tt_post_4412',
    platform: 'TIKTOK',
    caption: 'POV: You found the cozy secret terrace spot in town with homemade cheesecakes and avocado sourdough tartines 🥑✨ Weekend tables are filling fast, book in advance! #fyp #foryou #dubaiweekend #dubaifood #tiktokviral #trending',
    mediaUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    mediaType: 'VIDEO',
    permalink: 'https://tiktok.com/@cafe_svoi_dubai/video/72198',
    publishedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    authorUsername: 'cafe_svoi_dubai',
    likesCount: 1280
  }
];
