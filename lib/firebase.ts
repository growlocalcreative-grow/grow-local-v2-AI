import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  orderBy, 
  updateDoc,
  setDoc,
  getDocFromServer,
  Firestore
} from 'firebase/firestore';
import aiStudioConfig from '../firebase-applet-config.json';

// --- Configuration ---
// STRICTOR CONFIGURATION: Use JSON config as the source of truth to avoid environment variable mismatches
export const firebaseConfig = {
  apiKey: aiStudioConfig.apiKey,
  authDomain: aiStudioConfig.authDomain || `${aiStudioConfig.projectId}.firebaseapp.com`,
  projectId: aiStudioConfig.projectId,
  storageBucket: aiStudioConfig.storageBucket,
  messagingSenderId: aiStudioConfig.messagingSenderId,
  appId: aiStudioConfig.appId
};

const DATABASE_ID = aiStudioConfig.firestoreDatabaseId || "(default)";

// Lazy initialization
let db: Firestore | null = null;
let auth: Auth | null = null;

export function isFirebaseConfigured(): boolean {
  return typeof window !== 'undefined' && !!firebaseConfig.apiKey && !!firebaseConfig.projectId;
}

export function getFirebaseApp() {
  if (getApps().length > 0) return getApp();
  
  console.log(`[Firebase] Initializing App: ${firebaseConfig.projectId}`);
  console.log(`[Firebase] Auth Domain: ${firebaseConfig.authDomain}`);
  console.log(`[Firebase] API Key Prefix: ${firebaseConfig.apiKey?.substring(0, 8)}...`);
  
  return initializeApp(firebaseConfig);
}

export function getDb(): Firestore {
  if (!db) {
    const databaseId = DATABASE_ID === '(default)' ? undefined : DATABASE_ID;
    const app = getFirebaseApp();
    console.log(`[Firebase] Initializing Firestore. Project: ${firebaseConfig.projectId}, Database: ${databaseId || '(default)'}`);
    db = getFirestore(app, databaseId);
  }
  return db;
}

export function getAuthInstance(): Auth {
  if (!auth) {
    const app = getFirebaseApp();
    console.log(`[Firebase] Initializing Auth with Domain: ${firebaseConfig.authDomain}`);
    auth = getAuth(app);
  }
  return auth;
}

// --- Error Handling ---
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  let authInfo = {};
  try {
    const authInstance = getAuthInstance();
    authInfo = {
      userId: authInstance.currentUser?.uid,
      email: authInstance.currentUser?.email,
      emailVerified: authInstance.currentUser?.emailVerified,
      isAnonymous: authInstance.currentUser?.isAnonymous,
      tenantId: authInstance.currentUser?.tenantId,
    };
  } catch (e) {
    // Auth might not be initialized or keys missing
    console.warn('Auth not available for error reporting');
  }

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo,
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Connection Test ---
export async function testConnection() {
  try {
    // Attempting to read a non-existent doc just to check connectivity
    await getDocFromServer(doc(getDb(), '_connection_test_', 'test'));
    console.log('Firebase connection verified.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or internet connection.");
    }
  }
}

// --- Core Utility Functions ---

/**
 * Fetches the global site settings document (id: "global").
 */
export async function getSiteSettings() {
  const path = 'site_settings/global';
  try {
    const docRef = doc(getDb(), 'site_settings', 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Lists the active link documents ordered by display_order.
 */
export async function getLinks() {
  const path = 'links';
  try {
    const linksCol = collection(getDb(), 'links');
    const linksQuery = query(linksCol, orderBy('display_order', 'asc'));
    const querySnapshot = await getDocs(linksQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Secure update function for admins to save changes back to Firestore.
 * Works for any document path.
 */
export async function updateFirestoreDoc(collectionName: string, docId: string, data: any) {
  const path = `${collectionName}/${docId}`;
  try {
    const docRef = doc(getDb(), collectionName, docId);
    // Use setDoc with merge: true to handle cases where doc might not exist yet
    await setDoc(docRef, data, { merge: true });
    console.log(`Document ${path} successfully updated.`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
