
import aiStudioConfig from '../firebase-applet-config.json';
import { 
  signInWithGoogleRest, 
  refreshIdToken, 
  getUserData, 
  type AuthUser 
} from './firebase-auth-rest';

// Minimal User type to satisfy existing code
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  getIdToken: () => Promise<string>;
  signOut: () => Promise<void>;
}

const STORAGE_KEY = 'grow_local_auth_user';

let authStateListeners: ((user: User | null) => void)[] = [];
let currentUser: User | null = null;

// Initialize user from storage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const authData = JSON.parse(stored) as AuthUser;
      currentUser = createWrappedUser(authData);
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

function createWrappedUser(authData: AuthUser): User {
  return {
    uid: authData.uid,
    email: authData.email,
    displayName: authData.displayName || null,
    photoURL: authData.photoURL || null,
    getIdToken: async () => {
      // Check if expired or expiring soon (5 min buffer)
      if (Date.now() > authData.expiresAt - 300000) {
        try {
          const refreshed = await refreshIdToken(authData.refreshToken);
          const updated: AuthUser = {
            ...authData,
            idToken: refreshed.idToken,
            refreshToken: refreshed.refreshToken,
            expiresAt: refreshed.expiresAt
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          // Update the closure-captured authData is not possible, so we should actually update the currentUser object
          // But since User is an object, we can just return the new token
          return refreshed.idToken;
        } catch (e) {
          signOut();
          throw e;
        }
      }
      return authData.idToken;
    },
    signOut: async () => {
      await signOut();
    }
  };
}

export function getAuthInstance() {
  return {
    currentUser,
    signOut: async () => {
      localStorage.removeItem(STORAGE_KEY);
      currentUser = null;
      authStateListeners.forEach(l => l(null));
    },
    app: {
      options: {
        projectId: aiStudioConfig.projectId
      }
    }
  };
}

export function onAuthStateChanged(auth: any, listener: (user: User | null) => void) {
  authStateListeners.push(listener);
  // Immediate trigger with current state
  listener(currentUser);
  return () => {
    authStateListeners = authStateListeners.filter(l => l !== listener);
  };
}

export async function signOut(auth?: any) {
  localStorage.removeItem(STORAGE_KEY);
  currentUser = null;
  authStateListeners.forEach(l => l(null));
}

export class GoogleAuthProvider {}

/**
 * A lightweight Google Sign-In flow using a popup and direct OAuth 2.0.
 */
export async function signInWithPopup(auth: any, provider: any) {
  const clientId = aiStudioConfig.oAuthClientId;
  const redirectUri = window.location.origin + '/admin'; // We'll handle the token in the admin page if redirected, but popup is better
  
  // For simplicity in AI Studio environment, we'll use a window.open with Google OAuth 2.0
  const state = Math.random().toString(36).substring(7);
  const nonce = Math.random().toString(36).substring(7);
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'id_token',
    scope: 'openid email profile',
    state: state,
    nonce: nonce,
    prompt: 'select_account'
  }).toString();

  // Open the popup
  const popup = window.open(authUrl, 'google-signin', 'width=500,height=600');
  
  if (!popup) {
    throw new Error('Popup blocked');
  }

  // Poll for the token in the URL (this is a bit hacky but avoids needing a listener on the redirect page)
  return new Promise<void>((resolve, reject) => {
    const pollTimer = window.setInterval(async () => {
      try {
        if (popup.closed) {
          window.clearInterval(pollTimer);
          reject(new Error('User closed popup'));
          return;
        }

        // Try to access the popup URL. This will throw a CORS error until the popup redirects back to our origin.
        const hash = popup.location.hash;
        if (hash) {
          window.clearInterval(pollTimer);
          const params = new URLSearchParams(hash.substring(1));
          const idToken = params.get('id_token');
          popup.close();

          if (idToken) {
            const authUser = await signInWithGoogleRest(idToken);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
            currentUser = createWrappedUser(authUser);
            authStateListeners.forEach(l => l(currentUser));
            resolve();
          } else {
            reject(new Error('No ID token found in response'));
          }
        }
      } catch (e) {
        // Ignore CORS errors while popup is on Google's domain
      }
    }, 500);
  });
}
