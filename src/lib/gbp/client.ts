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
      return [];
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
      return [];
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
        title: '—',
        storefrontAddress: {
          addressLines: ['—'],
          locality: '—',
          regionCode: '—'
        },
        categories: {
          primaryCategory: { displayName: '—' }
        }
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
        title: data.title || '—',
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
      return [];
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
