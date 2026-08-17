
import aiStudioConfig from '../firebase-applet-config.json';

// STRICTOR CONFIGURATION: Use JSON config as the source of truth to avoid environment variable mismatches
const PROJECT_ID = aiStudioConfig.projectId;
const API_KEY = aiStudioConfig.apiKey;
const DATABASE_ID = aiStudioConfig.firestoreDatabaseId || '(default)';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents`;

/**
 * Helper to build the Firestore REST URL with API key
 */
function getUrl(path: string) {
  const separator = path.includes('?') ? '&' : '?';
  const url = `${BASE_URL}/${path}${API_KEY ? `${separator}key=${API_KEY}` : ''}`;
  console.log(`[Firestore REST] Fetching: ${url.replace(API_KEY || '', 'REDACTED')}`);
  return url;
}

/**
 * Parses a Firestore REST API value into a plain JavaScript value.
 */
function parseFirestoreValue(value: any): any {
  if (!value) return null;
  
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return Number(value.doubleValue);
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return new Date(value.timestampValue);
  if (value.nullValue !== undefined) return null;
  
  if (value.arrayValue !== undefined) {
    return (value.arrayValue.values || []).map(parseFirestoreValue);
  }
  
  if (value.mapValue !== undefined) {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(value.mapValue.fields || {})) {
      result[k] = parseFirestoreValue(v);
    }
    return result;
  }
  
  // Reference values (projects/PROJECT_ID/databases/(default)/documents/COLLECTION/DOC_ID)
  if (value.referenceValue !== undefined) return value.referenceValue;
  
  return null;
}

/**
 * Parses a Firestore REST API document into a plain JavaScript object.
 */
function parseFirestoreDocument(doc: any) {
  if (!doc || !doc.fields) return null;
  
  const fields = doc.fields || {};
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(fields)) {
    result[key] = parseFirestoreValue(value);
  }
  
  // Extract document ID from the name property
  // Example name: "projects/PROJECT_ID/databases/(default)/documents/COLLECTION/DOC_ID"
  result.id = doc.name?.split('/').pop();
  
  return result;
}

/**
 * Fetches a single document from Firestore via REST API.
 */
export async function getDocument(collection: string, docId: string) {
  if (!PROJECT_ID) {
    console.warn('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined');
    return null;
  }

  const url = getUrl(`${collection}/${docId}`);
  
  try {
    const res = await fetch(url, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      const errorText = await res.text();
      console.error(`Firestore REST API error [${res.status}]: ${errorText} | URL: ${url.replace(API_KEY || '', 'REDACTED')}`);
      throw new Error(`Firestore REST API error: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    return parseFirestoreDocument(data);
  } catch (error) {
    console.error(`Error fetching document ${collection}/${docId}:`, error);
    return null;
  }
}

/**
 * Fetches a collection of documents from Firestore via REST API.
 */
export async function getCollection(collection: string) {
  if (!PROJECT_ID) {
    console.warn('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined');
    return [];
  }

  const url = getUrl(`${collection}`);

  try {
    const res = await fetch(url, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Firestore REST API error [${res.status}]: ${errorText} | URL: ${url.replace(API_KEY || '', 'REDACTED')}`);
      throw new Error(`Firestore REST API error: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    return (data.documents || []).map(parseFirestoreDocument);
  } catch (error) {
    console.error(`Error fetching collection ${collection}:`, error);
    return [];
  }
}
