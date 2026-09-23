
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
  if (value.timestampValue !== undefined) return value.timestampValue; // Keep as ISO string from Firestore REST
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
 * Converts a plain JavaScript value into a Firestore REST API value.
 */
function toFirestoreValue(value: any): any {
  if (value === null || value === undefined) return { nullValue: null };
  
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return { integerValue: value.toString() };
    return { doubleValue: value };
  }
  if (typeof value === 'boolean') return { booleanValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(toFirestoreValue)
      }
    };
  }
  
  if (typeof value === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return {
      mapValue: {
        fields
      }
    };
  }
  
  return { nullValue: null };
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
export async function getDocument(collection: string, docId: string, cache: RequestCache = 'default') {
  if (!PROJECT_ID) {
    console.warn('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined');
    return null;
  }

  const url = getUrl(`${collection}/${docId}`);
  
  try {
    const fetchOptions: any = { cache };
    if (cache !== 'no-store') {
      fetchOptions.next = { revalidate: 3600 };
    }

    const res = await fetch(url, fetchOptions);
    
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
export async function getCollection(collection: string, cache: RequestCache = 'default') {
  if (!PROJECT_ID) {
    console.warn('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined');
    return [];
  }

  const url = getUrl(`${collection}`);

  try {
    const fetchOptions: any = { cache };
    if (cache !== 'no-store') {
      fetchOptions.next = { revalidate: 3600 };
    }

    const res = await fetch(url, fetchOptions);
    
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

/**
 * Updates a document using PATCH (equivalent to update or set with merge).
 */
export async function patchDocument(collection: string, docId: string, data: any, idToken?: string) {
  if (!PROJECT_ID) return null;

  const url = getUrl(`${collection}/${docId}`);
  const fields: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (key !== 'id') {
      fields[key] = toFirestoreValue(value);
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  }

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Firestore REST PATCH error [${res.status}]: ${errorText}`);
      throw new Error(`Firestore REST error: ${res.status}`);
    }

    const result = await res.json();
    return parseFirestoreDocument(result);
  } catch (error) {
    console.error(`Error patching document ${collection}/${docId}:`, error);
    throw error;
  }
}

/**
 * Creates a new document.
 */
export async function createDocument(collection: string, docId: string | null, data: any, idToken?: string) {
  if (!PROJECT_ID) return null;

  // If docId is provided, we use PATCH which acts as create-or-overwrite
  if (docId) {
    return patchDocument(collection, docId, data, idToken);
  }

  const url = getUrl(`${collection}`);
  const fields: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Firestore REST POST error [${res.status}]: ${errorText}`);
      throw new Error(`Firestore REST error: ${res.status}`);
    }

    const result = await res.json();
    return parseFirestoreDocument(result);
  } catch (error) {
    console.error(`Error creating document in ${collection}:`, error);
    throw error;
  }
}

/**
 * Deletes a document.
 */
export async function deleteDocument(collection: string, docId: string, idToken?: string) {
  if (!PROJECT_ID) return null;

  const url = getUrl(`${collection}/${docId}`);
  const headers: Record<string, string> = {};
  
  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  }

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Firestore REST DELETE error [${res.status}]: ${errorText}`);
      throw new Error(`Firestore REST error: ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting document ${collection}/${docId}:`, error);
    throw error;
  }
}

/**
 * Runs a structured query.
 */
export async function runQuery(collectionId: string, orderByField?: string, direction: 'ASCENDING' | 'DESCENDING' = 'ASCENDING', idToken?: string, cache: RequestCache = 'default') {
  if (!PROJECT_ID) return [];

  const url = `${BASE_URL}:runQuery${API_KEY ? `?key=${API_KEY}` : ''}`;
  
  const structuredQuery: any = {
    from: [{ collectionId }],
  };

  if (orderByField) {
    structuredQuery.orderBy = [{
      field: { fieldPath: orderByField },
      direction,
    }];
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  }

  try {
    const fetchOptions: any = {
      method: 'POST',
      headers,
      body: JSON.stringify({ structuredQuery }),
      cache
    };
    
    if (cache !== 'no-store') {
      fetchOptions.next = { revalidate: 3600 };
    }

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Firestore REST runQuery error [${res.status}]: ${errorText}`);
      throw new Error(`Firestore REST error: ${res.status}`);
    }

    const results = await res.json();
    // runQuery returns an array of { document: { ... }, readTime: "..." }
    return (results || [])
      .filter((r: any) => r.document)
      .map((r: any) => parseFirestoreDocument(r.document));
  } catch (error) {
    console.error(`Error running query on ${collectionId}:`, error);
    return [];
  }
}
