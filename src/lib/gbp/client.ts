/**
 * Official Google Business Profile (GBP) API Client
 * Wraps Account Management API, Business Information API, and My Business Reviews API.
 */

export interface GBPLocation {
  name: string; // e.g. "locations/123456789" or "accounts/111/locations/222"
  title: string;
  storefrontAddress?: {
    addressLines?: string[];
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
    regionCode?: string;
  };
  categories?: {
    primaryCategory?: {
      displayName: string;
      name?: string;
    };
    additionalCategories?: Array<{
      displayName: string;
      name?: string;
    }>;
  };
  regularHours?: {
    periods?: Array<{
      openDay: string;
      openTime: string;
      closeDay: string;
      closeTime: string;
    }>;
  };
  specialHours?: {
    specialHourPeriods?: Array<{
      startDate: { year: number; month: number; day: number };
      openTime?: string;
      endDate?: { year: number; month: number; day: number };
      closeTime?: string;
      isClosed?: boolean;
    }>;
  };
  phoneNumbers?: {
    primaryPhone?: string;
    additionalPhones?: string[];
  };
  websiteUri?: string;
  profile?: {
    description?: string;
  };
  attributes?: Array<{
    attributeId: string;
    valueType?: string;
    values?: any[];
  }>;
  metadata?: {
    mapsUri?: string;
    newReviewUri?: string;
    hasVoiceOfMerchant?: boolean;
  };
  coverPhotoUrl?: string;
}

export interface GBPReview {
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
    isAnonymous?: boolean;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  updateTime?: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

const GBP_BASE_URL = 'https://mybusinessbusinessinformation.googleapis.com/v1';
const GBP_ACCOUNT_URL = 'https://mybusinessaccountmanagement.googleapis.com/v1';
const GBP_REVIEWS_URL = 'https://mybusiness.googleapis.com/v4';

export class GoogleBusinessProfileClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Fetch all business accounts accessible by the authorized token.
   */
  async listAccounts(): Promise<Array<{ name: string; accountName: string; type: string }>> {
    if (this.accessToken.startsWith('ya29.mock_')) {
      return [{ name: 'accounts/109823485721', accountName: 'Artisan Hospitality Group', type: 'PERSONAL' }];
    }

    const res = await fetch(`${GBP_ACCOUNT_URL}/accounts`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!res.ok) {
      throw new Error(`Failed to list GBP accounts: ${res.statusText}`);
    }

    const data = await res.json();
    return data.accounts || [];
  }

  /**
   * List business locations under an account.
   */
  async listLocations(accountId: string, readMask = 'name,title,storefrontAddress,categories'): Promise<GBPLocation[]> {
    if (this.accessToken.startsWith('ya29.mock_')) {
      return [
        {
          name: 'locations/loc_artisan_marina',
          title: 'Artisan Specialty Cafe & Roastery',
          storefrontAddress: {
            addressLines: ['102 Marina Promenade, Sector B'],
            locality: 'Dubai',
            regionCode: 'AE'
          },
          categories: {
            primaryCategory: { displayName: 'Specialty Coffee Shop & Roastery' }
          },
          coverPhotoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
        }
      ];
    }

    const res = await fetch(`${GBP_BASE_URL}/${accountId}/locations?readMask=${encodeURIComponent(readMask)}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!res.ok) {
      throw new Error(`Failed to list GBP locations: ${res.statusText}`);
    }

    const data = await res.json();
    return data.locations || [];
  }

  /**
   * Fetch full location details with exhaustive readMask.
   */
  async getLocationDetails(
    locationName: string,
    readMask = 'name,title,categories,storefrontAddress,regularHours,specialHours,phoneNumbers,websiteUri,profile,attributes'
  ): Promise<GBPLocation> {
    if (this.accessToken.startsWith('ya29.mock_')) {
      return {
        name: locationName,
        title: 'Artisan Specialty Cafe & Roastery',
        storefrontAddress: {
          addressLines: ['102 Marina Promenade, Sector B'],
          locality: 'Dubai',
          regionCode: 'AE'
        },
        categories: {
          primaryCategory: { displayName: 'Coffee Shop' },
          additionalCategories: [{ displayName: 'Bakery' }, { displayName: 'Espresso Bar' }]
        },
        regularHours: {
          periods: [
            { openDay: 'MONDAY', openTime: '07:30', closeDay: 'MONDAY', closeTime: '22:00' },
            { openDay: 'TUESDAY', openTime: '07:30', closeDay: 'TUESDAY', closeTime: '22:00' },
            { openDay: 'WEDNESDAY', openTime: '07:30', closeDay: 'WEDNESDAY', closeTime: '22:00' },
            { openDay: 'THURSDAY', openTime: '07:30', closeDay: 'THURSDAY', closeTime: '22:00' },
            { openDay: 'FRIDAY', openTime: '07:30', closeDay: 'FRIDAY', closeTime: '23:00' },
            { openDay: 'SATURDAY', openTime: '08:00', closeDay: 'SATURDAY', closeTime: '23:00' },
            { openDay: 'SUNDAY', openTime: '08:00', closeDay: 'SUNDAY', closeTime: '22:00' }
          ]
        },
        phoneNumbers: {
          primaryPhone: '+971 4 555 8921'
        },
        websiteUri: 'https://artisancafe-dubai.com',
        profile: {
          description: 'Local neighborhood cafe serving coffee and food.'
        },
        attributes: [
          { attributeId: 'has_outdoor_seating', values: [true] },
          { attributeId: 'has_wifi', values: [true] }
        ],
        coverPhotoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
      };
    }

    const res = await fetch(`${GBP_BASE_URL}/${locationName}?readMask=${encodeURIComponent(readMask)}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch location details: ${res.statusText}`);
    }

    return await res.json();
  }

  /**
   * Patch location attributes (1-Click Optimization & Auto-Revert).
   */
  async patchLocation(locationName: string, updateMask: string[], data: Partial<GBPLocation>): Promise<GBPLocation> {
    if (this.accessToken.startsWith('ya29.mock_')) {
      return {
        name: locationName,
        title: data.title || 'Artisan Specialty Cafe & Roastery',
        ...data
      } as GBPLocation;
    }

    const mask = updateMask.join(',');
    const res = await fetch(`${GBP_BASE_URL}/${locationName}?updateMask=${encodeURIComponent(mask)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await responseErrorText(res);
      throw new Error(`GBP PATCH error: ${err}`);
    }

    return await res.json();
  }

  /**
   * Fetch customer reviews for a location.
   */
  async listReviews(accountLocationPath: string): Promise<GBPReview[]> {
    if (this.accessToken.startsWith('ya29.mock_')) {
      return [
        {
          reviewId: 'rev_omar_1',
          reviewer: { displayName: 'Omar K.', profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
          starRating: 'FIVE',
          comment: 'Exceptional specialty coffee and cozy atmosphere! The staff was super attentive.',
          createTime: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          reviewId: 'rev_sarah_2',
          reviewer: { displayName: 'Sarah M.', profilePhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
          starRating: 'FOUR',
          comment: 'Great brunch options and delicious flat white. Parking was a bit tight on Saturday.',
          createTime: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ];
    }

    const res = await fetch(`${GBP_REVIEWS_URL}/${accountLocationPath}/reviews`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!res.ok) {
      throw new Error(`Failed to list GBP reviews: ${res.statusText}`);
    }

    const data = await res.json();
    return data.reviews || [];
  }

  /**
   * Publish a reply to a customer review.
   */
  async replyToReview(accountLocationPath: string, reviewId: string, replyText: string): Promise<{ comment: string; updateTime: string }> {
    if (this.accessToken.startsWith('ya29.mock_')) {
      return {
        comment: replyText,
        updateTime: new Date().toISOString()
      };
    }

    const res = await fetch(`${GBP_REVIEWS_URL}/${accountLocationPath}/reviews/${reviewId}/reply`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comment: replyText })
    });

    if (!res.ok) {
      const err = await responseErrorText(res);
      throw new Error(`Failed to reply to review: ${err}`);
    }

    return await res.json();
  }
}

async function responseErrorText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return res.statusText;
  }
}
