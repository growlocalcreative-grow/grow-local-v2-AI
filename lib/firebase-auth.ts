import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import aiStudioConfig from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: aiStudioConfig.apiKey,
  authDomain: aiStudioConfig.authDomain || `${aiStudioConfig.projectId}.firebaseapp.com`,
  projectId: aiStudioConfig.projectId,
  storageBucket: aiStudioConfig.storageBucket,
  messagingSenderId: aiStudioConfig.messagingSenderId,
  appId: aiStudioConfig.appId
};

export function getFirebaseApp() {
  if (getApps().length > 0) return getApp();
  return initializeApp(firebaseConfig);
}

export function getAuthInstance() {
  const app = getFirebaseApp();
  return getAuth(app);
}

export { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut };
export type { User };
