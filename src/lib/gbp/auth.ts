import { encryptToken, decryptToken } from './crypto';

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  scope: string;
}

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1025915570314-u36sfq2t3h689rkcpabfen7f3o5nqh3v.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://gbpilot.top/api/v1/auth/google/callback';

export const GBP_SCOPES = [
  'https://www.googleapis.com/auth/business.manage',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
].join(' ');

/**
 * Generates the Google OAuth 2.0 Authorization URL with offline access to receive a refresh_token.
 */
export function getGoogleOAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: GBP_SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    state: state || 'gbpilot_auth_state'
  });

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchanges authorization code for access_token and refresh_token.
 */
export async function exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
  // If in local/demo environment or missing credentials, provide verified mock tokens
  if (CLIENT_ID.startsWith('mock_')) {
    return {
      accessToken: `ya29.mock_access_token_${Date.now()}`,
      refreshToken: encryptToken(`1//mock_refresh_token_${Date.now()}`),
      expiresIn: 3600,
      tokenType: 'Bearer',
      scope: GBP_SCOPES
    };
  }

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google OAuth exchange failed: ${errorBody}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: encryptToken(data.refresh_token),
    expiresIn: data.expires_in,
    tokenType: data.token_type,
    scope: data.scope
  };
}

/**
 * Refreshes an expired access_token using the encrypted refresh_token.
 */
export async function refreshAccessToken(encryptedRefreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
  const plainRefreshToken = decryptToken(encryptedRefreshToken);

  if (!plainRefreshToken) {
    throw new Error('Invalid or corrupted refresh token in vault.');
  }

  if (CLIENT_ID.startsWith('mock_')) {
    return {
      accessToken: `ya29.mock_refreshed_access_token_${Date.now()}`,
      expiresIn: 3600
    };
  }

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: plainRefreshToken,
      grant_type: 'refresh_token'
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Token refresh failed: ${err}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in
  };
}
