
import aiStudioConfig from '../firebase-applet-config.json';

const API_KEY = aiStudioConfig.apiKey;
const PROJECT_ID = aiStudioConfig.projectId;
const AUTH_URL = 'https://identitytoolkit.googleapis.com/v1';
const TOKEN_URL = 'https://securetoken.googleapis.com/v1';

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  idToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp in ms
}

/**
 * Exchanges a Google ID Token for a Firebase ID Token.
 */
export async function signInWithGoogleRest(googleIdToken: string): Promise<AuthUser> {
  const url = `${AUTH_URL}/accounts:signInWithIdp?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      postBody: `id_token=${googleIdToken}&providerId=google.com`,
      requestUri: typeof window !== 'undefined' ? window.location.origin : '',
      returnIdpCredential: true,
      returnSecureToken: true
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to sign in with Google');
  }

  const data = await res.json();
  return {
    uid: data.localId,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoUrl,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + (Number(data.expiresIn) * 1000)
  };
}

/**
 * Refreshes the Firebase ID Token using the Refresh Token.
 */
export async function refreshIdToken(refreshToken: string): Promise<{ idToken: string, refreshToken: string, expiresAt: number }> {
  const url = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });

  if (!res.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await res.json();
  return {
    idToken: data.id_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + (Number(data.expires_in) * 1000)
  };
}

/**
 * Gets user data from a Firebase ID Token.
 */
export async function getUserData(idToken: string): Promise<any> {
  const url = `${AUTH_URL}/accounts:lookup?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken })
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.users?.[0] || null;
}
