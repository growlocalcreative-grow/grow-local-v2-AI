
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup as firebaseSignInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  type User as FirebaseUser
} from 'firebase/auth';
import aiStudioConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const firebaseConfig = {
  apiKey: aiStudioConfig.apiKey,
  authDomain: aiStudioConfig.authDomain || `${aiStudioConfig.projectId}.firebaseapp.com`,
  projectId: aiStudioConfig.projectId,
  appId: aiStudioConfig.appId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export type User = FirebaseUser;

export function getAuthInstance() {
  return auth;
}

export function onAuthStateChanged(authInstance: any, listener: (user: User | null) => void) {
  return firebaseOnAuthStateChanged(authInstance, listener);
}

export async function signOut(authInstance?: any) {
  return firebaseSignOut(authInstance || auth);
}

export { GoogleAuthProvider };

/**
 * Uses the standard Firebase SDK signInWithPopup.
 * This resolves the redirect_uri_mismatch error because the SDK handles the 
 * OAuth handshake through the authorized firebaseapp.com domain.
 */
export async function signInWithPopup(authInstance: any, provider: GoogleAuthProvider) {
  try {
    return await firebaseSignInWithPopup(authInstance, provider);
  } catch (error: any) {
    // If the user hasn't added the domain to Firebase Console yet, 
    // it will throw auth/unauthorized-domain instead of redirect_uri_mismatch.
    if (error.code === 'auth/popup-closed-by-user') {
      console.log("Login cancelled by user");
      return;
    }
    throw error;
  }
}
